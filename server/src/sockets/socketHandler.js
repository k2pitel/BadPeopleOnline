const Room = require('../models/Room');
const QuestionPack = require('../models/QuestionPack');

const socketHandler = (io) => {
  // Store active connections
  const rooms = new Map(); // roomCode -> { players: Map(socketId -> playerData) }

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a room
    socket.on('join-room', async ({ roomCode, user }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() });
        
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.currentPlayers >= room.maxPlayers) {
          socket.emit('error', { message: 'Room is full' });
          return;
        }

        if (room.status !== 'waiting') {
          socket.emit('error', { message: 'Game already in progress' });
          return;
        }

        // Add player to room
        const existingPlayer = room.players.find(p => 
          p.userId?.toString() === user.id || p.username === user.username
        );

        if (!existingPlayer) {
          room.players.push({
            userId: user.id,
            username: user.username,
            displayName: user.displayName,
            score: 0,
            isConnected: true
          });
          room.currentPlayers += 1;
          await room.save();
        } else {
          existingPlayer.isConnected = true;
          await room.save();
        }

        // Join socket room
        socket.join(roomCode);
        socket.currentRoom = roomCode;
        socket.userId = user.id || user.username;

        // Initialize room in memory if needed
        if (!rooms.has(roomCode)) {
          rooms.set(roomCode, { players: new Map() });
        }

        rooms.get(roomCode).players.set(socket.id, {
          userId: user.id || user.username,
          username: user.username,
          displayName: user.displayName
        });

        // Notify all players
        io.to(roomCode).emit('player-joined', {
          player: {
            username: user.username,
            displayName: user.displayName,
            score: existingPlayer?.score || 0
          },
          room: {
            code: room.code,
            name: room.name,
            currentPlayers: room.currentPlayers,
            maxPlayers: room.maxPlayers,
            status: room.status,
            players: room.players.filter(p => p.isConnected)
          }
        });

        socket.emit('room-joined', {
          room: {
            code: room.code,
            name: room.name,
            currentPlayers: room.currentPlayers,
            maxPlayers: room.maxPlayers,
            status: room.status,
            isHost: room.host.toString() === user.id,
            players: room.players.filter(p => p.isConnected)
          }
        });

      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Start game (host only)
    socket.on('start-game', async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() })
          .populate('questionPack');

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.host.toString() !== socket.userId) {
          socket.emit('error', { message: 'Only host can start the game' });
          return;
        }

        if (room.currentPlayers < 3) {
          socket.emit('error', { message: 'Need at least 3 players to start' });
          return;
        }

        room.status = 'playing';
        room.currentQuestionIndex = 0;
        await room.save();

        // Get first question
        const question = room.questionPack?.questions[0] || { 
          text: 'Who is most likely to become famous?' 
        };

        io.to(roomCode).emit('game-started', {
          status: 'playing',
          currentRound: 1,
          totalRounds: room.totalRounds,
          question: question.text,
          players: room.players.filter(p => p.isConnected)
        });

      } catch (error) {
        console.error('Start game error:', error);
        socket.emit('error', { message: 'Failed to start game' });
      }
    });

    // Submit vote
    socket.on('submit-vote', async ({ roomCode, targetUserId }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() })
          .populate('questionPack');

        if (!room || room.status !== 'playing') {
          socket.emit('error', { message: 'Invalid room or game not in progress' });
          return;
        }

        const currentRound = room.currentQuestionIndex;
        const questionId = room.questionPack?.questions[currentRound]?._id || `default-${currentRound}`;

        // Find or create vote record for this round
        let voteRecord = room.votes.find(v => v.round === currentRound);
        if (!voteRecord) {
          voteRecord = {
            questionId: questionId.toString(),
            round: currentRound,
            votes: []
          };
          room.votes.push(voteRecord);
        }

        // Record vote
        const existingVoteIndex = voteRecord.votes.findIndex(v => 
          v.voterId.toString() === socket.userId
        );

        if (existingVoteIndex >= 0) {
          voteRecord.votes[existingVoteIndex] = {
            voterId: socket.userId,
            targetId: targetUserId,
            timestamp: new Date()
          };
        } else {
          voteRecord.votes.push({
            voterId: socket.userId,
            targetId: targetUserId,
            timestamp: new Date()
          });
        }

        await room.save();

        // Check if all players have voted
        const activePlayers = room.players.filter(p => p.isConnected).length;
        const votesCount = voteRecord.votes.length;

        io.to(roomCode).emit('vote-update', {
          votesReceived: votesCount,
          totalPlayers: activePlayers
        });

        if (votesCount >= activePlayers) {
          // Calculate scores
          const voteCounts = {};
          voteRecord.votes.forEach(vote => {
            const targetId = vote.targetId.toString();
            voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
          });

          // Update player scores
          room.players.forEach(player => {
            const playerId = (player.userId || player.username).toString();
            if (voteCounts[playerId]) {
              player.score += voteCounts[playerId];
            }
          });

          await room.save();

          io.to(roomCode).emit('round-results', {
            votes: voteCounts,
            players: room.players.map(p => ({
              userId: p.userId,
              username: p.username,
              displayName: p.displayName,
              score: p.score,
              votesReceived: voteCounts[p.userId?.toString() || p.username] || 0
            }))
          });
        }

      } catch (error) {
        console.error('Submit vote error:', error);
        socket.emit('error', { message: 'Failed to submit vote' });
      }
    });

    // Next round (host only)
    socket.on('next-round', async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() })
          .populate('questionPack');

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.host.toString() !== socket.userId) {
          socket.emit('error', { message: 'Only host can advance rounds' });
          return;
        }

        room.currentQuestionIndex += 1;

        if (room.currentQuestionIndex >= room.totalRounds) {
          // Game over
          room.status = 'finished';
          await room.save();

          const sortedPlayers = room.players
            .sort((a, b) => b.score - a.score)
            .map(p => ({
              username: p.username,
              displayName: p.displayName,
              score: p.score
            }));

          io.to(roomCode).emit('game-over', {
            players: sortedPlayers,
            winner: sortedPlayers[0]
          });
        } else {
          // Next question
          await room.save();
          
          const question = room.questionPack?.questions[room.currentQuestionIndex] || {
            text: `Question ${room.currentQuestionIndex + 1}`
          };

          io.to(roomCode).emit('next-question', {
            round: room.currentQuestionIndex + 1,
            totalRounds: room.totalRounds,
            question: question.text,
            players: room.players.map(p => ({
              username: p.username,
              displayName: p.displayName,
              score: p.score
            }))
          });
        }

      } catch (error) {
        console.error('Next round error:', error);
        socket.emit('error', { message: 'Failed to advance to next round' });
      }
    });

    // Leave room
    socket.on('leave-room', async ({ roomCode }) => {
      await handlePlayerLeave(socket, roomCode);
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      if (socket.currentRoom) {
        await handlePlayerLeave(socket, socket.currentRoom);
      }
    });

    // Helper function to handle player leaving
    async function handlePlayerLeave(socket, roomCode) {
      try {
        const room = await Room.findOne({ code: roomCode.toUpperCase() });
        
        if (room && rooms.has(roomCode)) {
          const roomData = rooms.get(roomCode);
          const playerData = roomData.players.get(socket.id);
          
          if (playerData) {
            // Mark player as disconnected
            const player = room.players.find(p => 
              (p.userId?.toString() === playerData.userId) || 
              (p.username === playerData.username)
            );
            
            if (player) {
              player.isConnected = false;
              room.currentPlayers = room.players.filter(p => p.isConnected).length;
              await room.save();
            }

            roomData.players.delete(socket.id);
            
            io.to(roomCode).emit('player-left', {
              username: playerData.username,
              currentPlayers: room.currentPlayers
            });

            // Delete room from memory if empty
            if (roomData.players.size === 0) {
              rooms.delete(roomCode);
            }
          }
        }
        
        socket.leave(roomCode);
      } catch (error) {
        console.error('Leave room error:', error);
      }
    }
  });
};

module.exports = socketHandler;

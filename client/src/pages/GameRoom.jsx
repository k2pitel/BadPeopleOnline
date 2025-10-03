import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { roomsAPI } from '../services/api';
import './GameRoom.css';

function GameRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState({
    status: 'waiting',
    currentRound: 0,
    totalRounds: 10,
    question: '',
    players: [],
  });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votesReceived, setVotesReceived] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadRoom();
  }, [user, roomCode, navigate]);

  useEffect(() => {
    if (!user || !socket.connected) return;

    // Join room via socket
    socket.joinRoom(roomCode, user);

    // Socket event listeners
    socket.on('room-joined', handleRoomJoined);
    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-started', handleGameStarted);
    socket.on('next-question', handleNextQuestion);
    socket.on('vote-update', handleVoteUpdate);
    socket.on('round-results', handleRoundResults);
    socket.on('game-over', handleGameOver);
    socket.on('error', handleError);

    return () => {
      socket.off('room-joined', handleRoomJoined);
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-started', handleGameStarted);
      socket.off('next-question', handleNextQuestion);
      socket.off('vote-update', handleVoteUpdate);
      socket.off('round-results', handleRoundResults);
      socket.off('game-over', handleGameOver);
      socket.off('error', handleError);
      socket.leaveRoom(roomCode);
    };
  }, [user, socket.connected, roomCode]);

  const loadRoom = async () => {
    try {
      const response = await roomsAPI.getByCode(roomCode);
      setRoom(response.data);
      setIsHost(response.data.host._id === user?.id);
      
      if (response.data.status === 'playing') {
        // Room is already playing, load current state
        setGameState({
          status: 'playing',
          players: response.data.players,
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Room not found');
    }
  };

  const handleRoomJoined = (data) => {
    setRoom(data.room);
    setIsHost(data.room.isHost);
    setGameState(prev => ({
      ...prev,
      players: data.room.players,
    }));
  };

  const handlePlayerJoined = (data) => {
    setRoom(data.room);
    setGameState(prev => ({
      ...prev,
      players: data.room.players,
    }));
  };

  const handlePlayerLeft = (data) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(p => p.username !== data.username),
    }));
  };

  const handleGameStarted = (data) => {
    setGameState({
      status: 'playing',
      currentRound: data.currentRound,
      totalRounds: data.totalRounds,
      question: data.question,
      players: data.players,
    });
    setHasVoted(false);
    setSelectedPlayer(null);
    setResults(null);
  };

  const handleNextQuestion = (data) => {
    setGameState({
      status: 'playing',
      currentRound: data.round,
      totalRounds: data.totalRounds,
      question: data.question,
      players: data.players,
    });
    setHasVoted(false);
    setSelectedPlayer(null);
    setResults(null);
    setVotesReceived(0);
  };

  const handleVoteUpdate = (data) => {
    setVotesReceived(data.votesReceived);
  };

  const handleRoundResults = (data) => {
    setResults(data);
    setGameState(prev => ({
      ...prev,
      players: data.players,
    }));
  };

  const handleGameOver = (data) => {
    setGameState(prev => ({
      ...prev,
      status: 'finished',
    }));
    setResults(data);
  };

  const handleError = (error) => {
    setError(error.message);
  };

  const startGame = () => {
    if (!isHost) return;
    socket.startGame(roomCode);
  };

  const submitVote = (targetPlayer) => {
    if (hasVoted || !targetPlayer) return;
    
    const targetUserId = targetPlayer.userId || targetPlayer.username;
    socket.submitVote(roomCode, targetUserId);
    setHasVoted(true);
  };

  const nextRound = () => {
    if (!isHost) return;
    socket.nextRound(roomCode);
  };

  const leaveRoom = () => {
    socket.leaveRoom(roomCode);
    navigate('/');
  };

  if (error) {
    return (
      <div className="game-room-container">
        <div className="error-card">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="game-room-container">
        <div className="loading">Loading room...</div>
      </div>
    );
  }

  return (
    <div className="game-room-container">
      <div className="game-room-content">
        {/* Header */}
        <div className="game-header">
          <div className="room-info-header">
            <h2>{room.name}</h2>
            <span className="room-code-display">Code: {roomCode}</span>
          </div>
          <button onClick={leaveRoom} className="btn btn-danger btn-sm">
            Leave Room
          </button>
        </div>

        {/* Waiting Room */}
        {gameState.status === 'waiting' && (
          <div className="waiting-room">
            <h3>Waiting for players...</h3>
            <p className="player-count">{gameState.players.length} / {room.maxPlayers} players</p>
            
            <div className="players-list">
              {gameState.players.map((player, idx) => (
                <div key={idx} className="player-item">
                  <span className="player-name">{player.displayName || player.username}</span>
                  {room.host?._id === player.userId && <span className="host-badge">Host</span>}
                </div>
              ))}
            </div>

            {isHost && gameState.players.length >= 3 && (
              <button onClick={startGame} className="btn btn-success btn-large mt-3">
                Start Game
              </button>
            )}

            {!isHost && (
              <p className="waiting-text">Waiting for host to start the game...</p>
            )}
          </div>
        )}

        {/* Playing */}
        {gameState.status === 'playing' && !results && (
          <div className="playing-room">
            <div className="round-info">
              <span className="round-number">Round {gameState.currentRound} / {gameState.totalRounds}</span>
            </div>

            <div className="question-card">
              <h2 className="question-text">{gameState.question}</h2>
            </div>

            {!hasVoted ? (
              <div className="voting-section">
                <h3>Select a player:</h3>
                <div className="players-grid">
                  {gameState.players
                    .filter(p => (p.userId || p.username) !== (user.id || user.username))
                    .map((player, idx) => (
                      <div
                        key={idx}
                        className={`player-card ${selectedPlayer === player ? 'selected' : ''}`}
                        onClick={() => setSelectedPlayer(player)}
                      >
                        <div className="player-avatar">{(player.displayName || player.username)[0].toUpperCase()}</div>
                        <span className="player-name">{player.displayName || player.username}</span>
                        <span className="player-score">{player.score} pts</span>
                      </div>
                    ))}
                </div>
                <button
                  onClick={() => submitVote(selectedPlayer)}
                  disabled={!selectedPlayer}
                  className="btn btn-primary btn-large mt-3"
                >
                  Submit Vote
                </button>
              </div>
            ) : (
              <div className="waiting-votes">
                <p>Waiting for other players to vote...</p>
                <p className="vote-count">{votesReceived} / {gameState.players.length} votes received</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results && gameState.status === 'playing' && (
          <div className="results-room">
            <h2>Round Results</h2>
            <div className="results-list">
              {results.players
                .sort((a, b) => b.score - a.score)
                .map((player, idx) => (
                  <div key={idx} className="result-item">
                    <span className="rank">#{idx + 1}</span>
                    <span className="player-name">{player.displayName || player.username}</span>
                    <span className="votes-badge">+{player.votesReceived} votes</span>
                    <span className="score">{player.score} pts</span>
                  </div>
                ))}
            </div>
            {isHost && (
              <button onClick={nextRound} className="btn btn-primary btn-large mt-3">
                Next Round
              </button>
            )}
          </div>
        )}

        {/* Game Over */}
        {gameState.status === 'finished' && results && (
          <div className="game-over-room">
            <h1>🎉 Game Over!</h1>
            <div className="winner-card">
              <h2>Winner: {results.winner.displayName || results.winner.username}</h2>
              <p className="winner-score">{results.winner.score} points</p>
            </div>

            <h3>Final Scores</h3>
            <div className="final-scores">
              {results.players.map((player, idx) => (
                <div key={idx} className="score-item">
                  <span className="rank">#{idx + 1}</span>
                  <span className="player-name">{player.displayName || player.username}</span>
                  <span className="score">{player.score} pts</span>
                </div>
              ))}
            </div>

            <button onClick={() => navigate('/')} className="btn btn-primary btn-large mt-3">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameRoom;

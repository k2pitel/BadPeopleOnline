import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socket';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  const on = useCallback((event, callback) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event, callback) => {
    socketService.off(event, callback);
  }, []);

  const emit = useCallback((event, data) => {
    socketService.emit(event, data);
  }, []);

  return {
    connected,
    on,
    off,
    emit,
    joinRoom: socketService.joinRoom.bind(socketService),
    leaveRoom: socketService.leaveRoom.bind(socketService),
    startGame: socketService.startGame.bind(socketService),
    submitVote: socketService.submitVote.bind(socketService),
    nextRound: socketService.nextRound.bind(socketService),
  };
};

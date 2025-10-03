import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { roomsAPI } from '../services/api';
import './Lobby.css';

function Lobby() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadRooms = async () => {
    try {
      const response = await roomsAPI.getAll();
      setRooms(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = (code) => {
    navigate(`/room/${code}`);
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <header className="lobby-header">
          <h1>Public Lobbies</h1>
          <p>Join a game or create your own</p>
        </header>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No public rooms available</p>
            <Link to="/create-room" className="btn btn-primary mt-2">
              Create a Room
            </Link>
          </div>
        ) : (
          <div className="rooms-grid">
            {rooms.map((room) => (
              <div key={room._id} className="room-card">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className="room-code">{room.code}</span>
                </div>
                <div className="room-info">
                  <div className="info-item">
                    <span className="label">Players:</span>
                    <span className="value">{room.currentPlayers}/{room.maxPlayers}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Host:</span>
                    <span className="value">{room.host?.displayName || room.host?.username}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className={`badge ${room.status}`}>{room.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.code)}
                  className="btn btn-primary"
                  disabled={room.currentPlayers >= room.maxPlayers}
                >
                  {room.currentPlayers >= room.maxPlayers ? 'Full' : 'Join Room'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="lobby-actions">
          <Link to="/create-room" className="btn btn-secondary">
            Create Your Own Room
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Lobby;

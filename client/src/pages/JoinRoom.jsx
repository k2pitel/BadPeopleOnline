import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './JoinRoom.css';

function JoinRoom() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (roomCode.trim().length < 6) {
      setError('Please enter a valid room code');
      return;
    }

    navigate(`/room/${roomCode.trim().toUpperCase()}`);
  };

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <h2>Join a Room</h2>
        <p className="subtitle">Enter the room code to join a game</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="input code-input"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Enter room code"
              maxLength={10}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Join Room
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <Link to="/lobby" className="btn btn-outline">
          Browse Public Lobbies
        </Link>
      </div>
    </div>
  );
}

export default JoinRoom;

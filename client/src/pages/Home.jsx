import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Home.css';

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <h1 className="home-title">Bad People Online</h1>
          <p className="home-subtitle">Find out what your friends really think about you</p>
        </header>

        <div className="home-actions">
          {user ? (
            <>
              <p className="welcome-text">Welcome, {user.displayName || user.username}!</p>
              <div className="button-group">
                <Link to="/create-room" className="btn btn-primary btn-large">
                  Create Room
                </Link>
                <Link to="/join" className="btn btn-secondary btn-large">
                  Join Room
                </Link>
                <Link to="/lobby" className="btn btn-outline btn-large">
                  Browse Lobbies
                </Link>
              </div>
              <button onClick={logout} className="btn btn-outline mt-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="button-group">
                <Link to="/login" className="btn btn-primary btn-large">
                  Login / Register
                </Link>
                <Link to="/join" className="btn btn-secondary btn-large">
                  Play as Guest
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="features-section mt-4">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🎮</span>
              <h3>Multiplayer Fun</h3>
              <p>Play with 3-12 friends online</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🗳️</span>
              <h3>Voting Rounds</h3>
              <p>Answer hilarious questions about each other</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Score Tracking</h3>
              <p>See who really knows the group best</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <h3>Mobile Friendly</h3>
              <p>Play on any device, anywhere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

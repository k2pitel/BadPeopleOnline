import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roomsAPI, questionsAPI } from '../services/api';
import './CreateRoom.css';

function CreateRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questionPacks, setQuestionPacks] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    isPublic: true,
    maxPlayers: 8,
    questionPackId: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadQuestionPacks = async () => {
      try {
        const response = await questionsAPI.getAll();
        setQuestionPacks(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, questionPackId: response.data[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load question packs:', err);
      }
    };

    loadQuestionPacks();
  }, [user, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await roomsAPI.create(formData);
      navigate(`/room/${response.data.code}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-container">
      <div className="create-room-card">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <h2>Create a New Room</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Name</label>
            <input
              type="text"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={50}
              placeholder="e.g., Friday Night Game"
            />
          </div>

          <div className="form-group">
            <label>Question Pack</label>
            <select
              name="questionPackId"
              className="input"
              value={formData.questionPackId}
              onChange={handleChange}
              required
            >
              {questionPacks.map(pack => (
                <option key={pack._id} value={pack._id}>
                  {pack.name} {pack.isPremium ? '(Premium)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Max Players</label>
            <input
              type="number"
              name="maxPlayers"
              className="input"
              value={formData.maxPlayers}
              onChange={handleChange}
              min={3}
              max={12}
              required
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              <span>Public Room (visible in lobby)</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </form>

        <div className="info-box mt-3">
          <p><strong>Note:</strong> You'll receive a room code that others can use to join your game.</p>
        </div>
      </div>
    </div>
  );
}

export default CreateRoom;

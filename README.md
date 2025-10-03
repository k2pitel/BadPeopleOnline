# BadPeopleOnline

A web-based multiplayer party game inspired by Bad People (dycegames.com). Play hilarious and edgy voting rounds with friends or strangers online!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.2.0-blue)](https://reactjs.org/)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Demo](#demo) • [Contributing](#contributing)

## Features

- 🎮 **Online Multiplayer Rooms**: Create or join rooms with friends or strangers
- 🗳️ **Voting Rounds**: Answer funny and edgy questions about your friends
- 📊 **Score Tracking**: Real-time score updates and leaderboards
- 🔒 **Private/Public Lobbies**: Choose your privacy level
- 📱 **Mobile-Friendly**: Responsive design works on all devices
- 🛡️ **Moderation System**: Report inappropriate content and users
- 💰 **Monetization**: Ads, premium question packs, and subscriptions

## Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Socket.io Client** for real-time communication
- **React Router** for navigation
- **CSS Modules** for styling
- Mobile-first responsive design

### Backend
- **Node.js** with Express
- **Socket.io** for WebSocket connections
- **MongoDB** for data persistence
- **JWT** for authentication
- **Redis** for session management (optional)

## Architecture

```
┌─────────────────┐
│  React Client   │
│   (Vite + WS)   │
└────────┬────────┘
         │
    WebSocket/HTTP
         │
┌────────▼────────┐
│  Express Server │
│  Socket.io Hub  │
└────────┬────────┘
         │
    ┌────▼────┐
    │ MongoDB │
    └─────────┘
```

## Game Flow

1. **Lobby Phase**: Players join a room using a room code
2. **Question Phase**: A question is presented to all players
3. **Voting Phase**: Players vote for who best fits the question
4. **Results Phase**: Votes are revealed and points awarded
5. **Next Round**: Continue until all questions are answered
6. **Game End**: Final scores and winner announced

## Quick Start

### One-Command Setup (macOS/Linux)

```bash
./quickstart.sh
```

### Manual Setup

**Prerequisites**
- Node.js 18+ 
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

```bash
# Install all dependencies (root, server, and client)
npm run install:all

# Or install individually
npm install
cd server && npm install
cd ../client && npm install
```

### Configuration

Create a `.env` file in the `server` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/badpeopleonline
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Running the Application

```bash
# Run both server and client in development mode
npm run dev

# Or run separately
npm run server:dev  # Server runs on http://localhost:3001
npm run client:dev  # Client runs on http://localhost:5173
```

### Production Build

```bash
# Build the client
npm run build

# Start the production server
npm start
```

## Project Structure

```
BadPeopleOnline/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and Socket services
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Global styles
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── sockets/       # Socket.io handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── config/            # Configuration files
│   └── package.json
├── docs/                  # Documentation
└── package.json          # Root package.json
```

## API Overview

### REST API Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/register` | POST | Register new user | No |
| `/api/auth/login` | POST | Login user | No |
| `/api/auth/guest` | POST | Guest login | No |
| `/api/rooms` | GET | List public rooms | Optional |
| `/api/rooms` | POST | Create new room | Yes |
| `/api/rooms/:code` | GET | Get room details | Optional |
| `/api/questions` | GET | List question packs | Optional |
| `/api/questions/:id` | GET | Get question pack | Optional |
| `/api/reports` | POST | Submit report | Yes |

[Full API Documentation →](docs/API.md)

### WebSocket Events

**Client → Server:**
- `join-room` - Join a game room
- `leave-room` - Leave current room  
- `start-game` - Start the game (host only)
- `submit-vote` - Submit vote for current question
- `next-round` - Move to next round (host only)

**Server → Client:**
- `room-joined` - Successfully joined room
- `player-joined` - New player joined
- `player-left` - Player left room
- `game-started` - Game has started
- `next-question` - New question started
- `vote-update` - Vote count updated
- `round-results` - Round completed
- `game-over` - Game ended
- `error` - Error occurred

[Detailed Event Documentation →](docs/API.md#websocket-events)

## Documentation

📚 **Comprehensive Guides Available:**

- [**Getting Started**](docs/GETTING_STARTED.md) - Step-by-step setup guide
- [**Architecture**](docs/ARCHITECTURE.md) - System design and technical details
- [**API Reference**](docs/API.md) - Complete API documentation
- [**Game Flow**](docs/GAME_FLOW.md) - Visual game flow diagrams
- [**Deployment**](docs/DEPLOYMENT.md) - Production deployment guide
- [**Monetization**](docs/MONETIZATION.md) - Revenue strategy and pricing
- [**Moderation**](docs/MODERATION.md) - Moderation system details
- [**Contributing**](CONTRIBUTING.md) - How to contribute

## Demo

🎮 **Try it yourself:**

1. Clone the repo
2. Run `./quickstart.sh` (or follow manual setup)
3. Visit http://localhost:5173
4. Create a room or join as a guest

**Sample Credentials:**
- Use "Play as Guest" for instant access
- Or create a free account

## Project Structure

## Moderation System

- User reporting with reason selection
- Automatic content filtering
- Admin dashboard for reviewing reports
- User suspension/ban functionality
- Question flagging system

## Monetization Strategy

### Free Tier
- Access to basic question packs
- Ad-supported gameplay
- Public rooms only

### Premium ($4.99/month)
- Ad-free experience
- Access to all question packs
- Create private rooms
- Custom question creation
- Priority support

### Question Packs ($1.99 each)
- Themed question collections
- One-time purchase
- Shareable with room members

## Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. Build the client: `cd client && npm run build`
2. Configure environment variables
3. Start MongoDB instance
4. Run server: `cd server && npm start`
5. Serve built client files from server

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas
- **CDN**: Cloudflare

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/BadPeopleOnline.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request
```

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Adding tests
- 🌍 Internationalization

## Roadmap

### Current (v1.0 - MVP)
- [x] Core gameplay mechanics
- [x] Real-time multiplayer
- [x] User authentication
- [x] Question packs system
- [x] Moderation framework
- [x] Mobile-responsive UI

### Upcoming (v1.1)
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Custom avatars
- [ ] In-game chat
- [ ] Sound effects

### Future (v2.0)
- [ ] Mobile apps (iOS/Android)
- [ ] Voice chat integration
- [ ] Tournament mode
- [ ] Streaming integration
- [ ] Multiple languages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [Bad People](https://dycegames.com/) by DYCE Games
- Built with modern web technologies
- Community feedback and contributions

## Support

- 📧 Email: support@badpeopleonline.com
- 🐛 [Report a Bug](https://github.com/k2pitel/BadPeopleOnline/issues)
- 💡 [Request a Feature](https://github.com/k2pitel/BadPeopleOnline/issues)
- 📖 [Documentation](docs/)

## Statistics

- **Code Files:** 33 (JS/JSX/CSS)
- **Documentation:** 10 comprehensive guides
- **Database Models:** 4 MongoDB schemas
- **UI Pages:** 6 React components
- **API Endpoints:** 12+ routes
- **WebSocket Events:** 10+ real-time events

---

Made with ❤️ by the BadPeopleOnline team

**Star ⭐ this repo if you like it!**
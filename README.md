# BadPeopleOnline

A web-based multiplayer party game inspired by Bad People (dycegames.com). Play hilarious and edgy voting rounds with friends or strangers online!

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

### Prerequisites
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

## API Documentation

### REST API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/rooms` - List public rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room details
- `GET /api/questions` - Get question packs
- `POST /api/reports` - Submit report

### WebSocket Events

#### Client → Server
- `join-room` - Join a game room
- `leave-room` - Leave current room
- `submit-vote` - Submit vote for current question
- `start-game` - Start the game (host only)
- `next-round` - Move to next round (host only)

#### Server → Client
- `room-update` - Room state changed
- `player-joined` - New player joined
- `player-left` - Player left room
- `question-start` - New question started
- `voting-complete` - All votes submitted
- `round-results` - Round results
- `game-over` - Game ended

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

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [Report a bug](https://github.com/k2pitel/BadPeopleOnline/issues)
- Email: support@badpeopleonline.com

## Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Voice chat integration
- [ ] Custom avatars
- [ ] Tournament mode
- [ ] Streaming integration (Twitch/YouTube)
- [ ] Multiple language support
- [ ] Advanced statistics and analytics
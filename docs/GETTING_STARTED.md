# Getting Started Guide

Welcome to BadPeopleOnline! This guide will help you set up and run the application locally.

## Quick Start (5 minutes)

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **MongoDB** installed locally OR use MongoDB Atlas (cloud)
  - Local: [Installation guide](https://docs.mongodb.com/manual/installation/)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/k2pitel/BadPeopleOnline.git
   cd BadPeopleOnline
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   This installs dependencies for:
   - Root project
   - Server
   - Client

3. **Configure the server**
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Edit `server/.env` with your settings:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/badpeopleonline
   JWT_SECRET=your-secret-key-change-this
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongodb
   
   # Windows
   net start MongoDB
   ```

5. **Seed the database** (Optional - adds default question packs)
   ```bash
   cd server
   node src/utils/seedQuestions.js
   ```

6. **Start the application**
   
   Open two terminal windows:
   
   **Terminal 1 - Server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will start on http://localhost:3001
   
   **Terminal 2 - Client:**
   ```bash
   cd client
   npm run dev
   ```
   Client will start on http://localhost:5173

7. **Open your browser**
   
   Navigate to http://localhost:5173

## Alternative: Using Docker

If you prefer Docker:

```bash
# Make sure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the app at http://localhost

## Using MongoDB Atlas (Cloud Database)

If you don't want to install MongoDB locally:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier)
4. Create a database user
5. Get your connection string
6. Update `server/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/badpeopleonline?retryWrites=true&w=majority
   ```

## Playing the Game

### As a Guest

1. Visit http://localhost:5173
2. Click "Play as Guest"
3. Enter a username
4. Choose to create a room or join one

### Creating an Account

1. Visit http://localhost:5173
2. Click "Login / Register"
3. Fill in the registration form
4. Start creating or joining rooms

### Creating a Room

1. Login or play as guest
2. Click "Create Room"
3. Choose a room name
4. Select a question pack
5. Set max players (3-12)
6. Choose public or private
7. Share the room code with friends

### Joining a Room

**Option 1: Direct Code**
1. Click "Join Room"
2. Enter the 6-character room code
3. Click "Join Room"

**Option 2: Browse Lobbies**
1. Click "Browse Lobbies"
2. See all public rooms
3. Click "Join Room" on any available room

### Playing the Game

1. **Waiting Room**: Wait for at least 3 players to join
2. **Start Game**: Host clicks "Start Game"
3. **Question Phase**: Read the question presented
4. **Voting Phase**: Click on the player who best fits the question
5. **Results**: See who got the most votes and current scores
6. **Next Round**: Host clicks "Next Round" to continue
7. **Game Over**: After all rounds, see final scores and winner

## Game Modes

### Default Pack (Free)
Classic questions suitable for most groups
- "Who is most likely to become famous?"
- "Who would survive the longest in a horror movie?"

### Family Friendly Pack (Free)
Safe questions for all ages
- "Who is the best cook?"
- "Who tells the funniest jokes?"

### Spicy Pack (Premium)
Edgier questions for adults
- Requires premium subscription or one-time purchase

## Features Overview

### Free Features
- Join unlimited games
- Create public rooms
- Access to 2 free question packs
- Play with up to 8 players

### Premium Features ($4.99/month)
- Ad-free experience
- All question packs included
- Create private rooms
- Custom question creation
- Up to 12 players per room

## Troubleshooting

### Server won't start

**Error: "Cannot connect to MongoDB"**
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

**Error: "Port 3001 already in use"**
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

### Client won't start

**Error: "Module not found"**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

**Error: "ECONNREFUSED"**
- Ensure server is running on port 3001
- Check VITE_API_URL in client/.env

### WebSocket connection fails

- Check that both client and server are running
- Verify CORS_ORIGIN in server/.env matches client URL
- Clear browser cache and reload

### MongoDB issues

**Connection timeout**
- Check if MongoDB service is running
- Verify MONGODB_URI format
- For Atlas: Check network access settings

**Authentication failed**
- Verify username/password in connection string
- Check database user permissions

## Development Tips

### Hot Reload

Both client and server support hot reload:
- **Server**: Automatically restarts on file changes (nodemon)
- **Client**: Automatically updates on file changes (Vite HMR)

### Debugging

**Server-side:**
```bash
# View server logs
cd server
npm run dev
# Logs appear in terminal
```

**Client-side:**
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for API calls

### Testing Different Scenarios

**Multiple Players:**
- Open app in multiple browser windows
- Use incognito/private windows
- Use different browsers

**Mobile Testing:**
1. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Access app from mobile: `http://YOUR_IP:5173`
3. Ensure firewall allows connections

## Next Steps

### Explore the Code

- **Client**: React components in `client/src/pages/`
- **Server**: API routes in `server/src/routes/`
- **Socket**: Real-time logic in `server/src/sockets/`
- **Models**: Database schemas in `server/src/models/`

### Customize

- Add custom question packs
- Modify UI colors in `client/src/styles/index.css`
- Adjust game settings (rounds, max players)

### Deploy

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment guides.

## Support

Having issues? Check:
1. This guide's troubleshooting section
2. [Architecture documentation](docs/ARCHITECTURE.md)
3. [GitHub Issues](https://github.com/k2pitel/BadPeopleOnline/issues)

## Contributing

We welcome contributions! See the main README for guidelines.

## Have Fun!

BadPeopleOnline is meant to be fun. Enjoy finding out what your friends really think! 🎉

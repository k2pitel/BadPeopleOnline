# Architecture Documentation

## System Overview

BadPeopleOnline is a real-time multiplayer party game built with a modern web stack optimized for scalability and performance.

## Technology Stack

### Frontend
- **React 18**: Component-based UI library
- **Vite**: Fast build tool and dev server
- **Socket.io Client**: Real-time WebSocket communication
- **React Router**: Client-side routing
- **Axios**: HTTP client for REST API calls

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **Socket.io**: WebSocket server for real-time features
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: ODM for MongoDB
- **JWT**: Token-based authentication
- **bcryptjs**: Password hashing

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  React   │  │  Socket  │  │   API    │              │
│  │   App    │──│  Client  │  │  Client  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────┬────────────┬────────────┬─────────────────────┘
          │            │            │
      WebSocket       HTTP         HTTP
          │            │            │
┌─────────▼────────────▼────────────▼─────────────────────┐
│                   Server Layer                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Express Application                    │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐             │   │
│  │  │ Socket │  │  REST  │  │  Auth  │             │   │
│  │  │Handler │  │  API   │  │  MW    │             │   │
│  │  └────────┘  └────────┘  └────────┘             │   │
│  └──────────────────┬───────────────────────────────┘   │
│                     │                                     │
│  ┌─────────────────▼───────────────────────────────┐   │
│  │         Business Logic Layer                      │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐             │   │
│  │  │  Room  │  │  Game  │  │  User  │             │   │
│  │  │Service │  │Service │  │Service │             │   │
│  │  └────────┘  └────────┘  └────────┘             │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Data Layer                              │
│  ┌──────────────────────────────────────────────────┐   │
│  │              MongoDB Database                     │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐             │   │
│  │  │  Users │  │ Rooms  │  │Question│             │   │
│  │  │        │  │        │  │ Packs  │             │   │
│  │  └────────┘  └────────┘  └────────┘             │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow
```
User -> Login Page -> API (/auth/login) -> Validate -> Generate JWT -> Store Token
```

### 2. Room Creation Flow
```
User -> Create Room -> API (/rooms) -> Create DB Record -> Return Room Code
```

### 3. Game Flow (WebSocket)
```
1. Join Room:
   Client -> emit('join-room') -> Server validates -> Update room state -> 
   Broadcast 'player-joined' to all clients

2. Start Game:
   Host -> emit('start-game') -> Server validates -> Update game state ->
   Broadcast 'game-started' with first question

3. Vote Submission:
   Player -> emit('submit-vote') -> Server records vote -> Check if all voted ->
   If complete: Calculate scores -> Broadcast 'round-results'

4. Next Round:
   Host -> emit('next-round') -> Increment round -> 
   If more rounds: Broadcast 'next-question'
   Else: Calculate winner -> Broadcast 'game-over'
```

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  displayName: String,
  isPremium: Boolean,
  premiumUntil: Date,
  purchasedPacks: [ObjectId],
  isBanned: Boolean,
  bannedUntil: Date,
  createdAt: Date
}
```

### Room Collection
```javascript
{
  _id: ObjectId,
  code: String (unique, 6 chars),
  name: String,
  host: ObjectId (ref: User),
  isPublic: Boolean,
  maxPlayers: Number,
  currentPlayers: Number,
  status: Enum('waiting', 'playing', 'finished'),
  questionPack: ObjectId (ref: QuestionPack),
  currentQuestionIndex: Number,
  totalRounds: Number,
  players: [{
    userId: ObjectId,
    username: String,
    displayName: String,
    score: Number,
    isConnected: Boolean
  }],
  votes: [{
    questionId: String,
    round: Number,
    votes: [{
      voterId: ObjectId,
      targetId: ObjectId,
      timestamp: Date
    }]
  }],
  createdAt: Date (TTL: 24 hours)
}
```

### QuestionPack Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  category: Enum('default', 'spicy', 'family-friendly', 'custom'),
  isPremium: Boolean,
  price: Number,
  questions: [{
    text: String,
    category: String,
    tags: [String]
  }],
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### Report Collection
```javascript
{
  _id: ObjectId,
  reportedBy: ObjectId (ref: User),
  reportedUser: ObjectId (ref: User),
  reportedContent: String,
  type: Enum('user', 'question', 'room'),
  reason: Enum('harassment', 'spam', 'inappropriate', 'cheating', 'other'),
  description: String,
  status: Enum('pending', 'reviewed', 'resolved', 'dismissed'),
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date,
  action: Enum('none', 'warning', 'temporary-ban', 'permanent-ban', 'content-removed'),
  createdAt: Date
}
```

## WebSocket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| join-room | { roomCode, user } | Join a game room |
| leave-room | { roomCode } | Leave current room |
| start-game | { roomCode } | Start the game (host only) |
| submit-vote | { roomCode, targetUserId } | Submit vote for current question |
| next-round | { roomCode } | Advance to next round (host only) |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| room-joined | { room } | Successfully joined room |
| player-joined | { player, room } | Another player joined |
| player-left | { username } | Player left room |
| game-started | { status, question, players } | Game has started |
| next-question | { round, question, players } | New question started |
| vote-update | { votesReceived, totalPlayers } | Vote count updated |
| round-results | { votes, players } | Round completed with results |
| game-over | { players, winner } | Game ended |
| error | { message } | Error occurred |

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Password Security**: bcrypt hashing with salt
3. **Input Validation**: express-validator for all inputs
4. **Rate Limiting**: Should be implemented for production
5. **CORS**: Configured to allow only specific origins
6. **XSS Protection**: React's built-in escaping
7. **SQL Injection**: Using Mongoose ODM prevents this

## Scalability Considerations

1. **Horizontal Scaling**: Stateless server design
2. **Load Balancing**: Nginx or similar for multiple instances
3. **Session Management**: Redis for shared sessions (optional)
4. **Socket.io Clustering**: Redis adapter for multi-server WebSocket
5. **Database Indexing**: Indexes on frequently queried fields
6. **CDN**: Static assets served via CDN
7. **Caching**: Redis for frequently accessed data

## Performance Optimizations

1. **Code Splitting**: React lazy loading for routes
2. **Minification**: Production builds are minified
3. **Compression**: gzip/brotli for HTTP responses
4. **Database Queries**: Selective field projection
5. **TTL Indexes**: Auto-delete old rooms after 24 hours
6. **Connection Pooling**: MongoDB connection pooling

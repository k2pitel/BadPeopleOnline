# API Reference

## Base URL

Development: `http://localhost:3001/api`
Production: `https://api.badpeopleonline.com/api`

## Authentication

Most endpoints require authentication using JWT tokens.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "displayName": "John Doe" // Optional
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "john@example.com",
    "isPremium": false
  }
}
```

**Errors:**
- `400` - Validation error
- `400` - User already exists

---

### Login

Authenticate an existing user.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "displayName": "John Doe",
    "email": "john@example.com",
    "isPremium": false
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `403` - User is banned

---

### Guest Login

Create a temporary guest session.

**Endpoint:** `POST /auth/guest`

**Request Body:**
```json
{
  "username": "GuestPlayer"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "username": "GuestPlayer",
    "displayName": "GuestPlayer",
    "isGuest": true,
    "isPremium": false
  }
}
```

---

## Room Endpoints

### Get All Public Rooms

List all public rooms that are waiting for players.

**Endpoint:** `GET /rooms`

**Headers:** Optional authentication

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "code": "ABC123",
    "name": "Friday Night Game",
    "host": {
      "_id": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "displayName": "John Doe"
    },
    "maxPlayers": 8,
    "currentPlayers": 3,
    "status": "waiting",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Get Room by Code

Get detailed information about a specific room.

**Endpoint:** `GET /rooms/:code`

**Parameters:**
- `code` - 6-character room code (case insensitive)

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "ABC123",
  "name": "Friday Night Game",
  "host": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "johndoe",
    "displayName": "John Doe"
  },
  "isPublic": true,
  "maxPlayers": 8,
  "currentPlayers": 3,
  "status": "waiting",
  "questionPack": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Default Pack",
    "description": "Classic questions"
  },
  "currentQuestionIndex": 0,
  "totalRounds": 10,
  "players": [
    {
      "userId": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "displayName": "John Doe",
      "score": 0,
      "isConnected": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404` - Room not found

---

### Create Room

Create a new game room.

**Endpoint:** `POST /rooms`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "name": "My Game Room",
  "isPublic": true,
  "maxPlayers": 8,
  "questionPackId": "507f1f77bcf86cd799439013"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "code": "ABC123",
  "name": "My Game Room",
  "host": "507f1f77bcf86cd799439012",
  "isPublic": true,
  "maxPlayers": 8,
  "currentPlayers": 1,
  "status": "waiting",
  "questionPack": "507f1f77bcf86cd799439013",
  "players": [
    {
      "userId": "507f1f77bcf86cd799439012",
      "username": "johndoe",
      "displayName": "John Doe",
      "score": 0,
      "isConnected": true
    }
  ]
}
```

**Errors:**
- `401` - Authentication required
- `500` - Server error

---

## Question Pack Endpoints

### Get All Question Packs

List available question packs.

**Endpoint:** `GET /questions`

**Headers:** Optional authentication

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Default Pack",
    "description": "Classic questions to get you started",
    "category": "default",
    "isPremium": false,
    "price": 0,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Spicy Pack",
    "description": "For players who can handle the heat",
    "category": "spicy",
    "isPremium": true,
    "price": 1.99,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Note:** Premium packs only shown to premium users or users who purchased them.

---

### Get Question Pack Details

Get full details including questions for a specific pack.

**Endpoint:** `GET /questions/:id`

**Headers:** Optional authentication

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Default Pack",
  "description": "Classic questions to get you started",
  "category": "default",
  "isPremium": false,
  "price": 0,
  "questions": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "text": "Who is most likely to become famous?",
      "category": "default",
      "tags": ["career", "personality"]
    },
    {
      "_id": "507f1f77bcf86cd799439016",
      "text": "Who would survive the longest in a horror movie?",
      "category": "default",
      "tags": ["survival", "horror"]
    }
  ],
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404` - Question pack not found
- `403` - Premium pack - purchase required

---

## Report Endpoints

### Submit Report

Report a user, question, or room.

**Endpoint:** `POST /reports`

**Headers:** Requires authentication

**Request Body:**
```json
{
  "reportedUser": "507f1f77bcf86cd799439012", // Optional
  "reportedContent": "Inappropriate question text", // Optional
  "type": "user", // 'user', 'question', or 'room'
  "reason": "harassment", // 'harassment', 'spam', 'inappropriate', 'cheating', 'other'
  "description": "User was using offensive language" // Optional
}
```

**Response:** `201 Created`
```json
{
  "message": "Report submitted successfully",
  "reportId": "507f1f77bcf86cd799439017"
}
```

**Errors:**
- `401` - Authentication required
- `400` - Validation error

---

### Get User's Reports

Get all reports submitted by the authenticated user.

**Endpoint:** `GET /reports/my-reports`

**Headers:** Requires authentication

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "type": "user",
    "reason": "harassment",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## WebSocket Events

Connect to Socket.io at the same base URL as the API.

### Client → Server Events

#### join-room

Join a game room.

**Emit:**
```javascript
socket.emit('join-room', {
  roomCode: 'ABC123',
  user: {
    id: '507f1f77bcf86cd799439012',
    username: 'johndoe',
    displayName: 'John Doe'
  }
});
```

---

#### leave-room

Leave the current room.

**Emit:**
```javascript
socket.emit('leave-room', {
  roomCode: 'ABC123'
});
```

---

#### start-game

Start the game (host only).

**Emit:**
```javascript
socket.emit('start-game', {
  roomCode: 'ABC123'
});
```

---

#### submit-vote

Submit a vote for the current question.

**Emit:**
```javascript
socket.emit('submit-vote', {
  roomCode: 'ABC123',
  targetUserId: '507f1f77bcf86cd799439012'
});
```

---

#### next-round

Advance to the next round (host only).

**Emit:**
```javascript
socket.emit('next-round', {
  roomCode: 'ABC123'
});
```

---

### Server → Client Events

#### room-joined

Successfully joined a room.

**Receive:**
```javascript
socket.on('room-joined', (data) => {
  console.log(data);
  // {
  //   room: {
  //     code: 'ABC123',
  //     name: 'Friday Night Game',
  //     currentPlayers: 3,
  //     maxPlayers: 8,
  //     status: 'waiting',
  //     isHost: false,
  //     players: [...]
  //   }
  // }
});
```

---

#### player-joined

Another player joined the room.

**Receive:**
```javascript
socket.on('player-joined', (data) => {
  console.log(data);
  // {
  //   player: {
  //     username: 'newplayer',
  //     displayName: 'New Player',
  //     score: 0
  //   },
  //   room: { ... }
  // }
});
```

---

#### player-left

A player left the room.

**Receive:**
```javascript
socket.on('player-left', (data) => {
  console.log(data);
  // {
  //   username: 'oldplayer',
  //   currentPlayers: 2
  // }
});
```

---

#### game-started

Game has started.

**Receive:**
```javascript
socket.on('game-started', (data) => {
  console.log(data);
  // {
  //   status: 'playing',
  //   currentRound: 1,
  //   totalRounds: 10,
  //   question: 'Who is most likely to become famous?',
  //   players: [...]
  // }
});
```

---

#### next-question

New question for the next round.

**Receive:**
```javascript
socket.on('next-question', (data) => {
  console.log(data);
  // {
  //   round: 2,
  //   totalRounds: 10,
  //   question: 'Who would survive a zombie apocalypse?',
  //   players: [...]
  // }
});
```

---

#### vote-update

Vote count updated.

**Receive:**
```javascript
socket.on('vote-update', (data) => {
  console.log(data);
  // {
  //   votesReceived: 3,
  //   totalPlayers: 5
  // }
});
```

---

#### round-results

Round completed with results.

**Receive:**
```javascript
socket.on('round-results', (data) => {
  console.log(data);
  // {
  //   votes: {
  //     '507f1f77bcf86cd799439012': 3,
  //     '507f1f77bcf86cd799439013': 2
  //   },
  //   players: [
  //     {
  //       userId: '507f1f77bcf86cd799439012',
  //       username: 'johndoe',
  //       displayName: 'John Doe',
  //       score: 8,
  //       votesReceived: 3
  //     }
  //   ]
  // }
});
```

---

#### game-over

Game has ended.

**Receive:**
```javascript
socket.on('game-over', (data) => {
  console.log(data);
  // {
  //   players: [...], // Sorted by score
  //   winner: {
  //     username: 'johndoe',
  //     displayName: 'John Doe',
  //     score: 45
  //   }
  // }
});
```

---

#### error

An error occurred.

**Receive:**
```javascript
socket.on('error', (error) => {
  console.error(error);
  // {
  //   message: 'Room not found'
  // }
});
```

---

## Rate Limits

To prevent abuse, the following rate limits apply:

- **Registration:** 5 requests per hour per IP
- **Login:** 10 requests per hour per IP
- **Room Creation:** 10 rooms per hour per user
- **Reports:** 5 reports per hour per user

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

Or for validation errors:

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

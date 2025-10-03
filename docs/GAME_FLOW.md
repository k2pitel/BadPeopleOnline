# Game Flow Diagram

## User Journey

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├── Login/Register ──────┐
       │                        │
       └── Play as Guest ────────┤
                                │
                         ┌──────▼──────┐
                         │   Choose    │
                         │   Action    │
                         └──┬───────┬──┘
                            │       │
                 ┌──────────┘       └──────────┐
                 │                             │
          ┌──────▼──────┐            ┌─────────▼────────┐
          │   Create    │            │   Join Room      │
          │    Room     │            │  (Code/Browse)   │
          └──────┬──────┘            └─────────┬────────┘
                 │                             │
                 └──────────┬──────────────────┘
                            │
                     ┌──────▼──────┐
                     │  Waiting    │
                     │    Lobby    │
                     │ (3+ players)│
                     └──────┬──────┘
                            │
                            │ Host starts game
                            │
                     ┌──────▼──────┐
                     │  Question   │
                     │   Display   │
                     └──────┬──────┘
                            │
                     ┌──────▼──────┐
                     │   Voting    │
                     │   Phase     │
                     └──────┬──────┘
                            │
                            │ All votes in
                            │
                     ┌──────▼──────┐
                     │   Results   │
                     │   & Scores  │
                     └──────┬──────┘
                            │
                  ┌─────────┴─────────┐
                  │                   │
         More rounds?            Final round
                  │                   │
                  │              ┌────▼────┐
                  │              │  Game   │
                  │              │  Over   │
                  │              │ Winner  │
                  │              └────┬────┘
                  │                   │
                  └─────────┬─────────┘
                            │
                     ┌──────▼──────┐
                     │  Return to  │
                     │    Home     │
                     └─────────────┘
```

## Game States

### 1. Waiting State
```
┌────────────────────────────────┐
│       Waiting for Players      │
├────────────────────────────────┤
│  Room: ABC123                  │
│  Players: 3/8                  │
│                                │
│  • Player 1 (Host) 👑          │
│  • Player 2                    │
│  • Player 3                    │
│                                │
│  [Start Game] (host only)      │
└────────────────────────────────┘
```

### 2. Playing State - Question
```
┌────────────────────────────────┐
│      Round 1 / 10              │
├────────────────────────────────┤
│                                │
│  Who is most likely to become  │
│         famous?                │
│                                │
├────────────────────────────────┤
│  Select a player:              │
│                                │
│  ┌────┐  ┌────┐  ┌────┐       │
│  │ P1 │  │ P2 │  │ P3 │       │
│  │ 5  │  │ 3  │  │ 2  │       │
│  └────┘  └────┘  └────┘       │
│                                │
│       [Submit Vote]            │
└────────────────────────────────┘
```

### 3. Playing State - Results
```
┌────────────────────────────────┐
│       Round Results            │
├────────────────────────────────┤
│                                │
│  #1  Player 1        +3  [8]   │
│  #2  Player 2        +2  [5]   │
│  #3  Player 3        +1  [3]   │
│                                │
│       [Next Round] (host)      │
└────────────────────────────────┘
```

### 4. Game Over State
```
┌────────────────────────────────┐
│        🎉 Game Over!           │
├────────────────────────────────┤
│  Winner: Player 1              │
│  Score: 45 points              │
│                                │
│  Final Scores:                 │
│  #1  Player 1    45 pts        │
│  #2  Player 2    38 pts        │
│  #3  Player 3    32 pts        │
│                                │
│     [Back to Home]             │
└────────────────────────────────┘
```

## WebSocket Communication Flow

```
Client 1 (Host)          Server              Client 2,3,4
     │                      │                      │
     │──join-room──────────▶│                      │
     │                      │──player-joined──────▶│
     │◀──room-joined────────│                      │
     │                      │                      │
     │                      │◀──join-room──────────│
     │◀──player-joined──────│                      │
     │                      │──player-joined──────▶│
     │                      │                      │
     │──start-game─────────▶│                      │
     │◀──game-started───────│──game-started───────▶│
     │                      │                      │
     │──submit-vote────────▶│                      │
     │                      │──vote-update────────▶│
     │                      │◀──submit-vote────────│
     │◀──vote-update────────│                      │
     │                      │                      │
     │    (all votes in)    │                      │
     │◀──round-results──────│──round-results──────▶│
     │                      │                      │
     │──next-round─────────▶│                      │
     │◀──next-question──────│──next-question──────▶│
     │                      │                      │
     │    (repeat votes)    │                      │
     │                      │                      │
     │◀──game-over──────────│──game-over──────────▶│
     │                      │                      │
```

## Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       │ HTTP (REST API)
       │ ├── Login/Register
       │ ├── Create Room
       │ └── Get Question Packs
       │
       ▼
┌─────────────┐     ┌──────────────┐
│   Express   │────▶│   MongoDB    │
│   Server    │◀────│   Database   │
└──────┬──────┘     └──────────────┘
       │
       │ WebSocket (Socket.io)
       │ ├── Join Room
       │ ├── Submit Vote
       │ ├── Start Game
       │ └── Next Round
       │
       ▼
┌─────────────┐
│   Browser   │
└─────────────┘
```

## Room Lifecycle

```
Create Room
    │
    ▼
[Waiting] ──(timeout 24h)──▶ [Deleted]
    │
    │ (start game)
    ▼
[Playing]
    │
    ├──(all rounds done)──▶ [Finished] ──(timeout 1h)──▶ [Deleted]
    │
    └──(all players leave)──▶ [Deleted]
```

## User States

```
┌─────────┐
│  Guest  │ ─(register)─▶ ┌──────────┐
└─────────┘               │ Registered│
     │                    └─────┬─────┘
     │                          │
     │                   (subscribe)
     │                          │
     └──────────────────────────┼──────▶ ┌──────────┐
                                         │ Premium  │
                                         └──────────┘
```

## Score Calculation

```
Question: "Who is most likely to become famous?"

Player Votes:
• Player 1 → Player 2
• Player 2 → Player 2
• Player 3 → Player 2
• Player 4 → Player 1

Results:
Player 2: 3 votes → +3 points
Player 1: 1 vote  → +1 point
Player 3: 0 votes → +0 points
Player 4: 0 votes → +0 points
```

## Premium Features Flow

```
Free User
    │
    ├──(view premium pack)──▶ [Paywall]
    │                             │
    │                      (purchase pack)
    │                             │
    │                        [Has Access]
    │
    └──(subscribe premium)──▶ [Premium]
                                  │
                            [All Features]
```

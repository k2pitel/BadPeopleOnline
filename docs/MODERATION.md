# Moderation System

## Overview

The moderation system is designed to keep the BadPeopleOnline community safe and enjoyable for all players. It includes automated filtering, user reporting, and admin review tools.

## Components

### 1. User Reporting

Users can report:
- Other users (harassment, cheating)
- Questions (inappropriate content)
- Rooms (rule violations)

#### Report Categories
- **Harassment**: Bullying, threats, hate speech
- **Spam**: Repetitive or unwanted messages
- **Inappropriate**: Sexual content, violence, illegal activities
- **Cheating**: Exploiting game mechanics
- **Other**: Other violations

### 2. Content Filtering

Automated filtering system to catch inappropriate content:

```javascript
// Example word filter (to be implemented)
const bannedWords = [
  // List of inappropriate words
];

function filterContent(text) {
  let filtered = text;
  bannedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
}
```

### 3. Admin Dashboard

Admin interface for reviewing reports (to be built):

Features:
- View pending reports
- Review reported content
- User management (warnings, bans)
- Analytics (report trends)

## Report Workflow

```
1. User submits report
   ↓
2. Report saved to database with 'pending' status
   ↓
3. Admin reviews report
   ↓
4. Admin takes action:
   - None (dismiss)
   - Warning (notify user)
   - Temporary ban (1-30 days)
   - Permanent ban
   - Content removal
   ↓
5. Report marked as 'resolved'
   ↓
6. Action recorded in user's history
```

## API Endpoints

### Submit Report
```
POST /api/reports
Body: {
  reportedUser: ObjectId,      // Optional
  reportedContent: String,      // Optional
  type: String,                 // 'user', 'question', 'room'
  reason: String,               // 'harassment', 'spam', etc.
  description: String           // Additional details
}
```

### Get User's Reports
```
GET /api/reports/my-reports
Returns: Array of user's submitted reports
```

### Admin: Get All Reports (to be implemented)
```
GET /api/admin/reports?status=pending
Headers: Authorization: Bearer <admin-token>
Returns: Array of reports
```

### Admin: Review Report (to be implemented)
```
PATCH /api/admin/reports/:id
Body: {
  status: 'resolved',
  action: 'temporary-ban',
  adminNotes: String
}
```

## Ban System

### Temporary Ban
- User cannot login until ban expires
- bannedUntil field in User model
- Checked on login and socket connection

### Permanent Ban
- isBanned set to true
- bannedUntil set to far future date
- User cannot create new account with same email

### Implementation
```javascript
// Check on login
if (user.isBanned && user.bannedUntil > new Date()) {
  return res.status(403).json({ error: 'User is banned' });
}

// Check on socket connection
socket.on('join-room', async (data) => {
  const user = await User.findById(userId);
  if (user.isBanned && user.bannedUntil > new Date()) {
    socket.emit('error', { message: 'You are banned' });
    socket.disconnect();
    return;
  }
  // ... rest of logic
});
```

## Auto-Moderation Rules

1. **Rate Limiting**
   - Max 5 reports per hour per user
   - Prevents report spam

2. **Multiple Reports**
   - If user receives 3+ reports in 24 hours, auto-flag for review
   - Admin gets notification

3. **Repeated Offenses**
   - First offense: Warning
   - Second offense: 1-day ban
   - Third offense: 7-day ban
   - Fourth offense: Permanent ban

4. **Content Filtering**
   - Auto-detect banned words
   - Replace with asterisks
   - Log for admin review

## Question Pack Moderation

Custom questions submitted by users must be reviewed:

1. User creates custom question pack
2. Pack marked as 'pending' status
3. Admin reviews questions
4. Admin approves/rejects pack
5. Approved packs become available

## Moderation Best Practices

1. **Transparency**: Clearly communicate rules
2. **Consistency**: Apply rules fairly
3. **Documentation**: Keep records of actions
4. **Appeals**: Allow users to appeal bans
5. **Privacy**: Don't share reporter identities
6. **Responsiveness**: Review reports within 24 hours

## Future Enhancements

- [ ] AI-powered content moderation
- [ ] Automated sentiment analysis
- [ ] User reputation system
- [ ] Community moderators program
- [ ] Real-time chat filtering
- [ ] Image/avatar moderation
- [ ] Ban evasion detection
- [ ] Appeals system

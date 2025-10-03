# Contributing to BadPeopleOnline

Thank you for your interest in contributing to BadPeopleOnline! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling or insulting comments
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### 1. Fork the Repository

1. Visit https://github.com/k2pitel/BadPeopleOnline
2. Click the "Fork" button in the top right
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/BadPeopleOnline.git
   cd BadPeopleOnline
   ```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm run install:all

# Set up environment variables
cd server
cp .env.example .env
# Edit .env with your local settings

# Start development servers
npm run dev  # From root directory
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

## Development Workflow

### Making Changes

1. **Write Code**
   - Follow our [coding standards](#coding-standards)
   - Write clean, readable code
   - Add comments for complex logic

2. **Test Your Changes**
   - Test manually in the browser
   - Ensure no console errors
   - Test on mobile viewport
   - Verify WebSocket connections work

3. **Update Documentation**
   - Update README if needed
   - Update API docs for API changes
   - Add JSDoc comments for new functions

### Testing Checklist

Before submitting:

- [ ] Code runs without errors
- [ ] All features work as expected
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (responsive)
- [ ] No console errors or warnings
- [ ] WebSocket events work correctly
- [ ] Database operations succeed
- [ ] Authentication works
- [ ] All routes accessible

## Coding Standards

### JavaScript/JSX

**General Rules:**
- Use ES6+ syntax
- Use `const` by default, `let` when needed, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use async/await over raw Promises
- Handle errors appropriately

**Example:**
```javascript
// Good
const fetchUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

// Avoid
var fetchUser = function(userId) {
  return api.get('/users/' + userId).then(function(response) {
    return response.data;
  }).catch(function(error) {
    console.log(error);
  });
};
```

### React Components

**Functional Components:**
```javascript
// Good
function PlayerCard({ player, onSelect }) {
  const handleClick = () => {
    onSelect(player);
  };

  return (
    <div className="player-card" onClick={handleClick}>
      <h3>{player.displayName}</h3>
      <p>Score: {player.score}</p>
    </div>
  );
}

export default PlayerCard;
```

**Hooks:**
- Use hooks at the top level
- Extract complex logic into custom hooks
- Name custom hooks with `use` prefix

```javascript
// Custom hook example
function useGameRoom(roomCode) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoom();
  }, [roomCode]);

  const loadRoom = async () => {
    try {
      const data = await roomsAPI.getByCode(roomCode);
      setRoom(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { room, loading };
}
```

### CSS

**Guidelines:**
- Use CSS Modules or separate CSS files
- Follow BEM naming convention when appropriate
- Use CSS variables for colors and common values
- Write mobile-first media queries

```css
/* Good */
.player-card {
  background: white;
  border-radius: var(--border-radius);
  padding: 16px;
}

.player-card__name {
  font-weight: 600;
  color: var(--text-dark);
}

.player-card--selected {
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .player-card {
    padding: 12px;
  }
}
```

### Node.js/Express

**Guidelines:**
- Use async/await for database operations
- Validate input with express-validator
- Handle errors with try/catch
- Return consistent response formats

```javascript
// Good
router.post('/rooms', auth, async (req, res) => {
  try {
    const { name, isPublic, maxPlayers } = req.body;
    
    // Validate
    if (!name || name.length > 50) {
      return res.status(400).json({ error: 'Invalid room name' });
    }
    
    // Create room
    const room = new Room({
      name,
      isPublic,
      maxPlayers,
      host: req.user._id
    });
    
    await room.save();
    
    res.status(201).json(room);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
```

### Git Commits

**Commit Message Format:**
```
type(scope): brief description

Detailed description if needed.

Fixes #123
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semicolons
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(rooms): add private room creation

Add ability for premium users to create private rooms.
Includes new isPublic field and access control.

Fixes #45

---

fix(socket): handle disconnection edge case

Fixed issue where disconnected players remained in room state.
Now properly updates room.currentPlayers on disconnect.

Fixes #67
```

## Submitting Changes

### 1. Push Your Branch

```bash
git add .
git commit -m "feat(feature): description"
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] All features work

## Screenshots
Add screenshots if UI changes

## Related Issues
Fixes #123
```

### 3. Code Review

- Respond to feedback promptly
- Make requested changes
- Push updates to the same branch
- Be open to suggestions

### 4. Merge

Once approved, a maintainer will merge your PR.

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try to reproduce on latest version
3. Gather error messages and logs

### Bug Report Template

```markdown
**Describe the bug**
Clear description of what happened

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 100]
- Node version: [e.g. 18.0.0]

**Additional context**
Any other information
```

## Feature Requests

### Before Requesting

1. Check if already requested
2. Consider if it fits project scope
3. Think about implementation

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
What you'd like to happen

**Describe alternatives**
Alternative solutions considered

**Additional context**
Mockups, examples, etc.
```

## Areas for Contribution

### High Priority

- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Performance optimizations
- [ ] Test coverage

### Medium Priority

- [ ] Custom avatars
- [ ] Chat feature
- [ ] Tournament mode
- [ ] More question packs
- [ ] Internationalization (i18n)

### Good First Issues

- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Code cleanup
- Adding tests

## Questions?

- Open a GitHub Discussion
- Join our Discord (coming soon)
- Email: dev@badpeopleonline.com

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

Thank you for contributing to BadPeopleOnline! 🎉

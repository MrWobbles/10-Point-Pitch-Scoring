# 10-Point Pitch Score Keeper

A feature-rich, real-time score tracking app for Pitch (also known as High-Low-Jack or Setback) with **live spectator mode** powered by Firebase.

![Vaporwave Theme](https://img.shields.io/badge/style-vaporwave-ff69b4)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow)
![Firebase](https://img.shields.io/badge/firebase-realtime-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

### 🎯 Core Gameplay
- **Multiple Game Modes**
  - 4-Point, 5-Point, 6-Point, 7-Point variants
  - 8-Point (No Jokers), 9-Point, 10-Point (default)
  - 11-Point, 13-Point for advanced play
  - Dynamic point buttons and bid limits per mode

- **Dual Scoring Modes**
  - **Card Selection**: Click individual cards to track which points were earned
  - **Manual Input**: Directly enter point totals for faster scoring
  - Toggle between modes with a single click

- **Bid Tracking**
  - Auto-syncing bid inputs (bids always sum to mode total)
  - Automatic bid taker selection based on higher bid
  - Bid success/failure logic: made bids add points, lost bids subtract the bid amount

- **Shoot the Moon** 🌙
  - Available in 7, 8, 9, 10, 11, and 13-point modes
  - Capture ALL points for instant win
  - Miss any point = instant loss
  - High-risk, high-reward strategy

- **Win Conditions**
  - Team must reach the winning score (default 52)
  - **Must take and make the bid** in the final hand to win
  - Prevents premature victories if bid wasn't taken

### 🔴 Live Spectator Mode (New!)
- **Share Games in Real-Time**
  - Generate a 6-character share code
  - Spectators watch live score updates
  - Zero-latency sync via Firebase Realtime Database

- **Spectator Experience**
  - See live scores and game timer ⏱️
  - Real-time history updates
  - View current game mode rules
  - Instant winner notifications
  - Read-only, distraction-free interface

### 🎨 User Experience
- **Vaporwave Aesthetic**
  - Neon cyan and magenta color scheme
  - Glassy, semi-transparent cards with backdrop blur
  - Gradient backgrounds and neon glow effects
  - Smooth transitions and hover states

- **Responsive Design**
  - Optimized layouts for desktop, tablet, and mobile
  - Sticky compact scoreboard stays visible while scrolling
  - Slide-out settings drawer for clean interface

- **Persistent State**
  - Scores, team names, and game history saved to localStorage
  - Resume games after closing the browser
  - Configurable winning score

### 🛠️ Additional Features
- Editable team names (synced across all UI sections)
- Score history with timestamps (last 10 actions)
- Undo last score action
- Keyboard shortcuts (Ctrl/Cmd+Z to undo, Ctrl/Cmd+N for new game)
- Winner modal with celebration message
- Clear hand function to reset current selections

## Getting Started

### Installation

No build process or dependencies required! Just clone and open:

```bash
git clone https://github.com/MrWobbles/10-Point-Pitch-Scoring.git
cd "Pitch Score"
```

### Running the App

Simply open `index.html` in any modern web browser:

```bash
open index.html
```

Or drag `index.html` into your browser window.

## 🔥 Live Spectator Mode Setup (Optional)

Enable real-time game sharing with a free Firebase account:

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it (e.g., "pitch-scorekeeper")
4. Disable Google Analytics (not needed)
5. Click **"Create project"**

### 2. Enable Realtime Database

1. In your Firebase project, click **"Realtime Database"** in left menu
2. Click **"Create Database"**
3. Choose a location (US, Europe, etc.)
4. Start in **"locked mode"** (we'll add rules next)
5. Click **"Enable"**

### 3. Set Database Rules

1. Click the **"Rules"** tab
2. Replace the rules with:

```json
{
  "rules": {
    "games": {
      "$code": {
        ".read": true,
        ".write": "!data.exists() || data.child('host').val() === true"
      }
    }
  }
}
```

3. Click **"Publish"**

**Security:**
- ✅ Anyone can read game data (spectators can watch)
- ✅ Only the first writer (host) can update
- ✅ Games auto-delete when host stops sharing

### 4. Get Your Firebase Config

1. Click the gear icon ⚙️ next to **"Project Overview"**
2. Click **"Project settings"**
3. Scroll to **"Your apps"** section
4. Click the web icon `</>`
5. Register app (nickname: "pitch-scorekeeper-web")
6. Copy the `firebaseConfig` object

### 5. Configure the App

1. Open `firebase-config.js` in your editor
2. Replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",  // Paste your actual key
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

3. Save and refresh the app

### 6. Start Sharing!

**To host a game:**
1. Open Settings
2. Click **"📡 Share Game Live"**
3. Copy the 6-character code (e.g., `A3X9K2`)
4. Share the code with spectators

**To watch a game:**
1. Click **"👁️ Watch Game"** (top bar)
2. Enter the 6-character code
3. Click **"Watch Game"**
4. Enjoy live updates!

**What spectators see:**
- ⏱️ Live game timer
- 📊 Real-time scores and history
- 📖 Current game mode rules
- 🎉 Winner announcements

**Without Firebase:** App works perfectly as a local scorekeeper. Spectator mode just won't be available.

## How to Play

### Setting Up
1. Click **Settings** to open the drawer
2. Enter custom team names (optional)
3. Set your desired winning score (default: 52)
4. Close settings and start scoring!

### Scoring a Hand

#### Using Card Selection Mode (Default)
1. Each team's player reports which cards they won
2. Click the corresponding card buttons for each team
   - Cards are mutually exclusive (one team per card)
   - Selected cards show with gradient highlighting
3. Select which team **took the bid** using the radio buttons
4. Click **Apply Hand to Score**
   - If bidder earned ≥ their bid: add earned points
   - If bidder earned < their bid: subtract bid amount
   - Opponent earns their points regardless

#### Using Manual Input Mode
1. Click **Manual Input** toggle at top of scoring section
2. Enter point totals directly for each team (0-10)
3. Select bid taker
4. Click **Apply Hand to Score**

### Bid Mechanics
- Enter bid amounts for each team (they auto-sync to sum to 10)
- The team with the higher bid is auto-selected as bid taker
- Bid taker selection is required before applying hand

### Winning the Game
- First team to reach winning score **and** make their bid in that hand wins
- Winner modal displays with score
- Click **Start New Game** to reset

## 📁 File Structure

```
Pitch Score/
├── index.html         # Main HTML structure with spectator UI
├── styles.css         # Vaporwave-themed styles + responsive design
├── script.js          # Game logic, Firebase sync, spectator mode
├── firebase-config.js # Firebase configuration (add your keys here)
└── README.md          # This file
```

## 🎴 Game Modes & Rules

### Scoring Modes Available

#### 4-Point (High/Low/Jack/Game)
Classic pitch: **High**, **Low**, **Jack**, **Game**
**Game** = most card points (Ten=10, Ace=4, King=3, Queen=2, Jack=1)

#### 5-Point (Add Off-Jack)
Adds **Off-Jack** (Jick) for 1 point

#### 6-Point (Add Joker)
Adds one **Joker** for 1 point

#### 7-Point
**A, J, Off-Jack, High Joker, Low Joker, 10, 2** (no 3)
🌙 Shoot the Moon available

#### 8-Point (No Jokers)
**A, J, Off-Jack, 10, 3 (3 pts), 2**
🌙 Shoot the Moon available

#### 9-Point
**High, Low, Jack, Five (5 pts), Game**

#### 10-Point (Jokers On) — Default
**A, J, Jick, High Joker, Low Joker, 10, 3 (3 pts), 2**
🌙 Shoot the Moon available

#### 11-Point
Adds **Off-Ace** to 10-point mode
🌙 Shoot the Moon available

#### 13-Point
Adds **Off-3 (3 pts)** to 10-point mode
🌙 Shoot the Moon available

### Universal Bidding Rules

1. **Bid Entry**: Bids auto-sum to the mode's total points
2. **Bid Taker**: Higher bidder takes the bid (auto-selected)
3. **Making the Bid**:
   - Earn ≥ bid → **add** earned points
   - Earn < bid → **subtract** bid amount
4. **Opponent**: Non-bidding team always scores their earned points
5. **Winning**: Reach winning score (default 52) **AND** make the bid in that hand

### Shoot the Moon 🌙

Available in modes: 7, 8, 9, 10, 11, 13-point

- **Risk**: Bidder attempts to capture ALL points
- **Success**: Instant win (game over immediately)
- **Failure**: Miss any point = instant loss
- Check the box before applying the hand

## 🛠️ Technologies

- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks!)
- **Real-time Sync**: Firebase Realtime Database (optional)
- **Persistence**: LocalStorage for offline play
- **Design**: Vaporwave aesthetic with CSS custom properties
- **Hosting**: Static files (deploy anywhere)

## 🎨 Customization

### Changing the Theme
Edit CSS variables in `styles.css`:

```css
:root {
  --vw-cyan: #4deeea;      /* Accent color 1 */
  --vw-pink: #f72585;      /* Accent color 2 */
  --vw-purple: #8a2be2;    /* Button gradients */
  /* ... more variables */
}
```

### Adding Custom Game Modes
Add to `pointModes` object in `script.js`:

```javascript
const pointModes = {
  // ... existing modes
  MyCustomMode: {
    label: 'Custom 12-Point',
    points: [
      { key: 'High', label: 'High', value: 2 },
      // ... define your points
    ]
  }
};
```

### Changing Default Winning Score
Update in `script.js`:

```javascript
let gameState = {
  // ...
  winningScore: 52, // Change this value
  // ...
};
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

Requires support for:
- CSS Grid
- CSS Custom Properties
- localStorage
- ES6 JavaScript (const, let, arrow functions, Set)

## Keyboard Shortcuts

| Shortcut       | Action                |
| -------------- | --------------------- |
| `Ctrl/Cmd + Z` | Undo last score       |
| `Ctrl/Cmd + N` | Start new game        |
| `Esc`          | Close settings drawer |

## Contributing

Feel free to fork, modify, and improve! Some ideas:
- Add player/partnership tracking
- Implement game statistics (win rates, average scores)
- Add sound effects for actions
- Create tournament mode with multiple games
- Export game history as CSV

## License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- Built with ❤️ for pitch players everywhere
- Game rules reference: [Trickster Cards - Pitch Variants](https://www.trickstertable.com)
- Real-time sync: [Firebase Realtime Database](https://firebase.google.com)
- No frameworks, no build tools—just clean code and retro vibes 🌴✨

## 📝 Privacy & Data

- **No user accounts** or login required
- **All game data** stored locally or in your own Firebase project
- **No analytics** or tracking
- **Share codes** expire when host stops sharing
- **You own your data** 100%

---

**Enjoy your game!** 🎴🎉

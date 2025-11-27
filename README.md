# 10-Point Pitch Score Keeper

A modern, vaporwave-themed web application for tracking scores in 10-Point Pitch card games. Features intuitive scoring modes, bid tracking, and automatic winner detection with persistent game state.

![Vaporwave Theme](https://img.shields.io/badge/style-vaporwave-ff69b4)
![JavaScript](https://img.shields.io/badge/javascript-vanilla-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

## Features

### 🎯 Core Gameplay
- **Dual Scoring Modes**
  - **Card Selection**: Click individual cards (A, J, Jick, High Joker, Low Joker, 10, 3, 2) to track which points were earned
  - **Manual Input**: Directly enter point totals for faster scoring
  - Toggle between modes with a single click

- **Bid Tracking**
  - Auto-syncing bid inputs (bids always sum to 10)
  - Automatic bid taker selection based on higher bid
  - Bid success/failure logic: made bids add points, lost bids subtract the bid amount

- **Win Conditions**
  - Team must reach the winning score (default 52)
  - **Must take and make the bid** in the final hand to win
  - Prevents premature victories if bid wasn't taken

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
git clone <repository-url>
cd "Pitch Score"
```

### Running the App

Simply open `index.html` in any modern web browser:

```bash
open index.html
```

Or drag `index.html` into your browser window.

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

## File Structure

```
Pitch Score/
├── index.html       # Main HTML structure
├── styles.css       # Vaporwave-themed styles with responsive breakpoints
├── script.js        # Game logic, state management, and localStorage
└── README.md        # This file
```

## Game Rules: 10-Point Pitch

### Card Values
- **A** (Ace of Trump): 1 point
- **J** (Jack of Trump): 1 point
- **Jick** (Jack of Same Color): 1 point
- **High Joker**: 1 point
- **Low Joker**: 1 point
- **10** (Ten of Trump): 1 point
- **3** (Three of Trump): 3 points
- **2** (Two of Trump): 1 point

**Total per hand: 10 points**

### Bidding
- Teams bid on how many points they expect to earn
- Higher bid takes the hand
- If bid taker earns **≥ bid**: add earned points to score
- If bid taker earns **< bid**: subtract bid from score (penalty)
- Non-bidding team earns their points regardless

### Winning
- Play to a target score (typically 52 points)
- **Must take the bid** in the hand where you reach the winning score
- This prevents "riding" to victory without winning the bid

## Customization

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

### Adjusting Point Values
Modify `pointValues` object in `script.js`:

```javascript
const pointValues = {
  'A': 1,
  'J': 1,
  // ... adjust as needed
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

## Credits

Built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools, just clean code and retro vibes. 🌴✨

---

**Enjoy your game!** 🎴🎉

// Point modes and values
const pointModes = {
  TenPoint: {
    label: '10-Point (Jokers On)',
    points: [
      { key: 'A', label: 'A', value: 1 },
      { key: 'J', label: 'J', value: 1 },
      { key: 'Jick', label: 'Jick', value: 1 },
      { key: 'HighJoker', label: 'High Joker', value: 1 },
      { key: 'LowJoker', label: 'Low Joker', value: 1 },
      { key: '10', label: '10', value: 1 },
      { key: '3', label: '3', value: 3 },
      { key: '2', label: '2', value: 1 }
    ]
  },
  EightPointNoJokers: {
    label: '8-Point (No Jokers)',
    points: [
      { key: 'A', label: 'A', value: 1 },
      { key: 'J', label: 'J', value: 1 },
      { key: 'Jick', label: 'Jick', value: 1 },
      { key: '10', label: '10', value: 1 },
      { key: '3', label: '3', value: 3 },
      { key: '2', label: '2', value: 1 }
    ]
  }
};

let currentPointModeKey = 'TenPoint';
let pointValues = {};
let totalPointsInMode = 10;

// Game state
let gameState = {
  team1: {
    name: 'Team 1',
    score: 0
  },
  team2: {
    name: 'Team 2',
    score: 0
  },
  winningScore: 52,
  history: []
};

// Current hand state
let currentHand = {
  team1: new Set(),
  team2: new Set(),
  mode: 'cards', // 'cards' or 'manual'
  manual: {
    team1: 0,
    team2: 0
  }
};

// Track the result of the most recently applied hand
let lastHandResult = {
  bidTaker: null, // 1 or 2
  madeBid: false  // true if bid taker met/exceeded their bid in the last hand
};

// Prevent further scoring/actions once a winner is declared
let gameOver = false;

// DOM elements
const team1Element = document.getElementById('team1');
const team2Element = document.getElementById('team2');
const team1Score = team1Element.querySelector('.score');
const team2Score = team2Element.querySelector('.score');
const team1Name = team1Element.querySelector('.team-name');
const team2Name = team2Element.querySelector('.team-name');
const winningScoreInput = document.getElementById('winningScore');
const newGameBtn = document.getElementById('newGame');
const undoBtn = document.getElementById('undoBtn');
const historyList = document.getElementById('historyList');
const winnerModal = document.getElementById('winnerModal');
const winnerText = document.getElementById('winnerText');
const closeModalBtn = document.getElementById('closeModal');
const menuToggleBtn = document.getElementById('menuToggle');
const settingsDrawer = document.getElementById('settingsDrawer');
const drawerCloseBtn = document.getElementById('drawerClose');
const pointModeSelect = document.getElementById('pointMode');

// Bid elements
const bidInputs = document.querySelectorAll('.bid-input');
const bidTeamNames = document.querySelectorAll('.bid-team-name');

// Team name input elements
const team1NameInput = document.getElementById('team1NameInput');
const team2NameInput = document.getElementById('team2NameInput');

// Hand tracking elements
const handPointBtns = document.querySelectorAll('.hand-point-btn');
const handTeamNames = document.querySelectorAll('.hand-team-name');
const handTotalValues = document.querySelectorAll('.hand-total-value');
const applyHandBtn = document.getElementById('applyHandBtn');
const clearHandBtn = document.getElementById('clearHandBtn');
const bidTakerInputs = document.querySelectorAll('input[name="bidTaker"]');
const bidTakerLabels = document.querySelectorAll('[data-team-label]');
const modeCardsBtn = document.getElementById('modeCardsBtn');
const modeManualBtn = document.getElementById('modeManualBtn');
const manualTeam1Input = document.getElementById('manualTeam1');
const manualTeam2Input = document.getElementById('manualTeam2');
const shootMoonCheckbox = document.getElementById('shootMoonCheckbox');

// Initialize the game
function init() {
  loadGame();
  // Load point mode
  const savedMode = localStorage.getItem('pitchScorePointMode');
  if (savedMode && pointModes[savedMode]) {
    currentPointModeKey = savedMode;
  }
  applyPointMode(currentPointModeKey);
  if (pointModeSelect) pointModeSelect.value = currentPointModeKey;
  updateDisplay();
  updateBidTeamNames();
  updateHandTeamNames();
  attachEventListeners();
  // Enforce initial UI for score mode
  setScoreModeUI(currentHand.mode);
}

// Load game from localStorage
function loadGame() {
  const saved = localStorage.getItem('pitchScoreGame');
  if (saved) {
    gameState = JSON.parse(saved);
    updateAllTeamNames();
    winningScoreInput.value = gameState.winningScore;
  }
}

// Apply a point mode: sets point values, renders buttons, updates limits
function applyPointMode(modeKey) {
  const mode = pointModes[modeKey] || pointModes.TenPoint;
  currentPointModeKey = modeKey;
  localStorage.setItem('pitchScorePointMode', modeKey);
  // Build point values map and total
  pointValues = {};
  totalPointsInMode = 0;
  mode.points.forEach(p => {
    pointValues[p.key] = p.value;
    totalPointsInMode += p.value;
  });

  // Update bid input max and clamp values
  const team1BidInput = document.querySelector('.bid-input[data-team="1"]');
  const team2BidInput = document.querySelector('.bid-input[data-team="2"]');
  [team1BidInput, team2BidInput].forEach(inp => {
    if (!inp) return;
    inp.max = totalPointsInMode;
    let v = parseInt(inp.value) || 0;
    if (v > totalPointsInMode) inp.value = totalPointsInMode;
  });

  // Update manual input max
  if (manualTeam1Input) manualTeam1Input.max = totalPointsInMode;
  if (manualTeam2Input) manualTeam2Input.max = totalPointsInMode;
  currentHand.manual.team1 = Math.min(currentHand.manual.team1, totalPointsInMode);
  currentHand.manual.team2 = Math.min(currentHand.manual.team2, totalPointsInMode);

  // Re-render hand point buttons for both teams
  const grids = document.querySelectorAll('.hand-points-grid');
  grids.forEach(grid => {
    const team = grid.closest('.hand-team').querySelector('.hand-team-name').dataset.team;
    grid.innerHTML = mode.points.map(p => `<button class="hand-point-btn" data-team="${team}" data-point="${p.key}">${p.label}</button>`).join('');
  });

  // Re-bind point button listeners and clear current selections
  currentHand.team1.clear();
  currentHand.team2.clear();
  handPointBtnsRefetch();
  updateHandTotals();
  // Re-sync bids to sum to total
  syncBidInputs('1');
}

function handPointBtnsRefetch() {
  // Refresh query and click bindings for dynamic buttons
  const btns = document.querySelectorAll('.hand-point-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => toggleHandPoint(btn));
  });
}

// Update all team name displays
function updateAllTeamNames() {
  team1Name.textContent = gameState.team1.name;
  team2Name.textContent = gameState.team2.name;
  team1NameInput.value = gameState.team1.name;
  team2NameInput.value = gameState.team2.name;
  updateBidTeamNames();
  updateHandTeamNames();
}

// Save game to localStorage
function saveGame() {
  gameState.team1.name = team1Name.textContent;
  gameState.team2.name = team2Name.textContent;
  gameState.winningScore = parseInt(winningScoreInput.value);
  localStorage.setItem('pitchScoreGame', JSON.stringify(gameState));
}

// Update display
function updateDisplay() {
  team1Score.textContent = gameState.team1.score;
  team2Score.textContent = gameState.team2.score;
  updateHistory();
  updateBidTeamNames();
  undoBtn.disabled = gameState.history.length === 0;
  saveGame();
  checkWinner();
}

// Update bid section team names
function updateBidTeamNames() {
  bidTeamNames.forEach(nameEl => {
    const team = nameEl.dataset.team;
    const teamKey = team === '1' ? 'team1' : 'team2';
    nameEl.textContent = gameState[teamKey].name;
  });
}

// Update hand section team names
function updateHandTeamNames() {
  handTeamNames.forEach(nameEl => {
    const team = nameEl.dataset.team;
    const teamKey = team === '1' ? 'team1' : 'team2';
    nameEl.textContent = gameState[teamKey].name;
  });
  // Also update bid taker labels
  bidTakerLabels.forEach(labelEl => {
    const team = labelEl.getAttribute('data-team-label');
    const teamKey = team === '1' ? 'team1' : 'team2';
    labelEl.textContent = gameState[teamKey].name;
  });
}

// Sync bid inputs (when one changes, update the other to remaining points)
function syncBidInputs(changedTeam) {
  const team1BidInput = document.querySelector('.bid-input[data-team="1"]');
  const team2BidInput = document.querySelector('.bid-input[data-team="2"]');

  if (changedTeam === '1') {
    const team1Bid = parseInt(team1BidInput.value) || 0;
    const remaining = Math.max(0, totalPointsInMode - team1Bid);
    team2BidInput.value = remaining;
  } else {
    const team2Bid = parseInt(team2BidInput.value) || 0;
    const remaining = Math.max(0, totalPointsInMode - team2Bid);
    team1BidInput.value = remaining;
  }

  // Auto-select bid taker based on higher bid
  const b1 = Math.min(parseInt(team1BidInput.value) || 0, totalPointsInMode);
  const b2 = Math.min(parseInt(team2BidInput.value) || 0, totalPointsInMode);
  let selected = null;
  if (b1 > b2) selected = '1';
  else if (b2 > b1) selected = '2';
  // If equal or both zero, clear selection
  bidTakerInputs.forEach(input => {
    input.checked = selected ? (input.value === selected) : false;
  });
}

// Toggle hand point button
function toggleHandPoint(btn) {
  const team = btn.dataset.team;
  const point = btn.dataset.point;
  const teamKey = team === '1' ? 'team1' : 'team2';

  if (currentHand[teamKey].has(point)) {
    currentHand[teamKey].delete(point);
    btn.classList.remove('selected');
  } else {
    // Remove from other team if selected there
    const otherTeam = team === '1' ? 'team2' : 'team1';
    if (currentHand[otherTeam].has(point)) {
      currentHand[otherTeam].delete(point);
      const otherBtn = document.querySelector(`.hand-point-btn[data-team="${team === '1' ? '2' : '1'}"][data-point="${point}"]`);
      if (otherBtn) otherBtn.classList.remove('selected');
    }

    currentHand[teamKey].add(point);
    btn.classList.add('selected');
  }

  updateHandTotals();
}

// Update hand totals
function updateHandTotals() {
  handTotalValues.forEach(totalEl => {
    const team = totalEl.dataset.team;
    const teamKey = team === '1' ? 'team1' : 'team2';

    let total = 0;
    if (currentHand.mode === 'manual') {
      total = currentHand.manual[teamKey];
    } else {
      currentHand[teamKey].forEach(point => {
        total += pointValues[point];
      });
    }

    totalEl.textContent = total;
  });
}

// Clear current hand
function clearHand() {
  currentHand.team1.clear();
  currentHand.team2.clear();
  currentHand.manual.team1 = 0;
  currentHand.manual.team2 = 0;

  handPointBtns.forEach(btn => {
    btn.classList.remove('selected');
  });

  updateHandTotals();
  // Clear bid taker selection
  bidTakerInputs.forEach(i => { i.checked = false; });
  manualTeam1Input.value = 0;
  manualTeam2Input.value = 0;
  shootMoonCheckbox.checked = false;
}

// Apply hand to score
function applyHand() {
  if (gameOver) {
    alert('Game is over. Start a new game to continue.');
    return;
  }
  const team1Total = currentHand.mode === 'manual'
    ? (parseInt(currentHand.manual.team1) || 0)
    : Array.from(currentHand.team1).reduce((sum, point) => sum + pointValues[point], 0);
  const team2Total = currentHand.mode === 'manual'
    ? (parseInt(currentHand.manual.team2) || 0)
    : Array.from(currentHand.team2).reduce((sum, point) => sum + pointValues[point], 0);

  if (team1Total === 0 && team2Total === 0) {
    alert('Please select points for at least one team');
    return;
  }

  // Get bid info
  const team1BidInput = document.querySelector('.bid-input[data-team="1"]');
  const team2BidInput = document.querySelector('.bid-input[data-team="2"]');
  const team1Bid = parseInt(team1BidInput.value) || 0;
  const team2Bid = parseInt(team2BidInput.value) || 0;

  // Determine who had the bid (from selection)
  let bidTeam = null;
  bidTakerInputs.forEach(input => { if (input.checked) bidTeam = parseInt(input.value); });
  if (!bidTeam) {
    alert('Please select who took the bid (Team 1 or Team 2).');
    return;
  }

  // Check if Shoot the Moon is active
  const shootingMoon = shootMoonCheckbox.checked;

  // Build description
  let description1, description2;
  if (currentHand.mode === 'manual') {
    description1 = `Hand: manual (${team1Total})`;
    description2 = `Hand: manual (${team2Total})`;
  } else {
    const team1Points = Array.from(currentHand.team1).join(', ');
    const team2Points = Array.from(currentHand.team2).join(', ');
    description1 = `Hand: ${team1Points || 'none'} (${team1Total})`;
    description2 = `Hand: ${team2Points || 'none'} (${team2Total})`;
  }

  // Handle Shoot the Moon
  if (shootingMoon) {
    const bidderTotal = bidTeam === 1 ? team1Total : team2Total;
    const bidderKey = bidTeam === 1 ? 'team1' : 'team2';
    const bidderName = gameState[bidderKey].name;

    if (bidderTotal === totalPointsInMode) {
      // Moon shot successful - instant win
      lastHandResult = { bidTaker: bidTeam, madeBid: true };
      const desc = bidTeam === 1 ? description1 : description2;
      showWinner(bidderName, gameState[bidderKey].score, true);
      addPoints(bidTeam, 0, `${desc} - 🌙 SHOT THE MOON! Instant Win!`);
    } else {
      // Moon shot failed - instant loss
      const otherTeam = bidTeam === 1 ? 2 : 1;
      const otherKey = otherTeam === 1 ? 'team1' : 'team2';
      const otherName = gameState[otherKey].name;
      lastHandResult = { bidTaker: bidTeam, madeBid: false };
      showWinner(otherName, gameState[otherKey].score, true);
      const desc = bidTeam === 1 ? description1 : description2;
      addPoints(bidTeam, 0, `${desc} - 🌙 MISSED THE MOON! Instant Loss!`);
    }
    clearHand();
    return;
  }

  // Handle normal bid results
  if (bidTeam === 1) {
    if (team1Total >= team1Bid) {
      addPoints(1, team1Total, `${description1} - Made bid (${team1Bid})`);
      lastHandResult = { bidTaker: 1, madeBid: true };
    } else {
      addPoints(1, -team1Bid, `${description1} - Lost bid (${team1Bid})`);
      lastHandResult = { bidTaker: 1, madeBid: false };
    }
    if (team2Total > 0) {
      addPoints(2, team2Total, description2);
    }
  } else if (bidTeam === 2) {
    if (team2Total >= team2Bid) {
      addPoints(2, team2Total, `${description2} - Made bid (${team2Bid})`);
      lastHandResult = { bidTaker: 2, madeBid: true };
    } else {
      addPoints(2, -team2Bid, `${description2} - Lost bid (${team2Bid})`);
      lastHandResult = { bidTaker: 2, madeBid: false };
    }
    if (team1Total > 0) {
      addPoints(1, team1Total, description1);
    }
  }

  clearHand();
}

// Add points to a team
function addPoints(team, points, description = '') {
  const teamKey = team === 1 ? 'team1' : 'team2';
  const oldScore = gameState[teamKey].score;
  gameState[teamKey].score += points;

  // Prevent negative scores
  if (gameState[teamKey].score < 0) {
    gameState[teamKey].score = 0;
  }

  // Add to history
  const teamName = gameState[teamKey].name;
  const action = points > 0 ? '+' : '';
  gameState.history.push({
    team: teamKey,
    points: points,
    newScore: gameState[teamKey].score,
    oldScore: oldScore,
    description: description || `${action}${points}`,
    teamName: teamName,
    timestamp: new Date().toLocaleTimeString()
  });

  updateDisplay();
}



// Undo last score
function undoLastScore() {
  if (gameState.history.length === 0) return;

  const lastAction = gameState.history.pop();
  gameState[lastAction.team].score = lastAction.oldScore;

  updateDisplay();
}

// Update history display
function updateHistory() {
  historyList.innerHTML = '';

  // Show last 10 entries in reverse order
  const recentHistory = gameState.history.slice(-10).reverse();

  recentHistory.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const action = entry.points > 0 ? '+' : '';
    div.textContent = `${entry.timestamp} - ${entry.teamName}: ${action}${entry.points} (${entry.description}) → ${entry.newScore}`;
    historyList.appendChild(div);
  });
}

// Check for winner
function checkWinner() {
  if (gameOver) return;
  const winScore = parseInt(winningScoreInput.value);
  // Only declare winner if the team that reached the winning score
  // also took and made the bid in the most recently applied hand.
  if (gameState.team1.score >= winScore && lastHandResult.bidTaker === 1 && lastHandResult.madeBid) {
    showWinner(gameState.team1.name, gameState.team1.score);
  } else if (gameState.team2.score >= winScore && lastHandResult.bidTaker === 2 && lastHandResult.madeBid) {
    showWinner(gameState.team2.name, gameState.team2.score);
  }
}

// Show winner modal
function showWinner(teamName, score, isMoonShot = false) {
  gameOver = true;
  if (isMoonShot) {
    winnerText.textContent = `🌙 ${teamName} wins by shooting the moon! 🌙`;
  } else {
    winnerText.textContent = `${teamName} wins with ${score} points!`;
  }
  winnerModal.classList.add('show');
}

// Start new game
function startNewGame() {
  if (confirm('Start a new game? Current scores will be reset.')) {
    gameState.team1.score = 0;
    gameState.team2.score = 0;
    gameState.history = [];
    winnerModal.classList.remove('show');
    clearHand();
    lastHandResult = { bidTaker: null, madeBid: false };
    gameOver = false;
    updateDisplay();
  }
}

// Attach event listeners
function attachEventListeners() {
  // Drawer toggle
  const openDrawer = () => {
    settingsDrawer.classList.add('open');
    settingsDrawer.setAttribute('aria-hidden', 'false');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
  };
  const closeDrawer = () => {
    settingsDrawer.classList.remove('open');
    settingsDrawer.setAttribute('aria-hidden', 'true');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
  };
  menuToggleBtn.addEventListener('click', openDrawer);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Hand point buttons
  handPointBtns.forEach(btn => {
    btn.addEventListener('click', () => toggleHandPoint(btn));
  });

  // Mode toggle buttons
  const handManualContainers = document.querySelectorAll('.hand-manual');
  const handPointsGrids = document.querySelectorAll('.hand-points-grid');
  const setMode = (mode) => {
    currentHand.mode = mode;
    setScoreModeUI(mode, handManualContainers, handPointsGrids);
    updateHandTotals();
  };
  modeCardsBtn.addEventListener('click', () => setMode('cards'));
  modeManualBtn.addEventListener('click', () => setMode('manual'));

  // Manual inputs
  manualTeam1Input.addEventListener('input', () => {
    currentHand.manual.team1 = Math.max(0, Math.min(10, parseInt(manualTeam1Input.value) || 0));
    manualTeam1Input.value = currentHand.manual.team1;
    updateHandTotals();
  });

  manualTeam2Input.addEventListener('input', () => {
    currentHand.manual.team2 = Math.max(0, Math.min(10, parseInt(manualTeam2Input.value) || 0));
    manualTeam2Input.value = currentHand.manual.team2;
    updateHandTotals();
  });

  // Apply and clear hand buttons
  applyHandBtn.addEventListener('click', applyHand);
  clearHandBtn.addEventListener('click', clearHand);

  // Point mode change
  if (pointModeSelect) {
    pointModeSelect.addEventListener('change', (e) => {
      applyPointMode(e.target.value);
    });
  }

  // Bid taker change: no logic needed beyond storing selection; labels update via name changes

  // New game button
  newGameBtn.addEventListener('click', startNewGame);
  closeModalBtn.addEventListener('click', startNewGame);

  // Undo button
  undoBtn.addEventListener('click', undoLastScore);

  // Winning score change
  winningScoreInput.addEventListener('change', () => {
    saveGame();
  });

  // Team name changes
  team1Name.addEventListener('blur', () => {
    saveGame();
    updateBidTeamNames();
  });
  team2Name.addEventListener('blur', () => {
    saveGame();
    updateBidTeamNames();
  });

  // Team name input changes
  team1NameInput.addEventListener('input', () => {
    gameState.team1.name = team1NameInput.value || 'Team 1';
    updateAllTeamNames();
    saveGame();
  });

  team2NameInput.addEventListener('input', () => {
    gameState.team2.name = team2NameInput.value || 'Team 2';
    updateAllTeamNames();
    saveGame();
  });

  // Bid input changes - sync with other team
  bidInputs.forEach(input => {
    input.addEventListener('input', () => {
      const team = input.dataset.team;
      syncBidInputs(team);
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Z for undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      undoLastScore();
    }
    // Ctrl/Cmd + N for new game
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      startNewGame();
    }
  });
}

// Update UI according to score mode
function setScoreModeUI(mode, handManualContainers, handPointsGrids) {
  // Lazily query if not provided
  const manualEls = handManualContainers || document.querySelectorAll('.hand-manual');
  const gridEls = handPointsGrids || document.querySelectorAll('.hand-points-grid');
  if (mode === 'manual') {
    modeManualBtn.classList.add('active');
    modeCardsBtn.classList.remove('active');
    manualEls.forEach(el => el.hidden = false);
    gridEls.forEach(el => el.hidden = true);
  } else {
    modeCardsBtn.classList.add('active');
    modeManualBtn.classList.remove('active');
    manualEls.forEach(el => el.hidden = true);
    gridEls.forEach(el => el.hidden = false);
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

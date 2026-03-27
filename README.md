# 🐺 Wolfs vs Dog 🐶

> A Cuphead-inspired 1930s cartoon-style browser strategy board game with a **learning AI opponent**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![SCSS](https://img.shields.io/badge/SCSS-Cuphead_Design-CC6699?logo=sass)

---

## 🎮 About the Game

On an 8×8 checkerboard-like surface, **1 wolf** faces off against **4 dogs**. The player freely chooses a role – the other side is controlled by a **minimax-based learning AI** that gets stronger game by game.

| Role | Pieces | Movement | Goal |
|------|--------|----------|------|
| 🐺 **Wolf** | 1 | Diagonally, all 4 directions | Break through the dog line |
| 🐶 **Dogs** | 4 | Diagonally, forward only (downward) | Trap the wolf |

### Win Conditions

- **Dogs win:** the wolf is trapped with no valid moves
- **Wolf wins:** broke through the dog line (got behind them), OR the dogs cannot move

---

## 🎨 Design

The visual style is inspired by **Cuphead** – a **1930s Fleischer Studios cartoon aesthetic**.

- 🎞️ Film grain texture + vignette overlay
- ✏️ Hand-drawn style outlines and buttons
- 🎪 Rubber hose style characters via CSS art
- 📜 Parchment and wood textures on the board
- 🔤 Retro typefaces (Luckiest Guy, Boogaloo)
- 🪄 Bouncy animations (bounce, squash & stretch, wobble)

> The entire UI is built with **HTML + SCSS** – no Canvas API. CSS Grid board, CSS transitions/keyframes animations.

---

## 🧠 AI System

| Property | Details |
|----------|---------|
| **Algorithm** | Minimax + Alpha-Beta pruning |
| **Search depth** | 8–12 moves ahead (iterative deepening) |
| **Time limit** | 2000ms per move |
| **Cache** | Zobrist hash-based transposition table (100K entries) |
| **Evaluation** | 10-factor heuristic (mobility, formation, escape routes, etc.) |
| **Learning** | Weight updates after every game – `localStorage` persistence |
| **Effect** | Noticeable improvement after ~10-20 games |

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/katadebreczeni/wolf-vs-dogs.git
cd wolf-vs-dogs

# Install dependencies
yarn install

# Start dev server
yarn dev

# Production build
yarn build

# Preview production build
yarn preview
```

---

## 📁 Project Structure

```
src/
├── ai/                    # AI module
│   ├── aiPlayer.ts        #   AI entry point
│   ├── evaluation.ts      #   Position evaluation heuristics
│   ├── learningStore.ts   #   Learned weights (localStorage)
│   ├── minimax.ts         #   Minimax + alpha-beta algorithm
│   └── transpositionTable.ts  # Zobrist hash cache
│
├── components/            # React UI components
│   ├── GameBoard.tsx      #   8×8 CSS Grid board
│   ├── GameOverModal.tsx  #   Game over modal (victory/defeat)
│   ├── MainMenu.tsx       #   Start screen, role selection
│   ├── Piece.tsx          #   Game piece (rubber hose CSS art)
│   ├── Square.tsx         #   Single square component
│   ├── StatsDisplay.tsx   #   Statistics display
│   └── StatusPanel.tsx    #   Game state messages
│
├── game/                  # Game logic (React-free, pure functions)
│   ├── board.ts           #   Board, squares, initialization
│   ├── gameState.ts       #   Reducer (GameState + GameAction)
│   ├── moves.ts           #   Move validation & generation
│   └── winCondition.ts    #   Win condition checks
│
├── hooks/                 # Custom React hooks
│   ├── useAI.ts           #   AI move handling (async + delay)
│   ├── useGameState.ts    #   Main game state (useReducer)
│   └── useStats.ts        #   Statistics (localStorage)
│
├── styles/                # SCSS (Cuphead design system)
│   ├── _animations.scss   #   Bounce, shake, grain, wobble, etc.
│   ├── _base.scss         #   Reset, vignette, grain overlay
│   ├── _board.scss        #   Board grid, squares, textures
│   ├── _buttons.scss      #   Retro hard-shadow buttons
│   ├── _menu.scss         #   Main menu vintage poster
│   ├── _modal.scss        #   Game over modal + confetti
│   ├── _pieces.scss       #   Rubber hose pieces
│   ├── _stats.scss        #   Statistics scoreboard
│   ├── _status.scss       #   Status panel parchment
│   ├── _typography.scss   #   Retro font imports
│   ├── _variables.scss    #   Cuphead palette, sizes, fonts
│   └── main.scss          #   SCSS entry point
│
├── types/                 # TypeScript type definitions
│   ├── ai.ts              #   AI types
│   └── game.ts            #   Game types
│
├── App.tsx                # Main application (screen routing)
└── main.tsx               # Entry point
```

---

## 🎯 Tech Stack

| Technology | Version | Role |
|------------|---------|------|
| **React** | 19 | UI components |
| **TypeScript** | 5.7 | Strict type safety (`any` is forbidden) |
| **Vite** | 6 | Bundler + dev server |
| **SCSS** | (Dart Sass) | Cuphead design system |

---

## 🕹️ Gameplay Flow

```
1. MENU       →  Choose your role (wolf or dogs)
2. SETUP      →  Place the wolf on the board
3. PLAYING    →  Alternating turns (human + AI)
4. GAME OVER  →  Result + statistics + AI learning
```

### Controls

- **Click** on your piece → select it + show valid moves
- **Click** on a green square → execute the move
- **Click** on another piece → switch selection
- During AI turn the board is **non-interactive**

---

## 📊 Persistence

Stored in the browser's `localStorage`:
- **Game statistics** – win/loss, breakdown by role
- **AI learned weights** – evaluation heuristic parameters
- **Position memory** – up to 500 remembered board states

---

## 📝 License

MIT

---

<p align="center">
  <i>"A good wolf always finds a way through."</i> 🐺
</p>


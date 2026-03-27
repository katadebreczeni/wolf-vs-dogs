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

The AI features **5 progressive difficulty levels** – starting very easy for beginners and scaling up to a formidable opponent.

| Level | Name | Search Depth | Blunder % | Description |
|-------|------|-------------|-----------|-------------|
| 1 | 🌱 **Seedling** | 1 | 60% | Very beginner – almost random moves |
| 2 | 🌿 **Sprout** | 2-3 | 35% | Beginner – sometimes plays well, easy to beat |
| 3 | 🌳 **Sapling** | 4-5 | 15% | Medium – thinks ahead, has some weak spots |
| 4 | 🌲 **Tree** | 6-8 | 5% | Hard – rarely blunders, strategically strong |
| 5 | 🏰 **Giant** | 10-12 | 0% | Master – full minimax + learning, very hard to beat |

Levels unlock progressively based on cumulative wins (0 → 3 → 8 → 15 → 25).

### 🌱 Magic Beanstalk

Your progress is visualized as a **1930s cartoon-style magic beanstalk** growing next to the board. As you level up, the beanstalk grows taller – from a tiny seedling to a giant vine reaching a castle in the clouds!

### Technical Details

| Property | Details |
|----------|---------|
| **Algorithm** | Minimax + Alpha-Beta pruning |
| **Iterative deepening** | Depth 1 → max (level-dependent) |
| **Cache** | Zobrist hash transposition table (100K entries) |
| **Evaluation** | 10-factor heuristic (mobility, formation, escape routes, etc.) |
| **Learning** | Weight updates after games (levels 4-5 only) |

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
│   ├── Beanstalk.tsx      #   Magic beanstalk progress visualization
│   ├── DifficultySelector.tsx # Difficulty level picker
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
│   ├── _beanstalk.scss    #   Magic beanstalk CSS art + grow animation
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
- **Difficulty progress** – highest unlocked level, selected level
- **AI learned weights** – evaluation heuristic parameters (levels 4-5)
- **Position memory** – up to 500 remembered board states

---

## 📝 License

MIT

---

<p align="center">
  <i>"A good wolf always finds a way through."</i> 🐺
</p>


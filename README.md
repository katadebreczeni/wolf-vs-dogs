# 🐺 Wolfs vs Dog 🐶

> Cuphead-inspirált, 1930-as évek rajzfilmstílusú böngészős stratégiai táblajáték **tanuló AI ellenféllel**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![SCSS](https://img.shields.io/badge/SCSS-Cuphead_Design-CC6699?logo=sass)

---

## 🎮 A játékról

Egy 8×8-as sakktábla-szerű felületen **1 farkas** és **4 kutya** csap össze. A játékos szabadon választ szerepet – a másik oldalt egy **minimax-alapú, tanuló AI** irányítja, ami partikról partira egyre erősebb.

| Szerep | Figurák | Mozgás | Cél |
|--------|---------|--------|-----|
| 🐺 **Farkas** | 1 db | Átlósan, mind a 4 irányba | Áttörni a kutyák vonalán |
| 🐶 **Kutyák** | 4 db | Átlósan, csak előre (lefelé) | Bekeríteni a farkast |

### Győzelmi feltételek

- **Kutyák nyernek:** a farkas bekerítve, nincs érvényes lépése
- **Farkas nyer:** áttörte a kutyák vonalát (mögéjük került), VAGY a kutyák nem tudnak lépni

---

## 🎨 Design

A megjelenés a **Cuphead** játék grafikáját idézi: **1930-as évek Fleischer Studios rajzfilmstílus**.

- 🎞️ Szemcsés film textúra + vignette overlay
- ✏️ Kézzel rajzolt hatású körvonalak és gombok
- 🎪 Rubber hose stílusú figurák CSS art-tal
- 📜 Pergamen és fa textúrák a táblán
- 🔤 Retro betűtípusok (Luckiest Guy, Boogaloo)
- 🪄 Pattogós animációk (bounce, squash & stretch, wobble)

> A teljes UI **HTML + SCSS** – nincs Canvas API. CSS Grid tábla, CSS transitions/keyframes animációk.

---

## 🧠 AI rendszer

| Tulajdonság | Részletek |
|-------------|-----------|
| **Algoritmus** | Minimax + Alpha-Beta vágás |
| **Keresési mélység** | 8–12 lépés előre (iteratív mélyítés) |
| **Időlimit** | 2000ms / lépés |
| **Cache** | Zobrist hash alapú tranzíciós tábla (100K entry) |
| **Értékelés** | 10 faktoros heurisztika (mobilitás, formáció, áttörési utak, stb.) |
| **Tanulás** | Súlyfrissítés minden játék után – `localStorage` perzisztencia |
| **Hatás** | ~10-20 játék után érezhető javulás |

---

## 🚀 Telepítés és futtatás

```bash
# Klónozás
git clone https://github.com/katadebreczeni/wolf-vs-dogs.git
cd wolf-vs-dogs

# Függőségek telepítése
yarn install

# Fejlesztői szerver indítása
yarn dev

# Production build
yarn build

# Build előnézet
yarn preview
```

---

## 📁 Mappastruktúra

```
src/
├── ai/                    # AI modul
│   ├── aiPlayer.ts        #   AI belépési pont
│   ├── evaluation.ts      #   Pozíció-értékelő heurisztika
│   ├── learningStore.ts   #   Tanuló súlyok (localStorage)
│   ├── minimax.ts         #   Minimax + alpha-beta algoritmus
│   └── transpositionTable.ts  # Zobrist hash cache
│
├── components/            # React UI komponensek
│   ├── GameBoard.tsx      #   8×8 CSS Grid tábla
│   ├── GameOverModal.tsx  #   Játék vége modal (victory/defeat)
│   ├── MainMenu.tsx       #   Kezdőképernyő, szerepválasztás
│   ├── Piece.tsx          #   Figura (rubber hose CSS art)
│   ├── Square.tsx         #   Egy mező komponens
│   ├── StatsDisplay.tsx   #   Statisztika kijelző
│   └── StatusPanel.tsx    #   Játékállapot üzenetek
│
├── game/                  # Játéklogika (React-mentes)
│   ├── board.ts           #   Tábla, mezők, inicializálás
│   ├── gameState.ts       #   Reducer (GameState + GameAction)
│   ├── moves.ts           #   Lépés validáció, generálás
│   └── winCondition.ts    #   Győzelmi feltételek
│
├── hooks/                 # Custom React hookok
│   ├── useAI.ts           #   AI lépés kezelés (async + delay)
│   ├── useGameState.ts    #   Fő játékállapot (useReducer)
│   └── useStats.ts        #   Statisztikák (localStorage)
│
├── styles/                # SCSS (Cuphead design rendszer)
│   ├── _animations.scss   #   Bounce, shake, grain, wobble, stb.
│   ├── _base.scss         #   Reset, vignette, grain overlay
│   ├── _board.scss        #   Tábla grid, mezők, textúrák
│   ├── _buttons.scss      #   Retro hard-shadow gombok
│   ├── _menu.scss         #   Főmenü vintage poster
│   ├── _modal.scss        #   Game Over modal + confetti
│   ├── _pieces.scss       #   Rubber hose figurák
│   ├── _stats.scss        #   Statisztika scoreboard
│   ├── _status.scss       #   Státusz panel pergamen
│   ├── _typography.scss   #   Retro font imports
│   ├── _variables.scss    #   Cuphead paletta, méretek, fontok
│   └── main.scss          #   SCSS entry point
│
├── types/                 # TypeScript típusdefiníciók
│   ├── ai.ts              #   AI típusok
│   └── game.ts            #   Játék típusok
│
├── App.tsx                # Fő alkalmazás (screen routing)
└── main.tsx               # Belépési pont
```

---

## 🎯 Tech Stack

| Technológia | Verzió | Szerep |
|-------------|--------|--------|
| **React** | 19 | UI komponensek |
| **TypeScript** | 5.7 | Strict típusbiztonság (`any` tilos) |
| **Vite** | 6 | Bundler + dev szerver |
| **SCSS** | (Dart Sass) | Cuphead design rendszer |

---

## 🕹️ Játékmenet

```
1. MENU       →  Válassz szerepet (farkas vagy kutyák)
2. SETUP      →  Farkas elhelyezése a táblán
3. PLAYING    →  Felváltva lépés (ember + AI)
4. GAME OVER  →  Eredmény + statisztika + AI tanulás
```

### Irányítás

- **Kattints** egy figurádra → kijelölés + érvényes lépések megjelenése
- **Kattints** egy zöld mezőre → lépés végrehajtása
- **Kattints** másik figurádra → kijelölés átváltása
- AI kör alatt a tábla **nem interaktív**

---

## 📊 Perzisztencia

A böngésző `localStorage`-ában tárolódik:
- **Játékstatisztikák** – win/loss, breakdown szerep szerint
- **AI tanult súlyok** – az értékelő heurisztika paraméterei
- **Pozíció memória** – max 500 megjegyzett állás

---

## 📝 Licensz

MIT

---

<p align="center">
  <i>„A good wolf always finds a way through."</i> 🐺
</p>


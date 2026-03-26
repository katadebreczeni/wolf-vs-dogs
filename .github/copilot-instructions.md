# Wolfs vs Dog – Projekt instrukciók

## Projekt leírás
Böngészős játék React + TypeScript + Vite stack-kel. A játékban farkasok és kutyák csapnak össze. **Cuphead-inspirált** 1930-as évek rajzfilmstílusú design (rubber hose karakterek, vintage színpaletta, kézzel rajzolt hatás, szemcsés textúra).

## Tech Stack
- **React 19** + **TypeScript 5.7** (strict mód)
- **Vite 6** bundler
- **HTML + SCSS** a játék rendereléshez (CSS Grid tábla, CSS art figurák – **nincs Canvas API**)
- **SCSS** stíluskezelés (_variables, _board, _pieces, _animations, stb.)
- **Cuphead design** – 1930s cartoon stílus, retro fontok (Luckiest Guy, Boogaloo)

## Kódolási konvenciók
- Nyelv a kódban: **angol** (változónevek, függvények, kommentek)
- Kommunikáció a fejlesztővel: **magyar**
- Funkcionális komponensek, nincs class component
- Strict TypeScript – `any` használata tilos
- Custom hook-ok a `src/hooks/` mappában
- Típusok a `src/types/` mappában
- Komponensek a `src/components/` mappában
- Játék logika a `src/game/` mappában
- AI logika a `src/ai/` mappában
- SCSS stílusok a `src/styles/` mappában
- **Visszavonás (undo) nincs** – minden lépés végleges

## Mappastruktúra
```
src/
├── assets/        # Képek, hangok, sprite sheet-ek
├── components/    # React UI komponensek (GameBoard, Square, Piece, stb.)
├── game/          # Játék logika, engine, entitások
├── ai/            # AI modul (minimax, evaluation, learning)
├── hooks/         # Custom React hook-ok (useGameState, useAI)
├── styles/        # SCSS fájlok (Cuphead design rendszer)
├── types/         # TypeScript típusdefiníciók
├── App.tsx        # Fő alkalmazás komponens
├── main.tsx       # Belépési pont
└── vite-env.d.ts  # Vite típusok
```


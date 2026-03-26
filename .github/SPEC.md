# 🐺 Wolfs vs Dog – Részletes Játék Specifikáció

> Verzió: 4.0
> Utolsó frissítés: 2026-03-26

---

## 1. Játék áttekintés

### 1.1 Koncepció
Egyjátékos, körökre osztott stratégiai táblás játék **AI ellenféllel**, amely egy 8×8-as sakktábla-szerű felületen zajlik. A játékos szabadon választhat, hogy farkassal vagy kutyákkal szeretne játszani – a másik oldalt mindig a **számítógép (AI)** irányítja. Az AI egy **tanuló algoritmus**, amely partikról partira fejlődik és nehéz legyőzni. A tábla és a figurák **HTML elemekből és SCSS stílusokból** épülnek fel (nincs Canvas API) – ez gyorsabb renderelést és alacsonyabb memóriahasználatot biztosít. A felületet **egérrel (kattintással)** kell irányítani: a játékos rákattint a figurájára, majd kiválasztja a célmezőt. **Visszavonás nincs** – mint a sakkban, minden lépés végleges.

### 1.2 Játékosok
| Játékos | Típus | Szerep | Figurák | Cél |
|---------|-------|--------|---------|-----|
| **Human** | Ember | Farkas VAGY Kutyák (választható) | 1 farkas vagy 4 kutya | Szereptől függő |
| **AI** | Számítógép | Az ember által nem választott szerep | Ami maradt | Szereptől függő |

### 1.3 Szerepválasztás (Role Selection)
- A játék indításakor a felhasználó egy **kezdőképernyőn (Main Menu)** választ szerepet
- Két gomb: **"Play as Wolf 🐺"** / **"Play as Dogs 🐶"**
- A választás után indul a játék – az AI automatikusan a másik szerepet kapja
- A szerepválasztás **minden új játéknál** újra megtörténik

---

## 2. Tábla (Board)

### 2.1 Méret és felépítés
- **8×8-as rács** (64 mező összesen)
- Sakktábla mintázat: váltakozó **világos (light)** és **sötét (dark)** mezők
- **Csak a sötét mezők használhatók** – a figurák kizárólag sötét mezőkön állhatnak és mozoghatnak
- Ez összesen **32 használható mezőt** jelent

### 2.2 Koordináta-rendszer
- **Oszlopok (col):** `0–7` (balról jobbra, megjelenítésnél `A–H`)
- **Sorok (row):** `0–7` (fentről lefelé, megjelenítésnél `1–8`)
- A `(0, 0)` a bal felső sarok
- Egy mező **sötét**, ha `(row + col) % 2 === 1`

### 2.3 Vizuális megjelenés
```
     A   B   C   D   E   F   G   H
   +---+---+---+---+---+---+---+---+
 1 |   | D |   | D |   | D |   | D |   ← row 0 (kutyák kezdő sora)
   +---+---+---+---+---+---+---+---+
 2 |   |   |   |   |   |   |   |   |
   +---+---+---+---+---+---+---+---+
 3 |   |   |   |   |   |   |   |   |
   +---+---+---+---+---+---+---+---+
 4 |   |   |   |   |   |   |   |   |
   +---+---+---+---+---+---+---+---+
 5 |   |   |   |   |   |   |   |   |
   +---+---+---+---+---+---+---+---+
 6 |   |   |   |   |   |   |   |   |
   +---+---+---+---+---+---+---+---+
 7 |   |   |   |   |   |   |   |   |
   +---+---+---+---+---+---+---+---+
 8 |   |   |   |   |   |   |   | W |   ← row 7 (példa: farkas itt)
   +---+---+---+---+---+---+---+---+
```

> `D` = Dog (kutya), `W` = Wolf (farkas). A világos mezők (`   `) nem használhatók.

---

## 3. Figurák (Pieces)

### 3.1 Kutya (Dog)
- **Darabszám:** 4
- **Kezdőpozíciók:** A tábla **első sorának (row 0) sötét mezői**
  - `(0, 1)`, `(0, 3)`, `(0, 5)`, `(0, 7)`
- **Mozgás:** Átlósan, **csak előre** (növekvő row irányba, azaz "lefelé" a táblán)
  - Lehetséges lépések: `(row+1, col-1)` és `(row+1, col+1)`
- **Korlátozások:**
  - Nem léphet hátrafelé
  - Nem léphet a tábláról le
  - Nem léphet foglalt mezőre
  - Nincs ugrás (nem ugorhatja át a másik figurát)
  - Nincs ütés (nem ütheti le a farkast)

### 3.2 Farkas (Wolf)
- **Darabszám:** 1
- **Kezdőpozíció:** A játék elején a farkas játékos **tetszőleges sötét mezőre** helyezheti, **kivéve** a kutyák kezdő sorát (row 0)
  - Tehát: bármely sötét mező, ahol `row >= 1`
- **Mozgás:** Átlósan, **mind a 4 irányba**
  - Lehetséges lépések: `(row-1, col-1)`, `(row-1, col+1)`, `(row+1, col-1)`, `(row+1, col+1)`
- **Korlátozások:**
  - Nem léphet a tábláról le
  - Nem léphet foglalt mezőre
  - Nincs ugrás
  - Nincs ütés

---

## 4. Játékmenet (Game Flow)

### 4.1 Játékfázisok (Game Phases)

```
┌─────────────────────┐
│   MENU_PHASE        │  ← Szerepválasztás
│   (Role Selection)  │
└────────┬────────────┘
         │ Szerep kiválasztva
         ▼
┌─────────────────────┐
│   SETUP_PHASE       │  ← Farkas elhelyezése (ember VAGY AI)
│   (Wolf Placement)  │
└────────┬────────────┘
         │ Farkas lerakva
         ▼
┌─────────────────────┐
│   PLAYING_PHASE     │  ← Felváltva lépés (ember + AI)
│   (Alternating      │
│    Turns)           │◄────┐
└────────┬────────────┘     │
         │                  │
         ▼                  │
    Nyertes van? ──No──────►┘
         │
        Yes
         ▼
┌─────────────────────┐
│   GAME_OVER_PHASE   │  ← Eredmény kijelzése + tanulás
│   (Result Screen)   │
└─────────────────────┘
```

### 4.2 Részletes fázisleírás

#### 4.2.0 MENU fázis (Role Selection)
1. A játékos egy kezdőképernyőt lát a játék címével és két gombbal
2. **"Play as Wolf 🐺"** – a játékos farkas lesz, az AI kutyákkal játszik
3. **"Play as Dogs 🐶"** – a játékos kutyákkal játszik, az AI a farkas
4. Opcionálisan megjelenhet az AI aktuális statisztikája (nyert/vesztett)
5. Választás után → átmenet a SETUP fázisba

#### 4.2.1 SETUP fázis (Wolf Placement)
1. A kutyák automatikusan a kezdőpozícióikra kerülnek: `(0,1)`, `(0,3)`, `(0,5)`, `(0,7)`
2. **Ha az ember a farkas:**
   - A program jelzi: **"Place your wolf on any dark square! 🐺"**
   - A játékos kattint egy érvényes sötét mezőre (row ≥ 1)
   - **Érvénytelen elhelyezés esetén:**
     - Világos mezőre kattintás → hibaüzenet: *"Invalid placement! You can only place the wolf on a dark square."*
     - Kutyák sorába (row 0) kattintás → hibaüzenet: *"Invalid placement! The wolf cannot be placed on the dogs' starting row."*
     - Foglalt mezőre kattintás → hibaüzenet: *"Invalid placement! This square is already occupied."*
3. **Ha az AI a farkas:**
   - Az AI automatikusan kiválaszt egy **stratégiailag optimális** sötét mezőt
   - Rövid késleltetés (300-600ms) a "gondolkodás" szimulálására
   - Üzenet: *"AI is placing the wolf... 🤔"* → majd *"AI placed the wolf. Your turn! 🐶"*
4. Sikeres elhelyezés után → átmenet a PLAYING fázisba, a Dog Player következik

#### 4.2.2 PLAYING fázis (Alternating Turns)
1. A program jelzi, ki lép éppen: **"Your turn 🐺/🐶"** / **"AI is thinking... 🤔"**

2. **Ember köre (Human Turn):**
   - Ha **kutyákkal játszik:**
     - Kattint az egyik kutyájára → kijelölődik, megjelennek az érvényes lépések
     - Kattint egy érvényes célmezőre → a kutya odalép
     - Kattint egy másik kutyára → kijelölés átvált
     - Kattint érvénytelen mezőre → hibaüzenet: *"Invalid move! Try again."*
   - Ha **farkassal játszik:**
     - Kattint a farkasra → kijelölődik, megjelennek az érvényes lépések
     - Kattint egy érvényes célmezőre → a farkas odalép
     - Kattint érvénytelen mezőre → hibaüzenet: *"Invalid move! Try again."*

3. **AI köre (AI Turn):**
   - A tábla interakciója **letiltva** (nem kattintható)
   - Üzenet: *"AI is thinking... 🤔"*
   - Késleltetés: **400-800ms** (természetesebb érzés, ne legyen azonnali)
   - Az AI kiszámítja a legjobb lépést (Minimax + tanulás, ld. 15. fejezet)
   - A lépés automatikusan végrehajtódik, a tábla frissül
   - Az AI lépése vizuálisan kiemelődik (utolsó lépés jelölő)

4. **Minden lépés után:**
   - A tábla frissül
   - Ellenőrzés: van-e nyertes?
   - Ha nincs → következő játékos/AI köre
   - Ha igen → GAME_OVER fázis

#### 4.2.3 GAME_OVER fázis
1. A program kijelzi a nyertest:
   - Ember nyert: **"🎉 You win! Congratulations!"**
   - AI nyert: **"💀 AI wins! Better luck next time!"**
2. **Az AI frissíti a tanult súlyokat** a játék eredménye alapján (ld. 15.6)
3. Megjelenik a **"Play Again"** gomb → visszavisz a MENU fázisba
4. Megjelenik a **statisztika**: nyert/vesztett/összesen

### 4.3 Körök sorrendje
```
MENU:    Ember választ szerepet
SETUP:   Farkas játékos (ember VAGY AI) lerakja a farkast
TURN 1:  Dog Player lép (ember VAGY AI)
TURN 2:  Wolf Player lép (ember VAGY AI)
TURN 3:  Dog Player lép (ember VAGY AI)
... (felváltva folytatódik, mindig váltakozik ember és AI)
```

---

## 5. Győzelmi feltételek (Win Conditions)

### 5.1 Kutyák nyernek (Dogs Win)
A farkas **be van kerítve**: rajta van a sor és **egyetlen érvényes lépése sincs**.

Ez akkor történik, ha a farkas mind a 4 átlós szomszédja:
- a táblán kívülre esik, VAGY
- egy másik figura (kutya) foglalja el

**Formálisan:**
```
wolf.validMoves.length === 0
```

### 5.2 Farkas nyer (Wolf Wins)
A farkas **áttörte a kutyák vonalát**, vagyis olyan pozícióba került, ahonnan a kutyák már **nem tudják bekeríteni**.

Ez akkor történik, ha a farkas **a kutyák mögé került** – azaz a farkas `row` értéke **kisebb vagy egyenlő**, mint az összes kutya `row` értéke:
```
wolf.row <= Math.min(...dogs.map(d => d.row))
```

**Miért?** A kutyák csak előre (lefelé, növekvő row) tudnak lépni. Ha a farkas már mögöttük van (kisebb row), soha nem tudják utolérni → a farkas megnyerte a játékot.

### 5.3 Speciális esetek

#### 5.3.1 Kutyák nem tudnak lépni
Ha a Dog Player egyetlen kutyája sem tud érvényes lépést tenni (pl. mind a tábla szélén ragadt), a **farkas nyer**, mivel a kutyák nem tudnak tovább haladni.

#### 5.3.2 Ellenőrzés sorrendje (minden lépés után)
1. Farkas bekerítve? → **Dogs Win**
2. Farkas áttörte a vonalat? → **Wolf Wins**
3. Aktív játékos nem tud lépni? → **Ellenfél nyer**
4. Egyik sem → játék folytatódik

---

## 6. Lépés validáció (Move Validation)

### 6.1 Általános szabályok (mindkét figuratípusra)
Egy lépés érvényes, ha:
1. A célmező a **táblán belül** van: `0 <= row <= 7` és `0 <= col <= 7`
2. A célmező **sötét** mező: `(row + col) % 2 === 1`
3. A célmező **üres** (nem áll rajta másik figura)
4. A célmező **átlósan szomszédos** a kiindulási mezővel (pontosan 1 lépés távolságra)

### 6.2 Kutya-specifikus validáció
- A célmező **row értéke nagyobb** kell legyen, mint az aktuális: `targetRow === currentRow + 1`
- Két lehetséges célmező: `(row+1, col-1)` és `(row+1, col+1)`

### 6.3 Farkas-specifikus validáció
- Négy lehetséges célmező:
  - `(row-1, col-1)` – bal-fel
  - `(row-1, col+1)` – jobb-fel
  - `(row+1, col-1)` – bal-le
  - `(row+1, col+1)` – jobb-le

### 6.4 Érvényes lépések kiszámítása
```typescript
function getValidMoves(piece: Piece, board: Board): Position[] {
  const directions = piece.type === 'wolf'
    ? [[-1,-1], [-1,1], [1,-1], [1,1]]  // all 4 diagonals
    : [[1,-1], [1,1]];                    // forward only

  return directions
    .map(([dr, dc]) => ({ row: piece.row + dr, col: piece.col + dc }))
    .filter(pos =>
      pos.row >= 0 && pos.row <= 7 &&
      pos.col >= 0 && pos.col <= 7 &&
      !isOccupied(pos, board)
    );
}
```

---

## 7. Vizuális design – Cuphead-inspirált 1930-as évek stílus

> A játék megjelenése a **Cuphead** nevű játék grafikáját idézi: **1930-as évek rajzfilmstílus** (Fleischer Studios, korai Disney). Kézzel rajzolt hatás, vintage színpaletta, szemcsés textúra, gumicsöves (rubber hose) karakterek, és túlzó, pattogós animációk.

### 7.1 Stílus alapelvek

| Alapelv | Megvalósítás |
|---------|--------------|
| **Kézzel rajzolt hatás** | Egyenetlen, "wobble" körvonalak CSS filterrel (`feTurbulence` SVG filter vagy `wavy border` trükk). A vonalak nem tökéletesen egyenesek. |
| **Vintage színpaletta** | Fakó, meleg tónusok – szépia-szerű alaphangulat, korlátozott, desaturált színek |
| **Szemcsés textúra (grain)** | CSS `background-image` SVG noise overlay az egész oldalon, vagy `::after` pseudo-element a konténereken |
| **Rubber hose karakterek** | A farkas és kutyák CSS-rajzolt figurák vastag körvonallal, kerek formákkal, nagy szemekkel, fehér kesztyűs kezekkel |
| **Vignette hatás** | Az oldal szélein sötétedő radiális gradiens overlay |
| **Régi film hatás** | Enyhe szépia filter + időnként "villogó" animáció (mint egy régi vetítőgép) |
| **Tipográfia** | Retro betűtípus (pl. Google Fonts: `'Luckiest Guy'`, `'Boogaloo'`, vagy `'Fredoka One'`) |
| **UI elemek** | Gombok, panelek, modalok mind vintage stílusúak – lekerekített de egyenetlen szegélyek, árnyékok, papír-textúra háttér |

### 7.2 Színpaletta

```
┌─────────────────────────────────────────────────────────────┐
│                    CUPHEAD COLOR PALETTE                     │
├──────────────────┬──────────┬───────────────────────────────┤
│  Szín neve       │  Hex     │  Használat                    │
├──────────────────┼──────────┼───────────────────────────────┤
│  Parchment       │ #F2E8D5  │  Fő háttér, világos mezők     │
│  Warm Cream      │ #E8D5B7  │  Kártyák, panelek háttere     │
│  Sepia Brown     │ #8B6914  │  Körvonalak, szöveg           │
│  Ink Black       │ #1A1A1A  │  Vastag kontúrok, szegélyek   │
│  Dusty Red       │ #C0392B  │  Farkasszín, hibák, veszély   │
│  Warm Gold       │ #D4A017  │  Kijelölés, highlight, csillag│
│  Forest Teal     │ #1A6B5A  │  Kutyaszín, érvényes lépések  │
│  Faded Blue      │ #5B7FA5  │  AI kiemelés, információ      │
│  Dusty Rose      │ #C97B84  │  Akcentus, gombok hover       │
│  Dark Walnut     │ #3E2723  │  Sötét mezők, erős kontraszt  │
│  Paper White     │ #FAF7F0  │  Szöveg háttér, modal         │
│  Vintage Yellow  │ #F4D03F  │  Győzelem, csillagok          │
└──────────────────┴──────────┴───────────────────────────────┘
```

### 7.3 Tábla design

A sakktábla úgy néz ki, mint egy **régi, megviselt deszka játéktábla**:

| Elem | Cuphead-stílusú megvalósítás |
|------|------------------------------|
| **Tábla keret** | Vastag, egyenetlen `border` (`4-6px solid $ink-black`), enyhe `rotate(0.3deg)` a "kézzel rajzolt" hatásért. Belső `box-shadow` a kopott hatáshoz. |
| **Világos mező** | `$parchment` háttér, enyhe papír-textúra (CSS noise pattern) |
| **Sötét mező** | `$dark-walnut` háttér, enyhe fa-textúra (CSS gradiens pattern) |
| **Mező szegélyek** | `1px solid rgba($ink-black, 0.3)` – vékony, nem tökéletesen egyenes hatás |
| **Sor/oszlop jelölők** | Retro font, `$sepia-brown` szín, mintha kézzel lennének ráírva |

### 7.4 Figurák design

A figurák **CSS-sel rajzolt, rubber hose stílusú karakterek**:

#### 🐺 Farkas (Wolf)
```
┌─────────────────────────────────────────┐
│  Kör alakú fej, hegyes fülek (CSS       │
│  triangle), nagy fehér szemek fekete    │
│  pupillával, piros nyelv kilóg.         │
│  Vastag fekete körvonal (3-4px).        │
│  Szín: $dusty-red (test) + $ink-black   │
│  (kontúr). Idle: enyhe "bounce"         │
│  animáció (translateY ±2px, 2s loop).   │
│  Selected: "expand" + glow.             │
└─────────────────────────────────────────┘
```
- **Idle animáció:** enyhe fel-le pattogás (`@keyframes bounce`)
- **Kijelölés:** méret növekedés (`scale(1.15)`) + arany glow (`box-shadow: 0 0 15px $warm-gold`)
- **AI mozgatja:** lépéskor "slide" animáció a célmezőre (`transition: transform 0.3s`)

#### 🐶 Kutya (Dog)
```
┌─────────────────────────────────────────┐
│  Kör alakú fej, lecsüngő fülek (CSS    │
│  border-radius trükk), nagy szemek,     │
│  boldog mosoly. Vastag fekete körvonal. │
│  Szín: $forest-teal (test) + $ink-black │
│  (kontúr). Idle: "tail wag" animáció   │
│  (rotate ±5deg, 1.5s loop egy kis       │
│  pseudo-element "farokkal").            │
└─────────────────────────────────────────┘
```
- **Idle animáció:** farokcsóválás szimulálás (enyhe rotate a figurán)
- **Kijelölés:** méret növekedés + arany glow (ugyanaz, mint a farkasnál)
- **Lépés után:** gyors "squash & stretch" animáció

### 7.5 Animációk

| Animáció | Leírás | CSS |
|----------|--------|-----|
| **Piece bounce** | Figurák idle állapotban enyhén pattognak | `@keyframes bounce { 0%,100% { translateY(0) } 50% { translateY(-3px) } }` |
| **Piece select glow** | Kiválasztott figurára arany sugárzás | `box-shadow: 0 0 12px 4px $warm-gold; scale(1.15)` |
| **Valid move pulse** | Érvényes célmezők lüktetnek | `@keyframes pulse { 0%,100% { opacity:0.4 } 50% { opacity:0.8 } }` |
| **Move slide** | Figura áthelyezésekor csúszó mozgás | `transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` (túllövéses easing) |
| **Squash & stretch** | Lépés érkezésekor összenyomódás | `@keyframes squash { 0% { scaleY(1.2) scaleX(0.8) } 100% { scaleY(1) scaleX(1) } }` |
| **Invalid shake** | Érvénytelen lépésnél rázás | `@keyframes shake { 0%,100% { translateX(0) } 25% { translateX(-5px) } 75% { translateX(5px) } }` |
| **Film flicker** | Háttéren random "villogás" | `@keyframes flicker { 0%,97%,100% { opacity:1 } 98% { opacity:0.95 } }` |
| **Grain noise** | Folyamatos szemcsézet az oldalon | Animált SVG `feTurbulence` vagy CSS noise pattern |
| **Vignette** | Sötét szélű overlay | `radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)` |
| **Title wobble** | Cím szöveg enyhén hullámzik | `@keyframes wobble` a főcímen |
| **Button hover** | Gombok felnagyobbodnak + árnyék nő | `transform: scale(1.05); box-shadow` transition |
| **AI thinking dots** | "AI is thinking..." melletti animált pontok | `@keyframes dots` (három pont váltakozva jelenik meg) |
| **Victory confetti** | Győzelem animáció | CSS `@keyframes fall` random pozíciójú elemek |

### 7.6 Betűtípusok (Typography)

```scss
// Google Fonts import
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Boogaloo&display=swap');

$font-title: 'Luckiest Guy', cursive;    // Főcím, nagy feliratok
$font-body: 'Boogaloo', cursive;          // Menü gombok, státusz szöveg
$font-mono: 'Courier New', monospace;     // Koordináták (A-H, 1-8)
```

| Felhasználás | Font | Méret | Szín |
|-------------|------|-------|------|
| Főcím (Wolfs vs Dog) | `$font-title` | `3rem` | `$sepia-brown`, `text-shadow` | 
| Menü gombok | `$font-body` | `1.5rem` | `$ink-black` |
| Státusz panel | `$font-body` | `1.2rem` | `$sepia-brown` |
| Tábla koordináták | `$font-mono` | `0.75rem` | `$sepia-brown` |
| Game Over felirat | `$font-title` | `2.5rem` | `$warm-gold` |

### 7.7 Oldal layout & háttér

```scss
body {
  background-color: $parchment;
  // Régi papír textúra (CSS repeating noise)
  background-image: url("data:image/svg+xml,..."); // inline SVG noise
  min-height: 100vh;
  overflow: hidden;
  font-family: $font-body;
  color: $ink-black;
}

// Vignette overlay
.app::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%);
  z-index: 1000;
}

// Film grain overlay
.app::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,..."); // SVG noise
  animation: grain 0.5s steps(1) infinite;
  z-index: 1001;
}
```

### 7.8 Gombok stílusa

```scss
.btn {
  font-family: $font-body;
  font-size: 1.3rem;
  padding: 12px 28px;
  border: 3px solid $ink-black;
  border-radius: 12px;
  background: $warm-cream;
  color: $ink-black;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: 4px 4px 0px $ink-black; // retro drop shadow (hard edge)

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px $ink-black;
    background: $dusty-rose;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px $ink-black;
  }
}
```

### 7.9 Összefoglaló – design hangulat

> Képzeld el: egy régi, fakó, szemcsés rajzfilm világa. A tábla úgy néz ki, mint egy kopott fa játéktábla, a figurák mint 1930-as évek cartoon karakterei pattognak rajta. A háttér pergamenszerű, a széleken sötétedik mint egy régi filmtekercs. A gombok kézzel rajzolt hatásúak, vastag kontúrral. Minden animáció túlzó és pattogós, mint egy Fleischer Studios rajzfilmben. A betűtípusok retró, kézírásos jellegűek. Az egész felület szépia-tónusú, de a figurák (piros farkas, zöld kutyák) kiugranak a háttérből.

---

## 8. Felhasználói felület (UI/UX)

### 8.1 Képernyők

#### 8.1.1 Kezdőképernyő (Main Menu)
```
┌──────────────────────────────────────────┐
│                                          │
│            🐺  WOLFS vs DOG  🐶          │
│                                          │
│          Choose your side:               │
│                                          │
│     ┌──────────────────────────┐         │
│     │   🐺 Play as Wolf        │         │
│     └──────────────────────────┘         │
│                                          │
│     ┌──────────────────────────┐         │
│     │   🐶 Play as Dogs        │         │
│     └──────────────────────────┘         │
│                                          │
│     ┌──────────────────────────────┐     │
│     │  📊  Stats: 5W - 12L (17)   │     │
│     └──────────────────────────────┘     │
│                                          │
└──────────────────────────────────────────┘
```

#### 8.1.2 Játék képernyő (Game Screen)
```
┌──────────────────────────────────────────┐
│              WOLFS vs DOG                │  ← Cím
│     You: 🐶 Dogs  |  AI: 🐺 Wolf        │  ← Szerepek
│                                          │
│  ┌──────────────────────────────────┐    │
│  │                                  │    │
│  │         8×8 JÁTÉKTÁBLA           │    │  ← HTML grid
│  │      (div + SCSS grid layout)    │    │
│  │                                  │    │
│  └──────────────────────────────────┘    │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │  🐶 Your turn!                   │    │  ← Státusz panel
│  │  Select a dog to move.           │    │
│  └──────────────────────────────────┘    │
│                                          │
│  [ 🏠 Main Menu ]  [ 🔄 Restart ]       │  ← Gombok
│                                          │
└──────────────────────────────────────────┘
```

### 8.2 Tábla vizuális elemei (HTML + SCSS)

A tábla **CSS Grid** layout-tal épül fel (`8×8 grid`). Minden mező egy `<div>`, a figurák a mezőkön belüli elemek. A vizuális állapotok **CSS osztályokkal** kezelődnek – ez gyorsabb és memóriatakarékosabb, mint Canvas újrarajzolás.

| Elem | HTML / CSS megoldás |
|------|---------------------|
| Tábla konténer | `<div class="board">` – `display: grid; grid-template: repeat(8, 1fr) / repeat(8, 1fr)` |
| Világos mező | `<div class="square square--light">` – háttér: `#F0D9B5` |
| Sötét mező | `<div class="square square--dark">` – háttér: `#B58863` |
| Kutya figura | `<div class="piece piece--dog">🐶</div>` – emoji vagy CSS-rajzolt kör |
| Farkas figura | `<div class="piece piece--wolf">🐺</div>` – emoji vagy CSS-rajzolt kör |
| Kiválasztott figura | `.piece--selected` – sárga `box-shadow` / `outline`, scale transform |
| Érvényes lépés jelölő | `.square--valid-target` – zöld félátlátszó kör (CSS `::after` pseudo-element) |
| Utolsó lépés jelölő | `.square--last-move` – halvány sárga háttér |
| AI utolsó lépése | `.square--last-move-ai` – halvány kék háttér |
| Hover (ember köre) | `.square--dark:hover` (csak ha interaktív) – világos kiemelés |
| Kattintható mező | `.square--clickable` – `cursor: pointer` |
| Érvénytelen kattintás | `.square--invalid-click` – rövid piros villanás (CSS animation, `shake`) |
| AI kör (tiltva) | `.board--ai-turn` – `pointer-events: none; opacity: 0.9` |
| Sor/oszlop jelölők | `<span class="board__label">` – A-H / 1-8, a grid szélein |

#### SCSS fájl struktúra
```
src/
├── styles/
│   ├── _variables.scss     # Cuphead paletta, méretek, breakpoints, fontok
│   ├── _base.scss          # Body, vignette, grain overlay, globális reset
│   ├── _typography.scss    # Retro font imports, heading stílusok
│   ├── _board.scss         # Tábla grid, mezők, fa-textúra, kopott keret
│   ├── _pieces.scss        # Figurák: rubber hose wolf & dog CSS art
│   ├── _animations.scss    # Bounce, squash, shake, flicker, grain, wobble
│   ├── _buttons.scss       # Retro hard-shadow gombok
│   ├── _menu.scss          # Main Menu: vintage poster layout
│   ├── _status.scss        # Status panel: pergamen háttér, retro font
│   ├── _modal.scss         # Game Over modal: victory / defeat design
│   └── main.scss           # Fő SCSS entry point (@use imports)
```

#### SCSS változók (`_variables.scss`)
```scss
// ==============================
//  CUPHEAD-INSPIRED COLOR PALETTE
// ==============================

// Backgrounds & surfaces
$parchment: #F2E8D5;
$warm-cream: #E8D5B7;
$paper-white: #FAF7F0;

// Ink & outlines
$ink-black: #1A1A1A;
$sepia-brown: #8B6914;
$dark-walnut: #3E2723;

// Characters
$dusty-red: #C0392B;        // Wolf
$forest-teal: #1A6B5A;      // Dogs

// Highlights & accents
$warm-gold: #D4A017;         // Selection, highlights
$vintage-yellow: #F4D03F;    // Victory
$dusty-rose: #C97B84;        // Button hover, accents
$faded-blue: #5B7FA5;        // AI highlights, info

// Gameplay states
$valid-move-color: rgba($forest-teal, 0.35);
$selected-highlight: rgba($warm-gold, 0.45);
$last-move-human: rgba($warm-gold, 0.2);
$last-move-ai: rgba($faded-blue, 0.25);
$invalid-flash: rgba($dusty-red, 0.4);

// Board sizing
$board-max-size: 600px;
$square-size: calc(#{$board-max-size} / 8);
$piece-outline: 3px;

// Typography
$font-title: 'Luckiest Guy', cursive;
$font-body: 'Boogaloo', cursive;
$font-mono: 'Courier New', monospace;

// Animations
$transition-speed: 0.2s;
$bounce-duration: 2s;
$shake-duration: 0.3s;
$squash-duration: 0.25s;
$ai-pulse-duration: 1.5s;
$flicker-duration: 4s;

// Borders (hand-drawn effect)
$hand-drawn-border: 3px solid $ink-black;
$retro-shadow: 4px 4px 0px $ink-black;
$retro-shadow-hover: 6px 6px 0px $ink-black;

// Grain & overlays
$grain-opacity: 0.06;
$vignette-strength: 0.35;
```

### 8.3 Státusz panel üzenetei

| Állapot | Üzenet |
|---------|--------|
| MENU – választás | `"Choose your side!"` |
| SETUP – ember rakja a farkast | `"🐺 Place your wolf on any dark square!"` |
| SETUP – AI rakja a farkast | `"🤔 AI is placing the wolf..."` |
| PLAYING – ember köre (kutya) | `"🐶 Your turn – select a dog to move."` |
| PLAYING – ember köre (farkas) | `"🐺 Your turn – select the wolf to move."` |
| PLAYING – AI köre | `"🤔 AI is thinking..."` |
| Figura kiválasztva | `"Selected! Click a highlighted square to move."` |
| Érvénytelen lépés | `"❌ Invalid move! Try again."` |
| Érvénytelen elhelyezés | `"❌ Invalid placement! [specifikus ok]"` |
| Ember nyert | `"🎉 You win! Congratulations!"` |
| AI nyert | `"💀 AI wins! Better luck next time!"` |
| AI lépett | `"AI moved [from] → [to]. Your turn!"` |

### 8.4 Interakció flow

#### Szerepválasztás (MENU fázis)
```
Main Menu képernyő
  ├── "Play as Wolf 🐺" gomb → humanRole = 'wolfPlayer', AI = 'dogPlayer'
  └── "Play as Dogs 🐶" gomb → humanRole = 'dogPlayer', AI = 'wolfPlayer'
```

#### Figura kiválasztás és lépés (PLAYING fázis – ember köre)
```
1. Játékos kattint egy figurára
   ├── Saját figura? → Kijelölés + érvényes lépések megjelenítése
   ├── AI figurája? → Hibaüzenet: "That's not your piece!"
   └── Üres mező? → Hibaüzenet: "Select a piece first!"

2. Figura ki van jelölve, játékos kattint egy mezőre
   ├── Érvényes célmező (zöld jelölő)? → Lépés végrehajtása → AI köre indul
   ├── Saját másik figurája? → Kijelölés átvált arra
   ├── Kijelölt figurára kattint újra? → Kijelölés megszüntetése
   └── Érvénytelen mező? → Hibaüzenet
```

#### AI köre (PLAYING fázis – AI köre)
```
AI kör indul
  │
  ├── Input letiltva (.board--ai-turn → pointer-events: none)
  ├── Üzenet: "AI is thinking... 🤔"
  ├── Késleltetés (400-800ms)
  ├── Minimax algoritmus kiszámítja a legjobb lépést
  ├── Lépés végrehajtása + DOM frissítés (React rerender)
  ├── Utolsó lépés kiemelése (.square--last-move-ai)
  ├── Győzelem ellenőrzés
  │    ├── AI nyert → GAME_OVER
  │    └── Nem → Ember köre
  └── Input újra engedélyezve (.board--ai-turn eltávolítva)
```

---

## 8. Technikai architektúra

### 8.1 Mappastruktúra

```
src/
├── assets/                    # Statikus erőforrások
│   └── (jövőbeli sprite-ok, hangok)
│
├── components/                # React UI komponensek
│   ├── MainMenu.tsx           # Kezdőképernyő, szerepválasztás (vintage poster)
│   ├── GameBoard.tsx          # HTML grid tábla renderelés (fa-textúra)
│   ├── Square.tsx             # Egy mező komponens (CSS osztályokkal)
│   ├── Piece.tsx              # Figura komponens (rubber hose CSS art)
│   ├── StatusPanel.tsx        # Játék státusz kijelzése (pergamen panel)
│   ├── GameOverModal.tsx      # Játék vége modal/overlay (vintage)
│   └── StatsDisplay.tsx       # Statisztika kijelző (win/loss)
│
├── game/                      # Játéklogika (React-mentes, tiszta függvények)
│   ├── board.ts               # Tábla inicializálás, mező-kalkulációk
│   ├── moves.ts               # Lépés validáció, érvényes lépések
│   ├── winCondition.ts        # Győzelmi feltételek ellenőrzése
│   └── gameState.ts           # Játékállapot kezelés, reducer
│
├── ai/                        # AI modul (tanuló algoritmus)
│   ├── minimax.ts             # Minimax algoritmus alpha-beta vágással
│   ├── evaluation.ts          # Pozíció-értékelő heurisztikák
│   ├── learningStore.ts       # Tanult súlyok tárolása (localStorage)
│   ├── transpositionTable.ts  # Tranzíciós tábla (cache)
│   └── aiPlayer.ts            # AI belépési pont (összefogja a modulokat)
│
├── hooks/                     # Custom React hook-ok
│   ├── useGameState.ts        # Fő játékállapot hook (useReducer)
│   └── useAI.ts               # AI lépés kezelés hook (async + delay)
│
├── styles/                    # SCSS stílusfájlok (Cuphead design)
│   ├── _variables.scss        # Cuphead paletta, méretek, fontok
│   ├── _base.scss             # Body, vignette, grain, reset
│   ├── _typography.scss       # Retro font imports, headings
│   ├── _board.scss            # Tábla grid, fa-textúra, kopott keret
│   ├── _pieces.scss           # Rubber hose figurák CSS art
│   ├── _animations.scss       # Bounce, squash, shake, flicker, grain
│   ├── _buttons.scss          # Retro hard-shadow gombok
│   ├── _menu.scss             # Main Menu vintage poster
│   ├── _status.scss           # Status panel pergamen
│   ├── _modal.scss            # Game Over vintage modal
│   └── main.scss              # SCSS entry point (@use imports)
│
├── types/                     # TypeScript típusdefiníciók
│   ├── game.ts                # Játék-specifikus típusok
│   └── ai.ts                  # AI-specifikus típusok
│
├── App.tsx                    # Fő alkalmazás komponens (screen routing)
├── main.tsx                   # Belépési pont
└── vite-env.d.ts              # Vite típusok
```

### 8.2 Típusdefiníciók

#### `src/types/game.ts`
```typescript
// --- Board ---

/** Column index (0-7) */
export type Col = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Row index (0-7) */
export type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** A position on the board */
export interface Position {
  row: number;
  col: number;
}

// --- Pieces ---

export type PieceType = 'wolf' | 'dog';

export interface Piece {
  id: string;          // unique identifier, e.g. "dog-0", "dog-1", "wolf"
  type: PieceType;
  position: Position;
}

export interface Wolf extends Piece {
  type: 'wolf';
}

export interface Dog extends Piece {
  type: 'dog';
}

// --- Players ---

export type PlayerRole = 'wolfPlayer' | 'dogPlayer';

export type ControlledBy = 'human' | 'ai';

// --- Game Phases ---

export type GamePhase = 'menu' | 'setup' | 'playing' | 'gameOver';

// --- Game State ---

export interface GameState {
  phase: GamePhase;
  humanRole: PlayerRole | null;   // null until role is chosen in menu
  currentPlayer: PlayerRole;
  wolf: Wolf | null;              // null during setup before placement
  dogs: Dog[];
  selectedPieceId: string | null;
  validMoves: Position[];
  winner: PlayerRole | null;
  message: string;
  isAiTurn: boolean;              // true when AI is "thinking"
  lastMove: {
    from: Position;
    to: Position;
    by: ControlledBy;             // who made the last move
  } | null;
}

// --- Actions ---

export type GameAction =
  | { type: 'SELECT_ROLE'; role: PlayerRole }
  | { type: 'PLACE_WOLF'; position: Position }
  | { type: 'SELECT_PIECE'; pieceId: string }
  | { type: 'DESELECT_PIECE' }
  | { type: 'MOVE_PIECE'; to: Position }
  | { type: 'AI_MOVE'; from: Position; to: Position }
  | { type: 'AI_PLACE_WOLF'; position: Position }
  | { type: 'INVALID_ACTION'; message: string }
  | { type: 'NEW_GAME' };

// --- Stats ---

export interface GameStats {
  totalGames: number;
  humanWins: number;
  aiWins: number;
  humanWinsAsWolf: number;
  humanWinsAsDog: number;
  aiWinsAsWolf: number;
  aiWinsAsDog: number;
}

// --- Rendering (SCSS controls visuals, no CanvasConfig needed) ---
// All board theming is handled in SCSS _variables.scss (Cuphead palette).
// No BoardTheme or CanvasConfig interfaces needed – CSS classes drive the look.

// --- Win Condition ---

export type GameResult =
  | { isOver: false }
  | { isOver: true; winner: PlayerRole; reason: WinReason };

export type WinReason =
  | 'wolfTrapped'          // wolf has no valid moves
  | 'wolfBrokeThrough'     // wolf passed behind all dogs
  | 'dogsCannotMove';      // no dog has any valid move
```

#### `src/types/ai.ts`
```typescript
import type { Position, GameState, PlayerRole } from './game';

// --- AI Move ---

/** An AI move: which piece moves where */
export interface AiMove {
  pieceId: string;
  from: Position;
  to: Position;
}

/** AI move for wolf placement (setup phase) */
export interface AiPlacement {
  position: Position;
}

// --- Evaluation ---

/** Raw evaluation score: positive = good for wolf, negative = good for dogs */
export type EvalScore = number;

/** Evaluation weights (tunable, learnable) */
export interface EvalWeights {
  wolfMobility: number;         // how many moves wolf has
  dogMobility: number;          // how many total moves dogs have
  wolfRowAdvance: number;       // wolf's progress toward row 0
  dogFormation: number;         // how tight the dog wall is
  wolfDistanceToDogs: number;   // avg distance from wolf to dogs
  wolfEscapeRoutes: number;     // open diagonal paths behind dogs
  dogCoverage: number;          // how well dogs cover columns
  wolfTrappedPenalty: number;   // large penalty if wolf has 0-1 moves
  centerControlWolf: number;    // bonus for wolf controlling center
  centerControlDogs: number;    // bonus for dogs controlling center
}

// --- Learning Store ---

/** Persistent data stored in localStorage */
export interface LearningData {
  version: number;
  gamesPlayed: number;
  weights: EvalWeights;
  positionHistory: PositionMemory[];  // limited size ring buffer
}

/** Remembered position outcome */
export interface PositionMemory {
  hash: string;         // board state hash
  score: EvalScore;     // final evaluated score
  result: 'wolfWin' | 'dogWin';
  visits: number;       // how many times seen
}

// --- Minimax ---

export interface MinimaxResult {
  score: EvalScore;
  move: AiMove | null;
  depth: number;
  nodesSearched: number;
}

export interface MinimaxConfig {
  maxDepth: number;              // search depth (default: 8-10)
  maxTimeMs: number;             // time limit per move in ms
  useIterativeDeepening: boolean;
  useTranspositionTable: boolean;
  useMoveSorting: boolean;       // sort moves by heuristic for better pruning
}

// --- Transposition Table ---

export interface TranspositionEntry {
  hash: string;
  depth: number;
  score: EvalScore;
  flag: 'exact' | 'lowerBound' | 'upperBound';
  bestMove: AiMove | null;
}
```

### 8.3 Játékállapot kezelés (`src/game/gameState.ts`)

A játékállapot egy **reducer** pattern-nel lesz kezelve:

```
GameState + GameAction → GameState
```

#### Reducer logika (pszeudokód):

```
SELECT_ROLE:
  └── humanRole = role, phase = 'setup'
      ├── Ha ember a farkas → message = "Place your wolf!", isAiTurn = false
      └── Ha AI a farkas → message = "AI is placing...", isAiTurn = true

PLACE_WOLF (emberi):
  ├── Validáció: sötét mező? row >= 1? üres?
  ├── Ha érvényes: wolf = new Wolf(position), phase = 'playing', currentPlayer = 'dogPlayer'
  │   └── Ha a dog player is AI → isAiTurn = true (AI lép rögtön)
  └── Ha érvénytelen: message = hibaüzenet, state nem változik

AI_PLACE_WOLF:
  └── wolf = new Wolf(position), phase = 'playing', currentPlayer = 'dogPlayer'
      └── Ha ember a dog player → isAiTurn = false, message = "Your turn!"

SELECT_PIECE:
  ├── Csak ha NEM AI köre (isAiTurn === false)
  ├── A kiválasztott figura az aktuális játékosé?
  ├── Ha igen: selectedPieceId = id, validMoves = getValidMoves(piece)
  └── Ha nem: message = "That's not your piece!"

DESELECT_PIECE:
  └── selectedPieceId = null, validMoves = []

MOVE_PIECE (emberi):
  ├── Van kiválasztott figura? A célmező érvényes lépés?
  ├── Ha igen:
  │   ├── Figura áthelyezése
  │   ├── lastMove = { from, to, by: 'human' }
  │   ├── Győzelem ellenőrzés
  │   ├── Ha nyertes van: phase = 'gameOver', winner = ...
  │   └── Ha nincs: currentPlayer váltás, isAiTurn = true
  └── Ha nem: message = hibaüzenet

AI_MOVE:
  ├── Figura áthelyezése (from → to)
  ├── lastMove = { from, to, by: 'ai' }
  ├── Győzelem ellenőrzés
  ├── Ha nyertes van: phase = 'gameOver', winner = ...
  └── Ha nincs: currentPlayer váltás, isAiTurn = false

NEW_GAME:
  └── Visszaállítás a MENU fázisba (humanRole = null)
```

### 9.4 HTML renderelés (React komponensek + SCSS)

Nincs Canvas API – a teljes tábla **React komponensekből** áll, a megjelenést **SCSS osztályok** vezérlik. Ez a megközelítés gyorsabb, mivel a böngésző DOM renderelője optimalizálja az újrarajzolást (csak a megváltozott elemek frissülnek), és nem kell JS-ből pixeleket rajzolni.

#### Renderelési rétegek (HTML struktúra):
```html
<div class="board board--cuphead" data-ai-turn="false">
  <!-- 8×8 grid: 64 mező -->
  <div class="square square--dark square--valid-target" data-row="3" data-col="2">
    <span class="square__valid-indicator"></span>  <!-- zöld kör pseudo-element -->
  </div>
  <div class="square square--dark square--last-move" data-row="2" data-col="1">
    <div class="piece piece--dog piece--selected">
      <span class="piece__body"></span>    <!-- CSS art: rubber hose karakter -->
      <span class="piece__eyes"></span>
    </div>
  </div>
  <!-- ... 62 további mező ... -->
  <span class="board__label board__label--col">A</span> <!-- koordináták -->
  <span class="board__label board__label--row">1</span>
</div>
```

#### Miért nem Canvas?
| Szempont | HTML+SCSS | Canvas |
|----------|-----------|--------|
| Memória | ✅ Alacsony – DOM elemek | ❌ Bitmap buffer |
| Újrarajzolás | ✅ Csak a megváltozott elem | ❌ Teljes canvas |
| Interakció | ✅ Natív click/hover | ❌ Manuális hit-detection |
| Animáció | ✅ CSS transitions/keyframes (GPU) | ❌ JS requestAnimationFrame |
| Accessibility | ✅ DOM elemek olvashatók | ❌ Flat bitmap |
| Cuphead stílus | ✅ CSS filterek, pseudo-elements | ⚠️ Bonyolultabb |

### 9.5 Kattintás kezelés (React onClick)

Minden `<Square>` komponens saját `onClick` handler-t kap. Nincs szükség koordináta-számításra (mint Canvas-nál), mert a React komponens tudja a saját `row` és `col` értékét.

```typescript
// Square.tsx
interface SquareProps {
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
  // ... CSS class meghatározó props
}

function Square({ row, col, onClick, ...rest }: SquareProps) {
  return (
    <div
      className={buildSquareClasses(rest)}
      onClick={() => onClick(row, col)}
      data-row={row}
      data-col={col}
    />
  );
}
```

#### Kattintás logika (a GameBoard-ban):
```
Square onClick(row, col)
  │
  ├── isAiTurn === true? → IGNORÁLVA (board--ai-turn → pointer-events: none)
  │
  ├── SETUP fázis (ember a farkas) → dispatch PLACE_WOLF({ row, col })
  │
  └── PLAYING fázis (ember köre)
       ├── Nincs kiválasztott figura
       │    ├── Saját figurára kattintott? → dispatch SELECT_PIECE(id)
       │    ├── AI figurájára kattintott? → dispatch INVALID_ACTION("That's not your piece!")
       │    └── Üres mező? → dispatch INVALID_ACTION("Select a piece first!")
       │
       └── Van kiválasztott figura
            ├── Érvényes célmezőre kattintott? → dispatch MOVE_PIECE({ row, col })
            ├── Saját másik figurára? → dispatch SELECT_PIECE(newId)
            ├── Ugyanarra a figurára? → dispatch DESELECT_PIECE
            └── Érvénytelen mező? → dispatch INVALID_ACTION("Invalid move!")
```

#### Hover kezelés:
- CSS `:hover` pseudo-class – **nulla JS**, a böngésző kezeli natívan
- `.board--ai-turn .square { pointer-events: none }` → AI körében nincs hover sem

---

## 10. Komponensek részletezése

### 10.1 `App.tsx`
- Befoglaló komponens, **screen router** szerepben
- `useGameState()` és `useAI()` hook meghívása
- `phase` alapján renderel:
  - `menu` → `<MainMenu />`
  - `setup` / `playing` / `gameOver` → `<GameBoard />` + `<StatusPanel />` + `<GameOverModal />`
- Layout: flex column, középre igazított
- Cuphead: vignette + grain overlay a `.app` konténeren (`::before`, `::after`)

### 10.2 `MainMenu.tsx`
- Props: `onSelectRole`, `stats`
- **Cuphead stílus:** vintage filmposzter layout
  - Nagy retro cím (`$font-title`) hullámos wobble animációval
  - Pergamen-textúrás háttér panel, vastag `$ink-black` keret
  - Két nagy gomb retro `$retro-shadow` árnyékkal: **"Play as Wolf 🐺"** / **"Play as Dogs 🐶"**
  - Gombok hover: `scale(1.05)` + árnyék növekedés + `$dusty-rose` háttér
- `<StatsDisplay />` komponens a gombok alatt

### 10.3 `GameBoard.tsx`
- Props: `gameState`, `onSquareClick`
- **Cuphead stílus:** kopott fa játéktábla
  - CSS Grid: `display: grid; grid-template: repeat(8, 1fr) / repeat(8, 1fr)`
  - Vastag, enyhén ferde keret (`$hand-drawn-border`, `rotate(0.3deg)`)
  - Belső `box-shadow` a kopott hatáshoz
- 64 db `<Square />` komponens renderelése
- Figurákat a `<Piece />` komponens jeleníti meg a megfelelő `<Square />`-on belül
- Responsive: `min(80vw, 80vh, 600px)` → `aspect-ratio: 1`
- **AI kör alatt:** `.board--ai-turn` osztály → `pointer-events: none; opacity: 0.9`

### 10.4 `Square.tsx`
- Props: `row`, `col`, `isDark`, `isSelected`, `isValidTarget`, `isLastMove`, `isLastMoveAi`, `onClick`, `children`
- Egyetlen `<div>` CSS osztályokkal:
  - `.square--dark` / `.square--light` (pergamen vs dió textúra)
  - `.square--selected` → `$selected-highlight` háttér
  - `.square--valid-target` → `::after` pseudo-element: zöld lüktető kör
  - `.square--last-move` / `.square--last-move-ai` → halvány háttér kiemelés
  - `.square--invalid-click` → shake animáció (JS-ből rövid időre rárakva)
- `onClick` továbbítja a `(row, col)` koordinátákat a GameBoard-nak

### 10.5 `Piece.tsx`
- Props: `type` (`'wolf' | 'dog'`), `isSelected`, `isAiPiece`
- **Cuphead rubber hose stílusú CSS art:**
  - Kör alakú test (`.piece__body`) vastag `$ink-black` körvonallal
  - Farkas: `$dusty-red` – hegyes fülek (CSS triangle), ravasz szemek, kilógó nyelv
  - Kutya: `$forest-teal` – lecsüngő fülek, nagy boldog szemek
  - Mindkettő: fehér "kesztyűs" kéz jelzés (opcionális pseudo-element)
- **Animációk:**
  - Idle: `bounce` (enyhe pattogás, `$bounce-duration`)
  - Selected: `scale(1.15)` + `box-shadow: 0 0 15px $warm-gold`
  - Lépés után: `squash` & stretch animáció (`$squash-duration`)

### 10.6 `StatusPanel.tsx`
- Props: `message`, `currentPlayer`, `phase`, `isAiTurn`, `humanRole`
- **Cuphead stílus:** pergamen szalag / banner
  - `$warm-cream` háttér, `$hand-drawn-border` keret
  - Retro font (`$font-body`)
  - Háttérszín: `$forest-teal` tint (kutyák) / `$dusty-red` tint (farkas)
- **AI gondolkodás közben:** animált "AI is thinking..." szöveg lüktető pontokkal
- Hibaüzenetek: `$dusty-red` szín, eltűnnek 2 mp után

### 10.7 `GameOverModal.tsx`
- Props: `winner`, `humanRole`, `onPlayAgain`, `stats`
- **Cuphead stílus:** vintage "THE END" / "A WINNER IS YOU" kártya
  - Overlay: félátlátszó `$ink-black` háttér + vignette
  - Központi panel: `$paper-white` háttér, díszes keret, retro font
  - Ember nyert: `$vintage-yellow` csillagok, "VICTORY!" felirat
  - AI nyert: `$dusty-red` tónusú, "DEFEATED!" felirat
  - **"Play Again"** gomb retro stílusban
- Statisztika összesítő

### 10.8 `StatsDisplay.tsx`
- Props: `stats: GameStats`
- **Cuphead stílus:** régi ponttábla (scoreboard) kinézet
  - Retro font, `$sepia-brown` szín
  - Win/Loss/Total kijelzés
  - Breakdown: mint farkas / mint kutya
  - Százalékos win rate

---

## 11. Részletes algoritmusok

### 11.1 Sötét mező ellenőrzés
```typescript
function isDarkSquare(pos: Position): boolean {
  return (pos.row + pos.col) % 2 === 1;
}
```

### 11.2 Mező foglaltság ellenőrzés
```typescript
function isOccupied(pos: Position, state: GameState): boolean {
  if (state.wolf && state.wolf.position.row === pos.row && state.wolf.position.col === pos.col) {
    return true;
  }
  return state.dogs.some(d => d.position.row === pos.row && d.position.col === pos.col);
}
```

### 11.3 Érvényes lépések kiszámítása
```typescript
function getValidMoves(piece: Piece, state: GameState): Position[] {
  const directions: [number, number][] = piece.type === 'wolf'
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : [[1, -1], [1, 1]];

  return directions
    .map(([dr, dc]) => ({ row: piece.position.row + dr, col: piece.position.col + dc }))
    .filter(pos =>
      pos.row >= 0 && pos.row <= 7 &&
      pos.col >= 0 && pos.col <= 7 &&
      !isOccupied(pos, state)
    );
}
```

### 11.4 Győzelem ellenőrzés
```typescript
function checkGameResult(state: GameState): GameResult {
  if (!state.wolf) return { isOver: false };

  // 1. Wolf trapped?
  const wolfMoves = getValidMoves(state.wolf, state);
  if (wolfMoves.length === 0) {
    return { isOver: true, winner: 'dogPlayer', reason: 'wolfTrapped' };
  }

  // 2. Wolf broke through?
  const minDogRow = Math.min(...state.dogs.map(d => d.position.row));
  if (state.wolf.position.row <= minDogRow) {
    return { isOver: true, winner: 'wolfPlayer', reason: 'wolfBrokeThrough' };
  }

  // 3. Dogs cannot move? (checked when it's dog player's turn)
  if (state.currentPlayer === 'dogPlayer') {
    const anyDogCanMove = state.dogs.some(d => getValidMoves(d, state).length > 0);
    if (!anyDogCanMove) {
      return { isOver: true, winner: 'wolfPlayer', reason: 'dogsCannotMove' };
    }
  }

  return { isOver: false };
}
```

### 11.5 Farkas elhelyezés validáció
```typescript
function isValidWolfPlacement(pos: Position, state: GameState): boolean {
  return (
    isDarkSquare(pos) &&
    pos.row >= 1 &&
    !isOccupied(pos, state)
  );
}
```

---

## 12. Inicializálás

### 12.1 Kezdő állapot
```typescript
const INITIAL_DOGS: Dog[] = [
  { id: 'dog-0', type: 'dog', position: { row: 0, col: 1 } },
  { id: 'dog-1', type: 'dog', position: { row: 0, col: 3 } },
  { id: 'dog-2', type: 'dog', position: { row: 0, col: 5 } },
  { id: 'dog-3', type: 'dog', position: { row: 0, col: 7 } },
];

const INITIAL_STATE: GameState = {
  phase: 'menu',
  humanRole: null,
  currentPlayer: 'wolfPlayer',
  wolf: null,
  dogs: INITIAL_DOGS,
  selectedPieceId: null,
  validMoves: [],
  winner: null,
  message: 'Choose your side!',
  isAiTurn: false,
  lastMove: null,
};
```

---

## 13. Szélsőséges esetek (Edge Cases)

| # | Eset | Elvárt viselkedés |
|---|------|-------------------|
| 1 | Farkas a sarokban, 3 szomszédja foglalt, 1 a táblán kívül | Farkas bekerítve → Dogs Win |
| 2 | Farkas a tábla szélén, 2 szomszéd kívül, 2 foglalt | Farkas bekerítve → Dogs Win |
| 3 | Farkas row 0-ba lép (ha lehetne, de row 0-on kutyák) | Csak ha üres a mező – érvényes lépés |
| 4 | Farkas row értéke ≤ min dog row | Wolf wins (áttörés) |
| 5 | Összes kutya a row 7-en ragadt | Kutyák nem tudnak lépni → Wolf Wins |
| 6 | Játékos a tábla szélére kattint | Csak sötét mezőkre lehet kattintani (Square onClick) |
| 7 | Játékos táblán kívülre kattint | Nincs hatása (nem Square komponens) |
| 8 | Dupla kattintás | Nincs extra hatás – az state atomikus |
| 9 | Nagyon gyors kattintás | React state batching kezeli |
| 10 | Böngésző átméretezés közben | CSS Grid responsive, `aspect-ratio: 1` kezeli |
| 11 | AI kör alatt kattintás | `.board--ai-turn` → `pointer-events: none` |

---

## 14. Jövőbeli fejlesztési lehetőségek (v2+)

> Ezek **NEM** részei az első verziónak, de érdemes fejben tartani az architektúra tervezésekor.

- 🎨 Sprite-alapú grafika (kézzel rajzolt Cuphead figurák PNG/SVG)
- 🔊 Hangeffektek (lépés, győzelem, hiba – 1930s jazzy stílusban)
- 📱 Touch support (mobil kompatibilitás)
- 📊 Lépésnapló (move history panel)
- 🌐 Online multiplayer (WebSocket)
- ⏱️ Időlimit per lépés
- 🏆 Ranglétra / Elo-rendszer
- 🧠 AI nehézségi szintek (Easy / Medium / Hard)

---

## 15. AI rendszer – Tanuló Minimax algoritmus

> Ez az alkalmazás központi eleme. Az AI-nak **nehéznek kell lennie**, de nem legyőzhetetlennek.

### 15.1 Architektúra áttekintés

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│  aiPlayer.ts │────▶│   minimax.ts    │────▶│  evaluation.ts   │
│  (belépési   │     │  (keresőfa +    │     │  (pozíció        │
│   pont)      │     │   alpha-beta)   │     │   értékelés)     │
└──────┬───────┘     └────────┬────────┘     └────────┬─────────┘
       │                      │                       │
       │             ┌────────▼────────┐     ┌────────▼─────────┐
       │             │ transposition   │     │ learningStore.ts │
       │             │ Table.ts        │     │ (localStorage    │
       │             │ (cache)         │     │  persistence)    │
       │             └─────────────────┘     └──────────────────┘
       │
       ▼
  useAI.ts hook (React integráció, delay, dispatch)
```

### 15.2 Minimax + Alpha-Beta vágás (`src/ai/minimax.ts`)

#### Alapelv
A Minimax algoritmus a játékfát bejárva megkeresi az optimális lépést. A farkas maximalizál (pozitív score = jó a farkasnak), a kutyák minimalizálnak.

#### Iteratív mélyítés (Iterative Deepening)
- Mélység 1-től fokozatosan növeli a keresési mélységet
- Időlimit: **2000ms** per lépés
- Ha kifut az időből, az utolsó kész mélység eredményét adja
- Mélység tartomány: **6–12** (a játékfa kis mérete miatt gyorsan megy)

#### Pszeudokód
```typescript
function minimax(
  state: GameState,
  depth: number,
  alpha: number,      // -Infinity initially
  beta: number,       // +Infinity initially
  isMaximizing: boolean, // true = wolf's turn
  config: MinimaxConfig,
  transTable: TranspositionTable,
  weights: EvalWeights
): MinimaxResult {

  // 1. Terminális állapot ellenőrzés
  const result = checkGameResult(state);
  if (result.isOver) {
    return {
      score: result.winner === 'wolfPlayer' ? +10000 : -10000,
      move: null,
      depth,
      nodesSearched: 1
    };
  }

  // 2. Mélységlimit elérve → statikus értékelés
  if (depth === 0) {
    return {
      score: evaluatePosition(state, weights),
      move: null,
      depth: 0,
      nodesSearched: 1
    };
  }

  // 3. Tranzíciós tábla keresés
  const hash = hashPosition(state);
  const cached = transTable.get(hash, depth);
  if (cached) return cached;

  // 4. Lépések generálása + rendezése (move ordering)
  const moves = generateAllMoves(state, isMaximizing ? 'wolfPlayer' : 'dogPlayer');
  const sortedMoves = sortMovesByHeuristic(moves, state, transTable);

  // 5. Alpha-Beta keresés
  let bestMove = sortedMoves[0];
  let bestScore = isMaximizing ? -Infinity : +Infinity;
  let totalNodes = 0;

  for (const move of sortedMoves) {
    const newState = applyMove(state, move);
    const result = minimax(
      newState,
      depth - 1,
      alpha, beta,
      !isMaximizing,
      config, transTable, weights
    );

    totalNodes += result.nodesSearched;

    if (isMaximizing) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
    }

    // Alpha-Beta vágás
    if (beta <= alpha) break;
  }

  // 6. Tranzíciós tábla frissítés
  transTable.set(hash, { score: bestScore, move: bestMove, depth });

  return { score: bestScore, move: bestMove, depth, nodesSearched: totalNodes };
}
```

#### Move Ordering (lépés rendezés)
A jobb alpha-beta vágás érdekében a lépések rendezve vannak:
1. **Tranzíciós tábla legjobb lépése** (ha van korábbi iterációból)
2. **Killer moves** – lépések, amik korábbi keresésben vágást okoztak
3. **Heurisztikus sorrend** – statikus értékelés alapján

### 15.3 Pozíció-értékelő heurisztika (`src/ai/evaluation.ts`)

#### Értékelési komponensek

| # | Faktor | Leírás | Wolf szempontból |
|---|--------|--------|------------------|
| 1 | **Wolf Mobility** | Farkas érvényes lépéseinek száma | + (több = jobb) |
| 2 | **Dog Mobility** | Kutyák összes érvényes lépéseinek száma | − (több = rosszabb) |
| 3 | **Wolf Row Advance** | Farkas row pozíciója (mennyire van hátra) | + (kisebb row = jobb) |
| 4 | **Dog Formation** | Kutyák "falának" tömörsége | − (tömörebb = rosszabb) |
| 5 | **Wolf Escape Routes** | Szabad átlós utak a kutyák mögé | + (több = jobb) |
| 6 | **Dog Column Coverage** | Hány oszlopot fednek le a kutyák | − (több = rosszabb) |
| 7 | **Wolf Trapped Penalty** | Ha farkasnak 0-1 lépése van | −− (nagy büntetés) |
| 8 | **Center Control** | Közép-táblai pozíció előnye | ± (mindkettőnek fontos) |
| 9 | **Distance to Dogs** | Farkas átlagos távolsága a kutyáktól | kontextusfüggő |
| 10 | **Dog Advance Sync** | Kutyák sorai mennyire egyenletesek | − (egyenletesebb = jobb) |

#### Értékelő függvény pszeudokód
```typescript
function evaluatePosition(state: GameState, weights: EvalWeights): EvalScore {
  const wolf = state.wolf!;
  const dogs = state.dogs;

  // Wolf mobility (0-4 range)
  const wolfMoves = getValidMoves(wolf, state).length;

  // Dog total mobility (0-8 range)
  const dogMoves = dogs.reduce((sum, d) => sum + getValidMoves(d, state).length, 0);

  // Wolf row progress (7 = worst for wolf, 0 = best)
  const wolfRowScore = 7 - wolf.position.row;

  // Dog formation: standard deviation of dog rows (lower = tighter wall)
  const dogRows = dogs.map(d => d.position.row);
  const avgDogRow = dogRows.reduce((a, b) => a + b, 0) / 4;
  const dogFormationScore = Math.sqrt(
    dogRows.reduce((sum, r) => sum + (r - avgDogRow) ** 2, 0) / 4
  );

  // Wolf escape routes: how many diagonals lead behind all dogs
  const minDogRow = Math.min(...dogRows);
  const escapeRoutes = countEscapeRoutes(wolf, dogs, state);

  // Dog column coverage
  const coveredColumns = new Set(dogs.map(d => d.position.col)).size;

  // Wolf trapped penalty
  const trappedPenalty = wolfMoves <= 1 ? (wolfMoves === 0 ? -100 : -30) : 0;

  // Center control (columns 2-5 are center)
  const wolfCenter = (wolf.position.col >= 2 && wolf.position.col <= 5) ? 1 : 0;
  const dogCenter = dogs.filter(d => d.position.col >= 2 && d.position.col <= 5).length;

  return (
    weights.wolfMobility * wolfMoves +
    weights.dogMobility * (-dogMoves) +
    weights.wolfRowAdvance * wolfRowScore +
    weights.dogFormation * (-1 / (dogFormationScore + 0.1)) +
    weights.wolfEscapeRoutes * escapeRoutes +
    weights.dogCoverage * (-coveredColumns) +
    weights.wolfTrappedPenalty * trappedPenalty +
    weights.centerControlWolf * wolfCenter +
    weights.centerControlDogs * (-dogCenter)
  );
}
```

#### Alapértelmezett súlyok (kiindulás)
```typescript
const DEFAULT_WEIGHTS: EvalWeights = {
  wolfMobility: 3.0,
  dogMobility: 1.5,
  wolfRowAdvance: 4.0,
  dogFormation: 2.5,
  wolfDistanceToDogs: 1.0,
  wolfEscapeRoutes: 5.0,
  dogCoverage: 2.0,
  wolfTrappedPenalty: 1.0,    // multiplied with already large values
  centerControlWolf: 1.5,
  centerControlDogs: 1.0,
};
```

### 15.4 Tranzíciós tábla (`src/ai/transpositionTable.ts`)

#### Board hashing (Zobrist hash)
- Előre generált random számok minden (pozíció, figuratípus) kombinációhoz
- XOR-alapú hash: gyors, inkrementális frissítés lépésenként
- A hash tartalmazza az aktuális játékos információt is

```typescript
// Pre-generate random 32-bit numbers for each (row, col, pieceType)
const ZOBRIST_KEYS: Record<string, number> = {};

function initZobristKeys(): void {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      for (const type of ['wolf', 'dog'] as const) {
        ZOBRIST_KEYS[`${row}-${col}-${type}`] = Math.floor(Math.random() * 0xFFFFFFFF);
      }
    }
  }
  ZOBRIST_KEYS['currentPlayer-wolfPlayer'] = Math.floor(Math.random() * 0xFFFFFFFF);
  ZOBRIST_KEYS['currentPlayer-dogPlayer'] = Math.floor(Math.random() * 0xFFFFFFFF);
}

function hashPosition(state: GameState): number {
  let hash = 0;
  if (state.wolf) {
    hash ^= ZOBRIST_KEYS[`${state.wolf.position.row}-${state.wolf.position.col}-wolf`];
  }
  for (const dog of state.dogs) {
    hash ^= ZOBRIST_KEYS[`${dog.position.row}-${dog.position.col}-dog`];
  }
  hash ^= ZOBRIST_KEYS[`currentPlayer-${state.currentPlayer}`];
  return hash;
}
```

#### Tábla méret és eviction
- **Max méret:** 100_000 bejegyzés (memória-barát)
- **Eviction policy:** ha tele, régi/sekélyebb bejegyzéseket töröl
- **Játék végeztével:** teljes ürítés

### 15.5 AI játékos belépési pont (`src/ai/aiPlayer.ts`)

```typescript
interface AiPlayerConfig {
  role: PlayerRole;          // 'wolfPlayer' or 'dogPlayer'
  minimaxConfig: MinimaxConfig;
}

async function computeAiMove(
  state: GameState,
  config: AiPlayerConfig,
  learningData: LearningData
): Promise<AiMove> {

  const transTable = new TranspositionTable();
  const isMaximizing = config.role === 'wolfPlayer';

  // Iterative deepening with time limit
  let bestResult: MinimaxResult = { score: 0, move: null, depth: 0, nodesSearched: 0 };
  const startTime = performance.now();

  for (let depth = 1; depth <= config.minimaxConfig.maxDepth; depth++) {
    const result = minimax(
      state, depth,
      -Infinity, +Infinity,
      isMaximizing,
      config.minimaxConfig,
      transTable,
      learningData.weights
    );

    bestResult = result;

    // Time check
    if (performance.now() - startTime > config.minimaxConfig.maxTimeMs) break;
  }

  // Consult learning store for position adjustments
  const adjustedMove = adjustWithLearning(bestResult, state, learningData);

  return adjustedMove ?? bestResult.move!;
}
```

#### AI farkas elhelyezés (SETUP fázis)
```typescript
function computeWolfPlacement(state: GameState, weights: EvalWeights): Position {
  // Evaluate all valid dark squares (row >= 1)
  // Pick the one with the highest evaluation score for wolf
  // Common strong placements: (7,0), (7,2), (7,4), (7,6) - last row corners
  // But the AI evaluates dynamically based on learned weights

  const validSquares = getAllDarkSquares().filter(pos => pos.row >= 1);

  let bestPos = validSquares[0];
  let bestScore = -Infinity;

  for (const pos of validSquares) {
    const testState = { ...state, wolf: { id: 'wolf', type: 'wolf', position: pos } };
    const score = evaluatePosition(testState, weights);
    if (score > bestScore) {
      bestScore = score;
      bestPos = pos;
    }
  }

  return bestPos;
}
```

### 15.6 Tanulási mechanizmus (`src/ai/learningStore.ts`)

#### Koncepció
Az AI **minden játék után frissíti az értékelő súlyait** a játék kimenetele alapján. Ez egy egyszerű, de hatékony **online learning** megközelítés:

#### Tanulási algoritmus: Simplified Weight Tuning

```typescript
function updateWeightsAfterGame(
  learningData: LearningData,
  gameHistory: GameState[],  // all board states during the game
  result: 'wolfWin' | 'dogWin',
  aiRole: PlayerRole
): LearningData {

  const learningRate = Math.max(0.01, 0.1 / Math.sqrt(learningData.gamesPlayed + 1));
  const aiWon = (aiRole === 'wolfPlayer' && result === 'wolfWin') ||
                (aiRole === 'dogPlayer' && result === 'dogWin');

  const newWeights = { ...learningData.weights };

  // For each weight: if AI won, reinforce current evaluation direction
  // If AI lost, adjust weights to better evaluate the positions it misvalued

  for (const state of gameHistory) {
    const currentEval = evaluatePosition(state, learningData.weights);
    const targetEval = aiWon ? currentEval : -currentEval * 0.5;
    const error = targetEval - currentEval;

    // Gradient-like update for each weight component
    const components = computeEvalComponents(state);

    for (const [key, component] of Object.entries(components)) {
      const weightKey = key as keyof EvalWeights;
      newWeights[weightKey] += learningRate * error * component;

      // Clamp weights to prevent extreme values
      newWeights[weightKey] = Math.max(-20, Math.min(20, newWeights[weightKey]));
    }
  }

  // Update position memory (ring buffer, max 500 entries)
  const newHistory = [...learningData.positionHistory];
  for (const state of gameHistory) {
    const hash = hashPosition(state).toString();
    const existing = newHistory.find(p => p.hash === hash);
    if (existing) {
      existing.visits += 1;
      existing.result = result;
      existing.score = evaluatePosition(state, newWeights);
    } else {
      if (newHistory.length >= 500) newHistory.shift();
      newHistory.push({
        hash,
        score: evaluatePosition(state, newWeights),
        result,
        visits: 1,
      });
    }
  }

  return {
    version: learningData.version,
    gamesPlayed: learningData.gamesPlayed + 1,
    weights: newWeights,
    positionHistory: newHistory,
  };
}
```

#### localStorage persistence
```typescript
const LEARNING_STORAGE_KEY = 'wolfs-vs-dog-ai-learning';

function saveLearningData(data: LearningData): void {
  localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(data));
}

function loadLearningData(): LearningData {
  const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
  if (!raw) return getDefaultLearningData();

  try {
    const parsed = JSON.parse(raw) as LearningData;
    if (parsed.version !== CURRENT_VERSION) return getDefaultLearningData();
    return parsed;
  } catch {
    return getDefaultLearningData();
  }
}

function getDefaultLearningData(): LearningData {
  return {
    version: 1,
    gamesPlayed: 0,
    weights: DEFAULT_WEIGHTS,
    positionHistory: [],
  };
}
```

#### Tanulási jellemzők
| Tulajdonság | Érték |
|-------------|-------|
| **Learning rate** | `0.1 / sqrt(gamesPlayed + 1)` (csökkenő) |
| **Súly tartomány** | `[-20, +20]` (clamped) |
| **Position memory** | Max 500 pozíció (ring buffer) |
| **Persistence** | `localStorage` (böngészőnként) |
| **Reset lehetőség** | Fejlesztőnek: `localStorage.removeItem(...)` |
| **Hatás** | ~10-20 játék után érezhető javulás |

### 15.7 `useAI` hook (`src/hooks/useAI.ts`)

```typescript
function useAI(
  state: GameState,
  dispatch: React.Dispatch<GameAction>
): void {

  useEffect(() => {
    // Only act when it's AI's turn
    if (!state.isAiTurn) return;
    if (state.phase === 'gameOver' || state.phase === 'menu') return;

    const controller = new AbortController();

    const doAiTurn = async () => {
      // Artificial delay for natural feeling (400-800ms random)
      const delay = 400 + Math.random() * 400;
      await new Promise(resolve => setTimeout(resolve, delay));

      if (controller.signal.aborted) return;

      if (state.phase === 'setup') {
        // AI places wolf
        const learningData = loadLearningData();
        const position = computeWolfPlacement(state, learningData.weights);
        dispatch({ type: 'AI_PLACE_WOLF', position });

      } else if (state.phase === 'playing') {
        // AI makes a move
        const learningData = loadLearningData();
        const aiRole = state.humanRole === 'wolfPlayer' ? 'dogPlayer' : 'wolfPlayer';
        const move = await computeAiMove(state, {
          role: aiRole,
          minimaxConfig: {
            maxDepth: 10,
            maxTimeMs: 2000,
            useIterativeDeepening: true,
            useTranspositionTable: true,
            useMoveSorting: true,
          }
        }, learningData);

        if (!controller.signal.aborted) {
          dispatch({ type: 'AI_MOVE', from: move.from, to: move.to });
        }
      }
    };

    doAiTurn();

    return () => controller.abort();
  }, [state.isAiTurn, state.phase]);
}
```

### 15.8 AI nehézség jellemzők

| Aspektus | Érték | Miért nehéz? |
|----------|-------|--------------|
| **Keresési mélység** | 8-12 lépés előre | Messzire lát a játékfában |
| **Alpha-beta vágás** | ~70-90% node-ot levág | Gyors, mélyre tud menni |
| **Move ordering** | Transp. table + heurisztika | Még több vágás |
| **Tranzíciós tábla** | 100K entry cache | Nem számol kétszer |
| **Tanuló súlyok** | Játékról játékra javul | Adaptálódik a játékos stílusához |
| **Position memory** | 500 megjegyzett pozíció | "Emlékszik" a korábbi játékokra |
| **Wolf placement** | Értékelés-alapú | Stratégiailag optimális kezdés |

---

## 16. Statisztikák és perzisztencia

### 16.1 Játékstatisztikák (`GameStats`)
- Minden játék végén frissül
- `localStorage`-ban tárolva (`wolfs-vs-dog-stats` key)
- Tartalmazza:
  - Összes játék
  - Emberi győzelmek (összesen, mint farkas, mint kutya)
  - AI győzelmek (összesen, mint farkas, mint kutya)

### 16.2 Megjelenítés
- **Main Menu:** összesített win/loss
- **Game Over modal:** aktuális játék eredménye + összesített stat
- **StatsDisplay komponens:** részletes breakdown

---

## 17. Összefoglaló – Fejlesztési sorrend

### Fázis 1: Alap játéklogika
1. Típusdefiníciók (`src/types/game.ts`, `src/types/ai.ts`)
2. Tábla logika (`src/game/board.ts`)
3. Lépés validáció (`src/game/moves.ts`)
4. Győzelmi feltételek (`src/game/winCondition.ts`)
5. Game state reducer (`src/game/gameState.ts`)

### Fázis 2: AI rendszer
6. Pozíció-értékelő heurisztika (`src/ai/evaluation.ts`)
7. Tranzíciós tábla (`src/ai/transpositionTable.ts`)
8. Minimax + alpha-beta (`src/ai/minimax.ts`)
9. Learning store (`src/ai/learningStore.ts`)
10. AI player belépési pont (`src/ai/aiPlayer.ts`)

### Fázis 3: SCSS Design rendszer (Cuphead stílus)
11. SCSS változók, paletta (`src/styles/_variables.scss`)
12. Alap stílusok, vignette, grain (`src/styles/_base.scss`)
13. Tipográfia – retro fontok (`src/styles/_typography.scss`)
14. Animációk – bounce, shake, squash (`src/styles/_animations.scss`)
15. Gombok – retro hard-shadow (`src/styles/_buttons.scss`)
16. Tábla stílusok – fa-textúra, kopott keret (`src/styles/_board.scss`)
17. Figurák CSS art – rubber hose wolf & dog (`src/styles/_pieces.scss`)

### Fázis 4: React integráció
18. `useGameState` hook (`src/hooks/useGameState.ts`)
19. `useAI` hook (`src/hooks/useAI.ts`)

### Fázis 5: UI komponensek (HTML + SCSS)
20. `Square` komponens (mező)
21. `Piece` komponens (CSS art figurák)
22. `GameBoard` komponens (CSS Grid tábla)
23. `MainMenu` komponens (vintage poszter)
24. `StatusPanel` komponens (pergamen szalag)
25. `GameOverModal` komponens (vintage kártya)
26. `StatsDisplay` komponens (retro ponttábla)
27. `App.tsx` összedrótozás (screen routing + overlays)

### Fázis 6: Polish & Testing
28. Cuphead design finomhangolás (grain, vignette, wobble)
29. Animációk polish (bounce, squash, slide timing)
30. AI delay és UX finomhangolás
31. Responsive méretezés tesztelés
32. Edge case-ek tesztelése
33. AI tuning (alapértelmezett súlyok finomhangolása)
34. Statisztikák perzisztencia tesztelés
35. Code review, refaktor

---

*Ez a specifikáció a fejlesztés alapdokumentuma. Minden implementációs döntés innen indul ki.* 🐺🐶


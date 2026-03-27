# 🐺 Wolfs vs Dog – User Stories

> A specifikáció (SPEC.md v5.0) alapján összeállított user story-k.
> Prioritás: 🔴 Must have | 🟡 Should have | 🟢 Nice to have

---

## Epic 1: Főmenü és szerepválasztás

### US-1.1 – Főmenü megjelenítése
🔴 **Must have**

> **Mint** játékos,
> **szeretném** látni a főmenüt a játék indításakor,
> **hogy** választhassak a farkas és a kutyák szerepe között.

**Elfogadási kritériumok:**
- [ ] A játék indításakor a `menu` fázis aktív
- [ ] Megjelenik a játék címe: „WOLFS vs DOG" retro `$font-title` betűtípussal
- [ ] Két gomb látható: **„Play as Wolf 🐺"** és **„Play as Dogs 🐶"**
- [ ] A gombok Cuphead-stílusú retro `$retro-shadow` árnyékkal rendelkeznek
- [ ] Hover-re a gombok felnagyobbodnak (`scale(1.05)`) és háttérszínük `$dusty-rose`-ra vált

---

### US-1.2 – Szerep kiválasztása (Farkas)
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a „Play as Wolf 🐺" gombot megnyomni,
> **hogy** farkasként játszhassak, az AI pedig a kutyákat irányítsa.

**Elfogadási kritériumok:**
- [ ] Kattintás után `humanRole = 'wolfPlayer'`, AI = `'dogPlayer'`
- [ ] A fázis `setup`-ra vált
- [ ] Az üzenet: *„🐺 Place your wolf on any dark square!"*
- [ ] `isAiTurn === false` (az ember helyezi a farkast)

---

### US-1.3 – Szerep kiválasztása (Kutyák)
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a „Play as Dogs 🐶" gombot megnyomni,
> **hogy** kutyákkal játszhassak, az AI pedig a farkast irányítsa.

**Elfogadási kritériumok:**
- [ ] Kattintás után `humanRole = 'dogPlayer'`, AI = `'wolfPlayer'`
- [ ] A fázis `setup`-ra vált
- [ ] Az üzenet: *„🤔 AI is placing the wolf..."*
- [ ] `isAiTurn === true` (az AI helyezi a farkast)

---

### US-1.4 – Statisztika megjelenítése a főmenüben
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni az eddigi játékstatisztikámat a főmenüben,
> **hogy** tudjam, hányszor nyertem/vesztettem.

**Elfogadási kritériumok:**
- [ ] A `StatsDisplay` komponens megjelenik a főmenü gombjai alatt
- [ ] Tartalmazza: nyert / vesztett / összesen
- [ ] Az adatok `localStorage`-ból töltődnek be

---

## Epic 2: Tábla megjelenítése

### US-2.1 – 8×8-as játéktábla renderelése
🔴 **Must have**

> **Mint** játékos,
> **szeretném** látni a 8×8-as sakktábla-szerű játékfelületet,
> **hogy** a figurákat vizuálisan elhelyezhessem és lépésemet megtervezhessem.

**Elfogadási kritériumok:**
- [ ] CSS Grid layout: `grid-template: repeat(8, 1fr) / repeat(8, 1fr)`
- [ ] Váltakozó világos (`$parchment`) és sötét (`$dark-walnut`) mezők
- [ ] Sötét mező: `(row + col) % 2 === 1`
- [ ] 64 db `<Square>` komponens renderelődik
- [ ] A tábla responsive: `min(80vw, 80vh, 600px)`, `aspect-ratio: 1`

---

### US-2.2 – Sor/oszlop jelölők megjelenítése
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni az oszlop (A–H) és sor (1–8) jelölőket a tábla szélein,
> **hogy** a pozíciókat könnyen azonosíthassam.

**Elfogadási kritériumok:**
- [ ] Oszlopjelölők (A–H) a tábla tetején vagy alján
- [ ] Sorjelölők (1–8) a tábla bal vagy jobb oldalán
- [ ] `$font-mono` betűtípus, `$sepia-brown` szín
- [ ] „Kézzel ráírt" hatás (retro stílus)

---

### US-2.3 – Cuphead-stílusú tábla design
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy a tábla úgy nézzen ki, mint egy régi, kopott fa játéktábla,
> **hogy** a Cuphead-inspirált 1930-as évek hangulatát érezhessem.

**Elfogadási kritériumok:**
- [ ] Vastag, egyenetlen `$hand-drawn-border` keret
- [ ] Enyhe `rotate(0.3deg)` a „kézzel rajzolt" hatásért
- [ ] Belső `box-shadow` a kopott hatáshoz
- [ ] Sötét mezőkön fa-textúra (CSS gradiens pattern)
- [ ] Világos mezőkön papír-textúra (CSS noise pattern)

---

## Epic 3: Figurák

### US-3.1 – Kutyák megjelenítése a kezdőpozíción
🔴 **Must have**

> **Mint** játékos,
> **szeretném** látni a 4 kutyát a tábla első sorának sötét mezőin,
> **hogy** a játék kiindulási állapotát lássam.

**Elfogadási kritériumok:**
- [ ] 4 kutya a pozíciókon: `(0,1)`, `(0,3)`, `(0,5)`, `(0,7)`
- [ ] Minden kutya egyedi `id`-val rendelkezik (`dog-0` ... `dog-3`)
- [ ] `$forest-teal` szín, vastag `$ink-black` körvonal
- [ ] Rubber hose stílusú CSS art: kerek fej, lecsüngő fülek, boldog szemek

---

### US-3.2 – Farkas megjelenítése
🔴 **Must have**

> **Mint** játékos,
> **szeretném** látni a farkast a táblán (az elhelyezés után),
> **hogy** tudjam, hol áll az ellenfelem vagy a saját figurám.

**Elfogadási kritériumok:**
- [ ] 1 farkas a kiválasztott pozíción
- [ ] `$dusty-red` szín, vastag `$ink-black` körvonal
- [ ] Rubber hose stílusú CSS art: hegyes fülek, ravasz szemek, kilógó piros nyelv
- [ ] `id: 'wolf'`

---

### US-3.3 – Figurák idle animációja
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy a figurák „éljenek" a táblán (enyhe mozgás),
> **hogy** a játékélmény dinamikusabb legyen.

**Elfogadási kritériumok:**
- [ ] Farkas: enyhe `bounce` animáció (translateY ±3px, `$bounce-duration`)
- [ ] Kutya: enyhe „farokcsóválás" animáció (rotate ±5deg)
- [ ] Az animációk folyamatosak idle állapotban

---

## Epic 4: Farkas elhelyezése (SETUP fázis)

### US-4.1 – Farkas elhelyezése ember által
🔴 **Must have**

> **Mint** farkassal játszó játékos,
> **szeretném** a farkast egy tetszőleges érvényes sötét mezőre helyezni,
> **hogy** a játékot stratégiailag előnyös pozícióból indíthassam.

**Elfogadási kritériumok:**
- [ ] Kattintásra az érvényes sötét mezőre (row ≥ 1) a farkas megjelenik
- [ ] Sikeres elhelyezés után → `phase = 'playing'`, `currentPlayer = 'dogPlayer'`
- [ ] Az üzenet frissül: *„AI's turn! 🤔"* (ha AI a kutya)

---

### US-4.2 – Érvénytelen farkas elhelyezés kezelése
🔴 **Must have**

> **Mint** farkassal játszó játékos,
> **szeretném** visszajelzést kapni, ha érvénytelen mezőre próbálom helyezni a farkast,
> **hogy** tudjam, mi a szabály és újrapróbálhassak.

**Elfogadási kritériumok:**
- [ ] Világos mezőre kattintás → hibaüzenet: *„Invalid placement! You can only place the wolf on a dark square."*
- [ ] Row 0-ra kattintás → hibaüzenet: *„Invalid placement! The wolf cannot be placed on the dogs' starting row."*
- [ ] Foglalt mezőre kattintás → hibaüzenet: *„Invalid placement! This square is already occupied."*
- [ ] Shake animáció az érvénytelen mezőn

---

### US-4.3 – Farkas elhelyezése AI által
🔴 **Must have**

> **Mint** kutyákkal játszó játékos,
> **szeretném**, hogy az AI automatikusan elhelyezze a farkast,
> **hogy** a játék gyorsan elinduljon.

**Elfogadási kritériumok:**
- [ ] Az AI stratégiailag optimális sötét mezőt választ (evaluatePosition alapján)
- [ ] Késleltetés: 300–600ms a „gondolkodás" szimulálására
- [ ] Üzenet: *„🤔 AI is placing the wolf..."* → majd *„AI placed the wolf. Your turn! 🐶"*
- [ ] Elhelyezés után → `phase = 'playing'`, `currentPlayer = 'dogPlayer'`, `isAiTurn = false`

---

## Epic 5: Játékmenet – Emberi lépések

### US-5.1 – Saját figura kiválasztása
🔴 **Must have**

> **Mint** játékos,
> **szeretném** az egyik figurámra kattintva kijelölni azt,
> **hogy** a lépési lehetőségeimet lássam.

**Elfogadási kritériumok:**
- [ ] Kattintásra a saját figurára: `selectedPieceId` beállítódik
- [ ] A kiválasztott figura vizuálisan kiemelődik: `scale(1.15)` + arany glow (`$warm-gold`)
- [ ] Az érvényes célmezők megjelennek zöld lüktető indikátorral (`.square--valid-target`)
- [ ] Üzenet: *„Selected! Click a highlighted square to move."*

---

### US-5.2 – Figura kijelölésének átváltása
🔴 **Must have**

> **Mint** kutyákkal játszó játékos,
> **szeretném** egy másik kutyámra kattintva átváltani a kijelölést,
> **hogy** rugalmasan választhassak lépést.

**Elfogadási kritériumok:**
- [ ] Másik saját figurára kattintás → kijelölés átvált az új figurára
- [ ] Előző figura kijelölése megszűnik
- [ ] Az érvényes célmezők frissülnek az új figurának megfelelően

---

### US-5.3 – Figura kijelölésének megszüntetése
🟡 **Should have**

> **Mint** játékos,
> **szeretném** a kijelölt figurámra újra kattintva visszavonni a kijelölést,
> **hogy** ne legyek kényszerítve lépésre.

**Elfogadási kritériumok:**
- [ ] Ugyanarra a figurára kattintás → `selectedPieceId = null`, `validMoves = []`
- [ ] A vizuális kiemelés eltűnik

---

### US-5.4 – Érvényes lépés végrehajtása
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a kijelölt figurámat egy érvényes célmezőre mozgatni,
> **hogy** a lépésem megtörténjen.

**Elfogadási kritériumok:**
- [ ] Érvényes célmezőre kattintás → figura átkerül az új pozícióra
- [ ] `lastMove` frissül `{ from, to, by: 'human' }` értékkel
- [ ] Kiindulási mező halvány sárga kiemelést kap (`.square--last-move`)
- [ ] A lépés `slide` animációval történik (CSS transition, túllövéses easing)
- [ ] Lépés végén `squash & stretch` animáció
- [ ] Kijelölés automatikusan megszűnik
- [ ] Győzelem-ellenőrzés lefut
- [ ] Ha nincs nyertes → `currentPlayer` vált, `isAiTurn = true`

---

### US-5.5 – Érvénytelen lépés kezelése
🔴 **Must have**

> **Mint** játékos,
> **szeretném** visszajelzést kapni, ha érvénytelen mezőre kattintok lépés közben,
> **hogy** tudjam, mit rontottam el.

**Elfogadási kritériumok:**
- [ ] Érvénytelen mezőre kattintás → hibaüzenet: *„❌ Invalid move! Try again."*
- [ ] Shake animáció a mezőn (`.square--invalid-click`)
- [ ] A kijelölés megmarad, a játékos újrapróbálhat

---

### US-5.6 – Ellenfél figurájára kattintás
🔴 **Must have**

> **Mint** játékos,
> **szeretnék** visszajelzést kapni, ha az AI figurájára kattintok,
> **hogy** tudjam, hogy az nem az én figurám.

**Elfogadási kritériumok:**
- [ ] AI figurájára kattintás → hibaüzenet: *„That's not your piece!"*
- [ ] Nem történik kijelölés

---

### US-5.7 – Kutya mozgás szabályai
🔴 **Must have**

> **Mint** kutyákkal játszó játékos,
> **szeretném**, hogy a kutyáim csak előre (lefelé) átlósan léphessenek,
> **hogy** a játékszabályok betartásra kerüljenek.

**Elfogadási kritériumok:**
- [ ] Kutya érvényes lépései: `(row+1, col-1)` és `(row+1, col+1)`
- [ ] Hátrafelé lépés nem lehetséges
- [ ] Foglalt mezőre nem léphet
- [ ] Táblán kívülre nem léphet
- [ ] Nincs ugrás, nincs ütés

---

### US-5.8 – Farkas mozgás szabályai
🔴 **Must have**

> **Mint** farkassal játszó játékos,
> **szeretném**, hogy a farkasom mind a 4 átlós irányba léphessen,
> **hogy** kihasználhassam a farkas rugalmasságát.

**Elfogadási kritériumok:**
- [ ] Farkas érvényes lépései: `(row±1, col±1)` (4 irány)
- [ ] Foglalt mezőre nem léphet
- [ ] Táblán kívülre nem léphet
- [ ] Nincs ugrás, nincs ütés

---

## Epic 6: Játékmenet – AI lépések

### US-6.1 – AI lépés végrehajtása
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy az AI automatikusan megtegye a lépését,
> **hogy** a játék folytatódjon.

**Elfogadási kritériumok:**
- [ ] AI kör alatt a tábla interakciója letiltva (`.board--ai-turn` → `pointer-events: none`)
- [ ] Üzenet: *„🤔 AI is thinking..."*
- [ ] Animált pontok a „thinking" szöveg mellett
- [ ] Késleltetés: 400–800ms (természetesebb érzés)
- [ ] Az AI lépése automatikusan végrehajtódik
- [ ] Az AI lépése kiemelődik halvány kék háttérrel (`.square--last-move-ai`)
- [ ] Győzelem-ellenőrzés lefut
- [ ] Ha nincs nyertes → `isAiTurn = false`, ember köre indul

---

### US-6.2 – AI Minimax algoritmus
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy az AI intelligens és kihívást jelentő legyen,
> **hogy** a játék izgalmas maradjon.

**Elfogadási kritériumok:**
- [ ] Minimax algoritmus alpha-beta vágással implementálva
- [ ] Iteratív mélyítés (iterative deepening): mélység 1-től max 10-12-ig
- [ ] Időlimit: 2000ms per lépés
- [ ] Move ordering: tranzíciós tábla + heurisztika alapján
- [ ] A farkas maximalizál (pozitív score = jó a farkasnak)
- [ ] A kutyák minimalizálnak

---

### US-6.3 – Pozíció-értékelő heurisztika
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy az AI stratégiailag gondolkodjon,
> **hogy** a lépései ésszerűek és nehezen kiszámíthatók legyenek.

**Elfogadási kritériumok:**
- [ ] 10 értékelési faktor implementálva (wolf mobility, dog mobility, row advance, formation, escape routes, coverage, trapped penalty, center control, distance, dog sync)
- [ ] Súlyozott összegzés `EvalWeights` alapján
- [ ] Pozitív score = farkas előnye, negatív = kutyák előnye
- [ ] Terminális állapotok: `±10000` score

---

### US-6.4 – Tranzíciós tábla (cache)
🟡 **Should have**

> **Mint** rendszer,
> **szeretném** a korábban kiszámított pozíciókat cache-elni,
> **hogy** az AI gyorsabban számoljon.

**Elfogadási kritériumok:**
- [ ] Zobrist hash implementálva (XOR-alapú, pre-generált random kulcsok)
- [ ] Max 100 000 bejegyzés
- [ ] Eviction policy: régi/sekélyebb bejegyzések törlése
- [ ] Játék végén teljes ürítés
- [ ] `exact`, `lowerBound`, `upperBound` flag támogatás

---

## Epic 7: Győzelmi feltételek

### US-7.1 – Kutyák győzelme (farkas bekerítve)
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy a játék felismerje, ha a farkas be van kerítve,
> **hogy** a kutyák győzelme kihirdethető legyen.

**Elfogadási kritériumok:**
- [ ] Ha `wolf.validMoves.length === 0` → `winner = 'dogPlayer'`, `reason = 'wolfTrapped'`
- [ ] Ez akkor igaz, ha a farkas mind a 4 átlós szomszédja foglalt vagy táblán kívüli
- [ ] Győzelem ellenőrzés minden lépés után lefut

---

### US-7.2 – Farkas győzelme (áttörés)
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy a játék felismerje, ha a farkas áttörte a kutyák vonalát,
> **hogy** a farkas győzelme kihirdethető legyen.

**Elfogadási kritériumok:**
- [ ] Ha `wolf.row <= Math.min(...dogs.map(d => d.row))` → `winner = 'wolfPlayer'`, `reason = 'wolfBrokeThrough'`
- [ ] A kutyák hátrafelé nem tudnak lépni, így a farkast nem érik utol

---

### US-7.3 – Farkas győzelme (kutyák nem tudnak lépni)
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy a játék felismerje, ha egyetlen kutya sem tud lépni,
> **hogy** a farkas győzelme kihirdethető legyen.

**Elfogadási kritériumok:**
- [ ] Ha `currentPlayer === 'dogPlayer'` és egyetlen kutya sem tud lépni → `winner = 'wolfPlayer'`, `reason = 'dogsCannotMove'`

---

### US-7.4 – Győzelem-ellenőrzés sorrendje
🔴 **Must have**

> **Mint** rendszer,
> **szeretném** a győzelmi feltételeket helyes sorrendben ellenőrizni,
> **hogy** ne legyen ellentmondásos eredmény.

**Elfogadási kritériumok:**
- [ ] Ellenőrzési sorrend: (1) farkas bekerítve → Dogs Win, (2) farkas áttört → Wolf Wins, (3) aktív játékos nem tud lépni → ellenfél nyer
- [ ] Ha egyik sem → játék folytatódik

---

## Epic 8: Játék vége (GAME_OVER fázis)

### US-8.1 – Győzelem kijelzése
🔴 **Must have**

> **Mint** játékos,
> **szeretném** látni a játék végeredményét,
> **hogy** tudjam, ki nyert.

**Elfogadási kritériumok:**
- [ ] Ember győzelem: *„🎉 You win! Congratulations!"*
- [ ] AI győzelem: *„💀 AI wins! Better luck next time!"*
- [ ] `GameOverModal` megjelenik vintage „THE END" stílusban
- [ ] Overlay: félátlátszó `$ink-black` háttér + vignette
- [ ] Ember nyert: `$vintage-yellow` csillagok, „VICTORY!" felirat
- [ ] AI nyert: `$dusty-red` tónusú, „DEFEATED!" felirat

---

### US-8.2 – Új játék indítása
🔴 **Must have**

> **Mint** játékos,
> **szeretnék** újra játszani a játék végén,
> **hogy** visszatérhessek a főmenübe és új szerepet választhassak.

**Elfogadási kritériumok:**
- [ ] „Play Again" gomb megjelenik a `GameOverModal`-ban
- [ ] Kattintás → `dispatch({ type: 'NEW_GAME' })` → `phase = 'menu'`
- [ ] Teljes állapot visszaáll az `INITIAL_STATE`-re
- [ ] A statisztikák megmaradnak

---

### US-8.3 – Statisztika megjelenítése játék végén
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni az összesített statisztikát a játék végén,
> **hogy** nyomon követhessem a fejlődésemet.

**Elfogadási kritériumok:**
- [ ] A `GameOverModal`-ban megjelenik a `StatsDisplay` komponens
- [ ] Tartalmazza: nyert/vesztett/összesen, breakdown mint farkas/mint kutya
- [ ] Win rate százalékosan

---

## Epic 9: AI tanulás

### US-9.1 – Súlyok frissítése játék után
🔴 **Must have**

> **Mint** rendszer,
> **szeretném** az AI értékelő súlyait frissíteni minden játék után,
> **hogy** az AI játékról játékra fejlődjön.

**Elfogadási kritériumok:**
- [ ] A `GAME_OVER` fázisban `updateWeightsAfterGame` lefut
- [ ] Learning rate: `0.1 / sqrt(gamesPlayed + 1)` (csökkenő)
- [ ] Súlyok clampolva: `[-20, +20]`
- [ ] ~10-20 játék után érezhető javulás

---

### US-9.2 – Tanulási adatok perzisztálása
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy az AI „emlékezzen" a korábbi játékokra böngésző újraindítás után is,
> **hogy** ne nulláról kezdje a tanulást.

**Elfogadási kritériumok:**
- [ ] `LearningData` mentése `localStorage`-ba (`wolfs-vs-dog-ai-learning` key)
- [ ] Betöltés induláskor, mentés minden játék végén
- [ ] Version check: ha verziószám nem egyezik → reset default-ra
- [ ] Max 500 pozíció a `positionHistory` ring buffer-ben

---

### US-9.3 – Pozíció memória
🟡 **Should have**

> **Mint** rendszer,
> **szeretném** a korábban látott pozíciókat és eredményeiket megjegyezni,
> **hogy** az AI a korábbi tapasztalatok alapján finomítsa a lépéseit.

**Elfogadási kritériumok:**
- [ ] Ring buffer: max 500 bejegyzés
- [ ] Minden bejegyzés: `hash`, `score`, `result`, `visits`
- [ ] Ismétlődő pozíciónál `visits` növelése
- [ ] Az AI az evaluation-ben figyelembe veszi

---

## Epic 10: Státusz panel és üzenetek

### US-10.1 – Aktuális állapot kijelzése
🔴 **Must have**

> **Mint** játékos,
> **szeretném** minden pillanatban tudni, mi történik a játékban,
> **hogy** ne legyek elveszve.

**Elfogadási kritériumok:**
- [ ] `StatusPanel` komponens a tábla alatt/mellett
- [ ] Pergamen-szalag stílusú design (`$warm-cream`, `$hand-drawn-border`)
- [ ] Fázis-alapú üzenetek a specifikáció 8.3 pontja szerint
- [ ] Aktuális játékos kiemelve: farkas 🐺 / kutya 🐶 emoji
- [ ] Retro font (`$font-body`), tematikus háttérszín

---

### US-10.2 – Hibaüzenetek megjelenítése
🔴 **Must have**

> **Mint** játékos,
> **szeretnék** egyértelmű hibaüzenetet kapni érvénytelen akciónál,
> **hogy** tudjam, mit csináltam rosszul.

**Elfogadási kritériumok:**
- [ ] Hibaüzenetek `$dusty-red` színnel
- [ ] Eltűnnek 2 másodperc után
- [ ] A hibaüzenetek nem blokkolják a további interakciót

---

### US-10.3 – AI gondolkodás animáció
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni, hogy az AI „gondolkodik",
> **hogy** tudjam, hogy a rendszer nem fagyott le.

**Elfogadási kritériumok:**
- [ ] *„AI is thinking..."* szöveg animált pontokkal (`@keyframes dots`)
- [ ] AI lépés után: *„AI moved [from] → [to]. Your turn!"*

---

## Epic 11: Cuphead vizuális design

### US-11.1 – Vintage háttér és textúra
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy az egész felület 1930-as évek rajzfilm hangulatot árasszon,
> **hogy** a játékélmény egyedi és emlékezetes legyen.

**Elfogadási kritériumok:**
- [ ] Pergamen (`$parchment`) háttérszín
- [ ] Szemcsés textúra overlay (CSS grain noise, `$grain-opacity: 0.06`)
- [ ] Vignette hatás a széleken (`radial-gradient`, `$vignette-strength: 0.35`)
- [ ] Film flicker animáció (enyhe villogás, mint régi vetítőgép)

---

### US-11.2 – Retro tipográfia
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy a betűtípusok retró, kézírásos jellegűek legyenek,
> **hogy** a vizuális stílus egységes legyen.

**Elfogadási kritériumok:**
- [ ] Google Fonts import: `'Luckiest Guy'` (címek) + `'Boogaloo'` (szöveg)
- [ ] Főcím: `$font-title`, `3rem`, `$sepia-brown`, `text-shadow`
- [ ] Gombok és státusz: `$font-body`, `1.2-1.5rem`
- [ ] Koordináták: `$font-mono`, `0.75rem`

---

### US-11.3 – Victory / Defeat animáció
🟢 **Nice to have**

> **Mint** játékos,
> **szeretnék** látványos animációt látni győzelem vagy vereség esetén,
> **hogy** az élmény emlékezetes legyen.

**Elfogadási kritériumok:**
- [ ] Győzelem: CSS confetti animáció (`@keyframes fall` random pozíciójú elemek)
- [ ] Cím wobble animáció a Game Over feliratban
- [ ] Beúszó overlay animáció

---

### US-11.4 – Retro gombok stílusa
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy a gombok vintage, kézzel rajzolt hatásúak legyenek,
> **hogy** a teljes felület egységes legyen.

**Elfogadási kritériumok:**
- [ ] `$warm-cream` háttér, `$hand-drawn-border` keret
- [ ] `$retro-shadow` (hard-edge drop shadow)
- [ ] Hover: `translate(-2px, -2px)`, `$retro-shadow-hover`, `$dusty-rose` háttér
- [ ] Active: `translate(2px, 2px)`, kisebb árnyék
- [ ] `$font-body`, `1.3rem`

---

## Epic 12: Játékszabály érvényesítés (edge case-ek)

### US-12.1 – Farkas a sarokban bekerítve
🔴 **Must have**

> **Mint** rendszer,
> **szeretném** helyesen kezelni, ha a farkas a tábla sarkában van és nincs lépése,
> **hogy** a győzelem helyesen legyen megállapítva.

**Elfogadási kritériumok:**
- [ ] Farkas a sarokban: 3 szomszéd foglalt/táblán kívül, 1 foglalt → Dogs Win
- [ ] Farkas a szélen: 2 szomszéd kívül, 2 foglalt → Dogs Win

---

### US-12.2 – Összes kutya a row 7-en ragadt
🔴 **Must have**

> **Mint** rendszer,
> **szeretném** helyesen kezelni, ha minden kutya az utolsó sorban van és nem tud lépni,
> **hogy** a farkas győzelme kihirdethető legyen.

**Elfogadási kritériumok:**
- [ ] Ha mind a 4 kutya row 7-en és nincs érvényes lépésük → Wolf Wins (`dogsCannotMove`)

---

### US-12.3 – AI kör alatti kattintás blokkolása
🔴 **Must have**

> **Mint** rendszer,
> **szeretném** biztosítani, hogy AI kör alatt a játékos ne tudjon interakcióba lépni a táblával,
> **hogy** ne legyen állapot-inkonzisztencia.

**Elfogadási kritériumok:**
- [ ] `.board--ai-turn` osztály: `pointer-events: none`, `opacity: 0.9`
- [ ] Kattintások teljes figyelmen kívül hagyása AI kör alatt

---

## Epic 13: Statisztikák és perzisztencia

### US-13.1 – Játékstatisztikák mentése
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy a játékeredmények mentésre kerüljenek,
> **hogy** hosszú távon nyomon követhessem a teljesítményemet.

**Elfogadási kritériumok:**
- [ ] `GameStats` mentése `localStorage`-ba (`wolfs-vs-dog-stats` key)
- [ ] Tartalmazza: `totalGames`, `humanWins`, `aiWins`, `humanWinsAsWolf`, `humanWinsAsDog`, `aiWinsAsWolf`, `aiWinsAsDog`
- [ ] Frissítés minden játék végén

---

### US-13.2 – Részletes statisztika kijelzés
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni a részletes bontást (mint farkas / mint kutya),
> **hogy** tudjam, melyik szereppel vagyok erősebb.

**Elfogadási kritériumok:**
- [ ] `StatsDisplay` komponens: retro ponttábla (scoreboard) kinézet
- [ ] Win/Loss/Total kijelzés
- [ ] Breakdown: mint farkas / mint kutya
- [ ] Win rate százalék

---

## Epic 14: Navigáció és kontrollok

### US-14.1 – Visszatérés a főmenübe játék közben
🟡 **Should have**

> **Mint** játékos,
> **szeretném** bármikor visszatérni a főmenübe,
> **hogy** új játékot kezdhessek ha elakadok.

**Elfogadási kritériumok:**
- [ ] „🏠 Main Menu" gomb a játék képernyőn
- [ ] Kattintás → `dispatch({ type: 'NEW_GAME' })` → `phase = 'menu'`
- [ ] A jelenlegi játék elvész (nincs mentés)

---

### US-14.2 – Újraindítás gomb
🟡 **Should have**

> **Mint** játékos,
> **szeretném** a jelenlegi játékot újraindítani,
> **hogy** ugyanazzal a szereppel újra próbálkozhassak.

**Elfogadási kritériumok:**
- [ ] „🔄 Restart" gomb a játék képernyőn
- [ ] Kattintás → a SETUP fázis újraindul ugyanazzal a `humanRole`-lal
- [ ] A jelenlegi játékállás elvész

---

## Epic 15: Responsive design

### US-15.1 – Tábla átméretezése böngészőablak változásakor
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy a tábla mindig jól nézzen ki, függetlenül a böngészőablak méretétől,
> **hogy** kényelmes legyen a játék.

**Elfogadási kritériumok:**
- [ ] A tábla mérete: `min(80vw, 80vh, 600px)`
- [ ] `aspect-ratio: 1` megmarad
- [ ] Átméretezés közben nincs torzulás
- [ ] CSS Grid automatikusan alkalmazkodik

---

## Epic 16: Technikai alapok

### US-16.1 – TypeScript típusdefiníciók
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a típusdefiníciókat elkészíteni,
> **hogy** a strict TypeScript mód támogassa a fejlesztést.

**Elfogadási kritériumok:**
- [ ] `src/types/game.ts` – összes játék-specifikus típus (Position, Piece, GameState, GameAction, stb.)
- [ ] `src/types/ai.ts` – összes AI-specifikus típus (AiMove, EvalWeights, LearningData, MinimaxConfig, stb.)
- [ ] Nincs `any` típus
- [ ] Strict TypeScript kompatibilis

---

### US-16.2 – Game state reducer
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a játékállapotot reducer pattern-nel kezelni,
> **hogy** az állapotváltozások kiszámíthatók és tesztelhetők legyenek.

**Elfogadási kritériumok:**
- [ ] `gameReducer(state: GameState, action: GameAction): GameState`
- [ ] Minden action type kezelve: `SELECT_ROLE`, `PLACE_WOLF`, `SELECT_PIECE`, `DESELECT_PIECE`, `MOVE_PIECE`, `AI_MOVE`, `AI_PLACE_WOLF`, `INVALID_ACTION`, `NEW_GAME`
- [ ] Immutable állapotfrissítés

---

### US-16.3 – useGameState hook
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a fő játékállapotot egy custom hook-ban összefogni,
> **hogy** a komponensek könnyen hozzáférjenek.

**Elfogadási kritériumok:**
- [ ] `useGameState()` hook: `useReducer` alapú
- [ ] Visszaadja: `state`, `dispatch`
- [ ] Kezdő állapot: `INITIAL_STATE`

---

### US-16.4 – useAI hook
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** az AI logikát egy custom hook-ban kezelni,
> **hogy** a React komponensektől elkülönített legyen.

**Elfogadási kritériumok:**
- [ ] `useAI(state, dispatch)` hook
- [ ] `useEffect` figyeli az `isAiTurn` és `phase` változásokat
- [ ] Mesterséges késleltetés: 400–800ms
- [ ] `AbortController` a cleanup-ban
- [ ] SETUP fázisban: `computeWolfPlacement`
- [ ] PLAYING fázisban: `computeAiMove`

---

### US-16.5 – SCSS design rendszer felépítése
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** az SCSS fájlokat a Cuphead design rendszer szerint strukturálni,
> **hogy** a stílusok karbantarthatók és konzisztensek legyenek.

**Elfogadási kritériumok:**
- [ ] `main.scss` → `@use` importok minden részfájlhoz
- [ ] `_variables.scss` → Cuphead paletta, méretek, fontok, animáció időzítések
- [ ] `_base.scss` → body, vignette, grain overlay, globális reset
- [ ] `_typography.scss` → retro font imports, heading stílusok
- [ ] `_board.scss` → tábla grid, mezők, textúrák
- [ ] `_pieces.scss` → rubber hose figurák CSS art
- [ ] `_animations.scss` → bounce, squash, shake, flicker, grain, wobble
- [ ] `_buttons.scss` → retro hard-shadow gombok
- [ ] `_menu.scss` → Main Menu vintage poster
- [ ] `_status.scss` → Status panel pergamen
- [ ] `_modal.scss` → Game Over vintage modal

---

## Összesítő táblázat

| Prioritás | Darab | Leírás |
|-----------|-------|--------|
| 🔴 Must have | 44 | Alapvető játéklogika, UI, AI, validáció, nehézségi szintek, paszuly |
| 🟡 Should have | 20 | Design polish, statisztikák, UX részletek, animációk |
| 🟢 Nice to have | 3 | Victory/Defeat animáció, haladó vizuálok |
| **Összesen** | **67** | |

---

*A user story-k a [SPEC.md](./SPEC.md) v5.0 specifikáció alapján készültek.*

---
---

# 🌱 Kiegészítő User Story-k – Nehézségi szintek & Égig érő paszuly

> A SPEC.md v5.0 kiegészítései (15.8–15.9 fejezetek) alapján.
> Ezek a story-k a meglévő kódbázisra épülnek (`src/types/`, `src/ai/`, `src/game/`, `src/hooks/`, `src/components/`, `src/styles/`).

---

## Epic 17: Nehézségi szintek – Típusok és konfiguráció

### US-17.1 – `DifficultyLevel` típus definiálása
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a nehézségi szint konfigurációt típusbiztosan definiálni,
> **hogy** az AI és a UI is egységesen használja.

**Elfogadási kritériumok:**
- [ ] `src/types/ai.ts`-ben új `DifficultyLevel` interface:
  - `id: number` (1–5)
  - `name: string` ('Seedling', 'Sprout', 'Sapling', 'Tree', 'Giant')
  - `icon: string` (emoji: 🌱🌿🌳🌲🏰)
  - `maxDepth: number`, `maxTimeMs: number`, `blunderChance: number`
  - `useTranspositionTable: boolean`, `useMoveSorting: boolean`, `useLearning: boolean`
  - `winsToUnlock: number`, `beanstalkStage: number` (0–4)
- [ ] Nincs `any` típus

---

### US-17.2 – `DIFFICULTY_LEVELS` konstans tömb létrehozása
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** az 5 szint konfigurációját egy konstans tömbben definiálni,
> **hogy** mind az AI, mind a UI hivatkozhasson rá.

**Elfogadási kritériumok:**
- [ ] Új fájl: `src/ai/difficulty.ts`
- [ ] `DIFFICULTY_LEVELS` tömb 5 elemmel, a SPEC.md 15.8 táblázat szerint:
  - Seedling: `maxDepth:1`, `blunderChance:0.6`, `useLearning:false`, `winsToUnlock:0`
  - Sprout: `maxDepth:3`, `blunderChance:0.35`, `winsToUnlock:3`
  - Sapling: `maxDepth:5`, `blunderChance:0.15`, `winsToUnlock:8`
  - Tree: `maxDepth:8`, `blunderChance:0.05`, `useLearning:true`, `winsToUnlock:15`
  - Giant: `maxDepth:12`, `blunderChance:0.0`, `useLearning:true`, `winsToUnlock:25`
- [ ] `getDifficultyById(id: number): DifficultyLevel` segédfüggvény
- [ ] `getUnlockedLevels(totalWins: number): DifficultyLevel[]` segédfüggvény
- [ ] `getHighestUnlockedLevel(totalWins: number): DifficultyLevel` segédfüggvény

---

### US-17.3 – `GameState` bővítése `difficultyLevel` mezővel
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a `GameState`-ben tárolni az aktuális nehézségi szintet,
> **hogy** a reducer és a hookok tudják, milyen szinten játszik az AI.

**Elfogadási kritériumok:**
- [ ] `src/types/game.ts` → `GameState` kap egy `difficultyLevel: number` mezőt (default: `1`)
- [ ] `GameAction` bővül: `| { type: 'SELECT_DIFFICULTY'; level: number }`
- [ ] `INITIAL_STATE`-ben `difficultyLevel: 1`

---

### US-17.4 – `GameStats` bővítése szintlépés adatokkal
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a statisztikákban tárolni a legmagasabb feloldott szintet,
> **hogy** a szintlépés perzisztens legyen.

**Elfogadási kritériumok:**
- [ ] `src/types/game.ts` → `GameStats` kap:
  - `highestUnlockedLevel: number` (1–5, default: `1`)
  - `selectedLevel: number` (1–5, default: `1`)
- [ ] `src/hooks/useStats.ts` → `loadStats()` és `saveStats()` frissítve az új mezőkkel
- [ ] `recordGame()` frissíti a `highestUnlockedLevel`-t a kumulatív `humanWins` alapján

---

## Epic 18: Nehézségi szintek – AI Blunder mechanizmus

### US-18.1 – Blunder (hibázási) logika implementálása
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy az AI alacsonyabb szinteken szándékosan hibázzon,
> **hogy** a játék kezdőbarát legyen és ne legyen lehetetlen nyerni.

**Elfogadási kritériumok:**
- [ ] `src/ai/aiPlayer.ts`-ben új függvény: `computeAiMoveWithDifficulty(state, difficulty, learningData)`
- [ ] A `blunderChance` alapján `Math.random() < blunderChance` esetén random lépés
- [ ] Random lépés: `generateAllMoves(state, aiRole)` közül véletlenszerűen választ
- [ ] Ha nem blunder: normál minimax a `difficulty.maxDepth` és `difficulty.maxTimeMs` limitekkel
- [ ] `useLearning === false` esetén a `DEFAULT_WEIGHTS`-et használja (nem a tanult súlyokat)

---

### US-18.2 – `useAI` hook frissítése a nehézségi szinttel
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a `useAI` hookot úgy módosítani, hogy a `state.difficultyLevel` alapján válassza az AI konfigurációt,
> **hogy** a nehézségi szint ténylegesen hasson az AI viselkedésére.

**Elfogadási kritériumok:**
- [ ] `src/hooks/useAI.ts` → a `doAiTurn` függvény olvassa ki a `state.difficultyLevel`-t
- [ ] `getDifficultyById(state.difficultyLevel)` alapján konfigurálja a minimaxot
- [ ] SETUP fázisban: wolf placement a difficulty-nek megfelelő weights-szel
- [ ] PLAYING fázisban: `computeAiMoveWithDifficulty` hívás
- [ ] A `useEffect` dependency array tartalmazza a `state.difficultyLevel`-t

---

### US-18.3 – Tanulás csak magasabb szinteken
🟡 **Should have**

> **Mint** rendszer,
> **szeretném**, hogy az AI tanulás (weight update) csak a 4-5. szinten történjen,
> **hogy** az alacsonyabb szintek konzisztensen könnyűek maradjanak.

**Elfogadási kritériumok:**
- [ ] `src/App.tsx` → `GAME_OVER` hatásban: `difficulty.useLearning` ellenőrzés
- [ ] Ha `useLearning === false` → `updateWeightsAfterGame` nem fut le
- [ ] Ha `useLearning === true` → normál tanulás (mint eddig)

---

## Epic 19: Nehézségi szintek – Reducer és állapotkezelés

### US-19.1 – `SELECT_DIFFICULTY` action a reducerben
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a menüben szintet választani,
> **hogy** az AI nehézségét szabályozhassam.

**Elfogadási kritériumok:**
- [ ] `src/game/gameState.ts` → `gameReducer` kezeli a `SELECT_DIFFICULTY` action-t:
  - `state.difficultyLevel = action.level`
  - Csak `menu` fázisban engedélyezett
  - Validáció: az `action.level` 1–5 közötti, és a szint feloldott
- [ ] `INITIAL_STATE.difficultyLevel = 1`

---

### US-19.2 – `SELECT_ROLE` action megtartja a kiválasztott szintet
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném**, hogy a `SELECT_ROLE` action ne írja felül a korábban kiválasztott `difficultyLevel`-t,
> **hogy** a szintválasztás és a szerepválasztás egymástól független legyen.

**Elfogadási kritériumok:**
- [ ] `SELECT_ROLE` case → `difficultyLevel: state.difficultyLevel` (megmarad)
- [ ] `NEW_GAME` case → `difficultyLevel` visszaáll a `stats.selectedLevel`-re (vagy 1-re)

---

## Epic 20: Nehézségi szintek – UI / DifficultySelector

### US-20.1 – `DifficultySelector` komponens létrehozása
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a főmenüben látni az elérhető nehézségi szinteket,
> **hogy** a tudásszintemhez illő kihívást válasszak.

**Elfogadási kritériumok:**
- [ ] Új komponens: `src/components/DifficultySelector.tsx`
- [ ] Props: `levels: DifficultyLevel[]`, `currentLevel: number`, `totalWins: number`, `onSelect: (level: number) => void`
- [ ] 5 gomb/sor megjelenítése, mindegyik az adott szint `icon` + `name` értékével
- [ ] Feloldott szinteken: ✅ zöld pipa, kattintható
- [ ] Zárolt szinteken: 🔒 lakat ikon, szürke, nem kattintható
- [ ] Kiválasztott szint: `$warm-gold` border kiemelés
- [ ] Zárolt szinteknél tooltip/felirat: *"Need X wins to unlock"*

---

### US-20.2 – `DifficultySelector` integrálása a `MainMenu`-be
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a szintválasztót a főmenüben a szerepválasztás felett látni,
> **hogy** először szintet, aztán szerepet válasszak.

**Elfogadási kritériumok:**
- [ ] `src/components/MainMenu.tsx` → `<DifficultySelector>` renderelése a gombok felett
- [ ] Props összekötése: `stats.humanWins`, `stats.selectedLevel`, `dispatch SELECT_DIFFICULTY`
- [ ] A szintválasztás után a szerepválasztó gombok aktívak maradnak

---

### US-20.3 – Aktuális szint kijelzése a `StatusPanel`-en
🟡 **Should have**

> **Mint** játékos,
> **szeretném** játék közben is látni, milyen szinten játszom,
> **hogy** tudjam, milyen nehézségű az AI.

**Elfogadási kritériumok:**
- [ ] `src/components/StatusPanel.tsx` → a szint ikonja és neve megjelenik (pl. „🌱 Seedling")
- [ ] A `state.difficultyLevel` alapján a `getDifficultyById` segítségével
- [ ] Retro stílusú badge megjelenés

---

### US-20.4 – `DifficultySelector` SCSS stílus
🟡 **Should have**

> **Mint** fejlesztő,
> **szeretném** a szintválasztót Cuphead-stílusúra formázni,
> **hogy** vizuálisan illeszkedjen a menühöz.

**Elfogadási kritériumok:**
- [ ] Stílusok `src/styles/_menu.scss`-ben vagy új `_difficulty.scss`-ben
- [ ] Retro gombok: `$hand-drawn-border`, `$retro-shadow`
- [ ] Feloldott: `$forest-teal` tint
- [ ] Zárolt: `opacity: 0.4`, szürke háttér
- [ ] Kiválasztott: `$warm-gold` border + glow
- [ ] Animáció: szintlépéskor rövid „unlock" felvillanás

---

## Epic 21: Égig érő paszuly – Beanstalk komponens

### US-21.1 – `Beanstalk` komponens alapstruktúra
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a tábla mellett látni egy növekvő paszulyt,
> **hogy** vizuálisan is lássam a fejlődésemet a játékban.

**Elfogadási kritériumok:**
- [ ] Új komponens: `src/components/Beanstalk.tsx`
- [ ] Props: `stage: number` (0–4), `currentLevel: DifficultyLevel`, `totalWins: number`, `nextUnlockAt: number`
- [ ] Renderel: `beanstalk__ground` (föld), `beanstalk__vine` (inda), `beanstalk__level-badge` (szint ikon)
- [ ] A `stage` prop alapján CSS osztály: `beanstalk--stage-0` ... `beanstalk--stage-4`

---

### US-21.2 – Paszuly 5 növekedési fázisa
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy a paszuly fokozatosan nőjön a szintlépésekkel,
> **hogy** vizuálisan is érezhető legyen az előrehaladás.

**Elfogadási kritériumok:**
- [ ] **Stage 0 (Seedling):** kis csíra a földből – inda magassága 20px
- [ ] **Stage 1 (Sprout):** fiatal hajtás 1 levéllel – inda 80px
- [ ] **Stage 2 (Sapling):** kis fa 2-3 levéllel – inda 160px
- [ ] **Stage 3 (Tree):** nagy fa 4+ levéllel – inda 260px
- [ ] **Stage 4 (Giant):** fellegvár a felhők közt a paszuly tetején – inda 360px, castle + clouds emoji
- [ ] Minden fázis között smooth height transition (`1s cubic-bezier(0.34, 1.56, 0.64, 1)`)

---

### US-21.3 – Paszuly levelek (rubber hose stílus)
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy a paszulyon 1930-as rajzfilmstílusú levelek legyenek,
> **hogy** a vizuál illeszkedjen a Cuphead-design rendszerhez.

**Elfogadási kritériumok:**
- [ ] `beanstalk__leaf` elemek: `$warm-gold` háttér, `$ink-black` körvonal, `border-radius: 50% 0 50% 0`
- [ ] Levelek váltakozva bal és jobb oldalon az indán
- [ ] Stage 0: 0 levél, Stage 1: 1 levél, Stage 2: 2-3, Stage 3: 4+, Stage 4: 5+ levél
- [ ] `leafWiggle` animáció: enyhe forgatás (±5deg, 2.5s loop)

---

### US-21.4 – Fellegvár a felhők közt (Stage 4)
🟡 **Should have**

> **Mint** játékos,
> **szeretném**, hogy az 5. szinten a paszuly tetején fellegvár jelenjen meg felhőkkel,
> **hogy** a „Giant" szint vizuálisan is impozáns legyen.

**Elfogadási kritériumok:**
- [ ] `beanstalk__castle`: 🏰 emoji, `wobble` animáció, `text-shadow: 2px 2px 0 $ink-black`
- [ ] `beanstalk__clouds`: ☁️ emoji, `cloudFloat` animáció (translateX ±5px, 4s loop)
- [ ] Csak `stage === 4` esetén renderelődik

---

### US-21.5 – Level badge a paszuly tetején
🔴 **Must have**

> **Mint** játékos,
> **szeretném** az aktuális szint ikonját a paszuly tetején látni,
> **hogy** egyből tudjam, hol tartok.

**Elfogadási kritériumok:**
- [ ] `beanstalk__level-badge`: kör alakú badge (`$warm-cream` háttér, `$hand-drawn-border`, `$retro-shadow`)
- [ ] Tartalmazza az aktuális szint emojit (🌱/🌿/🌳/🌲/🏰)
- [ ] Pozíció: a paszuly tetején (absolute, top: 0)
- [ ] Méret: 36×36px

---

### US-21.6 – Progresszió kijelzés a paszuly tövében
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni, hány győzelem kell a következő szinthez,
> **hogy** motivált legyek tovább játszani.

**Elfogadási kritériumok:**
- [ ] A paszuly tövénél (ground felett): szöveg: *„3/8 wins"* formátumban
- [ ] Mini progress bar: kitöltött rész `$warm-gold`, háttér `$dark-walnut`
- [ ] Ha az 5. szinten van → *„MAX LEVEL"* felirat `$vintage-yellow` színnel
- [ ] Retro font (`$font-body`), kis méret (`0.75rem`)

---

## Epic 22: Égig érő paszuly – SCSS stílusok

### US-22.1 – `_beanstalk.scss` létrehozása
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a paszuly stílusait egy dedikált SCSS partial-ban kezelni,
> **hogy** karbantartható és a design rendszerrel konzisztens legyen.

**Elfogadási kritériumok:**
- [ ] Új fájl: `src/styles/_beanstalk.scss`
- [ ] `@use 'variables' as v;` és `@use 'sass:color';`
- [ ] `.beanstalk` konténer: `width: 80px`, `min-height: 400px`, flex column, align center
- [ ] `.beanstalk__ground`: `$dark-walnut`, `border-radius: 50% 50% 0 0`
- [ ] `.beanstalk__vine`: `$forest-teal`, `$ink-black` border, `sway` animáció
- [ ] `.beanstalk__leaf`: `$warm-gold`, levél alakú `border-radius`, `leafWiggle` animáció
- [ ] `.beanstalk__castle`, `.beanstalk__clouds`: emoji elemek animációkkal
- [ ] `.beanstalk__level-badge`: retro badge stílus
- [ ] `.beanstalk--stage-0` ... `.beanstalk--stage-4`: fázisonkénti inda magasság
- [ ] `main.scss`-be felvéve: `@use 'beanstalk';`

---

### US-22.2 – Paszuly animációk hozzáadása
🟡 **Should have**

> **Mint** fejlesztő,
> **szeretném** a paszuly-specifikus animációkat az `_animations.scss`-be felvenni,
> **hogy** egy helyen legyenek az összes keyframe-ek.

**Elfogadási kritériumok:**
- [ ] `src/styles/_animations.scss`-be új keyframe-ek:
  - `@keyframes sway` – inda lassú ringatása (rotate ±1deg, 3s)
  - `@keyframes leafWiggle` – levelek ringása (rotate ±5deg, 2.5s)
  - `@keyframes cloudFloat` – felhők úszása (translateX ±5px, 4s)
  - `@keyframes beanstalkGrow` – szintlépéskor felfelé növekedés (height 0 → target, bounce easing)
- [ ] A grow animáció csak szintváltáskor fut le (JS-ből CSS class toggle)

---

## Epic 23: Égig érő paszuly – Layout integráció

### US-23.1 – Paszuly elhelyezése a tábla mellett (desktop)
🔴 **Must have**

> **Mint** játékos,
> **szeretném** a paszulyt a játéktábla jobb oldalán látni,
> **hogy** ne takarja el a táblát, de jól látható legyen.

**Elfogadási kritériumok:**
- [ ] Az `App.tsx` vagy `GameBoard.tsx` layout: tábla + paszuly egymás mellett
- [ ] Desktop (>768px): flex row, tábla bal oldalon, paszuly jobb oldalon
- [ ] A paszuly vertikálisan a tábla aljához igazodik (ground = tábla alja)
- [ ] Gap: ~16px a tábla és a paszuly közt

---

### US-23.2 – Paszuly elhelyezése a tábla alatt (mobil)
🟡 **Should have**

> **Mint** mobil játékos,
> **szeretném** a paszulyt a tábla alatt horizontálisan látni,
> **hogy** kis képernyőn is jól nézzen ki.

**Elfogadási kritériumok:**
- [ ] Mobil (<768px): flex column, paszuly a tábla alatt
- [ ] Horizontális layout: paszuly ikon + szint név + progress bar egy sorban
- [ ] Kompaktabb megjelenés: paszuly magasság max 60px
- [ ] CSS `@media (max-width: 768px)` breakpoint

---

### US-23.3 – Paszuly integrálása az `App.tsx`-be
🔴 **Must have**

> **Mint** fejlesztő,
> **szeretném** a `Beanstalk` komponenst az `App.tsx`-be bekötni,
> **hogy** a játék képernyőn megjelenjen.

**Elfogadási kritériumok:**
- [ ] `App.tsx` → `Beanstalk` renderelése a `setup`/`playing`/`gameOver` fázisoknál
- [ ] Props: `stage` = `getDifficultyById(state.difficultyLevel).beanstalkStage`
- [ ] `currentLevel` = `getDifficultyById(state.difficultyLevel)`
- [ ] `totalWins` = `stats.humanWins`
- [ ] `nextUnlockAt` = a következő szint `winsToUnlock` értéke (vagy 0 ha max szinten)

---

## Epic 24: Szintlépés vizuális feedback

### US-24.1 – Szintlépés felismerése és értesítés
🔴 **Must have**

> **Mint** játékos,
> **szeretném** tudni, ha új szintet oldottam fel győzelem után,
> **hogy** motiváló visszajelzést kapjak.

**Elfogadási kritériumok:**
- [ ] `GameOverModal`-ban vagy külön értesítésben: *„🎉 New level unlocked: Sprout 🌿!"*
- [ ] Csak akkor jelenik meg, ha a `humanWins` **épp elérte** egy szint `winsToUnlock` küszöbét
- [ ] Az üzenet tartalmazza az új szint nevét és ikonját
- [ ] Vintage stílusú kijelzés (`$warm-gold` szín, `$font-title` betűtípus)

---

### US-24.2 – Paszuly grow animáció szintlépésnél
🟡 **Should have**

> **Mint** játékos,
> **szeretném** látni, ahogy a paszuly megnő szintlépéskor,
> **hogy** vizuálisan is átéljem az előrelépést.

**Elfogadási kritériumok:**
- [ ] Szintlépéskor a `beanstalk__vine` `height` transition fut le (1s bounce easing)
- [ ] Az új levél(ek) `fadeIn` animációval jelennek meg
- [ ] Stage 4 elérésekor a castle + clouds `fadeInScale` animációval jelenik meg
- [ ] A grow animáció a `GameOverModal` megjelenésekor indul

---

### US-24.3 – Szintlépés megjelenítése a `GameOverModal`-ban
🟡 **Should have**

> **Mint** játékos,
> **szeretném** a játék végén a `GameOverModal`-ban látni a szintlépést és a paszuly új állapotát,
> **hogy** egy helyen kapjak összefoglaló visszajelzést.

**Elfogadási kritériumok:**
- [ ] Ha szintlépés történt: a modal tartalmaz egy *„Level Up!"* szekciót
- [ ] Kis `Beanstalk` preview az új stage-dzsel
- [ ] Progresszió: *„Next: Sapling 🌳 – 5 more wins"*
- [ ] Ha max szinten: *„🏰 You've reached the top of the beanstalk!"*

---

## Epic 25: Szintlépés perzisztencia

### US-25.1 – Kiválasztott szint mentése localStorage-ba
🔴 **Must have**

> **Mint** játékos,
> **szeretném**, hogy a szintválasztásom megmaradjon böngésző újraindítás után,
> **hogy** ne kelljen minden alkalommal újra beállítanom.

**Elfogadási kritériumok:**
- [ ] `src/hooks/useStats.ts` → `GameStats.selectedLevel` mentése/betöltése
- [ ] `GameStats.highestUnlockedLevel` frissítése `recordGame()`-ben a `humanWins` alapján
- [ ] Default: `selectedLevel: 1`, `highestUnlockedLevel: 1`
- [ ] `loadStats()` → ha `selectedLevel > highestUnlockedLevel`, visszaáll `highestUnlockedLevel`-re

---

### US-25.2 – Szintlépés küszöb kalkuláció
🔴 **Must have**

> **Mint** rendszer,
> **szeretném** a szintlépés küszöböket a `DIFFICULTY_LEVELS` alapján kiszámítani,
> **hogy** az egész rendszer a konfigurációból legyen vezérelve.

**Elfogadási kritériumok:**
- [ ] `getHighestUnlockedLevel(totalWins)`: végigmegy a `DIFFICULTY_LEVELS`-en, visszaadja a legmagasabb `winsToUnlock <= totalWins` szintet
- [ ] `getNextLevelUnlockWins(currentLevel, totalWins)`: visszaadja a következő szint `winsToUnlock` értékét, vagy `null` ha max
- [ ] Tesztelve a küszöb értékekkel: 0→1, 3→2, 8→3, 15→4, 25→5

---

## Összesítő – Új story-k

| Epic | Téma | Story-k | Prioritás bontás |
|------|------|---------|-----------------|
| 17 | Típusok & konfig | 4 | 🔴×4 |
| 18 | AI Blunder mechanizmus | 3 | 🔴×2, 🟡×1 |
| 19 | Reducer & állapotkezelés | 2 | 🔴×2 |
| 20 | DifficultySelector UI | 4 | 🔴×2, 🟡×2 |
| 21 | Beanstalk komponens | 6 | 🔴×3, 🟡×3 |
| 22 | Beanstalk SCSS | 2 | 🔴×1, 🟡×1 |
| 23 | Layout integráció | 3 | 🔴×2, 🟡×1 |
| 24 | Szintlépés feedback | 3 | 🔴×1, 🟡×2 |
| 25 | Perzisztencia | 2 | 🔴×2 |
| **Összesen** | | **29** | **🔴×19, 🟡×10** |


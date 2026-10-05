# Brief: writing maths lessons for Lärlabbet

Lärlabbet is a single-file HTML learning app for Swedish school children (grades 4–9). Maths for Years 4 and 5 is finished: 31 lessons in `src/app.src.html`. The lessons follow the Swedish curriculum **Lgr22, Matematik**:
- **Year 6:** *centralt innehåll årskurs 4–6*, at the end-of-stage level.
- **Years 7, 8 and 9:** *centralt innehåll årskurs 7–9*. Each year is a clear step up from the one before.

Lessons already in the app, so don't repeat them:
- **Year 4:** place value, rounding, addition and subtraction, multiplication, division, fractions with pizza, tenths, length, time, area and perimeter, shapes, triangles, statistics, patterns and algebra.
- **Year 5:** big numbers, negative numbers on a thermometer, column multiplication, short division, equivalent fractions, fraction of an amount, hundredths, percent basics, unit conversion, time intervals, area of rectangles, angles, coordinates, mean, chance, expressions.

Run every command from the repo root.

**Do not edit** `src/`, `build.sh`, `tools/`, `tests/` or `docs/`, and do not run git. Other workers are writing other lessons at the same time, each in their own file in `wip/`. Write only your own lesson file and your own output folder in `build/`.

**Wrap your whole file in one block `{ ... }`.** All the lesson files end up inlined into the same script, one after another. A local helper `const` or `function` inside your block can then never clash with another worker's.

**Years 7–9 are teenagers, aged 13–15.** Keep Olle, but use examples that fit their age and are not childish: mobile data and phone plans, gaming and streaming, sport results, saving for something, sales and discounts, travel, cooking for a party, building and DIY, music, and science facts.

## The product (what the owner wants)

- **Visual, animated lessons.** The lessons are explained as whiteboard animation in a hand-drawn marker style. A pen held by a hand draws every stroke, step by step, like a teacher at a whiteboard: worked solutions with equations, arrows, highlights and short written labels.
- **The owl teacher "Olle" talks under the board.** He says one or two short sentences per scene. The owner rejected text-heavy "classic" lessons: **the picture explains, the text supports.**
- **Fun, real-world examples:** money (kronor, öre), shopping, sports, cooking, temperature, travel and timetables, pets, pizza and chocolate.
- **Graphics must look professional:**
  - Nothing overlaps.
  - Text is readable, at least about 22px on the 800×500 board.
  - Everything stays inside the board.
  - Layout is balanced and centred.
- **Three languages:** every text exists in Swedish (`sv`, the default and main language), English (`en`) and Arabic (`ar`).
  - Use natural Swedish school words, for example "tiondelar", "nämnare", "täljare", "överslag", "medelvärde", "koordinatsystem".
  - Arabic must be correct Modern Standard Arabic.
  - Numbers always use Western digits.
- **Notation must follow the language:**
  - Swedish uses a decimal comma, "·" for times, "/" for division, and a space as thousands separator.
  - English uses ".", "×", "÷" and a comma.
  - Use the helpers `dfmt`, `fmt`, `MUL()`, `DIVS()` and `SEP()` instead of hard-coding these.

## How a lesson is written

Study these before writing:
- The Year 4 and Year 5 lessons in `src/app.src.html` (search for `LESSONS.push`).
- The `HELP`/`HINTS` objects in `src/app.src.html`.

Helpers are defined in `src/app.src.html`. Search for each one to read its signature. The main ones are:

- **Basic drawing:**
  - `R.line/rect/circ/arrow/dashed/bar/barPart/wedge/loop` return SVG path strings with a hand-drawn wobble.
  - `A.p(d,color,width)` draws a path. `A.tx(text,x,y,size,color,anchor)` writes text; `y` is the baseline and the anchor defaults to centred.
  - `A.frac(n,d,x,y,size,color)` returns an array. `A.arrow(x1,y1,x2,y2,color,bend)` draws an arrow.
  - `A.hatch(path,color)` fills an area with hatching. `A.hl(x,y,w,h)` is a yellow highlighter. `A.band(x,y,w,h,color)` is a pale column background. `A.wipe()` clears the board.
  - `qt(text,x,y,size,color)` is a quickly written small text, for labels and numbers.
- **Ready-made boards:** `rod`, `ones`, `dots`, `dotGrid`, `plines`, `polyPts`, `nline`, `vAdd`, `vSub`, `arrayBoard`, `groupsBoard`, `bar10`, `part10`, `decCol`, `ruler`, `clock`, `timeline`, `gridRect`, `angleAt`, `chart`, `tally`, `scale`, `eqLines`, `pvHead`, `pvDigits`.
- **Text, numbers and random values:**
  - `t3(sv,en,ar)` builds a text in three languages, and `L(obj)` picks the current language.
  - `fmt(n)` adds thousands separators. `dfmt(x,decimals)` writes a decimal number in the right notation.
  - `rint(a,b)` gives a random integer, `pick` a random element, `shuffle` a shuffled copy, and `pad` pads with zeros.
- **Colours:** `"k"` black, `"b"` blue, `"r"` red, `"g"` green, `"o"` orange.
- **The board:** 800 × 500 SVG units.

### Lesson object shape

```js
const XYZ={steps:[ {say:t3(sv,en,ar), draw:()=>[A.wipe(), ...actions]}, ... ]};   // 4-6 scenes
LESSONS.push({id:"xyz",subject:"math",grades:"5",kind:"wb",
  title:t3(sv,en,ar),
  icon:`<svg viewBox="0 0 320 180">...</svg>`,   // a clean, simple card picture in the same style as the Year 4 icons
  steps:XYZ.steps, mount:wbMount(XYZ),
  gen(level){ ... return {kind, ans, show, q:[A.wipe(),...], sol:[...]} }   // level 0 easy, 1 medium, 2 hard
});
```

**Scenes (`steps`):**
- Each scene's `draw()` returns the actions for that scene.
- A scene that starts with `A.wipe()` starts on a clean board. A scene without it continues drawing on the previous board, which is good for building up a solution.
- Each `say` is one or two short sentences that match exactly what is drawn.

**`gen(level)`** makes a fresh random practice problem with new numbers each time. It returns:
- `q`: the question drawn on the board, starting with `A.wipe()`.
- `sol`: the worked solution, drawn on top of `q` after the pupil answers, step by step with the answer in green.
- Answer kinds:
  - `kind:"num"`: `ans` is a number. Add `dec:true` if decimals are allowed. If the answer can be negative, also add `signed:true`: this gives a ± key, because phone keypads often lack a minus.
  - `kind:"frac"`: `ans:[n,d]`. Any equivalent fraction is accepted.
  - `kind:"pair"`: `ans:[a,b]`, with `sep` and/or `labels`, and optionally `check:(a,b)=>bool`. Use `check` when the order doesn't matter, such as two solutions x₁ and x₂. `signed:true` on a pair adds a ± key that flips the sign of the box the pupil is in.
  - `kind:"choice"`: `opts:[t3(...),...]` (2–4 options) and `ans` as the index of the right option. Shuffle the options so the right answer isn't always first.
- `show`: how the right answer is written for the pupil, for example `dfmt(...)` or a `t3(...)`.

**Correctness:**
- The maths must be correct for every random value. Check your generators' answers with a small node or browser loop.
- Avoid numbers that break the layout, such as answers that are too long or values that make degenerate pictures.

**HELP and HINTS** (register them in your own file):

```js
Object.assign(HELPX,{xyz:[{say:t3(...),draw:()=>[...]}, ...]});   // 1-2 scenes: a SIMPLER explanation with an everyday picture, short, not boring
Object.assign(HINTSX,{xyz:[ {say:t3(...),cut:g=>g.sol.slice(0,2)}, {...level1}, {...level2} ]});  // a hint per level: say + cut(g) = part of g.sol that shows the method WITHOUT the answer
```

- HELP scenes are drawn after the board is wiped. Do not put `A.wipe()` in them.
- A hint must never reveal the final answer.

## Building and checking your work (required)

Your file is inserted at the `/*NEW-LESSONS*/` marker in a copy of the app. `YEAR` is your school year, so the shots open that year's lesson page:

```bash
bash tools/lesson-build.sh wip/y6a.js build/y6a          # -> build/y6a/test.html, syntax-checked
YEAR=6 PW=/opt/node-tools/node_modules/playwright node tools/lesson-shots.js build/y6a sv id1,id2,id3,id4
```

Your ids are already in `COURSES` in `src/app.src.html`. A card shows up as soon as a lesson with that id exists. Use `grades:"6"` (or "7", "8", "9") in the lesson object.

`lesson-shots.js` saves these screenshots to `build/y6a/shots/`:
- every scene
- the HELP scenes
- for each level, two question boards, two solution boards and one hint board

It also prints the texts, the answers and `errors [...]`.

To view many screenshots at once, build a contact sheet and open it with the Read tool:

```bash
DIR=build/y6a/shots PW=/opt/node-tools/node_modules/playwright node tools/sheet.js '^sv-id1' build/y6a/sheet-id1.png
```

Then:
- **Look at every screenshot.** Fix overlaps, text running off the board, cramped or empty layouts, and drawings that don't match what Olle says.
- Run `lesson-shots.js` for `en` and `ar` too, and check that the Arabic and English boards look right. Arabic board text is drawn right-to-left automatically.
- Repeat until it's clean and `errors []`.

Do not install packages and do not use the network. Everything needed is already here.

## What to hand back

Your final message should contain:
- the path of your lesson file
- the 4 lesson ids and their titles
- one line per lesson on what it teaches
- anything you were unsure about

Keep it short.

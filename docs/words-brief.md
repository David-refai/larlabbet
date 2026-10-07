# Brief: test words, test-style questions and fuller practice (Lärlabbet maths)

You work on the Swedish maths lessons of Lärlabbet (grades 4–9, Lgr22). Read `docs/lesson-brief.md` first for how lessons, the board helpers and the three languages work.

## The problem

The owner tested the app on a real pupil. The lesson explained "avrundning" well. But the pupil failed the questions, because the questions used words like "tiondelar" that the pupil didn't know.

Swedish teachers explain simply. Swedish tests and textbooks, though, ask in a harder, wordier way: "Avrunda till tiondelar", "Ange svaret i hela kronor", "Hur stor andel…", "Beräkna", "Bestäm", "Uppskatta", "differensen", "produkten", "kvoten", "nämnare". Many pupils, including those learning Swedish as a second language, don't know these words.

The owner also said the practice is too thin and "does not cover all the topics" of a lesson.

## What already exists (do not change it)

- **The words engine** is in `src/app.src.html`; search for `words to know`.
  - `TERM(key,{sv,m,d,ex,tr})` registers a word.
  - `WORDS[lessonId]=[keys]` lists a lesson's words.
- **Core words** are already registered in `src/lessons/terms-0core.js`: tiondel, hundradel, avrunda, decimal, heltal, tiotal, hundratal, vardesiffra, overslag, ungefar. Read that file, copy its style exactly, and don't re-register those keys.
- **Chips appear by themselves.**
  - Any registered word found in a scene's Swedish text gets a 📖 chip that opens a card with the explanation and the English and Arabic translations.
  - The same happens for a word in a practice question's board text or choice options.
- **Practice now has more questions.** It has 5 of the lesson's own questions from `gen(level)`, plus one "Ordkoll" question ("what does this word mean?") built from the lesson's WORDS, plus one question from an earlier lesson.

## Your job, for each lesson in your grades

1. **Words** (in your own file `src/lessons/terms-<yours>.js`, wrapped in `{ … }`):
   - Register 4–10 TERMs for the lesson: the Swedish words a test about this topic would use. Include instruction verbs only where they matter for the topic, such as "beräkna", "förenkla", "lös ekvationen", "bestäm", "uppskatta" and "jämför".
   - Set `WORDS.<lessonId>=[…]`; it may reuse keys from any file.
   - Each TERM has:
     - `sv`: the word as a pupil meets it, e.g. `"nämnare"` or `"tiondel / tiondelar"`.
     - `m`: a case-insensitive RegExp that finds the word and its inflections in Swedish text. Use the `B`/`E` boundary helpers exactly as in core, e.g. `new RegExp(B+"nämnar(e|en|na)"+E,"i")`. Don't make it so loose that it matches unrelated words.
     - `d`: `t3(sv,en,ar)`, ONE short simple sentence of at most 70 characters per language, written for a 10–13-year-old. No circular definitions.
     - `ex`: a tiny example of at most 28 characters, Swedish notation (decimal comma, ·), e.g. `"3/4: nämnaren är 4"`.
     - `tr`: `{en:"…",ar:"…"}`, the normal school word in English and in Arabic (Modern Standard Arabic).
   - Keys are lowercase ascii with no å, ä or ö (`namnare`, `taljare`, `overslag`). Before adding a key, grep all `src/lessons/terms-*.js` files and reuse the key if the word already exists. First registration wins.
2. **Test-style wording in the questions.** Edit the lesson's `gen`. Where the question text is plain, make it sometimes (randomly, with `pick`) use the wording real Swedish tests use, in all three languages.
   - Examples: "Avrunda till en decimal" sometimes becomes "Avrunda till tiondelar" or "Avrunda till närmaste tiondel". "Hur mycket blir…" sometimes becomes "Beräkna…". Add a "Svara i hela kronor" type of instruction where it fits.
   - Keep the text short enough to fit the 800-wide board at its size. Measure with the existing helpers or keep the length close to the original.
3. **Cover the whole lesson.** Compare the lesson's scenes, and the Lgr22 content the lesson claims, with what `gen` actually asks.
   - If a scene teaches something `gen` never practises, add that question type to `gen` at a fitting level (0, 1 or 2). Example: a rounding lesson that teaches rounding to tens, hundreds and tenths but only practises some of them.
   - Prefer short word problems in the style of the Swedish national test (NP) at levels 1–2. They should use real-life contexts and the test words above.
   - Each new question type needs `q` (board), `ans`, `show`, `sol` (a drawn worked solution) and `hint` if the other types have one, exactly like the existing ones.
   - Keep notation per language (`dfmt`, `fmt`, `MUL()`, `DIVS()`).
   - Aim for at least 4 different question types per lesson, spread over levels 0–2.
4. **Don't break anything.** Keep every existing lesson id, `steps`, the answer kinds and the levels. Don't touch other workers' lessons.

## Your grades and files

- **Your lessons:** given in your task message.
- **Words file:** write only `src/lessons/terms-<yours>.js`.
- **Lesson code:** edit only the `LESSONS.push({...})` blocks of your own lessons. Use the Edit tool with exact, unique strings, never by reading and rewriting a whole file: another worker and the lead edit other parts of the same files at the same time. Grades 4–5 live in `src/app.src.html`; grades 6–9 live in `src/lessons/y<grade><a-d>.js`.
- **Do not edit** `build.sh`, `tests/` or `docs/`, and do not run git.

## Check your work

Run these from the repo root:
- `bash build.sh` must print `BUILD OK`.
- `PW=/opt/node-tools/node_modules/playwright node tests/t18.js` checks that every WORDS key exists.
- Write a small check script of your own under `build/<yours>/`, not in `tests/`:
  - Load `build/test.html` the way the tests in `tests/` do: fonts and d3 are served from `tests/`.
  - For each of your lessons and each level, call `gen(level)` about 30 times and check there are no errors and the answer is finite.
  - Check `termsIn` finds at least one word in a good share of the questions.
  - Take a few screenshots of new question types to check that nothing overflows the board.

Keep a short log in `build/<yours>/STATUS.md`: one line per lesson as you finish it (words added, question types added). When you are done, reply with a summary: words per lesson, the new question types, anything you couldn't do, and any problem you saw in the engine.

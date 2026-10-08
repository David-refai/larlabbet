# Lärlabbet

A learning app for school years 4–9, in Swedish, English and Arabic. Maths comes first: Years 4 to 9 are done, following the Swedish curriculum Lgr22. Svenska Years 4–9 are complete with 12 units each (plans in `docs/plan-swedish-g4-6.md`, `docs/plan-swedish-g7.md` and `docs/plan-swedish-g8-9.md`). Year 1 has its own page (tracing letters and digits, drawing, balloon and counting games: `app/src/ui/Little.tsx`). Science and English are planned on the same base.

Each lesson is a whiteboard animation. A hand draws every step in marker, and Olle the owl explains in a line or two underneath. After the lesson the pupil practises on fresh problems at three levels, with hints that show the method but never the answer.

## What is in the app

- 95 maths lessons: 15 for Year 4 and 16 each for Years 5 to 9. Each one has a "🤔 Jag förstår inte" help mode and per-level hints. A lesson fits one screen: board, Olle's text and the Next button without scrolling.
- Words to know: the Swedish words tests use ("tiondelar", "Beräkna", "nämnare" …) are explained on 📖 chips with English and Arabic translations. Practice is five questions in test-style wording, plus an "Ordkoll" word question.
- Svenska: short illustrated stories with tappable words, the new words, one grammar point on the whiteboard, and practice with written answers. Each story reuses words from the one before.
- A placement test for each year, which marks lessons the pupil already knows.
- A mistakes notebook: wrong answers come back until they are fixed.
- Spaced review: a finished lesson comes back after 1, 3, 7, 21 and 60 days, inside "Dagens 5 minuter". A right answer moves it to the next gap, a wrong one starts again from 1 day. A lesson is marked "🧠 Sitter" (stuck) when it is answered right at least a week after it was first finished.
- Practice mixes in one question from an earlier lesson. If the pupil gets it wrong, "🔁 Påminn mig" replays that lesson's short explanation and then gives a similar problem.
- "Dagens 5 minuter", five mixed questions a day that keep a streak.
- Badges, and a page for parents and teachers with time spent, accuracy and the lessons that need practice.
- One profile per child: a "Who are you?" screen when there are several, each child with their own progress, reviews and stars. The parents page can switch between children.
- Progress syncs across devices when the app runs as a claude.ai artifact (it uses the artifact `db` and `user` capabilities, one private document per child).
- On the public site (GitHub Pages) a parent creates an account and adds children; a child logs in with the family code, their name and a 4-digit PIN. Data lives in Supabase (`supabase/schema.sql`; the client is the accounts part of `app/src/legacy/core.js`). "Prova utan konto" keeps progress in the browser only.
- "✨ Förklara för mig": Claude explains the current problem on the whiteboard, using the artifact `sample` capability. The viewer's own Claude account is used, so no API key is needed. Limited to 30 explanations a day.

## Files

| Path | What it is |
|---|---|
| `app/index.html` | The page shell: fonts, d3 and the header markup. Vite entry. |
| `app/src/main.tsx` | Entry: loads the engine, then every lesson module, then starts the app. |
| `app/src/legacy/core.js` | The original app as one ES module: whiteboard engine, Years 4–5 lessons, screens, progress, cloud sync and accounts. The lesson player, practice and reviews still render here; the other screens are in `app/src/ui/`. |
| `app/src/ui/` | Screens in React: profiles and name/grade (`Profiles.tsx`), the lesson map (`LessonMap.tsx`), badges and the parents page (`Progress.tsx`), and accounts (`Account.tsx`). `mount.tsx` shows a React screen in `#app`; navigation (`screen`, `leave()`) stays in core. |
| `app/src/styles.css` | All styles. |
| `app/src/lessons/` | Years 6–9 maths, the words files (`terms-*.js`), and Svenska (`sv-0engine.js` plus the unit files `sv7*.js`). Each file imports the engine names it uses. |
| `app/src/legacy/land.json` | World map outline used by one lesson. |
| `tools/fix-imports.mjs` | Writes each lesson file's `import` line and the engines' `export` lists. `build.sh` runs it. |
| `supabase/schema.sql` | The database: tables, access rules and the child login functions. |
| `build.sh` | Runs Vite and writes `dist/larlabbet.html` (artifact), `index.html` (GitHub Pages) and `build/test.html` (tests). |
| `tests/` | Browser tests (Playwright). |
| `tools/` | Helpers for writing new lessons. |
| `docs/lesson-brief.md` | How a lesson is written: style, helpers, lesson object, checks. |
| `docs/plan-years-6-9.md`, `docs/plan-swedish*.md` | Lesson plans. |

## Build and test

```bash
npm install                            # once
bash build.sh                          # -> dist/larlabbet.html, index.html, build/test.html
npm run dev                            # live dev server with reload
export PW=/path/to/node_modules/playwright
node tests/t14.js                      # Years 6-9: placement, lessons, mobile
node tests/t15.js                      # spaced review, mixing, remind me, "sits"
node tests/t16.js                      # child profiles, migration, sync, delete
node tests/t17.js                      # a lesson fits one screen (laptop, tablet, phone)
node tests/t18.js                      # words to know: chips, word cards, word check
node tests/t19.js                      # accounts against a fake Supabase
node tests/t20.js                      # Svenska units (SV_IDS=sv7c,sv7d to test only some)
node tests/t21.js                      # Year 1 page: tracing, balloons, counting, drawing
node tests/t13.js                      # Year 5 flow
node tests/t10.js                      # placement, notebook, daily, badges, parents page
node tests/t11.js                      # sync between two devices (mock db)
node tests/t12.js                      # "Förklara för mig" (mocked Claude reply)
node tests/t8.js; node tests/t9.js sv  # Year 4 lessons and help screens
```

The tests serve fonts and d3 from `tests/fonts` and `tests/vendor`, so they run offline. Each test prints `errors []` when the page has no errors. Screenshots go to `build/`.

## Adding lessons

Write the lessons in a new file in `app/src/lessons/`, following `docs/lesson-brief.md`. Files load in name order after the engine, and `build.sh` adds the `import` line for the engine names the file uses. Then check it:

```bash
bash build.sh
node tools/lesson-shots.js build sv id1,id2               # screenshots of every scene, question, solution and hint
DIR=build/shots node tools/sheet.js '^sv-id1' build/sheet.png
```

Make sure the new lesson ids are in `COURSES`.

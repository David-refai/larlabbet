# Lärlabbet

A learning app for school years 4–9, in Swedish, English and Arabic. Maths comes first: Year 4 and Year 5 are done, following the Swedish curriculum Lgr22. Science, English and Swedish are planned on the same base.

Each lesson is a whiteboard animation. A hand draws every step in marker, and Olle the owl explains in a line or two underneath. After the lesson the pupil practises on fresh problems at three levels, with hints that show the method but never the answer.

## What is in the app

- 31 maths lessons: 15 for Year 4 and 16 for Year 5. Each one has a "🤔 Jag förstår inte" help mode and per-level hints.
- A placement test for each year, which marks lessons the pupil already knows.
- A mistakes notebook: wrong answers come back until they are fixed.
- "Dagens 5 minuter", five mixed questions a day that keep a streak.
- Badges, and a page for parents and teachers with time spent, accuracy and the lessons that need practice.
- Progress syncs across devices when the app runs as a claude.ai artifact (it uses the artifact `db` and `user` capabilities). Otherwise progress stays in the browser's localStorage.
- "✨ Förklara för mig": Claude explains the current problem on the whiteboard, using the artifact `sample` capability. The viewer's own Claude account is used, so no API key is needed. Limited to 30 explanations a day.

## Files

| Path | What it is |
|---|---|
| `src/app.src.html` | The whole app source: HTML, CSS and JS in one file. |
| `src/land.json` | World map outline used by one lesson. `build.sh` inlines it. |
| `build.sh` | Builds `dist/larlabbet.html`, plus `build/test.html` for the tests. |
| `dist/larlabbet.html` | The built app. Open it in a browser, or publish it as an artifact. |
| `tests/` | Browser tests (Playwright). |
| `tools/` | Helpers for writing new lessons. |
| `docs/lesson-brief-year5.md` | How a lesson is written: style, helpers, lesson object, checks. |

## Build and test

```bash
bash build.sh                          # -> dist/larlabbet.html, build/test.html
export PW=/path/to/node_modules/playwright
node tests/t13.js                      # Year 5 flow
node tests/t10.js                      # placement, notebook, daily, badges, parents page
node tests/t11.js                      # sync between two devices (mock db)
node tests/t12.js                      # "Förklara för mig" (mocked Claude reply)
node tests/t8.js; node tests/t9.js sv  # Year 4 lessons and help screens
```

The tests serve fonts and d3 from `tests/fonts` and `tests/vendor`, so they run offline. Each test prints `errors []` when the page has no errors. Screenshots go to `build/`.

## Adding lessons

Write the lessons in a separate file, following `docs/lesson-brief-year5.md`. Then check it:

```bash
bash tools/lesson-build.sh my-lessons.js build/new        # inserts the file at /*NEW-LESSONS*/
node tools/lesson-shots.js build/new sv id1,id2           # screenshots of every scene, question, solution and hint
DIR=build/new/shots node tools/sheet.js '^sv-id1' build/new/sheet.png
```

When the lessons look right, paste them into `src/app.src.html` just above `/*NEW-LESSONS*/`, and add their ids to `COURSES`.

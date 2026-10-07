/* Lärlabbet entry: the lesson engine (legacy/core.js) loads first, then every lesson
   module registers itself in LESSONS (file order matters: engines before units), then the app starts. */
import "./styles.css";
import * as core from "./legacy/core.js";
import * as sv from "./lessons/sv-0engine.js";

import.meta.glob("./lessons/*.js", {eager: true});

/* the browser tests and the console read the engine's names as globals, live
   (this also shadows window.screen with the app's own "screen") */
for (const mod of [core, sv] as Record<string, unknown>[])
  for (const k of Object.keys(mod))
    try { Object.defineProperty(window, k, {get: () => mod[k], set: v => core.testHook(k, v), configurable: true}); } catch { /* a fixed window property */ }

core.start();

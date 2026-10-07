/* Lärlabbet entry: the lesson engine (legacy/core.js) loads first, then every lesson
   module registers itself in LESSONS (file order matters: engines before units), then the app starts. */
import "./styles.css";
import * as core from "./legacy/core.js";
import * as sv from "./lessons/sv-0engine.js";

import.meta.glob("./lessons/*.js", {eager: true});

/* the browser tests and the console read the engine's names as globals, live */
for (const mod of [core, sv] as Record<string, unknown>[])
  for (const k of Object.keys(mod))
    if (!(k in window)) Object.defineProperty(window, k, {get: () => mod[k], configurable: true});

core.start();

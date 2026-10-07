/* Shows a React screen in #app. Legacy screens still write #app directly, so the React
   root is unmounted whenever a screen is left (core's leave() runs leaveHooks). */
import type {ReactNode} from "react";
import {createRoot, type Root} from "react-dom/client";
import {flushSync} from "react-dom";
import {leaveHooks} from "../legacy/core.js";

let root: Root | null = null, host: HTMLElement | null = null;

function unmount() {
  if (root) { root.unmount(); root = null; }
  if (host) { host.remove(); host = null; }
}
let hooked = false;

/* renders synchronously, so the screen's DOM exists when this returns (legacy code and tests rely on that) */
export function showReact(node: ReactNode) {
  if (!hooked) { leaveHooks.push(unmount); hooked = true; }
  const app = document.getElementById("app")!;
  if (!host || !host.isConnected) {
    unmount();
    app.innerHTML = "";
    host = document.createElement("div");
    host.className = "rscreen";
    app.appendChild(host);
    root = createRoot(host);
  }
  flushSync(() => root!.render(node));
}

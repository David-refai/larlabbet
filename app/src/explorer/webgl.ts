/* Should "Utforska kroppen" use the 3D explorer? Yes when the browser can draw WebGL, unless it is
   switched off with window.NO3D = true or ?no3d in the address (the SVG explorer is used then).
   This file is small and loads with the app; the 3D explorer itself is only loaded on demand. */
export function webglOK(): boolean {
  try {
    const c = document.createElement("canvas");
    const g = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!g) return false;
    g.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}

let known: boolean | null = null;
export function want3D(): boolean {
  const w = window as unknown as {NO3D?: boolean};
  if (w.NO3D) return false;
  if (/[?&#]no3d\b/.test(location.search + location.hash)) return false;
  if (known === null) known = webglOK();
  return known;
}
/* the 3D explorer failed (no context, a crash): use the SVG one from now on */
export const no3D = () => { known = false; };

/* Shapes that take a moment to build (the meshed body, skull, organs) are kept while the app runs.
   Leaving the explorer frees their GPU memory (geometry.dispose()); the next visit uploads the same
   arrays again instead of meshing everything anew (for example when the language changes).
   The geometries kept here are marked as shared: closing a detail view (which reuses some of the
   body's shapes) leaves them alone, only closing the whole explorer frees them. */
import type * as THREE from "three";

const store = new Map<string, unknown>();
function mark(v: unknown, depth = 0) {
  if (!v || typeof v !== "object" || depth > 2) return;
  if ((v as THREE.BufferGeometry).isBufferGeometry) { (v as THREE.BufferGeometry).userData.shared = true; return; }
  for (const k of Object.keys(v)) mark((v as Record<string, unknown>)[k], depth + 1);
}
export function once<T>(key: string, make: () => T): T {
  if (!store.has(key)) { const v = make(); mark(v); store.set(key, v); }
  return store.get(key) as T;
}

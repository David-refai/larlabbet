/* 3D simplex noise (after Stefan Gustavson), seeded, for the folds of the brain, the coils of the
   small intestine and gentle unevenness on organs. Returns about -1..1. */
export function makeNoise(seed = 1) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t; }
  const perm = new Uint8Array(512), pm12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; pm12[i] = perm[i] % 12; }
  const G = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];
  const F3 = 1 / 3, G3 = 1 / 6;
  return function noise(x: number, y: number, z: number) {
    const s0 = (x + y + z) * F3, i = Math.floor(x + s0), j = Math.floor(y + s0), k = Math.floor(z + s0);
    const t = (i + j + k) * G3, x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }
    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + .5, y3 = y0 - 1 + .5, z3 = z0 - 1 + .5;
    const ii = i & 255, jj = j & 255, kk = k & 255;
    let n = 0;
    const c = (tx: number, ty: number, tz: number, g: number) => {
      let q = .6 - tx * tx - ty * ty - tz * tz;
      if (q < 0) return 0;
      q *= q;
      return q * q * (G[g * 3] * tx + G[g * 3 + 1] * ty + G[g * 3 + 2] * tz);
    };
    n += c(x0, y0, z0, pm12[ii + perm[jj + perm[kk]]]);
    n += c(x1, y1, z1, pm12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]);
    n += c(x2, y2, z2, pm12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]);
    n += c(x3, y3, z3, pm12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]);
    return 32 * n;
  };
}
export type Noise = ReturnType<typeof makeNoise>;

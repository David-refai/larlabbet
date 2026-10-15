/* Materials of the 3D explorer: glossy "toy" organs (physical, clear coat), warm skin, ivory bone,
   and the see-through teal skin with a soft rim glow (an X-ray hologram look).
   Every organ material can glow when it is picked (uHi) and every material can fade (fade()). */
import * as THREE from "three";

export const COLORS = {
  skin: "#eda27c", skinDeep: "#e1946f", hair: "#5b3a24", shorts: "#2f5fc4", shortsBand: "#4a7ae0",
  bone: "#f1e6cf", muscle: "#c4352d", tendon: "#f1d4c2",
  artery: "#e0303d", vein: "#3a62d6", nerve: "#f4c430", cord: "#f3dc9a",
  brain: "#ef8f9b", cerebellum: "#df7c84", stem: "#d77f86",
  lung: "#f597a6", airway: "#f3ead9",
  heart: "#dc2f2e", liver: "#9b3a2b", gall: "#7a2f24", stomach: "#f6b08f", esophagus: "#efad98",
  small: "#f3949e", large: "#ebcf9f", kidney: "#a3282d", ureter: "#ecd0a0", bladder: "#f2cf86",
  glow: "#ffcf4a", shell: "#2fb3b4", shellRim: "#b4fff4",
};

type PhysOpts = THREE.MeshPhysicalMaterialParameters;

/* adds a soft rim glow to a material, switched on by userData.hi.value (0..1) */
export function withGlow<M extends THREE.Material>(m: M, color = COLORS.glow): M {
  const hi = {value: 0}, hc = {value: new THREE.Color(color)};
  m.userData.hi = hi;
  const prev = m.onBeforeCompile;
  m.onBeforeCompile = (s, r) => {
    prev?.call(m, s, r);
    s.uniforms.uHi = hi; s.uniforms.uHiColor = hc;
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uHi; uniform vec3 uHiColor;")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        { float fr = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.5);
          totalEmissiveRadiance += uHiColor * uHi * (0.07 + 1.3 * fr); }`);
  };
  m.customProgramCacheKey = () => "glow";
  return m;
}

/* a glossy, clay-like organ */
export function organ(color: string, o: PhysOpts = {}) {
  return withGlow(new THREE.MeshPhysicalMaterial({
    color, roughness: .38, metalness: 0, clearcoat: .55, clearcoatRoughness: .28,
    sheen: .18, sheenRoughness: .5, sheenColor: new THREE.Color("#ffffff"), ...o,
  }));
}
export const bone = () => organ(COLORS.bone, {roughness: .5, clearcoat: .3, clearcoatRoughness: .4, sheen: .2});
export const skin = () => withGlow(new THREE.MeshPhysicalMaterial({
  color: COLORS.skin, roughness: .62, metalness: 0, sheen: .55, sheenRoughness: .45, sheenColor: new THREE.Color("#ffd2bd"),
  clearcoat: .06, clearcoatRoughness: .6,
}));

/* the see-through teal body: faint in the middle, glowing at the edges */
export function xray() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.FrontSide,
    uniforms: {uColor: {value: new THREE.Color(COLORS.shell)}, uRim: {value: new THREE.Color(COLORS.shellRim)}, uOpacity: {value: 1}, uBase: {value: .06}},
    vertexShader: `varying vec3 vN; varying vec3 vV;
      void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform vec3 uRim; uniform float uOpacity; uniform float uBase; varying vec3 vN; varying vec3 vV;
      void main(){
        float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float rim = pow(f, 2.2);
        /* light from above makes the shell read as a solid, rounded body */
        float top = 0.5 + 0.5 * normalize(vN).y;
        vec3 c = mix(uColor * (0.6 + 0.4 * top), uRim, rim);
        gl_FragColor = vec4(c, (uBase + 0.06 * top + 0.8 * rim) * uOpacity);
        #include <colorspace_fragment>
      }`,
  });
}

/* fading: every material remembers its own opacity; o multiplies it */
export function fade(obj: THREE.Object3D, o: number) {
  obj.visible = o > .004;
  /* a part inside that fades on its own (userData.ownFade) is left alone */
  const walk = (n: THREE.Object3D, root: boolean) => {
    if (!root && n.userData.ownFade) return;
    const ms = (n as THREE.Mesh).material;
    if (ms) for (const m of Array.isArray(ms) ? ms : [ms]) fadeMat(m, o);
    for (const c of n.children) walk(c, false);
  };
  walk(obj, true);
}
export function fadeMat(m: THREE.Material, o: number) {
  const u = (m as THREE.ShaderMaterial).uniforms;
  if (u?.uOpacity) { u.uOpacity.value = o * (m.userData.base ?? 1); return; }
  if (m.userData.base === undefined) { m.userData.base = m.opacity; m.userData.tr = m.transparent; }
  const base = m.userData.base as number, op = base * o, tr = op < .999 || !!m.userData.tr;
  m.opacity = op;
  if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
  m.depthWrite = m.userData.noDepth ? false : op > .5;
}

/* glow (0..1) on every material of an object that can glow */
export function glow(obj: THREE.Object3D, k: number) {
  obj.traverse(n => {
    const ms = (n as THREE.Mesh).material;
    if (!ms) return;
    for (const m of Array.isArray(ms) ? ms : [ms]) if (m.userData.hi) m.userData.hi.value = k;
  });
}

/* free the GPU memory of a whole subtree; shared (cached) geometries only when all is set */
export function disposeTree(o: THREE.Object3D, all = false) {
  o.traverse(n => {
    const mesh = n as THREE.Mesh;
    if (mesh.geometry && (all || !mesh.geometry.userData?.shared)) mesh.geometry.dispose();
    const ms = mesh.material ? (Array.isArray(mesh.material) ? mesh.material : [mesh.material]) : [];
    for (const m of ms) {
      for (const k of Object.keys(m)) { const t = (m as unknown as Record<string, unknown>)[k]; if (t && (t as THREE.Texture).isTexture) (t as THREE.Texture).dispose(); }
      m.dispose();
    }
  });
}

/* The camera: drag (mouse, touch, trackpad) turns all the way round the body and up and down,
   wheel or pinch zooms, with soft damping; the explorer's keys (arrows, + and -) nudge it. Changing mode glides the camera to the new view
   (a jump instead under reduced motion). The light rig follows the camera, so the side you look
   at is always nicely lit. */
import {useEffect, useRef} from "react";
import * as THREE from "three";
import {useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import type {OrbitControls as OrbitImpl} from "three-stdlib";

export interface CamView {
  target: THREE.Vector3;
  /* how far back the camera is */
  dist: number;
  /* the angle round the body (null: keep the current one) and up/down (radians from the top) */
  az: number | null; polar: number | null;
}
export interface CamState {
  azimuth: number; polar: number; distance: number; tweening: boolean; dragged: boolean;
  /* turn round (radians), up or down (radians) and zoom (a factor on the distance), gliding */
  nudge?: (dAz: number, dPolar: number, zoom: number) => void;
}

const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const sph = new THREE.Spherical();

export function CameraRig({view, viewKey, resetKey, still, out, maxPolar = 2.75}: {
  view: CamView; viewKey: string; resetKey: number; still: boolean; out: CamState; maxPolar?: number;
}) {
  const ctl = useRef<OrbitImpl>(null);
  const {camera, invalidate} = useThree();
  const tw = useRef<{t0: number; dur: number; ft: THREE.Vector3; tt: THREE.Vector3; fs: THREE.Spherical; ts: THREE.Spherical} | null>(null);
  const lastAz = useRef<number | null>(null);
  const first = useRef(true);
  const key = useRef(new THREE.DirectionalLight("#fff0de", 3.1)), fill = useRef(new THREE.DirectionalLight("#dce8ff", .55)), rim = useRef(new THREE.DirectionalLight("#cfe8ff", 1.6));

  function go(v: CamView, instant: boolean, dur = 900) {
    const c = ctl.current; if (!c) return;
    /* stop any spin left over from a drag (damping), so it cannot push the camera after the glide */
    const damp = c.enableDamping; c.enableDamping = false; c.update(); c.enableDamping = damp;
    const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(c.target));
    const to = new THREE.Spherical(v.dist, v.polar ?? from.phi, v.az ?? from.theta);
    /* turn the short way round */
    to.theta = from.theta + ((((to.theta - from.theta) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
    if (instant) {
      c.target.copy(v.target);
      camera.position.setFromSpherical(to).add(v.target);
      camera.lookAt(v.target); tw.current = null; c.update(); invalidate();
      return;
    }
    tw.current = {t0: performance.now(), dur, ft: c.target.clone(), tt: v.target.clone(), fs: from, ts: to};
    invalidate();
  }

  /* a new mode (body, organ, detail tab): glide there */
  useEffect(() => {
    go(first.current ? {...view, az: view.az ?? 0, polar: view.polar ?? 1.5} : view, still || first.current);
    first.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewKey]);
  /* "Återställ kameran": straight on, the starting distance */
  useEffect(() => {
    if (resetKey) go({...view, az: view.az ?? 0, polar: view.polar ?? 1.5}, still);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);
  /* the keys: a short glide from where the camera is now, inside the limits */
  out.nudge = (dAz, dPol, zoom) => {
    const c = ctl.current; if (!c) return;
    const s = new THREE.Spherical().setFromVector3(camera.position.clone().sub(c.target));
    const dist = Math.max(view.dist * .3, Math.min(view.dist * 1.7, s.radius * zoom));
    go({target: c.target.clone(), dist, az: s.theta + dAz, polar: Math.max(.2, Math.min(maxPolar, s.phi + dPol))}, still, 260);
  };
  /* the whole body may not be looked at from under the floor: come back up if the camera is there */
  useEffect(() => {
    const c = ctl.current; if (!c || tw.current) return;
    const s = new THREE.Spherical().setFromVector3(camera.position.clone().sub(c.target));
    if (s.phi > maxPolar) go({target: c.target.clone(), dist: s.radius, az: s.theta, polar: maxPolar}, still, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxPolar]);
  /* the screen changed shape: keep the framing */
  const refit = useRef(false);
  useEffect(() => { refit.current = true; invalidate(); }, [view.dist, invalidate]);

  useFrame(() => {
    const c = ctl.current; if (!c) return;
    const t = tw.current;
    /* (done here, so it also works when the size settles before the controls exist) */
    if (refit.current && !t) {
      refit.current = false;
      const s = new THREE.Spherical().setFromVector3(camera.position.clone().sub(c.target)); s.radius = view.dist;
      camera.position.setFromSpherical(s).add(c.target); c.update(); invalidate();
    }
    if (t) {
      const u = Math.min(1, (performance.now() - t.t0) / t.dur), e = ease(u);
      c.target.lerpVectors(t.ft, t.tt, e);
      sph.set(t.fs.radius + (t.ts.radius - t.fs.radius) * e, t.fs.phi + (t.ts.phi - t.fs.phi) * e, t.fs.theta + (t.ts.theta - t.fs.theta) * e);
      camera.position.setFromSpherical(sph).add(c.target);
      camera.lookAt(c.target);
      if (u >= 1) tw.current = null;
      invalidate();
    }
    /* the lights ride along with the camera */
    const q = camera.quaternion, p = camera.position, tg = c.target;
    const put = (l: THREE.DirectionalLight, x: number, y: number, z: number) => {
      l.position.set(x, y, z).applyQuaternion(q).add(p); l.target.position.copy(tg); l.target.updateMatrixWorld();
    };
    put(key.current, 7, 6, 3); put(fill.current, -9, 0, 1); put(rim.current, -3, 7, -16);
    /* the angle round the body, counted on (it may pass 360°) */
    sph.setFromVector3(p.clone().sub(tg));
    if (lastAz.current === null) lastAz.current = sph.theta;
    let d = sph.theta - lastAz.current;
    if (d > Math.PI) d -= 2 * Math.PI; else if (d < -Math.PI) d += 2 * Math.PI;
    out.azimuth += d; lastAz.current = sph.theta;
    out.polar = sph.phi; out.distance = sph.radius; out.tweening = !!t;
  });

  const lim = !tw.current;
  return <>
    <OrbitControls ref={ctl} makeDefault enableDamping={!still} dampingFactor={.085} enablePan={false}
      rotateSpeed={.85} zoomSpeed={.9} minPolarAngle={.2} maxPolarAngle={lim ? maxPolar : Math.PI}
      minDistance={lim ? view.dist * .3 : 0} maxDistance={lim ? view.dist * 1.7 : Infinity}
      touches={{ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE}}
      onStart={() => { tw.current = null; out.dragged = true; }} />
    <primitive object={key.current} /><primitive object={key.current.target} />
    <primitive object={fill.current} /><primitive object={fill.current.target} />
    <primitive object={rim.current} /><primitive object={rim.current.target} />
  </>;
}

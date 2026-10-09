/* Year 1 voice: a parent's own recordings first (kept on this device in IndexedDB),
   otherwise the device's Swedish voice. Letters are said as "A … som apa". */

import {CLIPS} from "./clips";

/* a word and picture for each letter; digits are said by name */
export const LETTER_WORD: Record<string, [string, string]> = {
  A: ["apa", "🐒"], B: ["björn", "🐻"], C: ["cikada", "🦗"], D: ["delfin", "🐬"], E: ["elefant", "🐘"], F: ["fisk", "🐟"],
  G: ["giraff", "🦒"], H: ["häst", "🐴"], I: ["igelkott", "🦔"], J: ["jaguar", "🐆"], K: ["katt", "🐱"], L: ["lejon", "🦁"],
  M: ["mus", "🐭"], N: ["noshörning", "🦏"], O: ["orm", "🐍"], P: ["pingvin", "🐧"], Q: ["quetzal", "🦜"], R: ["räv", "🦊"],
  S: ["säl", "🦭"], T: ["tiger", "🐯"], U: ["uggla", "🦉"], V: ["val", "🐋"], W: ["wapiti", "🦌"], X: ["xylofon", "🎶"],
  Y: ["yxa", "🪓"], Z: ["zebra", "🦓"], "Å": ["åsna", "🫏"], "Ä": ["älg", "🫎"], "Ö": ["örn", "🦅"],
};
export const NUM_WORD = ["noll", "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio"];

/* what a recording key stands for: "A" (both cases), "3" */
export const keyOf = (ch: string) => /\d/.test(ch) ? ch : ch.toUpperCase();
export const ALL_KEYS = [...Object.keys(LETTER_WORD), ...NUM_WORD.map((_, i) => String(i))];
export function spoken(k: string, withWord: boolean) {
  if (/^\d+$/.test(k)) return NUM_WORD[+k] ?? k;
  const w = LETTER_WORD[k];
  return withWord && w ? `${k.toLowerCase()} … ${k.toLowerCase()}, som ${w[0]}` : k.toLowerCase();
}

/* ---- recordings ---- */
const DB = "larlabbet-voice", ST = "clips";
let dbp: Promise<IDBDatabase> | null = null;
function db() {
  return dbp ||= new Promise((ok, bad) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(ST);
    r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error);
  });
}
async function tx<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((ok, bad) => { const r = f(d.transaction(ST, mode).objectStore(ST)); r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error); });
}
const cache = new Map<string, Blob | null>();
export async function getClip(k: string): Promise<Blob | null> {
  if (cache.has(k)) return cache.get(k)!;
  let b: Blob | null = null;
  try { b = (await tx("readonly", s => s.get(k))) as Blob || null; } catch { /* no IndexedDB */ }
  cache.set(k, b); return b;
}
export async function putClip(k: string, b: Blob) { cache.set(k, b); try { await tx("readwrite", s => s.put(b, k)); } catch { /* kept in memory only */ } }
export async function dropClip(k: string) { cache.set(k, null); try { await tx("readwrite", s => s.delete(k)); } catch { /* ignore */ } }
export async function clipKeys(): Promise<string[]> { try { return (await tx("readonly", s => s.getAllKeys())) as string[]; } catch { return []; } }

/* ---- device voice ---- */
let voice: SpeechSynthesisVoice | null | undefined;
function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const vs = speechSynthesis.getVoices().filter(v => /^sv/i.test(v.lang));
  const good = /enhanced|premium|natural|neural|siri|google|online|alva|klara/i;
  return vs.find(v => good.test(v.name)) || vs[0] || null;
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { voice = pickVoice(); };
export const hasDeviceVoice = () => { if (voice === undefined) voice = pickVoice(); return !!voice; };

let playing: HTMLAudioElement | null = null;
/* play bundled clips one after another ("L:A", "W:apa", "N:3", "P:bra") */
function playSeq(keys: string[]) {
  const urls = keys.map(k => CLIPS[k]).filter(Boolean);
  if (!urls.length) return false;
  let i = 0;
  const next = () => { if (i >= urls.length) return; playing = new Audio(urls[i++]); playing.onended = () => setTimeout(next, 180); playing.play().catch(() => {}); };
  next(); return true;
}
function stopAll() { try { playing?.pause(); speechSynthesis?.cancel(); } catch { /* ignore */ } }
function device(text: string) {
  if (!hasDeviceVoice()) return;
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice!; u.lang = voice!.lang; u.rate = 0.8; u.pitch = 1.1;
  speechSynthesis.speak(u);
}
/* a word or short phrase: bundled clip, else the device voice */
export function sayText(key: string, text: string, opts: {mode?: string; muted?: boolean} = {}) {
  const mode = opts.mode || "auto";
  if (opts.muted || mode === "off") return;
  stopAll();
  if (playSeq([key])) return;
  if (mode !== "rec") device(text);
}
/* mode: "auto" = recording, else device voice; "rec" = recordings only; "off" */
export async function say(ch: string, opts: {withWord?: boolean; mode?: string; muted?: boolean} = {}) {
  const mode = opts.mode || "auto";
  if (opts.muted || mode === "off") return;
  const k = keyOf(ch), clip = await getClip(k);
  stopAll();
  if (clip) { playing = new Audio(URL.createObjectURL(clip)); playing.play().catch(() => {}); return; }
  if (mode === "rec") return;
  const num = /^\d+$/.test(k), w = LETTER_WORD[k];
  if (playSeq(num ? ["N:" + k] : opts.withWord && w ? ["L:" + k, "W:" + w[0]] : ["L:" + k])) return;
  device(spoken(k, !!opts.withWord));
}
/* a plain number while counting (1–10), from a recording when there is one */
export const sayNum = (n: number, o: {mode?: string; muted?: boolean} = {}) => say(String(n), o);
/* true when letters can be heard without a recording (bundled clips or a device voice) */
export const hasVoice = () => Object.keys(CLIPS).length > 0 || hasDeviceVoice();

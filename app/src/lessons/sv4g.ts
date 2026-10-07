import {defineUnit, word, t3, L, A, R, qt, pick, shuffle, svLines, boxes, pic, kid, cap} from "../svenska/unit";
import type {Draw, Problem} from "../svenska/unit";
/* Svenska årskurs 4, units 7–12: Vintern kommer (meningar: stor bokstav, punkt, frågetecken), Brevet till farmor
   (personliga pronomen), Var är nyckeln? (prepositioner), Inte i dag! (inte), Kalaset (klockan och veckodagar),
   Sommarlov på landet (oregelbundna verb i preteritum). Yasmin, Leo and the dog Kexi in class 4A with Karin. */
{
/* ---------- shared pictures ---------- */
const YAS = "#d35f8d", YHAIR = "#2b1d14", LEO = "#3a8f5c", LHAIR = "#e2b54a";
/* Yasmin: long dark hair */
const yas = (x: number, y: number, s = 1) => `<path d="M${x - 24 * s} ${y - 4 * s} Q${x - 30 * s} ${y + 34 * s} ${x - 15 * s} ${y + 38 * s} L${x - 15 * s} ${y}Z M${x + 24 * s} ${y - 4 * s} Q${x + 30 * s} ${y + 34 * s} ${x + 15 * s} ${y + 38 * s} L${x + 15 * s} ${y}Z" fill="${YHAIR}"/>` + kid(x, y, YAS, YHAIR, s);
const leo = (x: number, y: number, s = 1) => kid(x, y, LEO, LHAIR, s);
const adult = (x: number, y: number, shirt: string, hair: string, s = 1) => kid(x, y, shirt, hair, s * 1.18);
/* a sad / ill mouth over kid()'s smile */
const ill = (x: number, y: number, s = 1) => `<path d="M${x - 6 * s} ${y + 11 * s} Q${x} ${y + 15 * s} ${x + 6 * s} ${y + 11 * s}" stroke="#f1c7a3" stroke-width="${4 * s}" fill="none"/><path d="M${x - 6 * s} ${y + 14 * s} Q${x} ${y + 9 * s} ${x + 6 * s} ${y + 14 * s}" stroke="#1d2433" stroke-width="${2 * s}" fill="none" stroke-linecap="round"/><circle cx="${x - 13 * s}" cy="${y + 8 * s}" r="${5 * s}" fill="#f19a9a"/><circle cx="${x + 13 * s}" cy="${y + 8 * s}" r="${5 * s}" fill="#f19a9a"/>`;
/* Kexi, Leo's brown dog */
const dog = (x: number, y: number, s = 1, flip = false) => `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><path d="M-30 -6 Q-46 -18 -40 -30" stroke="#b5713a" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="-26" y="6" width="8" height="22" rx="3" fill="#9a5c2c"/><rect x="-12" y="6" width="8" height="22" rx="3" fill="#9a5c2c"/><rect x="10" y="6" width="8" height="22" rx="3" fill="#9a5c2c"/><rect x="22" y="6" width="8" height="22" rx="3" fill="#9a5c2c"/><ellipse cx="0" cy="0" rx="32" ry="16" fill="#b5713a"/><circle cx="32" cy="-16" r="14" fill="#b5713a"/><ellipse cx="26" cy="-22" rx="6" ry="12" fill="#7a4520"/><circle cx="36" cy="-19" r="2.2" fill="#1d2433"/><circle cx="46" cy="-13" r="3.2" fill="#1d2433"/></g>`;
const hat = (x: number, y: number, s = 1, c = "#d63b2f") => `<path d="M${x - 23 * s} ${y - 6 * s} Q${x} ${y - 46 * s} ${x + 23 * s} ${y - 6 * s}Z" fill="${c}"/><rect x="${x - 24 * s}" y="${y - 10 * s}" width="${48 * s}" height="${8 * s}" rx="${4 * s}" fill="#fff"/><circle cx="${x}" cy="${y - 36 * s}" r="${6 * s}" fill="#fff"/>`;
const mitten = (x: number, y: number, s = 1, c = "#d63b2f") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-12 18 L-12 -6 Q-12 -20 0 -20 Q12 -20 12 -6 L12 18Z" fill="${c}"/><ellipse cx="-14" cy="0" rx="6" ry="9" fill="${c}"/><rect x="-13" y="14" width="26" height="8" fill="#fff"/></g>`;
const flakes = (n = 26, c = "#fff") => [...Array(n)].map((_, i) => `<circle cx="${(i * 67) % 290 + 6}" cy="${(i * 41) % 170 + 8}" r="${2 + (i % 3)}" fill="${c}"/>`).join("");
const snowGround = (y = 220) => `<path d="M0 ${y} Q80 ${y - 14} 160 ${y} T300 ${y} V300 H0Z" fill="#fff"/>`;
const snowman = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cy="40" r="34" fill="#fff" stroke="#c6cfdc" stroke-width="2"/><circle cy="-12" r="24" fill="#fff" stroke="#c6cfdc" stroke-width="2"/><circle cx="-8" cy="-16" r="3" fill="#1d2433"/><circle cx="8" cy="-16" r="3" fill="#1d2433"/><path d="M0 -10 L20 -6 L0 -4Z" fill="#e07b00"/><path d="M-20 -30 Q0 -64 20 -30Z" fill="#2257c9"/><circle cy="20" r="3" fill="#1d2433"/><circle cy="36" r="3" fill="#1d2433"/></g>`;
const sled = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-14" width="80" height="12" rx="3" fill="#c0573e"/><path d="M-44 6 H40 Q52 6 50 -6" stroke="#5b6b82" stroke-width="5" fill="none"/><path d="M-30 -2 V6 M30 -2 V6" stroke="#5b6b82" stroke-width="4"/></g>`;
const house = (bg: string, body: string) => pic(`<rect x="0" y="0" width="300" height="300" fill="${bg}"/><rect y="236" width="300" height="64" fill="#c9a77c"/>${body}`);
const letter = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-40" y="-26" width="80" height="52" rx="3" fill="#fff" stroke="#5b6b82" stroke-width="2.5"/><path d="M-40 -26 L0 4 L40 -26" stroke="#5b6b82" stroke-width="2.5" fill="none"/><rect x="20" y="-20" width="14" height="16" fill="#e07b00"/></g>`;
const clockSvg = (x: number, y: number, r: number, h: number, m: number) => {
  const ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#1d2433" stroke-width="4"/>${[...Array(12)].map((_, i) => { const a = i * 30 * Math.PI / 180; return `<path d="M${x + Math.sin(a) * r * .82} ${y - Math.cos(a) * r * .82}L${x + Math.sin(a) * r * .94} ${y - Math.cos(a) * r * .94}" stroke="#1d2433" stroke-width="3"/>`; }).join("")}<path d="M${x} ${y}L${x + Math.sin(ha) * r * .5} ${y - Math.cos(ha) * r * .5}" stroke="#d63b2f" stroke-width="7" stroke-linecap="round"/><path d="M${x} ${y}L${x + Math.sin(ma) * r * .8} ${y - Math.cos(ma) * r * .8}" stroke="#2257c9" stroke-width="5" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="5" fill="#1d2433"/>`;
};
const icon = (bg: string, body: string, label: string, c = "#1f4fb0") => `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="${bg}"/>${body}<text x="300" y="166" font-family="Caveat,cursive" font-weight="700" font-size="32" fill="${c}" text-anchor="end">${label}</text></svg>`;

/* ---------- board helpers ---------- */
const title = (sv: string, en: string, ar: string, size = 38, c = "b") => A.tx(L(t3(sv, en, ar)), 400, 62, size, c);
const say = t3;
/* an analogue clock on the board; h 1–12, m 0–59 */
function clock(cx: number, cy: number, r: number, h: number, m: number): Draw[] {
  const out: Draw[] = [A.loop(cx, cy, r, r, "k")];
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, s = Math.sin(a), c = Math.cos(a); out.push(A.p(R.line(cx + s * r * .84, cy - c * r * .84, cx + s * r * .96, cy - c * r * .96, .1), "k", 3)); }
  [[12, 0], [3, 1], [6, 2], [9, 3]].forEach(([n, i]) => { const a = i * Math.PI / 2; out.push(qt(String(n), cx + Math.sin(a) * r * .66, cy - Math.cos(a) * r * .66 + 9, 26, "k")); });
  const ha = ((h % 12) + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
  out.push(A.p(R.line(cx, cy, cx + Math.sin(ma) * r * .78, cy - Math.cos(ma) * r * .78, .1), "b", 5));
  out.push(A.p(R.line(cx, cy, cx + Math.sin(ha) * r * .5, cy - Math.cos(ha) * r * .5, .1), "r", 8));
  return out;
}
const NUM = ["tolv", "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio", "elva", "tolv"];
const nx = (h: number) => NUM[h % 12 + 1];
/* the Swedish words for a time on the clock (minutes 0, 15, 30, 45) */
const timeSv = (h: number, m: number) => m === 0 ? "klockan " + NUM[h] : m === 15 ? "kvart över " + NUM[h] : m === 30 ? "halv " + nx(h) : "kvart i " + nx(h);
const digital = (h: number, m: number) => `${h}.${String(m).padStart(2, "0")}`;

/* =====================================================================
   unit 7: Vintern kommer (meningar: stor bokstav, punkt, frågetecken)
   ===================================================================== */
word("sno", {sv: "snö (en)", m: "snö(n)?", d: t3("Vit och kall is som faller från himlen på vintern.", "White, cold ice that falls from the sky in winter.", "جليد أبيض بارد يتساقط من السماء في الشتاء."), ex: "Barnen leker i snön.", tr: {en: "snow", ar: "ثلج"}, opp: ["regn"], wrong: ["sand", "gräs"], gap: ["Allt var vitt av", "snö", "."], gapForm: "snö", form: "snö – snön"});
word("frost", {sv: "frost (en)", m: "frost(en)?", d: t3("Tunn is som glittrar på gräs och fönster när det är kallt.", "Thin ice that glitters on grass and windows when it is cold.", "جليد رقيق يلمع على العشب والنوافذ عندما يكون الجو باردًا."), ex: "Det var frost på fönstret.", tr: {en: "frost", ar: "صقيع"}, wrong: ["dimma", "sol"], gap: ["Det var", "frost", "på fönstret i morse."], gapForm: "frost", form: "frost – frosten"});
word("vante", {sv: "vante (en)", m: "vant(e|en|ar|arna)", d: t3("Något varmt man har på handen.", "A warm thing you wear on your hand.", "شيء دافئ نلبسه في اليد."), ex: "Hon har en röd vante på varje hand.", tr: {en: "mitten", ar: "قفّاز"}, syn: ["handske"], wrong: ["strumpa", "halsduk"], gap: ["Yasmin hade en", "vante", "på varje hand."], gapForm: "vante", form: "en vante – vantar"});
word("halka", {sv: "halka", m: "halk(a|an|ar|ade)", d: t3("När det är is på marken så att man lätt glider och ramlar.", "When there is ice on the ground so you easily slip and fall.", "عندما يكون على الأرض جليد فننزلق ونسقط بسهولة."), ex: "Det är halka på vägen. Gå försiktigt!", tr: {en: "slippery ice; to slip", ar: "جليد زَلِق؛ ينزلق"}, syn: ["glida"], wrong: ["hoppa", "simma"], gap: ["Gå försiktigt, det är", "halka", "ute."], gapForm: "halka", form: "halka – halkade"});
word("kalke", {sv: "kälke (en)", m: "kälk(e|en|ar|arna)", d: t3("En liten släde som man åker på i snön.", "A small sled you ride on in the snow.", "زلّاجة صغيرة نركبها على الثلج."), ex: "Vi åker kälke i backen.", tr: {en: "sledge, sled", ar: "زلّاجة"}, syn: ["släde"], wrong: ["cykel", "båt"], gap: ["Ibrahim åkte", "kälke", "i backen."], gapForm: "kälke", form: "en kälke – kälkar"});
word("snogubbe", {sv: "snögubbe (en)", m: "snögubb(e|en|ar|arna)", d: t3("En gubbe som man bygger av snö.", "A figure of a man that you build from snow.", "رجل نصنعه من الثلج."), ex: "Vi byggde en snögubbe på skolgården.", tr: {en: "snowman", ar: "رجل الثلج"}, wrong: ["sandslott", "kälke"], gap: ["På rasten byggde de en", "snögubbe", "."], gapForm: "snögubbe", form: "en snögubbe – snögubbar"});
word("frysa", {sv: "frysa", m: "(frys(a|er)|frös|frusit)", d: t3("Känna sig kall.", "Feel cold.", "أن تشعر بالبرد."), ex: "Jag fryser om händerna.", tr: {en: "be cold, freeze", ar: "يشعر بالبرد"}, syn: ["vara kall"], opp: ["svettas"], wrong: ["skratta", "springa"], gap: ["Utan vantar började hon", "frysa", "om händerna."], gapForm: "frysa", form: "frysa – fryser – frös"});
word("mossa4", {sv: "mössa (en)", m: "möss(a|an|or|orna)", d: t3("Något varmt och mjukt man har på huvudet.", "Something warm and soft you wear on your head.", "شيء دافئ وناعم نلبسه على الرأس."), ex: "Ta på dig mössan, det är kallt!", tr: {en: "woolly hat", ar: "قبّعة صوفية"}, syn: ["luva"], wrong: ["vante", "sko"], gap: ["Hon tog på sig en röd", "mössa", "."], gapForm: "mössa", form: "en mössa – mössor"});
word("sv4punkt", {sv: "punkt", m: "punkt(en)?", d: t3("Ett litet tecken (.) som står sist i en mening.", "A small mark (.) at the end of a sentence.", "علامة صغيرة (.) في آخر الجملة."), ex: "Det snöar.", tr: {en: "full stop", ar: "نقطة"}});
word("sv4fragetecken", {sv: "frågetecken", m: "frågetecken(et)?", d: t3("Tecknet (?) som står sist i en fråga.", "The mark (?) at the end of a question.", "العلامة (?) في آخر السؤال."), ex: "Fryser du?", tr: {en: "question mark", ar: "علامة استفهام"}});
word("sv4versal", {sv: "stor bokstav", m: "stora? bokst(av|äver)", d: t3("En stor bokstav som A, B, C. Den står först i en mening och i namn.", "A capital letter like A, B, C. It starts a sentence and a name.", "حرف كبير مثل A وB وC. يأتي في أول الجملة وفي أول الاسم."), ex: "Yasmin, Leo, Hagaby", tr: {en: "capital letter", ar: "حرف كبير"}});

const G1 = [
  pic(`<rect x="40" y="30" width="220" height="190" rx="8" fill="#8db6d9"/><rect x="52" y="42" width="196" height="166" fill="#cfe3f5"/>${flakes(18)}<path d="M52 180 Q120 160 248 176 V208 H52Z" fill="#fff"/><path d="M60 50 l20 20 M70 48 l-10 22 M220 60 l16 16 M232 58 l-12 20 M64 190 l14 -14" stroke="#fff" stroke-width="3"/><rect x="146" y="42" width="8" height="166" fill="#8db6d9"/><rect x="52" y="122" width="196" height="8" fill="#8db6d9"/>${yas(150, 238, .62)}`, "#f4e7d3"),
  pic(`${yas(150, 120, 1.05)}${hat(150, 120, 1.05)}${mitten(110, 170, 1)}${mitten(190, 170, 1)}<rect x="96" y="132" width="108" height="16" rx="8" fill="#2257c9"/>`, "#dfe9f5"),
  pic(`${flakes(14)}${snowGround(200)}<rect x="20" y="150" width="6" height="60" fill="#8d6440"/><rect x="60" y="150" width="6" height="60" fill="#8d6440"/><rect x="14" y="160" width="60" height="6" fill="#8d6440"/>${leo(120, 120, .8)}${dog(200, 222, .8)}<g transform="rotate(-12 220 240)">${yas(250, 214, .55)}</g><path d="M90 268 q30 -6 60 0 t60 0" stroke="#9fd0f0" stroke-width="5" fill="none"/>`, "#cfe3f5"),
  pic(`${flakes(10)}${snowGround(190)}${snowman(110, 160, 1)}${hat(110, 145, .7, "#7cc08a")}${sled(220, 250, 1)}${kid(220, 150, "#e07b00", "#3b2a1e", .62)}`, "#cfe3f5"),
  pic(`<rect x="40" y="200" width="220" height="36" rx="6" fill="#e9eef5" stroke="#9aa6ba" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${54 + i * 36} 200 V236" stroke="#9aa6ba" stroke-width="3"/>`).join("")}${mitten(90, 180, .8)}${mitten(130, 180, .8, "#2257c9")}${mitten(170, 180, .8, "#7cc08a")}${mitten(210, 180, .8)}<path d="M80 168 H230" stroke="#5b6b82" stroke-width="3"/>${adult(150, 66, "#7b5aa6", "#a0522d", .7)}<rect x="196" y="110" width="26" height="30" rx="4" fill="#fff" stroke="#5b6b82" stroke-width="2"/><path d="M200 104 q4 -8 0 -14 M212 104 q4 -8 0 -14" stroke="#9aa6ba" stroke-width="2" fill="none"/>`, "#f4e7d3")];

const SENT: [string, "." | "?"][] = [["Det har kommit snö", "."], ["Yasmin tar på sig mössan", "."], ["Leo väntar vid grinden", "."], ["Det är halka på trottoaren", "."], ["Vi bygger en snögubbe", "."], ["Ibrahim har en kälke", "."], ["Yasmin fryser om händerna", "."], ["Kexi hoppar i snön", "."], ["Det är frost på fönstret", "."],
  ["Vem vill ha varm choklad", "?"], ["Var är mina vantar", "?"], ["Fryser du", "?"], ["Vill du åka kälke", "?"], ["Är det frost på fönstret", "?"], ["Har du en mössa", "?"], ["Vad ska snögubben heta", "?"], ["Snöar det i dag", "?"]];
const NAMES: [string, string][] = [["I dag leker yasmin i snön.", "Yasmin"], ["Sedan kom leo med Kexi.", "Leo"], ["Snögubben fick noahs gamla mössa.", "Noahs"], ["På rasten åkte ibrahim kälke.", "Ibrahim"], ["Efter rasten hängde karin upp vantarna.", "Karin"], ["Hunden heter kexi.", "Kexi"], ["Vi bor i hagaby.", "Hagaby"], ["Farmor bor i göteborg.", "Göteborg"], ["I dag fryser elsa om händerna.", "Elsa"], ["Min bror amir åker kälke.", "Amir"]];
const low = (s: string) => s[0].toLowerCase() + s.slice(1);
const MARK = {".": "punkt", "?": "frågetecken"} as const;

defineUnit({id: "sv4g", year: 4, ord: 7, title: t3("Vintern kommer", "Winter is coming", "الشتاء قادم"), storyTitle: "Vintern kommer",
  icon: icon("#cfe3f5", `${[...Array(20)].map((_, i) => `<circle cx="${(i * 53) % 310 + 6}" cy="${(i * 29) % 110 + 8}" r="${2 + (i % 3)}" fill="#fff"/>`).join("")}<path d="M0 130 Q90 112 170 130 T320 126 V180 H0Z" fill="#fff"/><g transform="translate(90 100) scale(.8)"><circle cy="40" r="34" fill="#fff" stroke="#c6cfdc" stroke-width="2"/><circle cy="-12" r="24" fill="#fff" stroke="#c6cfdc" stroke-width="2"/><circle cx="-8" cy="-16" r="3" fill="#1d2433"/><circle cx="8" cy="-16" r="3" fill="#1d2433"/><path d="M0 -10 L20 -6 L0 -4Z" fill="#e07b00"/><path d="M-20 -30 Q0 -64 20 -30Z" fill="#d63b2f"/></g>`, "Snö!"),
  words: ["sno", "frost", "vante", "halka", "kalke", "snogubbe", "frysa", "mossa4"], terms: ["sv4punkt", "sv4fragetecken", "sv4versal"],
  story: [
    {text: ["En morgon i november vaknade Yasmin tidigt. Hon tittade ut genom fönstret. Allt var vitt!", "”Mamma, det har kommit snö!” ropade hon. Det var frost på fönstret, och ute var det fortfarande mörkt."],
      pic: G1[0], say: say("Läs första delen. Tryck på de blå orden om du inte förstår dem.", "Read the first part. Tap the blue words if you don't understand them.", "اقرأ الجزء الأول. اضغط على الكلمات الزرقاء إن لم تفهمها.")},
    {text: ["Yasmin åt frukost fort. Sedan tog hon på sig varma kläder: en tjock jacka, en röd mössa och två vantar.", "”Glöm inte halsduken”, sa mamma. ”Det är kallt i dag.”"],
      pic: G1[1], say: say("Vad tar Yasmin på sig? Titta på bilden också.", "What does Yasmin put on? Look at the picture too.", "ماذا تلبس ياسمين؟ انظر إلى الصورة أيضًا.")},
    {text: ["Leo och Kexi väntade vid grinden. Kexi hoppade i snön och skällde glatt.", "”Gå försiktigt”, sa Leo. ”Det är halka på trottoaren.” Men Yasmin halkade ändå och satte sig på rumpan. Båda skrattade."],
      pic: G1[2], say: say("Halka betyder att det är is på marken. Vad händer med Yasmin?", "Halka means there is ice on the ground. What happens to Yasmin?", "‏halka تعني أن على الأرض جليدًا. ماذا يحدث لياسمين؟")},
    {text: ["På rasten byggde hela 4A en snögubbe på skolgården. Han fick en morot som näsa och Noahs gamla mössa.", "Ibrahim hade tagit med en kälke. Alla ville åka i backen bakom skolan."],
      pic: G1[3], say: say("Vad gör barnen på rasten?", "What do the children do at break?", "ماذا يفعل الأطفال في الاستراحة؟")},
    {text: ["Efter rasten var Yasmins vantar blöta. Hon började frysa om händerna.", "Karin hängde vantarna på elementet. ”Vem vill ha varm choklad?” frågade hon. ”Jag!” ropade alla."],
      pic: G1[4], say: say("Titta på slutet. En mening slutar med punkt. En fråga slutar med frågetecken.", "Look at the end. A sentence ends with a full stop. A question ends with a question mark.", "انظر إلى النهاية. الجملة تنتهي بنقطة، والسؤال ينتهي بعلامة استفهام.")}],
  wordsSay: say("Här är de nya orden om vintern. Tryck på ett ord för att se vad det betyder.", "Here are the new winter words. Tap a word to see what it means.", "هذه هي الكلمات الجديدة عن الشتاء. اضغط على كلمة لترى معناها."),
  grammar: [
    {draw: () => [A.wipe(), title("En mening", "A sentence", "جملة"), A.tx("Det har kommit snö.", 400, 170, 54, "k"),
      ...boxes([["Det", "r", "stor bokstav"], ["har kommit snö", null], [".", "b", "punkt"]], 320, 50)],
      say: say("En mening börjar med stor bokstav och slutar med punkt. Det har kommit snö. Stort D först, punkt sist.", "A sentence starts with a capital letter and ends with a full stop. Capital D first, full stop last.", "تبدأ الجملة بحرف كبير وتنتهي بنقطة: Det har kommit snö. حرف D كبير في البداية، ونقطة في النهاية.")},
    {draw: () => [A.wipe(), title("En fråga", "A question", "سؤال", 38, "o"), A.tx("Vem vill ha varm choklad?", 400, 170, 50, "k"),
      ...boxes([["Vem", "r", "stor bokstav"], ["vill ha varm choklad", null], ["?", "o", "frågetecken"]], 320, 46), A.tx("Fryser du?", 400, 450, 44, "o")],
      say: say("En fråga börjar också med stor bokstav. Men den slutar med frågetecken. Vem vill ha varm choklad? Fryser du?", "A question also starts with a capital letter, but it ends with a question mark.", "السؤال يبدأ أيضًا بحرف كبير، لكنه ينتهي بعلامة استفهام: Vem vill ha varm choklad? Fryser du?")},
    {draw: () => [A.wipe(), title("Namn har alltid stor bokstav", "Names always have a capital letter", "الأسماء تبدأ دائمًا بحرف كبير", 34),
      ...boxes([["Yasmin", "b"], ["Leo", "b"], ["Kexi", "b"], ["Hagaby", "b"]], 170, 44),
      A.tx("Is it snowing?  ✓", 400, 290, 36, "k"), A.tx("هل يتساقط الثلج؟", 400, 380, 44, "o"),
      qt(L(t3("arabiska: inga stora bokstäver, frågetecknet är vänt", "Arabic: no capital letters, the question mark is turned round", "العربية: لا توجد حروف كبيرة، وعلامة الاستفهام مقلوبة")), 400, 446, 24, "o")],
      say: say("Namn har alltid stor bokstav, också mitt i en mening. Engelska gör som svenska. Arabiska har inga stora bokstäver, och frågetecknet vänder åt andra hållet.", "Names always have a capital letter, also in the middle of a sentence. English works like Swedish. Arabic has no capital letters, and its question mark faces the other way.", "الأسماء تبدأ دائمًا بحرف كبير حتى في وسط الجملة. الإنجليزية مثل السويدية. أمّا العربية فليس فيها حروف كبيرة، وعلامة الاستفهام فيها مقلوبة: ؟")}],
  read: [
    {q: "Vad såg Yasmin när hon tittade ut?", o: ["Allt var vitt av snö.", "Det regnade.", "Solen sken."], why: "Del 1: Allt var vitt! Det hade kommit snö."},
    {q: "Vad hade Yasmin på huvudet?", o: ["En röd mössa", "En blå keps", "En grön halsduk"], why: "Del 2: en röd mössa."},
    {q: "Varför halkade Yasmin?", o: ["Det var halka på trottoaren.", "Kexi drog i henne.", "Hon sprang för fort."], why: "Del 3: Det är halka på trottoaren."},
    {q: "Vad fick snögubben som näsa?", o: ["En morot", "En sten", "En pinne"], why: "Del 4: en morot som näsa."},
    {q: "Varför frös Yasmin om händerna?", o: ["Vantarna var blöta.", "Hon hade glömt vantarna.", "Fönstret var öppet."], why: "Del 5: Yasmins vantar var blöta."},
    {q: "Alla ropar ”Jag!”. Vad vill de säga?", o: ["Alla vill gärna ha varm choklad.", "Alla vill gå ut igen.", "Alla vill gå hem."], why: "De svarar på Karins fråga. Alla vill ha choklad."}],
  gram(lv, write): Problem {
    if (write || lv === 2) {
      if (Math.random() < .5) {
        const [s, nm] = pick(NAMES);
        return {kind: "text", ans: [nm], show: nm, q: [A.wipe(), A.tx(L(t3("Ett ord ska ha stor bokstav. Skriv ordet.", "One word needs a capital letter. Write the word.", "كلمة واحدة تحتاج إلى حرف كبير. اكتب الكلمة.")), 400, 80, 30, "b"), ...svLines(s, 230, 44)],
          sol: [A.tx(s.replace(nm.toLowerCase(), nm), 400, 410, 38, "g")], hint: {say: t3("Leta efter ett namn.", "Look for a name.", "ابحث عن اسم."), draw: [qt(L(t3("namn → stor bokstav", "name → capital letter", "اسم ← حرف كبير")), 400, 330, 28, "o")]}};
      }
      const [s, mk] = pick(SENT);
      return {kind: "text", ans: [MARK[mk]], show: MARK[mk], q: [A.wipe(), A.tx(L(t3("Vad ska stå sist? Skriv punkt eller frågetecken.", "What goes at the end? Write punkt or frågetecken.", "ماذا يأتي في النهاية؟ اكتب punkt أو frågetecken.")), 400, 80, 28, "b"), ...svLines(s + " ___", 230, 46)],
        sol: [A.tx(s + mk, 400, 410, 40, "g")], hint: {say: t3("Frågar meningen något?", "Does the sentence ask something?", "هل تسأل الجملة عن شيء؟"), draw: []}};
    }
    const [s, mk] = pick(SENT);
    if (lv === 0) {
      const right = s + mk, opts = shuffle([right, low(s) + mk, s + (mk === "." ? "?" : ".")]);
      return {kind: "choice", opts, ans: opts.indexOf(right), show: right, q: [A.wipe(), A.tx(L(t3("Vilken är rätt skriven?", "Which one is written correctly?", "أيّها مكتوبة بشكل صحيح؟")), 400, 120, 38, "b"), A.tx(L(t3("Titta på början och slutet.", "Look at the start and the end.", "انظر إلى البداية والنهاية.")), 400, 200, 30, "k")],
        sol: [A.tx(right, 400, 400, 40, "g")], hint: {say: t3("Stor bokstav först. Punkt efter en mening, frågetecken efter en fråga.", "A capital letter first. A full stop after a sentence, a question mark after a question.", "حرف كبير في البداية. نقطة بعد الجملة، وعلامة استفهام بعد السؤال."), draw: []}};
    }
    const O = ["punkt  .", "frågetecken  ?", "komma  ,"], right = mk === "." ? O[0] : O[1], opts = shuffle(O);
    return {kind: "choice", opts, ans: opts.indexOf(right), show: right, q: [A.wipe(), A.tx(L(t3("Vilket tecken ska stå sist?", "Which mark goes at the end?", "أي علامة تأتي في النهاية؟")), 400, 90, 36, "b"), ...svLines(s + " ___", 230, 46)],
      sol: [A.tx(s + mk, 400, 410, 40, "g")], hint: {say: t3("Är det en fråga? Då är det frågetecken.", "Is it a question? Then it's a question mark.", "هل هي سؤال؟ إذن علامة استفهام."), draw: []}};
  },
  help: [{say: t3("Stor bokstav först. Punkt sist i en mening, frågetecken sist i en fråga.", "Capital letter first. A full stop at the end of a sentence, a question mark at the end of a question.", "حرف كبير في البداية. نقطة في آخر الجملة، وعلامة استفهام في آخر السؤال."),
    draw: () => [A.tx("Det snöar.", 400, 190, 50, "b"), A.tx("Snöar det?", 400, 310, 50, "o")]}]});

/* =====================================================================
   unit 8: Brevet till farmor (personliga pronomen)
   ===================================================================== */
word("brev", {sv: "brev (ett)", m: "brev(et|en)?", d: t3("Ett papper med en text som man skickar till någon.", "A paper with a message that you send to someone.", "ورقة فيها كلام نرسلها إلى شخص ما."), ex: "Yasmin skriver ett brev till farmor.", tr: {en: "letter", ar: "رسالة"}, syn: ["kort"], wrong: ["bok", "bild"], gap: ["Yasmin skrev ett", "brev", "till farmor."], gapForm: "brev", form: "ett brev – brev"});
word("frimarke", {sv: "frimärke (ett)", m: "frimärk(e|et|en|ena)", d: t3("En liten lapp man sätter på brevet. Den betalar för posten.", "A small sticker you put on a letter. It pays for the post.", "ورقة صغيرة نلصقها على الرسالة لندفع ثمن البريد."), ex: "Hon satte ett frimärke på kuvertet.", tr: {en: "stamp", ar: "طابع بريدي"}, wrong: ["sudd", "kort"], gap: ["Glöm inte att sätta ett", "frimärke", "på kuvertet."], gapForm: "frimärke", form: "ett frimärke – frimärken"});
word("kuvert", {sv: "kuvert (ett)", m: "kuvert(et|en)?", d: t3("Ett papper som man lägger brevet i.", "A paper cover you put a letter in.", "غلاف من الورق نضع فيه الرسالة."), ex: "Hon lade brevet i ett kuvert.", tr: {en: "envelope", ar: "ظرف"}, syn: ["brevpapper"], wrong: ["paket", "låda"], gap: ["Hon lade brevet i ett", "kuvert", "."], gapForm: "kuvert", form: "ett kuvert – kuvert"});
word("adress", {sv: "adress (en)", m: "adress(en|er|erna)?", d: t3("Namnet på gatan, numret och staden där någon bor.", "The street, the number and the town where someone lives.", "اسم الشارع والرقم والمدينة حيث يسكن شخص ما."), ex: "Skriv adressen på kuvertet.", tr: {en: "address", ar: "عنوان"}, wrong: ["telefon", "namn"], gap: ["De skrev farmors", "adress", "på kuvertet."], gapForm: "adress", form: "en adress – adresser"});
word("brevlada", {sv: "brevlåda (en)", m: "brevlåd(a|an|or|orna)", d: t3("En låda där man lägger brev som ska skickas.", "A box where you put letters that will be sent.", "صندوق نضع فيه الرسائل لكي تُرسَل."), ex: "Brevlådan står vid affären.", tr: {en: "postbox, letterbox", ar: "صندوق البريد"}, wrong: ["papperskorg", "garderob"], gap: ["De lade brevet i", "brevlådan", "vid affären."], gapForm: "brevlådan", form: "en brevlåda – brevlådor"});
word("halsa", {sv: "hälsa på", m: "häls(a|ar|ade) på", d: t3("Åka och träffa någon där den bor.", "Go and see someone where they live; visit.", "أن تذهب لترى شخصًا في المكان الذي يسكن فيه؛ يزور."), ex: "Farmor kommer och hälsar på.", tr: {en: "visit", ar: "يزور"}, syn: ["besöka"], wrong: ["skriva till", "ringa"], gap: ["Kom och", "hälsa på", "oss snart!"], gapForm: "hälsa på", form: "hälsa på – hälsade på"});
word("langta", {sv: "längta", m: "längta(r|de|t)?", d: t3("Vilja mycket att någon ska komma eller att något ska hända.", "Want very much for someone to come or for something to happen; long for.", "أن تتمنّى كثيرًا أن يأتي شخص أو يحدث شيء؛ يشتاق."), ex: "Vi längtar efter sommaren.", tr: {en: "long for, miss", ar: "يشتاق"}, syn: ["sakna"], wrong: ["glömma", "skratta"], gap: ["Vi", "längtar", "efter dig, farmor!"], gapForm: "längtar", form: "längta – längtade"});
word("svara", {sv: "svara", m: "svara(r|de|t)?", d: t3("Säga eller skriva något när någon har frågat.", "Say or write something back when someone has asked.", "أن تقول أو تكتب شيئًا عندما يسألك أحد؛ يجيب."), ex: "Farmor svarade på brevet.", tr: {en: "answer, reply", ar: "يجيب، يردّ"}, opp: ["fråga"], wrong: ["sova", "leta"], gap: ["Farmor ville", "svara", "på brevet."], gapForm: "svara", form: "svara – svarade"});

const G2 = [
  pic(`<rect x="0" y="0" width="300" height="300" fill="#f6efe2"/><rect x="40" y="26" width="220" height="90" rx="6" fill="#2f4a3a"/><text x="150" y="82" font-family="Caveat,cursive" font-size="34" fill="#fff" text-anchor="middle">Skriv ett brev!</text>${adult(70, 150, "#7b5aa6", "#a0522d", .75)}<rect x="110" y="236" width="170" height="14" rx="4" fill="#b98757"/>${yas(190, 170, .6)}<rect x="160" y="222" width="60" height="14" fill="#fff"/>`),
  pic(`<rect x="40" y="40" width="220" height="230" rx="6" fill="#fff" stroke="#c6cfdc" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M60 ${80 + i * 26} H${i === 6 ? 160 : 240}" stroke="#9aa6ba" stroke-width="3" stroke-dasharray="${i % 2 ? "30 8" : "50 10"}"/>`).join("")}<text x="60" y="70" font-family="Caveat,cursive" font-size="30" fill="#1f4fb0">Hej farmor!</text>${snowman(225, 215, .5)}`, "#dfe9f5"),
  pic(`${flakes(10)}${snowGround(200)}${sled(150, 250, 1.1)}${kid(150, 160, "#2257c9", "#2b1d14", .6)}<text x="150" y="70" font-size="40" text-anchor="middle">❤️</text>`, "#cfe3f5"),
  pic(`${letter(150, 120, 2)}<text x="120" y="140" font-family="Caveat,cursive" font-size="22" fill="#1d2433" text-anchor="middle">Farmor Leila</text><text x="120" y="164" font-family="Caveat,cursive" font-size="18" fill="#5b6b82" text-anchor="middle">Göteborg</text>${yas(80, 216, .55)}${leo(220, 216, .55)}`, "#f6efe2"),
  pic(`<rect x="0" y="236" width="300" height="64" fill="#c6cfdc"/><rect x="160" y="110" width="70" height="60" rx="8" fill="#f2c200"/><rect x="190" y="170" width="10" height="70" fill="#5b6b82"/><rect x="172" y="126" width="46" height="6" rx="3" fill="#1d2433"/>${letter(195, 98, .45)}${yas(80, 140, .65)}${dog(110, 250, .6)}`, "#dfe9f5")];

const PRO: [string, string, string][] = [["Yasmin", "skriver ett brev", "hon"], ["Leo", "hjälper till", "han"], ["Farmor", "bor i Göteborg", "hon"], ["Amir", "åker kälke", "han"], ["Karin", "delar ut papper", "hon"], ["Farfar", "svarar på brevet", "han"], ["Elsa", "köper frimärken", "hon"], ["Ibrahim", "skriver en adress", "han"],
  ["Yasmin och Leo", "går till brevlådan", "de"], ["Mamma och pappa", "läser brevet", "de"], ["Noah och Ibrahim", "fryser", "de"], ["Jag och Leo", "bygger en snögubbe", "vi"], ["Jag och mamma", "längtar efter farmor", "vi"], ["Du och jag", "skriver på kuvertet", "vi"]];
const PRONS = ["han", "hon", "vi", "de"];
/* a name or pronoun in a box at the left, the rest of the sentence after it */
const nameRow = (who: string, rest: string, y: number, c: string): Draw[] => { const w = Math.max(70, who.length * 38 * .46 + 28);
  return [A.p(R.rect(200 - w / 2, y - 36, w, 51, .6), c, 3.5), A.tx(who, 200, y, 38, c), A.tx(rest, 280, y, 38, "k", "start")]; };

defineUnit({id: "sv4h", year: 4, ord: 8, title: t3("Brevet till farmor", "The letter to Grandma", "الرسالة إلى الجدّة"), storyTitle: "Brevet till farmor",
  icon: icon("#f6efe2", `<g transform="translate(130 85) scale(2)"><rect x="-40" y="-26" width="80" height="52" rx="3" fill="#fff" stroke="#5b6b82" stroke-width="2.5"/><path d="M-40 -26 L0 4 L40 -26" stroke="#5b6b82" stroke-width="2.5" fill="none"/><rect x="20" y="-20" width="14" height="16" fill="#e07b00"/></g>`, "Hej farmor!"),
  words: ["brev", "frimarke", "kuvert", "adress", "brevlada", "halsa", "langta", "svara"], terms: [],
  story: [
    {text: ["I dag ska 4A skriva brev. ”Ni får skriva till vem ni vill”, säger Karin.", "Yasmin vet direkt. Hon ska skriva till farmor. Farmor bor kvar i Göteborg, och hon har inte varit här sedan i somras."],
      pic: G2[0], say: say("En ny berättelse om Yasmin. Vem ska hon skriva till?", "A new story about Yasmin. Who is she going to write to?", "قصة جديدة عن ياسمين. إلى من ستكتب؟")},
    {text: ["Yasmin tar fram en penna och börjar skriva:", "”Hej farmor! Här har det kommit mycket snö. Jag och Leo har byggt en snögubbe. Han har en röd mössa och två vantar."],
      pic: G2[1], say: say("Yasmin skriver ”Jag och Leo”. Det kan man också säga med ett ord: vi.", "Yasmin writes ”Jag och Leo”. You can also say it with one word: vi (we).", "تكتب ياسمين «Jag och Leo». يمكن قول ذلك بكلمة واحدة: vi (نحن).")},
    {text: ["Amir har fått en kälke. Han åker i backen varje dag.", "Vi längtar efter dig. När kommer du och hälsar på? Kram från Yasmin”"],
      pic: G2[2], say: say("Längta betyder att man vill mycket att någon ska komma. Vem längtar de efter?", "Längta means you really want someone to come. Who are they longing for?", "‏längta تعني أنك تتمنّى كثيرًا أن يأتي شخص ما. إلى من يشتاقون؟")},
    {text: ["Leo hjälper henne med kuvertet. De skriver farmors namn och adress på det.", "Sedan sätter Yasmin ett frimärke i hörnet. Det har en bild av en räv."],
      pic: G2[3], say: say("Vad måste man skriva på ett kuvert? Titta på bilden.", "What do you need to write on an envelope? Look at the picture.", "ماذا يجب أن نكتب على الظرف؟ انظر إلى الصورة.")},
    {text: ["Efter skolan tar Leo Kexi i kopplet, och de går till den gula brevlådan vid affären. Kexi skäller när brevet försvinner.", "Fyra dagar senare ligger ett brev i hallen. Det är från farmor! Hon vill svara med en kram. ”Jag kommer på lördag!” har hon skrivit."],
      pic: G2[4], say: say("Farmor svarar. Vad tror du att hon känner när hon läser Yasmins brev?", "Grandma answers. How do you think she feels when she reads Yasmin's letter?", "الجدّة تردّ. بماذا تظن أنها تشعر عندما تقرأ رسالة ياسمين؟")}],
  wordsSay: say("Nya ord om brev. Tryck på dem. Några ord från vintern kommer tillbaka i brevet.", "New words about letters. Tap them. Some winter words come back in the letter.", "كلمات جديدة عن الرسائل. اضغط عليها. بعض كلمات الشتاء تعود في الرسالة."),
  grammar: [
    {draw: () => { const X = [190, 400, 610], rows = [["jag", "I", "أنا"], ["du", "you", "أنتَ / أنتِ"], ["han", "he", "هو"], ["hon", "she", "هي"], ["vi", "we", "نحن"], ["de", "they", "هم"]];
      return [A.wipe(), title("Pronomen", "Pronouns", "الضمائر"), ...["svenska", "English", "العربية"].map((s, i) => qt(s, X[i], 112, 24, ["b", "k", "o"][i])), A.p(R.line(100, 126, 700, 126, .3), "k", 2),
        ...rows.flatMap((r, j) => r.map((s, i) => A.tx(s, X[i], 170 + j * 54, 36, ["b", "k", "o"][i])))]; },
      say: say("Pronomen är små ord som står i stället för ett namn: jag, du, han, hon, vi, de.", "Pronouns are small words that stand instead of a name: jag, du, han, hon, vi, de.", "الضمائر كلمات صغيرة تأتي بدل الاسم: jag (أنا)، du (أنتَ/أنتِ)، han (هو)، hon (هي)، vi (نحن)، de (هم).")},
    {draw: () => [A.wipe(), title("Namn → pronomen", "Name → pronoun", "اسم ← ضمير"),
      ...nameRow("Yasmin", "tar fram en penna.", 150, "b"), A.arrow(200, 168, 200, 214, "r"), ...nameRow("Hon", "tar fram en penna.", 250, "r"),
      ...nameRow("Amir", "åker i backen.", 360, "b"), A.arrow(200, 378, 200, 424, "r"), ...nameRow("Han", "åker i backen.", 460, "r")],
      say: say("I brevet byter Yasmin ut namn mot pronomen. Yasmin blir hon. Amir blir han. Jag och Leo blir vi.", "In the letter Yasmin swaps names for pronouns. Yasmin becomes hon (she). Amir becomes han (he). Jag och Leo becomes vi (we).", "في الرسالة تستبدل ياسمين الأسماء بالضمائر: Yasmin تصبح hon (هي)، وAmir يصبح han (هو)، وJag och Leo تصبح vi (نحن).")},
    {draw: () => [A.wipe(), title("Svenska och arabiska", "Swedish and Arabic", "السويدية والعربية", 36),
      A.tx("Jag skriver ett brev.  ✓", 400, 150, 40, "g"), A.tx("✗  Skriver ett brev.", 400, 220, 36, "r"), A.p(R.line(270, 230, 550, 230, .3), "r", 3),
      A.tx("أكتبُ رسالة.", 400, 300, 42, "o"), qt(L(t3("arabiska: verbet visar redan vem", "Arabic: the verb already shows who", "العربية: الفعل يبيّن مَن الفاعل")), 400, 340, 24, "o"),
      A.tx("du =", 190, 430, 36, "b"), A.tx("أنتَ / أنتِ", 300, 430, 36, "o"), A.tx("de =", 500, 430, 36, "b"), A.tx("هم / هنّ", 610, 430, 36, "o")],
      say: say("På svenska måste pronomenet alltid vara med: Jag skriver. På arabiska räcker verbet. Och du och de är samma för pojkar och flickor.", "In Swedish the pronoun must always be there: Jag skriver. In Arabic the verb is enough. And du and de are the same for boys and girls.", "في السويدية يجب أن يأتي الضمير دائمًا: Jag skriver. أمّا في العربية فيكفي الفعل: أكتبُ. والضميران du وde لا يتغيّران بين المذكّر والمؤنّث، أمّا العربية ففيها أنتَ وأنتِ، وهم وهنّ.")}],
  read: [
    {q: "Vem skriver Yasmin till?", o: ["Farmor", "Morfar", "Karin"], why: "Del 1: Hon ska skriva till farmor."},
    {q: "Var bor farmor?", o: ["I Göteborg", "I Hagaby", "I samma hus som Yasmin"], why: "Del 1: Farmor bor kvar i Göteborg."},
    {q: "Vad har snögubben på sig?", o: ["En röd mössa och två vantar", "En hatt och en halsduk", "Ingenting"], why: "Del 2: en röd mössa och två vantar."},
    {q: "Vad skriver de på kuvertet?", o: ["Farmors namn och adress", "Leos namn", "En bild av en räv"], why: "Del 4: farmors namn och adress."},
    {q: "Var lägger de brevet?", o: ["I den gula brevlådan vid affären", "I farmors hall", "På Karins bord"], why: "Del 5: den gula brevlådan vid affären."},
    {q: "Varför tror du att farmor kommer på lördag?", o: ["Hon längtar också efter Yasmin.", "Hon vill åka kälke.", "Karin har bett henne komma."], why: "Yasmin skrev att de längtar. Farmor vill träffa dem."}],
  gram(lv, write): Problem {
    const pool = lv === 0 ? PRO.slice(0, 8) : PRO, [who, rest, p] = pick(pool), done = cap(p) + " " + rest + ".";
    if (write || lv === 2) return {kind: "text", ans: [p], show: p, q: [A.wipe(), A.tx(L(t3("Skriv ett pronomen i stället för det blå", "Write a pronoun instead of the blue words", "اكتب ضميرًا بدل الكلمات الزرقاء")), 400, 80, 30, "b"), ...boxes([[who, "b"], [rest + ".", null]], 230, 38), A.tx("___ " + rest + ".", 400, 340, 38, "k")],
      sol: [A.tx(done, 400, 440, 38, "g")], hint: {say: t3("En person: han eller hon. Flera personer: vi eller de. Är du själv med? Då vi.", "One person: han or hon. Several people: vi or de. Are you yourself included? Then vi.", "شخص واحد: han أو hon. عدّة أشخاص: vi أو de. هل أنت منهم؟ إذن vi."), draw: []}};
    const opts = shuffle([p, ...shuffle(PRONS.filter(x => x !== p)).slice(0, 2)]);
    return {kind: "choice", opts, ans: opts.indexOf(p), show: p, q: [A.wipe(), A.tx(L(t3("Vilket ord kan stå i stället för det blå?", "Which word can replace the blue words?", "أي كلمة يمكن أن تأتي بدل الكلمات الزرقاء؟")), 400, 100, 32, "b"), ...boxes([[who, "b"], [rest + ".", null]], 260, 40)],
      sol: [A.tx(done, 400, 420, 38, "g")], hint: {say: t3("Pojke: han. Flicka: hon. Flera: de. Jag och någon: vi.", "Boy: han. Girl: hon. Several: de. Me and someone: vi.", "ولد: han. بنت: hon. عدّة أشخاص: de. أنا وشخص آخر: vi."), draw: []}};
  },
  help: [{say: t3("Han för en pojke, hon för en flicka, de för flera, vi för jag och någon till.", "Han for a boy, hon for a girl, de for several, vi for me and someone else.", "‏han للولد، وhon للبنت، وde لعدّة أشخاص، وvi لي ولشخص آخر."),
    draw: () => [A.tx("Leo → han", 260, 180, 42, "b"), A.tx("Yasmin → hon", 560, 180, 42, "r"), A.tx("Jag och Leo → vi", 400, 290, 42, "g"), A.tx("Elsa och Noah → de", 400, 390, 42, "o")]}]});

/* =====================================================================
   unit 9: Var är nyckeln? (prepositioner)
   ===================================================================== */
word("nyckel", {sv: "nyckel (en)", m: "nyck(el|eln|lar|larna)", d: t3("En liten sak av metall som man låser upp dörren med.", "A small metal thing you unlock a door with.", "قطعة معدنية صغيرة نفتح بها الباب."), ex: "Farmor letar efter sin nyckel.", tr: {en: "key", ar: "مفتاح"}, wrong: ["penna", "sked"], gap: ["Farmor hittade inte sin", "nyckel", "."], gapForm: "nyckel", form: "en nyckel – nycklar"});
word("lada", {sv: "låda (en)", m: "låd(a|an|or|orna)", d: t3("Ett slags ask, ofta i ett bord eller ett skåp, där man har saker.", "A kind of box, often in a table or a cupboard, where you keep things; drawer.", "صندوق صغير، غالبًا في طاولة أو خزانة، نضع فيه الأشياء؛ دُرج."), ex: "Skeden ligger i lådan.", tr: {en: "drawer, box", ar: "دُرج، صندوق"}, wrong: ["matta", "dörr"], gap: ["Mamma tittade i", "lådan", "i köket."], gapForm: "lådan", form: "en låda – lådor"});
word("hylla", {sv: "hylla (en)", m: "hyll(a|an|or|orna)", d: t3("En bräda på väggen där man ställer saker.", "A board on the wall where you put things; shelf.", "لوح على الحائط نضع عليه الأشياء؛ رفّ."), ex: "Böckerna står på hyllan.", tr: {en: "shelf", ar: "رفّ"}, wrong: ["golv", "säng"], gap: ["Pappa tittade på", "hyllan", "i hallen."], gapForm: "hyllan", form: "en hylla – hyllor"});
word("soffa", {sv: "soffa (en)", m: "soff(a|an|or|orna)", d: t3("En mjuk möbel där flera kan sitta.", "A soft piece of furniture where several people can sit.", "قطعة أثاث ناعمة يجلس عليها عدّة أشخاص؛ أريكة."), ex: "Vi sitter i soffan och läser.", tr: {en: "sofa", ar: "أريكة"}, syn: ["bäddsoffa"], wrong: ["hylla", "lampa"], gap: ["Yasmin kröp under", "soffan", "."], gapForm: "soffan", form: "en soffa – soffor"});
word("kudde", {sv: "kudde (en)", m: "kudd(e|en|ar|arna)", d: t3("Något mjukt man lägger huvudet på, eller har i soffan.", "Something soft you put your head on, or have on a sofa.", "شيء ناعم نضع عليه رأسنا أو نضعه على الأريكة؛ وسادة."), ex: "Kudden är mjuk.", tr: {en: "cushion, pillow", ar: "وسادة"}, wrong: ["sten", "nyckel"], gap: ["Amir lyfte på", "kudden", "i soffan."], gapForm: "kudden", form: "en kudde – kuddar"});
word("matta", {sv: "matta (en)", m: "matt(a|an|or|orna)", d: t3("Något av tyg som ligger på golvet.", "A piece of cloth that lies on the floor; rug.", "قطعة من القماش موضوعة على الأرض؛ سجّادة."), ex: "Kexi ligger på mattan.", tr: {en: "rug, carpet", ar: "سجّادة"}, wrong: ["gardin", "kudde"], gap: ["Kexi nosade på", "mattan", "i hallen."], gapForm: "mattan", form: "en matta – mattor"});
word("garderob", {sv: "garderob (en)", m: "garderob(en|er|erna)?", d: t3("Ett stort skåp där man hänger kläder.", "A big cupboard where you hang clothes; wardrobe.", "خزانة كبيرة نعلّق فيها الملابس."), ex: "Jackan hänger i garderoben.", tr: {en: "wardrobe", ar: "خزانة الملابس"}, syn: ["klädskåp"], wrong: ["kylskåp", "låda"], gap: ["Jackan hängde i", "garderoben", "."], gapForm: "garderoben", form: "en garderob – garderober"});
word("leta", {sv: "leta", m: "leta(r|de|t)?", d: t3("Försöka hitta något.", "Try to find something; look for.", "أن تحاول إيجاد شيء؛ يبحث."), ex: "Alla letar efter nyckeln.", tr: {en: "look for, search", ar: "يبحث"}, syn: ["söka"], wrong: ["sova", "gömma"], gap: ["Alla började", "leta", "efter nyckeln."], gapForm: "leta", form: "leta – letade"});

/* a key and a piece of furniture on the board, the key in one of five places; (ox, oy) is the centre, s the scale */
const keyAt = (x: number, y: number, s: number, up = false): Draw[] => up
  ? [A.loop(x, y, 13 * s, 13 * s, "o"), A.p([0, 1, 2, 3, 4].map(i => R.line(x, y + (13 + i * 11) * s, x, y + (19 + i * 11) * s, .05)).join("") + R.line(x, y + 57 * s, x + 9 * s, y + 57 * s, .05), "o", 4)]
  : [A.loop(x, y, 13 * s, 13 * s, "o"), A.p(R.line(x + 13 * s, y, x + 56 * s, y, .1) + R.line(x + 44 * s, y, x + 44 * s, y + 12 * s, .1) + R.line(x + 56 * s, y, x + 56 * s, y + 12 * s, .1), "o", 5)];
function furniture(where: string, label: string, ox = 400, oy = 230, s = 1): Draw[] {
  const ln = (a: number, b: number, c: number, d: number) => R.line(ox + a * s, oy + b * s, ox + c * s, oy + d * s, .2);
  const body = where === "i" ? ln(-110, -80, -110, 20) + ln(-110, 20, 110, 20) + ln(110, 20, 110, -80) : ln(-110, -80, 110, -80) + ln(110, -80, 110, 20) + ln(110, 20, -110, 20) + ln(-110, 20, -110, -80);
  const K: Record<string, [number, number, boolean]> = {i: [-30, -20, false], "på": [-30, -94, false], under: [-30, 48, false], bredvid: [130, 56, false], bakom: [40, -104, true]};
  const [kx, ky, up] = K[where];
  return [A.p(ln(-190, 70, 190, 70), "k", 2), A.p(body, "b", 4), A.p(ln(-96, 20, -96, 70) + ln(96, 20, 96, 70), "b", 4), ...(label ? [qt(label, ox, oy + 70 * s + 34, 26, "b")] : []), ...keyAt(ox + kx * s, oy + ky * s, s, up)];
}
const PREP: [string, string][] = [["i", "lådan"], ["i", "garderoben"], ["på", "hyllan"], ["på", "soffan"], ["på", "bordet"], ["under", "kudden"], ["under", "soffan"], ["under", "bordet"], ["bakom", "soffan"], ["bakom", "garderoben"], ["bredvid", "lådan"], ["bredvid", "kudden"], ["bredvid", "soffan"], ["bredvid", "bordet"]];
const PREPS = ["i", "på", "under", "bakom", "bredvid"];

const sofaSvg = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-90" y="-50" width="180" height="50" rx="14" fill="#2a7d9c"/><rect x="-100" y="-20" width="200" height="40" rx="12" fill="#3592b5"/><rect x="-108" y="-34" width="26" height="54" rx="10" fill="#2a7d9c"/><rect x="82" y="-34" width="26" height="54" rx="10" fill="#2a7d9c"/><rect x="-90" y="20" width="10" height="16" fill="#5b4636"/><rect x="80" y="20" width="10" height="16" fill="#5b4636"/><ellipse cx="-50" cy="-30" rx="26" ry="18" fill="#f2c200"/></g>`;
const G3 = [
  house("#f6efe2", `${adult(110, 110, "#a0522d", "#c6cfdc", .75)}<path d="M96 76 Q110 64 124 76" stroke="#c6cfdc" stroke-width="6" fill="none"/>${yas(210, 136, .62)}<text x="150" y="60" font-family="Caveat,cursive" font-size="44" fill="#d63b2f" text-anchor="middle">?</text>`),
  house("#f6efe2", `<rect x="20" y="70" width="110" height="10" fill="#8d6440"/><rect x="30" y="40" width="16" height="30" fill="#2257c9"/><rect x="50" y="46" width="14" height="24" fill="#d63b2f"/>${sofaSvg(200, 200, .7)}${kid(70, 150, "#5b6b82", "#2b1d14", .55)}${kid(230, 104, "#2257c9", "#2b1d14", .5)}`),
  house("#f6efe2", `${sofaSvg(150, 170, 1.1)}<path d="M20 240 H280" stroke="#5b4636" stroke-width="4"/>${yas(240, 214, .45)}<text x="120" y="230" font-size="22">✏️</text><text x="160" y="232" font-size="22">🧦</text>`),
  house("#f6efe2", `<rect x="190" y="40" width="96" height="196" rx="4" fill="#b98757" stroke="#8d6440" stroke-width="3"/><path d="M238 40 V236" stroke="#8d6440" stroke-width="3"/><circle cx="230" cy="140" r="4" fill="#5b4636"/><circle cx="246" cy="140" r="4" fill="#5b4636"/><rect x="20" y="250" width="160" height="30" rx="6" fill="#d63b2f" opacity=".75"/>${dog(140, 236, .8)}${leo(70, 150, .65)}`),
  house("#f6efe2", `${mitten(150, 120, 2.2)}<g transform="translate(160 136) rotate(-30)"><circle r="14" fill="none" stroke="#e0b43a" stroke-width="6"/><path d="M14 0 H58 M46 0 V12 M58 0 V12" stroke="#e0b43a" stroke-width="6"/></g>${yas(60, 150, .6)}${adult(250, 130, "#a0522d", "#c6cfdc", .62)}`)];

defineUnit({id: "sv4i", year: 4, ord: 9, title: t3("Var är nyckeln?", "Where is the key?", "أين المفتاح؟"), storyTitle: "Var är nyckeln?",
  icon: icon("#f6efe2", `<g transform="translate(150 90) rotate(-20)"><circle r="26" fill="none" stroke="#e0b43a" stroke-width="10"/><path d="M26 0 H110 M88 0 V22 M110 0 V22" stroke="#e0b43a" stroke-width="10"/></g><text x="60" y="80" font-family="Caveat,cursive" font-weight="700" font-size="70" fill="#d63b2f">?</text>`, "under? bakom?"),
  words: ["nyckel", "lada", "hylla", "soffa", "kudde", "matta", "garderob", "leta"], terms: [],
  story: [
    {text: ["Farmor hälsar på hos Yasmin. På lördag morgon ska hon och Yasmin gå till affären.", "Men farmor hittar inte sin nyckel. ”Var är min nyckel?” frågar hon."],
      pic: G3[0], say: say("Farmor har kommit! Men vad är det som är borta?", "Grandma has come! But what is missing?", "جاءت الجدّة! لكن ما الشيء المفقود؟")},
    {text: ["Alla börjar leta. Mamma tittar i lådan i köket. Pappa tittar på hyllan i hallen. Ingen nyckel.", "Amir lyfter på kudden i soffan. Där ligger bara ett gammalt brev."],
      pic: G3[1], say: say("Läs noga: var tittar mamma, pappa och Amir? Små ord som i, på och under säger var.", "Read carefully: where do Mum, Dad and Amir look? Small words like i, på and under say where.", "اقرأ بانتباه: أين تبحث الأم والأب وأمير؟ كلمات صغيرة مثل i وpå وunder تقول أين.")},
    {text: ["Yasmin kryper under soffan. Där är det mörkt och dammigt. Hon hittar en penna och en strumpa, men ingen nyckel.", "Då ringer det på dörren. Det är Leo och Kexi."],
      pic: G3[2], say: say("Vad hittar Yasmin under soffan?", "What does Yasmin find under the sofa?", "ماذا تجد ياسمين تحت الأريكة؟")},
    {text: ["Kexi springer in och nosar på mattan. Sedan springer Kexi till garderoben och skäller.", "Yasmin öppnar garderoben. Där hänger hennes jacka. Bredvid jackan ligger hennes röda mössa och vantarna."],
      pic: G3[3], say: say("Varför skäller Kexi vid garderoben, tror du?", "Why do you think Kexi barks at the wardrobe?", "لماذا تظن أن كِكسي تنبح عند الخزانة؟")},
    {text: ["Kexi nosar på en vante. Yasmin tittar i den. Där är nyckeln!", "”Jag lånade den i går när jag gick ut och lekte i snön”, säger Yasmin. Farmor skrattar. ”Kexi är bäst på att leta!”"],
      pic: G3[4], say: say("Där var nyckeln! Varför låg den i vanten?", "There was the key! Why was it in the mitten?", "ها هو المفتاح! لماذا كان في القفّاز؟")}],
  wordsSay: say("Nya ord från huset. Tryck på dem och läs exemplen.", "New words from the house. Tap them and read the examples.", "كلمات جديدة من البيت. اضغط عليها واقرأ الأمثلة."),
  grammar: [
    {draw: () => [A.wipe(), title("Var är nyckeln?", "Where is the key?", "أين المفتاح؟"), ...[["i", "i lådan"], ["på", "på hyllan"], ["under", "under soffan"]].flatMap(([w, lab], j) => [A.tx(w, 150 + j * 250, 150, 48, "r"), ...furniture(w, lab, 150 + j * 250, 290, .6)])],
      say: say("I lådan: inuti. På hyllan: ovanpå. Under soffan: nedanför. Orden i, på och under säger var något är.", "I lådan: inside. På hyllan: on top. Under soffan: underneath. The words i, på and under say where something is.", "‏i lådan: داخل الدُّرج. ‏på hyllan: على الرفّ. ‏under soffan: تحت الأريكة. الكلمات i وpå وunder تقول أين يوجد الشيء.")},
    {draw: () => [A.wipe(), title("bakom och bredvid", "behind and next to", "خلف وبجانب"), A.tx("bakom", 220, 140, 46, "r"), ...furniture("bakom", "", 220, 270, .75),
      A.tx("bredvid", 580, 140, 46, "r"), ...furniture("bredvid", "", 560, 270, .75), ...boxes([["Mössan ligger", null], ["bredvid", "r"], ["jackan.", null]], 440, 34)],
      say: say("Bakom: på andra sidan, så att man nästan inte ser den. Prickarna visar den gömda delen av nyckeln. Bredvid: precis intill. Mössan ligger bredvid jackan.", "Bakom: on the other side, so you can hardly see it. The dots show the hidden part of the key. Bredvid: right next to it. Mössan ligger bredvid jackan.", "‏bakom: في الجهة الأخرى بحيث لا نكاد نراه، والنقاط تُظهر الجزء المخفيّ من المفتاح. ‏bredvid: بجانبه مباشرة. ‏Mössan ligger bredvid jackan: القبّعة بجانب السترة.")},
    {draw: () => { const rows = [["i", "in", "في"], ["på", "on", "على"], ["under", "under", "تحت"], ["bakom", "behind", "خلف"], ["bredvid", "next to", "بجانب"]], X = [210, 420, 620];
      return [A.wipe(), title("Tre språk", "Three languages", "ثلاث لغات"), ...["svenska", "English", "العربية"].map((s, i) => qt(s, X[i], 112, 24, ["r", "k", "o"][i])),
        ...rows.flatMap((r, j) => r.map((s, i) => A.tx(s, X[i], 170 + j * 62, 38, ["r", "k", "o"][i]))), A.hl(140, 190, 140, 52)]; },
      say: say("Prepositionerna finns på alla språk. Men se upp: på svenska säger man ofta på där engelskan har in eller at, till exempel på bilden, i the picture.", "Prepositions exist in every language. But watch out: Swedish often says på where English says in or at, for example på bilden, in the picture.", "حروف الجرّ موجودة في كل اللغات. لكن انتبه: السويدية تقول غالبًا på حيث تقول الإنجليزية in أو at، مثل på bilden، أي في الصورة.")}],
  read: [
    {q: "Vad letar alla efter?", o: ["Farmors nyckel", "Yasmins mössa", "Ett gammalt brev"], why: "Del 1: Farmor hittar inte sin nyckel."},
    {q: "Var tittar mamma?", o: ["I lådan i köket", "Under soffan", "I garderoben"], why: "Del 2: Mamma tittar i lådan i köket."},
    {q: "Vad hittar Yasmin under soffan?", o: ["En penna och en strumpa", "Nyckeln", "Ett brev"], why: "Del 3: en penna och en strumpa."},
    {q: "Vem skäller vid garderoben?", o: ["Kexi", "Leo", "Farmor"], why: "Del 4: Kexi springer till garderoben och skäller."},
    {q: "Var låg nyckeln till slut?", o: ["I Yasmins vante", "På hyllan", "Under mattan"], why: "Del 5: Yasmin tittar i vanten. Där är nyckeln!"},
    {q: "Varför låg nyckeln i vanten?", o: ["Yasmin lånade den och glömde den där.", "Kexi gömde den.", "Farmor lade den där."], why: "Del 5: Yasmin lånade nyckeln när hon lekte i snön."}],
  gram(lv, write): Problem {
    const [p, obj] = pick(PREP), sent = `Nyckeln ligger ${p} ${obj}.`;
    const q: Draw[] = [A.wipe(), A.tx(L(t3("Var ligger nyckeln?", "Where is the key?", "أين يوجد المفتاح؟")), 400, 60, 34, "b"), ...furniture(p, obj, 400, 220), A.tx(`Nyckeln ligger ____ ${obj}.`, 400, 400, 40, "k")];
    const sol: Draw[] = [A.tx(sent, 400, 460, 38, "g")];
    if (write || lv === 2) return {kind: "text", ans: [p], show: p, q, sol, hint: {say: t3("Välj bland i, på, under, bakom och bredvid.", "Choose from i, på, under, bakom and bredvid.", "اختر من i وpå وunder وbakom وbredvid."), draw: [qt("i · på · under · bakom · bredvid", 400, 440, 26, "o")]}};
    const opts = shuffle([p, ...shuffle(PREPS.filter(x => x !== p)).slice(0, 2)]);
    return {kind: "choice", opts, ans: opts.indexOf(p), show: p, q, sol, hint: {say: t3("Titta på bilden. Är nyckeln inuti, ovanpå, under, bakom eller bredvid?", "Look at the picture. Is the key inside, on top, under, behind or next to it?", "انظر إلى الصورة. هل المفتاح داخله أم فوقه أم تحته أم خلفه أم بجانبه؟"), draw: []}};
  },
  help: [{say: t3("i = inuti, på = ovanpå, under = nedanför, bakom = på andra sidan, bredvid = intill.", "i = inside, på = on, under = under, bakom = behind, bredvid = next to.", "i = في، på = على، under = تحت، bakom = خلف، bredvid = بجانب."),
    draw: () => [A.tx("i lådan · på hyllan", 400, 170, 44, "b"), A.tx("under soffan", 400, 260, 44, "b"), A.tx("bakom · bredvid", 400, 350, 44, "b")]}]});

/* =====================================================================
   unit 10: Inte i dag! (inte efter verbet)
   ===================================================================== */
word("forkyld", {sv: "förkyld", m: "förkyld(a)?", d: t3("Sjuk med snuva, ont i halsen och hosta.", "Ill with a runny nose, a sore throat and a cough; have a cold.", "مريض بسيلان الأنف وألم الحلق والسعال؛ مُصاب بالزكام."), ex: "Yasmin är förkyld och stannar hemma.", tr: {en: "have a cold", ar: "مُصاب بالزكام"}, opp: ["frisk"], wrong: ["glad", "hungrig"], gap: ["Yasmin är", "förkyld", "och stannar hemma."], gapForm: "förkyld", form: "förkyld – förkylt – förkylda"});
word("feber", {sv: "feber (en)", m: "feber(n)?", d: t3("När kroppen blir för varm för att man är sjuk.", "When your body gets too hot because you are ill.", "عندما يصبح الجسم ساخنًا جدًّا بسبب المرض؛ حُمّى."), ex: "Hon har 38 i feber.", tr: {en: "fever, temperature", ar: "حُمّى"}, wrong: ["frukost", "snö"], gap: ["Hon har 38,5 i", "feber", "."], gapForm: "feber", form: "feber – febern"});
word("hosta", {sv: "hosta", m: "host(a|ar|ade|at)", d: t3("Släppa ut luft ur halsen med ett högt ljud.", "Push air out of your throat with a loud sound; cough.", "أن يُخرج الهواء من الحلق بصوت عالٍ؛ يسعل."), ex: "Han hostar hela natten.", tr: {en: "cough", ar: "يسعل"}, wrong: ["sjunga", "gäspa"], gap: ["Sedan började hon", "hosta", "."], gapForm: "hosta", form: "hosta – hostade"});
word("termometer", {sv: "termometer (en)", m: "termomet(er|ern|rar|rarna)", d: t3("En sak som mäter hur varmt eller kallt något är.", "A thing that measures how warm or cold something is.", "أداة تقيس درجة الحرارة؛ ميزان الحرارة."), ex: "Termometern visar 38.", tr: {en: "thermometer", ar: "ميزان الحرارة"}, wrong: ["linjal", "klocka"], gap: ["Mamma hämtade en", "termometer", "."], gapForm: "termometer", form: "en termometer – termometrar"});
word("vila", {sv: "vila", m: "vila(r|de|t)?", d: t3("Ligga eller sitta still så att kroppen blir pigg igen.", "Lie or sit still so your body gets better; rest.", "أن تستلقي أو تجلس بهدوء حتى يرتاح الجسم؛ يستريح."), ex: "Du måste vila i dag.", tr: {en: "rest", ar: "يستريح"}, syn: ["ta det lugnt"], wrong: ["leka", "springa"], gap: ["Hon fick bara", "vila", "."], gapForm: "vila", form: "vila – vilade"});
word("apotek", {sv: "apotek (ett)", m: "apotek(et|en)?", d: t3("En affär där man köper medicin.", "A shop where you buy medicine; pharmacy.", "متجر نشتري منه الدواء؛ صيدلية."), ex: "Mamma går till apoteket.", tr: {en: "pharmacy, chemist's", ar: "صيدلية"}, wrong: ["bibliotek", "simhall"], gap: ["Mamma gick till", "apoteket", "."], gapForm: "apoteket", form: "ett apotek – apotek"});
word("medicin", {sv: "medicin (en)", m: "medicin(en|er|erna)?", d: t3("Något man äter eller dricker för att bli frisk.", "Something you swallow to get well; medicine.", "شيء نأكله أو نشربه لكي نُشفى؛ دواء."), ex: "Medicinen smakar inte gott.", tr: {en: "medicine", ar: "دواء"}, syn: ["läkemedel"], wrong: ["godis", "saft"], gap: ["Yasmin tog sin", "medicin", "."], gapForm: "medicin", form: "en medicin – mediciner"});
word("frisk", {sv: "frisk", m: "frisk(t|a)?", d: t3("Inte sjuk.", "Not ill; healthy, well.", "غير مريض؛ معافى."), ex: "Nu är jag frisk igen!", tr: {en: "healthy, well", ar: "معافى"}, syn: ["pigg"], opp: ["sjuk"], wrong: ["trött", "ledsen"], gap: ["På onsdag var hon", "frisk", "igen."], gapForm: "frisk", form: "frisk – friskt – friska"});
word("sv4negation", {sv: "nekande mening", m: "nekande meningar?", d: t3("En mening med inte. Den säger nej.", "A sentence with inte. It says no.", "جملة فيها inte. إنها تنفي."), ex: "Jag har inte feber.", tr: {en: "negative sentence", ar: "جملة منفية"}});

const G4 = [
  house("#e7eef8", `<rect x="40" y="150" width="150" height="70" rx="10" fill="#fff" stroke="#c6cfdc" stroke-width="3"/><rect x="30" y="130" width="20" height="106" fill="#8d6440"/><rect x="186" y="160" width="16" height="76" fill="#8d6440"/><rect x="70" y="160" width="120" height="56" rx="10" fill="#9fc6e8"/><circle cx="80" cy="146" r="22" fill="#f1c7a3"/><path d="M57 142 Q60 118 80 120 Q102 118 103 142 Q94 130 80 131 Q66 130 57 142Z" fill="${YHAIR}"/><circle cx="73" cy="148" r="2.4" fill="#1d2433"/><circle cx="87" cy="148" r="2.4" fill="#1d2433"/>${ill(80, 146)}${adult(248, 104, "#2a7d9c", "#2b1d14", .65)}`),
  house("#e7eef8", `<g transform="translate(150 120) rotate(30)"><rect x="-10" y="-70" width="20" height="120" rx="10" fill="#fff" stroke="#5b6b82" stroke-width="3"/><circle cy="54" r="14" fill="#d63b2f"/><rect x="-4" y="-40" width="8" height="90" fill="#d63b2f"/></g><text x="210" y="80" font-family="Caveat,cursive" font-size="42" fill="#d63b2f">38,5</text>${yas(70, 160, .6)}${ill(70, 160, .6)}`),
  house("#e7eef8", `${sofaSvg(150, 200, 1.1)}<rect x="70" y="160" width="160" height="40" rx="12" fill="#e98a5a"/>${yas(150, 140, .55)}${ill(150, 140, .55)}<rect x="226" y="60" width="54" height="40" rx="6" fill="#7cc08a"/><path d="M253 66 V94 M239 80 H267" stroke="#fff" stroke-width="7"/>`),
  house("#e7eef8", `<rect x="60" y="40" width="180" height="120" rx="6" fill="#fff" stroke="#c6cfdc" stroke-width="3"/><text x="150" y="90" font-family="Caveat,cursive" font-size="32" fill="#1f4fb0" text-anchor="middle">Krya på dig!</text>${dog(110, 140, .5)}<text x="200" y="146" font-size="22">❤️</text>${leo(220, 190, .55)}${yas(80, 190, .55)}`),
  pic(`${flakes(8)}${snowGround(210)}${yas(150, 130, .9)}${hat(150, 130, .9)}<path d="M100 60 l-14 -14 M200 60 l14 -14 M150 46 V26" stroke="#e0b43a" stroke-width="5" stroke-linecap="round"/>`, "#cfe3f5")];

const NEG: [string, string, string][] = [["Yasmin", "har", "feber"], ["Leo", "är", "förkyld"], ["Jag", "vill", "vila"], ["Mamma", "går", "till apoteket"], ["Medicinen", "smakar", "gott"], ["Kexi", "skäller", "på Leo"], ["Vi", "åker", "buss i dag"], ["Pappa", "hittar", "termometern"], ["Noah", "kommer", "till skolan"], ["Yasmin", "hostar", "på natten"], ["Du", "får", "gå ut"], ["Elsa", "fryser", "om händerna"], ["Hon", "är", "frisk"]];
const NEGV: [string, string, string, string][] = [["I dag", "går", "du", "till skolan"], ["I kväll", "tar", "hon", "medicinen"], ["I morgon", "kommer", "han", "till skolan"], ["Nu", "hostar", "jag", "så mycket"], ["På onsdag", "har", "hon", "feber"], ["I dag", "får", "vi", "gå ut"], ["Efter lunch", "vilar", "hon", "i soffan"], ["I dag", "vill", "Yasmin", "vila"]];

defineUnit({id: "sv4j", year: 4, ord: 10, title: t3("Inte i dag!", "Not today!", "ليس اليوم!"), storyTitle: "Inte i dag!",
  icon: icon("#e7eef8", `<g transform="translate(110 90) rotate(30)"><rect x="-10" y="-60" width="20" height="104" rx="10" fill="#fff" stroke="#5b6b82" stroke-width="3"/><circle cy="44" r="14" fill="#d63b2f"/><rect x="-4" y="-30" width="8" height="76" fill="#d63b2f"/></g><text x="160" y="96" font-family="Caveat,cursive" font-weight="700" font-size="56" fill="#d63b2f">38,5</text>`, "inte i dag!", "#d63b2f"),
  words: ["forkyld", "feber", "hosta", "termometer", "vila", "apotek", "medicin", "frisk"], terms: ["sv4negation"],
  story: [
    {text: ["På måndag morgon vaknar Yasmin. Hon har ont i halsen, och hon fryser fast täcket är tjockt.", "”Jag tror att du är förkyld”, säger mamma."],
      pic: G4[0], say: say("Yasmin mår inte bra i dag. Hur märker hon det?", "Yasmin is not well today. How does she notice?", "ياسمين ليست بخير اليوم. كيف تلاحظ ذلك؟")},
    {text: ["Mamma hämtar en termometer. Yasmin har 38,5 i feber.", "”Du går inte till skolan i dag”, säger mamma. ”Men jag vill gå!” säger Yasmin. Sedan börjar hon hosta."],
      pic: G4[1], say: say("Titta på ordet inte. Det säger nej: Du går inte till skolan.", "Look at the word inte. It says no: You are not going to school.", "انظر إلى الكلمة inte. إنها تنفي: Du går inte till skolan، أي لن تذهبي إلى المدرسة.")},
    {text: ["Yasmin ligger i soffan med en filt och en stor kudde. Hon får inte gå ut i snön. Hon ska bara vila.", "Mamma går till apoteket och köper medicin. Den smakar inte gott, men Yasmin tar den ändå."],
      pic: G4[2], say: say("Var köper mamma medicin?", "Where does Mum buy medicine?", "من أين تشتري الأم الدواء؟")},
    {text: ["På eftermiddagen ringer det på dörren. Det är Leo. Han är ute på promenad med Kexi, och han har ett brev från 4A.", "”Krya på dig! Vi längtar efter dig”, står det. Alla i klassen har ritat en bild. Noah har ritat Kexi."],
      pic: G4[3], say: say("Krya på dig betyder: bli frisk snart! Vem har skrivit brevet?", "Krya på dig means: get well soon! Who wrote the letter?", "‏Krya på dig تعني: أتمنّى لك الشفاء العاجل! من كتب الرسالة؟")},
    {text: ["På onsdag har Yasmin inte feber längre. Hon hostar inte heller. Hon är frisk!", "”Kan jag gå till skolan nu?” frågar hon. ”Ja”, säger mamma och skrattar. ”Men glöm inte mössan.”"],
      pic: G4[4], say: say("Yasmin är frisk igen. Hur många gånger hittar du ordet inte i den här delen?", "Yasmin is well again. How many times can you find the word inte in this part?", "ياسمين معافاة من جديد. كم مرّة تجد كلمة inte في هذا الجزء؟")}],
  wordsSay: say("Nya ord om att vara sjuk och bli frisk. Tryck på dem.", "New words about being ill and getting well. Tap them.", "كلمات جديدة عن المرض والشفاء. اضغط عليها."),
  grammar: [
    {draw: () => [A.wipe(), title("inte står efter verbet", "inte comes after the verb", "inte تأتي بعد الفعل"), ...boxes([["Du", "b"], ["går", "g", "verb"], ["till skolan.", null]], 190, 44),
      A.arrow(400, 240, 400, 290, "r"), ...boxes([["Du", "b"], ["går", "g", "verb"], ["inte", "r", "inte"], ["till skolan.", null]], 370, 44)],
      say: say("Vill man säga nej, sätter man in ordet inte. Det står direkt efter verbet: Du går inte till skolan.", "To say no, you add the word inte. It comes right after the verb: Du går inte till skolan.", "لكي ننفي نضيف الكلمة inte، وتأتي مباشرة بعد الفعل: Du går inte till skolan (لن تذهبي إلى المدرسة).")},
    {draw: () => [A.wipe(), title("Börjar meningen med ”I dag”?", "Does the sentence start with ”I dag”?", "هل تبدأ الجملة بـ «I dag»؟", 34),
      ...boxes([["I dag", "o", "1"], ["går", "g", "2: verb"], ["du", "b"], ["inte", "r"], ["till skolan.", null]], 200, 42),
      ...boxes([["På onsdag", "o", "1"], ["har", "g", "2: verb"], ["hon", "b"], ["inte", "r"], ["feber.", null]], 370, 42)],
      say: say("Börjar meningen med I dag eller På onsdag, kommer verbet först och sedan du eller hon. Inte står efter dem: I dag går du inte till skolan.", "If the sentence starts with I dag or På onsdag, the verb comes first, then du or hon. Inte comes after them.", "إذا بدأت الجملة بـ I dag أو På onsdag يأتي الفعل أولًا ثم du أو hon، وبعدهما inte: I dag går du inte till skolan.")},
    {draw: () => [A.wipe(), title("Tre språk", "Three languages", "ثلاث لغات"), A.tx("Jag har inte feber.", 400, 150, 44, "g"),
      A.tx("I do not have a fever.", 400, 250, 38, "k"), qt(L(t3("engelska: do not före verbet", "English: do not before the verb", "الإنجليزية: do not قبل الفعل")), 400, 290, 24, "k"),
      A.tx("لا أذهب إلى المدرسة.", 400, 380, 42, "o"), qt(L(t3("arabiska: nej-ordet före verbet", "Arabic: the no-word before the verb", "العربية: لا قبل الفعل")), 400, 425, 24, "o")],
      say: say("På engelska och arabiska kommer nej-ordet före verbet. På svenska kommer inte efter verbet: Jag har inte feber. Man säger aldrig ”jag inte har”.", "In English and Arabic the no-word comes before the verb. In Swedish inte comes after the verb: Jag har inte feber. Never ”jag inte har”.", "في الإنجليزية والعربية تأتي أداة النفي قبل الفعل: لا أذهب. أمّا في السويدية فتأتي inte بعد الفعل: Jag har inte feber. لا نقول أبدًا «jag inte har».")}],
  read: [
    {q: "Hur känner Yasmin att hon är sjuk?", o: ["Hon har ont i halsen och fryser.", "Hon har ont i magen.", "Hon kan inte gå."], why: "Del 1: ont i halsen, och hon fryser."},
    {q: "Hur mycket feber har Yasmin?", o: ["38,5", "37", "40"], why: "Del 2: Yasmin har 38,5 i feber."},
    {q: "Vad köper mamma på apoteket?", o: ["Medicin", "Godis", "En termometer"], why: "Del 3: Mamma köper medicin."},
    {q: "Vad har Leo med sig?", o: ["Ett brev från 4A", "En kälke", "En present"], why: "Del 4: Han har ett brev från 4A."},
    {q: "När är Yasmin frisk igen?", o: ["På onsdag", "På måndag", "På lördag"], why: "Del 5: På onsdag har hon inte feber längre."},
    {q: "Varför säger Yasmin ”Men jag vill gå!”?", o: ["Hon tycker om skolan och kompisarna.", "Hon vill gå till apoteket.", "Hon har ingen feber."], why: "Hon vill vara i skolan fast hon är sjuk."}],
  gram(lv, write): Problem {
    const hint = {say: t3("Hitta verbet. Inte kommer efter verbet, och efter du, han eller hon om de står efter verbet.", "Find the verb. Inte comes after the verb, and after du, han or hon if they come after the verb.", "ابحث عن الفعل. تأتي inte بعد الفعل، وبعد du أو han أو hon إن جاءت بعد الفعل."), draw: []};
    if (write || lv === 2) {
      const [s, v, r] = pick(NEG), base = `${s} ${v} ${r}.`, right = `${s} ${v} inte ${r}.`;
      return {kind: "text", ans: [right], show: right, q: [A.wipe(), A.tx(L(t3("Säg nej! Skriv meningen med inte.", "Say no! Write the sentence with inte.", "انفِ! اكتب الجملة مع inte.")), 400, 80, 32, "b"), ...svLines(base, 230, 44)], sol: [A.tx(right, 400, 420, 38, "g")], hint};
    }
    let right: string, w1: string, w2: string;
    if (lv === 1 && Math.random() < .5) { const [a, v, s, r] = pick(NEGV); right = `${a} ${v} ${s} inte ${r}.`; w1 = `${a} inte ${v} ${s} ${r}.`; w2 = `${a} ${s} ${v} inte ${r}.`; }
    else { const [s, v, r] = pick(NEG); right = `${s} ${v} inte ${r}.`; w1 = `${s} inte ${v} ${r}.`; w2 = `Inte ${["Yasmin", "Leo", "Kexi", "Noah", "Elsa"].includes(s) ? s : s.toLowerCase()} ${v} ${r}.`; }
    const opts = shuffle([right, w1, w2]);
    return {kind: "choice", opts, ans: opts.indexOf(right), show: right, q: [A.wipe(), A.tx(L(t3("Var ska inte stå? Välj rätt mening.", "Where does inte go? Choose the right sentence.", "أين تأتي inte؟ اختر الجملة الصحيحة.")), 400, 120, 34, "b"), A.tx(L(t3("Tänk: inte efter verbet.", "Think: inte after the verb.", "فكّر: inte بعد الفعل.")), 400, 200, 30, "k")], sol: [A.tx(right, 400, 400, 38, "g")], hint};
  },
  help: [{say: t3("Inte står efter verbet: Jag har inte feber.", "Inte comes after the verb: Jag har inte feber.", "تأتي inte بعد الفعل: Jag har inte feber."), draw: () => boxes([["Jag", "b"], ["har", "g", "verb"], ["inte", "r"], ["feber.", null]], 250, 48)}]});

/* =====================================================================
   unit 11: Kalaset (klockan och veckodagarna)
   ===================================================================== */
word("svkvart", {sv: "kvart (en)", m: "kvart(en|ar)?", d: t3("En fjärdedel av en timme: 15 minuter.", "A quarter of an hour: 15 minutes.", "ربع ساعة: 15 دقيقة."), ex: "Klockan är kvart över två.", tr: {en: "quarter (of an hour)", ar: "ربع ساعة"}, wrong: ["halv", "vecka"], gap: ["Klockan är", "kvart", "över två."], gapForm: "kvart", form: "en kvart – kvartar"});
word("svhalv", {sv: "halv", m: "halv(t|a)?", d: t3("Hälften. Halv tre är 30 minuter före tre: 2.30.", "Half. Halv tre is 30 minutes before three: 2:30.", "نصف. ‏halv tre تعني قبل الثالثة بثلاثين دقيقة: 2:30."), ex: "Kalaset börjar halv tre.", tr: {en: "half", ar: "نصف"}, wrong: ["kvart", "hel"], gap: ["Kalaset börjar klockan", "halv", "tre."], gapForm: "halv", form: "halv tre = 2.30"});
word("svminut", {sv: "minut (en)", m: "minut(en|er|erna)?", d: t3("En kort tid. En timme har 60 minuter.", "A short time. An hour has 60 minutes.", "وقت قصير. في الساعة 60 دقيقة."), ex: "Det tar tio minuter att gå dit.", tr: {en: "minute", ar: "دقيقة"}, wrong: ["vecka", "kalender"], gap: ["Det tar tio", "minuter", "att gå till Leo."], gapForm: "minuter", form: "en minut – minuter"});
word("vecka", {sv: "vecka (en)", m: "veck(a|an|or|orna)", d: t3("Sju dagar, från måndag till söndag.", "Seven days, from Monday to Sunday.", "سبعة أيام، من الاثنين إلى الأحد."), ex: "Om en vecka är det sommarlov.", tr: {en: "week", ar: "أسبوع"}, wrong: ["minut", "månad"], gap: ["En", "vecka", "har sju dagar."], gapForm: "vecka", form: "en vecka – veckor"});
word("kalender", {sv: "kalender (en)", m: "kalend(er|ern|rar|rarna)", d: t3("Ett papper eller en bok som visar alla dagar och veckor.", "A paper or a book that shows all the days and weeks.", "ورقة أو كتاب يبيّن كل الأيام والأسابيع؛ تقويم."), ex: "Hon skrev kalaset i kalendern.", tr: {en: "calendar", ar: "تقويم"}, syn: ["almanacka"], wrong: ["termometer", "klocka"], gap: ["Hon skrev kalaset i", "kalendern", "."], gapForm: "kalendern", form: "en kalender – kalendrar"});
word("fodelsedag", {sv: "födelsedag (en)", m: "födelsedag(en|ar|arna)?", d: t3("Dagen då man föddes. Då fyller man år.", "The day you were born. Then you have your birthday.", "اليوم الذي وُلدنا فيه. في هذا اليوم يكبر المرء سنة؛ عيد الميلاد."), ex: "Grattis på födelsedagen!", tr: {en: "birthday", ar: "عيد الميلاد"}, wrong: ["helg", "vecka"], gap: ["Grattis på", "födelsedagen", "!"], gapForm: "födelsedagen", form: "en födelsedag – födelsedagar"});
word("kalas", {sv: "kalas (ett)", m: "kalas(et|en)?", d: t3("En fest, ofta när någon fyller år.", "A party, often when someone has a birthday.", "حفلة، غالبًا عندما يكون عيد ميلاد شخص ما."), ex: "Leo har kalas på lördag.", tr: {en: "party", ar: "حفلة"}, syn: ["fest"], wrong: ["lektion", "läxa"], gap: ["Leo har", "kalas", "på lördag."], gapForm: "kalas", form: "ett kalas – kalas"});
word("inbjudan", {sv: "inbjudan (en)", m: "(inbjudan|inbjudningar(na)?)", d: t3("Ett kort där det står att du är välkommen på något.", "A card that says you are welcome to come to something; invitation.", "بطاقة مكتوب فيها أنك مدعوّ إلى شيء ما؛ دعوة."), ex: "Jag fick en inbjudan till kalaset.", tr: {en: "invitation", ar: "دعوة"}, syn: ["inbjudningskort"], wrong: ["frimärke", "kalender"], gap: ["I kuvertet låg en", "inbjudan", "till kalaset."], gapForm: "inbjudan", form: "en inbjudan – inbjudningar"});
word("sv4klockslag", {sv: "klockslag", m: "klockslag(et|en)?", d: t3("Vad klockan är, till exempel kvart över två eller halv tre.", "What time it is, for example kvart över två or halv tre.", "كم الساعة، مثلًا kvart över två أو halv tre."), ex: "halv tre = 2.30", tr: {en: "time of day", ar: "الوقت على الساعة"}});
word("sv4veckodag", {sv: "veckodag", m: "veckodag(en|ar|arna)?", d: t3("En av de sju dagarna: måndag, tisdag, onsdag …", "One of the seven days: Monday, Tuesday, Wednesday …", "يوم من أيام الأسبوع السبعة: الاثنين، الثلاثاء، الأربعاء …"), ex: "måndag, tisdag, onsdag, torsdag, fredag, lördag, söndag", tr: {en: "day of the week", ar: "يوم من أيام الأسبوع"}});

const DAYS = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"];
const G5 = [
  pic(`${letter(150, 110, 2.2)}<rect x="70" y="150" width="160" height="110" rx="6" fill="#fff4c9" stroke="#e0b43a" stroke-width="3"/><text x="150" y="188" font-family="Caveat,cursive" font-size="26" fill="#d63b2f" text-anchor="middle">Välkommen</text><text x="150" y="216" font-family="Caveat,cursive" font-size="24" fill="#1d2433" text-anchor="middle">på kalas!</text><text x="150" y="246" font-family="Caveat,cursive" font-size="22" fill="#1f4fb0" text-anchor="middle">lördag 14.30</text>`, "#fdf0e6"),
  pic(`<rect x="50" y="40" width="200" height="200" rx="8" fill="#fff" stroke="#5b6b82" stroke-width="3"/><rect x="50" y="40" width="200" height="34" rx="8" fill="#d63b2f"/><text x="150" y="65" font-family="Caveat,cursive" font-size="24" fill="#fff" text-anchor="middle">mars</text>${[...Array(28)].map((_, i) => `<rect x="${60 + (i % 7) * 26}" y="${84 + Math.floor(i / 7) * 36}" width="22" height="30" fill="${i === 12 ? "#f2c200" : "#eef2f8"}"/>`).join("")}<text x="${60 + 5 * 26 + 11}" y="${84 + 36 + 54}" font-size="16" text-anchor="middle">🎈</text>`, "#fdf0e6"),
  pic(`${yas(80, 150, .7)}<rect x="160" y="150" width="90" height="70" rx="6" fill="#2257c9"/><path d="M205 150 V220 M160 185 H250" stroke="#f2c200" stroke-width="6"/><path d="M205 150 q-16 -20 -24 -4 M205 150 q16 -20 24 -4" stroke="#f2c200" stroke-width="6" fill="none"/><text x="205" y="120" font-size="34" text-anchor="middle">🐶</text>`, "#fdf0e6"),
  house("#fdf0e6", `${clockSvg(230, 70, 40, 2, 15)}${sofaSvg(140, 220, .9)}<path d="M40 252 q10 -12 26 -6 q4 8 -6 10z" fill="#d63b2f"/>${yas(70, 120, .55)}<text x="110" y="100" font-family="Caveat,cursive" font-size="36" fill="#d63b2f">?!</text>`),
  pic(`${clockSvg(240, 60, 36, 2, 30)}${[0, 1, 2].map(i => `<circle cx="${40 + i * 30}" cy="${50 + (i % 2) * 20}" r="16" fill="${["#d63b2f", "#2257c9", "#f2c200"][i]}"/><path d="M${40 + i * 30} ${66 + (i % 2) * 20} V${110 + (i % 2) * 20}" stroke="#5b6b82" stroke-width="2"/>`).join("")}${leo(110, 150, .7)}${yas(200, 150, .7)}${dog(60, 260, .55)}<rect x="160" y="170" width="40" height="30" rx="4" fill="#2257c9"/>`, "#fdf0e6")];

defineUnit({id: "sv4k", year: 4, ord: 11, title: t3("Kalaset", "The party", "الحفلة"), storyTitle: "Kalaset",
  icon: icon("#fdf0e6", `${clockSvg(90, 85, 60, 2, 30)}${[0, 1, 2].map(i => `<circle cx="${190 + i * 34}" cy="${50 + (i % 2) * 20}" r="20" fill="${["#d63b2f", "#2257c9", "#f2c200"][i]}"/><path d="M${190 + i * 34} ${70 + (i % 2) * 20} V${130 + (i % 2) * 10}" stroke="#5b6b82" stroke-width="2"/>`).join("")}`, "halv tre"),
  words: ["svkvart", "svhalv", "svminut", "vecka", "kalender", "fodelsedag", "kalas", "inbjudan"], terms: ["sv4klockslag", "sv4veckodag"],
  story: [
    {text: ["Yasmin är frisk igen. På måndag får hon ett kuvert av sin kompis Leo. I kuvertet ligger en inbjudan.", "”Välkommen på kalas! Jag fyller tio år. Lördag klockan halv tre.”"],
      pic: G5[0], say: say("Leo bjuder på kalas. När börjar kalaset?", "Leo is having a party. When does the party start?", "ليو يدعو إلى حفلة. متى تبدأ الحفلة؟")},
    {text: ["Yasmin springer hem och visar mamma. Hon skriver kalaset i kalendern i köket.", "”Leo har födelsedag om fem dagar”, säger Yasmin. ”Det känns som en hel vecka!”"],
      pic: G5[1], say: say("Varför känns fem dagar som en hel vecka, tror du?", "Why do you think five days feel like a whole week?", "لماذا تظن أن خمسة أيام تبدو كأسبوع كامل؟")},
    {text: ["Varje dag tittar Yasmin i kalendern. Tisdag, onsdag, torsdag, fredag … Hon letar efter en present och köper en bok om hundar.", "På lördag ska hon gå hemifrån kvart över två. Det tar bara tio minuter att gå till Leo."],
      pic: G5[2], say: say("Veckodagarna skrivs med liten bokstav på svenska: tisdag, onsdag.", "In Swedish the days of the week are written with a small letter: tisdag, onsdag.", "في السويدية تُكتب أيام الأسبوع بحرف صغير: tisdag وonsdag.")},
    {text: ["Men på lördag har Yasmin bråttom. Hon hittar inte sin andra sko! Klockan är redan kvart över två.", "Till slut hittar hon skon under soffan. Hon springer hela vägen."],
      pic: G5[3], say: say("Klockan är kvart över två. Hinner Yasmin i tid?", "It is a quarter past two. Will Yasmin make it on time?", "الساعة الثانية والربع. هل ستصل ياسمين في الوقت المحدّد؟")},
    {text: ["Klockan är precis halv tre när hon ringer på. Leo öppnar, och Kexi hoppar och skäller.", "”Grattis på födelsedagen!” ropar Yasmin. Leo öppnar paketet. ”En bok om hundar! Den kan jag läsa för Kexi!”"],
      pic: G5[4], say: say("Halv tre betyder halvvägs till tre. Det är 2.30.", "Halv tre means halfway to three. That is 2:30.", "‏halv tre تعني في منتصف الطريق إلى الثالثة، أي الثانية والنصف: 2:30.")}],
  wordsSay: say("Nya ord om tid och kalas. Tryck på dem.", "New words about time and parties. Tap them.", "كلمات جديدة عن الوقت والحفلات. اضغط عليها."),
  grammar: [
    {draw: () => [A.wipe(), title("halv tre = 2.30", "halv tre = 2:30", "halv tre = 2:30"), ...clock(250, 280, 130, 2, 30),
      A.tx("halv tre", 600, 190, 52, "r"), A.tx("half past two", 600, 280, 34, "k"), A.tx("الثانية والنصف", 600, 360, 38, "o"), qt(L(t3("svenska: halvvägs till tre", "Swedish: halfway to three", "السويدية: في منتصف الطريق إلى الثالثة")), 600, 420, 22, "r")],
      say: say("Se upp! Halv tre betyder halvvägs till tre, alltså 2.30. På engelska och arabiska säger man två och en halv.", "Watch out! Halv tre means halfway to three, so 2:30. In English and Arabic you say half past two.", "انتبه! ‏halv tre تعني في منتصف الطريق إلى الثالثة، أي 2:30. أمّا بالإنجليزية والعربية فنقول: الثانية والنصف.")},
    {draw: () => [A.wipe(), title("kvart över och kvart i", "quarter past and quarter to", "والربع وإلّا ربعًا", 36), ...clock(150, 250, 95, 2, 15), ...clock(400, 250, 95, 2, 30), ...clock(650, 250, 95, 2, 45),
      A.tx("kvart över två", 150, 410, 30, "b"), A.tx("halv tre", 400, 410, 30, "r"), A.tx("kvart i tre", 650, 410, 30, "g"), qt("2.15", 150, 455, 24, "k"), qt("2.30", 400, 455, 24, "k"), qt("2.45", 650, 455, 24, "k")],
      say: say("Kvart över två är 2.15. Halv tre är 2.30. Kvart i tre är 2.45. Yasmin skulle gå kvart över två och kom fram halv tre.", "Kvart över två is 2:15. Halv tre is 2:30. Kvart i tre is 2:45. Yasmin was going to leave at a quarter past two and arrived at half past two.", "‏kvart över två هي 2:15، و‏halv tre هي 2:30، و‏kvart i tre هي 2:45 أي الثالثة إلّا ربعًا. كان على ياسمين أن تخرج 2:15 فوصلت 2:30.")},
    {draw: () => [A.wipe(), title("Veckodagarna", "The days of the week", "أيام الأسبوع"), ...DAYS.map((d, i) => A.tx(d, i < 4 ? 250 : 560, 140 + (i % 4) * 70, 40, d === "lördag" ? "r" : "b")),
      A.tx("Monday, Tuesday …", 400, 440, 30, "k"), qt(L(t3("engelska: stor bokstav · svenska: liten bokstav", "English: capital letter · Swedish: small letter", "الإنجليزية: حرف كبير · السويدية: حرف صغير")), 400, 478, 22, "k")],
      say: say("Veckan har sju dagar: måndag, tisdag, onsdag, torsdag, fredag, lördag och söndag. På svenska skriver man dem med liten bokstav. Kalaset är på lördag.", "The week has seven days. In Swedish you write them with a small letter. The party is on Saturday, lördag.", "في الأسبوع سبعة أيام: måndag (الاثنين)، tisdag (الثلاثاء)، onsdag (الأربعاء)، torsdag (الخميس)، fredag (الجمعة)، lördag (السبت)، söndag (الأحد). في السويدية تُكتب بحرف صغير.")}],
  read: [
    {q: "Vad ligger i kuvertet?", o: ["En inbjudan till Leos kalas", "Ett brev från farmor", "En present"], why: "Del 1: I kuvertet ligger en inbjudan."},
    {q: "Hur gammal blir Leo?", o: ["Tio år", "Nio år", "Elva år"], why: "Del 1: Jag fyller tio år."},
    {q: "Vilken dag är kalaset?", o: ["Lördag", "Fredag", "Söndag"], why: "Del 1: Lördag klockan halv tre."},
    {q: "Vad köper Yasmin till Leo?", o: ["En bok om hundar", "En boll", "Ett nytt koppel"], why: "Del 3: en bok om hundar."},
    {q: "Var hittar Yasmin sin sko?", o: ["Under soffan", "I garderoben", "På hyllan"], why: "Del 4: under soffan."},
    {q: "Varför springer Yasmin hela vägen?", o: ["Hon är sen och vill komma i tid.", "Hon tycker om att springa.", "Kexi springer efter henne."], why: "Del 4: Klockan är redan kvart över två när hon hittar skon."}],
  gram(lv, write): Problem {
    if (lv === 1 && !write && Math.random() < .35) {
      const i = Math.floor(Math.random() * 7), after = Math.random() < .5, right = DAYS[after ? (i + 1) % 7 : (i + 6) % 7];
      const opts = shuffle([right, ...shuffle(DAYS.filter(d => d !== right && d !== DAYS[i])).slice(0, 2)]);
      return {kind: "choice", opts, ans: opts.indexOf(right), show: right, q: [A.wipe(), A.tx(L(after ? t3("Vilken dag kommer efter", "Which day comes after", "أي يوم يأتي بعد") : t3("Vilken dag kommer före", "Which day comes before", "أي يوم يأتي قبل")), 400, 130, 36, "b"), A.tx(DAYS[i] + "?", 400, 240, 60, "o")],
        sol: [A.tx(DAYS.join(" · "), 400, 420, 22, "g")], hint: {say: t3("Säg dagarna i ordning: måndag, tisdag, onsdag …", "Say the days in order: måndag, tisdag, onsdag …", "قل الأيام بالترتيب: måndag، tisdag، onsdag …"), draw: []}};
    }
    const h = Math.floor(Math.random() * 12) + 1, ms = lv === 0 ? [0, 30] : [0, 15, 30, 45], m = pick(ms), right = timeSv(h, m);
    const q: Draw[] = [A.wipe(), A.tx(L(t3("Vad är klockan?", "What time is it?", "كم الساعة؟")), 400, 56, 34, "b"), ...clock(400, 250, 140, h, m)];
    const sol: Draw[] = [A.tx(`${right}  (${digital(h, m)})`, 400, 450, 34, "g")];
    const hint = {say: t3("Den korta röda visaren visar timmen. Den långa blå visar minuterna. Halv tre är 2.30.", "The short red hand shows the hour. The long blue one shows the minutes. Halv tre is 2:30.", "العقرب الأحمر القصير يبيّن الساعة، والأزرق الطويل يبيّن الدقائق. ‏halv tre هي 2:30."), draw: []};
    if (write || lv === 2) return {kind: "text", ans: m === 0 ? [right, NUM[h]] : [right, "klockan " + right], show: right, q, sol, hint};
    const wrongs = [...new Set([m === 30 ? "halv " + NUM[h] : "", timeSv(h, (m + 30) % 60), timeSv(h % 12 + 1, m), timeSv(h, (m + 15) % 60)])].filter(x => x && x !== right);
    const opts = shuffle([right, ...(m === 30 ? [wrongs[0], pick(wrongs.slice(1))] : shuffle(wrongs).slice(0, 2))]);
    return {kind: "choice", opts, ans: opts.indexOf(right), show: right, q, sol, hint};
  },
  help: [{say: t3("Kvart över två är 2.15. Halv tre är 2.30. Kvart i tre är 2.45.", "Kvart över två is 2:15. Halv tre is 2:30. Kvart i tre is 2:45.", "‏kvart över två هي 2:15، وhalv tre هي 2:30، وkvart i tre هي 2:45."),
    draw: () => [A.tx("2.15 kvart över två", 400, 170, 42, "b"), A.tx("2.30 halv tre", 400, 260, 42, "r"), A.tx("2.45 kvart i tre", 400, 350, 42, "g")]}]});

/* =====================================================================
   unit 12: Sommarlov på landet (oregelbundna verb i preteritum)
   ===================================================================== */
word("bondgard", {sv: "bondgård (en)", m: "bondgård(en|ar|arna)?", d: t3("Ett ställe på landet med djur och åkrar.", "A place in the countryside with animals and fields; farm.", "مكان في الريف فيه حيوانات وحقول؛ مزرعة."), ex: "Morfar har en bondgård.", tr: {en: "farm", ar: "مزرعة"}, syn: ["gård"], wrong: ["affär", "skola"], gap: ["Leos morfar har en", "bondgård", "på landet."], gapForm: "bondgård", form: "en bondgård – bondgårdar"});
word("ko", {sv: "ko (en)", m: "ko(n|r|rna)?", d: t3("Ett stort djur som ger oss mjölk.", "A big animal that gives us milk.", "حيوان كبير يعطينا الحليب؛ بقرة."), ex: "Kon står i hagen.", tr: {en: "cow", ar: "بقرة"}, wrong: ["häst", "hund"], gap: ["En", "ko", "slickade henne på handen."], gapForm: "ko", form: "en ko – kor"});
word("hast", {sv: "häst (en)", m: "häst(en|ar|arna)?", d: t3("Ett stort djur som man kan rida på.", "A big animal you can ride on.", "حيوان كبير يمكن ركوبه؛ حصان."), ex: "Hästen äter hö.", tr: {en: "horse", ar: "حصان"}, wrong: ["ko", "katt"], gap: ["Barnen fick rida på en", "häst", "."], gapForm: "häst", form: "en häst – hästar"});
word("ho", {sv: "hö (ett)", m: "hö(et)?", d: t3("Torkat gräs som djuren äter på vintern.", "Dried grass that animals eat in winter.", "عشب مجفّف تأكله الحيوانات في الشتاء؛ تبن."), ex: "Korna äter hö.", tr: {en: "hay", ar: "تبن"}, wrong: ["snö", "mjölk"], gap: ["De hämtade", "hö", "till djuren."], gapForm: "hö", form: "hö – höet"});
word("traktor", {sv: "traktor (en)", m: "traktor(n|er|erna)?", d: t3("Ett stort och starkt fordon som man kör på en bondgård.", "A big, strong vehicle you drive on a farm.", "مركبة كبيرة وقوية نقودها في المزرعة؛ جرّار."), ex: "Morfar kör traktorn.", tr: {en: "tractor", ar: "جرّار"}, wrong: ["cykel", "buss"], gap: ["Morfar körde", "traktorn", "ut på fältet."], gapForm: "traktorn", form: "en traktor – traktorer"});
word("ladugard", {sv: "ladugård (en)", m: "ladugård(en|ar|arna)?", d: t3("Ett hus där korna bor på en bondgård.", "A building where the cows live on a farm; cowshed, barn.", "مبنى تعيش فيه الأبقار في المزرعة؛ حظيرة."), ex: "Korna står i ladugården.", tr: {en: "cowshed, barn", ar: "حظيرة"}, syn: ["lagård"], wrong: ["garderob", "kök"], gap: ["De gick till", "ladugården", "för att mjölka."], gapForm: "ladugården", form: "en ladugård – ladugårdar"});
word("hage", {sv: "hage (en)", m: "hag(e|en|ar|arna)", d: t3("En äng med staket runt, där djuren går ute.", "A field with a fence round it where animals are outside; paddock.", "مرعى محاط بسياج تبقى فيه الحيوانات في الخارج."), ex: "Hästarna går i hagen.", tr: {en: "paddock, pasture", ar: "مرعى مُسيَّج"}, syn: ["inhägnad"], wrong: ["skog", "stig"], gap: ["Korna gick i", "hagen", "."], gapForm: "hagen", form: "en hage – hagar"});
word("mjolka", {sv: "mjölka", m: "mjölka(r|de|t)?", d: t3("Ta mjölk från en ko.", "Take milk from a cow.", "أن تأخذ الحليب من البقرة؛ يحلب."), ex: "Morfar mjölkar korna varje morgon.", tr: {en: "milk (a cow)", ar: "يحلب"}, wrong: ["mata", "rida"], gap: ["De gick upp tidigt för att", "mjölka", "korna."], gapForm: "mjölka", form: "mjölka – mjölkade"});
word("sv4oregelbunden", {sv: "oregelbundet verb", m: "oregelbundna? verb(et|en)?", d: t3("Ett verb som ändrar sig mycket i preteritum: gå – gick.", "A verb that changes a lot in the past tense: gå – gick.", "فعل يتغيّر كثيرًا في الماضي: gå – gick؛ فعل شاذّ."), ex: "se – såg, ta – tog", tr: {en: "irregular verb", ar: "فعل شاذّ"}});

const cow = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="0" width="8" height="26" fill="#5b4636"/><rect x="-14" y="0" width="8" height="26" fill="#5b4636"/><rect x="10" y="0" width="8" height="26" fill="#5b4636"/><rect x="26" y="0" width="8" height="26" fill="#5b4636"/><rect x="-40" y="-30" width="80" height="40" rx="16" fill="#fff" stroke="#5b4636" stroke-width="2"/><circle cx="-14" cy="-18" r="9" fill="#1d2433"/><circle cx="18" cy="-4" r="8" fill="#1d2433"/><ellipse cx="50" cy="-30" rx="16" ry="14" fill="#fff" stroke="#5b4636" stroke-width="2"/><ellipse cx="58" cy="-24" rx="9" ry="6" fill="#f1a7b5"/><circle cx="46" cy="-34" r="2" fill="#1d2433"/><path d="M40 -44 l-4 -8 M58 -44 l4 -8" stroke="#c9a77c" stroke-width="4"/></g>`;
const horse = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-36" y="0" width="8" height="34" fill="#7a4520"/><rect x="-20" y="0" width="8" height="34" fill="#7a4520"/><rect x="16" y="0" width="8" height="34" fill="#7a4520"/><rect x="30" y="0" width="8" height="34" fill="#7a4520"/><rect x="-42" y="-30" width="86" height="38" rx="18" fill="#9a5c2c"/><path d="M30 -24 L52 -64 L70 -56 L52 -18Z" fill="#9a5c2c"/><path d="M34 -30 L50 -66" stroke="#3b2a1e" stroke-width="6"/><circle cx="58" cy="-56" r="2.4" fill="#1d2433"/><path d="M-42 -20 Q-60 -10 -54 16" stroke="#3b2a1e" stroke-width="6" fill="none"/><text x="-4" y="-34" font-size="16">⭐</text></g>`;
const tractor = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-50" y="-40" width="70" height="40" rx="4" fill="#d63b2f"/><rect x="-10" y="-80" width="40" height="44" fill="#d63b2f" stroke="#fff" stroke-width="3"/><rect x="-4" y="-74" width="28" height="22" fill="#bfe0f5"/><circle cx="-34" cy="6" r="20" fill="#1d2433"/><circle cx="-34" cy="6" r="8" fill="#c6cfdc"/><circle cx="16" cy="10" r="14" fill="#1d2433"/><circle cx="16" cy="10" r="5" fill="#c6cfdc"/><rect x="-48" y="-58" width="6" height="20" fill="#5b6b82"/></g>`;
const barn = `<path d="M30 130 L110 80 L190 130 V240 H30Z" fill="#c0392b"/><path d="M30 130 L110 80 L190 130" stroke="#fff" stroke-width="5" fill="none"/><rect x="85" y="170" width="50" height="70" fill="#fff"/><path d="M85 170 L135 240 M135 170 L85 240" stroke="#c0392b" stroke-width="4"/>`;
const fence = (y: number) => `<path d="M0 ${y} H300 M0 ${y + 18} H300" stroke="#8d6440" stroke-width="4"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${10 + i * 46}" y="${y - 10}" width="6" height="40" fill="#8d6440"/>`).join("")}`;
const farmBg = (body: string) => pic(`<rect width="300" height="300" fill="#bfe0f5"/><circle cx="250" cy="50" r="24" fill="#f2c200"/><rect y="210" width="300" height="90" fill="#8fcf7a"/>${body}`);
const G6 = [
  farmBg(`${barn}${cow(240, 220, .7)}${horse(240, 160, .55)}<rect x="196" y="236" width="60" height="30" fill="#8fcf7a"/>`),
  pic(`<rect width="300" height="300" fill="#e8d5b5"/><rect y="230" width="300" height="70" fill="#d8c08a"/>${cow(150, 190, 1.3)}<rect x="40" y="246" width="40" height="10" fill="#8d6440"/>${yas(60, 170, .55)}<path d="M120 236 h30 v24 h-30z" fill="#c6cfdc"/><rect x="120" y="236" width="30" height="8" fill="#fff"/>${adult(250, 120, "#2a7d9c", "#c6cfdc", .6)}`),
  farmBg(`${fence(196)}${horse(150, 210, 1.2)}${leo(160, 110, .5)}${yas(60, 180, .55)}${dog(250, 268, .5)}`),
  farmBg(`<path d="M0 230 H300 V300 H0Z" fill="#e7c86a"/>${tractor(130, 230, 1.2)}<path d="M180 246 q30 -30 70 -10 q30 14 10 30 h-80z" fill="#e2c35b" stroke="#c9a540" stroke-width="2"/>${kid(150, 120, "#2a7d9c", "#c6cfdc", .38)}`),
  farmBg(`${fence(196)}${cow(120, 220, 1)}${yas(220, 160, .7)}<text x="190" y="140" font-size="26">💛</text>`)];

const IRR: [string, string, string, string, string][] = [
  ["gå", "går", "gick", "gådde", "Första morgonen {v} de upp klockan fem."], ["se", "ser", "såg", "sedde", "I hagen {v} Yasmin tre kor."], ["sitta", "sitter", "satt", "sittade", "Barnen {v} bredvid morfar i traktorn."], ["få", "får", "fick", "fådde", "Efter frukost {v} barnen rida."],
  ["ta", "tar", "tog", "tade", "Morfar {v} fram en liten pall."], ["springa", "springer", "sprang", "springade", "Kexi {v} efter hästen."], ["ligga", "ligger", "låg", "liggade", "På kvällen {v} de i höet."], ["komma", "kommer", "kom", "kommade", "En ko {v} fram till Yasmin."],
  ["sova", "sover", "sov", "sovde", "Yasmin {v} gott hela natten."], ["äta", "äter", "åt", "ätade", "Hästen {v} hö ur handen."], ["dricka", "dricker", "drack", "drickade", "Kalven {v} mjölk."], ["vara", "är", "var", "varde", "Mjölken {v} varm."], ["rida", "rider", "red", "ridde", "Leo {v} först."], ["skriva", "skriver", "skrev", "skrivade", "Yasmin {v} ett brev till farmor."]];

defineUnit({id: "sv4l", year: 4, ord: 12, title: t3("Sommarlov på landet", "Summer holiday in the country", "العطلة الصيفية في الريف"), storyTitle: "Sommarlov på landet",
  icon: icon("#bfe0f5", `<circle cx="280" cy="36" r="22" fill="#f2c200"/><rect y="120" width="320" height="60" fill="#8fcf7a"/><path d="M30 80 L90 44 L150 80 V140 H30Z" fill="#c0392b"/><rect x="70" y="100" width="40" height="40" fill="#fff"/>${cow(230, 130, .7)}`, "Muu!", "#c0392b"),
  words: ["bondgard", "ko", "hast", "ho", "traktor", "ladugard", "hage", "mjolka"], terms: ["sv4oregelbunden"],
  story: [
    {text: ["I somras var Yasmin på landet i en vecka. Hon åkte med Leo och Kexi till Leos morfar. Han har en bondgård.", "Där fanns tre kor, två hästar och en gammal traktor. Yasmin hade räknat dagarna i kalendern hela våren."],
      pic: G6[0], say: say("Nu är det sommar! Den här berättelsen handlar om något som har hänt. Den är skriven i preteritum.", "Now it's summer! This story is about something that has happened. It is written in the past tense.", "الآن صار صيفًا! هذه القصة عن شيء حدث من قبل، وهي مكتوبة بزمن الماضي.")},
    {text: ["Första morgonen gick de upp klockan fem. De gick till ladugården för att mjölka korna.", "Morfar visade hur man gör. Yasmin satt på en liten pall. Mjölken var varm!"],
      pic: G6[1], say: say("Gick, satt och var är verb i preteritum. De säger vad som hände.", "Gick, satt and var are verbs in the past tense. They say what happened.", "‏gick وsatt وvar أفعال في زمن الماضي. إنها تقول ماذا حدث.")},
    {text: ["Efter frukost fick barnen rida på en häst som hette Stjärna. Leo red först. Yasmin var lite nervös, men det gick bra.", "Kexi sprang efter dem och skällde."],
      pic: G6[2], say: say("Varför var Yasmin nervös, tror du?", "Why do you think Yasmin was nervous?", "لماذا تظن أن ياسمين كانت متوترة؟")},
    {text: ["En dag körde morfar traktorn ut på fältet. Barnen satt bredvid honom. De hämtade hö till djuren, och Kexi letade efter möss.", "På kvällen låg Yasmin och Leo i höet och tittade på stjärnorna."],
      pic: G6[3], say: say("Vad gjorde barnen med traktorn?", "What did the children do with the tractor?", "ماذا فعل الأطفال بالجرّار؟")},
    {text: ["Sista dagen sa Yasmin hej då till djuren i hagen. En ko kom fram och slickade henne på handen.", "”Jag längtar redan tillbaka”, sa hon. Morfar log. ”Du är välkommen nästa sommar också.”"],
      pic: G6[4], say: say("Hur kändes det för Yasmin att åka hem? Läs vad hon säger.", "How did Yasmin feel about going home? Read what she says.", "كيف شعرت ياسمين بالعودة إلى البيت؟ اقرأ ما قالته.")}],
  wordsSay: say("Nya ord från bondgården. Tryck på dem.", "New words from the farm. Tap them.", "كلمات جديدة من المزرعة. اضغط عليها."),
  grammar: [
    {draw: () => [A.wipe(), title("Preteritum: det hände förut", "Past tense: it happened before", "الماضي: حدث من قبل", 34), qt(L(t3("vanliga verb: + de", "regular verbs: + de", "الأفعال القياسية: + de")), 210, 120, 26, "b"), qt(L(t3("oregelbundna verb", "irregular verbs", "الأفعال الشاذّة")), 590, 120, 26, "r"),
      A.p(R.line(400, 100, 400, 430, .3), "k", 2), ...[["mjölka", "mjölkade"], ["titta", "tittade"], ["visa", "visade"]].flatMap(([a, b], j) => [A.tx(`${a} → ${b}`, 210, 200 + j * 90, 34, "b")]),
      ...[["gå", "gick"], ["sitta", "satt"], ["vara", "var"]].flatMap(([a, b], j) => [A.tx(`${a} → ${b}`, 590, 200 + j * 90, 36, "r")])],
      say: say("Många verb får -de i preteritum: mjölka – mjölkade. Men några verb ändrar sig mycket: gå – gick, sitta – satt. De kallas oregelbundna.", "Many verbs get -de in the past: mjölka – mjölkade. But some verbs change a lot: gå – gick, sitta – satt. They are called irregular.", "أفعال كثيرة تأخذ ‎-de في الماضي: mjölka – mjölkade. لكن بعض الأفعال تتغيّر كثيرًا: gå – gick وsitta – satt، وتسمّى أفعالًا شاذّة.")},
    {draw: () => { const rows = [["se", "såg"], ["få", "fick"], ["ta", "tog"], ["springa", "sprang"], ["ligga", "låg"], ["komma", "kom"]];
      return [A.wipe(), title("Från berättelsen", "From the story", "من القصة"), qt(L(t3("nu", "now", "الآن")), 250, 112, 26, "b"), qt(L(t3("förut (preteritum)", "before (past)", "من قبل (الماضي)")), 550, 112, 26, "r"),
        ...rows.flatMap(([a, b], j) => [A.tx(a, 250, 170 + j * 55, 36, "b"), A.arrow(330, 158 + j * 55, 460, 158 + j * 55, "k"), A.tx(b, 550, 170 + j * 55, 36, "r")]), A.hl(490, 356, 120, 100)]; },
      say: say("De här verben finns i berättelsen. Ofta byter de bara en vokal: ligga – låg, komma – kom. Lär dig dem två och två.", "These verbs are in the story. Often they just change a vowel: ligga – låg, komma – kom. Learn them in pairs.", "هذه الأفعال موجودة في القصة. غالبًا يتغيّر فيها حرف علّة فقط: ligga – låg وkomma – kom. احفظها زوجًا زوجًا.")},
    {draw: () => [A.wipe(), title("Andra språk har dem också", "Other languages have them too", "في اللغات الأخرى أيضًا", 34), A.tx("gå – gick · se – såg", 400, 160, 44, "r"),
      A.tx("go – went · see – saw", 400, 260, 38, "k"), qt(L(t3("engelska: också oregelbundna", "English: irregular too", "الإنجليزية: شاذّة أيضًا")), 400, 300, 24, "k"),
      A.tx("يذهب – ذهب · يرى – رأى", 400, 390, 40, "o"), qt(L(t3("arabiska: verbet ändrar form i dåtid", "Arabic: the verb changes form in the past", "العربية: يتغيّر شكل الفعل في الماضي")), 400, 436, 24, "o")],
      say: say("Engelska har också oregelbundna verb: go – went, see – saw. På arabiska ändrar verbet också form. Lär dig formerna utantill, lite i taget.", "English has irregular verbs too: go – went, see – saw. In Arabic the verb also changes form. Learn the forms by heart, a few at a time.", "في الإنجليزية أيضًا أفعال شاذّة: go – went وsee – saw. وفي العربية يتغيّر شكل الفعل كذلك: يذهب ← ذهب، يرى ← رأى. احفظ الصيغ شيئًا فشيئًا.")}],
  read: [
    {q: "Vems bondgård åkte Yasmin till?", o: ["Leos morfars", "Farmors", "Karins"], why: "Del 1: Leos morfar. Han har en bondgård."},
    {q: "Vad gjorde de i ladugården första morgonen?", o: ["De mjölkade korna.", "De red på hästen.", "De körde traktor."], why: "Del 2: De gick till ladugården för att mjölka korna."},
    {q: "Vad hette hästen?", o: ["Stjärna", "Kexi", "Måne"], why: "Del 3: en häst som hette Stjärna."},
    {q: "Vad hämtade de med traktorn?", o: ["Hö till djuren", "Mjölk", "Ved"], why: "Del 4: De hämtade hö till djuren."},
    {q: "Vad gjorde kon den sista dagen?", o: ["Den slickade Yasmin på handen.", "Den sprang iväg.", "Den åt Yasmins mössa."], why: "Del 5: En ko kom fram och slickade henne på handen."},
    {q: "Hur kändes det för Yasmin att åka hem?", o: ["Hon ville gärna komma tillbaka.", "Hon var glad att slippa djuren.", "Hon var arg på Leo."], why: "Del 5: ”Jag längtar redan tillbaka.”"}],
  gram(lv, write): Problem {
    const [inf, pres, past, fake, frame] = pick(lv === 0 ? IRR.slice(0, 8) : IRR), q = frame.replace("{v}", "____"), done = frame.replace("{v}", past);
    const head: Draw[] = [A.wipe(), A.tx(L(t3("Skriv verbet i preteritum", "Write the verb in the past tense", "اكتب الفعل في زمن الماضي")), 400, 70, 34, "b"), ...svLines(q, 200, 40), A.tx(`(${inf})`, 400, 310, 36, "o")];
    const sol: Draw[] = [A.tx(done, 400, 420, 36, "g"), qt(`${inf} – ${past}`, 400, 465, 26, "g")];
    const hint = {say: t3(`Det hände förut. ${inf} är oregelbundet. Tänk på berättelsen.`, `It happened before. ${inf} is irregular. Think of the story.`, `حدث ذلك من قبل. الفعل ${inf} شاذّ. فكّر في القصة.`), draw: []};
    if (write || lv === 2) return {kind: "text", ans: [past], show: past, q: head, sol, hint};
    const opts = shuffle([past, pres, fake]);
    return {kind: "choice", opts, ans: opts.indexOf(past), show: past, q: head, sol, hint};
  },
  help: [{say: t3("Oregelbundna verb: gå – gick, se – såg, sitta – satt, ta – tog.", "Irregular verbs: gå – gick, se – såg, sitta – satt, ta – tog.", "أفعال شاذّة: gå – gick، se – såg، sitta – satt، ta – tog."),
    draw: () => [A.tx("gå – gick", 260, 190, 44, "r"), A.tx("se – såg", 540, 190, 44, "r"), A.tx("sitta – satt", 260, 300, 44, "r"), A.tx("ta – tog", 540, 300, 44, "r")]}]});
}

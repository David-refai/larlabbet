import {defineUnit, word, t3, L, A, R, qt, pick, shuffle, svLines, boxes, pic, kid} from "../svenska/unit";
import type {Draw, Problem, T3} from "../svenska/unit";
/* Svenska årskurs 9, units 1–6 (class 9B at Björkskolan in Hagaby, teacher Lena; Amir and Sara from year 7):
   Sista året (satsdelar), Utredningen: Ska skolan börja senare? (utredande text), Novellen: Tåget (berättarperspektiv),
   Källan i reklamen (etos, patos, logos), Personligt brev till gymnasiet (formellt brev), Dialekter i Sverige (variation).
   The year ends with choosing a gymnasium programme, so every story points towards that choice. */
{
/* ---------- shared pictures ---------- */
const AMIR = "#2a7d9c", AMIRH = "#2b1d14", SARA = "#d35f8d", SARAH = "#5b4636", LENA = "#7b5ea7", LENAH = "#c98e4a";
const ELSA = "#e0b43a", ELSAH = "#8a5a2b", NOAH = "#2f8a4a", NOAHH = "#3b2a1e", MONA = "#c0603a", MONAH = "#1d2433";
const T = (sv: string, en: string, ar: string) => L(t3(sv, en, ar));
const icon = (body: string, bg: string) => `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="${bg}"/>${body}</svg>`;
const floor = (y: number, c = "#d9c7a8") => `<rect y="${y}" width="300" height="${300 - y}" fill="${c}"/>`;
const hand = (s: string, x: number, y: number, z = 28, c = "#1d2433") => `<text x="${x}" y="${y}" font-family="Caveat,cursive" font-weight="700" font-size="${z}" text-anchor="middle" fill="${c}">${s}</text>`;
const board = (t: string, x = 26, y = 30, w = 248, h = 124) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#fff" stroke="#8d6440" stroke-width="6"/>${t}`;
const desk = (x: number, y: number, w = 84) => `<rect x="${x}" y="${y}" width="${w}" height="10" rx="4" fill="#c79a63"/><rect x="${x + 5}" y="${y + 10}" width="6" height="34" fill="#9b7544"/><rect x="${x + w - 11}" y="${y + 10}" width="6" height="34" fill="#9b7544"/>`;
const paper = (x: number, y: number, r = 0, n = 4, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><rect x="-34" y="-46" width="68" height="92" rx="3" fill="#fff" stroke="#9aa4b5" stroke-width="2"/>${[...Array(n)].map((_, i) => `<path d="M-24 ${-30 + i * 20} h48" stroke="#9aa8c4" stroke-width="3"/>`).join("")}</g>`;
const bubble = (x: number, y: number, w: number, s: string, z = 24, c = "#1d2433") => `<g><rect x="${x - w / 2}" y="${y - 26}" width="${w}" height="46" rx="14" fill="#fff" stroke="#9aa4b5" stroke-width="2"/><path d="M${x - 10} ${y + 18} l6 16 l14 -16Z" fill="#fff" stroke="#9aa4b5" stroke-width="2"/>${hand(s, x, y + 6, z, c)}</g>`;
const phone = (x: number, y: number, s = 1, scr = "#dceefa") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="-46" width="52" height="92" rx="9" fill="#33415c"/><rect x="-21" y="-39" width="42" height="74" rx="3" fill="${scr}"/></g>`;
const poster = (x: number, y: number, title: string, bg = "#f2c94c", w = 84) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="-54" width="${w}" height="108" rx="4" fill="${bg}" stroke="#b8860b" stroke-width="2"/>${hand(title, 0, -16, 22, "#1d2433")}<path d="M${-w / 2 + 14} 6 h${w - 28} M${-w / 2 + 14} 24 h${w - 28} M${-w / 2 + 14} 42 h${w - 40}" stroke="#1d2433" stroke-width="3" opacity=".45"/></g>`;
const bus = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-80" y="-56" width="160" height="70" rx="12" fill="#1f6fb0"/><rect x="-70" y="-46" width="40" height="26" rx="3" fill="#dceefa"/><rect x="-24" y="-46" width="40" height="26" rx="3" fill="#dceefa"/><rect x="22" y="-46" width="30" height="40" rx="3" fill="#dceefa"/><rect x="-80" y="-10" width="160" height="7" fill="#f2c94c"/><circle cx="-46" cy="18" r="13" fill="#33415c"/><circle cx="46" cy="18" r="13" fill="#33415c"/></g>`;
const train = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-110" y="-62" width="220" height="74" rx="16" fill="#9aa4b5"/><rect x="-110" y="-30" width="220" height="10" fill="#d63b2f"/>${[0, 1, 2, 3].map(i => `<rect x="${-96 + i * 50}" y="${-52}" width="36" height="20" rx="3" fill="#dceefa"/>`).join("")}<rect x="-30" y="-14" width="26" height="26" rx="3" fill="#33415c"/><circle cx="-70" cy="18" r="11" fill="#33415c"/><circle cx="-34" cy="18" r="11" fill="#33415c"/><circle cx="52" cy="18" r="11" fill="#33415c"/></g>`;
const mapSE = (x: number, y: number, s = 1, c = "#7cc08a") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M8 -120 q26 16 18 54 q-8 34 6 56 q16 24 2 54 q-14 30 -40 34 q-26 4 -32 -26 q-6 -30 -14 -54 q-10 -30 4 -58 q14 -28 22 -42 q10 -18 34 -18Z" fill="${c}" stroke="#4e8a5c" stroke-width="3"/></g>`;
const tree = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-20" width="12" height="42" fill="#8d6440"/><circle cy="-44" r="30" fill="#5fae5a"/><circle cx="-20" cy="-26" r="20" fill="#4e9b51"/><circle cx="20" cy="-28" r="18" fill="#6cbd63"/></g>`;
const sun = (x: number, y: number, r = 22) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2c94c"/>`;
const clock = (x: number, y: number, s = 1, h = "M0 0 l0 -22", m = "M0 0 l18 0") => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="34" fill="#fff" stroke="#33415c" stroke-width="5"/><path d="${h}" stroke="#1d2433" stroke-width="5" stroke-linecap="round"/><path d="${m}" stroke="#d63b2f" stroke-width="4" stroke-linecap="round"/><circle r="4" fill="#1d2433"/></g>`;
const sad = (x: number, y: number, shirt: string, hair: string, s = 1) => kid(x, y, shirt, hair, s) + `<path d="M${x - 6 * s} ${y + 11 * s} Q${x} ${y + 15 * s} ${x + 6 * s} ${y + 11 * s}" stroke="#f1c7a3" stroke-width="${4 * s}" fill="none"/><path d="M${x - 6 * s} ${y + 14 * s} Q${x} ${y + 9 * s} ${x + 6 * s} ${y + 14 * s}" stroke="#1d2433" stroke-width="${2 * s}" fill="none" stroke-linecap="round"/>`;
const adult = (x: number, y: number, shirt: string, hair: string, s = 1.15) => kid(x, y, shirt, hair, s);
/* a choice problem with three distinct options, the right one first */
const choice = (opts3: string[], show: string, q: Draw[], sol: Draw[], hint: T3): Problem => {
  const o = shuffle(opts3.slice());
  return {kind: "choice", opts: o, ans: o.indexOf(opts3[0]), show, q, sol, hint: {say: hint, draw: []}};
};
const head = (t: T3): Draw[] => [A.wipe(), A.tx(L(t), 400, 76, 34, "b")];

/* =============== unit 1: Sista året (satsdelar) =============== */
word("gymnasium", {sv: "gymnasium (ett)", m: "gymnasi(um|et|er|erna|e)", d: t3("Skolan man går i efter nian, i tre år.", "The school you go to after year 9, for three years.", "المدرسة التي تُدرس فيها بعد الصف التاسع، لمدة ثلاث سنوات."), ex: "Sara ska söka ett gymnasium i stan.", tr: {en: "upper secondary school", ar: "المرحلة الثانوية"}, syn: ["gymnasieskola"], wrong: ["förskola", "universitet"], gap: ["Efter nian börjar man på ett", "gymnasium", "."], gapForm: "gymnasium", form: "ett gymnasium – gymnasier"});
word("program9", {sv: "program (ett)", m: "program(met|men|mens)?", d: t3("En inriktning på gymnasiet, till exempel teknik eller samhällsvetenskap.", "A track at upper secondary school, for example technology or social science.", "تخصص في الثانوية، مثل التقنية أو العلوم الاجتماعية."), ex: "Hon valde det naturvetenskapliga programmet.", tr: {en: "programme, track", ar: "برنامج دراسي"}, syn: ["inriktning"], wrong: ["betyg", "lektion"], gap: ["Amir vet inte vilket", "program", "han ska söka."], gapForm: "program", form: "ett program – program"});
word("behorighet", {sv: "behörighet (en)", m: "behörighet(en|er|erna)?", d: t3("Att man har de godkända betyg som krävs för att få söka.", "Having the passing grades that are needed to be allowed to apply.", "أن تكون لديك الدرجات المطلوبة التي تسمح لك بالتقديم."), ex: "Utan behörighet kommer man inte in.", tr: {en: "eligibility, qualification", ar: "استحقاق القبول"}, syn: ["rätt att söka"], wrong: ["frånvaro", "schema"], gap: ["Du måste ha", "behörighet", "för att söka programmet."], gapForm: "behörighet", form: "en behörighet – behörigheter"});
word("merit", {sv: "merit (en)", m: "merit(en|er|erna|värde(t|n|na)?|poäng(en)?)?", d: t3("Något som räknas till din fördel när du söker, till exempel betyg.", "Something that counts in your favour when you apply, for example grades.", "شيء يُحسب لصالحك عند التقديم، مثل الدرجات."), ex: "Ditt meritvärde är dina betyg räknade som poäng.", tr: {en: "merit, credit", ar: "نقاط الجدارة"}, syn: ["poäng"], wrong: ["ansvar", "rykte"], gap: ["Betygen räknas om till ett", "meritvärde", "."], gapForm: "meritvärde", form: "en merit – meriter"});
word("studievagledare", {sv: "studievägledare (en)", m: "studievägledar(e|en|ens|na)", d: t3("Den på skolan som hjälper elever att välja utbildning.", "The person at school who helps pupils choose what to study.", "الشخص في المدرسة الذي يساعد الطلاب في اختيار دراستهم."), ex: "Studievägledaren Mona kom till 9B.", tr: {en: "careers counsellor", ar: "مرشد دراسي"}, syn: ["syv"], wrong: ["rektor", "vaktmästare"], gap: ["Klassen fick besök av en", "studievägledare", "."], gapForm: "studievägledare", form: "en studievägledare – studievägledare"});
word("osaker", {sv: "osäker", m: "osäk(er|ert|ra|rare|rast)", d: t3("Inte säker; man vet inte vad man ska välja eller tro.", "Not sure; you don't know what to choose or believe.", "غير متأكد؛ لا تعرف ماذا تختار أو تعتقد."), ex: "Amir var osäker på vilket program han ville söka.", tr: {en: "unsure, uncertain", ar: "غير متأكد"}, syn: ["tveksam"], opp: ["säker"], wrong: ["glad", "hungrig"], gap: ["Han var fortfarande", "osäker", "på sitt val."], gapForm: "osäker", form: "osäker – osäkert – osäkra"});
word("sjalvstandig", {sv: "självständig", m: "självständig(t|a|are|ast)?", d: t3("Som klarar saker själv och tar egna beslut.", "Able to manage things yourself and make your own decisions.", "قادر على تدبير أموره بنفسه واتخاذ قراراته."), ex: "På gymnasiet måste man vara självständig.", tr: {en: "independent", ar: "مستقل"}, syn: ["ansvarsfull"], opp: ["beroende av andra"], wrong: ["ledsen", "snabb"], gap: ["I nian ska eleverna arbeta mer", "självständigt", "."], gapForm: "självständigt", form: "självständig – självständigt – självständiga"});
word("mal9", {sv: "mål (ett)", m: "mål(et|en|ens)?", d: t3("Något man bestämmer sig för att nå.", "Something you decide to reach.", "شيء تقرر أن تصل إليه."), ex: "Mitt mål är att plugga engelska varje tisdag.", tr: {en: "goal, aim", ar: "هدف"}, syn: ["syfte"], wrong: ["minne", "tvivel"], gap: ["Lena bad dem skriva tre", "mål", "för året."], gapForm: "mål", form: "ett mål – mål"});
word("satsdel9", {sv: "satsdel", m: "satsdel(en|ar|arna)?", d: t3("En del av en mening som har en egen uppgift: subjekt, predikat, objekt, adverbial.", "A part of a sentence with its own job: subject, predicate, object, adverbial.", "جزء من الجملة له وظيفته: الفاعل والفعل والمفعول والظرف."), ex: "Amir (subjekt) väljer (predikat) ett program (objekt).", tr: {en: "sentence part", ar: "عنصر في الجملة"}});
word("subjekt9", {sv: "subjekt", m: "subjekt(et|en)?", d: t3("Den eller det som gör något i meningen. Fråga: vem eller vad?", "The one who or that which does something in the sentence. Ask: who or what?", "من أو ما الذي يقوم بالفعل في الجملة. اسأل: من أو ما؟"), ex: "Amir väljer ett program. → Amir", tr: {en: "subject", ar: "الفاعل"}});
word("predikat9", {sv: "predikat", m: "predikat(et|en)?", d: t3("Verbet i meningen. Fråga: vad gör subjektet?", "The verb in the sentence. Ask: what does the subject do?", "الفعل في الجملة. اسأل: ماذا يفعل الفاعل؟"), ex: "Amir väljer ett program. → väljer", tr: {en: "predicate (the verb)", ar: "الفعل"}});
word("objekt9", {sv: "objekt", m: "objekt(et|en)?", d: t3("Det som verbet går ut över. Fråga: vem eller vad efter verbet?", "The thing the verb acts on. Ask: who or what after the verb?", "ما يقع عليه الفعل. اسأل: من أو ما بعد الفعل؟"), ex: "Amir väljer ett program. → ett program", tr: {en: "object", ar: "المفعول به"}});
word("adverbial9", {sv: "adverbial", m: "adverbial(et|en)?", d: t3("En del som säger när, var, hur eller varför.", "A part that says when, where, how or why.", "جزء يقول متى أو أين أو كيف أو لماذا."), ex: "På torsdagen kom Mona till klassen.", tr: {en: "adverbial", ar: "ظرف / شبه جملة"}});

const P9A = [
  pic(floor(214, "#cbb894") + board(hand("9B", 150, 72, 46, "#1f4fb0") + hand("sista året", 150, 118, 30, "#d63b2f")) + adult(240, 120, LENA, LENAH, 1.05) + kid(70, 206, AMIR, AMIRH, .62) + kid(140, 206, SARA, SARAH, .62), "#eaf0f7"),
  pic(floor(230, "#cbb894") + desk(44, 198, 104) + desk(168, 198, 104) + kid(96, 134, AMIR, AMIRH, .9) + kid(220, 134, SARA, SARAH, .9) + bubble(104, 60, 112, "Natur!", 24, "#1f4fb0") + hand("?", 40, 120, 44, "#d63b2f"), "#f3f0e6"),
  pic(floor(222, "#cbb894") + board(hand("behörighet", 150, 66, 30, "#1f4fb0") + hand("merit", 150, 104, 30, "#2f8a4a") + hand("program", 150, 142, 30, "#d63b2f")) + adult(72, 124, MONA, MONAH, 1.05) + kid(200, 200, NOAH, NOAHH, .66) + kid(258, 200, ELSA, ELSAH, .66), "#eef4fb"),
  pic(floor(226, "#cbb894") + desk(30, 196, 110) + paper(84, 150, -6, 4, .8) + kid(84, 96, NOAH, NOAHH, .82) + adult(216, 118, MONA, MONAH, 1) + hand("260 p?", 216, 54, 32, "#d63b2f"), "#eef4fb"),
  pic(floor(222, "#cbb894") + board(hand("3 mål", 150, 70, 38, "#2f8a4a") + hand("1. ____", 150, 112, 26) + hand("2. ____", 150, 142, 26)) + adult(66, 126, LENA, LENAH, 1.05) + sad(226, 136, ELSA, ELSAH, .95) + bubble(226, 62, 126, "överleva…", 20, "#6b5b45"), "#f1f6ec"),
  pic(floor(236, "#cbb894") + desk(40, 204, 220) + paper(110, 158, -4, 5, .95) + kid(110, 92, AMIR, AMIRH, .95) + kid(226, 104, SARA, SARAH, .82) + hand("tisdag!", 110, 44, 28, "#1f4fb0"), "#fdf6e6"),
  pic(floor(220, "#cbb894") + board(hand("självständig", 150, 92, 32, "#7b5ea7")) + adult(226, 126, LENA, LENAH, 1.05) + kid(70, 130, AMIR, AMIRH, .95) + `<path d="M96 108 q10 -26 30 -30" stroke="#1d2433" stroke-width="4" fill="none"/>`, "#f6f0fb"),
  pic(`<rect width="300" height="300" fill="#dbeaf7"/>${sun(252, 44, 24)}${floor(222, "#9aa4b5")}${tree(40, 220, .8)}${poster(96, 150, "ÖPPET HUS", "#f2c94c", 90)}${kid(206, 164, AMIR, AMIRH, .95)}${phone(242, 150, .62)}`, "#dbeaf7")];

const SATS: string[] = [
  "Amir/s|valde/p|ett program/o|till slut/a",
  "Mona/s|ritade/p|tre ord/o|på tavlan/a",
  "Lena/s|gav/p|klassen en uppgift/o|på fredagen/a",
  "Sara/s|hade bestämt/p|sitt gymnasium/o|redan i åttan/a",
  "Studievägledaren/s|tog fram/p|en låda broschyrer/o",
  "Elsa/s|suckade/p|högt/a",
  "Amir/s|skrev/p|tre mål/o|på ett papper/a",
  "Mamma/s|läste/p|lappen/o|tyst/a",
  "Hela klassen/s|jämförde/p|sina betyg/o|under rasten/a",
  "Noah/s|räckte upp/p|handen/o|direkt/a",
  "Amir/s|fotograferade/p|affischen/o|vid busshållplatsen/a",
  "Lena/s|påminner/p|ingen/o|i nian/a",
  "Sara/s|läste/p|hans mål/o|över axeln/a",
  "Yasmin/s|hittade/p|lappen/o|på kylskåpet/a"];
const SATSQ: Record<string, T3> = {
  s: t3("Vem eller vad gör något? Det är subjektet.", "Who or what does something? That is the subject.", "من أو ما الذي يفعل شيئًا؟ ذاك هو الفاعل."),
  p: t3("Vad gör subjektet? Verbet är predikatet.", "What does the subject do? The verb is the predicate.", "ماذا يفعل الفاعل؟ الفعل هو predikat."),
  o: t3("Fråga vem eller vad efter verbet. Svaret är objektet.", "Ask who or what after the verb. The answer is the object.", "اسأل من أو ما بعد الفعل. الجواب هو المفعول به."),
  a: t3("Vilken del säger när, var eller hur? Det är adverbialet.", "Which part says when, where or how? That is the adverbial.", "أي جزء يقول متى أو أين أو كيف؟ ذاك هو الظرف.")};
const SATSN: Record<string, [string, string]> = {s: ["subjektet", "b"], p: ["predikatet", "r"], o: ["objektet", "g"], a: ["adverbialet", "o"]};

defineUnit({
  id: "sv9a", year: 9, ord: 1, title: t3("Sista året", "The last year", "السنة الأخيرة"), storyTitle: "Sista året",
  icon: icon(`<rect y="128" width="320" height="52" fill="#cbb894"/><rect x="34" y="24" width="252" height="96" rx="6" fill="#fff" stroke="#8d6440" stroke-width="6"/>${hand("9B", 90, 86, 54, "#1f4fb0")}${hand("gymnasium?", 200, 80, 34, "#d63b2f")}`, "#eaf0f7"),
  words: ["gymnasium", "program9", "behorighet", "merit", "studievagledare", "osaker", "sjalvstandig", "mal9"],
  terms: ["satsdel9", "subjekt9", "predikat9", "objekt9", "adverbial9"],
  story: [
    {text: ["Det var augusti, och asfalten på skolgården var fortfarande varm. Amir gick in genom porten till Björkskolan i Hagaby med en ny ryggsäck och ett schema i fickan. På dörren till klassrummet stod det 9B.",
      "Lena stod redan vid tavlan. ”Välkomna till sista året”, sa hon. ”I juni går ni ut nian, och innan dess ska var och en av er välja ett gymnasium och ett program. Det är det största valet ni har gjort hittills.”"],
      pic: P9A[0], say: t3("Sista året i grundskolan har börjat. Vilket stort val väntar på klassen?", "The last year of compulsory school has begun. What big choice is waiting for the class?", "بدأت السنة الأخيرة في المدرسة الأساسية. أي اختيار كبير ينتظر الصف؟")},
    {text: ["Amir satte sig bredvid Sara, som han hade spelat fotboll med sedan sjuan. ”Vet du vad du ska välja?” viskade han. ”Naturvetenskap”, sa Sara direkt. ”Jag har vetat sedan åttan.”",
      "Amir kände sig plötsligt osäker. Han tyckte om teknik, om att bygga saker och om svenska, men han hade aldrig satt ett namn på det. Sara verkade ha en färdig karta. Själv hade han inte ens en penna."],
      pic: P9A[1], say: t3("Sara är säker, Amir är osäker. Vad tycker Amir om?", "Sara is sure, Amir is unsure. What does Amir like?", "سارة متأكدة وأمير غير متأكد. ما الذي يحبه أمير؟")},
    {text: ["På torsdagen kom studievägledaren Mona till klassen med en låda broschyrer. ”Jag ska inte bestämma något för er”, sa hon. ”Jag ska göra valet möjligt att förstå.”",
      "Hon skrev tre ord på tavlan: behörighet, merit, program. ”Behörighet betyder att du har godkänt i de ämnen som krävs. Utan behörighet kommer du inte in, hur gärna du än vill.”"],
      pic: P9A[2], say: t3("Studievägledaren förklarar tre ord. Vad betyder behörighet?", "The careers counsellor explains three words. What does behörighet mean?", "المرشد الدراسي يشرح ثلاث كلمات. ماذا تعني behörighet؟")},
    {text: ["”Och merit?” frågade Noah. ”Ditt meritvärde är dina betyg räknade som poäng”, sa Mona. ”Det avgör vem som kommer in när många söker samma program. Men ett högt meritvärde är inte ett mål i sig.”",
      "Amir skrev ner allt. Under rasten jämförde klassen poäng, och några skröt. Amir sa ingenting. Hans betyg i engelska hade sjunkit i åttan, och det visste han bättre än någon annan."],
      pic: P9A[3], say: t3("Ett meritvärde är betyg som poäng. Varför säger Amir ingenting på rasten?", "A merit value is grades turned into points. Why does Amir say nothing at break?", "قيمة الجدارة هي الدرجات محوّلة إلى نقاط. لماذا يصمت أمير في الاستراحة؟")},
    {text: ["Nästa dag gav Lena dem en uppgift. ”Skriv tre mål för det här året. Inte ’bli bäst’. Riktiga mål, sådana som går att mäta.” Elsa suckade högt. ”Mitt mål är att överleva nian.”",
      "”Det duger inte”, sa Lena och log. ”Ett mål ska tala om vad du gör, inte bara vad du hoppas. Skriv ett mål som du kan kryssa av i november.”"],
      pic: P9A[4], say: t3("Lena vill ha mål som går att mäta. Varför duger inte Elsas mål?", "Lena wants goals you can measure. Why isn't Elsa's goal good enough?", "تريد لينا أهدافًا قابلة للقياس. لماذا لا يكفي هدف إلسا؟")},
    {text: ["Amir satt länge med sitt papper. Till slut skrev han: ”Jag ska plugga engelska i fyrtio minuter varje tisdag. Jag ska besöka två öppna hus. Jag ska ta reda på vad jag själv vill, inte vad andra vill för mig.”",
      "Sara läste över hans axel. ”Det sista är svårast”, sa hon. ”Jag vet”, sa Amir och vek ihop pappret. ”Men det är i alla fall mitt.”"],
      pic: P9A[5], say: t3("Amir skriver tre mål. Vilket tycker Sara är svårast?", "Amir writes three goals. Which one does Sara think is the hardest?", "يكتب أمير ثلاثة أهداف. أيها تعتبره سارة الأصعب؟")},
    {text: ["”I nian arbetar ni mer självständigt”, sa Lena när lektionen var slut. ”Jag påminner ingen om varje inlämning. På gymnasiet gör ingen det heller. En självständig elev frågar själv när hon inte förstår.”",
      "Amir räckte upp handen. ”Får man byta program sedan?” ”Det går”, sa Lena, ”men det kostar tid. Därför är ett år fullt av frågor billigare än ett år av ånger.”"],
      pic: P9A[6], say: t3("Vad gör en självständig elev, enligt Lena?", "What does an independent pupil do, according to Lena?", "ماذا يفعل الطالب المستقل بحسب لينا؟")},
    {text: ["På vägen hem stannade Amir vid busshållplatsen och läste en affisch om öppet hus på Teknikgymnasiet i oktober. Han fotograferade affischen med mobilen.",
      "Hemma satte han lappen med sina mål på kylskåpet, bredvid Yasmins teckning. Mamma läste den tyst. ”I somras var du osäker”, sa hon. ”Nu har du i alla fall en riktning.” Amir nickade. Sista året hade börjat på allvar."],
      pic: P9A[7], say: t3("Amir sätter upp sina mål på kylskåpet. Vad menar mamma med ”en riktning”?", "Amir puts his goals on the fridge. What does his mother mean by ”a direction”?", "يعلّق أمير أهدافه على الثلاجة. ماذا تقصد أمه بـ«اتجاه»؟")}],
  wordsSay: t3("Åtta nya ord om valet efter nian. Tryck på ett ord för att se betydelsen, formerna och ett exempel.", "Eight new words about the choice after year 9. Tap a word to see its meaning, forms and an example.", "ثماني كلمات جديدة عن الاختيار بعد الصف التاسع. اضغط على كلمة لترى معناها وصيغها ومثالًا."),
  grammar: [
    {draw: () => [A.wipe(), A.tx(T("Subjekt och predikat", "Subject and predicate", "الفاعل والفعل"), 400, 64, 40, "b"),
      ...boxes([["Amir", "b", "subjekt"], ["valde", "r", "predikat"], ["ett program", null]], 210, 44),
      A.tx(T("Vem? → Amir", "Who? → Amir", "من؟ → Amir"), 400, 340, 32, "b"),
      A.tx(T("Vad gör han? → valde", "What does he do? → valde", "ماذا يفعل؟ → valde"), 400, 400, 32, "r"),
      qt(T("Varje mening behöver båda.", "Every sentence needs both.", "كل جملة تحتاج إلى الاثنين."), 400, 468, 26, "k")],
     say: t3("En mening består av satsdelar. Subjektet är den som gör något: fråga vem eller vad. Predikatet är verbet: fråga vad subjektet gör. Amir valde – det är stommen i meningen.", "A sentence is made of sentence parts. The subject is the one doing something: ask who or what. The predicate is the verb: ask what the subject does. Amir valde – that is the frame of the sentence.", "تتكوّن الجملة من عناصر. الفاعل هو من يفعل: اسأل من أو ما. وpredikat هو الفعل: اسأل ماذا يفعل الفاعل. Amir valde هي هيكل الجملة.")},
    {draw: () => [A.wipe(), A.tx(T("Objektet: vad då?", "The object: what then?", "المفعول به: ماذا؟"), 400, 64, 40, "b"),
      ...boxes([["Mona", "b", "subjekt"], ["ritade", "r", "predikat"], ["tre ord", "g", "objekt"]], 200, 44),
      ...boxes([["Lena", "b", "subjekt"], ["gav", "r", "predikat"], ["klassen en uppgift", "g", "objekt"]], 340, 36),
      A.arrow(400, 250, 470, 250, "g", 0),
      qt(T("ritade … vad? → tre ord", "ritade … what? → tre ord", "رسمت… ماذا؟ → tre ord"), 400, 470, 26, "g")],
     say: t3("Objektet är det som verbet går ut över. Hitta predikatet först och fråga sedan vem eller vad. Mona ritade vad? Tre ord. Alla verb har inte objekt: Elsa suckade har inget.", "The object is what the verb acts on. Find the predicate first, then ask who or what. Mona ritade what? Tre ord. Not every verb has an object: Elsa suckade has none.", "المفعول به هو ما يقع عليه الفعل. اعرف الفعل أولًا ثم اسأل من أو ما. Mona ritade ماذا؟ tre ord. وليست كل الأفعال لها مفعول: Elsa suckade بلا مفعول.")},
    {draw: () => [A.wipe(), A.tx(T("Adverbial: när, var, hur?", "Adverbial: when, where, how?", "الظرف: متى، أين، كيف؟"), 400, 60, 36, "b"),
      ...boxes([["På torsdagen", "o", "adverbial"], ["kom", "r", "predikat"], ["Mona", "b", "subjekt"], ["till klassen", "o", "adverbial"]], 190, 30),
      ...boxes([["Mona", "b", "subjekt"], ["kom", "r", "predikat"], ["till klassen", "o", "adverbial"], ["på torsdagen", "o", "adverbial"]], 330, 30),
      qt(T("Adverbialet kan flytta – verbet står kvar på plats 2.", "The adverbial can move – the verb stays in place 2.", "يمكن للظرف أن ينتقل، لكن الفعل يبقى في المكان الثاني."), 400, 450, 26, "k")],
     say: t3("Adverbialet svarar på när, var, hur eller varför. Det kan stå först eller sist i meningen. Men flyttar du adverbialet först, så står verbet ändå på plats två och subjektet kommer efter.", "The adverbial answers when, where, how or why. It can come first or last. But if you move the adverbial to the front, the verb still stands in place two and the subject comes after it.", "يجيب الظرف عن متى وأين وكيف ولماذا. ويمكن أن يأتي أولًا أو آخرًا. لكن إذا قدّمته، يبقى الفعل في المكان الثاني ويأتي الفاعل بعده.")}],
  read: [
    {q: "Vad ska varje elev i 9B välja under året?", o: ["Ett gymnasium och ett program", "En ny klass och en ny lärare", "Ett ämne att hoppa över"], why: "Del 1: ”… välja ett gymnasium och ett program.”"},
    {q: "Vad säger Mona att behörighet betyder?", o: ["Att man har godkänt i de ämnen som krävs", "Att man har högst betyg i klassen", "Att man har varit på öppet hus"], why: "Del 3: ”Behörighet betyder att du har godkänt i de ämnen som krävs.”"},
    {q: "Vad är ett meritvärde?", o: ["Betygen räknade som poäng", "Antalet dagar man varit i skolan", "En lista på skolans program"], why: "Del 4: ”Ditt meritvärde är dina betyg räknade som poäng.”"},
    {q: "Varför säger Amir ingenting när klassen jämför poäng på rasten?", o: ["Hans betyg i engelska hade sjunkit och han vill inte prata om det.", "Han hade glömt sina betyg hemma.", "Han tycker att rasten är för kort."], why: "Del 4: betygen i engelska hade sjunkit, ”och det visste han bättre än någon annan”. Han håller tyst om det."},
    {q: "Varför duger inte Elsas mål ”att överleva nian”?", o: ["Det går inte att mäta och säger inte vad hon ska göra.", "Det är för långt skrivet.", "Lena tycker inte om Elsa."], why: "Del 5: ”Ett mål ska tala om vad du gör, inte bara vad du hoppas.”"},
    {q: "Vilket av Amirs mål tycker Sara är svårast?", o: ["Att ta reda på vad han själv vill", "Att plugga engelska på tisdagar", "Att besöka två öppna hus"], why: "Del 6: Sara pekar på det sista målet: ”Det sista är svårast.”"},
    {q: "Vad menar Lena med att ett år fullt av frågor är billigare än ett år av ånger?", o: ["Det är bättre att fråga mycket nu än att byta program senare.", "Frågor kostar inga pengar i skolan.", "Man ska aldrig byta program."], why: "Del 7: att byta program ”kostar tid”, så det är bättre att ställa frågor först."},
    {q: "Vad menar mamma när hon säger att Amir nu har ”en riktning”?", o: ["Han vet inte allt, men han vet vad han ska göra först.", "Han har redan kommit in på ett gymnasium.", "Han har köpt en karta till skolan."], why: "Del 8: Amir är inte klar med valet, men målen på lappen visar vad han ska göra härnäst."},
    {q: "Varför är texten skriven som en berättelse och inte som en informationsbroschyr om gymnasievalet?", o: ["Läsaren ska känna igen sig i Amirs tvivel, inte bara få fakta.", "Författaren känner inte till några fakta om gymnasiet.", "Berättelser är alltid kortare än broschyrer."], why: "Berättelsen visar valet inifrån, genom en persons känslor. En broschyr hade gett regler och poäng, men ingen Amir."}],
  gram(lv, write) {
    const parts = pick(SATS).split("|").map(c => c.split("/") as [string, string]);
    const sent = parts.map(([s]) => s).join(" ") + ".";
    const tags = parts.map(([, t]) => t), tag = pick(tags);
    const right = parts.find(([, t]) => t === tag)![0];
    const [name, col] = SATSN[tag];
    const sol = [...boxes(parts.map(([s, t]) => [s, t === tag ? col : null, t === tag ? name.replace("et", "") : undefined] as [string, string | null, string?]), 400, 30)];
    const hint = SATSQ[tag];
    const q = [...head(t3(`Vilken satsdel är ${name}?`, `Which sentence part is the ${name === "subjektet" ? "subject" : name === "predikatet" ? "predicate" : name === "objektet" ? "object" : "adverbial"}?`, `أي عنصر هو ${name}؟`)), ...svLines(sent, 200, 40)];
    if (write || lv === 2) return {kind: "text", ans: [right, right.toLowerCase()], show: right, q: [...head(t3(`Skriv ${name} i meningen.`, `Write the ${name} of the sentence.`, `اكتب ${name} في الجملة.`)), ...svLines(sent, 220, 40)], sol, hint: {say: hint, draw: []}};
    const others = shuffle(parts.filter(([s]) => s !== right)).slice(0, 2).map(([s]) => s);
    if (others.length < 2) return null;
    return choice([right, ...others], right, q, sol, hint);
  },
  help: [{say: t3("Subjekt: vem eller vad? Predikat: vad gör subjektet? Objekt: vad då? Adverbial: när, var, hur?", "Subject: who or what? Predicate: what does the subject do? Object: what then? Adverbial: when, where, how?", "الفاعل: من أو ما؟ predikat: ماذا يفعل الفاعل؟ المفعول: ماذا؟ الظرف: متى، أين، كيف؟"),
    draw: () => [...boxes([["Amir", "b", "subjekt"], ["valde", "r", "predikat"], ["ett program", "g", "objekt"], ["i juni", "o", "adverbial"]], 260, 34)]}]
});

/* =============== unit 2: Utredningen: Ska skolan börja senare? (utredande text) =============== */
word("utreda", {sv: "utreda", m: "utred(a|er|de|t|ning(en|ar|arna)?)", d: t3("Undersöka en fråga noga och från flera sidor.", "Look into a question carefully and from several sides.", "أن تدرس مسألة بعناية ومن عدة جوانب."), ex: "Klassen skulle utreda om skolan borde börja senare.", tr: {en: "investigate, look into", ar: "يبحث / يتحقق"}, syn: ["undersöka"], wrong: ["gissa", "glömma"], gap: ["Deras uppgift var att", "utreda", "en fråga från flera sidor."], gapForm: "utreda", form: "utreda – utredde – har utrett"});
word("dygnsrytm", {sv: "dygnsrytm (en)", m: "dygnsrytm(en|er|erna)?", d: t3("Kroppens klocka, som styr när man blir trött och vaken.", "The body's clock, which decides when you get tired and awake.", "ساعة الجسم التي تحدد متى تتعب ومتى تستيقظ."), ex: "Tonåringars dygnsrytm är senare än barns.", tr: {en: "body clock, circadian rhythm", ar: "الساعة البيولوجية"}, wrong: ["schema", "tidtabell"], gap: ["I puberteten ändras kroppens", "dygnsrytm", "."], gapForm: "dygnsrytm", form: "en dygnsrytm – dygnsrytmer"});
word("studie", {sv: "studie (en)", m: "studi(e|en|er|erna)", d: t3("En undersökning som forskare gör för att ta reda på något.", "A piece of research that scientists do to find something out.", "دراسة يجريها الباحثون لمعرفة شيء."), ex: "En studie från universitetet visade att eleverna sov för lite.", tr: {en: "study", ar: "دراسة"}, syn: ["undersökning"], wrong: ["rykte", "åsikt"], gap: ["De hittade en", "studie", "om tonåringars sömn."], gapForm: "studie", form: "en studie – studier"});
word("faktor9", {sv: "faktor (en)", m: "faktor(n|er|erna)?", d: t3("En sak som påverkar resultatet, en av flera orsaker.", "A thing that affects the result, one of several causes.", "عامل يؤثر في النتيجة، أحد عدة أسباب."), ex: "Sömnen är en faktor, men inte den enda.", tr: {en: "factor", ar: "عامل"}, syn: ["orsak"], wrong: ["slutsats", "studie"], gap: ["Mobilen på kvällen är också en", "faktor", "."], gapForm: "faktor", form: "en faktor – faktorer"});
word("paverka", {sv: "påverka", m: "påverka(r|de|t|s)?", d: t3("Göra så att något eller någon ändras.", "Make something or someone change.", "أن تجعل شيئًا أو شخصًا يتغيّر."), ex: "Sömnen påverkar hur man lär sig.", tr: {en: "affect, influence", ar: "يؤثّر"}, syn: ["inverka på"], wrong: ["jämföra", "utreda"], gap: ["För lite sömn", "påverkar", "både humör och betyg."], gapForm: "påverkar", form: "påverka – påverkade – har påverkat"});
word("slutsats", {sv: "slutsats (en)", m: "slutsats(en|er|erna)?", d: t3("Det man kommer fram till när man har vägt allt.", "What you arrive at when you have weighed everything up.", "ما تتوصل إليه بعد أن توازن كل شيء."), ex: "Vår slutsats är att skolan borde börja klockan nio.", tr: {en: "conclusion", ar: "استنتاج"}, syn: ["resultat"], wrong: ["faktor", "studie"], gap: ["Sist i texten skriver man sin", "slutsats", "."], gapForm: "slutsats", form: "en slutsats – slutsatser"});
word("jamfora", {sv: "jämföra", m: "jämför(a|de|t|else(n|r)?)?", d: t3("Titta på två saker samtidigt för att se likheter och skillnader.", "Look at two things at once to see what is alike and different.", "أن تنظر إلى شيئين معًا لترى التشابه والاختلاف."), ex: "De jämförde två skolor med olika starttid.", tr: {en: "compare", ar: "يقارن"}, wrong: ["påverka", "utreda"], gap: ["Sara ville", "jämföra", "de två skolorna."], gapForm: "jämföra", form: "jämföra – jämförde – har jämfört"});
word("konsekvens", {sv: "konsekvens (en)", m: "konsekvens(en|er|erna)?", d: t3("Något som händer på grund av ett beslut eller en händelse.", "Something that happens because of a decision or an event.", "شيء يحدث نتيجة قرار أو حدث."), ex: "En senare skolstart får konsekvenser för bussarna.", tr: {en: "consequence", ar: "نتيجة / تبعة"}, syn: ["följd"], wrong: ["faktor", "merit"], gap: ["Varje förslag har en", "konsekvens", "för någon annan."], gapForm: "konsekvens", form: "en konsekvens – konsekvenser"});
word("utredande9", {sv: "utredande text", m: "utredande", d: t3("En text som undersöker en fråga sakligt och väger olika sidor mot varandra.", "A text that examines a question objectively and weighs different sides.", "نص يدرس مسألة بموضوعية ويوازن بين الجوانب."), ex: "En utredande text slutar i en slutsats, inte i ett skrik.", tr: {en: "expository text", ar: "نص استقصائي"}});
word("fragestallning9", {sv: "frågeställning", m: "frågeställning(en|ar|arna)?", d: t3("Den fråga som texten ska undersöka.", "The question the text is going to examine.", "السؤال الذي سيدرسه النص."), ex: "Frågeställning: Ska skolan börja senare?", tr: {en: "research question", ar: "سؤال البحث"}});
word("vagning9", {sv: "vägning", m: "vägning(en|ar)?", d: t3("Den del där man jämför argumenten mot varandra innan slutsatsen.", "The part where you weigh the arguments against each other before the conclusion.", "الجزء الذي توازن فيه الحجج قبل الاستنتاج."), ex: "I vägningen står både för och emot.", tr: {en: "weighing up", ar: "الموازنة"}});

const LAPTOP = (x: number, y: number, s = 1, scr = "") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-56" y="-46" width="112" height="76" rx="5" fill="#33415c"/><rect x="-49" y="-39" width="98" height="62" rx="3" fill="#eaf4ff"/>${scr}<path d="M-70 30 h140 l10 12 h-160Z" fill="#9aa4b5"/></g>`;
const GRAPH = `<path d="M-40 14 h78" stroke="#9aa8c4" stroke-width="3"/><path d="M-40 14 v-44" stroke="#9aa8c4" stroke-width="3"/><path d="M-34 6 l18 -14 l16 10 l18 -22" stroke="#d63b2f" stroke-width="4" fill="none"/>`;
const building = (x: number, y: number, s = 1, c = "#e0b43a", label = "") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-52" y="-66" width="104" height="66" fill="${c}"/><path d="M-60 -66 l60 -34 l60 34Z" fill="#b03a2e"/>${[0, 1, 2].map(i => `<rect x="${-38 + i * 28}" y="-50" width="18" height="18" fill="#dceefa"/>`).join("")}<rect x="-10" y="-26" width="20" height="26" fill="#8d6440"/>${label ? hand(label, 0, -8, 18, "#1d2433") : ""}</g>`;

const P9B = [
  pic(floor(220, "#cbb894") + board(hand("Ska skolan", 150, 68, 28, "#1f4fb0") + hand("börja senare?", 150, 104, 28, "#1f4fb0") + hand("utredande text", 150, 140, 22, "#2f8a4a")) + adult(64, 126, LENA, LENAH, 1.05) + kid(200, 200, AMIR, AMIRH, .66) + kid(254, 200, SARA, SARAH, .66), "#eaf0f7"),
  pic(floor(232, "#cbb894") + clock(80, 90, 1, "M0 0 l0 -24", "M0 0 l-16 10") + sad(206, 120, AMIR, AMIRH, 1) + hand("06:40", 80, 160, 30, "#d63b2f") + bubble(206, 48, 118, "fem minuter…", 18, "#6b5b45"), "#e7ecf5"),
  pic(floor(236, "#cbb894") + desk(30, 206, 240) + LAPTOP(120, 160, 1, GRAPH) + kid(228, 128, SARA, SARAH, .9) + hand("studie", 120, 54, 30, "#1f4fb0"), "#f1f6ec"),
  pic(floor(226, "#cbb894") + board(hand("faktorer", 150, 60, 26, "#2f8a4a") + hand("sömn", 92, 100, 24) + hand("mobil", 160, 100, 24) + hand("buss", 224, 100, 24) + hand("läxor", 126, 136, 24)) + kid(66, 136, AMIR, AMIRH, .95) + kid(236, 140, NOAH, NOAHH, .9), "#f6f0fb"),
  pic(`<rect width="300" height="300" fill="#dbeaf7"/>${floor(228, "#9aa4b5")}${bus(150, 214, .95)}${kid(50, 206, ELSA, ELSAH, .8)}${hand("07:12", 240, 60, 30, "#d63b2f")}`, "#dbeaf7"),
  pic(`<rect width="300" height="300" fill="#eaf4ff"/>${floor(230, "#7cc08a")}${building(78, 226, .8, "#e0b43a", "08:10")}${building(220, 226, .8, "#7cc4f0", "09:00")}${hand("jämför", 150, 54, 32, "#1f4fb0")}<path d="M110 150 h80" stroke="#1d2433" stroke-width="3" stroke-dasharray="7 7"/>`, "#eaf4ff"),
  pic(floor(234, "#cbb894") + desk(34, 204, 232) + paper(96, 152, -4, 5, .95) + paper(206, 156, 5, 5, .95) + kid(96, 92, SARA, SARAH, .85) + kid(206, 96, AMIR, AMIRH, .85) + hand("slutsats", 150, 44, 28, "#2f8a4a"), "#fdf6e6"),
  pic(floor(220, "#cbb894") + board(hand("1. fråga", 150, 58, 22) + hand("2. för / mot", 150, 86, 22) + hand("3. vägning", 150, 114, 22) + hand("4. slutsats", 150, 142, 22, "#2f8a4a")) + kid(70, 134, SARA, SARAH, .95) + kid(130, 140, AMIR, AMIRH, .9) + adult(236, 128, LENA, LENAH, 1.05), "#eef4fb")];

const UTR: [string, string][] = [
  ["Ska skolan börja senare på morgonen?", "f"],
  ["Den här texten undersöker om en senare skolstart är rimlig.", "f"],
  ["Frågan är vad en senare start skulle betyda för eleverna.", "f"],
  ["Enligt en studie sover tonåringar i snitt en timme för lite.", "p"],
  ["Elever som får sova längre presterar bättre på prov.", "p"],
  ["Lärare i Hagaby märker att de första lektionerna är tysta.", "p"],
  ["Däremot skulle bussarna behöva nya tidtabeller.", "m"],
  ["En senare start betyder också att skoldagen slutar senare.", "m"],
  ["Träningar och jobb på eftermiddagen skulle krocka med lektionerna.", "m"],
  ["Sömnen väger tyngre än bussarnas tider, eftersom hälsan påverkar hela livet.", "s"],
  ["Sammanfattningsvis talar mer för en senare start än emot.", "s"],
  ["Vår slutsats är att skolan borde börja klockan nio.", "s"]];
const UTRN: Record<string, [string, string]> = {f: ["frågeställning", "b"], p: ["argument för", "g"], m: ["argument mot", "r"], s: ["slutsats", "o"]};
const CONN: [string, string][] = [
  ["___ en studie från universitetet sover tonåringar för lite.", "Enligt"],
  ["___ kostar en senare skolstart både pengar och nya busstider.", "Däremot"],
  ["___ talar forskningen för en senare start.", "Sammanfattningsvis"],
  ["___ är bussarnas tider ett problem, men hälsan väger tyngre.", "Visserligen"],
  ["___ sömnen påverkar betygen bör skolan börja senare.", "Eftersom"]];

defineUnit({
  id: "sv9b", year: 9, ord: 2, title: t3("Utredningen: Ska skolan börja senare?", "The inquiry: Should school start later?", "التقصّي: هل تبدأ المدرسة متأخرة؟"), storyTitle: "Utredningen: Ska skolan börja senare?",
  icon: icon(`<rect y="130" width="320" height="50" fill="#cbb894"/>${clock(66, 86, 1.5)}<rect x="150" y="26" width="140" height="104" rx="5" fill="#fff" stroke="#9aa4b5" stroke-width="4"/>${hand("för / mot", 220, 70, 28, "#1f4fb0")}${hand("slutsats", 220, 108, 26, "#2f8a4a")}`, "#eaf0f7"),
  words: ["utreda", "dygnsrytm", "studie", "faktor9", "paverka", "slutsats", "jamfora", "konsekvens"],
  terms: ["utredande9", "fragestallning9", "vagning9"],
  story: [
    {text: ["”Den här veckan ska ni utreda en fråga”, sa Lena och skrev på tavlan: Ska skolan börja senare på morgonen? ”Ni ska inte skriva vad ni tycker. Ni ska skriva en utredande text.”",
      "Elsa såg lättad ut. ”Det är ju lätt. Ja, självklart!” ”Nej”, sa Lena. ”En utredande text börjar i en frågeställning och slutar i en slutsats. Mellan dem ligger allt arbete.”"],
      pic: P9B[0], say: t3("En ny texttyp: utredande text. Vad ska eleverna inte göra?", "A new text type: an expository text. What are the pupils not supposed to do?", "نوع نصّ جديد: نص استقصائي. ما الذي لا يُفترض بالطلاب فعله؟")},
    {text: ["Amir visste precis var han skulle börja. Klockan ringde 06.40 varje morgon, och varje morgon tryckte han på snooze. På första lektionen satt han som en säck mjöl.",
      "Men det var en känsla, inte ett argument. Lena hade varit tydlig: en utredande text behöver källor, inte bara trötta morgnar. Amir skrev ändå ner klockslaget i sitt block, för han misstänkte att han inte var ensam om det."],
      pic: P9B[1], say: t3("Amir känner sig trött på morgonen. Varför räcker inte det i texten?", "Amir feels tired in the morning. Why isn't that enough in the text?", "أمير يشعر بالتعب صباحًا. لماذا لا يكفي ذلك في النص؟")},
    {text: ["Sara hittade en studie från ett universitet i Stockholm. Där stod det att kroppens dygnsrytm flyttas framåt i puberteten: tonåringar blir trötta senare på kvällen och vaknar senare på morgonen.",
      "”Då är vi inte lata”, sa Amir. ”Vi är biologiska.” Sara skrattade. ”Skriv inte så i texten. Skriv: enligt studien förskjuts dygnsrytmen under tonåren.”"],
      pic: P9B[2], say: t3("Vad visar studien om tonåringars dygnsrytm?", "What does the study show about teenagers' body clock?", "ماذا تُظهر الدراسة عن الساعة البيولوجية للمراهقين؟")},
    {text: ["De listade faktorer som påverkar hur trötta eleverna är: sömn, mobilen på kvällen, träning, bussresan och hur mörkt det är ute i november. Noah lade till en faktor till: läxor.",
      "”Alla de här påverkar varandra”, sa Sara. ”Därför kan vi inte säga att starttiden är hela förklaringen. Vi kan säga att den är en faktor av flera.”"],
      pic: P9B[3], say: t3("Vilka faktorer påverkar hur trötta eleverna är?", "Which factors affect how tired the pupils are?", "ما العوامل التي تؤثر في مدى تعب الطلاب؟")},
    {text: ["Sedan vände de på frågan. Vilka konsekvenser skulle en senare start få? Elsa pratade med en chaufför vid hållplatsen. Bussarna i Hagaby går 07.12 och 07.42, och de är planerade efter skolan.",
      "”Om vi börjar nio måste hela tidtabellen göras om”, sa Elsa. ”Och den som har träning klockan fem får en kortare eftermiddag.” Det var en konsekvens som ingen av dem hade tänkt på."],
      pic: P9B[4], say: t3("Vilka konsekvenser hittar Elsa av en senare skolstart?", "What consequences does Elsa find of a later school start?", "ما التبعات التي تجدها إلسا لبدء المدرسة متأخرًا؟")},
    {text: ["För att jämföra ringde Sara till en skola i nästa kommun, där lektionerna börjar 09.00. Rektorn där berättade att frånvaron på första lektionen hade minskat, men att föräldrarna hade klagat under den första terminen.",
      "Amir skrev upp båda sakerna. Att jämföra betyder att man tar med det som talar emot också, sa han till sig själv. Annars är det ingen utredning, bara reklam."],
      pic: P9B[5], say: t3("Varför skriver Amir upp både det positiva och klagomålen?", "Why does Amir write down both the good part and the complaints?", "لماذا يكتب أمير الجانب الإيجابي والشكاوى معًا؟")},
    {text: ["På torsdagen skrev de vägningen. Sömnen påverkar hälsa, humör och betyg under alla tre åren på gymnasiet. Bussarnas tider går att ändra, men ingen kan ändra en tonårings dygnsrytm med ett schema.",
      "Deras slutsats blev: skolan borde börja 08.30 i stället för 08.10, som ett försök under en termin. Sedan skulle man jämföra frånvaron före och efter. Ett litet steg var lättare att utreda än ett stort."],
      pic: P9B[6], say: t3("Vad blir deras slutsats, och varför just ett litet steg?", "What is their conclusion, and why such a small step?", "ما استنتاجهما، ولماذا خطوة صغيرة؟")},
    {text: ["När de redovisade ritade Lena fyra rutor på tavlan: frågeställning, argument för och emot, vägning, slutsats. ”Ni har gjort alla fyra”, sa hon. ”Och ni har inte gömt det som talade emot er.”",
      "Efteråt gick Amir hem förbi busshållplatsen. Han var fortfarande osäker på vilket program han skulle söka, men han hade lärt sig något: man kan utreda ett val precis som man utreder en skolstart. Fråga, väg, dra en slutsats. Självständigt, utan att någon säger svaret. Målet var inte att ha rätt, utan att veta varför."],
      pic: P9B[7], say: t3("Varför är texttypen utredande text och inte insändare? Vad har Amir lärt sig om sitt eget val?", "Why is the text type an expository text and not a letter to the editor? What has Amir learnt about his own choice?", "لماذا النص استقصائي وليس رسالة رأي؟ وماذا تعلّم أمير عن اختياره؟")}],
  wordsSay: t3("Ord för att undersöka en fråga. Tryck på ett ord för betydelse, böjning och exempel.", "Words for looking into a question. Tap a word for the meaning, the forms and an example.", "كلمات لدراسة مسألة. اضغط على كلمة لترى المعنى والصيغ ومثالًا."),
  grammar: [
    {draw: () => [A.wipe(), A.tx(T("Den utredande texten", "The expository text", "النص الاستقصائي"), 400, 56, 36, "b"),
      ...boxes([["1. Frågeställning", "b"]], 140, 32), ...boxes([["2. Argument för", "g"], ["3. Argument mot", "r"]], 240, 28),
      ...boxes([["4. Vägning", "o"]], 340, 32), ...boxes([["5. Slutsats", "g"]], 440, 32),
      A.arrow(400, 158, 400, 202, "k"), A.arrow(400, 260, 400, 304, "k"), A.arrow(400, 360, 400, 404, "k")],
     say: t3("En utredande text har en ordning. Först frågan, sedan argument för och emot, sedan vägningen där du jämför dem, och sist slutsatsen. Slutsatsen kommer efter arbetet, inte före.", "An expository text has an order. First the question, then arguments for and against, then the weighing where you compare them, and last the conclusion. The conclusion comes after the work, not before.", "للنص الاستقصائي ترتيب: السؤال، ثم الحجج المؤيدة والمعارضة، ثم الموازنة بينها، وأخيرًا الاستنتاج. يأتي الاستنتاج بعد العمل لا قبله.")},
    {draw: () => [A.wipe(), A.tx(T("Ord som visar var i texten du är", "Words that show where in the text you are", "كلمات تدلّ على موضعك في النص"), 400, 56, 32, "b"),
      A.tx("Frågeställning:", 80, 150, 26, "b", "start"), A.tx("Den här texten undersöker om …", 330, 150, 26, "k", "start"),
      A.tx("För:", 80, 226, 26, "g", "start"), A.tx("Enligt studien … Forskningen visar …", 330, 226, 26, "k", "start"),
      A.tx("Mot:", 80, 302, 26, "r", "start"), A.tx("Däremot … Ett problem är att …", 330, 302, 26, "k", "start"),
      A.tx("Vägning:", 80, 378, 26, "o", "start"), A.tx("Visserligen … men … väger tyngre", 330, 378, 26, "k", "start"),
      A.tx("Slutsats:", 80, 454, 26, "g", "start"), A.tx("Sammanfattningsvis … Alltså …", 330, 454, 26, "k", "start")],
     say: t3("Varje del har sina ord. Enligt och forskningen visar hör till argumenten. Däremot visar att du byter sida. Visserligen … men hör till vägningen, och sammanfattningsvis till slutsatsen.", "Each part has its own words. Enligt and forskningen visar belong to the arguments. Däremot shows that you are changing side. Visserligen … men belongs to the weighing, and sammanfattningsvis to the conclusion.", "لكل جزء كلماته. enligt و forskningen visar للحجج. däremot تدل على تغيير الجانب. visserligen … men للموازنة، و sammanfattningsvis للاستنتاج.")},
    {draw: () => [A.wipe(), A.tx(T("Sakligt, inte personligt", "Objective, not personal", "موضوعي لا شخصي"), 400, 60, 36, "b"),
      A.tx("✗ Jag tycker att det är helt sjukt att vi börjar 08.10!", 400, 180, 28, "r"), A.p(R.line(140, 170, 660, 170, .3), "r", 3),
      A.tx("✓ Enligt studien sover tonåringar en timme för lite.", 400, 290, 28, "g"),
      A.tx("✓ Däremot måste bussarnas tidtabell göras om.", 400, 356, 28, "g"),
      qt(T("Utredningen väger. Insändaren skriker.", "The inquiry weighs. The letter to the editor shouts.", "التقصّي يوازن، ورسالة الرأي تصرخ."), 400, 450, 26, "k")],
     say: t3("I en utredande text undviker du jag tycker och starka ord. Du visar var uppgifterna kommer ifrån och låter läsaren följa din väg till slutsatsen. Det är skillnaden mot en insändare.", "In an expository text you avoid I think and strong words. You show where your facts come from and let the reader follow your path to the conclusion. That is the difference from a letter to the editor.", "في النص الاستقصائي تتجنّب «أنا أرى» والكلمات القوية. تبيّن مصادر معلوماتك وتترك القارئ يتابع طريقك إلى الاستنتاج. هذا هو الفرق عن رسالة الرأي.")}],
  read: [
    {q: "Vilken fråga ska klassen utreda?", o: ["Om skolan ska börja senare på morgonen", "Om skolan ska ha längre lunch", "Om bussarna ska vara gratis"], why: "Del 1: Lena skriver frågan på tavlan."},
    {q: "Vad säger studien om tonåringars dygnsrytm?", o: ["Den flyttas framåt, så man blir trött senare på kvällen.", "Den är precis som barnens.", "Den försvinner i puberteten."], why: "Del 3: dygnsrytmen förskjuts under tonåren."},
    {q: "Vilken faktor lägger Noah till?", o: ["Läxor", "Mobilen", "Bussresan"], why: "Del 4: ”Noah lade till en faktor till: läxor.”"},
    {q: "Vilken konsekvens hittar Elsa?", o: ["Hela busstidtabellen måste göras om.", "Lärarna får mindre lön.", "Skolan måste bygga om klassrummen."], why: "Del 5: bussarna är planerade efter skolan."},
    {q: "Vad blir deras slutsats?", o: ["Skolan borde börja 08.30 som ett försök under en termin.", "Skolan borde börja 07.00.", "Allt borde vara precis som i dag."], why: "Del 7: ett försök med 08.30."},
    {q: "Varför räcker det inte att Amir känner sig trött på morgonen?", o: ["En utredande text behöver källor, inte bara egna känslor.", "Amir är den enda i klassen som är trött.", "Lena tror inte på honom."], why: "Del 2: ”en utredande text behöver källor, inte bara trötta morgnar.”"},
    {q: "Varför skriver Amir upp att föräldrarna i den andra kommunen klagade?", o: ["En utredning måste ta med det som talar emot.", "Han vill att förslaget ska falla.", "Lena hade bett om fler sidor text."], why: "Del 6: ”Annars är det ingen utredning, bara reklam.”"},
    {q: "Varför föreslår de ett försök på en termin i stället för en stor ändring?", o: ["Ett litet steg är lättare att undersöka och att ändra tillbaka.", "De vill inte att något ska hända.", "Lena hade bestämt tiden i förväg."], why: "Del 7: ”Ett litet steg var lättare att utreda än ett stort.”"},
    {q: "Vad är syftet med en utredande text, jämfört med en insändare?", o: ["Att undersöka en fråga sakligt och visa vägen till en slutsats", "Att få läsaren arg och samla namn på en lista", "Att berätta en spännande historia"], why: "Utredningen väger och visar sina källor. Insändaren vill övertyga snabbt."}],
  gram(lv, write) {
    if (write || lv === 2) {
      const [s, w] = pick(CONN);
      return {kind: "text", ans: [w, w.toLowerCase()], show: w,
        q: [...head(t3("Skriv ordet som saknas i luckan.", "Write the word that is missing in the gap.", "اكتب الكلمة الناقصة في الفراغ.")), ...svLines(s, 190, 34), ...svLines("Enligt · Däremot · Eftersom · Visserligen · Sammanfattningsvis", 410, 26, "o", 60)],
        sol: svLines(s.replace("___", w), 400, 32, "g"), hint: {say: t3("Vilken del av utredningen är det? En källa, motsidan, vägningen eller slutsatsen?", "Which part of the inquiry is it? A source, the other side, the weighing or the conclusion?", "أي جزء من التقصّي هذا؟ مصدر، أم الجانب المقابل، أم الموازنة، أم الاستنتاج؟"), draw: []}};
    }
    const [s, tag] = pick(UTR), [name] = UTRN[tag];
    const others = shuffle(Object.keys(UTRN).filter(k => k !== tag)).slice(0, 2).map(k => UTRN[k][0]);
    const sol = [...svLines(s, 280, 30, "k"), A.tx(name, 400, 430, 44, UTRN[tag][1])];
    return choice([name, ...others], name,
      [...head(t3("Vilken del av den utredande texten hör meningen till?", "Which part of the expository text does the sentence belong to?", "إلى أي جزء من النص الاستقصائي تنتمي الجملة؟")), ...svLines(s, 200, 32)], sol,
      t3("Ställer meningen frågan, talar den för, talar den emot, eller summerar den?", "Does the sentence ask the question, argue for, argue against, or sum up?", "هل الجملة تطرح السؤال، أم تؤيد، أم تعارض، أم تلخّص؟"));
  },
  help: [{say: t3("Frågeställning → argument för → argument mot → vägning → slutsats.", "Question → arguments for → arguments against → weighing → conclusion.", "السؤال ← الحجج المؤيدة ← الحجج المعارضة ← الموازنة ← الاستنتاج."),
    draw: () => [...boxes([["fråga", "b"], ["för", "g"], ["mot", "r"], ["vägning", "o"], ["slutsats", "g"]], 260, 28)]}]
});

/* =============== unit 3: Novellen: Tåget (berättarperspektiv) =============== */
word("perrong", {sv: "perrong (en)", m: "perrong(en|er|erna)?", d: t3("Den upphöjda kanten vid spåret där man väntar på tåget.", "The raised platform by the track where you wait for the train.", "الرصيف المرتفع بجانب السكة حيث تنتظر القطار."), ex: "Han stod längst ut på perrongen.", tr: {en: "platform", ar: "رصيف القطار"}, syn: ["plattform"], wrong: ["spår", "vänthall"], gap: ["Tåget stod kvar vid", "perrongen", "i två minuter."], gapForm: "perrongen", form: "en perrong – perronger"});
word("konduktor", {sv: "konduktör (en)", m: "konduktör(en|er|erna)?", d: t3("Den som arbetar på tåget och kontrollerar biljetterna.", "The person who works on the train and checks the tickets.", "من يعمل في القطار ويفحص التذاكر."), ex: "Konduktören bad om hans biljett.", tr: {en: "train conductor", ar: "محصّل القطار"}, wrong: ["chaufför", "pilot"], gap: ["En", "konduktör", "gick genom vagnen."], gapForm: "konduktör", form: "en konduktör – konduktörer"});
word("frammande", {sv: "främmande", m: "främmande", d: t3("Okänd; någon eller något man inte känner igen.", "Unknown; someone or something you do not recognise.", "غريب؛ شخص أو شيء لا تعرفه."), ex: "Alla ansikten på perrongen var främmande.", tr: {en: "strange, unfamiliar", ar: "غريب"}, syn: ["okänd"], opp: ["bekant"], wrong: ["tom", "ljus"], gap: ["Han satte sig mitt bland", "främmande", "människor."], gapForm: "främmande", form: "främmande (oförändrad)"});
word("blick", {sv: "blick (en)", m: "blick(en|ar|arna)?", d: t3("Hur någon ser på något, och själva sättet att se.", "The way someone looks at something, and the look itself.", "النظرة وطريقة النظر."), ex: "Hon mötte hans blick i fönstret.", tr: {en: "look, gaze", ar: "نظرة"}, syn: ["öga"], wrong: ["röst", "hopp"], gap: ["Han sänkte", "blicken", "mot biljetten."], gapForm: "blicken", form: "en blick – blickar"});
word("tveka", {sv: "tveka", m: "tveka(r|de|t)?", d: t3("Inte kunna bestämma sig, vänta en sekund för länge.", "Be unable to decide, wait one second too long.", "أن تتردّد ولا تستطيع الحسم."), ex: "Han tvekade framför den öppna dörren.", tr: {en: "hesitate", ar: "يتردّد"}, syn: ["vara osäker"], opp: ["bestämma sig"], wrong: ["skynda", "sova"], gap: ["Hon", "tvekade", "innan hon steg på."], gapForm: "tvekade", form: "tveka – tvekade – har tvekat"});
word("avgang9", {sv: "avgång (en)", m: "avgång(en|ar|arna)?", d: t3("När ett tåg eller en buss åker, och själva turen.", "When a train or bus leaves, and the departure itself.", "موعد مغادرة القطار أو الباص، والرحلة نفسها."), ex: "Nästa avgång går 17.42.", tr: {en: "departure", ar: "مغادرة / رحلة"}, opp: ["ankomst"], wrong: ["perrong", "biljett"], gap: ["Högtalaren ropade ut nästa", "avgång", "."], gapForm: "avgång", form: "en avgång – avgångar"});
word("ångra", {sv: "ångra", m: "ångra(r|de|t)?", d: t3("Känna att man gjorde fel och önska att man valt annat.", "Feel that you did the wrong thing and wish you had chosen differently.", "أن تشعر أنك أخطأت وتتمنى لو اخترت غير ذلك."), ex: "Jag vill inte ångra det här om tio år.", tr: {en: "regret", ar: "يندم"}, syn: ["känna ånger"], wrong: ["tveka", "hoppas"], gap: ["Tänk om jag", "ångrar", "mig i morgon?"], gapForm: "ångrar", form: "ångra – ångrade – har ångrat"});
word("hopp", {sv: "hopp (ett)", m: "hopp(et|ets)?", d: t3("Känslan att något bra kan hända.", "The feeling that something good can happen.", "الشعور بأن شيئًا جيدًا قد يحدث."), ex: "Tåget var hans enda hopp.", tr: {en: "hope", ar: "أمل"}, syn: ["tro"], opp: ["förtvivlan"], wrong: ["blick", "ånger"], gap: ["Han kände ett litet", "hopp", "i bröstet."], gapForm: "hopp", form: "ett hopp – hoppet"});
word("berattare9", {sv: "berättare", m: "berättar(e|en|ens|na)", d: t3("Den röst som berättar historien för läsaren.", "The voice that tells the story to the reader.", "الصوت الذي يحكي القصة للقارئ."), ex: "Berättaren säger jag, så vi är inne i hans huvud.", tr: {en: "narrator", ar: "الراوي"}});
word("jagform9", {sv: "jag-form", m: "jag-form(en)?", d: t3("När berättaren säger jag och berättar inifrån sig själv.", "When the narrator says I and tells the story from inside.", "عندما يقول الراوي «أنا» ويحكي من داخله."), ex: "Jag stod på perrongen och tvekade.", tr: {en: "first person", ar: "صيغة المتكلم"}});
word("inremonolog9", {sv: "inre monolog", m: "inre monolog(en|er)?", d: t3("Tankarna skrivna som de låter inne i huvudet.", "Thoughts written just as they sound inside the head.", "الأفكار مكتوبة كما تُسمع داخل الرأس."), ex: "Gå på nu. Gå på. Vad väntar du på?", tr: {en: "inner monologue", ar: "مونولوج داخلي"}});

const rails = (y: number) => `<rect y="${y}" width="300" height="${300 - y}" fill="#8d8c84"/><rect y="${y + 16}" width="300" height="7" fill="#5b6476"/><rect y="${y + 38}" width="300" height="7" fill="#5b6476"/>${[...Array(7)].map((_, i) => `<rect x="${i * 44}" y="${y + 10}" width="22" height="42" fill="#6b5b45" opacity=".45"/>`).join("")}`;
const platform = (y: number) => `<rect y="${y}" width="300" height="${300 - y}" fill="#c6cfdc"/><rect y="${y}" width="300" height="8" fill="#f2c94c"/>`;
const sign = (x: number, y: number, s: string) => `<g><rect x="${x - 54}" y="${y - 18}" width="108" height="36" rx="4" fill="#1f4fb0"/>${hand(s, x, y + 8, 22, "#fff")}<rect x="${x - 3}" y="${y + 18}" width="6" height="34" fill="#9aa4b5"/></g>`;
const bench = (x: number, y: number) => `<rect x="${x - 40}" y="${y}" width="80" height="9" rx="3" fill="#8d6440"/><rect x="${x - 40}" y="${y - 20}" width="80" height="8" rx="3" fill="#8d6440"/><rect x="${x - 36}" y="${y + 9}" width="7" height="22" fill="#6b4a2e"/><rect x="${x + 29}" y="${y + 9}" width="7" height="22" fill="#6b4a2e"/>`;
const cap9 = (x: number, y: number, s = 1) => `<path d="M${x - 24 * s} ${y - 20 * s} h${48 * s} v${-7 * s} q0 ${-16 * s} ${-24 * s} ${-16 * s} q${-24 * s} 0 ${-24 * s} ${16 * s}Z" fill="#1f4fb0"/><rect x="${x - 28 * s}" y="${y - 22 * s}" width="${56 * s}" height="${6 * s}" rx="3" fill="#13306b"/>`;

const P9C = [
  pic(floor(222, "#cbb894") + board(hand("novell", 150, 66, 32, "#1f4fb0") + hand("jag  eller  han?", 150, 112, 26, "#d63b2f")) + adult(70, 126, LENA, LENAH, 1.05) + kid(228, 136, AMIR, AMIRH, .95) + paper(228, 196, 6, 3, .5), "#eef4fb"),
  pic(platform(206) + rails(248) + sign(210, 54, "HAGABY") + kid(96, 160, AMIR, AMIRH, 1) + `<rect x="64" y="186" width="30" height="24" rx="4" fill="#7b5ea7"/>` + hand("17.42", 96, 70, 30, "#d63b2f"), "#dbeaf7"),
  pic(platform(214) + train(190, 196, .9) + kid(236, 160, "#1f4fb0", "#1d2433", .95) + cap9(236, 142, .95) + kid(60, 164, AMIR, AMIRH, .95), "#dfe6f3"),
  pic(`<rect width="300" height="300" fill="#33415c"/><rect x="24" y="40" width="252" height="150" rx="10" fill="#dceefa" opacity=".9"/>${kid(150, 150, AMIR, AMIRH, 1)}${hand("Gå på nu.", 150, 70, 30, "#1f4fb0")}${hand("Gå på.", 150, 108, 26, "#7b5ea7")}${floor(240, "#273349")}`, "#33415c"),
  pic(platform(210) + rails(250) + bench(96, 170) + kid(96, 134, "#c0603a", "#1d2433", .85) + kid(216, 150, AMIR, AMIRH, .95) + bubble(96, 60, 136, "Tåget väntar inte", 18, "#6b5b45"), "#e7ecf5"),
  pic(platform(214) + train(170, 200, .95) + kid(44, 168, AMIR, AMIRH, .9) + hand("AVGÅNG", 150, 50, 32, "#d63b2f") + `<path d="M232 150 v60" stroke="#1d2433" stroke-width="5"/>`, "#dbeaf7"),
  pic(floor(226, "#cbb894") + desk(30, 200, 240) + paper(100, 152, -5, 5, .95) + adult(216, 126, LENA, LENAH, 1.05) + kid(100, 94, AMIR, AMIRH, .9) + hand("han? jag?", 216, 56, 26, "#2f8a4a"), "#f1f6ec"),
  pic(floor(232, "#cbb894") + desk(40, 204, 220) + paper(120, 158, 4, 5, .95) + kid(120, 96, SARA, SARAH, .9) + kid(228, 110, AMIR, AMIRH, .85) + bubble(120, 46, 128, "Är det du?", 20, "#d35f8d"), "#fdf6e6")];

const PERS: [string, string][] = [
  ["Han stod på perrongen och tvekade.", "Jag stod på perrongen och tvekade."],
  ["Hans biljett låg längst ner i fickan.", "Min biljett låg längst ner i fickan."],
  ["Hon mötte hans blick i fönstret.", "Hon mötte min blick i fönstret."],
  ["Konduktören såg länge på honom.", "Konduktören såg länge på mig."],
  ["Han ångrade sig redan i dörren.", "Jag ångrade mig redan i dörren."],
  ["Tåget var hans enda hopp.", "Tåget var mitt enda hopp."],
  ["Han hörde avgången ropas ut.", "Jag hörde avgången ropas ut."],
  ["Främmande röster väckte honom.", "Främmande röster väckte mig."]];
const PRON: [string, string, string, string][] = [
  ["___ stod kvar på perrongen.", "Jag", "Mig", "Min"],
  ["___ biljett låg i fickan.", "Min", "Mig", "Jag"],
  ["Konduktören såg på ___.", "mig", "jag", "min"],
  ["Hon mötte ___ blick.", "min", "mig", "jag"],
  ["Tåget var ___ enda hopp.", "mitt", "min", "mig"],
  ["Avgången var ___ sista chans.", "min", "mitt", "mig"],
  ["Ingen av dem kände ___.", "mig", "jag", "min"]];

defineUnit({
  id: "sv9c", year: 9, ord: 3, title: t3("Novellen: Tåget", "The short story: The train", "القصة القصيرة: القطار"), storyTitle: "Novellen: Tåget",
  icon: icon(`<rect y="120" width="320" height="60" fill="#c6cfdc"/><rect y="120" width="320" height="8" fill="#f2c94c"/>${train(210, 118, .85)}<rect x="10" y="60" width="90" height="34" rx="4" fill="#1f4fb0"/>${hand("17.42", 55, 86, 24, "#fff")}`, "#dbeaf7"),
  words: ["perrong", "konduktor", "frammande", "blick", "tveka", "avgang9", "ångra", "hopp"],
  terms: ["berattare9", "jagform9", "inremonolog9"],
  story: [
    {text: ["”Ni har utrett en fråga tillsammans”, sa Lena. ”Nu ska ni skriva en novell: kort, en enda händelse, och ett val som läsaren inte får veta slutet på. Men först måste ni bestämma en sak: vem berättar?”",
      "Hon skrev två meningar på tavlan. Han stod på perrongen och tvekade. Jag stod på perrongen och tvekade. ”Samma händelse”, sa hon. ”Olika avstånd till läsaren.”"],
      pic: P9C[0], say: t3("Lena skriver samma mening på två sätt. Vad är skillnaden?", "Lena writes the same sentence in two ways. What is the difference?", "تكتب لينا الجملة نفسها بطريقتين. ما الفرق؟")},
    {text: ["Amir valde jag-form och började skriva. ”Jag stod på perrongen i Hagaby med en biljett i fickan och en tom lördag framför mig. Ingen hemma visste att jag hade köpt den.",
      "Jag hade sökt till en kurs i en annan stad, och nu skulle jag dit på intervju. Om jag kom in skulle allt bli annorlunda. Jag tittade på klockan: nästa avgång gick 17.42.”"],
      pic: P9C[1], say: t3("Berättaren säger jag. Vart ska han, och vem vet om det?", "The narrator says I. Where is he going, and who knows about it?", "الراوي يقول «أنا». إلى أين يذهب، ومن يعرف بذلك؟")},
    {text: ["”Tåget rullade in. En konduktör klev ner på perrongen och ropade något jag inte hörde. Han hade en blå mössa och ett ansikte som hade sett tio tusen människor tveka precis där jag stod.",
      "Alla ansikten var främmande. Jag kände inte en enda människa på hela perrongen, och ändå kändes det som om alla tittade.”"],
      pic: P9C[2], say: t3("Alla ansikten är främmande. Hur känner sig berättaren då?", "All the faces are unfamiliar. How does the narrator feel then?", "كل الوجوه غريبة. كيف يشعر الراوي حينها؟")},
    {text: ["”Gå på nu. Gå på. Vad väntar du på? Det är bara ett tåg, det är bara två timmar, det är bara ett liv.",
      "Och tänk om jag ångrar mig? Tänk om jag kommer in och mamma blir ledsen? Tänk om jag inte kommer in och jag har rest hela vägen för ingenting?”"],
      pic: P9C[3], say: t3("Det här är en inre monolog: tankarna skrivna som de låter. Vad är berättaren rädd för?", "This is an inner monologue: the thoughts written as they sound. What is the narrator afraid of?", "هذا مونولوج داخلي: الأفكار كما تُسمع. مما يخاف الراوي؟")},
    {text: ["”En kvinna på bänken lyfte sin blick och såg rakt på mig. Hon var främmande, men hon log som om hon kände mig.",
      "’Tåget väntar inte’, sa hon. Sedan tittade hon ner i sin bok igen, som om hon inte hade sagt något alls.”"],
      pic: P9C[4], say: t3("En främmande kvinna säger fyra ord. Varför är de viktiga just nu?", "A strange woman says four words. Why do they matter right now?", "تقول امرأة غريبة أربع كلمات. لماذا هي مهمة الآن؟")},
    {text: ["”Högtalaren ropade ut avgången. Konduktören lyfte handen. Jag tvekade en sekund till, en sekund som var längre än hela veckan.",
      "Sedan tog jag två steg och stod på tåget. Dörrarna gick ihop bakom mig. Jag visste fortfarande inte om det var hopp eller skräck jag kände i magen, och jag var inte säker på att jag skulle veta det i morgon heller.”"],
      pic: P9C[5], say: t3("Novellen slutar öppet. Vad vet läsaren inte?", "The short story has an open ending. What doesn't the reader know?", "تنتهي القصة بنهاية مفتوحة. ما الذي لا يعرفه القارئ؟")},
    {text: ["Lena läste novellen två gånger. ”Jag-formen gör att jag sitter inne i honom”, sa hon. ”Jag hör allt han tänker. Men jag får bara veta det han vet. Hur kvinnan på bänken känner får jag aldrig veta.”",
      "”Prova att skriva om första stycket i tredje person”, sa hon. ”Han stod på perrongen. Då kan du också visa hur han ser ut utifrån. Men du tappar lite av hans huvud. Varje perspektiv har sina konsekvenser.”"],
      pic: P9C[6], say: t3("Vad vinner och vad kostar jag-formen, enligt Lena?", "What does the first person gain, and what does it cost, according to Lena?", "ما الذي تكسبه صيغة المتكلم وما الذي تخسره بحسب لينا؟")},
    {text: ["På rasten läste Sara novellen på Amirs skärm. ”Är det du?” frågade hon och mötte hans blick. Amir ryckte på axlarna. ”Det är jag om fyra månader”, sa han. ”Fast med ett gymnasium i stället för ett tåg.”",
      "”Då vet du redan slutsatsen”, sa Sara. ”Att man måste gå på?” ”Nej”, sa Amir. ”Att man tvekar ändå. Målet med novellen är inte att ge ett svar. Och det är inte farligt att tveka, så länge man inte låter någon annan välja medan man gör det.”"],
      pic: P9C[7], say: t3("Varför valde Amir att skriva i jag-form om något som påminner om hans eget val?", "Why did Amir choose to write in the first person about something that resembles his own choice?", "لماذا اختار أمير صيغة المتكلم ليكتب عن شيء يشبه اختياره؟")}],
  wordsSay: t3("Ord från novellen och från perrongen. Tryck på ett ord för betydelse och exempel.", "Words from the short story and from the platform. Tap a word for the meaning and an example.", "كلمات من القصة ومن الرصيف. اضغط على كلمة لترى المعنى ومثالًا."),
  grammar: [
    {draw: () => [A.wipe(), A.tx(T("Vem berättar?", "Who is telling the story?", "من يحكي؟"), 400, 60, 38, "b"),
      ...boxes([["Jag", "r", "jag-form"], ["stod på perrongen och tvekade.", null]], 190, 32),
      ...boxes([["Han", "b", "tredje person"], ["stod på perrongen och tvekade.", null]], 310, 32),
      A.tx(T("jag: nära, inifrån    han: lite längre bort, utifrån", "jag: close, from inside    han: further away, from outside", "jag: قريب من الداخل    han: أبعد من الخارج"), 400, 430, 26, "k")],
     say: t3("Berättaren kan säga jag eller han och hon. Jag-formen placerar läsaren inne i huvudet. Tredje person ger mer överblick, men mindre närhet. Välj innan du börjar, och byt inte mitt i.", "The narrator can say I or he and she. The first person puts the reader inside the head. The third person gives more overview but less closeness. Choose before you start, and don't switch halfway.", "يمكن للراوي أن يقول «أنا» أو «هو/هي». صيغة المتكلم تضع القارئ داخل الرأس، والغائب يمنح نظرة أوسع لكن قربًا أقل. اختر قبل أن تبدأ ولا تبدّل في المنتصف.")},
    {draw: () => {const X = [240, 560], rows = [["jag", "han"], ["mig", "honom"], ["min", "hans"], ["mitt", "hans"], ["mina", "hans"]];
      return [A.wipe(), A.tx(T("Byter du perspektiv byter du ord", "Change the perspective, change the words", "إذا بدّلت المنظور بدّلت الكلمات"), 400, 56, 30, "b"),
        A.tx("jag-form", X[0], 130, 30, "r"), A.tx("tredje person", X[1], 130, 30, "b"), A.p(R.line(120, 152, 680, 152, .3), "k", 2),
        ...rows.flatMap((r, j) => [A.tx(r[0], X[0], 200 + j * 56, 34, "r"), A.tx(r[1], X[1], 200 + j * 56, 34, "b"), A.arrow(330, 190 + j * 56, 450, 190 + j * 56, "k")])];},
     say: t3("Varje pronomen måste bytas, annars glider texten. Jag blir han, mig blir honom, min blir hans. Läs igenom din novell och leta efter ett ensamt jag som blev kvar.", "Every pronoun has to change, otherwise the text slips. Jag becomes han, mig becomes honom, min becomes hans. Read your story through and look for a lonely jag that was left behind.", "يجب تغيير كل ضمير وإلا اضطرب النص. jag تصبح han و mig تصبح honom و min تصبح hans. أعد قراءة قصتك وابحث عن ضمير متكلم بقي وحده.")},
    {draw: () => [A.wipe(), A.tx(T("Inre monolog", "Inner monologue", "المونولوج الداخلي"), 400, 58, 38, "b"),
      A.tx("Gå på nu. Gå på. Vad väntar du på?", 400, 170, 32, "r"),
      qt(T("tankarna precis som de låter – korta, hackiga", "the thoughts just as they sound – short, jumpy", "الأفكار كما تُسمع: قصيرة ومتقطعة"), 400, 220, 24, "k"),
      A.tx("Han tänkte att han borde gå på tåget.", 400, 320, 30, "b"),
      qt(T("tanken berättad utifrån – längre bort", "the thought told from outside – further away", "الفكرة محكيّة من الخارج: أبعد"), 400, 370, 24, "k"),
      A.tx(T("Jag-form + inre monolog = läsaren tänker med.", "First person + inner monologue = the reader thinks along.", "صيغة المتكلم + المونولوج = القارئ يفكّر معك."), 400, 460, 28, "g")],
     say: t3("I en inre monolog skriver du tankarna rakt, utan han tänkte. Meningarna blir korta och ofullständiga, som riktiga tankar. Det passar jag-formen, för läsaren sitter redan inne i huvudet.", "In an inner monologue you write the thoughts straight out, without he thought. The sentences get short and unfinished, like real thoughts. It suits the first person, because the reader is already inside the head.", "في المونولوج الداخلي تكتب الأفكار مباشرة بلا «فكّر أنه». الجمل قصيرة وغير مكتملة كالأفكار الحقيقية، وهذا يناسب صيغة المتكلم لأن القارئ داخل الرأس أصلًا.")}],
  read: [
    {q: "Vilken texttyp skriver klassen?", o: ["En novell", "En insändare", "En utredande text"], why: "Del 1: ”Nu ska ni skriva en novell.”"},
    {q: "Vart är berättaren i novellen på väg?", o: ["På intervju till en kurs i en annan stad", "Till en fotbollsmatch", "Hem till sin mormor"], why: "Del 2: han har sökt en kurs och ska på intervju."},
    {q: "Vad säger kvinnan på bänken?", o: ["”Tåget väntar inte.”", "”Du har glömt din biljett.”", "”Sätt dig här hos mig.”"], why: "Del 5: hon säger ”Tåget väntar inte” och läser vidare."},
    {q: "Vad gör berättaren till slut?", o: ["Han tar två steg och går på tåget.", "Han går hem igen.", "Han river sin biljett."], why: "Del 6: ”Sedan tog jag två steg och stod på tåget.”"},
    {q: "Varför känns det som om alla tittar, fast ingen känner honom?", o: ["Han är nervös och tror att hans hemlighet syns.", "Perrongen är tom och tyst.", "Konduktören har pekat ut honom."], why: "Alla är främmande, men han bär på ett val han inte berättat hemma. Nervositeten gör blickarna större än de är."},
    {q: "Varför är kvinnans fyra ord viktiga?", o: ["De tvingar honom att bestämma sig just nu.", "De berättar när tåget går.", "De visar att hon känner hans familj."], why: "”Tåget väntar inte” säger att tiden att tveka är slut – valet måste göras på perrongen."},
    {q: "Vad menar Lena med att varje perspektiv kostar något?", o: ["Jag-formen ger närhet men bara en persons kunskap.", "Att det tar längre tid att skriva i jag-form.", "Att tredje person alltid är bättre."], why: "Del 7: i jag-form hör vi allt han tänker, men vi får aldrig veta vad kvinnan känner."},
    {q: "Vad menar Amir med att novellen är ”jag om fyra månader”?", o: ["Hans eget val av gymnasium kommer att kännas likadant.", "Han ska verkligen åka tåg i mars.", "Han ska byta skola om fyra månader."], why: "Del 8: tåget står för valet; om fyra månader ska han välja gymnasium."},
    {q: "Varför passar jag-form och inre monolog så bra just i den här novellen?", o: ["Hela händelsen är ett inre val, inte en yttre handling.", "Novellen har många personer som ska beskrivas.", "Jag-form gör alltid texter kortare."], why: "Det som händer utanför är litet: ett tåg, en perrong. Spänningen finns i huvudet, och dit kommer läsaren bara genom jag och tankarna."}],
  gram(lv, write) {
    const [third, first] = pick(PERS);
    if (write || lv === 2) return {kind: "text", ans: [first, first.replace(/\.$/, "")], show: first,
      q: [...head(t3("Skriv om meningen i jag-form.", "Rewrite the sentence in the first person.", "أعد كتابة الجملة بصيغة المتكلم.")), ...svLines(third, 220, 36)],
      sol: svLines(first, 400, 36, "g"), hint: {say: t3("Han blir jag, honom blir mig, hans blir min eller mitt.", "Han becomes jag, honom becomes mig, hans becomes min or mitt.", "han تصبح jag و honom تصبح mig و hans تصبح min أو mitt."), draw: []}};
    if (lv === 1) {
      const [s, right, w1, w2] = pick(PRON);
      return choice([right, w1, w2], right,
        [...head(t3("Vilket ord passar i jag-formen?", "Which word fits in the first person?", "أي كلمة تناسب صيغة المتكلم؟")), ...svLines(s, 220, 38)],
        svLines(s.replace("___", right), 400, 36, "g"),
        t3("jag gör något, något händer mig, och saken är min eller mitt.", "jag does something, something happens to mig, and the thing is min or mitt.", "jag تفعل، وشيء يحدث لـ mig، والشيء هو min أو mitt."));
    }
    const other = pick(PERS.filter(p => p[0] !== third))[0];
    return choice([first, third, other], first,
      [...head(t3("Vilken mening är skriven i jag-form?", "Which sentence is written in the first person?", "أي جملة مكتوبة بصيغة المتكلم؟")), qt(T("berättaren säger jag", "the narrator says jag", "الراوي يقول jag"), 400, 150, 28, "r")],
      [...svLines(first, 360, 34, "g"), A.tx("jag-form", 400, 450, 34, "r")],
      t3("Leta efter orden jag, mig, min och mitt.", "Look for the words jag, mig, min and mitt.", "ابحث عن الكلمات jag و mig و min و mitt."));
  },
  help: [{say: t3("Jag-form: jag, mig, min. Tredje person: han, honom, hans. Inre monolog skriver tanken rakt ut.", "First person: jag, mig, min. Third person: han, honom, hans. An inner monologue writes the thought straight out.", "صيغة المتكلم: jag و mig و min. الغائب: han و honom و hans. والمونولوج يكتب الفكرة مباشرة."),
    draw: () => [A.tx("jag – mig – min", 400, 180, 44, "r"), A.tx("han – honom – hans", 400, 270, 44, "b"), A.tx("Gå på nu. Gå på.", 400, 370, 38, "g")]}]
});

/* =============== unit 4: Källan i reklamen (etos, patos, logos) =============== */
word("reklam", {sv: "reklam (en)", m: "reklam(en|er)?", d: t3("Text, bild eller film som vill få dig att köpa eller tycka något.", "Text, pictures or film that want you to buy or think something.", "نص أو صورة أو فيلم يريد أن يجعلك تشتري أو ترى رأيًا معينًا."), ex: "På bussen satt reklam för en energidryck.", tr: {en: "advertising, advert", ar: "إعلان"}, syn: ["annons"], wrong: ["nyhet", "studie"], gap: ["Hela väggen var täckt av", "reklam", "."], gapForm: "reklam", form: "en reklam – reklamer"});
word("målgrupp", {sv: "målgrupp (en)", m: "målgrupp(en|er|erna)?", d: t3("Den grupp människor som reklamen är gjord för.", "The group of people the advert is made for.", "الفئة التي صُنع الإعلان من أجلها."), ex: "Målgruppen var killar i nian.", tr: {en: "target group", ar: "الفئة المستهدفة"}, wrong: ["konsument", "budskap"], gap: ["Vilken", "målgrupp", "är annonsen gjord för?"], gapForm: "målgrupp", form: "en målgrupp – målgrupper"});
word("budskap", {sv: "budskap (ett)", m: "budskap(et|en)?", d: t3("Det som texten eller bilden egentligen vill säga.", "What the text or picture really wants to say.", "ما يريد النص أو الصورة قوله فعلًا."), ex: "Budskapet var: utan den här drycken orkar du inte.", tr: {en: "message", ar: "رسالة"}, syn: ["mening"], wrong: ["målgrupp", "reklam"], gap: ["Bakom bilden fanns ett tydligt", "budskap", "."], gapForm: "budskap", form: "ett budskap – budskap"});
word("logos", {sv: "logos", m: "logos", d: t3("Att övertyga med fakta, siffror och förnuft.", "Persuading with facts, numbers and reason.", "الإقناع بالحقائق والأرقام والمنطق."), ex: "Nio av tio tandläkare rekommenderar den – det är logos.", tr: {en: "logos (appeal to reason)", ar: "المنطق (logos)"}, wrong: ["patos", "etos"], gap: ["Siffror i en annons är", "logos", "."], gapForm: "logos", form: "logos (oförändrad)"});
word("patos", {sv: "patos", m: "patos", d: t3("Att övertyga genom känslor: rädsla, glädje, längtan.", "Persuading through feelings: fear, joy, longing.", "الإقناع بالعواطف: الخوف والفرح والحنين."), ex: "Bilden av det ensamma barnet är patos.", tr: {en: "pathos (appeal to emotion)", ar: "العاطفة (patos)"}, wrong: ["logos", "etos"], gap: ["Musiken i filmen var ren", "patos", "."], gapForm: "patos", form: "patos (oförändrad)"});
word("etos", {sv: "etos", m: "etos", d: t3("Att övertyga genom vem avsändaren är och hur pålitlig den verkar.", "Persuading through who the sender is and how trustworthy they seem.", "الإقناع بهوية المُرسل ومدى موثوقيته."), ex: "En läkare i vit rock i reklamen är etos.", tr: {en: "ethos (appeal to character)", ar: "المصداقية (etos)"}, wrong: ["patos", "logos"], gap: ["Att visa en expert i bild är", "etos", "."], gapForm: "etos", form: "etos (oförändrad)"});
word("påverkan9", {sv: "påverkan (en)", m: "påverkan", d: t3("Att något förändrar hur man tänker eller handlar.", "That something changes how you think or act.", "أن يغيّر شيء طريقة تفكيرك أو تصرفك."), ex: "Reklamens påverkan märks först efteråt.", tr: {en: "influence", ar: "تأثير"}, syn: ["inflytande"], wrong: ["budskap", "reklam"], gap: ["Ingen tror att hon utsätts för", "påverkan", ", men alla är det."], gapForm: "påverkan", form: "en påverkan (ingen plural)"});
word("konsument", {sv: "konsument (en)", m: "konsument(en|er|erna)?", d: t3("Den som köper och använder varor och tjänster.", "The person who buys and uses goods and services.", "من يشتري ويستخدم السلع والخدمات."), ex: "Som konsument har du rätt att få veta vem som är avsändare.", tr: {en: "consumer", ar: "مستهلك"}, syn: ["kund"], wrong: ["målgrupp", "konduktör"], gap: ["En medveten", "konsument", "frågar vem som tjänar på budskapet."], gapForm: "konsument", form: "en konsument – konsumenter"});
word("etospatoslogos9", {sv: "de tre vädjandena", m: "vädjande(n|na)?", d: t3("Tre sätt att övertyga: etos, patos och logos.", "Three ways to persuade: ethos, pathos and logos.", "ثلاث طرق للإقناع: etos و patos و logos."), ex: "De flesta annonser använder två av de tre.", tr: {en: "the three appeals", ar: "أساليب الإقناع الثلاثة"}});
word("avsandare9", {sv: "avsändare", m: "avsändar(e|en|ens|na)", d: t3("Den som har gjort texten eller annonsen och vill något med den.", "The one who made the text or advert and wants something with it.", "من أنشأ النص أو الإعلان وله غرض منه."), ex: "Avsändaren är företaget som säljer drycken.", tr: {en: "sender, source", ar: "المُرسل"}});

const canOf = (x: number, y: number, s = 1, c = "#d63b2f") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-18" y="-34" width="36" height="68" rx="9" fill="${c}"/><rect x="-18" y="-10" width="36" height="12" fill="#f7f3ea" opacity=".8"/><ellipse cy="-34" rx="18" ry="6" fill="#c0c7d4"/></g>`;
const adBoard = (x: number, y: number, body: string, bg = "#1f4fb0", w = 150, h = 108) => `<g transform="translate(${x} ${y})"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="${bg}"/>${body}<rect x="-5" y="${h / 2}" width="10" height="46" fill="#9aa4b5"/></g>`;

const P9D = [
  pic(floor(222, "#cbb894") + board(hand("reklam", 150, 66, 32, "#d63b2f") + hand("vem vill vad?", 150, 112, 26, "#1f4fb0")) + adult(66, 126, LENA, LENAH, 1.05) + kid(214, 136, SARA, SARAH, .95) + phone(262, 160, .6), "#eef4fb"),
  pic(`<rect width="300" height="300" fill="#dbeaf7"/>${floor(230, "#9aa4b5")}${adBoard(150, 128, hand("ORKA MER", 0, 0, 24, "#fff") + canOf(0, 34, .7, "#f2c94c"))}${kid(52, 208, AMIR, AMIRH, .8)}${kid(254, 208, NOAH, NOAHH, .8)}`, "#dbeaf7"),
  pic(floor(234, "#cbb894") + desk(30, 206, 240) + LAPTOP(118, 160, 1, hand("9/10", 0, -4, 26, "#1f4fb0")) + kid(226, 130, NOAH, NOAHH, .9) + hand("logos", 118, 52, 28, "#1f4fb0"), "#f1f6ec"),
  pic(`<rect width="300" height="300" fill="#f6ead6"/>${adBoard(150, 140, `<circle cy="-14" r="26" fill="#f1c7a3"/>${hand("ensam?", 0, 40, 24, "#fff")}`, "#7b5ea7", 160, 120)}${hand("patos", 150, 44, 32, "#d63b2f")}`, "#f6ead6"),
  pic(floor(230, "#cbb894") + adBoard(150, 130, `${kid(0, -8, "#f7f3ea", "#c9c9c9", .8)}${hand("expert", 0, 44, 22, "#fff")}`, "#2f8a4a", 160, 120) + hand("etos", 150, 48, 30, "#2f8a4a"), "#eef4fb"),
  pic(floor(226, "#cbb894") + board(hand("målgrupp?", 150, 62, 26, "#1f4fb0") + hand("budskap?", 150, 100, 26, "#2f8a4a") + hand("avsändare?", 150, 138, 26, "#d63b2f")) + kid(66, 136, AMIR, AMIRH, .95) + kid(130, 142, ELSA, ELSAH, .9) + adult(240, 128, LENA, LENAH, 1.05), "#f6f0fb"),
  pic(floor(234, "#cbb894") + desk(34, 204, 232) + paper(100, 154, -4, 4, .95) + kid(100, 94, SARA, SARAH, .9) + kid(216, 104, AMIR, AMIRH, .85) + hand("ÖPPET HUS", 150, 44, 26, "#1f4fb0"), "#fdf6e6"),
  pic(`<rect width="300" height="300" fill="#eaf4ff"/>${floor(228, "#9aa4b5")}${poster(96, 140, "9B VISAR", "#7cc4f0", 96)}${kid(216, 180, AMIR, AMIRH, .95)}${phone(256, 168, .6)}${hand("vem tjänar?", 150, 46, 26, "#d63b2f")}`, "#eaf4ff")];

const ADS: [string, string][] = [
  ["Nio av tio tandläkare rekommenderar vår tandkräm.", "l"],
  ["Studier visar att batteriet räcker 40 procent längre.", "l"],
  ["Jämför priserna själv: 12 kronor mot 19 kronor.", "l"],
  ["Tänk på hur ensam du blir utan appen.", "p"],
  ["Barnet i filmen gråter, och musiken blir långsam.", "p"],
  ["Känn doften av en söndag hos mormor.", "p"],
  ["Vi har bakat bröd i Hagaby sedan 1948.", "e"],
  ["Läkaren i vit rock säger att krämen är säker.", "e"],
  ["Landslagets målvakt använder samma handskar.", "e"]];
const APP: Record<string, [string, string, T3]> = {
  l: ["logos", "b", t3("Siffror, studier och jämförelser vädjar till förnuftet.", "Numbers, studies and comparisons appeal to reason.", "الأرقام والدراسات والمقارنات تخاطب العقل.")],
  p: ["patos", "r", t3("Känslor: rädsla, längtan, glädje, minnen.", "Feelings: fear, longing, joy, memories.", "العواطف: الخوف والحنين والفرح والذكريات.")],
  e: ["etos", "g", t3("Vem talar? En expert, en stjärna, ett gammalt bageri.", "Who is speaking? An expert, a star, an old bakery.", "من يتحدث؟ خبير أو نجم أو مخبز قديم.")]};
const MG: [string, string, string, string][] = [
  ["En energidryck med en skateboard och mörk musik.", "unga killar", "pensionärer", "småbarnsföräldrar"],
  ["En annons om billig barnmat i en app för blöjor.", "småbarnsföräldrar", "unga killar", "lärare"],
  ["Reklam för gymnasiets öppna hus på elevernas mobiler.", "elever i nian", "turister", "pensionärer"],
  ["En reklamfilm om halkfria skor och trygga promenader.", "pensionärer", "unga killar", "elever i nian"],
  ["En annons om billiga läroböcker i en lärartidning.", "lärare", "turister", "småbarnsföräldrar"]];

defineUnit({
  id: "sv9d", year: 9, ord: 4, title: t3("Källan i reklamen", "The source in the advert", "المصدر في الإعلان"), storyTitle: "Källan i reklamen",
  icon: icon(`<rect y="130" width="320" height="50" fill="#9aa4b5"/>${adBoard(96, 80, hand("ORKA MER", 0, 0, 22, "#fff") + canOf(0, 32, .6, "#f2c94c"))}${hand("etos", 240, 54, 28, "#2f8a4a")}${hand("patos", 240, 92, 28, "#d63b2f")}${hand("logos", 240, 130, 28, "#1f4fb0")}`, "#dbeaf7"),
  words: ["reklam", "målgrupp", "budskap", "logos", "patos", "etos", "påverkan9", "konsument"],
  terms: ["etospatoslogos9", "avsandare9"],
  story: [
    {text: ["”I dag ska vi utreda reklam”, sa Lena. ”Inte om den är bra eller dålig. Hur den arbetar.” Hon delade ut tre frågor på ett papper: Vem är avsändare? Vilken målgrupp vänder sig texten till? Vilket budskap finns bakom orden?",
      "”Reklam är den vanligaste texttypen ni möter”, sa hon. ”Ni läser hundra annonser om dagen och minns tre. Resten jobbar ändå.”"],
      pic: P9D[0], say: t3("Tre frågor om reklam. Vilka är de?", "Three questions about adverts. What are they?", "ثلاثة أسئلة عن الإعلان. ما هي؟")},
    {text: ["På vägen till matsalen stannade Amir vid en affisch i korridoren. En burk energidryck, mörk bakgrund och två ord: ORKA MER. Ingen text om socker, inget pris.",
      "”Vilken målgrupp?” frågade han Noah. ”Vi”, sa Noah direkt. ”Killar i nian som sover fem timmar och har prov på fredag.” Amir skrattade, men han kände hur budskapet redan hade landat: utan den här burken orkar du inte."],
      pic: P9D[1], say: t3("Vilken målgrupp har affischen, enligt Noah?", "What target group does the poster have, according to Noah?", "ما الفئة المستهدفة من الملصق بحسب نوح؟")},
    {text: ["Tillbaka i klassrummet ritade Lena tre ord på tavlan: etos, patos, logos. ”Tre gamla grekiska ord för tre sätt att övertyga. Ni kommer att se dem överallt när ni en gång har sett dem.”",
      "”Logos är förnuft”, sa hon. ”Siffror, studier, jämförelser. Nio av tio tandläkare rekommenderar. Frågan en konsument måste ställa är: nio av tio av hur många? Och vem betalade studien?”"],
      pic: P9D[2], say: t3("Vad är logos, och vilken fråga bör man ställa?", "What is logos, and which question should you ask?", "ما هو logos، وأي سؤال ينبغي أن تطرحه؟")},
    {text: ["”Patos är känslor”, fortsatte Lena och visade en reklamfilm. Ett barn satt ensamt vid ett fönster, regnet rann, musiken var långsam. Först i sista sekunden syntes vad filmen gällde: en mobiloperatör.",
      "Elsa torkade ögonen och blev arg på sig själv. ”Det är ju orättvist”, sa hon. ”De använder mina tårar för att sälja abonnemang.” ”Precis”, sa Lena. ”Och nu vet du det. Det är skillnaden.”"],
      pic: P9D[3], say: t3("Varför blir Elsa arg på sig själv?", "Why does Elsa get angry with herself?", "لماذا تغضب إلسا من نفسها؟")},
    {text: ["”Etos handlar om vem som talar”, sa Lena. ”En läkare i vit rock, en landslagsmålvakt, ett bageri som funnits sedan 1948. Avsändaren lånar ut sitt förtroende till varan.”",
      "Sara räckte upp handen. ”Men målvakten vet ju ingenting om handskar. Hon får betalt.” ”Då har du just granskat ett etos”, sa Lena. ”Fråga alltid: varför ska jag tro just den här personen?”"],
      pic: P9D[4], say: t3("Hur fungerar etos, och vad invänder Sara?", "How does ethos work, and what does Sara object?", "كيف يعمل etos، وبماذا تعترض سارة؟")},
    {text: ["De jämförde sedan tre annonser i grupp. Den första hade siffror och ett pris, den andra en solnedgång och en familj, den tredje en känd youtuber. Alla tre sålde samma sorts mobil.",
      "”Samma vara, tre vädjanden”, sa Amir. ”Alltså är påverkan inte en sak i varan. Den ligger i hur den presenteras.” Lena nickade långsamt. ”Skriv upp den slutsatsen. Den är hela lektionen.”"],
      pic: P9D[5], say: t3("Tre annonser säljer samma mobil. Vilken slutsats drar Amir?", "Three adverts sell the same phone. What conclusion does Amir draw?", "ثلاثة إعلانات تبيع الهاتف نفسه. ما الاستنتاج الذي يصل إليه أمير؟")},
    {text: ["Sista uppgiften var att göra reklam själva: en affisch för skolans öppna hus. Sara ville ha en studie om hur många som trivs i 9B. Noah ville ha en bild av sig själv som hoppade högt.",
      "”Och etos?” frågade Amir. ”Rektorn”, sa Sara. ”Nej”, sa Elsa. ”Elever. Ingen nia tror på en rektor, men alla tror på en nia.” Det blev tre rader text, ett foto av klassen och en siffra: 92 procent."],
      pic: P9D[6], say: t3("Varför väljer de elever och inte rektorn som avsändare?", "Why do they choose pupils and not the head teacher as the sender?", "لماذا يختارون طلابًا لا المدير كمُرسل؟")},
    {text: ["På kvällen låg Amir och tittade på reklamen i sin telefon. En annons för ett gymnasium gled förbi: glada ungdomar, en robot, orden ”framtiden börjar här”.",
      "Han satte sig upp. Vem är avsändare? Skolan själv. Vilken målgrupp? Jag. Vilket budskap? Att det är bråttom. Han la ner mobilen och tänkte att han hellre gick på öppet hus och tittade med egen blick. En konsument som frågar är svårare att styra än en konsument som bara skrollar."],
      pic: P9D[7], say: t3("Vad är syftet med den här faktatexten om reklam? Hur använder Amir den på sig själv?", "What is the purpose of this factual text about advertising? How does Amir use it on himself?", "ما هدف هذا النص المعلوماتي عن الإعلان؟ وكيف يستخدمه أمير على نفسه؟")}],
  wordsSay: t3("Ord för att granska reklam. Tryck på ett ord för betydelse och exempel.", "Words for examining advertising. Tap a word for the meaning and an example.", "كلمات لتحليل الإعلان. اضغط على كلمة لترى المعنى ومثالًا."),
  grammar: [
    {draw: () => [A.wipe(), A.tx(T("Tre sätt att övertyga", "Three ways to persuade", "ثلاث طرق للإقناع"), 400, 56, 36, "b"),
      A.p(R.line(400, 120, 560, 390, .3), "k", 3), A.p(R.line(560, 390, 240, 390, .3), "k", 3), A.p(R.line(240, 390, 400, 120, .3), "k", 3),
      A.tx("etos", 400, 110, 36, "g"), qt(T("vem talar?", "who is speaking?", "من يتحدث؟"), 400, 150, 24, "g"),
      A.tx("patos", 610, 410, 36, "r"), qt(T("vad känner du?", "what do you feel?", "بماذا تشعر؟"), 614, 448, 24, "r"),
      A.tx("logos", 196, 410, 36, "b"), qt(T("vad vet du?", "what do you know?", "ماذا تعرف؟"), 192, 448, 24, "b"),
      A.tx(T("De flesta annonser använder två eller tre samtidigt.", "Most adverts use two or three at the same time.", "معظم الإعلانات تستخدم اثنين أو ثلاثة في وقت واحد."), 400, 300, 24, "k")],
     say: t3("Etos övertygar med avsändarens trovärdighet, patos med känslor och logos med fakta och siffror. Orden är grekiska och mer än två tusen år gamla, men de syns i varje annons i din telefon.", "Ethos persuades with the sender's credibility, pathos with feelings and logos with facts and numbers. The words are Greek and over two thousand years old, but you can see them in every advert on your phone.", "etos يقنع بمصداقية المُرسل، و patos بالعواطف، و logos بالحقائق والأرقام. الكلمات يونانية عمرها أكثر من ألفي سنة، لكنها في كل إعلان على هاتفك.")},
    {draw: () => [A.wipe(), A.tx(T("Hitta vädjandet", "Find the appeal", "اكتشف أسلوب الإقناع"), 400, 56, 34, "b"),
      A.tx("”Nio av tio tandläkare rekommenderar den.”", 400, 150, 28, "k"), A.tx("logos", 400, 196, 32, "b"),
      A.tx("”Tänk på hur ensam du blir utan appen.”", 400, 280, 28, "k"), A.tx("patos", 400, 326, 32, "r"),
      A.tx("”Vi har bakat bröd i Hagaby sedan 1948.”", 400, 400, 28, "k"), A.tx("etos", 400, 446, 32, "g")],
     say: t3("Leta efter signalerna. Siffror och studier är logos. Ord som ensam, rädd och minns är patos. Ett namn, ett yrke eller ett årtal som ska ge förtroende är etos.", "Look for the signals. Numbers and studies are logos. Words like lonely, afraid and remember are pathos. A name, a job or a year meant to give trust is ethos.", "ابحث عن الإشارات: الأرقام والدراسات logos، وكلمات مثل وحيد وخائف وأتذكّر patos، والاسم أو المهنة أو السنة التي تمنح الثقة etos.")},
    {draw: () => [A.wipe(), A.tx(T("Tre frågor till varje annons", "Three questions for every advert", "ثلاثة أسئلة لكل إعلان"), 400, 56, 32, "b"),
      ...boxes([["Vem är avsändare?", "r"]], 160, 30), ...boxes([["Vilken målgrupp?", "b"]], 270, 30), ...boxes([["Vilket budskap?", "g"]], 380, 30),
      qt(T("Och sist: vem tjänar pengar på att jag tror det?", "And last: who makes money if I believe it?", "وأخيرًا: من يكسب المال إذا صدّقت؟"), 400, 462, 26, "k")],
     say: t3("Ställ alltid tre frågor till en annons: vem är avsändare, vilken målgrupp vänder den sig till och vilket budskap finns bakom orden? Då är du en konsument som granskar i stället för en som bara blir påverkad.", "Always ask three questions about an advert: who is the sender, which target group is it aimed at, and what message lies behind the words? Then you are a consumer who examines instead of one who is simply influenced.", "اطرح دائمًا ثلاثة أسئلة على الإعلان: من المُرسل؟ وإلى أي فئة يتوجه؟ وما الرسالة خلف الكلمات؟ حينها تكون مستهلكًا يحلّل لا مستهلكًا يتأثر فقط.")}],
  read: [
    {q: "Vilka tre frågor delar Lena ut om reklam?", o: ["Vem är avsändare, vilken målgrupp och vilket budskap?", "Vad kostar varan, var finns den och när?", "Vem har skrivit, när och hur länge?"], why: "Del 1: de tre frågorna på pappret."},
    {q: "Vad är logos?", o: ["Att övertyga med siffror, studier och jämförelser", "Att övertyga med känslor", "Att övertyga med en känd person"], why: "Del 3: ”Logos är förnuft … siffror, studier, jämförelser.”"},
    {q: "Vad gällde reklamfilmen med barnet vid fönstret?", o: ["En mobiloperatör", "En energidryck", "Ett bageri"], why: "Del 4: först i sista sekunden syns att det är en mobiloperatör."},
    {q: "Vad invänder Sara mot målvakten i handskreklamen?", o: ["Hon får betalt och kan egentligen inget om handskar.", "Hon är för ung.", "Hon spelar i ett annat land."], why: "Del 5: ”Men målvakten vet ju ingenting om handskar. Hon får betalt.”"},
    {q: "Vad hade de tre annonserna som klassen jämförde gemensamt?", o: ["De sålde samma sorts mobil med olika vädjanden.", "De var gjorda av samma elev.", "De hade alla en solnedgång."], why: "Del 6: samma vara, tre olika vädjanden."},
    {q: "Varför säger Lena att hundra annonser ”jobbar ändå”, fast man bara minns tre?", o: ["Påverkan sker även när man inte lägger märke till den.", "Annonserna är gjorda för att vara tråkiga.", "Hon menar att reklam inte fungerar alls."], why: "Reklamen behöver inte minnas för att verka. Det är därför texten vill göra läsaren medveten."},
    {q: "Varför blir Elsa arg efter reklamfilmen?", o: ["Hon märker att hennes känslor användes för att sälja något.", "Hon tyckte att musiken var för hög.", "Hon förstod inte vad filmen handlade om."], why: "Del 4: ”De använder mina tårar för att sälja abonnemang.”"},
    {q: "Varför väljer gruppen elever och inte rektorn som avsändare på affischen?", o: ["Elever har mer etos hos andra elever.", "Rektorn hade semester.", "Elever kostar mindre pengar."], why: "Del 7: ”Ingen nia tror på en rektor, men alla tror på en nia.” Trovärdigheten beror på vem som talar till vem."},
    {q: "Vad är syftet med en faktatext om reklam, som den här lektionen bygger på?", o: ["Att läsaren själv ska kunna granska budskap och avsändare", "Att läsaren ska slippa se reklam", "Att sälja en energidryck"], why: "Texten ger verktyg: etos, patos, logos och tre frågor. Ett granskande syfte, inte ett säljande."}],
  gram(lv, write) {
    if (write || lv === 2) {
      const [s, tag] = pick(ADS), [name] = APP[tag];
      return {kind: "text", ans: [name], show: name,
        q: [...head(t3("Vilket vädjande är det? Skriv etos, patos eller logos.", "Which appeal is it? Write etos, patos or logos.", "أي أسلوب إقناع؟ اكتب etos أو patos أو logos.")), ...svLines(s, 210, 32)],
        sol: [...svLines(s, 300, 28, "k"), A.tx(name, 400, 430, 46, APP[tag][1])], hint: {say: APP[tag][2], draw: []}};
    }
    if (lv === 1 && Math.random() < .45) {
      const [s, right, w1, w2] = pick(MG);
      return choice([right, w1, w2], right,
        [...head(t3("Vilken målgrupp vänder sig reklamen till?", "Which target group is the advert aimed at?", "إلى أي فئة يتوجه الإعلان؟")), ...svLines(s, 210, 32)],
        [...svLines(s, 300, 28, "k"), A.tx(right, 400, 430, 40, "g")],
        t3("Vem känner igen sig i bilden, musiken och orden?", "Who recognises themselves in the picture, the music and the words?", "من يجد نفسه في الصورة والموسيقى والكلمات؟"));
    }
    const [s, tag] = pick(ADS), [name] = APP[tag];
    const others = shuffle(Object.keys(APP).filter(k => k !== tag)).map(k => APP[k][0]);
    return choice([name, ...others], name,
      [...head(t3("Vilket vädjande använder meningen?", "Which appeal does the sentence use?", "أي أسلوب إقناع تستخدمه الجملة؟")), ...svLines(s, 210, 32)],
      [...svLines(s, 300, 28, "k"), A.tx(name, 400, 430, 46, APP[tag][1])], APP[tag][2]);
  },
  help: [{say: t3("Etos: vem talar? Patos: vad känner du? Logos: vad vet du?", "Ethos: who is speaking? Pathos: what do you feel? Logos: what do you know?", "etos: من يتحدث؟ patos: بماذا تشعر؟ logos: ماذا تعرف؟"),
    draw: () => [A.tx("etos – vem talar?", 400, 180, 40, "g"), A.tx("patos – vad känner du?", 400, 270, 40, "r"), A.tx("logos – vad vet du?", 400, 360, 40, "b")]}]
});

/* =============== unit 5: Personligt brev till gymnasiet (formellt brev) =============== */
word("ansokan", {sv: "ansökan (en)", m: "ansökan|ansökning(ar|arna|en)?", d: t3("De papper man skickar in när man söker en plats eller ett jobb.", "The papers you send in when you apply for a place or a job.", "الأوراق التي ترسلها عند التقديم لمكان أو عمل."), ex: "Hans ansökan skulle vara inne den femtonde februari.", tr: {en: "application", ar: "طلب تقديم"}, wrong: ["referens", "intresse"], gap: ["Sista dagen för", "ansökan", "var i februari."], gapForm: "ansökan", form: "en ansökan – ansökningar"});
word("intresse", {sv: "intresse (ett)", m: "intresse(t|n|na|ns)?", d: t3("Något man tycker om att lära sig mer om eller hålla på med.", "Something you like learning more about or doing.", "شيء تحب أن تتعلمه أو تمارسه."), ex: "Mitt största intresse är att bygga och programmera robotar.", tr: {en: "interest", ar: "اهتمام"}, syn: ["hobby"], wrong: ["erfarenhet", "egenskap"], gap: ["Skriv om ett", "intresse", "som hör till programmet."], gapForm: "intresse", form: "ett intresse – intressen"});
word("erfarenhet", {sv: "erfarenhet (en)", m: "erfarenhet(en|er|erna)?", d: t3("Det man har gjort tidigare och lärt sig av.", "What you have done before and learnt from.", "ما فعلته سابقًا وتعلمت منه."), ex: "Jag har erfarenhet av att leda ett lag.", tr: {en: "experience", ar: "خبرة"}, syn: ["vana"], wrong: ["intresse", "motivation"], gap: ["Han hade", "erfarenhet", "av att laga cyklar."], gapForm: "erfarenhet", form: "en erfarenhet – erfarenheter"});
word("egenskap", {sv: "egenskap (en)", m: "egenskap(en|er|erna)?", d: t3("Något som är typiskt för en person, till exempel tålmodig eller noggrann.", "Something typical of a person, for example patient or careful.", "صفة في الشخص، مثل الصبر أو الدقة."), ex: "Noggrann är en egenskap som passar tekniker.", tr: {en: "quality, trait", ar: "صفة"}, syn: ["drag"], wrong: ["erfarenhet", "referens"], gap: ["Nämn en", "egenskap", "och ge ett exempel på den."], gapForm: "egenskap", form: "en egenskap – egenskaper"});
word("motivation", {sv: "motivation (en)", m: "motivation(en)?", d: t3("Kraften som gör att man vill och orkar göra något.", "The force that makes you want to do something and keep going.", "الدافع الذي يجعلك تريد الاستمرار."), ex: "Min motivation är att jag vill bygga något som används.", tr: {en: "motivation", ar: "دافع"}, syn: ["drivkraft"], wrong: ["egenskap", "utbildning"], gap: ["Brevet ska visa din", "motivation", "."], gapForm: "motivation", form: "en motivation (ingen plural)"});
word("utbildning", {sv: "utbildning (en)", m: "utbildning(en|ar|arna)?", d: t3("Det man läser för att lära sig ett yrke eller ett ämne.", "What you study to learn a job or a subject.", "ما تدرسه لتتعلم مهنة أو مادة."), ex: "Utbildningen är tre år och slutar med ett projekt.", tr: {en: "education, programme of study", ar: "تعليم / برنامج دراسي"}, syn: ["kurs"], wrong: ["ansökan", "referens"], gap: ["Han sökte en", "utbildning", "med inriktning mot teknik."], gapForm: "utbildning", form: "en utbildning – utbildningar"});
word("ambitios", {sv: "ambitiös", m: "ambitiös(t|a)?", d: t3("Som vill nå långt och är beredd att arbeta för det.", "Wanting to get far and ready to work for it.", "طموح ومستعد للعمل من أجل هدفه."), ex: "Hon är ambitiös utan att trampa på andra.", tr: {en: "ambitious", ar: "طموح"}, syn: ["målmedveten"], opp: ["likgiltig"], wrong: ["främmande", "osäker"], gap: ["Jag är", "ambitiös", "och lämnar sällan något halvfärdigt."], gapForm: "ambitiös", form: "ambitiös – ambitiöst – ambitiösa"});
word("referens", {sv: "referens (en)", m: "referens(en|er|erna)?", d: t3("En person som kan svara på frågor om dig, till exempel en lärare.", "A person who can answer questions about you, for example a teacher.", "شخص يمكن أن يجيب عن أسئلة بشأنك، مثل معلّم."), ex: "Lena ställde upp som referens.", tr: {en: "referee, reference", ar: "جهة تزكية"}, wrong: ["mottagare", "ansökan"], gap: ["Längst ner skrev han sin", "referens", ": Lena Ek, lärare."], gapForm: "referens", form: "en referens – referenser"});
word("brevdel9", {sv: "brevets delar", m: "brevmall(en|ar)?", d: t3("Ett formellt brev har en fast ordning: hälsning, inledning, brödtext, avslutning, underskrift.", "A formal letter has a fixed order: greeting, opening, body, closing, signature.", "للرسالة الرسمية ترتيب ثابت: تحية، مقدمة، متن، خاتمة، توقيع."), ex: "Hej! … Jag heter … Med vänliga hälsningar, Amir", tr: {en: "the parts of a letter", ar: "أجزاء الرسالة"}});
word("halsningsfras9", {sv: "hälsningsfras", m: "hälsningsfras(en|er)?", d: t3("Orden man börjar och slutar ett brev med.", "The words you begin and end a letter with.", "الكلمات التي تبدأ وتنهي بها الرسالة."), ex: "Med vänliga hälsningar", tr: {en: "greeting phrase", ar: "عبارة التحية"}});
word("formellt9", {sv: "formellt språk", m: "formell(t|a)?", d: t3("Ett artigt och korrekt språk som man använder till någon man inte känner.", "Polite, correct language used to someone you don't know.", "لغة مهذبة وصحيحة تستخدمها مع شخص لا تعرفه."), ex: "Jag vill härmed ansöka om en plats.", tr: {en: "formal language", ar: "لغة رسمية"}});

const envelope = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-54" y="-34" width="108" height="68" rx="4" fill="#fff" stroke="#9aa4b5" stroke-width="2"/><path d="M-54 -34 L0 6 L54 -34" fill="none" stroke="#9aa4b5" stroke-width="2"/><rect x="34" y="-30" width="16" height="16" fill="#d63b2f"/></g>`;
const letterSheet = (x: number, y: number, s = 1, lines = 5) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-44" y="-58" width="88" height="116" rx="3" fill="#fff" stroke="#9aa4b5" stroke-width="2"/>${hand("Hej!", -24, -36, 18, "#1f4fb0")}${[...Array(lines)].map((_, i) => `<path d="M-32 ${-14 + i * 16} h${i === lines - 1 ? 40 : 64}" stroke="#9aa8c4" stroke-width="3"/>`).join("")}${hand("Amir", 16, 48, 18, "#1f4fb0")}</g>`;

const P9E = [
  pic(floor(222, "#cbb894") + board(hand("personligt brev", 150, 66, 28, "#1f4fb0") + hand("ansökan 15/2", 150, 112, 26, "#d63b2f")) + adult(66, 126, LENA, LENAH, 1.05) + kid(220, 136, AMIR, AMIRH, .95) + paper(262, 196, 8, 3, .5), "#eef4fb"),
  pic(`<rect width="300" height="300" fill="#eaf4ff"/>${floor(230, "#7cc08a")}${building(150, 226, 1, "#7cc4f0", "TEKNIK")}${kid(56, 212, AMIR, AMIRH, .8)}${hand("öppet hus", 150, 48, 28, "#1f4fb0")}`, "#eaf4ff"),
  pic(floor(234, "#cbb894") + desk(30, 206, 240) + LAPTOP(118, 160, 1, hand("Tjena!", 0, -2, 24, "#d63b2f")) + kid(228, 130, AMIR, AMIRH, .9) + hand("nej…", 118, 52, 28, "#d63b2f"), "#fdf6e6"),
  pic(floor(222, "#cbb894") + board(hand("hälsning", 150, 54, 22) + hand("inledning: varför", 150, 82, 22) + hand("brödtext: erfarenhet", 150, 110, 22) + hand("avslutning + namn", 150, 138, 22, "#2f8a4a")) + adult(64, 128, LENA, LENAH, 1.05) + kid(236, 138, AMIR, AMIRH, .9), "#f1f6ec"),
  pic(floor(236, "#cbb894") + desk(34, 204, 232) + letterSheet(106, 150, 1) + kid(216, 112, AMIR, AMIRH, .9) + hand("erfarenhet", 106, 46, 26, "#2f8a4a"), "#f6f0fb"),
  pic(floor(234, "#cbb894") + desk(30, 206, 240) + letterSheet(96, 152, .95) + kid(206, 118, SARA, SARAH, .9) + bubble(206, 54, 120, "visa, säg inte", 18, "#d35f8d"), "#fdf6e6"),
  pic(floor(222, "#cbb894") + adult(90, 130, LENA, LENAH, 1.05) + kid(214, 140, AMIR, AMIRH, .92) + paper(150, 176, -6, 3, .6) + hand("referens", 150, 52, 28, "#7b5ea7"), "#f6f0fb"),
  pic(`<rect width="300" height="300" fill="#dbeaf7"/>${floor(228, "#9aa4b5")}${envelope(150, 150, 1.1)}${kid(58, 206, AMIR, AMIRH, .8)}${hand("skickat", 150, 54, 30, "#2f8a4a")}${sun(254, 48, 22)}`, "#dbeaf7")];

const BREV: [string, string][] = [
  ["Tjena! Jag vill gå hos er.", "Hej! Jag vill härmed ansöka om en plats på teknikprogrammet."],
  ["Hör av dig snabbt typ.", "Jag ser fram emot att höra från er."],
  ["Jag är grym på datorer.", "Jag har goda kunskaper i programmering."],
  ["Ni får ringa min lärare om ni vill.", "Som referens anger jag min svensklärare Lena Ek."],
  ["Hälsningar, Amir", "Med vänliga hälsningar, Amir Haddad"],
  ["Jag skriver för att jag typ måste.", "Jag skriver därför att utbildningen passar mina intressen."],
  ["Fixar det mesta om man visar en gång.", "Jag lär mig nya uppgifter snabbt."]];
const DELAR: [string, string][] = [
  ["Hej! Mitt namn är Amir Haddad och jag går i klass 9B på Björkskolan.", "inledning"],
  ["Jag vill härmed ansöka om en plats på teknikprogrammet.", "inledning"],
  ["I två år har jag lagat cyklar i källaren och byggt en högtalare av gamla delar.", "brödtext"],
  ["En egenskap som mina lärare brukar nämna är att jag är noggrann.", "brödtext"],
  ["Min motivation är att jag vill bygga saker som andra faktiskt använder.", "brödtext"],
  ["Jag ser fram emot att höra från er.", "avslutning"],
  ["Med vänliga hälsningar, Amir Haddad", "avslutning"],
  ["Som referens anger jag min svensklärare Lena Ek.", "avslutning"]];
const FRAS: [string, string][] = [
  ["Med vänliga ___, Amir Haddad", "hälsningar"],
  ["Jag vill härmed ___ om en plats på teknikprogrammet.", "ansöka"],
  ["Jag ser fram ___ att höra från er.", "emot"],
  ["Som ___ anger jag min svensklärare Lena Ek.", "referens"],
  ["Jag skriver ___ att utbildningen passar mina intressen.", "därför"]];

defineUnit({
  id: "sv9e", year: 9, ord: 5, title: t3("Personligt brev till gymnasiet", "A personal letter to the upper secondary school", "رسالة شخصية إلى الثانوية"), storyTitle: "Personligt brev till gymnasiet",
  icon: icon(`<rect y="130" width="320" height="50" fill="#cbb894"/>${letterSheet(90, 86, 1.25)}${hand("Med vänliga", 220, 70, 26, "#1f4fb0")}${hand("hälsningar", 220, 102, 26, "#1f4fb0")}${hand("Amir", 220, 136, 26, "#2f8a4a")}`, "#eef4fb"),
  words: ["ansokan", "intresse", "erfarenhet", "egenskap", "motivation", "utbildning", "ambitios", "referens"],
  terms: ["brevdel9", "halsningsfras9", "formellt9"],
  story: [
    {text: ["I januari kom Lena in med en utskrift. ”Teknikgymnasiet har en inriktning med extra intag”, sa hon. ”Till den utbildningen räcker det inte med betyg. De vill ha ett personligt brev med er ansökan.”",
      "”Ett brev?” sa Noah. ”Till en skola?” ”Ett formellt brev”, sa Lena. ”Till någon ni inte känner, om något ni vill ha. Det är en av de nyttigaste texter ni någonsin kommer att skriva.”"],
      pic: P9E[0], say: t3("Vad kräver den här utbildningen, förutom betyg?", "What does this programme require, besides grades?", "ماذا يطلب هذا البرنامج إضافة إلى الدرجات؟")},
    {text: ["Amir hade varit på öppet hus i oktober, precis som han hade skrivit i sitt mål. Han hade sett verkstaden, robotarmen och en elev som svetsade med skyddsglasögon.",
      "Sedan dess hade han vetat vilket program han ville söka. Det var inte längre en lista med broschyrer, det var ett rum han ville tillbaka till."],
      pic: P9E[1], say: t3("Varför vet Amir nu vilket program han vill söka?", "Why does Amir now know which programme he wants to apply for?", "لماذا يعرف أمير الآن أي برنامج يريد؟")},
    {text: ["Hans första utkast tog fyra minuter. ”Tjena! Jag vill gå hos er. Jag är grym på datorer. Hör av dig snabbt typ.”",
      "Han läste om det och fick ont i magen. Det var hans vanliga röst, den han skrev till Sara med. Men mottagaren var en rektor han aldrig hade träffat, och till en främmande mottagare passar ett annat språk."],
      pic: P9E[2], say: t3("Vad är fel med Amirs första utkast?", "What is wrong with Amir's first draft?", "ما الخطأ في مسودة أمير الأولى؟")},
    {text: ["Lena ritade brevets delar på tavlan: hälsningsfras, inledning med syftet, brödtext med erfarenhet och egenskaper, avslutning, underskrift med namn och kontakt.",
      "”Inledningen svarar på varför du skriver”, sa hon. ”Brödtexten svarar på varför just du. Avslutningen är artig och kort. Och stavfel i ett brev om noggrannhet är dyrare än i någon annan text.”"],
      pic: P9E[3], say: t3("Vad svarar inledningen på, och vad svarar brödtexten på?", "What does the opening answer, and what does the body answer?", "عمّ تجيب المقدمة، وعمّ يجيب المتن؟")},
    {text: ["Amir skrev om allt. ”Mitt största intresse är att bygga och programmera. I två år har jag lagat cyklar i källaren, och förra våren byggde jag en högtalare av gamla delar. Jag har alltså erfarenhet av att ta isär saker och få dem att fungera igen.”",
      "Sedan kom egenskaperna. Han skrev ambitiös, men strök det och skrev i stället: ”Jag lämnar sällan något halvfärdigt. Min motivation är att jag vill bygga saker som andra faktiskt använder.”"],
      pic: P9E[4], say: t3("Varför stryker Amir ordet ambitiös och skriver något annat?", "Why does Amir cross out the word ambitious and write something else?", "لماذا يحذف أمير كلمة «طموح» ويكتب غيرها؟")},
    {text: ["Sara läste igenom brevet. ”Du skriver att du är noggrann”, sa hon. ”Visa det i stället. Berätta om högtalaren och hur många gånger du löd om kabeln.”",
      "”Visa, säg inte”, sa Amir. ”Som i novellen.” ”Precis”, sa Sara. ”Ett brev är också en berättelse. Skillnaden är att du inte får hitta på.”"],
      pic: P9E[5], say: t3("Vad menar Sara med ”visa, säg inte”?", "What does Sara mean by ”show, don't tell”?", "ماذا تقصد سارة بـ«أظهر ولا تقل»؟")},
    {text: ["Till sist behövde han en referens. Han frågade Lena, som läste brevet en gång till och sedan sa ja. ”Skriv mitt namn, min titel och min skolmejl”, sa hon. ”En referens utan kontaktuppgifter är ingen referens.”",
      "Hon strök också två saker: en mening om att han var ”helt okej i matte” och en smiley. ”Det där hör hemma i ett sms”, sa hon. ”Inte i en ansökan.”"],
      pic: P9E[6], say: t3("Vad måste stå med om en referens, och vad stryker Lena?", "What must a reference include, and what does Lena cross out?", "ماذا يجب أن تتضمنه جهة التزكية، وماذا تحذف لينا؟")},
    {text: ["Den fjortonde februari läste Amir brevet en sista gång. Hälsningsfras, syfte, erfarenhet, egenskaper, en artig avslutning, namn, telefonnummer, referens. Inga smileys. Två stavfel som han hittade i nästa sista stund.",
      "Han tryckte på skicka. Sedan satt han kvar en stund med en konstig blandning av hopp och tomhet. Ansökan var inne. Nu var det inte längre hans tur att göra något, och det var en känsla han fick lära sig att stå ut med."],
      pic: P9E[7], say: t3("Vilket syfte har ett personligt brev, och hur känner Amir sig efteråt?", "What is the purpose of a personal letter, and how does Amir feel afterwards?", "ما هدف الرسالة الشخصية، وكيف يشعر أمير بعدها؟")}],
  wordsSay: t3("Ord för en ansökan. Tryck på ett ord för betydelse, böjning och exempel.", "Words for an application. Tap a word for the meaning, the forms and an example.", "كلمات لطلب التقديم. اضغط على كلمة لترى المعنى والصيغ ومثالًا."),
  grammar: [
    {draw: () => [A.wipe(), A.tx(T("Brevets delar", "The parts of the letter", "أجزاء الرسالة"), 400, 54, 34, "b"),
      ...boxes([["1. Hälsningsfras: Hej!", "b"]], 130, 26), ...boxes([["2. Inledning: varför jag skriver", "g"]], 218, 26),
      ...boxes([["3. Brödtext: erfarenhet och egenskaper", "o"]], 306, 26), ...boxes([["4. Avslutning: artig och kort", "r"]], 394, 26),
      ...boxes([["5. Underskrift: namn, telefon, referens", "b"]], 470, 24)],
     say: t3("Ett formellt brev följer en ordning. Hälsningen, sedan syftet med brevet, sedan det som gör just dig lämplig, sedan en kort artig avslutning och till sist ditt namn med kontaktuppgifter och referens.", "A formal letter follows an order. The greeting, then why you are writing, then what makes you the right person, then a short polite closing, and finally your name with contact details and a reference.", "تتبع الرسالة الرسمية ترتيبًا: التحية، ثم سبب الكتابة، ثم ما يجعلك مناسبًا، ثم خاتمة قصيرة مهذبة، وأخيرًا اسمك ومعلومات التواصل وجهة التزكية.")},
    {draw: () => [A.wipe(), A.tx(T("Informellt → formellt", "Informal → formal", "غير رسمي ← رسمي"), 400, 56, 34, "b"),
      A.tx("Tjena! Jag vill gå hos er.", 400, 150, 28, "r"), A.arrow(400, 172, 400, 200, "k"),
      A.tx("Hej! Jag vill härmed ansöka om en plats.", 400, 236, 28, "g"),
      A.tx("Hör av dig snabbt typ.", 400, 330, 28, "r"), A.arrow(400, 352, 400, 380, "k"),
      A.tx("Jag ser fram emot att höra från er.", 400, 416, 28, "g"),
      qt(T("Samma budskap, annan kostym.", "The same message, a different suit.", "الرسالة نفسها بثوب مختلف."), 400, 470, 24, "k")],
     say: t3("Formellt språk är inte finare, det är anpassat. Till en främmande mottagare använder du hela ord, ni-form och fasta artiga fraser. Inga förkortningar, inga smileys, inget typ och liksom.", "Formal language is not posher, it is adapted. To a reader you don't know you use whole words, the ni form and fixed polite phrases. No abbreviations, no smileys, no typ or liksom.", "اللغة الرسمية ليست أرقى بل أنسب. مع مُرسَل إليه لا تعرفه تستخدم كلمات كاملة وصيغة ni وعبارات مهذبة ثابتة، بلا اختصارات ولا رموز ولا «typ».")},
    {draw: () => [A.wipe(), A.tx(T("Visa, säg inte", "Show, don't tell", "أظهر ولا تقل"), 400, 58, 36, "b"),
      A.tx("✗  Jag är noggrann och ambitiös.", 400, 170, 30, "r"), A.p(R.line(200, 160, 600, 160, .3), "r", 3),
      A.tx("✓  Jag lödde om kabeln fyra gånger", 400, 290, 30, "g"), A.tx("innan högtalaren lät rätt.", 400, 340, 30, "g"),
      qt(T("Ett exempel är värt tre adjektiv.", "One example is worth three adjectives.", "مثال واحد يعدل ثلاث صفات."), 400, 450, 26, "k")],
     say: t3("Alla skriver att de är ambitiösa och noggranna. Den som vill bli trodd ger ett exempel i stället: vad du gjorde, hur länge och vad som blev resultatet. Då får läsaren se egenskapen i arbete.", "Everybody writes that they are ambitious and careful. If you want to be believed, give an example instead: what you did, for how long and what came out of it. Then the reader sees the quality at work.", "الجميع يكتب أنه طموح ودقيق. ومن يريد أن يُصدَّق يقدّم مثالًا: ماذا فعلت وكم استمرّ وما النتيجة. حينها يرى القارئ الصفة في العمل.")}],
  read: [
    {q: "Vad vill Teknikgymnasiets extra intag ha förutom betyg?", o: ["Ett personligt brev med ansökan", "Ett intyg från en läkare", "Ett foto av eleven"], why: "Del 1: ”De vill ha ett personligt brev med er ansökan.”"},
    {q: "Vad hade Amir gjort i oktober?", o: ["Varit på öppet hus på Teknikgymnasiet", "Skickat in sin ansökan", "Bytt klass"], why: "Del 2: han hade varit på öppet hus, som han skrivit i sitt mål."},
    {q: "Vilka delar ritar Lena på tavlan?", o: ["Hälsningsfras, inledning, brödtext, avslutning, underskrift", "Rubrik, bild, källor, litteraturlista", "Fråga, argument, vägning, slutsats"], why: "Del 4: brevets fem delar."},
    {q: "Vilken erfarenhet skriver Amir om?", o: ["Att han har lagat cyklar och byggt en högtalare", "Att han har jobbat i en butik", "Att han har tränat ett fotbollslag"], why: "Del 5: cyklarna i källaren och högtalaren av gamla delar."},
    {q: "Vad stryker Lena i brevet?", o: ["En mening om att han var ”helt okej i matte” och en smiley", "Hela brödtexten", "Hans telefonnummer"], why: "Del 7: det hör hemma i ett sms, inte i en ansökan."},
    {q: "Varför får Amir ont i magen av sitt första utkast?", o: ["Han märker att språket passar en kompis, inte en okänd rektor.", "Han har glömt sitt namn.", "Brevet var för långt."], why: "Del 3: det var rösten han skriver till Sara med, men mottagaren är en främmande rektor."},
    {q: "Varför stryker Amir ordet ambitiös?", o: ["Han visar hellre egenskapen med ett exempel.", "Han tycker inte att han är ambitiös.", "Ordet är felstavat."], why: "Del 5 och sista grammatikbilden: ett exempel är starkare än ett adjektiv om sig själv."},
    {q: "Vad menar Lena med att en referens utan kontaktuppgifter inte är någon referens?", o: ["Mottagaren måste kunna nå personen för att den ska betyda något.", "Referenser är alltid onödiga.", "Lena vill inte vara referens."], why: "Del 7: namn, titel och mejladress måste finnas med, annars kan ingen fråga."},
    {q: "Vad är syftet med ett personligt brev i en ansökan?", o: ["Att visa vem du är och varför just du passar utbildningen", "Att berätta en spännande historia med öppet slut", "Att undersöka en fråga från två sidor"], why: "Brevet ska övertyga en okänd mottagare om att du passar: syfte, erfarenhet, egenskaper, artig form."}],
  gram(lv, write) {
    if (write || lv === 2) {
      const [s, w] = pick(FRAS);
      return {kind: "text", ans: [w], show: w,
        q: [...head(t3("Skriv ordet som saknas i den artiga frasen.", "Write the word missing from the polite phrase.", "اكتب الكلمة الناقصة في العبارة المهذبة.")), ...svLines(s, 210, 36)],
        sol: svLines(s.replace("___", w), 400, 34, "g"),
        hint: {say: t3("Fasta fraser i brev: Med vänliga hälsningar, Jag vill härmed ansöka, Jag ser fram emot.", "Fixed phrases in letters: Med vänliga hälsningar, Jag vill härmed ansöka, Jag ser fram emot.", "عبارات ثابتة في الرسائل: Med vänliga hälsningar و Jag vill härmed ansöka و Jag ser fram emot."), draw: []}};
    }
    if (lv === 1) {
      const [s, part] = pick(DELAR);
      const others = shuffle(["inledning", "brödtext", "avslutning"].filter(p => p !== part));
      return choice([part, ...others], part,
        [...head(t3("Var i brevet hör meningen hemma?", "Where in the letter does the sentence belong?", "في أي جزء من الرسالة تنتمي الجملة؟")), ...svLines(s, 210, 32)],
        [...svLines(s, 300, 28, "k"), A.tx(part, 400, 430, 44, "g")],
        t3("Inledning = varför jag skriver. Brödtext = varför just jag. Avslutning = artig och kort.", "Opening = why I am writing. Body = why me. Closing = polite and short.", "المقدمة: لماذا أكتب. المتن: لماذا أنا. الخاتمة: مهذبة وقصيرة."));
    }
    const [inf, form] = pick(BREV), other = pick(BREV.filter(b => b[0] !== inf))[0];
    return choice([form, inf, other], form,
      [...head(t3("Vilken mening passar i ett formellt brev?", "Which sentence fits in a formal letter?", "أي جملة تناسب رسالة رسمية؟")), qt(T("mottagare: en rektor du inte känner", "reader: a head teacher you don't know", "المُرسَل إليه: مدير لا تعرفه"), 400, 150, 26, "r")],
      [...svLines(form, 360, 32, "g"), A.tx(T("formellt språk", "formal language", "لغة رسمية"), 400, 460, 30, "b")],
      t3("Formellt: hela ord, artiga fraser, inget typ, snabbt eller grym.", "Formal: whole words, polite phrases, no typ, snabbt or grym.", "الرسمي: كلمات كاملة وعبارات مهذبة، بلا typ أو snabbt أو grym."));
  },
  help: [{say: t3("Hälsning → varför jag skriver → varför just jag → artig avslutning → namn och referens.", "Greeting → why I am writing → why me → polite closing → name and reference.", "تحية ← لماذا أكتب ← لماذا أنا ← خاتمة مهذبة ← الاسم وجهة التزكية."),
    draw: () => [A.tx("Hej!", 400, 150, 36, "b"), A.tx("Jag vill härmed ansöka …", 400, 230, 34, "g"), A.tx("I två år har jag …", 400, 310, 34, "o"), A.tx("Med vänliga hälsningar", 400, 390, 34, "r")]}]
});

/* =============== unit 6: Dialekter i Sverige (variation i språket) =============== */
word("rikssvenska", {sv: "rikssvenska (en)", m: "rikssvensk(a|an)", d: t3("Den svenska som används i nyheter och läroböcker, utan tydlig dialekt.", "The Swedish used in the news and in textbooks, without a clear dialect.", "السويدية المستخدمة في الأخبار والكتب المدرسية، بلا لهجة واضحة."), ex: "På nyheterna talas oftast rikssvenska.", tr: {en: "standard Swedish", ar: "السويدية المعيارية"}, syn: ["standardsvenska"], opp: ["dialekt"], wrong: ["slang", "uttal"], gap: ["I läroböcker skrivs texterna på", "rikssvenska", "."], gapForm: "rikssvenska", form: "en rikssvenska (ingen plural)"});
word("uttal", {sv: "uttal (ett)", m: "uttal(et|en)?", d: t3("Hur ord låter när man säger dem.", "How words sound when you say them.", "كيف تُلفظ الكلمات."), ex: "Hennes uttal av r hördes direkt.", tr: {en: "pronunciation", ar: "لفظ"}, wrong: ["tonfall", "stavning"], gap: ["Skillnaden hörs tydligast i", "uttalet", "."], gapForm: "uttalet", form: "ett uttal – uttal"});
word("slang", {sv: "slang (en)", m: "slang(en|ord(et|en)?)?", d: t3("Ord som en grupp använder inbördes och som ofta byts ut snabbt.", "Words a group uses among themselves and which often change fast.", "كلمات تستخدمها مجموعة بينها وتتغير سريعًا."), ex: "Lärarna förstod inte hälften av klassens slang.", tr: {en: "slang", ar: "عامية / لغة دارجة"}, wrong: ["dialekt", "rikssvenska"], gap: ["Ord som gött och fett är", "slang", "."], gapForm: "slang", form: "en slang – slangord"});
word("sociolekt", {sv: "sociolekt (en)", m: "sociolekt(en|er|erna)?", d: t3("Språket i en grupp som hör ihop genom ålder, yrke eller intresse.", "The language of a group that belongs together through age, job or interest.", "لغة مجموعة تجمعها السن أو المهنة أو الاهتمام."), ex: "Läkare har en egen sociolekt, och nior har en annan.", tr: {en: "sociolect", ar: "لهجة اجتماعية"}, wrong: ["region", "uttal"], gap: ["Språket i en grupp kallas", "sociolekt", "."], gapForm: "sociolekt", form: "en sociolekt – sociolekter"});
word("region", {sv: "region (en)", m: "region(en|er|erna|al|alt|ala)?", d: t3("En del av ett land, ett område.", "A part of a country, an area.", "جزء من بلد، منطقة."), ex: "Varje region har sina egna ord.", tr: {en: "region", ar: "منطقة"}, syn: ["landsdel"], wrong: ["sociolekt", "variation"], gap: ["Dialekter hör till en", "region", ", inte till en ålder."], gapForm: "region", form: "en region – regioner"});
word("variation", {sv: "variation (en)", m: "variation(en|er|erna)?", d: t3("Att något finns i flera olika former.", "That something exists in several different forms.", "أن يوجد الشيء بأشكال مختلفة."), ex: "Variation är normalt i alla levande språk.", tr: {en: "variation", ar: "تنوّع"}, syn: ["skillnad"], wrong: ["fördom", "region"], gap: ["Ett levande språk har alltid", "variation", "."], gapForm: "variation", form: "en variation – variationer"});
word("fordom", {sv: "fördom (en)", m: "fördom(en|ar|arna|sfull|sfullt)?", d: t3("En färdig åsikt om någon innan man vet något om personen.", "A ready-made opinion about someone before you know anything about them.", "رأي جاهز عن شخص قبل أن تعرف عنه شيئًا."), ex: "Att skratta åt en dialekt är en fördom, inte ett argument.", tr: {en: "prejudice", ar: "حكم مسبق"}, wrong: ["variation", "tonfall"], gap: ["Bakom skrattet låg en", "fördom", "om hur man ska låta."], gapForm: "fördom", form: "en fördom – fördomar"});
word("tonfall", {sv: "tonfall (ett)", m: "tonfall(et|en)?", d: t3("Hur rösten går upp och ner och vad den avslöjar.", "How the voice goes up and down, and what it reveals.", "كيف يرتفع الصوت وينخفض وما يكشفه."), ex: "Hans tonfall var vänligt, men orden var elaka.", tr: {en: "tone of voice", ar: "نبرة الصوت"}, syn: ["röstläge"], wrong: ["uttal", "slang"], gap: ["Man hör i hennes", "tonfall", "att hon menar allvar."], gapForm: "tonfall", form: "ett tonfall – tonfall"});
word("dialektord9", {sv: "dialektord", m: "dialektord(et|en)?", d: t3("Ett ord som används i en viss del av landet.", "A word used in a certain part of the country.", "كلمة تُستخدم في منطقة معينة."), ex: "påg (Skåne) = pojke", tr: {en: "dialect word", ar: "كلمة لهجية"}});
word("standardsprak9", {sv: "standardspråk", m: "standardspråk(et|en)?", d: t3("Den form av språket som används i skolan, i myndighetstexter och i nyheter.", "The form of the language used at school, by authorities and in the news.", "صورة اللغة المستخدمة في المدرسة والدوائر الرسمية والأخبار."), ex: "Rikssvenska är ett standardspråk.", tr: {en: "standard language", ar: "اللغة المعيارية"}});

const bubbleWord = (x: number, y: number, s: string, c = "#1f4fb0") => `<g><ellipse cx="${x}" cy="${y}" rx="40" ry="22" fill="#fff" stroke="${c}" stroke-width="3"/>${hand(s, x, y + 7, 20, c)}</g>`;
const radioMic = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-9" y="-6" width="18" height="42" rx="6" fill="#33415c"/><rect x="-14" y="-34" width="28" height="34" rx="14" fill="#5b6476"/><path d="M-14 -26 h28 M-14 -18 h28 M-14 -10 h28" stroke="#9aa4b5" stroke-width="2"/></g>`;

const P9F = [
  pic(floor(222, "#cbb894") + board(hand("dialekter", 150, 66, 32, "#1f4fb0") + hand("vems svenska är rätt?", 150, 112, 22, "#d63b2f")) + adult(66, 126, LENA, LENAH, 1.05) + kid(216, 136, SARA, SARAH, .95) + kid(266, 196, AMIR, AMIRH, .6), "#eef4fb"),
  pic(`<rect width="300" height="300" fill="#eaf4ff"/>${mapSE(172, 158, 1)}${bubbleWord(66, 80, "glytt", "#2f8a4a")}${bubbleWord(60, 190, "la", "#7b5ea7")}${bubbleWord(128, 272, "påg", "#d63b2f")}`, "#eaf4ff"),
  pic(floor(230, "#cbb894") + desk(34, 200, 232) + LAPTOP(118, 156, 1, hand("Skåne", 0, -2, 22, "#1f4fb0")) + kid(226, 126, SARA, SARAH, .9) + bubbleWord(70, 70, "rälig", "#d63b2f"), "#f1f6ec"),
  pic(`<rect width="300" height="300" fill="#dbeaf7"/>${floor(228, "#9aa4b5")}${radioMic(220, 150, 1.2)}${kid(84, 170, "#c0603a", "#1d2433", .95)}${hand("rikssvenska", 120, 54, 26, "#1f4fb0")}`, "#dbeaf7"),
  pic(floor(232, "#cbb894") + kid(80, 150, AMIR, AMIRH, .95) + kid(206, 150, NOAH, NOAHH, .95) + bubble(80, 66, 124, "fett gött", 20, "#2f8a4a") + bubble(214, 70, 108, "sjukt bra", 20, "#7b5ea7"), "#fdf6e6"),
  pic(`<rect width="300" height="300" fill="#eaf4ff"/>${floor(230, "#7cc08a")}${building(150, 226, 1, "#7cc4f0", "TEKNIK")}${sad(54, 206, AMIR, AMIRH, .8)}${hand("”säg det igen”", 150, 48, 24, "#d63b2f")}`, "#eaf4ff"),
  pic(floor(222, "#cbb894") + board(hand("dialekt = region", 150, 62, 24, "#1f4fb0") + hand("sociolekt = grupp", 150, 98, 24, "#2f8a4a") + hand("slang = snabb", 150, 134, 24, "#d63b2f")) + adult(70, 128, LENA, LENAH, 1.05) + kid(230, 138, AMIR, AMIRH, .92), "#f6f0fb"),
  pic(floor(234, "#cbb894") + desk(36, 204, 228) + paper(104, 154, -4, 5, .95) + kid(104, 94, AMIR, AMIRH, .9) + kid(216, 106, SARA, SARAH, .85) + hand("mitt uttal", 150, 44, 26, "#2f8a4a"), "#fdf6e6")];

const DIA: [string, string, string, string, string][] = [
  ["påg", "pojke", "Skåne", "flicka", "cykel"],
  ["glytt", "barn", "Norrland", "gubbe", "hund"],
  ["la", "ju", "Göteborg", "inte", "snabbt"],
  ["rälig", "otäck", "Småland", "rolig", "hungrig"],
  ["tjôta", "prata", "Norrland", "springa", "sova"],
  ["gôrgott", "mycket gott", "Göteborg", "ganska dåligt", "alldeles kallt"],
  ["hynna", "hinna", "Dalarna", "hoppa", "hälsa"]];
const VAR: [string, string][] = [
  ["Han säger påg i stället för pojke, som i Skåne.", "dialekt"],
  ["Hennes r hörs tydligt för att hon är uppvuxen i Småland.", "dialekt"],
  ["I Göteborg lägger de in la i meningen.", "dialekt"],
  ["Nian säger fett gött om allt som är bra.", "slang"],
  ["Orden byts ut varje år och de äldre förstår dem inte.", "slang"],
  ["Läkarna på mötet säger anamnes och status.", "sociolekt"],
  ["Fotbollsspelarna pratar om press och djupledslöpning.", "sociolekt"],
  ["Lärarna i personalrummet säger formativ bedömning.", "sociolekt"]];

defineUnit({
  id: "sv9f", year: 9, ord: 6, title: t3("Dialekter i Sverige", "Dialects in Sweden", "اللهجات في السويد"), storyTitle: "Dialekter i Sverige",
  icon: icon(`<rect y="140" width="320" height="40" fill="#7cc08a"/>${mapSE(90, 96, .78)}${hand("påg?", 212, 62, 30, "#d63b2f")}${hand("glytt?", 232, 108, 30, "#2f8a4a")}${hand("la?", 206, 152, 30, "#7b5ea7")}`, "#eaf4ff"),
  words: ["rikssvenska", "uttal", "slang", "sociolekt", "region", "variation", "fordom", "tonfall"],
  terms: ["dialektord9", "standardsprak9"],
  story: [
    {text: ["”Sista temat före våren”, sa Lena. ”Språklig variation. Vi ska jämföra dialekter, slang och det som brukar kallas rikssvenska, och vi ska ställa en obekväm fråga: vems svenska räknas som den rätta?”",
      "Sara räckte upp handen innan Lena hade skrivit klart. ”Min kusin i Malmö säger påg i stället för pojke. Min mormor säger att han talar fel.” ”Bra exempel”, sa Lena. ”Vi börjar där.”"],
      pic: P9F[0], say: t3("Vilken obekväm fråga ställer Lena?", "Which uncomfortable question does Lena ask?", "أي سؤال محرج تطرحه لينا؟")},
    {text: ["De ritade en karta över Sverige och satte ord på den. Påg i Skåne, glytt i Norrland, la i Göteborg, rälig i Småland. Varje region hade sina egna ord, och de flesta orden var hundratals år gamla.",
      "”Ett dialektord är inte ett fel som har smugit sig in”, sa Lena. ”Det är ofta äldre än ordet i läroboken. Variation är inte sönderfall. Det är hur språk lever.”"],
      pic: P9F[1], say: t3("Vad säger Lena om dialektord och variation?", "What does Lena say about dialect words and variation?", "ماذا تقول لينا عن الكلمات اللهجية والتنوّع؟")},
    {text: ["Sara ringde upp sin kusin och spelade in en minut. Klassen lyssnade. Orden var nästan samma, men uttalet var annorlunda: r:et, vokalerna, och ett tonfall som gick uppåt i slutet av meningarna.",
      "”Jag förstår varje ord”, sa Elsa förvånat. ”Det är bara musiken som är ny.” ”Då har du beskrivit en dialekt ganska exakt”, sa Lena."],
      pic: P9F[2], say: t3("Vad är annorlunda hos kusinen: orden eller uttalet?", "What is different about the cousin: the words or the pronunciation?", "ما المختلف عند القريب: الكلمات أم اللفظ؟")},
    {text: ["Sedan lyssnade de på nyheterna. ”Det här kallas rikssvenska, eller standardspråk”, sa Lena. ”Det är inte en finare svenska. Det är den variant som skolan och myndigheterna har valt, för att alla ska förstå den.”",
      "”Men den är ju också en dialekt”, sa Amir. ”Stockholmsdialekt som blev chef”, sa Lena och skrattade. ”Ungefär så, ja. Ett standardspråk är ett beslut, inte en naturlag.”"],
      pic: P9F[3], say: t3("Är rikssvenska finare än andra varianter, enligt Lena?", "Is standard Swedish finer than other varieties, according to Lena?", "هل السويدية المعيارية أرقى من غيرها بحسب لينا؟")},
    {text: ["På rasten gjorde klassen en lista på sin egen slang. Fett, gött, sjukt, cringe. Noah tyckte att gött var skånska, Elsa att det var göteborgska, och Amir att hans storebror sa det redan 2016.",
      "”Slang hör inte till en region”, sa Lena efteråt. ”Den hör till en grupp. Språket i en grupp kallas sociolekt: nior har en, läkare har en, fotbollsspelare har en. Och slangorden byts ut snabbast av allt, ofta inom fem år.”"],
      pic: P9F[4], say: t3("Vad är skillnaden mellan dialekt och sociolekt?", "What is the difference between a dialect and a sociolect?", "ما الفرق بين اللهجة واللهجة الاجتماعية؟")},
    {text: ["Sedan blev det tyst, för Amir berättade något. På öppet hus på Teknikgymnasiet hade en elev härmat hans uttal och sagt: ”säg det igen”. De andra hade skrattat. Amir hade skrattat med, och sedan gått därifrån.",
      "”Jag tänkte att jag borde öva bort det”, sa han. ”Mitt uttal, alltså.” Ingen i klassen sa något på flera sekunder."],
      pic: P9F[5], say: t3("Vad hände med Amir på öppet hus, och vad tänkte han efteråt?", "What happened to Amir at the open house, and what did he think afterwards?", "ماذا حدث لأمير في اليوم المفتوح، وبماذا فكّر بعده؟")},
    {text: ["”Det du mötte var en fördom”, sa Lena. ”Inte ett språkfel. Studier visar att vi bedömer människors intelligens efter deras uttal, och att vi gör det utan att märka det. Det är inte språket som är problemet. Det är öronen.”",
      "”Ska jag ändra mitt uttal eller inte?” frågade Amir. ”Det är ditt beslut, inte mitt”, sa Lena. ”Men gör det för att du vill, inte för att någon skrattade. Och vet att varje gång du lägger om ditt språk till en ny situation är det en förmåga, inte ett fel.”"],
      pic: P9F[6], say: t3("Varför kallar Lena skrattet en fördom?", "Why does Lena call the laughter a prejudice?", "لماذا تسمّي لينا الضحك حكمًا مسبقًا؟")},
    {text: ["Till redovisningen skrev Amir och Sara en faktatext om språklig variation i Sverige, med en karta, tre ljudfiler och en slutsats: skillnader i uttal och ord är regionala och sociala, inte bättre eller sämre.",
      "Sist i texten stod en mening som Amir hade skrivit själv: ”Den som ska söka ett gymnasium behöver flera språk i munnen, och ett av dem får gärna vara hemmets.” Lena läste den två gånger och satte ett litet kryss i marginalen. Det betydde, visste de nu, att hon tyckte att något var sant."],
      pic: P9F[7], say: t3("Vilket syfte har deras faktatext, och vad menar Amir med flera språk i munnen?", "What is the purpose of their factual text, and what does Amir mean by several languages in your mouth?", "ما هدف نصهما المعلوماتي، وماذا يعني أمير بعدة لغات في الفم؟")}],
  wordsSay: t3("Ord om språklig variation. Tryck på ett ord för betydelse och exempel.", "Words about variation in language. Tap a word for the meaning and an example.", "كلمات عن التنوّع اللغوي. اضغط على كلمة لترى المعنى ومثالًا."),
  grammar: [
    {draw: () => [A.wipe(), A.tx(T("Dialektord och rikssvenska", "Dialect words and standard Swedish", "كلمات لهجية والسويدية المعيارية"), 400, 54, 30, "b"),
      ...[["påg", "pojke", "Skåne"], ["glytt", "barn", "Norrland"], ["la", "ju", "Göteborg"], ["rälig", "otäck", "Småland"]].flatMap((r, j) =>
        [A.tx(r[0], 220, 150 + j * 76, 34, "r"), A.arrow(300, 140 + j * 76, 420, 140 + j * 76, "k"), A.tx(r[1], 520, 150 + j * 76, 34, "b"), qt(r[2], 660, 150 + j * 76, 24, "g")]),
      A.p(R.line(120, 100, 700, 100, .3), "k", 2)],
     say: t3("Samma sak kan ha olika namn i olika delar av landet. Ordet till vänster hör till en region, ordet till höger till standardspråket. Ingen av dem är ett fel; de hör bara hemma på olika platser.", "The same thing can have different names in different parts of the country. The word on the left belongs to a region, the one on the right to the standard language. Neither is a mistake; they just belong in different places.", "قد يكون للشيء نفسه أسماء مختلفة في مناطق مختلفة. الكلمة على اليسار تنتمي إلى منطقة، والكلمة على اليمين إلى اللغة المعيارية، ولا إحداهما خطأ.")},
    {draw: () => [A.wipe(), A.tx(T("Tre sorters variation", "Three kinds of variation", "ثلاثة أنواع من التنوّع"), 400, 56, 34, "b"),
      ...boxes([["dialekt", "b", "region: var du bor"]], 160, 34),
      ...boxes([["sociolekt", "g", "grupp: ålder, yrke"]], 280, 34),
      ...boxes([["slang", "r", "snabb, byts ut"]], 400, 34),
      qt(T("Alla tre finns hos samma person, i olika situationer.", "All three live in the same person, in different situations.", "الثلاثة موجودة في الشخص نفسه بحسب الموقف."), 400, 470, 26, "k")],
     say: t3("Dialekt beror på var du bor, sociolekt på vilken grupp du hör till, och slang är de snabba orden som byts ut. Samma person kan ha alla tre och växla mellan dem under en enda dag.", "A dialect depends on where you live, a sociolect on which group you belong to, and slang is the fast words that get replaced. The same person can have all three and switch between them in a single day.", "اللهجة تتعلق بمكان سكنك، واللهجة الاجتماعية بالمجموعة التي تنتمي إليها، والعامية هي الكلمات السريعة المتغيرة. والشخص نفسه قد يملك الثلاثة ويتنقّل بينها في يوم واحد.")},
    {draw: () => [A.wipe(), A.tx(T("Uttal, tonfall och fördomar", "Pronunciation, tone and prejudice", "اللفظ والنبرة والأحكام المسبقة"), 400, 52, 30, "b"),
      A.tx(T("Samma mening, tre uttal – samma innehåll.", "The same sentence, three pronunciations – the same content.", "الجملة نفسها بثلاثة ألفاظ ومعنى واحد."), 400, 140, 28, "k"),
      A.tx("✗  ”Hon låter inte så smart.”", 400, 240, 30, "r"), A.p(R.line(190, 230, 610, 230, .3), "r", 3),
      A.tx("✓  ”Hon kommer från en annan region.”", 400, 340, 30, "g"),
      qt(T("Att växla språk efter situation är en förmåga, inte ett fel.", "Switching language to suit the situation is a skill, not a mistake.", "تغيير اللغة بحسب الموقف مهارة لا خطأ."), 400, 440, 26, "b")],
     say: t3("Vi hör inte bara ord, vi dömer också. Forskning visar att uttal och tonfall påverkar vad vi tror om en människas kunskap. Den som vet det kan hålla kvar fördomen i handen och titta på den i stället för att tro på den.", "We don't only hear words, we also judge. Research shows that pronunciation and tone affect what we believe about a person's knowledge. Someone who knows that can hold the prejudice in their hand and look at it instead of believing it.", "لا نسمع الكلمات فقط بل نحكم أيضًا. تُظهر البحوث أن اللفظ والنبرة يؤثران في ما نعتقده عن معرفة الشخص. ومن يعرف ذلك يستطيع أن يتفحّص الحكم المسبق بدل أن يصدّقه.")}],
  read: [
    {q: "Vad ska klassen jämföra i det sista temat?", o: ["Dialekter, slang och rikssvenska", "Verb, substantiv och adjektiv", "Tre noveller"], why: "Del 1: ”Vi ska jämföra dialekter, slang och det som brukar kallas rikssvenska.”"},
    {q: "Vad betyder dialektordet påg?", o: ["Pojke", "Flicka", "Cykel"], why: "Del 1 och 2: påg används i Skåne för pojke."},
    {q: "Vad var annorlunda när klassen lyssnade på Saras kusin?", o: ["Uttalet och tonfallet, inte orden", "Orden, som ingen förstod", "Att han talade ett annat språk"], why: "Del 3: ”Jag förstår varje ord … Det är bara musiken som är ny.”"},
    {q: "Vad är en sociolekt?", o: ["Språket i en grupp, till exempel nior eller läkare", "Språket i en region", "Ett språk från ett annat land"], why: "Del 5: ”Språket i en grupp kallas sociolekt.”"},
    {q: "Vad hände med Amir på öppet hus?", o: ["En elev härmade hans uttal och de andra skrattade.", "Han kom in på programmet direkt.", "Han tappade sin telefon."], why: "Del 6: ”säg det igen”, och sedan skratt."},
    {q: "Varför säger Lena att rikssvenska inte är en finare svenska?", o: ["Det är en variant som skolan och myndigheterna har valt, inte en naturlag.", "Ingen talar rikssvenska längre.", "Rikssvenska har fler fel än dialekterna."], why: "Del 4: ”Ett standardspråk är ett beslut, inte en naturlag.”"},
    {q: "Varför blir klassen tyst när Amir har berättat?", o: ["De förstår att det han mötte var orättvist och personligt.", "De tycker att han talar fel.", "Lektionen hade slutat."], why: "Tystnaden visar att de känner igen allvaret: någon har gjort hans språk till ett skämt."},
    {q: "Vad menar Amir med att man behöver ”flera språk i munnen”?", o: ["Man ska kunna växla mellan hemmets språk, skolans och kompisarnas.", "Man måste lära sig tre främmande språk.", "Man ska alltid tala rikssvenska."], why: "Del 7–8: att lägga om språket efter situation är en förmåga, och hemmets variant får finnas kvar."},
    {q: "Varför är texten de skriver en faktatext, och inte en insändare om dialekter?", o: ["Den beskriver och förklarar variationen med karta, exempel och slutsats.", "Den vill att läsaren skriver under en protestlista.", "Den berättar en påhittad historia."], why: "Faktatexten informerar sakligt: karta, ljudfiler, exempel och en slutsats om regionala och sociala skillnader."}],
  gram(lv, write) {
    if (write || lv === 2) {
      const [d, riks, reg] = pick(DIA);
      return {kind: "text", ans: [riks], show: riks,
        q: [...head(t3("Skriv ordet på rikssvenska.", "Write the word in standard Swedish.", "اكتب الكلمة بالسويدية المعيارية.")), A.tx(d, 400, 220, 64, "r"), qt(reg, 400, 290, 28, "g")],
        sol: [A.tx(`${d}  =  ${riks}`, 400, 400, 44, "g"), qt(reg, 400, 460, 28, "k")],
        hint: {say: t3("Tänk på vad ordet betyder i en vanlig lärobokstext.", "Think of what the word means in an ordinary textbook text.", "فكّر في معنى الكلمة في نص مدرسي عادي."), draw: []}};
    }
    if (lv === 1) {
      const [s, tag] = pick(VAR);
      const others = shuffle(["dialekt", "sociolekt", "slang"].filter(t => t !== tag));
      return choice([tag, ...others], tag,
        [...head(t3("Vilken sorts variation är det?", "Which kind of variation is it?", "أي نوع من التنوّع هذا؟")), ...svLines(s, 210, 32)],
        [...svLines(s, 300, 28, "k"), A.tx(tag, 400, 430, 44, "g")],
        t3("Hör språket till en plats (dialekt), till en grupp (sociolekt) eller till de snabba orden (slang)?", "Does the language belong to a place (dialect), a group (sociolect) or the fast words (slang)?", "هل اللغة تنتمي إلى مكان (لهجة) أم مجموعة (لهجة اجتماعية) أم الكلمات السريعة (عامية)؟"));
    }
    const [d, riks, reg, w1, w2] = pick(DIA);
    return choice([riks, w1, w2], riks,
      [...head(t3("Vad betyder dialektordet?", "What does the dialect word mean?", "ماذا تعني الكلمة اللهجية؟")), A.tx(d, 400, 220, 64, "r"), qt(reg, 400, 290, 28, "g")],
      [A.tx(`${d}  =  ${riks}`, 400, 400, 44, "g"), qt(reg, 400, 460, 28, "k")],
      t3("Ordet hör till en region. Vilket ord i rikssvenska betyder samma sak?", "The word belongs to a region. Which standard Swedish word means the same?", "الكلمة تنتمي إلى منطقة. أي كلمة معيارية تعني الشيء نفسه؟"));
  },
  help: [{say: t3("Dialekt = region. Sociolekt = grupp. Slang = snabba ord. Ingen variant är finare än en annan.", "Dialect = region. Sociolect = group. Slang = fast words. No variety is finer than another.", "اللهجة: منطقة. اللهجة الاجتماعية: مجموعة. العامية: كلمات سريعة. ولا نوع أرقى من آخر."),
    draw: () => [A.tx("dialekt – region", 400, 180, 40, "b"), A.tx("sociolekt – grupp", 400, 270, 40, "g"), A.tx("slang – byts ut", 400, 360, 40, "r")]}]
});
}

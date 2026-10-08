/* Svenska årskurs 8, units 1–6: Nytt läsår, nya regler (huvudsats och bisats), Insändaren om busstiderna
   (argumenterande text), Fejknyheten (källkritik), Novellen: Spegeln (berättarteknik), Praon på veterinären
   (passiv form med -s), Formellt eller informellt? (stil och mottagare).
   Class 8B at Björkskolan in Hagaby, teacher Lena. Amir and Sara continue from year 7. */
import {defineUnit, word, t3, A, R, L, qt, pick, shuffle, svLines, boxes, pic, kid, type Draw, type Problem, type T3} from "../svenska/unit";
{
/* ---------- shared people and pictures ---------- */
const longHair = (x: number, y: number, s: number, c: string) => `<path d="M${x - 22 * s} ${y - 6 * s} Q${x - 32 * s} ${y + 26 * s} ${x - 20 * s} ${y + 48 * s} L${x - 12 * s} ${y + 14 * s}Z M${x + 22 * s} ${y - 6 * s} Q${x + 32 * s} ${y + 26 * s} ${x + 20 * s} ${y + 48 * s} L${x + 12 * s} ${y + 14 * s}Z" fill="${c}"/>`;
const AMIR = (x: number, y: number, s = 1) => kid(x, y, "#2a7d9c", "#2b1d14", s);
const SARA = (x: number, y: number, s = 1) => longHair(x, y, s, "#7a3b1e") + kid(x, y, "#d35f8d", "#7a3b1e", s);
const NOAH = (x: number, y: number, s = 1) => kid(x, y, "#e07b00", "#3b2a1e", s);
const ELSA = (x: number, y: number, s = 1) => longHair(x, y, s, "#e0b43a") + kid(x, y, "#7cc08a", "#e0b43a", s);
const LEO = (x: number, y: number, s = 1) => kid(x, y, "#e0b43a", "#c8902e", s);
const YASMIN = (x: number, y: number, s = 1) => longHair(x, y, s, "#2b1d14") + kid(x, y, "#7b5ea7", "#2b1d14", s);
const LENA = (x: number, y: number, s = 1.12) => longHair(x, y, s, "#8a6a44") + kid(x, y, "#4a6b3a", "#8a6a44", s);
const PETRA = (x: number, y: number, s = 1.12) => longHair(x, y, s, "#9aa4b5") + kid(x, y, "#f7f3ea", "#9aa4b5", s);
const hand = (s: string, x: number, y: number, z = 28, c = "#1d2433") => s ? `<text x="${x}" y="${y}" font-family="Caveat,cursive" font-weight="700" font-size="${z}" text-anchor="middle" fill="${c}">${s}</text>` : "";
const room = (bg = "#f5efe2") => `<rect width="300" height="300" fill="${bg}"/><rect y="238" width="300" height="62" fill="#c8a879"/>`;
const board = (txt = "", t2 = "") => `<rect x="30" y="26" width="240" height="106" rx="4" fill="#2f5a46" stroke="#8a6a44" stroke-width="5"/>${hand(txt, 150, 72, 30, "#f3efe6")}${hand(t2, 150, 110, 23, "#cfe3d6")}`;
const desk = (x: number, y: number, w = 92) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="12" rx="3" fill="#b5895a"/><rect x="${x - w / 2 + 6}" y="${y + 12}" width="8" height="38" fill="#8d6440"/><rect x="${x + w / 2 - 14}" y="${y + 12}" width="8" height="38" fill="#8d6440"/>`;
const bubble = (x: number, y: number, w: number, txt: string, size = 20) => `<rect x="${x - w / 2}" y="${y - 22}" width="${w}" height="36" rx="14" fill="#fff" stroke="#1d2433" stroke-width="2"/>${hand(txt, x, y + 3, size)}`;
const phone = (x: number, y: number, s = 1, txt = "", c = "#1f4fb0") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-27" y="-48" width="54" height="96" rx="9" fill="#1d2433"/><rect x="-22" y="-41" width="44" height="78" rx="3" fill="#e8f0fa"/>${hand(txt, 0, 4, 20, c)}</g>`;
const paper = (x: number, y: number, s = 1, txt = "", t2 = "", lines = 4) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-54" y="-70" width="108" height="140" rx="4" fill="#fffdf7" stroke="#c0c7d4" stroke-width="2"/>${hand(txt, 0, -44, 22, "#1f4fb0")}${hand(t2, 0, -20, 18, "#5b6884")}${[...Array(lines)].map((_, i) => `<path d="M-40 ${4 + i * 17} h80" stroke="#c9d2e0" stroke-width="3"/>`).join("")}</g>`;
const laptop = (x: number, y: number, txt = "", t2 = "") => `<g transform="translate(${x} ${y})"><rect x="-74" y="-92" width="148" height="98" rx="8" fill="#33415c"/><rect x="-66" y="-84" width="132" height="82" rx="3" fill="#fffdf7"/>${hand(txt, 0, -54, 22, "#1f4fb0")}${hand(t2, 0, -30, 18, "#5b6884")}<path d="M-46 -16 h92 M-46 -4 h74" stroke="#c9d2e0" stroke-width="4"/><path d="M-88 6 h176 l-12 14 h-152Z" fill="#9aa4b5"/></g>`;
const bus = (x: number, y: number, s = 1, nr = "412") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-74" y="-54" width="148" height="62" rx="9" fill="#d63b2f"/><rect x="-66" y="-46" width="36" height="24" rx="3" fill="#dceefa"/><rect x="-24" y="-46" width="36" height="24" rx="3" fill="#dceefa"/><rect x="18" y="-46" width="30" height="24" rx="3" fill="#dceefa"/>${hand(nr, 54, -28, 18, "#fff")}<rect x="-74" y="-6" width="148" height="8" fill="#a52a20"/><circle cx="-44" cy="12" r="11" fill="#33415c"/><circle cx="44" cy="12" r="11" fill="#33415c"/></g>`;
const stop = (x: number, y: number) => `<rect x="${x - 3}" y="${y - 86}" width="6" height="86" fill="#9aa4b5"/><rect x="${x - 26}" y="${y - 118}" width="52" height="34" rx="6" fill="#f2c94c" stroke="#b8860b" stroke-width="2"/>${hand("BUSS", x, y - 96, 17, "#5b4636")}`;
const rainy = (n = 14) => [...Array(n)].map((_, i) => `<path d="M${(i * 41) % 290 + 8} ${(i * 37) % 120 + 10} l-6 20" stroke="#8fb6de" stroke-width="3" stroke-linecap="round"/>`).join("");
const dog = (x: number, y: number, s = 1, c = "#c98e4a") => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-32 -6 q-16 -8 -12 -26" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse rx="34" ry="17" fill="${c}"/><ellipse cx="-4" cy="4" rx="17" ry="9" fill="#efdcc0"/>${[-24, -11, 13, 26].map(lx => `<rect x="${lx - 3}" y="8" width="7" height="21" rx="3" fill="${c}"/>`).join("")}<circle cx="33" cy="-17" r="15" fill="${c}"/><path d="M25 -28 q-10 -2 -8 17 q6 -4 8 -17z" fill="#8a5a2b"/><circle cx="37" cy="-20" r="2.4" fill="#1d2433"/><ellipse cx="47" cy="-14" rx="3.6" ry="2.8" fill="#1d2433"/></g>`;
const ICON = (body: string, bg: string) => `<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="${bg}"/>${body}</svg>`;
const head = (s: T3, y = 60, size = 34, c = "b") => A.tx(L(s), 400, y, size, c);
const T = (sv: string, en: string, ar: string) => L(t3(sv, en, ar));
/* centres of the boxes() parts, so arrows can point at them */
const ctr = (parts: string[], size = 34) => {
  const w = parts.map(s => Math.max(60, s.length * size * .46 + 28)), tot = w.reduce((a, b) => a + b, 0) + 16 * (parts.length - 1);
  let x = 400 - tot / 2; return w.map(v => { const c = x + v / 2; x += v + 16; return c; });
};
/* a choice problem with three distinct options, the right one first */
const choice = (opts3: string[], show: string, q: Draw[], sol: Draw[], hint: T3): Problem => {
  const o = shuffle(opts3.slice());
  return {kind: "choice", opts: o, ans: o.indexOf(opts3[0]), show, q, sol, hint: {say: hint, draw: []}};
};
/* two wrong labels from the same set */
const others = (all: string[], right: string) => shuffle(all.filter(x => x !== right)).slice(0, 2);

/* ================= unit 1: Nytt läsår, nya regler (huvudsats och bisats) ================= */
word("regel8", {sv: "regel (en)", m: "(?:regeln?|regl(?:er|erna))", d: t3("Något som bestämmer vad man får och inte får göra.", "Something that decides what you may and may not do.", "شيء يحدّد ما يجوز وما لا يجوز فعله."), ex: "Lena läste upp skolans nya regler.", tr: {en: "rule", ar: "قاعدة"}, syn: ["lag"], wrong: ["belöning", "gissning"], gap: ["I 8B bestämde klassen en egen", "regel", "om mobiler."], gapForm: "regel", form: "en regel – regler"});
word("schema8", {sv: "schema (ett)", m: "schem(?:a|at|an|ana)", d: t3("En plan som visar vilka lektioner man har och när de börjar.", "A plan that shows which lessons you have and when they start.", "خطة تُبيّن الحصص ومواعيد بدايتها."), ex: "Amir tittade på sitt nya schema.", tr: {en: "timetable, schedule", ar: "جدول الحصص"}, syn: ["tidsplan"], wrong: ["karta", "kvitto"], gap: ["Det nya", "schemat", "satt på väggen i korridoren."], gapForm: "schemat", form: "ett schema – scheman"});
word("ansvar", {sv: "ansvar (ett)", m: "ansvar(?:et|ig|igt|iga)?", d: t3("Att det är din uppgift att något blir gjort, och ditt fel om det inte blir gjort.", "That it is your job to get something done, and your fault if it is not done.", "أن يكون من واجبك إنجاز شيء، ويكون خطؤك إن لم يُنجز."), ex: "Varje elev har ansvar för sin mobil.", tr: {en: "responsibility", ar: "مسؤولية"}, syn: ["skyldighet"], wrong: ["belöning", "ledighet"], gap: ["Vi tar själva", "ansvar", "för att lådan låses."], gapForm: "ansvar", form: "ett ansvar – ansvarig"});
word("franvaro", {sv: "frånvaro (en)", m: "frånvaro(?:n)?", d: t3("Att inte vara i skolan när man ska vara där.", "Not being at school when you are supposed to be there.", "عدم الحضور إلى المدرسة في الوقت المطلوب."), ex: "Sen ankomst räknas som frånvaro.", tr: {en: "absence", ar: "غياب"}, syn: ["bortavaro"], opp: ["närvaro"], wrong: ["rast", "lektion"], gap: ["Den som kommer efter kvart över får", "frånvaro", "."], gapForm: "frånvaro", form: "en frånvaro (ingen plural)"});
word("forhandla", {sv: "förhandla", m: "förhandla(?:r|de|t|s)?|förhandling(?:en|ar|arna)?", d: t3("Prata med någon för att komma fram till något som båda kan gå med på.", "Talk with someone to reach something both sides can accept.", "أن تتحدّث مع أحد للوصول إلى اتفاق يقبله الطرفان."), ex: "Klassen förhandlade med Lena om reglerna.", tr: {en: "negotiate", ar: "يتفاوض"}, syn: ["diskutera"], wrong: ["skrika", "lyda"], gap: ["I stället för att bråka valde de att", "förhandla", "med läraren."], gapForm: "förhandla", form: "förhandla – förhandlade – har förhandlat"});
word("kompromiss8", {sv: "kompromiss (en)", m: "kompromiss(?:en|er|erna)?", d: t3("En lösning där båda får en del av det de vill ha, men ingen får allt.", "A solution where both get part of what they want, but nobody gets everything.", "حلّ يأخذ فيه كلّ طرف جزءًا من مطلبه ولا يأخذ أحد كلّ شيء."), ex: "Till slut hittade de en kompromiss.", tr: {en: "compromise", ar: "حلّ وسط"}, syn: ["överenskommelse"], wrong: ["konflikt", "order"], gap: ["Lösningen blev en", "kompromiss", "som båda kunde leva med."], gapForm: "kompromiss", form: "en kompromiss – kompromisser"});
word("rimlig", {sv: "rimlig", m: "rimlig(?:t|a|are|ast)?", d: t3("Som verkar rätt och förnuftig, inte överdriven.", "That seems right and sensible, not exaggerated.", "يبدو صحيحًا ومعقولًا وغير مبالغ فيه."), ex: "Det är rimligt att mobilen ligger i väskan.", tr: {en: "reasonable, fair", ar: "معقول"}, syn: ["förnuftig"], opp: ["orimlig"], wrong: ["tyst", "dyr"], gap: ["Eleverna tyckte inte att regeln var", "rimlig", "."], gapForm: "rimlig", form: "rimlig – rimligt – rimliga"});
word("protestera", {sv: "protestera", m: "protestera(?:r|de|t|s)?|protest(?:en|er|erna)?", d: t3("Säga tydligt att man tycker att något är fel.", "Say clearly that you think something is wrong.", "أن تقول بوضوح إنك ترى شيئًا خاطئًا."), ex: "Hela klassen protesterade.", tr: {en: "protest, object", ar: "يحتجّ"}, syn: ["invända"], opp: ["hålla med"], wrong: ["gratulera", "viska"], gap: ["Noah räckte upp handen för att", "protestera", "mot regeln."], gapForm: "protestera", form: "protestera – protesterade – har protesterat"});
word("svhuvudsats8", {sv: "huvudsats", m: "huvudsats(?:en|er|erna)?", d: t3("En sats som kan stå ensam som en hel mening.", "A clause that can stand alone as a whole sentence.", "جملة تستطيع أن تقف وحدها كجملة كاملة."), ex: "Klassen protesterade.", tr: {en: "main clause", ar: "جملة رئيسية"}});
word("svbisats8", {sv: "bisats", m: "bisats(?:en|er|erna)?", d: t3("En sats som börjar med att, eftersom, när, om eller fast och inte kan stå ensam.", "A clause that starts with att, eftersom, när, om or fast and cannot stand alone.", "جملة تبدأ بـ att أو eftersom أو när أو om أو fast ولا تستطيع أن تقف وحدها."), ex: "… eftersom regeln var fel.", tr: {en: "subordinate clause", ar: "جملة تابعة"}});

const PA = [
  pic(`${room()}${board("8B", "regler  ansvar  schema")}${LENA(226, 158)}${AMIR(76, 170, .92)}${desk(76, 226)}`, "#eef4fb"),
  pic(`${room("#f1f5fa")}${board("08.15", "frånvaro efter kvart över")}${LENA(60, 168, .95)}${paper(196, 184, .8, "SCHEMA", "8B")}`, "#eef4fb"),
  pic(`${room()}${NOAH(70, 164)}${SARA(176, 168)}${ELSA(256, 176, .9)}${bubble(96, 68, 132, "Inte rimligt!")}<path d="M176 128 l0 -24" stroke="#1d2433" stroke-width="3"/><circle cx="176" cy="100" r="8" fill="#f1c7a3"/>`, "#f7f1ea"),
  pic(`${room("#f1f5fa")}${board("FÖRSLAG", "argument, inte bara nej")}${LENA(238, 162, .98)}${AMIR(62, 172, .9)}${SARA(140, 176, .9)}`, "#eef4fb"),
  pic(`${room()}${paper(96, 150, .95, "FÖRSLAG", "kvart i halv", 5)}${phone(226, 160, .8, "8.29")}${desk(150, 236, 200)}`, "#f3f6ef"),
  pic(`${room("#f6f1e6")}${paper(150, 142, 1.05, "8B REGLER", "26 namn", 6)}${LENA(248, 184, .9)}${ELSA(52, 190, .85)}`, "#f6f1e6"),
  pic(`${rainy(10)}<rect y="0" width="300" height="300" fill="none"/>${stop(58, 236)}${bus(196, 222, .92)}${NOAH(100, 196, .9)}<rect y="262" width="300" height="38" fill="#9aa4b5"/>`, "#dde8f3")];
/* [huvudsats, bisatsord, subjekt, verb, resten] – the bisats is negated with inte */
const INTE8: [string, string, string, string, string][] = [
  ["Noah kom i tid", "eftersom", "bussen", "var", "sen"],
  ["Amir blev glad", "när", "Lena", "skrev", "frånvaro"],
  ["Sara sa", "att", "hon", "tyckte", "om regeln"],
  ["Vi protesterade", "eftersom", "regeln", "var", "rimlig"],
  ["Lena blev nöjd", "fast", "hon", "fick", "allt"],
  ["Elsa lämnade mobilen i lådan", "trots att", "hon", "hade", "lust"],
  ["Klassen fick förhandla", "fast", "Lena", "behövde", "göra det"],
  ["Amir följde regeln", "därför att", "han", "tyckte", "att den var dum"]];
/* [sentence with a gap, the bisats word] */
const KONJ8: [string, string][] = [
  ["Vi protesterade ____ regeln inte var rimlig.", "eftersom"],
  ["Lena sa ____ hon skulle tänka på saken.", "att"],
  ["Noah visade tidtabellen ____ han kom in i salen.", "när"],
  ["Du får komma kvart i halv ____ du åker buss.", "om"],
  ["Amir lade mobilen i lådan ____ han inte ville det.", "fast"],
  ["Klassen fick en kompromiss ____ de hade skrivit argument.", "eftersom"],
  ["Elsa frågade ____ hon fick gå tidigare.", "om"],
  ["Alla blev tysta ____ Lena läste upp regeln.", "när"]];
const KONJH = t3("Bisatsen börjar med ett litet ord: att, eftersom, när, om eller fast. Vilket passar i meningen?", "The subordinate clause starts with a small word: att, eftersom, när, om or fast. Which one fits the sentence?", "تبدأ الجملة التابعة بكلمة صغيرة: att أو eftersom أو när أو om أو fast. أيّها تناسب الجملة؟");

defineUnit({
  id: "sv8a", year: 8, ord: 1, title: t3("Nytt läsår, nya regler", "A new school year, new rules", "عام دراسي جديد وقواعد جديدة"), storyTitle: "Nytt läsår, nya regler",
  icon: ICON(`<rect x="24" y="24" width="180" height="132" rx="6" fill="#2f5a46" stroke="#8a6a44" stroke-width="5"/>${hand("8B", 114, 78, 42, "#f3efe6")}${hand("regler  ansvar", 114, 120, 26, "#cfe3d6")}${LENA(262, 104, 1.05)}`, "#eef4fb"),
  words: ["regel8", "schema8", "ansvar", "franvaro", "forhandla", "kompromiss8", "rimlig", "protestera"], terms: ["svhuvudsats8", "svbisats8"],
  story: [
    {text: ["Det var första dagen på höstterminen. Amir gick genom korridoren på Björkskolan och letade efter sal 212. På dörren satt en lapp där det stod 8B.", "Inne i salen stod Lena vid tavlan. Hon hade skrivit tre ord: regler, ansvar, schema. ”Välkomna till åttan”, sa hon. ”I år får ni mer ansvar än i sjuan – och några nya regler.”"],
      pic: PA[0], say: t3("Första dagen i 8B. Vilka tre ord har Lena skrivit på tavlan?", "The first day in 8B. Which three words has Lena written on the board?", "اليوم الأول في الصف 8B. ما الكلمات الثلاث التي كتبتها لينا على اللوح؟")},
    {text: ["Lena delade ut det nya schemat. Första lektionen började redan kvart över åtta, tjugo minuter tidigare än förra året.", "”Och en sak till”, sa hon. ”Den som kommer efter kvart över får frånvaro. Mobilerna ligger i lådan under lektionen.” I salen blev det alldeles tyst, och sedan började alla prata samtidigt. Elsa viskade att hon aldrig skulle hinna, eftersom hon lämnar sin lillebror på förskolan varje morgon."],
      pic: PA[1], say: t3("Två nya regler. Vad händer om man kommer efter kvart över?", "Two new rules. What happens if you arrive after a quarter past?", "قاعدتان جديدتان. ماذا يحدث إن وصلت بعد الربع؟")},
    {text: ["”Det är inte rimligt!” sa Noah. ”Bussen från Hagaby kommer tjugo över. Jag kan ju inte flyga.” Flera klasskamrater protesterade högt.", "Sara räckte upp handen i stället. ”Jag tycker också att regeln är fel”, sa hon lugnt, ”men vi kommer ingenstans om vi bara skriker.”"],
      pic: PA[2], say: t3("Klassen protesterar. Varför vill Sara inte skrika?", "The class protests. Why doesn't Sara want to shout?", "الصف يحتجّ. لماذا لا تريد سارة أن تصرخ؟")},
    {text: ["Lena satte sig på kanten av katedern. ”Okej”, sa hon. ”Då förhandlar vi. Ni får tio minuter att skriva ihop ett förslag. Men ett förslag med argument, inte bara ett nej.”", "Hon lade sin klocka på katedern. ”Tio minuter, sedan lyssnar jag.” Amir och Sara skrev på tavlan medan Noah tog tiden. Det var första gången någon hade bett dem förhandla om en regel."],
      pic: PA[3], say: t3("Lena vill förhandla. Vad kräver hon av klassens förslag?", "Lena wants to negotiate. What does she demand of the class's proposal?", "لينا تريد التفاوض. ما الذي تشترطه في مقترح الصف؟")},
    {text: ["Förslaget blev kort. Den som åker buss får komma kvart i halv utan frånvaro, om hon eller han visar tidtabellen. Mobilen ligger i lådan under lektionen, men klassen får använda den på rasterna.", "”Och vem tar ansvar för lådan?” frågade Lena. ”Vi”, sa Sara. ”Två elever i veckan, enligt en lista på dörren.”"],
      pic: PA[4], say: t3("Klassens förslag är klart. Vem ska ta ansvar för mobillådan?", "The class's proposal is ready. Who is going to take responsibility for the phone box?", "اكتمل مقترح الصف. من سيتولّى مسؤولية صندوق الهواتف؟")},
    {text: ["Lena läste förslaget två gånger. ”Det här är en kompromiss”, sa hon. ”Ni får er kvart, jag får mina tysta lektioner. Ingen av oss får allt.”", "Hon skrev under med röd penna, och Elsa satte upp pappret vid dörren. ”Klassens egna regler”, stod det högst upp. Under texten skrev tjugosex elever sina namn.", "”Men om någon glömmer att låsa lådan?” frågade Noah. ”Då är det vi som har lovat”, sa Sara, ”inte du ensam.”"],
      pic: PA[5], say: t3("En kompromiss. Vad får Lena, och vad får klassen?", "A compromise. What does Lena get, and what does the class get?", "حلّ وسط. ما الذي تحصل عليه لينا، وما الذي يحصل عليه الصف؟")},
    {text: ["På fredagen kom Noah in kvart i halv med tidtabellen i handen. Lena nickade och skrev ingen frånvaro.", "”Det var lättare att följa regeln när vi hade skrivit den själva”, sa Amir på vägen hem. Sara log. ”Det var därför hon lät oss förhandla”, sa hon. ”Hon visste det hela tiden.”"],
      pic: PA[6], say: t3("Amir följer regeln utan att klaga. Vad hade Lena förstått hela tiden, tror du?", "Amir follows the rule without complaining. What had Lena understood all along, do you think?", "أمير يتبع القاعدة دون شكوى. ما الذي كانت لينا تفهمه من البداية في رأيك؟")}],
  wordsSay: t3("Åtta nya ord om skolans regler. Tryck på ett ord för att se vad det betyder och ett exempel.", "Eight new words about the school's rules. Tap a word to see what it means and an example.", "ثماني كلمات جديدة عن قواعد المدرسة. اضغط على كلمة لترى معناها ومثالًا عليها."),
  grammar: [
    {draw: () => [A.wipe(), head(t3("Huvudsats + bisats", "Main clause + subordinate clause", "جملة رئيسية + جملة تابعة")),
      ...boxes([["Klassen protesterade", "b", "huvudsats"], ["eftersom regeln var fel", "r", "bisats"]], 190, 28),
      ...boxes([["Lena ändrade regeln", "b", "huvudsats"], ["när Noah visade tabellen", "r", "bisats"]], 320, 28),
      A.tx("Klassen protesterade.", 400, 420, 30, "g"), A.tx("Eftersom regeln var fel.", 400, 468, 30, "o"),
      qt(T("hel mening", "a whole sentence", "جملة كاملة"), 660, 420, 22, "g"), qt(T("inte en hel mening", "not a whole sentence", "ليست جملة كاملة"), 660, 468, 22, "o")],
     say: t3("En huvudsats kan stå ensam: Klassen protesterade. En bisats kan inte stå ensam, utan hör ihop med huvudsatsen: eftersom regeln var fel.", "A main clause can stand alone: Klassen protesterade (the class protested). A subordinate clause cannot stand alone; it belongs to the main clause: eftersom regeln var fel (because the rule was wrong).", "الجملة الرئيسية تستطيع أن تقف وحدها: Klassen protesterade. أما الجملة التابعة فلا تقف وحدها، بل تلتصق بالجملة الرئيسية: eftersom regeln var fel.")},
    {draw: () => {
      const w = ["att", "eftersom", "när", "om", "fast", "som", "trots att", "därför att"];
      return [A.wipe(), head(t3("Ord som startar en bisats", "Words that start a subordinate clause", "كلمات تبدأ بها الجملة التابعة")),
        ...w.map((s, i) => A.tx(s, 160 + (i % 4) * 160, 150 + Math.floor(i / 4) * 66, 32, "r")),
        A.p(R.line(60, 290, 740, 290, .3), "k", 2),
        ...boxes([["Sara sa", "b", "huvudsats"], ["att hon förstod beslutet", "r", "bisats"]], 370, 28),
        qt(T("Bisatsen svarar på varför, när eller vad.", "The subordinate clause answers why, when or what.", "الجملة التابعة تجيب عن: لماذا، متى، أو ماذا."), 400, 460, 24, "k")];
    }, say: t3("En bisats börjar med ett litet ord: att, eftersom, när, om, fast, som. Hittar du ett sådant ord mitt i en mening har du nästan alltid hittat en bisats.", "A subordinate clause starts with a small word: att, eftersom, när, om, fast, som. If you find one of those words in the middle of a sentence, you have almost always found a subordinate clause.", "تبدأ الجملة التابعة بكلمة صغيرة: att، eftersom، när، om، fast، som. وإذا وجدت إحدى هذه الكلمات في وسط الجملة فقد وجدت جملة تابعة في الغالب.")},
    {draw: () => {
      const a = ["Jag", "förstår", "inte", "regeln"], b = ["eftersom", "jag", "inte", "förstår", "regeln"], cb = ctr(b, 30);
      return [A.wipe(), head(t3("Var står inte?", "Where does inte go?", "أين يأتي inte؟")),
        ...boxes([[a[0], "b", "subjekt"], [a[1], "r", "verb"], [a[2], "o", "inte"], [a[3], null]], 180, 34),
        qt(T("huvudsats: verbet står före inte", "main clause: the verb comes before inte", "جملة رئيسية: الفعل قبل inte"), 400, 258, 24, "k"),
        ...boxes([[b[0], "g", "bisats"], [b[1], "b", "subjekt"], [b[2], "o", "inte"], [b[3], "r", "verb"], [b[4], null]], 360, 30),
        A.arrow(cb[2], 400, cb[3], 400, "o", 26),
        qt(T("bisats: inte står före verbet", "subordinate clause: inte comes before the verb", "جملة تابعة: inte قبل الفعل"), 400, 455, 24, "k")];
    }, say: t3("I en huvudsats står inte efter verbet: jag förstår inte regeln. I en bisats hoppar inte fram före verbet: eftersom jag inte förstår regeln. Engelskan ändrar inte ordningen, så det här är något du måste träna.", "In a main clause inte comes after the verb: jag förstår inte regeln. In a subordinate clause inte jumps in front of the verb: eftersom jag inte förstår regeln. English does not change the order, so this is something you have to practise.", "في الجملة الرئيسية يأتي inte بعد الفعل: jag förstår inte regeln. وفي الجملة التابعة يتقدّم inte على الفعل: eftersom jag inte förstår regeln. الإنجليزية لا تغيّر الترتيب، لذلك يحتاج هذا إلى تدريب.")}],
  read: [
    {q: "Vilka tre ord hade Lena skrivit på tavlan?", o: ["Regler, ansvar och schema", "Prov, betyg och frånvaro", "Buss, mobil och rast"], why: "Del 1: Hon hade skrivit tre ord: regler, ansvar, schema."},
    {q: "Vad var nytt med schemat i åttan?", o: ["Första lektionen började tjugo minuter tidigare.", "Alla lektioner var sextio minuter.", "Klassen hade idrott varje dag."], why: "Del 2: Första lektionen började kvart över åtta, tjugo minuter tidigare än förra året."},
    {q: "Vad händer enligt Lenas regel om man kommer efter kvart över?", o: ["Man får frånvaro.", "Man måste stanna kvar efter skolan.", "Man förlorar sin mobil i en vecka."], why: "Del 2: ”Den som kommer efter kvart över får frånvaro.”"},
    {q: "Varför tycker Noah att regeln är orimlig?", o: ["Bussen från Hagaby kommer för sent.", "Han har inget schema.", "Han vill sova längre på morgonen."], why: "Del 3: ”Bussen från Hagaby kommer tjugo över.”"},
    {q: "Varför säger Sara att det inte hjälper att skrika?", o: ["Hon tror att klassen har större chans med argument.", "Hon tycker att den nya regeln är bra.", "Hon är rädd för Lena."], why: "Sara vill nå ett resultat, inte bara visa att hon är arg. Därför föreslår hon ett lugnt förslag."},
    {q: "Vad krävde Lena av klassens förslag?", o: ["Att det innehöll argument, inte bara ett nej.", "Att det var skrivet på dator.", "Att alla i klassen skrev under det."], why: "Del 4: ”Men ett förslag med argument, inte bara ett nej.”"},
    {q: "Vad blev klassens kompromiss?", o: ["Bussresenärer får komma kvart i halv, och mobilerna ligger i lådan under lektionen.", "Mobilerna är förbjudna hela skoldagen.", "Alla lektioner börjar halv nio."], why: "Del 5–6: kvart i halv med tidtabell, mobilen i lådan under lektionen men fri på rasten."},
    {q: "Varför var det lättare för Amir att följa regeln?", o: ["Klassen hade själv varit med och bestämt den.", "Regeln gällde bara på fredagar.", "Han hade fått en ny mobil."], why: "Del 7: ”Det var lättare att följa regeln när vi hade skrivit den själva.”"},
    {q: "Vad menar Sara när hon säger att Lena ”visste det hela tiden”?", o: ["Lena förstod att elever följer regler som de själva har förhandlat fram.", "Lena hade läst klassens förslag i förväg.", "Lena hade bestämt att ingen får åka buss."], why: "Lena lät klassen förhandla för att reglerna skulle hålla. Det var hennes plan från början."}],
  gram(lv, write): Problem {
    if (write || lv === 2) {
      const [s, k] = pick(KONJ8), full = s.replace("____", k);
      return {kind: "text", ans: [k], show: k, q: [A.wipe(), head(t3("Skriv ordet som startar bisatsen.", "Write the word that starts the subordinate clause.", "اكتب الكلمة التي تبدأ بها الجملة التابعة."), 80, 30), ...svLines(s, 220, 38),
        qt("att · eftersom · när · om · fast", 400, 430, 26, "r")], sol: svLines(full, 360, 34, "g"), hint: {say: KONJH, draw: []}};
    }
    if (lv === 1) {
      const [s, k] = pick(KONJ8), pool = others(["att", "eftersom", "när", "om", "fast"], k);
      return choice([k, ...pool], k, [A.wipe(), head(t3("Vilket ord passar i bisatsen?", "Which word fits the subordinate clause?", "أي كلمة تناسب الجملة التابعة؟"), 80, 32), ...svLines(s, 220, 38)],
        svLines(s.replace("____", k), 370, 34, "g"), KONJH);
    }
    const [h, k, su, v, r] = pick(INTE8);
    const right = `${h}, ${k} ${su} inte ${v} ${r}.`, w1 = `${h}, ${k} ${su} ${v} inte ${r}.`, w2 = `${h}, ${k} inte ${su} ${v} ${r}.`;
    const sol = [...svLines(right, 300, 30, "g"), ...boxes([[k, "g", "bisats"], [su, "b", "subjekt"], ["inte", "o", ""], [v, "r", "verb"]], 440, 28)];
    const hint = t3("I en bisats står inte före verbet: eftersom han inte kom.", "In a subordinate clause inte comes before the verb: eftersom han inte kom.", "في الجملة التابعة يأتي inte قبل الفعل: eftersom han inte kom.");
    return choice([right, w1, w2], right, [A.wipe(), head(t3("Vilken mening har rätt ordföljd?", "Which sentence has the right word order?", "أي جملة ترتيبها صحيح؟"), 80, 32), qt(T("bisats: inte före verbet", "subordinate clause: inte before the verb", "الجملة التابعة: inte قبل الفعل"), 400, 160, 26, "r")], sol, hint);
  },
  help: [{say: t3("Huvudsats: jag förstår inte regeln. Bisats: eftersom jag inte förstår regeln.", "Main clause: jag förstår inte regeln. Subordinate clause: eftersom jag inte förstår regeln.", "جملة رئيسية: jag förstår inte regeln. جملة تابعة: eftersom jag inte förstår regeln."),
    draw: () => [A.tx("Jag förstår inte regeln.", 400, 170, 36, "b"), A.tx("eftersom jag inte förstår regeln", 400, 290, 34, "r"), qt("inte före verbet i bisatsen", 400, 360, 26, "k")]}]
});

/* ================= unit 2: Insändaren om busstiderna (argumenterande text) ================= */
word("insandare", {sv: "insändare (en)", m: "insändar(?:e|en|na)", d: t3("En text som en läsare skickar till en tidning för att säga sin åsikt.", "A text a reader sends to a newspaper to give an opinion.", "نصّ يرسله قارئ إلى صحيفة ليعبّر عن رأيه."), ex: "Deras insändare kom in i Hagabybladet.", tr: {en: "letter to the editor", ar: "رسالة قارئ إلى صحيفة"}, syn: ["läsarbrev"], wrong: ["novell", "recept"], gap: ["Sara skrev en", "insändare", "till Hagabybladet."], gapForm: "insändare", form: "en insändare – insändare"});
word("kollektivtrafik", {sv: "kollektivtrafik (en)", m: "kollektivtrafik(?:en)?", d: t3("Bussar, tåg och spårvagnar som alla kan åka med.", "Buses, trains and trams that everyone can travel by.", "الباصات والقطارات والترام التي يمكن للجميع استخدامها."), ex: "Kollektivtrafiken i Hagaby är dålig på morgonen.", tr: {en: "public transport", ar: "النقل العام"}, syn: ["allmänna färdmedel"], wrong: ["cykelväg", "motorväg"], gap: ["I en liten kommun är", "kollektivtrafiken", "extra viktig."], gapForm: "kollektivtrafiken", form: "en kollektivtrafik"});
word("tidtabell8", {sv: "tidtabell (en)", m: "tidtabell(?:en|er|erna)?", d: t3("En lista som visar när bussar och tåg går.", "A list that shows when buses and trains leave.", "قائمة تُبيّن مواعيد الباصات والقطارات."), ex: "Den nya tidtabellen gäller från september.", tr: {en: "timetable", ar: "جدول المواعيد"}, syn: ["turlista"], wrong: ["karta", "biljett"], gap: ["Noah hade skrivit ut", "tidtabellen", "och tagit med den."], gapForm: "tidtabellen", form: "en tidtabell – tidtabeller"});
word("pendla", {sv: "pendla", m: "pendla(?:r|de|t)?|pendlar(?:e|en|na)", d: t3("Resa samma väg varje dag mellan hemmet och skolan eller jobbet.", "Travel the same way every day between home and school or work.", "أن تسافر الطريق نفسه كل يوم بين البيت والمدرسة أو العمل."), ex: "Många i Hagaby pendlar till stan.", tr: {en: "commute", ar: "يتنقّل يوميًّا"}, syn: ["resa dagligen"], wrong: ["flytta", "sova"], gap: ["Elsas pappa måste", "pendla", "fyra mil varje dag."], gapForm: "pendla", form: "pendla – pendlade – har pendlat"});
word("kommun", {sv: "kommun (en)", m: "kommun(?:en|er|erna|al|alt|ala)?", d: t3("Den del av Sverige som sköter skolor, bussar och bibliotek där man bor.", "The part of Sweden that runs the schools, buses and libraries where you live.", "الوحدة الإدارية التي تدير المدارس والباصات والمكتبات في منطقتك."), ex: "Kommunen bestämmer om busstiderna.", tr: {en: "municipality, local council", ar: "البلدية"}, syn: ["lokal myndighet"], wrong: ["riksdagen", "rektorn"], gap: ["Beslutet fattades av", "kommunen", "i våras."], gapForm: "kommunen", form: "en kommun – kommuner"});
word("kritisera", {sv: "kritisera", m: "kritisera(?:r|de|t|s|des)?|kritik(?:en)?", d: t3("Säga vad man tycker är fel med något.", "Say what you think is wrong with something.", "أن تقول ما تراه خطأً في شيء."), ex: "De kritiserade beslutet, inte personerna.", tr: {en: "criticise", ar: "ينتقد"}, syn: ["klaga på"], opp: ["berömma"], wrong: ["tacka", "lova"], gap: ["I insändaren vågade de", "kritisera", "ett beslut."], gapForm: "kritisera", form: "kritisera – kritiserade – har kritiserat"});
word("beslut8", {sv: "beslut (ett)", m: "beslut(?:et|en)?", d: t3("Något som någon har bestämt.", "Something that someone has decided.", "شيء قرّره أحدهم."), ex: "Kommunens beslut gjorde många missnöjda.", tr: {en: "decision", ar: "قرار"}, syn: ["avgörande"], wrong: ["gissning", "fråga"], gap: ["Ett", "beslut", "kan ändras om många protesterar."], gapForm: "beslut", form: "ett beslut – beslut"});
word("missnojd", {sv: "missnöjd", m: "missnöjd(?:a)?|missnöjt|missnöje(?:t)?", d: t3("Inte nöjd; besviken på hur något är.", "Not satisfied; disappointed with how something is.", "غير راضٍ؛ خائب الأمل من حال شيء."), ex: "Resenärerna var missnöjda.", tr: {en: "dissatisfied", ar: "غير راضٍ"}, syn: ["besviken"], opp: ["nöjd"], wrong: ["stolt", "lugn"], gap: ["Många resenärer var", "missnöjda", "med den nya tidtabellen."], gapForm: "missnöjda", form: "missnöjd – missnöjt – missnöjda"});
word("svtes8", {sv: "tes", m: "tes(?:en|er|erna)?", d: t3("Det du vill att läsaren ska tycka eller göra. Den står tidigt i texten.", "What you want the reader to think or do. It comes early in the text.", "ما تريد أن يفكّر فيه القارئ أو يفعله. ويأتي في أول النص."), ex: "Buss 412 ska gå tjugo i åtta igen.", tr: {en: "thesis, claim", ar: "الدعوى الرئيسية"}});
word("svmotargument8", {sv: "motargument", m: "motargument(?:et|en)?", d: t3("Ett argument som någon annan kan använda mot din tes. Du skriver det själv och bemöter det.", "An argument someone else could use against your thesis. You write it yourself and answer it.", "حجة قد يستخدمها غيرك ضد دعواك. تكتبها أنت وتردّ عليها."), ex: "Visserligen kostar det pengar, men …", tr: {en: "counter-argument", ar: "حجة مضادة"}});
word("svslutsats8", {sv: "slutsats", m: "slutsats(?:en|er|erna)?", d: t3("Slutet av texten, där du kort upprepar din tes.", "The end of the text, where you briefly repeat your thesis.", "خاتمة النص، وفيها تعيد دعواك بإيجاز."), ex: "Därför bör kommunen flytta en tur.", tr: {en: "conclusion", ar: "خلاصة"}});

const PB = [
  pic(`${rainy(12)}${stop(66, 240)}${bus(230, 206, .8)}${AMIR(104, 196, .9)}${NOAH(156, 200, .88)}${ELSA(202, 206, .84)}<rect y="266" width="300" height="34" fill="#9aa4b5"/>`, "#dde8f3"),
  pic(`<rect width="300" height="300" fill="#eef1f6"/><rect y="244" width="300" height="56" fill="#c4cad4"/>${AMIR(74, 180, .95)}${SARA(154, 182, .95)}${ELSA(234, 186, .9)}${bubble(150, 60, 200, "Vi skriver en insändare")}`, "#eef1f6"),
  pic(`${room()}${board("INSÄNDARE", "tes · argument · slutsats")}${LENA(238, 166, .98)}${SARA(66, 176, .92)}`, "#eef4fb"),
  pic(`${room("#f3f6ef")}${laptop(150, 170, "ARGUMENT", "1 · 2 · 3")}${desk(150, 196, 220)}${AMIR(254, 192, .8)}`, "#f3f6ef"),
  pic(`${room("#f6f1e6")}${paper(118, 148, 1, "Visserligen", "… men", 5)}${SARA(236, 180, .9)}`, "#f6f1e6"),
  pic(`<rect width="300" height="300" fill="#ece7dc"/>${paper(150, 150, 1.6, "HAGABYBLADET", "Lat oss komma i tid", 7)}`, "#ece7dc"),
  pic(`<rect width="300" height="300" fill="#dde8f3"/>${stop(60, 240)}${bus(190, 212, .95)}${hand("07.40", 190, 120, 34, "#1f4fb0")}${NOAH(96, 206, .85)}<rect y="268" width="300" height="32" fill="#9aa4b5"/>`, "#dde8f3")];
const DELAR8 = ["tes", "argument", "motargument", "slutsats"];
/* [sentence from an insändare, which part it is] */
const ARG8: [string, string][] = [
  ["Buss 412 måste gå tjugo i åtta igen.", "tes"],
  ["Elever från Hagaby får frånvaro för en buss de inte kan styra.", "argument"],
  ["Visserligen kostar en extra morgonbuss pengar, men tomma bussar klockan två kostar också.", "motargument"],
  ["Därför bör kommunen flytta en tur från eftermiddagen till morgonen.", "slutsats"],
  ["Vuxna som pendlar missar sina tåg när bussen går tre minuter för tidigt.", "argument"],
  ["Vi anser att skolan ska ha ett eget busskort för alla i åttan.", "tes"],
  ["Sammanfattningsvis vinner både elever och kommunen på en tur mer på morgonen.", "slutsats"],
  ["Många tycker säkert att vi bara ska gå upp tidigare, men bussen går ju inte oftare då.", "motargument"],
  ["Tre av fyra elever i 8B åker buss varje dag.", "argument"],
  ["Hagaby behöver en kollektivtrafik som passar skolans tider.", "tes"]];
const ARGH = t3("Tesen säger vad du vill. Argumenten säger varför. Motargumentet börjar ofta med visserligen eller många tycker. Slutsatsen står sist och börjar ofta med därför eller sammanfattningsvis.", "The thesis says what you want. The arguments say why. The counter-argument often starts with visserligen or många tycker. The conclusion comes last and often starts with därför or sammanfattningsvis.", "الدعوى تقول ما تريد. والحجج تقول لماذا. والحجة المضادة تبدأ غالبًا بـ visserligen أو många tycker. والخلاصة تأتي أخيرًا وتبدأ غالبًا بـ därför أو sammanfattningsvis.");

defineUnit({
  id: "sv8b", year: 8, ord: 2, title: t3("Insändaren om busstiderna", "The letter about the bus times", "رسالة القارئ عن مواعيد الباص"), storyTitle: "Insändaren om busstiderna",
  icon: ICON(`${paper(90, 90, 1.15, "INSANDARE", "tes · argument", 6)}${bus(236, 120, .9)}`, "#ece7dc"),
  words: ["insandare", "kollektivtrafik", "tidtabell8", "pendla", "kommun", "kritisera", "beslut8", "missnojd"], terms: ["svtes8", "svmotargument8", "svslutsats8"],
  story: [
    {text: ["Två veckor senare ändrade kommunen tidtabellen. Buss 412 från Hagaby, som förut gick tjugo i åtta, gick nu tio i åtta – och nästa buss kom först kvart över.", "På måndagen stod Amir, Noah och Elsa vid hållplatsen i regnet. ”Den är redan borta”, sa Noah. ”Tre minuter för tidigt.” De kom in i salen tio minuter sent, och Lena skrev frånvaro på tre rader."],
      pic: PB[0], say: t3("Bussen går för tidigt. Vad händer när de kommer till skolan?", "The bus leaves too early. What happens when they get to school?", "الباص يتحرّك مبكرًا جدًّا. ماذا يحدث عندما يصلون إلى المدرسة؟")},
    {text: ["På rasten satt de i korridoren och var missnöjda. ”Det är kollektivtrafiken som är fel, inte vi”, sa Elsa. ”Min pappa pendlar till stan och hinner inte heller.” Noah räknade: elva elever i 8B åkte samma buss.",
      "”Då skriver vi en insändare”, sa Sara. ”Hagabybladet trycker insändare varje vecka. Där läser även politikerna i kommunen.”"],
      pic: PB[1], say: t3("Sara har en idé. Varför vill hon skriva just i Hagabybladet?", "Sara has an idea. Why does she want to write in Hagabybladet of all places?", "لدى سارة فكرة. لماذا تريد أن تكتب في صحيفة هاغابي تحديدًا؟")},
    {text: ["Lena blev nyfiken och lät dem arbeta på svenskan. ”En insändare är en argumenterande text”, sa hon. ”Börja med en tes: vad vill ni ska hända? Skriv den tidigt, inte i sista meningen.”",
      "”Vår tes är att 412 ska gå tjugo i åtta igen”, sa Amir. ”Bra”, sa Lena. ”Nu behöver ni tre argument som inte bara handlar om er själva. Och håll texten kort: en insändare som är längre än en sida läser ingen.”"],
      pic: PB[2], say: t3("Vad är en tes, enligt Lena? Var i texten ska den stå?", "What is a thesis, according to Lena? Where in the text should it go?", "ما هي الدعوى الرئيسية بحسب لينا؟ وأين يجب أن تأتي في النص؟")},
    {text: ["Argumenten kom snabbt. Det är inte rimligt att elever får frånvaro för en buss de inte kan styra. Vuxna som pendlar missar sina tåg. Tomma bussar på eftermiddagen kostar mer än en full buss på morgonen.",
      "”Och vad säger kommunen emot?” frågade Lena. Noah suckade. ”Att det kostar pengar.” ”Skriv det själva”, sa Lena. ”Ett motargument som ni bemöter gör texten starkare.”"],
      pic: PB[3], say: t3("Tre argument är klara. Varför ska de skriva ett motargument själva?", "Three arguments are ready. Why should they write a counter-argument themselves?", "اكتملت ثلاث حجج. لماذا يكتبون حجة مضادة بأنفسهم؟")},
    {text: ["Sara skrev: ”Visserligen kostar en extra morgonbuss pengar, men tomma bussar klockan två kostar också.” Sedan kom slutsatsen, kort och tydlig: flytta en tur från eftermiddagen till morgonen.",
      "De läste texten högt tre gånger. Varje gång strök de ett ord som bara var argt. Att kritisera ett beslut är inte samma sak som att skälla, sa Lena."],
      pic: PB[4], say: t3("Varför strök de arga ord ur texten?", "Why did they cross out the angry words?", "لماذا حذفوا الكلمات الغاضبة من النص؟")},
    {text: ["På torsdagen stod insändaren i tidningen under rubriken ”Låt oss komma i tid”. Under texten fanns tjugosex namn från 8B. Elsa klippte ut den och satte upp den på kylskåpet hemma.",
      "På fredagen kom ett mejl från kommunen. En tjänsteman skrev att beslutet var fattat efter en utredning, men att tidtabellen skulle ses över på nytt i november."],
      pic: PB[5], say: t3("Insändaren är publicerad. Vad svarar kommunen?", "The letter is published. What does the council answer?", "نُشرت الرسالة. بماذا تردّ البلدية؟")},
    {text: ["I november ändrades en enda tur. Buss 412 gick tjugo i åtta måndag till fredag, men eftermiddagsbussen halv tre togs bort.",
      "”Vi fick inte allt”, sa Amir. ”Det är en kompromiss”, sa Sara, ”men den är vår.” Noah log. ”Och nästa gång vet vi hur man gör.” Lena satte upp insändaren på väggen, bredvid klassens regler."],
      pic: PB[6], say: t3("De fick inte allt de ville. Varför säger Sara att kompromissen är ”vår”?", "They did not get everything they wanted. Why does Sara say the compromise is ”ours”?", "لم يحصلوا على كل ما أرادوا. لماذا تقول سارة إن الحلّ الوسط «لنا»؟")}],
  wordsSay: t3("Ord om bussar, kommunen och att argumentera. Tryck på ett ord för att se vad det betyder.", "Words about buses, the council and arguing your case. Tap a word to see what it means.", "كلمات عن الباصات والبلدية وعرض الحجج. اضغط على كلمة لترى معناها."),
  grammar: [
    {draw: () => {
      const rows: [string, string, string][] = [["Tes", "b", "vad vi vill"], ["Argument 1", "r", "varför"], ["Argument 2", "r", "varför"], ["Motargument", "o", "visserligen … men"], ["Slutsats", "g", "därför bör …"]];
      return [A.wipe(), head(t3("En insändare, fem steg", "A letter to the editor, five steps", "رسالة القارئ في خمس خطوات"), 56, 32),
        ...rows.flatMap(([s, c, lab], i) => [A.p(R.rect(170, 106 + i * 74, 300, 52, .6), c, 3.5), A.tx(s, 320, 140 + i * 74, 30, c), qt(lab, 610, 140 + i * 74, 23, "k")])];
    }, say: t3("En insändare har en ordning: först tesen, sedan två eller tre argument, sedan ett motargument som du bemöter, och sist en slutsats. Läsaren ska veta vad du vill redan i början.", "A letter to the editor has an order: first the thesis, then two or three arguments, then a counter-argument you answer, and last a conclusion. The reader should know what you want right at the start.", "لرسالة القارئ ترتيب: الدعوى أولًا، ثم حجتان أو ثلاث، ثم حجة مضادة تردّ عليها، وأخيرًا الخلاصة. على القارئ أن يعرف مطلبك من البداية.")},
    {draw: () => [A.wipe(), head(t3("Tes eller argument?", "Thesis or argument?", "دعوى أم حجة؟")),
      ...boxes([["Buss 412 ska gå tjugo i åtta.", "b", "tes = vad vi vill"]], 170, 26),
      ...boxes([["Elever får frånvaro för en buss.", "r", "argument = varför"]], 280, 26),
      ...boxes([["Tre av fyra i 8B åker buss.", "r", "argument = siffror"]], 390, 26),
      qt(T("Ett argument går att kontrollera. En tes är en åsikt.", "An argument can be checked. A thesis is an opinion.", "الحجة يمكن التحقّق منها، أما الدعوى فهي رأي."), 400, 465, 24, "k")],
     say: t3("Tesen är din åsikt: vad du vill ska hända. Argumenten är skälen, och de blir starkare om de går att kontrollera, till exempel med siffror.", "The thesis is your opinion: what you want to happen. The arguments are the reasons, and they get stronger if they can be checked, for example with numbers.", "الدعوى هي رأيك: ما تريد أن يحدث. والحجج هي الأسباب، وتصبح أقوى إذا كان يمكن التحقّق منها، مثلًا بالأرقام.")},
    {draw: () => [A.wipe(), head(t3("Bemöt motargumentet", "Answer the counter-argument", "ردّ على الحجة المضادة")),
      ...boxes([["Visserligen", "o", "det andra kan säga"], ["kostar en buss pengar,", null]], 180, 26),
      ...boxes([["men", "o", "ditt svar"], ["tomma bussar kostar också.", null]], 310, 26),
      A.tx("English: Admittedly … but …", 400, 400, 28, "k"), A.tx("صحيحٌ أنّ … لكن …", 400, 460, 36, "o")],
     say: t3("Skriv själv det starkaste motargumentet och svara på det. Visserligen … men … visar att du har tänkt på läsarens invändning. På engelska säger man admittedly, och på arabiska صحيح أن … لكن.", "Write the strongest counter-argument yourself and answer it. Visserligen … men … shows that you have thought about the reader's objection. In English you say admittedly, and in Arabic صحيح أن … لكن.", "اكتب أقوى حجة مضادة بنفسك وردّ عليها. عبارة visserligen … men … تُظهر أنك فكّرت في اعتراض القارئ. بالإنجليزية admittedly، وبالعربية: صحيح أن … لكن.")}],
  read: [
    {q: "Vad hade kommunen ändrat?", o: ["Tidtabellen för buss 412", "Skolans schema", "Priset på busskortet"], why: "Del 1: kommunen ändrade tidtabellen, och 412 gick tio i åtta."},
    {q: "Vad hände när de kom tio minuter sent?", o: ["Lena skrev frånvaro.", "De fick stanna kvar efter skolan.", "Rektorn ringde hem."], why: "Del 1: Lena skrev frånvaro på tre rader."},
    {q: "Vad är en tes, enligt Lena?", o: ["Det man vill ska hända, skrivet tidigt i texten", "Textens sista mening", "En lista på källor"], why: "Del 3: ”Börja med en tes: vad vill ni ska hända?”"},
    {q: "Vilket av argumenten handlade om pengar?", o: ["Tomma bussar på eftermiddagen kostar mer än en full morgonbuss.", "Eleverna är trötta på morgonen.", "Bussen är för liten."], why: "Del 4: Tomma bussar på eftermiddagen kostar mer än en full buss på morgonen."},
    {q: "Varför ville Lena att de skulle skriva ett motargument?", o: ["Texten blir starkare när man bemöter det andra kan invända.", "För att texten skulle bli längre.", "För att kommunen skulle bli arg."], why: "Del 4: ”Ett motargument som ni bemöter gör texten starkare.”"},
    {q: "Varför strök de ett ord varje gång de läste texten högt?", o: ["De ville kritisera beslutet utan att bara låta arga.", "Texten var för kort.", "Lena krävde exakt hundra ord."], why: "Del 5: Att kritisera ett beslut är inte samma sak som att skälla."},
    {q: "Vad svarade tjänstemannen på kommunen?", o: ["Att tidtabellen skulle ses över på nytt i november.", "Att bussen skulle tas bort helt.", "Att eleverna hade fel."], why: "Del 6: beslutet var fattat, men tidtabellen skulle ses över i november."},
    {q: "Vad ändrades till slut?", o: ["Morgonturen flyttades tillbaka, men eftermiddagsturen togs bort.", "Alla turer blev fler.", "Ingenting ändrades."], why: "Del 7: 412 gick tjugo i åtta, men bussen halv tre togs bort."},
    {q: "Varför säger Sara att kompromissen är ”vår”?", o: ["Klassen hade själv skrivit insändaren som ledde till ändringen.", "Hon hade betalat för bussen.", "Kommunen hade bett klassen om hjälp."], why: "Ändringen kom efter deras egen text. De hade påverkat beslutet själva."}],
  gram(lv, write): Problem {
    const [s, part] = pick(ARG8), sol = [...svLines(s, 280, 28, "k"), A.tx(part, 400, 440, 44, "g")];
    const hint = ARGH;
    if (write || lv === 2) return {kind: "text", ans: [part], show: part, q: [A.wipe(), head(t3("Vilken del av insändaren är detta? Skriv tes, argument, motargument eller slutsats.", "Which part of the letter is this? Write tes, argument, motargument or slutsats.", "أي جزء من الرسالة هذا؟ اكتب tes أو argument أو motargument أو slutsats."), 76, 26), ...svLines(s, 200, 32)], sol, hint: {say: hint, draw: []}};
    const q = [A.wipe(), head(t3("Vilken del av insändaren är detta?", "Which part of the letter to the editor is this?", "أي جزء من رسالة القارئ هذا؟"), 80, 30), ...svLines(s, 180, lv === 0 ? 32 : 30)];
    return choice([part, ...others(DELAR8, part)], part, q, sol, hint);
  },
  help: [{say: t3("Ordningen i en insändare: tes, argument, motargument, slutsats.", "The order in a letter to the editor: thesis, arguments, counter-argument, conclusion.", "ترتيب رسالة القارئ: الدعوى، الحجج، الحجة المضادة، الخلاصة."),
    draw: () => [A.tx("tes", 400, 130, 40, "b"), A.tx("argument", 400, 220, 40, "r"), A.tx("motargument", 400, 310, 40, "o"), A.tx("slutsats", 400, 400, 40, "g")]}]
});

/* ================= unit 3: Fejknyheten (källkritik) ================= */
word("kalla8", {sv: "källa (en)", m: "käll(?:a|an|or|orna)", d: t3("Den plats eller person som en uppgift kommer från.", "The place or person a piece of information comes from.", "المكان أو الشخص الذي جاءت منه المعلومة."), ex: "Vilken källa kommer bilden från?", tr: {en: "source", ar: "مصدر"}, syn: ["ursprung"], wrong: ["rubrik", "rykte"], gap: ["Innan du delar något bör du kolla", "källan", "."], gapForm: "källan", form: "en källa – källor"});
word("avsandare", {sv: "avsändare (en)", m: "avsändar(?:e|en|na)", d: t3("Den som har skrivit eller skickat något.", "The one who has written or sent something.", "من كتب الشيء أو أرسله."), ex: "Avsändaren var en okänd sida.", tr: {en: "sender, the one behind a text", ar: "المُرسِل"}, syn: ["upphovsman"], opp: ["mottagare"], wrong: ["läsare", "rubrik"], gap: ["Längst ner på sidan stod ingen", "avsändare", "alls."], gapForm: "avsändare", form: "en avsändare – avsändare"});
word("syfte", {sv: "syfte (ett)", m: "syft(?:e|et|en|ena)", d: t3("Det som någon vill uppnå med en text eller en handling.", "What someone wants to achieve with a text or an action.", "ما يريد أحدهم تحقيقه من نصّ أو عمل."), ex: "Sidans syfte var att sälja annonser.", tr: {en: "purpose, aim", ar: "هدف، غرض"}, syn: ["mål"], wrong: ["datum", "rubrik"], gap: ["Fråga alltid vad en text har för", "syfte", "."], gapForm: "syfte", form: "ett syfte – syften"});
word("granska", {sv: "granska", m: "granska(?:r|de|t|s|des|ts)?|granskning(?:en|ar)?", d: t3("Titta noga på något för att se om det stämmer.", "Look carefully at something to see if it is true.", "أن تفحص شيئًا بدقّة لترى إن كان صحيحًا."), ex: "De granskade bilden i tio minuter.", tr: {en: "examine, scrutinise", ar: "يدقّق، يفحص"}, syn: ["undersöka"], wrong: ["sprida", "gilla"], gap: ["Lena bad dem", "granska", "sidan innan de trodde på den."], gapForm: "granska", form: "granska – granskade – har granskat"});
word("rykte", {sv: "rykte (ett)", m: "rykt(?:e|et|en|ena)", d: t3("Något som många säger, men som ingen vet om det är sant.", "Something many people say, but nobody knows if it is true.", "شيء يتردّد على الألسنة ولا يعرف أحد إن كان صحيحًا."), ex: "Ett rykte spreds i klasschatten.", tr: {en: "rumour", ar: "إشاعة"}, syn: ["skvaller"], opp: ["bevis"], wrong: ["källa", "intervju"], gap: ["Ett", "rykte", "sprider sig snabbare än en rättelse."], gapForm: "rykte", form: "ett rykte – rykten"});
word("trovardig", {sv: "trovärdig", m: "trovärdig(?:t|a|are|ast|het|heten)?|otrovärdig(?:t|a)?", d: t3("Som man har goda skäl att tro på.", "That you have good reasons to believe.", "ما لديك أسباب وجيهة للثقة به."), ex: "En trovärdig källa går att kontrollera.", tr: {en: "credible, trustworthy", ar: "موثوق"}, syn: ["pålitlig"], opp: ["otrovärdig"], wrong: ["gratis", "snabb"], gap: ["En sida utan avsändare är inte särskilt", "trovärdig", "."], gapForm: "trovärdig", form: "trovärdig – trovärdigt – trovärdiga"});
word("sprida", {sv: "sprida", m: "(?:sprid(?:a|er|s|es|it|its|d|da|dde|des)?|spred(?:s|e)?)", d: t3("Få något att gå vidare till många.", "Make something reach many people.", "أن تجعل شيئًا يصل إلى كثيرين."), ex: "Bilden spreds i hela skolan.", tr: {en: "spread", ar: "ينشر"}, syn: ["dela"], opp: ["stoppa"], wrong: ["granska", "gömma"], gap: ["På en timme hade någon hunnit", "sprida", "bilden till hela skolan."], gapForm: "sprida", form: "sprida – spred – har spridit"});
word("manipulera", {sv: "manipulera", m: "manipulera(?:r|d|de|t|s|ts|des)?|manipulerad(?:e|a|t)?", d: t3("Ändra något, till exempel en bild, för att lura andra.", "Change something, for example a picture, in order to fool others.", "أن تعدّل شيئًا، كصورة مثلًا، لتضليل الآخرين."), ex: "Bilden var manipulerad.", tr: {en: "manipulate, doctor", ar: "يتلاعب، يُعدّل للتضليل"}, syn: ["lura"], wrong: ["fotografera", "granska"], gap: ["Vargen var klistrad in: bilden var", "manipulerad", "."], gapForm: "manipulerad", form: "manipulera – manipulerade – har manipulerat"});
word("svkallkritik8", {sv: "källkritik", m: "källkritik(?:en)?|källkritisk(?:t|a)?", d: t3("Att undersöka om en uppgift går att lita på.", "Checking whether a piece of information can be trusted.", "أن تتحقّق إن كانت المعلومة جديرة بالثقة."), ex: "Fyra frågor: avsändare, källa, syfte, aktualitet.", tr: {en: "source criticism", ar: "النقد المصدري"}});
word("svaktualitet8", {sv: "aktualitet", m: "aktualitet(?:en)?", d: t3("Hur ny en uppgift är. Gammal information kan vara fel i dag.", "How recent a piece of information is. Old information can be wrong today.", "مدى حداثة المعلومة. المعلومة القديمة قد تكون خاطئة اليوم."), ex: "Bilden var elva år gammal.", tr: {en: "topicality, how recent", ar: "حداثة المعلومة"}});

const wolf = (x: number, y: number, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-26" y="6" width="9" height="26" rx="4" fill="#8e96a3"/><rect x="-8" y="6" width="9" height="26" rx="4" fill="#8e96a3"/><rect x="12" y="6" width="9" height="26" rx="4" fill="#8e96a3"/><ellipse rx="34" ry="17" fill="#8e96a3"/><circle cx="34" cy="-14" r="14" fill="#8e96a3"/><path d="M24 -24 l2 -14 l10 10Z M40 -26 l8 -13 l3 14Z" fill="#6c7480"/><path d="M46 -16 l14 5 l-13 6Z" fill="#a3aab5"/><circle cx="40" cy="-16" r="2.2" fill="#f2c94c"/></g>`;
const fence = (y: number) => [...Array(11)].map((_, i) => `<rect x="${i * 28 + 6}" y="${y}" width="7" height="54" rx="3" fill="#9aa4b5"/>`).join("") + `<path d="M0 ${y + 14} h300 M0 ${y + 38} h300" stroke="#9aa4b5" stroke-width="5"/>`;
const PC8 = [
  pic(`<rect width="300" height="300" fill="#dfe6ee"/>${fence(150)}${wolf(150, 190, 1.05)}${hand("VARG PA SKOLGARD", 150, 48, 25, "#d63b2f")}${hand("SKOLAN STANGS", 150, 80, 22, "#d63b2f")}`, "#dfe6ee"),
  pic(`${room()}${YASMIN(96, 182, .95)}${phone(206, 164, .85, "DELA", "#d63b2f")}${bubble(96, 72, 136, "Jag gar inte ut")}`, "#f7f1ea"),
  pic(`${room("#f1f5fa")}${board("KALLKRITIK", "vem? varifran? varfor? nar?")}${LENA(234, 164)}${AMIR(64, 176, .9)}`, "#eef4fb"),
  pic(`${room("#f3f6ef")}${laptop(150, 168, "hagabynytt24", "ingen avsandare")}${desk(150, 194, 220)}${NOAH(252, 190, .8)}`, "#f3f6ef"),
  pic(`${room("#f1f5fa")}${phone(96, 158, 1, "KANADA", "#5b6884")}${SARA(222, 176, .95)}${hand("2014", 96, 252, 26, "#1f4fb0")}`, "#eef4fb"),
  pic(`${room()}${ELSA(74, 176, .92)}${LENA(226, 166, 1)}${bubble(150, 62, 204, "Varje klick ger pengar")}`, "#f6f1e6"),
  pic(`${room("#f6f1e6")}${paper(150, 146, 1.2, "4 FRAGOR", "avsandare · kalla · syfte", 5)}${AMIR(254, 192, .78)}`, "#f6f1e6")];
const KKORD8 = ["avsändare", "källa", "syfte", "aktualitet"];
/* [a question or an observation, which source-critical word it is about] */
const KK8: [string, string][] = [
  ["Vem står bakom texten?", "avsändare"],
  ["Var kommer uppgiften ifrån?", "källa"],
  ["Varför är texten skriven?", "syfte"],
  ["När är bilden tagen?", "aktualitet"],
  ["Sidan har ingen redaktion och inget namn någonstans.", "avsändare"],
  ["Bilden är elva år gammal.", "aktualitet"],
  ["Sidan är full av annonser och en stor dela-knapp.", "syfte"],
  ["Uppgiften kommer från en okänd sida i ett annat land.", "källa"],
  ["Snön i bilden stämmer inte med september i Hagaby.", "aktualitet"],
  ["Tidningen skriver vem som har skrivit artikeln.", "avsändare"],
  ["Texten vill att du ska köpa något.", "syfte"],
  ["Artikeln hänvisar till en forskare vid ett universitet.", "källa"]];
const KKH = t3("Avsändare = vem. Källa = varifrån uppgiften kommer. Syfte = varför texten finns. Aktualitet = hur ny uppgiften är.", "Avsändare = who. Källa = where the information comes from. Syfte = why the text exists. Aktualitet = how recent the information is.", "avsändare = مَن. källa = من أين جاءت المعلومة. syfte = لماذا كُتب النص. aktualitet = ما مدى حداثة المعلومة.");

defineUnit({
  id: "sv8c", year: 8, ord: 3, title: t3("Fejknyheten", "The fake news story", "الخبر المزيّف"), storyTitle: "Fejknyheten",
  icon: ICON(`<rect x="20" y="30" width="170" height="120" rx="6" fill="#dfe6ee" stroke="#9aa4b5" stroke-width="3"/>${wolf(104, 112, .9)}${hand("VARG?", 104, 64, 30, "#d63b2f")}${hand("4 FRAGOR", 256, 80, 26, "#1f4fb0")}${hand("vem? varfor?", 256, 112, 20, "#5b6884")}`, "#eef4fb"),
  words: ["kalla8", "avsandare", "syfte", "granska", "rykte", "trovardig", "sprida", "manipulera"], terms: ["svkallkritik8", "svaktualitet8"],
  story: [
    {text: ["På morgonen hade alla sett bilden. En varg stod på Björkskolans skolgård, mellan gungorna och staketet. Över bilden stod rubriken ”VARG PÅ SKOLGÅRD I HAGABY – SKOLAN STÄNGS”.",
      "Yasmin, Amirs lillasyster, vägrade gå ut på rasten. Länken hade spridits i tre klasschattar på en kvart, och ingen visste vem som hade lagt upp den först. Amir räknade: tjugotvå personer hade delat bilden redan före åtta."],
      pic: PC8[0], say: t3("En varg på skolgården? Vad gör Yasmin när hon ser bilden?", "A wolf in the schoolyard? What does Yasmin do when she sees the picture?", "ذئب في ساحة المدرسة؟ ماذا تفعل ياسمين عندما ترى الصورة؟")},
    {text: ["Lena lade bort schemat för dagen. ”Då gör vi något annat”, sa hon och skrev ett ord på tavlan: KÄLLKRITIK. ”Vi ska granska den här sidan tillsammans. Fyra frågor.”",
      "Hon skrev dem under varandra: Vem är avsändare? Vilken källa har de? Vad är syftet? När är bilden tagen? ”Ingen av er behöver tro mig”, sa hon. ”Ni ska kontrollera själva.”"],
      pic: PC8[2], say: t3("Lena skriver fyra frågor. Vilka är de?", "Lena writes four questions. What are they?", "تكتب لينا أربعة أسئلة. ما هي؟")},
    {text: ["Första frågan tog två minuter. Sidan hette hagabynytt24 och hade ingen redaktion, ingen adress och ingen avsändare längst ner – bara trettio annonser och en stor knapp där det stod dela.",
      "”Jämför med Hagabybladet”, sa Lena. ”Där står namnet på den som har skrivit, och de rättar sig när de har fel. Det gör en källa mer trovärdig.”"],
      pic: PC8[3], say: t3("Vad saknas på sidan hagabynytt24? Vad gör en källa mer trovärdig?", "What is missing on the hagabynytt24 site? What makes a source more credible?", "ما الذي ينقص موقع hagabynytt24؟ وما الذي يجعل المصدر أكثر موثوقية؟")},
    {text: ["Noah sökte på bilden i stället för på texten. Samma varg kom upp på en sida från Kanada, publicerad för elva år sedan. Han visade sökresultatet på projektorn så att alla kunde se datumet.",
      "”Och titta här”, sa Sara. Hon zoomade in. Snön låg kvar vid staketet, men i Hagaby var det september och sjutton grader. Dessutom slutade vargens skugga rakt ut i luften. Bilden var manipulerad."],
      pic: PC8[4], say: t3("Två saker avslöjar bilden. Vilka?", "Two things give the picture away. Which ones?", "شيئان يكشفان الصورة. ما هما؟")},
    {text: ["”Vad hade sidan för syfte?” frågade Lena. Elsa räknade annonserna. ”Pengar. Varje klick är värt något.”",
      "”Och ett rykte som skrämmer sprids fortare än ett som är tråkigt”, sa Lena. ”Det är därför den sortens rubriker skrivs med stora bokstäver.”"],
      pic: PC8[5], say: t3("Vad var sidans syfte? Varför sprids skrämmande rykten snabbt?", "What was the site's purpose? Why do frightening rumours spread fast?", "ما كان هدف الموقع؟ ولماذا تنتشر الإشاعات المخيفة بسرعة؟")},
    {text: ["Klassen skrev en kort text och lade upp den i alla chattar: bilden var elva år gammal, tagen i Kanada och manipulerad, och skolan var inte stängd. Amir ringde hem till Yasmin på rasten. Hon lovade att inte titta på bilden igen, men hon gjorde det ändå.",
      "Men hälften av eleverna i sjuan trodde fortfarande på vargen. ”En rättelse får aldrig lika många läsare som en lögn”, sa Lena. ”Det är därför man granskar innan man delar.”"],
      pic: PC8[1], say: t3("Klassen skriver en rättelse. Varför tror många ändå på bilden?", "The class writes a correction. Why do many still believe the picture?", "يكتب الصف تصحيحًا. فلماذا يظلّ كثيرون يصدّقون الصورة؟")},
    {text: ["På eftermiddagen skrev Sara en insändare till Hagabybladet om hur snabbt ett rykte går i en liten kommun. Hon kritiserade inte eleverna som hade delat bilden. ”De var rädda, inte dumma”, sa hon.",
      "Lena hängde upp de fyra frågorna vid dörren, under klassens regler. Under frågorna skrev hon ett datum, för att visa att texten var ny. Amir läste dem varje gång han gick ut. Avsändare. Källa. Syfte. Aktualitet."],
      pic: PC8[6], say: t3("Sara skriver en insändare. Varför kritiserar hon inte dem som delade bilden?", "Sara writes a letter to the editor. Why doesn't she criticise the ones who shared the picture?", "تكتب سارة رسالة قارئ. لماذا لا تنتقد من شاركوا الصورة؟")}],
  wordsSay: t3("Ord för källkritik. Tryck på ett ord för att se vad det betyder och ett exempel.", "Words for source criticism. Tap a word to see what it means and an example.", "كلمات النقد المصدري. اضغط على كلمة لترى معناها ومثالًا عليها."),
  grammar: [
    {draw: () => {
      const rows: [string, string, string][] = [["Vem?", "avsändare", "b"], ["Varifrån?", "källa", "r"], ["Varför?", "syfte", "g"], ["När?", "aktualitet", "o"]];
      return [A.wipe(), head(t3("Fyra frågor till varje källa", "Four questions for every source", "أربعة أسئلة لكل مصدر")),
        ...rows.flatMap(([q, a, c], i) => [A.tx(q, 270, 160 + i * 82, 34, "k", "end"), A.arrow(292, 152 + i * 82, 372, 152 + i * 82, c), A.tx(a, 470, 160 + i * 82, 36, c, "start")])];
    }, say: t3("Ställ fyra frågor innan du tror på något: Vem är avsändare? Varifrån kommer uppgiften, alltså vilken källa? Varför finns texten, vad är syftet? Och när gjordes den – är den aktuell?", "Ask four questions before you believe anything: Who is the sender? Where does the information come from, that is, which source? Why does the text exist, what is its purpose? And when was it made – is it recent?", "اسأل أربعة أسئلة قبل أن تصدّق: من المُرسِل؟ من أين جاءت المعلومة، أي ما المصدر؟ لماذا كُتب النص، ما الهدف؟ ومتى كُتب، أي هل هو حديث؟")},
    {draw: () => [A.wipe(), head(t3("Trovärdig eller inte?", "Credible or not?", "موثوق أم لا؟")),
      A.tx(T("trovärdig", "credible", "موثوق"), 210, 130, 34, "g"), A.tx(T("tveksam", "doubtful", "مشكوك فيه"), 590, 130, 34, "o"),
      A.p(R.line(400, 150, 400, 450, .3), "k", 2),
      ...["namn på den som skrivit", "datum på texten", "rättar sina fel", "hänvisar till källor"].map((s, i) => A.tx(s, 210, 200 + i * 62, 24, "g")),
      ...["ingen avsändare", "inget datum", "bara en dela-knapp", "trettio annonser"].map((s, i) => A.tx(s, 590, 200 + i * 62, 24, "o"))],
     say: t3("En trovärdig sida vågar skriva vem som har skrivit, när det skrevs och varifrån uppgifterna kommer. En sida som bara vill ha klick ger dig rubriker och annonser i stället.", "A credible site dares to say who wrote it, when it was written and where the information comes from. A site that only wants clicks gives you headlines and adverts instead.", "الموقع الموثوق يذكر من كتب النص ومتى ومن أين جاءت المعلومات. أما الموقع الذي يريد النقرات فقط فيقدّم لك العناوين والإعلانات بدلًا من ذلك.")},
    {draw: () => [A.wipe(), head(t3("Fyra vanliga syften", "Four common purposes", "أربعة أهداف شائعة")),
      ...boxes([["informera", "b", "nyhetstext"], ["påverka", "r", "insändare"]], 190, 30),
      ...boxes([["sälja", "g", "annons"], ["underhålla", "o", "meme"]], 330, 30),
      qt(T("En text kan ha flera syften samtidigt.", "A text can have several purposes at the same time.", "يمكن أن يكون للنص أكثر من هدف في الوقت نفسه."), 400, 440, 26, "k")],
     say: t3("De flesta texter vill informera, påverka, sälja eller underhålla. Fejknyheten om vargen ville både underhålla och sälja annonser, men den låtsades informera. Det är därför den är farlig.", "Most texts want to inform, persuade, sell or entertain. The fake news about the wolf wanted both to entertain and to sell adverts, but it pretended to inform. That is what makes it dangerous.", "معظم النصوص تريد أن تُخبر أو تُؤثّر أو تبيع أو تُسلّي. والخبر المزيّف عن الذئب أراد التسلية وبيع الإعلانات، لكنه تظاهر بأنه يُخبر. ولهذا هو خطير.")}],
  read: [
    {q: "Vad visade bilden som spreds?", o: ["En varg på skolgården", "En stängd skoldörr", "En buss i snö"], why: "Del 1: En varg stod på Björkskolans skolgård."},
    {q: "Vilka fyra frågor skrev Lena på tavlan?", o: ["Avsändare, källa, syfte och aktualitet", "Vem, vad, var och hur", "Tes, argument, motargument och slutsats"], why: "Del 2: Vem är avsändare? Vilken källa? Vad är syftet? När är bilden tagen?"},
    {q: "Vad saknades på sidan hagabynytt24?", o: ["Redaktion, adress och avsändare", "Bilder och rubriker", "Annonser"], why: "Del 3: ingen redaktion, ingen adress och ingen avsändare."},
    {q: "Hur upptäckte Noah att bilden var gammal?", o: ["Han sökte på själva bilden och hittade den på en sida från Kanada.", "Han frågade Lena.", "Det stod ett datum under bilden."], why: "Del 4: Noah sökte på bilden, och samma varg kom upp på en elva år gammal sida."},
    {q: "Vad fick Sara att tvivla på bilden?", o: ["Snön vid staketet och vargens skugga", "Vargens färg", "Att bilden var svartvit"], why: "Del 4: Snön stämde inte med september, och skuggan slutade i luften."},
    {q: "Vad var sidans syfte?", o: ["Att få klick som ger pengar genom annonser", "Att varna barnen i Hagaby", "Att hjälpa kommunen"], why: "Del 5: Elsa räknade annonserna. Varje klick är värt pengar."},
    {q: "Varför sprids ett skrämmande rykte snabbare än ett tråkigt?", o: ["Rädsla gör att folk delar innan de kontrollerar.", "Skrämmande texter är alltid korta.", "Tidningarna betalar för dem."], why: "Del 5: ett rykte som skrämmer sprids fortare. Känslan går före granskningen."},
    {q: "Varför får en rättelse färre läsare än lögnen?", o: ["Den är inte lika spännande, så färre delar den vidare.", "Den publiceras aldrig.", "Den är skriven på ett annat språk."], why: "Del 6: ”En rättelse får aldrig lika många läsare som en lögn.”"},
    {q: "Varför kritiserade Sara inte eleverna som hade delat bilden?", o: ["Hon tyckte att de var rädda, inte dumma.", "Hon hade själv delat den.", "Lena förbjöd henne."], why: "Del 7: ”De var rädda, inte dumma.”"}],
  gram(lv, write): Problem {
    const [s, k] = pick(KK8), sol = [...svLines(s, 270, 28, "k"), A.tx(k, 400, 430, 44, "g")];
    if (write || lv === 2) return {kind: "text", ans: [k], show: k, q: [A.wipe(), head(t3("Vilket källkritiskt ord passar? Skriv avsändare, källa, syfte eller aktualitet.", "Which source-critical word fits? Write avsändare, källa, syfte or aktualitet.", "أي كلمة من كلمات النقد المصدري تناسب؟ اكتب avsändare أو källa أو syfte أو aktualitet."), 76, 26), ...svLines(s, 200, 32)], sol, hint: {say: KKH, draw: []}};
    return choice([k, ...others(KKORD8, k)], k, [A.wipe(), head(t3("Vilket källkritiskt ord handlar det om?", "Which source-critical word is this about?", "عن أي كلمة من كلمات النقد المصدري نتحدّث؟"), 80, 30), ...svLines(s, 190, 32)], sol, KKH);
  },
  help: [{say: t3("Fyra frågor: avsändare, källa, syfte, aktualitet.", "Four questions: sender, source, purpose, how recent.", "أربعة أسئلة: المُرسِل، المصدر، الهدف، الحداثة."),
    draw: () => [A.tx("Vem? → avsändare", 400, 140, 34, "b"), A.tx("Varifrån? → källa", 400, 220, 34, "r"), A.tx("Varför? → syfte", 400, 300, 34, "g"), A.tx("När? → aktualitet", 400, 380, 34, "o")]}]
});

/* ================= unit 4: Novellen: Spegeln (berättarteknik) ================= */
word("spegel", {sv: "spegel (en)", m: "(?:spegeln?|spegl(?:ar|arna|ade|as))|spegelbild(?:en)?", d: t3("En glasskiva som man ser sig själv i.", "A sheet of glass you can see yourself in.", "لوح زجاجي ترى فيه نفسك."), ex: "Spegeln i källaren var täckt av en duk.", tr: {en: "mirror", ar: "مرآة"}, syn: ["spegelglas"], wrong: ["fönster", "tavla"], gap: ["Längst in i källaren stod en gammal", "spegel", "."], gapForm: "spegel", form: "en spegel – speglar"});
word("gestalt", {sv: "gestalt (en)", m: "gestalt(?:en|er|erna)?", d: t3("En person eller figur som man ser otydligt.", "A person or figure you can only see indistinctly.", "شخص أو هيئة تراها غير واضحة."), ex: "En mörk gestalt rörde sig i spegeln.", tr: {en: "figure, shape of a person", ar: "هيئة، شخص غامض"}, syn: ["figur"], wrong: ["ljud", "dörr"], gap: ["I det svaga ljuset såg hon en", "gestalt", "bakom sig."], gapForm: "gestalt", form: "en gestalt – gestalter"});
word("skymning", {sv: "skymning (en)", m: "skymning(?:en|ar)?", d: t3("Tiden när dagen blir mörk, strax efter solnedgången.", "The time when the day turns dark, just after sunset.", "الوقت الذي يحلّ فيه الظلام، بعد الغروب."), ex: "Det var skymning när hon gick ner.", tr: {en: "dusk, twilight", ar: "الغَسَق"}, syn: ["kvällsmörker"], opp: ["gryning"], wrong: ["middag", "sommar"], gap: ["I", "skymningen", "ser allting större ut än det är."], gapForm: "skymningen", form: "en skymning – skymningar"});
word("kuslig", {sv: "kuslig", m: "kuslig(?:t|a|are|ast)?", d: t3("Som gör en rädd på ett obehagligt sätt.", "That makes you scared in an unpleasant way.", "يُخيفك على نحوٍ مزعج."), ex: "Det var kusligt tyst i korridoren.", tr: {en: "creepy, eerie", ar: "مُريب"}, syn: ["läskig"], opp: ["trygg"], wrong: ["rolig", "varm"], gap: ["Trappan ner till källaren kändes", "kuslig", "."], gapForm: "kuslig", form: "kuslig – kusligt – kusliga"});
word("rysa", {sv: "rysa", m: "(?:rys(?:a|er)|ryste|ryst|rysning(?:en|ar|arna)?)", d: t3("Känna en kall skakning i kroppen av rädsla eller kyla.", "Feel a cold shiver in your body from fear or cold.", "أن تشعر برجفة باردة في جسدك من الخوف أو البرد."), ex: "Sara ryste när hon läste slutet.", tr: {en: "shiver, shudder", ar: "يرتجف"}, syn: ["skaka"], wrong: ["skratta", "sova"], gap: ["Hon kunde inte låta bli att", "rysa", "när hon hörde ljudet."], gapForm: "rysa", form: "rysa – ryste – har ryst"});
word("ana", {sv: "ana", m: "ana(?:r|de|t|s)?|aning(?:en|ar)?", d: t3("Känna att något är på väg att hända, utan att veta säkert.", "Feel that something is about to happen, without knowing for sure.", "أن تُحسّ بأن شيئًا سيحدث دون أن تعرف بيقين."), ex: "Hon anade att något var fel.", tr: {en: "sense, suspect", ar: "يُحسّ، يتوقّع"}, syn: ["känna"], opp: ["veta"], wrong: ["bevisa", "glömma"], gap: ["Läsaren får", "ana", "vad som händer, utan att få svaret."], gapForm: "ana", form: "ana – anade – har anat"});
word("vandpunkt", {sv: "vändpunkt (en)", m: "vändpunkt(?:en|er|erna)?", d: t3("Stället i en berättelse där allt ändras.", "The place in a story where everything changes.", "الموضع في القصة الذي يتغيّر فيه كل شيء."), ex: "Vändpunkten kommer när duken faller.", tr: {en: "turning point", ar: "نقطة التحوّل"}, syn: ["brytpunkt"], wrong: ["rubrik", "slutsats"], gap: ["Novellens", "vändpunkt", "kommer mitt i berättelsen."], gapForm: "vändpunkt", form: "en vändpunkt – vändpunkter"});
word("tystnad", {sv: "tystnad (en)", m: "tystnad(?:en)?", d: t3("När det inte hörs något alls.", "When nothing at all can be heard.", "حين لا يُسمع أي صوت."), ex: "Efter sista meningen blev det tystnad i klassrummet.", tr: {en: "silence", ar: "صَمت"}, syn: ["stillhet"], opp: ["ljud"], wrong: ["musik", "skratt"], gap: ["I källaren hördes ingenting: en total", "tystnad", "."], gapForm: "tystnad", form: "en tystnad"});
word("svnovell8", {sv: "novell", m: "novell(?:en|er|erna)?", d: t3("En kort berättelse med få personer och en enda viktig händelse.", "A short story with few characters and one single important event.", "قصة قصيرة بأشخاص قليلين وحدث مهمّ واحد."), ex: "Sara skrev en novell om en spegel.", tr: {en: "short story", ar: "قصة قصيرة"}});
word("svmiljo8", {sv: "miljö", m: "miljö(?:n|er|erna)?", d: t3("Platsen och stämningen där berättelsen händer.", "The place and the mood where the story happens.", "المكان والجوّ الذي تحدث فيه القصة."), ex: "Källaren i skymningen.", tr: {en: "setting", ar: "المكان والجوّ"}});
word("svoppetslut8", {sv: "öppet slut", m: "öppet slut(?:et)?|öppna slut(?:et)?", d: t3("Ett slut som inte ger läsaren svaret, utan låter läsaren tänka själv.", "An ending that does not give the reader the answer, but lets the reader think for themselves.", "نهاية لا تعطي القارئ الجواب بل تتركه يفكّر بنفسه."), ex: "Dörren stod öppen, och där slutade novellen.", tr: {en: "open ending", ar: "نهاية مفتوحة"}});

const mirror = (x: number, y: number, s = 1, covered = false, fig = false) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-42" y="-72" width="84" height="150" rx="8" fill="#5b3d26"/><rect x="-33" y="-62" width="66" height="130" rx="4" fill="${covered ? "#5b3d26" : "#cfe0ef"}"/>${covered ? `<path d="M-52 -80 q52 -16 104 0 l-6 120 q-46 -14 -92 0Z" fill="#efe9dc" stroke="#cfc6b4" stroke-width="2"/>` : `<path d="M-33 40 l66 -84" stroke="#fff" stroke-width="5" opacity=".5"/>${fig ? `<path d="M-14 50 q-6 -44 14 -56 q20 12 14 56Z" fill="#4a5568" opacity=".85"/><circle cx="0" cy="-28" r="12" fill="#4a5568" opacity=".85"/>` : ""}`}</g>`;
const stairs = (y: number) => [...Array(5)].map((_, i) => `<rect x="${i * 30}" y="${y + i * 24}" width="${300 - i * 30}" height="24" fill="${i % 2 ? "#7d7366" : "#8d8275"}"/>`).join("");
const dim = (o = .4) => `<rect width="300" height="300" fill="#1d2433" opacity="${o}"/>`;
const PD8 = [
  pic(`${room("#f1f5fa")}${board("NOVELL", "miljo · konflikt · vandpunkt")}${LENA(236, 162)}${SARA(66, 176, .92)}`, "#eef4fb"),
  pic(`<rect width="300" height="300" fill="#6b7280"/>${stairs(170)}${mirror(214, 150, .9, true)}${phone(84, 164, .8, "", "#1f4fb0")}${dim(.25)}`, "#555d68"),
  pic(`<rect width="300" height="300" fill="#5d6673"/>${mirror(150, 140, 1.15, false)}${SARA(66, 210, .8)}${dim(.3)}`, "#4e5662"),
  pic(`<rect width="300" height="300" fill="#4e5662"/>${mirror(170, 138, 1.15, false, true)}${SARA(58, 206, .8)}${dim(.35)}${hand("!", 112, 92, 44, "#f2c94c")}`, "#434a55"),
  pic(`<rect width="300" height="300" fill="#4e5662"/>${stairs(140)}<rect x="104" y="18" width="92" height="118" rx="4" fill="#2b313a" stroke="#8d8275" stroke-width="4"/><path d="M196 18 l44 -8 v126 l-44 -10Z" fill="#f7d14c" opacity=".55"/>${dim(.2)}`, "#434a55"),
  pic(`${room()}${SARA(150, 162, 1.05)}${AMIR(58, 184, .85)}${NOAH(246, 186, .85)}${hand("...", 150, 76, 40, "#5b6884")}`, "#f6f1e6"),
  pic(`${room("#f1f5fa")}${board("miljo - konflikt", "vandpunkt - oppet slut")}${LENA(60, 170, .98)}${SARA(176, 180, .9)}${AMIR(248, 184, .86)}`, "#eef4fb")];
const DELNOV8 = ["miljö", "konflikt", "vändpunkt", "slut"];
/* [sentence from the novell, which part of the story it belongs to] */
const NOV8: [string, string][] = [
  ["Det var skymning när Mira gick ner i källaren.", "miljö"],
  ["Lysrören blinkade två gånger och slocknade.", "miljö"],
  ["Flickan i spegeln vinkade också, men en halv sekund för sent.", "konflikt"],
  ["Mira stod helt stilla och hörde inte sin egen andning.", "konflikt"],
  ["Bakom glaset lade en gestalt sin hand mot ramen.", "vändpunkt"],
  ["Spegelbilden stannade kvar när Mira tog ett steg bakåt.", "vändpunkt"],
  ["Längst upp stod dörren öppen, men hon hade stängt den själv.", "slut"],
  ["Och i källaren hängde duken tillbaka över spegeln.", "slut"],
  ["Ramen var av mörkt trä och luktade damm.", "miljö"],
  ["Hon ryste: det var hennes egen tröja på någon annan.", "konflikt"]];
const NOVH = t3("Miljö = plats och stämning i början. Konflikt = problemet som växer. Vändpunkt = ögonblicket då allt ändras. Slut = de sista raderna, ofta öppna.", "Miljö = place and mood at the start. Konflikt = the problem that grows. Vändpunkt = the moment when everything changes. Slut = the last lines, often open.", "miljö = المكان والجوّ في البداية. konflikt = المشكلة التي تكبر. vändpunkt = اللحظة التي يتغيّر فيها كل شيء. slut = الأسطر الأخيرة، وغالبًا تكون مفتوحة.");
/* [the feeling, a sentence that shows it, two sentences that only tell it] */
const VISA8: [string, string, string, string][] = [
  ["rädd", "Mira hörde sin egen puls i öronen.", "Mira var mycket rädd.", "Mira kände en stark rädsla."],
  ["kall källare", "Hennes andedräkt syntes i ljuset från mobilen.", "Det var mycket kallt i källaren.", "Källaren kändes kall och otrevlig."],
  ["tyst", "Hon hörde lysröret klicka två gånger, inget annat.", "Det var alldeles tyst i rummet.", "Tystnaden i rummet var total."],
  ["nervös", "Hon torkade handen mot tröjan tre gånger.", "Hon var nervös hela tiden.", "Hon kände sig mycket nervös."],
  ["kusligt", "Duken rörde sig fast fönstret var stängt.", "Det var kusligt i rummet.", "Rummet kändes kusligt och obehagligt."],
  ["arg", "Hon knycklade ihop lappen i fickan.", "Hon var väldigt arg.", "Hon kände sig arg på allting."]];
const VISAH = t3("Visa i stället för att berätta: skriv vad läsaren kan se eller höra, inte vad personen känner.", "Show instead of telling: write what the reader can see or hear, not what the character feels.", "أظهِر ولا تُخبر: اكتب ما يراه القارئ أو يسمعه، لا ما يشعر به الشخص.");

defineUnit({
  id: "sv8d", year: 8, ord: 4, title: t3("Novellen: Spegeln", "The short story: The Mirror", "القصة القصيرة: المرآة"), storyTitle: "Novellen: Spegeln",
  icon: ICON(`${mirror(104, 90, 1.1, false, true)}${hand("SPEGELN", 232, 84, 34, "#efe9dc")}${hand("en novell", 232, 118, 22, "#c9d2e0")}`, "#4e5662"),
  words: ["spegel", "gestalt", "skymning", "kuslig", "rysa", "ana", "vandpunkt", "tystnad"], terms: ["svnovell8", "svmiljo8", "svoppetslut8"],
  story: [
    {text: ["”Nu ska ni skriva en novell”, sa Lena. ”Kort text, få personer, en enda viktig händelse. Miljö i början, en konflikt, en vändpunkt – och ett slut som läsaren får tänka på själv.”",
      "Sara visste direkt vad hon skulle skriva om. Det fanns ett gammalt rykte på Björkskolan om en spegel i källaren, och ingen hade någonsin granskat om det var sant."],
      pic: PD8[0], say: t3("Klassen ska skriva en novell. Vad ska den innehålla, enligt Lena?", "The class is going to write a short story. What should it contain, according to Lena?", "سيكتب الصف قصة قصيرة. ماذا يجب أن تحتوي بحسب لينا؟")},
    {text: ["Hennes novell började så här: ”Det var skymning när Mira gick ner i källaren för att hämta nycklarna. Lysrören blinkade två gånger och slocknade.",
      "Trappan var av betong, och varje steg lät annorlunda än det förra. I ljuset från mobilen såg hon en vit duk längst in vid väggen, och under duken ett spegelglas.”"],
      pic: PD8[1], say: t3("Novellens miljö: källaren i skymningen. Vad hittar Mira under duken?", "The story's setting: the cellar at dusk. What does Mira find under the cloth?", "جوّ القصة: القبو في الغسق. ماذا تجد ميرا تحت القماش؟")},
    {text: ["”Mira drog bort duken. Spegeln var högre än hon själv, och ramen var av mörkt trä. Hon lyfte handen och vinkade åt sig själv. Flickan i spegeln vinkade också – men en halv sekund för sent.",
      "Mira stod helt stilla. Hon hörde inte sin egen andning. Det var en total tystnad i rummet, och hon anade att hon inte var ensam. Hon räknade till tre och vinkade igen. Samma fördröjning.”"],
      pic: PD8[2], say: t3("Något är fel med spegelbilden. Vad är det?", "Something is wrong with the reflection. What is it?", "هناك خطأ في صورة المرآة. ما هو؟")},
    {text: ["”Hon tog ett steg bakåt. Spegelbilden stannade kvar. Bakom glaset rörde sig en gestalt, längre och smalare än Mira, och lade sin hand mot ramen från andra sidan.",
      "Mira ryste. Det var kusligt att se sin egen tröja på någon annan.”"],
      pic: PD8[3], say: t3("Här kommer vändpunkten. Vad gör gestalten?", "Here comes the turning point. What does the figure do?", "هنا تأتي نقطة التحوّل. ماذا تفعل الهيئة؟")},
    {text: ["”Hon sprang mot trappan. Det sista steget hoppade hon över. Längst upp stod dörren öppen, men hon hade stängt den själv.",
      "Hon hörde inte sina egna steg, bara sin andhämtning. Och i källaren, i tystnaden, hängde duken tillbaka över spegeln.”"],
      pic: PD8[4], say: t3("Så slutar novellen. Vilka frågor får du som läsare själv svara på?", "That is how the story ends. Which questions are left for you as a reader to answer?", "بهذا تنتهي القصة. أي الأسئلة تُترك لك أنت القارئ لتجيب عنها؟")},
    {text: ["Sara läste upp novellen den sista lektionen på torsdagen. När hon tystnade satt hela 8B kvar i tystnad i flera sekunder. Elsa satt kvar med jackan i knät och rörde sig inte. Noah ville genast sprida texten i klasschatten, men Sara sa nej.",
      "”Men vad händer sen?” sa han till slut. ”Det vet jag inte”, sa Sara. ”Det är ett öppet slut”, sa Lena. ”Läsaren får ana resten själv. Det är därför ni fortfarande tänker på duken.”"],
      pic: PD8[5], say: t3("Klassen blir tyst. Varför svarar inte Sara på Noahs fråga?", "The class falls silent. Why doesn't Sara answer Noah's question?", "يصمت الصف. لماذا لا تجيب سارة عن سؤال نواه؟")},
    {text: ["På tavlan ritade Lena en linje över novellens delar: miljö i källaren, konflikt när spegelbilden kommer för sent, vändpunkt när gestalten lägger handen mot ramen, öppet slut vid dörren. ”Och vilket syfte hade du med spegeln?” frågade hon. ”Att visa att det kusligaste är sig själv”, sa Sara.",
      "”Jag skulle vilja kritisera slutet”, sa Amir efteråt. ”Men jag kan inte, för jag tänker ju på det hela tiden.” Han gick ändå aldrig ner i källaren igen. Lena satte ett A i marginalen, men sa att betyget var det minst viktiga av allt."],
      pic: PD8[6], say: t3("Amir vill kritisera slutet men kan inte. Vad säger det om novellen?", "Amir wants to criticise the ending but can't. What does that say about the story?", "أمير يريد أن ينتقد النهاية لكنه لا يستطيع. ماذا يقول ذلك عن القصة؟")}],
  wordsSay: t3("Ord ur novellen och ord om hur en novell byggs. Tryck på ett ord.", "Words from the short story and words about how a short story is built. Tap a word.", "كلمات من القصة وكلمات عن بناء القصة القصيرة. اضغط على كلمة."),
  grammar: [
    {draw: () => {
      const d: [string, string, string][] = [["miljö", "b", "var och när"], ["konflikt", "r", "problemet växer"], ["vändpunkt", "o", "allt ändras"], ["öppet slut", "g", "läsaren tänker"]];
      return [A.wipe(), head(t3("Novellens fyra delar", "The four parts of a short story", "أجزاء القصة القصيرة الأربعة")),
        A.p(R.line(70, 230, 730, 230, .3), "k", 3),
        ...d.flatMap(([s, c, lab], i) => [A.p(R.rect(90 + i * 160, 180, 130, 50, .6), c, 3.5), A.tx(s, 155 + i * 160, 212, 24, c), qt(lab, 155 + i * 160, 290, 21, "k")])];
    }, say: t3("En novell börjar med miljön: var och när. Sedan växer konflikten. Vändpunkten är ögonblicket då allt ändras. Till sist kommer slutet, och i en novell är det ofta öppet.", "A short story starts with the setting: where and when. Then the conflict grows. The turning point is the moment when everything changes. Last comes the ending, and in a short story it is often open.", "تبدأ القصة القصيرة بالمكان والزمان، ثم تكبر العقدة، ونقطة التحوّل هي اللحظة التي يتغيّر فيها كل شيء، وأخيرًا تأتي النهاية، وهي في القصة القصيرة مفتوحة غالبًا.")},
    {draw: () => [A.wipe(), head(t3("Visa – berätta inte", "Show – don't tell", "أظهِر ولا تُخبر")),
      ...boxes([["Mira var rädd.", "o", "berättar"]], 180, 32),
      A.tx("↓", 400, 252, 44, "k"),
      ...boxes([["Mira hörde sin egen puls i öronen.", "g", "visar"]], 340, 26),
      qt(T("Läsaren rös av det hen ser, inte av ordet rädd.", "The reader shivers at what they see, not at the word rädd.", "يرتجف القارئ من المشهد لا من كلمة «خائف»."), 400, 450, 24, "k")],
     say: t3("Skriv inte att personen är rädd. Skriv vad läsaren kan se och höra: pulsen, andedräkten, handen som darrar. Då blir läsaren rädd i stället för att bara få veta det.", "Don't write that the character is scared. Write what the reader can see and hear: the pulse, the breath, the shaking hand. Then the reader gets scared instead of just being told.", "لا تكتب أن الشخص خائف. اكتب ما يراه القارئ ويسمعه: النبض، النَفَس، اليد التي ترتجف. حينها يخاف القارئ بدل أن تُخبره فقط.")},
    {draw: () => [A.wipe(), head(t3("Öppet eller stängt slut?", "Open or closed ending?", "نهاية مفتوحة أم مغلقة؟")),
      ...boxes([["Dörren stod öppen.", "g", "öppet slut"]], 170, 30),
      ...boxes([["Det var bara en dröm, och allt var bra.", "o", "stängt slut"]], 300, 26),
      qt(T("Ett öppet slut lämnar en fråga kvar hos läsaren.", "An open ending leaves a question with the reader.", "النهاية المفتوحة تترك سؤالًا في ذهن القارئ."), 400, 400, 26, "k"),
      A.tx("English: an open ending", 400, 455, 26, "k")],
     say: t3("Ett öppet slut svarar inte på allt. Läsaren får ana vad som händer sedan, och berättelsen fortsätter i huvudet. Ett slut som förklarar allt, som att det bara var en dröm, släcker spänningen.", "An open ending does not answer everything. The reader is left to sense what happens next, and the story goes on in their head. An ending that explains everything, like it was only a dream, kills the tension.", "النهاية المفتوحة لا تجيب عن كل شيء، بل تترك القارئ يُحسّ بما سيحدث، فتستمرّ القصة في رأسه. أما النهاية التي تشرح كل شيء، مثل «كان مجرّد حلم»، فتقتل التشويق.")}],
  read: [
    {q: "Vad skulle klassen skriva?", o: ["En novell", "En insändare", "En rapport om källkritik"], why: "Del 1: ”Nu ska ni skriva en novell.”"},
    {q: "Varför valde Sara en spegel i källaren?", o: ["Det fanns ett gammalt rykte om den på skolan.", "Lena bad henne om det.", "Hon hade sett en varg där."], why: "Del 1: Det fanns ett gammalt rykte om en spegel i källaren."},
    {q: "Vilken tid på dagen går Mira ner i källaren?", o: ["I skymningen", "Tidigt på morgonen", "Vid midnatt"], why: "Del 2: ”Det var skymning när Mira gick ner i källaren.”"},
    {q: "Vad var det första som var fel med spegelbilden?", o: ["Den vinkade en halv sekund för sent.", "Den var svartvit.", "Den saknade ansikte."], why: "Del 3: Flickan i spegeln vinkade en halv sekund för sent."},
    {q: "Vad är novellens vändpunkt?", o: ["Gestalten lägger sin hand mot ramen från andra sidan.", "Mira hittar nycklarna.", "Lysrören slocknar."], why: "Del 4: Bakom glaset rörde sig en gestalt och lade sin hand mot ramen."},
    {q: "Varför blev klassen tyst efter uppläsningen?", o: ["Slutet skrämde dem och lämnade frågorna öppna.", "De förstod inte texten.", "De tyckte att novellen var tråkig."], why: "Del 6: ingen visste vad som hände sedan, och alla satt kvar i tystnad."},
    {q: "Vad menas med ett öppet slut?", o: ["Läsaren får själv ana vad som händer sedan.", "Texten slutar mitt i en mening.", "Berättelsen har två olika slut."], why: "Del 6: ”Läsaren får ana resten själv.”"},
    {q: "Varför ville Sara inte skriva ut slutet?", o: ["Texten blir starkare när läsaren får fylla i själv.", "Hon hann inte skriva mer.", "Lena förbjöd henne."], why: "Det öppna slutet gör att läsaren fortsätter tänka på novellen."},
    {q: "Varför säger Amir att han inte kan kritisera slutet?", o: ["Just det som stör honom gör att han fortsätter tänka på novellen.", "Han har inte läst den.", "Han tycker att Sara stavar fel."], why: "Del 7: ”Jag kan inte, för jag tänker ju på det hela tiden.”"}],
  gram(lv, write): Problem {
    if (write || lv === 2) {
      const [s, part] = pick(NOV8);
      return {kind: "text", ans: part === "miljö" ? [part, "miljo"] : [part], show: part, q: [A.wipe(), head(t3("Vilken del av novellen är detta? Skriv miljö, konflikt, vändpunkt eller slut.", "Which part of the short story is this? Write miljö, konflikt, vändpunkt or slut.", "أي جزء من القصة هذا؟ اكتب miljö أو konflikt أو vändpunkt أو slut."), 76, 26), ...svLines(s, 200, 32)],
        sol: [...svLines(s, 280, 28, "k"), A.tx(part, 400, 440, 44, "g")], hint: {say: NOVH, draw: []}};
    }
    if (lv === 1) {
      const [f, right, w1, w2] = pick(VISA8);
      return choice([right, w1, w2], right, [A.wipe(), head(t3("Vilken mening visar i stället för att berätta?", "Which sentence shows instead of telling?", "أي جملة تُظهر بدل أن تُخبر؟"), 80, 30), qt(`(${f})`, 400, 160, 30, "o")],
        [...svLines(right, 300, 30, "g"), qt(T("visar", "shows", "تُظهر"), 400, 430, 26, "g")], VISAH);
    }
    const [s, part] = pick(NOV8);
    return choice([part, ...others(DELNOV8, part)], part, [A.wipe(), head(t3("Vilken del av novellen är detta?", "Which part of the short story is this?", "أي جزء من القصة القصيرة هذا؟"), 80, 30), ...svLines(s, 190, 32)],
      [...svLines(s, 280, 28, "k"), A.tx(part, 400, 440, 44, "g")], NOVH);
  },
  help: [{say: t3("Novellens delar: miljö, konflikt, vändpunkt, öppet slut.", "The parts of a short story: setting, conflict, turning point, open ending.", "أجزاء القصة: المكان والجوّ، العقدة، نقطة التحوّل، النهاية المفتوحة."),
    draw: () => [A.tx("miljö", 400, 130, 38, "b"), A.tx("konflikt", 400, 215, 38, "r"), A.tx("vändpunkt", 400, 300, 38, "o"), A.tx("öppet slut", 400, 385, 38, "g")]}]
});

/* ================= unit 5: Praon på veterinären (passiv form med -s) ================= */
word("prao", {sv: "prao (en)", m: "prao(?:n)?", d: t3("Dagar när en elev är på en arbetsplats för att se hur arbetet går till.", "Days when a pupil is at a workplace to see how the work is done.", "أيام يكون فيها التلميذ في مكان عمل ليرى كيف يُنجز العمل."), ex: "Amir hade prao på veterinärkliniken.", tr: {en: "work experience placement", ar: "أيام تدريب في مكان عمل"}, syn: ["praktik"], wrong: ["rast", "prov"], gap: ["I vecka 42 hade hela 8B", "prao", "."], gapForm: "prao", form: "en prao"});
word("operation", {sv: "operation (en)", m: "operation(?:en|er|erna)?", d: t3("När en läkare eller veterinär öppnar en kropp för att laga något inuti.", "When a doctor or vet opens a body to repair something inside.", "عندما يفتح طبيب أو بيطري الجسم لإصلاح شيء في داخله."), ex: "Operationen tog fyrtio minuter.", tr: {en: "operation, surgery", ar: "عملية جراحية"}, syn: ["ingrepp"], wrong: ["diagnos", "röntgen"], gap: ["Hunden behövde en liten", "operation", "samma dag."], gapForm: "operation", form: "en operation – operationer"});
word("sovra", {sv: "söva", m: "(?:söv(?:a|er|as|s|t|ts)|sövde(?:s)?|sövd(?:a|e)?)", d: t3("Göra att någon sover helt under en operation.", "Make someone sleep completely during an operation.", "أن تجعل أحدهم ينام تمامًا خلال العملية."), ex: "Hunden sövs klockan nio.", tr: {en: "put to sleep, give full anaesthetic", ar: "يُخدّر تخديرًا كاملًا"}, syn: ["ge narkos"], opp: ["väcka"], wrong: ["mata", "klippa"], gap: ["Innan operationen måste hunden", "sövas", "."], gapForm: "sövas", form: "söva – sövde – har sövt"});
word("bedova", {sv: "bedöva", m: "(?:bedöv(?:a|ar|as|at|ats)|bedövade(?:s)?|bedövad|bedövning(?:en|ar)?)", d: t3("Göra en del av kroppen känslolös, så att det inte gör ont just där.", "Make one part of the body numb, so that it does not hurt just there.", "أن تجعل جزءًا من الجسم بلا إحساس حتى لا يؤلم هناك."), ex: "Tandläkaren bedövar bara tanden.", tr: {en: "numb, give local anaesthetic", ar: "يُخدّر موضعيًّا"}, syn: ["lokalbedöva"], wrong: ["söva", "tvätta"], gap: ["Ett litet sår kan", "bedövas", "utan narkos."], gapForm: "bedövas", form: "bedöva – bedövade – har bedövat"});
word("diagnos", {sv: "diagnos (en)", m: "diagnos(?:en|er|erna)?", d: t3("Vad en läkare eller veterinär kommer fram till att patienten har.", "What a doctor or vet concludes that the patient has.", "ما يتوصّل إليه الطبيب أو البيطري عن حالة المريض."), ex: "Diagnosen ställdes efter röntgen.", tr: {en: "diagnosis", ar: "تشخيص"}, syn: ["bedömning"], wrong: ["operation", "recept"], gap: ["Efter röntgen var", "diagnosen", "klar."], gapForm: "diagnosen", form: "en diagnos – diagnoser"});
word("assistera", {sv: "assistera", m: "assistera(?:r|de|t|s|des)?|assistent(?:en|er|erna)?", d: t3("Hjälpa den som leder ett arbete.", "Help the person who is leading a task.", "أن تساعد من يقود العمل."), ex: "Amir fick assistera under operationen.", tr: {en: "assist", ar: "يساعد"}, syn: ["hjälpa"], wrong: ["störa", "vila"], gap: ["Sköterskan", "assisterade", "veterinären vid bordet."], gapForm: "assisterade", form: "assistera – assisterade – har assisterat"});
word("steril", {sv: "steril", m: "steril(?:t|a)?|sterilisera(?:r|s|d|de|t|des|ts)?", d: t3("Helt fri från bakterier.", "Completely free from bacteria.", "خالٍ تمامًا من الجراثيم."), ex: "Alla instrument måste vara sterila.", tr: {en: "sterile", ar: "معقّم"}, syn: ["bakteriefri"], opp: ["smutsig"], wrong: ["kall", "vass"], gap: ["Instrumenten läggs i en maskin för att bli", "sterila", "."], gapForm: "sterila", form: "steril – sterilt – sterila"});
word("lugnande", {sv: "lugnande", m: "lugnande", d: t3("Som gör att någon blir lugn. Ett lugnande medel gör ett djur mindre rädd och mer stilla.", "That makes someone calm. A sedative makes an animal less frightened and more still.", "ما يجعل أحدًا هادئًا. والدواء المهدّئ يجعل الحيوان أقلّ خوفًا وأكثر سكونًا."), ex: "Katten fick ett lugnande medel.", tr: {en: "calming, sedative", ar: "مُهدِّئ"}, syn: ["rogivande"], opp: ["skrämmande"], wrong: ["hård", "steril"], gap: ["Före undersökningen fick katten ett", "lugnande", "medel."], gapForm: "lugnande", form: "lugnande (ändras inte)"});
word("svpassiv8", {sv: "passiv form", m: "passiv(?:t|a|en|form(?:en)?)?", d: t3("Verbet får -s, och det som drabbas blir subjekt: hunden sövs.", "The verb gets -s, and the one affected becomes the subject: hunden sövs.", "يأخذ الفعل ‎-s‏ ويصبح المتأثّر فاعلًا نحويًّا: hunden sövs."), ex: "Instrumenten steriliseras.", tr: {en: "passive voice", ar: "صيغة المجهول"}});
word("svaktiv8", {sv: "aktiv form", m: "aktiv(?:t|a|en|form(?:en)?)?", d: t3("Den som gör något är subjekt: veterinären söver hunden.", "The one who does something is the subject: veterinären söver hunden.", "من يقوم بالفعل هو الفاعل: veterinären söver hunden."), ex: "Petra sydde såret.", tr: {en: "active voice", ar: "صيغة المعلوم"}});

const vetTable = (y = 200) => `<rect x="24" y="${y}" width="252" height="16" rx="5" fill="#b9c3cf"/><rect x="48" y="${y + 16}" width="12" height="${276 - y}" fill="#9aa4b5"/><rect x="240" y="${y + 16}" width="12" height="${276 - y}" fill="#9aa4b5"/>`;
const lamp = (x: number, y: number) => `<path d="M${x} 0 v${y - 34}" stroke="#9aa4b5" stroke-width="5"/><path d="M${x - 30} ${y} q30 -34 60 0Z" fill="#e8eef5" stroke="#9aa4b5" stroke-width="3"/><circle cx="${x}" cy="${y + 6}" r="7" fill="#f7d14c"/>`;
const clinic = (bg = "#eaf3f2") => `<rect width="300" height="300" fill="${bg}"/><rect y="240" width="300" height="60" fill="#cfe0dd"/>`;
const xray = (x: number, y: number) => `<g transform="translate(${x} ${y})"><rect x="-54" y="-66" width="108" height="132" rx="4" fill="#1d2433"/><ellipse cx="0" cy="6" rx="38" ry="26" fill="#3b4656"/>${[...Array(7)].map((_, i) => `<path d="M${-34 + i * 11} -22 q4 26 0 50" stroke="#c9d6e4" stroke-width="3" fill="none"/>`).join("")}<path d="M-16 6 q16 -14 30 4 q-16 12 -30 -4Z" fill="#f2c94c"/></g>`;
const PE8 = [
  pic(`${clinic()}${PETRA(214, 160)}${AMIR(76, 174, .95)}${hand("VET", 150, 44, 28, "#2a7d9c")}<rect x="112" y="24" width="76" height="30" rx="8" fill="none" stroke="#2a7d9c" stroke-width="3"/>`, "#eaf3f2"),
  pic(`${clinic("#f1f5f4")}${paper(150, 142, 1.3, "RUTINER", "matas · rengors", 6)}${AMIR(254, 196, .76)}`, "#f1f5f4"),
  pic(`${clinic()}${LEO(82, 170, .95)}${dog(142, 196, .78)}${PETRA(234, 166, 1.02)}${bubble(104, 68, 150, "Han har inte atit")}`, "#eaf3f2"),
  pic(`${clinic("#edf2f6")}${xray(96, 150)}${PETRA(224, 168, 1)}${hand("strumpa", 96, 246, 24, "#1f4fb0")}`, "#edf2f6"),
  pic(`${clinic("#e8eff4")}${lamp(150, 72)}${vetTable(196)}${dog(150, 182, .82, "#d9b483")}${PETRA(234, 152, .95)}${AMIR(62, 164, .85)}`, "#e8eff4"),
  pic(`${clinic("#f1f5f4")}${laptop(150, 170, "JOURNAL", "sovdes 10.15")}${desk(150, 196, 220)}${AMIR(252, 192, .78)}`, "#f1f5f4"),
  pic(`${room()}${board("PASSIV", "sovdes · syddes · vacktes")}${AMIR(68, 174, .95)}${NOAH(176, 182, .9)}${LENA(248, 170, .96)}`, "#eef4fb")];
/* [aktiv sentence, gap sentence, right passive, wrong, wrong, infinitive] */
const PASS8: [string, string, string, string, string, string][] = [
  ["Veterinären söver hunden.", "Hunden ____ klockan nio.", "sövs", "sövdes", "sövas", "söva"],
  ["Sköterskan steriliserar instrumenten.", "Instrumenten ____ i en maskin.", "steriliseras", "steriliserades", "sterilisera", "sterilisera"],
  ["Amir fyllde i journalen efteråt.", "Journalen ____ i direkt efteråt.", "fylldes", "fylls", "fyllas", "fylla"],
  ["Petra ställde diagnosen i går.", "Diagnosen ____ i går.", "ställdes", "ställs", "ställas", "ställa"],
  ["Vi matar djuren klockan sju.", "Djuren ____ klockan sju.", "matas", "matades", "matat", "mata"],
  ["Någon rengör burarna efter varje patient.", "Burarna ____ efter varje patient.", "rengörs", "rengjordes", "rengöras", "rengöra"],
  ["Petra sydde såret med sex stygn.", "Såret ____ med sex stygn.", "syddes", "sys", "sydd", "sy"],
  ["De väckte hunden klockan elva.", "Hunden ____ klockan elva.", "väcktes", "väcks", "väckas", "väcka"],
  ["Assistenten bedövade området extra noga.", "Området ____ extra noga.", "bedövades", "bedövas", "bedövad", "bedöva"],
  ["Petra undersöker katten varje vecka.", "Katten ____ varje vecka.", "undersöks", "undersöktes", "undersökas", "undersöka"]];
const PASSH = t3("Passiv form slutar på -s. Presens: matas, sövs. Preteritum: matades, sövdes. Titta på tiden i meningen: i går ger preteritum.", "The passive form ends in -s. Present: matas, sövs. Past: matades, sövdes. Look at the time in the sentence: i går (yesterday) gives the past.", "صيغة المجهول تنتهي بـ ‎-s‏. المضارع: matas و sövs. والماضي: matades و sövdes. انظر إلى الزمن في الجملة: i går تعني الماضي.");

defineUnit({
  id: "sv8e", year: 8, ord: 5, title: t3("Praon på veterinären", "Work experience at the vet's", "التدريب عند البيطري"), storyTitle: "Praon på veterinären",
  icon: ICON(`<rect y="120" width="320" height="60" fill="#cfe0dd"/>${lamp(96, 60)}<rect x="20" y="118" width="170" height="12" rx="4" fill="#b9c3cf"/>${dog(100, 104, .82, "#d9b483")}${hand("PRAO", 252, 86, 36, "#2a7d9c")}${hand("sovs · matas", 252, 120, 22, "#5b6884")}`, "#eaf3f2"),
  words: ["prao", "operation", "sovra", "bedova", "diagnos", "assistera", "steril", "lugnande"], terms: ["svpassiv8", "svaktiv8"],
  story: [
    {text: ["I vecka 42 hade 8B prao. Amir hade sökt tre platser och fått den han ville ha: veterinärkliniken vid torget i Hagaby.",
      "Första morgonen fick han ett eget schema och en nytvättad rock. ”Här gäller tre regler”, sa veterinären Petra. ”Mobilen ligger i skåpet, händerna tvättas före varje rum, och ingenting rörs på operationsbordet.” Kliniken luktade sprit och hund, och i väntrummet satt en katt i en bur av tyg."],
      pic: PE8[0], say: t3("Amirs första dag på prao. Vilka tre regler gäller på kliniken?", "Amir's first day of work experience. Which three rules apply at the clinic?", "أول يوم تدريب لأمير. ما القواعد الثلاث في العيادة؟")},
    {text: ["På väggen i förrummet hängde en laminerad lista. Amir läste den två gånger, för den var skriven på ett sätt han inte var van vid.",
      "”Djuren matas klockan sju. Burarna rengörs efter varje patient. Instrumenten steriliseras i autoklav. Journalen fylls i direkt.” Ingen stod som den som gjorde det. Ändå var det tydligt vems ansvar det var: den som är i rummet."],
      pic: PE8[1], say: t3("Listan är skriven utan någon som gör något. Hur kan det ändå vara tydligt vems ansvar det är?", "The list is written without anyone doing the actions. How can it still be clear whose responsibility it is?", "القائمة مكتوبة دون ذكر من يقوم بالعمل. فكيف تبقى المسؤولية واضحة؟")},
    {text: ["Vid halv tio kom Leo in med Kexi i famnen. Hunden hade svalt en strumpa. ”Jag anade att det var något”, sa Leo. ”Han har inte ätit sedan i går.” Han hade burit hunden hela vägen från Hagaby i en filt.",
      "Kexi röntgades, och efter fem minuter var diagnosen klar: strumpan satt kvar i magsäcken. ”Då får det bli en operation i dag”, sa Petra."],
      pic: PE8[2], say: t3("Kexi har svalt en strumpa. Vad visar röntgen?", "Kexi has swallowed a sock. What does the x-ray show?", "التهم كيكسي جرابًا. ماذا تُظهر صورة الأشعة؟")},
    {text: ["Leo blev vit i ansiktet. Petra förklarade lugnt: Kexi skulle först få ett lugnande medel, sedan sövas, och området på magen skulle bedövas extra.",
      "”Söva och bedöva är inte samma sak”, sa hon. ”En sövd hund sover genom hela operationen. En bedövad hund är vaken, men känner inget just där. Kexi sövs.”"],
      pic: PE8[3], say: t3("Vad är skillnaden mellan att söva och att bedöva?", "What is the difference between söva and bedöva?", "ما الفرق بين التخدير الكامل والتخدير الموضعي؟")},
    {text: ["Amir fick assistera. Han tvättade händerna i en halv minut, tog sterila handskar och höll en lampa i exakt den vinkel Petra pekade ut. I rummet var det nästan tystnad; bara apparaten som räknade andetag hördes.",
      "När Petra lyfte upp strumpan med en pincett ryste han. Den var hel."],
      pic: PE8[4], say: t3("Amir assisterar. Vad är hans uppgift under operationen?", "Amir assists. What is his job during the operation?", "أمير يساعد. ما مهمّته خلال العملية؟")},
    {text: ["Efteråt skrev Amir in allt i journalen. Han märkte att han skrev precis som listan på väggen: ”Patienten sövdes klockan 10.15. Strumpan avlägsnades. Såret syddes med sex stygn. Hunden väcktes 11.00.”",
      "”Snyggt”, sa Petra när hon granskade texten. ”I en rapport är det inte intressant vem som höll pincetten. Det viktiga är vad som gjordes.” Sedan visade hon honom hur varje rad fick en tid framför sig."],
      pic: PE8[5], say: t3("Amir skriver i journalen. Varför nämner han inte vem som gjorde vad?", "Amir writes in the record. Why doesn't he mention who did what?", "يكتب أمير في السجل. لماذا لا يذكر من فعل كل شيء؟")},
    {text: ["Kexi fick gå hem samma kväll med en krage runt huvudet. Leo bar honom hela vägen.",
      "På måndagen läste Amir upp sin rapport i 8B. ”Varför står det ingen som gör något i dina meningar?” frågade Noah. ”Det är passiv form”, sa Amir. ”Man använder den när handlingen är viktigare än den som utför den. Här är det ju hunden som är huvudpersonen.” Noah ville genast skriva om sin egen rapport från bageriet."],
      pic: PE8[6], say: t3("Noah undrar över Amirs meningar. När använder man passiv form?", "Noah wonders about Amir's sentences. When do you use the passive?", "نواه يتساءل عن جمل أمير. متى نستخدم صيغة المجهول؟")}],
  wordsSay: t3("Ord från veterinärkliniken. Tryck på ett ord för att se vad det betyder.", "Words from the vet's clinic. Tap a word to see what it means.", "كلمات من عيادة البيطري. اضغط على كلمة لترى معناها."),
  grammar: [
    {draw: () => {
      const a = ["Veterinären", "söver", "hunden"], b = ["Hunden", "sövs", "(av veterinären)"], ca = ctr(a, 34), cb = ctr(b, 32);
      return [A.wipe(), head(t3("Aktiv blir passiv", "Active becomes passive", "المعلوم يصبح مجهولًا")),
        ...boxes([[a[0], "b", "den som gör"], [a[1], "r", "aktiv"], [a[2], "g", "objekt"]], 180, 34),
        A.arrow(ca[0], 220, cb[2] - 30, 300, "k", 30), A.arrow(ca[2], 220, cb[0], 300, "k", -30),
        ...boxes([[b[0], "g", "subjekt"], [b[1], "r", "passiv: -s"], [b[2], "b", "oftast borta"]], 360, 32),
        qt(T("Det som drabbas flyttar först.", "The one affected moves to the front.", "المتأثّر ينتقل إلى الأول."), 400, 450, 26, "k")];
    }, say: t3("I aktiv form står den som gör något först: veterinären söver hunden. I passiv form flyttar hunden fram och verbet får -s: hunden sövs. Den som gör något kan nämnas med av, men försvinner oftast.", "In the active the one who does something comes first: veterinären söver hunden. In the passive the dog moves to the front and the verb gets -s: hunden sövs. The doer can be named with av, but usually disappears.", "في صيغة المعلوم يأتي الفاعل أولًا: veterinären söver hunden. وفي المجهول ينتقل الكلب إلى الأول ويأخذ الفعل ‎-s‏: hunden sövs. ويمكن ذكر الفاعل بـ av، لكنه يُحذف غالبًا.")},
    {draw: () => {
      const X = [230, 500], rows = [["söver", "sövs"], ["sövde", "sövdes"], ["har sövt", "har sövts"], ["matar", "matas"], ["matade", "matades"], ["syr", "sys"]];
      return [A.wipe(), head(t3("Samma tid, nytt -s", "Same tense, a new -s", "الزمن نفسه مع ‎-s‏ جديد"), 56, 32),
        A.tx(T("aktiv", "active", "معلوم"), X[0], 120, 28, "b"), A.tx(T("passiv", "passive", "مجهول"), X[1], 120, 28, "r"),
        A.p(R.line(100, 142, 700, 142, .3), "k", 2), A.band(410, 150, 190, 320, "r"),
        ...rows.flatMap(([x, y], i) => [A.tx(x, X[0], 190 + i * 52, 32, "k"), A.tx(y, X[1], 190 + i * 52, 32, "r")])];
    }, say: t3("Passiv form byter inte tid. Presens får -s: matar blir matas. Preteritum får -des eller -s: sövde blir sövdes. Perfekt blir har sövts. Ett alternativ är bli-passiv: hunden blir sövd.", "The passive does not change the tense. The present gets -s: matar becomes matas. The past gets -des or -s: sövde becomes sövdes. The perfect becomes har sövts. An alternative is the bli-passive: hunden blir sövd.", "صيغة المجهول لا تغيّر الزمن. المضارع يأخذ ‎-s‏: matar تصبح matas. والماضي يأخذ ‎-des‏: sövde تصبح sövdes. والتامّ يصبح har sövts. وهناك بديل بـ bli: hunden blir sövd.")},
    {draw: () => [A.wipe(), head(t3("När används passiv?", "When is the passive used?", "متى تُستخدم صيغة المجهول؟")),
      ...["rapport: Patienten sövdes 10.15.", "instruktion: Burarna rengörs.", "nyhet: Beslutet fattades i våras.", "regel: Mobilerna lämnas in."].map((s, i) => A.tx(s, 400, 160 + i * 66, 28, i % 2 ? "b" : "r")),
      qt(T("Handlingen är viktigare än den som gör den.", "The action matters more than the doer.", "الحدث أهمّ من فاعله."), 400, 440, 26, "k")],
     say: t3("Passiv form används i rapporter, instruktioner, nyheter och regler, alltså när handlingen är viktigare än personen. Engelska gör samma sak med is och was: the dog is put to sleep. Arabiska har صيغة المجهول, som يُخدَّر.", "The passive is used in reports, instructions, news and rules, that is, when the action matters more than the person. English does the same with is and was: the dog is put to sleep. Arabic has the passive form too, like يُخدَّر.", "تُستخدم صيغة المجهول في التقارير والتعليمات والأخبار والقواعد، أي حين يكون الحدث أهمّ من الشخص. والإنجليزية تفعل الشيء نفسه بـ is و was. وفي العربية صيغة المجهول مثل: يُخدَّر.")}],
  read: [
    {q: "Var hade Amir prao?", o: ["På veterinärkliniken i Hagaby", "På Hagabybladet", "I skolans kök"], why: "Del 1: han fick platsen på veterinärkliniken vid torget."},
    {q: "Vilka tre regler gav Petra?", o: ["Mobilen i skåpet, tvätta händerna, rör inget på operationsbordet", "Kom i tid, var tyst, skriv journal", "Bär rock, mata djuren, lås dörren"], why: "Del 1: ”Mobilen ligger i skåpet, händerna tvättas före varje rum, och ingenting rörs på operationsbordet.”"},
    {q: "Vad var ovanligt med listan på väggen?", o: ["Det stod inte vem som skulle göra sakerna.", "Den var skriven på engelska.", "Den var handskriven."], why: "Del 2: Ingen stod som den som gjorde det – allt var skrivet i passiv form."},
    {q: "Vad hade Kexi svalt?", o: ["En strumpa", "En leksak", "En pincett"], why: "Del 3: Hunden hade svalt en strumpa."},
    {q: "Vad är skillnaden mellan att söva och att bedöva?", o: ["En sövd hund sover helt; en bedövad är vaken men känner inget just där.", "En bedövad hund sover helt; en sövd är vaken.", "Det är två ord för samma sak."], why: "Del 4: Petras förklaring av söva och bedöva."},
    {q: "Vad gjorde Amir under operationen?", o: ["Han höll en lampa med sterila handskar.", "Han sydde såret.", "Han ställde diagnosen."], why: "Del 5: han höll en lampa i exakt den vinkel Petra pekade ut."},
    {q: "Varför ryste Amir när strumpan lyftes upp?", o: ["Det var obehagligt att se något helt som hade legat inne i magen.", "Han frös i det kalla rummet.", "Han var besviken på Petra."], why: "Del 5: ”Den var hel.” Det var obehagligt, och han ryste."},
    {q: "Varför skriver man rapporter i passiv form, enligt Petra?", o: ["Det viktiga är vad som gjordes, inte vem som gjorde det.", "Det blir kortare att skriva.", "Det är lättare att stava."], why: "Del 6: ”I en rapport är det inte intressant vem som höll pincetten.”"},
    {q: "Varför säger Amir att hunden är ”huvudpersonen”?", o: ["Rapporten handlar om vad som hände med patienten.", "Kexi är Leos hund.", "Hunden skrev journalen."], why: "Del 7: passiv form används när handlingen och patienten är det viktiga."}],
  gram(lv, write): Problem {
    const [akt, gap, right, w1, w2, inf] = pick(PASS8), full = gap.replace("____", right);
    const sol = [...svLines(full, 300, 32, "g"), A.tx(`${T("aktiv", "active", "معلوم")}: ${akt}`, 400, 440, 24, "k")];
    if (write || lv === 2) return {kind: "text", ans: [right], show: right, q: [A.wipe(), head(t3("Skriv verbet i passiv form (-s).", "Write the verb in the passive form (-s).", "اكتب الفعل بصيغة المجهول (‎-s‏)."), 76, 30), ...svLines(gap, 200, 36), A.tx(`(${inf})`, 400, 340, 36, "o")], sol, hint: {say: PASSH, draw: []}};
    const q = lv === 1 ? [A.wipe(), head(t3("Skriv om till passiv: vilken form passar?", "Rewrite as passive: which form fits?", "حوّل إلى المجهول: أي صيغة تناسب؟"), 76, 28), ...svLines(akt, 150, 28, "b"), ...svLines(gap, 250, 34)]
      : [A.wipe(), head(t3("Vilken passiv form passar?", "Which passive form fits?", "أي صيغة مجهول تناسب؟"), 80, 32), ...svLines(gap, 210, 36), A.tx(`(${inf})`, 400, 340, 36, "o")];
    return choice([right, w1, w2], right, q, sol, PASSH);
  },
  help: [{say: t3("Passiv form: verbet får -s. söver blir sövs, sövde blir sövdes.", "Passive form: the verb gets -s. söver becomes sövs, sövde becomes sövdes.", "صيغة المجهول: الفعل يأخذ ‎-s‏. söver تصبح sövs و sövde تصبح sövdes."),
    draw: () => [A.tx("söver → sövs", 400, 150, 40, "r"), A.tx("matade → matades", 400, 240, 40, "r"), A.tx("har sytt → har sytts", 400, 330, 40, "r")]}]
});

/* ================= unit 6: Formellt eller informellt? (stil och mottagare) ================= */
word("formell", {sv: "formell", m: "formell(?:t|a)?", d: t3("Som följer reglerna för hur man skriver artigt, till exempel till en myndighet.", "That follows the rules for polite writing, for example to an authority.", "يتبع قواعد الكتابة المؤدّبة، مثل مخاطبة دائرة رسمية."), ex: "Ett formellt mejl börjar inte med tjena.", tr: {en: "formal", ar: "رسميّ"}, syn: ["officiell"], opp: ["informell"], wrong: ["kuslig", "steril"], gap: ["Till kommunen skrev de ett", "formellt", "mejl."], gapForm: "formellt", form: "formell – formellt – formella"});
word("informell", {sv: "informell", m: "informell(?:t|a)?", d: t3("Vardaglig och personlig, som när man skriver till en kompis.", "Everyday and personal, like when you write to a friend.", "يوميّ وشخصيّ، كما تكتب إلى صديق."), ex: "Till Leo skrev han informellt.", tr: {en: "informal", ar: "غير رسميّ"}, syn: ["vardaglig"], opp: ["formell"], wrong: ["angelägen", "trovärdig"], gap: ["Till en kompis passar ett", "informellt", "språk."], gapForm: "informellt", form: "informell – informellt – informella"});
word("mottagare", {sv: "mottagare (en)", m: "mottagar(?:e|en|na)", d: t3("Den som en text är skriven till.", "The person a text is written to.", "الشخص الذي يُكتب له النص."), ex: "Mottagaren bestämmer tonen.", tr: {en: "recipient, the reader addressed", ar: "المُستَلِم"}, syn: ["läsare"], opp: ["avsändare"], wrong: ["rubrik", "mening"], gap: ["Tänk först på vem som är", "mottagare", "."], gapForm: "mottagare", form: "en mottagare – mottagare"});
word("ansoka", {sv: "ansöka", m: "(?:ansök(?:a|er|t|s|an)|ansökte|ansökning(?:en|ar|arna)?|ansökningar)", d: t3("Officiellt be om något, till exempel pengar eller en plats.", "Officially ask for something, for example money or a place.", "أن تطلب شيئًا رسميًّا، مثل مال أو مقعد."), ex: "Klassen ansökte om bidrag.", tr: {en: "apply for", ar: "يتقدّم بطلب"}, syn: ["söka"], wrong: ["protestera", "bekräfta"], gap: ["8B ville", "ansöka", "om pengar till klassresan."], gapForm: "ansöka", form: "ansöka – ansökte – har ansökt"});
word("hanvisa", {sv: "hänvisa", m: "hänvisa(?:r|de|t|s|des)?|hänvisning(?:en|ar)?", d: t3("Peka på var något finns eller vem man har talat med.", "Point out where something can be found or whom you have talked to.", "أن تُشير إلى مكان شيء أو إلى من تحدّثت معه."), ex: "Hon hänvisade till kommunens beslut.", tr: {en: "refer to", ar: "يُحيل، يُشير إلى"}, syn: ["peka på"], wrong: ["gömma", "sprida"], gap: ["I mejlet kan du", "hänvisa", "till ert tidigare samtal."], gapForm: "hänvisa", form: "hänvisa – hänvisade – har hänvisat"});
word("vanligen", {sv: "vänligen", m: "vänligen", d: t3("Ett artigt ord i formella mejl: Vänligen svara före fredag.", "A polite word in formal emails: Vänligen svara före fredag (Kindly reply before Friday).", "كلمة مؤدّبة في الرسائل الرسمية: رجاءً أجب قبل الجمعة."), ex: "Vänligen bekräfta att mejlet har kommit fram.", tr: {en: "kindly, please (formal)", ar: "رجاءً (بصيغة رسمية)"}, syn: ["var vänlig och"], wrong: ["tjena", "förlåt"], gap: ["”", "Vänligen", "svara före fredag”, skrev Sara."], gapForm: "Vänligen", form: "vänligen (formellt ord)"});
word("angelagen", {sv: "angelägen", m: "angeläg(?:en|et|na)", d: t3("Viktig och brådskande.", "Important and urgent.", "مهمّ وملحّ."), ex: "Ärendet är angeläget för hela klassen.", tr: {en: "urgent, pressing", ar: "ملحّ، مهمّ"}, syn: ["viktig"], opp: ["oviktig"], wrong: ["kuslig", "lugnande"], gap: ["Saken var", "angelägen", ": resan skulle bokas i mars."], gapForm: "angelägen", form: "angelägen – angeläget – angelägna"});
word("bekrafta", {sv: "bekräfta", m: "bekräfta(?:r|de|t|s|ts|des)?|bekräftelse(?:n|r)?", d: t3("Säga eller skriva att något stämmer eller har kommit fram.", "Say or write that something is correct or has arrived.", "أن تقول أو تكتب أن شيئًا صحيح أو قد وصل."), ex: "Kommunen bekräftade att ansökan hade kommit in.", tr: {en: "confirm", ar: "يُؤكّد"}, syn: ["intyga"], opp: ["förneka"], wrong: ["ana", "rysa"], gap: ["Två dagar senare kom ett mejl som", "bekräftade", "beslutet."], gapForm: "bekräftade", form: "bekräfta – bekräftade – har bekräftat"});
word("svregister8", {sv: "register (stil)", m: "register(?:et|en)?", d: t3("Hur formellt eller informellt du skriver, beroende på vem som läser.", "How formally or informally you write, depending on who reads it.", "مستوى لغتك، رسميًّا أو غير رسميّ، بحسب من يقرأ."), ex: "Tjena! eller Hej!", tr: {en: "register, level of formality", ar: "مستوى اللغة"}});
word("svtilltal8", {sv: "tilltal", m: "tilltal(?:et|sord)?", d: t3("Hur du talar till mottagaren: förnamn, du eller ni.", "How you address the recipient: first name, du or ni.", "كيف تخاطب المستلم: بالاسم الأول أو بـ du أو ni."), ex: "Hej Dina! / Hej!", tr: {en: "form of address", ar: "صيغة المخاطبة"}});

const mail = (x: number, y: number, s = 1, txt = "", t2 = "", c = "#2a7d9c") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-62" y="-44" width="124" height="88" rx="6" fill="#fffdf7" stroke="${c}" stroke-width="3"/><path d="M-62 -44 l62 48 l62 -48" fill="none" stroke="${c}" stroke-width="3"/>${hand(txt, 0, 16, 22, c)}${hand(t2, 0, 38, 17, "#5b6884")}</g>`;
const PF8 = [
  pic(`${room()}${board("KLASSRESA", "8 000 kr?")}${LENA(238, 164)}${AMIR(68, 176, .94)}${phone(150, 186, .7, "Tjena!", "#d63b2f")}`, "#eef4fb"),
  pic(`${room("#f1f5fa")}${board("INFORMELLT", "FORMELLT")}<path d="M150 30 v104" stroke="#f3efe6" stroke-width="3"/>${LENA(66, 172, .98)}${AMIR(230, 180, .9)}`, "#eef4fb"),
  pic(`${room("#f3f6ef")}${mail(150, 136, 1.1, "Hej Dina!", "Vad kostar en buss?", "#2f8a4a")}${NOAH(250, 190, .8)}`, "#f3f6ef"),
  pic(`${room("#f6f1e6")}${mail(150, 136, 1.1, "Ansokan om bidrag", "klass 8B, Bjorkskolan", "#1f4fb0")}${SARA(250, 192, .8)}`, "#f6f1e6"),
  pic(`${room("#f1f5fa")}${laptop(150, 170, "Vi ansoker om", "8 000 kronor")}${desk(150, 196, 220)}${SARA(252, 194, .78)}`, "#eef4fb"),
  pic(`${room("#f6f1e6")}${paper(118, 146, 1.05, "Vanligen", "bekrafta", 5)}${AMIR(238, 184, .9)}${hand("!!!", 196, 92, 30, "#d63b2f")}`, "#f6f1e6"),
  pic(`${room()}${mail(104, 128, .95, "BEKRAFTAT", "5 000 kronor", "#2f8a4a")}${LENA(240, 170, .96)}${NOAH(44, 198, .82)}${SARA(170, 192, .86)}`, "#f6f1e6")];
/* [informellt, formellt] – the formal versions of the other rows become the wrong options */
const REG8: [string, string][] = [
  ["Tjena!", "Hej!"],
  ["Kram", "Med vänliga hälsningar"],
  ["Har ni nån cash kvar?", "Finns det medel kvar att söka?"],
  ["typ 26 personer", "cirka 26 personer"],
  ["Hojta!", "Vänligen svara"],
  ["Vi vill ha stålar till resan", "Vi ansöker om bidrag till resan"],
  ["Det är sjukt viktigt", "Ärendet är angeläget"],
  ["Fixa det snabbt", "Vi önskar svar före fredag"],
  ["Kolla er sida", "Vi hänvisar till er webbplats"]];
/* [informal word, the formal word to write] */
const ORD8F: [string, string][] = [
  ["tjena", "hej"], ["cash", "bidrag"], ["stålar", "pengar"], ["kolla", "kontrollera"], ["typ", "cirka"],
  ["fixa", "ordna"], ["sjukt viktigt", "angeläget"], ["hojta", "svara"], ["pröjsa", "betala"], ["jobbigt", "besvärligt"]];
const REGH = t3("Tänk på mottagaren. Till en kompis: korta ord, smeknamn, smileys. Till en myndighet: hela meningar, inga förkortningar, artiga fraser som vänligen och med vänliga hälsningar.", "Think about the recipient. To a friend: short words, nicknames, smileys. To an authority: full sentences, no abbreviations, polite phrases like vänligen and med vänliga hälsningar.", "فكّر في المستلم. إلى صديق: كلمات قصيرة وألقاب ورموز. إلى دائرة رسمية: جمل كاملة بلا اختصارات وعبارات مؤدّبة مثل vänligen و med vänliga hälsningar.");

defineUnit({
  id: "sv8f", year: 8, ord: 6, title: t3("Formellt eller informellt?", "Formal or informal?", "رسميّ أم غير رسميّ؟"), storyTitle: "Formellt eller informellt?",
  icon: ICON(`${mail(86, 90, .92, "Tjena!", "Hojta", "#d63b2f")}${mail(234, 90, .92, "Hej!", "Vanligen", "#1f4fb0")}`, "#f6f1e6"),
  words: ["formell", "informell", "mottagare", "ansoka", "hanvisa", "vanligen", "angelagen", "bekrafta"], terms: ["svregister8", "svtilltal8"],
  story: [
    {text: ["Klassen hade bestämt att 8B skulle åka till Stockholm i maj. Problemet var pengarna. ”Vi kan ansöka om bidrag ur kommunens kulturpott”, sa Lena. ”Men då måste någon skriva ett mejl.” Klassen hade räknat ut att resan kostade 310 kronor per person.",
      "Amir anmälde sig. Hur svårt kunde det vara? På rasten skrev han fyra rader: ”Tjena! Vi i 8B ska till Sthlm i maj, typ 26 pers. Har ni nån cash kvar? Hojta!”"],
      pic: PF8[0], say: t3("Amir skriver ett snabbt mejl. Vem ska läsa det?", "Amir writes a quick email. Who is going to read it?", "يكتب أمير رسالة سريعة. من سيقرأها؟")},
    {text: ["Lena läste mejlet och log. ”Skicka inte det”, sa hon. ”Inte för att det är fult, utan för att mottagaren är fel. Till Leo fungerar det perfekt. Till en handläggare på kulturkontoret fungerar det inte.”",
      "Hon ritade två kolumner på tavlan: INFORMELLT och FORMELLT. ”Ni skrev en insändare i höstas. Det här är en annan sorts text. Samma ärende, två röster – ni ska skriva båda.”"],
      pic: PF8[1], say: t3("Lena säger att mejlet inte är fult, men ändå fel. Vad är problemet?", "Lena says the email is not ugly, but still wrong. What is the problem?", "تقول لينا إن الرسالة ليست قبيحة لكنها خاطئة. ما المشكلة؟")},
    {text: ["Det informella mejlet gick till Noahs kusin Dina, som jobbar på bussbolaget. ”Hej Dina! Vi är 26 personer och ska till Stockholm 14 maj. Vad kostar en buss? Kram Noah.”",
      "Dina svarade inom en timme, med en smiley och ett pris. ”Så ska det låta”, sa Lena. ”Korta ord, förnamn, du-tilltal. Ni känner varandra.”"],
      pic: PF8[2], say: t3("Det informella mejlet fungerar bra. Varför passar det just här?", "The informal email works well. Why does it fit here?", "الرسالة غير الرسمية ناجحة. لماذا تناسب هنا؟")},
    {text: ["Det formella mejlet tog hela lektionen. Ämnesraden först: ”Ansökan om bidrag till studieresa, klass 8B, Björkskolan”. Sedan en hälsning utan smeknamn, och namnet på den de skrev till.",
      "”Säg vem ni är i första meningen”, sa Lena. ”En handläggare läser trettio mejl om dagen och vet inte vilka ni är. Och kulturpotten har sina regler – läs dem först.” Amir skrev ett utkast, strök hälften och började om."],
      pic: PF8[3], say: t3("Varför ska de skriva vilka de är redan i första meningen?", "Why should they say who they are in the very first sentence?", "لماذا يذكرون من هم في الجملة الأولى؟")},
    {text: ["Sara skrev: ”Vi är elever i klass 8B på Björkskolan i Hagaby. Vi ansöker om 8 000 kronor till en studieresa till Stockholm den 14 maj. Resan är angelägen för oss, eftersom vi läser om riksdagen i samhällskunskap och vill besöka den.”",
      "Sedan hänvisade hon till kommunens egen sida: ”Vi hänvisar till era riktlinjer från februari, punkt fyra.”"],
      pic: PF8[4], say: t3("Sara hänvisar till kommunens riktlinjer. Varför gör hon det?", "Sara refers to the council's guidelines. Why does she do that?", "تُحيل سارة إلى لوائح البلدية. لماذا تفعل ذلك؟")},
    {text: ["Till slut kom det Amir hade skrivit ”Hojta” om: ”Vänligen bekräfta att ansökan har kommit in. Vi svarar gärna på frågor.” Under det stod ”Med vänliga hälsningar”, båda namnen, klassen och Lenas mejladress.",
      "De läste igenom texten en sista gång och tog bort tre utropstecken."],
      pic: PF8[5], say: t3("De tar bort tre utropstecken. Vad säger det om formellt språk?", "They remove three exclamation marks. What does that say about formal language?", "يحذفون ثلاث علامات تعجّب. ماذا يقول ذلك عن اللغة الرسمية؟")},
    {text: ["Svaret kom på torsdagen. Handläggaren bekräftade att ansökan hade kommit in och beviljade 5 000 kronor. Resten fick klassen ordna själv. ”En kompromiss igen”, sa Noah, men 5 000 var en rimlig summa att börja med.",
      "”Vad var det som gjorde skillnad?” frågade Amir. ”Ingenting magiskt”, sa Lena. ”Ni tänkte på mottagaren. Till Dina skrev ni informellt, till kommunen formellt. Samma sak, två röster.” Insamlingen av de sista pengarna blev Elsas idé, men det är en annan historia."],
      pic: PF8[6], say: t3("Klassen får 5 000 kronor. Vad menar Lena med ”samma sak, två röster”?", "The class gets 5,000 kronor. What does Lena mean by ”the same thing, two voices”?", "يحصل الصف على 5000 كرونة. ماذا تعني لينا بـ «الشيء نفسه بصوتين»؟")}],
  wordsSay: t3("Ord för formella och informella texter. Tryck på ett ord för att se vad det betyder.", "Words for formal and informal texts. Tap a word to see what it means.", "كلمات للنصوص الرسمية وغير الرسمية. اضغط على كلمة لترى معناها."),
  grammar: [
    {draw: () => [A.wipe(), head(t3("Samma ärende, två röster", "The same matter, two voices", "الموضوع نفسه بصوتين")),
      A.tx(T("informellt", "informal", "غير رسميّ"), 210, 128, 30, "o"), A.tx(T("formellt", "formal", "رسميّ"), 590, 128, 30, "b"),
      A.p(R.line(400, 148, 400, 460, .3), "k", 2),
      ...["Tjena!", "typ 26 pers", "nån cash", "Hojta!", "Kram"].map((s, i) => A.tx(s, 210, 196 + i * 58, 26, "o")),
      ...["Hej!", "cirka 26 personer", "bidrag", "Vänligen svara", "Med vänliga hälsningar"].map((s, i) => A.tx(s, 590, 196 + i * 58, 24, "b"))],
     say: t3("Samma ärende kan skrivas på två sätt. Till en kompis: Tjena, typ, kram. Till ett kontor: Hej, cirka, vänligen, med vänliga hälsningar. Innehållet är lika, men rösten är olika.", "The same matter can be written in two ways. To a friend: Tjena, typ, kram. To an office: Hej, cirka, vänligen, med vänliga hälsningar. The content is the same, but the voice is different.", "يمكن كتابة الموضوع نفسه بطريقتين. إلى صديق: Tjena و typ و kram. وإلى دائرة: Hej و cirka و vänligen و med vänliga hälsningar. المضمون واحد والصوت مختلف.")},
    {draw: () => [A.wipe(), head(t3("Vad kännetecknar ett formellt mejl?", "What marks a formal email?", "ما سمات الرسالة الرسمية؟"), 56, 30),
      ...["ämnesrad som säger vad det handlar om", "hela meningar, inga förkortningar", "säg vem du är i första meningen", "hänvisa till regler eller samtal", "artig avslutning och ditt namn"].map((s, i) => [A.tx(`${i + 1}.`, 150, 150 + i * 62, 26, "r", "end"), A.tx(s, 180, 150 + i * 62, 25, "k", "start")]).flat(),
      qt(T("Inga smileys och högst ett utropstecken.", "No smileys and at most one exclamation mark.", "بلا رموز تعبيرية وعلامة تعجّب واحدة على الأكثر."), 400, 466, 24, "o")],
     say: t3("Ett formellt mejl har en tydlig ämnesrad, hela meningar och inga förkortningar. Säg vem du är, hänvisa till regler eller till ett tidigare samtal, och avsluta artigt med ditt namn.", "A formal email has a clear subject line, full sentences and no abbreviations. Say who you are, refer to rules or an earlier conversation, and end politely with your name.", "الرسالة الرسمية لها سطر موضوع واضح وجمل كاملة بلا اختصارات. اذكر من أنت، وأشر إلى اللوائح أو إلى حديث سابق، واختم بتأدّب باسمك.")},
    {draw: () => [A.wipe(), head(t3("Mottagaren bestämmer", "The recipient decides", "المستلم هو من يحدّد")),
      ...boxes([["kompis", "o", "Hej Dina!"], ["lärare", "g", "Hej Lena,"], ["handläggare", "b", "Hej!"]], 210, 30),
      A.arrow(400, 250, 400, 320, "k"),
      ...boxes([["samma ärende", "r", "olika röst"]], 380, 32),
      qt(T("Fråga: vem läser, och vad vet hen om mig?", "Ask: who is reading, and what do they know about me?", "اسأل: من يقرأ؟ وماذا يعرف عنّي؟"), 400, 460, 24, "k")],
     say: t3("Fråga alltid vem mottagaren är och vad hen vet om dig. En kompis vet allt, en handläggare vet ingenting. Ju mindre mottagaren vet, desto mer formell och tydlig måste du vara.", "Always ask who the recipient is and what they know about you. A friend knows everything, a case officer knows nothing. The less the recipient knows, the more formal and clear you have to be.", "اسأل دائمًا من المستلم وماذا يعرف عنك. الصديق يعرف كل شيء، والموظّف لا يعرف شيئًا. وكلما قلّت معرفته زاد ما تحتاجه من الرسمية والوضوح.")}],
  read: [
    {q: "Vad behövde klassen pengar till?", o: ["En studieresa till Stockholm", "En ny buss till Hagaby", "En klassfest i källaren"], why: "Del 1: 8B skulle åka till Stockholm i maj."},
    {q: "Varför ville Lena inte att Amir skulle skicka sitt första mejl?", o: ["Mottagaren var en handläggare, inte en kompis.", "Det var för långt.", "Det var skrivet på engelska."], why: "Del 2: ”Inte för att det är fult, utan för att mottagaren är fel.”"},
    {q: "Vem fick det informella mejlet?", o: ["Noahs kusin Dina på bussbolaget", "Handläggaren på kulturkontoret", "Rektorn på Björkskolan"], why: "Del 3: Det informella mejlet gick till Dina."},
    {q: "Vad stod i ämnesraden på det formella mejlet?", o: ["Ansökan om bidrag till studieresa, klass 8B", "Hej! Vi behöver pengar", "Mycket angeläget"], why: "Del 4: ”Ansökan om bidrag till studieresa, klass 8B, Björkskolan”."},
    {q: "Varför skulle de säga vilka de var i första meningen?", o: ["Handläggaren läser många mejl och känner inte klassen.", "Det är en regel i svensk grammatik.", "Annars kommer mejlet till fel adress."], why: "Del 4: ”En handläggare läser trettio mejl om dagen och vet inte vilka ni är.”"},
    {q: "Vad hänvisade Sara till i mejlet?", o: ["Kommunens egna riktlinjer från februari", "En insändare i Hagabybladet", "Lenas schema"], why: "Del 5: ”Vi hänvisar till era riktlinjer från februari, punkt fyra.”"},
    {q: "Hur avslutades det formella mejlet?", o: ["Med ”Vänligen bekräfta …” och ”Med vänliga hälsningar”", "Med ”Hojta!”", "Med ”Kram 8B”"], why: "Del 6: ”Vänligen bekräfta att ansökan har kommit in” och ”Med vänliga hälsningar”."},
    {q: "Varför tog de bort tre utropstecken?", o: ["Många utropstecken passar inte i ett formellt mejl.", "Tangentbordet var trasigt.", "Lena räknade antalet tecken."], why: "I ett formellt mejl ska tonen vara lugn. Utropstecken låter som att man ropar."},
    {q: "Vad menar Lena med ”samma sak, två röster”?", o: ["Ärendet är detsamma, men språket anpassas efter mottagaren.", "Två personer måste skriva varje mejl.", "Man ska alltid skicka två mejl."], why: "Del 7: till Dina skrev de informellt, till kommunen formellt – samma ärende."}],
  gram(lv, write): Problem {
    if (write || lv === 2) {
      const [inf, form] = pick(ORD8F);
      return {kind: "text", ans: [form], show: form, q: [A.wipe(), head(t3("Skriv ett formellt ord i stället för det informella.", "Write a formal word instead of the informal one.", "اكتب كلمة رسمية بدل الكلمة غير الرسمية."), 76, 28), A.tx(inf, 400, 230, 52, "o"), A.tx("→ ?", 400, 330, 44, "b")],
        sol: [A.tx(`${inf} → ${form}`, 400, 300, 40, "g")], hint: {say: REGH, draw: []}};
    }
    const [inf, form] = pick(REG8), pool = shuffle(REG8.filter(r => r[1] !== form)).slice(0, 2).map(r => r[1]);
    return choice([form, ...pool], form, [A.wipe(), head(t3("Vad skriver du i stället i ett formellt mejl?", "What do you write instead in a formal email?", "بماذا تستبدلها في رسالة رسمية؟"), 80, 30), A.tx(inf, 400, 210, 40, "o"), qt(T("informellt", "informal", "غير رسميّ"), 400, 260, 24, "o")],
      [A.tx(form, 400, 330, 36, "g"), qt(T("formellt", "formal", "رسميّ"), 400, 390, 24, "g")], REGH);
  },
  help: [{say: t3("Mottagaren bestämmer stilen: Tjena till en kompis, Hej och vänligen till ett kontor.", "The recipient decides the style: Tjena to a friend, Hej and vänligen to an office.", "المستلم يحدّد الأسلوب: Tjena إلى صديق، و Hej و vänligen إلى دائرة."),
    draw: () => [A.tx("kompis: Tjena! Kram", 400, 170, 36, "o"), A.tx("kontor: Hej! Vänligen …", 400, 270, 36, "b"), A.tx("Med vänliga hälsningar", 400, 360, 32, "g")]}]
});
}

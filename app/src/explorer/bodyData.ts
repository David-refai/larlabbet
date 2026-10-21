/* "Utforska kroppen": the DATA of the body explorer, kept apart from any renderer.
   Organs, layers and the parts of the detail views (heart, lungs, brain) with Swedish names and
   texts plus English and Arabic translations (shown when the translation setting is on).
   Points (anchor, box, label) are in the front-view picture's units: the body is drawn in a
   400 × 800 box, x to the viewer's right, so the body's LEFT side is on the viewer's RIGHT.
   A 3D renderer can keep all of this and map ids to meshes instead of using the points. */

export type T3 = {sv: string; en: string; ar: string};
const t3 = (sv: string, en: string, ar: string): T3 => ({sv, en, ar});

export type LayerId = "skin" | "muscles" | "skeleton" | "organs" | "vessels" | "nerves";
export type OrganId = "brain" | "lungs" | "heart" | "liver" | "stomach" | "intestines" | "kidneys" | "bladder";
export type DetailId = "heart" | "lungs" | "brain" | "liver" | "stomach" | "intestines" | "kidneys" | "bladder";
/* the detail views the 3D explorer has models for (the others are painted pictures only) */
export const DETAILS_3D: DetailId[] = ["heart", "lungs", "brain"];
export type Pt = [number, number];
/* x, y, width, height */
export type Box = [number, number, number, number];

export interface Layer {id: LayerId; icon: string; name: T3}
export const LAYERS: Layer[] = [
  {id: "skin", icon: "🧒", name: t3("Hud", "Skin", "الجلد")},
  {id: "muscles", icon: "💪", name: t3("Muskler", "Muscles", "العضلات")},
  {id: "skeleton", icon: "🦴", name: t3("Skelett", "Skeleton", "الهيكل العظمي")},
  {id: "organs", icon: "🫀", name: t3("Organ", "Organs", "الأعضاء")},
  {id: "vessels", icon: "🩸", name: t3("Blodkärl", "Blood vessels", "الأوعية الدموية")},
  {id: "nerves", icon: "⚡", name: t3("Nerver", "Nerves", "الأعصاب")},
];

export interface Organ {
  id: OrganId;
  name: T3;
  /* one short sentence: what it does */
  info: T3;
  /* one more fact, shown by "Mer" when the organ has no detail view */
  more: T3;
  layer: LayerId;
  detail?: DetailId;
  /* where a label points, and the area to zoom to when the organ is isolated */
  anchor: Pt;
  box: Box;
}

export const ORGANS: Organ[] = [
  {id: "brain", name: t3("Hjärnan", "The brain", "الدماغ"), layer: "organs", detail: "brain", anchor: [200, 70], box: [140, 30, 120, 90],
    info: t3("Hjärnan styr hela kroppen. Där tänker du, minns och känner.", "The brain controls the whole body. It is where you think, remember and feel.", "الدماغ يتحكّم بالجسم كله، وفيه تفكّر وتتذكّر وتشعر."),
    more: t3("Hjärnan skickar signaler genom nerverna, snabbare än ett tåg.", "The brain sends signals through the nerves, faster than a train.", "يرسل الدماغ إشارات عبر الأعصاب أسرع من القطار.")},
  {id: "lungs", name: t3("Lungorna", "The lungs", "الرئتان"), layer: "organs", detail: "lungs", anchor: [158, 280], box: [130, 160, 140, 190],
    info: t3("Lungorna tar in syre från luften du andas in.", "The lungs take in oxygen from the air you breathe in.", "الرئتان تأخذان الأكسجين من الهواء الذي تتنفّسه."),
    more: t3("Du andas ungefär 20 000 gånger varje dag.", "You breathe about 20,000 times every day.", "تتنفّس نحو 20000 مرة كل يوم.")},
  {id: "heart", name: t3("Hjärtat", "The heart", "القلب"), layer: "organs", detail: "heart", anchor: [214, 292], box: [176, 256, 76, 76],
    info: t3("Hjärtat är en muskel som pumpar blod runt i hela kroppen.", "The heart is a muscle that pumps blood around the whole body.", "القلب عضلة تضخّ الدم إلى الجسم كله."),
    more: t3("Hjärtat slår ungefär 100 000 gånger varje dygn.", "The heart beats about 100,000 times a day.", "ينبض القلب نحو 100000 مرة في اليوم.")},
  {id: "liver", detail: "liver", name: t3("Levern", "The liver", "الكبد"), layer: "organs", anchor: [168, 362], box: [134, 330, 104, 70],
    info: t3("Levern rensar blodet och sparar näring till senare.", "The liver cleans the blood and stores nutrients for later.", "الكبد ينظّف الدم ويخزّن الغذاء لوقت لاحق."),
    more: t3("Levern är det största organet inuti kroppen.", "The liver is the largest organ inside the body.", "الكبد أكبر عضو داخل الجسم.")},
  {id: "stomach", detail: "stomach", name: t3("Magsäcken", "The stomach", "المعدة"), layer: "organs", anchor: [240, 368], box: [200, 334, 70, 72],
    info: t3("Magsäcken blandar maten med magsaft så att den bryts ner.", "The stomach mixes food with stomach juice so it breaks down.", "المعدة تخلط الطعام بالعصارة الهاضمة فيتفتّت."),
    more: t3("Magsäcken kan töjas ut som en ballong när du äter.", "The stomach can stretch like a balloon when you eat.", "تتمدّد المعدة مثل البالون عندما تأكل.")},
  {id: "intestines", detail: "intestines", name: t3("Tarmarna", "The intestines", "الأمعاء"), layer: "organs", anchor: [200, 440], box: [140, 392, 120, 92],
    info: t3("Tarmarna tar upp näringen ur maten till blodet.", "The intestines take the nutrients from food into the blood.", "الأمعاء تمتصّ الغذاء من الطعام إلى الدم."),
    more: t3("Tunntarmen är lika lång som en buss, ungefär 6 meter.", "The small intestine is as long as a bus, about 6 metres.", "الأمعاء الدقيقة طويلة مثل الحافلة، نحو 6 أمتار.")},
  {id: "kidneys", detail: "kidneys", name: t3("Njurarna", "The kidneys", "الكليتان"), layer: "organs", anchor: [254, 392], box: [136, 360, 128, 64],
    info: t3("Njurarna renar blodet och gör urin av det som ska bort.", "The kidneys clean the blood and make urine from the waste.", "الكليتان تنقّيان الدم وتصنعان البول من الفضلات."),
    more: t3("Du har två njurar. De är stora som en knytnäve.", "You have two kidneys. Each is about as big as a fist.", "لديك كليتان، كل واحدة بحجم قبضة اليد.")},
  {id: "bladder", detail: "bladder", name: t3("Urinblåsan", "The bladder", "المثانة"), layer: "organs", anchor: [200, 478], box: [170, 452, 60, 48],
    info: t3("Urinblåsan samlar urin tills du går på toaletten.", "The bladder holds urine until you go to the toilet.", "المثانة تجمع البول حتى تذهب إلى الحمّام."),
    more: t3("Urinblåsan är en liten påse av muskler som kan töjas.", "The bladder is a small bag of muscle that can stretch.", "المثانة كيس صغير من العضلات يستطيع أن يتمدّد.")},
];

export interface Tab {id: string; name: T3}
export interface Part {
  id: string;
  name: T3;
  info: T3;
  /* the tabs that show this label (in the SVG pictures) */
  tabs: string[];
  /* the tabs that show it in the 3D models, when they differ: a 3D label only names what the model shows */
  tabs3d?: string[];
  /* the point on the drawing and where its label sits (detail picture units) */
  anchor: Pt;
  label: Pt;
}
export interface Detail {
  id: DetailId;
  title: T3;
  /* the picture's own box, with room for the labels; compact: just the organ (narrow screens, numbered dots) */
  view: Box;
  compact: Box;
  tabs: Tab[];
  /* the tabs of the 3D view, when they differ (ids from tabs) */
  tabs3d?: string[];
  /* the tab that runs the flow animation */
  flowTab: string;
  flowName: T3;
  /* what the colours of the flow dots mean */
  legend: {color: string; name: T3}[];
  parts: Part[];
}

const OV = "oversikt";
export const DETAILS: Record<DetailId, Detail> = {
  heart: {id: "heart", title: t3("Hjärtat inuti", "Inside the heart", "داخل القلب"), view: [-40, 0, 720, 570], compact: [130, 4, 430, 560], flowTab: "flode",
    tabs3d: [OV, "kammare", "klaffar", "flode"],
    flowName: t3("Blodflöde", "Blood flow", "جريان الدم"),
    legend: [{color: "#d21f36", name: t3("Syrerikt blod: från lungorna ut i kroppen", "Blood rich in oxygen: from the lungs to the body", "دم غني بالأكسجين: من الرئتين إلى الجسم")},
      {color: "#2a55c8", name: t3("Syrefattigt blod: från kroppen till lungorna", "Blood low in oxygen: from the body to the lungs", "دم قليل الأكسجين: من الجسم إلى الرئتين")}],
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}, {id: "kammare", name: t3("Kammare", "Chambers", "الحجرات")},
      {id: "klaffar", name: t3("Klaffar", "Valves", "الصمامات")}, {id: "flode", name: t3("Blodflöde", "Blood flow", "جريان الدم")}],
    parts: [
      {id: "hf", name: t3("Höger förmak", "Right atrium", "الأذين الأيمن"), tabs: [OV, "kammare"], anchor: [236, 240], label: [70, 262],
        info: t3("Hit kommer blodet från kroppen. Det har lämnat sitt syre.", "Blood from the body comes here. It has given away its oxygen.", "يصل إليه الدم من الجسم بعد أن أعطى الأكسجين.")},
      {id: "hk", name: t3("Höger kammare", "Right ventricle", "البطين الأيمن"), tabs: [OV, "kammare"], anchor: [290, 380], label: [70, 420],
        info: t3("Pumpar blodet till lungorna för att hämta nytt syre.", "Pumps the blood to the lungs to pick up new oxygen.", "يضخّ الدم إلى الرئتين ليأخذ أكسجينًا جديدًا.")},
      {id: "vf", name: t3("Vänster förmak", "Left atrium", "الأذين الأيسر"), tabs: [OV, "kammare"], anchor: [404, 236], label: [576, 300],
        info: t3("Hit kommer blodet från lungorna, fullt av syre.", "Blood from the lungs comes here, full of oxygen.", "يصل إليه الدم من الرئتين مليئًا بالأكسجين.")},
      {id: "vk", name: t3("Vänster kammare", "Left ventricle", "البطين الأيسر"), tabs: [OV, "kammare"], anchor: [398, 392], label: [576, 440],
        info: t3("Den starkaste delen. Pumpar ut blodet i hela kroppen.", "The strongest part. Pumps the blood out to the whole body.", "أقوى جزء، يضخّ الدم إلى الجسم كله.")},
      {id: "aorta", name: t3("Aorta", "Aorta", "الشريان الأبهر"), tabs: [OV], anchor: [352, 84], label: [440, 40],
        info: t3("Kroppens största artär. Den för syrerikt blod ut i kroppen.", "The body's biggest artery. It carries blood full of oxygen to the body.", "أكبر شريان في الجسم، ينقل الدم الغني بالأكسجين إلى الجسم.")},
      {id: "lungartar", name: t3("Lungartär", "Pulmonary artery", "الشريان الرئوي"), tabs: [OV], anchor: [470, 152], label: [576, 160],
        info: t3("För blodet från hjärtat till lungorna.", "Carries blood from the heart to the lungs.", "ينقل الدم من القلب إلى الرئتين.")},
      {id: "halvener", name: t3("Hålvener", "Venae cavae", "الوريدان الأجوفان"), tabs: [OV], anchor: [232, 110], label: [70, 110],
        info: t3("Två stora vener som för tillbaka blodet från kroppen till hjärtat.", "Two big veins that bring blood from the body back to the heart.", "وريدان كبيران يعيدان الدم من الجسم إلى القلب.")},
      {id: "lungvener", name: t3("Lungvener", "Pulmonary veins", "الأوردة الرئوية"), tabs: [], tabs3d: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Fyra vener som för syrerikt blod från lungorna till vänster förmak.", "Four veins that bring blood full of oxygen from the lungs to the left atrium.", "أربعة أوردة تنقل الدم الغني بالأكسجين من الرئتين إلى الأذين الأيسر.")},
      {id: "skiljevagg", name: t3("Skiljevägg", "Septum", "الحاجز"), tabs: [], tabs3d: ["kammare"], anchor: [0, 0], label: [0, 0],
        info: t3("En tjock vägg mitt i hjärtat. Den håller isär det blå och det röda blodet.", "A thick wall in the middle of the heart. It keeps the blue and the red blood apart.", "جدار سميك في وسط القلب يفصل بين الدم الأزرق والدم الأحمر.")},
      {id: "klaffar", name: t3("Klaffar", "Valves", "الصمامات"), tabs: [OV], tabs3d: [], anchor: [262, 318], label: [70, 340],
        info: t3("Små dörrar som bara öppnas åt ett håll, så att blodet inte rinner bakåt.", "Small doors that open only one way, so the blood cannot flow backwards.", "أبواب صغيرة تُفتح في اتجاه واحد، فلا يرجع الدم إلى الخلف.")},
      {id: "k-tri", name: t3("Trikuspidalklaff", "Tricuspid valve", "الصمام ثلاثي الشرفات"), tabs: ["klaffar"], anchor: [262, 318], label: [70, 340],
        info: t3("Dörren mellan höger förmak och höger kammare.", "The door between the right atrium and the right ventricle.", "الباب بين الأذين الأيمن والبطين الأيمن.")},
      {id: "k-pulm", name: t3("Pulmonalisklaff", "Pulmonary valve", "الصمام الرئوي"), tabs: ["klaffar"], anchor: [306, 230], label: [70, 190],
        info: t3("Dörren ut från höger kammare till lungartären.", "The door out of the right ventricle into the pulmonary artery.", "الباب من البطين الأيمن إلى الشريان الرئوي.")},
      {id: "k-mitral", name: t3("Mitralisklaff", "Mitral valve", "الصمام التاجي"), tabs: ["klaffar"], anchor: [398, 300], label: [576, 330],
        info: t3("Dörren mellan vänster förmak och vänster kammare.", "The door between the left atrium and the left ventricle.", "الباب بين الأذين الأيسر والبطين الأيسر.")},
      {id: "k-aorta", name: t3("Aortaklaff", "Aortic valve", "الصمام الأبهري"), tabs: ["klaffar"], anchor: [346, 236], label: [576, 220],
        info: t3("Dörren ut från vänster kammare till aortan.", "The door out of the left ventricle into the aorta.", "الباب من البطين الأيسر إلى الشريان الأبهر.")},
      {id: "f-blue", name: t3("Syrefattigt blod", "Blood low in oxygen", "دم قليل الأكسجين"), tabs: ["flode"], anchor: [236, 250], label: [70, 262],
        info: t3("Det blå blodet kommer från kroppen och pumpas till lungorna.", "The blue blood comes from the body and is pumped to the lungs.", "الدم الأزرق يأتي من الجسم ويُضَخّ إلى الرئتين.")},
      {id: "f-red", name: t3("Syrerikt blod", "Blood rich in oxygen", "دم غني بالأكسجين"), tabs: ["flode"], anchor: [404, 246], label: [576, 300],
        info: t3("Det röda blodet kommer från lungorna och pumpas ut i kroppen.", "The red blood comes from the lungs and is pumped out to the body.", "الدم الأحمر يأتي من الرئتين ويُضَخّ إلى الجسم.")},
    ]},
  lungs: {id: "lungs", title: t3("Lungorna inuti", "Inside the lungs", "داخل الرئتين"), view: [-40, 0, 720, 570], compact: [128, 0, 516, 560], flowTab: "luft",
    tabs3d: ["vagar", "blasor", "luft"],
    flowName: t3("Luftflöde", "Air flow", "جريان الهواء"),
    legend: [{color: "#5cc6e8", name: t3("Luft: in när du andas in, ut när du andas ut", "Air: in when you breathe in, out when you breathe out", "الهواء: يدخل عند الشهيق ويخرج عند الزفير")}],
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}, {id: "vagar", name: t3("Luftvägar", "Airways", "المجاري التنفسية")},
      {id: "blasor", name: t3("Lungblåsor", "Air sacs", "الحويصلات")}, {id: "luft", name: t3("Luftflöde", "Air flow", "جريان الهواء")}],
    parts: [
      {id: "luftstrupe", name: t3("Luftstrupe", "Windpipe", "القصبة الهوائية"), tabs: [OV, "vagar", "luft"], anchor: [320, 96], label: [440, 60],
        info: t3("Ett rör med ringar av brosk. Luften går här ner till lungorna.", "A tube with rings of cartilage. Air goes down here to the lungs.", "أنبوب فيه حلقات غضروفية، ينزل منه الهواء إلى الرئتين.")},
      {id: "luftror", name: t3("Luftrör", "Bronchi", "الشُّعَب الهوائية"), tabs: [OV, "vagar"], tabs3d: ["vagar", "luft"], anchor: [262, 214], label: [70, 150],
        info: t3("Luftstrupen delar sig i två luftrör, ett till varje lunga.", "The windpipe splits into two bronchi, one to each lung.", "تتفرّع القصبة الهوائية إلى شعبتين، واحدة لكل رئة.")},
      {id: "smaror", name: t3("Små luftrör", "Small airways", "الشُّعَيبات"), tabs: ["vagar"], anchor: [196, 330], label: [70, 400],
        info: t3("Luftrören grenar sig som ett träd i allt mindre rör.", "The bronchi branch like a tree into smaller and smaller tubes.", "تتفرّع الشعب مثل الشجرة إلى أنابيب أصغر فأصغر.")},
      {id: "lungblasor", name: t3("Lungblåsor", "Air sacs (alveoli)", "الحويصلات الهوائية"), tabs: [OV, "blasor"], anchor: [556, 432], label: [592, 320],
        info: t3("Små blåsor längst ut. Där går syret över till blodet.", "Tiny sacs at the very end. There the oxygen passes into the blood.", "أكياس صغيرة في النهاية، ومنها ينتقل الأكسجين إلى الدم.")},
      {id: "hlunga", name: t3("Höger lunga", "Right lung", "الرئة اليمنى"), tabs: [OV], tabs3d: ["vagar"], anchor: [170, 300], label: [70, 300],
        info: t3("Den högra lungan har tre delar, lober.", "The right lung has three parts, called lobes.", "الرئة اليمنى لها ثلاثة أجزاء تسمّى فصوصًا.")},
      {id: "vlunga", name: t3("Vänster lunga", "Left lung", "الرئة اليسرى"), tabs: [OV], tabs3d: ["vagar"], anchor: [454, 280], label: [576, 250],
        info: t3("Den vänstra lungan är lite mindre. Den ger plats åt hjärtat.", "The left lung is a little smaller. It leaves room for the heart.", "الرئة اليسرى أصغر قليلًا لتترك مكانًا للقلب.")},
      {id: "syre", name: t3("Syre in", "Oxygen in", "الأكسجين يدخل"), tabs: ["luft", "blasor"], tabs3d: ["blasor"], anchor: [492, 412], label: [440, 548],
        info: t3("Syret går från lungblåsorna in i blodet.", "Oxygen goes from the air sacs into the blood.", "ينتقل الأكسجين من الحويصلات إلى الدم.")},
      {id: "koldioxid", name: t3("Koldioxid ut", "Carbon dioxide out", "ثاني أكسيد الكربون يخرج"), tabs: ["luft", "blasor"], tabs3d: ["blasor"], anchor: [620, 432], label: [604, 548],
        info: t3("Koldioxid går från blodet ut i luften som du andas ut.", "Carbon dioxide goes from the blood into the air you breathe out.", "ينتقل ثاني أكسيد الكربون من الدم إلى الهواء الذي تُخرجه.")},
      {id: "kapillarer", name: t3("Små blodkärl", "Tiny blood vessels", "أوعية دموية دقيقة"), tabs: [], tabs3d: ["blasor"], anchor: [0, 0], label: [0, 0],
        info: t3("Runt lungblåsorna går små blodkärl. Där hämtar blodet syre och lämnar koldioxid.", "Tiny blood vessels wrap around the air sacs. There the blood picks up oxygen and leaves carbon dioxide.", "تلتفّ أوعية دموية دقيقة حول الحويصلات، وفيها يأخذ الدم الأكسجين ويترك ثاني أكسيد الكربون.")},
    ]},
  brain: {id: "brain", title: t3("Hjärnan inuti", "Inside the brain", "داخل الدماغ"), view: [-40, 0, 720, 570], compact: [136, 70, 400, 500], flowTab: "signal",
    tabs3d: ["delar", "signal"],
    flowName: t3("Signaler", "Signals", "الإشارات"),
    legend: [{color: "#f2b705", name: t3("Nervsignaler mellan hjärnan och kroppen", "Nerve signals between the brain and the body", "إشارات عصبية بين الدماغ والجسم")}],
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}, {id: "delar", name: t3("Delar", "Parts", "الأجزاء")},
      {id: "signal", name: t3("Signaler", "Signals", "الإشارات")}],
    parts: [
      {id: "storhjarna", name: t3("Storhjärna", "Cerebrum", "المخ"), tabs: [OV, "delar"], anchor: [300, 190], label: [90, 70],
        info: t3("Den största delen. Här tänker du, minns och förstår vad du ser och hör.", "The biggest part. Here you think, remember and understand what you see and hear.", "أكبر جزء، فيه تفكّر وتتذكّر وتفهم ما تراه وتسمعه.")},
      {id: "lillhjarna", name: t3("Lillhjärna", "Cerebellum", "المخيخ"), tabs: [OV, "delar"], anchor: [440, 352], label: [570, 300],
        info: t3("Hjälper dig att hålla balansen och röra dig smidigt.", "Helps you keep your balance and move smoothly.", "يساعدك على التوازن والحركة بسلاسة.")},
      {id: "hjarnstam", name: t3("Hjärnstam", "Brainstem", "جذع الدماغ"), tabs: [OV, "delar", "signal"], anchor: [356, 392], label: [570, 440],
        info: t3("Styr sådant du inte tänker på, som andning och hjärtslag.", "Controls things you do not think about, like breathing and heartbeat.", "يتحكّم بما لا تفكّر فيه، مثل التنفّس ونبض القلب.")},
      {id: "ryggmarg", name: t3("Ryggmärg", "Spinal cord", "الحبل الشوكي"), tabs: ["delar", "signal"], anchor: [366, 496], label: [570, 520],
        info: t3("En lång nervsträng i ryggen. Den för signaler mellan hjärnan och kroppen.", "A long bundle of nerves in the back. It carries signals between the brain and the body.", "حبل طويل من الأعصاب في الظهر، ينقل الإشارات بين الدماغ والجسم.")},
      {id: "pannlob", name: t3("Tänka och planera", "Thinking and planning", "التفكير والتخطيط"), tabs: ["delar"], anchor: [180, 200], label: [70, 260],
        info: t3("Längst fram i storhjärnan planerar du och bestämmer dig.", "At the front of the cerebrum you plan and make decisions.", "في مقدّمة المخ تخطّط وتتّخذ القرارات.")},
      {id: "syncentrum", name: t3("Syn", "Sight", "البصر"), tabs: ["delar"], anchor: [470, 250], label: [570, 200],
        info: t3("Längst bak i storhjärnan förstår du det som ögonen ser.", "At the back of the cerebrum you understand what your eyes see.", "في مؤخّرة المخ تفهم ما تراه العينان.")},
      {id: "signaler", name: t3("Nervsignaler", "Nerve signals", "الإشارات العصبية"), tabs: ["signal"], anchor: [300, 150], label: [90, 70],
        info: t3("Hjärnan skickar signaler genom ryggmärgen ut till musklerna. Kroppen skickar också signaler tillbaka till hjärnan, till exempel när du känner något.", "The brain sends signals through the spinal cord out to the muscles. The body also sends signals back to the brain, for example when you feel something.", "يرسل الدماغ إشارات عبر الحبل الشوكي إلى العضلات. ويرسل الجسم أيضًا إشارات إلى الدماغ، مثلًا عندما تشعر بشيء.")},
    ]},

  liver: {id: "liver", title: t3("Levern och gallblåsan", "The liver and the gallbladder", "الكبد والمرارة"), view: [0, 0, 512, 369], compact: [0, 0, 512, 369], flowTab: "", legend: [], flowName: t3("", "", ""),
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}],
    parts: [
      {id: "hlob", name: t3("Höger lob", "Right lobe", "الفص الأيمن"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Den största delen av levern. Den ligger på kroppens högra sida, under revbenen.", "The biggest part of the liver. It lies on the right side of the body, under the ribs.", "أكبر جزء من الكبد، يقع في الجهة اليمنى من الجسم تحت الأضلاع.")},
      {id: "vlob", name: t3("Vänster lob", "Left lobe", "الفص الأيسر"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Den mindre delen. Den sträcker sig över mot magsäcken.", "The smaller part. It reaches over towards the stomach.", "الجزء الأصغر، يمتدّ نحو المعدة.")},
      {id: "gallblasa", name: t3("Gallblåsa", "Gallbladder", "المرارة"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("En liten påse som sparar galla. Gallan hjälper till att bryta ner fett i maten.", "A small bag that stores bile. Bile helps to break down fat in food.", "كيس صغير يخزّن العصارة الصفراء التي تساعد على تفتيت الدهون في الطعام.")},
      {id: "rensar", name: t3("Rensar blodet", "Cleans the blood", "ينظّف الدم"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Allt blod från tarmarna går först genom levern. Levern tar bort gifter och sparar socker som energi till senare.", "All blood from the intestines goes through the liver first. The liver removes poisons and stores sugar as energy for later.", "كل الدم القادم من الأمعاء يمرّ أولًا بالكبد، فيزيل السموم ويخزّن السكر طاقةً لوقت لاحق.")},
    ]},
  stomach: {id: "stomach", title: t3("Magsäcken", "The stomach", "المعدة"), view: [0, 0, 540, 580], compact: [0, 0, 540, 580], flowTab: "", legend: [], flowName: t3("", "", ""),
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}],
    parts: [
      {id: "matstrupe", name: t3("Matstrupe", "Gullet (oesophagus)", "المريء"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Ett muskelrör från munnen. Det klämmer ner maten till magsäcken, även om du står på huvudet.", "A muscle tube from the mouth. It squeezes the food down to the stomach, even if you stand on your head.", "أنبوب عضلي من الفم يدفع الطعام إلى المعدة، حتى لو وقفت على رأسك.")},
      {id: "ovremagmun", name: t3("Övre magmunnen", "Upper opening", "الفتحة العليا"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("En ring av muskler som släpper in maten och stänger, så att magsaften inte kommer upp.", "A ring of muscle that lets the food in and closes, so the stomach juice does not come up.", "حلقة عضلية تُدخل الطعام ثم تُغلق حتى لا تصعد العصارة.")},
      {id: "magvagg", name: t3("Muskelvägg", "Muscle wall", "الجدار العضلي"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Väggen är full av muskler. De knådar och blandar maten som en deg.", "The wall is full of muscles. They knead and mix the food like dough.", "الجدار مليء بالعضلات التي تعجن الطعام وتخلطه مثل العجين.")},
      {id: "magsaft", name: t3("Magsaft", "Stomach juice", "العصارة المعدية"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("En sur vätska som bryter ner maten och dödar bakterier. Ett slemlager skyddar magsäcken själv.", "A sour liquid that breaks down food and kills bacteria. A layer of mucus protects the stomach itself.", "سائل حمضي يفتّت الطعام ويقتل البكتيريا، وطبقة مخاطية تحمي المعدة نفسها.")},
      {id: "nedremagmun", name: t3("Nedre magmunnen", "Lower opening", "الفتحة السفلى"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Släpper ut lite mat i taget till tunntarmen när den är färdigblandad.", "Lets a little food at a time out into the small intestine when it is well mixed.", "تُخرج قليلًا من الطعام في كل مرة إلى الأمعاء الدقيقة بعد أن يُخلط جيدًا.")},
      {id: "tolvfinger", name: t3("Tolvfingertarmen", "Duodenum", "الاثنا عشر"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Första biten av tunntarmen. Hit kommer galla från levern och saft från bukspottkörteln.", "The first part of the small intestine. Bile from the liver and juice from the pancreas come here.", "أول جزء من الأمعاء الدقيقة، تصل إليه العصارة الصفراء من الكبد وعصارة البنكرياس.")},
    ]},
  intestines: {id: "intestines", title: t3("Tarmarna", "The intestines", "الأمعاء"), view: [0, 0, 531, 618], compact: [0, 0, 531, 618], flowTab: "", legend: [], flowName: t3("", "", ""),
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}],
    parts: [
      {id: "tunntarm", name: t3("Tunntarmen", "Small intestine", "الأمعاء الدقيقة"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Ett långt, smalt rör som ligger hoprullat. Här tas näringen upp i blodet.", "A long, narrow tube lying coiled up. Here the nutrients are taken into the blood.", "أنبوب طويل ورفيع ملفوف، وفيه يُمتصّ الغذاء إلى الدم.")},
      {id: "tarmludd", name: t3("Tarmludd", "Villi", "الزغابات"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Insidan av tunntarmen är full av små utskott som en handduk. De gör ytan stor så att mer näring tas upp.", "The inside of the small intestine is full of tiny bumps, like a towel. They make the surface big so more nutrients are taken up.", "داخل الأمعاء الدقيقة مليء بنتوءات صغيرة مثل المنشفة، تكبّر السطح فيُمتصّ غذاء أكثر.")},
      {id: "tjocktarm", name: t3("Tjocktarmen", "Large intestine", "الأمعاء الغليظة"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Ett tjockare rör som går runt tunntarmen. Här tas vatten upp ur det som blir kvar av maten.", "A thicker tube that goes around the small intestine. Here water is taken from what is left of the food.", "أنبوب أعرض يلتفّ حول الأمعاء الدقيقة، وفيه يُمتصّ الماء مما تبقّى من الطعام.")},
      {id: "blindtarm", name: t3("Blindtarmsbihang", "Appendix", "الزائدة الدودية"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("En liten säck där tunntarmen möter tjocktarmen. Om den blir inflammerad gör det ont i magen.", "A small pouch where the small intestine meets the large intestine. If it gets inflamed, the tummy hurts.", "كيس صغير حيث تلتقي الأمعاء الدقيقة بالغليظة، وإذا التهب يؤلم البطن.")},
      {id: "andtarm", name: t3("Ändtarmen", "Rectum", "المستقيم"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Sista biten. Här samlas bajset tills du går på toaletten.", "The last part. Poo is collected here until you go to the toilet.", "آخر جزء، يتجمّع فيه البراز حتى تذهب إلى الحمّام.")},
    ]},
  kidneys: {id: "kidneys", title: t3("Njurarna", "The kidneys", "الكليتان"), view: [0, 0, 560, 502], compact: [0, 0, 560, 502], flowTab: "", legend: [], flowName: t3("", "", ""),
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}],
    parts: [
      {id: "hnjure", name: t3("Höger njure", "Right kidney", "الكلية اليمنى"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Njurarna sitter i ryggen, en på varje sida. Den högra sitter lite lägre, för levern ligger ovanför.", "The kidneys sit at the back, one on each side. The right one sits a little lower, because the liver is above it.", "الكليتان في الظهر، واحدة في كل جهة. اليمنى أخفض قليلًا لأن الكبد فوقها.")},
      {id: "vnjure", name: t3("Vänster njure", "Left kidney", "الكلية اليسرى"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Varje njure har miljontals små filter som silar blodet.", "Each kidney has millions of tiny filters that sieve the blood.", "في كل كلية ملايين المرشّحات الصغيرة التي تصفّي الدم.")},
      {id: "njurartar", name: t3("Njurartär", "Renal artery", "الشريان الكلوي"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("För blod som ska renas in till njuren.", "Brings blood that needs cleaning into the kidney.", "يُدخل إلى الكلية الدم الذي يحتاج إلى تنقية.")},
      {id: "njurven", name: t3("Njurven", "Renal vein", "الوريد الكلوي"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("För tillbaka det renade blodet till kroppen.", "Takes the cleaned blood back to the body.", "يعيد الدم المنقّى إلى الجسم.")},
      {id: "urinledare", name: t3("Urinledare", "Ureter", "الحالب"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Ett smalt rör från varje njure. Det för urinen ner till urinblåsan.", "A thin tube from each kidney. It carries the urine down to the bladder.", "أنبوب رفيع من كل كلية ينقل البول إلى المثانة.")},
    ]},
  bladder: {id: "bladder", title: t3("Urinblåsan", "The bladder", "المثانة"), view: [0, 0, 610, 606], compact: [0, 0, 610, 606], flowTab: "", legend: [], flowName: t3("", "", ""),
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}],
    parts: [
      {id: "b-urinledare", name: t3("Urinledare", "Ureters", "الحالبان"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Två rör som droppar ner urin från njurarna hela tiden.", "Two tubes that drip urine down from the kidneys all the time.", "أنبوبان ينقلان البول من الكليتين طوال الوقت.")},
      {id: "blasvagg", name: t3("Töjbar vägg", "Stretchy wall", "جدار مرن"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Väggen är av muskler som kan töjas. När blåsan är full känner du att du behöver kissa.", "The wall is made of muscle that can stretch. When the bladder is full, you feel that you need to pee.", "الجدار من عضلات تتمدّد، وعندما تمتلئ المثانة تشعر أنك تحتاج إلى التبوّل.")},
      {id: "slutmuskel", name: t3("Slutmuskel", "Sphincter", "العضلة العاصرة"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("En ring av muskler som håller blåsan stängd tills du bestämmer dig för att kissa.", "A ring of muscle that keeps the bladder shut until you decide to pee.", "حلقة عضلية تُبقي المثانة مغلقة حتى تقرّر أن تتبوّل.")},
      {id: "urinror", name: t3("Urinrör", "Urethra", "الإحليل"), tabs: [OV], anchor: [0, 0], label: [0, 0],
        info: t3("Röret där urinen kommer ut ur kroppen.", "The tube where urine leaves the body.", "الأنبوب الذي يخرج منه البول من الجسم.")},
    ]},
};

/* the tabs and the labelled parts of a detail view, in 2D (SVG) or in 3D */
export const tabsOf = (d: Detail, in3d: boolean) => in3d && d.tabs3d ? d.tabs.filter(t => d.tabs3d!.includes(t.id)) : d.tabs;
export const partsOn = (d: Detail, tab: string, in3d: boolean) => d.parts.filter(p => (in3d && p.tabs3d ? p.tabs3d : p.tabs).includes(tab));

/* the 3D explorer's own texts */
export const EX3D = {
  canvas: t3("En kropp i 3D. Dra för att snurra den, nyp eller scrolla för att zooma.", "A body in 3D. Drag to turn it, pinch or scroll to zoom.", "جسم ثلاثي الأبعاد. اسحب لتدويره، وقرّب بإصبعين أو بعجلة الفأرة."),
  keys: t3("Piltangenterna snurrar och lutar, plus och minus zoomar.", "The arrow keys turn and tilt, plus and minus zoom.", "مفاتيح الأسهم تدير وتميل، والزائد والناقص للتكبير والتصغير."),
  reset: t3("Återställ kameran", "Reset the camera", "إعادة ضبط الكاميرا"),
  hint: t3("Dra för att snurra · nyp för att zooma", "Drag to turn · pinch to zoom", "اسحب للتدوير · قرّب بإصبعين"),
  back: t3("Tillbaka till hela kroppen", "Back to the whole body", "العودة إلى الجسم كله"),
  simplified: t3("Förenklad modell – formen är förenklad för att visa hur det fungerar", "Simplified model – the shape is simplified to show how it works", "نموذج مبسّط – الشكل مبسّط ليوضّح كيف يعمل"),
  loading: t3("Bygger kroppen i 3D …", "Building the body in 3D …", "جارٍ بناء الجسم ثلاثي الأبعاد …"),
  breatheIn: t3("Andas in", "Breathe in", "شهيق"),
  breatheOut: t3("Andas ut", "Breathe out", "زفير"),
};

/* the bones and muscles the pupil can tap on the skeleton and muscle pictures */
export interface Bit {id: string; layer: "skeleton" | "muscles"; name: T3; info: T3}
export const BITS: Bit[] = [
  {id: "skalle", layer: "skeleton", name: t3("Skallen", "The skull", "الجمجمة"),
    info: t3("Ett hårt skal av ben som skyddar hjärnan. Underkäken är det enda benet i huvudet som kan röra sig.", "A hard shell of bone that protects the brain. The lower jaw is the only bone in the head that can move.", "غلاف صلب من العظم يحمي الدماغ. الفك السفلي هو العظم الوحيد في الرأس الذي يتحرّك.")},
  {id: "ryggrad", layer: "skeleton", name: t3("Ryggraden", "The spine", "العمود الفقري"),
    info: t3("Många små ben, kotor, på rad. De håller dig upprätt och skyddar ryggmärgen inuti.", "Many small bones, vertebrae, in a row. They hold you upright and protect the spinal cord inside.", "عظام صغيرة كثيرة تسمّى الفقرات، مصفوفة معًا. تُبقيك منتصبًا وتحمي الحبل الشوكي في داخلها.")},
  {id: "revben", layer: "skeleton", name: t3("Revbenen", "The ribs", "الأضلاع"),
    info: t3("Tolv par böjda ben som en bur. De skyddar hjärtat och lungorna.", "Twelve pairs of curved bones like a cage. They protect the heart and the lungs.", "اثنا عشر زوجًا من العظام المنحنية مثل القفص، تحمي القلب والرئتين.")},
  {id: "brostben", layer: "skeleton", name: t3("Bröstbenet", "The breastbone", "عظم القص"),
    info: t3("Ett platt ben mitt fram på bröstet. Revbenen sitter fast i det.", "A flat bone in the middle of the chest. The ribs are joined to it.", "عظم مسطّح في وسط الصدر تتّصل به الأضلاع.")},
  {id: "overarm", layer: "skeleton", name: t3("Överarmsbenet", "The upper arm bone", "عظم العضد"),
    info: t3("Ett långt ben mellan axeln och armbågen.", "A long bone between the shoulder and the elbow.", "عظم طويل بين الكتف والمرفق.")},
  {id: "underarm", layer: "skeleton", name: t3("Underarmen", "The forearm", "الساعد"),
    info: t3("Två ben, strålbenet och armbågsbenet. De kan vrida sig runt varandra så att du kan vända handen.", "Two bones, the radius and the ulna. They can twist around each other so you can turn your hand.", "عظمان هما الكعبرة والزند، يدوران حول بعضهما فتستطيع أن تقلب يدك.")},
  {id: "hand", layer: "skeleton", name: t3("Handen", "The hand", "اليد"),
    info: t3("Varje hand har 27 små ben. Därför kan du skriva, knäppa knappar och plocka upp små saker.", "Each hand has 27 small bones. That is why you can write, do up buttons and pick up small things.", "في كل يد 27 عظمًا صغيرًا، ولهذا تستطيع أن تكتب وتغلق الأزرار وتلتقط الأشياء الصغيرة.")},
  {id: "backen", layer: "skeleton", name: t3("Bäckenet", "The pelvis", "الحوض"),
    info: t3("En stor ring av ben. Den bär överkroppen och skyddar urinblåsan.", "A big ring of bone. It carries the upper body and protects the bladder.", "حلقة كبيرة من العظم تحمل الجزء العلوي من الجسم وتحمي المثانة.")},
  {id: "larben", layer: "skeleton", name: t3("Lårbenet", "The thigh bone", "عظم الفخذ"),
    info: t3("Kroppens längsta och starkaste ben. Inuti finns benmärg som gör nya blodkroppar.", "The longest and strongest bone in the body. Inside is bone marrow that makes new blood cells.", "أطول عظم وأقواه في الجسم، وفي داخله نخاع يصنع خلايا دم جديدة.")},
  {id: "knaskal", layer: "skeleton", name: t3("Knäskålen", "The kneecap", "الرضفة"),
    info: t3("Ett litet runt ben som skyddar knäleden framifrån.", "A small round bone that protects the knee joint from the front.", "عظم صغير مستدير يحمي مفصل الركبة من الأمام.")},
  {id: "underben", layer: "skeleton", name: t3("Underbenet", "The lower leg", "الساق"),
    info: t3("Två ben: skenbenet fram, som du känner under huden, och det smala vadbenet bredvid.", "Two bones: the shinbone at the front, which you can feel under the skin, and the thin fibula beside it.", "عظمان: الظنبوب في الأمام وتحسّه تحت الجلد، والشظية الرفيعة بجانبه.")},
  {id: "fot", layer: "skeleton", name: t3("Foten", "The foot", "القدم"),
    info: t3("Foten har 26 ben som formar en båge. Bågen fjädrar när du går och hoppar.", "The foot has 26 bones that make an arch. The arch springs when you walk and jump.", "في القدم 26 عظمًا تشكّل قوسًا يعمل كالنابض عندما تمشي وتقفز.")},
  {id: "halsmuskel", layer: "muscles", name: t3("Halsmusklerna", "The neck muscles", "عضلات الرقبة"),
    info: t3("De håller upp huvudet och låter dig nicka och vrida det.", "They hold up your head and let you nod and turn it.", "تحمل رأسك وتجعلك تهزّه وتديره.")},
  {id: "axelmuskel", layer: "muscles", name: t3("Axelmuskeln", "The shoulder muscle", "عضلة الكتف"),
    info: t3("En rund muskel över axeln. Den lyfter armen ut åt sidan.", "A round muscle over the shoulder. It lifts the arm out to the side.", "عضلة مستديرة فوق الكتف ترفع الذراع إلى الجانب.")},
  {id: "brostmuskel", layer: "muscles", name: t3("Bröstmuskeln", "The chest muscle", "عضلة الصدر"),
    info: t3("Drar armen framåt och in mot kroppen, som när du kramar någon.", "Pulls the arm forwards and in towards the body, like when you hug someone.", "تسحب الذراع إلى الأمام ونحو الجسم، كما حين تعانق أحدًا.")},
  {id: "biceps", layer: "muscles", name: t3("Biceps", "Biceps", "العضلة ذات الرأسين"),
    info: t3("Böjer armen. Muskler kan bara dra, så baksidan av armen har en annan muskel, triceps, som sträcker den igen.", "Bends the arm. Muscles can only pull, so the back of the arm has another muscle, the triceps, that straightens it again.", "تثني الذراع. العضلات تسحب فقط، لذلك في خلف الذراع عضلة أخرى هي ثلاثية الرؤوس تمدّها من جديد.")},
  {id: "underarmsmuskel", layer: "muscles", name: t3("Underarmsmusklerna", "The forearm muscles", "عضلات الساعد"),
    info: t3("Många smala muskler. Med långa senor drar de i fingrarna när du griper.", "Many thin muscles. With long tendons they pull the fingers when you grip.", "عضلات رفيعة كثيرة تسحب الأصابع بأوتار طويلة عندما تقبض.")},
  {id: "magmuskler", layer: "muscles", name: t3("Magmusklerna", "The tummy muscles", "عضلات البطن"),
    info: t3("Håller dig upprätt, skyddar tarmarna och hjälper till när du hostar eller skrattar.", "Keep you upright, protect the intestines and help when you cough or laugh.", "تُبقيك منتصبًا وتحمي الأمعاء وتساعدك عندما تسعل أو تضحك.")},
  {id: "larmuskel", layer: "muscles", name: t3("Lårmuskeln", "The thigh muscle", "عضلة الفخذ"),
    info: t3("En av kroppens starkaste muskler. Den sträcker knät när du sparkar, hoppar och går i trappor.", "One of the strongest muscles in the body. It straightens the knee when you kick, jump and climb stairs.", "من أقوى عضلات الجسم، تمدّ الركبة عندما تركل وتقفز وتصعد الدرج.")},
  {id: "vadmuskel", layer: "muscles", name: t3("Vadmuskeln", "The calf muscle", "عضلة الساق"),
    info: t3("Sitter fast i hälen med hälsenan. Den lyfter dig upp på tå.", "Is fixed to the heel by the Achilles tendon. It lifts you up onto your toes.", "تتّصل بالكعب بوتر أخيل، وترفعك على أطراف أصابعك.")},
];
export const bitById = (id: string) => BITS.find(b => b.id === id);

/* the four stages of the mockup */
export type StageId = "body" | "inside" | "organ" | "detail";
export const STAGES: {id: StageId; name: string}[] = [
  {id: "body", name: "Kroppen"}, {id: "inside", name: "Inuti"}, {id: "organ", name: "Organ"}, {id: "detail", name: "Detaljer"},
];

export const organById = (id: string) => ORGANS.find(o => o.id === id);

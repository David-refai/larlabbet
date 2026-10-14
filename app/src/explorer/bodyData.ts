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
export type DetailId = "heart" | "lungs" | "brain";
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
  {id: "liver", name: t3("Levern", "The liver", "الكبد"), layer: "organs", anchor: [168, 362], box: [134, 330, 104, 70],
    info: t3("Levern rensar blodet och sparar näring till senare.", "The liver cleans the blood and stores nutrients for later.", "الكبد ينظّف الدم ويخزّن الغذاء لوقت لاحق."),
    more: t3("Levern är det största organet inuti kroppen.", "The liver is the largest organ inside the body.", "الكبد أكبر عضو داخل الجسم.")},
  {id: "stomach", name: t3("Magsäcken", "The stomach", "المعدة"), layer: "organs", anchor: [240, 368], box: [200, 334, 70, 72],
    info: t3("Magsäcken blandar maten med magsaft så att den bryts ner.", "The stomach mixes food with stomach juice so it breaks down.", "المعدة تخلط الطعام بالعصارة الهاضمة فيتفتّت."),
    more: t3("Magsäcken kan töjas ut som en ballong när du äter.", "The stomach can stretch like a balloon when you eat.", "تتمدّد المعدة مثل البالون عندما تأكل.")},
  {id: "intestines", name: t3("Tarmarna", "The intestines", "الأمعاء"), layer: "organs", anchor: [200, 440], box: [140, 392, 120, 92],
    info: t3("Tarmarna tar upp näringen ur maten till blodet.", "The intestines take the nutrients from food into the blood.", "الأمعاء تمتصّ الغذاء من الطعام إلى الدم."),
    more: t3("Tunntarmen är lika lång som en buss, ungefär 6 meter.", "The small intestine is as long as a bus, about 6 metres.", "الأمعاء الدقيقة طويلة مثل الحافلة، نحو 6 أمتار.")},
  {id: "kidneys", name: t3("Njurarna", "The kidneys", "الكليتان"), layer: "organs", anchor: [254, 392], box: [136, 360, 128, 64],
    info: t3("Njurarna renar blodet och gör urin av det som ska bort.", "The kidneys clean the blood and make urine from the waste.", "الكليتان تنقّيان الدم وتصنعان البول من الفضلات."),
    more: t3("Du har två njurar. De är stora som en knytnäve.", "You have two kidneys. Each is about as big as a fist.", "لديك كليتان، كل واحدة بحجم قبضة اليد.")},
  {id: "bladder", name: t3("Urinblåsan", "The bladder", "المثانة"), layer: "organs", anchor: [200, 478], box: [170, 452, 60, 48],
    info: t3("Urinblåsan samlar urin tills du går på toaletten.", "The bladder holds urine until you go to the toilet.", "المثانة تجمع البول حتى تذهب إلى الحمّام."),
    more: t3("Urinblåsan är en liten påse av muskler som kan töjas.", "The bladder is a small bag of muscle that can stretch.", "المثانة كيس صغير من العضلات يستطيع أن يتمدّد.")},
];

export interface Tab {id: string; name: T3}
export interface Part {
  id: string;
  name: T3;
  info: T3;
  /* the tabs that show this label */
  tabs: string[];
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
      {id: "klaffar", name: t3("Klaffar", "Valves", "الصمامات"), tabs: [OV], anchor: [262, 318], label: [70, 340],
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
    flowName: t3("Luftflöde", "Air flow", "جريان الهواء"),
    legend: [{color: "#5cc6e8", name: t3("Luft: in när du andas in, ut när du andas ut", "Air: in when you breathe in, out when you breathe out", "الهواء: يدخل عند الشهيق ويخرج عند الزفير")}],
    tabs: [{id: OV, name: t3("Översikt", "Overview", "نظرة عامة")}, {id: "vagar", name: t3("Luftvägar", "Airways", "المجاري التنفسية")},
      {id: "blasor", name: t3("Lungblåsor", "Air sacs", "الحويصلات")}, {id: "luft", name: t3("Luftflöde", "Air flow", "جريان الهواء")}],
    parts: [
      {id: "luftstrupe", name: t3("Luftstrupe", "Windpipe", "القصبة الهوائية"), tabs: [OV, "vagar", "luft"], anchor: [320, 96], label: [440, 60],
        info: t3("Ett rör med ringar av brosk. Luften går här ner till lungorna.", "A tube with rings of cartilage. Air goes down here to the lungs.", "أنبوب فيه حلقات غضروفية، ينزل منه الهواء إلى الرئتين.")},
      {id: "luftror", name: t3("Luftrör", "Bronchi", "الشُّعَب الهوائية"), tabs: [OV, "vagar"], anchor: [262, 214], label: [70, 150],
        info: t3("Luftstrupen delar sig i två luftrör, ett till varje lunga.", "The windpipe splits into two bronchi, one to each lung.", "تتفرّع القصبة الهوائية إلى شعبتين، واحدة لكل رئة.")},
      {id: "smaror", name: t3("Små luftrör", "Small airways", "الشُّعَيبات"), tabs: ["vagar"], anchor: [196, 330], label: [70, 400],
        info: t3("Luftrören grenar sig som ett träd i allt mindre rör.", "The bronchi branch like a tree into smaller and smaller tubes.", "تتفرّع الشعب مثل الشجرة إلى أنابيب أصغر فأصغر.")},
      {id: "lungblasor", name: t3("Lungblåsor", "Air sacs (alveoli)", "الحويصلات الهوائية"), tabs: [OV, "blasor"], anchor: [556, 432], label: [592, 320],
        info: t3("Små blåsor längst ut. Där går syret över till blodet.", "Tiny sacs at the very end. There the oxygen passes into the blood.", "أكياس صغيرة في النهاية، ومنها ينتقل الأكسجين إلى الدم.")},
      {id: "hlunga", name: t3("Höger lunga", "Right lung", "الرئة اليمنى"), tabs: [OV], anchor: [170, 300], label: [70, 300],
        info: t3("Den högra lungan har tre delar, lober.", "The right lung has three parts, called lobes.", "الرئة اليمنى لها ثلاثة أجزاء تسمّى فصوصًا.")},
      {id: "vlunga", name: t3("Vänster lunga", "Left lung", "الرئة اليسرى"), tabs: [OV], anchor: [454, 280], label: [576, 250],
        info: t3("Den vänstra lungan är lite mindre. Den ger plats åt hjärtat.", "The left lung is a little smaller. It leaves room for the heart.", "الرئة اليسرى أصغر قليلًا لتترك مكانًا للقلب.")},
      {id: "syre", name: t3("Syre in", "Oxygen in", "الأكسجين يدخل"), tabs: ["luft", "blasor"], anchor: [492, 412], label: [440, 548],
        info: t3("Syret går från lungblåsorna in i blodet.", "Oxygen goes from the air sacs into the blood.", "ينتقل الأكسجين من الحويصلات إلى الدم.")},
      {id: "koldioxid", name: t3("Koldioxid ut", "Carbon dioxide out", "ثاني أكسيد الكربون يخرج"), tabs: ["luft", "blasor"], anchor: [620, 432], label: [604, 548],
        info: t3("Koldioxid går från blodet ut i luften som du andas ut.", "Carbon dioxide goes from the blood into the air you breathe out.", "ينتقل ثاني أكسيد الكربون من الدم إلى الهواء الذي تُخرجه.")},
    ]},
  brain: {id: "brain", title: t3("Hjärnan inuti", "Inside the brain", "داخل الدماغ"), view: [-40, 0, 720, 570], compact: [136, 70, 400, 500], flowTab: "signal",
    flowName: t3("Signaler", "Signals", "الإشارات"),
    legend: [{color: "#f2b705", name: t3("Nervsignaler: från hjärnan ut i kroppen", "Nerve signals: from the brain out to the body", "إشارات عصبية: من الدماغ إلى الجسم")}],
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
        info: t3("Hjärnan skickar signaler genom ryggmärgen ut till musklerna.", "The brain sends signals through the spinal cord out to the muscles.", "يرسل الدماغ إشارات عبر الحبل الشوكي إلى العضلات.")},
    ]},
};

/* the four stages of the mockup */
export type StageId = "body" | "inside" | "organ" | "detail";
export const STAGES: {id: StageId; name: string}[] = [
  {id: "body", name: "Kroppen"}, {id: "inside", name: "Inuti"}, {id: "organ", name: "Organ"}, {id: "detail", name: "Detaljer"},
];

export const organById = (id: string) => ORGANS.find(o => o.id === id);

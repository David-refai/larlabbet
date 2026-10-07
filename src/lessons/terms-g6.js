/* grade 6 words: the Swedish test words for the year 6 lessons (prime6 … prog6). Keys already registered in terms-0core.js or terms-g45.js are reused, not registered again. */
{const B="(?<![a-zåäö])",E="(?![a-zåäö])",RX=s=>new RegExp(B+s+E,"i");
/* instruction words and the names of the four answers */
/* prime6 */
TERM("delare",{sv:"delare",m:RX("delar(e|en|na)"),d:t3("Ett tal som delar ett annat tal jämnt, utan rest.","A number that divides another number exactly, with no remainder.","عدد يقسم عددًا آخر دون باقٍ."),ex:"Delare till 6: 1, 2, 3, 6",tr:{en:"divisor / factor",ar:"قاسم العدد"}});
TERM("delbar",{sv:"delbar / delbart",m:RX("delbar(t|a|het)?"),d:t3("Går att dela jämnt, utan rest.","Can be divided exactly, with no remainder.","يمكن قسمته دون باقٍ."),ex:"15 är delbart med 5",tr:{en:"divisible",ar:"قابل للقسمة"}});
TERM("primtal",{sv:"primtal",m:RX("primtal(et|en)?"),d:t3("Ett tal större än 1 med bara två delare: 1 och sig självt.","A number above 1 with only two divisors: 1 and itself.","عدد أكبر من 1 له قاسمان فقط: 1 والعدد نفسه."),ex:"2, 3, 5, 7, 11, 13 …",tr:{en:"prime number",ar:"عدد أولي"}});
TERM("primfaktor",{sv:"primtalsfaktorisering",m:RX("primtalsfaktor(isering|iseringen|er|erna)?"),d:t3("Att skriva ett tal som en produkt av bara primtal.","Writing a number as a product of primes only.","كتابة العدد حاصلَ ضرب أعداد أولية فقط."),ex:"60 = 2 · 2 · 3 · 5",tr:{en:"prime factorisation",ar:"التحليل إلى عوامل أولية"}});
/* order6 */
TERM("prioritering",{sv:"prioriteringsregler",m:RX("prioriteringsregl(er|erna)"),d:t3("Reglerna för i vilken ordning man räknar.","The rules for the order in which you calculate.","قواعد ترتيب إجراء العمليات الحسابية."),ex:"2 + 3 · 4 = 2 + 12 = 14",tr:{en:"order of operations",ar:"ترتيب العمليات"}});
TERM("parentes",{sv:"parentes",m:RX("parentes(en|er|erna)?"),d:t3("Tecknen ( ). Det som står inom dem räknas först.","The signs ( ). What is inside them is worked out first.","الرمزان ( ). ما بينهما يُحسب أولًا."),ex:"(2 + 3) · 4 = 20",tr:{en:"brackets",ar:"أقواس"}});
/* negcalc6 */
TERM("stiga",{sv:"stiger",m:RX("sti(ger|ga|git)"),d:t3("Blir högre. Temperaturen ökar.","Goes up. The temperature increases.","يرتفع. درجة الحرارة تزيد."),ex:"−3 °C stiger 5° → 2 °C",tr:{en:"rises",ar:"يرتفع"}});
TERM("sjunka",{sv:"sjunker",m:RX("(sjunk(er|a|it)|sjönk)"),d:t3("Blir lägre. Temperaturen minskar.","Goes down. The temperature decreases.","ينخفض. درجة الحرارة تقلّ."),ex:"4 °C sjunker 6° → −2 °C",tr:{en:"falls / drops",ar:"ينخفض"}});
/* decmd6 */
TERM("styckpris",{sv:"styckpris / styck",m:RX("styck(pris|priset)?"),d:t3("Priset för en enda sak.","The price of one single item.","ثمن قطعة واحدة."),ex:"3 st för 30 kr: 10 kr/st",tr:{en:"price per item",ar:"سعر القطعة"}});
TERM("helakronor",{sv:"hela kronor",m:RX("hela kron(or|an)"),d:t3("Avrunda till ett pris utan öre.","Round to a price with no öre.","قرّب إلى سعر بلا أوره."),ex:"26,70 kr ≈ 27 kr",tr:{en:"whole kronor",ar:"كرونات كاملة"}});
/* fracadd6, mixed6 */
TERM("gemnamnare",{sv:"gemensam nämnare",m:RX("(minsta )?gemensamma? nämnare(n)?"),d:t3("En nämnare som båda bråken kan få.","A denominator that both fractions can have.","مقام يمكن أن يأخذه الكسران كلاهما."),ex:"1/2 + 1/3 = 3/6 + 2/6",tr:{en:"common denominator",ar:"مقام مشترك"}});
TERM("brakform",{sv:"bråkform",m:RX("bråkform(en)?"),d:t3("Skrivet som ett enda bråk, även om det är större än 1.","Written as one fraction, even if it is bigger than 1.","مكتوب كسرًا واحدًا، حتى لو كان أكبر من 1."),ex:"1 1/2 i bråkform: 3/2",tr:{en:"fraction form",ar:"صورة كسر"}});
/* pct6 */
/* ratio6 */
TERM("jamforpris",{sv:"jämförpris",m:RX("jämförpris(et|er)?"),d:t3("Priset för 1 kg eller 1 liter. Bra när man jämför.","The price for 1 kg or 1 litre. Useful when you compare.","سعر 1 كغ أو 1 لتر، ويفيد عند المقارنة."),ex:"2 kg för 50 kr: 25 kr/kg",tr:{en:"unit price (per kg or litre)",ar:"سعر الوحدة"}});
TERM("proportionell",{sv:"proportionell / proportionalitet",m:RX("proportion(ell|ellt|ella|alitet|aliteten)"),d:t3("Växer i samma takt: dubbelt antal ger dubbelt pris.","Grow at the same rate: double the number, double the price.","ينموان بالمعدّل نفسه: ضعف العدد يعني ضعف الثمن."),ex:"2 st 18 kr, 4 st 36 kr",tr:{en:"proportional",ar:"متناسب"}});
/* scale6 */
TERM("skala",{sv:"skala",m:RX("skal(a|an)"),d:t3("Hur mycket mindre eller större en bild är än verkligheten.","How much smaller or bigger a picture is than reality.","كم الصورة أصغر أو أكبر من الواقع."),ex:"1:100 → 1 cm = 100 cm",tr:{en:"scale",ar:"مقياس الرسم"}});
TERM("forminskning",{sv:"förminskning",m:RX("förminsk(ning|ningen|ad|at|a)?"),d:t3("En bild som är mindre än verkligheten, t.ex. 1:100.","A picture smaller than reality, e.g. 1:100.","صورة أصغر من الواقع، مثل 1:100."),ex:"1:100 → 100 gånger mindre",tr:{en:"reduction",ar:"تصغير"}});
TERM("forstoring",{sv:"förstoring",m:RX("förstor(ing|ingen|ad|at|a)?"),d:t3("En bild som är större än verkligheten, t.ex. 5:1.","A picture bigger than reality, e.g. 5:1.","صورة أكبر من الواقع، مثل 5:1."),ex:"5:1 → 5 gånger större",tr:{en:"enlargement",ar:"تكبير"}});
TERM("verklighet",{sv:"i verkligheten",m:RX("verklig(het|heten|a|t)?"),d:t3("Hur stort något är på riktigt, inte på bilden.","How big something really is, not in the picture.","الحجم الحقيقي للشيء، لا في الصورة."),ex:"1 cm på kartan = 500 m",tr:{en:"in reality",ar:"في الواقع"}});
TERM("fagelvagen",{sv:"fågelvägen",m:RX("fågelväg(en|s)?"),d:t3("Rakaste vägen mellan två platser, som en fågel flyger.","The straightest way between two places, as a bird flies.","أقصر طريق مستقيم بين مكانين، كما يطير الطائر."),ex:"4 cm på kartan → 2 km",tr:{en:"as the crow flies",ar:"في خط مستقيم"}});
TERM("avstand",{sv:"avstånd",m:RX("avstånd(et|en)?"),d:t3("Hur långt det är mellan två platser.","How far it is between two places.","المسافة بين مكانين."),ex:"Avståndet är 2 km",tr:{en:"distance",ar:"المسافة"}});
/* tri6 */
TERM("parallellogram",{sv:"parallellogram",m:RX("parallellogram(men|met|mer)?"),d:t3("En fyrhörning med två par parallella sidor.","A four-sided shape with two pairs of parallel sides.","شكل رباعي له زوجان من الأضلاع المتوازية."),ex:"A = b · h",tr:{en:"parallelogram",ar:"متوازي الأضلاع"}});
TERM("vinkelrat",{sv:"vinkelrät",m:RX("vinkelrät(t|a)?"),d:t3("Möts i rät vinkel, 90°, som hörnet på ett papper.","Meets at a right angle, 90°, like the corner of a page.","يلتقي بزاوية قائمة 90°، مثل زاوية الورقة."),ex:"höjden ⟂ basen",tr:{en:"perpendicular",ar:"عمودي"}});
TERM("kvcm",{sv:"kvadratcentimeter (cm²)",m:new RegExp(B+"(kvadratcentimeter|cm²)","i"),d:t3("Arean av en kvadrat med sidan 1 cm.","The area of a square with sides of 1 cm.","مساحة مربع طول ضلعه 1 سم."),ex:"1 cm · 1 cm = 1 cm²",tr:{en:"square centimetre",ar:"سنتيمتر مربع"}});
/* circle6 */
TERM("radie",{sv:"radie",m:RX("radie(n|r|rna)?"),d:t3("Sträckan från medelpunkten till cirkelns kant.","The distance from the centre to the edge of the circle.","المسافة من المركز إلى حافة الدائرة."),ex:"r = d / 2",tr:{en:"radius",ar:"نصف القطر"}});
TERM("diameter",{sv:"diameter",m:RX("diamet(er|ern|rar|rarna)"),d:t3("Sträckan tvärs över cirkeln, genom medelpunkten.","The distance across the circle, through the centre.","المسافة عبر الدائرة مرورًا بالمركز."),ex:"d = 2 · r",tr:{en:"diameter",ar:"القطر"}});
TERM("medelpunkt",{sv:"medelpunkt",m:RX("medelpunkt(en|er)?"),d:t3("Punkten mitt i cirkeln.","The point in the middle of the circle.","النقطة في وسط الدائرة."),ex:"radien går från medelpunkten",tr:{en:"centre",ar:"المركز"}});
TERM("pi",{sv:"pi (π)",m:new RegExp("π|"+B+"pi"+E,"i"),d:t3("Omkretsen delat med diametern. Alltid ungefär 3,14.","The circumference divided by the diameter. Always about 3.14.","المحيط مقسومًا على القطر، ويساوي دائمًا 3,14 تقريبًا."),ex:"π ≈ 3,14",tr:{en:"pi (π)",ar:"باي (π)"}});
TERM("cirkel",{sv:"cirkel",m:RX("(cirkel|cirkeln|cirklar|cirklarna|cirkelns)"),d:t3("En rund figur. Kanten är lika långt från mitten överallt.","A round shape. The edge is equally far from the middle everywhere.","شكل مستدير، كل نقاط حافته على البُعد نفسه من المركز."),ex:"r är lika lång överallt",tr:{en:"circle",ar:"دائرة"}});
/* vol6 */
TERM("ratblock",{sv:"rätblock",m:RX("rätblock(et|en)?"),d:t3("En låda där alla sidor är rektanglar.","A box shape where every face is a rectangle.","مجسّم كالصندوق، كل أوجهه مستطيلات."),ex:"t.ex. en skokartong",tr:{en:"cuboid",ar:"متوازي المستطيلات"}});
TERM("kub",{sv:"kub",m:RX("kub(en|er|erna)?"),d:t3("Ett rätblock där alla kanter är lika långa.","A cuboid where all the edges are the same length.","متوازي مستطيلات كل أحرفه متساوية الطول."),ex:"1 cm · 1 cm · 1 cm",tr:{en:"cube",ar:"مكعب"}});
TERM("kubikcm",{sv:"kubikcentimeter (cm³)",m:new RegExp(B+"(kubikcentimeter|cm³)","i"),d:t3("Volymen av en kub med sidan 1 cm. 1 cm³ = 1 ml.","The volume of a cube with sides of 1 cm. 1 cm³ = 1 ml.","حجم مكعب طول حرفه 1 سم. 1 سم³ = 1 مل."),ex:"1 000 cm³ = 1 liter",tr:{en:"cubic centimetre",ar:"سنتيمتر مكعب"}});
TERM("kubikdm",{sv:"kubikdecimeter (dm³)",m:new RegExp(B+"(kubikdecimeter|dm³)","i"),d:t3("Volymen av en kub med sidan 1 dm. Den rymmer 1 liter.","The volume of a cube with sides of 1 dm. It holds 1 litre.","حجم مكعب طول حرفه 1 دسم، ويتّسع للتر واحد."),ex:"1 dm³ = 1 liter",tr:{en:"cubic decimetre",ar:"ديسيمتر مكعب"}});
TERM("rymma",{sv:"rymmer",m:RX("rymm(er|a|de)"),d:t3("Hur mycket som får plats inuti.","How much fits inside.","كم يتّسع داخله."),ex:"Akvariet rymmer 60 liter",tr:{en:"holds",ar:"يتّسع لـ"}});
/* eq6 */
/* pattern6 */
TERM("talfoljd",{sv:"talföljd",m:RX("talföljd(en|er|erna)?"),d:t3("Tal i en bestämd ordning som följer en regel.","Numbers in a set order that follow a rule.","أعداد بترتيب محدّد تتبع قاعدة."),ex:"2, 5, 8, 11 … (+3)",tr:{en:"sequence",ar:"متتالية"}});
TERM("regel",{sv:"regel",m:RX("reg(el|eln|ler|lerna)"),d:t3("Hur man kommer till nästa tal, eller räknar ut figur n.","How you get to the next number, or work out figure n.","كيف ننتقل إلى العدد التالي، أو نحسب الشكل n."),ex:"regel: 3 · n + 1",tr:{en:"rule",ar:"قاعدة النمط"}});
TERM("kvadrattal",{sv:"kvadrattal",m:RX("kvadrattal(et|en)?"),d:t3("Ett tal gånger sig självt.","A number times itself.","عدد مضروب في نفسه."),ex:"1, 4, 9, 16, 25 …",tr:{en:"square number",ar:"عدد مربع"}});
/* median6 */
TERM("lagesmatt",{sv:"lägesmått",m:RX("lägesmått(et|en)?"),d:t3("Ett typiskt värde för data: medelvärde, median eller typvärde.","A typical value for data: mean, median or mode.","قيمة نموذجية للبيانات: الوسط أو الوسيط أو المنوال."),ex:"median 3, medelvärde 4",tr:{en:"average (measure of centre)",ar:"مقياس النزعة المركزية"}});
TERM("extremvarde",{sv:"extremvärde",m:RX("extremvärde(t|n|na)?"),d:t3("Ett värde som är mycket större eller mindre än de andra.","A value much bigger or smaller than the others.","قيمة أكبر أو أصغر كثيرًا من باقي القيم."),ex:"3, 4, 5, 40 → 40",tr:{en:"outlier",ar:"قيمة متطرفة"}});
/* prog6 */
TERM("algoritm",{sv:"algoritm",m:RX("algoritm(en|er|erna)?"),d:t3("En instruktion i exakta steg, i rätt ordning.","An instruction in exact steps, in the right order.","تعليمات بخطوات دقيقة وبالترتيب الصحيح."),ex:"steg 1, steg 2, steg 3 …",tr:{en:"algorithm",ar:"خوارزمية"}});
TERM("loop",{sv:"loop / upprepa",m:RX("(loop(en|ar|arna)?|upprepa(r|s)?)"),d:t3("Block som körs flera gånger efter varandra.","Blocks that run several times in a row.","أوامر تُنفَّذ عدة مرات متتالية."),ex:"upprepa 4 gånger",tr:{en:"loop",ar:"حلقة تكرار"}});
TERM("bugg",{sv:"bugg",m:RX("bugg(en|ar|arna)?"),d:t3("Ett fel i ett program.","A mistake in a program.","خطأ في البرنامج."),ex:"upprepa 3 → ska vara 4",tr:{en:"bug",ar:"علّة برمجية"}});
TERM("program",{sv:"program",m:RX("program(met|men)?"),d:t3("Instruktioner som en dator kan följa.","Instructions that a computer can follow.","تعليمات يستطيع الحاسوب تنفيذها."),ex:"sätt, ändra, säg …",tr:{en:"program",ar:"برنامج"}});
}
WORDS.prime6=["delare","delbar","primtal","faktor","primfaktor","produkt","rest"];
WORDS.order6=["prioritering","parentes","uttryck","berakna","summa","differens","produkt","kvot"];
WORDS.negcalc6=["negativ","positiv","tallinje","stiga","sjunka","summa","differens","berakna"];
WORDS.decmd6=["decimal","tiondel","hundradel","overslag","produkt","kvot","styckpris","helakronor"];
WORDS.fracadd6=["taljare","namnare","gemnamnare","forlanga","forkorta","enklasteform","summa","differens"];
WORDS.mixed6=["blandadform","brakform","brak","taljare","namnare","heltal","produkt"];
WORDS.pct6=["procent","andel","hundradel","tiondel","decimal","brak","jamfor"];
WORDS.ratio6=["styckpris","jamforpris","proportionell","sammanlagt","berakna","jamfor"];
WORDS.scale6=["skala","forminskning","forstoring","verklighet","fagelvagen","avstand","bestam"];
WORDS.tri6=["area","bas","hojd","parallellogram","triangel","vinkelrat","kvcm","berakna"];
WORDS.circle6=["cirkel","radie","diameter","omkrets","medelpunkt","pi","avrunda","decimal"];
WORDS.vol6=["volym","ratblock","kub","kubikcm","kubikdm","rymma","berakna"];
WORDS.eq6=["ekvation","losa","obekant","kontrollera","likhetstecken","uttryck","bestam"];
WORDS.pattern6=["monster","talfoljd","regel","okar","kvadrattal","uttryck"];
WORDS.median6=["medelvarde","median","typvarde","lagesmatt","extremvarde","storleksordning","summa"];
WORDS.prog6=["algoritm","variabel","loop","bugg","program"];

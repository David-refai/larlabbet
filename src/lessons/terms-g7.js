/* grade 7 words: the Swedish test words for the year 7 lessons (int7 … prog7) */
{const B="(?<![a-zåäö])",E="(?![a-zåäö])",W=(s)=>new RegExp(B+s+E,"i");
/* numbers, powers, rounding */
TERM("potens",{sv:"potens",m:W("potens(en|er|erna)?"),d:t3("Samma tal gånger sig självt flera gånger, t.ex. 2³.","The same number multiplied by itself several times, e.g. 2³.","عدد مضروب في نفسه عدة مرات، مثل 2³."),ex:"2³ = 2 · 2 · 2 = 8",tr:{en:"power",ar:"قوة"}});
TERM("exponent",{sv:"exponent",m:W("exponent(en|er|erna)?"),d:t3("Det lilla upphöjda talet. Det visar antalet faktorer.","The small raised number. It shows how many factors there are.","العدد الصغير المرفوع، ويبيّن عدد العوامل."),ex:"2⁵: exponenten är 5",tr:{en:"exponent",ar:"الأس"}});
TERM("upphojt",{sv:"upphöjt till",m:W("upphöj(t|d|da|er|a)( till)?"),d:t3("Så läser man en potens: 2⁵ är två upphöjt till fem.","How you read a power: 2⁵ is two to the power of five.","هكذا نقرأ القوة: 2⁵ تُقرأ اثنان أُس خمسة."),ex:"3² = 3 upphöjt till 2",tr:{en:"to the power of",ar:"مرفوع إلى الأس"}});
TERM("tiopotens",{sv:"tiopotens",m:W("tiopotens(en|er|erna)?"),d:t3("Talet 10 upphöjt till något, t.ex. 10³ = 1 000.","10 to some power, e.g. 10³ = 1,000.","العدد 10 مرفوعًا إلى أُس، مثل 10³ = 1000."),ex:"10⁶ = 1 000 000",tr:{en:"power of ten",ar:"قوة العشرة"}});
TERM("grundpotensform",{sv:"grundpotensform",m:W("grundpotensform(en)?"),d:t3("Ett tal från 1 till under 10, gånger en tiopotens.","A number from 1 up to under 10, times a power of ten.","عدد من 1 إلى أقل من 10، مضروب في قوة للعشرة."),ex:"4 500 = 4,5 · 10³",tr:{en:"scientific notation",ar:"الصيغة العلمية"}});
TERM("miljard",{sv:"miljard",m:W("miljard(er|en|erna)?"),d:t3("Tusen miljoner: 1 000 000 000 = 10⁹.","A thousand millions: 1,000,000,000 = 10⁹.","ألف مليون: 1000000000 = 10⁹."),ex:"8 miljarder = 8 · 10⁹",tr:{en:"billion",ar:"مليار"}});
/* fractions and percent */
TERM("invertera",{sv:"inverterat tal",m:W("inverter(a|ar|at|ad|ade|ingen)?"),d:t3("Bråket vänt upp och ner. Gånger varandra blir de 1.","The fraction turned upside down. Multiplied together they make 1.","الكسر مقلوبًا. حاصل ضربهما يساوي 1."),ex:"2/3 → 3/2",tr:{en:"reciprocal",ar:"المقلوب"}});
TERM("ordinarie",{sv:"ordinarie pris",m:W("ordinari(e|t) pris(et)?"),d:t3("Det vanliga priset, före rean.","The normal price, before the sale.","السعر العادي قبل التخفيضات."),ex:"400 kr, på rea 300 kr",tr:{en:"original price",ar:"السعر الأصلي"}});
TERM("decimalform",{sv:"decimalform",m:W("decimalform(en)?"),d:t3("Talet skrivet med decimaltecken, utan % eller bråk.","The number written with a decimal point, without % or a fraction.","العدد مكتوبًا بفاصلة عشرية، دون % أو كسر."),ex:"35 % = 0,35",tr:{en:"decimal form",ar:"الصيغة العشرية"}});
/* algebra and equations */
TERM("term",{sv:"term",m:W("term(en|er|erna)?"),d:t3("En del av ett uttryck, mellan plus- och minustecknen.","A part of an expression, between the plus and minus signs.","جزء من المقدار بين إشارات الجمع والطرح."),ex:"3x + 5: termerna 3x och 5",tr:{en:"term",ar:"حدّ"}});
TERM("forenkla",{sv:"förenkla",m:W("förenkla(r|s|t|d|de)?"),d:t3("Skriv kortare genom att slå ihop termer av samma sort.","Write it shorter by putting like terms together.","اكتبه بشكل أقصر بجمع الحدود المتشابهة."),ex:"2x + 3x = 5x",tr:{en:"simplify",ar:"بسّط"}});
TERM("teckna",{sv:"teckna",m:W("teckna(r|s|t|d|de)?"),d:t3("Skriv ett uttryck eller en ekvation som visar situationen.","Write an expression or equation that shows the situation.","اكتب مقدارًا أو معادلة تعبّر عن الموقف."),ex:"x biljetter à 95 kr: 95x",tr:{en:"write (as an expression)",ar:"عبّر بمقدار"}});
TERM("losning",{sv:"lösning / lös ekvationen",m:W("(lösning(en|ar|arna)?|lös(a)? ekvationen)"),d:t3("Det värde på x som gör att ekvationen stämmer.","The value of x that makes the equation true.","قيمة x التي تجعل المعادلة صحيحة."),ex:"2x = 8 har lösningen x = 4",tr:{en:"solution / solve",ar:"الحل / حُلّ"}});
TERM("led",{sv:"vänsterled / högerled",m:W("(vänster|höger)led(et)?"),d:t3("Det som står till vänster eller höger om likhetstecknet.","What is on the left or right of the equals sign.","ما يكون على يسار إشارة يساوي أو يمينها."),ex:"3x = 12: VL 3x, HL 12",tr:{en:"left side / right side",ar:"الطرف الأيسر / الأيمن"}});
/* geometry */
TERM("sidovinkel",{sv:"sidovinklar",m:W("sidovink(el|eln|lar|larna)"),d:t3("Två vinklar bredvid varandra på en linje. Summan är 180°.","Two angles next to each other on a line. They add up to 180°.","زاويتان متجاورتان على مستقيم، مجموعهما 180°."),ex:"50° + 130° = 180°",tr:{en:"adjacent angles",ar:"زاويتان متجاورتان"}});
TERM("vertikalvinkel",{sv:"vertikalvinklar",m:W("vertikalvink(el|eln|lar|larna)"),d:t3("Vinklar mitt emot varandra i ett kryss. De är lika stora.","Angles opposite each other where two lines cross. They are equal.","زاويتان متقابلتان عند تقاطع مستقيمين، وهما متساويتان."),ex:"50° och 50°",tr:{en:"vertical angles",ar:"زاويتان متقابلتان بالرأس"}});
TERM("likbelagen",{sv:"likbelägna vinklar",m:W("likbelägn(a|e)( vink(el|eln|lar|larna))?"),d:t3("Vinklar på samma plats vid två parallella linjer. Lika stora.","Angles in the same position at two parallel lines. Equal.","زاويتان في الموقع نفسه عند مستقيمين متوازيين، وهما متساويتان."),ex:"F-form: lika stora",tr:{en:"corresponding angles",ar:"زاويتان متناظرتان"}});
TERM("alternatvinkel",{sv:"alternatvinklar",m:W("alternatvink(el|eln|lar|larna)"),d:t3("Vinklar på var sin sida om linjen, i en Z-form. Lika stora.","Angles on either side of the line, in a Z shape. Equal.","زاويتان على جانبي القاطع بشكل Z، وهما متساويتان."),ex:"Z-form: lika stora",tr:{en:"alternate angles",ar:"زاويتان متبادلتان"}});
TERM("parallell",{sv:"parallella linjer",m:W("parallell(a|t)?"),d:t3("Linjer som aldrig möts, som skenorna på ett tågspår.","Lines that never meet, like the rails of a railway track.","مستقيمات لا تلتقي أبدًا، مثل قضبان السكة."),ex:"Tågräls är parallella",tr:{en:"parallel",ar:"متوازيان"}});
TERM("likbent",{sv:"likbent triangel",m:W("likbent(a)?"),d:t3("En triangel med två lika långa sidor och två lika stora vinklar.","A triangle with two equal sides and two equal angles.","مثلث فيه ضلعان متساويان وزاويتان متساويتان."),ex:"basvinklarna är lika",tr:{en:"isosceles",ar:"متساوي الساقين"}});
TERM("halvcirkel",{sv:"halvcirkel",m:W("halvcirk(el|eln|lar|larna)"),d:t3("En halv cirkel, delad längs diametern.","Half a circle, cut along the diameter.","نصف دائرة مقطوعة على طول القطر."),ex:"A = π · r² / 2",tr:{en:"semicircle",ar:"نصف دائرة"}});
TERM("areaenhet",{sv:"areaenhet (m², dm², cm²)",m:W("(areaenhet(en|er|erna)?|[kdcm]?m²)"),d:t3("Enhet för yta. Varje steg i trappan är 100 gånger.","A unit for area. Each step on the staircase is 100 times.","وحدة لقياس المساحة، وكل درجة تساوي 100 مرة."),ex:"1 dm² = 100 cm²",tr:{en:"unit of area",ar:"وحدة المساحة"}});
TERM("volymenhet",{sv:"volymenhet (m³, dm³, cm³)",m:W("(volymenhet(en|er|erna)?|[dcm]?m³)"),d:t3("Enhet för volym. Varje steg i trappan är 1 000 gånger.","A unit for volume. Each step on the staircase is 1,000 times.","وحدة لقياس الحجم، وكل درجة تساوي 1000 مرة."),ex:"1 dm³ = 1 000 cm³",tr:{en:"unit of volume",ar:"وحدة الحجم"}});
/* relationships, statistics, probability */
TERM("konstant",{sv:"proportionalitetskonstant (k)",m:W("(proportionalitets)?konstant(en)?"),d:t3("Talet k i y = k · x. Det är y delat med x.","The number k in y = k × x. It is y divided by x.","العدد k في y = k × x، ويساوي y مقسومًا على x."),ex:"y = 120x: k = 120",tr:{en:"constant of proportionality",ar:"ثابت التناسب"}});
TERM("linjediagram",{sv:"linjediagram",m:W("linjediagram(met|men)?"),d:t3("Diagram med en linje. Visar förändring över tid.","A chart with a line. Shows change over time.","مخطط بخط، يبيّن التغيّر مع الزمن."),ex:"temperatur kl 8–20",tr:{en:"line chart",ar:"مخطط خطي"}});
TERM("cirkeldiagram",{sv:"cirkeldiagram",m:W("cirkeldiagram(met|men)?"),d:t3("En cirkel delad i sektorer. Visar delar av en helhet.","A circle split into sectors. Shows parts of a whole.","دائرة مقسّمة إلى قطاعات، تبيّن أجزاء الكل."),ex:"hela cirkeln = 100 % = 360°",tr:{en:"pie chart",ar:"مخطط دائري"}});
TERM("axel",{sv:"axel (x-axel, y-axel)",m:W("([xy]-)?ax(el|eln|lar|larna)"),d:t3("Tallinjen längs diagrammets kant, med en skala.","The number line along the edge of a chart, with a scale.","خط الأعداد على حافة المخطط، وعليه تدريج."),ex:"y-axeln börjar på 0",tr:{en:"axis",ar:"محور"}});
TERM("minst",{sv:"minst",m:W("minst"),d:t3("Det talet eller mer. Minst 10 = 10, 11, 12 …","That number or more. At least 10 = 10, 11, 12 …","هذا العدد أو أكثر. 10 على الأقل = 10، 11، 12 …"),ex:"minst 5: 5 eller 6",tr:{en:"at least",ar:"على الأقل"}});
TERM("hogst",{sv:"högst",m:W("högst"),d:t3("Det talet eller mindre. Högst 4 = 4, 3, 2 …","That number or less. At most 4 = 4, 3, 2 …","هذا العدد أو أقل. 4 على الأكثر = 4، 3، 2 …"),ex:"högst 2: 1 eller 2",tr:{en:"at most",ar:"على الأكثر"}});
/* programming */
TERM("villkor",{sv:"villkor",m:W("villkor(et|en)?"),d:t3("Något som är sant eller falskt och styr vad som körs.","Something true or false that decides what runs.","عبارة صحيحة أو خاطئة تحدّد ما يُنفَّذ."),ex:"if poang > 50:",tr:{en:"condition",ar:"شرط"}});
TERM("santfalskt",{sv:"sant / falskt",m:W("(sant|falskt)"),d:t3("Svaret på ett villkor: stämmer det (sant) eller inte (falskt)?","The answer to a condition: is it right (true) or not (false)?","جواب الشرط: هل يتحقّق (صحيح) أم لا (خطأ)؟"),ex:"5 > 3 är sant",tr:{en:"true / false",ar:"صحيح / خطأ"}});
TERM("utskrift",{sv:"skriva ut / utskrift",m:W("(utskrift(en)?|skriv(er|s|a)? ut)"),d:t3("Det som programmet visar på skärmen med print.","What the program shows on the screen with print.","ما يعرضه البرنامج على الشاشة بالأمر print."),ex:"print(5) skriver ut 5",tr:{en:"output, print",ar:"المُخرَج، يطبع"}});
}
WORDS.int7=["negativ","produkt","kvot","faktor","berakna"];
WORDS.pow7=["potens","exponent","upphojt","kvadrattal","tiopotens","berakna"];
WORDS.sci7=["grundpotensform","tiopotens","exponent","miljon","miljard","decimal"];
WORDS.round7=["avrunda","tiondel","hundradel","decimal","heltal","tiotal","hundratal","vardesiffra","overslag","helakronor"];
WORDS.frac7=["taljare","namnare","brak","forkorta","invertera","produkt","kvot"];
WORDS.pct7=["procent","andel","rabatt","ordinarie","decimalform"];
WORDS.alg7=["uttryck","term","variabel","forenkla","teckna","berakna"];
WORDS.eq7=["ekvation","losning","obekant","led","teckna"];
WORDS.ang7=["sidovinkel","vertikalvinkel","likbelagen","alternatvinkel","parallell","vinkelsumma","likbent"];
WORDS.circ7=["omkrets","diameter","radie","area","pi","halvcirkel"];
WORDS.units7=["area","volym","rymma","areaenhet","volymenhet","liter","omvandla"];
WORDS.comp7=["sammansatt","rektangel","omkrets","area","halvcirkel"];
WORDS.prop7=["proportionell","konstant","origo","koordinatsystem","jamforpris"];
WORDS.stat7=["stapeldiagram","linjediagram","cirkeldiagram","axel","andel","procent"];
WORDS.prob7=["sannolikhet","utfall","gynnsam","minst","hogst","summa"];
WORDS.prog7=["variabel","villkor","loop","santfalskt","utskrift"];

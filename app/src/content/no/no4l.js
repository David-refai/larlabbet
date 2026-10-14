import {BRN,art,bankGen,blist,dotsP,note,plant,ringArrows,ringFlow,ringPts,soil,tfx,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,t3,wbMount} from "../../legacy/core.js";
/* ===== no4l.js: Biologi, Year 4, Djur, växter och ekosystem 5 and 6 =====
   5. bio4l: life cycles - the frog, the butterfly and the seed
   6. bio4m: nature's cycle and people - decomposers, compost, plastic, felling, allemansrätten */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
TERM("no_livscykel",{sv:"livscykel",m:W("livscykel(n)?|livscykl(er|erna)"),d:t3("Alla stadier i ett liv, från ägg eller frö till vuxen som får nya ungar.","All the stages of a life, from egg or seed to an adult that has young.","كل مراحل الحياة من البيضة أو البذرة حتى البالغ الذي يُنجب صغارًا."),ex:"Grodans livscykel",tr:{en:"life cycle",ar:"دورة الحياة"}});
TERM("no_rom",{sv:"rom",m:W("rom(men)?"),d:t3("Ägg från grodor eller fiskar, i en geléklump i vattnet.","Eggs from frogs or fish, in a lump of jelly in the water.","بيض الضفادع أو الأسماك داخل كتلة هلامية في الماء."),ex:"Grodan lägger rom på våren.",tr:{en:"spawn",ar:"بيض الضفادع أو السمك"}});
TERM("no_grodyngel",{sv:"grodyngel",m:W("grodyng(el|let|len)"),d:t3("En ung groda som lever i vatten, har svans och andas med gälar.","A young frog that lives in water, has a tail and breathes with gills.","ضفدع صغير يعيش في الماء، له ذيل ويتنفّس بالخياشيم."),ex:"Grodynglet simmar med svansen.",tr:{en:"tadpole",ar:"شرغوف"}});
TERM("no_larv",{sv:"larv",m:W("larv(en|er|erna)?"),d:t3("Det som kryper ur fjärilens ägg. Den äter och växer.","What crawls out of a butterfly's egg. It eats and grows.","ما يخرج من بيضة الفراشة، يأكل وينمو."),ex:"Larven äter nässlor.",tr:{en:"caterpillar / larva",ar:"يرقة"}});
TERM("no_puppa",{sv:"puppa",m:W("pupp(a|an|or|orna)"),d:t3("Ett skal där larven ligger stilla medan kroppen byggs om till en fjäril.","A case where the caterpillar lies still while its body is rebuilt into a butterfly.","غلاف تسكن فيه اليرقة بينما يتحوّل جسمها إلى فراشة."),ex:"Ur puppan kryper en fjäril.",tr:{en:"pupa",ar:"عذراء"}});
TERM("no_forvandling",{sv:"förvandling",m:W("förvandl(ing|ingen|as|ades)"),d:t3("När ett djur ändrar hela sin kropp under livet, som grodan och fjärilen.","When an animal changes its whole body during its life, like the frog and the butterfly.","عندما يغيّر الحيوان جسمه كله خلال حياته، مثل الضفدع والفراشة."),ex:"Grodynglet förvandlas till en groda.",tr:{en:"metamorphosis",ar:"التحوّل"}});
TERM("no_nedbrytare",{sv:"nedbrytare",m:W("nedbrytar(e|en|na)"),d:t3("Organismer som äter döda växter och djur och gör om dem till jord, till exempel maskar, svampar och bakterier.","Living things that eat dead plants and animals and turn them into soil, for example worms, fungi and bacteria.","كائنات تأكل النباتات والحيوانات الميتة وتحوّلها إلى تربة، مثل الديدان والفطريات والبكتيريا."),ex:"Daggmasken är en nedbrytare.",tr:{en:"decomposer",ar:"محلِّل"}});
TERM("no_kretslopp_natur",{sv:"naturens kretslopp",m:W("kretslopp(et)?"),d:t3("Att ämnen i naturen används om och om igen: växt, djur, nedbrytare, jord och ny växt.","That materials in nature are used again and again: plant, animal, decomposer, soil and a new plant.","أن المواد في الطبيعة تُستخدم مرة بعد مرة: نبات، حيوان، محلِّل، تربة، ثم نبات جديد."),ex:"I kretsloppet går inget förlorat.",tr:{en:"cycle of nature",ar:"دورة الطبيعة"}});
TERM("no_kompost",{sv:"kompost",m:W("kompost(en|era|erar)?"),d:t3("En hög eller låda där matrester och löv bryts ner till ny jord.","A heap or box where food scraps and leaves break down into new soil.","كومة أو صندوق تتحلّل فيه بقايا الطعام والأوراق إلى تربة جديدة."),ex:"Skalen hamnar i komposten.",tr:{en:"compost",ar:"سماد عضوي"}});
TERM("no_mikroplast",{sv:"mikroplast",m:W("mikroplast(en)?"),d:t3("Mycket små bitar av plast som inte bryts ner och hamnar i vatten och djur.","Very small pieces of plastic that do not break down and end up in water and animals.","قطع صغيرة جدًا من البلاستيك لا تتحلّل وتصل إلى الماء والحيوانات."),ex:"Fiskar kan äta mikroplast.",tr:{en:"microplastic",ar:"جسيمات بلاستيكية دقيقة"}});
TERM("no_skovling",{sv:"skövling",m:W("skövl(ing|ingen|a|as|ad)"),d:t3("När man hugger ner eller förstör ett stort naturområde så att djur och växter förlorar sitt hem.","When a large area of nature is cut down or destroyed so animals and plants lose their home.","قطع أو تدمير منطقة طبيعية كبيرة فتفقد الحيوانات والنباتات موطنها."),ex:"Skövling av skog hotar många arter.",tr:{en:"deforestation, destruction",ar:"إزالة الغابات"}});
TERM("no_allemansratten",{sv:"allemansrätten",m:W("allemansrätt(en)?"),d:t3("Rätten för alla att vara i naturen i Sverige. Regeln är: inte störa, inte förstöra.","Everyone's right to be in nature in Sweden. The rule is: do not disturb, do not destroy.","حق الجميع في التواجد في الطبيعة في السويد، والقاعدة: لا تُزعج ولا تُخرّب."),ex:"Allemansrätten gäller alla.",tr:{en:"right of public access",ar:"حق الوصول العام"}});
TERM("no_atervinning",{sv:"återvinning",m:W("återvinn(ing|ingen|a|s)"),d:t3("När skräp sorteras och görs om till nya saker.","When waste is sorted and made into new things.","فرز النفايات وتحويلها إلى أشياء جديدة."),ex:"Burkar går till återvinning.",tr:{en:"recycling",ar:"إعادة التدوير"}});

/* ---------------------------------------------------------------
   5. bio4l: life cycles
   --------------------------------------------------------------- */
/* four pictures round a ring with arrows; the dots go round on a smaller ring inside */
const cycle4=(cx,cy,rx,ry,pics,c="k",fc="o")=>[...pics.flatMap((f,i)=>{const [x,y]=ringPts(cx,cy,rx,ry,4)[i];return f(x,y)}),...ringArrows(cx,cy,rx,ry,4,c,30),ringFlow(cx,cy,rx*.42,ry*.42,fc,8,7)];
const water=(x,y,w,h)=>[A.band(x,y,w,h,"b"),A.p(`M${x} ${y+14} Q${x+w*.25} ${y+2} ${x+w*.5} ${y+14} Q${x+w*.75} ${y+26} ${x+w} ${y+14}`,"b",3)];
const NETTLE=(x,y,s)=>[...art("leaf",x,y,s)];
const STAGE={rom:()=>[...water(40,140,330,260),...art("spawn",200,270,2.4)],grodyngel:()=>[...water(40,140,330,260),...art("tadpole",210,270,2.6)],
 larv:()=>[...art("leaf",200,300,2.4),...art("larva",200,284,1.8)],puppa:()=>art("pupa",210,250,2.2),
 fjaril:()=>art("butterfly",200,270,2.3),groda:()=>[...soil(60,340,340),...art("frog",200,340,1.9)]};
const NAT5={steps:[
 {say:t3("Alla djur och växter har en livscykel. De föds, växer upp, förökar sig och dör till slut. Men innan de dör har de fått ungar eller frön, så livet fortsätter runt, runt som i en ring.",
   "All animals and plants have a life cycle. They are born, grow up, reproduce and finally die. But before they die they have had young or seeds, so life goes on round and round like a ring.",
   "لكل الحيوانات والنباتات دورة حياة: تولد وتكبر وتتكاثر ثم تموت في النهاية. لكنها قبل أن تموت تكون قد أنجبت صغارًا أو بذورًا، فتستمر الحياة وتدور كالحلقة."),
  draw:()=>[A.wipe(),ttl("Livscykel"),A.tx("föds",400,150,34,"b"),A.tx("växer upp",620,292,34,"g"),A.tx("förökar sig",400,440,34,"p"),A.tx("blir gammal",180,280,34,"k"),A.tx("och dör",180,316,34,"k"),
   ...ringArrows(400,285,220,150,4,"k",34),ringFlow(400,285,95,62,"o",8,7)]},
 {say:t3("På våren lägger grodan sin rom i vattnet. Rom är många små ägg i en geléklump. Ur äggen kläcks grodyngel. De lever i vattnet som små fiskar, andas med gälar och simmar med svansen.",
   "In spring the frog lays its spawn in the water. Spawn is lots of tiny eggs in a lump of jelly. Tadpoles hatch from the eggs. They live in the water like little fish, breathe with gills and swim with their tails.",
   "في الربيع تضع الضفدعة بيضها في الماء، وهو بيض صغير كثير داخل كتلة هلامية. ومن البيض تفقس الشراغيف التي تعيش في الماء مثل أسماك صغيرة، تتنفّس بالخياشيم وتسبح بذيلها."),
  draw:()=>[A.wipe(),ttl("Grodan: rom och grodyngel"),...water(30,110,740,300),...art("spawn",200,260,2.3),A.arrow(330,260,410,260,"k",-14),
   ...art("tadpole",560,230,2.2),...art("tadpole",640,330,1.2),...art("tadpole",500,350,1),A.flow("M720 360 Q650 300 560 250","#3fa7c9",4,3,4),
   A.tx("rom",200,450,34,"b"),A.tx("grodyngel",580,450,34,"k")]},
 {say:t3("Efter några veckor växer bakbenen fram, och sedan frambenen. Svansen krymper och gälarna försvinner, och grodan får lungor. Till slut kliver en liten groda upp på land. Den förändringen kallas en förvandling.",
   "After a few weeks the back legs grow, then the front legs. The tail shrinks, the gills disappear and the frog gets lungs. Finally a little frog climbs onto land. This change is called metamorphosis.",
   "بعد بضعة أسابيع تنمو الأرجل الخلفية ثم الأمامية، ويتقلّص الذيل وتختفي الخياشيم ويصبح للضفدع رئتان. وفي النهاية يخرج ضفدع صغير إلى اليابسة. هذا التغيّر يسمّى التحوّل."),
  draw:()=>[A.wipe(),ttl("Från grodyngel till groda"),...art("tadpole",150,260,1.9),A.arrow(250,260,310,260,"k",-12),...art("tadlegs",420,260,2),A.arrow(510,260,570,260,"k",-12),...soil(580,760,300),...art("frog",675,300,1.25),
   A.tx("grodyngel",150,360,32,"k"),A.tx("ben växer fram",420,360,32,"g"),A.tx("groda",675,360,32,"g"),note("svansen krymper, lungor i stället för gälar",440,"b",28)]},
 {say:t3("Här är grodans hela livscykel: rom, grodyngel, grodyngel med ben och groda. När grodan är vuxen lägger den ny rom, och så börjar cykeln om.",
   "Here is the frog's whole life cycle: spawn, tadpole, tadpole with legs and frog. When the frog is grown up it lays new spawn, and the cycle starts again.",
   "هذه دورة حياة الضفدع كاملة: البيض، ثم الشرغوف، ثم الشرغوف ذو الأرجل، ثم الضفدع. وعندما يكبر الضفدع يضع بيضًا جديدًا فتبدأ الدورة من جديد."),
  draw:()=>[A.wipe(),ttl("Grodans livscykel"),...cycle4(400,285,230,155,[(x,y)=>[...art("spawn",x,y,.95),A.tx("rom",x+80,y+12,30,"b","start")],(x,y)=>[...art("tadpole",x+10,y-10,1.3),A.tx("grodyngel",x+4,y+40,30)],
   (x,y)=>[...art("tadlegs",x,y-8,1.3),A.tx("med ben",x+62,y+6,30,"g","start")],(x,y)=>[...art("frog",x,y+16,1),A.tx("groda",x,y+56,30,"g")]],"k","g")]},
 {say:t3("Fjärilen har också en förvandling. Nässelfjärilen lägger sina ägg på en brännässla. Ur äggen kryper små larver. Larven äter och äter, och den växer så mycket att den byter skinn flera gånger.",
   "The butterfly also goes through metamorphosis. The small tortoiseshell lays its eggs on a stinging nettle. Small caterpillars crawl out of the eggs. The caterpillar eats and eats, and grows so much that it sheds its skin several times.",
   "الفراشة أيضًا تمرّ بتحوّل. تضع فراشة القرّاص بيضها على نبتة القرّاص، فتخرج منه يرقات صغيرة. اليرقة تأكل وتأكل، وتكبر كثيرًا حتى تغيّر جلدها عدة مرات."),
  draw:()=>[A.wipe(),ttl("Fjärilen: ägg och larv"),...NETTLE(220,280,2.4),...art("eggs",220,270,2),A.arrow(370,270,440,270,"k",-14),...NETTLE(600,290,2.6),...art("larva",600,276,1.9),
   A.p("M700 250 q8 6 0 12 q8 6 0 12","g",3),A.tx("ägg",220,400,34,"b"),A.tx("larv",600,400,34,"g"),A.tx("äter och växer",600,440,28,"g")]},
 {say:t3("När larven är stor blir den en puppa. Inuti puppan byggs hela kroppen om. Efter några veckor kryper en fjäril ut. Fjärilen lägger nya ägg, och cykeln börjar om: ägg, larv, puppa, fjäril.",
   "When the caterpillar is big it becomes a pupa. Inside the pupa the whole body is rebuilt. After a few weeks a butterfly crawls out. The butterfly lays new eggs, and the cycle starts again: egg, caterpillar, pupa, butterfly.",
   "عندما تكبر اليرقة تصبح عذراء، وداخل العذراء يُعاد بناء الجسم كله. بعد بضعة أسابيع تخرج فراشة، فتضع بيضًا جديدًا وتبدأ الدورة من جديد: بيضة، يرقة، عذراء، فراشة."),
  draw:()=>[A.wipe(),ttl("Fjärilens livscykel"),...cycle4(400,285,230,155,[(x,y)=>[...art("eggs",x,y+10,1.6),A.tx("ägg",x+50,y+10,30,"b","start")],(x,y)=>[...art("larva",x,y+6,1.15),A.tx("larv",x,y+46,30,"g")],
   (x,y)=>[...art("pupa",x,y+10,1),A.tx("puppa",x+46,y+10,30,BRN,"start")],(x,y)=>[...art("butterfly",x,y-8,1),A.tx("fjäril",x,y+72,30,"o")]],"k","o")]},
 {say:t3("Växter har också en livscykel. Fröet gror och blir en liten grodd. Grodden växer till en planta, och plantan får blommor. I blomman bildas nya frön, och så börjar det om.",
   "Plants have a life cycle too. The seed sprouts and becomes a small seedling. The seedling grows into a plant, and the plant gets flowers. New seeds form in the flower, and it starts again.",
   "للنباتات أيضًا دورة حياة: البذرة تنبت وتصبح نبتة صغيرة، ثم تكبر النبتة وتصير نباتًا يحمل أزهارًا، وفي الزهرة تتكوّن بذور جديدة فتبدأ الدورة من جديد."),
  draw:()=>[A.wipe(),ttl("Fröets livscykel"),...cycle4(400,290,235,150,[(x,y)=>[...art("seed",x,y,1.7),A.tx("frö",x+40,y+10,30,BRN,"start")],(x,y)=>[...art("sprout",x,y+20,1.5),A.tx("grodd",x,y+60,30,"g")],
   (x,y)=>[...plant(x-30,y+40,.62,"p","stem leaves"),A.tx("planta",x+40,y+14,30,"g","start")],(x,y)=>[...plant(x,y+56,.7,"p","stem leaves flower"),A.tx("blomma",x,y+90,30,"p")]],"k","g")]},
 {say:t3("Kom ihåg: grodan och fjärilen ändrar hela sin kropp under livet. Det kallas förvandling. Människor och de flesta djur ser ungefär likadana ut hela livet, de blir bara större.",
   "Remember: the frog and the butterfly change their whole body during their life. That is called metamorphosis. People and most animals look about the same their whole life, they just get bigger.",
   "تذكّر: الضفدع والفراشة يغيّران جسمهما كله خلال حياتهما، وهذا يسمّى التحوّل. أما الناس ومعظم الحيوانات فيبقى شكلها تقريبًا كما هو طوال حياتها، وتكبر فقط."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["grodan: rom → grodyngel → groda","g"],["fjärilen: ägg → larv → puppa → fjäril","o"],["växten: frö → grodd → planta → blomma","p"]],70,160,66,32),
   A.tx("Förvandling = hela kroppen ändras",400,400,32,"b"),A.tx("Räven och du: samma form, bara större",400,450,28,"k")]},
]};
const BANK5=[
 {lv:0,q:"Vad kallas grodans ägg?",a:"rom",w:["frön","puppor","larver"]},
 {lv:0,q:"Var lever grodyngel?",a:"i vatten",w:["i träd","i jorden","i luften"]},
 {lv:0,q:"Vad kryper ut ur fjärilens ägg?",a:"en larv",w:["ett grodyngel","en puppa","en fjäril"]},
 {lv:0,q:"Vad heter stadiet på bilden?",a:"grodyngel",w:["rom","puppa","larv"],lines:["Vad heter","stadiet på bilden?"],pic:STAGE.grodyngel},
 {lv:1,q:"Vad heter stadiet på bilden?",a:"rom",w:["grodyngel","puppa","frö"],lines:["Vad heter","stadiet på bilden?"],pic:STAGE.rom},
 {lv:1,q:"Vad heter stadiet på bilden?",a:"larv",w:["puppa","grodyngel","rom"],lines:["Vad heter","stadiet på bilden?"],pic:STAGE.larv},
 {lv:1,q:"Vad heter stadiet på bilden?",a:"puppa",w:["larv","rom","frö"],lines:["Vad heter","stadiet på bilden?"],pic:STAGE.puppa},
 {lv:1,q:"Hur andas grodynglet?",a:"med gälar",w:["med lungor","med bladen","genom svansen"]},
 {lv:1,q:"Vad gör larven mest?",a:"äter och växer",w:["sover hela tiden","flyger","lägger ägg"]},
 {lv:1,q:"Vad händer inuti puppan?",a:"kroppen byggs om till en fjäril",w:["larven äter löv","det bildas rom","ingenting"]},
 {lv:2,q:"Vilken ordning är rätt för fjärilen?",a:"ägg, larv, puppa, fjäril",w:["larv, ägg, fjäril, puppa","ägg, puppa, larv, fjäril","puppa, larv, ägg, fjäril"]},
 {lv:2,q:"Vilken ordning är rätt för grodan?",a:"rom, grodyngel, groda",w:["groda, rom, grodyngel","grodyngel, rom, groda","rom, groda, grodyngel"]},
 {lv:2,q:"Vilken ordning är rätt för en växt?",a:"frö, grodd, planta, blomma",w:["blomma, frö, planta, grodd","grodd, frö, blomma, planta","planta, grodd, frö, blomma"]},
 {lv:2,q:"Vad händer med grodynglets svans?",a:"den krymper och försvinner",w:["den blir längre","den blir ett ben","den faller av som ett löv"]},
 {lv:2,q:"Vilket djur har INTE en förvandling?",a:"räven",w:["grodan","fjärilen","nässelfjärilen"]},
 {lv:1,q:"Skriv ordet: det som kryper ur fjärilens ägg heter en …",a:["larv","larven"],lines:["Skriv ordet som saknas:","Det som kryper ur fjärilens ägg","heter en …"]},
 {lv:2,q:"Skriv ordet: när ett djur ändrar hela kroppen kallas det …",a:["förvandling","förvandlingen","metamorfos"],lines:["Skriv ordet som saknas:","När ett djur ändrar hela kroppen","kallas det …"]},
 {lv:2,q:"Skriv ordet: en ung groda med svans heter …",a:["grodyngel","ett grodyngel","grodynglet"],lines:["Skriv ordet som saknas:","En ung groda med svans heter …"]},
];
LESSONS.push({id:"bio4l",subject:"science",grades:"4",kind:"wb",year:4,ord:13,
 title:t3("Livscykler","Life cycles","دورات الحياة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><ellipse cx="160" cy="92" rx="100" ry="62" fill="none" stroke="#c7cfdc" stroke-width="3" stroke-dasharray="8 8"/><g fill="#dbe7fb" stroke="#5a7fb8" stroke-width="2"><circle cx="152" cy="28" r="7"/><circle cx="166" cy="26" r="7"/><circle cx="160" cy="38" r="7"/></g><ellipse cx="268" cy="92" rx="14" ry="10" fill="#e3e6ec" stroke="#1d2433" stroke-width="3"/><path d="M256 90Q240 82 232 92Q242 96 256 96" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M146 150Q140 126 160 120Q186 116 192 136Q194 154 172 156Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="3"/><circle cx="168" cy="118" r="6" fill="#fff" stroke="#1e9e5a" stroke-width="3"/><path d="M60 92Q40 66 30 76Q24 98 56 98ZM60 92Q80 66 90 76Q96 98 64 98Z" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M60 80V108" stroke="#1d2433" stroke-width="3"/></svg>`,
 steps:NAT5.steps,mount:wbMount(NAT5),gen:bankGen(BANK5)});
WORDS.bio4l=["no_livscykel","no_rom","no_grodyngel","no_larv","no_puppa","no_forvandling"];

/* ---------------------------------------------------------------
   6. bio4m: nature's cycle and people
   --------------------------------------------------------------- */
const CHECK=(x,y,c="g")=>A.p(`M${x-10} ${y-8} L${x-2} ${y+2} L${x+12} ${y-18}`,c,5);
const CROSS=(x,y,c="r")=>A.p(`M${x-10} ${y-18} L${x+10} ${y+2} M${x+10} ${y-18} L${x-10} ${y+2}`,c,5);
const LEAFS=[[460,412,.35],[500,416,.3],[540,410,.38],[585,414,.3],[620,412,.34]];
const MOUND="M-80 0 Q-40 -50 0 -52 Q40 -50 80 0 Z";
const NAT6={steps:[
 {say:t3("Varje höst faller miljarder löv till marken, och växter och djur dör hela tiden. Ändå blir skogen inte full av gamla löv. Vart tar allt vägen? Det ska vi ta reda på nu.",
   "Every autumn billions of leaves fall to the ground, and plants and animals die all the time. Yet the forest does not fill up with old leaves. Where does it all go? Let's find out.",
   "في كل خريف تسقط مليارات الأوراق على الأرض، وتموت النباتات والحيوانات طوال الوقت، ومع ذلك لا تمتلئ الغابة بالأوراق القديمة. أين يذهب كل ذلك؟ لنكتشف الآن."),
  draw:()=>[A.wipe(),ttl("Vart tar alla löv vägen?"),...soil(40,760,420),...art("bjork",230,420,1.45),A.flow("M190 240 Q140 330 180 410","o",5,3.6,6),A.flow("M280 230 Q340 320 300 410","o",5,4,6),
   ...LEAFS.flatMap(([x,y,s])=>art("leaf",x,y,s)),A.tx("?",640,280,120,"r"),A.tx("löv faller",540,370,30,"o")]},
 {say:t3("Nedbrytare är organismer som äter döda växter och djur. Daggmaskar drar ner löv i jorden och äter dem. Svampar och bakterier bryter ner resten. Bakterierna är så små att de bara syns i mikroskop.",
   "Decomposers are living things that eat dead plants and animals. Earthworms pull leaves into the soil and eat them. Fungi and bacteria break down the rest. Bacteria are so small you can only see them in a microscope.",
   "المحلِّلات كائنات تأكل النباتات والحيوانات الميتة. ديدان الأرض تسحب الأوراق إلى التربة وتأكلها، والفطريات والبكتيريا تحلّل الباقي. البكتيريا صغيرة جدًا فلا تُرى إلا بالمجهر."),
  draw:()=>[A.wipe(),ttl("Nedbrytarna"),A.band(50,262,210,96,"o"),...soil(50,260,262),...art("worm",155,316,1.75),...soil(300,500,330),...art("svamp",400,330,1.6),A.p(R.circ(650,290,70),"v",3.5),...art("bacteria",650,290,2.2),
   A.tx("daggmaskar",150,400,32,"p"),A.tx("svampar",400,400,32,"o"),A.tx("bakterier",650,400,32,"v"),A.tx("äter döda löv",150,440,26),A.tx("bryter ner döda saker",400,440,26),A.tx("syns i mikroskop",650,440,26)]},
 {say:t3("Nedbrytarna gör om det döda till näring i jorden. Den näringen tar nya växter upp med sina rötter. Växterna blir mat åt djuren, och när de dör börjar allt om. Det är naturens kretslopp: inget går förlorat!",
   "Decomposers turn dead things into nutrients in the soil. New plants take up those nutrients with their roots. The plants become food for animals, and when they die it all starts again. That is nature's cycle: nothing is lost!",
   "المحلِّلات تحوّل الكائنات الميتة إلى غذاء في التربة، فتمتصّه النباتات الجديدة بجذورها. وتصبح النباتات غذاءً للحيوانات، وعندما تموت يبدأ كل شيء من جديد. هذه دورة الطبيعة: لا شيء يضيع!"),
  draw:()=>[A.wipe(),ttl("Naturens kretslopp"),...cycle4(400,285,235,150,[(x,y)=>[...art("sprout",x,y+18,1.4),A.tx("ny växt",x+44,y+6,30,"g","start")],(x,y)=>[...art("leaf",x,y,.85),A.tx("döda löv",x,y+44,30,"o")],
   (x,y)=>[...art("worm",x,y-10,1.1),A.tx("nedbrytare",x+70,y-4,30,"p","start")],(x,y)=>[A.tx("näring",x-10,y-4,32,BRN),A.tx("i jorden",x-10,y+30,32,BRN)]],"k","g")]},
 {say:t3("Du kan hjälpa kretsloppet med en kompost. Där lägger man matrester, skal och löv. Maskar, svampar och bakterier gör om det till ny näringsrik jord som man kan odla i.",
   "You can help the cycle with a compost. You put food scraps, peel and leaves in it. Worms, fungi and bacteria turn it into new, rich soil that you can grow things in.",
   "يمكنك أن تساعد دورة الطبيعة بالسماد العضوي. نضع فيه بقايا الطعام والقشور والأوراق، فتحوّلها الديدان والفطريات والبكتيريا إلى تربة جديدة غنية نزرع فيها."),
  draw:()=>[A.wipe(),ttl("Kompost"),A.p(R.rect(110,180,240,230,.5),BRN,4.5),A.p("M110 260 Q170 250 230 262 Q290 272 350 260 M110 330 Q170 320 230 332 Q290 342 350 330",BRN,2.5),
   ...art("leaf",170,232,.4),A.p(tfx("M-10 -20 Q-2 -12 -8 0 Q-2 12 -10 20 L10 20 Q2 12 8 0 Q2 -12 10 -20 Z",290,232,1.1),"r",3.5),A.p(tfx("M0 -20 L2 -30",290,232,1.1),BRN,3.5),...art("worm",220,372,.8),A.p(dotsP([[160,300],[250,296],[300,304]]),"v",6),
   A.tx("matrester, skal, löv",230,160,28,"k"),A.p(R.arrow(370,300,460,320,-16),"k",4),A.flow("M370 300 Q420 296 460 320","o",4,2,6),
   A.hatch(tfx(MOUND,560,410,1.3),"o"),A.p(tfx(MOUND,560,410,1.3),BRN,4),...art("sprout",560,346,1.6),A.tx("ny jord",560,455,32,BRN)]},
 {say:t3("Människan påverkar naturen. Skräp i naturen kan skada djur. Plast bryts inte ner av nedbrytarna. Den blir bara mindre bitar, mikroplast, som hamnar i havet och i fiskarnas magar. En plastflaska kan finnas kvar i hundratals år.",
   "People affect nature. Litter in nature can hurt animals. Plastic is not broken down by decomposers. It just becomes smaller pieces, microplastics, that end up in the sea and in fish stomachs. A plastic bottle can last for hundreds of years.",
   "الإنسان يؤثّر في الطبيعة. النفايات في الطبيعة قد تؤذي الحيوانات، والبلاستيك لا تحلّله المحلِّلات، بل يتفتّت إلى قطع أصغر هي الجسيمات البلاستيكية الدقيقة التي تصل إلى البحر وبطون الأسماك. قد تبقى زجاجة بلاستيكية مئات السنين."),
  draw:()=>[A.wipe(),ttl("Plast i havet"),...water(30,110,740,320),...art("bottle",170,210,1.3),...art("bag",340,330,1.3),...art("perch",590,270,1),
   A.flow("M120 380 Q300 330 470 380 Q560 410 700 360","r",12,9,3),A.tx("mikroplast",180,410,28,"r"),A.tx("flaska: hundratals år",400,470,30,"b")]},
 {say:t3("Om man hugger ner en hel skog på en gång försvinner djurens hem och mat. Det kallas skövling. Därför är det viktigt att plantera nya träd och att spara skog där många arter lever.",
   "If a whole forest is cut down at once, the animals lose their homes and food. That is called deforestation. So it is important to plant new trees and to save forests where many species live.",
   "إذا قُطعت غابة كاملة دفعة واحدة تفقد الحيوانات مأواها وغذاءها، وهذا يسمّى إزالة الغابات. لذلك من المهم أن نزرع أشجارًا جديدة وأن نحافظ على الغابات التي تعيش فيها أنواع كثيرة."),
  draw:()=>[A.wipe(),ttl("Skövling"),...soil(40,370,390),...art("stump",90,390,1),...art("stump",190,390,1.1),...art("stump",300,390,.9),...art("sprout",245,390,.9),A.tx("plantera nytt",250,330,26,"g"),
   A.p(R.line(400,110,400,440,.3),"#c7cfdc",2),...soil(430,760,390),...art("gran",475,390,1),...art("bjork",575,390,.95),...art("gran",722,390,.9),...art("squirrel",646,390,.5),
   A.tx("skövlad skog",200,445,32,"r"),A.tx("levande skog",600,445,32,"g")]},
 {say:t3("I Sverige har vi allemansrätten. Den ger alla rätt att vara i naturen, gå i skogen och plocka bär och svamp. Men regeln är: inte störa, inte förstöra. Skräpa inte ner, stör inte djuren och bryt inte grenar från levande träd.",
   "In Sweden we have the right of public access. It gives everyone the right to be in nature, walk in the forest and pick berries and mushrooms. But the rule is: do not disturb, do not destroy. Do not litter, do not disturb animals and do not break branches off living trees.",
   "في السويد لدينا حق الوصول العام. يعطي الجميع حق التواجد في الطبيعة والمشي في الغابة وقطف التوت والفطر. لكن القاعدة: لا تُزعج ولا تُخرّب. لا ترمِ النفايات، ولا تُزعج الحيوانات، ولا تكسر أغصان الأشجار الحيّة."),
  draw:()=>[A.wipe(),ttl("Allemansrätten"),A.band(40,100,350,300,"g"),A.band(410,100,350,300,"r"),A.tx("Det får du:",215,145,34,"g"),A.tx("Det får du inte:",585,145,34,"r"),
   ...[["vandra i skogen",210],["plocka bär och svamp",270],["bada i sjön",330]].flatMap(([s,y])=>[CHECK(75,y),A.tx(s,100,y,28,"k","start")]),
   ...[["skräpa ner",210],["störa djur och fåglar",270],["bryta levande grenar",330]].flatMap(([s,y])=>[CROSS(445,y),A.tx(s,470,y,28,"k","start")]),
   note("inte störa, inte förstöra",460,"b",36)]},
 {say:t3("Alla kan hjälpa till! Sortera skräpet så att det kan återvinnas och bli nya saker. Plocka upp skräp du ser, använd mindre plast och kompostera matrester. Då hjälper du naturens kretslopp.",
   "Everyone can help! Sort your waste so it can be recycled into new things. Pick up litter you see, use less plastic and compost food scraps. Then you help nature's cycle.",
   "يستطيع الجميع المساعدة! افرز النفايات لكي يُعاد تدويرها وتصبح أشياء جديدة، والتقط النفايات التي تراها، واستخدم بلاستيكًا أقل، واجعل بقايا الطعام سمادًا. هكذا تساعد دورة الطبيعة."),
  draw:()=>[A.wipe(),ttl("Det här kan du göra"),...blist([["sortera och återvinn","g"],["plocka upp skräp","b"],["använd mindre plast","o"],["kompostera matrester",BRN],["var rädd om naturen","g"]],70,160,60,32),
   ...ringArrows(630,280,95,95,3,"g",60),ringFlow(630,280,95,95,"g",9,6),A.tx("återvinning",630,420,30,"g")]},
]};
const BANK6=[
 {lv:0,q:"Vad kallas organismer som bryter ner döda växter och djur?",a:"nedbrytare",w:["producenter","rovdjur","växtätare"]},
 {lv:0,q:"Vilken av dessa är en nedbrytare?",a:"daggmasken",w:["räven","björken","haren"]},
 {lv:0,q:"Vad ska man göra med skräp i skogen?",a:"ta med det hem",w:["gräva ner det","lämna det","slänga det i sjön"]},
 {lv:0,q:"Vilken nedbrytare är det här?",a:"daggmask",w:["orm","larv","grodyngel"],lines:["Vilken nedbrytare","är det här?"],pic:()=>[...soil(60,340,260),A.band(60,262,280,150,"o"),...art("worm",200,340,2.2)]},
 {lv:1,q:"Vad gör nedbrytarna av döda löv?",a:"näring i jorden",w:["plast","sten","syre"]},
 {lv:1,q:"Varför är plast farligt i havet?",a:"den bryts inte ner och djur kan äta den",w:["den gör vattnet varmt","den äter fiskar","den blir till sand direkt"]},
 {lv:1,q:"Vad är mikroplast?",a:"mycket små bitar av plast",w:["en sorts fisk","en liten svamp","nyttig mat för fåglar"]},
 {lv:1,q:"Vad får du göra enligt allemansrätten?",a:"plocka bär och svamp",w:["bryta grenar på levande träd","skräpa ner","störa fågelbon"]},
 {lv:1,q:"Vad får du INTE göra enligt allemansrätten?",a:"störa djur och fåglar",w:["vandra i skogen","bada i sjön","plocka blåbär"]},
 {lv:1,q:"Vad kan man lägga i en kompost?",a:"matrester och skal",w:["plastpåsar","batterier","glasflaskor"]},
 {lv:2,q:"Vad är naturens kretslopp?",a:"att ämnen i naturen används om och om igen",w:["att djur springer i ring","att vatten bara rinner neråt","att löv aldrig försvinner"]},
 {lv:2,q:"Vad händer med djuren när en skog skövlas?",a:"de förlorar sitt hem och sin mat",w:["de får mer mat","ingenting","de blir större"]},
 {lv:2,q:"Hur kan du minska skräpet i naturen?",a:"sortera och återvinna",w:["elda plast","slänga allt i sjön","köpa fler plastpåsar"]},
 {lv:2,q:"Vad är allemansrättens regel?",a:"inte störa, inte förstöra",w:["först till kvarn","allt är tillåtet","bara vuxna får gå i skogen"]},
 {lv:2,q:"Vilka tre grupper av nedbrytare finns det?",a:"maskar, svampar och bakterier",w:["rävar, ugglor och ormar","träd, gräs och mossa","fiskar, grodor och fåglar"]},
 {lv:1,q:"Skriv ordet: en låda där matrester blir ny jord heter …",a:["kompost","komposten","en kompost"],lines:["Skriv ordet som saknas:","En låda där matrester blir","ny jord heter en …"]},
 {lv:2,q:"Skriv ordet: rätten för alla att vara i naturen heter …",a:["allemansrätten","allemansrätt"],lines:["Skriv ordet som saknas:","Rätten för alla att vara i naturen","heter …"]},
 {lv:2,q:"Skriv ordet: maskar, svampar och bakterier kallas …",a:["nedbrytare","nedbrytarna"],lines:["Skriv ordet som saknas:","Maskar, svampar och bakterier","kallas …"]},
];
LESSONS.push({id:"bio4m",subject:"science",grades:"4",kind:"wb",year:4,ord:14,
 title:t3("Kretslopp och människan","Nature's cycle and people","دورة الطبيعة والإنسان"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M20 130H300" stroke="#8a5a2b" stroke-width="3"/><path d="M60 128Q74 108 92 122Q110 136 128 120Q140 110 150 118" fill="none" stroke="#c2417a" stroke-width="8" stroke-linecap="round"/><path d="M190 120Q194 96 222 94Q250 96 254 120Z" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M214 120V130M230 120V130" stroke="#8a5a2b" stroke-width="3"/><path d="M110 60A50 34 0 1 1 210 60" fill="none" stroke="#1e9e5a" stroke-width="3.5" stroke-dasharray="10 6"/><path d="M210 60L200 50M210 60L216 48" stroke="#1e9e5a" stroke-width="3.5"/><path d="M60 92Q90 70 120 90Q90 106 60 92Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="3"/></svg>`,
 steps:NAT6.steps,mount:wbMount(NAT6),gen:bankGen(BANK6)});
WORDS.bio4m=["no_nedbrytare","no_kretslopp_natur","no_kompost","no_mikroplast","no_skovling","no_allemansratten","no_atervinning"];
}

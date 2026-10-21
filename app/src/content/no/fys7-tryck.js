import {KID} from "./no-0art.js";
import {artLines,bankGen,blist,callout,dotsP,ellP,heartBig,note,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,f1,t3,wbMount} from "../../legacy/core.js";
/* ===== fys7-tryck.js: Fysik, Year 7, chapter "Tryck" (after the topics of Titano Fysik, in our own words) =====
   Base lessons f7t1..f7t6, "Lär mer" f7t7..f7t8:
   1. f7t1 Lagom tryck          2. f7t2 Tryck mot yta       3. f7t3 Luften trycker
   4. f7t4 Vatten lyfter        5. f7t5 Vattennivå          6. f7t6 Hållbar utveckling: Hav i balans
   7. f7t7 Lär mer: Tryck mäts på många sätt                8. f7t8 Lär mer: Arkimedes */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
/* ---------- words ---------- */
TERM("f7t_tryck",{sv:"tryck",m:W("tryck(et)?"),d:t3("Hur stor kraft som trycker på varje bit av en yta. Tryck = kraft delat med area.","How much force pushes on each part of a surface. Pressure = force divided by area.","مقدار القوة التي تضغط على كل جزء من سطح. الضغط = القوة مقسومة على المساحة."),ex:"Trycket i däcket är för lågt.",tr:{en:"pressure",ar:"ضغط"}});
TERM("f7t_pascal",{sv:"pascal (Pa)",m:W("(pascal|Pa)"),d:t3("Enheten för tryck. 1 Pa är en kraft på 1 newton på 1 kvadratmeter.","The unit of pressure. 1 Pa is a force of 1 newton on 1 square metre.","وحدة الضغط. 1 باسكال هو قوة 1 نيوتن على متر مربع واحد."),ex:"1 Pa = 1 N/m²",tr:{en:"pascal",ar:"باسكال"}});
TERM("f7t_kpa",{sv:"kilopascal (kPa)",m:W("(kilopascal|kPa)"),d:t3("Tusen pascal. Används för tryck i vardagen, till exempel lufttryck.","A thousand pascals. Used for everyday pressures, for example air pressure.","ألف باسكال، ويُستعمل لضغوط الحياة اليومية مثل الضغط الجوي."),ex:"1 kPa = 1 000 Pa",tr:{en:"kilopascal",ar:"كيلوباسكال"}});
TERM("f7t_blodtryck",{sv:"blodtryck",m:W("blodtryck(et)?"),d:t3("Trycket i blodkärlen när hjärtat pumpar ut blodet.","The pressure in the blood vessels when the heart pumps out the blood.","الضغط في الأوعية الدموية عندما يضخّ القلب الدم."),ex:"Doktorn mäter blodtrycket.",tr:{en:"blood pressure",ar:"ضغط الدم"}});
TERM("f7t_dacktryck",{sv:"däcktryck",m:W("däcktryck(et)?"),d:t3("Trycket i luften inne i ett däck. Det ska vara lagom, varken för högt eller för lågt.","The pressure of the air inside a tyre. It should be just right, neither too high nor too low.","ضغط الهواء داخل الإطار، ويجب أن يكون معتدلًا لا مرتفعًا جدًا ولا منخفضًا جدًا."),ex:"Kolla däcktrycket innan du cyklar.",tr:{en:"tyre pressure",ar:"ضغط الإطار"}});
TERM("f7t_area",{sv:"area",m:W("area(n|or)?"),d:t3("Hur stor en yta är. Mäts till exempel i kvadratmeter, m².","How big a surface is. Measured for example in square metres, m².","مقدار كِبَر السطح، ويُقاس مثلًا بالمتر المربع."),ex:"Snöskor har stor area.",tr:{en:"area",ar:"مساحة"}});
TERM("f7t_newton",{sv:"newton (N)",m:W("(newton|N)"),d:t3("Enheten för kraft. Ett kilo väger ungefär 10 N på jorden.","The unit of force. One kilogram weighs about 10 N on Earth.","وحدة القوة. الكيلوغرام الواحد يزن نحو 10 نيوتن على الأرض."),ex:"Lådan väger 20 N.",tr:{en:"newton",ar:"نيوتن"}});
TERM("f7t_kvm",{sv:"kvadratmeter (m²)",m:W("(kvadratmeter|m²)"),d:t3("En yta som är 1 meter lång och 1 meter bred.","A surface 1 metre long and 1 metre wide.","سطح طوله متر واحد وعرضه متر واحد."),ex:"Golvet är 12 m².",tr:{en:"square metre",ar:"متر مربع"}});
TERM("f7t_tyngd",{sv:"tyngd",m:W("tyngd(en|er)?"),d:t3("Den kraft som jorden drar ett föremål nedåt med. Mäts i newton.","The force with which the Earth pulls an object down. Measured in newtons.","القوة التي تجذب بها الأرض جسمًا إلى الأسفل، وتُقاس بالنيوتن."),ex:"Tyngden av 50 kg är ca 500 N.",tr:{en:"weight",ar:"الوزن"}});
TERM("f7t_lufttryck",{sv:"lufttryck",m:W("lufttryck(et)?"),d:t3("Trycket från luften omkring oss. Vid havsytan är det ungefär 101 kPa.","The pressure from the air around us. At sea level it is about 101 kPa.","ضغط الهواء من حولنا، ويبلغ عند سطح البحر نحو 101 كيلوباسكال."),ex:"Lufttrycket minskar uppe på ett berg.",tr:{en:"air pressure",ar:"الضغط الجوي"}});
TERM("f7t_atmosfar",{sv:"atmosfär",m:W("atmosfär(en)?"),d:t3("Lagret av luft som finns runt jorden.","The layer of air around the Earth.","طبقة الهواء المحيطة بالأرض."),ex:"Atmosfären är flera mil hög.",tr:{en:"atmosphere",ar:"الغلاف الجوي"}});
TERM("f7t_vakuum",{sv:"vakuum",m:W("vakuum(et)?"),d:t3("Ett utrymme utan luft, där trycket är nästan noll.","A space without air, where the pressure is almost zero.","حيّز بلا هواء يكون فيه الضغط صفرًا تقريبًا."),ex:"I rymden är det vakuum.",tr:{en:"vacuum",ar:"فراغ"}});
TERM("f7t_sugkopp",{sv:"sugkopp",m:W("sugkopp(en|ar)?"),d:t3("En gummikopp som sitter fast för att lufttrycket utanför är större än trycket under den.","A rubber cup that sticks because the air pressure outside is greater than the pressure under it.","كأس مطاطية تلتصق لأن الضغط الجوي خارجها أكبر من الضغط تحتها."),ex:"Sugkoppen sitter på kaklet.",tr:{en:"suction cup",ar:"كأس شفط"}});
TERM("f7t_vattentryck",{sv:"vattentryck",m:W("vattentryck(et)?"),d:t3("Trycket i vatten. Det ökar med ungefär 10 kPa för varje meter djupare.","The pressure in water. It increases by about 10 kPa for every metre deeper.","الضغط في الماء، ويزداد نحو 10 كيلوباسكال لكل متر من العمق."),ex:"Vattentrycket är stort på botten.",tr:{en:"water pressure",ar:"ضغط الماء"}});
TERM("f7t_lyftkraft",{sv:"lyftkraft",m:W("lyftkraft(en)?"),d:t3("Kraften uppåt som en vätska ger ett föremål som är i den.","The upward force that a liquid gives an object in it.","القوة المتجهة إلى الأعلى التي يؤثّر بها السائل في جسم موجود فيه."),ex:"Lyftkraften gör stenen lättare.",tr:{en:"buoyancy",ar:"قوة الطفو"}});
TERM("f7t_flyta",{sv:"flyta",m:W("flyt(a|er)"),d:t3("Att ligga kvar vid ytan. Det sker när lyftkraften blir lika stor som tyngden.","To stay at the surface. It happens when the buoyancy becomes as big as the weight.","أن يبقى الجسم عند السطح، ويحدث ذلك عندما تساوي قوة الطفو الوزن."),ex:"Trä flyter på vatten.",tr:{en:"to float",ar:"يطفو"}});
TERM("f7t_densitet",{sv:"densitet",m:W("densitet(en)?"),d:t3("Hur mycket massa det finns i en viss volym. Vatten har 1 g/cm³.","How much mass there is in a certain volume. Water has 1 g/cm³.","مقدار الكتلة في حجم معيّن. كثافة الماء 1 غ/سم³."),ex:"Järn har hög densitet.",tr:{en:"density",ar:"الكثافة"}});
TERM("f7t_djup",{sv:"djup",m:W("djup(et)?"),d:t3("Hur långt under vattenytan något är.","How far below the water surface something is.","المسافة التي يكون بها الشيء تحت سطح الماء."),ex:"På 10 meters djup är trycket dubbelt så stort.",tr:{en:"depth",ar:"عمق"}});
TERM("f7t_kommunicerande",{sv:"kommunicerande kärl",m:W("kommunicerande"),d:t3("Kärl som hänger ihop i botten. Vätskan står lika högt i alla.","Vessels that are joined at the bottom. The liquid stands equally high in all of them.","أوعية متصلة من الأسفل، يقف السائل فيها جميعًا على الارتفاع نفسه."),ex:"Kannan och pipen är kommunicerande kärl.",tr:{en:"communicating vessels",ar:"الأواني المستطرقة"}});
TERM("f7t_vattentorn",{sv:"vattentorn",m:W("vattentorn(et)?"),d:t3("Ett torn med en vattentank högt upp som ger tryck i vattenledningarna.","A tower with a water tank high up that gives pressure in the water pipes.","برج فيه خزان ماء في الأعلى يعطي ضغطًا في أنابيب المياه."),ex:"Vattentornet står på en kulle.",tr:{en:"water tower",ar:"برج المياه"}});
TERM("f7t_sluss",{sv:"sluss",m:W("sluss(en|ar|arna)?"),d:t3("En kammare med portar där vattennivån höjs eller sänks så att båtar kan ta sig förbi en höjdskillnad.","A chamber with gates where the water level is raised or lowered so boats can pass a difference in height.","حجرة لها بوابات يُرفع فيها مستوى الماء أو يُخفض لتعبر السفن فرقًا في الارتفاع."),ex:"Båten väntar i slussen.",tr:{en:"lock",ar:"هويس"}});
TERM("f7t_vattenpass",{sv:"slangvattenpass",m:W("(slang)?vattenpass(et)?"),d:t3("En genomskinlig slang med vatten. Vattnet står lika högt i båda ändarna.","A clear hose with water. The water stands equally high at both ends.","خرطوم شفاف فيه ماء، يقف الماء على الارتفاع نفسه في طرفيه."),ex:"Med slangvattenpass hittar man samma höjd.",tr:{en:"water level (hose level)",ar:"ميزان الماء بالخرطوم"}});
TERM("f7t_vattenyta",{sv:"vattenyta",m:W("vattenyt(a|an|or)"),d:t3("Den översta gränsen av vattnet, där vattnet möter luften.","The top edge of the water, where water meets air.","الحدّ الأعلى للماء حيث يلتقي بالهواء."),ex:"Vattenytan står lika högt.",tr:{en:"water surface",ar:"سطح الماء"}});
TERM("f7t_havsniva",{sv:"havsnivå",m:W("havsnivå(n)?"),d:t3("Hur högt havets yta ligger. Den stiger när det blir varmare.","How high the surface of the sea is. It rises when it gets warmer.","ارتفاع سطح البحر، ويرتفع عندما يزداد الدفء."),ex:"Havsnivån har stigit drygt 20 cm.",tr:{en:"sea level",ar:"مستوى سطح البحر"}});
TERM("f7t_inlandsis",{sv:"inlandsis",m:W("(inlandsis(en|ar)?|landis(en)?)"),d:t3("Tjock is som ligger på land, till exempel på Grönland och Antarktis.","Thick ice lying on land, for example on Greenland and Antarctica.","جليد سميك يغطي اليابسة، مثل غرينلاند والقارة القطبية الجنوبية."),ex:"Inlandsisen på Grönland smälter.",tr:{en:"ice sheet",ar:"الغطاء الجليدي"}});
TERM("f7t_havsis",{sv:"havsis",m:W("havsis(en)?"),d:t3("Is som flyter på havet. När den smälter höjs havsnivån nästan inte.","Ice floating on the sea. When it melts, the sea level hardly rises.","جليد يطفو على البحر، وعندما يذوب لا يكاد يرتفع مستوى البحر."),ex:"Havsisen i Arktis minskar.",tr:{en:"sea ice",ar:"الجليد البحري"}});
TERM("f7t_varmeutvidgning",{sv:"värmeutvidgning",m:W("(värmeutvidgning(en)?|utvidga(r|s)? sig)"),d:t3("När ett ämne tar mer plats för att det blir varmare.","When a substance takes up more space because it gets warmer.","عندما تشغل مادة حيّزًا أكبر لأنها صارت أدفأ."),ex:"Havet stiger av värmeutvidgning.",tr:{en:"thermal expansion",ar:"التمدد الحراري"}});
TERM("f7t_hallbar",{sv:"hållbar utveckling",m:W("hållbar(t|a)?"),d:t3("Att leva så att vi tar hand om jorden, så att människor i framtiden också kan leva bra.","Living so that we take care of the Earth, so that people in the future can also live well.","أن نعيش بطريقة نحافظ فيها على الأرض حتى تعيش الأجيال القادمة أيضًا حياة جيدة."),ex:"Mindre utsläpp är en del av hållbar utveckling.",tr:{en:"sustainable development",ar:"التنمية المستدامة"}});
TERM("f7t_barometer",{sv:"barometer",m:W("barometer(n|rar)?"),d:t3("Ett instrument som mäter lufttrycket.","An instrument that measures air pressure.","جهاز يقيس الضغط الجوي."),ex:"Barometern visar 1013 hPa.",tr:{en:"barometer",ar:"بارومتر"}});
TERM("f7t_manometer",{sv:"manometer",m:W("manometer(n|rar)?"),d:t3("Ett instrument som mäter övertryck eller undertryck, till exempel ett U-rör med vätska.","An instrument that measures overpressure or underpressure, for example a U-tube with liquid.","جهاز يقيس الضغط الزائد أو الناقص، مثل أنبوب على شكل U فيه سائل."),ex:"Manometern visar 2 kPa övertryck.",tr:{en:"manometer",ar:"مانومتر"}});
TERM("f7t_overtryck",{sv:"övertryck",m:W("övertryck(et)?"),d:t3("Hur mycket större ett tryck är än lufttrycket.","How much bigger a pressure is than the air pressure.","مقدار زيادة ضغطٍ ما على الضغط الجوي."),ex:"Däcket har 230 kPa övertryck.",tr:{en:"overpressure",ar:"ضغط زائد"}});
TERM("f7t_undertryck",{sv:"undertryck",m:W("undertryck(et)?"),d:t3("Hur mycket mindre ett tryck är än lufttrycket.","How much smaller a pressure is than the air pressure.","مقدار نقص ضغطٍ ما عن الضغط الجوي."),ex:"Under sugkoppen är det undertryck.",tr:{en:"underpressure",ar:"ضغط ناقص"}});
TERM("f7t_hpa",{sv:"hektopascal (hPa)",m:W("(hektopascal|hPa)"),d:t3("Hundra pascal. Lufttryck i väderprognoser anges ofta i hPa.","A hundred pascals. Air pressure in weather forecasts is often given in hPa.","مئة باسكال، وكثيرًا ما يُعطى الضغط الجوي في النشرات الجوية بها."),ex:"1013 hPa = 101,3 kPa",tr:{en:"hectopascal",ar:"هكتوباسكال"}});
TERM("f7t_hogtryck",{sv:"högtryck / lågtryck",m:W("(högtryck(et)?|lågtryck(et)?)"),d:t3("Område med högre eller lägre lufttryck än runt omkring. Högtryck ger ofta fint väder, lågtryck ofta regn.","An area with higher or lower air pressure than around it. High pressure often brings fine weather, low pressure often rain.","منطقة ضغطها الجوي أعلى أو أدنى مما حولها. المرتفع يجلب غالبًا طقسًا صحوًا والمنخفض مطرًا."),ex:"Ett lågtryck närmar sig.",tr:{en:"high / low pressure",ar:"مرتفع / منخفض جوي"}});
TERM("f7t_arkimedes",{sv:"Arkimedes princip",m:W("Arkimedes"),d:t3("Lyftkraften på ett föremål i en vätska är lika stor som tyngden av den vätska som föremålet tränger undan.","The buoyancy on an object in a liquid equals the weight of the liquid that the object pushes aside.","قوة الطفو على جسم في سائل تساوي وزن السائل الذي يزيحه الجسم."),ex:"Båten flyter enligt Arkimedes princip.",tr:{en:"Archimedes' principle",ar:"مبدأ أرخميدس"}});
TERM("f7t_undantrangd",{sv:"undanträngt vatten",m:W("undanträng(t|da|er)"),d:t3("Det vatten som ett föremål knuffar undan när det sänks ner.","The water an object pushes aside when it is lowered in.","الماء الذي يزيحه جسم عندما يُغمر فيه."),ex:"Klossen tränger undan 2 dm³ vatten.",tr:{en:"displaced water",ar:"الماء المُزاح"}});
TERM("f7t_volym",{sv:"volym",m:W("volym(en|er)?"),d:t3("Hur mycket plats något tar. Mäts till exempel i dm³ eller liter.","How much space something takes up. Measured for example in dm³ or litres.","مقدار الحيّز الذي يشغله الشيء، ويُقاس مثلًا بالدسيمتر المكعب أو اللتر."),ex:"1 dm³ = 1 liter",tr:{en:"volume",ar:"حجم"}});
TERM("f7t_skrov",{sv:"skrov",m:W("skrov(et)?"),d:t3("Fartygets kropp, den del som ligger i vattnet.","The body of a ship, the part that lies in the water.","جسم السفينة، الجزء الذي يكون في الماء."),ex:"Skrovet är byggt av stål.",tr:{en:"hull",ar:"هيكل السفينة"}});
TERM("f7t_ubat",{sv:"ubåt",m:W("ubåt(en|ar)?"),d:t3("En båt som kan dyka. Den fyller eller tömmer tankar med vatten för att sjunka eller stiga.","A boat that can dive. It fills or empties tanks with water to sink or rise.","قارب يستطيع الغوص، يملأ خزاناته بالماء أو يفرغها لينزل أو يصعد."),ex:"Ubåten dyker.",tr:{en:"submarine",ar:"غواصة"}});

/* ---------- drawing helpers (board 800 × 500) ---------- */
/* a straight closed rectangle for shading, water in a box, an open container, a force arrow and a dashed line */
const rp=(x,y,w,h)=>`M${x} ${y}L${x+w} ${y}L${x+w} ${y+h}L${x} ${y+h}Z`;
const water=(x,y,w,h)=>[A.hatch(rp(x,y,w,h),"b"),A.p(R.line(x,y,x+w,y,.4),"b",3)];
const tank=(x,y,w,h,c="k")=>A.p(R.line(x,y,x,y+h,.4)+R.line(x,y+h,x+w,y+h,.4)+R.line(x+w,y+h,x+w,y,.4),c,4.5);
const fa=(x1,y1,x2,y2,c="r",w=5)=>A.p(R.arrow(x1,y1,x2,y2),c,w);
const dsh=(x1,y1,x2,y2,c="b",w=3)=>A.p(R.dashed(x1,y1,x2,y2),c,w);
const box=(x,y,w,h,c="o")=>[A.hatch(rp(x,y,w,h),c),A.p(R.rect(x,y,w,h,.4),"k",4)];
const ground=(x1,x2,y,c="#8a5a2b")=>A.p(R.line(x1,y,x2,y,.5),c,4);
/* a balloon with knot and string; (x, y) = centre */
const balloon=(x,y,rx,ry,c="r")=>[A.hatch(ellP(x,y,rx,ry),c),A.p(ellP(x,y,rx,ry),c,4),A.p(`M${x-7} ${y+ry+10}L${x+7} ${y+ry+10}L${x} ${y+ry}Z`,c,3),A.p(`M${x} ${y+ry+10}Q${x-12} ${y+ry+32} ${x+4} ${y+ry+56}`,"k",2.5)];
/* a bicycle wheel */
const spokes=(x,y,r)=>[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return`M${f1(x+Math.cos(a)*10)} ${f1(y+Math.sin(a)*10)}L${f1(x+Math.cos(a)*r)} ${f1(y+Math.sin(a)*r)}`}).join("");
const wheel=(x,y,r)=>[A.p(R.circ(x,y,r),"k",10),A.p(R.circ(x,y,r-14),"#7d8ca6",3),A.p(R.circ(x,y,9),"k",4),A.p(spokes(x,y,r-15),"#7d8ca6",2)];
/* a stone */
const stoneD=(x,y,r)=>`M${x-r} ${y}Q${x-r} ${y-r*.9} ${x-r*.1} ${y-r}Q${x+r*.9} ${y-r*1.05} ${x+r} ${y-r*.1}Q${x+r*1.05} ${y+r*.85} ${x+r*.1} ${y+r*.9}Q${x-r*.95} ${y+r*.95} ${x-r} ${y}Z`;
const stone=(x,y,r)=>[A.hatch(stoneD(x,y,r),"k"),A.p(stoneD(x,y,r),"k",4)];
/* a spring scale (dynamometer) hanging from (x, top); the hook ends len below the body; reading written beside */
const dyn=(x,top,len,read,c="b")=>{let z=`M${x} ${top+12}`;for(let i=0;i<8;i++)z+=`L${x+(i%2?-9:9)} ${top+18+i*8}`;z+=`L${x} ${top+84}`;
  return[A.p(R.rect(x-18,top,36,104,.4),"k",4),A.p(z,"#7d8ca6",2.5),A.p(R.line(x-14,top+84,x+14,top+84,.2),"r",4),A.p(R.line(x,top+104,x,top+104+len,.2),"k",3),A.tx(read,x+30,top+70,34,c,"start")]};
/* a small swimmer lying across, head to the right */
const swimmer=(x,y)=>[A.p(R.circ(x+30,y-2,10),"k",3.5),A.p(`M${x-26} ${y}L${x+19} ${y}M${x-26} ${y}L${x-50} ${y-9}M${x-26} ${y}L${x-50} ${y+9}M${x+8} ${y}L${x+44} ${y-16}`,"k",3.5)];
/* arrows pointing in at a point from 8 directions: r0 = gap, L = arrow length (bigger pressure = longer arrows) */
const squeeze=(x,y,r0,L,c="r")=>[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4+.2,cx=Math.cos(a),cy=Math.sin(a);return A.p(R.arrow(x+cx*(r0+L),y+cy*(r0+L),x+cx*r0,y+cy*r0),c,3)});
/* a boat seen from the side: hull top at y, cabin on top */
const boatD=(x,y,w=180,h=50)=>`M${x-w/2} ${y}L${x+w/2} ${y}L${x+w/2-24} ${y+h}L${x-w/2+24} ${y+h}Z`;
const boat=(x,y,w=180,h=50)=>[A.art(`<path d="${boatD(x,y,w,h)}" fill="#fbfcfe"/>`,0,0,1),A.p(boatD(x,y,w,h),"k",4.5),A.hatch(rp(x-28,y-36,56,36),"o"),A.p(R.rect(x-28,y-36,56,36,.3),"k",3.5)];
/* a thermometer: tube from top to bottom, filled from level down */
const thermo=(x,top,bot,level,c)=>[A.p(`M${x-8} ${bot}L${x-8} ${top}Q${x} ${top-10} ${x+8} ${top}L${x+8} ${bot}`,"k",3),A.hatch(R.circ(x,bot+12,14),c),A.p(R.circ(x,bot+12,14),"k",3),A.p(R.line(x,bot,x,level,.1),c,7)];
/* a glass (wider at the top) */
const glass=(x,y,w,h)=>A.p(`M${x} ${y}L${x+12} ${y+h}L${x+w-12} ${y+h}L${x+w} ${y}`,"k",4);

/* ---------------------------------------------------------------
   1. f7t1: Lagom tryck
   --------------------------------------------------------------- */
const T1={steps:[
 {say:t3("Du pumpar cykeln, blåser upp en ballong och skolsköterskan mäter ditt blodtryck. I alla tre fallen handlar det om tryck. I det här kapitlet lär vi oss vad tryck är, och hur luft och vatten trycker på allt omkring oss.",
   "You pump up your bike, blow up a balloon and the school nurse measures your blood pressure. All three are about pressure. In this chapter we learn what pressure is, and how air and water push on everything around us.",
   "تنفخ إطار درّاجتك، وتنفخ بالونًا، وتقيس الممرضة ضغط دمك. في الحالات الثلاث الأمر يتعلق بالضغط. في هذا الفصل نتعلم ما الضغط وكيف يضغط الهواء والماء على كل ما حولنا."),
  draw:()=>[A.wipe(),ttl("Tryck"),...wheel(150,250,90),...balloon(400,215,70,88),...heartBig(650,250,.8),A.beat(2,650,250,1.06,.9),
   A.tx("däcktryck",150,420,32,"k"),A.tx("ballong",400,420,32,"r"),A.tx("blodtryck",650,420,32,"r"),note("Tryck finns överallt omkring oss.",470,"b",30)]},
 {say:t3("Inne i ballongen far luftens små partiklar omkring och krockar hela tiden med gummit. Varje krock är en liten knuff utåt. Alla knuffar tillsammans håller ballongen uppblåst. Det är det vi kallar tryck.",
   "Inside the balloon, the tiny particles of air rush around and keep hitting the rubber. Each hit is a small push outwards. All the pushes together keep the balloon blown up. That is what we call pressure.",
   "داخل البالون تتحرك جسيمات الهواء الصغيرة وتصطدم بالمطاط باستمرار. كل اصطدام دفعة صغيرة إلى الخارج، ومجموع الدفعات يُبقي البالون منفوخًا. هذا ما نسميه الضغط."),
  draw:()=>{const cx=240,cy=270,rx=135,ry=150,o=[A.wipe(),A.p(ellP(cx,cy,rx,ry),"r",4.5),A.p(`M${cx-8} ${cy+ry+12}L${cx+8} ${cy+ry+12}L${cx} ${cy+ry}Z`,"r",3)];
   [["M190 200 L300 330 L200 360 L290 170 Z",2.6],["M170 300 L310 230 L250 380 L180 210 Z",3.1],["M220 160 L320 280 L160 260 L260 390 Z",2.9],["M280 200 L170 330 L300 380 L230 180 Z",3.4]].forEach(([d,t])=>o.push(A.flow(d,"b",2,t,6)));
   for(let i=0;i<8;i++){const a=i*Math.PI/4+.39,c=Math.cos(a),s=Math.sin(a);o.push(A.p(R.arrow(cx+c*rx*.86,cy+s*ry*.86,cx+c*rx*1.12,cy+s*ry*1.12),"r",3.5))}
   return[...o,A.tx("Luftpartiklar krockar",440,170,30,"k","start"),A.tx("med ballongens vägg.",440,210,30,"k","start"),A.tx("Varje krock = en knuff",440,290,30,"r","start"),A.tx("Alla knuffar = tryck",440,360,38,"b","start")]}},
 {say:t3("Trycket måste vara lagom. Blåser du in för lite luft blir ballongen slapp. Blåser du in för mycket blir trycket så stort att gummit inte håller, och ballongen spricker. Med lagom tryck blir den fin och spänd.",
   "The pressure must be just right. If you blow in too little air, the balloon is limp. If you blow in too much, the pressure gets so big that the rubber cannot hold, and the balloon bursts. With just the right pressure it is nice and tight.",
   "يجب أن يكون الضغط معتدلًا. إذا نفخت هواءً قليلًا يبقى البالون رخوًا، وإذا نفخت كثيرًا يصبح الضغط كبيرًا فلا يتحمله المطاط وينفجر البالون. مع الضغط المعتدل يكون مشدودًا وجميلًا."),
  draw:()=>{const slack="M112 300 Q100 250 126 232 Q146 218 160 244 Q174 268 166 300 Q154 322 138 330 Q120 322 112 300 Z";
   return[A.wipe(),ttl("Lagom tryck"),A.hatch(slack,"r"),A.p(slack,"r",4),A.p("M138 330 Q128 350 140 372","k",2.5),...balloon(400,235,70,88),
    A.p("M660 250 L630 180 M660 250 L722 196 M660 250 L730 270 M660 250 L690 330 M660 250 L600 316 M660 250 L586 240","o",3.5),A.tx("PANG!",660,165,48,"r"),
    A.tx("för lite luft",140,410,30,"k"),A.tx("slapp",140,446,26,"k"),A.tx("lagom",400,410,32,"g"),A.tx("fin och spänd",400,446,26,"g"),A.tx("för mycket",660,410,30,"k"),A.tx("spricker",660,446,26,"r")]}},
 {say:t3("Ett cykeldäck med för lågt tryck plattas till mot marken. Då blir det tungt att cykla och däcket slits fort. För högt tryck gör cykeln stötig och kan få däcket att spricka. På däckets sida står det vilket tryck som är lagom.",
   "A bike tyre with too low pressure is squashed flat against the ground. Then cycling is heavy and the tyre wears out fast. Too high pressure makes the bike bumpy and can burst the tyre. The side of the tyre says which pressure is right.",
   "إطار الدراجة ذو الضغط المنخفض ينبطح على الأرض، فيصبح ركوب الدراجة متعبًا ويتآكل الإطار بسرعة. والضغط المرتفع جدًا يجعل الدراجة تهتز وقد يفجّر الإطار. على جانب الإطار مكتوب الضغط المناسب."),
  draw:()=>{const flat="M110 290 Q110 200 200 200 Q290 200 290 290 Q290 356 262 380 L138 380 Q110 356 110 290 Z";
   return[A.wipe(),ttl("Däcket"),ground(40,760,382),A.p(flat,"k",10),A.p(R.circ(200,290,62),"#7d8ca6",3),A.p(R.circ(200,290,9),"k",4),A.p(spokes(200,290,60),"#7d8ca6",2),
    A.p(R.line(140,384,260,384,.2),"r",7),...wheel(580,290,90),A.p(R.line(560,384,600,384,.2),"r",7),
    A.tx("för lågt tryck",200,428,30,"r"),A.tx("tungt att cykla",200,464,26,"k"),A.tx("lagom tryck",580,428,30,"g"),A.tx("rullar lätt",580,464,26,"k")]}},
 {say:t3("Hjärtat pumpar ut blodet i blodkärlen med tryck. Då når blodet ända ut i fingrar och tår. För högt blodtryck sliter på hjärtat och kärlen. För lågt blodtryck kan göra att man blir yr. Även här är lagom bäst.",
   "The heart pumps the blood out into the blood vessels with pressure. Then the blood reaches all the way to fingers and toes. Too high blood pressure wears on the heart and vessels. Too low can make you dizzy. Here too, just right is best.",
   "يضخّ القلب الدم في الأوعية الدموية بضغط، فيصل الدم إلى أطراف الأصابع. ضغط الدم المرتفع جدًا يُتعب القلب والأوعية، والمنخفض جدًا قد يسبب الدوار. هنا أيضًا المعتدل هو الأفضل."),
  draw:()=>[A.wipe(),ttl("Blodtryck"),...heartBig(180,250,.82),A.beat(2,180,250,1.06,.9),A.p("M280 230 Q420 160 560 230 Q650 276 740 236","r",10),A.flow("M280 230 Q420 160 560 230 Q650 276 740 236","r",8,3,6),
   A.tx("blodkärl",470,150,30,"r"),A.tx("hjärtat pumpar",180,420,28,"k"),
   ...blist([["för högt: sliter på kärlen","r"],["för lågt: man blir yr","b"],["lagom: blodet når överallt","g"]],350,330,48,28)]},
 {say:t3("Tryck mäts i enheten pascal, Pa, efter den franske forskaren Blaise Pascal. En pascal är ett mycket litet tryck. Ett papper som ligger på ett bord trycker med ungefär 1 Pa. Därför använder vi ofta kilopascal: 1 kPa = 1 000 Pa.",
   "Pressure is measured in the unit pascal, Pa, after the French scientist Blaise Pascal. One pascal is a very small pressure. A sheet of paper lying on a table presses with about 1 Pa. So we often use kilopascals: 1 kPa = 1,000 Pa.",
   "يُقاس الضغط بوحدة الباسكال (Pa) نسبةً إلى العالم الفرنسي بليز باسكال. الباسكال ضغط صغير جدًا؛ فورقة على طاولة تضغط بنحو 1 باسكال. لذلك نستعمل غالبًا الكيلوباسكال: 1 kPa = 1000 Pa."),
  draw:()=>[A.wipe(),ttl("Enheten pascal"),A.tx("pascal (Pa)",210,170,50,"b"),A.tx("1 kPa = 1 000 Pa",210,255,42,"k"),A.tx("kilo = tusen",210,305,28,"k"),A.tx("Blaise Pascal, 1623–1662",210,390,24,"k"),
   A.p("M460 340 L760 340 M490 340 L490 430 M730 340 L730 430","#8a5a2b",5),A.hatch("M500 332 L690 332 L720 306 L530 306 Z","b"),A.p("M500 332 L690 332 L720 306 L530 306 Z","b",3),
   A.arrow(560,220,560,296,"b"),A.arrow(615,220,615,296,"b"),A.arrow(670,220,670,296,"b"),A.tx("ett papper på bordet",610,190,26,"k"),A.tx("≈ 1 Pa",610,470,36,"b")]},
 {say:t3("Här är några tryck att jämföra. Luften omkring oss trycker med ungefär 101 kPa. I ett bildäck är trycket ungefär 230 kPa högre än luftens. När hjärtat slår är trycket i blodet ungefär 16 kPa högre än luftens.",
   "Here are some pressures to compare. The air around us presses with about 101 kPa. In a car tyre the pressure is about 230 kPa higher than the air's. When the heart beats, the pressure in the blood is about 16 kPa higher than the air's.",
   "إليك بعض الضغوط للمقارنة. الهواء من حولنا يضغط بنحو 101 كيلوباسكال. في إطار السيارة يزيد الضغط بنحو 230 كيلوباسكال على ضغط الهواء. وعندما ينبض القلب يزيد ضغط الدم بنحو 16 كيلوباسكال على ضغط الهواء."),
  draw:()=>[A.wipe(),ttl("Några tryck"),...blist([["papper på ett bord: ca 1 Pa","k"],["luften omkring oss: ca 101 kPa","b"],["blodet: ca 16 kPa mer än luften","r"],["bildäck: ca 230 kPa mer än luften","k"]],90,160,70,32),
   note("Trycket i däck och blod jämförs ofta med luftens tryck.",462,"g",26)]},
 {say:t3("Kom ihåg: tryck är hur hårt något trycker på en yta. Tryck mäts i pascal, och 1 kPa är 1 000 Pa. I däck, ballonger och blodkärl ska trycket vara lagom, varken för högt eller för lågt.",
   "Remember: pressure is how hard something presses on a surface. Pressure is measured in pascals, and 1 kPa is 1,000 Pa. In tyres, balloons and blood vessels the pressure should be just right, neither too high nor too low.",
   "تذكّر: الضغط هو مدى شدة ضغط شيء على سطح. يُقاس الضغط بالباسكال، و1 كيلوباسكال = 1000 باسكال. في الإطارات والبالونات والأوعية الدموية يجب أن يكون الضغط معتدلًا."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["tryck = hur hårt något trycker på en yta","b"],["enheten är pascal, Pa","k"],["1 kPa = 1 000 Pa","k"],["trycket ska ofta vara lagom","g"]],70,160,64,30),...balloon(715,210,42,54)]},
]};
const P1={
 tyre:()=>{const flat="M110 290 Q110 200 200 200 Q290 200 290 290 Q290 356 262 380 L138 380 Q110 356 110 290 Z";return[ground(50,350,382),A.p(flat,"k",10),A.p(R.circ(200,290,62),"#7d8ca6",3),A.p(spokes(200,290,60),"#7d8ca6",2)]},
 burst:()=>[A.p("M200 250 L170 180 M200 250 L262 196 M200 250 L270 270 M200 250 L230 330 M200 250 L140 316 M200 250 L126 240","o",3.5),A.tx("PANG!",200,165,48,"r")],
 heart:()=>[...heartBig(150,260,.7),A.p("M240 240 Q300 200 360 240","r",9)],
};
const BANK_T1=[
 {lv:0,q:"Vad heter enheten för tryck?",a:"pascal",w:["newton","meter","kilogram"]},
 {lv:0,q:"Vad är 1 kPa?",a:"1 000 Pa",w:["100 Pa","10 Pa","1 000 000 Pa"]},
 {lv:0,q:"Vad händer med en ballong om trycket blir för stort?",a:"den spricker",w:["den blir slapp","den krymper","ingenting"]},
 {lv:0,q:"Vad är fel på däcket?",a:"trycket är för lågt",w:["trycket är för högt","trycket är lagom","däcket har inget tryck alls"],lines:["Vad är fel","på däcket?"],pic:P1.tyre},
 {lv:0,q:"Vad mäter skolsköterskan med en manschett på armen?",a:"blodtrycket",w:["däcktrycket","lufttrycket","vattentrycket"]},
 {lv:1,q:"Vad orsakar trycket inne i en ballong?",a:"luftpartiklar som krockar med gummit",w:["gummit som drar ihop sig","värmen från handen","snöret som håller den"]},
 {lv:1,q:"Varför spricker ballongen?",a:"trycket inne blev för stort",w:["trycket inne blev för litet","luften tog slut","gummit blev för tjockt"],lines:["Varför spricker","ballongen?"],pic:P1.burst},
 {lv:1,q:"Vad händer om cykeldäcket har för lågt tryck?",a:"det blir tungt att cykla",w:["cykeln går fortare","däcket spricker direkt","bromsarna slutar fungera"]},
 {lv:1,q:"Hur många pascal är 5 kPa?",a:"5 000 Pa",w:["500 Pa","50 Pa","50 000 Pa"]},
 {lv:1,q:"Ungefär hur stort tryck ger ett papper som ligger på ett bord?",a:"1 Pa",w:["1 kPa","100 kPa","1 000 Pa"]},
 {lv:1,q:"Vad pumpar hjärtat ut med tryck?",a:"blodet",w:["luften","maten","vattnet i magen"],lines:["Vad pumpar hjärtat","ut med tryck?"],pic:P1.heart},
 {lv:2,q:"Ungefär hur stort är lufttrycket omkring oss?",a:"101 kPa",w:["1 kPa","10 Pa","1 000 kPa"]},
 {lv:2,q:"Vilket är störst?",a:"250 kPa",w:["2 500 Pa","25 000 Pa","200 kPa"]},
 {lv:2,q:"Vad kan hända om blodtrycket är för lågt?",a:"man kan bli yr",w:["man blir starkare","hjärtat växer","blodet blir kallt"]},
 {lv:2,q:"Vem har fått ge namn åt enheten för tryck?",a:"Blaise Pascal",w:["Isaac Newton","Anders Celsius","Albert Einstein"]},
 {lv:2,q:"Hur många kPa är 3 000 Pa?",a:"3 kPa",w:["30 kPa","0,3 kPa","300 kPa"]},
 {lv:1,q:"Skriv enheten för tryck: …",a:["pascal","pa"],lines:["Skriv ordet som saknas:","Tryck mäts i enheten …"]},
 {lv:2,q:"Skriv ordet: trycket i blodkärlen heter …",a:["blodtryck","blodtrycket"],lines:["Skriv ordet som saknas:","Trycket i blodkärlen heter …"]},
];
LESSONS.push({id:"f7t1",subject:"science",grades:"7",kind:"wb",year:7,ord:41,
 title:t3("Lagom tryck","Just the right pressure","الضغط المعتدل"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><ellipse cx="90" cy="80" rx="42" ry="52" fill="#f9dcd8" stroke="#d63b2f" stroke-width="4"/><path d="M84 138H96L90 132Z" fill="#d63b2f"/><path d="M90 138Q80 152 92 168" stroke="#1d2433" stroke-width="2.5" fill="none"/><circle cx="225" cy="95" r="58" fill="none" stroke="#1d2433" stroke-width="10"/><circle cx="225" cy="95" r="8" fill="#1d2433"/><path d="M225 95L225 45M225 95L268 120M225 95L182 120" stroke="#7d8ca6" stroke-width="3"/></svg>`,
 steps:T1.steps,mount:wbMount(T1),gen:bankGen(BANK_T1)});
WORDS.f7t1=["f7t_tryck","f7t_pascal","f7t_kpa","f7t_blodtryck","f7t_dacktryck"];

/* ---------------------------------------------------------------
   2. f7t2: Tryck mot yta
   --------------------------------------------------------------- */
const SNOW=`<path d="M30 350 L770 350 L770 440 L30 440 Z" fill="#f4f8fd"/><path d="M30 350 L770 350" stroke="#9fb3cc" stroke-width="4" stroke-linecap="round"/>`;
const heelD="M60 328 Q58 305 95 302 Q130 300 160 282 Q190 262 214 262 L218 285 Q200 290 185 300 Q150 325 130 330 Z";
const bootD="M560 322 L560 260 L600 260 L610 300 L660 310 Q672 322 660 322 Z";
const T2={steps:[
 {say:t3("Gå i djup snö med vanliga skor, så sjunker du ner. Ta på dig snöskor eller skidor, så stannar du ovanpå, fast du väger precis lika mycket. Skillnaden är hur stor yta din tyngd fördelas på.",
   "Walk in deep snow in ordinary shoes and you sink. Put on snowshoes or skis and you stay on top, even though you weigh exactly the same. The difference is how big a surface your weight is spread over.",
   "امشِ في ثلج عميق بحذاء عادي فتغوص، والبس أحذية الثلج أو الزلاجات فتبقى فوقه مع أن وزنك هو نفسه. الفرق هو مساحة السطح الذي يتوزع عليه وزنك."),
  draw:()=>[A.wipe(),ttl("Tryck mot en yta"),A.art(KID,220,146,.6),A.art(KID,580,112,.6),A.art(SNOW,0,0,1),
   A.p(ellP(555,350,30,8),"k",4),A.p(ellP(605,350,30,8),"k",4),
   A.tx("liten yta → stort tryck",220,405,26,"r"),A.tx("stor yta → litet tryck",580,405,26,"g"),A.tx("vanliga skor: sjunker",220,470,28,"k"),A.tx("snöskor: stannar ovanpå",580,470,28,"k")]},
 {say:t3("Tryck är hur stor kraft som trycker på varje bit av en yta. Vi räknar ut trycket genom att dela kraften med arean: p = F / A. Bokstaven p står för tryck, F för kraft och A för area.",
   "Pressure is how much force pushes on each part of a surface. We work out the pressure by dividing the force by the area: p = F / A. The letter p stands for pressure, F for force and A for area.",
   "الضغط هو مقدار القوة التي تضغط على كل جزء من السطح. نحسبه بقسمة القوة على المساحة: p = F / A. الحرف p يعني الضغط، وF القوة، وA المساحة."),
  draw:()=>[A.wipe(),ttl("Tryck = kraft / area"),ground(60,400,380),...box(120,280,200,100),fa(220,120,220,268,"r"),A.tx("F",250,190,44,"r","start"),
   A.p(R.line(120,382,320,382,.2),"g",8),A.tx("A",220,432,44,"g"),A.tx("p =",578,245,60,"k"),...A.frac("F","A",640,235,60,"k"),
   A.tx("p = tryck",470,340,30,"b","start"),A.tx("F = kraft",470,385,30,"r","start"),A.tx("A = area",470,430,30,"g","start")]},
 {say:t3("Kraften mäts i newton, N, och arean i kvadratmeter, m². Då får trycket enheten N/m², som är samma sak som pascal. 1 Pa betyder alltså att en kraft på 1 newton fördelas på 1 kvadratmeter.",
   "Force is measured in newtons, N, and area in square metres, m². Then pressure gets the unit N/m², which is the same as a pascal. So 1 Pa means that a force of 1 newton is spread over 1 square metre.",
   "تُقاس القوة بالنيوتن والمساحة بالمتر المربع، فتكون وحدة الضغط نيوتن/م²، وهي نفسها الباسكال. إذن 1 باسكال يعني أن قوة 1 نيوتن موزعة على متر مربع واحد."),
  draw:()=>[A.wipe(),ttl("Enheter"),A.hatch("M70 390 L310 390 L370 290 L130 290 Z","g"),A.p("M70 390 L310 390 L370 290 L130 290 Z","g",4),A.tx("1 m",190,430,28,"g"),A.tx("1 m",350,355,28,"g","start"),
   fa(220,150,220,330,"r"),A.tx("1 N",240,200,32,"r","start"),
   A.tx("F i newton (N)",450,170,30,"r","start"),A.tx("A i kvadratmeter (m²)",450,225,30,"g","start"),A.tx("p i N/m² = pascal (Pa)",450,280,30,"b","start"),
   A.hl(470,360,270,60),A.tx("1 Pa = 1 N/m²",605,404,42,"b")]},
 {say:t3("Samma låda kan trycka olika mycket. Den väger 20 N. Ligger den ner fördelas kraften på 0,04 m², och trycket blir 500 Pa. Står den på högkant är arean bara 0,01 m², och trycket blir fyra gånger så stort: 2 000 Pa.",
   "The same box can press differently. It weighs 20 N. Lying down, the force is spread over 0.04 m², and the pressure is 500 Pa. Standing on end, the area is only 0.01 m², and the pressure is four times as big: 2,000 Pa.",
   "الصندوق نفسه قد يضغط بمقادير مختلفة. وزنه 20 نيوتن. إذا كان مستلقيًا توزعت القوة على 0,04 م² فيكون الضغط 500 باسكال، وإذا وقف على طرفه كانت المساحة 0,01 م² فقط فيصبح الضغط أربعة أضعاف: 2000 باسكال."),
  draw:()=>[A.wipe(),ttl("Samma kraft, olika area"),ground(40,360,380),...box(70,300,260,80),fa(200,190,200,290,"r"),A.tx("20 N",220,240,30,"r","start"),A.p(R.line(70,382,330,382,.2),"g",8),
   A.tx("A = 0,04 m²",200,420,28,"g"),A.tx("p = 20 / 0,04 = 500 Pa",200,460,28,"b"),
   ground(440,760,380),...box(520,160,60,220),fa(550,180,550,300,"r"),A.tx("20 N",595,240,30,"r","start"),A.p(R.line(520,382,580,382,.2),"g",8),
   A.tx("A = 0,01 m²",550,420,28,"g"),A.tx("p = 20 / 0,01 = 2 000 Pa",550,460,28,"b")]},
 {say:t3("Smala klackar har en mycket liten yta. Hela tyngden trycker på några kvadratcentimeter, så trycket blir stort och klacken sjunker ner i gräsmattan. Snöskor och skidor har stor yta och ger därför litet tryck.",
   "Thin heels have a very small surface. The whole weight presses on a few square centimetres, so the pressure is big and the heel sinks into the lawn. Snowshoes and skis have a big surface and so give a small pressure.",
   "الكعب الرفيع سطحه صغير جدًا، فيضغط الوزن كله على بضعة سنتيمترات مربعة، فيكون الضغط كبيرًا ويغوص الكعب في العشب. أما أحذية الثلج والزلاجات فسطحها كبير فتعطي ضغطًا صغيرًا."),
  draw:()=>[A.wipe(),ttl("Klackar och snöskor"),ground(30,370,330,"g"),A.p("M60 330 L56 316 M90 330 L94 314 M250 330 L246 316 M290 330 L296 314 M330 330 L326 316","g",3),
   A.hatch(heelD,"p"),A.p(heelD,"p",4),A.p("M211 285 L208 352","k",6),A.p(R.circ(208,352,7),"r",3),A.tx("liten area",210,400,28,"r"),A.tx("stort tryck",210,436,28,"r"),
   A.p(R.line(430,332,770,332,.4),"#9fb3cc",4),A.hatch(bootD,"b"),A.p(bootD,"b",4),A.p(ellP(600,326,120,10),"k",4),A.p("M500 326 L700 326 M540 318 L540 334 M600 316 L600 336 M660 318 L660 334","#7d8ca6",2),
   A.tx("stor area",600,400,28,"g"),A.tx("litet tryck",600,436,28,"g"),note("Samma tyngd. Arean avgör trycket.",480,"b",28)]},
 {say:t3("En vass kniv har en mycket tunn egg. Kraften från handen samlas på en liten area, så trycket blir stort och kniven skär lätt. En slö kniv har bredare egg och större area. Samma kraft ger då mindre tryck. Spikar och nålar är spetsiga av samma skäl.",
   "A sharp knife has a very thin edge. The force from your hand is gathered on a small area, so the pressure is big and the knife cuts easily. A blunt knife has a wider edge and larger area, so the same force gives less pressure. Nails and needles are pointed for the same reason.",
   "للسكين الحادة حافة رقيقة جدًا، فتتجمع قوة اليد على مساحة صغيرة ويكون الضغط كبيرًا فتقطع بسهولة. أما السكين الكليلة فحافتها أعرض ومساحتها أكبر، فتعطي القوة نفسها ضغطًا أقل. وللسبب نفسه تكون المسامير والإبر مدببة."),
  draw:()=>[A.wipe(),ttl("Vass och slö kniv"),A.hatch("M140 170 L200 170 L172 340 L168 340 Z","k"),A.p("M140 170 L200 170 L172 340 L168 340 Z","k",4),fa(170,92,170,160,"r"),
   A.p("M60 348 Q170 322 280 348","r",4),A.tx("tunn egg",170,392,28,"k"),A.tx("liten area → stort tryck",170,432,26,"r"),
   A.hatch("M520 170 L600 170 L574 340 L546 340 Z","k"),A.p("M520 170 L600 170 L574 340 L546 340 Z","k",4),fa(560,92,560,160,"r"),
   A.p("M450 348 Q560 322 670 348","r",4),A.tx("bred egg",560,392,28,"k"),A.tx("större area → mindre tryck",560,432,26,"o")]},
 {say:t3("Ett räkneexempel. Elsa har massan 50 kg. Det ger tyngden ungefär 500 N. Hennes skor har sammanlagt arean 0,025 m². Trycket blir p = F / A = 500 / 0,025 = 20 000 Pa, alltså 20 kPa.",
   "A worked example. Elsa has a mass of 50 kg. That gives a weight of about 500 N. Her shoes have a total area of 0.025 m². The pressure is p = F / A = 500 / 0.025 = 20,000 Pa, that is 20 kPa.",
   "مثال حسابي: كتلة إلسا 50 كغ، فيكون وزنها نحو 500 نيوتن. مساحة حذاءيها معًا 0,025 م². الضغط p = F / A = 500 / 0,025 = 20000 باسكال، أي 20 كيلوباسكال."),
  draw:()=>[A.wipe(),ttl("Räkneexempel"),A.tx("Elsa: 50 kg",60,140,30,"k","start"),A.tx("tyngd: F ≈ 500 N",60,190,30,"r","start"),A.tx("skornas area: A = 0,025 m²",60,240,30,"g","start"),
   A.tx("1 kg ≈ 10 N",650,190,30,"o"),A.tx("p = F / A",400,310,40,"k"),A.tx("p = 500 / 0,025",400,365,40,"k"),A.hl(190,394,420,56),A.tx("p = 20 000 Pa = 20 kPa",400,436,42,"b")]},
 {say:t3("Med skidor är arean 0,25 m², tio gånger större än skornas. Då blir trycket tio gånger mindre: 500 / 0,25 = 2 000 Pa. Kom ihåg: liten area ger stort tryck, och stor area ger litet tryck.",
   "With skis the area is 0.25 m², ten times bigger than the shoes. Then the pressure is ten times smaller: 500 / 0.25 = 2,000 Pa. Remember: a small area gives a big pressure, and a big area gives a small pressure.",
   "مع الزلاجات تكون المساحة 0,25 م²، أي أكبر بعشر مرات من الحذاء، فيصغر الضغط عشر مرات: 500 / 0,25 = 2000 باسكال. تذكّر: المساحة الصغيرة تعطي ضغطًا كبيرًا، والمساحة الكبيرة تعطي ضغطًا صغيرًا."),
  draw:()=>[A.wipe(),ttl("Med skidor"),A.tx("A = 0,25 m² (tio gånger större)",400,150,32,"g"),A.tx("p = 500 / 0,25 = 2 000 Pa",400,215,40,"b"),A.tx("trycket blir tio gånger mindre",400,268,30,"k"),
   A.band(80,305,640,160,"b"),A.tx("Kom ihåg:",110,350,32,"b","start"),A.tx("liten area ger stort tryck",110,398,32,"r","start"),A.tx("stor area ger litet tryck",110,444,32,"g","start")]},
]};
const P2={
 box:()=>[ground(40,370,380),...box(90,280,200,100),fa(190,140,190,268,"r"),A.tx("40 N",210,200,32,"r","start"),A.p(R.line(90,382,290,382,.2),"g",8),A.tx("A = 0,02 m²",190,428,30,"g")],
 shoes:()=>[ground(30,370,330,"g"),A.hatch(heelD,"p"),A.p(heelD,"p",4),A.p("M211 285 L208 352","k",6),A.tx("A",140,400,40,"k"),
   A.p(R.line(30,250,370,250,.3),"#c7cfdc",2),A.p("M60 220 L60 170 L100 170 L110 205 L160 215 Q172 226 160 226 Z","b",4),A.p(ellP(110,232,90,9),"k",4),A.tx("B",240,215,40,"k")],
};
const BANK_T2=[
 {lv:0,q:"Hur räknar man ut tryck?",a:"kraft delat med area",w:["kraft gånger area","area delat med kraft","kraft plus area"]},
 {lv:0,q:"Vilken enhet har kraft?",a:"newton",w:["pascal","kvadratmeter","meter"]},
 {lv:0,q:"Varför sjunker man inte ner i snön med snöskor?",a:"tyngden fördelas på en större yta",w:["man blir lättare","snön blir hårdare","skorna är varma"]},
 {lv:0,q:"Vad står A för i p = F / A?",a:"area",w:["kraft","tryck","tid"]},
 {lv:1,q:"Hur stort är trycket?",a:"2 000 Pa",w:["800 Pa","20 Pa","0,8 Pa"],lines:["Hur stort är trycket","från lådan på golvet?"],pic:P2.box},
 {lv:1,q:"Vilken sko ger störst tryck mot marken (samma tyngd)?",a:"A, klacken",w:["B, snöskon","lika stort tryck","går inte att säga"],lines:["Vilken ger störst","tryck mot marken?","(samma tyngd)"],pic:P2.shoes},
 {lv:1,q:"En kraft på 100 N trycker på 2 m². Hur stort är trycket?",a:"50 Pa",w:["200 Pa","102 Pa","98 Pa"]},
 {lv:1,q:"Varför skär en vass kniv bättre än en slö?",a:"eggen har liten area, så trycket blir stort",w:["eggen har stor area, så trycket blir stort","den vassa kniven är tyngre","den slöa kniven är för kall"]},
 {lv:1,q:"1 N/m² är samma sak som …",a:"1 Pa",w:["1 kPa","1 N","1 kg"]},
 {lv:1,q:"Ungefär hur stor tyngd har en massa på 60 kg?",a:"600 N",w:["60 N","6 N","6 000 N"]},
 {lv:2,q:"En person som väger 600 N står på 0,03 m². Hur stort är trycket?",a:"20 000 Pa",w:["18 Pa","2 000 Pa","200 000 Pa"]},
 {lv:2,q:"Samma kraft trycker på en area som är hälften så stor. Vad händer med trycket?",a:"det blir dubbelt så stort",w:["det blir hälften så stort","det blir lika stort","det blir noll"]},
 {lv:2,q:"En bil väger 12 000 N och står på fyra däck med 0,02 m² var. Hur stort är trycket mot marken?",a:"150 kPa",w:["600 kPa","15 kPa","240 kPa"],lines:["Bilen väger 12 000 N.","Fyra däck, 0,02 m² var.","Hur stort är trycket?"]},
 {lv:2,q:"En kraft på 900 N fördelas på 0,3 m². Hur stort blir trycket?",a:"3 000 Pa",w:["270 Pa","300 Pa","30 000 Pa"]},
 {lv:2,q:"Varför har stora traktorer breda däck?",a:"för att få mindre tryck mot marken",w:["för att få större tryck mot marken","för att köra fortare","för att väga mindre"]},
 {lv:2,q:"En låda som väger 20 N står på 0,01 m². Hur stort är trycket?",a:"2 000 Pa",w:["200 Pa","0,2 Pa","20 000 Pa"]},
 {lv:1,q:"Skriv ordet: tryck = kraft delat med …",a:["area","arean"],lines:["Skriv ordet som saknas:","Tryck = kraft delat med …"]},
 {lv:2,q:"Skriv enheten för kraft: …",a:["newton","n"],lines:["Skriv ordet som saknas:","Kraft mäts i enheten …"]},
];
LESSONS.push({id:"f7t2",subject:"science",grades:"7",kind:"wb",year:7,ord:42,
 title:t3("Tryck mot yta","Pressure on a surface","الضغط على سطح"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M30 150H290" stroke="#8a5a2b" stroke-width="4"/><rect x="50" y="100" width="110" height="50" fill="#fbe5c8" stroke="#1d2433" stroke-width="3"/><path d="M105 30V92M95 80L105 94L115 80" stroke="#d63b2f" stroke-width="5" fill="none"/><rect x="215" y="40" width="34" height="110" fill="#fbe5c8" stroke="#1d2433" stroke-width="3"/><path d="M50 154H160" stroke="#1e9e5a" stroke-width="6"/><path d="M215 154H249" stroke="#1e9e5a" stroke-width="6"/></svg>`,
 steps:T2.steps,mount:wbMount(T2),gen:bankGen(BANK_T2)});
WORDS.f7t2=["f7t_tryck","f7t_area","f7t_newton","f7t_kvm","f7t_tyngd","f7t_pascal"];

/* ---------------------------------------------------------------
   3. f7t3: Luften trycker
   --------------------------------------------------------------- */
/* dots of air: many near the ground, fewer higher up */
const airDots=(x0,x1,yb,yt)=>{const pts=[];let y=yb-8,gap=12,k=0;while(y>yt){const n=Math.max(1,Math.round((x1-x0)/(10+(yb-y)*.28)));for(let i=0;i<n;i++){k++;pts.push([Math.round(x0+8+((i+.5)/n)*(x1-x0-16)+Math.sin(k*7.1)*5),Math.round(y+Math.sin(k*3.3)*3)])}y-=gap;gap*=1.12}return dotsP(pts)};
const stick=(x,y,s=1)=>A.p(`${R.circ(x,y-50*s,9*s)}M${x} ${y-41*s}L${x} ${y-16*s}M${x} ${y-16*s}L${x-10*s} ${y}M${x} ${y-16*s}L${x+10*s} ${y}M${x-12*s} ${y-34*s}L${x+12*s} ${y-34*s}`,"k",3);
const MOUNT="M30 430 L170 260 L210 290 L260 148 L330 250 L370 220 L470 430 Z";
const strawGlass=()=>[A.hatch("M308 262 L492 262 L472 430 L328 430 Z","o"),glass(300,200,200,230),A.p(R.line(308,262,492,262,.3),"o",3),
  A.hatch(rp(420,150,16,272),"o"),A.p("M420 110 L420 420 M436 110 L436 420","r",3)];
const T3={steps:[
 {say:t3("Runt jorden finns ett lager av luft, atmosfären. Luften är lätt, men den är inte tyngdlös. Ovanför dig står en hög pelare av luft, flera mil hög. Hela den luftens tyngd trycker på dig och på allt omkring dig. Det kallas lufttryck.",
   "Around the Earth is a layer of air, the atmosphere. Air is light, but it is not weightless. Above you stands a tall column of air, many kilometres high. The weight of all that air presses on you and everything around you. That is called air pressure.",
   "حول الأرض طبقة من الهواء هي الغلاف الجوي. الهواء خفيف لكنه ليس بلا وزن. فوقك عمود عالٍ من الهواء يرتفع عشرات الكيلومترات، ووزن هذا الهواء كله يضغط عليك وعلى كل ما حولك. هذا هو الضغط الجوي."),
  draw:()=>[A.wipe(),ttl("Luften trycker"),A.hatch("M20 430 Q400 380 780 430 L780 470 L20 470 Z","g"),A.p("M20 430 Q400 380 780 430","g",4),
   dsh(330,405,330,100,"k",2.5),dsh(470,405,470,100,"k",2.5),A.p(airDots(330,470,405,105),"b",6),stick(400,402,.9),
   fa(530,130,530,380,"r"),A.tx("lufttryck",550,270,30,"r","start"),A.tx("atmosfären",200,150,30,"b"),A.tx("flera mil hög",200,190,26,"k"),A.tx("luftpelare",200,330,28,"k")]},
 {say:t3("Vid havsytan är lufttrycket ungefär 101 kPa. Det betyder att luften trycker med en kraft som motsvarar ungefär 10 ton på varje kvadratmeter. På din tumnagel trycker luften lika mycket som en vikt på ett kilo.",
   "At sea level the air pressure is about 101 kPa. That means the air presses with a force like about 10 tonnes on each square metre. On your thumbnail the air presses as much as a weight of one kilogram.",
   "عند سطح البحر يبلغ الضغط الجوي نحو 101 كيلوباسكال، أي أن الهواء يضغط بقوة تعادل نحو 10 أطنان على كل متر مربع. وعلى ظفر إبهامك يضغط الهواء بقدر وزن كيلوغرام واحد."),
  draw:()=>[A.wipe(),ttl("Hur stort är lufttrycket?"),A.tx("vid havsytan: ca 101 kPa",400,125,34,"b"),
   A.hatch("M60 410 L300 410 L360 330 L120 330 Z","b"),A.p("M60 410 L300 410 L360 330 L120 330 Z","b",4),...[130,190,250,310].map(x=>fa(x,200,x,350,"r",4)),
   A.tx("≈ 10 ton",215,186,34,"r"),A.tx("på 1 m²",210,455,30,"b"),
   A.p("M560 440 L560 330 Q560 300 600 300 Q640 300 640 330 L640 440","k",4),A.p(R.rect(575,312,50,40,.3),"p",3),
   A.hatch("M565 230 L635 230 L650 292 L550 292 Z","k"),A.p("M565 230 L635 230 L650 292 L550 292 Z","k",4),A.tx("1 kg",600,280,28,"k"),
   A.tx("på tumnageln",600,205,28,"k"),A.tx("≈ 1 kg",675,350,32,"r","start")]},
 {say:t3("Varför blir vi inte mosade? Lufttrycket trycker åt alla håll: uppifrån, nerifrån och från sidorna. Inne i kroppen är trycket lika stort och trycker emot. Därför märker vi inte lufttrycket.",
   "Why are we not squashed? Air pressure pushes in all directions: from above, from below and from the sides. Inside the body the pressure is just as big and pushes back. That is why we do not notice the air pressure.",
   "لماذا لا نُسحق؟ الضغط الجوي يضغط في كل الاتجاهات: من الأعلى والأسفل والجوانب، وداخل الجسم ضغط مساوٍ يدفع في الاتجاه المعاكس. لذلك لا نشعر بالضغط الجوي."),
  draw:()=>{const o=[A.wipe(),ttl("Lufttrycket trycker åt alla håll"),A.art(KID,400,100,.82)];
   [0,30,60,120,150,180,210,240,300,330].forEach(d=>{const a=d*Math.PI/180,c=Math.cos(a),s=Math.sin(a);o.push(A.p(R.arrow(400+c*270,268+s*175,400+c*160,268+s*135),"b",4))});
   return[...o,note("Inifrån trycker kroppen lika mycket emot.",476,"g",28)]}},
 {say:t3("Ju högre upp du kommer, desto mindre luft finns ovanför dig. Därför minskar lufttrycket med höjden. På 5,5 km höjd är det bara hälften så stort som vid havet, och på toppen av Mount Everest ungefär en tredjedel. Där blir man lätt andfådd.",
   "The higher up you go, the less air there is above you. So air pressure falls with height. At 5.5 km it is only half as big as at the sea, and at the top of Mount Everest about a third. There you easily get out of breath.",
   "كلما صعدت أعلى قلّ الهواء فوقك، لذلك يقل الضغط الجوي مع الارتفاع. على ارتفاع 5,5 كم يكون نصف ما هو عليه عند البحر، وعلى قمة إفرست نحو الثلث، وهناك يلهث المرء بسهولة."),
  draw:()=>[A.wipe(),ttl("Lufttrycket minskar med höjden"),A.hatch(MOUNT,"k"),A.p(MOUNT,"k",4),A.hatch("M236 216 L260 148 L292 205 Z","b"),A.tx("Mount Everest",225,150,24,"k","end"),
   A.p(R.line(560,430,560,100,.3),"k",4),...[[430,"0 km: 101 kPa","b"],[254,"5,5 km: 50 kPa","b"],[148,"8,8 km: 33 kPa","r"],[110,"10 km: 26 kPa","r"]].flatMap(([y,s,c])=>[A.p(R.line(550,y,570,y,.1),"k",4),A.tx(s,585,y+9,26,c,"start")]),
   dsh(262,148,550,148,"k",2),A.p("M440 112 L520 112 M470 112 L455 92 M470 112 L455 132 M440 112 L432 100","k",4),A.tx("flygplan",425,120,22,"k","end")]},
 {say:t3("När du dricker med sugrör suger du ut luften ur röret. Då blir trycket i röret lägre. Luften utanför trycker fortfarande på saftens yta och pressar upp saften i röret. Det är alltså luften som trycker upp drycken!",
   "When you drink through a straw you suck the air out of it. Then the pressure in the straw is lower. The air outside still presses on the surface of the juice and pushes the juice up the straw. So it is the air that pushes the drink up!",
   "عندما تشرب بالمصاصة تسحب الهواء منها، فيقل الضغط داخلها. أما الهواء في الخارج فيظل يضغط على سطح العصير ويدفعه إلى أعلى المصاصة. إذن الهواء هو الذي يدفع الشراب إلى الأعلى!"),
  draw:()=>[A.wipe(),ttl("Sugröret"),...strawGlass(),A.flow("M428 410 L428 120","o",5,2.5,5),
   A.arrow(340,180,345,250,"b"),A.arrow(380,180,382,250,"b"),A.arrow(470,180,466,250,"b"),
   A.tx("lufttrycket",270,215,30,"b","end"),A.tx("trycker ner",270,252,30,"b","end"),A.tx("lågt tryck",470,125,28,"r","start"),A.tx("i röret",470,160,28,"r","start"),
   A.tx("saften trycks upp",520,340,28,"o","start")]},
 {say:t3("En sugkopp fungerar på liknande sätt. När du trycker den mot kaklet pressas luften ut under den. Där blir trycket lågt, och lufttrycket utanför trycker fast koppen mot väggen.",
   "A suction cup works in a similar way. When you press it against the tiles, the air under it is pushed out. There the pressure is low, and the air pressure outside holds the cup against the wall.",
   "كأس الشفط تعمل بطريقة مشابهة. عندما تضغطها على البلاط يخرج الهواء من تحتها، فيقل الضغط هناك، ويثبّت الضغط الجوي الخارجي الكأس على الجدار."),
  draw:()=>[A.wipe(),ttl("Sugkoppen"),A.band(520,100,240,350,"b"),A.p(R.line(520,100,520,450,.3),"k",5),A.p("M520 180 L760 180 M520 260 L760 260 M520 340 L760 340 M640 100 L640 450","#9fb3cc",2),
   A.hatch("M520 200 Q440 210 430 270 Q440 330 520 340 Z","r"),A.p("M520 200 Q440 210 430 270 Q440 330 520 340","r",4.5),A.p("M430 270 L372 270","r",6),A.p(R.circ(360,270,12),"r",4),
   ...callout([500,270],560,232,"lågt tryck","r",26),fa(300,170,430,222,"b",4),fa(270,270,345,270,"b",4),fa(300,370,430,318,"b",4),
   A.tx("lufttrycket trycker",230,420,28,"b"),A.tx("koppen mot väggen",230,455,28,"b")]},
 {say:t3("Ett försök: häll lite vatten i en läskburk och värm tills det kokar. Burken fylls av vattenånga. Vänd den snabbt ner i kallt vatten. Ångan blir till vatten igen, trycket i burken sjunker och lufttrycket krossar burken. Gör det bara med en vuxen.",
   "An experiment: pour a little water into a can and heat it until it boils. The can fills with steam. Quickly turn it upside down into cold water. The steam turns back into water, the pressure in the can drops and the air pressure crushes the can. Only do this with an adult.",
   "تجربة: ضع قليلًا من الماء في علبة مشروبات وسخّنها حتى يغلي، فتمتلئ العلبة ببخار الماء. اقلبها بسرعة في ماء بارد، فيعود البخار ماءً وينخفض الضغط داخلها ويسحقها الضغط الجوي. لا تقم بها إلا مع شخص بالغ."),
  draw:()=>[A.wipe(),ttl("Burken som krossas"),A.p(R.rect(90,380,100,20,.3),"k",4),A.hatch(rp(96,384,88,12),"r"),A.p(R.rect(110,260,60,120,.3),"k",4),
   A.flow("M130 255 Q120 220 135 190 Q150 160 135 130","#7d8ca6",3,2.4,5),A.flow("M152 255 Q165 220 150 190 Q138 160 155 130","#7d8ca6",3,2.8,5),
   A.tx("1. koka lite vatten",140,440,22,"k"),A.tx("burken fylls av ånga",140,470,22,"k"),
   A.p("M320 330 L330 420 L470 420 L480 330","k",4),...water(324,350,152,68),A.p(R.rect(370,270,60,100,.3),"k",4),A.arrow(330,200,370,250,"k",-20),
   A.tx("2. vänd ner i",400,440,22,"k"),A.tx("kallt vatten",400,470,22,"k"),
   A.p("M630 260 L690 260 L680 290 L695 320 L675 350 L690 380 L630 380 L645 350 L625 320 L640 290 Z","k",4),
   fa(570,320,618,320,"b",4),fa(750,320,702,320,"b",4),fa(660,190,660,248,"b",4),A.tx("3. lufttrycket",660,440,22,"k"),A.tx("krossar burken",660,470,22,"b")]},
 {say:t3("Kom ihåg: luften har tyngd och trycker på allt. Vid havsytan är lufttrycket ungefär 101 kPa, och det minskar med höjden. Lufttrycket trycker åt alla håll. Sugrör och sugkoppar fungerar tack vare lufttrycket.",
   "Remember: air has weight and presses on everything. At sea level the air pressure is about 101 kPa, and it falls with height. Air pressure pushes in all directions. Straws and suction cups work thanks to air pressure.",
   "تذكّر: للهواء وزن وهو يضغط على كل شيء. عند سطح البحر يبلغ الضغط الجوي نحو 101 كيلوباسكال ويقل مع الارتفاع. الضغط الجوي يؤثر في كل الاتجاهات، وبفضله تعمل المصاصات وكؤوس الشفط."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["luften har tyngd och trycker på allt","b"],["vid havsytan: ca 101 kPa","b"],["trycket minskar med höjden","k"],["lufttrycket trycker åt alla håll","g"],["sugrör och sugkoppar använder det","o"]],90,150,62,30)]},
]};
const P3={
 straw:()=>[A.hatch("M88 262 L272 262 L252 430 L108 430 Z","o"),glass(80,200,200,230),A.hatch(rp(200,150,16,272),"o"),A.p("M200 110 L200 420 M216 110 L216 420","r",3),
   A.arrow(120,190,124,250,"b"),A.arrow(250,190,246,250,"b"),A.tx("?",150,180,40,"b")],
 mountain:()=>[A.hatch("M30 430 L130 290 L170 310 L220 150 L290 270 L330 240 L380 430 Z","k"),A.p("M30 430 L130 290 L170 310 L220 150 L290 270 L330 240 L380 430 Z","k",4),
   ...[[45,409,"A",-24],[100,332,"B",-28],[220,150,"C",26]].flatMap(([x,y,s,dx])=>[A.p(R.circ(x,y,7),"r",4),A.tx(s,x+dx,y-6,34,"r")])],
};
const BANK_T3=[
 {lv:0,q:"Vad heter lagret av luft runt jorden?",a:"atmosfären",w:["havet","berggrunden","rymden"]},
 {lv:0,q:"Ungefär hur stort är lufttrycket vid havsytan?",a:"101 kPa",w:["10 Pa","1 kPa","1 000 kPa"]},
 {lv:0,q:"Vad händer med lufttrycket när man åker upp på ett högt berg?",a:"det minskar",w:["det ökar","det är lika stort","det försvinner helt"]},
 {lv:0,q:"Vad trycker upp saften i sugröret?",a:"lufttrycket på saftens yta",w:["sugröret själv","tyngdkraften","värmen i munnen"],lines:["Vad trycker upp","saften i sugröret?"],pic:P3.straw},
 {lv:1,q:"Varför har luften ett tryck?",a:"luften har tyngd",w:["luften är varm","luften är osynlig","luften rör sig inte"]},
 {lv:1,q:"Var är lufttrycket lägst?",a:"C, på toppen",w:["A, vid foten","B, halvvägs upp","lika överallt"],lines:["Var är lufttrycket","lägst?"],pic:P3.mountain},
 {lv:1,q:"Varför blir vi inte mosade av lufttrycket?",a:"trycket inne i kroppen trycker emot lika mycket",w:["luften väger ingenting","lufttrycket finns bara ute","vi är för tunga"]},
 {lv:1,q:"Varför sitter en sugkopp fast på kaklet?",a:"lufttrycket utanför är större än trycket under koppen",w:["gummit är klibbigt","kaklet drar i koppen","trycket under koppen är större"]},
 {lv:1,q:"Hur stort är lufttrycket ungefär på 5,5 km höjd?",a:"hälften så stort som vid havet",w:["dubbelt så stort som vid havet","lika stort som vid havet","noll"]},
 {lv:1,q:"Hur många pascal är 101 kPa?",a:"101 000 Pa",w:["10 100 Pa","1 010 Pa","1 010 000 Pa"]},
 {lv:2,q:"Varför krossas den heta burken i kallt vatten?",a:"ångan blir vatten och trycket i burken sjunker",w:["vattnet är tungt","burken blir varmare","trycket i burken ökar"]},
 {lv:2,q:"Lufttrycket är ca 100 000 Pa. Hur stor kraft trycker på en bordsskiva på 2 m²?",a:"ca 200 000 N",w:["ca 50 000 N","ca 2 000 N","ca 100 000 N"],lines:["Lufttrycket ≈ 100 000 Pa.","Bordsskivan är 2 m².","Hur stor är kraften?"]},
 {lv:2,q:"Varför går bordsskivan inte sönder av lufttrycket?",a:"luften trycker lika mycket underifrån",w:["luften väger ingenting","bordet är av metall","lufttrycket finns bara utomhus"]},
 {lv:2,q:"Ungefär hur stort är lufttrycket på toppen av Mount Everest?",a:"ca 33 kPa",w:["ca 101 kPa","ca 200 kPa","ca 3 kPa"]},
 {lv:2,q:"Varför blir man lätt andfådd högt uppe på ett berg?",a:"lufttrycket är lågt, så det finns mindre syre i varje andetag",w:["det är för varmt","luften är tyngre där","man väger mer där"]},
 {lv:2,q:"På tumnageln (ca 1 cm²) trycker luften med ungefär …",a:"10 N",w:["1 000 N","0,1 N","100 N"]},
 {lv:1,q:"Skriv ordet: lagret av luft runt jorden heter …",a:["atmosfären","atmosfär","atmosfæren"],lines:["Skriv ordet som saknas:","Lagret av luft runt jorden heter …"]},
 {lv:2,q:"Skriv ordet: ett utrymme helt utan luft kallas …",a:["vakuum","vacuum","vakum"],lines:["Skriv ordet som saknas:","Ett utrymme helt utan luft kallas …"]},
];
LESSONS.push({id:"f7t3",subject:"science",grades:"7",kind:"wb",year:7,ord:43,
 title:t3("Luften trycker","Air presses","الهواء يضغط"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M20 160Q160 140 300 160" stroke="#1e9e5a" stroke-width="4" fill="none"/><path d="M130 150V20M190 150V20" stroke="#1d2433" stroke-width="2.5" stroke-dasharray="6 6"/><g fill="#2257c9"><circle cx="145" cy="140" r="4"/><circle cx="165" cy="138" r="4"/><circle cx="180" cy="142" r="4"/><circle cx="150" cy="120" r="4"/><circle cx="172" cy="118" r="4"/><circle cx="160" cy="95" r="4"/><circle cx="145" cy="70" r="4"/><circle cx="178" cy="55" r="4"/></g><path d="M240 30V130M228 116L240 132L252 116" stroke="#d63b2f" stroke-width="5" fill="none"/></svg>`,
 steps:T3.steps,mount:wbMount(T3),gen:bankGen(BANK_T3)});
WORDS.f7t3=["f7t_lufttryck","f7t_atmosfar","f7t_vakuum","f7t_sugkopp","f7t_kpa"];

/* ---------------------------------------------------------------
   4. f7t4: Vatten lyfter
   --------------------------------------------------------------- */
const jet=(x,y,range,yg)=>`M${x} ${y}Q${x+range/2} ${y} ${x+range} ${yg}`;
const T4={steps:[
 {say:t3("Har du dykt till botten av en djup bassäng? Då känner du hur det trycker i öronen. Vatten är mycket tyngre än luft, och ju djupare du dyker, desto mer vatten finns ovanför dig. Trycket i vattnet ökar med djupet.",
   "Have you dived to the bottom of a deep pool? Then you feel the pressure in your ears. Water is much heavier than air, and the deeper you dive, the more water there is above you. The pressure in water increases with depth.",
   "هل غصت إلى قاع مسبح عميق؟ عندها تشعر بالضغط في أذنيك. الماء أثقل بكثير من الهواء، وكلما غصت أعمق زاد الماء فوقك. الضغط في الماء يزداد مع العمق."),
  draw:()=>[A.wipe(),ttl("Vatten trycker"),...water(80,130,640,310),tank(80,110,640,330),...swimmer(300,190),...squeeze(300,190,58,22,"g"),...swimmer(560,320),...squeeze(560,320,58,46,"r"),
   A.tx("grunt: litet tryck",280,478,28,"g"),A.tx("djupt: stort tryck",560,478,28,"r"),fa(110,150,110,420,"k",3.5),A.tx("djupare",130,320,26,"k","start")]},
 {say:t3("Ett försök visar det. Gör tre hål på olika höjd i en hög flaska med vatten. Ur det nedersta hålet sprutar vattnet ut kraftigast, för där är trycket störst. Strålarna visar också att vattnet trycker åt sidan, inte bara nedåt.",
   "An experiment shows it. Make three holes at different heights in a tall bottle of water. The water spurts out hardest from the lowest hole, because the pressure is biggest there. The jets also show that water pushes sideways, not only down.",
   "تجربة تُظهر ذلك: اصنع ثلاثة ثقوب على ارتفاعات مختلفة في قارورة طويلة مليئة بالماء. يندفع الماء بأقوى شكل من الثقب الأدنى لأن الضغط هناك أكبر. وتُظهر الدفقات أيضًا أن الماء يضغط جانبيًا لا إلى الأسفل فقط."),
  draw:()=>[A.wipe(),ttl("Tre hål i en flaska"),ground(40,760,430),A.p(R.rect(190,280,120,150,.3),"k",4),A.hatch(rp(190,280,120,150),"k"),
   ...water(202,110,96,170),A.p("M200 280 L200 90 M300 280 L300 90","k",4.5),
   ...[[150,212],[200,288],[250,317]].flatMap(([y,r])=>[A.p(jet(300,y,r,430),"b",3),A.flow(jet(300,y,r,430),"b",5,1.6,5)]),
   A.tx("litet tryck",185,158,26,"g","end"),A.tx("större",185,208,26,"o","end"),A.tx("störst tryck",185,258,26,"r","end"),
   note("Vattnet trycker åt alla håll, även åt sidan.",478,"b",26)]},
 {say:t3("För varje meter du dyker ökar trycket med ungefär 10 kPa. På 10 meters djup trycker vattnet alltså med ungefär 100 kPa, lika mycket som hela luften ovanför. Där är trycket totalt ungefär 200 kPa, dubbelt så stort som vid ytan.",
   "For every metre you dive, the pressure increases by about 10 kPa. So at 10 metres the water presses with about 100 kPa, as much as all the air above. There the total pressure is about 200 kPa, twice as big as at the surface.",
   "مع كل متر تغوصه يزداد الضغط بنحو 10 كيلوباسكال. إذن على عمق 10 أمتار يضغط الماء بنحو 100 كيلوباسكال، أي بقدر الهواء كله فوقه، ويكون الضغط الكلي هناك نحو 200 كيلوباسكال، ضعف ما هو عند السطح."),
  draw:()=>{const o=[A.wipe(),ttl("Trycket ökar med djupet"),...water(80,110,220,330),tank(80,100,220,340)];
   [150,220,290,360,420].forEach(y=>{const L=18+(y-110)*.2;o.push(A.p(R.arrow(92+L+14,y,92,y),"r",3.5),A.p(R.arrow(288-L-14,y,288,y),"r",3.5))});
   [[110,"0 m"],[275,"5 m"],[440,"10 m"]].forEach(([y,s])=>o.push(A.p(R.line(300,y,318,y,.1),"k",4),A.tx(s,325,y+9,26,"k","start")));
   return[...o,A.tx("vid ytan: 101 kPa",420,150,30,"b","start"),A.tx("1 m: ca 111 kPa",420,205,30,"b","start"),A.tx("10 m: ca 200 kPa",420,260,30,"r","start"),A.tx("20 m: ca 300 kPa",420,315,30,"r","start"),
    A.hl(430,370,320,60),A.tx("+10 kPa per meter",590,412,38,"b")]}},
 {say:t3("Lägg en kloss under vattnet. Vattnet trycker på alla sidor av den. Men undersidan är djupare än ovansidan, så där är trycket större. Därför trycker vattnet mer uppåt än nedåt. Skillnaden blir en kraft uppåt som kallas lyftkraft.",
   "Put a block under water. The water presses on every side of it. But the bottom side is deeper than the top, so the pressure is bigger there. So the water pushes up more than down. The difference is an upward force called buoyancy.",
   "ضع مكعبًا تحت الماء. يضغط الماء على كل جوانبه، لكن الوجه السفلي أعمق من العلوي فيكون الضغط عليه أكبر، لذلك يدفع الماء إلى الأعلى أكثر من الأسفل. الفرق قوة متجهة إلى الأعلى تسمى قوة الطفو."),
  draw:()=>[A.wipe(),ttl("Lyftkraft"),...water(120,130,400,310),tank(120,110,400,330),...box(250,220,140,120,"o"),
   A.arrow(290,175,290,214,"r"),A.arrow(350,175,350,214,"r"),A.p(R.arrow(290,425,290,348),"g",4.5),A.p(R.arrow(350,425,350,348),"g",4.5),
   A.arrow(195,280,242,280,"k"),A.arrow(445,280,398,280,"k"),
   A.tx("ovanpå: litet tryck",545,170,26,"r","start"),A.tx("under: större tryck",545,220,26,"g","start"),A.tx("sidorna tar ut",545,270,26,"k","start"),A.tx("varandra",545,302,26,"k","start"),
   A.tx("lyftkraft",650,420,40,"g"),fa(765,440,765,350,"g",5)]},
 {say:t3("Därför känns saker lättare i vattnet. En sten som väger 30 N i luften visar bara 20 N på dynamometern när den hänger under vattnet. Vattnet hjälper till att bära stenen med en lyftkraft på 10 N.",
   "That is why things feel lighter in water. A stone that weighs 30 N in air shows only 20 N on the spring scale when it hangs under water. The water helps carry the stone with a buoyancy of 10 N.",
   "لهذا تبدو الأشياء أخف في الماء. حجر وزنه 30 نيوتن في الهواء لا يُظهر الميزان النابضي إلا 20 نيوتن عندما يتدلّى تحت الماء. الماء يساعد في حمل الحجر بقوة طفو مقدارها 10 نيوتن."),
  draw:()=>[A.wipe(),ttl("Lättare i vattnet"),A.p(R.line(60,100,740,100,.4),"#8a5a2b",6),...dyn(170,100,34,"30 N"),...stone(170,300,36),A.tx("i luften",170,400,28,"k"),
   ...water(420,280,240,150),tank(420,250,240,180),...dyn(540,100,94,"20 N"),...stone(540,360,36),A.p(R.arrow(610,420,610,345),"g",5),
   A.tx("i vattnet",540,470,28,"k"),A.tx("lyftkraft",690,330,26,"g","start"),A.tx("= 10 N",690,362,26,"g","start")]},
 {say:t3("Flyter eller sjunker föremålet? Jämför tyngden med lyftkraften. Om lyftkraften blir lika stor som tyngden innan föremålet är helt under vattnet, så flyter det. Är tyngden större än den största lyftkraften sjunker det.",
   "Does the object float or sink? Compare the weight with the buoyancy. If the buoyancy becomes as big as the weight before the object is completely under water, it floats. If the weight is bigger than the largest buoyancy, it sinks.",
   "هل يطفو الجسم أم يغرق؟ قارن الوزن بقوة الطفو. إذا صارت قوة الطفو مساوية للوزن قبل أن يُغمر الجسم كليًا فإنه يطفو، وإذا كان الوزن أكبر من أكبر قوة طفو ممكنة فإنه يغرق."),
  draw:()=>[A.wipe(),ttl("Flyta eller sjunka?"),...water(80,220,640,220),tank(80,140,640,300),...box(160,190,140,60,"o"),
   A.p(R.arrow(215,222,215,140),"g",5),A.p(R.arrow(245,222,245,304),"r",5),A.tx("lyftkraft",200,150,26,"g","end"),A.tx("tyngd",262,300,26,"r","start"),
   ...stone(560,300,36),A.p(R.arrow(545,300,545,250),"g",5),A.p(R.arrow(575,300,575,410),"r",5),A.tx("lyftkraft",530,250,26,"g","end"),A.tx("tyngd",592,400,26,"r","start"),
   A.tx("flyter",230,480,30,"g"),A.tx("sjunker",560,480,30,"r")]},
 {say:t3("Det hänger ihop med densiteten. Ett föremål med lägre densitet än vattnet flyter, och ett med högre densitet sjunker. Vatten har densiteten 1,0 g/cm³. Is har 0,92 g/cm³, trä ofta cirka 0,5 g/cm³ och järn 7,9 g/cm³.",
   "It is linked to density. An object with lower density than water floats, and one with higher density sinks. Water has a density of 1.0 g/cm³. Ice has 0.92 g/cm³, wood often about 0.5 g/cm³ and iron 7.9 g/cm³.",
   "يرتبط ذلك بالكثافة: الجسم الأقل كثافة من الماء يطفو، والأكثر كثافة يغرق. كثافة الماء 1,0 غ/سم³، والجليد 0,92، والخشب غالبًا نحو 0,5، والحديد 7,9 غ/سم³."),
  draw:()=>[A.wipe(),ttl("Densitet avgör"),...water(50,200,450,240),tank(50,150,450,290),
   A.hatch(rp(100,193,80,80),"b"),A.p(R.rect(100,193,80,80,.3),"#3fa7c9",4),...box(240,170,100,60,"o"),...box(390,400,60,40,"k"),
   A.tx("is",140,480,28,"b"),A.tx("trä",290,480,28,"o"),A.tx("järn",420,480,28,"k"),
   A.tx("vatten: 1,0 g/cm³",530,170,28,"b","start"),A.tx("is: 0,92 g/cm³",530,215,28,"k","start"),A.tx("trä: ca 0,5 g/cm³",530,260,28,"k","start"),A.tx("järn: 7,9 g/cm³",530,305,28,"k","start"),
   A.tx("mindre än 1: flyter",530,380,26,"g","start"),A.tx("större än 1: sjunker",530,425,26,"r","start")]},
 {say:t3("Kom ihåg: trycket i vatten ökar med djupet, ungefär 10 kPa för varje meter. Vattnet trycker åt alla håll. Eftersom trycket är störst längst ner får föremål i vatten en lyftkraft uppåt. Lägre densitet än vatten betyder att föremålet flyter.",
   "Remember: the pressure in water increases with depth, about 10 kPa for every metre. Water pushes in all directions. Because the pressure is biggest at the bottom, objects in water get an upward buoyancy. Lower density than water means the object floats.",
   "تذكّر: يزداد الضغط في الماء مع العمق نحو 10 كيلوباسكال لكل متر، والماء يضغط في كل الاتجاهات. ولأن الضغط أكبر في الأسفل تحصل الأجسام في الماء على قوة طفو إلى الأعلى. والكثافة الأقل من الماء تعني أن الجسم يطفو."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["vattentrycket ökar med djupet","b"],["ca 10 kPa mer för varje meter","b"],["vattnet trycker åt alla håll","k"],["lyftkraften pekar uppåt","g"],["lägre densitet än vatten → flyter","o"]],90,150,62,30)]},
]};
const P4={
 depth:()=>[...water(60,130,300,300),tank(60,110,300,320),...[[120,170,"A"],[260,280,"B"],[180,400,"C"]].flatMap(([x,y,s])=>[A.p(R.circ(x,y,8),"r",4),A.tx(s,x+28,y+10,36,"r")])],
 scales:()=>[A.p(R.line(30,100,380,100,.4),"#8a5a2b",6),...dyn(90,100,34,"40 N"),...stone(90,300,30),...water(210,300,170,130),tank(210,270,170,160),...dyn(260,100,110,"25 N"),...stone(260,380,30)],
 float:()=>[...water(40,240,340,190),tank(40,170,340,260),...box(90,215,110,50,"o"),...stone(300,400,28),A.tx("A",145,200,36,"k"),A.tx("B",300,350,36,"k")],
};
const BANK_T4=[
 {lv:0,q:"Vad händer med vattentrycket när man dyker djupare?",a:"det ökar",w:["det minskar","det är lika stort","det försvinner"]},
 {lv:0,q:"Vad heter kraften uppåt som vattnet ger ett föremål?",a:"lyftkraft",w:["tyngdkraft","friktion","lufttryck"]},
 {lv:0,q:"Var är trycket störst?",a:"C",w:["A","B","lika stort överallt"],lines:["I vilken punkt är","vattentrycket störst?"],pic:P4.depth},
 {lv:0,q:"Vilket av dessa flyter på vatten?",a:"en träbit",w:["en järnspik","en sten","en guldring"]},
 {lv:1,q:"Hur stor är lyftkraften på stenen?",a:"15 N",w:["65 N","25 N","40 N"],lines:["Hur stor är lyftkraften","på stenen i vattnet?"],pic:P4.scales},
 {lv:1,q:"Ungefär hur mycket ökar vattentrycket för varje meter?",a:"10 kPa",w:["1 kPa","100 kPa","1 Pa"]},
 {lv:1,q:"Ur vilket hål i flaskan sprutar vattnet kraftigast?",a:"det nedersta",w:["det översta","det mittersta","alla lika"]},
 {lv:1,q:"Varför får en kloss i vatten en lyftkraft?",a:"trycket under klossen är större än trycket ovanpå",w:["trycket ovanpå är störst","vattnet är varmare under","klossen är tom inuti"]},
 {lv:1,q:"Vad är densiteten för vatten?",a:"1,0 g/cm³",w:["0,5 g/cm³","7,9 g/cm³","10 g/cm³"]},
 {lv:1,q:"Vilken av klossarna har lägst densitet?",a:"A, den som flyter",w:["B, den som sjunker","de har samma densitet","går inte att säga"],lines:["Vilken har lägst","densitet?"],pic:P4.float},
 {lv:2,q:"Ungefär hur stort är det totala trycket på 10 meters djup?",a:"ca 200 kPa",w:["ca 110 kPa","ca 10 kPa","ca 1 000 kPa"]},
 {lv:2,q:"Ungefär hur stort är det totala trycket på 5 meters djup?",a:"ca 150 kPa",w:["ca 50 kPa","ca 105 kPa","ca 500 kPa"]},
 {lv:2,q:"En sten väger 30 N i luften och 18 N i vatten. Hur stor är lyftkraften?",a:"12 N",w:["48 N","18 N","30 N"]},
 {lv:2,q:"Is har densiteten 0,92 g/cm³. Vad händer med en isbit i vatten?",a:"den flyter med det mesta under ytan",w:["den sjunker till botten","den flyter med det mesta över ytan","den svävar mitt i"]},
 {lv:2,q:"När flyter ett föremål?",a:"när lyftkraften blir lika stor som tyngden",w:["när tyngden är större än lyftkraften","när föremålet är kallt","bara när det är av trä"]},
 {lv:2,q:"Aluminium har densiteten 2,7 g/cm³. Vad händer med en aluminiumkula i vatten?",a:"den sjunker",w:["den flyter","den svävar","den löser sig"]},
 {lv:1,q:"Skriv ordet: kraften uppåt från vattnet heter …",a:["lyftkraft","lyftkraften"],lines:["Skriv ordet som saknas:","Kraften uppåt från vattnet heter …"]},
 {lv:2,q:"Skriv ordet: massa per volym kallas …",a:["densitet","densiteten"],lines:["Skriv ordet som saknas:","Massa per volym kallas …"]},
];
LESSONS.push({id:"f7t4",subject:"science",grades:"7",kind:"wb",year:7,ord:44,
 title:t3("Vatten lyfter","Water lifts","الماء يرفع"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="40" y="60" width="240" height="105" fill="#e3ecfb"/><path d="M40 40V165H280V40" stroke="#1d2433" stroke-width="4" fill="none"/><path d="M40 60H280" stroke="#2257c9" stroke-width="3"/><rect x="110" y="42" width="80" height="34" fill="#fbe5c8" stroke="#1d2433" stroke-width="3"/><path d="M150 150V95M140 106L150 92L160 106" stroke="#1e9e5a" stroke-width="5" fill="none"/></svg>`,
 steps:T4.steps,mount:wbMount(T4),gen:bankGen(BANK_T4)});
WORDS.f7t4=["f7t_vattentryck","f7t_djup","f7t_lyftkraft","f7t_flyta","f7t_densitet"];

/* ---------------------------------------------------------------
   5. f7t5: Vattennivå
   --------------------------------------------------------------- */
/* four connected vessels of different shapes, water at height lv (only 220 is drawn exactly) */
const vessels=(lv=220,col="b")=>[A.hatch(rp(100,390,600,40),col),A.hatch(rp(130,lv,40,170),col),
  A.hatch(`M218.7 ${lv} L381.3 ${lv} L360 300 L360 390 L240 390 L240 300 Z`,col),A.hatch(`M440 390 L496.7 ${lv} L536.7 ${lv} L480 390 Z`,col),
  A.hatch(`M611 ${lv} L669 ${lv} L670 230 Q720 270 680 330 L680 390 L600 390 L600 330 Q560 270 610 230 Z`,col),
  A.p("M130 390 L100 390 L100 430 L700 430 L700 390 L680 390 M600 390 L480 390 M440 390 L360 390 M240 390 L170 390","k",4),
  A.p("M130 390 L130 150 M170 390 L170 150","k",4),A.p("M240 390 L240 300 L200 150 M360 390 L360 300 L400 150","k",4),A.p("M440 390 L520 150 M480 390 L560 150","k",4),
  A.p("M600 390 L600 330 Q560 270 610 230 L620 150 M680 390 L680 330 Q720 270 670 230 L660 150","k",4)];
const tower=(x,tankTop,lvl,base)=>[A.p(`M${x-40} ${base}L${x-22} ${tankTop+60}M${x+40} ${base}L${x+22} ${tankTop+60}M${x-31} ${base-60}L${x+31} ${base-60}M${x-36} ${base-60}L${x+27} ${tankTop+64}`,"k",4),
  A.hatch(rp(x-56,lvl,112,tankTop+60-lvl),"b"),A.p(R.rect(x-60,tankTop,120,60,.3),"k",4.5)];
const house=(x,y,w,h)=>[A.p(R.rect(x,y,w,h,.3),"k",4),A.p(`M${x-14} ${y}L${x+w/2} ${y-50}L${x+w+14} ${y}`,"r",4),A.p(R.rect(x+w/2-12,y+h-36,24,36,.2),"k",3)];
const T5={steps:[
 {say:t3("Titta på en vattenkanna. Vattnet i pipen står lika högt som vattnet i kannan. Häller du i mer vatten stiger det i båda. Pipen och kannan hänger nämligen ihop längst ner.",
   "Look at a watering can. The water in the spout stands as high as the water in the can. Pour in more water and it rises in both. That is because the spout and the can are joined at the bottom.",
   "انظر إلى إبريق السقي: الماء في الفوهة يقف على ارتفاع الماء في الإبريق نفسه. وإذا صببت ماءً أكثر يرتفع في الاثنين، لأن الفوهة والإبريق متصلان من الأسفل."),
  draw:()=>[A.wipe(),ttl("Vattenkannan"),A.hatch(rp(250,280,200,140),"b"),A.hatch("M450 410 L556.7 280 L527.8 280 L450 380 Z","b"),
   A.p("M250 220 L250 420 L450 420 L450 410 L610 215 M450 380 L450 220 M450 380 L590 200","k",4.5),A.p("M582 190 L620 222","k",6),A.p("M250 240 Q170 260 200 360 Q215 390 250 380","k",4.5),
   dsh(220,280,640,280,"b",3),A.tx("lika högt",660,290,30,"b","start"),A.p(R.line(250,280,450,280,.3),"b",3)]},
 {say:t3("Kärl som hänger ihop i botten kallas kommunicerande kärl. Hur kärlen än ser ut, smala, breda eller sneda, ställer sig vattenytan på samma höjd i alla. Det gäller när vätskan är densamma och luften trycker lika på alla ytor.",
   "Vessels that are joined at the bottom are called communicating vessels. Whatever the vessels look like, narrow, wide or slanted, the water surface settles at the same height in all of them. This holds when the liquid is the same and the air presses equally on every surface.",
   "الأوعية المتصلة من الأسفل تسمى الأواني المستطرقة. مهما كان شكلها، ضيقة أو واسعة أو مائلة، يستقر سطح الماء على الارتفاع نفسه فيها كلها، ما دام السائل نفسه والهواء يضغط بالتساوي على كل الأسطح."),
  draw:()=>[A.wipe(),ttl("Kommunicerande kärl"),...vessels(),dsh(80,220,720,220,"r",3),A.tx("samma höjd",400,128,30,"r")]},
 {say:t3("Varför? Om vattnet står högre i ett av kärlen blir trycket vid botten större där. Då trycks vatten över till det andra kärlet, tills ytorna står lika högt och trycket i botten är lika stort överallt.",
   "Why? If the water stands higher in one vessel, the pressure at the bottom is bigger there. Then water is pushed over to the other vessel, until the surfaces stand equally high and the pressure at the bottom is the same everywhere.",
   "لماذا؟ إذا كان الماء أعلى في أحد الوعاءين يكون الضغط عند القاع أكبر هناك، فيندفع الماء إلى الوعاء الآخر حتى يتساوى السطحان ويصبح الضغط عند القاع متساويًا في كل مكان."),
  draw:()=>[A.wipe(),ttl("Varför samma höjd?"),A.hatch("M120 170 L170 170 L170 380 L280 380 L280 300 L330 300 L330 430 L120 430 Z","b"),
   A.p("M120 120 L120 430 L330 430 L330 120 M170 120 L170 380 L280 380 L280 120","k",4),A.p("M120 170 L170 170 M280 300 L330 300","b",3),A.flow("M145 200 L145 405 L305 405 L305 330","b",6,3,5),
   A.tx("före",225,110,30,"k"),A.arrow(370,270,430,270,"k"),
   A.hatch("M470 235 L520 235 L520 380 L630 380 L630 235 L680 235 L680 430 L470 430 Z","b"),A.p("M470 120 L470 430 L680 430 L680 120 M520 120 L520 380 L630 380 L630 120","k",4),
   A.p("M470 235 L520 235 M630 235 L680 235","b",3),dsh(455,235,700,235,"r",2.5),A.tx("efter",575,110,30,"k"),note("Högre yta ger större tryck i botten.",476,"b",28)]},
 {say:t3("Ett vattentorn är en stor tank högt upp, ofta på en kulle. Tanken är förbunden med rören i husen. Vattnet strävar efter att nå samma höjd som i tornet, så när du öppnar kranen trycks vattnet ut.",
   "A water tower is a big tank high up, often on a hill. The tank is connected to the pipes in the houses. The water tends to reach the same height as in the tower, so when you open the tap the water is pushed out.",
   "برج المياه خزان كبير في مكان مرتفع، غالبًا على تلة، وهو متصل بأنابيب البيوت. يسعى الماء إلى بلوغ ارتفاع الماء نفسه في البرج، لذلك يندفع خارجًا عندما تفتح الصنبور."),
  draw:()=>[A.wipe(),ttl("Vattentornet"),A.hatch("M20 440 Q150 250 300 250 Q420 260 520 440 Z","g"),A.p("M20 440 Q150 250 300 250 Q420 260 520 440 L780 440","g",4),
   ...tower(230,110,125,252),dsh(170,125,770,125,"b",2.5),A.tx("vattenytan i tornet",580,112,26,"b"),
   A.p("M230 260 L230 465 L560 465 L560 370 L536 370","#7d8ca6",7),A.flow("M230 260 L230 465 L560 465 L560 370 L536 370","b",8,4,4),A.flow("M534 376 Q526 400 528 438","b",4,1.2,5),
   ...house(600,350,140,90),A.tx("kran",520,350,26,"k","end")]},
 {say:t3("Vattnet kan aldrig nå högre än vattenytan i tornet. Ett lågt hus får därför bra tryck i kranarna. Men i ett höghus som når över den nivån kommer vattnet inte upp till de översta våningarna. Där behövs pumpar.",
   "The water can never reach higher than the water surface in the tower. So a low house gets good pressure in its taps. But in a tall building that reaches above that level, the water cannot get up to the top floors. Pumps are needed there.",
   "لا يمكن للماء أن يصل أعلى من سطح الماء في البرج. لذلك يحصل البيت المنخفض على ضغط جيد في صنابيره، أما في البرج السكني الذي يتجاوز ذلك المستوى فلا يصل الماء إلى الطوابق العليا، وهناك تلزم مضخات."),
  draw:()=>{const o=[A.wipe(),ttl("Hur högt når vattnet?"),ground(30,770,430),...tower(140,150,165,430),dsh(80,165,770,165,"b",2.5),A.tx("vattnet når hit",380,152,26,"b"),
   A.p("M140 430 L140 462 L580 462 L580 430 M350 462 L350 430","#7d8ca6",6),A.flow("M140 430 L140 462 L580 462 L580 430","b",6,3.5,4),
   ...house(300,330,100,100),A.tx("✓",420,300,40,"g"),A.hatch(rp(520,100,120,65),"r"),A.p(R.rect(520,100,120,330,.3),"k",4.5)];
   for(let r=0;r<6;r++)for(let c=0;c<3;c++)o.push(A.p(R.rect(532+c*38,112+r*52,22,28,.2),"k",2.5));
   return[...o,A.tx("pump",655,120,26,"r","start"),A.tx("behövs",655,150,26,"r","start")]}},
 {say:t3("En slusskanal hjälper båtar uppför och nerför en höjdskillnad. Båten åker in i slussen och portarna stängs. Sedan öppnas luckor så att vatten rinner in från den högre sidan. Vattnet stiger tills det står lika högt, och båten lyfts upp. Göta kanal har 58 slussar.",
   "A canal with locks helps boats up and down a difference in height. The boat goes into the lock and the gates close. Then hatches open so water flows in from the higher side. The water rises until it stands equally high, and the boat is lifted. The Göta Canal has 58 locks.",
   "تساعد قناة الهويسات السفن على الصعود والنزول عبر فرق في الارتفاع. تدخل السفينة الهويس وتُغلق البوابات، ثم تُفتح فتحات فيتدفق الماء من الجهة الأعلى، ويرتفع حتى يتساوى المستويان فترتفع السفينة. في قناة يوتا 58 هويسًا."),
  draw:()=>[A.wipe(),ttl("Slussen"),...water(20,180,280,120),...water(300,320,200,100),...water(500,320,280,100),
   A.p("M20 300 L300 300 L300 420 L780 420","k",4.5),A.p("M300 150 L300 300","k",9),A.p("M500 280 L500 420","k",9),
   ...boat(410,306,150,36),A.p(R.arrow(345,300,345,200),"g",5),dsh(300,180,500,180,"r",3),A.flow("M260 290 Q300 340 330 400","b",6,2.2,5),
   A.tx("övre kanalen",150,150,26,"b"),A.tx("nedre kanalen",640,300,26,"b"),A.tx("slussen",400,462,30,"k"),A.tx("vatten rinner in",170,370,24,"b"),A.tx("Göta kanal: 58 slussar",640,470,24,"k")]},
 {say:t3("Ett slangvattenpass är en genomskinlig slang med vatten. Håller man upp båda ändarna står vattnet lika högt i dem. Byggare använder det för att hitta samma höjd på två ställen långt ifrån varandra, till exempel när de bygger ett trädäck.",
   "A hose water level is a clear hose with water in it. If you hold up both ends, the water stands equally high in them. Builders use it to find the same height at two places far apart, for example when they build a wooden deck.",
   "ميزان الماء بالخرطوم خرطوم شفاف فيه ماء. إذا رفعت طرفيه وقف الماء على الارتفاع نفسه فيهما. يستعمله البنّاؤون لإيجاد الارتفاع نفسه في مكانين متباعدين، مثلًا عند بناء سطح خشبي."),
  draw:()=>{const hose="M170 180 L170 300 Q170 420 300 420 L520 420 Q630 420 630 300 L630 230",wet="M170 260 L170 300 Q170 420 300 420 L520 420 Q630 420 630 300 L630 260";
   return[A.wipe(),ttl("Slangvattenpass"),ground(30,770,440),A.hatch(rp(130,150,20,290),"o"),A.p(R.rect(130,150,20,290,.3),"#8a5a2b",4),A.hatch(rp(650,150,20,290),"o"),A.p(R.rect(650,150,20,290,.3),"#8a5a2b",4),
    A.p(hose,"k",16),A.p(hose,"#ffffff",9),A.p(wet,"#2257c9",9),dsh(110,260,700,260,"r",3),A.p("M120 260 L160 260 M640 260 L680 260","r",6),A.tx("samma höjd",400,240,30,"r")]}},
 {say:t3("Kom ihåg: i kommunicerande kärl står vätskan lika högt, hur kärlen än ser ut. Det används i vattenkannor, vattentorn, slussar och slangvattenpass. Vattnet kan aldrig av sig själv komma högre än ytan det kommer ifrån.",
   "Remember: in communicating vessels the liquid stands equally high, whatever the vessels look like. This is used in watering cans, water towers, locks and hose levels. Water can never by itself get higher than the surface it comes from.",
   "تذكّر: في الأواني المستطرقة يقف السائل على الارتفاع نفسه مهما كان شكلها. ويُستفاد من ذلك في أباريق السقي وأبراج المياه والهويسات وموازين الماء. ولا يمكن للماء من تلقاء نفسه أن يرتفع أعلى من السطح الذي جاء منه."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["kommunicerande kärl: samma höjd","b"],["formen på kärlen spelar ingen roll","k"],["vattentorn ger tryck i kranarna","g"],["slussar lyfter båtar","o"],["vattnet når aldrig högre än källan","r"]],90,150,62,30)]},
]};
const P5={
 vessels:()=>[A.hatch(rp(60,380,300,40),"b"),A.hatch(rp(80,250,40,130),"b"),A.hatch(rp(180,250,70,130),"b"),
   A.p("M80 380 L60 380 L60 420 L360 420 L360 380 L340 380 M300 380 L250 380 M180 380 L120 380 M80 380 L80 160 M120 380 L120 160 M180 380 L180 160 M250 380 L250 160 M300 380 L300 160 M340 380 L340 160","k",4),
   A.p("M80 250 L120 250 M180 250 L250 250","b",3),A.tx("?",320,240,48,"r"),A.tx("30 cm",100,140,24,"k")],
 tower:()=>[ground(20,390,430),...tower(80,150,165,430),dsh(30,165,390,165,"b",2.5),...house(160,330,70,100),A.p(R.rect(280,110,80,320,.3),"k",4),A.tx("A",195,470,32,"k"),A.tx("B",320,470,32,"k"),
   A.p(R.circ(320,140,8),"r",4)],
};
const BANK_T5=[
 {lv:0,q:"Vad kallas kärl som hänger ihop i botten?",a:"kommunicerande kärl",w:["tomma kärl","slutna kärl","stående kärl"]},
 {lv:0,q:"Hur står vattnet i pipen jämfört med i kannan?",a:"lika högt",w:["högre","lägre","det finns inget vatten i pipen"]},
 {lv:0,q:"Hur högt står vattnet i det högra röret?",a:"lika högt som i de andra",w:["högre","lägre","det är tomt"],lines:["Hur högt står vattnet","i det högra röret?"],pic:P5.vessels},
 {lv:0,q:"Varför står vattentorn ofta på en kulle?",a:"tanken ska ligga högt",w:["för att få sol","för att vattnet ska bli kallt","för att de ska synas"]},
 {lv:1,q:"Spelar kärlens form någon roll för vattnets höjd?",a:"nej, ytan står lika högt i alla",w:["ja, vattnet står högst i det smala","ja, vattnet står högst i det breda","ja, vattnet står lägst i det sneda"]},
 {lv:1,q:"Vad gör en sluss?",a:"lyfter eller sänker båtar mellan olika vattennivåer",w:["pumpar upp vatten till ett torn","mäter lufttrycket","renar vattnet i kanalen"]},
 {lv:1,q:"Vad används ett slangvattenpass till?",a:"att hitta samma höjd på två ställen",w:["att mäta vattnets temperatur","att mäta lufttrycket","att pumpa vatten"]},
 {lv:1,q:"Vilket hus får vatten i kranen på översta våningen?",a:"A, det låga huset",w:["B, det höga huset","båda","inget av dem"],lines:["Vem får vatten på","översta våningen","utan pump?"],pic:P5.tower},
 {lv:1,q:"Varför rinner vatten från det högre kärlet till det lägre?",a:"trycket vid botten är större under den högre ytan",w:["vatten rinner alltid åt höger","det lägre kärlet suger","luften trycker mer på den högre ytan"]},
 {lv:1,q:"Var kommer vattnet i slussen ifrån när båten ska upp?",a:"från den högre sidan",w:["från den lägre sidan","från en pump i botten","från regnet"]},
 {lv:2,q:"Vattenytan i ett vattentorn ligger 40 m över marken. Hur högt kan vattnet nå i ett hus utan pump?",a:"högst 40 m över marken",w:["hur högt som helst","högst 4 m","högst 80 m"]},
 {lv:2,q:"Ett höghus når över vattenytan i tornet. Vad behövs för att få vatten högst upp?",a:"en pump",w:["ett större rör","en kranvattenfilter","ingenting"]},
 {lv:2,q:"Hur många slussar har Göta kanal?",a:"58",w:["5","12","200"]},
 {lv:2,q:"I ett U-rör står vattnet 20 cm högre på ena sidan. Vad händer om man släpper det fritt?",a:"vattnet jämnar ut sig så att ytorna står lika högt",w:["skillnaden blir större","ingenting händer","allt vatten rinner till den högre sidan"]},
 {lv:2,q:"Varför står vattnet lika högt i en kanna och dess pip?",a:"trycket vid botten blir lika stort först när ytorna står lika högt",w:["pipen är smalare","vatten är lättare än luft","kannan är tyngre än pipen"]},
 {lv:2,q:"Vad gäller för att vätskan ska stå lika högt i kommunicerande kärl?",a:"samma vätska och lika lufttryck över ytorna",w:["kärlen måste vara lika breda","kärlen måste vara raka","vätskan måste vara varm"]},
 {lv:1,q:"Skriv ordet: en byggnad med vattentank högt upp heter ett …",a:["vattentorn","vattentornet"],lines:["Skriv ordet som saknas:","Ett torn med en vattentank","högt upp heter ett …"]},
 {lv:2,q:"Skriv ordet: kärl som hänger ihop i botten kallas … kärl",a:["kommunicerande"],lines:["Skriv ordet som saknas:","Kärl som hänger ihop i botten","kallas … kärl."]},
];
LESSONS.push({id:"f7t5",subject:"science",grades:"7",kind:"wb",year:7,ord:45,
 title:t3("Vattennivå","Water level","مستوى الماء"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M40 140H280V160H40Z" fill="#e3ecfb"/><path d="M60 80H90V140H60ZM140 80H200V140H140ZM240 80H270V140H240Z" fill="#e3ecfb"/><path d="M60 140H40V160H280V140H270M240 140H200M140 140H90M60 140V30M90 140V30M140 140V30M200 140V30M240 140V30M270 140V30" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M30 80H290" stroke="#d63b2f" stroke-width="3" stroke-dasharray="8 6"/></svg>`,
 steps:T5.steps,mount:wbMount(T5),gen:bankGen(BANK_T5)});
WORDS.f7t5=["f7t_kommunicerande","f7t_vattentorn","f7t_sluss","f7t_vattenpass","f7t_vattenyta"];

/* ---------------------------------------------------------------
   6. f7t6: Hållbar utveckling: Hav i balans
   --------------------------------------------------------------- */
const ICEBERG="M130 290 L150 220 L175 170 L215 160 L240 220 L265 300 L230 360 L160 350 Z";
const T6={steps:[
 {say:t3("Havsnivån har stigit med drygt 20 cm sedan år 1900, och nu stiger den snabbare än förut, med ungefär 4 mm per år. Det beror på att jorden blir varmare. Det finns två huvudorsaker: isen på land smälter, och havsvattnet utvidgar sig.",
   "Sea level has risen by just over 20 cm since 1900, and now it rises faster than before, by about 4 mm per year. This is because the Earth is getting warmer. There are two main causes: ice on land melts, and sea water expands.",
   "ارتفع مستوى سطح البحر أكثر من 20 سم منذ عام 1900، وهو يرتفع الآن أسرع من قبل، بنحو 4 مم في السنة، لأن الأرض تزداد دفئًا. وهناك سببان رئيسيان: ذوبان الجليد على اليابسة، وتمدد مياه البحر."),
  draw:()=>{const X=y=>120+(y-1900)*4.8,Y=cm=>400-cm*10,pts=[[1900,0],[1920,2],[1940,5],[1960,8],[1980,11],[2000,15],[2020,22]];
   return[A.wipe(),ttl("Havsnivån stiger"),A.p(R.line(120,400,720,400,.3)+R.line(120,400,120,130,.3),"k",4),
    ...[1900,1950,2000].flatMap(y=>[A.p(R.line(X(y),400,X(y),410,.1),"k",3),A.tx(String(y),X(y),440,26,"k")]),...[[0,"0"],[10,"10 cm"],[20,"20 cm"]].flatMap(([c,s])=>[A.p(R.line(110,Y(c),120,Y(c),.1),"k",3),A.tx(s,104,Y(c)+9,24,"k","end")]),
    A.p("M"+pts.map(([y,c])=>f1(X(y))+" "+f1(Y(c))).join(" L"),"b",5),A.tx("drygt 20 cm sedan 1900",400,170,30,"b"),A.tx("nu ca 4 mm per år",590,330,28,"r")]}},
 {say:t3("Stora mängder vatten är bundet som is på land. På Grönland och Antarktis ligger inlandsisar som är flera kilometer tjocka. Om all is på Grönland smälte skulle havet stiga ungefär 7 meter. Den smälter långsamt, men den minskar redan varje år.",
   "Huge amounts of water are locked up as ice on land. On Greenland and Antarctica there are ice sheets several kilometres thick. If all the ice on Greenland melted, the sea would rise about 7 metres. It melts slowly, but it already shrinks every year.",
   "كميات هائلة من الماء محبوسة جليدًا على اليابسة. في غرينلاند والقارة القطبية الجنوبية أغطية جليدية سمكها عدة كيلومترات. لو ذاب كل جليد غرينلاند لارتفع البحر نحو 7 أمتار. إنه يذوب ببطء لكنه يتناقص كل عام."),
  draw:()=>[A.wipe(),ttl("Is på land"),...water(30,380,110,60),...water(660,380,110,60),A.hatch("M120 440 Q130 380 160 370 L640 370 Q670 380 680 440 Z","o"),A.p("M120 440 Q130 380 160 370 L640 370 Q670 380 680 440","#8a5a2b",4),
   A.hatch("M150 372 Q400 120 650 372 Z","b"),A.p("M150 372 Q400 120 650 372","#3fa7c9",5),A.tx("inlandsis",400,280,36,"b"),A.tx("upp till 3 km tjock",400,320,26,"k"),A.tx("hav",80,370,26,"b"),A.tx("land",400,412,26,"#8a5a2b"),
   note("Om all is smälte: Grönland ≈ 7 m, Antarktis ≈ 58 m",478,"r",26)]},
 {say:t3("Gör ett försök med två glas. I det ena flyter en isbit i vattnet. I det andra ligger isen på en sten ovanför vattnet. Markera vattenytan och låt isen smälta. Bara i glaset där isen låg på stenen stiger vattnet.",
   "Do an experiment with two glasses. In one, an ice cube floats in the water. In the other, the ice lies on a stone above the water. Mark the water surface and let the ice melt. Only in the glass where the ice lay on the stone does the water rise.",
   "أجرِ تجربة بكأسين: في الأولى مكعب ثلج يطفو في الماء، وفي الثانية الثلج موضوع على حجر فوق الماء. ضع علامة عند سطح الماء ودع الثلج يذوب. لا يرتفع الماء إلا في الكأس التي كان الثلج فيها على الحجر."),
  draw:()=>[A.wipe(),ttl("Försök: två glas"),A.hatch("M148 300 L332 300 L320 420 L160 420 Z","b"),glass(140,180,200,240),A.hatch(rp(210,290,60,50),"b"),A.p(R.rect(210,290,60,50,.3),"#3fa7c9",4),
   dsh(120,300,360,300,"g",3),A.tx("nivån står still",240,160,26,"g"),A.tx("isbit flyter",240,460,28,"k"),
   A.hatch("M468 330 L652 330 L640 420 L480 420 Z","b"),...stone(560,350,62),A.hatch(rp(525,230,70,58),"b"),A.p(R.rect(525,230,70,58,.3),"#3fa7c9",4),glass(460,180,200,240),
   dsh(440,330,680,330,"b",3),dsh(440,306,680,306,"r",3),A.p(R.arrow(700,330,700,300),"r",4),A.tx("nivån stiger",560,160,26,"r"),A.tx("is på en sten",560,460,28,"k")]},
 {say:t3("Is som flyter trycker undan lika mycket vatten som den själv väger. När den smälter blir den precis så mycket vatten som den trängde undan. Därför höjer smältande havsis nästan inte havet. Landis som smälter och rinner ut i havet är nytt vatten och höjer havsnivån.",
   "Floating ice pushes aside as much water as it weighs itself. When it melts it becomes exactly as much water as it pushed aside. So melting sea ice hardly raises the sea. Land ice that melts and runs into the sea is new water and raises the sea level.",
   "الجليد الطافي يزيح من الماء ما يساوي وزنه. وعندما يذوب يصبح ماءً بقدر ما أزاحه تمامًا، لذلك لا يكاد ذوبان الجليد البحري يرفع البحر. أما جليد اليابسة الذي يذوب ويسيل إلى البحر فهو ماء جديد يرفع مستوى البحر."),
  draw:()=>[A.wipe(),ttl("Havsis och landis"),...water(40,220,340,200),A.hatch(ICEBERG,"b"),A.p(ICEBERG,"#3fa7c9",4),A.tx("havsis",300,150,32,"b","start"),
   A.tx("blir lika mycket vatten",210,452,22,"g"),A.tx("som den trängde undan",210,482,22,"g"),
   ...water(640,260,140,160),A.hatch(rp(420,200,220,220),"o"),A.p(R.rect(420,200,220,220,.3),"#8a5a2b",4),A.hatch("M420 200 Q520 120 640 200 Z","b"),A.p("M420 200 Q520 120 640 200","#3fa7c9",4),
   A.flow("M600 170 Q690 190 705 275","b",5,2,5),A.tx("landis",520,110,32,"b"),A.tx("nytt vatten i havet",600,452,22,"r"),A.tx("havsnivån stiger",600,482,22,"r")]},
 {say:t3("Den andra orsaken är att vatten utvidgar sig när det blir varmare. Varje droppe tar bara lite mer plats, men haven är flera kilometer djupa. När hela havet värms blir det en tydlig höjning. Under de senaste femtio åren beror ungefär hälften av höjningen på det.",
   "The second cause is that water expands when it gets warmer. Each drop takes up only a little more space, but the oceans are several kilometres deep. When the whole ocean warms, it adds up to a clear rise. Over the last fifty years, about half of the rise is due to this.",
   "السبب الثاني أن الماء يتمدد عندما يسخن. كل قطرة تشغل حيّزًا أكبر بقليل فقط، لكن المحيطات عميقة عدة كيلومترات، فعندما يسخن المحيط كله يصبح الارتفاع واضحًا. وفي الخمسين سنة الأخيرة يعود نحو نصف الارتفاع إلى ذلك."),
  draw:()=>[A.wipe(),ttl("Varmt vatten tar mer plats"),...water(180,220,120,210),tank(180,120,120,310),...thermo(140,200,400,330,"b"),
   ...water(500,180,120,250),tank(500,120,120,310),...thermo(460,200,400,230,"r"),dsh(300,220,640,220,"k",2.5),A.p(R.arrow(650,220,650,182),"r",4),A.tx("högre nivå",665,206,26,"r","start"),
   A.tx("kallt hav",240,470,28,"b"),A.tx("varmt hav",560,470,28,"r")]},
 {say:t3("En högre havsnivå kan översvämma låga kuster och städer, spola bort stränder och göra att salt vatten tränger in i grundvattnet. Låga önationer, som Maldiverna, kan bli svåra att bo i. I Sverige är södra delen mest utsatt, för i norr höjer sig landet fortfarande efter istiden.",
   "A higher sea level can flood low coasts and cities, wash away beaches and let salt water into the groundwater. Low island nations, like the Maldives, may become hard to live in. In Sweden the south is most at risk, because in the north the land is still rising after the ice age.",
   "ارتفاع مستوى البحر قد يُغرق السواحل والمدن المنخفضة، ويجرف الشواطئ، ويُدخل الماء المالح إلى المياه الجوفية. وقد تصبح الدول الجزرية المنخفضة مثل جزر المالديف صعبة السكن. وفي السويد الجنوب أكثر عرضة، لأن اليابسة في الشمال ما زالت ترتفع منذ العصر الجليدي."),
  draw:()=>[A.wipe(),ttl("Vad händer vid kusten?"),A.hatch("M30 300 L405 300 L200 440 L30 440 Z","b"),A.p(R.line(30,300,405,300,.3),"b",3),
   A.hatch("M200 440 L420 290 L560 290 L770 200 L770 440 Z","g"),A.p("M200 440 L420 290 L560 290 L770 200","g",4),...house(440,250,40,40),...house(505,250,40,40),
   dsh(30,268,606,268,"r",3),A.tx("i dag",110,340,24,"b"),A.tx("i framtiden?",110,256,24,"r"),
   ...blist([["översvämningar","r"],["stränder spolas bort","o"],["salt i grundvattnet","b"]],570,110,36,24),note("I Sverige är risken störst i söder.",478,"k",26)]},
 {say:t3("Vad kan vi göra? Det viktigaste är att släppa ut mindre växthusgaser, så att uppvärmningen bromsas. Samtidigt måste kuststäder planera för högre vatten, till exempel med vallar och genom att inte bygga för lågt. Diskutera: vad kan du, din skola och din kommun göra?",
   "What can we do? The most important thing is to emit fewer greenhouse gases, so that the warming slows down. At the same time, coastal cities must plan for higher water, for example with dikes and by not building too low. Discuss: what can you, your school and your municipality do?",
   "ماذا نستطيع أن نفعل؟ الأهم هو إطلاق كمية أقل من غازات الدفيئة لإبطاء الاحترار. وفي الوقت نفسه يجب أن تخطط المدن الساحلية لمياه أعلى، مثلًا بالسدود وبعدم البناء في أماكن منخفضة. ناقش: ماذا تستطيع أنت ومدرستك وبلديتك أن تفعلوا؟"),
  draw:()=>[A.wipe(),ttl("Hav i balans"),...blist([["minska utsläppen av växthusgaser","g"],["planera städer för högre vatten","b"],["bygg vallar, bygg inte för lågt","k"]],80,150,55,30),
   A.band(60,315,680,150,"o"),A.tx("Diskutera:",90,358,32,"o","start"),A.tx("Vad kan du, din skola och",90,404,30,"k","start"),A.tx("din kommun göra?",90,446,30,"k","start")]},
]};
const P6={
 glasses:()=>[A.hatch("M48 300 L172 300 L164 420 L56 420 Z","b"),glass(40,200,140,220),A.hatch(rp(85,290,46,40),"b"),A.p(R.rect(85,290,46,40,.3),"#3fa7c9",3),A.tx("A",110,460,34,"k"),
   A.hatch("M228 330 L352 330 L344 420 L236 420 Z","b"),...stone(290,355,45),A.hatch(rp(265,268,50,42),"b"),A.p(R.rect(265,268,50,42,.3),"#3fa7c9",3),glass(220,200,140,220),A.tx("B",290,460,34,"k")],
 berg:()=>[...water(40,220,340,200),A.hatch(ICEBERG,"b"),A.p(ICEBERG,"#3fa7c9",4)],
};
const BANK_T6=[
 {lv:0,q:"Ungefär hur mycket har havsnivån stigit sedan år 1900?",a:"drygt 20 cm",w:["drygt 2 m","drygt 2 mm","ingenting"]},
 {lv:0,q:"Varför stiger havsnivån?",a:"jorden blir varmare",w:["det regnar mer i Sverige","månen kommer närmare","fiskarna blir fler"]},
 {lv:0,q:"Var finns de största inlandsisarna?",a:"på Grönland och Antarktis",w:["i Sahara","i Skåne","på Maldiverna"]},
 {lv:0,q:"I vilket glas stiger vattnet när isen smälter?",a:"B, där isen ligger på stenen",w:["A, där isen flyter","i båda","i inget av dem"],lines:["I vilket glas stiger","vattnet när isen smälter?"],pic:P6.glasses},
 {lv:1,q:"Vad händer med vatten när det blir varmare?",a:"det utvidgar sig",w:["det krymper","det blir tyngre","det blir is"]},
 {lv:1,q:"Varför höjer smältande havsis nästan inte havsnivån?",a:"den flytande isen har redan trängt undan lika mycket vatten",w:["havsisen är för liten","havsisen smälter aldrig","havsisen blir till luft"]},
 {lv:1,q:"Isberget flyter i havet och smälter. Vad händer med havsnivån?",a:"nästan ingenting",w:["den stiger mycket","den sjunker mycket","havet fryser"],lines:["Isberget smälter.","Vad händer med","havsnivån?"],pic:P6.berg},
 {lv:1,q:"Vilken is höjer havsnivån när den smälter?",a:"landis, till exempel på Grönland",w:["isbitar i ett glas","havsis i Arktis","is på en frusen sjö"]},
 {lv:1,q:"Ungefär hur mycket skulle havet stiga om all is på Grönland smälte?",a:"ca 7 m",w:["ca 7 cm","ca 70 m","ca 700 m"]},
 {lv:1,q:"Vad kan hända när salt vatten tränger in i grundvattnet?",a:"dricksvattnet blir salt",w:["vattnet blir sötare","marken blir varmare","fiskarna flyttar upp på land"]},
 {lv:2,q:"Havsnivån stiger ca 4 mm per år. Hur mycket blir det på 100 år i samma takt?",a:"ca 40 cm",w:["ca 4 cm","ca 4 m","ca 400 m"]},
 {lv:2,q:"Havsnivån stiger ca 4 mm per år. Hur mycket blir det på 10 år?",a:"ca 4 cm",w:["ca 4 mm","ca 40 cm","ca 1 m"]},
 {lv:2,q:"Varför är södra Sverige mer utsatt än norra?",a:"i norr höjer sig landet fortfarande efter istiden",w:["i norr finns inget hav","i söder är havet saltare","i norr regnar det aldrig"]},
 {lv:2,q:"Vilket är det viktigaste för att bromsa höjningen på lång sikt?",a:"minska utsläppen av växthusgaser",w:["bygga fler båtar","pumpa upp havsvatten på land","hugga ner skog"]},
 {lv:2,q:"Under de senaste femtio åren: ungefär hur stor del av höjningen beror på att vattnet utvidgar sig?",a:"ungefär hälften",w:["ingenting","nästan allt","en hundradel"]},
 {lv:2,q:"Varför kan låga önationer bli svåra att bo i?",a:"de kan översvämmas när havet stiger",w:["de blir kallare","de flyter iväg","de får för lite regn"]},
 {lv:2,q:"Vilken är en bra anpassning för en kuststad?",a:"att inte bygga nya hus för lågt",w:["att bygga närmare vattnet","att ta bort vallarna","att bygga källare vid stranden"]},
 {lv:1,q:"Skriv ordet: is som flyter på havet kallas …",a:["havsis","havsisen"],lines:["Skriv ordet som saknas:","Is som flyter på havet kallas …"]},
 {lv:2,q:"Skriv ordet: när vatten tar mer plats för att det blir varmare kallas det …",a:["värmeutvidgning","värmeutvidgningen","utvidgning"],lines:["Skriv ordet som saknas:","Vatten som tar mer plats när det","blir varmare: värme…"]},
];
LESSONS.push({id:"f7t6",subject:"science",grades:"7",kind:"wb",year:7,ord:46,
 title:t3("Hållbar utveckling: Hav i balans","Sustainable development: Oceans in balance","التنمية المستدامة: بحار متوازنة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M20 110H300V170H20Z" fill="#e3ecfb"/><path d="M20 110H300" stroke="#2257c9" stroke-width="3"/><path d="M20 90H300" stroke="#d63b2f" stroke-width="3" stroke-dasharray="8 6"/><path d="M60 110L80 60L110 50L130 110L120 150L70 145Z" fill="#dff1fa" stroke="#3fa7c9" stroke-width="3"/><path d="M200 110L250 70L300 60V110Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="3"/><path d="M230 80V60H250V80M226 60L240 48L254 60" stroke="#d63b2f" stroke-width="3" fill="none"/></svg>`,
 steps:T6.steps,mount:wbMount(T6),gen:bankGen(BANK_T6)});
WORDS.f7t6=["f7t_havsniva","f7t_inlandsis","f7t_havsis","f7t_varmeutvidgning","f7t_hallbar"];

/* ---------------------------------------------------------------
   7. f7t7: Lär mer: Tryck mäts på många sätt
   --------------------------------------------------------------- */
/* a dial: value v from 960 to 1060 hPa, from lower left round to lower right */
const dialA=v=>(225-(v-960)*2.7)*Math.PI/180;
const dial=(cx,cy,r,val)=>{const o=[A.p(R.circ(cx,cy,r),"k",5)];let t="";for(let v=960;v<=1060;v+=10){const a=dialA(v),c=Math.cos(a),s=-Math.sin(a);t+=`M${f1(cx+c*(r-24))} ${f1(cy+s*(r-24))}L${f1(cx+c*(r-8))} ${f1(cy+s*(r-8))}`}
  o.push(A.p(t,"k",3));[[980,"980"],[1013,"1013"],[1040,"1040"]].forEach(([v,s])=>{const a=dialA(v);o.push(A.tx(s,cx+Math.cos(a)*(r-45),cy-Math.sin(a)*(r-45)+8,22,"k"))});
  const a=dialA(val);o.push(A.p(R.arrow(cx,cy,cx+Math.cos(a)*(r-75),cy-Math.sin(a)*(r-75)),"r",5),A.p(R.circ(cx,cy,7),"k",4));return o};
const T7={steps:[
 {say:t3("År 1643 gjorde italienaren Evangelista Torricelli ett berömt försök. Han fyllde ett glasrör med kvicksilver och vände det ner i en skål. Kvicksilvret sjönk till ungefär 760 mm höjd och stannade. Lufttrycket på skålens yta höll uppe pelaren. Ovanför blev det nästan vakuum.",
   "In 1643 the Italian Evangelista Torricelli did a famous experiment. He filled a glass tube with mercury and turned it upside down into a bowl. The mercury sank to a height of about 760 mm and stopped. The air pressure on the bowl's surface held up the column. Above it there was almost a vacuum.",
   "في عام 1643 أجرى الإيطالي إيفانجليستا توريشيلي تجربة شهيرة: ملأ أنبوبًا زجاجيًا بالزئبق وقلبه في وعاء، فهبط الزئبق إلى ارتفاع نحو 760 مم وتوقف. الضغط الجوي على سطح الوعاء حمل العمود، وفوقه صار فراغ تقريبًا."),
  draw:()=>[A.wipe(),ttl("Torricellis försök"),A.hatch("M183 395 L417 395 L410 430 L190 430 Z","k"),A.p("M180 380 L190 430 L410 430 L420 380","k",4.5),
   A.hatch(rp(287,170,26,250),"k"),A.p("M285 420 L285 120 Q300 104 315 120 L315 420","k",4),...callout([300,142],400,128,"vakuum","v",28),...callout([300,300],440,262,"kvicksilver","k",28),
   A.p(R.line(250,170,250,395,.2)+R.line(240,170,260,170,.1)+R.line(240,395,260,395,.1),"r",3.5),A.tx("760 mm",236,292,32,"r","end"),
   A.arrow(360,322,362,388,"b"),A.arrow(395,322,393,388,"b"),A.tx("lufttrycket",440,350,28,"b","start"),A.tx("år 1643",640,190,34,"k")]},
 {say:t3("Ett instrument som mäter lufttrycket kallas barometer. De flesta har en tunn metalldosa som är nästan lufttom. När lufttrycket ändras trycks dosan ihop mer eller mindre, och en visare rör sig. Lufttryck anges ofta i hektopascal: 1 hPa = 100 Pa.",
   "An instrument that measures air pressure is called a barometer. Most have a thin metal capsule that is almost empty of air. When the air pressure changes, the capsule is squeezed more or less, and a pointer moves. Air pressure is often given in hectopascals: 1 hPa = 100 Pa.",
   "الجهاز الذي يقيس الضغط الجوي يسمى البارومتر. معظمها فيه علبة معدنية رقيقة شبه مفرغة من الهواء، تنضغط أكثر أو أقل عندما يتغير الضغط الجوي فيتحرك مؤشر. ويُعطى الضغط الجوي غالبًا بالهكتوباسكال: 1 hPa = 100 Pa."),
  draw:()=>[A.wipe(),ttl("Barometern"),...dial(250,285,150,1013),A.tx("hPa",250,370,26,"k"),
   A.hatch("M480 300 L500 285 L520 300 L540 285 L560 300 L580 285 L600 300 L620 285 L640 300 L640 340 L480 340 Z","k"),A.p("M480 300 L500 285 L520 300 L540 285 L560 300 L580 285 L600 300 L620 285 L640 300 L640 340 L480 340 Z","k",4),
   A.arrow(520,200,520,272,"b"),A.arrow(600,200,600,272,"b"),A.tx("lufttryck",560,182,26,"b"),A.tx("metalldosa",560,384,28,"k"),A.tx("nästan lufttom",560,416,24,"k"),
   note("1 hPa = 100 Pa  ·  1013 hPa = 101,3 kPa",478,"b",28)]},
 {say:t3("Lufttrycket ändras med vädret. Normalt är det cirka 1013 hPa. Ett högtryck ger ofta stabilt och klart väder. Vid ett lågtryck stiger luften, moln bildas och det blir ofta regn och blåst. Sjunker barometern snabbt kan oväder vara på väg.",
   "Air pressure changes with the weather. Normally it is about 1013 hPa. A high pressure often brings stable, clear weather. In a low pressure the air rises, clouds form and there is often rain and wind. If the barometer falls quickly, a storm may be on its way.",
   "يتغير الضغط الجوي مع الطقس، وهو عادةً نحو 1013 هكتوباسكال. المرتفع الجوي يجلب غالبًا طقسًا مستقرًا صافيًا، وفي المنخفض يصعد الهواء وتتكون الغيوم ويكثر المطر والرياح. وإذا هبط البارومتر بسرعة فقد تكون عاصفة في الطريق."),
  draw:()=>[A.wipe(),ttl("Lufttryck och väder"),A.loop(220,285,60,45,"b"),A.loop(220,285,110,80,"b"),A.loop(220,285,160,112,"b"),A.tx("H",220,305,56,"b"),
   A.loop(580,285,60,45,"r"),A.loop(580,285,110,80,"r"),A.loop(580,285,160,112,"r"),A.tx("L",580,305,56,"r"),...artLines("sun",80,130,.55),...artLines("cloud",715,135,.85),
   A.p("M680 175 L672 195 M700 178 L692 198 M720 175 L712 195","b",3),A.tx("högtryck: ofta klart och lugnt",220,450,24,"b"),A.tx("lågtryck: moln, regn och blåst",580,450,24,"r")]},
 {say:t3("Ofta jämför vi ett tryck med luftens. Är trycket större än lufttrycket kallas skillnaden övertryck. Är det mindre kallas det undertryck. En däckmätare visar övertrycket: 230 kPa på mätaren betyder att trycket i däcket är 230 + 101 = 331 kPa.",
   "We often compare a pressure with the air's. If the pressure is bigger than the air pressure, the difference is called overpressure. If it is smaller, it is called underpressure. A tyre gauge shows the overpressure: 230 kPa on the gauge means the pressure in the tyre is 230 + 101 = 331 kPa.",
   "كثيرًا ما نقارن ضغطًا ما بضغط الهواء. إذا كان أكبر منه سُمّي الفرق ضغطًا زائدًا، وإذا كان أصغر سُمّي ضغطًا ناقصًا. مقياس الإطار يُظهر الضغط الزائد: 230 كيلوباسكال على المقياس تعني أن الضغط في الإطار 230 + 101 = 331 كيلوباسكال."),
  draw:()=>{const Y=p=>440-p*.8;return[A.wipe(),ttl("Övertryck och undertryck"),A.p(R.line(300,Y(0),300,Y(380),.3),"k",4),
   ...[[0,"0 kPa: vakuum","k"],[101,"101 kPa: lufttrycket","b"],[331,"331 kPa: i däcket","r"]].flatMap(([p,s,c])=>[A.p(R.line(290,Y(p),310,Y(p),.1),c,5),A.tx(s,280,Y(p)+9,26,c,"end")]),
   A.p(R.line(320,Y(101),320,Y(331),.2)+R.line(314,Y(331),326,Y(331),.1),"r",4),A.tx("övertryck",335,Y(216)-6,28,"r","start"),A.tx("230 kPa",335,Y(216)+28,28,"r","start"),
   A.p(R.line(320,Y(101),320,Y(60),.2)+R.line(314,Y(60),326,Y(60),.1),"v",4),A.tx("undertryck",335,Y(80)+9,26,"v","start"),
   A.p(R.circ(650,240,68),"k",5),A.p(R.arrow(650,240,692,206),"r",5),A.tx("230",650,290,30,"k"),A.tx("kPa",650,155,22,"k"),A.tx("däckmätaren visar",650,350,24,"k"),A.tx("övertrycket",650,380,24,"r")]}},
 {say:t3("En manometer mäter övertryck eller undertryck. Den enklaste är ett U-rör med vätska. Ena änden kopplas till det man vill mäta, den andra är öppen mot luften. Höjdskillnaden h visar trycket. Med vatten i röret motsvarar 10 cm skillnad ungefär 1 kPa.",
   "A manometer measures overpressure or underpressure. The simplest is a U-tube with liquid. One end is connected to what you want to measure, the other is open to the air. The height difference h shows the pressure. With water in the tube, a 10 cm difference is about 1 kPa.",
   "المانومتر يقيس الضغط الزائد أو الناقص. أبسطه أنبوب على شكل U فيه سائل، يوصل أحد طرفيه بما نريد قياسه ويبقى الآخر مفتوحًا للهواء. فرق الارتفاع h يُظهر الضغط، ومع الماء في الأنبوب يعادل فرق 10 سم نحو 1 كيلوباسكال."),
  draw:()=>[A.wipe(),ttl("Manometern"),...balloon(120,210,55,68,"o"),A.p("M175 210 Q250 210 260 150 Q270 100 315 100 L315 120","k",5),
   A.hatch("M300 300 L330 300 L330 400 L410 400 L410 220 L440 220 L440 430 L300 430 Z","b"),A.p("M300 120 L300 430 L440 430 L440 120 M330 120 L330 400 L410 400 L410 120","k",4),
   A.p("M300 300 L330 300 M410 220 L440 220","b",3),dsh(300,300,480,300,"k",2),dsh(440,220,480,220,"k",2),A.p(R.line(470,220,470,300,.1),"r",4),A.tx("h",484,272,36,"r","start"),
   A.tx("öppen mot luften",455,112,24,"k","start"),A.tx("gas med övertryck",120,340,24,"o"),A.tx("10 cm vatten",560,340,28,"b","start"),A.tx("≈ 1 kPa",560,376,28,"b","start")]},
 {say:t3("Blodtrycket mäts med en manschett runt överarmen. Den pumpas upp tills blodet stoppas och släpps sedan ut långsamt. Två värden avläses: det övre när hjärtat drar ihop sig och det undre när det vilar. Ett normalt värde kan vara 120/80 mm kvicksilver, mmHg.",
   "Blood pressure is measured with a cuff around the upper arm. It is pumped up until the blood is stopped and then let out slowly. Two values are read: the upper when the heart contracts and the lower when it rests. A normal value can be 120/80 millimetres of mercury, mmHg.",
   "يُقاس ضغط الدم بكُمّ حول أعلى الذراع يُنفخ حتى يتوقف الدم ثم يُفرَّغ ببطء. تُقرأ قيمتان: العليا عندما ينقبض القلب، والدنيا عندما يرتاح. قد تكون القيمة الطبيعية 120/80 ملم زئبق."),
  draw:()=>[A.wipe(),ttl("Blodtrycksmätaren"),A.p("M60 222 Q300 200 520 232 M60 300 Q300 312 520 292","k",4.5),A.p(R.circ(548,262,34),"k",4),
   A.hatch(rp(180,195,140,122),"b"),A.p(R.rect(180,195,140,122,.3),"b",4),A.p("M250 195 Q262 120 590 160","k",4),A.p("M300 317 Q350 400 605 392","k",4),
   A.p(R.circ(650,160,58),"k",4),A.p(R.arrow(650,160,690,128),"r",4),A.tx("mmHg",650,200,20,"k"),A.hatch(ellP(640,400,34,46),"k"),A.p(ellP(640,400,34,46),"k",4),
   A.tx("120 / 80",250,410,48,"r"),A.tx("övre / undre",250,450,24,"k"),A.tx("120 mmHg ≈ 16 kPa",250,484,22,"k")]},
 {say:t3("Räkna med lufttryck. En barometer visar 990 hPa. Hur många kPa är det? 990 hPa = 990 · 100 Pa = 99 000 Pa = 99 kPa. Det är lägre än det normala 1013 hPa, alltså ett lågtryck. Kanske blir det regn.",
   "Calculate with air pressure. A barometer shows 990 hPa. How many kPa is that? 990 hPa = 990 · 100 Pa = 99,000 Pa = 99 kPa. That is lower than the normal 1013 hPa, so it is a low pressure. Maybe it will rain.",
   "لنحسب بالضغط الجوي: بارومتر يُظهر 990 هكتوباسكال. كم كيلوباسكال هذا؟ 990 hPa = 990 · 100 Pa = 99000 Pa = 99 kPa. هذا أقل من القيمة العادية 1013 هكتوباسكال، إذن هو منخفض جوي، وربما تمطر."),
  draw:()=>[A.wipe(),ttl("Räkna med lufttryck"),A.tx("Barometern visar 990 hPa.",400,140,34,"k"),A.tx("990 hPa = 990 · 100 Pa",400,210,38,"k"),A.tx("= 99 000 Pa",400,265,38,"k"),
   A.hl(290,290,220,58),A.tx("= 99 kPa",400,332,44,"b"),A.tx("lägre än 1013 hPa → lågtryck",400,400,30,"r"),A.tx("kanske regn",400,445,28,"k")]},
 {say:t3("Kom ihåg: en barometer mäter lufttrycket och en manometer mäter övertryck eller undertryck. 1 hPa är 100 Pa, och normalt lufttryck är ungefär 1013 hPa. Högtryck ger oftast fint väder och lågtryck ofta regn. Blodtryck mäts i mmHg.",
   "Remember: a barometer measures air pressure and a manometer measures overpressure or underpressure. 1 hPa is 100 Pa, and normal air pressure is about 1013 hPa. High pressure usually brings fine weather and low pressure often rain. Blood pressure is measured in mmHg.",
   "تذكّر: البارومتر يقيس الضغط الجوي، والمانومتر يقيس الضغط الزائد أو الناقص. 1 هكتوباسكال = 100 باسكال، والضغط الجوي العادي نحو 1013 هكتوباسكال. المرتفع يجلب غالبًا طقسًا جيدًا والمنخفض مطرًا. ويُقاس ضغط الدم بملم زئبق."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["barometer: mäter lufttrycket","b"],["manometer: mäter över- och undertryck","k"],["1 hPa = 100 Pa, normalt ca 1013 hPa","b"],["högtryck: fint väder, lågtryck: regn","g"],["blodtryck mäts i mmHg","r"]],80,150,62,30)]},
]};
const P7={
 dial:()=>[...dial(200,270,150,985),A.tx("hPa",200,355,26,"k")],
 utube:()=>[A.hatch("M120 320 L150 320 L150 400 L230 400 L230 240 L260 240 L260 430 L120 430 Z","b"),A.p("M120 140 L120 430 L260 430 L260 140 M150 140 L150 400 L230 400 L230 140","k",4),
   A.p("M120 320 L150 320 M230 240 L260 240","b",3),A.p("M135 140 Q135 100 80 100 L50 100","k",5),A.tx("gas",50,90,26,"o"),A.tx("öppen",290,140,24,"k"),dsh(260,240,330,240,"k",2),dsh(150,320,330,320,"k",2),
   A.p(R.line(320,240,320,320,.1),"r",4),A.tx("20 cm",335,288,26,"r","start")],
};
const BANK_T7=[
 {lv:0,q:"Vad mäter en barometer?",a:"lufttrycket",w:["temperaturen","vindens fart","regnmängden"]},
 {lv:0,q:"Hur många pascal är 1 hPa?",a:"100 Pa",w:["10 Pa","1 000 Pa","1 Pa"]},
 {lv:0,q:"Vilket väder ger ett högtryck oftast?",a:"klart och lugnt",w:["regn och blåst","snöstorm","åska varje dag"]},
 {lv:0,q:"Vad visar barometern ungefär?",a:"985 hPa, lägre än normalt",w:["1013 hPa, normalt","1040 hPa, högtryck","960 kPa"],lines:["Vad visar","barometern?"],pic:P7.dial},
 {lv:1,q:"Hur många kPa är 1013 hPa?",a:"101,3 kPa",w:["10,13 kPa","1 013 kPa","1,013 kPa"]},
 {lv:1,q:"Vad kallas det när trycket är större än lufttrycket?",a:"övertryck",w:["undertryck","vakuum","lågtryck"]},
 {lv:1,q:"Vad mäter en manometer?",a:"övertryck eller undertryck",w:["temperatur","höjd över havet","vindriktning"]},
 {lv:1,q:"Vilken vätska använde Torricelli?",a:"kvicksilver",w:["vatten","olja","mjölk"]},
 {lv:1,q:"Ungefär hur hög blev kvicksilverpelaren i Torricellis försök?",a:"760 mm",w:["76 mm","7,6 m","10 m"]},
 {lv:1,q:"Hur stort är övertrycket i gasen?",a:"ca 2 kPa",w:["ca 20 kPa","ca 0,2 kPa","ca 200 kPa"],lines:["Vatten i U-röret.","Hur stort är","övertrycket?"],pic:P7.utube},
 {lv:2,q:"En däckmätare visar 200 kPa. Hur stort är trycket i däcket?",a:"ca 301 kPa",w:["200 kPa","99 kPa","ca 101 kPa"]},
 {lv:2,q:"Trycket i en burk är 81 kPa. Hur stort är undertrycket?",a:"ca 20 kPa",w:["81 kPa","182 kPa","ca 2 kPa"]},
 {lv:2,q:"En barometer visar 1030 hPa. Hur många kPa är det?",a:"103 kPa",w:["10,3 kPa","1 030 kPa","1,03 kPa"]},
 {lv:2,q:"Barometern sjunker snabbt. Vad kan det betyda?",a:"oväder kan vara på väg",w:["det blir säkert soligt","det blir kallare inomhus","barometern är trasig"]},
 {lv:2,q:"Vad betyder den övre siffran i blodtrycket 120/80?",a:"trycket när hjärtat drar ihop sig",w:["trycket när hjärtat vilar","pulsen per minut","kroppens temperatur"]},
 {lv:2,q:"Vad fanns ovanför kvicksilvret i Torricellis rör?",a:"nästan vakuum",w:["luft med högt tryck","vatten","kvicksilverånga med högt tryck"]},
 {lv:1,q:"Skriv ordet: ett instrument som mäter lufttrycket heter …",a:["barometer","barometern"],lines:["Skriv ordet som saknas:","Ett instrument som mäter","lufttrycket heter en …"]},
 {lv:2,q:"Skriv ordet: när ett tryck är mindre än lufttrycket kallas skillnaden …",a:["undertryck","undertrycket"],lines:["Skriv ordet som saknas:","Trycket är mindre än luftens.","Skillnaden kallas …"]},
];
LESSONS.push({id:"f7t7",subject:"science",grades:"7",kind:"wb",year:7,ord:47,
 title:t3("Lär mer: Tryck mäts på många sätt","Learn more: Many ways to measure pressure","تعلّم أكثر: طرق كثيرة لقياس الضغط"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="110" cy="95" r="62" fill="#fff" stroke="#1d2433" stroke-width="5"/><path d="M110 95L136 58" stroke="#d63b2f" stroke-width="5"/><circle cx="110" cy="95" r="6" fill="#1d2433"/><path d="M215 40V150H265V40M228 40V136H252V40" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M215 110H228V136H252V80H265V150H215Z" fill="#c9d8f5"/></svg>`,
 steps:T7.steps,mount:wbMount(T7),gen:bankGen(BANK_T7)});
WORDS.f7t7=["f7t_barometer","f7t_manometer","f7t_overtryck","f7t_undertryck","f7t_hpa","f7t_hogtryck"];

/* ---------------------------------------------------------------
   8. f7t8: Lär mer: Arkimedes
   --------------------------------------------------------------- */
const CROWN="M100 190 L100 150 L125 170 L150 140 L175 170 L200 150 L200 190 Z";
const subD=(x,y)=>`M${x-120} ${y}Q${x-120} ${y-34} ${x-70} ${y-34}L${x+80} ${y-34}Q${x+125} ${y-30} ${x+125} ${y}Q${x+125} ${y+30} ${x+80} ${y+34}L${x-70} ${y+34}Q${x-120} ${y+34} ${x-120} ${y}Z`;
const sub=(x,y,full)=>[A.p(subD(x,y),"k",4.5),A.p(R.rect(x-20,y-64,46,30,.2),"k",4),A.p(`M${x-130} ${y-14}L${x-150} ${y-24}L${x-150} ${y+24}L${x-130} ${y+14}`,"k",3.5),
  ...(full?[A.hatch(rp(x-80,y+2,60,24),"b"),A.hatch(rp(x+20,y+2,60,24),"b")]:[]),A.p(R.rect(x-80,y+2,60,24,.2)+R.rect(x+20,y+2,60,24,.2),"k",3)];
const T8={steps:[
 {say:t3("Arkimedes levde för mer än 2 200 år sedan i Syrakusa på Sicilien. Enligt en berömd berättelse ville kungen veta om hans nya krona var av rent guld. När Arkimedes steg ner i ett badkar såg han vattnet stiga. Han förstod att han kunde mäta kronans volym med vatten!",
   "Archimedes lived more than 2,200 years ago in Syracuse on Sicily. According to a famous story, the king wanted to know if his new crown was pure gold. When Archimedes stepped into a bath he saw the water rise. He realised he could measure the crown's volume with water!",
   "عاش أرخميدس قبل أكثر من 2200 عام في سرقوسة في صقلية. وتقول قصة شهيرة إن الملك أراد أن يعرف هل تاجه الجديد من الذهب الخالص. وعندما نزل أرخميدس في حوض الاستحمام رأى الماء يرتفع، ففهم أنه يستطيع قياس حجم التاج بالماء!"),
  draw:()=>[A.wipe(),ttl("Arkimedes och kronan"),A.hatch("M128 300 L572 300 L560 400 Q550 420 520 420 L180 420 Q150 420 140 400 Z","b"),A.p("M120 260 L140 400 Q150 420 180 420 L520 420 Q550 420 560 400 L580 260","k",5),
   A.p("M180 420 L170 450 M520 420 L530 450","k",5),dsh(130,330,570,330,"k",2),A.p(R.line(130,300,570,300,.3),"b",3),A.p(R.circ(300,270,26),"k",4),A.p("M262 300 Q300 284 338 300","k",4),A.p("M282 284 Q300 296 318 284","k",3),
   A.flow("M578 296 Q600 330 606 430","b",4,1.6,5),A.hatch(CROWN,"o"),A.p(CROWN,"o",4),A.tx("äkta guld?",150,225,24,"k"),A.tx("Heureka!",650,170,52,"o"),A.tx("Jag har funnit det!",650,212,24,"k")]},
 {say:t3("Sänker man ner ett föremål i ett fullt kärl rinner vatten över. Det vatten som föremålet knuffar undan kallas undanträngt vatten. Föremålet tränger undan lika stor volym vatten som volymen av den del av föremålet som är under ytan.",
   "If you lower an object into a full container, water runs over. The water the object pushes aside is called displaced water. The object displaces a volume of water equal to the volume of the part of the object that is under the surface.",
   "إذا أنزلت جسمًا في وعاء ممتلئ فاض الماء. الماء الذي يدفعه الجسم جانبًا يسمى الماء المُزاح. ويزيح الجسم حجمًا من الماء يساوي حجم الجزء المغمور منه تحت السطح."),
  draw:()=>[A.wipe(),ttl("Undanträngt vatten"),...water(150,220,180,210),tank(150,160,180,270),A.p("M330 222 L380 250","k",5),
   A.p(R.line(240,96,240,260,.1),"k",3),...box(200,260,80,80,"o"),A.flow("M342 228 Q372 240 386 262 L392 380","b",5,1.6,5),
   A.p("M370 330 L370 430 L470 430 L470 330","k",4),A.hatch(rp(372,390,96,38),"b"),A.p("M370 360 L385 360 M370 390 L385 390","k",2.5),
   ...callout([430,410],520,380,"undanträngt vatten","b",28),A.tx("= klossens volym",520,420,26,"k","start")]},
 {say:t3("Arkimedes princip: ett föremål i en vätska får en lyftkraft som är lika stor som tyngden av den vätska som föremålet tränger undan. Det gäller allt: stenar, båtar, fiskar och dig själv när du badar. Det gäller även i luften, till exempel för en ballong.",
   "Archimedes' principle: an object in a liquid gets a buoyancy equal to the weight of the liquid that the object displaces. It holds for everything: stones, boats, fish and yourself when you swim. It holds in air too, for example for a balloon.",
   "مبدأ أرخميدس: الجسم في سائل يتلقى قوة طفو تساوي وزن السائل الذي يزيحه. وهذا ينطبق على كل شيء: الحجارة والسفن والأسماك وعليك أنت عندما تسبح، بل وفي الهواء أيضًا، مثل البالون."),
  draw:()=>[A.wipe(),ttl("Arkimedes princip"),A.band(60,95,680,135,"b"),A.tx("Lyftkraften är lika stor som tyngden",400,150,32,"b"),A.tx("av den vätska som föremålet tränger undan.",400,200,32,"b"),
   ...water(100,300,220,150),tank(100,270,220,180),...box(170,330,80,80,"o"),A.p(R.arrow(210,370,210,285),"g",5),A.tx("lyftkraft",335,320,28,"g","start"),A.tx("=",480,380,56,"k"),
   A.hatch(rp(560,330,80,80),"b"),A.p(R.dashed(560,330,640,330)+R.dashed(640,330,640,410)+R.dashed(640,410,560,410)+R.dashed(560,410,560,330),"b",3),A.tx("undanträngt vatten",600,312,24,"b"),
   A.p(R.arrow(600,370,600,460),"r",5),A.tx("dess tyngd",615,450,26,"r","start")]},
 {say:t3("Räkneexempel: en kloss med volymen 2 dm³ sänks helt ner i vatten. Den tränger undan 2 dm³ vatten. 1 dm³ vatten väger 1 kg, så det undanträngda vattnet har massan 2 kg. Tyngden blir ungefär 20 N. Lyftkraften är alltså 20 N.",
   "Worked example: a block with a volume of 2 dm³ is lowered completely into water. It displaces 2 dm³ of water. 1 dm³ of water has a mass of 1 kg, so the displaced water has a mass of 2 kg. Its weight is about 20 N. So the buoyancy is 20 N.",
   "مثال حسابي: مكعب حجمه 2 دسم³ يُغمر كليًا في الماء، فيزيح 2 دسم³ من الماء. كتلة 1 دسم³ من الماء 1 كغ، إذن كتلة الماء المزاح 2 كغ ووزنه نحو 20 نيوتن. فقوة الطفو 20 نيوتن."),
  draw:()=>[A.wipe(),ttl("Räkneexempel 1"),...water(60,180,270,260),tank(60,150,270,290),...box(140,260,100,100,"o"),A.tx("2 dm³",190,318,28,"k"),A.p(R.arrow(290,420,290,300),"g",5),
   A.tx("klossens volym: 2 dm³",380,150,28,"k","start"),A.tx("tränger undan 2 dm³ vatten",380,200,28,"b","start"),A.tx("1 dm³ vatten = 1 kg",380,250,28,"k","start"),
   A.tx("2 dm³ vatten = 2 kg",380,300,28,"k","start"),A.tx("tyngd ≈ 2 · 10 N = 20 N",380,350,28,"r","start"),A.hl(380,385,330,56),A.tx("lyftkraft = 20 N",545,426,40,"g")]},
 {say:t3("Om klossen väger 50 N i luften visar dynamometern 50 N − 20 N = 30 N under vattnet. Om klossen i stället bara vägde 15 N skulle den flyta upp, eftersom den största lyftkraften, 20 N, är större än tyngden. Den flyter då med 1,5 dm³ under ytan.",
   "If the block weighs 50 N in air, the spring scale shows 50 N − 20 N = 30 N under water. If the block instead weighed only 15 N it would float up, because the largest buoyancy, 20 N, is bigger than the weight. It then floats with 1.5 dm³ below the surface.",
   "إذا كان وزن المكعب 50 نيوتن في الهواء فسيُظهر الميزان تحت الماء 50 − 20 = 30 نيوتن. ولو كان وزنه 15 نيوتن فقط لطفا، لأن أكبر قوة طفو، 20 نيوتن، أكبر من وزنه، ويطفو عندها و1,5 دسم³ منه تحت السطح."),
  draw:()=>[A.wipe(),ttl("Räkneexempel 2"),A.p(R.line(40,100,430,100,.4),"#8a5a2b",6),...dyn(110,100,40,"50 N"),...box(80,244,60,60,"o"),A.tx("i luften",110,350,26,"k"),
   ...water(260,280,160,150),tank(260,250,160,180),...dyn(340,100,180,"30 N"),...box(310,384,60,40,"o"),A.tx("i vattnet",340,470,26,"k"),
   A.tx("50 N − 20 N = 30 N",455,160,32,"b","start"),A.tx("Om klossen bara vägde 15 N:",455,240,26,"k","start"),A.tx("lyftkraften 20 N > 15 N",455,280,26,"k","start"),
   A.tx("→ den flyter upp",455,320,26,"g","start"),A.tx("1,5 dm³ under ytan",455,360,26,"g","start")]},
 {say:t3("Hur kan ett fartyg av stål flyta, när stål har densiteten 7,9 g/cm³? En stålklump sjunker. Men skrovet är format som en stor skål full av luft, och det tränger undan väldigt mycket vatten. Fartyget sjunker ner tills det undanträngda vattnet väger lika mycket som hela fartyget.",
   "How can a steel ship float when steel has a density of 7.9 g/cm³? A lump of steel sinks. But the hull is shaped like a big bowl full of air, and it displaces a great deal of water. The ship sinks down until the displaced water weighs as much as the whole ship.",
   "كيف تطفو سفينة من الفولاذ وكثافته 7,9 غ/سم³؟ كتلة الفولاذ تغرق، لكن الهيكل مصنوع كوعاء كبير مليء بالهواء فيزيح كمية كبيرة جدًا من الماء. وتنزل السفينة حتى يصبح وزن الماء المزاح مساويًا لوزن السفينة كلها."),
  draw:()=>[A.wipe(),ttl("Båtar av stål"),...water(40,220,330,210),tank(40,160,330,270),...box(175,395,60,35,"k"),A.p(R.arrow(205,300,205,382),"r",4),A.tx("klump: sjunker",205,470,28,"r"),
   ...water(430,220,340,210),tank(430,160,340,270),A.art(`<path d="M500 200 L700 200 L680 262 L520 262 Z" fill="#fbfcfe"/>`,0,0,1),A.p("M500 200 L700 200 L680 262 L520 262 Z","k",6),A.tx("luft",600,240,24,"k"),A.p(R.arrow(600,345,600,270),"g",5),A.tx("lyftkraft",615,330,26,"g","start"),
   A.tx("skål: flyter",600,470,28,"g")]},
 {say:t3("Ju mer last ett fartyg har, desto djupare ligger det, eftersom det måste tränga undan mer vatten. Salt vatten har högre densitet än sött, så ett fartyg ligger lite högre i havet än i en sjö. I Döda havet, som är mycket salt, flyter man nästan som en kork.",
   "The more cargo a ship carries, the deeper it lies, because it must displace more water. Salt water has a higher density than fresh water, so a ship lies a little higher in the sea than in a lake. In the Dead Sea, which is very salty, you float almost like a cork.",
   "كلما زادت حمولة السفينة غاصت أعمق، لأنها يجب أن تزيح ماءً أكثر. والماء المالح أكثف من العذب، فتطفو السفينة أعلى قليلًا في البحر منها في البحيرة. وفي البحر الميت شديد الملوحة يطفو الإنسان تقريبًا كالفلّينة."),
  draw:()=>[A.wipe(),ttl("Last och salt vatten"),...water(40,250,330,180),tank(40,170,330,260),...boat(205,226),A.tx("utan last",205,470,28,"k"),
   ...water(430,250,330,180),tank(430,170,330,260),...boat(595,254),A.hatch(rp(520,224,50,30)+rp(625,224,50,30),"o"),A.p(R.rect(520,224,50,30,.2)+R.rect(625,224,50,30,.2),"k",3),A.tx("med last",595,470,28,"k"),
   A.tx("sötvatten 1,00 · saltvatten 1,03 · Döda havet 1,24 g/cm³",400,130,24,"b")]},
 {say:t3("En ubåt kan välja om den ska flyta eller sjunka. Den har barlasttankar. Fylls de med vatten blir ubåten tyngre än det vatten den tränger undan, och den dyker. Blåses vattnet ut med tryckluft blir den lättare och stiger. Fiskar gör ungefär likadant med sin simblåsa.",
   "A submarine can choose whether to float or sink. It has ballast tanks. When they are filled with water, the submarine becomes heavier than the water it displaces, and it dives. When the water is blown out with compressed air, it gets lighter and rises. Fish do roughly the same with their swim bladder.",
   "تستطيع الغواصة أن تختار أن تطفو أو تغوص، فلها خزانات صابورة. إذا مُلئت بالماء صارت الغواصة أثقل من الماء الذي تزيحه فتغوص، وإذا نُفخ الماء خارجها بالهواء المضغوط صارت أخف فتصعد. والأسماك تفعل شيئًا مشابهًا بمثانتها الهوائية."),
  draw:()=>[A.wipe(),ttl("Ubåten"),A.band(30,120,740,340,"b"),A.p("M30 120 Q100 110 170 120 Q240 130 310 120 Q380 110 450 120 Q520 130 590 120 Q660 110 770 120","b",4),
   ...sub(220,200,false),A.p(R.arrow(375,230,375,160),"g",5),A.tx("luft i tankarna → stiger",220,280,24,"g"),
   ...sub(560,345,true),A.p(R.arrow(720,320,720,400),"r",5),A.tx("vatten i tankarna → dyker",560,430,24,"r")]},
 {say:t3("Kom ihåg Arkimedes princip: lyftkraften är lika stor som tyngden av den undanträngda vätskan. Ett föremål flyter om det kan tränga undan vätska som väger lika mycket som det självt. Därför flyter stålfartyg, och därför kan ubåtar dyka och stiga.",
   "Remember Archimedes' principle: the buoyancy equals the weight of the displaced liquid. An object floats if it can displace liquid that weighs as much as itself. That is why steel ships float, and why submarines can dive and rise.",
   "تذكّر مبدأ أرخميدس: قوة الطفو تساوي وزن السائل المزاح. يطفو الجسم إذا استطاع أن يزيح سائلًا يساوي وزنه هو. لهذا تطفو سفن الفولاذ، ولهذا تستطيع الغواصات أن تغوص وتصعد."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["lyftkraft = tyngden av undanträngd vätska","b"],["1 dm³ vatten ≈ 1 kg ≈ 10 N","k"],["flyter: kan tränga undan sin egen tyngd","g"],["skrovet är fullt av luft","o"],["ubåten fyller eller tömmer tankar","r"]],70,150,62,30)]},
]};
const P8={
 block:()=>[...water(60,180,300,250),tank(60,150,300,280),...box(150,260,110,110,"o"),A.tx("3 dm³",205,322,30,"k"),A.p(R.arrow(320,420,320,300),"g",5),A.tx("?",336,350,40,"g","start")],
 subs:()=>[A.band(30,120,350,320,"b"),...sub(200,280,true),A.p(R.arrow(350,320,350,400),"r",5)],
};
const BANK_T8=[
 {lv:0,q:"Vem upptäckte principen om lyftkraft i vätskor?",a:"Arkimedes",w:["Torricelli","Pascal","Newton"]},
 {lv:0,q:"Vad händer när man sänker ner en kloss i ett fullt kärl?",a:"vatten rinner över",w:["vattnet krymper","ingenting","vattnet blir varmare"]},
 {lv:0,q:"Hur mycket väger 1 dm³ vatten?",a:"ca 1 kg",w:["ca 10 kg","ca 100 g","ca 1 g"]},
 {lv:0,q:"Vad gör ubåten för att dyka?",a:"fyller tankarna med vatten",w:["fyller tankarna med luft","stänger av motorn","tänder lamporna"],lines:["Ubåten dyker.","Vad har den gjort?"],pic:P8.subs},
 {lv:1,q:"Hur stor är lyftkraften på klossen?",a:"ca 30 N",w:["ca 3 N","ca 300 N","ca 0,3 N"],lines:["Klossen är helt","under vattnet.","Hur stor är lyftkraften?"],pic:P8.block},
 {lv:1,q:"Vad säger Arkimedes princip?",a:"lyftkraften är lika stor som tyngden av den undanträngda vätskan",w:["lyftkraften är lika stor som föremålets tyngd","lyftkraften är alltid 10 N","lyftkraften är störst i luft"]},
 {lv:1,q:"En kloss på 0,5 dm³ är helt under vatten. Hur stor är lyftkraften?",a:"ca 5 N",w:["ca 50 N","ca 0,5 N","ca 500 N"]},
 {lv:1,q:"Varför kan ett fartyg av stål flyta?",a:"skrovet är fullt av luft och tränger undan mycket vatten",w:["stål är lättare än vatten","fartyget har motorer","vattnet är saltare under fartyget"]},
 {lv:1,q:"Varför flyter man lättare i Döda havet?",a:"det salta vattnet har högre densitet",w:["vattnet är varmare","det finns mindre vatten","luften är tunnare där"]},
 {lv:1,q:"Vad händer med ett fartyg som lastas tyngre?",a:"det sjunker djupare",w:["det stiger högre","det ligger lika djupt","det börjar flyta snabbare"]},
 {lv:2,q:"En kloss väger 80 N i luften och har volymen 2 dm³. Vad visar dynamometern när klossen är helt under vatten?",a:"ca 60 N",w:["ca 100 N","ca 78 N","ca 20 N"],lines:["Klossen väger 80 N","och har volymen 2 dm³.","Vad visar dynamometern","under vattnet?"]},
 {lv:2,q:"En båt väger 5 000 N. Hur stor volym vatten tränger den undan när den flyter?",a:"ca 0,5 m³",w:["ca 5 m³","ca 50 m³","ca 0,05 m³"]},
 {lv:2,q:"En kloss på 2 dm³ väger 15 N. Vad händer i vatten?",a:"den flyter, eftersom lyftkraften kan bli 20 N",w:["den sjunker, eftersom 15 N är mycket","den svävar mitt i vattnet","den sjunker, eftersom volymen är stor"]},
 {lv:2,q:"Hur stor del av klossen på 2 dm³ och 15 N ligger under ytan när den flyter?",a:"1,5 dm³",w:["2 dm³","0,5 dm³","1 dm³"]},
 {lv:2,q:"Vad gör ubåten för att stiga?",a:"blåser ut vattnet ur tankarna med tryckluft",w:["fyller tankarna med mer vatten","tar in mer last","stänger luckorna"]},
 {lv:2,q:"Ett fartyg åker från en sjö ut till havet. Vad händer?",a:"det kommer att ligga lite högre",w:["det kommer att ligga lite djupare","det sjunker","ingenting alls"]},
 {lv:1,q:"Skriv namnet: vem ropade ”Heureka!” i badkaret?",a:["arkimedes","archimedes"],lines:["Skriv namnet:","Vem ropade ”Heureka!”","i badkaret?"]},
 {lv:2,q:"Skriv ordet: vattnet som ett föremål knuffar undan kallas … vatten",a:["undanträngt","undanträngda"],lines:["Skriv ordet som saknas:","Vattnet som ett föremål knuffar","undan kallas … vatten."]},
];
LESSONS.push({id:"f7t8",subject:"science",grades:"7",kind:"wb",year:7,ord:48,
 title:t3("Lär mer: Arkimedes","Learn more: Archimedes","تعلّم أكثر: أرخميدس"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="20" y="95" width="280" height="75" fill="#e3ecfb"/><path d="M20 95Q90 88 160 95Q230 102 300 95" stroke="#2257c9" stroke-width="3" fill="none"/><path d="M90 80H230L210 125H110Z" fill="#fff" stroke="#1d2433" stroke-width="4"/><rect x="140" y="52" width="40" height="28" fill="#fbe5c8" stroke="#1d2433" stroke-width="3"/><path d="M160 165V132M150 144L160 130L170 144" stroke="#1e9e5a" stroke-width="5" fill="none"/></svg>`,
 steps:T8.steps,mount:wbMount(T8),gen:bankGen(BANK_T8)});
WORDS.f7t8=["f7t_arkimedes","f7t_undantrangd","f7t_volym","f7t_skrov","f7t_ubat","f7t_lyftkraft"];
}

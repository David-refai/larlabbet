import {BRN,SENSE,art,bankGen,blist,callout,note,ntag,tfx,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,f1,t3,wbMount} from "../../legacy/core.js";
/* ===== fys7-varme.js: Fysik, Year 7, Värme och klimat (the order of the school book Titano Fysik; all texts our own) =====
   base:     f7v1 Temperatur och värme · f7v2 Vatten – en underlig vätska · f7v3 Värme sprider sig · f7v4 Klimat
             f7v5 Hållbar utveckling: Jordens klimat
   Lär mer:  f7v6 Termometern reagerar på värme · f7v7 Värmespridning – både bra och dåligt · f7v8 Extremväder
   Everything is drawn in marker style on the 800 × 500 board; particles shake with A.flow (still dots with reduced motion). */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
/* ---------- drawing helpers ---------- */
/* a steady "random" number 0..1 for a seed, so a scene looks the same every time */
const rnd=i=>{const s=Math.sin(i*12.9898+78.233)*43758.5453;return s-Math.floor(s)};
const P=pts=>"M"+pts.map(([x,y])=>f1(x)+" "+f1(y)).join(" L");
const fpath=(f,x0,x1,n=60)=>P([...Array(n+1)].map((_,i)=>{const x=x0+(x1-x0)*i/n;return[x,f(x)]}));
const dot=(x,y,c="k",r=7)=>A.p(`M${f1(x)} ${f1(y)} L${f1(x+.1)} ${f1(y)}`,c,r*2);
const rectP=(x,y,w,h)=>`M${x} ${y} L${x+w} ${y} L${x+w} ${y+h} L${x} ${y+h} Z`;
const box=(x,y,w,h,c="k",wd=3.5)=>A.p(R.rect(x,y,w,h,.4),c,wd);
const fmtT=t=>(t<0?"−"+(-t):String(t))+" °C";
/* particles that shake round their places: a = how far (0 = still dots), dur = seconds per round */
const jig=(x,y,a,s)=>{let d=`M${f1(x)} ${f1(y)}`;for(let k=1;k<6;k++)d+=` L${f1(x+(rnd(s+k)-.5)*2*a)} ${f1(y+(rnd(s+k+40)-.5)*2*a)}`;return d+" Z"};
const shake=(pts,a,dur,c="b",r=8)=>pts.map(([x,y],i)=>a?A.flow(jig(x,y,a,i*13+Math.round(x+y)),c,1,+(dur*(.8+rnd(i+5)*.4)).toFixed(2),r):dot(x,y,c,r));
const grid=(x0,y0,cols,rows,gx,gy=gx,j=0,s=0)=>{const o=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=s+r*cols+c;o.push([x0+c*gx+(rnd(i)-.5)*j,y0+r*gy+(rnd(i+99)-.5)*j])}return o};
/* a thermometer: x = centre, top, h = tube length, liquid up to ly (or a level 0..1) */
const thermoY=(x,top,h,ly,c="r")=>{const by=top+h+16;
  return[A.p(`M${x-11} ${top+h} L${x-11} ${top+11} Q${x-11} ${top} ${x} ${top} Q${x+11} ${top} ${x+11} ${top+11} L${x+11} ${top+h}`,"k",3.5),A.p(R.circ(x,by,19),"k",3.5),
   A.hatch(R.circ(x,by,13),c),A.p(`M${x} ${by-6} L${x} ${f1(ly)}`,c,9)]};
const thermo=(x,top,h,lv,c="r")=>{let t="";for(let i=1;i<=5;i++){const y=top+h-(h-14)*i/5.5;t+=R.line(x+12,y,x+22,y,.2)}
  return[...thermoY(x,top,h,top+h-(h-14)*lv,c),A.p(t,"k",2.5)]};
/* a thermometer with a scale lo..hi (marks every step, numbers when lab), showing v */
const thermoScale=(x,top,h,lo,hi,step,v,c="r",z=24,lab=true)=>{const Y=t=>top+h-14-(t-lo)/(hi-lo)*(h-34),o=thermoY(x,top,h,Y(v),c);let t="";
  for(let k=lo;k<=hi;k+=step){t+=R.line(x+12,Y(k),x+26,Y(k),.2);if(lab)o.push(A.tx(k<0?"−"+(-k):k,x+34,Y(k)+z*.35,z,"k","start"))}o.push(A.p(t,"k",2.5));return{o,Y}};
/* a wavy arrow: heat radiation */
const wave=(x1,y1,x2,y2,c="r",amp=7,n=4,w=3.5)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,Lw=L-16,N=n*10,a=Math.atan2(dy,dx);let d=`M${f1(x1)} ${f1(y1)}`;
  for(let i=1;i<=N;i++){const t=i/N*Lw,s=Math.sin(i/N*n*2*Math.PI)*amp;d+=` L${f1(x1+ux*t-uy*s)} ${f1(y1+uy*t+ux*s)}`}
  d+=` L${f1(x2)} ${f1(y2)} M${f1(x2)} ${f1(y2)} L${f1(x2-15*Math.cos(a-.45))} ${f1(y2-15*Math.sin(a-.45))} M${f1(x2)} ${f1(y2)} L${f1(x2-15*Math.cos(a+.45))} ${f1(y2-15*Math.sin(a+.45))}`;
  return A.p(d,c,w)};
/* a flame standing on (x, y), about 84 high at s = 1 */
const FLAME="M0 0 Q-28 -2 -26 -30 Q-24 -52 -6 -76 Q-2 -54 8 -46 Q14 -66 6 -84 Q34 -62 28 -30 Q28 -2 0 0 Z";
const flame=(x,y,s=1)=>[A.hatch(tfx(FLAME,x,y,s),"o"),A.p(tfx(FLAME,x,y,s),"r",3)];
/* a cup (centre x, y; about 92 high) with steam when hot */
const CUP="M-42 -46 L-36 34 Q-34 46 -22 46 L22 46 Q34 46 36 34 L42 -46 M42 -26 Q70 -28 68 -2 Q66 20 38 16";
const STEAM="M-16 -58 Q-28 -72 -16 -88 Q-4 -104 -16 -120 M10 -58 Q-2 -72 10 -88 Q22 -104 10 -120";
const cup=(x,y,s=1,hot=true)=>[A.hatch(tfx("M-38 -30 L-35 32 Q-33 42 -22 42 L22 42 Q33 42 35 32 L38 -30 Z",x,y,s),"o"),A.p(tfx(CUP,x,y,s),"k",3.5),...(hot?[A.p(tfx(STEAM,x,y,s),"r",3)]:[])];
const ice=(x,y,s=1)=>[A.hatch(tfx("M-40 -30 L20 -30 L20 30 L-40 30 Z",x,y,s),"b"),A.p(tfx("M-40 -30 L20 -30 L40 -46 L40 14 L20 30 L-40 30 Z M20 -30 L20 30 M-40 -30 L-20 -46 L40 -46",x,y,s),"b",3.5)];
/* the Earth: sea and a few continents */
const LAND="M-62 -48 Q-34 -82 2 -64 Q18 -42 -6 -26 Q-30 -10 -50 -24 Z M24 -12 Q54 -32 70 2 Q64 42 34 52 Q14 32 24 -12 Z M-56 26 Q-34 16 -26 42 Q-38 64 -58 50 Z";
const earth=(cx,cy,r)=>[A.hatch(R.circ(cx,cy,r),"b"),A.hatch(tfx(LAND,cx,cy,r/100),"g"),A.p(tfx(LAND,cx,cy,r/100),"g",3),A.p(R.circ(cx,cy,r),"b",4)];
/* a glass beaker: top-left x, y, size w × h, water surface at wl */
const beaker=(x,y,w,h,wl,c="b")=>[A.band(x+3,wl,w-6,y+h-wl-3,c),A.p(`M${x-8} ${y} L${x} ${y+6} L${x} ${y+h} L${x+w} ${y+h} L${x+w} ${y+6} L${x+w+8} ${y}`,"k",3.5),A.p(R.line(x+3,wl,x+w-3,wl,.3),c,3)];
/* an atom: a shaded ball with its letter */
const atom=(x,y,r,c,s)=>[A.hatch(R.circ(x,y,r),c),A.p(R.circ(x,y,r),c,3.5),A.tx(s,x,y+r*.36,r*1.05,c)];
/* the part of a disc between two heights (offsets from the centre), for climate zones */
const zoneP=(cx,cy,r,a,b)=>{const pts=[],N=16;for(let i=0;i<=N;i++){const dy=a+(b-a)*i/N;pts.push([cx+Math.sqrt(Math.max(0,r*r-dy*dy)),cy+dy])}
  for(let i=N;i>=0;i--){const dy=a+(b-a)*i/N;pts.push([cx-Math.sqrt(Math.max(0,r*r-dy*dy)),cy+dy])}return P(pts)+" Z"};
/* a house: x = centre, y = ground */
const house=(x,y,w,h,c="k")=>A.p(R.rect(x-w/2,y-h,w,h,.4)+R.line(x-w/2-22,y-h,x,y-h-w*.42,.4)+R.line(x,y-h-w*.42,x+w/2+22,y-h,.4),c,4);
/* a question picture sits on the left half of the board; the question is written on the right */
const wrap=(s,n)=>{const out=[];let l="";for(const w of s.split(" ")){if(l&&(l+" "+w).length>n){out.push(l);l=w}else l=l?l+" "+w:w}if(l)out.push(l);return out};
const Q=(lv,q,a,w,pic)=>({lv,q,a,w,lines:wrap(q,pic?24:36),...(pic?{pic}:{})});
const Wq=(lv,q,a,lines)=>({lv,q,a,lines});

/* ---------- words ---------- */
TERM("f7v_partikelrorelse",{sv:"partikelrörelse",m:W("partikelrörelse(n)?"),d:t3("Att atomer och molekyler alltid rör sig. Ju varmare, desto snabbare rörelse.","That atoms and molecules are always moving. The warmer, the faster they move.","أن الذرّات والجزيئات تتحرّك دائمًا، وكلّما زادت الحرارة زادت سرعتها."),ex:"Partikelrörelsen är snabbare i varmt vatten.",tr:{en:"particle motion",ar:"حركة الجسيمات"}});
TERM("f7v_varme",{sv:"värme",m:W("värme(n)?"),d:t3("Energi som flyttar sig från något varmt till något kallare.","Energy that moves from something warm to something colder.","طاقة تنتقل من شيء ساخن إلى شيء أبرد."),ex:"Värmen går från koppen till luften.",tr:{en:"heat",ar:"حرارة"}});
TERM("f7v_termometer",{sv:"termometer",m:W("(termometer(n)?|termometrar(na)?)"),d:t3("Ett instrument som mäter temperatur.","An instrument that measures temperature.","أداة تقيس درجة الحرارة."),ex:"Termometern visar 21 °C.",tr:{en:"thermometer",ar:"ميزان حرارة"}});
TERM("f7v_celsius",{sv:"grader Celsius (°C)",m:W("celsius(skalan)?"),d:t3("Temperaturskala där vatten fryser vid 0 °C och kokar vid 100 °C.","Temperature scale where water freezes at 0 °C and boils at 100 °C.","سُلّم حرارة يتجمّد فيه الماء عند 0 ويغلي عند 100 درجة."),ex:"Kroppen håller 37 grader Celsius.",tr:{en:"degrees Celsius",ar:"درجة مئوية (سلسيوس)"}});
TERM("f7v_kelvin",{sv:"kelvin (K)",m:W("kelvin(skalan)?"),d:t3("Temperaturskala som börjar vid absoluta nollpunkten. K = °C + 273.","Temperature scale that starts at absolute zero. K = °C + 273.","سُلّم حرارة يبدأ من الصفر المطلق: K = °C + 273."),ex:"0 °C är 273 kelvin.",tr:{en:"kelvin",ar:"كلفن"}});
TERM("f7v_absnoll",{sv:"absoluta nollpunkten",m:W("absoluta nollpunkten"),d:t3("Den lägsta temperatur som finns, −273 °C eller 0 K.","The lowest temperature there is, −273 °C or 0 K.","أدنى درجة حرارة ممكنة: ‎−273 °C أو 0 K."),ex:"Vid absoluta nollpunkten rör sig partiklarna så lite som möjligt.",tr:{en:"absolute zero",ar:"الصفر المطلق"}});
TERM("f7v_fryspunkt",{sv:"fryspunkt / smältpunkt",m:W("(fryspunkt|smältpunkt)(en)?"),d:t3("Temperaturen där ett ämne fryser eller smälter. För vatten 0 °C.","The temperature where a substance freezes or melts. For water 0 °C.","درجة الحرارة التي تتجمّد عندها المادة أو تنصهر، وهي للماء 0 °C."),ex:"Vattnets fryspunkt är 0 °C.",tr:{en:"freezing point / melting point",ar:"درجة التجمّد / الانصهار"}});
TERM("f7v_kokpunkt",{sv:"kokpunkt",m:W("kokpunkt(en)?"),d:t3("Temperaturen där en vätska kokar. För vatten 100 °C vid normalt lufttryck.","The temperature where a liquid boils. For water 100 °C at normal air pressure.","درجة الحرارة التي يغلي عندها السائل، وهي للماء 100 °C تحت الضغط العادي."),ex:"Vattnets kokpunkt är 100 °C.",tr:{en:"boiling point",ar:"درجة الغليان"}});
TERM("f7v_vattenanga",{sv:"vattenånga",m:W("vattenånga(n)?"),d:t3("Vatten i gasform. Den är osynlig.","Water as a gas. It is invisible.","الماء في حالته الغازية، وهو غير مرئي."),ex:"När vatten kokar bildas vattenånga.",tr:{en:"water vapour",ar:"بخار الماء"}});
TERM("f7v_varmekapacitet",{sv:"värmekapacitet",m:W("värmekapacitet(en)?"),d:t3("Hur mycket energi som behövs för att värma ett ämne. Vatten har hög värmekapacitet.","How much energy is needed to warm a substance. Water has a high heat capacity.","مقدار الطاقة اللازمة لتسخين مادة. للماء سعة حرارية عالية."),ex:"Havet värms långsamt tack vare vattnets höga värmekapacitet.",tr:{en:"heat capacity",ar:"السعة الحرارية"}});
TERM("f7v_utvidga",{sv:"utvidga sig / dra ihop sig",m:W("(utvidga(r)? sig|drar? ihop sig)"),d:t3("Att ta större plats, eller mindre plats, när temperaturen ändras.","To take up more space, or less space, when the temperature changes.","أن تشغل المادة حيّزًا أكبر أو أصغر عندما تتغيّر درجة حرارتها."),ex:"Vatten utvidgar sig när det fryser.",tr:{en:"to expand / to contract",ar:"يتمدّد / ينكمش"}});
TERM("f7v_ledning",{sv:"värmeledning",m:W("(värme)?ledning(en)?"),d:t3("När värme vandrar genom ett material från partikel till partikel.","When heat travels through a material from particle to particle.","انتقال الحرارة خلال مادة من جسيم إلى جسيم."),ex:"Skeden blir varm genom ledning.",tr:{en:"conduction",ar:"التوصيل الحراري"}});
TERM("f7v_stromning",{sv:"strömning / konvektion",m:W("(strömning(en)?|konvektion(en)?)"),d:t3("När värme följer med en vätska eller gas som rör sig. Varmt stiger, kallt sjunker.","When heat moves along with a moving liquid or gas. Warm rises, cold sinks.","انتقال الحرارة مع سائل أو غاز متحرّك: الساخن يصعد والبارد ينزل."),ex:"Luften i rummet värms genom strömning.",tr:{en:"convection",ar:"الحمل الحراري"}});
TERM("f7v_stralning",{sv:"värmestrålning",m:W("(värme)?strålning(en)?"),d:t3("Osynlig infraröd strålning från varma föremål. Den kan gå genom tomrum.","Invisible infrared radiation from warm objects. It can travel through empty space.","إشعاع تحت أحمر غير مرئي يصدر عن الأجسام الساخنة، ويمكنه عبور الفراغ."),ex:"Solens värme når oss genom strålning.",tr:{en:"heat radiation",ar:"الإشعاع الحراري"}});
TERM("f7v_ledare",{sv:"värmeledare",m:W("(värme)?ledare(n)?"),d:t3("Ett material som leder värme bra, till exempel en metall.","A material that conducts heat well, for example a metal.","مادة توصل الحرارة جيدًا، مثل المعادن."),ex:"Koppar är en bra värmeledare.",tr:{en:"heat conductor",ar:"موصل للحرارة"}});
TERM("f7v_isolator",{sv:"isolator",m:W("isolator(n|er|erna)?"),d:t3("Ett material som leder värme dåligt, till exempel trä, ull eller luft.","A material that conducts heat poorly, for example wood, wool or air.","مادة توصل الحرارة توصيلًا ضعيفًا، مثل الخشب والصوف والهواء."),ex:"Ull är en bra isolator.",tr:{en:"insulator",ar:"عازل"}});
TERM("f7v_infrarod",{sv:"infraröd strålning",m:W("infraröd(a)? strålning(en)?"),d:t3("Osynligt ljus som varma föremål sänder ut. Kallas också värmestrålning.","Invisible light that warm objects give out. Also called heat radiation.","ضوء غير مرئي تصدره الأجسام الساخنة، ويسمّى أيضًا الإشعاع الحراري."),ex:"Jordytan sänder ut infraröd strålning.",tr:{en:"infrared radiation",ar:"الأشعة تحت الحمراء"}});
TERM("f7v_vader",{sv:"väder",m:W("väd(er|ret)"),d:t3("Hur det är ute just nu: temperatur, vind, moln och nederbörd.","What it is like outside right now: temperature, wind, clouds and rain or snow.","حالة الجو الآن: الحرارة والرياح والغيوم والأمطار."),ex:"I dag är vädret soligt.",tr:{en:"weather",ar:"الطقس"}});
TERM("f7v_klimat",{sv:"klimat",m:W("klimat(et)?"),d:t3("Hur vädret brukar vara på en plats, räknat som medelvärden under minst 30 år.","What the weather is usually like in a place, as averages over at least 30 years.","ما يكون عليه الطقس عادةً في مكان ما، كمتوسّطات خلال 30 سنة على الأقل."),ex:"Sverige har ett tempererat klimat.",tr:{en:"climate",ar:"المناخ"}});
TERM("f7v_klimatzon",{sv:"klimatzon",m:W("klimatzon(en|er|erna)?"),d:t3("Ett bälte runt jorden med liknande klimat, till exempel tropisk eller tempererad zon.","A belt round the Earth with a similar climate, for example tropical or temperate.","حزام حول الأرض له مناخ متشابه، مثل المنطقة المدارية أو المعتدلة."),ex:"Sverige ligger i den tempererade klimatzonen.",tr:{en:"climate zone",ar:"منطقة مناخية"}});
TERM("f7v_ekvator",{sv:"ekvatorn",m:W("ekvator(n)?"),d:t3("Den tänkta linjen runt jordens mitt, lika långt från båda polerna.","The imagined line round the middle of the Earth, equally far from both poles.","الخط الوهمي حول منتصف الأرض، على بُعد متساوٍ من القطبين."),ex:"Vid ekvatorn är det varmt hela året.",tr:{en:"the equator",ar:"خط الاستواء"}});
TERM("f7v_golfstrommen",{sv:"Golfströmmen",m:W("golfström(men)?"),d:t3("En varm havsström från Mexikanska golfen mot norra Europa.","A warm ocean current from the Gulf of Mexico towards northern Europe.","تيار بحري دافئ من خليج المكسيك نحو شمال أوروبا."),ex:"Golfströmmen gör vintrarna mildare i Norden.",tr:{en:"the Gulf Stream",ar:"تيار الخليج"}});
TERM("f7v_kustklimat",{sv:"kustklimat / inlandsklimat",m:W("(kustklimat|inlandsklimat)(et)?"),d:t3("Kustklimat har små skillnader mellan sommar och vinter, inlandsklimat stora.","A coastal climate has small differences between summer and winter, an inland climate large ones.","المناخ الساحلي فيه فروق صغيرة بين الصيف والشتاء، والمناخ الداخلي فروق كبيرة."),ex:"Göteborg har kustklimat.",tr:{en:"coastal / inland climate",ar:"مناخ ساحلي / داخلي"}});
TERM("f7v_atmosfar",{sv:"atmosfär",m:W("atmosfär(en)?"),d:t3("Lagret av gaser, luften, som omger jorden.","The layer of gases, the air, around the Earth.","طبقة الغازات، أي الهواء، التي تحيط بالأرض."),ex:"Atmosfären håller kvar värme.",tr:{en:"atmosphere",ar:"الغلاف الجوي"}});
TERM("f7v_vaxthuseffekt",{sv:"växthuseffekten",m:W("växthuseffekt(en)?"),d:t3("Att gaser i atmosfären håller kvar en del av jordens värmestrålning, så att jorden blir varmare.","That gases in the atmosphere keep back part of the Earth's heat radiation, so the Earth gets warmer.","أن غازات في الغلاف الجوي تحبس جزءًا من الإشعاع الحراري للأرض فتصبح أدفأ."),ex:"Utan växthuseffekten vore jorden iskall.",tr:{en:"the greenhouse effect",ar:"الاحتباس الحراري"}});
TERM("f7v_vaxthusgas",{sv:"växthusgas",m:W("växthusgas(en|er|erna)?"),d:t3("En gas som tar upp värmestrålning, till exempel koldioxid, metan och vattenånga.","A gas that absorbs heat radiation, for example carbon dioxide, methane and water vapour.","غاز يمتصّ الإشعاع الحراري، مثل ثاني أكسيد الكربون والميثان وبخار الماء."),ex:"Metan är en stark växthusgas.",tr:{en:"greenhouse gas",ar:"غاز دفيئة"}});
TERM("f7v_forstarkt",{sv:"förstärkt växthuseffekt",m:W("förstärkta? växthuseffekt(en)?"),d:t3("När människans utsläpp av växthusgaser gör växthuseffekten starkare, så att jorden blir varmare.","When human emissions of greenhouse gases make the greenhouse effect stronger, so the Earth warms.","عندما تجعل انبعاثات الإنسان الاحتباس الحراري أقوى فتزداد حرارة الأرض."),ex:"Den förstärkta växthuseffekten ger global uppvärmning.",tr:{en:"enhanced greenhouse effect",ar:"الاحتباس الحراري المعزَّز"}});
TERM("f7v_metan",{sv:"metan",m:W("metan(et)?"),d:t3("En växthusgas, CH₄. Den kommer bland annat från kor, risodlingar och soptippar.","A greenhouse gas, CH₄. It comes for example from cows, rice fields and landfills.","غاز دفيئة صيغته CH₄، يأتي مثلًا من الأبقار وحقول الأرز ومكبّات النفايات."),ex:"Kor släpper ut metan.",tr:{en:"methane",ar:"الميثان"}});
TERM("f7v_fossil",{sv:"fossila bränslen",m:W("fossila? bränsle(n|na)?"),d:t3("Kol, olja och naturgas. De bildades av växter och djur för miljontals år sedan och ger koldioxid när de brinner.","Coal, oil and natural gas. They formed from plants and animals millions of years ago and give carbon dioxide when burned.","الفحم والنفط والغاز الطبيعي، تكوّنت من نباتات وحيوانات قبل ملايين السنين وتطلق ثاني أكسيد الكربون عند حرقها."),ex:"Bensin görs av olja, ett fossilt bränsle.",tr:{en:"fossil fuels",ar:"الوقود الأحفوري"}});
TERM("f7v_ppm",{sv:"ppm (miljondelar)",m:W("ppm"),d:t3("Miljondelar. 420 ppm betyder 420 delar av en miljon.","Parts per million. 420 ppm means 420 parts out of a million.","أجزاء من المليون: 420 ppm تعني 420 جزءًا من مليون."),ex:"Luften har över 420 ppm koldioxid.",tr:{en:"ppm (parts per million)",ar:"جزء من المليون"}});
TERM("f7v_varmeutvidgning",{sv:"värmeutvidgning",m:W("(värme)?utvidgning(en)?"),d:t3("Att ett ämne tar större plats när det värms.","That a substance takes up more space when it is heated.","أن تشغل المادة حيّزًا أكبر عند تسخينها."),ex:"Värmeutvidgningen får vätskan i termometern att stiga.",tr:{en:"thermal expansion",ar:"التمدّد الحراري"}});
TERM("f7v_bimetall",{sv:"bimetall",m:W("bimetall(en|er|erna)?"),d:t3("Två remsor av olika metaller som sitter ihop. Den böjer sig när den värms.","Two strips of different metals stuck together. It bends when heated.","شريطان من معدنين مختلفين ملتصقان، ينحنيان عند التسخين."),ex:"Bimetallen i strykjärnet stänger av strömmen.",tr:{en:"bimetallic strip",ar:"شريط ثنائي المعدن"}});
TERM("f7v_termostat",{sv:"termostat",m:W("termostat(en|er|erna)?"),d:t3("En brytare som slår av eller på värmen vid en viss temperatur.","A switch that turns the heat off or on at a certain temperature.","مفتاح يقطع التسخين أو يشغّله عند درجة حرارة معيّنة."),ex:"Termostaten håller ugnen vid 200 °C.",tr:{en:"thermostat",ar:"منظّم حرارة (ثرموستات)"}});
TERM("f7v_termoelement",{sv:"termoelement",m:W("termoelement(et)?"),d:t3("Två olika metaller som är hopfogade. Fogen ger en liten spänning som beror på temperaturen.","Two different metals joined together. The joint gives a small voltage that depends on temperature.","معدنان مختلفان ملحومان معًا، يعطي موضع الالتحام جهدًا كهربائيًا صغيرًا يتعلّق بدرجة الحرارة."),ex:"Ugnens termoelement tål höga temperaturer.",tr:{en:"thermocouple",ar:"مزدوجة حرارية"}});
TERM("f7v_dilatationsfog",{sv:"dilatationsfog",m:W("dilatationsfog(en|ar|arna)?"),d:t3("Ett mellanrum i en bro eller ett golv som ger plats för värmeutvidgning.","A gap in a bridge or floor that leaves room for thermal expansion.","فاصل في جسر أو أرضية يترك مكانًا للتمدّد الحراري."),ex:"Bron har en dilatationsfog i mitten.",tr:{en:"expansion joint",ar:"فاصل تمدّد"}});
TERM("f7v_isolering",{sv:"isolering",m:W("isolering(en)?"),d:t3("Material som bromsar värmeförluster, till exempel mineralull med luftfickor.","Material that slows down heat loss, for example mineral wool with air pockets.","مادة تبطئ فقدان الحرارة، مثل الصوف المعدني المليء بجيوب الهواء."),ex:"Bra isolering sparar energi.",tr:{en:"insulation",ar:"العزل الحراري"}});
TERM("f7v_vakuum",{sv:"vakuum",m:W("vakuum(et)?"),d:t3("Ett utrymme nästan helt utan partiklar.","A space with almost no particles at all.","حيّز يكاد يخلو تمامًا من الجسيمات."),ex:"Mellan termosens väggar är det vakuum.",tr:{en:"vacuum",ar:"فراغ"}});
TERM("f7v_kylflans",{sv:"kylfläns",m:W("kylfläns(en|ar|arna)?"),d:t3("En metallbit med många tunna flänsar som ger stor yta och för bort värme.","A metal piece with many thin fins that gives a large surface and carries heat away.","قطعة معدنية فيها زعانف رقيقة كثيرة تعطي سطحًا كبيرًا وتبعد الحرارة."),ex:"Kylflänsen sitter ovanpå processorn.",tr:{en:"heat sink",ar:"مشتّت حراري"}});
TERM("f7v_avdunsta",{sv:"avdunsta",m:W("(avdunsta(r|de)?|avdunstning(en)?)"),d:t3("När vatten blir till ånga utan att koka. Det tar värme från omgivningen.","When water turns into vapour without boiling. It takes heat from its surroundings.","تحوّل الماء إلى بخار دون غليان، ويأخذ ذلك حرارة من المحيط."),ex:"Svetten avdunstar och kyler huden.",tr:{en:"to evaporate",ar:"يتبخّر"}});
TERM("f7v_reflektera",{sv:"reflektera",m:W("reflektera(r|s)?"),d:t3("Att studsa tillbaka, som ljus mot en spegel.","To bounce back, like light from a mirror.","أن يرتدّ، كما يرتدّ الضوء عن المرآة."),ex:"Blanka ytor reflekterar värmestrålning.",tr:{en:"to reflect",ar:"يعكس"}});
TERM("f7v_extremvader",{sv:"extremväder",m:W("extremväd(er|ret)"),d:t3("Ovanligt kraftigt väder, som värmebölja, skyfall, storm eller torka.","Unusually strong weather, such as a heatwave, cloudburst, storm or drought.","طقس شديد على غير العادة، مثل موجة حرّ أو أمطار غزيرة أو عاصفة أو جفاف."),ex:"SMHI varnar för extremväder.",tr:{en:"extreme weather",ar:"طقس متطرّف"}});
TERM("f7v_varmebolja",{sv:"värmebölja",m:W("värmebölj(a|an|or|orna)"),d:t3("Minst fem dagar i rad med minst 25 °C (SMHI).","At least five days in a row with at least 25 °C (SMHI).","خمسة أيام متتالية على الأقل بحرارة 25 °C أو أكثر (حسب SMHI)."),ex:"Värmeböljan varade i två veckor.",tr:{en:"heatwave",ar:"موجة حرّ"}});
TERM("f7v_skyfall",{sv:"skyfall",m:W("skyfall(et|en)?"),d:t3("Mycket kraftigt regn, minst 50 mm på en timme (SMHI).","Very heavy rain, at least 50 mm in one hour (SMHI).","مطر غزير جدًّا، 50 مم على الأقل في ساعة واحدة (حسب SMHI)."),ex:"Skyfallet översvämmade gatan.",tr:{en:"cloudburst",ar:"هطول غزير مفاجئ"}});
TERM("f7v_storm",{sv:"storm / orkan",m:W("(storm(en|ar|arna)?|orkan(en|er|erna)?)"),d:t3("Mycket hård vind. Storm från ungefär 25 m/s, orkan från ungefär 33 m/s.","Very strong wind. Storm from about 25 m/s, hurricane force from about 33 m/s.","رياح شديدة جدًّا: العاصفة من نحو 25 م/ث، والإعصار من نحو 33 م/ث."),ex:"Stormen fällde många träd.",tr:{en:"storm / hurricane",ar:"عاصفة / إعصار"}});
TERM("f7v_torka",{sv:"torka",m:W("torka(n)?"),d:t3("En lång period med för lite regn.","A long period with too little rain.","فترة طويلة يقلّ فيها المطر كثيرًا."),ex:"Torkan gjorde att skörden slog fel.",tr:{en:"drought",ar:"جفاف"}});
TERM("f7v_kondensera",{sv:"kondensera",m:W("(kondensera(r|s)?|kondens(ation)?)"),d:t3("När en gas blir vätska, till exempel när vattenånga blir små droppar.","When a gas turns into a liquid, for example when water vapour becomes small drops.","تحوّل الغاز إلى سائل، مثل تحوّل بخار الماء إلى قطرات صغيرة."),ex:"Ångan kondenserar och bildar moln.",tr:{en:"to condense",ar:"يتكاثف"}});

/* ---------------------------------------------------------------
   1. f7v1: temperature and heat
   --------------------------------------------------------------- */
const COLD=(x,y)=>shake(grid(x,y,5,3,52,50,10,3),4,2.6,"b",9);
const HOTP=(x,y)=>shake(grid(x,y,5,3,52,50,10,7),17,.8,"r",9);
/* a match: stick, head and flame; (x, y) = the bottom of the stick */
const match=(x,y)=>[A.p(R.line(x,y,x,y-110,.2),BRN,8),A.hatch(R.circ(x,y-116,9),"r"),A.p(R.circ(x,y-116,9),"r",3),...flame(x,y-124,.9)];
const TUB="M-130 -70 L-118 34 Q-114 50 -96 50 L96 50 Q114 50 118 34 L130 -70";
const VT1={steps:[
 {say:t3("Varför känns en kopp varm kakao varm och en isbit kall? I det här kapitlet lär vi oss vad värme egentligen är, hur värme flyttar sig och hur solens värme styr jordens klimat. Vi börjar med det allra minsta: partiklarna som allt är byggt av.",
   "Why does a cup of hot cocoa feel warm and an ice cube cold? In this chapter we learn what heat really is, how heat moves and how the sun's heat controls the Earth's climate. We start with the very smallest: the particles that everything is made of.",
   "لماذا نشعر أن كوب الكاكاو الساخن دافئ وأن مكعّب الثلج بارد؟ في هذا الفصل نتعلّم ما هي الحرارة حقًّا، وكيف تنتقل، وكيف تتحكّم حرارة الشمس في مناخ الأرض. ونبدأ بأصغر الأشياء: الجسيمات التي يتكوّن منها كل شيء."),
  draw:()=>[A.wipe(),ttl("Värme och klimat"),...cup(170,300,1.25),...ice(400,300,1.2),...art("sun",590,200,.55),...earth(700,300,55),
   ntag("varm kakao",170,410,"o"),ntag("isbit",400,410,"b"),ntag("solen och jorden",640,410,"g"),note("Vad är värme, och hur flyttar den sig?",468,"k",28)]},
 {say:t3("Allt är byggt av små partiklar: atomer och molekyler. De står aldrig stilla. I ett fast ämne vibrerar de på sina platser, i en vätska glider de runt varandra och i en gas flyger de fritt. Ju varmare ett ämne är, desto snabbare rör sig partiklarna.",
   "Everything is made of tiny particles: atoms and molecules. They never stand still. In a solid they vibrate in place, in a liquid they slide around each other and in a gas they fly about freely. The warmer a substance is, the faster its particles move.",
   "كل شيء مكوَّن من جسيمات صغيرة جدًّا: ذرّات وجزيئات، وهي لا تتوقّف عن الحركة أبدًا. في المادة الصلبة تهتزّ في أماكنها، وفي السائل تنزلق حول بعضها، وفي الغاز تطير بحرّية. وكلّما كانت المادة أسخن تحرّكت جسيماتها أسرع."),
  draw:()=>[A.wipe(),ttl("Partiklarna rör sig hela tiden"),box(70,110,290,230,"b"),box(440,110,290,230,"r"),...COLD(110,170),...HOTP(480,170),
   A.tx("kallt: långsam rörelse",215,390,30,"b"),A.tx("varmt: snabb rörelse",585,390,30,"r"),note("varmare → snabbare partiklar",462,"k",30)]},
 {say:t3("Temperatur är ett mått på hur snabbt partiklarna rör sig i genomsnitt. Snabba partiklar betyder hög temperatur och långsamma partiklar låg temperatur. Vi mäter temperatur med en termometer. I Sverige använder vi enheten grader Celsius, °C.",
   "Temperature is a measure of how fast the particles move on average. Fast particles mean a high temperature and slow particles a low temperature. We measure temperature with a thermometer. In Sweden we use the unit degrees Celsius, °C.",
   "درجة الحرارة مقياس لسرعة حركة الجسيمات في المتوسّط. الجسيمات السريعة تعني درجة حرارة مرتفعة، والبطيئة تعني درجة حرارة منخفضة. نقيس درجة الحرارة بميزان الحرارة، ونستخدم في السويد وحدة الدرجة المئوية (سلسيوس) °C."),
  draw:()=>[A.wipe(),ttl("Temperatur"),...thermo(110,110,240,.22,"b"),box(160,160,200,160,"b"),...shake(grid(200,195,4,3,40,42,8,11),3,2.6,"b",8),
   ...thermo(470,110,240,.86,"r"),box(520,160,200,160,"r"),...shake(grid(560,195,4,3,40,42,8,17),13,.8,"r",8),
   A.tx("låg temperatur",250,420,30,"b"),A.tx("hög temperatur",610,420,30,"r"),note("Temperatur mäts med en termometer, i °C.",474,"k",28)]},
 {say:t3("Värme är energi som flyttar sig från något varmt till något kallare. Ställer du en kopp kakao på bordet går värme från koppen till luften och bordet, tills allt har samma temperatur. Av sig själv går värme alltid från varmt till kallt, aldrig tvärtom.",
   "Heat is energy that moves from something warm to something colder. If you put a cup of cocoa on the table, heat goes from the cup to the air and the table until everything has the same temperature. By itself, heat always goes from warm to cold, never the other way.",
   "الحرارة طاقة تنتقل من الشيء الساخن إلى الشيء الأبرد. إذا وضعت كوب كاكاو على الطاولة تنتقل الحرارة من الكوب إلى الهواء والطاولة حتى تتساوى درجة حرارة الجميع. والحرارة تنتقل من تلقاء نفسها دائمًا من الساخن إلى البارد، لا العكس أبدًا."),
  draw:()=>[A.wipe(),ttl("Värme går från varmt till kallt"),A.p(R.line(50,352,750,352,.4),BRN,4),...cup(210,300,1.2),
   wave(296,262,380,215,"r"),wave(300,312,392,312,"r"),wave(124,262,58,215,"r"),A.tx("värme",350,190,28,"r"),A.tx("luften: 20 °C",130,150,26,"k"),A.tx("70 °C",210,410,32,"r"),
   A.arrow(440,300,530,300,"k"),A.tx("efter en stund",485,270,22,"k"),...cup(630,300,1.2,false),A.tx("20 °C",630,410,32,"b"),
   note("Värme är energi som flyttar sig.",468,"k",28)]},
 {say:t3("Temperatur och värmeenergi är inte samma sak. Lågan på en tändsticka är flera hundra grader, men ett badkar med 38 °C varmt vatten innehåller mycket mer värmeenergi. Badkaret har ju enormt många fler partiklar som rör sig. Mer ämne betyder mer energi.",
   "Temperature and heat energy are not the same thing. A match flame is several hundred degrees, but a bathtub of 38 °C water contains much more heat energy. After all, the bathtub has enormously many more moving particles. More substance means more energy.",
   "درجة الحرارة والطاقة الحرارية ليستا الشيء نفسه. لهب عود الثقاب حرارته عدة مئات من الدرجات، لكن حوض الاستحمام المملوء بماء دافئ بدرجة 38 °C يحتوي على طاقة حرارية أكبر بكثير، لأن فيه عددًا هائلًا من الجسيمات المتحرّكة. فالمادة الأكثر تعني طاقة أكثر."),
  draw:()=>[A.wipe(),ttl("Temperatur eller värmeenergi?"),...match(200,350),
   A.hatch(tfx("M-124 -40 L-114 34 Q-110 46 -94 46 L94 46 Q110 46 114 34 L124 -40 Z",560,300,1),"b"),A.p(tfx(TUB,560,300,1),"k",4),A.p(tfx("M-90 50 L-96 70 M90 50 L96 70",560,300,1),"k",4),
   ...shake(grid(470,272,6,2,36,30,6,21),5,1.6,"b",6),
   A.tx("flera hundra °C",200,405,30,"r"),A.tx("men lite värmeenergi",200,445,26,"k"),A.tx("38 °C",560,405,30,"b"),A.tx("men mycket värmeenergi",560,445,26,"k")]},
 {say:t3("Den svenske forskaren Anders Celsius gjorde en temperaturskala med 100 steg mellan vattnets fryspunkt och kokpunkt. I dag gäller: vatten fryser vid 0 °C och kokar vid 100 °C, vid normalt lufttryck. Det som är kallare än 0 °C har minusgrader.",
   "The Swedish scientist Anders Celsius made a temperature scale with 100 steps between the freezing point and the boiling point of water. Today: water freezes at 0 °C and boils at 100 °C, at normal air pressure. Anything colder than 0 °C has minus degrees.",
   "وضع العالم السويدي أندرس سلسيوس سُلّمًا لدرجات الحرارة فيه 100 خطوة بين درجة تجمّد الماء ودرجة غليانه. واليوم نقول: يتجمّد الماء عند 0 °C ويغلي عند 100 °C تحت الضغط الجوي العادي، وما هو أبرد من 0 °C تكون درجته تحت الصفر."),
  draw:()=>{const T=thermoScale(170,95,345,-30,110,10,37,"r",20,false),Y=T.Y,lab=(t,s,c)=>[A.p(R.line(200,Y(t),232,Y(t),.2),c,3),A.tx(s,242,Y(t)+9,26,c,"start")];
   return[A.wipe(),ttl("Celsiusskalan"),...T.o,...lab(100,"100 °C: vatten kokar","r"),...lab(37,"37 °C: kroppen","o"),...lab(20,"20 °C: rumstemperatur","k"),...lab(0,"0 °C: vatten fryser","b"),...lab(-18,"−18 °C: frysen","b"),
    A.tx("Anders Celsius",660,190,32,"v"),A.tx("svensk forskare",660,230,24,"k"),A.tx("år 1742",660,265,24,"k"),A.tx("100 steg mellan",660,340,26,"g"),A.tx("fryspunkt och kokpunkt",660,375,26,"g")]}},
 {say:t3("Kan det bli hur kallt som helst? Nej! Ju kallare det blir, desto långsammare rör sig partiklarna. Vid −273 °C har de så lite rörelse som det över huvud taget går. Kallare än så kan ingenting bli. Den temperaturen kallas absoluta nollpunkten.",
   "Can it get as cold as you like? No! The colder it gets, the slower the particles move. At −273 °C they have as little movement as is possible at all. Nothing can get colder than that. That temperature is called absolute zero.",
   "هل يمكن أن يزداد البرد بلا حدود؟ لا! كلّما ازداد البرد تباطأت حركة الجسيمات، وعند ‎−273 °C تكون حركتها أقلّ ما يمكن على الإطلاق. لا يمكن لأي شيء أن يصبح أبرد من ذلك، وتسمّى هذه الدرجة الصفر المطلق."),
  draw:()=>[A.wipe(),ttl("Absoluta nollpunkten"),...thermo(140,110,250,.02,"b"),A.tx("−273 °C",140,445,30,"b"),box(260,130,460,220,"b"),
   ...shake(grid(310,175,7,3,60,60,4,31),1.2,4,"b",9),A.tx("partiklarna står nästan stilla",490,400,30,"b"),note("Kallare än −273 °C kan det inte bli.",462,"k",28)]},
 {say:t3("Forskare använder ofta kelvinskalan. Den börjar vid absoluta nollpunkten, 0 K, så den har inga minusgrader. Ett steg i kelvin är lika stort som en grad Celsius. Därför räknar du om genom att lägga till 273: 0 °C är 273 K och 20 °C är 293 K.",
   "Scientists often use the Kelvin scale. It starts at absolute zero, 0 K, so it has no minus degrees. One kelvin step is as big as one degree Celsius. So you convert by adding 273: 0 °C is 273 K and 20 °C is 293 K.",
   "يستخدم العلماء غالبًا سُلّم كلفن. يبدأ من الصفر المطلق، أي 0 K، فلا توجد فيه درجات تحت الصفر. والخطوة الواحدة في كلفن تساوي درجة سلسيوس واحدة، لذلك نحوّل بإضافة 273: ‏0 °C تساوي 273 K، و20 °C تساوي 293 K."),
  draw:()=>{const Y=t=>425-(t+273)/373*285,mk=(t,a,b,c)=>[A.p(R.dashed(230,Y(t),400,Y(t)),c,2.5),A.tx(a,215,Y(t)+9,26,c,"end"),A.tx(b,415,Y(t)+9,26,c,"start")];
   return[A.wipe(),ttl("Kelvinskalan"),A.tx("Celsius",230,112,26,"k"),A.tx("kelvin",400,112,26,"k"),A.p(R.line(230,130,230,435,.3)+R.line(400,130,400,435,.3),"k",4),
    ...mk(100,"100 °C","373 K","r"),...mk(0,"0 °C","273 K","b"),...mk(-273,"−273 °C","0 K","v"),
    A.hl(545,190,230,62),A.tx("K = °C + 273",660,235,38,"g"),A.tx("20 °C = 293 K",660,310,30,"k"),A.tx("−273 °C = 0 K",660,355,30,"v"),A.tx("inga minusgrader",660,410,26,"k")]}},
 {say:t3("Kom ihåg: ju varmare det är, desto snabbare rör sig partiklarna. Temperatur mäts i °C eller K. Värme är energi som går från varmt till kallt. Absoluta nollpunkten, −273 °C eller 0 K, är den lägsta temperatur som finns.",
   "Remember: the warmer it is, the faster the particles move. Temperature is measured in °C or K. Heat is energy that goes from warm to cold. Absolute zero, −273 °C or 0 K, is the lowest temperature there is.",
   "تذكّر: كلّما زادت الحرارة زادت سرعة الجسيمات. تُقاس درجة الحرارة بـ °C أو K. الحرارة طاقة تنتقل من الساخن إلى البارد. والصفر المطلق، ‎−273 °C أو 0 K، هو أدنى درجة حرارة ممكنة."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["varmare → snabbare partiklar","r"],["temperatur mäts i °C eller K","b"],["värme = energi från varmt till kallt","o"],["absoluta nollpunkten: −273 °C = 0 K","v"],["K = °C + 273","g"]],80,140,62,32)]},
]};
/* two boxes of particles: which one is warmest? */
const picBoxes=()=>[box(40,150,160,150,"k"),box(230,150,160,150,"k"),...shake(grid(70,180,3,3,50,45,6,41),3,2.6,"b",8),...shake(grid(260,180,3,3,50,45,6,47),14,.8,"r",8),
  A.tx("A",120,345,34,"k"),A.tx("B",310,345,34,"k")];
const picThermo=v=>{const T=thermoScale(200,110,320,-20,40,10,v,"r",24);return T.o};
const BANK1=[
 Q(0,"Vad mäter man temperatur med?","en termometer",["en våg","en linjal","ett tidtagarur"]),
 Q(0,"Vid vilken temperatur fryser vatten?","0 °C",["100 °C","4 °C","−273 °C"]),
 Q(0,"Vid vilken temperatur kokar vatten vid normalt lufttryck?","100 °C",["0 °C","50 °C","273 °C"]),
 Q(0,"Hur rör sig partiklarna när ett ämne blir varmare?","de rör sig snabbare",["de rör sig långsammare","de står stilla","de blir större"]),
 Q(0,"I vilken låda är temperaturen högst?","låda B",["låda A","de är lika varma","det går inte att säga"],picBoxes),
 Q(1,"Vad visar termometern?","20 °C",["10 °C","30 °C","−20 °C"],()=>picThermo(20)),
 Q(1,"Vad är värme?","energi som flyttar sig från varmt till kallt",["ett ämne som finns i varma saker","samma sak som temperatur","kyla som har vänt"]),
 Q(1,"Åt vilket håll går värme av sig själv?","från varmt till kallt",["från kallt till varmt","bara uppåt","bara genom metaller"]),
 Q(1,"Vad kallas den lägsta temperatur som finns?","absoluta nollpunkten",["fryspunkten","kokpunkten","nollgradersgränsen"]),
 Q(1,"Vilken temperatur är absoluta nollpunkten?","−273 °C",["0 °C","−100 °C","−1 000 °C"]),
 Q(1,"Vilken bokstav står för kelvin?","K",["C","°","T"]),
 Q(2,"Hur många kelvin är 0 °C?","273 K",["0 K","100 K","−273 K"]),
 Q(2,"Hur många kelvin är 25 °C?","298 K",["248 K","25 K","273 K"]),
 Q(2,"300 K är ungefär lika med …","27 °C",["300 °C","573 °C","−27 °C"]),
 Q(2,"En tändsticka brinner och ett badkar har 38 °C varmt vatten. Vad stämmer?","badkaret har mer värmeenergi men lägre temperatur",["tändstickan har mer värmeenergi","de har lika mycket värmeenergi","badkaret har högre temperatur"]),
 Q(2,"Varför svalnar en kopp kakao som står på bordet?","den avger värme till den kallare omgivningen",["kyla strömmar in i koppen","partiklarna i kakaon försvinner","kakaon gör av med sin temperatur"]),
 Q(2,"Vad visar termometern?","−5 °C",["5 °C","−15 °C","0 °C"],()=>picThermo(-5)),
 Wq(1,"Skriv ordet: instrumentet som mäter temperatur heter en …",["termometer","termometern"],["Skriv ordet som saknas:","Instrumentet som mäter","temperatur heter en …"]),
 Wq(2,"Skriv talet: 10 °C är hur många kelvin?",["283","283 K","283 kelvin"],["Skriv talet:","10 °C = ? K"]),
 Wq(2,"Skriv ordet: den lägsta temperatur som finns heter absoluta …",["nollpunkten","nollpunkt"],["Skriv ordet som saknas:","Den lägsta temperatur som finns","heter absoluta …"]),
];
LESSONS.push({id:"f7v1",subject:"science",grades:"7",kind:"wb",year:7,ord:11,
 title:t3("Temperatur och värme","Temperature and heat","درجة الحرارة والحرارة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M60 130V40Q60 28 72 28Q84 28 84 40V130" fill="none" stroke="#1d2433" stroke-width="4"/><circle cx="72" cy="145" r="18" fill="#f6d2cf" stroke="#1d2433" stroke-width="4"/><path d="M72 140V60" stroke="#d63b2f" stroke-width="8" stroke-linecap="round"/><rect x="120" y="40" width="170" height="110" rx="10" fill="none" stroke="#d63b2f" stroke-width="4"/><g fill="#d63b2f"><circle cx="150" cy="70" r="8"/><circle cx="200" cy="60" r="8"/><circle cx="250" cy="78" r="8"/><circle cx="170" cy="118" r="8"/><circle cx="230" cy="124" r="8"/></g><path d="M138 64l-10-6M212 54l10-8M262 84l12 4M158 124l-12 4M242 130l10 8" stroke="#d63b2f" stroke-width="3" stroke-linecap="round"/></svg>`,
 steps:VT1.steps,mount:wbMount(VT1),gen:bankGen(BANK1)});
WORDS.f7v1=["f7v_partikelrorelse","temperatur","f7v_varme","f7v_termometer","f7v_celsius","f7v_kelvin","f7v_absnoll"];

/* ---------------------------------------------------------------
   2. f7v2: water, a strange liquid
   --------------------------------------------------------------- */
const water=(cx,cy,s=1)=>{const o=atom(cx,cy,46*s,"r","O"),h=[[-1,1],[1,1]].map(([sx])=>[cx+sx*70*s,cy+54*s]);
  const bond=([x,y])=>{const dx=x-cx,dy=y-cy,L=Math.hypot(dx,dy);return R.line(cx+dx/L*46*s,cy+dy/L*46*s,x-dx/L*30*s,y-dy/L*30*s,.2)};
  return[A.p(bond(h[0])+bond(h[1]),"k",6*s),...o,...h.flatMap(([x,y])=>atom(x,y,30*s,"b","H"))]};
/* the honeycomb of ice: hexagon rings with a molecule at each corner */
const honey=(x0,y0,x1,y1,s=30)=>{const pts=[],seen=new Set();let lines="";
  for(let r=0;r<5;r++)for(let c=0;c<6;c++){const cx=x0+s+c*s*Math.sqrt(3)+(r%2)*s*Math.sqrt(3)/2,cy=y0+s+r*s*1.5;
   const v=[...Array(6)].map((_,k)=>{const a=(60*k+30)*Math.PI/180;return[cx+Math.cos(a)*s,cy+Math.sin(a)*s]});
   if(v.some(([x,y])=>x<x0||x>x1||y<y0||y>y1))continue;lines+=P([...v,v[0]]);v.forEach(([x,y])=>{const k=Math.round(x)+","+Math.round(y);if(!seen.has(k)){seen.add(k);pts.push([x,y])}})}
  return{lines,pts}};
/* a lake seen from the side, with ice on top; T = the temperatures from the top down */
const LAKE="M80 175 Q110 430 400 430 Q690 430 720 175";
const lake=()=>[A.p(LAKE,"k",4),A.p("M150 260 Q170 254 190 260 M560 300 Q580 294 600 300 M240 360 Q260 354 280 360","b",3)];
const VT2={steps:[
 {say:t3("Vatten är det vanligaste ämnet på jordens yta, och allt liv behöver det. En vattenmolekyl, H₂O, består av en syreatom och två väteatomer. Vatten ser vanligt ut, men det är faktiskt ett ganska konstigt ämne, och just det har stor betydelse för livet på jorden.",
   "Water is the most common substance on the Earth's surface, and all life needs it. A water molecule, H₂O, is made of one oxygen atom and two hydrogen atoms. Water looks ordinary, but it is actually a rather strange substance, and that matters a lot for life on Earth.",
   "الماء أكثر المواد انتشارًا على سطح الأرض، وكل الكائنات الحيّة تحتاج إليه. يتكوّن جزيء الماء H₂O من ذرّة أكسجين وذرّتَي هيدروجين. يبدو الماء عاديًّا، لكنه في الحقيقة مادة غريبة نوعًا ما، ولهذا أهمية كبيرة للحياة على الأرض."),
  draw:()=>[A.wipe(),ttl("Vatten – en underlig vätska"),...water(250,240,1.2),A.tx("H₂O",590,200,64,"b"),A.tx("1 syreatom (O)",590,270,30,"r"),A.tx("2 väteatomer (H)",590,315,30,"b"),
   note("Vatten finns överallt och behövs för allt liv.",450,"k",28)]},
 {say:t3("Vatten finns i tre former. Is är fast: molekylerna sitter i ett ordnat mönster och vibrerar. I flytande vatten glider molekylerna runt varandra. Vattenånga är en gas där molekylerna flyger fritt. Is smälter vid 0 °C och vatten kokar vid 100 °C.",
   "Water comes in three forms. Ice is solid: the molecules sit in an ordered pattern and vibrate. In liquid water the molecules slide around each other. Water vapour is a gas where the molecules fly freely. Ice melts at 0 °C and water boils at 100 °C.",
   "للماء ثلاث حالات. الجليد صلب: تجلس جزيئاته في نمط منتظم وتهتزّ. وفي الماء السائل تنزلق الجزيئات حول بعضها. أما بخار الماء فغاز تطير فيه الجزيئات بحرّية. يذوب الجليد عند 0 °C ويغلي الماء عند 100 °C."),
  draw:()=>[A.wipe(),ttl("Is, vatten och vattenånga"),box(40,120,190,210,"b"),box(305,120,190,210,"b"),box(570,120,190,210,"#7d8ca6"),
   ...shake(grid(77,165,4,4,39,39,0,51),2.5,1.6,"b",8),...shake(grid(337,200,4,3,42,38,16,57),8,1.4,"b",8),
   ...shake([[610,170],[700,160],[650,230],[730,250],[600,290],[690,300]],26,1.3,"#7d8ca6",8),
   A.arrow(238,225,297,225,"k"),A.tx("0 °C",268,210,22,"k"),A.arrow(503,225,562,225,"k"),A.tx("100 °C",533,210,22,"k"),
   A.tx("is (fast)",135,375,30,"b"),A.tx("vatten (flytande)",400,375,30,"b"),A.tx("ånga (gas)",665,375,30,"#7d8ca6"),note("Vid vanlig rumstemperatur är vatten flytande.",455,"k",28)]},
 {say:t3("Nästan alla ämnen drar ihop sig när de stelnar, så den fasta formen är tätare än den flytande. En bit fast stearin sjunker därför i smält stearin. Vatten gör tvärtom: is är mindre tät än flytande vatten och flyter. Det är ovanligt!",
   "Almost all substances contract when they solidify, so the solid form is denser than the liquid. A piece of solid candle wax therefore sinks in melted wax. Water does the opposite: ice is less dense than liquid water and floats. That is unusual!",
   "تنكمش معظم المواد تقريبًا عندما تتجمّد، فتكون الحالة الصلبة أكثف من السائلة، ولذلك تغوص قطعة شمع صلبة في الشمع المصهور. أما الماء فيفعل العكس: الجليد أقلّ كثافة من الماء السائل فيطفو. وهذا أمر غير مألوف!"),
  draw:()=>[A.wipe(),ttl("Sjunker eller flyter?"),...beaker(120,140,220,230,190,"o"),A.hatch(rectP(190,300,80,60,.3),"o"),A.p(R.rect(190,300,80,60,.3),"o",3.5),
   ...beaker(460,140,220,230,190,"b"),...ice(570,210,.85),
   A.tx("smält stearin",230,128,24,"o"),A.tx("vatten",570,128,24,"b"),A.tx("fast stearin sjunker",230,420,30,"o"),A.tx("is flyter!",570,420,32,"b")]},
 {say:t3("När vatten fryser ordnar sig molekylerna i ett glest mönster med sexkantiga hål, ungefär som en bikaka. Därför tar is cirka 9 % större plats än vattnet den bildades av. Samma massa på större volym ger lägre densitet: is 0,92 g/cm³ och vatten 1,00 g/cm³.",
   "When water freezes, the molecules arrange themselves in an open pattern with hexagonal holes, a bit like a honeycomb. So ice takes up about 9 % more space than the water it came from. The same mass in a larger volume gives a lower density: ice 0.92 g/cm³ and water 1.00 g/cm³.",
   "عندما يتجمّد الماء تترتّب جزيئاته في نمط متباعد فيه فراغات سداسية، يشبه قرص العسل. لذلك يشغل الجليد حيّزًا أكبر بنحو 9 % من الماء الذي تكوّن منه. والكتلة نفسها في حجم أكبر تعني كثافة أقل: الجليد 0,92 g/cm³ والماء 1,00 g/cm³."),
  draw:()=>{const H=honey(60,110,370,330,30);return[A.wipe(),ttl("Varför flyter is?"),box(50,105,330,235,"b"),box(420,105,330,235,"b"),A.p(H.lines,"#9fc3ea",2.5),...shake(H.pts,2,1.8,"b",8),
   ...shake(grid(450,135,8,6,38,38,14,61),6,1.3,"b",8),
   A.tx("is: glest, med hål",215,380,30,"b"),A.tx("vatten: tätare packat",585,380,30,"b"),A.tx("0,92 g/cm³",215,422,28,"k"),A.tx("1,00 g/cm³",585,422,28,"k"),
   note("Is tar ungefär 9 % större plats än vattnet.",470,"g",28)]}},
 {say:t3("Eftersom is bara är lite mindre tät än vatten flyter den lågt. Ungefär 90 % av ett isberg ligger under vattenytan, och bara 10 % syns. Därför är isberg farliga för fartyg: det man ser är bara toppen av isberget.",
   "Since ice is only a little less dense than water, it floats low. About 90 % of an iceberg lies under the surface, and only 10 % can be seen. That is why icebergs are dangerous to ships: what you see is only the tip of the iceberg.",
   "لأن الجليد أقلّ كثافة من الماء بقليل فقط، فإنه يطفو منخفضًا. نحو 90 % من الجبل الجليدي يقع تحت سطح الماء، ولا يظهر منه إلا 10 %. لذلك تشكّل الجبال الجليدية خطرًا على السفن: فما تراه ليس إلا قمّة الجبل."),
  draw:()=>{const TOP="M330 180 L355 140 L385 128 L420 146 L452 180 Z",UND="M330 180 L282 230 L262 310 L300 390 L390 425 L500 402 L560 320 L540 236 L452 180 Z";
   return[A.wipe(),ttl("Isberget"),A.band(40,180,720,265,"b"),A.p("M40 180 Q90 172 140 180 Q190 188 240 180 Q290 172 340 180 Q390 188 440 180 Q490 172 540 180 Q590 188 640 180 Q690 172 760 180","b",3.5),
    A.hatch(TOP,"b"),A.p(TOP,"b",4),A.hatch(UND,"b"),A.p(UND,"b",4),A.p("M100 178 L196 178 L184 196 L112 196 Z M148 178 L148 130 L176 160 L148 160","k",3.5),
    ...callout([430,152],560,130,"ca 10 % syns","k",28),...callout([520,330],575,330,"ca 90 % under ytan","b",26)]}},
 {say:t3("Vatten har en till konstighet. När vatten kyls drar det ihop sig, men bara ner till 4 °C. Kyls det ännu mer utvidgar det sig igen, redan innan det fryser. Vatten är alltså som tätast vid 4 °C. Det vattnet är tyngst och sjunker till botten.",
   "Water has one more oddity. When water is cooled it contracts, but only down to 4 °C. If it is cooled further it expands again, even before it freezes. So water is densest at 4 °C. That water is heaviest and sinks to the bottom.",
   "للماء غرابة أخرى. عندما يبرد الماء ينكمش، لكن حتى 4 °C فقط. وإذا برد أكثر يتمدّد من جديد، حتى قبل أن يتجمّد. فالماء أكثف ما يكون عند 4 °C، وهذا الماء هو الأثقل فيغوص إلى القاع."),
  draw:()=>{const X=t=>150+t*45,Yd=t=>150+(t-4)**2*3.4;
   return[A.wipe(),ttl("Tätast vid 4 °C"),A.arrow(150,410,720,410,"k"),A.arrow(150,410,150,110,"k"),A.tx("densitet",165,118,26,"k","start"),A.tx("°C",735,418,26,"k","start"),
    ...[0,4,8,12].map(t=>A.tx(t,X(t),440,24,"k")),A.p(fpath(x=>Yd((x-150)/45),X(0),X(12)),"b",4.5),
    A.p(R.dashed(X(4),Yd(4)+10,X(4),405),"r",3),dot(X(4),Yd(4),"r",8),A.tx("tätast och tyngst",X(4)+20,Yd(4)-12,28,"r","start"),
    A.tx("under 4 °C:",X(1.9),252,22,"b"),A.tx("utvidgar sig",X(1.9),278,22,"b"),A.tx("drar ihop sig",X(9),Yd(9)-40,24,"b")]}},
 {say:t3("På hösten kyls sjöns yta. Kallt och tungt vatten sjunker tills hela sjön är 4 °C. Sedan blir ytvattnet kallare men lättare och stannar uppe, där det fryser till is. På botten är det kvar ungefär 4 °C. Därför överlever fiskarna vintern.",
   "In autumn the surface of the lake cools. Cold, heavy water sinks until the whole lake is 4 °C. Then the surface water gets colder but lighter and stays on top, where it freezes to ice. At the bottom it stays about 4 °C. That is why the fish survive the winter.",
   "في الخريف يبرد سطح البحيرة، فيغوص الماء البارد الثقيل حتى تصبح البحيرة كلّها بدرجة 4 °C. بعد ذلك يصبح ماء السطح أبرد لكنه أخفّ فيبقى في الأعلى ويتجمّد. ويبقى القاع بنحو 4 °C، ولهذا تنجو الأسماك في الشتاء."),
  draw:()=>[A.wipe(),ttl("Sjön fryser uppifrån"),...lake(),A.hatch("M82 175 L718 175 L714 198 L86 198 Z","b"),A.p(R.rect(82,175,636,23,.3),"b",3.5),A.tx("is",738,194,26,"b","start"),
   A.tx("luften: −10 °C",150,130,28,"k"),A.tx("0 °C",400,232,28,"b"),A.tx("2 °C",400,282,28,"b"),A.tx("3 °C",400,330,28,"b"),A.tx("4 °C",300,395,30,"r"),
   ...art("perch",530,380,.5)]},
 {say:t3("Det krävs mycket energi för att värma vatten, och vatten avger mycket energi när det svalnar. Man säger att vatten har hög värmekapacitet. En solig dag blir sanden het, men vattnet blir bara ljummet. Därför värms och svalnar haven långsamt, och det påverkar klimatet.",
   "It takes a lot of energy to warm water, and water gives off a lot of energy when it cools. We say that water has a high heat capacity. On a sunny day the sand gets hot, but the water only gets lukewarm. So the seas warm up and cool down slowly, and that affects the climate.",
   "يحتاج تسخين الماء إلى طاقة كبيرة، ويطلق الماء طاقة كبيرة عندما يبرد. نقول إن للماء سعة حرارية عالية. في يوم مشمس يصبح الرمل حارًّا بينما يصبح الماء فاترًا فقط، لذلك تسخن البحار وتبرد ببطء، وهذا يؤثّر في المناخ."),
  draw:()=>[A.wipe(),ttl("Vatten värms långsamt"),...art("sun",400,145,.55),A.arrow(372,190,250,318,"o"),A.arrow(428,190,550,318,"o"),
   A.hatch("M50 330 L390 330 L390 372 L50 372 Z","o"),A.p(R.line(50,330,390,330,.4),"o",4),A.band(410,330,340,42,"b"),A.p("M410 330 Q450 322 490 330 Q530 338 570 330 Q610 322 650 330 Q690 338 750 330","b",4),
   ...thermo(110,190,110,.85,"r"),...thermo(690,190,110,.35,"b"),A.tx("sanden: het",220,415,30,"r"),A.tx("vattnet: ljummet",580,415,30,"b"),
   note("hög värmekapacitet: kräver mycket energi",468,"k",28)]},
 {say:t3("Kom ihåg: is flyter, eftersom den är mindre tät än vatten. Vatten är tätast vid 4 °C, därför fryser sjöar uppifrån och vattnet vid botten håller ungefär 4 °C. Vatten har hög värmekapacitet och värms och svalnar långsamt.",
   "Remember: ice floats because it is less dense than water. Water is densest at 4 °C, so lakes freeze from the top and the water at the bottom stays about 4 °C. Water has a high heat capacity and warms and cools slowly.",
   "تذكّر: الجليد يطفو لأنه أقلّ كثافة من الماء. والماء أكثف ما يكون عند 4 °C، لذلك تتجمّد البحيرات من الأعلى ويبقى ماء القاع بنحو 4 °C. وللماء سعة حرارية عالية فيسخن ويبرد ببطء."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["H₂O: en syreatom och två väteatomer","r"],["is är mindre tät än vatten och flyter","b"],["vatten är tätast vid 4 °C","g"],["sjöar fryser uppifrån, botten ca 4 °C","b"],["hög värmekapacitet: värms långsamt","o"]],70,140,62,31)]},
]};
const picPhase=k=>[box(60,140,300,250,"b"),...(k==="is"?shake(grid(110,190,5,4,50,50,0,71),2.5,1.6,"b",9):k==="gas"?shake([[110,190],[260,175],[180,260],[310,290],[100,350],[230,350]],26,1.3,"#7d8ca6",9):shake(grid(100,230,6,3,48,44,16,77),8,1.4,"b",9))];
const picLake=()=>[A.p("M40 170 Q60 390 210 390 Q360 390 380 170","k",4),A.hatch("M42 170 L378 170 L376 190 L44 190 Z","b"),A.p(R.rect(42,170,336,20,.3),"b",3),
  A.tx("is",210,154,26,"b"),A.tx("?",210,365,52,"r"),A.tx("0 °C",210,230,26,"b")];
const picDens=()=>{const X=t=>90+t*25,Yd=t=>190+(t-4)**2*2;return[A.arrow(90,420,400,420,"k"),A.arrow(90,420,90,140,"k"),A.tx("densitet",100,150,22,"k","start"),A.tx("°C",392,402,22,"k"),
  A.p(fpath(x=>Yd((x-90)/25),X(0),X(12)),"b",4.5),A.p(R.dashed(X(4),Yd(4)+8,X(4),415),"r",3),dot(X(4),Yd(4),"r",7),A.tx("?",X(4),452,32,"r"),
  A.tx("0",X(0),452,22,"k"),A.tx("12",X(12),452,22,"k")]};
const BANK2=[
 Q(0,"Vid vilken temperatur smälter is?","0 °C",["4 °C","100 °C","−10 °C"]),
 Q(0,"Vad händer med en isbit i ett glas vatten?","den flyter",["den sjunker till botten","den svävar mitt i glaset","den löses upp direkt"]),
 Q(0,"Vad kallas vatten i gasform?","vattenånga",["is","dimma","snö"]),
 Q(0,"Vilken kemisk formel har vatten?","H₂O",["CO₂","O₂","NaCl"]),
 Q(0,"Vilken form av vatten visar bilden?","is (fast)",["vatten (flytande)","vattenånga (gas)","det går inte att se"],()=>picPhase("is")),
 Q(1,"Vilken form av vatten visar bilden?","vattenånga (gas)",["is (fast)","vatten (flytande)","det går inte att se"],()=>picPhase("gas")),
 Q(1,"Vid vilken temperatur är vatten som tätast?","4 °C",["0 °C","100 °C","−4 °C"]),
 Q(1,"Varför flyter is på vatten?","is har lägre densitet än vatten",["is är tyngre än vatten","is är varmare än vattnet","is är full av luftbubblor"]),
 Q(1,"Ungefär hur stor del av ett isberg är under vattenytan?","ca 90 %",["ca 10 %","ca 50 %","ca 25 %"]),
 Q(1,"Vilken temperatur har vattnet vid botten av sjön på vintern?","ungefär 4 °C",["0 °C","−10 °C","ungefär 15 °C"],picLake),
 Q(1,"Vad händer med vattnets volym när det fryser till is?","den ökar",["den minskar","den är lika","vattnet försvinner"]),
 Q(2,"Ungefär hur mycket större plats tar is än vattnet den bildades av?","ca 9 %",["ca 50 %","ca 1 %","den tar mindre plats"]),
 Q(2,"Varför fryser sjöar uppifrån och ner?","vatten kallare än 4 °C är lättare och stannar vid ytan",["kall luft sjunker ner i vattnet","isen bildas på botten och flyter upp","bottnen värms alltid av solen"]),
 Q(2,"Vad betyder det att vatten har hög värmekapacitet?","det krävs mycket energi för att värma det",["det kokar vid låg temperatur","det leder värme mycket bra","det är tyngre än andra vätskor"]),
 Q(2,"Varför kan en full glasflaska med vatten spricka i frysen?","vattnet utvidgar sig när det fryser",["vattnet drar ihop sig","glaset smälter av kylan","isen blir tyngre än vattnet"]),
 Q(2,"Is har densiteten 0,92 g/cm³. Vad väger 100 cm³ is?","92 g",["100 g","108 g","9,2 g"]),
 Q(2,"Vid vilken temperatur har vatten störst densitet?","4 °C",["0 °C","12 °C","8 °C"],picDens),
 Wq(1,"Skriv ordet: vatten i fast form kallas …",["is","isen"],["Skriv ordet som saknas:","Vatten i fast form kallas …"]),
 Wq(2,"Skriv talet: vid hur många °C är vatten som tätast?",["4","4 °C","4°C","fyra"],["Skriv talet:","Vid hur många °C är","vatten som tätast?"]),
];
LESSONS.push({id:"f7v2",subject:"science",grades:"7",kind:"wb",year:7,ord:12,
 title:t3("Vatten – en underlig vätska","Water – a strange liquid","الماء – سائل غريب"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="40" y="70" width="240" height="96" rx="8" fill="#e3eefc" stroke="#2257c9" stroke-width="3"/><path d="M40 70Q80 62 120 70T200 70T280 70" fill="none" stroke="#2257c9" stroke-width="3"/><path d="M130 70L144 46L170 40L194 70L208 104L180 132L136 120Z" fill="#cfe0f7" stroke="#2257c9" stroke-width="3"/><circle cx="250" cy="146" r="6" fill="#d63b2f"/><text x="244" y="134" font-size="18" font-family="sans-serif" fill="#d63b2f">4°</text></svg>`,
 steps:VT2.steps,mount:wbMount(VT2),gen:bankGen(BANK2)});
WORDS.f7v2=["f7v_fryspunkt","f7v_kokpunkt","f7v_vattenanga","f7v_utvidga","f7v_varmekapacitet"];

/* ---------------------------------------------------------------
   3. f7v3: how heat spreads (conduction, convection, radiation)
   --------------------------------------------------------------- */
const logs=(x,y,s=1)=>A.p(tfx("M-60 0 L60 -22 M-60 -22 L60 0",x,y,s),BRN,10*s);
/* a metal rod with a flame under its left end; the particles shake less and less to the right */
const rod=(x,y,w,h,n)=>{const o=[box(x,y,w,h,"k")];for(let i=0;i<n;i++){const f=i/(n-1),px=x+20+f*(w-40);
  o.push(A.flow(jig(px,y+h/2,Math.max(1.5,13*(1-f)),i*7+3),f<.34?"r":f<.67?"o":"b",1,+(.7+f*1.8).toFixed(2),8))}return o};
/* a pot of water on a flame, with two convection loops */
const potLoops=(x0,x1,top,bot,mid)=>{const L=`M${mid} ${bot-20} L${mid} ${top+30} Q${mid} ${top+14} ${mid-18} ${top+14} L${x0+28} ${top+14} Q${x0+14} ${top+14} ${x0+14} ${top+30} L${x0+14} ${bot-30} Q${x0+14} ${bot-14} ${x0+30} ${bot-14} L${mid-8} ${bot-14} Z`,
  Rr=`M${mid} ${bot-20} L${mid} ${top+30} Q${mid} ${top+14} ${mid+18} ${top+14} L${x1-28} ${top+14} Q${x1-14} ${top+14} ${x1-14} ${top+30} L${x1-14} ${bot-30} Q${x1-14} ${bot-14} ${x1-30} ${bot-14} L${mid+8} ${bot-14} Z`;
  return[A.flow(L,"o",8,7,6),A.flow(Rr,"o",8,7,6)]};
const pot=(x0,x1,top,bot)=>A.p(`M${x0} ${top} L${x0} ${bot} L${x1} ${bot} L${x1} ${top} M${x0} ${top+30} L${x0-30} ${top+30} M${x1} ${top+30} L${x1+30} ${top+30}`,"k",4.5);
const VT3={steps:[
 {say:t3("Värme flyttar sig alltid från varmt till kallt. Det kan ske på tre sätt: ledning, strömning och strålning. Vid en lägereld finns alla tre. Grillspettet av metall blir varmt genom ledning, den varma röken stiger genom strömning och värmen mot ditt ansikte är strålning.",
   "Heat always moves from warm to cold. It can happen in three ways: conduction, convection and radiation. At a campfire you find all three. The metal skewer gets hot by conduction, the warm smoke rises by convection, and the heat on your face is radiation.",
   "تنتقل الحرارة دائمًا من الساخن إلى البارد، ويحدث ذلك بثلاث طرق: التوصيل والحمل والإشعاع. وعند نار المخيّم تجد الطرق الثلاث: سيخ الشواء المعدني يسخن بالتوصيل، والدخان الساخن يصعد بالحمل، والحرارة التي تشعر بها على وجهك إشعاع."),
  draw:()=>[A.wipe(),ttl("Tre sätt att sprida värme"),A.p(R.line(60,440,740,440,.4),BRN,4),logs(400,438),...flame(400,420,1.6),
   A.p(R.line(440,370,690,300,.3),"k",6),A.tx("ledning",690,350,30,"k"),A.flow("M400 270 Q370 220 400 180 Q430 140 400 100","#7d8ca6",5,3.5,6),A.tx("strömning",520,170,30,"o"),
   wave(330,360,200,320,"r"),wave(330,400,190,410,"r"),A.tx("strålning",150,270,30,"r")]},
 {say:t3("Vid ledning vandrar värmen genom ett material. Partiklarna i den varma änden rör sig snabbt och knuffar på sina grannar, som också börjar röra sig snabbare. Så sprids rörelsen, alltså värmen, steg för steg. Partiklarna själva stannar kvar på sina platser.",
   "In conduction, heat travels through a material. The particles at the hot end move fast and push their neighbours, which also start moving faster. So the motion, that is the heat, spreads step by step. The particles themselves stay in their places.",
   "في التوصيل تنتقل الحرارة خلال المادة. الجسيمات في الطرف الساخن تتحرّك بسرعة وتدفع جاراتها، فتبدأ هي أيضًا بالتحرّك أسرع، وهكذا تنتشر الحركة، أي الحرارة، خطوة بعد خطوة، بينما تبقى الجسيمات نفسها في أماكنها."),
  draw:()=>[A.wipe(),ttl("Ledning"),...rod(100,215,600,56,12),...flame(160,380,1),A.arrow(170,180,640,180,"r"),A.tx("värmen vandrar åt höger",400,160,28,"r"),
   A.tx("varmt",160,420,30,"r"),A.tx("kallt",650,330,30,"b"),note("snabba partiklar knuffar på sina grannar",468,"k",28)]},
 {say:t3("Material som leder värme bra kallas värmeledare. Metaller som koppar, aluminium och järn är bra ledare. Material som leder värme dåligt kallas isolatorer, till exempel trä, plast, ull och luft. Därför har stekpannor ofta handtag av trä eller plast.",
   "Materials that conduct heat well are called heat conductors. Metals such as copper, aluminium and iron are good conductors. Materials that conduct heat poorly are called insulators, for example wood, plastic, wool and air. That is why frying pans often have handles of wood or plastic.",
   "المواد التي توصل الحرارة جيدًا تسمّى موصلات حرارية، والمعادن مثل النحاس والألمنيوم والحديد موصلات جيدة. أما المواد التي توصل الحرارة توصيلًا ضعيفًا فتسمّى عوازل، مثل الخشب والبلاستيك والصوف والهواء. لذلك تكون مقابض المقالي غالبًا من الخشب أو البلاستيك."),
  draw:()=>[A.wipe(),ttl("Ledare och isolatorer"),A.p("M140 150 L160 205 L340 205 L360 150","k",5),A.p(R.line(362,152,540,136,.3),BRN,14),...flame(250,282,.7),
   A.tx("stekpanna av metall",250,128,26,"k"),A.tx("handtag av trä",560,150,26,BRN,"start"),
   A.tx("bra värmeledare",200,320,30,"r"),...blist([["koppar","r"],["aluminium","r"],["järn","r"]],120,365,40,26),
   A.tx("isolatorer",580,320,30,"b"),...blist([["trä, plast","b"],["ull, frigolit","b"],["luft","b"]],500,365,40,26)]},
 {say:t3("En metallbit och en träbit i samma rum har samma temperatur, 20 °C. Ändå känns metallen kallare! Din hand är varmare, ungefär 33 °C. Metallen leder snabbt bort värme från handen, så huden svalnar. Träet leder bort värmen långsamt och känns därför varmare.",
   "A piece of metal and a piece of wood in the same room have the same temperature, 20 °C. Yet the metal feels colder! Your hand is warmer, about 33 °C. The metal quickly conducts heat away from your hand, so the skin cools. The wood conducts heat away slowly, so it feels warmer.",
   "قطعة معدن وقطعة خشب في الغرفة نفسها لهما درجة الحرارة نفسها، 20 °C، ومع ذلك يبدو المعدن أبرد! يدك أدفأ، نحو 33 °C. المعدن يسحب الحرارة من يدك بسرعة فيبرد جلدك، أما الخشب فيسحبها ببطء ولذلك يبدو أدفأ."),
  draw:()=>[A.wipe(),ttl("Varför känns metall kallare?"),A.hatch(rectP(120,300,220,90,.3),"k"),box(120,300,220,90,"k"),
   A.hatch(rectP(460,300,220,90,.3),"o"),A.p(R.rect(460,300,220,90,.3)+"M480 316 Q560 308 660 318 M480 378 Q570 372 660 382","o",3.5),
   ...SENSE.hand(230,190,1),...SENSE.hand(570,190,1),A.arrow(205,248,205,292,"r"),A.arrow(230,248,230,292,"r"),A.arrow(255,248,255,292,"r"),A.arrow(570,262,570,292,"r"),
   A.tx("metall 20 °C",230,357,28,"k"),A.tx("trä 20 °C",570,357,28,BRN),A.tx("leder bort värmen snabbt",230,430,26,"r"),A.tx("leder bort värmen långsamt",570,430,26,"o")]},
 {say:t3("I vätskor och gaser kan värmen följa med när ämnet självt rör sig. Det kallas strömning eller konvektion. Vattnet i botten av kastrullen värms, utvidgar sig, blir mindre tätt och stiger. Kallare vatten sjunker ner och tar dess plats. En rundgång bildas.",
   "In liquids and gases, heat can move along with the substance itself. This is called convection. The water at the bottom of the pot is heated, expands, becomes less dense and rises. Colder water sinks down and takes its place. A circulation forms.",
   "في السوائل والغازات يمكن أن تنتقل الحرارة مع حركة المادة نفسها، ويسمّى ذلك الحمل الحراري. يسخن الماء في قاع القدر فيتمدّد وتقلّ كثافته ويصعد، بينما ينزل الماء الأبرد ليحلّ محلّه، فتتكوّن دورة مستمرّة."),
  draw:()=>[A.wipe(),ttl("Strömning i vatten"),A.band(224,170,352,206,"b"),pot(220,580,140,380),A.p(R.line(224,170,576,170,.3),"b",3),...potLoops(220,580,170,380,400),...flame(400,470,.95),
   A.arrow(400,330,400,230,"r"),A.arrow(250,220,250,320,"b"),A.arrow(550,220,550,320,"b"),A.tx("varmt stiger",630,240,26,"r","start"),A.tx("kallt sjunker",630,320,26,"b","start")]},
 {say:t3("Samma sak händer i luften. Luften vid elementet värms, stiger mot taket och sprider sig i rummet. Vid det kalla fönstret kyls luften och sjunker mot golvet. Därför sitter element ofta under fönster: den varma luften stoppar det kalla draget. Varm luft som stiger ger också vindar.",
   "The same happens in air. The air at the radiator is heated, rises to the ceiling and spreads through the room. At the cold window the air cools and sinks to the floor. That is why radiators often sit under windows: the warm air stops the cold draught. Rising warm air also causes winds.",
   "يحدث الشيء نفسه في الهواء. يسخن الهواء عند المدفأة فيصعد نحو السقف وينتشر في الغرفة، وعند النافذة الباردة يبرد الهواء وينزل نحو الأرض. لذلك توضع المدافئ غالبًا تحت النوافذ: الهواء الدافئ يوقف تيار البرد. والهواء الدافئ الصاعد يسبّب الرياح أيضًا."),
  draw:()=>[A.wipe(),ttl("Strömning i luft"),box(80,105,640,345,"k"),A.p(R.line(720,150,720,280,.2)+R.line(708,150,708,280,.2),"b",5),
   A.p(R.rect(650,330,48,100,.3)+"M660 340 L660 420 M672 340 L672 420 M684 340 L684 420","r",3.5),A.flow("M674 320 L674 140 Q674 126 660 126 L120 126 Q104 126 104 142 L104 410 Q104 428 122 428 L630 428 Q648 428 648 412 L648 400","o",12,9,6),
   A.arrow(600,330,600,190,"r"),A.arrow(200,190,200,330,"b"),A.tx("varm luft stiger",580,260,26,"r","end"),A.tx("kall luft sjunker",225,260,26,"b","start"),
   A.tx("fönster",695,215,24,"b","end"),A.tx("element",674,478,24,"r")]},
 {say:t3("Det tredje sättet är strålning. Allt som är varmt sänder ut värmestrålning, ett osynligt ljus som kallas infraröd strålning. Strålning behöver inget material att färdas i. Därför kan solens värme nå oss genom den tomma rymden, där det nästan inte finns några partiklar.",
   "The third way is radiation. Everything that is warm gives off heat radiation, an invisible light called infrared radiation. Radiation needs no material to travel through. That is why the sun's heat can reach us through empty space, where there are almost no particles.",
   "الطريقة الثالثة هي الإشعاع. كل جسم ساخن يطلق إشعاعًا حراريًّا، وهو ضوء غير مرئي يسمّى الأشعة تحت الحمراء. ولا يحتاج الإشعاع إلى مادة لينتقل خلالها، لذلك تصل حرارة الشمس إلينا عبر الفضاء الفارغ الذي لا يكاد يحتوي على جسيمات."),
  draw:()=>[A.wipe(),ttl("Strålning"),...art("sun",130,250,.85),...earth(660,250,85),wave(215,195,560,215,"r"),wave(220,250,560,250,"r"),wave(215,305,560,285,"r"),
   A.tx("rymden: nästan tomt",390,150,28,"k"),A.tx("värmestrålning (infraröd)",390,370,30,"r"),note("Strålning behöver inget material.",462,"k",28)]},
 {say:t3("Mörka och matta ytor tar upp strålning bra och blir varma. Ljusa och blanka ytor reflekterar det mesta av strålningen. Därför blir en svart bil varmare än en vit i solen, och därför är räddningsfiltar blanka: de speglar tillbaka kroppens värmestrålning.",
   "Dark, matt surfaces absorb radiation well and get warm. Light, shiny surfaces reflect most of the radiation. That is why a black car gets hotter than a white one in the sun, and why rescue blankets are shiny: they reflect the body's heat radiation back.",
   "الأسطح الداكنة غير اللامعة تمتصّ الإشعاع جيدًا فتسخن، أما الأسطح الفاتحة واللامعة فتعكس معظمه. لذلك تسخن السيارة السوداء في الشمس أكثر من البيضاء، ولذلك تكون بطانيات الإنقاذ لامعة: فهي تعكس الإشعاع الحراري للجسم إليه."),
  draw:()=>[A.wipe(),ttl("Mörka och ljusa ytor"),...art("sun",400,145,.55),A.hatch(rectP(110,300,220,90,.3),"k"),A.hatch(rectP(110,300,220,90,.3),"k"),A.hatch(rectP(110,300,220,90,.3),"k"),box(110,300,220,90,"k"),
   box(470,300,220,90,"#9aa3b2"),A.arrow(360,180,240,294,"o"),A.arrow(440,180,560,294,"o"),A.arrow(572,296,690,200,"o"),
   A.tx("mörk yta",220,425,28,"k"),A.tx("ljus yta",580,425,28,"k"),A.tx("tar upp → blir varm",220,465,26,"r"),A.tx("reflekterar → håller sig sval",580,465,26,"b")]},
 {say:t3("Kom ihåg: ledning sker genom ett material, från partikel till partikel. Strömning sker i vätskor och gaser, där varmt stiger och kallt sjunker. Strålning är värmestrålning som kan gå även genom tomrum. Metaller leder värme bra, luft isolerar.",
   "Remember: conduction happens through a material, from particle to particle. Convection happens in liquids and gases, where warm rises and cold sinks. Radiation is heat radiation that can even pass through empty space. Metals conduct heat well, air insulates.",
   "تذكّر: التوصيل يحدث خلال المادة من جسيم إلى جسيم، والحمل يحدث في السوائل والغازات حيث يصعد الساخن وينزل البارد، والإشعاع حراري يمكنه عبور الفراغ أيضًا. المعادن توصل الحرارة جيدًا والهواء عازل."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["ledning: genom material, partikel till partikel","k"],["strömning: i vätskor och gaser","o"],["strålning: osynlig, även genom tomrum","r"],["metaller leder värme bra","k"],["luft, ull och trä isolerar","b"]],70,140,62,31)]},
]};
const picRod=()=>[...rod(40,200,340,50,7),...flame(80,340,.8),A.tx("?",210,150,52,"r")];
const picPot=()=>[A.band(84,190,272,170,"b"),pot(80,360,160,360),A.p(R.line(84,190,356,190,.3),"b",3),...potLoops(80,360,190,360,220),...flame(220,440,.8),A.tx("?",220,145,48,"r")];
const picFire=()=>[A.p(R.line(40,420,390,420,.4),BRN,4),logs(300,418,.8),...flame(300,402,1.2),wave(240,340,90,300,"r"),wave(240,380,90,390,"r"),A.tx("?",110,250,52,"r")];
const BANK3=[
 Q(0,"Vilket material leder värme bäst?","koppar",["trä","plast","ull"]),
 Q(0,"Vilket material är en bra isolator?","ull",["järn","aluminium","koppar"]),
 Q(0,"Hur kommer solens värme till jorden?","genom strålning",["genom ledning","genom strömning","med vinden"]),
 Q(0,"Vilket är INTE ett sätt som värme sprids på?","magnetism",["ledning","strömning","strålning"]),
 Q(0,"Hur sprids värmen i metallstången?","ledning",["strömning","strålning","isolering"],picRod),
 Q(1,"Hur sprids värmen runt i vattnet i kastrullen?","strömning",["ledning","strålning","isolering"],picPot),
 Q(1,"Hur når värmen från elden fram till dig?","strålning",["ledning","strömning","isolering"],picFire),
 Q(1,"Varför stiger varm luft?","den är mindre tät än kall luft",["den är tyngre än kall luft","solen drar den uppåt","den har färre partiklar som rör sig"]),
 Q(1,"Varför känns metall kallare än trä i samma rum?","metallen leder bort värme från handen snabbare",["metallen har lägre temperatur","trä är varmt i sig självt","metall ger ifrån sig kyla"]),
 Q(1,"Vilken yta blir varmast i solen?","en svart, matt yta",["en vit yta","en blank yta","en spegel"]),
 Q(1,"Varför har en kastrull ofta handtag av plast?","plast är en isolator",["plast leder värme bra","plast är tyngre än metall","plast strålar ut kyla"]),
 Q(2,"I vilka ämnen kan värme spridas genom strömning?","vätskor och gaser",["bara fasta ämnen","bara metaller","i tomrum"]),
 Q(2,"Vilket sätt att sprida värme fungerar även i tomrum?","strålning",["ledning","strömning","alla tre"]),
 Q(2,"Varför sitter element ofta under fönster?","den varma luften som stiger möter den kalla luften vid fönstret",["så att elementet syns bättre","för att glaset leder bort värmen","för att solen ska värma elementet"]),
 Q(2,"Vad kallas den osynliga strålning som varma föremål sänder ut?","infraröd strålning",["ultraviolett strålning","röntgenstrålning","radioaktiv strålning"]),
 Q(2,"Vad händer vid ledning?","snabba partiklar knuffar på sina grannar",["partiklarna flyttar sig hela vägen","värmen flyger genom tomrum","varmt ämne stiger uppåt"]),
 Q(2,"Varför är räddningsfiltar blanka?","de reflekterar kroppens värmestrålning tillbaka",["de leder bort värmen snabbt","de syns bättre i mörker","de släpper igenom strålningen"]),
 Wq(1,"Skriv ordet: ett material som leder värme dåligt kallas en …",["isolator","isolatorn","värmeisolator"],["Skriv ordet som saknas:","Ett material som leder värme","dåligt kallas en …"]),
 Wq(2,"Skriv ordet: när varmt vatten stiger och kallt sjunker kallas det strömning eller …",["konvektion","konvektionen"],["Skriv ordet som saknas:","Strömning i vätskor och gaser","kallas också …"]),
];
LESSONS.push({id:"f7v3",subject:"science",grades:"7",kind:"wb",year:7,ord:13,
 title:t3("Värme sprider sig","Heat spreads","انتشار الحرارة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M40 150H280" stroke="#8a5a2b" stroke-width="3"/><path d="M160 146Q132 144 134 118Q136 96 154 72Q158 94 168 100Q174 80 166 62Q194 84 188 116Q188 144 160 146Z" fill="#fde6c8" stroke="#d63b2f" stroke-width="3"/><path d="M196 120L270 96" stroke="#1d2433" stroke-width="6" stroke-linecap="round"/><path d="M124 120Q114 114 104 120T84 120T64 120" fill="none" stroke="#d63b2f" stroke-width="3"/><path d="M160 60Q150 46 160 34Q170 22 160 10" fill="none" stroke="#7d8ca6" stroke-width="3"/></svg>`,
 steps:VT3.steps,mount:wbMount(VT3),gen:bankGen(BANK3)});
WORDS.f7v3=["f7v_ledning","f7v_stromning","f7v_stralning","f7v_ledare","f7v_isolator","f7v_infrarod"];

/* ---------------------------------------------------------------
   4. f7v4: climate
   --------------------------------------------------------------- */
const MON=[-1,-1,2,6,11,16,19,18,13,8,4,1];
/* climate zones on a disc: [latitude from, to (as sin of the latitude)], colour */
const ZONES=[[0,.4,"r"],[.4,.64,"o"],[.64,.917,"g"],[.917,1,"b"]];
const zones=(cx,cy,r)=>[...ZONES.flatMap(([a,b,c])=>[A.hatch(zoneP(cx,cy,r,-b*r,-a*r),c),A.hatch(zoneP(cx,cy,r,a*r,b*r),c)]),A.p(R.circ(cx,cy,r),"k",4),A.p(R.dashed(cx-r,cy,cx+r,cy),"k",2.5)];
const NA="M40 110 Q120 90 240 116 Q275 165 245 228 Q225 290 262 352 Q248 396 212 408 Q150 384 116 322 Q66 262 40 200 Z";
const EU="M610 92 Q680 76 750 104 Q785 160 765 236 Q728 296 662 306 Q616 298 600 252 Q630 206 606 166 Q592 128 610 92 Z";
const VT4={steps:[
 {say:t3("Väder är hur det är ute just nu eller de närmaste dagarna: temperatur, vind, moln och nederbörd. Klimat är hur vädret brukar vara på en plats under lång tid. För att beskriva klimatet räknar man ut medelvärden för minst 30 år.",
   "Weather is what it is like outside right now or in the next few days: temperature, wind, clouds and rain or snow. Climate is what the weather is usually like in a place over a long time. To describe the climate, averages are worked out over at least 30 years.",
   "الطقس هو حالة الجوّ الآن أو في الأيام القليلة القادمة: الحرارة والرياح والغيوم والأمطار. أما المناخ فهو ما يكون عليه الطقس عادةً في مكان ما خلال زمن طويل، ولوصفه نحسب متوسّطات على مدى 30 سنة على الأقل."),
  draw:()=>{const bx=i=>478+i*22.5,Y0=300;return[A.wipe(),A.p(R.line(400,95,400,460,.3),"#c7cfdc",2),A.tx("väder",200,110,40,"b"),A.tx("klimat",600,110,40,"g"),
   ...art("cloud",200,210,1.1),...[150,185,220,255].map((x,i)=>A.flow(`M${x} 250 L${x-12} 330`,"b",2,1.1+i*.1,4)),A.tx("i dag: 12 °C och regn",200,380,26,"k"),A.tx("kort tid",200,430,30,"b"),
   A.p(R.line(470,Y0,750,Y0,.2),"k",3),...MON.flatMap((t,i)=>[A.hatch(`M${bx(i)} ${Y0} L${bx(i)+16} ${Y0} L${bx(i)+16} ${Y0-t*7} L${bx(i)} ${Y0-t*7} Z`,t<0?"b":"o"),A.p(`M${bx(i)} ${Y0} L${bx(i)} ${Y0-t*7} L${bx(i)+16} ${Y0-t*7} L${bx(i)+16} ${Y0}`,t<0?"b":"o",2.5)]),
   A.tx("jan",486,335,20,"k"),A.tx("dec",734,335,20,"k"),A.tx("medel under 30 år",600,380,26,"k"),A.tx("lång tid",600,430,30,"g")]}},
 {say:t3("Nästan all energi som värmer jorden kommer från solen. Solljuset värmer först marken och haven. Sedan värmer marken och haven luften ovanför. Hur varmt en plats får beror mest på hur högt solen står på himlen och hur länge den lyser.",
   "Almost all the energy that warms the Earth comes from the sun. Sunlight first warms the ground and the seas. Then the ground and the seas warm the air above them. How warm a place gets depends mostly on how high the sun is in the sky and how long it shines.",
   "تأتي كل الطاقة التي تدفّئ الأرض تقريبًا من الشمس. يسخّن ضوء الشمس اليابسة والبحار أولًا، ثم تسخّن اليابسة والبحار الهواء فوقها. وتتوقّف حرارة المكان أساسًا على ارتفاع الشمس في السماء وعلى طول مدّة سطوعها."),
  draw:()=>[A.wipe(),ttl("Solen värmer jorden"),...art("sun",120,150,.65),A.hatch("M40 370 L760 370 L760 400 L40 400 Z","g"),A.p(R.line(40,370,760,370,.4),"g",4),
   A.arrow(165,190,260,360,"o"),A.arrow(180,175,430,360,"o"),A.arrow(190,160,600,360,"o"),A.tx("solljus",420,180,30,"o"),
   A.flow("M320 360 Q300 320 320 280 Q340 240 320 200","r",4,4,5),A.flow("M520 360 Q500 320 520 280 Q540 240 520 200","r",4,4.4,5),A.flow("M690 360 Q670 320 690 280 Q710 240 690 200","r",4,3.8,5),
   A.tx("marken värms",240,440,28,"g"),A.tx("och värmer luften",560,440,28,"r")]},
 {say:t3("Vid ekvatorn faller solstrålarna nästan rakt ner. Då samlas energin på en liten yta och det blir varmt. Nära polerna faller strålarna snett. Samma mängd energi sprids då ut över en mycket större yta, och därför är det kallt där.",
   "At the equator the sun's rays fall almost straight down. Then the energy is gathered on a small area and it gets warm. Near the poles the rays fall at a slant. The same amount of energy is then spread over a much larger area, and that is why it is cold there.",
   "عند خط الاستواء تسقط أشعة الشمس شبه عمودية، فتتركّز الطاقة على مساحة صغيرة ويصبح الجوّ حارًّا. وقرب القطبين تسقط الأشعة مائلة، فتنتشر الكمية نفسها من الطاقة على مساحة أكبر بكثير، ولهذا يكون الجوّ باردًا هناك."),
  draw:()=>{const cx=520,cy=275,r=160,X=y=>cx-Math.sqrt(r*r-(y-cy)**2);
   const beam=(y1,y2,c)=>{const a=X(y1),b=X(y2);return[A.hatch(`M60 ${y1} L${f1(a)} ${y1} L${f1(b)} ${y2} L60 ${y2} Z`,"o"),A.p(R.line(60,y1,a,y1,.2)+R.line(60,y2,b,y2,.2),"o",3),
     A.p(P([...Array(13)].map((_,i)=>{const y=y1+(y2-y1)*i/12;return[X(y),y]})),c,8)]};
   return[A.wipe(),ttl("Raka och sneda solstrålar"),...earth(cx,cy,r),A.p(R.dashed(cx-r,cy,cx+r,cy),"k",2.5),...beam(128,168,"r"),...beam(255,295,"r"),
    A.tx("nära polen: stor yta, kallt",60,215,24,"b","start"),A.tx("ekvatorn: liten yta, varmt",60,345,24,"r","start"),note("samma energi sprids över olika stor yta",470,"k",26)]}},
 {say:t3("Därför kan jorden delas in i klimatzoner. Kring ekvatorn ligger den tropiska zonen, som är varm hela året. Sedan kommer den subtropiska och den tempererade zonen. Längst norrut och söderut finns polarzonerna. Sverige ligger i den tempererade zonen, med tydliga årstider.",
   "So the Earth can be divided into climate zones. Around the equator lies the tropical zone, which is warm all year. Then come the subtropical and the temperate zones. Furthest north and south are the polar zones. Sweden lies in the temperate zone, with clear seasons.",
   "لذلك يمكن تقسيم الأرض إلى مناطق مناخية. حول خط الاستواء تقع المنطقة المدارية، وهي حارّة طوال السنة، ثم تأتي المنطقة شبه المدارية والمنطقة المعتدلة، وفي أقصى الشمال والجنوب المنطقتان القطبيتان. وتقع السويد في المنطقة المعتدلة ذات الفصول الواضحة."),
  draw:()=>{const cx=290,cy=275,r=180,y=s=>cy-s*r;return[A.wipe(),ttl("Klimatzoner"),...zones(cx,cy,r),dot(cx+30,y(.87),"v",7),
   ...callout([cx+40,y(.96)],520,y(.96)+18,"polarzon","b",28),...callout([cx+150,y(.78)],520,y(.72)+10,"tempererad zon","g",28),...callout([cx+150,y(.52)],520,y(.5)+20,"subtropisk zon","o",28),
   ...callout([cx+170,y(.2)],520,y(.2)+10,"tropisk zon","r",28),...callout([cx+30,y(.87)],150,106,"Sverige","v",28)]}},
 {say:t3("Havet påverkar också klimatet. Vatten värms långsamt och svalnar långsamt. Därför har platser vid kusten svalare somrar och mildare vintrar än platser långt inne på land. Vid kusten är det kustklimat och i inlandet inlandsklimat, med större skillnad mellan sommar och vinter.",
   "The sea also affects the climate. Water warms slowly and cools slowly. That is why places on the coast have cooler summers and milder winters than places far inland. On the coast there is a coastal climate, and inland an inland climate with bigger differences between summer and winter.",
   "يؤثّر البحر أيضًا في المناخ. فالماء يسخن ببطء ويبرد ببطء، لذلك تكون الصيفيات في الأماكن الساحلية أبرد والشتاءات أدفأ منها في الأماكن البعيدة عن البحر. على الساحل يسود مناخ ساحلي، وفي الداخل مناخ داخلي فيه فرق أكبر بين الصيف والشتاء."),
  draw:()=>{const X=i=>150+i*50,Y=t=>265-t*6.2,coast=i=>8-7*Math.cos(2*Math.PI*(i-1)/12),inl=i=>4-15*Math.cos(2*Math.PI*i/12),cv=f=>fpath(x=>Y(f((x-150)/50)),X(0),X(11),44);
   return[A.wipe(),ttl("Kustklimat och inlandsklimat"),A.arrow(110,420,730,420,"k"),A.arrow(110,420,110,110,"k"),A.p(R.dashed(110,Y(0),720,Y(0)),"#9aa3b2",2.5),A.tx("0 °C",100,Y(0)+8,22,"k","end"),A.tx("°C",125,120,24,"k","start"),
    A.p(cv(inl),"r",4.5),A.p(cv(coast),"b",4.5),A.tx("jan",X(0),448,22,"k"),A.tx("jul",X(6),448,22,"k"),A.tx("dec",X(11),448,22,"k"),
    A.p(R.line(170,128,210,128,.2),"r",4.5),A.tx("inland",220,136,26,"r","start"),A.p(R.line(170,166,210,166,.2),"b",4.5),A.tx("kust",220,174,26,"b","start"),
    note("Havet jämnar ut temperaturen.",484,"k",26)]}},
 {say:t3("Golfströmmen är en havsström som för varmt vatten från Mexikanska golfen över Atlanten mot norra Europa. Västliga vindar tar med värmen in över land. Därför är det mycket mildare i Sverige än på samma breddgrad i Kanada: i januari runt −1 °C i Stockholm, men runt −26 °C där.",
   "The Gulf Stream is an ocean current that carries warm water from the Gulf of Mexico across the Atlantic towards northern Europe. Westerly winds carry the heat in over land. So it is much milder in Sweden than at the same latitude in Canada: in January about −1 °C in Stockholm, but about −26 °C there.",
   "تيار الخليج تيار بحري ينقل الماء الدافئ من خليج المكسيك عبر المحيط الأطلسي نحو شمال أوروبا، وتحمل الرياح الغربية الدفء إلى اليابسة. لذلك يكون الجوّ في السويد أدفأ بكثير منه على خط العرض نفسه في كندا: في يناير نحو ‎−1 °C في ستوكهولم، ونحو ‎−26 °C هناك."),
  draw:()=>{const G="M280 382 Q360 362 400 300 Q450 220 530 190 Q578 170 592 110";
   return[A.wipe(),ttl("Golfströmmen"),A.band(30,90,740,395,"b"),A.hatch(NA,"g"),A.p(NA,"g",3.5),A.hatch(EU,"g"),A.p(EU,"g",3.5),
    A.p(G,"r",5),A.flow(G,"r",9,6,6),A.tx("Nordamerika",140,250,26,"g"),A.tx("Europa",690,250,26,"g"),A.tx("Atlanten",470,410,28,"b"),A.tx("Golfströmmen",425,300,28,"r","start"),
    A.tx("Mexikanska golfen",230,450,24,"k"),A.p(R.dashed(150,150,670,150),"k",2.5),dot(150,150,"b",7),dot(670,150,"r",7),A.tx("Kanada: −26 °C",150,135,24,"b"),A.tx("Sverige: −1 °C",690,135,24,"r"),
    A.tx("samma breddgrad, januari",400,140,22,"k")]}},
 {say:t3("Även höjden påverkar klimatet. Ju högre upp man kommer, desto kallare blir luften: ungefär 6 °C kallare för varje kilometer uppåt. Därför kan det ligga snö på höga berg även nära ekvatorn, till exempel på Kilimanjaro i Afrika.",
   "Height also affects the climate. The higher up you go, the colder the air gets: about 6 °C colder for every kilometre upwards. That is why there can be snow on high mountains even near the equator, for example on Kilimanjaro in Africa.",
   "يؤثّر الارتفاع أيضًا في المناخ. فكلّما صعدنا أعلى صار الهواء أبرد، بنحو 6 °C لكل كيلومتر إلى الأعلى. لذلك قد يوجد الثلج على قمم الجبال العالية حتى قرب خط الاستواء، مثل جبل كليمنجارو في أفريقيا."),
  draw:()=>{const M="M90 440 L330 120 L560 440",SN="M262 210 L330 120 L396 212 L370 200 L350 216 L326 196 L302 214 L282 200 Z",xr=y=>330+(y-120)*230/320,lab=(y,s)=>[...(555-xr(y)>30?[A.p(R.dashed(xr(y)+6,y,555,y),"#9aa3b2",2)]:[]),A.tx(s,565,y+8,26,"k","start")];
   return[A.wipe(),ttl("Högre upp blir det kallare"),A.p(R.line(40,440,760,440,.4),BRN,4),A.p(M,"k",4.5),A.hatch(SN,"b"),A.p(SN,"b",3),
    ...lab(424,"0 m: 25 °C"),...lab(360,"1 000 m: 19 °C"),...lab(280,"2 000 m: 13 °C"),...lab(200,"3 000 m: 7 °C"),...lab(130,"4 000 m: 1 °C"),
    note("ungefär 6 °C kallare per kilometer uppåt",482,"b",26)]}},
 {say:t3("Kom ihåg: väder är nu, klimat är medelvärden under minst 30 år. Solens strålar värmer mest där de faller rakt, vid ekvatorn. Havet jämnar ut temperaturen, Golfströmmen värmer norra Europa och högre upp blir det kallare.",
   "Remember: weather is now, climate is averages over at least 30 years. The sun's rays warm most where they fall straight down, at the equator. The sea evens out the temperature, the Gulf Stream warms northern Europe, and higher up it gets colder.",
   "تذكّر: الطقس هو الآن، والمناخ متوسّطات خلال 30 سنة على الأقل. أشعة الشمس تدفّئ أكثر حيث تسقط عمودية، عند خط الاستواء. البحر يلطّف درجات الحرارة، وتيار الخليج يدفّئ شمال أوروبا، وكلّما ارتفعنا صار الجوّ أبرد."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["väder = nu, klimat = minst 30 år","b"],["raka solstrålar vid ekvatorn → varmt","r"],["sneda strålar vid polerna → kallt","b"],["havet jämnar ut, Golfströmmen värmer","g"],["ca 6 °C kallare per km uppåt","k"]],70,140,62,31)]},
]};
const picZone=k=>{const cx=210,cy=280,r=170,[a,b]=ZONES[k],ym=cy-(a+b)/2*r,xm=cx+Math.sqrt(r*r-(cy-ym)**2)-20;return[...zones(cx,cy,r),A.p(R.arrow(xm+90,ym-60,xm+4,ym-4,-12),"r",5),A.tx("?",xm+100,ym-66,48,"r")]};
const picCurves=()=>{const X=i=>80+i*27,Y=t=>270-t*6,A1=i=>4-15*Math.cos(2*Math.PI*i/12),B1=i=>8-7*Math.cos(2*Math.PI*(i-1)/12),cv=f=>fpath(x=>Y(f((x-80)/27)),X(0),X(11),44);
  return[A.arrow(60,420,390,420,"k"),A.arrow(60,420,60,120,"k"),A.p(cv(A1),"r",4.5),A.p(cv(B1),"b",4.5),A.tx("A",X(6),Y(19)-14,30,"r"),A.tx("B",X(1)+10,Y(B1(1))-16,30,"b"),A.tx("jan",X(0),448,20,"k"),A.tx("dec",X(11),448,20,"k"),A.tx("°C",75,128,22,"k","start")]};
const BANK4=[
 Q(0,"Vad är skillnaden mellan väder och klimat?","väder är just nu, klimat är under lång tid",["de betyder samma sak","klimat är bara temperatur","väder gäller bara regn"]),
 Q(0,"Varifrån kommer nästan all energi som värmer jorden?","från solen",["från jordens inre","från månen","från haven"]),
 Q(0,"Var på jorden är det varmast i genomsnitt?","vid ekvatorn",["vid nordpolen","vid sydpolen","i Sverige"]),
 Q(0,"\"I morgon blir det regn och 8 °C.\" Handlar det om väder eller klimat?","väder",["klimat","både och","inget av dem"]),
 Q(0,"Vilken klimatzon visar pilen?","tropisk zon",["polarzon","tempererad zon","subtropisk zon"],()=>picZone(0)),
 Q(1,"Vilken klimatzon visar pilen?","polarzon",["tropisk zon","tempererad zon","subtropisk zon"],()=>picZone(3)),
 Q(1,"Under hur lång tid räknar man medelvärden för att beskriva klimatet?","minst 30 år",["ett år","en vecka","en månad"]),
 Q(1,"Varför är det kallt vid polerna?","solstrålarna faller snett och sprids över en stor yta",["polerna ligger längre från solen","isen alstrar kyla","där finns ingen luft"]),
 Q(1,"I vilken klimatzon ligger Sverige?","den tempererade zonen",["den tropiska zonen","polarzonen","den subtropiska zonen"]),
 Q(1,"Vad gör Golfströmmen?","för varmt vatten mot norra Europa",["för kallt vatten mot ekvatorn","gör att Atlanten fryser","för sand från Afrika"]),
 Q(2,"Varför har platser vid kusten mildare vintrar än inlandet?","havet svalnar långsamt och värmer luften",["det blåser alltid varma vindar från land","solen lyser mer vid kusten","kusten ligger lägre"]),
 Q(2,"Hur förändras temperaturen när man klättrar uppför ett högt berg?","den sjunker, ungefär 6 °C per kilometer",["den stiger, eftersom man är närmare solen","den ändras inte","den sjunker 1 °C per kilometer"]),
 Q(2,"Det är 20 °C vid havsytan. Ungefär hur varmt är det 3 km upp?","2 °C",["20 °C","38 °C","−40 °C"]),
 Q(2,"Vilken kurva visar ett inlandsklimat?","kurva A",["kurva B","båda","ingen av dem"],picCurves),
 Q(2,"Varför är vintrarna mildare i Sverige än på samma breddgrad i Kanada?","Golfströmmen och västvindar för med värme från Atlanten",["Sverige ligger närmare solen","Sverige har fler sjöar","det snöar mer i Sverige"]),
 Q(2,"Varför blir det varmare där solstrålarna faller rakt ner?","energin samlas på en mindre yta",["strålarna går fortare","solen är närmare","luften är tunnare"]),
 Wq(1,"Skriv ordet: hur vädret brukar vara under lång tid kallas …",["klimat","klimatet"],["Skriv ordet som saknas:","Hur vädret brukar vara","under lång tid kallas …"]),
 Wq(2,"Skriv ordet: den varma havsström som värmer norra Europa heter …",["golfströmmen","Golfströmmen","golfström"],["Skriv ordet som saknas:","Den varma havsström som värmer","norra Europa heter …"]),
];
LESSONS.push({id:"f7v4",subject:"science",grades:"7",kind:"wb",year:7,ord:14,
 title:t3("Klimat","Climate","المناخ"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="170" cy="92" r="70" fill="#e3eefc" stroke="#1d2433" stroke-width="3"/><path d="M100 92H240" stroke="#1d2433" stroke-dasharray="6 6" stroke-width="2"/><path d="M104 70Q170 60 236 70L240 92H100Z" fill="#cfe9d6"/><path d="M104 114Q170 124 236 114L240 92H100Z" fill="#cfe9d6"/><path d="M103 80Q170 72 237 80L240 104Q170 112 100 104Z" fill="#f6d2cf"/><circle cx="170" cy="92" r="70" fill="none" stroke="#1d2433" stroke-width="3"/><circle cx="44" cy="40" r="18" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M64 52L104 82M64 66L102 92" stroke="#e07b00" stroke-width="3"/></svg>`,
 steps:VT4.steps,mount:wbMount(VT4),gen:bankGen(BANK4)});
WORDS.f7v4=["f7v_vader","f7v_klimat","f7v_ekvator","f7v_klimatzon","f7v_kustklimat","f7v_golfstrommen"];

/* ---------------------------------------------------------------
   5. f7v5: Hållbar utveckling – the Earth's climate and the greenhouse effect
   --------------------------------------------------------------- */
/* the greenhouse picture: ground, a layer of air, sunlight in and heat radiation out */
const ghBase=()=>[ttl("Växthuseffekten"),A.band(40,150,720,65,"b"),A.hatch("M40 405 L760 405 L760 432 L40 432 Z","g"),A.p(R.line(40,405,760,405,.4),"g",4),...art("sun",90,98,.45),
  A.arrow(128,128,210,398,"o"),A.arrow(148,122,320,398,"o"),A.tx("atmosfären",300,192,26,"b"),A.tx("rymden",720,108,24,"k"),A.tx("solljus",250,474,26,"o")];
const GASDOT=[[520,170],[560,195],[600,168],[650,192],[700,172],[740,198],[470,195],[420,170],[380,198]];
const co2=(x,y,s=1)=>{const b=R.line(x-62*s+24*s,y,x-26*s,y,.2)+R.line(x+26*s,y,x+62*s-24*s,y,.2);return[A.p(b,"k",6*s),...atom(x-62*s,y,24*s,"r","O"),...atom(x,y,26*s,"k","C"),...atom(x+62*s,y,24*s,"r","O")]};
const ch4=(x,y,s=1)=>{const H=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b])=>[x+a*44*s,y+b*40*s]);
  return[A.p(H.map(([hx,hy])=>{const dx=hx-x,dy=hy-y,L=Math.hypot(dx,dy);return R.line(x+dx/L*28*s,y+dy/L*28*s,hx-dx/L*17*s,hy-dy/L*17*s,.2)}).join(""),"k",5*s),...atom(x,y,28*s,"k","C"),...H.flatMap(([hx,hy])=>atom(hx,hy,17*s,"b","H"))]};
const turbine=(x,y,h)=>{const hx=x,hy=y-h;return[A.p(R.line(x-6,y,hx-2,hy,.2)+R.line(x+6,y,hx+2,hy,.2),"k",3.5),
  A.p([-90,30,150].map(a=>{const r=a*Math.PI/180;return`M${hx} ${hy} L${f1(hx+Math.cos(r)*68)} ${f1(hy+Math.sin(r)*68)}`}).join(""),"b",5),dot(hx,hy,"k",6)]};
const VT5={steps:[
 {say:t3("Runt jorden finns atmosfären, ett tunt lager av gaser som vi kallar luft. Atmosfären fungerar som ett täcke som håller kvar en del av värmen. I den här lektionen lär vi oss hur det fungerar och hur människan håller på att förändra jordens klimat.",
   "Around the Earth is the atmosphere, a thin layer of gases that we call air. The atmosphere works like a blanket that keeps in part of the heat. In this lesson we learn how it works and how people are changing the Earth's climate.",
   "يحيط بالأرض الغلاف الجوي، وهو طبقة رقيقة من الغازات نسمّيها الهواء. يعمل الغلاف الجوي كغطاء يحتفظ بجزء من الحرارة. في هذا الدرس نتعلّم كيف يعمل ذلك، وكيف يغيّر الإنسان مناخ الأرض."),
  draw:()=>[A.wipe(),ttl("Jordens klimat"),...art("sun",110,150,.65),A.p(R.circ(500,265,150),"#a9d4ec",16),...earth(500,265,122),
   ...callout([360,212],230,300,"atmosfären","b",30),note("Atmosfären håller kvar värme som ett täcke.",470,"k",28)]},
 {say:t3("Solljuset går lätt igenom atmosfären och värmer upp marken och haven. Den varma jordytan sänder sedan själv ut värme i form av infraröd strålning, alltså värmestrålning, upp mot rymden.",
   "Sunlight passes easily through the atmosphere and warms the ground and the seas. The warm surface of the Earth then itself gives off heat as infrared radiation, that is heat radiation, up towards space.",
   "يمرّ ضوء الشمس بسهولة عبر الغلاف الجوي فيسخّن اليابسة والبحار، ثم يطلق سطح الأرض الدافئ بدوره حرارة على شكل أشعة تحت حمراء، أي إشعاع حراري، نحو الفضاء."),
  draw:()=>[A.wipe(),...ghBase(),wave(450,398,450,96,"r"),A.tx("värmestrålning",450,474,26,"r")]},
 {say:t3("Men vissa gaser i atmosfären tar upp en del av värmestrålningen och sänder ut den åt alla håll, även tillbaka ner mot jorden. Gaserna kallas växthusgaser och det hela kallas växthuseffekten. Det påminner om hur glaset i ett växthus håller kvar värme.",
   "But some gases in the atmosphere absorb part of the heat radiation and send it out in all directions, also back down towards the Earth. These gases are called greenhouse gases, and the whole thing is called the greenhouse effect. It is a bit like how the glass of a greenhouse keeps the heat in.",
   "لكن بعض الغازات في الغلاف الجوي تمتصّ جزءًا من الإشعاع الحراري وتطلقه في كل الاتجاهات، ومنها نحو الأرض من جديد. تسمّى هذه الغازات غازات الدفيئة، وتسمّى الظاهرة كلّها الاحتباس الحراري، وهي تشبه احتفاظ زجاج البيت الزجاجي بالحرارة."),
  draw:()=>[...GASDOT.map(([x,y],i)=>dot(x,y,i%3?"k":"r",6)),A.tx("växthusgaser",600,140,24,"b"),wave(610,398,620,224,"r"),wave(680,218,700,398,"r"),A.tx("tillbaka mot jorden",650,474,26,"r")]},
 {say:t3("Den naturliga växthuseffekten är livsviktig. Utan den skulle jordens medeltemperatur vara ungefär −18 °C, och haven skulle frysa. Tack vare växthusgaserna är medeltemperaturen i stället ungefär +15 °C, och det kan finnas flytande vatten och liv.",
   "The natural greenhouse effect is vital. Without it the Earth's average temperature would be about −18 °C, and the seas would freeze. Thanks to the greenhouse gases the average temperature is about +15 °C instead, so there can be liquid water and life.",
   "الاحتباس الحراري الطبيعي ضروري للحياة. فبدونه يكون متوسّط حرارة الأرض نحو ‎−18 °C وتتجمّد البحار. وبفضل غازات الدفيئة يبلغ المتوسّط نحو ‎+15 °C، فيمكن أن يوجد الماء السائل والحياة."),
  draw:()=>[A.wipe(),ttl("Den naturliga växthuseffekten"),A.hatch(R.circ(210,250,110),"b"),A.hatch(R.circ(210,250,110),"b"),A.p(R.circ(210,250,110),"b",4),
   A.p("M150 200 L175 230 M240 190 L260 225 M180 290 L215 300 M250 280 L270 310","#7d8ca6",3),A.p(R.circ(590,250,130),"#a9d4ec",14),...earth(590,250,110),
   A.tx("utan växthuseffekt",210,410,28,"b"),A.tx("ca −18 °C",210,452,32,"b"),A.tx("med växthuseffekt",590,410,28,"g"),A.tx("ca +15 °C",590,452,32,"g")]},
 {say:t3("De viktigaste växthusgaserna är vattenånga, koldioxid, metan och lustgas. Koldioxid bildas när vi förbränner fossila bränslen som kol, olja och naturgas. Metan kommer bland annat från kor, risodlingar och soptippar. Lustgas kommer mest från jordbruk och gödsel.",
   "The most important greenhouse gases are water vapour, carbon dioxide, methane and nitrous oxide. Carbon dioxide forms when we burn fossil fuels such as coal, oil and natural gas. Methane comes for example from cows, rice fields and landfills. Nitrous oxide comes mostly from farming and fertiliser.",
   "أهمّ غازات الدفيئة هي بخار الماء وثاني أكسيد الكربون والميثان وأكسيد النيتروز. يتكوّن ثاني أكسيد الكربون عندما نحرق الوقود الأحفوري كالفحم والنفط والغاز الطبيعي، ويأتي الميثان مثلًا من الأبقار وحقول الأرز ومكبّات النفايات، أما أكسيد النيتروز فيأتي غالبًا من الزراعة والأسمدة."),
  draw:()=>[A.wipe(),ttl("Växthusgaser"),...co2(160,180),...ch4(400,180),...water(640,165,.6),
   A.tx("koldioxid CO₂",160,270,28,"k"),A.tx("metan CH₄",400,270,28,"k"),A.tx("vattenånga H₂O",640,270,28,"b"),
   ...blist([["koldioxid: när kol, olja och naturgas brinner","k"],["metan: kor, risodlingar och soptippar","o"],["lustgas: jordbruk och gödsel","v"]],80,340,50,27)]},
 {say:t3("Sedan 1800-talet har människan släppt ut enorma mängder koldioxid. Halten i luften har ökat från ungefär 280 till över 420 ppm, alltså miljondelar. Mer växthusgaser fångar mer värme och jorden blir varmare. Det kallas den förstärkta växthuseffekten.",
   "Since the 1800s people have released enormous amounts of carbon dioxide. The level in the air has risen from about 280 to over 420 ppm, that is parts per million. More greenhouse gases trap more heat and the Earth gets warmer. This is called the enhanced greenhouse effect.",
   "منذ القرن التاسع عشر أطلق الإنسان كميات هائلة من ثاني أكسيد الكربون، فارتفعت نسبته في الهواء من نحو 280 إلى أكثر من 420 جزءًا من المليون (ppm). والمزيد من غازات الدفيئة يحبس مزيدًا من الحرارة فتزداد حرارة الأرض، ويسمّى ذلك الاحتباس الحراري المعزَّز."),
  draw:()=>{const D=[[1850,285],[1900,296],[1950,311],[1960,317],[1970,326],[1980,339],[1990,354],[2000,370],[2010,390],[2020,414],[2025,427]],X=y=>120+(y-1850)/175*580,Y=v=>410-(v-260)/180*290;
   return[A.wipe(),ttl("Mer koldioxid i luften"),A.arrow(120,410,735,410,"k"),A.arrow(120,410,120,100,"k"),A.tx("ppm",132,112,24,"k","start"),
    ...[1850,1900,1950,2000].map(y=>A.tx(y,X(y),440,22,"k")),...[300,350,400].map(v=>A.tx(v,108,Y(v)+8,20,"k","end")),A.p([300,350,400].map(v=>R.line(114,Y(v),126,Y(v),.1)).join(""),"k",2.5),
    A.p(P(D.map(([y,v])=>[X(y),Y(v)])),"r",5),dot(X(1850),Y(285),"r",7),dot(X(2025),Y(427),"r",7),A.tx("ca 280 ppm",X(1850)+20,Y(285)-22,26,"k","start"),A.tx("över 420 ppm",X(2025)-22,Y(427)+6,26,"r","end"),
    A.tx("ppm = miljondelar",180,180,26,"b","start")]}},
 {say:t3("Jordens medeltemperatur har redan stigit med drygt 1 °C sedan slutet av 1800-talet. Det låter lite, men ger stora följder: isar och glaciärer smälter, havsnivån stiger, värmeböljor, torka och skyfall blir vanligare, och många djur och växter får svårt att klara sig.",
   "The Earth's average temperature has already risen by just over 1 °C since the late 1800s. That sounds small, but the effects are large: ice and glaciers melt, the sea level rises, heatwaves, droughts and cloudbursts become more common, and many animals and plants struggle to survive.",
   "ارتفع متوسّط حرارة الأرض بالفعل بأكثر من درجة واحدة منذ أواخر القرن التاسع عشر. قد يبدو ذلك قليلًا، لكن عواقبه كبيرة: يذوب الجليد والأنهار الجليدية، ويرتفع مستوى البحر، وتصبح موجات الحرّ والجفاف والأمطار الغزيرة أكثر تكرارًا، ويصعب على كثير من الحيوانات والنباتات البقاء."),
  draw:()=>{const row=(y,ic,s,c)=>[...ic,A.tx(s,210,y+10,30,c,"start")];
   return[A.wipe(),ttl("Följder av ett varmare klimat"),
    ...row(130,[A.hatch("M90 150 L110 112 L134 104 L152 124 L160 150 Z","b"),A.p("M90 150 L110 112 L134 104 L152 124 L160 150 Z","b",3.5),...art("drop",170,152,.35)],"isar och glaciärer smälter","b"),
    ...row(215,[A.p("M80 240 Q100 230 120 240 Q140 250 160 240","b",4),A.arrow(120,232,120,188,"b")],"havsnivån stiger","b"),
    ...row(300,[...thermo(105,262,48,.9,"r"),...art("sun",150,292,.3)],"värmeböljor, torka och skyfall","r"),
    ...row(385,[...art("leaf",120,395,.8)],"djur och växter får det svårt","g"),
    note("Jorden är redan drygt 1 °C varmare än på 1800-talet.",472,"k",26)]}},
 {say:t3("För att bromsa uppvärmningen måste utsläppen minska. I Parisavtalet har världens länder kommit överens om att hålla uppvärmningen långt under 2 °C och helst under 1,5 °C. Det kräver förnybar energi från sol och vind, smartare resor, mindre slöseri och att vi bevarar skogar.",
   "To slow down the warming, emissions must fall. In the Paris Agreement the countries of the world agreed to keep the warming well below 2 °C, and preferably below 1.5 °C. That needs renewable energy from sun and wind, smarter travel, less waste and protecting forests.",
   "لإبطاء الاحترار يجب أن تقلّ الانبعاثات. وفي اتفاقية باريس اتفقت دول العالم على إبقاء الاحترار أقلّ بكثير من درجتين، ويفضَّل أقلّ من 1,5 درجة. ويتطلّب ذلك طاقة متجدّدة من الشمس والرياح، وتنقّلًا أذكى، وهدرًا أقل، والحفاظ على الغابات."),
  draw:()=>[A.wipe(),ttl("Vad kan vi göra?"),A.tx("Parisavtalet: under 2 °C, helst 1,5 °C",440,150,30,"g"),A.p(R.line(40,420,760,420,.4),BRN,4),...turbine(130,420,190),
   A.hatch("M270 410 L300 340 L400 340 L370 410 Z","b"),A.p("M270 410 L300 340 L400 340 L370 410 Z M285 375 L385 375 M320 340 L303 410 M350 340 L336 410","b",3.5),
   A.p(R.circ(500,395,24)+R.circ(580,395,24)+"M500 395 L530 355 L570 355 L580 395 M530 355 L545 395 L570 355 M522 345 L540 345","k",3.5),...art("gran",690,420,.75),
   A.tx("vindkraft",130,462,26,"b"),A.tx("solenergi",335,462,26,"b"),A.tx("cykel och buss",540,462,26,"k"),A.tx("bevara skog",690,462,26,"g")]},
 {say:t3("Nu är det din tur att fundera. Diskutera med en kompis eller i klassen: Vad kan du själv, din skola och samhället göra för att minska utsläppen av växthusgaser? Vilka förändringar är lättast att göra, och vilka gör störst skillnad?",
   "Now it is your turn to think. Discuss with a friend or in class: What can you, your school and society do to reduce emissions of greenhouse gases? Which changes are easiest to make, and which make the biggest difference?",
   "الآن جاء دورك لتفكّر. ناقش مع صديق أو في الصف: ماذا يمكنك أنت ومدرستك والمجتمع أن تفعلوا لتقليل انبعاثات غازات الدفيئة؟ أيّ التغييرات أسهل، وأيّها يُحدث الفرق الأكبر؟"),
  draw:()=>[A.wipe(),ttl("Diskutera!"),...[[140,"jag","b"],[400,"skolan","g"],[660,"samhället","o"]].flatMap(([x,s,c])=>[A.p(R.loop(x,200,105,62)+`M${x-30} 258 L${x-46} 300 L${x+4} 262`,c,3.5),A.tx(s,x,192,32,c),A.tx("?",x,240,36,c)]),
   A.tx("Hur kan vi minska utsläppen?",400,370,32,"b"),A.tx("Vad är lättast? Vad gör störst skillnad?",400,425,28,"k")]},
]};
const picGH=()=>[A.band(30,160,360,55,"b"),A.hatch("M30 400 L390 400 L390 424 L30 424 Z","g"),A.p(R.line(30,400,390,400,.4),"g",4),...art("sun",70,110,.38),A.arrow(100,135,160,392,"o"),
  wave(230,392,240,222,"r"),wave(290,216,310,392,"r"),...GASDOT.slice(0,6).map(([x,y],i)=>dot(90+i*52,y+2,i%2?"k":"r",5)),A.tx("?",350,130,48,"r")];
const BANK5=[
 Q(0,"Vad kallas lagret av gaser runt jorden?","atmosfären",["jordskorpan","magnetfältet","havsytan"]),
 Q(0,"Vilken gas bildas när vi eldar kol, olja och naturgas?","koldioxid",["syre","kväve","helium"]),
 Q(0,"Vad händer med havsnivån när isar på land smälter?","den stiger",["den sjunker","den ändras inte","havet fryser"]),
 Q(0,"Vilken av dessa är en förnybar energikälla?","vindkraft",["olja","kol","naturgas"]),
 Q(0,"Vilken molekyl visar bilden?","koldioxid, CO₂",["vatten, H₂O","metan, CH₄","syre, O₂"],()=>co2(200,270,1.3)),
 Q(1,"Vad kallas det som bilden visar?","växthuseffekten",["ozonhålet","vattnets kretslopp","golfströmmen"],picGH),
 Q(1,"Vilken medeltemperatur skulle jorden ha utan växthuseffekten?","ca −18 °C",["ca +15 °C","ca −273 °C","ca +50 °C"]),
 Q(1,"Vilken av dessa är en växthusgas?","metan",["syre","kväve","argon"]),
 Q(1,"Vad gör växthusgaserna?","tar upp värmestrålning och skickar en del tillbaka mot jorden",["stoppar solljuset från att nå jorden","gör hål i atmosfären","kyler ner jorden"]),
 Q(1,"Varifrån kommer mycket av metanet i luften?","kor och risodlingar",["vindkraftverk","solpaneler","cyklar"]),
 Q(1,"Vilken molekyl visar bilden?","metan, CH₄",["koldioxid, CO₂","vatten, H₂O","syre, O₂"],()=>ch4(200,270,1.3)),
 Q(2,"Vad menas med den förstärkta växthuseffekten?","människans utsläpp gör att mer värme hålls kvar",["att solen lyser starkare","att ozonlagret blir tjockare","den naturliga växthuseffekten"]),
 Q(2,"Ungefär hur mycket koldioxid finns i luften i dag?","över 420 ppm",["ca 280 ppm","ca 21 %","ca 78 %"]),
 Q(2,"Vilken strålning hålls kvar av växthusgaserna?","infraröd strålning från jordytan",["synligt ljus från solen","ultraviolett strålning","radiovågor"]),
 Q(2,"Vad har länderna kommit överens om i Parisavtalet?","att hålla uppvärmningen långt under 2 °C",["att sänka temperaturen 5 °C","att sluta använda all energi","att bygga fler kolkraftverk"]),
 Q(2,"Varför stiger havsnivån när det blir varmare?","isar på land smälter och vattnet utvidgar sig",["isen som flyter på havet smälter","det regnar mer över haven","fiskarna blir fler"]),
 Wq(1,"Skriv ordet: koldioxid, metan och vattenånga kallas …",["växthusgaser","växthusgas"],["Skriv ordet som saknas:","Koldioxid, metan och","vattenånga kallas …"]),
 Wq(2,"Skriv ordet: kol, olja och naturgas är fossila …",["bränslen","bränsle"],["Skriv ordet som saknas:","Kol, olja och naturgas","är fossila …"]),
];
LESSONS.push({id:"f7v5",subject:"science",grades:"7",kind:"wb",year:7,ord:15,
 title:t3("Hållbar utveckling: Jordens klimat","Sustainable development: the Earth's climate","التنمية المستدامة: مناخ الأرض"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="20" y="40" width="280" height="30" rx="8" fill="#e3eefc"/><path d="M20 150H300" stroke="#1e9e5a" stroke-width="4"/><circle cx="44" cy="30" r="16" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M60 42L110 146" stroke="#e07b00" stroke-width="3"/><path d="M170 146Q164 120 176 100T170 54M220 50Q226 80 216 100T230 146" fill="none" stroke="#d63b2f" stroke-width="3"/><path d="M222 146l-6-14M222 146l10-10" stroke="#d63b2f" stroke-width="3"/><g fill="#1d2433"><circle cx="140" cy="56" r="4"/><circle cx="200" cy="52" r="4"/><circle cx="260" cy="58" r="4"/></g></svg>`,
 steps:VT5.steps,mount:wbMount(VT5),gen:bankGen(BANK5)});
WORDS.f7v5=["f7v_atmosfar","f7v_vaxthuseffekt","f7v_vaxthusgas","no_koldioxid","f7v_metan","f7v_fossil","f7v_forstarkt","f7v_ppm"];

/* ---------------------------------------------------------------
   6. f7v6 (Lär mer): the thermometer reacts to heat – expansion, liquid thermometer, bimetal, thermocouple, IR
   --------------------------------------------------------------- */
/* a ring seen a little from above, and a ball */
const ring=(x,y)=>A.p(`M${x-56} ${y} Q${x-56} ${y+22} ${x} ${y+22} Q${x+56} ${y+22} ${x+56} ${y} Q${x+56} ${y-22} ${x} ${y-22} Q${x-56} ${y-22} ${x-56} ${y} Z`,"k",5);
const ball=(x,y,r,c="k")=>[A.hatch(R.circ(x,y,r),c),A.p(R.circ(x,y,r),c,3.5)];
/* a bimetal strip from (x, y), length w; bend > 0 curves it downwards (brass on top) */
/* bent: two arcs round one centre below the clamp, the top (brass) layer outside */
const arcP=(x,y,R,w,r)=>P([...Array(25)].map((_,i)=>{const f=i/24*w/R;return[x+r*Math.sin(f),y+R-r*Math.cos(f)]}));
const strip=(x,y,w,bend,cTop="o",cBot="k")=>[...(bend?[A.p(arcP(x,y,bend,w,bend),cTop,11),A.p(arcP(x,y,bend,w,bend-12),cBot,11)]:[A.p(`M${x} ${y} L${x+w} ${y}`,cTop,11),A.p(`M${x} ${y+12} L${x+w} ${y+12}`,cBot,11)]),A.hatch(rectP(x-24,y-14,24,42,.2),"k"),A.p(R.rect(x-24,y-14,24,42,.2),"k",3)];
/* a thermostat circuit at x0: closed when cold, open when hot */
const circuit=(x0,hot)=>{const top=150,bot=360,cx=x0+165,coil=`M${x0+110} ${bot} `+[...Array(8)].map((_,i)=>`L${x0+117+i*14} ${bot+(i%2?-12:12)}`).join(" ")+` L${x0+225} ${bot}`;
  return[A.p(`M${x0+40} ${top} L${x0+40} ${bot} L${x0+110} ${bot} M${x0+225} ${bot} L${x0+290} ${bot} L${x0+290} ${top} L${x0+206} ${top}`,"k",3.5),A.p(coil,hot?"k":"r",4),dot(x0+200,top,"k",6),
   A.p(R.line(x0+26,250,x0+54,250,.1),"k",4),A.p(R.line(x0+32,262,x0+48,262,.1),"k",6),A.p(R.line(x0+40,250,x0+40,262,.1),"#fbfcff",8),
   A.p(hot?`M${x0+40} ${top} Q${x0+120} ${top} ${x0+184} ${top-46}`:`M${x0+40} ${top} L${x0+196} ${top}`,"o",9),
   ...(hot?[]:[wave(cx-30,bot-22,cx-30,bot-90,"r",5,3,3),wave(cx+30,bot-22,cx+30,bot-90,"r",5,3,3)])]};
const IRGUN="M460 172 L600 172 L600 214 L528 214 L516 292 L486 292 L496 214 L460 214 Z";
const VT6={steps:[
 {say:t3("Nästan alla ämnen utvidgar sig när de värms. Partiklarna rör sig snabbare och knuffar isär varandra, så ämnet tar större plats. När ämnet kyls drar det ihop sig igen. Det kallas värmeutvidgning. Massan är densamma, men volymen ändras, och därmed också densiteten.",
   "Almost all substances expand when heated. The particles move faster and push each other apart, so the substance takes up more space. When it cools it contracts again. This is called thermal expansion. The mass stays the same, but the volume changes, and so does the density.",
   "تتمدّد معظم المواد تقريبًا عند تسخينها، إذ تتحرّك جسيماتها أسرع فيدفع بعضها بعضًا بعيدًا، فتشغل المادة حيّزًا أكبر. وعندما تبرد تنكمش من جديد، ويسمّى ذلك التمدّد الحراري. تبقى الكتلة كما هي، لكن الحجم يتغيّر، وبالتالي تتغيّر الكثافة أيضًا."),
  draw:()=>[A.wipe(),ttl("Värmeutvidgning"),box(90,190,220,160,"b"),...shake(grid(125,225,4,3,50,50,0,81),4,2.4,"b",9),A.arrow(330,270,410,270,"r"),A.tx("värm",370,250,24,"r"),
   box(430,150,300,240,"r"),...shake(grid(470,195,4,3,72,72,0,87),13,.8,"r",9),A.tx("kallt: tätt ihop",200,410,30,"b"),A.tx("varmt: tar större plats",580,430,30,"r"),
   note("Samma massa, större volym → lägre densitet.",478,"k",26)]},
 {say:t3("Ett klassiskt försök: en metallkula passar precis genom en metallring. Värmer man kulan med en brännare utvidgar den sig och fastnar i ringen. Låter man kulan svalna drar den ihop sig och glider igenom igen. Utvidgningen är liten, men den syns.",
   "A classic experiment: a metal ball just fits through a metal ring. If you heat the ball with a burner, it expands and gets stuck in the ring. If you let the ball cool, it contracts and slips through again. The expansion is small, but you can see it.",
   "تجربة مشهورة: كرة معدنية تمرّ بالكاد عبر حلقة معدنية. إذا سخّنّا الكرة بموقد تتمدّد وتعلق في الحلقة، وإذا تركناها تبرد تنكمش وتمرّ من جديد. التمدّد صغير، لكنه يُرى."),
  draw:()=>[A.wipe(),ttl("Kulan och ringen"),...ball(200,262,46,"b"),ring(200,220),A.arrow(200,330,200,370,"b"),
   ...ball(400,220,52,"r"),...flame(400,370,.9),A.arrow(470,220,530,220,"k"),
   ring(640,260),...ball(640,206,60,"r"),A.tx("kall kula går igenom",200,430,26,"b"),A.tx("kulan värms",400,430,26,"r"),A.tx("varm kula fastnar",640,430,26,"r"),
   note("När kulan svalnar går den igenom igen.",478,"k",26)]},
 {say:t3("Stål utvidgar sig ungefär 1,2 mm per meter när temperaturen ökar med 100 °C. Det låter lite, men en 1 km lång räls som värms 40 °C skulle bli nästan en halv meter längre om den fick röra sig fritt. Därför har broar fogar, så kallade dilatationsfogar, som ger utrymme.",
   "Steel expands about 1.2 mm per metre when the temperature rises by 100 °C. That sounds small, but a 1 km rail warmed by 40 °C would become almost half a metre longer if it could move freely. That is why bridges have joints, called expansion joints, that leave room.",
   "يتمدّد الفولاذ نحو 1,2 مم لكل متر عندما ترتفع حرارته 100 °C. قد يبدو ذلك قليلًا، لكن سكة طولها كيلومتر واحد تسخن 40 °C ستطول نحو نصف متر لو تُركت حرّة. لذلك توجد في الجسور فواصل تسمّى فواصل التمدّد تترك مكانًا لذلك."),
  draw:()=>[A.wipe(),ttl("Stål utvidgar sig"),A.tx("1 m stål, +100 °C → 1,2 mm längre",400,130,30,"k"),
   A.p("M70 240 L384 240 L384 250 L376 250 L376 262 L384 262 L384 272 L70 272 M416 240 L730 240 L730 272 L416 272 L416 262 L408 262 L408 250 L416 250 Z","k",4),
   A.p(R.line(170,272,170,360,.2)+R.line(190,272,190,360,.2)+R.line(610,272,610,360,.2)+R.line(630,272,630,360,.2),"k",4),A.p(R.line(40,360,760,360,.4),BRN,4),
   ...callout([400,256],400,320,"dilatationsfog","r",26),A.tx("1 km räls, +40 °C:",400,410,28,"b"),A.tx("1 000 · 1,2 mm · 40/100 = 480 mm",400,455,30,"b")]},
 {say:t3("I en vanlig termometer finns en vätska, oftast färgad sprit, i en liten behållare och ett tunt glasrör. När det blir varmare utvidgar sig spriten mycket mer än glaset och stiger i röret. Röret är tunt, så även en liten volymökning ger en tydlig höjdskillnad.",
   "In an ordinary thermometer there is a liquid, usually coloured alcohol, in a small bulb and a thin glass tube. When it gets warmer, the alcohol expands much more than the glass and rises in the tube. The tube is thin, so even a small increase in volume gives a clear change in height.",
   "في ميزان الحرارة العادي سائل، غالبًا كحول ملوّن، في خزّان صغير وأنبوب زجاجي رفيع. عندما ترتفع الحرارة يتمدّد الكحول أكثر بكثير من الزجاج فيصعد في الأنبوب. ولأن الأنبوب رفيع فإن زيادة صغيرة في الحجم تعطي فرقًا واضحًا في الارتفاع."),
  draw:()=>{const T=thermoScale(260,100,300,-20,50,10,22,"r",22,false);return[A.wipe(),ttl("Vätsketermometern"),...T.o,A.flow("M260 400 L260 260","r",3,2.6,4),
   ...callout([271,150],420,150,"tunt glasrör","k",28),...callout([286,T.Y(30)],420,225,"skala","k",28),...callout([260,330],420,320,"färgad sprit","r",28),...callout([279,420],420,420,"behållare","r",28),
   note("Spriten utvidgar sig mer än glaset och stiger.",478,"k",26)]}},
 {say:t3("Hur får termometern sin skala? Man sätter den i isvatten och markerar 0 °C. Sedan sätter man den i kokande vatten, vid normalt lufttryck, och markerar 100 °C. Avståndet mellan märkena delas i 100 lika stora delar. Varje del är en grad.",
   "How does the thermometer get its scale? You put it in ice water and mark 0 °C. Then you put it in boiling water, at normal air pressure, and mark 100 °C. The distance between the marks is divided into 100 equal parts. Each part is one degree.",
   "كيف يحصل ميزان الحرارة على تدريجه؟ نضعه في ماء مثلّج ونضع علامة 0 °C، ثم نضعه في ماء يغلي تحت الضغط الجوي العادي ونضع علامة 100 °C، ونقسم المسافة بين العلامتين إلى 100 جزء متساوٍ، وكل جزء درجة واحدة."),
  draw:()=>[A.wipe(),ttl("Att göra en skala"),...beaker(70,200,190,180,240,"b"),...ice(115,262,.4),...ice(215,292,.4),...thermoY(165,120,200,302,"r"),A.p(R.line(150,302,180,302,.1),"b",4),
   ...beaker(540,200,190,180,240,"b"),...[[580,330],[620,300],[680,340],[700,290],[600,365]].map(([x,y])=>A.p(R.circ(x,y,8),"b",3)),A.p("M570 186 Q560 170 570 154 M700 186 Q690 170 700 154","#7d8ca6",3),
   ...thermoY(635,120,200,134,"r"),A.p(R.line(620,134,650,134,.1),"r",4),
   A.p(R.line(400,140,400,370,.2),"k",4),A.p([...Array(11)].map((_,i)=>R.line(388,140+i*23,i%5?404:416,140+i*23,.1)).join(""),"k",3),A.tx("100 °C",428,148,26,"r","start"),A.tx("0 °C",428,378,26,"b","start"),
   A.tx("100 lika delar",400,420,26,"k"),A.tx("isvatten: 0 °C",165,465,26,"b"),A.tx("kokande: 100 °C",635,465,26,"r")]},
 {say:t3("En bimetall är två tunna remsor av olika metaller, till exempel mässing och järn, som sitter ihop. Mässing utvidgar sig mer än järn. När remsan värms blir mässingssidan längre än järnsidan, och då måste remsan böja sig, med mässingen på utsidan av böjen.",
   "A bimetallic strip is two thin strips of different metals, for example brass and iron, stuck together. Brass expands more than iron. When the strip is heated, the brass side gets longer than the iron side, so the strip has to bend, with the brass on the outside of the curve.",
   "الشريط ثنائي المعدن شريطان رقيقان من معدنين مختلفين، مثل النحاس الأصفر والحديد، ملتصقان معًا. يتمدّد النحاس الأصفر أكثر من الحديد، فعند التسخين يصبح جانب النحاس أطول من جانب الحديد، فيضطرّ الشريط إلى الانحناء ويكون النحاس على الجهة الخارجية من الانحناء."),
  draw:()=>[A.wipe(),ttl("Bimetallen"),...strip(100,210,250,0),A.tx("mässing",225,186,26,"o"),A.tx("järn",225,262,26,"k"),A.tx("kall: rak",225,330,30,"b"),
   ...strip(460,190,250,280),...flame(570,390,.8),A.tx("mässing",640,172,26,"o","start"),A.tx("järn",560,286,26,"k","end"),A.tx("varm: böjer sig",590,440,30,"r"),
   note("Mässing utvidgar sig mer än järn.",480,"k",26)]},
 {say:t3("Bimetaller används i termostater, till exempel i strykjärn och vattenkokare. Bimetallen är en del av strömkretsen. När det blir för varmt böjer den sig bort från kontakten, kretsen bryts och värmen stängs av. När den har svalnat sluter den kretsen igen.",
   "Bimetallic strips are used in thermostats, for example in irons and kettles. The strip is part of the electric circuit. When it gets too hot, it bends away from the contact, the circuit is broken and the heating turns off. When it has cooled down, it closes the circuit again.",
   "تُستخدم الأشرطة ثنائية المعدن في منظّمات الحرارة، مثل المكواة والغلاية الكهربائية. يكون الشريط جزءًا من الدارة الكهربائية، فإذا ارتفعت الحرارة كثيرًا ينحني بعيدًا عن نقطة التلامس فتنقطع الدارة ويتوقّف التسخين، وعندما يبرد يغلق الدارة من جديد."),
  draw:()=>[A.wipe(),ttl("Termostaten"),...circuit(50,false),...circuit(430,true),A.tx("bimetall",120,130,24,"o"),A.tx("värmeelement",215,404,22,"r"),
   A.tx("kallt: kretsen är sluten",215,450,26,"g"),A.tx("för varmt: kretsen bryts",595,450,26,"r")]},
 {say:t3("Elektroniska termometrar fungerar annorlunda. Ett termoelement är två olika metaller som sitter ihop i en spets. När spetsen värms uppstår en liten elektrisk spänning som växer med temperaturen. En IR-termometer mäter i stället värmestrålningen från ett föremål, utan att röra det.",
   "Electronic thermometers work differently. A thermocouple is two different metals joined at a tip. When the tip is heated, a small electric voltage appears that grows with the temperature. An IR thermometer instead measures the heat radiation from an object, without touching it.",
   "تعمل موازين الحرارة الإلكترونية بطريقة مختلفة. المزدوجة الحرارية معدنان مختلفان ملحومان عند طرف، وعندما يسخن الطرف ينشأ جهد كهربائي صغير يزداد مع الحرارة. أما ميزان الحرارة بالأشعة تحت الحمراء فيقيس الإشعاع الحراري الصادر عن الجسم دون أن يلمسه."),
  draw:()=>[A.wipe(),ttl("Elektroniska termometrar"),A.p(R.line(400,100,400,470,.3),"#c7cfdc",2),box(90,120,140,80,"k"),A.tx("2,4 mV",160,172,30,"k"),
   A.p("M200 200 Q215 300 300 370","o",4),A.p("M120 200 Q150 330 296 372","b",4),dot(298,372,"k",6),...flame(300,450,.95),A.tx("termoelement",150,470,26,"k"),
   A.hatch(IRGUN,"k"),A.p(IRGUN,"k",3.5),A.tx("180 °C",530,155,26,"r"),A.p("M640 330 L650 360 L740 360 L750 330 Z M750 338 L782 330","k",3.5),wave(690,318,612,200,"r"),
   A.tx("IR-termometer",520,330,26,"k"),A.tx("mäter värmestrålning",600,440,26,"r")]},
 {say:t3("Kom ihåg: ämnen utvidgar sig när de värms. I en vätsketermometer stiger spriten. En bimetall böjer sig eftersom två metaller utvidgar sig olika mycket och används i termostater. Termoelement ger en spänning, och IR-termometrar mäter värmestrålning.",
   "Remember: substances expand when heated. In a liquid thermometer the alcohol rises. A bimetallic strip bends because two metals expand by different amounts, and it is used in thermostats. Thermocouples give a voltage, and IR thermometers measure heat radiation.",
   "تذكّر: تتمدّد المواد عند تسخينها. في ميزان الحرارة السائل يصعد الكحول. والشريط ثنائي المعدن ينحني لأن المعدنين يتمدّدان بمقدارين مختلفين، ويُستخدم في منظّمات الحرارة. المزدوجة الحرارية تعطي جهدًا، وموازين الأشعة تحت الحمراء تقيس الإشعاع الحراري."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["värme → ämnen utvidgar sig","r"],["stål: 1,2 mm per meter och 100 °C","k"],["vätsketermometer: spriten stiger","r"],["bimetall böjer sig → termostat","o"],["termoelement: spänning, IR: strålning","v"]],70,140,62,31)]},
]};
const picRing=()=>[ring(200,300),...ball(200,240,64,"r"),A.tx("varm kula",200,420,28,"r")];
const picBim=()=>[A.hatch(rectP(36,176,24,42,.2),"k"),A.p(R.rect(36,176,24,42,.2),"k",3),A.tx("A",250,190,32,"o"),A.tx("B",170,280,32,"b"),A.p(arcP(60,190,250,260,250),"o",11),A.p(arcP(60,190,250,260,238),"b",11),...flame(190,420,.7)];
const BANK6=[
 Q(0,"Vad händer med de flesta ämnen när de värms?","de utvidgar sig",["de drar ihop sig","de blir tyngre","de blir lättare"]),
 Q(0,"Vilken vätska finns oftast i en vanlig termometer i dag?","färgad sprit",["vatten","saft","olja"]),
 Q(0,"Vad mäter en IR-termometer?","värmestrålningen från ett föremål",["föremålets vikt","ljudet från föremålet","luftens fuktighet"]),
 Q(0,"Varför fastnar kulan i ringen?","den har värmts och utvidgat sig",["ringen har krympt av sig själv","kulan har blivit tyngre","ringen är magnetisk"],picRing),
 Q(1,"Varför stiger vätskan i termometern när det blir varmare?","vätskan utvidgar sig mer än glaset",["glaset krymper","vätskan blir lättare och flyter upp","luften trycker upp den"]),
 Q(1,"Varför har broar fogar med mellanrum?","så att bron får plats att utvidga sig när det är varmt",["så att regnvatten kan rinna bort","för att spara material","för att bron ska kunna svänga"]),
 Q(1,"Vad är en bimetall?","två olika metaller som sitter ihop",["två lika metallbitar","en magnet","en metall som smälter lätt"]),
 Q(1,"Hur gör man skalan på en celsiustermometer?","markerar isvatten som 0 och kokande vatten som 100",["markerar kroppen som 0 och kokande vatten som 100","jämför med en annan termometer i frysen","markerar rummet som 0 och solen som 100"]),
 Q(1,"Var används en bimetall?","i termostaten i ett strykjärn",["i en kompass","i en linjal","i en solpanel"]),
 Q(1,"Vad ger ett termoelement när det värms?","en liten elektrisk spänning",["ett ljud","ett starkt ljus","en färgändring"]),
 Q(2,"Remsan har böjt sig när den värmdes. Vilken metall utvidgar sig mest?","A, den på utsidan av böjen",["B, den på insidan av böjen","de utvidgar sig lika mycket","ingen av dem"],picBim),
 Q(2,"Stål växer 1,2 mm per meter och 100 °C. Hur mycket längre blir en 10 m lång stålbalk vid +100 °C?","12 mm",["1,2 mm","120 mm","0,12 mm"]),
 Q(2,"Stål växer 1,2 mm per meter och 100 °C. Hur mycket växer en 50 m lång stålbro om den värms 20 °C?","12 mm",["60 mm","1,2 mm","120 mm"]),
 Q(2,"Mässing utvidgar sig mer än järn. Åt vilket håll böjer sig en bimetall av mässing och järn när den värms?","mot järnsidan",["mot mässingssidan","den böjer sig inte","den blir bara kortare"]),
 Q(2,"Varför är röret i en termometer så tunt?","en liten volymökning ger en tydlig höjdskillnad",["det sparar glas","vätskan kan inte rinna ut","termometern blir starkare"]),
 Q(2,"Varför bryts strömmen i en termostat när det blir för varmt?","bimetallen böjer sig bort från kontakten",["metallen smälter","strömmen tar slut","kontakten blir magnetisk"]),
 Wq(1,"Skriv ordet: att ämnen tar större plats när de värms kallas …",["värmeutvidgning","utvidgning"],["Skriv ordet som saknas:","Att ämnen tar större plats","när de värms kallas …"]),
 Wq(2,"Skriv talet: stål växer 1,2 mm per meter och 100 °C. Hur många mm växer 5 m stål vid +100 °C?",["6","6 mm","6mm"],["Skriv talet (mm):","Stål växer 1,2 mm per meter och 100 °C.","Hur mycket växer 5 m stål vid +100 °C?"]),
 Wq(2,"Skriv ordet: två olika metaller som sitter ihop och böjer sig när de värms kallas en …",["bimetall","bimetallen"],["Skriv ordet som saknas:","Två olika metaller som sitter ihop","och böjer sig vid värme kallas en …"]),
];
LESSONS.push({id:"f7v6",subject:"science",grades:"7",kind:"wb",year:7,ord:16,
 title:t3("Lär mer: Termometern reagerar på värme","Learn more: The thermometer reacts to heat","تعلّم المزيد: ميزان الحرارة يستجيب للحرارة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M50 130V40Q50 28 62 28Q74 28 74 40V130" fill="none" stroke="#1d2433" stroke-width="4"/><circle cx="62" cy="145" r="18" fill="#f6d2cf" stroke="#1d2433" stroke-width="4"/><path d="M62 140V76" stroke="#d63b2f" stroke-width="8" stroke-linecap="round"/><rect x="120" y="58" width="22" height="40" fill="#d8dce4" stroke="#1d2433" stroke-width="3"/><path d="M142 70Q220 70 280 128" fill="none" stroke="#e07b00" stroke-width="10"/><path d="M142 82Q216 84 272 136" fill="none" stroke="#7d8ca6" stroke-width="10"/></svg>`,
 steps:VT6.steps,mount:wbMount(VT6),gen:bankGen(BANK6)});
WORDS.f7v6=["f7v_varmeutvidgning","f7v_dilatationsfog","f7v_bimetall","f7v_termostat","f7v_termoelement","f7v_infrarod"];

/* ---------------------------------------------------------------
   7. f7v7 (Lär mer): spreading heat – good and bad (houses, thermos, heat sink, the body)
   --------------------------------------------------------------- */
const THERM_O="M220 140 L220 420 Q220 442 242 442 L418 442 Q440 442 440 420 L440 140",THERM_I="M246 140 L246 400 Q246 416 262 416 L398 416 Q414 416 414 400 L414 140";
const thermos=()=>[A.p(THERM_O,"#7d8ca6",5),A.p(THERM_I,"#7d8ca6",5),A.hatch("M250 200 L410 200 L410 400 Q410 412 398 412 L262 412 Q250 412 250 400 Z","o"),
  A.hatch(rectP(236,108,188,34,.2),"o"),A.p(R.rect(236,108,188,34,.2),BRN,3.5)];
const air=(x0,y0,cols,rows,g,s)=>A.p(grid(x0,y0,cols,rows,g,g,8,s).map(([x,y])=>R.circ(x,y,7)).join(""),"#9aa3b2",2);
const skin=(x0,x1,wide)=>[A.p(`M${x0} 220 Q${(x0+x1)/4} 210 ${(x0+x1)/2} 220 Q${(x0+x1)*3/4} 230 ${x1} 220`,"p",4),A.band(x0,224,x1-x0,190,"p"),
  A.p(R.line(x0+10,300-(wide?22:6),x1-10,300-(wide?22:6),.2)+R.line(x0+10,300+(wide?22:6),x1-10,300+(wide?22:6),.2),"r",4),A.flow(`M${x0+16} 300 L${x1-16} 300`,"r",wide?8:4,wide?3:5,wide?7:4)];
const VT7={steps:[
 {say:t3("Ibland vill vi att värme ska spridas snabbt, till exempel från en platta till en kastrull eller från en dator ut i luften. Ibland vill vi stoppa värmen, som i ett hus en kall vinterdag. Med kunskap om ledning, strömning och strålning kan vi styra vart värmen tar vägen.",
   "Sometimes we want heat to spread fast, for example from a hotplate to a pan or from a computer out into the air. Sometimes we want to stop the heat, as in a house on a cold winter day. With knowledge of conduction, convection and radiation we can control where the heat goes.",
   "أحيانًا نريد أن تنتشر الحرارة بسرعة، مثل انتقالها من الموقد إلى القدر أو من الحاسوب إلى الهواء، وأحيانًا نريد إيقافها، كما في بيت في يوم شتوي بارد. وبمعرفة التوصيل والحمل والإشعاع نستطيع التحكّم في مسار الحرارة."),
  draw:()=>[A.wipe(),ttl("Värme – sprida eller stoppa?"),A.p(R.line(400,100,400,470,.3),"#c7cfdc",2),A.tx("vill sprida värme",200,130,32,"r"),A.tx("vill stoppa värme",600,130,32,"b"),
   A.p("M110 230 L125 280 L275 280 L290 230 M290 236 L360 228","k",5),...flame(200,370,.8),A.tx("kastrull på spis",200,420,26,"k"),A.tx("kylfläns i datorn",200,458,26,"k"),
   house(600,320,170,110),A.p(R.rect(560,250,40,36,.3),"b",3),A.tx("21 °C",640,282,24,"r"),A.tx("hus på vintern",600,420,26,"k"),A.tx("termos och kläder",600,458,26,"k")]},
 {say:t3("En vinterdag läcker värme ut ur ett hus överallt där inne möter ute: genom väggar, tak, fönster, golv och springor. Varm luft stiger, så i ett dåligt isolerat hus försvinner mycket värme genom taket. Ju större temperaturskillnaden är, desto snabbare läcker värmen ut.",
   "On a winter day heat leaks out of a house wherever inside meets outside: through walls, roof, windows, floor and gaps. Warm air rises, so in a poorly insulated house a lot of heat is lost through the roof. The bigger the temperature difference, the faster the heat leaks out.",
   "في يوم شتوي تتسرّب الحرارة من البيت في كل مكان يلتقي فيه الداخل بالخارج: عبر الجدران والسقف والنوافذ والأرضية والشقوق. والهواء الدافئ يصعد، لذلك يفقد البيت ضعيف العزل كثيرًا من حرارته عبر السقف. وكلّما كان فرق الحرارة أكبر تسرّبت الحرارة أسرع."),
  draw:()=>[A.wipe(),ttl("Huset läcker värme"),A.p(R.line(60,430,740,430,.4),BRN,4),house(400,430,340,200),A.p(R.rect(280,290,80,70,.3),"b",3.5),A.p(R.rect(450,330,60,100,.3),"k",3.5),
   A.tx("inne 21 °C",400,272,28,"r"),A.tx("ute −10 °C",110,180,28,"b"),
   A.p(R.arrow(320,190,270,118)+R.arrow(480,190,530,118),"r",6),A.p(R.arrow(570,320,650,320)+R.arrow(280,325,195,325)+R.arrow(380,430,380,480),"r",3.5),
   A.flow("M400 220 Q390 180 400 140 Q410 110 400 90","r",3,3,5),A.tx("mest genom taket",650,150,26,"r"),A.tx("vägg",680,300,24,"r"),A.tx("fönster",170,300,24,"r"),A.tx("golv",430,478,24,"r")]},
 {say:t3("I väggar och på vinden lägger man isolering, till exempel mineralull eller cellplast. Den är full av små luftfickor. Luft leder värme dåligt, och när luften sitter fast i små fickor kan den inte strömma runt. Så stoppas både ledning och strömning.",
   "In walls and in the loft, insulation is put in, for example mineral wool or foam plastic. It is full of small air pockets. Air conducts heat poorly, and when the air is trapped in small pockets it cannot circulate. So both conduction and convection are stopped.",
   "توضع في الجدران وفي العلّية مادة عازلة، مثل الصوف المعدني أو البلاستيك الرغوي، وهي مليئة بجيوب هواء صغيرة. والهواء موصل ضعيف للحرارة، وعندما يُحبس في جيوب صغيرة لا يستطيع أن يدور، فيتوقّف بذلك التوصيل والحمل معًا."),
  draw:()=>[A.wipe(),ttl("Isolering"),A.hatch(rectP(250,120,30,320,.2),"o"),A.p(R.rect(250,120,30,320,.2),"o",3.5),A.hatch(rectP(500,120,30,320,.2),"o"),A.p(R.rect(500,120,30,320,.2),"o",3.5),
   air(298,140,8,12,26,91),A.p("M290 160 Q340 150 390 170 T490 160 M290 260 Q350 250 400 272 T490 262 M290 360 Q340 352 390 370 T490 362","#c7cfdc",2.5),A.tx("mineralull",390,106,28,"k"),
   A.tx("inne 21 °C",130,200,30,"r"),A.tx("ute −10 °C",660,200,30,"b"),A.p(R.arrow(110,300,235,300),"r",7),A.p(R.arrow(545,300,610,300),"r",2.5),A.tx("lite värme",665,340,24,"r"),
   note("Luftfickor stoppar ledning och strömning.",478,"k",26)]},
 {say:t3("Fönster är svaga punkter. Moderna fönster har tre glas med luft eller ädelgasen argon emellan, och den isolerar. Ofta har glaset en tunn, osynlig metallbeläggning som reflekterar värmestrålning tillbaka in i rummet, medan ljuset släpps igenom.",
   "Windows are weak points. Modern windows have three panes with air or the noble gas argon between them, which insulates. Often the glass has a thin, invisible metal coating that reflects heat radiation back into the room while letting the light through.",
   "النوافذ نقاط ضعف. للنوافذ الحديثة ثلاثة ألواح زجاجية بينها هواء أو غاز الأرغون النبيل، وهو عازل. وغالبًا ما يكون على الزجاج طلاء معدني رقيق غير مرئي يعكس الإشعاع الحراري إلى داخل الغرفة بينما يسمح للضوء بالمرور."),
  draw:()=>[A.wipe(),ttl("Fönster med tre glas"),A.p(R.rect(290,110,190,300,.3),BRN,5),A.p(R.line(320,118,320,402,.1)+R.line(385,118,385,402,.1)+R.line(450,118,450,402,.1),"b",6),
   A.p(R.line(326,118,326,402,.1),"v",2.5),A.tx("inne",150,140,30,"r"),A.tx("ute",650,140,30,"b"),wave(150,230,312,250,"r"),wave(312,280,165,320,"r"),A.tx("speglas tillbaka",160,380,26,"r"),
   A.arrow(700,210,500,250,"o"),...art("sun",720,170,.4),A.tx("ljuset går in",640,300,24,"o"),A.tx("luft eller argon mellan glasen",385,455,26,"b")]},
 {say:t3("En termos stoppar alla tre sätten. Mellan de dubbla väggarna är det vakuum, nästan inga partiklar, så ledning och strömning kan inte ske där. Väggarna är blanka och speglar tillbaka värmestrålningen. Korken hindrar varm luft och ånga från att strömma ut.",
   "A thermos stops all three ways. Between the double walls there is a vacuum, almost no particles, so conduction and convection cannot happen there. The walls are shiny and reflect the heat radiation back. The stopper keeps warm air and steam from flowing out.",
   "يوقف الترمس الطرق الثلاث كلّها. بين جداره المزدوج فراغ لا يكاد يحتوي على جسيمات، فلا يحدث هناك توصيل ولا حمل. والجدران لامعة تعكس الإشعاع الحراري إلى الداخل، والسدادة تمنع الهواء الدافئ والبخار من الخروج."),
  draw:()=>[A.wipe(),ttl("Termosen"),...thermos(),wave(290,320,400,280,"r",5,3,3),wave(400,300,300,360,"r",5,3,3),
   ...callout([330,125],500,130,"kork stoppar strömning",BRN,26),...callout([414,230],500,210,"blanka väggar speglar","k",26),...callout([432,320],500,300,"vakuum: ingen ledning","b",26),...callout([330,390],500,400,"varm dryck","o",26)]},
 {say:t3("I en dator blir processorn varm och måste kylas. Ovanpå den sitter en kylfläns av aluminium. Metallen leder bort värmen, och de många tunna flänsarna ger en stor yta mot luften. En fläkt blåser luft mellan flänsarna och för bort värmen. Det kallas påtvingad strömning.",
   "In a computer the processor gets hot and must be cooled. On top of it sits a heat sink of aluminium. The metal conducts the heat away, and the many thin fins give a large surface towards the air. A fan blows air between the fins and carries the heat away. This is called forced convection.",
   "في الحاسوب يسخن المعالج ولا بدّ من تبريده، فيوضع فوقه مشتّت حراري من الألمنيوم. يوصل المعدن الحرارة بعيدًا، والزعانف الرقيقة الكثيرة تعطي سطحًا كبيرًا ملامسًا للهواء، ثم تدفع مروحة الهواء بين الزعانف فتحمل الحرارة بعيدًا، ويسمّى ذلك الحمل القسري."),
  draw:()=>[A.wipe(),ttl("Kylflänsen"),A.p(R.line(70,420,730,420,.4),"g",4),A.hatch(rectP(310,382,180,38,.2),"k"),A.p(R.rect(310,382,180,38,.2),"k",3.5),A.p(R.rect(280,352,240,30,.2),"#7d8ca6",4),
   A.p([...Array(9)].map((_,i)=>R.rect(290+i*26,205,8,147,.1)).join(""),"#7d8ca6",3.5),A.p(R.circ(400,150,44)+"M400 150 Q420 118 440 140 M400 150 Q372 168 362 136 M400 150 Q408 186 380 186","k",3.5),
   A.flow("M368 200 L368 330 Q368 342 352 342 L210 342","r",4,3,5),A.flow("M432 200 L432 330 Q432 342 448 342 L590 342","r",4,3,5),
   A.tx("fläkt",460,150,26,"k","start"),A.tx("flänsar av aluminium",540,250,26,"k","start"),A.tx("varm luft ut",170,310,24,"r"),A.tx("processor",400,465,26,"k")]},
 {say:t3("Kroppen håller ungefär 37 °C och reglerar själv sin värme. När du blir varm vidgas blodkärlen i huden, så att mer varmt blod kommer nära ytan och kan avge värme. Du svettas också. När svetten avdunstar tar den värme från huden, och du kyls av.",
   "The body stays at about 37 °C and regulates its own heat. When you get hot, the blood vessels in the skin widen so that more warm blood comes near the surface and can give off heat. You also sweat. When the sweat evaporates it takes heat from the skin, and you cool down.",
   "يحافظ الجسم على حرارة نحو 37 °C وينظّم حرارته بنفسه. عندما تشعر بالحرّ تتّسع الأوعية الدموية في الجلد فيقترب مزيد من الدم الدافئ من السطح ويطلق الحرارة. وتتعرّق أيضًا، وعندما يتبخّر العرق يأخذ حرارة من الجلد فيبرد جسمك."),
  draw:()=>[A.wipe(),ttl("När kroppen blir varm"),...skin(80,720,true),...[200,400,600].flatMap(x=>[...art("drop",x,214,.35),wave(x,190,x,118,"b",5,3,3)]),
   A.tx("svett avdunstar",300,140,26,"b"),A.tx("blodkärlen vidgas",400,370,28,"r"),A.tx("hud",740,260,26,"p","end"),note("Avdunstningen tar värme från huden.",470,"k",26)]},
 {say:t3("När du fryser drar blodkärlen i huden ihop sig, så att mindre värme förs ut till ytan. Musklerna kan börja darra, du huttrar, och då bildas värme. Kläder i flera lager håller kvar luft nära kroppen. Luften isolerar, precis som i husets väggar.",
   "When you are cold, the blood vessels in the skin narrow so that less heat is carried out to the surface. The muscles may start to shake, you shiver, and that makes heat. Clothes in several layers keep air close to the body. The air insulates, just as in the walls of a house.",
   "عندما تشعر بالبرد تضيق الأوعية الدموية في الجلد فتصل حرارة أقلّ إلى السطح. وقد تبدأ العضلات بالارتعاش، أي ترتجف، فتتولّد حرارة. والملابس المكوّنة من عدّة طبقات تحتفظ بالهواء قرب الجسم، والهواء عازل تمامًا كما في جدران البيت."),
  draw:()=>[A.wipe(),ttl("När kroppen fryser"),A.p(R.line(400,100,400,470,.3),"#c7cfdc",2),...skin(40,370,false),A.tx("blodkärlen drar ihop sig",205,370,24,"b"),
   A.p("M80 160 L95 140 L110 160 L125 140 L140 160 M240 160 L255 140 L270 160 L285 140 L300 160","r",3),A.tx("huttra → värme",205,120,24,"r"),
   A.p(R.line(450,130,450,400,.2),"p",5),A.p(R.line(500,130,500,400,.2),"o",8),A.p(R.line(560,130,560,400,.2),"g",8),A.p(R.line(620,130,620,400,.2),"b",8),
   ...[475,530,590].map((x,i)=>A.p(grid(x,150,1,9,30,30,6,i*9+101).map(([px,py])=>R.circ(px,py,5)).join(""),"#9aa3b2",2)),A.tx("hud",450,425,24,"p"),
   A.tx("kläder i lager",600,440,26,"k"),A.tx("luft mellan lagren",600,470,24,"#7d8ca6")]},
 {say:t3("Kom ihåg: vill man sprida värme använder man metall, stor yta och en fläkt. Vill man stoppa värme använder man luftfickor, vakuum och blanka ytor. Kroppen kyls av vidgade blodkärl och svett, och håller värmen med smala blodkärl, huttring och kläder.",
   "Remember: to spread heat you use metal, a large surface and a fan. To stop heat you use air pockets, vacuum and shiny surfaces. The body cools down with widened blood vessels and sweat, and keeps warm with narrow blood vessels, shivering and clothes.",
   "تذكّر: لنشر الحرارة نستخدم المعدن والسطح الكبير والمروحة، ولإيقافها نستخدم جيوب الهواء والفراغ والأسطح اللامعة. ويبرد الجسم بالأوعية المتّسعة والعرق، ويحتفظ بدفئه بالأوعية الضيّقة والارتجاف والملابس."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["sprida värme: metall, stor yta, fläkt","r"],["stoppa värme: luftfickor, vakuum, blanka ytor","b"],["varm kropp: vidgade blodkärl och svett","o"],["kall kropp: smala blodkärl, huttra, kläder","v"]],70,150,66,31)]},
]};
const picThermos=()=>[...thermos().map(a=>a.d?{...a,d:tfx(a.d,-120,20,1)}:a),A.p(R.arrow(360,260,317,300,-10),"r",5),A.tx("?",375,250,48,"r")];
const picWall=()=>[A.hatch(rectP(60,120,26,300,.2),"o"),A.p(R.rect(60,120,26,300,.2),"o",3),A.hatch(rectP(330,120,26,300,.2),"o"),A.p(R.rect(330,120,26,300,.2),"o",3),air(104,140,8,11,28,93),A.tx("mineralull",208,108,26,"k")];
const BANK7=[
 Q(0,"Varför innehåller isoleringsmaterial mycket luft?","luft leder värme dåligt",["luft är tung","luft leder värme bra","luft är alltid varm"]),
 Q(0,"Vad finns mellan väggarna i en termos?","vakuum",["vatten","is","sand"]),
 Q(0,"Varför svettas vi när det är varmt?","svetten tar värme från huden när den avdunstar",["svetten värmer huden","för att bli av med salt","för att huden ska bli blank"]),
 Q(0,"Vilken kroppstemperatur har en frisk människa ungefär?","37 °C",["30 °C","42 °C","20 °C"]),
 Q(1,"Vad finns där pilen pekar?","vakuum",["varm dryck","luft","kork"],picThermos),
 Q(1,"Vad är det i mineralullen som isolerar?","små luftfickor",["metalltrådar","vatten","sand"],picWall),
 Q(1,"Varför har en kylfläns många tunna flänsar?","det ger en stor yta mot luften",["den blir lättare att bära","den ser snyggare ut","den blir varmare"]),
 Q(1,"Vilket material används ofta i kylflänsar?","aluminium",["trä","ull","frigolit"]),
 Q(1,"Varför har en termos blanka väggar?","de speglar tillbaka värmestrålningen",["de gör termosen tyngre","blank metall är ett vakuum","så att den syns i mörker"]),
 Q(1,"Vad händer med blodkärlen i huden när du fryser?","de drar ihop sig",["de vidgar sig","de fylls med luft","de försvinner"]),
 Q(1,"Varför huttrar man när man fryser?","musklernas rörelser bildar värme",["för att kyla ner kroppen","för att få bort svett","för att blodet ska stanna"]),
 Q(2,"Vilket sätt att sprida värme kan vakuumet i en termos INTE stoppa?","strålning",["ledning","strömning","inget av dem"]),
 Q(2,"Varför går mycket värme ut genom taket i ett dåligt isolerat hus?","varm luft stiger mot taket",["kall luft stiger mot taket","solen värmer taket","taket är tunnare än golvet"]),
 Q(2,"Vad gör den tunna metallbeläggningen på moderna fönster?","reflekterar värmestrålning tillbaka in i rummet",["gör glaset starkare","stänger ute allt ljus","leder värmen ut snabbare"]),
 Q(2,"Varför håller kläder i flera lager värmen bra?","luft fastnar mellan lagren och isolerar",["tyget bildar egen värme","lagren leder bort värmen","tyget reflekterar allt ljus"]),
 Q(2,"Vad kallas det när en fläkt blåser bort varm luft?","påtvingad strömning",["ledning","strålning","isolering"]),
 Wq(1,"Skriv ordet: utrymmet nästan utan partiklar i en termos kallas …",["vakuum","vakuumet"],["Skriv ordet som saknas:","Utrymmet nästan utan partiklar","i en termos kallas …"]),
 Wq(2,"Skriv ordet: när svetten blir till ånga och tar värme från huden säger man att den …",["avdunstar","dunstar","avdunstning"],["Skriv ordet som saknas:","Svetten blir till ånga och tar värme","från huden. Man säger att den …"]),
];
LESSONS.push({id:"f7v7",subject:"science",grades:"7",kind:"wb",year:7,ord:17,
 title:t3("Lär mer: Värmespridning – både bra och dåligt","Learn more: Heat transfer – good and bad","تعلّم المزيد: انتقال الحرارة – مفيد وضارّ"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M40 150V80L100 40L160 80V150Z" fill="none" stroke="#1d2433" stroke-width="4"/><path d="M100 40L84 14M120 50L140 22" stroke="#d63b2f" stroke-width="4"/><path d="M200 30V150Q200 160 210 160H270Q280 160 280 150V30" fill="none" stroke="#7d8ca6" stroke-width="5"/><path d="M212 30V140Q212 148 220 148H260Q268 148 268 140V30" fill="none" stroke="#7d8ca6" stroke-width="5"/><rect x="206" y="16" width="68" height="16" fill="#fde6c8" stroke="#8a5a2b" stroke-width="3"/><rect x="216" y="70" width="48" height="74" fill="#fde6c8"/></svg>`,
 steps:VT7.steps,mount:wbMount(VT7),gen:bankGen(BANK7)});
WORDS.f7v7=["f7v_isolering","f7v_vakuum","f7v_reflektera","f7v_kylflans","f7v_avdunsta","f7v_stromning"];

/* ---------------------------------------------------------------
   8. f7v8 (Lär mer): extreme weather
   --------------------------------------------------------------- */
const rain=(x0,x1,y0,y1,step=22,dur=.9)=>[...Array(Math.floor((x1-x0)/step)+1)].map((_,i)=>A.flow(`M${x0+i*step} ${y0} L${x0+i*step-14} ${y1}`,"b",3,+(dur+(i%3)*.12).toFixed(2),4));
const CRACK="M-120 10 L-90 26 L-70 12 L-40 30 M-20 8 L0 24 L30 14 L50 30 M70 10 L90 28 L120 16";
const gauss=(m,h,s=70)=>x=>400-h*Math.exp(-((x-m)**2)/(2*s*s));
const VT8={steps:[
 {say:t3("Extremväder är väder som är ovanligt kraftigt: värmeböljor, skyfall, stormar och långa perioder av torka. Sådant väder har alltid funnits, men i ett varmare klimat blir flera av dem vanligare och kraftigare. I den här lektionen ska vi se varför.",
   "Extreme weather is unusually strong weather: heatwaves, cloudbursts, storms and long periods of drought. Such weather has always existed, but in a warmer climate several kinds become more common and stronger. In this lesson we will see why.",
   "الطقس المتطرّف طقس شديد على غير العادة: موجات حرّ وأمطار غزيرة مفاجئة وعواصف وفترات جفاف طويلة. هذا الطقس موجود منذ القدم، لكن في مناخ أدفأ يصبح كثير منه أكثر تكرارًا وشدّة، وسنرى في هذا الدرس السبب."),
  draw:()=>[A.wipe(),ttl("Extremväder"),...art("sun",95,220,.55),...thermo(160,160,90,.95,"r"),...art("cloud",310,200,.9),...rain(270,350,240,320,20),
   A.p("M480 300 Q470 240 500 170 M500 170 Q470 150 480 130 M500 170 Q530 150 520 128","g",5),A.p("M430 150 Q470 140 500 150 M420 190 Q460 180 490 190 M440 230 Q470 222 490 230","#7d8ca6",3.5),
   A.hatch("M610 270 L770 270 L770 300 L610 300 Z","o"),A.p(tfx(CRACK,690,270,.6),"k",3),A.p("M690 270 Q686 240 700 220 Q680 216 676 232 M700 220 Q718 214 722 228","o",3.5),
   A.tx("värmebölja",125,350,28,"r"),A.tx("skyfall",310,350,28,"b"),A.tx("storm",480,350,28,"#7d8ca6"),A.tx("torka",690,350,28,"o"),note("vanligare i ett varmare klimat",440,"k",30)]},
 {say:t3("När jorden blir varmare finns det mer energi i atmosfären och haven. Tänk dig alla dagars temperaturer som en kurva. Om hela kurvan flyttas lite åt det varma hållet blir de extremt varma dagarna mycket fler, fast medeltemperaturen bara har ökat lite.",
   "When the Earth gets warmer there is more energy in the atmosphere and the seas. Imagine the temperatures of all days as a curve. If the whole curve moves a little towards the warm side, the extremely hot days become many more, even though the average has only risen a little.",
   "عندما تزداد حرارة الأرض تزداد الطاقة في الغلاف الجوي والبحار. تخيّل درجات حرارة كل الأيام كمنحنى: إذا انزاح المنحنى كلّه قليلًا نحو الحرارة تصبح الأيام شديدة الحرارة أكثر بكثير، رغم أن المتوسّط لم يرتفع إلا قليلًا."),
  draw:()=>{const old=gauss(320,220),nw=gauss(410,220),T=500;return[A.wipe(),ttl("Mer energi – fler extremer"),A.arrow(70,400,740,400,"k"),A.tx("antal dagar",80,120,24,"k","start"),
   A.hatch(fpath(nw,T,720,20)+` L720 400 L${T} 400 Z`,"r"),A.hatch(fpath(old,T,720,20)+` L720 400 L${T} 400 Z`,"b"),A.p(fpath(old,90,640),"b",4.5),A.p(fpath(nw,170,720),"r",4.5),
   A.p(R.dashed(T,400,T,140),"k",2.5),A.tx("extremt varmt",620,150,26,"r"),A.tx("förr",290,160,28,"b"),A.tx("nu",450,160,28,"r"),
   A.tx("kallt",110,430,24,"b"),A.tx("temperatur",400,435,24,"k"),A.tx("varmt",700,430,24,"r"),note("Lite högre medel → många fler heta dagar",480,"k",26)]}},
 {say:t3("SMHI kallar det värmebölja när det är minst 25 °C fem dagar i rad. Värmeböljor är farliga för äldre och sjuka och kan ge torka och skogsbränder. Städer blir extra varma: asfalt och stenhus tar upp mycket solstrålning och avger värmen även på natten.",
   "SMHI calls it a heatwave when it is at least 25 °C five days in a row. Heatwaves are dangerous for old and sick people and can bring drought and forest fires. Cities get extra hot: asphalt and stone buildings absorb a lot of sunlight and give off the heat even at night.",
   "تسمّي هيئة الأرصاد السويدية SMHI الطقس موجة حرّ عندما تبلغ الحرارة 25 °C على الأقل خمسة أيام متتالية. موجات الحرّ خطرة على المسنّين والمرضى، وقد تسبّب الجفاف وحرائق الغابات. وتصبح المدن أشدّ حرارة لأن الإسفلت والمباني الحجرية تمتصّ كثيرًا من أشعة الشمس وتطلق حرارتها حتى في الليل."),
  draw:()=>[A.wipe(),ttl("Värmebölja"),...[27,29,31,30,28].flatMap((t,i)=>{const x=90+i*130;return[box(x,105,100,95,"r"),A.tx("dag "+(i+1),x+50,135,22,"k"),A.tx(t+" °C",x+50,180,30,"r")]}),
   A.tx("minst 25 °C fem dagar i rad",400,248,28,"r"),A.p(R.rect(160,300,110,120,.3)+R.rect(300,280,150,140,.3)+R.rect(480,320,140,100,.3),"k",3.5),
   A.hatch("M100 420 L700 420 L700 442 L100 442 Z","k"),...[[215,300],[375,280],[550,320]].map(([x,t])=>A.flow(`M${x} ${t-6} Q${x-10} ${t-20} ${x} ${t-34}`,"r",2,2,5)),note("asfalt och sten lagrar värme",482,"k",26)]},
 {say:t3("Varm luft kan bära mycket mer vattenånga än kall luft, ungefär 7 % mer för varje grad. När fuktig luft stiger kyls den, och ångan kondenserar till små droppar som bildar moln. Ju mer ånga luften bär, desto mer regn kan falla på en gång.",
   "Warm air can carry much more water vapour than cold air, about 7 % more for every degree. When moist air rises it cools, and the vapour condenses into small drops that form clouds. The more vapour the air carries, the more rain can fall at once.",
   "يستطيع الهواء الدافئ أن يحمل بخار ماء أكثر بكثير من الهواء البارد، بنحو 7 % لكل درجة. وعندما يصعد الهواء الرطب يبرد، فيتكاثف البخار إلى قطرات صغيرة تكوّن الغيوم. وكلّما حمل الهواء بخارًا أكثر أمكن أن يسقط مطر أكثر دفعة واحدة."),
  draw:()=>[A.wipe(),ttl("Varm luft bär mer vattenånga"),box(50,120,150,150,"b"),box(230,120,150,150,"r"),...shake(grid(90,160,2,2,70,70,10,111),4,2,"b",7),...shake(grid(255,145,4,4,33,33,8,117),5,1.6,"b",7),
   A.tx("10 °C",125,305,28,"b"),A.tx("30 °C",305,305,28,"r"),A.tx("max ca 9 g/m³",125,340,22,"k"),A.tx("max ca 30 g/m³",305,340,22,"k"),
   A.p(R.line(420,100,420,470,.3),"#c7cfdc",2),A.flow("M560 430 Q545 360 560 300 Q575 250 560 215","o",5,4,6),...art("cloud",590,165,1.25),...rain(640,700,215,320,20),
   A.tx("← luften stiger",680,395,24,"o"),A.tx("och kyls",690,422,24,"o"),A.tx("ångan kondenserar",650,350,22,"b"),note("ca 7 % mer vattenånga per grad",470,"k",28)]},
 {say:t3("Ett skyfall är ett mycket kraftigt regn. SMHI räknar det som skyfall när det regnar minst 50 mm på en timme. Det är 50 liter vatten på varje kvadratmeter! Marken och avloppen hinner inte ta emot vattnet, så gator och källare kan översvämmas.",
   "A cloudburst is very heavy rain. SMHI counts it as a cloudburst when at least 50 mm of rain falls in one hour. That is 50 litres of water on every square metre! The ground and drains cannot take the water fast enough, so streets and basements can flood.",
   "المطر الغزير المفاجئ مطر شديد جدًّا، وتعدّه SMHI كذلك عندما يهطل 50 مم على الأقل في ساعة واحدة، أي 50 لترًا من الماء على كل متر مربّع! لا تستطيع الأرض ولا المجاري استيعاب الماء بسرعة كافية، فقد تغمر المياه الشوارع والأقبية."),
  draw:()=>[A.wipe(),ttl("Skyfall"),...art("cloud",290,160,1.7),...rain(190,390,215,390,18,.7),A.p(R.line(60,410,500,410,.4),"k",4),A.band(90,392,380,18,"b"),A.tx("översvämning",280,450,26,"b"),
   A.p("M570 170 L570 410 L650 410 L650 170","k",4),A.band(573,290,74,117,"b"),A.p(R.line(573,290,647,290,.2),"b",3),A.p([...Array(11)].map((_,i)=>R.line(650,410-i*24,662,410-i*24,.1)).join(""),"k",2.5),
   A.tx("50 mm",672,298,24,"b","start"),A.tx("100 mm",672,178,22,"k","start"),A.tx("50 mm på en timme",620,450,26,"b"),A.tx("= 50 liter per m²",620,484,24,"k")]},
 {say:t3("Vind är luft som strömmar från högt lufttryck till lågt lufttryck. Stora skillnader i temperatur ger stora skillnader i tryck och därmed hårda vindar. Storm är vind på ungefär 25 m/s eller mer, och orkan 33 m/s eller mer. Tropiska orkaner hämtar sin energi från varmt havsvatten.",
   "Wind is air flowing from high air pressure to low air pressure. Large differences in temperature give large differences in pressure and so strong winds. A storm is wind of about 25 m/s or more, and hurricane force 33 m/s or more. Tropical hurricanes get their energy from warm sea water.",
   "الرياح هواء يتحرّك من الضغط الجوي المرتفع إلى المنخفض. والفروق الكبيرة في الحرارة تسبّب فروقًا كبيرة في الضغط، ومن ثمّ رياحًا شديدة. العاصفة رياح سرعتها نحو 25 م/ث أو أكثر، والإعصار 33 م/ث أو أكثر. وتستمدّ الأعاصير المدارية طاقتها من مياه البحر الدافئة."),
  draw:()=>[A.wipe(),ttl("Storm och orkan"),A.p(R.circ(150,220,60),"b",4),A.tx("H",150,240,56,"b"),A.p(R.circ(650,220,60),"r",4),A.tx("L",650,240,56,"r"),A.tx("högtryck",150,315,26,"b"),A.tx("lågtryck",650,315,26,"r"),
   ...["M220 180 Q400 140 580 180","M220 220 Q400 220 580 220","M220 260 Q400 300 580 260"].map((d,i)=>A.flow(d,"#7d8ca6",6,2.2+i*.2,5)),A.arrow(330,220,470,220,"k"),A.tx("vind",400,205,26,"k"),
   A.tx("storm: från ca 25 m/s ≈ 90 km/h",400,370,28,"o"),A.tx("orkan: från ca 33 m/s ≈ 120 km/h",400,415,28,"r"),note("Tropiska orkaner får energi från varmt hav.",468,"k",26)]},
 {say:t3("Torka betyder att det regnar för lite under lång tid. När det är varmt avdunstar mer vatten från mark, sjöar och växter, så marken torkar ut snabbare. Skördar kan slå fel och risken för skogsbränder ökar. Ett varmare klimat kan alltså ge både mer skyfall och mer torka.",
   "Drought means too little rain over a long time. When it is warm, more water evaporates from soil, lakes and plants, so the ground dries out faster. Harvests can fail and the risk of forest fires rises. So a warmer climate can bring both more cloudbursts and more drought.",
   "الجفاف يعني قلّة المطر لفترة طويلة. وعندما يكون الجوّ حارًّا يتبخّر مزيد من الماء من التربة والبحيرات والنباتات، فتجفّ الأرض أسرع، وقد يفشل الحصاد ويزداد خطر حرائق الغابات. إذن قد يجلب المناخ الأدفأ أمطارًا غزيرة أكثر وجفافًا أكثر في آن واحد."),
  draw:()=>[A.wipe(),ttl("Torka"),...art("sun",120,140,.6),A.hatch("M40 330 L520 330 L520 410 L40 410 Z","o"),A.p(R.line(40,330,520,330,.4),"o",4),A.p(tfx(CRACK,180,340,1)+tfx(CRACK,390,350,.9),"k",3),
   ...[220,320,420].map(x=>wave(x,322,x,220,"b",5,3,3)),A.tx("mer avdunstning",320,200,26,"b"),A.p("M120 330 Q115 290 130 260 Q100 255 96 276 M130 260 Q160 250 164 272","o",4),
   ...art("tall",650,410,.8),...flame(630,300,1),...flame(675,290,.8),A.p(R.line(560,410,760,410,.4),BRN,4),
   A.tx("marken torkar ut",280,450,26,"o"),A.tx("risk för skogsbrand",660,450,26,"r")]},
 {say:t3("Vi behöver både minska utsläppen och anpassa samhället till ett nytt klimat. Städer kan bygga gröna tak och dammar som tar hand om regnvatten, plantera träd som ger skugga och varna invånarna i tid. SMHI varnar när extremväder är på väg.",
   "We need both to cut emissions and to adapt society to a new climate. Cities can build green roofs and ponds that take care of rainwater, plant trees that give shade, and warn people in time. SMHI issues warnings when extreme weather is on its way.",
   "نحتاج إلى تقليل الانبعاثات وإلى تكييف المجتمع مع مناخ جديد معًا. يمكن للمدن أن تبني أسطحًا خضراء وبركًا تستوعب مياه الأمطار، وأن تزرع أشجارًا تعطي الظلّ، وأن تنبّه السكان في الوقت المناسب. وتصدر SMHI تحذيرات عندما يقترب طقس متطرّف."),
  draw:()=>[A.wipe(),ttl("Vi kan anpassa oss"),A.tx("minska utsläppen + anpassa samhället",400,130,30,"g"),A.p(R.line(40,420,760,420,.4),BRN,4),
   box(80,240,140,180,"k"),A.hatch(rectP(76,222,148,18,.2),"g"),A.p(R.rect(76,222,148,18,.2),"g",3.5),...art("bjork",330,420,.9),
   A.hatch("M440 420 Q520 446 600 420 Z","b"),A.p("M440 420 Q520 446 600 420","b",3.5),...rain(470,570,250,400,25,1),
   A.p("M700 300 L740 370 L660 370 Z M700 370 L700 420","r",4),A.tx("!",700,362,34,"r"),
   A.tx("grönt tak",150,462,24,"g"),A.tx("träd: skugga",330,462,24,"g"),A.tx("damm: tar regn",520,462,24,"b"),A.tx("varning",700,462,24,"r")]},
 {say:t3("Kom ihåg: ett varmare klimat ger mer energi i atmosfären. Då blir värmeböljor, skyfall och torka vanligare, och tropiska orkaner kan bli kraftigare. Varm luft bär ungefär 7 % mer vattenånga per grad. Vi måste både minska utsläppen och anpassa samhället.",
   "Remember: a warmer climate gives more energy in the atmosphere. Then heatwaves, cloudbursts and droughts become more common, and tropical hurricanes can get stronger. Warm air carries about 7 % more water vapour per degree. We must both cut emissions and adapt society.",
   "تذكّر: المناخ الأدفأ يعني طاقة أكبر في الغلاف الجوي، فتصبح موجات الحرّ والأمطار الغزيرة والجفاف أكثر تكرارًا، وقد تشتدّ الأعاصير المدارية. والهواء الدافئ يحمل بخار ماء أكثر بنحو 7 % لكل درجة. علينا أن نقلّل الانبعاثات ونكيّف المجتمع معًا."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["värmebölja: minst 25 °C fem dagar i rad","r"],["skyfall: minst 50 mm på en timme","b"],["storm från ca 25 m/s, orkan från ca 33 m/s","#7d8ca6"],["varm luft: ca 7 % mer ånga per grad","b"],["minska utsläppen och anpassa samhället","g"]],60,140,62,30)]},
]};
const picGauge=()=>[A.p("M150 140 L150 400 L250 400 L250 140","k",4),A.band(153,270,94,127,"b"),A.p(R.line(153,270,247,270,.2),"b",3),A.p([...Array(11)].map((_,i)=>R.line(250,400-i*26,262,400-i*26,.1)).join(""),"k",2.5),
  A.tx("50 mm",272,278,24,"b","start"),A.tx("1 timme",200,440,26,"k")];
const picBell=()=>{const g1=x=>400-200*Math.exp(-((x-160)**2)/(2*45*45)),g2=x=>400-200*Math.exp(-((x-215)**2)/(2*45*45)),T=262;
  return[A.arrow(40,400,390,400,"k"),A.hatch(fpath(g2,T,385,12)+` L385 400 L${T} 400 Z`,"r"),A.p(fpath(g1,40,330),"b",4),A.p(fpath(g2,80,385),"r",4),A.p(R.dashed(T,400,T,170),"k",2.5),
   A.tx("förr",140,180,24,"b"),A.tx("nu",240,180,24,"r"),A.tx("temperatur",215,435,22,"k")]};
const BANK8=[
 Q(0,"Vad kallas ett mycket kraftigt regn?","skyfall",["duggregn","dimma","frost"]),
 Q(0,"Vad kallas en lång period med för lite regn?","torka",["skyfall","storm","översvämning"]),
 Q(0,"Vad kallas en period med minst 25 °C flera dagar i rad?","värmebölja",["köldknäpp","storm","skyfall"]),
 Q(0,"Vem varnar för extremväder i Sverige?","SMHI",["Skolverket","Livsmedelsverket","Skatteverket"]),
 Q(1,"Regnmätaren fylldes på en timme. Vad kallas ett sådant regn?","skyfall",["duggregn","snöblandat regn","vanligt regn"],picGauge),
 Q(1,"Hur många dagar i rad med minst 25 °C krävs för att SMHI ska kalla det värmebölja?","5",["1","2","30"]),
 Q(1,"Ungefär hur mycket mer vattenånga kan luften bära för varje grad den blir varmare?","ca 7 %",["ca 50 %","ca 0,1 %","lika mycket"]),
 Q(1,"Åt vilket håll strömmar luften när det blåser?","från högtryck till lågtryck",["från lågtryck till högtryck","alltid från havet","alltid från norr"]),
 Q(1,"Varför blir städer extra varma vid en värmebölja?","asfalt och sten tar upp solvärme och avger den på natten",["städer ligger närmare solen","bilarna kyler luften","det finns mer vind i städer"]),
 Q(1,"Vad händer med vattenångan när fuktig luft stiger och kyls?","den kondenserar till droppar och bildar moln",["den blir till is direkt","den försvinner","den blir varmare"]),
 Q(2,"Vad visar det röda området i bilden?","fler extremt varma dagar nu än förr",["färre varma dagar nu","fler kalla dagar","lika många heta dagar"],picBell),
 Q(2,"Varför kan ett varmare klimat ge både mer torka och mer skyfall?","mer avdunstning torkar marken, och fuktigare luft ger kraftigare regn",["det blir alltid mer moln","havet blir mindre","vindarna slutar blåsa"]),
 Q(2,"Vilken vindstyrka räknas som orkan?","ca 33 m/s eller mer",["5 m/s eller mer","15 m/s eller mer","100 m/s eller mer"]),
 Q(2,"25 m/s är ungefär …","90 km/h",["25 km/h","250 km/h","9 km/h"]),
 Q(2,"50 mm regn betyder att varje kvadratmeter får …","50 liter vatten",["5 liter vatten","500 liter vatten","0,5 liter vatten"]),
 Q(2,"Varifrån hämtar tropiska orkaner sin energi?","från varmt havsvatten",["från kalla glaciärer","från jordens inre","från månen"]),
 Wq(1,"Skriv ordet: en lång period med för lite regn kallas …",["torka","torkan"],["Skriv ordet som saknas:","En lång period med för lite regn","kallas …"]),
 Wq(2,"Skriv ordet: minst 25 °C fem dagar i rad kallas en …",["värmebölja","värmeböljan"],["Skriv ordet som saknas:","Minst 25 °C fem dagar i rad","kallas en …"]),
];
LESSONS.push({id:"f7v8",subject:"science",grades:"7",kind:"wb",year:7,ord:18,
 title:t3("Lär mer: Extremväder","Learn more: Extreme weather","تعلّم المزيد: الطقس المتطرّف"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M70 90Q56 70 80 62Q86 38 114 44Q130 26 152 44Q180 42 178 66Q196 76 178 90Z" fill="#e3e6ec" stroke="#7d8ca6" stroke-width="3"/><path d="M90 104L82 130M116 104L108 130M142 104L134 130M168 104L160 130" stroke="#2257c9" stroke-width="4" stroke-linecap="round"/><circle cx="250" cy="60" r="22" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M210 150H300" stroke="#e07b00" stroke-width="3"/><path d="M220 158L232 166L244 156L258 168L272 158" fill="none" stroke="#1d2433" stroke-width="2"/></svg>`,
 steps:VT8.steps,mount:wbMount(VT8),gen:bankGen(BANK8)});
WORDS.f7v8=["f7v_extremvader","f7v_varmebolja","f7v_skyfall","f7v_kondensera","f7v_storm","f7v_torka"];
}

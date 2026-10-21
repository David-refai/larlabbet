import {KID} from "./no-0art.js";
import {art,bankGen,blist,callout,dotsP,ellP,note,ntag,plant,ringArrows,ringFlow,ringPts,tfx,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,f1,t3,wbMount} from "../../legacy/core.js";
/* ===== fys7-materia.js: Fysik, Year 7, chapter "Materia" (topics as in Titano Fysik, texts our own) =====
   base:     f7m1 naturvetenskapligt arbetssätt · f7m2 vad är materia? · f7m3 tät materia (densitet)
             f7m4 elektrisk laddning · f7m5 hållbar utveckling: ingenting försvinner
   Lär mer:  f7m6 krafter mellan partiklar · f7m7 idéer om materia · f7m8 nanoforskning */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");

/* ---------- shared drawings for the chapter ---------- */
const rnd=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const P2=(x,y)=>f1(x)+" "+f1(y);
const poly=(pts,close=true)=>"M"+pts.map(([x,y])=>P2(x,y)).join("L")+(close?"Z":"");
/* round particles drawn as one stroke and one shading; c = line colour, h = shading key */
const balls=(pts,r,c,h=c,w=3)=>{if(!pts.length)return[];const d=pts.map(([x,y])=>R.circ(x,y,r)).join("");return[A.hatch(d,h),A.p(d,c,w)]};
/* a particle that shakes on its spot (fast or slow), one that wanders a little (liquid), and ones that fly between the walls (gas) */
const shake=(x,y,c,r,k=0,a=3)=>A.flow(`M${f1(x-a)} ${f1(y)}a${a} ${a} 0 1 ${k%2} ${2*a} 0a${a} ${a} 0 1 ${k%2} ${-2*a} 0`,c,1,+(.3+(k%5)*.06).toFixed(2),r);
const solid=(x0,y0,cols,rows,gap,c,r)=>{const o=[];for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)o.push(shake(x0+i*gap,y0+j*gap,c,r,i+j*cols));return o};
const liquid=(pts,c,r,s=1,a0=9)=>pts.map(([x,y],i)=>{const a=a0+rnd(i+s)*a0;const q=[0,1,2,3].map(j=>[x+Math.cos(j*1.57+rnd(i*3+j+s))*a,y+Math.sin(j*1.57+rnd(i*5+j+s))*a*.7]);
  return A.flow(poly(q),c,1,+(2.2+rnd(i*7+s)*1.6).toFixed(1),r)});
const gasP=(x0,y0,x1,y1,s,n=6)=>{const q=[];for(let i=0;i<n;i++){let x=x0+rnd(s*9.1+i*1.7)*(x1-x0),y=y0+rnd(s*3.3+i*5.9)*(y1-y0);const k=(i+Math.floor(rnd(s*2.7)*4))%4;
  if(k===0)y=y0;else if(k===1)x=x1;else if(k===2)y=y1;else x=x0;q.push([x,y])}const r=Math.floor(rnd(s*4.1)*n),p=[...q.slice(r),...q.slice(0,r)];
  let L=0;for(let i=0;i<n;i++){const a=p[i],b=p[(i+1)%n];L+=Math.hypot(b[0]-a[0],b[1]-a[1])}return{d:poly(p),L}};
const gas=(x0,y0,x1,y1,k,c="r",r=11,v=170,seed=1)=>[...Array(k)].map((_,i)=>{const g=gasP(x0+r,y0+r,x1-r,y1-r,seed+i*7);return A.flow(g.d,c,1,+(g.L/v).toFixed(1),r)});
/* molecules: hydrogen blue, oxygen red, carbon black */
const h2o=(x,y,s=1,a=-Math.PI/2)=>{const H=[a-.91,a+.91].map(t=>[x+Math.cos(t)*21*s,y+Math.sin(t)*21*s]);return[...balls(H,10*s,"b"),...balls([[x,y]],16*s,"r")]};
const o2=(x,y,s=1)=>balls([[x-14*s,y],[x+14*s,y]],16*s,"r");
const co2=(x,y,s=1)=>[...balls([[x-29*s,y],[x+29*s,y]],16*s,"r"),...balls([[x,y]],15*s,"k")];
/* glassware, instruments and things */
const beaker=(x,y,w,h,lv=0,c="b")=>{const o=[],wy=y+h*(1-lv);
  if(lv>0)o.push(A.hatch(poly([[x+3,wy],[x+w-3,wy],[x+w-3,y+h-3],[x+3,y+h-3]]),c),A.p(R.line(x+3,wy,x+w-3,wy,.3),c,2.5));
  o.push(A.p(`M${x-10} ${y-4}Q${x} ${y} ${x} ${y+10}L${x} ${y+h}L${x+w} ${y+h}L${x+w} ${y}`,"k",3.5));return o};
const cyl=(x,top,h,w,ml,max=100,c="b",lab=true)=>{const yb=top+h,ly=yb-h*ml/max,o=[];
  if(ml>0)o.push(A.hatch(poly([[x-w/2+3,ly],[x+w/2-3,ly],[x+w/2-3,yb-3],[x-w/2+3,yb-3]]),c),A.p(R.line(x-w/2+3,ly,x+w/2-3,ly,.3),c,2.5));
  let t="";for(let v=10;v<max;v+=10){const ty=yb-h*v/max;t+=`M${x-w/2} ${f1(ty)}L${x-w/2+(v%20?8:14)} ${f1(ty)}`}
  o.push(A.p(`M${x-w/2-8} ${top-6}L${x-w/2} ${top}L${x-w/2} ${yb}L${x+w/2} ${yb}L${x+w/2} ${top}M${x-w/2-14} ${yb+8}L${x+w/2+14} ${yb+8}`,"k",3.5),A.p(t,"k",2));
  if(lab)for(let v=20;v<=max;v+=20)o.push(A.tx(v,x-w/2-6,yb-h*v/max+6,18,"k","end"));return o};
const thermo=(x,y,h,lv,c="r")=>{const yb=y+h;return[A.p(`M${x-9} ${yb-10}L${x-9} ${y+9}Q${x-9} ${y} ${x} ${y}Q${x+9} ${y} ${x+9} ${y+9}L${x+9} ${yb-10}`+R.circ(x,yb+6,16),"k",3.5),
  A.hatch(R.circ(x,yb+6,11),c),A.p(`M${x} ${yb}L${x} ${f1(y+12+(h-12)*(1-lv))}`,c,6)]};
const watch=(x,y,r)=>[A.p(R.circ(x,y,r)+`M${x-9} ${y-r-14}L${x+9} ${y-r-14}M${x} ${y-r-14}L${x} ${y-r}`,"k",3.5),
  A.p([...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return`M${P2(x+Math.cos(a)*r*.78,y+Math.sin(a)*r*.78)}L${P2(x+Math.cos(a)*r*.92,y+Math.sin(a)*r*.92)}`}).join(""),"k",2),A.p(`M${x} ${y}L${f1(x+r*.45)} ${f1(y-r*.55)}`,"r",4)];
const vag=(x,y,txt,w=170)=>[A.p(R.rect(x-w/2,y,w,46,.4),"k",3.5),A.p(R.rect(x-50,y+9,100,28,.3),"k",2.5),A.tx(txt,x,y+31,24,"g")];
const box3=(x,y,w,h,dx,dy,c="o")=>{const f=poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]]);
  return[A.hatch(f,/^#/.test(c)?"k":c),A.p(f+poly([[x,y],[x+dx,y-dy],[x+w+dx,y-dy],[x+w,y]],false)+poly([[x+w+dx,y-dy],[x+w+dx,y+h-dy],[x+w,y+h]],false),c,3.5)]};
const cube=(x,yb,s,c)=>box3(x-s/2-s*.15,yb-s,s,s,s*.3,s*.3,c);
const balloon=(x,y,rx,ry,c="r",sl=100)=>[A.hatch(R.loop(x,y,rx,ry),c),A.p(R.loop(x,y,rx,ry),c,3.5),A.p(`M${x} ${y+ry}l-8 12h16z`+(sl?`M${x} ${y+ry+12}q-12 ${f1(sl*.28)} 4 ${f1(sl*.54)}q12 ${f1(sl*.24)} -4 ${f1(sl*.46)}`:""),"k",2.5)];
const chg=(x,y,r,s)=>{const c=s==="+"?"r":"b";return[A.hatch(R.circ(x,y,r),c),A.p(R.circ(x,y,r),c,3.5),A.tx(s==="+"?"+":"–",x,y+r*.42,r*1.3,c)]};
const sg=(pts,s,z=30)=>pts.map(([x,y])=>A.tx(s==="+"?"+":"–",x,y,z,s==="+"?"r":"b"));
/* an atom: the nucleus (protons red, neutrons grey) and electron shells; sh = [[radius, electrons], ...] */
const nucleus=(x,y,p,n,r=8)=>{const P=[],N=[];for(let i=0;i<p+n;i++){const a=i*2.39996,d=r*1.15*Math.sqrt(i),q=[x+Math.cos(a)*d,y+Math.sin(a)*d];
  ((i%2===0&&P.length<p)||N.length>=n?P:N).push(q)}return{art:[...balls(N,r,"#7d8ca6","k"),...balls(P,r,"r")],P,N}};
const ePts=(x,y,R0,ne,a0=-90)=>[...Array(ne)].map((_,i)=>{const a=(a0+360*i/ne)*Math.PI/180;return[x+Math.cos(a)*R0,y+Math.sin(a)*R0]});
const shellRing=(x,y,R0)=>A.p(R.circ(x,y,R0),"#9fb3d1",2);
const atom=(x,y,p,n,sh,move=true,r=8)=>{const N=nucleus(x,y,p,n,r);return[...sh.map(([R0])=>shellRing(x,y,R0)),...N.art,
  ...sh.flatMap(([R0,ne],i)=>move?[A.flow(`M${x} ${y-R0}a${R0} ${R0} 0 1 1 0 ${2*R0}a${R0} ${R0} 0 1 1 0 ${-2*R0}`,"b",ne,5+i*3,7)]:balls(ePts(x,y,R0,ne,-60+i*25),7,"b"))]};
/* a zigzag spring between two points, a wavy ray with an arrow head */
const spring=(x1,y1,x2,y2,n=8,a=6)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;let d=`M${P2(x1,y1)}`;
  for(let i=1;i<n;i++){const t=i/n,s=i%2?a:-a;d+=`L${P2(x1+dx*t-uy*s,y1+dy*t+ux*s)}`}return d+`L${P2(x2,y2)}`};
const wave=(x1,y1,x2,y2,c="o",amp=8,k=5)=>{const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,N=48;let d="";
  for(let i=0;i<=N;i++){const t=i/N,s=Math.sin(t*k*2*Math.PI)*amp*Math.min(1,(1-t)*6);d+=(i?"L":"M")+P2(x1+dx*t-uy*s,y1+dy*t+ux*s)}
  const a=Math.atan2(dy,dx);d+=`M${P2(x2,y2)}L${P2(x2-14*Math.cos(a-.45),y2-14*Math.sin(a-.45))}M${P2(x2,y2)}L${P2(x2-14*Math.cos(a+.45),y2-14*Math.sin(a+.45))}`;return A.p(d,c,3)};
const stick=(x,y,s=1,c="k")=>A.p(R.circ(x,y,16*s)+`M${x} ${y+16*s}L${x} ${y+70*s}M${x-26*s} ${y+36*s}L${x} ${y+30*s}L${x+26*s} ${y+36*s}M${x} ${y+70*s}L${x-20*s} ${y+110*s}M${x} ${y+70*s}L${x+20*s} ${y+110*s}`,c,3.5);
const can=(x,y,w,h,c="k")=>{const rx=w/2,ry=w*.16;return[A.hatch(poly([[x-rx,y],[x+rx,y],[x+rx,y+h],[x-rx,y+h]]),c),A.p(ellP(x,y,rx,ry)+`M${x-rx} ${y}L${x-rx} ${y+h}Q${x} ${y+h+ry*2} ${x+rx} ${y+h}L${x+rx} ${y}`,"#7d8ca6",3.5)]};
const bin=(x,y,w,h,c)=>A.p(poly([[x-w/2,y],[x+w/2,y],[x+w/2-12,y+h],[x-w/2+12,y+h]])+`M${x-w/2-8} ${y-8}L${x+w/2+8} ${y-8}`,c,4);
const tbl=(x1,x2,y)=>A.p(R.line(x1,y,x2,y,.3),"k",2.5);

/* ===================================================================
   1. f7m1: Naturvetenskapligt arbetssätt
   =================================================================== */
TERM("f7_hypotes",{sv:"hypotes",m:W("hypotes(en|er|erna)?"),d:t3("En gissning om vad som kommer att hända, med en förklaring. Den ska gå att testa.","A guess about what will happen, with a reason. It must be possible to test.","تخمين لما سيحدث مع تفسير له، ويجب أن يكون قابلًا للاختبار."),ex:"Jag tror att sockret löser sig snabbare i varmt vatten.",tr:{en:"hypothesis",ar:"فرضية"}});
TERM("f7_oberoende",{sv:"oberoende variabel",m:W("oberoende variabel(n)?"),d:t3("Det du själv ändrar i en undersökning.","The thing you change yourself in an investigation.","الشيء الذي تغيّره بنفسك في التجربة."),ex:"Vattnets temperatur är den oberoende variabeln.",tr:{en:"independent variable",ar:"المتغيّر المستقل"}});
TERM("f7_beroende",{sv:"beroende variabel",m:W("beroende variabel(n)?"),d:t3("Det du mäter för att se vad som händer.","The thing you measure to see what happens.","الشيء الذي تقيسه لترى ما يحدث."),ex:"Tiden tills sockret är borta är den beroende variabeln.",tr:{en:"dependent variable",ar:"المتغيّر التابع"}});
TERM("f7_slutsats",{sv:"slutsats",m:W("slutsats(en|er|erna)?"),d:t3("Det man kommer fram till efter undersökningen. Den svarar på frågan.","What you find out after the investigation. It answers the question.","ما تتوصّل إليه بعد التجربة، وهو يجيب عن السؤال."),ex:"Slutsats: socker löser sig snabbare i varmt vatten.",tr:{en:"conclusion",ar:"استنتاج"}});
TERM("f7_felkalla",{sv:"felkälla",m:W("felkäll(a|an|or|orna)"),d:t3("Något som kan ha gjort resultatet osäkert eller fel.","Something that may have made the result uncertain or wrong.","شيء قد يجعل النتيجة غير دقيقة أو خاطئة."),ex:"En felkälla: klockan startades för sent.",tr:{en:"source of error",ar:"مصدر خطأ"}});
TERM("f7_medelvarde",{sv:"medelvärde",m:W("medelvärde(t|n|na)?"),d:t3("Summan av mätvärdena delad med antalet mätningar.","The sum of the measurements divided by how many there are.","مجموع القياسات مقسومًا على عددها."),ex:"(62 + 58 + 60) / 3 = 60",tr:{en:"mean, average",ar:"المتوسط"}});

const STEPS1=[["Fråga","b"],["Hypotes","v"],["Planera","o"],["Genomföra","g"],["Resultat","p"],["Slutsats","r"]];
const sugar=(x,y,s=22)=>[A.hatch(poly([[x-s/2,y-s],[x+s/2,y-s],[x+s/2,y],[x-s/2,y]]),"k"),A.p(R.rect(x-s/2,y-s,s,s,.3),"k",2.5)];
const bars1=(x0,yb,vals,labs,cols,k=3.6,bw=80)=>{const o=[A.p(`M${x0} ${yb-260}L${x0} ${yb}L${x0+vals.length*130+40} ${yb}`,"k",3)];
  vals.forEach((v,i)=>{const x=x0+40+i*130,h=v*k,d=poly([[x,yb],[x,yb-h],[x+bw,yb-h],[x+bw,yb]]);o.push(A.hatch(d,cols[i]),A.p(d,cols[i],3.5),A.tx(v+" s",x+bw/2,yb-h-12,28,cols[i]),A.tx(labs[i],x+bw/2,yb+34,26,"k"))});
  o.push(A.tx("tid",x0-12,yb-235,24,"k","end"));return o};
const NV1={steps:[
 {say:t3("Hur vet vi att något i naturen fungerar på ett visst sätt? Forskare ställer frågor, gissar, testar och mäter. Det kallas naturvetenskapligt arbetssätt. I den här lektionen följer vi ett exempel: löser sig socker snabbare i varmt vatten än i kallt?",
   "How do we know that something in nature works in a certain way? Scientists ask questions, guess, test and measure. This is called the scientific method. In this lesson we follow an example: does sugar dissolve faster in warm water than in cold?",
   "كيف نعرف أن شيئًا في الطبيعة يعمل بطريقة معيّنة؟ يطرح العلماء الأسئلة ويخمّنون ويختبرون ويقيسون، وهذا يسمّى المنهج العلمي. في هذا الدرس نتابع مثالًا: هل يذوب السكر في الماء الدافئ أسرع منه في الماء البارد؟"),
  draw:()=>{const P=ringPts(400,285,270,150,6);return[A.wipe(),ttl("Naturvetenskapligt arbetssätt"),...ringArrows(400,285,270,150,6,"k",40),...STEPS1.map(([s,c],i)=>A.tx(s,P[i][0],P[i][1]+10,34,c)),
   ringFlow(400,285,150,70,"o",6,9),A.tx("?",400,315,90,"b")]}},
 {say:t3("Allt börjar med en fråga som går att undersöka. Sedan gör man en hypotes: en gissning om vad som kommer att hända, gärna med en förklaring. Vår hypotes är att sockret löser sig snabbare i varmt vatten, eftersom vattnets partiklar rör sig snabbare där.",
   "Everything starts with a question that can be investigated. Then you make a hypothesis: a guess about what will happen, ideally with a reason. Our hypothesis is that sugar dissolves faster in warm water, because the water particles move faster there.",
   "يبدأ كل شيء بسؤال يمكن البحث فيه. ثم نضع فرضية: تخمينًا لما سيحدث، ويُفضَّل أن يكون معه تفسير. فرضيتنا أن السكر يذوب أسرع في الماء الدافئ، لأن جسيمات الماء تتحرك هناك بسرعة أكبر."),
  draw:()=>[A.wipe(),ttl("Fråga och hypotes"),A.tx("Fråga:",60,140,34,"b","start"),A.tx("Löser sig socker snabbare",60,185,30,"k","start"),A.tx("i varmt vatten?",60,225,30,"k","start"),
   A.tx("Hypotes:",60,295,34,"v","start"),A.tx("Ja, eftersom partiklarna",60,340,30,"k","start"),A.tx("rör sig snabbare där.",60,380,30,"k","start"),
   ...beaker(500,200,100,150,.7,"r"),...sugar(550,345),...thermo(530,140,150,.75,"r"),...beaker(650,200,100,150,.7,"b"),...sugar(700,345),...thermo(680,140,150,.35,"b"),
   A.tx("60 °C",550,395,28,"r"),A.tx("20 °C",700,395,28,"b"),note("En hypotes är en gissning som går att testa.",462,"v",28)]},
 {say:t3("I en undersökning finns variabler. Den oberoende variabeln är det du ändrar, här vattnets temperatur. Den beroende variabeln är det du mäter, här tiden tills sockret är borta. Allt annat ska vara lika: mängden vatten, mängden socker och hur mycket du rör.",
   "An investigation has variables. The independent variable is what you change, here the water temperature. The dependent variable is what you measure, here the time until the sugar is gone. Everything else must stay the same: the amount of water, the amount of sugar and how much you stir.",
   "في التجربة توجد متغيّرات. المتغيّر المستقل هو ما تغيّره، وهنا درجة حرارة الماء. والمتغيّر التابع هو ما تقيسه، وهنا الزمن حتى يختفي السكر. وكل شيء آخر يجب أن يبقى كما هو: كمية الماء وكمية السكر ومقدار التحريك."),
  draw:()=>[A.wipe(),ttl("Variabler"),A.band(40,95,230,350,"o"),A.band(285,95,230,350,"b"),A.band(530,95,230,350,"g"),
   A.tx("Oberoende",155,140,32,"o"),A.tx("det du ändrar",155,176,24,"o"),A.tx("Beroende",400,140,32,"b"),A.tx("det du mäter",400,176,24,"b"),A.tx("Kontrollerade",645,140,32,"g"),A.tx("det som är lika",645,176,24,"g"),
   ...thermo(155,215,120,.7,"r"),A.tx("temperaturen",155,410,28,"k"),...watch(400,290,60),A.tx("tiden",400,410,28,"k"),
   ...blist([["mängd vatten","g"],["mängd socker","g"],["omrörning","g"],["glasets storlek","g"]],560,240,48,24)]},
 {say:t3("En rättvis undersökning ändrar bara en sak åt gången. Om du både värmer vattnet och tar mindre vatten vet du inte vilken ändring som gjorde att sockret löste sig fortare. Därför ska bara temperaturen skilja glasen åt.",
   "A fair test changes only one thing at a time. If you both heat the water and use less water, you cannot tell which change made the sugar dissolve faster. So only the temperature may differ between the glasses.",
   "التجربة العادلة تغيّر شيئًا واحدًا فقط في كل مرة. إذا سخّنت الماء وأخذت كمية أقل منه معًا، فلن تعرف أي تغيير جعل السكر يذوب أسرع. لذلك يجب أن تختلف الكأسان في درجة الحرارة فقط."),
  draw:()=>[A.wipe(),ttl("En rättvis undersökning"),A.band(40,95,350,355,"r"),A.band(410,95,350,355,"g"),A.tx("Inte rättvist",215,140,34,"r"),A.tx("Rättvist",585,140,34,"g"),
   ...beaker(85,210,110,150,.85,"r"),...sugar(140,355),...beaker(235,210,110,150,.3,"b"),...sugar(290,355),A.tx("60 °C, 300 ml",140,395,22,"r"),A.tx("20 °C, 100 ml",290,395,22,"b"),
   ...beaker(455,210,110,150,.6,"r"),...sugar(510,355),...beaker(605,210,110,150,.6,"b"),...sugar(660,355),A.tx("60 °C, 200 ml",510,395,22,"r"),A.tx("20 °C, 200 ml",660,395,22,"b"),
   A.tx("två saker ändras ✗",215,432,28,"r"),A.tx("bara temperaturen ändras ✓",585,432,28,"g"),note("Ändra bara en variabel åt gången.",484,"k",26)]},
 {say:t3("Sedan genomför du försöket och mäter noga. Termometern mäter temperatur i grader Celsius, tidtagaruret tid i sekunder, vågen massa i gram och mätglaset volym i milliliter. Mät flera gånger och räkna ut medelvärdet, så blir resultatet säkrare.",
   "Then you carry out the experiment and measure carefully. The thermometer measures temperature in degrees Celsius, the stopwatch time in seconds, the scale mass in grams and the measuring cylinder volume in millilitres. Measure several times and work out the mean, so the result is more reliable.",
   "ثم تنفّذ التجربة وتقيس بدقة. يقيس المحرار درجة الحرارة بالدرجات المئوية، وساعة الإيقاف الزمن بالثواني، والميزان الكتلة بالغرامات، والمخبار الحجم بالمليلترات. قِس عدة مرات واحسب المتوسط لتصبح النتيجة أدقّ."),
  draw:()=>[A.wipe(),ttl("Mäta"),...thermo(110,120,170,.6,"r"),...watch(300,230,62),...box3(470,262,50,40,14,12,"o"),...vag(500,302,"54 g",160),...cyl(690,120,190,56,60,100,"b"),
   A.tx("termometer",110,385,28,"r"),A.tx("°C",110,420,26),A.tx("tidtagarur",300,385,28,"k"),A.tx("s",300,420,26),A.tx("våg",500,385,28,"g"),A.tx("g",500,420,26),A.tx("mätglas",690,385,28,"b"),A.tx("ml",690,420,26),
   note("Mät flera gånger och räkna ut medelvärdet.",470,"o",28)]},
 {say:t3("Så här blev resultatet. I kallt vatten tog det 62, 58 och 60 sekunder. Medelvärdet är summan delad med antalet: 180 delat med 3 blir 60 sekunder. I varmt vatten blev medelvärdet 21 sekunder. Ett stapeldiagram gör skillnaden lätt att se.",
   "This was the result. In cold water it took 62, 58 and 60 seconds. The mean is the sum divided by the number: 180 divided by 3 is 60 seconds. In warm water the mean was 21 seconds. A bar chart makes the difference easy to see.",
   "هذه هي النتيجة. في الماء البارد استغرق الأمر 62 و58 و60 ثانية. المتوسط هو المجموع مقسومًا على العدد: 180 ÷ 3 = 60 ثانية. وفي الماء الدافئ كان المتوسط 21 ثانية. والمخطط بالأعمدة يجعل الفرق سهل الرؤية."),
  draw:()=>[A.wipe(),ttl("Resultat"),A.tx("försök",70,140,26,"k","start"),A.tx("20 °C",250,140,26,"b"),A.tx("60 °C",350,140,26,"r"),tbl(60,400,152),
   ...[["1","62","21"],["2","58","19"],["3","60","23"]].flatMap(([a,b,c],i)=>[A.tx(a,100,192+i*42,28),A.tx(b,250,192+i*42,28,"b"),A.tx(c,350,192+i*42,28,"r")]),tbl(60,400,286),
   A.tx("medel",70,325,26,"k","start"),A.tx("60",250,325,30,"b"),A.tx("21",350,325,30,"r"),A.hl(205,292,195,46),
   ...bars1(470,390,[60,21],["20 °C","60 °C"],["b","r"]),A.tx("(62 + 58 + 60) / 3 = 60",230,400,26,"b"),note("medelvärde = summan / antalet",470,"k",28)]},
 {say:t3("Nu drar vi en slutsats. Den ska svara på frågan: ja, socker löser sig snabbare i varmt vatten, ungefär tre gånger snabbare. Hypotesen stämde. Om den inte hade stämt hade vi ändå lärt oss något, och kunde pröva en ny hypotes.",
   "Now we draw a conclusion. It must answer the question: yes, sugar dissolves faster in warm water, about three times faster. The hypothesis was right. If it had been wrong we would still have learned something, and could test a new hypothesis.",
   "الآن نستخلص استنتاجًا يجيب عن السؤال: نعم، يذوب السكر أسرع في الماء الدافئ، أسرع بثلاث مرات تقريبًا. لقد صحّت الفرضية. ولو لم تصحّ لتعلّمنا شيئًا مع ذلك، ولأمكننا اختبار فرضية جديدة."),
  draw:()=>[A.wipe(),ttl("Slutsats"),A.tx("Socker löser sig snabbare",400,160,38,"k"),A.tx("i varmt vatten.",400,210,38,"k"),A.tx("60 / 21 ≈ 3   →   ungefär 3 gånger snabbare",400,280,30,"b"),
   A.hl(220,320,360,62),A.tx("Hypotesen stämde ✓",400,365,38,"g"),note("Fel hypotes? Då har du ändå lärt dig något!",450,"v",28)]},
 {say:t3("Till sist tänker vi på felkällor: sådant som kan ha gjort resultatet osäkert. Klockan kanske startades för sent, det är svårt att se exakt när sockret är borta och vattnet kan ha svalnat. Om vi vet om felkällorna kan vi göra försöket bättre nästa gång.",
   "Finally we think about sources of error: things that may have made the result uncertain. The clock may have been started too late, it is hard to see exactly when the sugar is gone, and the water may have cooled. If we know the sources of error, we can make the experiment better next time.",
   "أخيرًا نفكّر في مصادر الخطأ: أشياء قد تجعل النتيجة غير دقيقة. ربما شُغّلت الساعة متأخرة، ومن الصعب أن نرى بالضبط متى يختفي السكر، وربما برد الماء. إذا عرفنا مصادر الخطأ نستطيع تحسين التجربة في المرة القادمة."),
  draw:()=>[A.wipe(),ttl("Felkällor"),A.tx("Felkälla",210,130,34,"r"),A.tx("Bättre nästa gång",590,130,34,"g"),
   ...[["klockan startades för sent","samma person tar tiden"],["svårt att se när det är löst","bestäm vad ”löst” betyder"],["vattnet hann svalna","mät temperaturen hela tiden"]].flatMap(([a,b],i)=>[
    A.tx(a,210,200+i*85,25,"r"),A.arrow(375,192+i*85,420,192+i*85,"k"),A.tx(b,590,200+i*85,25,"g")]),note("Upprepa försöket – då märks slumpfel.",465,"k",28)]},
 {say:t3("Kom ihåg arbetsgången: ställ en fråga, gör en hypotes och planera en rättvis undersökning där bara en variabel ändras. Mät noga och flera gånger, räkna ut medelvärdet, dra en slutsats och fundera på felkällorna.",
   "Remember the steps: ask a question, make a hypothesis and plan a fair test where only one variable changes. Measure carefully and several times, work out the mean, draw a conclusion and think about the sources of error.",
   "تذكّر الخطوات: اطرح سؤالًا، وضع فرضية، وخطّط لتجربة عادلة يتغيّر فيها متغيّر واحد فقط. قِس بدقة وعدة مرات، واحسب المتوسط، واستخلص استنتاجًا، وفكّر في مصادر الخطأ."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["fråga och hypotes","v"],["ändra bara en variabel","o"],["mät flera gånger, räkna medelvärde","b"],["slutsats: svara på frågan","g"],["fundera på felkällor","r"]],80,150,62,32)]},
]};
const PIC1={thermo:()=>[...thermo(200,130,230,.6,"r")],watch:()=>[...watch(200,280,110)],cyl:()=>cyl(200,120,300,80,70,100,"b"),
 bars:()=>[...bars1(80,420,[21,60],["varmt","kallt"],["r","b"],4.4)]};
const BANK1=[
 {lv:0,q:"Vad är en hypotes?",a:"en gissning som går att testa",w:["ett säkert svar","ett mätinstrument","en tabell med resultat"]},
 {lv:0,q:"Vad mäter man med en termometer?",a:"temperatur",w:["massa","tid","volym"]},
 {lv:0,q:"Vilket instrument mäter massa?",a:"en våg",w:["ett mätglas","en termometer","ett tidtagarur"]},
 {lv:0,q:"Vilken enhet används ofta för volymen av en vätska?",a:"milliliter (ml)",w:["gram (g)","sekunder (s)","grader (°C)"]},
 {lv:0,q:"Vad heter mätinstrumentet på bilden?",a:"termometer",w:["våg","mätglas","tidtagarur"],lines:["Vad heter","mätinstrumentet?"],pic:PIC1.thermo},
 {lv:0,q:"Vad mäter man med instrumentet på bilden?",a:"tid",w:["temperatur","massa","volym"],lines:["Vad mäter man","med det här?"],pic:PIC1.watch},
 {lv:1,q:"Vad kallas variabeln som du själv ändrar?",a:"oberoende variabel",w:["beroende variabel","kontrollerad variabel","felkälla"]},
 {lv:1,q:"Vad kallas variabeln som du mäter?",a:"beroende variabel",w:["oberoende variabel","kontrollerad variabel","hypotes"]},
 {lv:1,q:"Elin testar om socker löser sig snabbare i varmt vatten. Vad måste vara lika i båda glasen?",a:"mängden vatten och socker",w:["vattnets temperatur","tiden det tar","resultatet"],lines:["Elin testar socker i varmt","och kallt vatten. Vad måste","vara lika i båda glasen?"]},
 {lv:1,q:"Varför gör man ett försök flera gånger?",a:"för att resultatet ska bli säkrare",w:["för att det ska ta längre tid","för att hypotesen ska stämma","för att slippa mäta"]},
 {lv:1,q:"Mätningarna blev 12 s, 14 s och 13 s. Vad är medelvärdet?",a:"13 s",w:["12 s","14 s","39 s"],lines:["Mätningarna: 12 s, 14 s, 13 s.","Vad är medelvärdet?"]},
 {lv:1,q:"Hur mycket vatten visar mätglaset?",a:"70 ml",w:["7 ml","60 ml","80 ml"],lines:["Hur mycket vatten","visar mätglaset?"],pic:PIC1.cyl},
 {lv:1,q:"Skriv ordet: en gissning som går att testa kallas en …",a:["hypotes","hypotesen"],lines:["Skriv ordet som saknas:","En gissning som går att","testa kallas en …"]},
 {lv:2,q:"Varför ska man bara ändra en variabel åt gången?",a:"då vet man vad som orsakade skillnaden",w:["då går försöket fortare","då blir hypotesen alltid rätt","då behöver man inte mäta"]},
 {lv:2,q:"Vad är en felkälla?",a:"något som kan göra resultatet osäkert",w:["ett felstavat ord i rapporten","en källa med vatten","en hypotes som stämmer"]},
 {lv:2,q:"Resultatet visar att hypotesen var fel. Vad gör man då?",a:"man har ändå lärt sig något och prövar en ny hypotes",w:["man ändrar resultatet","man slänger försöket","man skriver att hypotesen stämde"]},
 {lv:2,q:"Mätningarna blev 20 s, 25 s och 24 s. Vad är medelvärdet?",a:"23 s",w:["24 s","25 s","69 s"],lines:["Mätningarna: 20 s, 25 s, 24 s.","Vad är medelvärdet?"]},
 {lv:2,q:"Felix ändrar både vattnets temperatur och mängden socker. Vad är problemet?",a:"han vet inte vilken ändring som gav resultatet",w:["sockret löser sig inte alls","termometern går sönder","det finns inget problem"],lines:["Felix ändrar både temperatur","och mängd socker.","Vad är problemet?"]},
 {lv:2,q:"Vilken slutsats stämmer med diagrammet?",a:"socker löser sig snabbare i varmt vatten",w:["socker löser sig snabbare i kallt vatten","det går lika fort","socker löser sig inte i vatten"],lines:["Tid tills sockret löst sig.","Vilken slutsats stämmer?"],pic:PIC1.bars},
 {lv:2,q:"Skriv ordet: det man kommer fram till efter försöket kallas en …",a:["slutsats","slutsatsen"],lines:["Skriv ordet som saknas:","Det man kommer fram till","efter försöket kallas en …"]},
];
LESSONS.push({id:"f7m1",subject:"science",grades:"7",kind:"wb",year:7,ord:1,
 title:t3("Naturvetenskapligt arbetssätt","The scientific method","المنهج العلمي"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M60 40V140H140V40" fill="#e6eefc" stroke="#1d2433" stroke-width="4"/><path d="M62 80H138" stroke="#2257c9" stroke-width="3"/><rect x="88" y="118" width="22" height="20" fill="#e3e6ec" stroke="#1d2433" stroke-width="3"/><circle cx="230" cy="96" r="50" fill="#fff" stroke="#1d2433" stroke-width="4"/><path d="M230 96L252 70M222 38H238M230 38V46" stroke="#d63b2f" stroke-width="4"/><text x="160" y="40" font-size="40" fill="#7c3aed" font-family="cursive">?</text></svg>`,
 steps:NV1.steps,mount:wbMount(NV1),gen:bankGen(BANK1)});
WORDS.f7m1=["f7_hypotes","f7_oberoende","f7_beroende","f7_slutsats","f7_felkalla","f7_medelvarde"];

/* ===================================================================
   2. f7m2: Vad är materia?
   =================================================================== */
TERM("f7_materia",{sv:"materia",m:W("materia(n)?"),d:t3("Allt som har massa och tar plats.","Everything that has mass and takes up space.","كل ما له كتلة ويشغل حيّزًا."),ex:"Luft, vatten och sten är materia.",tr:{en:"matter",ar:"مادة"}});
TERM("f7_atom",{sv:"atom",m:W("atom(en|er|erna)?"),d:t3("En mycket liten byggsten som allt är uppbyggt av.","A very tiny building block that everything is made of.","لبنة صغيرة جدًا يتكوّن منها كل شيء."),ex:"En syreatom.",tr:{en:"atom",ar:"ذرّة"}});
TERM("f7_molekyl",{sv:"molekyl",m:W("molekyl(en|er|erna)?"),d:t3("Två eller flera atomer som sitter ihop.","Two or more atoms joined together.","ذرّتان أو أكثر مرتبطتان معًا."),ex:"En vattenmolekyl, H₂O.",tr:{en:"molecule",ar:"جزيء"}});
TERM("f7_grundamne",{sv:"grundämne",m:W("grundämne(t|n|na)?"),d:t3("Ett ämne som bara består av ett slags atomer.","A substance made of only one kind of atom.","مادة تتكوّن من نوع واحد فقط من الذرّات."),ex:"Guld och syre är grundämnen.",tr:{en:"element",ar:"عنصر"}});
TERM("f7_partikel",{sv:"partikel",m:W("partik(el|eln|lar|larna)"),d:t3("En mycket liten del av ett ämne, till exempel en atom eller en molekyl.","A very small piece of a substance, for example an atom or a molecule.","جزء صغير جدًا من مادة، مثل ذرّة أو جزيء."),ex:"Partiklarna i en gas rör sig snabbt.",tr:{en:"particle",ar:"جسيم"}});
TERM("f7_form",{sv:"fast, flytande, gas",m:W("(fast form|flytande|gasform)"),d:t3("De tre former som ett ämne kan ha. Partiklarna rör sig olika i dem.","The three forms a substance can have. The particles move differently in them.","الحالات الثلاث التي يمكن أن تكون عليها المادة، وتتحرك الجسيمات فيها بطرق مختلفة."),ex:"Is, vatten och vattenånga.",tr:{en:"solid, liquid, gas",ar:"صلب، سائل، غاز"}});

/* where particles sit in the three boxes of the states scene */
const LIQ=(x0,yb)=>{const o=[];for(let j=0;j<4;j++)for(let i=0;i<(j%2?4:5);i++)o.push([x0+i*35+(j%2?17.5:0)+rnd(i*3+j)*6,yb-j*33-rnd(i+j*7)*5]);return o};
const stateBox=(k,x,move=true)=>{
  if(k===0){const pts=[];for(let j=0;j<4;j++)for(let i=0;i<5;i++)pts.push([x+42+i*34,214+j*34]);
    return[A.p(R.rect(x,105,220,240,.3),"#c7cfdc",2),...(move?solid(x+42,214,5,4,34,"b",14):balls(pts,14,"b"))]}
  if(k===1){const pts=LIQ(x+38,316);return[...beaker(x+10,135,200,205,0),A.p(R.line(x+12,186,x+208,186,.3),"b",2.5),...(move?liquid(pts,"b",14,2,5):balls(pts,14,"b"))]}
  const pts=[[x+40,140],[x+170,170],[x+90,230],[x+190,290],[x+60,310],[x+130,130],[x+150,250]];
  return[A.p(R.rect(x,105,220,240,.4),"k",3),...(move?gas(x+4,109,x+216,341,7,"b",14,190,3):balls(pts,14,"b"))]};
const STATE=[["Fast form","tätt packade, i ordning","vibrerar på sin plats"],["Flytande form","nära varandra","glider runt varandra"],["Gasform","långt ifrån varandra","flyger fritt och snabbt"]];
const stateCol=k=>{const x=[40,290,540][k],cx=x+110;return[...stateBox(k,x),A.tx(STATE[k][0],cx,385,34,"b"),A.tx(STATE[k][1],cx,420,23,"k"),A.tx(STATE[k][2],cx,452,23,"k")]};
const magnify=(x,y,r,cx,cy)=>A.p(R.circ(x,y,r)+R.line(cx,cy,x-r*.6,y-r*.8,.3)+R.line(cx,cy,x-r*.6,y+r*.8,.3),"k",3);
const VM2={steps:[
 {say:t3("Allt omkring dig är materia: stenen, vattnet och till och med luften. Materia är allt som har massa och tar plats. Ljus och ljud är inte materia. De har ingen massa, utan är energi som sprids.",
   "Everything around you is matter: the stone, the water and even the air. Matter is everything that has mass and takes up space. Light and sound are not matter. They have no mass; they are energy that spreads out.",
   "كل ما حولك مادة: الحجر والماء وحتى الهواء. المادة هي كل ما له كتلة ويشغل حيّزًا. أما الضوء والصوت فليسا مادة، فليس لهما كتلة، بل هما طاقة تنتشر."),
  draw:()=>[A.wipe(),ttl("Vad är materia?"),A.band(30,95,450,320,"g"),A.band(500,95,270,320,"r"),A.tx("materia",255,145,38,"g"),A.tx("inte materia",635,145,38,"r"),
   ...art("stone",110,330,.9),...art("drop",245,330,1.1),...balloon(390,230,44,54,"b",46),ntag("sten",110,385),ntag("vatten",245,385),ntag("luft",390,385),
   ...art("sun",575,270,.55),A.tx("♪ ♫",705,290,60,"v"),ntag("ljus",575,385),ntag("ljud",705,385),note("Materia har massa och tar plats.",465,"k",30)]},
 {say:t3("All materia är byggd av pyttesmå partiklar som kallas atomer. Om vi kunde förstora en vattendroppe miljontals gånger skulle vi se vattenmolekyler. En atom är så liten att tio miljoner atomer i rad bara blir ungefär en millimeter.",
   "All matter is built of tiny particles called atoms. If we could magnify a water drop millions of times we would see water molecules. An atom is so small that ten million atoms in a row make only about one millimetre.",
   "كل مادة مبنية من جسيمات صغيرة جدًا تسمّى الذرّات. لو استطعنا تكبير قطرة ماء ملايين المرّات لرأينا جزيئات الماء. والذرّة صغيرة إلى حدّ أن عشرة ملايين ذرّة في صف واحد لا يتجاوز طولها نحو مليمتر واحد."),
  draw:()=>[A.wipe(),ttl("Allt består av små partiklar"),...art("drop",160,345,2.2),magnify(540,285,150,175,290),A.p(R.circ(175,290,6),"k",3),
   ...[[470,220,0],[560,205,1.2],[630,260,2.4],[500,300,.6],[590,330,3.6],[470,380,2],[640,340,5],[550,395,1]].flatMap(([x,y,a])=>h2o(x,y,1,a)),
   ntag("en vattendroppe",160,410,"b"),A.tx("vattenmolekyler",540,470,28,"r"),A.tx("10 000 000 atomer ≈ 1 mm",160,465,24,"k")]},
 {say:t3("Det finns ungefär 118 olika slags atomer. Ett ämne som bara består av ett slags atomer kallas ett grundämne. Väte, kol, syre, järn och guld är grundämnen. Varje grundämne har en kemisk beteckning med en eller två bokstäver.",
   "There are about 118 different kinds of atoms. A substance made of only one kind of atom is called an element. Hydrogen, carbon, oxygen, iron and gold are elements. Each element has a chemical symbol of one or two letters.",
   "يوجد نحو 118 نوعًا مختلفًا من الذرّات. والمادة التي تتكوّن من نوع واحد فقط من الذرّات تسمّى عنصرًا. الهيدروجين والكربون والأكسجين والحديد والذهب عناصر، ولكل عنصر رمز كيميائي من حرف أو حرفين."),
  draw:()=>[A.wipe(),ttl("Grundämnen"),...[["H","väte","b"],["C","kol","k"],["O","syre","r"],["Fe","järn","v"],["Au","guld","o"]].flatMap(([s,n,c],i)=>{const x=90+i*155;
    return[A.p(R.rect(x-60,120,120,150,.4),c,3.5),A.tx(s,x,205,60,c),A.tx(n,x,250,28,c),...balls([[x-17,330],[x+17,330],[x-17,364],[x+17,364]],15,c)]}),
   note("Ett grundämne har bara ett slags atomer.",465,"k",30)]},
 {say:t3("Atomer kan sitta ihop i grupper som kallas molekyler. En vattenmolekyl, H₂O, har två väteatomer och en syreatom. Syret vi andas är O₂, två syreatomer. Koldioxid, CO₂, har en kolatom och två syreatomer.",
   "Atoms can join together in groups called molecules. A water molecule, H₂O, has two hydrogen atoms and one oxygen atom. The oxygen we breathe is O₂, two oxygen atoms. Carbon dioxide, CO₂, has one carbon atom and two oxygen atoms.",
   "يمكن أن ترتبط الذرّات معًا في مجموعات تسمّى الجزيئات. جزيء الماء H₂O فيه ذرّتا هيدروجين وذرّة أكسجين. والأكسجين الذي نتنفّسه هو O₂، أي ذرّتا أكسجين. وثاني أكسيد الكربون CO₂ فيه ذرّة كربون وذرّتا أكسجين."),
  draw:()=>[A.wipe(),ttl("Molekyler"),...h2o(150,250,1.8),...o2(400,240,1.8),...co2(650,240,1.6),
   A.tx("vatten",150,340,32,"k"),A.tx("syrgas",400,340,32,"k"),A.tx("koldioxid",650,340,32,"k"),A.tx("H₂O",150,390,36,"b"),A.tx("O₂",400,390,36,"r"),A.tx("CO₂",650,390,36,"k"),
   ...balls([[230,455]],10,"b"),A.tx("väte",248,463,26,"b","start"),...balls([[370,455]],10,"r"),A.tx("syre",388,463,26,"r","start"),...balls([[510,455]],10,"k"),A.tx("kol",528,463,26,"k","start")]},
 {say:t3("Materia kan vara i fast form, flytande form eller gasform. I ett fast ämne, till exempel is, sitter partiklarna tätt och i ordning. De håller i varandra och kan bara vibrera på sin plats. Därför behåller ett fast ämne sin form.",
   "Matter can be solid, liquid or gas. In a solid, for example ice, the particles sit close together and in order. They hold on to each other and can only vibrate in place. That is why a solid keeps its shape.",
   "يمكن أن تكون المادة صلبة أو سائلة أو غازية. في المادة الصلبة، مثل الجليد، تتقارب الجسيمات وتصطفّ بانتظام، وتتماسك ولا تستطيع إلا أن تهتزّ في مكانها. لذلك تحتفظ المادة الصلبة بشكلها."),
  draw:()=>[A.wipe(),ttl("Fast, flytande, gas"),...stateCol(0)]},
 {say:t3("I en vätska, till exempel vatten, är partiklarna fortfarande nära varandra men de sitter inte fast. De glider runt varandra. Därför kan en vätska rinna och får samma form som kärlet, men volymen är densamma.",
   "In a liquid, for example water, the particles are still close together but not fixed. They slide around each other. That is why a liquid can flow and takes the shape of its container, but its volume stays the same.",
   "في السائل، مثل الماء، تبقى الجسيمات متقاربة لكنها ليست ثابتة، بل تنزلق حول بعضها. لذلك يستطيع السائل أن يسيل ويأخذ شكل الإناء، لكن حجمه يبقى كما هو."),
  draw:()=>stateCol(1)},
 {say:t3("I en gas, till exempel vattenånga, är partiklarna långt ifrån varandra. De flyger snabbt åt alla håll och studsar mot varandra och mot väggarna. Mellan partiklarna finns ingenting, bara tomrum. Därför kan man trycka ihop en gas.",
   "In a gas, for example steam, the particles are far apart. They fly quickly in all directions and bounce off each other and the walls. Between the particles there is nothing, just empty space. That is why a gas can be squeezed.",
   "في الغاز، مثل بخار الماء، تتباعد الجسيمات كثيرًا، وتطير بسرعة في كل الاتجاهات وترتدّ عن بعضها وعن الجدران. وبين الجسيمات لا يوجد شيء، فقط فراغ. لذلك يمكن ضغط الغاز."),
  draw:()=>stateCol(2)},
 {say:t3("Temperaturen visar hur snabbt partiklarna rör sig. När du värmer is vibrerar molekylerna allt mer, tills de släpper och isen smälter. Värmer du mer blir vattnet till ånga. Det är samma H₂O-molekyler hela tiden, bara rörelsen ändras.",
   "Temperature shows how fast the particles move. When you heat ice the molecules vibrate more and more, until they let go and the ice melts. Heat more and the water becomes steam. They are the same H₂O molecules all the time; only the movement changes.",
   "درجة الحرارة تدلّ على سرعة حركة الجسيمات. عندما تسخّن الجليد تهتزّ الجزيئات أكثر فأكثر حتى تنفلت فيذوب الجليد. وإذا سخّنت أكثر يصبح الماء بخارًا. إنها جزيئات H₂O نفسها طوال الوقت، وتتغيّر حركتها فقط."),
  draw:()=>[A.wipe(),ttl("Värme ger snabbare partiklar"),...[140,400,660].map(x=>A.p(R.circ(x,240,95),"k",3)),
   ...solid(100,200,3,3,40,"b",13),...liquid([[105,265],[145,268],[185,262],[120,232],[165,230],[140,200]].map(([x,y])=>[x+260,y]),"b",13,5,7),
   ...gas(600,180,720,300,5,"b",13,230,9),A.arrow(245,240,290,240,"o"),A.arrow(505,240,550,240,"o"),A.tx("värme",268,215,24,"o"),A.tx("värme",528,215,24,"o"),
   A.tx("is",140,375,32,"b"),A.tx("vatten",400,375,32,"b"),A.tx("vattenånga",660,375,32,"b"),A.tx("långsamt",140,410,24),A.tx("snabbare",400,410,24),A.tx("snabbast",660,410,24),
   note("Samma molekyler – bara rörelsen ändras.",468,"r",28)]},
 {say:t3("Kom ihåg: materia har massa och tar plats. Allt är byggt av atomer, och atomer kan bilda molekyler. Ett grundämne har bara ett slags atomer. I fast form, flytande form och gasform rör sig partiklarna på olika sätt.",
   "Remember: matter has mass and takes up space. Everything is built of atoms, and atoms can form molecules. An element has only one kind of atom. In solids, liquids and gases the particles move in different ways.",
   "تذكّر: المادة لها كتلة وتشغل حيّزًا. كل شيء مبني من ذرّات، والذرّات تكوّن جزيئات. والعنصر فيه نوع واحد فقط من الذرّات. وفي الحالة الصلبة والسائلة والغازية تتحرك الجسيمات بطرق مختلفة."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["materia har massa och tar plats","k"],["allt är byggt av atomer","r"],["atomer kan bilda molekyler","b"],["grundämne: ett slags atomer","v"],["fast, flytande, gas: olika rörelse","g"]],60,150,62,30),
   ...h2o(670,300,2)]},
]};
const PIC2={st:k=>()=>{const x=90;return stateBox(k,x,false)},co2:()=>co2(210,280,2.2),h2o:()=>h2o(210,290,2.6)};
const SF=["fast form","flytande form","gasform","ingen form"];
const BANK2=[
 {lv:0,q:"Vad är materia?",a:"allt som har massa och tar plats",w:["bara sådant som är fast","bara sådant som lever","allt som lyser"]},
 {lv:0,q:"Vilket av dessa är INTE materia?",a:"ljus",w:["luft","vatten","sten"]},
 {lv:0,q:"Vad kallas de små byggstenarna som allt är gjort av?",a:"atomer",w:["celler","korn","droppar"],lines:["Vad kallas de små byggstenarna","som allt är gjort av?"]},
 {lv:0,q:"Vilka tre former kan materia ha?",a:"fast, flytande och gas",w:["varm, kall och ljum","stor, liten och mellan","tung, lätt och tom"]},
 {lv:0,q:"Vilken form visar bilden?",a:SF[0],w:SF.filter((_,i)=>i!==0),lines:["Vilken form","visar bilden?"],pic:PIC2.st(0)},
 {lv:0,q:"Vilken form visar bilden?",a:SF[2],w:SF.filter((_,i)=>i!==2),lines:["Vilken form","visar bilden?"],pic:PIC2.st(2)},
 {lv:1,q:"Vilken form visar bilden?",a:SF[1],w:SF.filter((_,i)=>i!==1),lines:["Vilken form","visar bilden?"],pic:PIC2.st(1)},
 {lv:1,q:"Vad är en molekyl?",a:"två eller flera atomer som sitter ihop",w:["en enda atom","en sorts cell","en blandning av sand och vatten"]},
 {lv:1,q:"Vilka atomer finns i en vattenmolekyl, H₂O?",a:"två väteatomer och en syreatom",w:["en väteatom och två syreatomer","två kolatomer och en syreatom","bara syreatomer"]},
 {lv:1,q:"Vad är ett grundämne?",a:"ett ämne med bara ett slags atomer",w:["ett ämne med många slags atomer","ett ämne som finns i jorden","en blandning av gaser"]},
 {lv:1,q:"Hur rör sig partiklarna i ett fast ämne?",a:"de vibrerar på sin plats",w:["de flyger fritt åt alla håll","de står helt stilla","de glider runt varandra"]},
 {lv:1,q:"Vilket av dessa är ett grundämne?",a:"guld",w:["vatten","koldioxid","salt"]},
 {lv:1,q:"Vilken molekyl visar bilden?",a:"koldioxid, CO₂",w:["vatten, H₂O","syrgas, O₂","väte, H₂"],lines:["Kol är svart, syre är rött.","Vilken molekyl är det?"],pic:PIC2.co2},
 {lv:1,q:"Skriv ordet: atomer som sitter ihop bildar en …",a:["molekyl","molekylen"],lines:["Skriv ordet som saknas:","Atomer som sitter ihop","bildar en …"]},
 {lv:2,q:"Vad händer med partiklarna när ett ämne värms upp?",a:"de rör sig snabbare",w:["de blir större","de blir fler","de slutar röra sig"]},
 {lv:2,q:"Is smälter till vatten. Vad ändras?",a:"hur fritt molekylerna rör sig",w:["vilka atomer molekylerna består av","antalet molekyler","molekylernas storlek"]},
 {lv:2,q:"Varför kan man trycka ihop en gas men knappt en vätska?",a:"i en gas är det stora tomrum mellan partiklarna",w:["gasens partiklar är mjuka","vätskans partiklar är större","gasen har ingen massa"],lines:["Varför kan man trycka ihop","en gas men knappt en vätska?"]},
 {lv:2,q:"Vad finns mellan partiklarna i en gas?",a:"ingenting, bara tomrum",w:["luft","vatten","mindre atomer"]},
 {lv:2,q:"Ungefär hur många atomer i rad behövs för att det ska bli 1 mm?",a:"tio miljoner",w:["tio","tusen","hundra"],lines:["Ungefär hur många atomer i rad","blir 1 mm?"]},
 {lv:2,q:"Hur många atomer finns i molekylen på bilden?",a:"3",w:["1","2","4"],lines:["Hur många atomer","har molekylen?"],pic:PIC2.h2o},
 {lv:2,q:"Skriv ordet: ett ämne med bara ett slags atomer kallas ett …",a:["grundämne","grundämnet"],lines:["Skriv ordet som saknas:","Ett ämne med bara ett slags","atomer kallas ett …"]},
];
LESSONS.push({id:"f7m2",subject:"science",grades:"7",kind:"wb",year:7,ord:2,
 title:t3("Vad är materia?","What is matter?","ما هي المادة؟"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="20" y="40" width="80" height="100" fill="none" stroke="#c7cfdc" stroke-width="3"/>${[0,1,2].map(j=>[0,1,2].map(i=>`<circle cx="${38+i*22}" cy="${80+j*22}" r="9" fill="#e6eefc" stroke="#2257c9" stroke-width="3"/>`).join("")).join("")}<path d="M120 50V140H200V50" fill="none" stroke="#1d2433" stroke-width="3"/>${[[136,128],[158,126],[180,128],[146,108],[170,106]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#e6eefc" stroke="#2257c9" stroke-width="3"/>`).join("")}<rect x="220" y="40" width="80" height="100" fill="none" stroke="#1d2433" stroke-width="3"/>${[[240,60],[285,80],[250,120],[280,130]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="#e6eefc" stroke="#2257c9" stroke-width="3"/>`).join("")}</svg>`,
 steps:VM2.steps,mount:wbMount(VM2),gen:bankGen(BANK2)});
WORDS.f7m2=["f7_materia","f7_atom","f7_molekyl","f7_grundamne","f7_partikel","f7_form"];

/* ===================================================================
   3. f7m3: Tät materia (densitet)
   =================================================================== */
TERM("f7_densitet",{sv:"densitet",m:W("densitet(en|er)?"),d:t3("Hur mycket massa ett ämne har per volym. Densitet = massa / volym.","How much mass a substance has per volume. Density = mass / volume.","مقدار كتلة المادة في وحدة الحجم. الكثافة = الكتلة ÷ الحجم."),ex:"Vatten har densiteten 1 g/cm³.",tr:{en:"density",ar:"كثافة"}});
TERM("f7_massa",{sv:"massa",m:W("massa(n)?"),d:t3("Hur mycket materia något innehåller. Mäts i gram eller kilogram.","How much matter something contains. Measured in grams or kilograms.","مقدار المادة في الشيء، وتقاس بالغرام أو الكيلوغرام."),ex:"Stenen har massan 81 g.",tr:{en:"mass",ar:"كتلة"}});
TERM("f7_volym",{sv:"volym",m:W("volym(en|er)?"),d:t3("Hur mycket plats något tar. Mäts till exempel i cm³ eller ml.","How much space something takes up. Measured for example in cm³ or ml.","مقدار الحيّز الذي يشغله الشيء، ويقاس مثلًا بالسنتيمتر المكعب أو المليلتر."),ex:"1 cm³ = 1 ml",tr:{en:"volume",ar:"حجم"}});
TERM("f7_kubikcm",{sv:"kubikcentimeter",m:W("(kubikcentimeter|cm³)"),d:t3("Volymen av en kub som är 1 cm på varje sida. Lika mycket som 1 ml.","The volume of a cube that is 1 cm on each side. The same as 1 ml.","حجم مكعب طول ضلعه 1 سم، ويساوي 1 مل."),ex:"10 cm · 5 cm · 4 cm = 200 cm³",tr:{en:"cubic centimetre",ar:"سنتيمتر مكعب"}});
TERM("f7_flyta",{sv:"flyta / sjunka",m:W("(flyter|flyta|sjunker|sjunka)"),d:t3("Ett föremål flyter om dess densitet är lägre än vätskans, annars sjunker det.","An object floats if its density is lower than the liquid's; otherwise it sinks.","يطفو الجسم إذا كانت كثافته أقل من كثافة السائل، وإلا فإنه يغوص."),ex:"Is flyter, järn sjunker.",tr:{en:"float / sink",ar:"يطفو / يغوص"}});

const feather=(x,y,L,ang,w=11)=>{const ux=Math.cos(ang),uy=Math.sin(ang),px=-uy,py=ux,P=(t,s)=>P2(x+ux*L*t+px*s,y+uy*L*t+py*s);
  return`M${P(0,0)}Q${P(.5,w*1.7)} ${P(1,0)}Q${P(.5,-w*1.7)} ${P(.12,0)}M${P(-.12,0)}L${P(1,0)}`};
const FEATH=[[530,265,110,-.25],[560,250,100,-.9],[600,262,105,-2.2],[640,268,90,-2.9],[575,215,95,-.5],[620,220,90,-2.5],[590,190,80,-1.4]];
const stone=(x,y,s=1)=>{const d=`M${P2(x-30*s,y)}Q${P2(x-36*s,y-22*s)} ${P2(x-12*s,y-28*s)}Q${P2(x+14*s,y-36*s)} ${P2(x+28*s,y-18*s)}Q${P2(x+38*s,y-2*s)} ${P2(x+20*s,y+2*s)}Z`;return[A.hatch(d,"k"),A.p(d,"#5b6475",3)]};
const LAYER=[["olja","g","0,92"],["vatten","b","1,0"],["honung","o","1,4"]];
const tower=(x,y,w,h,lab=true)=>{const o=[],lh=(h-30)/3;LAYER.forEach(([n,c,r],i)=>{const y0=y+30+i*lh;o.push(A.hatch(poly([[x+3,y0],[x+w-3,y0],[x+w-3,y0+lh-3],[x+3,y0+lh-3]]),c),A.p(R.line(x+3,y0,x+w-3,y0,.3),c,2.5));
  if(lab)o.push(A.tx(`${n} ${r}`,x+w+18,y0+lh/2+9,26,c,"start"))});o.push(...beaker(x,y,w,h,0));return o};
const ship=(x,y,s=1)=>{const h=poly([[x-130*s,y-40*s],[x+130*s,y-40*s],[x+100*s,y+30*s],[x-100*s,y+30*s]]);
  return[A.hatch(h,"k"),A.p(h,"#5b6475",4),A.p(R.rect(x-60*s,y-90*s,90*s,50*s,.3)+R.line(x+50*s,y-40*s,x+50*s,y-110*s,.3),"#5b6475",3.5)]};
const VM3={steps:[
 {say:t3("Vad väger mest, ett kilo järn eller ett kilo fjädrar? De väger lika mycket! Men järnet tar mycket mindre plats. Vi säger att järn är tätare än fjädrar, eller att järn har högre densitet.",
   "Which weighs more, a kilo of iron or a kilo of feathers? They weigh the same! But the iron takes up much less space. We say that iron is denser than feathers, or that iron has a higher density.",
   "أيّهما أثقل: كيلوغرام من الحديد أم كيلوغرام من الريش؟ وزنهما متساوٍ! لكن الحديد يشغل حيّزًا أصغر بكثير. نقول إن الحديد أكثف من الريش، أي إن كثافته أعلى."),
  draw:()=>[A.wipe(),ttl("Ett kilo järn eller ett kilo fjädrar?"),A.p("M160 300 L640 300","k",5),A.p("M400 300 L368 362 L432 362 Z M320 362 L480 362","k",4),
   A.p("M200 300 L200 272 M130 272 L270 272 M600 300 L600 272 M520 272 L680 272","k",4),...box3(176,232,40,40,12,10,"k"),
   A.p(FEATH.map(f=>feather(...f)).join(""),"#7d8ca6",3),A.tx("1 kg järn",200,410,32,"k"),A.tx("1 kg fjädrar",600,410,32,"#5b6475"),note("Lika tunga – men järnet tar mycket mindre plats.",468,"b",28)]},
 {say:t3("Här är tre kuber som är exakt lika stora, 1 cm³ var. Ändå väger de olika mycket: trä 0,5 g, aluminium 2,7 g och järn 7,9 g. Det beror på att atomerna väger olika mycket och sitter olika tätt.",
   "Here are three cubes that are exactly the same size, 1 cm³ each. Yet they weigh different amounts: wood 0.5 g, aluminium 2.7 g and iron 7.9 g. That is because the atoms have different masses and are packed differently tightly.",
   "هذه ثلاثة مكعبات متساوية الحجم تمامًا، حجم كل منها 1 سم³. ومع ذلك تختلف أوزانها: الخشب 0.5 غ، والألومنيوم 2.7 غ، والحديد 7.9 غ. والسبب أن الذرّات تختلف في كتلتها وفي مدى تراصّها."),
  draw:()=>[A.wipe(),ttl("Samma volym – olika massa"),...cube(150,300,80,"o"),...cube(400,300,80,"#9aa3b2"),...cube(650,300,80,"k"),
   ...vag(150,300,"0,5 g"),...vag(400,300,"2,7 g"),...vag(650,300,"7,9 g"),A.tx("trä",150,395,32,"o"),A.tx("aluminium",400,395,32,"#5b6475"),A.tx("järn",650,395,32,"k"),
   note("Varje kub är 1 cm³ – men massan skiljer.",465,"b",28)]},
 {say:t3("Densitet är massa delad med volym. Man skriver ρ = m / V, där ρ är den grekiska bokstaven rå. Massan mäts i gram och volymen i kubikcentimeter, så densiteten får enheten g/cm³. Kom ihåg att 1 cm³ är lika mycket som 1 ml.",
   "Density is mass divided by volume. We write ρ = m / V, where ρ is the Greek letter rho. Mass is measured in grams and volume in cubic centimetres, so density has the unit g/cm³. Remember that 1 cm³ is the same as 1 ml.",
   "الكثافة هي الكتلة مقسومة على الحجم. نكتب ρ = m / V، حيث ρ هو الحرف اليوناني رو. تقاس الكتلة بالغرام والحجم بالسنتيمتر المكعب، فتكون وحدة الكثافة غ/سم³. وتذكّر أن 1 سم³ يساوي 1 مل."),
  draw:()=>[A.wipe(),ttl("Densitet"),A.tx("densitet = massa / volym",60,150,38,"k","start"),A.tx("ρ = m / V",60,240,60,"b","start"),
   A.tx("m = massa i gram (g)",60,310,28,"k","start"),A.tx("V = volym i cm³",60,355,28,"k","start"),A.tx("ρ = densitet i g/cm³",60,400,28,"b","start"),
   A.p("M620 120 L740 340 L500 340 Z M545 255 L695 255 M620 255 L620 340","v",3.5),A.tx("m",620,232,48,"v"),A.tx("ρ",572,318,44,"v"),A.tx("V",668,318,44,"v"),
   A.tx("täck det du söker",620,385,24,"v"),note("1 cm³ = 1 ml",465,"o",32)]},
 {say:t3("Exempel: en träkloss är 10 cm lång, 5 cm bred och 4 cm hög. Volymen är 10 · 5 · 4 = 200 cm³. Vågen visar 100 g. Densiteten blir 100 / 200 = 0,5 g/cm³. Det är mindre än vattnets 1 g/cm³.",
   "Example: a wooden block is 10 cm long, 5 cm wide and 4 cm high. The volume is 10 · 5 · 4 = 200 cm³. The scale shows 100 g. The density is 100 / 200 = 0.5 g/cm³. That is less than water's 1 g/cm³.",
   "مثال: قطعة خشب طولها 10 سم وعرضها 5 سم وارتفاعها 4 سم. حجمها 10 · 5 · 4 = 200 سم³. ويُظهر الميزان 100 غ. فتكون الكثافة 100 ÷ 200 = 0.5 غ/سم³، وهي أقل من كثافة الماء 1 غ/سم³."),
  draw:()=>[A.wipe(),ttl("Räkna: en träkloss"),...box3(60,210,220,88,70,52,"o"),A.tx("10 cm",170,335,26,"o"),A.tx("4 cm",50,262,26,"o","end"),A.tx("5 cm",88,175,26,"o","end"),
   ...vag(185,370,"100 g",200),A.tx("V = 10 · 5 · 4 = 200 cm³",420,170,32,"k","start"),A.tx("m = 100 g",420,230,32,"k","start"),A.tx("ρ = m / V = 100 / 200",420,290,32,"k","start"),
   A.hl(410,325,300,62),A.tx("ρ = 0,5 g/cm³",420,370,38,"g","start"),note("lägre än vattnets 1 g/cm³",465,"b",28)]},
 {say:t3("Hur mäter man volymen av en sten, som inte har raka sidor? Sänk ner den i ett mätglas med vatten. Vattnet stiger från 50 ml till 80 ml, så stenen har volymen 30 cm³. Den väger 81 g. Densiteten blir 81 / 30 = 2,7 g/cm³.",
   "How do you measure the volume of a stone that has no straight sides? Lower it into a measuring cylinder with water. The water rises from 50 ml to 80 ml, so the stone has a volume of 30 cm³. It weighs 81 g. The density is 81 / 30 = 2.7 g/cm³.",
   "كيف نقيس حجم حجر ليست له جوانب مستقيمة؟ ننزله في مخبار فيه ماء. يرتفع الماء من 50 مل إلى 80 مل، فحجم الحجر 30 سم³. وكتلته 81 غ، فتكون كثافته 81 ÷ 30 = 2.7 غ/سم³."),
  draw:()=>[A.wipe(),ttl("Räkna: en sten"),...cyl(120,110,280,70,50,100,"b"),...cyl(300,110,280,70,80,100,"b"),...stone(300,382,.9),A.arrow(170,250,240,250,"k"),A.tx("+ sten",200,290,22),
   A.tx("50 ml",120,445,28,"b"),A.tx("80 ml",300,445,28,"b"),A.tx("V = 80 − 50 = 30 cm³",420,170,32,"k","start"),A.tx("m = 81 g",420,230,32,"k","start"),A.tx("ρ = 81 / 30",420,290,32,"k","start"),
   A.hl(410,325,300,62),A.tx("ρ = 2,7 g/cm³",420,370,38,"g","start")]},
 {say:t3("Här är densiteten för några ämnen i g/cm³. Luft är väldigt lätt, guld väldigt tätt. Vatten har 1,0. Allt med lägre densitet än vatten flyter i vatten, och allt med högre densitet sjunker.",
   "Here is the density of some substances in g/cm³. Air is very light, gold very dense. Water has 1.0. Everything with a lower density than water floats in water, and everything with a higher density sinks.",
   "هذه كثافة بعض المواد بوحدة غ/سم³. الهواء خفيف جدًا والذهب كثيف جدًا، وكثافة الماء 1.0. كل ما كثافته أقل من الماء يطفو عليه، وكل ما كثافته أعلى يغوص فيه."),
  draw:()=>{const T=[["luft","0,0012"],["frigolit","0,03"],["trä (gran)","0,5"],["is","0,92"],["vatten","1,0"],["aluminium","2,7"],["järn","7,9"],["bly","11,3"],["guld","19,3"]];
   return[A.wipe(),ttl("Densitet i g/cm³"),A.hl(90,256,360,36),...T.flatMap(([n,v],i)=>[A.tx(n,110,130+i*38,28,i===4?"b":"k","start"),A.tx(v,430,130+i*38,28,i===4?"b":"k","end")]),
    A.p("M470 108 L485 108 L485 236 L470 236","g",3),A.tx("flyter i vatten",500,180,30,"g","start"),A.p("M470 290 L485 290 L485 440 L470 440","r",3),A.tx("sjunker i vatten",500,372,30,"r","start")]}},
 {say:t3("Ett föremål flyter om dess densitet är lägre än vätskans, och sjunker om den är högre. Trä flyter högt. Is har 0,92 och flyter, men nästan nio tiondelar ligger under ytan. Stenen har 2,7 och sjunker till botten.",
   "An object floats if its density is lower than the liquid's, and sinks if it is higher. Wood floats high. Ice has 0.92 and floats, but almost nine tenths of it is below the surface. The stone has 2.7 and sinks to the bottom.",
   "يطفو الجسم إذا كانت كثافته أقل من كثافة السائل، ويغوص إذا كانت أعلى. الخشب يطفو عاليًا. والجليد كثافته 0.92 فيطفو، لكن نحو تسعة أعشاره تحت السطح. أما الحجر فكثافته 2.7 فيغوص إلى القاع."),
  draw:()=>[A.wipe(),ttl("Flyta eller sjunka?"),...beaker(110,150,580,270,.74,"b"),...box3(180,200,90,40,0,0,"o"),...box3(375,212,60,60,0,0,"#9aa3b2"),...stone(590,416,1.3),
   A.tx("trä 0,5",225,180,28,"o"),A.tx("is 0,92",405,180,28,"#5b6475"),A.tx("sten 2,7",590,345,28,"k"),note("lägre densitet än vätskan → flyter",470,"g",28)]},
 {say:t3("Vätskor med olika densitet lägger sig i lager: honung underst, sedan vatten och olja överst. Ett fartyg är byggt av stål, som har densiteten 7,9. Ändå flyter det, eftersom skrovet är fullt av luft. Fartyget har lägre medeldensitet än vattnet.",
   "Liquids with different densities form layers: honey at the bottom, then water and oil at the top. A ship is built of steel, which has a density of 7.9. Still it floats, because the hull is full of air. The ship has a lower average density than the water.",
   "السوائل المختلفة الكثافة تترتّب في طبقات: العسل في الأسفل ثم الماء ثم الزيت في الأعلى. والسفينة مصنوعة من الفولاذ وكثافته 7.9، ومع ذلك تطفو لأن هيكلها مملوء بالهواء، فتكون كثافتها المتوسطة أقل من كثافة الماء."),
  draw:()=>[A.wipe(),ttl("Lager och fartyg"),...tower(90,130,140,300),A.band(440,300,330,140,"b"),A.p("M440 300 Q520 290 600 300 Q680 310 770 300","b",3),...ship(605,290,1),
   A.tx("luft",585,276,24,"k"),A.tx("stål 7,9 + luft",605,160,28,"k"),A.tx("medeldensitet < 1 g/cm³",605,475,26,"g")]},
 {say:t3("Kom ihåg: densitet är massa delad med volym, ρ = m / V, och mäts ofta i g/cm³. Vatten har densiteten 1 g/cm³. Ett föremål med lägre densitet än vätskan flyter, med högre densitet sjunker det.",
   "Remember: density is mass divided by volume, ρ = m / V, and is often measured in g/cm³. Water has a density of 1 g/cm³. An object with a lower density than the liquid floats; with a higher density it sinks.",
   "تذكّر: الكثافة هي الكتلة مقسومة على الحجم، ρ = m / V، وتقاس غالبًا بوحدة غ/سم³. كثافة الماء 1 غ/سم³. والجسم الأقل كثافة من السائل يطفو، والأعلى كثافة يغوص."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["densitet = massa / volym","k"],["ρ = m / V, i g/cm³","b"],["1 cm³ = 1 ml","o"],["vatten: 1 g/cm³","b"],["lägre densitet → flyter","g"],["högre densitet → sjunker","r"]],80,145,58,32)]},
]};
const PIC3={float:()=>[...beaker(80,170,260,240,.6,"b"),...box3(160,248,90,50,0,0,"o")],
 cube:()=>[...cube(200,300,120,"#9aa3b2"),A.tx("m = 54 g",200,370,34,"k"),A.tx("V = 20 cm³",200,415,34,"k")],
 cyl:()=>[...cyl(130,120,300,70,40,100,"b"),...cyl(290,120,300,70,55,100,"b"),...stone(290,402,.8),A.tx("före",130,470,26),A.tx("efter",290,470,26)],
 tower:()=>{const o=[],x=130,y=130,w=150,lh=90;["A","B","C"].forEach((n,i)=>{const y0=y+30+i*lh,c=["g","b","o"][i];o.push(A.hatch(poly([[x+3,y0],[x+w-3,y0],[x+w-3,y0+lh-3],[x+3,y0+lh-3]]),c),A.p(R.line(x+3,y0,x+w-3,y0,.3),c,2.5),A.tx(n,x+w+30,y0+lh/2+12,36,c))});return[...o,...beaker(x,y,w,300,0)]}};
const BANK3=[
 {lv:0,q:"Vad väger mest: 1 kg järn eller 1 kg fjädrar?",a:"de väger lika mycket",w:["järnet","fjädrarna","det går inte att veta"]},
 {lv:0,q:"Hur räknar man ut densitet?",a:"massa delat med volym",w:["volym delat med massa","massa gånger volym","massa plus volym"]},
 {lv:0,q:"Vilken enhet kan man använda för densitet?",a:"g/cm³",w:["cm³","gram","km/h"]},
 {lv:0,q:"Vilken densitet har vatten ungefär?",a:"1 g/cm³",w:["10 g/cm³","0,1 g/cm³","100 g/cm³"]},
 {lv:0,q:"Ett föremål har högre densitet än vatten. Vad händer i vatten?",a:"det sjunker",w:["det flyter","det svävar i luften","det löses upp"],lines:["Ett föremål har högre densitet","än vatten. Vad händer i vatten?"]},
 {lv:0,q:"Vad säger bilden om klossens densitet?",a:"den är lägre än vattnets",w:["den är högre än vattnets","den är lika med järnets","den är noll"],lines:["Klossen flyter.","Vad säger det om","klossens densitet?"],pic:PIC3.float},
 {lv:1,q:"En kloss har massan 60 g och volymen 20 cm³. Vilken densitet har den?",a:"3 g/cm³",w:["1 200 g/cm³","40 g/cm³","0,33 g/cm³"],lines:["m = 60 g, V = 20 cm³.","Vilken densitet?"]},
 {lv:1,q:"En metallbit väger 158 g och har volymen 20 cm³. Vilken densitet har den?",a:"7,9 g/cm³",w:["3 160 g/cm³","138 g/cm³","0,79 g/cm³"],lines:["m = 158 g, V = 20 cm³.","Vilken densitet?"]},
 {lv:1,q:"Vilken densitet har klossen på bilden?",a:"2,7 g/cm³",w:["1 080 g/cm³","34 g/cm³","0,37 g/cm³"],lines:["Vilken densitet","har klossen?"],pic:PIC3.cube},
 {lv:1,q:"Is har densiteten 0,92 g/cm³. Vad händer med is i vatten?",a:"den flyter",w:["den sjunker","den svävar mitt i vattnet","den blir tyngre"],lines:["Is har densiteten 0,92 g/cm³.","Vad händer med is i vatten?"]},
 {lv:1,q:"Vad är 1 cm³ lika mycket som?",a:"1 ml",w:["1 liter","1 dl","1 m³"]},
 {lv:1,q:"Hur stor volym har stenen?",a:"15 cm³",w:["55 cm³","40 cm³","95 cm³"],lines:["Vattnet steg när stenen","sänktes ner. Hur stor","volym har stenen?"],pic:PIC3.cyl},
 {lv:1,q:"Skriv ordet: massa delat med volym kallas …",a:["densitet","densiteten"],lines:["Skriv ordet som saknas:","Massa delat med volym","kallas …"]},
 {lv:2,q:"En sten väger 75 g. Vattnet i mätglaset stiger från 40 ml till 70 ml. Vilken densitet har stenen?",a:"2,5 g/cm³",w:["1,9 g/cm³","1,07 g/cm³","5 g/cm³"],lines:["Stenen väger 75 g. Vattnet","stiger från 40 ml till 70 ml.","Vilken densitet har stenen?"]},
 {lv:2,q:"En guldring har volymen 2 cm³. Guld har densiteten 19,3 g/cm³. Vad väger ringen?",a:"38,6 g",w:["9,65 g","21,3 g","17,3 g"],lines:["Ringen: V = 2 cm³.","Guld: ρ = 19,3 g/cm³.","Vad väger ringen?"]},
 {lv:2,q:"Aluminium har densiteten 2,7 g/cm³. Vilken volym har 270 g aluminium?",a:"100 cm³",w:["729 cm³","10 cm³","1 000 cm³"],lines:["Aluminium: ρ = 2,7 g/cm³.","Vilken volym har 270 g?"]},
 {lv:2,q:"Varför flyter ett fartyg av stål?",a:"det är fullt av luft, så medeldensiteten är lägre än vattnets",w:["stål har lägre densitet än vatten","havsvatten är tätare än stål","fartyget är för stort för att sjunka"]},
 {lv:2,q:"Olja (0,92 g/cm³) och vatten (1,0 g/cm³) hälls i ett glas. Vad händer?",a:"oljan lägger sig överst",w:["vattnet lägger sig överst","de blandas helt","oljan sjunker till botten"],lines:["Olja (0,92 g/cm³) och vatten","(1,0 g/cm³) i ett glas.","Vad händer?"]},
 {lv:2,q:"Vilken vätska har högst densitet?",a:"C, den understa",w:["A, den översta","B, den i mitten","alla har samma"],lines:["Tre vätskor i lager.","Vilken har högst densitet?"],pic:PIC3.tower},
 {lv:2,q:"Skriv ordet: ett föremål med lägre densitet än vattnet …",a:["flyter","flyter det","det flyter"],lines:["Skriv ordet som saknas:","Ett föremål med lägre densitet","än vattnet …"]},
];
LESSONS.push({id:"f7m3",subject:"science",grades:"7",kind:"wb",year:7,ord:3,
 title:t3("Tät materia","Dense matter","المادة الكثيفة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M40 40V150H190V40" fill="none" stroke="#1d2433" stroke-width="4"/><path d="M42 80H188V148H42Z" fill="#e6eefc"/><path d="M42 80H188" stroke="#2257c9" stroke-width="3"/><rect x="70" y="62" width="44" height="28" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M130 146Q126 128 146 124Q166 120 170 140Z" fill="#9aa3b2" stroke="#1d2433" stroke-width="3"/><text x="220" y="105" font-size="36" fill="#2257c9" font-family="cursive">ρ=m/V</text></svg>`,
 steps:VM3.steps,mount:wbMount(VM3),gen:bankGen(BANK3)});
WORDS.f7m3=["f7_densitet","f7_massa","f7_volym","f7_kubikcm","f7_flyta"];

/* ===================================================================
   4. f7m4: Elektrisk laddning
   =================================================================== */
TERM("f7_proton",{sv:"proton",m:W("proton(en|er|erna)?"),d:t3("En positivt laddad partikel i atomkärnan.","A positively charged particle in the nucleus.","جسيم موجب الشحنة في نواة الذرّة."),ex:"Kolatomen har 6 protoner.",tr:{en:"proton",ar:"بروتون"}});
TERM("f7_elektron",{sv:"elektron",m:W("elektron(en|er|erna)?"),d:t3("En negativt laddad partikel som rör sig runt atomkärnan.","A negatively charged particle that moves around the nucleus.","جسيم سالب الشحنة يتحرك حول نواة الذرّة."),ex:"Elektroner kan flytta sig mellan föremål.",tr:{en:"electron",ar:"إلكترون"}});
TERM("f7_neutron",{sv:"neutron",m:W("neutron(en|er|erna)?"),d:t3("En partikel utan laddning i atomkärnan.","A particle with no charge in the nucleus.","جسيم بلا شحنة في نواة الذرّة."),ex:"Neutronen är oladdad.",tr:{en:"neutron",ar:"نيوترون"}});
TERM("f7_karna",{sv:"atomkärna",m:W("(atom)?kärn(a|an|or|orna)"),d:t3("Atomens mitt, där protonerna och neutronerna sitter.","The centre of the atom, where the protons and neutrons are.","مركز الذرّة، وفيه البروتونات والنيوترونات."),ex:"Kärnan är mycket liten.",tr:{en:"nucleus",ar:"نواة"}});
TERM("f7_laddning",{sv:"laddning",m:W("laddning(en|ar|arna)?"),d:t3("En egenskap som gör att saker drar till sig eller stöter bort varandra. Den kan vara positiv eller negativ.","A property that makes things attract or repel each other. It can be positive or negative.","خاصية تجعل الأشياء تتجاذب أو تتنافر، وقد تكون موجبة أو سالبة."),ex:"Elektronen har negativ laddning.",tr:{en:"charge",ar:"شحنة"}});
TERM("f7_statisk",{sv:"statisk elektricitet",m:W("statisk(a)? elektricitet(en)?"),d:t3("Laddning som samlas på ett föremål, till exempel när man gnider två saker mot varandra.","Charge that builds up on an object, for example when two things are rubbed together.","شحنة تتجمّع على جسم، مثلًا عند دلك شيئين ببعضهما."),ex:"Håret reser sig av statisk elektricitet.",tr:{en:"static electricity",ar:"الكهرباء الساكنة"}});
TERM("f7_urladdning",{sv:"urladdning",m:W("urladdning(en|ar)?"),d:t3("När laddningar plötsligt jämnas ut, ofta med en gnista.","When charges suddenly even out, often with a spark.","عندما تتعادل الشحنات فجأة، غالبًا مع شرارة."),ex:"Blixten är en jättestor urladdning.",tr:{en:"discharge",ar:"تفريغ كهربائي"}});

const head=(x,y,r=62,up=false)=>{const hair=up?[...Array(9)].map((_,i)=>{const a=(-160+i*17.5)*Math.PI/180;return`M${P2(x+Math.cos(a)*r*.95,y+Math.sin(a)*r*.95)}Q${P2(x+Math.cos(a+.15)*r*1.5,y+Math.sin(a+.15)*r*1.5)} ${P2(x+Math.cos(a)*r*1.9,y+Math.sin(a)*r*1.9)}`}).join("")
   :`M${x-r} ${y-6}Q${x-r*.9} ${y-r*1.25} ${x} ${y-r*1.12}Q${x+r*.9} ${y-r*1.25} ${x+r} ${y-6}M${x-r*.7} ${y-r*.7}Q${x-r*.2} ${y-r*.5} ${x} ${y-r*.9}Q${x+r*.3} ${y-r*.5} ${x+r*.7} ${y-r*.7}`;
  return[A.p(R.circ(x,y,r),"k",3.5),A.p(hair,"#8a5a2b",3.5),A.p(`M${x-22} ${y-8}l.1 0M${x+22} ${y-8}l.1 0`,"k",8),A.p(`M${x-18} ${y+22}Q${x} ${y+34} ${x+18} ${y+22}`,"k",3)]};
const CLOUD="M150 222 Q110 205 135 172 Q122 122 186 124 Q205 82 268 96 Q310 58 372 84 Q424 58 472 90 Q532 74 552 120 Q622 112 632 164 Q672 192 628 222 Z";
const BOLT="M385 224 L356 292 L398 300 L362 372 L408 380 L382 440";
const VM4={steps:[
 {say:t3("Varje atom har en kärna i mitten. I kärnan finns protoner, som är positivt laddade, och neutroner, som saknar laddning. Runt kärnan rör sig elektroner, som är negativt laddade. Här är en kolatom med 6 protoner, 6 neutroner och 6 elektroner.",
   "Every atom has a nucleus in the middle. The nucleus contains protons, which are positively charged, and neutrons, which have no charge. Around the nucleus move electrons, which are negatively charged. Here is a carbon atom with 6 protons, 6 neutrons and 6 electrons.",
   "لكل ذرّة نواة في وسطها. في النواة بروتونات موجبة الشحنة ونيوترونات بلا شحنة، وحول النواة تتحرك إلكترونات سالبة الشحنة. هذه ذرّة كربون فيها 6 بروتونات و6 نيوترونات و6 إلكترونات."),
  draw:()=>{const N=nucleus(230,280,6,6,9);return[A.wipe(),ttl("Atomen"),...atom(230,280,6,6,[[78,2],[150,4]],true,9),
   ...callout(N.P[0],470,160,"proton  +","r",30),...callout(N.N[1],470,235,"neutron  0","#5b6475",30),...callout([380,280],470,320,"elektron  –","b",30),...callout([248,312],470,405,"kärna","k",30)]}},
 {say:t3("En atom har lika många protoner som elektroner. Kolatomen har 6 plus och 6 minus. Laddningarna tar ut varandra, så hela atomen är neutral, alltså oladdad. Det gäller nästan alla saker omkring oss.",
   "An atom has as many protons as electrons. The carbon atom has 6 plus and 6 minus. The charges cancel out, so the whole atom is neutral, that is, uncharged. That is true for almost everything around us.",
   "في الذرّة عدد البروتونات يساوي عدد الإلكترونات. ذرّة الكربون فيها 6 موجبة و6 سالبة، فتلغي الشحنات بعضها، وتكون الذرّة كلها متعادلة أي غير مشحونة. وهذا ينطبق على معظم الأشياء من حولنا."),
  draw:()=>[A.wipe(),ttl("Lika många + och –"),...atom(170,280,6,6,[[50,2],[100,4]],true,7),...sg([0,1,2,3,4,5].map(i=>[340+i*42,200]),"+",48),...sg([0,1,2,3,4,5].map(i=>[340+i*42,290]),"–",48),
   A.tx("6 protoner",620,195,28,"r","start"),A.tx("6 elektroner",620,285,28,"b","start"),A.tx("+6 − 6 = 0",470,380,44,"k"),A.tx("atomen är neutral",470,430,30,"g")]},
 {say:t3("Elektronerna längst ut sitter inte så hårt fast. När du gnider en ballong mot håret flyttar sig elektroner från håret till ballongen. Ballongen får för många elektroner och blir negativt laddad. Håret får för få och blir positivt laddat.",
   "The outermost electrons are not held very tightly. When you rub a balloon against your hair, electrons move from the hair to the balloon. The balloon gets too many electrons and becomes negatively charged. The hair gets too few and becomes positively charged.",
   "الإلكترونات الخارجية ليست مرتبطة بقوة. عندما تدلك بالونًا بشعرك تنتقل إلكترونات من الشعر إلى البالون، فيصير في البالون فائض من الإلكترونات ويصبح سالب الشحنة، ويصير في الشعر نقص فيصبح موجب الشحنة."),
  draw:()=>[A.wipe(),ttl("Gnid en ballong mot håret"),...head(200,290,70),...balloon(540,230,90,110,"o",36),...sg([[150,200],[200,190],[250,200],[175,215],[228,215]],"+",34),
   ...sg([[500,200],[560,190],[520,250],[580,245],[540,300],[600,295],[490,290]],"–",36),A.flow("M270 225 Q380 170 460 220","b",5,2.4,6),A.tx("elektroner",370,165,24,"b"),
   A.tx("hår: förlorar elektroner → +",200,440,24,"r"),A.tx("ballong: får elektroner → −",560,440,24,"b")]},
 {say:t3("Laddningar påverkar varandra utan att röra vid varandra. Två saker med lika laddning, plus och plus eller minus och minus, stöter bort varandra. Två saker med olika laddning, plus och minus, dras till varandra.",
   "Charges affect each other without touching. Two things with the same charge, plus and plus or minus and minus, repel each other. Two things with different charges, plus and minus, attract each other.",
   "تؤثّر الشحنات في بعضها دون أن تتلامس. الشيئان المتشابهان في الشحنة، موجب وموجب أو سالب وسالب، يتنافران. والشيئان المختلفان في الشحنة، موجب وسالب، يتجاذبان."),
  draw:()=>[A.wipe(),ttl("Stöta bort eller dra till sig"),...chg(150,150,34,"+"),...chg(290,150,34,"+"),A.arrow(108,150,58,150,"k"),A.arrow(332,150,382,150,"k"),A.tx("stöter bort varandra",430,160,30,"r","start"),
   ...chg(150,265,34,"–"),...chg(290,265,34,"–"),A.arrow(108,265,58,265,"k"),A.arrow(332,265,382,265,"k"),A.tx("stöter bort varandra",430,275,30,"r","start"),
   ...chg(110,380,34,"+"),...chg(330,380,34,"–"),A.arrow(152,380,200,380,"k"),A.arrow(288,380,240,380,"k"),A.tx("dras till varandra",430,390,30,"g","start"),
   note("Lika laddningar stöter bort – olika dras till varandra.",470,"k",28)]},
 {say:t3("Nu kan vi förklara två saker. Håret reser sig, eftersom alla hårstrån har fått samma laddning och stöter bort varandra. Ballongen fastnar på väggen: den negativa ballongen knuffar bort elektroner i väggen, så att väggens yta närmast blir positiv.",
   "Now we can explain two things. The hair stands up, because all the hairs have the same charge and push each other away. The balloon sticks to the wall: the negative balloon pushes electrons in the wall away, so the wall's surface nearest it becomes positive.",
   "الآن نستطيع تفسير أمرين. يقف الشعر لأن كل الشعرات اكتسبت الشحنة نفسها فتتنافر. ويلتصق البالون بالحائط لأن البالون السالب يدفع الإلكترونات في الحائط بعيدًا، فيصبح سطح الحائط الأقرب إليه موجبًا."),
  draw:()=>[A.wipe(),ttl("Håret och väggen"),...head(200,290,62,true),...sg([[100,200],[150,160],[205,150],[260,162],[305,200]],"+",28),A.p(R.line(400,110,400,420,.3),"#c7cfdc",2),
   A.hatch(poly([[690,110],[760,110],[760,420],[690,420]]),"k"),A.p(R.line(690,110,690,420,.3),"k",3),...balloon(600,240,80,95,"o",40),...sg([[570,210],[620,220],[580,270],[630,290]],"–",34),
   ...sg([[705,215],[705,260],[705,305]],"+",30),...sg([[742,240],[742,290]],"–",28),A.tx("håren stöter bort varandra",200,440,24,"k"),A.tx("ballongen fastnar",600,440,24,"k")]},
 {say:t3("Om du går med strumpor på en matta kan du samla på dig extra elektroner. När du sedan tar i ett dörrhandtag hoppar elektronerna över till handtaget. Det blir en liten gnista och du känner en stöt. Det kallas en urladdning av statisk elektricitet.",
   "If you walk in socks on a carpet, you can collect extra electrons. When you then touch a door handle, the electrons jump across to the handle. There is a small spark and you feel a shock. This is called a discharge of static electricity.",
   "إذا مشيت بجوارب على سجادة فقد تجمع إلكترونات زائدة. وعندما تلمس مقبض الباب تقفز الإلكترونات إليه، فتظهر شرارة صغيرة وتشعر بصدمة. ويسمّى هذا تفريغًا للكهرباء الساكنة."),
  draw:()=>[A.wipe(),ttl("En stöt från dörrhandtaget"),A.p(R.rect(570,90,170,350,.4),"#8a5a2b",4),A.p("M585 282 L640 282 Q652 282 652 294 Q652 306 640 306 L600 306","k",5),
   A.p("M60 300 L430 288 Q470 286 498 292 Q506 298 498 304 L440 312 L60 345","k",3.5),...sg([[120,330],[200,326],[280,322],[360,318]],"–",30),
   A.p("M505 296 L522 284 L536 304 L552 286 L566 302 L583 292","o",4.5),A.flow("M300 312 L505 298 L583 294","b",5,1.6,6),A.tx("gnista!",545,250,30,"o"),
   A.tx("extra elektroner från mattan",60,410,26,"b","start"),note("urladdning: elektronerna hoppar över",468,"k",28)]},
 {say:t3("Åska är statisk elektricitet i jättestorlek. I ett åskmoln krockar iskristaller och hagel, och laddningar skiljs åt. Molnets botten blir ofta negativ. När skillnaden blir för stor slår en blixt ner, en jättegnista som kan bli ungefär 30 000 °C.",
   "Thunder and lightning are static electricity on a giant scale. In a thundercloud ice crystals and hail collide and charges separate. The bottom of the cloud often becomes negative. When the difference gets too big a lightning bolt strikes, a giant spark that can reach about 30,000 °C.",
   "البرق والرعد كهرباء ساكنة بحجم هائل. في سحابة العاصفة تتصادم بلّورات الجليد والبَرَد فتنفصل الشحنات، ويصبح أسفل السحابة غالبًا سالبًا. وعندما يكبر الفرق كثيرًا يضرب البرق، وهو شرارة عملاقة قد تبلغ نحو 30 ألف درجة مئوية."),
  draw:()=>[A.wipe(),A.hatch(CLOUD,"k"),A.p(CLOUD,"#5b6475",4),...sg([[250,140],[330,128],[410,128],[490,140]],"+",34),...sg([[200,212],[270,214],[480,214],[560,212]],"–",40),
   A.p(R.line(60,440,740,440,.4),"#8a5a2b",4),...sg([[230,478],[330,478],[450,478],[550,478]],"+",30),A.p(BOLT,"o",7),
   A.flow(BOLT,"b",4,1.2,6),A.tx("ca 30 000 °C",660,330,28,"o"),A.tx("åskmoln",690,140,30,"#5b6475")]},
 {say:t3("Blixten hettar upp luften så snabbt att den utvidgar sig med en smäll: det är åskmullret. Ljuset når dig nästan direkt, men ljudet går bara ungefär 1 km på 3 sekunder. Räkna sekunderna mellan blixt och muller och dela med 3, så får du avståndet i km.",
   "The lightning heats the air so fast that it expands with a bang: that is the thunder. The light reaches you almost at once, but the sound only travels about 1 km in 3 seconds. Count the seconds between the flash and the thunder and divide by 3 to get the distance in km.",
   "يسخّن البرق الهواء بسرعة كبيرة فيتمدّد بانفجار، وهذا هو الرعد. يصلك الضوء فورًا تقريبًا، أما الصوت فيقطع نحو 1 كم في 3 ثوانٍ. عُدّ الثواني بين البرق والرعد واقسم على 3، فتحصل على المسافة بالكيلومترات."),
  draw:()=>[A.wipe(),ttl("Hur långt bort är åskan?"),A.hatch(tfx(CLOUD,30,90,.4),"k"),A.p(tfx(CLOUD,30,90,.4),"#5b6475",3),A.p(tfx(BOLT,30,90,.4)+"M183 266 L172 400","o",4),
   A.p(R.line(60,400,760,400,.4),"#8a5a2b",4),stick(680,275,1),A.arrow(250,170,640,250,"o"),A.tx("ljus: nästan direkt",450,180,26,"o"),wave(250,300,640,300,"b",7,9),A.tx("ljud: 1 km på 3 s",450,345,26,"b"),
   A.tx("9 s / 3 = 3 km",400,460,40,"g")]},
 {say:t3("Kom ihåg: protoner är positiva, elektroner negativa och neutroner oladdade. Bara elektronerna kan flytta sig mellan föremål. Får något extra elektroner blir det negativt, förlorar det elektroner blir det positivt. Lika laddningar stöter bort, olika drar till sig.",
   "Remember: protons are positive, electrons negative and neutrons uncharged. Only the electrons can move between objects. If something gets extra electrons it becomes negative; if it loses electrons it becomes positive. Like charges repel, unlike charges attract.",
   "تذكّر: البروتونات موجبة، والإلكترونات سالبة، والنيوترونات بلا شحنة. والإلكترونات وحدها تنتقل بين الأجسام. إذا اكتسب شيء إلكترونات زائدة صار سالبًا، وإذا فقدها صار موجبًا. الشحنات المتشابهة تتنافر والمختلفة تتجاذب."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["proton +, elektron –, neutron 0","k"],["bara elektronerna flyttar sig","b"],["extra elektroner → negativ","b"],["för få elektroner → positiv","r"],["lika stöter bort, olika drar till sig","g"]],60,150,62,30)]},
]};
const PIC4={pair:(a,b)=>()=>[...chg(110,280,52,a),...chg(300,280,52,b),A.tx("?",205,200,60,"v")],
 atomQ:()=>{const x=200,y=290;return[...atom(x,y,4,5,[[70,2],[140,2]],false,9),A.p(R.arrow(380,140,(x+140*Math.cos(-35*Math.PI/180))+8,(y+140*Math.sin(-35*Math.PI/180))-8,-14),"r",4.5),A.tx("?",392,135,48,"r")]}};
const BANK4=[
 {lv:0,q:"Vilken laddning har en elektron?",a:"negativ",w:["positiv","ingen laddning","både positiv och negativ"]},
 {lv:0,q:"Vilken laddning har en proton?",a:"positiv",w:["negativ","ingen laddning","både positiv och negativ"]},
 {lv:0,q:"Vilken partikel saknar laddning?",a:"neutronen",w:["protonen","elektronen","atomkärnan"]},
 {lv:0,q:"Vad händer med två saker som har lika laddning?",a:"de stöter bort varandra",w:["de dras till varandra","de påverkar inte varandra","de blir neutrala"]},
 {lv:0,q:"Vad händer med de två laddade kulorna?",a:"de dras till varandra",w:["de stöter bort varandra","ingenting händer","de blir båda positiva"],lines:["Vad händer med","de två kulorna?"],pic:PIC4.pair("+","–")},
 {lv:0,q:"Vad händer med de två negativt laddade kulorna?",a:"de stöter bort varandra",w:["de dras till varandra","ingenting händer","de blir båda positiva"],lines:["Vad händer med","de två kulorna?"],pic:PIC4.pair("–","–")},
 {lv:1,q:"Var finns protonerna i en atom?",a:"i atomkärnan",w:["runt kärnan","utanför atomen","bara i metaller"]},
 {lv:1,q:"Vilka partiklar flyttar sig när man gnider en ballong mot håret?",a:"elektroner",w:["protoner","neutroner","hela atomkärnor"],lines:["Vilka partiklar flyttar sig","när man gnider en ballong","mot håret?"]},
 {lv:1,q:"En ballong har fått extra elektroner. Vilken laddning har den?",a:"negativ",w:["positiv","ingen","den växlar hela tiden"],lines:["En ballong har fått","extra elektroner.","Vilken laddning har den?"]},
 {lv:1,q:"En atom har 8 protoner och 8 elektroner. Vilken laddning har atomen?",a:"ingen, den är neutral",w:["positiv","negativ","dubbelt negativ"],lines:["En atom har 8 protoner","och 8 elektroner.","Vilken laddning har den?"]},
 {lv:1,q:"Varför reser sig håret efter att man gnidit en ballong mot det?",a:"hårstråna får samma laddning och stöter bort varandra",w:["håret blir varmt","ballongen blåser på håret","hårstråna blir tyngre"],lines:["Varför reser sig håret efter","att man gnidit en ballong mot det?"]},
 {lv:1,q:"Vad heter partikeln som pilen visar?",a:"elektron",w:["proton","neutron","molekyl"],lines:["Vad heter partikeln","som pilen visar?"],pic:PIC4.atomQ},
 {lv:1,q:"Skriv ordet: en negativt laddad partikel som rör sig runt kärnan heter en …",a:["elektron","elektronen"],lines:["Skriv ordet som saknas:","En negativ partikel som rör sig","runt kärnan heter en …"]},
 {lv:2,q:"Ett föremål har förlorat elektroner. Vilken laddning får det?",a:"positiv",w:["negativ","ingen","det beror på färgen"],lines:["Ett föremål har förlorat","elektroner. Vilken","laddning får det?"]},
 {lv:2,q:"Du räknar 6 sekunder mellan blixten och mullret. Hur långt bort är åskan?",a:"ungefär 2 km",w:["ungefär 6 km","ungefär 18 km","ungefär 0,5 km"],lines:["6 sekunder mellan blixt","och muller. Hur långt","bort är åskan?"]},
 {lv:2,q:"Vad är åskmuller?",a:"ljudet när luften kring blixten hettas upp och utvidgar sig",w:["ljudet när två moln krockar","ljudet av regnet mot marken","ljudet när elektroner går sönder"]},
 {lv:2,q:"Varför fastnar en laddad ballong på väggen?",a:"ballongen gör väggens yta närmast motsatt laddad",w:["väggen är alltid negativ","ballongen blir klibbig","luften trycker den mot väggen"]},
 {lv:2,q:"Varför är det bara elektronerna som flyttar sig när man gnider två saker mot varandra?",a:"protonerna sitter fast i atomkärnan",w:["elektronerna är tyngst","protonerna är oladdade","neutronerna stoppar protonerna"],lines:["Varför flyttar sig bara","elektronerna när man gnider?"]},
 {lv:2,q:"Skriv ordet: när laddningar plötsligt jämnas ut med en gnista kallas det en …",a:["urladdning","urladdningen"],lines:["Skriv ordet som saknas:","När laddningar jämnas ut med","en gnista kallas det en …"]},
];
LESSONS.push({id:"f7m4",subject:"science",grades:"7",kind:"wb",year:7,ord:4,
 title:t3("Elektrisk laddning","Electric charge","الشحنة الكهربائية"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="90" cy="90" r="16" fill="#f8d9d6" stroke="#d63b2f" stroke-width="3"/><circle cx="90" cy="90" r="40" fill="none" stroke="#9fb3d1" stroke-width="2"/><circle cx="90" cy="90" r="68" fill="none" stroke="#9fb3d1" stroke-width="2"/><circle cx="130" cy="90" r="7" fill="#2257c9"/><circle cx="42" cy="42" r="7" fill="#2257c9"/><path d="M230 20L200 90H232L210 160L270 72H236L258 20Z" fill="#fde6c8" stroke="#e07b00" stroke-width="4"/></svg>`,
 steps:VM4.steps,mount:wbMount(VM4),gen:bankGen(BANK4)});
WORDS.f7m4=["f7_proton","f7_elektron","f7_neutron","f7_karna","f7_laddning","f7_statisk","f7_urladdning"];

/* ===================================================================
   5. f7m5: Hållbar utveckling: Ingenting försvinner
   =================================================================== */
TERM("f7_bevarande",{sv:"massans bevarande",m:W("massans bevarande"),d:t3("Lagen att massan är lika stor före och efter en reaktion, om inget kommer in eller ut.","The law that mass is the same before and after a reaction, if nothing gets in or out.","القانون الذي ينصّ على أن الكتلة تبقى نفسها قبل التفاعل وبعده إذا لم يدخل شيء أو يخرج."),ex:"Den stängda flaskan väger 210 g före och efter.",tr:{en:"conservation of mass",ar:"حفظ الكتلة"}});
TERM("f7_slutet",{sv:"slutet system",m:W("slut(et|na) system(et)?"),d:t3("En behållare där inget kan komma in eller ut.","A container where nothing can get in or out.","وعاء لا يمكن أن يدخله أو يخرج منه شيء."),ex:"En stängd flaska är ett slutet system.",tr:{en:"closed system",ar:"نظام مغلق"}});
TERM("f7_kretslopp",{sv:"kretslopp",m:W("kretslopp(et|en)?"),d:t3("När ämnen går runt i naturen och används om och om igen.","When substances go round in nature and are used again and again.","عندما تدور المواد في الطبيعة وتُستخدم مرة بعد مرة."),ex:"Kolets kretslopp.",tr:{en:"cycle",ar:"دورة"}});
TERM("f7_atervinning",{sv:"återvinning",m:W("återvinn(ing|ingen|a|er|s)"),d:t3("När gamla material tas tillvara och blir nya saker.","When old materials are collected and made into new things.","عندما تُجمع المواد القديمة وتُصنع منها أشياء جديدة."),ex:"Burkar blir nya burkar genom återvinning.",tr:{en:"recycling",ar:"إعادة التدوير"}});
TERM("f7_hallbar",{sv:"hållbar utveckling",m:W("hållbar(t|a)?( utveckling)?"),d:t3("Att leva så att jorden räcker till för människor i framtiden också.","Living so that the earth is enough for people in the future too.","أن نعيش بطريقة تكفي فيها الأرض للناس في المستقبل أيضًا."),ex:"Att återvinna är en del av hållbar utveckling.",tr:{en:"sustainable development",ar:"التنمية المستدامة"}});
TERM("f7_mikroplast",{sv:"mikroplast",m:W("mikroplast(en|er)?"),d:t3("Mycket små bitar av plast, mindre än 5 mm, som finns i naturen.","Very small pieces of plastic, smaller than 5 mm, found in nature.","قطع بلاستيكية صغيرة جدًا، أصغر من 5 مم، توجد في الطبيعة."),ex:"Plastpåsen blir mikroplast i havet.",tr:{en:"microplastic",ar:"البلاستيك الدقيق"}});

const fire=(x,y,s=1)=>{const T=d=>tfx(d,x,y,s),F="M-60 -10 Q-70 -80 -30 -120 Q-30 -80 0 -90 Q-10 -150 30 -180 Q40 -120 60 -100 Q80 -130 75 -150 Q110 -90 70 -10 Z";
  return[A.p(T("M-100 20 L100 -10 M-100 -10 L100 20"),"#8a5a2b",14),A.hatch(T(F),"o"),A.p(T(F),"r",3.5)]};
const VM5={steps:[
 {say:t3("När ved brinner i en brasa blir det bara lite aska kvar. Har veden försvunnit? Nej! Atomerna i veden har reagerat med syre i luften och blivit koldioxid och vattenånga, som stiger upp i luften. Atomerna finns kvar, de har bara bytt plats.",
   "When wood burns in a fire, only a little ash is left. Has the wood disappeared? No! The atoms in the wood have reacted with oxygen in the air and become carbon dioxide and water vapour, which rise into the air. The atoms are still there; they have only moved.",
   "عندما يحترق الحطب في النار لا يبقى إلا قليل من الرماد. هل اختفى الحطب؟ لا! تفاعلت ذرّات الخشب مع أكسجين الهواء وصارت ثاني أكسيد الكربون وبخار ماء صعدا في الهواء. الذرّات ما زالت موجودة، لكنها غيّرت مكانها فقط."),
  draw:()=>[A.wipe(),ttl("Vart tar veden vägen?"),...fire(300,400,1),A.flow("M280 230 Q240 180 270 140 Q300 110 260 90","k",6,4,7),A.flow("M330 220 Q370 170 340 130 Q320 100 360 80","b",6,4.4,7),
   A.tx("koldioxid",200,130,28,"k","end"),A.tx("vattenånga",400,120,28,"b","start"),A.p("M420 425 Q450 405 480 425 Z","#7d8ca6",3),A.tx("lite aska",500,432,26,"#5b6475","start"),
   A.tx("Atomerna finns kvar –",600,250,30,"g"),A.tx("de har bytt plats.",600,295,30,"g")]},
 {say:t3("Vi kan pröva med en brustablett i vatten på en våg. I ett öppet glas minskar massan, eftersom koldioxiden smiter ut i luften. I en stängd flaska är massan exakt lika stor efteråt. Det kallas lagen om massans bevarande.",
   "We can test with an effervescent tablet in water on a scale. In an open glass the mass goes down, because the carbon dioxide escapes into the air. In a closed bottle the mass is exactly the same afterwards. This is called the law of conservation of mass.",
   "يمكننا التجربة بقرص فوّار في ماء فوق ميزان. في الكأس المفتوحة تقلّ الكتلة لأن ثاني أكسيد الكربون يتسرّب إلى الهواء. أما في القارورة المغلقة فتبقى الكتلة نفسها تمامًا. ويسمّى هذا قانون حفظ الكتلة."),
  draw:()=>[A.wipe(),A.tx("Öppet glas",210,62,34,"r"),A.tx("Stängd flaska",590,62,34,"g"),A.p(R.line(400,40,400,440,.3),"#c7cfdc",2),
   ...beaker(150,220,120,140,.6,"b"),A.flow("M190 350 Q200 280 185 220 Q175 160 200 100","#7d8ca6",6,3,6),A.flow("M235 350 Q225 270 240 210 Q250 150 230 110","#7d8ca6",5,3.4,6),...vag(210,362,"203 g",200),
   A.p("M545 360 L545 240 Q545 225 575 215 L575 180 L605 180 L605 215 Q635 225 635 240 L635 360 Z","k",3.5),A.hatch("M548 357 L632 357 L632 290 L548 290 Z","b"),...balloon(590,140,36,42,"o",0),
   A.flow("M570 350 Q580 300 575 250 Q570 220 590 190","#7d8ca6",4,2.8,5),...vag(590,362,"210 g",200),
   A.tx("före 205 g, efter 203 g",210,445,26,"r"),A.tx("före 210 g, efter 210 g",590,445,26,"g"),A.tx("gasen smiter ut",210,485,24,"r"),A.tx("ingenting kommer ut",590,485,24,"g")]},
 {say:t3("Vid en kemisk reaktion byter atomerna bara partner. När kol brinner tar en kolatom två syreatomer och bildar koldioxid, CO₂. Före reaktionen finns en kolatom och två syreatomer, efter finns precis samma atomer. Inga försvinner och inga nya bildas.",
   "In a chemical reaction the atoms only change partners. When carbon burns, a carbon atom takes two oxygen atoms and forms carbon dioxide, CO₂. Before the reaction there is one carbon atom and two oxygen atoms; after, there are exactly the same atoms. None disappear and no new ones form.",
   "في التفاعل الكيميائي تغيّر الذرّات شركاءها فقط. عندما يحترق الكربون تأخذ ذرّة الكربون ذرّتي أكسجين وتكوّن ثاني أكسيد الكربون CO₂. قبل التفاعل ذرّة كربون وذرّتا أكسجين، وبعده الذرّات نفسها تمامًا. لا يختفي شيء ولا يتكوّن شيء جديد."),
  draw:()=>[A.wipe(),ttl("Atomerna byter partner"),A.tx("kol + syre → koldioxid",400,140,38,"k"),...balls([[120,250]],22,"k"),A.tx("+",190,262,44),...o2(270,250,1.4),A.arrow(350,250,440,250,"k"),...co2(580,250,1.5),
   A.tx("C",120,310,30,"k"),A.tx("O₂",270,310,30,"r"),A.tx("CO₂",580,310,30,"k"),A.tx("före: 1 C och 2 O",200,380,30,"b"),A.tx("efter: 1 C och 2 O",580,380,30,"b"),note("Samma atomer – samma massa.",460,"g",32)]},
 {say:t3("Atomerna går runt i kretslopp. Ett träd tar upp koldioxid ur luften och bygger sin ved av kolatomerna. Djur äter växter. När växter och djur andas, ruttnar eller eldas går kolet tillbaka till luften som koldioxid, och kretsloppet börjar om.",
   "Atoms go round in cycles. A tree takes carbon dioxide from the air and builds its wood from the carbon atoms. Animals eat plants. When plants and animals breathe, rot or are burned, the carbon goes back into the air as carbon dioxide, and the cycle starts again.",
   "تدور الذرّات في دورات. تأخذ الشجرة ثاني أكسيد الكربون من الهواء وتبني خشبها من ذرّات الكربون، والحيوانات تأكل النباتات. وعندما تتنفّس النباتات والحيوانات أو تتعفّن أو تُحرق يعود الكربون إلى الهواء ثاني أكسيد كربون، وتبدأ الدورة من جديد."),
  draw:()=>{const P=ringPts(400,280,260,150,4);return[A.wipe(),ttl("Kolets kretslopp"),...ringArrows(400,280,260,150,4,"g",52),ringFlow(400,280,125,70,"k",8,10),
   A.tx("CO₂ i luften",P[0][0],P[0][1]+8,30,"k"),A.tx("växter tar upp",P[1][0]-10,P[1][1]+8,28,"g"),A.tx("djur äter",P[2][0],P[2][1]+8,30,"o"),A.tx("andas ut, ruttnar,",P[3][0]+20,P[3][1]-6,26,"#8a5a2b"),A.tx("brinner",P[3][0]+20,P[3][1]+26,26,"#8a5a2b"),
   A.tx("kol",400,292,40,"k")]}},
 {say:t3("Atomerna i din kropp är mycket gamla. Många av dem bildades inne i stjärnor för miljarder år sedan. Sedan har de funnits i luft, jord, växter och djur, kanske i en dinosaurie. Samma atomer används om och om igen.",
   "The atoms in your body are very old. Many of them formed inside stars billions of years ago. Since then they have been in air, soil, plants and animals, maybe in a dinosaur. The same atoms are used again and again.",
   "الذرّات في جسمك قديمة جدًا. كثير منها تكوّن داخل النجوم قبل مليارات السنين، ثم كانت في الهواء والتربة والنباتات والحيوانات، وربما في ديناصور. والذرّات نفسها تُستخدم مرة بعد مرة."),
  draw:()=>[A.wipe(),ttl("Dina atomer är gamla"),...art("sun",90,280,.6),...plant(250,380,.75),...art("fox",470,380,.8),A.art(KID,690,175,.5),
   A.arrow(138,280,168,280,"o"),A.arrow(320,280,375,280,"o"),A.arrow(570,280,625,280,"o"),ntag("stjärna",90,440),ntag("växt",250,440),ntag("djur",470,440),ntag("du",690,440),
   note("Samma atomer används om och om igen.",482,"g",26)]},
 {say:t3("Därför finns det inget ”bort” när vi slänger saker. Sopor som grävs ner finns kvar i marken. En plastflaska i havet försvinner inte heller. Den bryts sönder till allt mindre bitar, mikroplast, som djur kan äta.",
   "That is why there is no 'away' when we throw things away. Rubbish that is buried stays in the ground. A plastic bottle in the sea does not disappear either. It breaks into smaller and smaller pieces, microplastic, which animals can eat.",
   "لذلك لا يوجد «بعيد» عندما نرمي الأشياء. النفايات المدفونة تبقى في الأرض، وقارورة البلاستيك في البحر لا تختفي أيضًا، بل تتكسّر إلى قطع أصغر فأصغر تسمّى البلاستيك الدقيق، وقد تأكلها الحيوانات."),
  draw:()=>[A.wipe(),ttl("Det finns inget ”bort”"),...art("bag",100,300,1.3),A.arrow(150,270,210,270,"k"),A.hatch("M220 300 Q300 200 380 300 Z","o"),A.p("M215 300 Q300 200 385 300 Z M210 300 L390 300","#8a5a2b",3.5),
   A.tx("allt finns kvar",300,345,26,"#8a5a2b"),A.band(430,240,340,110,"b"),A.p("M430 240 Q520 228 600 240 Q690 252 770 240","b",3),...art("bottle",480,262,.5),A.arrow(520,270,580,280,"k"),
   A.p(dotsP([[600,265],[625,290],[650,270],[675,300],[700,262],[725,288],[745,270],[640,315],[710,320]]),"r",7),A.tx("mikroplast",680,385,28,"r"),ntag("deponi",300,385,"#8a5a2b"),
   note("Soporna hamnar alltid någonstans.",465,"k",30)]},
 {say:t3("Eftersom atomerna finns kvar kan vi använda materialen igen. Det kallas återvinning. Sortera metall, glas, papper och plast. En aluminiumburk kan smältas ner och bli en ny burk om och om igen, och det kräver ungefär 95 procent mindre energi än att göra ny aluminium.",
   "Since the atoms are still there, we can use the materials again. That is called recycling. Sort metal, glass, paper and plastic. An aluminium can can be melted down and become a new can again and again, and that needs about 95 percent less energy than making new aluminium.",
   "بما أن الذرّات تبقى موجودة يمكننا استخدام المواد من جديد، وهذا يسمّى إعادة التدوير. افرز المعادن والزجاج والورق والبلاستيك. ويمكن صهر علبة الألومنيوم لتصبح علبة جديدة مرة بعد مرة، وهذا يحتاج طاقة أقل بنحو 95 في المئة من صنع ألومنيوم جديد."),
  draw:()=>[A.wipe(),ttl("Återvinning"),...can(120,110,50,80),A.arrow(170,150,260,150,"k"),A.tx("smälts ner",340,160,30,"o"),A.arrow(420,150,510,150,"k"),...can(560,110,50,80),A.tx("ny burk",680,160,30,"g"),
   A.flow("M560 205 Q340 250 120 205","o",5,4,6),...[["metall","k"],["glas","g"],["papper","b"],["plast","o"]].flatMap(([n,c],i)=>{const x=130+i*180;return[bin(x,290,130,120,c),A.tx(n,x,365,28,c)]}),
   note("ca 95 % mindre energi än nytt aluminium",470,"g",28)]},
 {say:t3("Kom ihåg: atomer försvinner inte och nya bildas inte. I ett slutet system är massan lika stor före och efter en reaktion. Ämnen går runt i kretslopp, och sopor hamnar alltid någonstans. Genom att återvinna sparar vi både material och energi.",
   "Remember: atoms do not disappear and no new ones are made. In a closed system the mass is the same before and after a reaction. Substances go round in cycles, and rubbish always ends up somewhere. By recycling we save both materials and energy.",
   "تذكّر: الذرّات لا تختفي ولا تتكوّن ذرّات جديدة. في النظام المغلق تبقى الكتلة نفسها قبل التفاعل وبعده. والمواد تدور في دورات، والنفايات تنتهي دائمًا في مكان ما. وبإعادة التدوير نوفّر المواد والطاقة معًا."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["atomer försvinner inte","k"],["slutet system: samma massa","b"],["atomerna går runt i kretslopp","g"],["sopor hamnar någonstans","r"],["återvinning sparar material och energi","o"]],60,150,62,30)]},
 {say:t3("Nu en fråga att diskutera: om ingenting försvinner, varför säger vi ändå att jordens resurser kan ta slut? Tänk på vad som händer när material sprids ut, blandas eller hamnar i havet. Vad kan du själv göra?",
   "Now a question to discuss: if nothing disappears, why do we still say that the earth's resources can run out? Think about what happens when materials are spread out, mixed or end up in the sea. What can you do yourself?",
   "والآن سؤال للنقاش: إذا كان لا شيء يختفي، فلماذا نقول إن موارد الأرض قد تنفد؟ فكّر فيما يحدث عندما تنتشر المواد أو تختلط أو تنتهي في البحر. وماذا تستطيع أن تفعل بنفسك؟"),
  draw:()=>[A.wipe(),A.tx("Diskutera!",400,70,44,"v"),A.tx("?",120,330,200,"v"),A.tx("Om ingenting försvinner –",470,170,36,"k"),A.tx("varför kan jordens resurser",470,225,36,"k"),A.tx("ändå ta slut?",470,280,36,"k"),
   A.tx("Tänk på: spridas ut, blandas, energi",470,370,26,"#5b6475"),A.tx("Vad kan du själv göra?",470,420,30,"g")]},
]};
const PIC5={open:()=>[...beaker(140,200,140,150,.6,"b"),A.flow("M190 340 Q205 270 190 200 Q180 150 205 110","#7d8ca6",5,3,6),...vag(210,352,"205 g",220),A.tx("före",210,440,28)],
 closed:()=>[A.p("M155 350 L155 230 Q155 215 185 205 L185 170 L215 170 L215 205 Q245 215 245 230 L245 350 Z","k",3.5),A.hatch("M158 347 L242 347 L242 280 L158 280 Z","b"),...balloon(200,130,34,40,"o",0),...vag(200,352,"210 g",220),A.tx("före",200,440,28)]};
const BANK5=[
 {lv:0,q:"Vad händer med atomerna när ved brinner?",a:"de blir till andra ämnen, till exempel koldioxid",w:["de försvinner","de förvandlas till ljus","de krymper"]},
 {lv:0,q:"Vad är återvinning?",a:"att material används igen till nya saker",w:["att sopor grävs ner","att man köper nya saker","att sopor slängs i havet"]},
 {lv:0,q:"Vilket av dessa sorterar man som metall?",a:"en läskburk",w:["en tidning","en syltburk av glas","en plastpåse"]},
 {lv:0,q:"Kan atomer förstöras när något brinner?",a:"nej, de finns kvar",w:["ja, alltid","ja, om elden är varm","bara i trä"]},
 {lv:0,q:"Vad händer med en plastflaska som hamnar i havet?",a:"den bryts ner till små bitar, mikroplast",w:["den försvinner helt efter en vecka","den blir till vatten","den blir till sten"]},
 {lv:1,q:"Vad säger lagen om massans bevarande?",a:"massan är lika stor före och efter, om inget kommer in eller ut",w:["massan blir alltid mindre","massan blir alltid större","massan försvinner när något brinner"],lines:["Vad säger lagen om","massans bevarande?"]},
 {lv:1,q:"Flaskan är stängd och tabletten löser sig. Vad visar vågen efteråt?",a:"210 g",w:["200 g","220 g","0 g"],lines:["Flaskan är stängd.","Tabletten löser sig.","Vad visar vågen efteråt?"],pic:PIC5.closed},
 {lv:1,q:"Glaset är öppet. Varför väger det mindre efteråt?",a:"gasen har gått ut i luften",w:["atomerna har försvunnit","vattnet har blivit lättare","vågen är trasig"],lines:["Glaset är öppet. Efteråt","väger det 203 g. Varför?"],pic:PIC5.open},
 {lv:1,q:"Varför väger askan mindre än veden?",a:"mycket av veden har blivit gaser som gått upp i luften",w:["atomerna har förstörts","elden har ätit upp atomerna","askan är ihålig"]},
 {lv:1,q:"Vad är ett kretslopp?",a:"när ämnen går runt och används om och om igen",w:["en cykeltävling","när ämnen försvinner","en sorts sopstation"]},
 {lv:1,q:"Var kommer kolet i ett träd ifrån?",a:"från koldioxid i luften",w:["från solen","från regnet","från stenar"]},
 {lv:1,q:"Skriv ordet: när material används igen till nya saker kallas det …",a:["återvinning","återvinna"],lines:["Skriv ordet som saknas:","När material blir nya saker","kallas det …"]},
 {lv:2,q:"C + O₂ → CO₂. Hur många syreatomer finns efter reaktionen?",a:"2",w:["1","3","4"],lines:["C + O₂ → CO₂","Hur många syreatomer","finns efter reaktionen?"]},
 {lv:2,q:"Ett ljus brinner på en våg i ett öppet rum. Varför minskar massan på vågen?",a:"gaserna som bildas går ut i luften",w:["atomerna förstörs","ljuset blir till energi","vågen blir varm"],lines:["Ett ljus brinner på en våg.","Varför minskar massan?"]},
 {lv:2,q:"Varför är det bra att återvinna aluminium?",a:"det kräver mycket mindre energi än att göra nytt",w:["återvunnet aluminium väger mer","nytt aluminium går inte att göra","aluminium försvinner annars"]},
 {lv:2,q:"Om ingenting försvinner, varför kan resurser ändå ta slut?",a:"materialen sprids ut och blir svåra att samla in",w:["atomerna slits ut","atomerna förvandlas till ljus","atomerna krymper med tiden"],lines:["Om ingenting försvinner,","varför kan resurser","ändå ta slut?"]},
 {lv:2,q:"Var bildades många av atomerna i din kropp?",a:"i stjärnor för länge sedan",w:["i din mage","i fabriker","i havet förra året"]},
 {lv:2,q:"Skriv ordet: en behållare där inget kan komma in eller ut kallas ett slutet …",a:["system","systemet"],lines:["Skriv ordet som saknas:","Där inget kommer in eller ut","är det ett slutet …"]},
];
LESSONS.push({id:"f7m5",subject:"science",grades:"7",kind:"wb",year:7,ord:5,
 title:t3("Hållbar utveckling: Ingenting försvinner","Sustainability: Nothing disappears","التنمية المستدامة: لا شيء يختفي"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M160 30A60 60 0 1 1 100 90" fill="none" stroke="#1e9e5a" stroke-width="6"/><path d="M100 90L88 72M100 90L118 78" stroke="#1e9e5a" stroke-width="6"/><rect x="138" y="70" width="44" height="60" rx="8" fill="#e3e6ec" stroke="#7d8ca6" stroke-width="4"/><ellipse cx="160" cy="70" rx="22" ry="7" fill="#fff" stroke="#7d8ca6" stroke-width="4"/></svg>`,
 steps:VM5.steps,mount:wbMount(VM5),gen:bankGen(BANK5)});
WORDS.f7m5=["f7_bevarande","f7_slutet","f7_kretslopp","f7_atervinning","f7_hallbar","f7_mikroplast"];

/* ===================================================================
   6. f7m6: Lär mer: Materia hålls ihop av krafter
   =================================================================== */
TERM("f7_smaltpunkt",{sv:"smältpunkt",m:W("smältpunkt(en|er)?"),d:t3("Temperaturen där ett fast ämne smälter och blir flytande.","The temperature at which a solid melts and becomes liquid.","درجة الحرارة التي تنصهر عندها المادة الصلبة وتصبح سائلة."),ex:"Isens smältpunkt är 0 °C.",tr:{en:"melting point",ar:"درجة الانصهار"}});
TERM("f7_kokpunkt",{sv:"kokpunkt",m:W("kokpunkt(en|er)?"),d:t3("Temperaturen där en vätska kokar och blir gas.","The temperature at which a liquid boils and becomes gas.","درجة الحرارة التي يغلي عندها السائل ويصبح غازًا."),ex:"Vattnets kokpunkt är 100 °C.",tr:{en:"boiling point",ar:"درجة الغليان"}});
TERM("f7_ytspanning",{sv:"ytspänning",m:W("ytspänning(en)?"),d:t3("Att ytan på en vätska beter sig som en tunn, spänd hinna.","That the surface of a liquid behaves like a thin, stretched skin.","أن سطح السائل يتصرّف مثل غشاء رقيق مشدود."),ex:"Skräddaren går på ytspänningen.",tr:{en:"surface tension",ar:"التوتر السطحي"}});
TERM("f7_kohesion",{sv:"kohesion",m:W("kohesion(en)?"),d:t3("Kraften som drar partiklar av samma ämne mot varandra.","The force that pulls particles of the same substance towards each other.","القوة التي تجذب جسيمات المادة نفسها بعضها إلى بعض."),ex:"Vattenmolekyler håller ihop genom kohesion.",tr:{en:"cohesion",ar:"التماسك"}});
TERM("f7_adhesion",{sv:"adhesion",m:W("adhesion(en)?"),d:t3("Kraften som drar partiklar av ett ämne mot ett annat ämne.","The force that pulls particles of one substance towards another substance.","القوة التي تجذب جسيمات مادة إلى مادة أخرى."),ex:"Vatten dras mot glas genom adhesion.",tr:{en:"adhesion",ar:"الالتصاق"}});
TERM("f7_avdunstning",{sv:"avdunstning",m:W("avdunst(ning|ningen|ar|a)"),d:t3("När en vätska blir gas vid ytan, utan att koka.","When a liquid turns into gas at the surface, without boiling.","عندما يتحوّل السائل إلى غاز عند سطحه دون أن يغلي."),ex:"En vattenpöl avdunstar i solen.",tr:{en:"evaporation",ar:"التبخّر"}});

const TY=t=>340-t*1.8;
const CURVE=`M110 ${TY(-20)} L200 ${TY(0)} L330 ${TY(0)} L480 ${TY(100)} L660 ${TY(100)} L730 ${TY(120)}`;
const heatGraph=(full=true)=>[A.p("M110 440 L110 100 M110 440 L760 440 M100 112 L110 100 L120 112 M748 430 L760 440 L748 450","k",3),A.tx("°C",125,110,24,"k","start"),A.tx("tid",755,475,24,"k","end"),
  A.p(R.dashed(110,TY(0),200,TY(0))+R.dashed(110,TY(100),480,TY(100)),"#9aa3b2",2),A.tx("0",98,TY(0)+8,24,"k","end"),A.tx("100",98,TY(100)+8,24,"k","end"),A.p(CURVE,"r",4.5),
  ...(full?[A.tx("isen smälter",265,TY(0)-18,26,"b"),A.tx("vattnet kokar",570,TY(100)-18,26,"b"),A.tx("is",160,TY(-20)+40,26,"k"),A.tx("vatten",455,290,26,"k","start"),A.tx("ånga",720,200,26,"k")]:[])];
const strider=(x,y)=>[A.p(R.loop(x,y-30,42,8)+R.circ(x+50,y-32,7),"k",3),A.p(`M${x+10} ${y-28}L${x+48} ${y-12}L${x+80} ${y}M${x-10} ${y-28}L${x-48} ${y-12}L${x-82} ${y}M${x+20} ${y-28}L${x+52} ${y-20}L${x+66} ${y}M${x-25} ${y-28}L${x-55} ${y-18}L${x-62} ${y}`,"k",2.5),
  A.p(`M${x+70} ${y}Q${x+80} ${y+9} ${x+90} ${y}M${x-92} ${y}Q${x-82} ${y+9} ${x-72} ${y}M${x+56} ${y}Q${x+66} ${y+8} ${x+76} ${y}M${x-72} ${y}Q${x-62} ${y+8} ${x-52} ${y}`,"b",2.5)];
const clip=(x,y,s=1)=>A.p(tfx("M-45 0 L35 0 Q45 0 45 -8 Q45 -16 35 -16 L-38 -16 Q-46 -16 -46 -9 Q-46 -4 -38 -4 L28 -4",x,y,s),"#5b6475",3);
const surfaceMol=(move=true)=>{const o=[...beaker(60,170,410,270,.85,"b")],pts=[];for(let j=0;j<4;j++)for(let i=0;i<7;i++)pts.push([100+i*55+(j%2?14:0),232+j*52]);
  o.push(...balls(pts.filter(([x,y])=>!(x===320&&y===232)&&!(x===210&&y===336)),14,"b"),...balls([[320,232],[210,336]],14,"r"),
   A.arrow(300,232,262,232,"r"),A.arrow(340,232,378,232,"r"),A.arrow(320,252,320,290,"r"),A.arrow(190,336,152,336,"r"),A.arrow(230,336,268,336,"r"),A.arrow(210,316,210,278,"r"),A.arrow(210,356,210,394,"r"));return o};
const VM6={steps:[
 {say:t3("Varför faller inte ett bord sönder i lösa atomer? Mellan partiklarna i ett ämne verkar krafter som drar dem mot varandra, ungefär som osynliga fjädrar. Partiklarna vibrerar hela tiden, men krafterna håller dem på plats. Utan dem vore allt gas.",
   "Why doesn't a table fall apart into loose atoms? Between the particles of a substance there are forces that pull them towards each other, a bit like invisible springs. The particles vibrate all the time, but the forces keep them in place. Without them everything would be gas.",
   "لماذا لا تتفكّك الطاولة إلى ذرّات منفصلة؟ بين جسيمات المادة قوى تجذبها بعضها إلى بعض، تشبه نوابض غير مرئية. تهتزّ الجسيمات طوال الوقت لكن القوى تبقيها في مكانها، ولولاها لكان كل شيء غازًا."),
  draw:()=>{const xs=[220,320,420,520],ys=[160,260,360];let d="";xs.forEach((x,i)=>ys.forEach((y,j)=>{if(i<3)d+=spring(x+20,y,x+80,y);if(j<2)d+=spring(x,y+20,x,y+80)}));
   return[A.wipe(),ttl("Krafter håller ihop materia"),A.p(d,"#9aa3b2",2.5),...xs.flatMap((x,i)=>ys.map((y,j)=>shake(x,y,"b",19,i+j*4,4))),
    ...callout([539,160],640,175,"partikel","b",28),...callout([526,210],640,218,"kraft","#5b6475",28),note("Krafterna drar partiklarna mot varandra.",462,"k",28)]}},
 {say:t3("Krafterna är olika starka i olika ämnen. Mellan järnatomer är de mycket starka, så järn smälter först vid 1 538 °C. Mellan syremolekyler är de svaga, så syre är gas ända ner till −183 °C. Starka krafter ger hög smältpunkt och kokpunkt.",
   "The forces are different in different substances. Between iron atoms they are very strong, so iron only melts at 1,538 °C. Between oxygen molecules they are weak, so oxygen stays a gas all the way down to −183 °C. Strong forces give a high melting point and boiling point.",
   "تختلف قوّة هذه القوى من مادة إلى أخرى. بين ذرّات الحديد تكون قوية جدًا، فلا ينصهر الحديد إلا عند 1538 °م. وبين جزيئات الأكسجين تكون ضعيفة، فيبقى الأكسجين غازًا حتى −183 °م. القوى القوية تعني درجتي انصهار وغليان مرتفعتين."),
  draw:()=>[A.wipe(),ttl("Starka och svaga krafter"),A.tx("ämne",90,140,28,"k","start"),A.tx("smälter",330,140,28,"k"),A.tx("kokar",500,140,28,"k"),A.tx("krafter",680,140,28,"k"),tbl(70,770,155),
   ...[["järn","1 538 °C","2 862 °C","mycket starka","r"],["vatten","0 °C","100 °C","medel","o"],["syre","−218 °C","−183 °C","svaga","b"]].flatMap(([a,b,c,d,col],i)=>{const y=210+i*70;
    return[A.tx(a,90,y,32,"k","start"),A.tx(b,330,y,30,"k"),A.tx(c,500,y,30,"k"),A.tx(d,680,y,30,col)]}),note("Starka krafter → hög smältpunkt och kokpunkt",450,"g",28)]},
 {say:t3("Så här ändras temperaturen när man värmer is jämnt. Den stiger till 0 °C. Sedan står den still medan isen smälter, för energin går åt till att lossa partiklarna från varandra. Samma sak händer vid 100 °C när vattnet kokar.",
   "This is how the temperature changes when you heat ice steadily. It rises to 0 °C. Then it stays still while the ice melts, because the energy is used to loosen the particles from each other. The same happens at 100 °C when the water boils.",
   "هكذا تتغيّر درجة الحرارة عندما نسخّن الجليد بانتظام: ترتفع حتى 0 °م، ثم تثبت أثناء انصهار الجليد، لأن الطاقة تُستهلك في فكّ الجسيمات عن بعضها. ويحدث الشيء نفسه عند 100 °م عندما يغلي الماء."),
  draw:()=>[A.wipe(),ttl("Uppvärmning av is"),...heatGraph(true),A.flow(CURVE,"o",1,8,9)]},
 {say:t3("Vid kokning får partiklarna så mycket energi att de slits loss helt. Det bildas bubblor av ånga inne i hela vätskan. Avdunstning är något annat: den sker bara vid ytan, vid alla temperaturer, när de snabbaste molekylerna lyckas ta sig loss.",
   "When boiling, the particles get so much energy that they break free completely. Bubbles of vapour form inside the whole liquid. Evaporation is different: it happens only at the surface, at any temperature, when the fastest molecules manage to escape.",
   "عند الغليان تكتسب الجسيمات طاقة كبيرة فتنفلت تمامًا، وتتكوّن فقاعات بخار داخل السائل كله. أما التبخّر فشيء آخر: يحدث عند السطح فقط وفي أي درجة حرارة، عندما تنجح أسرع الجزيئات في الإفلات."),
  draw:()=>[A.wipe(),A.tx("Kokning",210,80,36,"r"),A.tx("Avdunstning",590,80,36,"b"),A.p(R.line(400,50,400,430,.3),"#c7cfdc",2),
   ...beaker(90,220,240,170,.8,"b"),A.p("M130 415 L150 395 L170 415 M190 415 L210 392 L230 415 M250 415 L270 395 L290 415","o",3.5),
   ...[150,210,270].map((x,i)=>A.flow(`M${x} 380 Q${x+10} 320 ${x} 258`,"#9cc3f5",3,1.6+i*.3,8)),
   A.flow("M180 245 Q160 180 190 120","#7d8ca6",4,2.6,6),A.flow("M240 245 Q260 180 230 120","#7d8ca6",4,3,6),
   A.hatch("M470 330 L740 330 L740 360 L470 360 Z","b"),A.p("M460 360 L750 360 M470 330 Q600 322 740 330","b",3),...balls([500,550,600,650,700].map(x=>[x,345]),10,"b"),
   A.flow("M560 330 Q570 260 545 190","#7d8ca6",1,3,9),A.flow("M670 330 Q650 250 690 170","#7d8ca6",1,3.6,9),
   A.tx("bubblor i hela vätskan",210,465,26,"r"),A.tx("bara vid ytan",590,430,26,"b"),A.tx("vid alla temperaturer",590,465,26,"b")]},
 {say:t3("Inne i vattnet dras varje molekyl åt alla håll av sina grannar, och dragen tar ut varandra. En molekyl vid ytan har inga grannar ovanför. Den dras bara åt sidorna och nedåt. Därför beter sig ytan som en tunn, spänd hinna. Det kallas ytspänning.",
   "Inside the water each molecule is pulled in all directions by its neighbours, and the pulls cancel out. A molecule at the surface has no neighbours above it. It is only pulled sideways and downwards. That is why the surface behaves like a thin, stretched skin. This is called surface tension.",
   "داخل الماء تنجذب كل جزيئة في كل الاتجاهات بفعل جاراتها فتلغي القوى بعضها. أما الجزيئة عند السطح فليس فوقها جارات، فتنجذب نحو الجانبين والأسفل فقط. لذلك يتصرّف السطح مثل غشاء رقيق مشدود، ويسمّى هذا التوتر السطحي."),
  draw:()=>[A.wipe(),ttl("Ytspänning"),...surfaceMol(),A.tx("vid ytan:",500,200,30,"r","start"),A.tx("dras åt sidorna",500,240,26,"k","start"),A.tx("och nedåt",500,275,26,"k","start"),
   A.tx("inne i vattnet:",500,345,30,"r","start"),A.tx("dras åt alla håll",500,385,26,"k","start"),note("Ytan blir som en spänd hinna.",475,"b",28)]},
 {say:t3("Ytspänningen syns i vardagen. Skräddaren är en insekt som kan gå på vattnet utan att sjunka. Ett gem av stål kan ligga på ytan fast stål har högre densitet än vatten. Och droppar blir runda, eftersom ytan drar ihop sig så mycket som möjligt.",
   "Surface tension can be seen in everyday life. The water strider is an insect that can walk on water without sinking. A steel paper clip can lie on the surface even though steel is denser than water. And drops become round, because the surface pulls together as much as possible.",
   "يظهر التوتر السطحي في الحياة اليومية. متزلّج الماء حشرة تستطيع المشي على الماء دون أن تغرق. ومشبك الورق الفولاذي يمكن أن يبقى على السطح مع أن الفولاذ أكثف من الماء. والقطرات تصبح كروية لأن سطحها ينكمش قدر الإمكان."),
  draw:()=>[A.wipe(),ttl("Ytspänning i vardagen"),A.band(40,330,500,110,"b"),A.p("M40 330 L140 330 Q150 336 160 330 L360 330 Q440 345 520 330 L540 330","b",3),...strider(170,330),clip(440,334,1),
   A.p("M560 330 L760 330","#8a5a2b",5),A.hatch(ellP(660,293,48,36),"b"),A.p(ellP(660,293,48,36),"b",3.5),
   A.tx("skräddare",170,240,30,"k"),A.tx("gem av stål",440,270,30,"#5b6475"),A.tx("rund droppe",660,230,30,"b"),note("Ytan bär upp – och drar ihop sig.",475,"k",28)]},
 {say:t3("Diskmedel försvagar ytspänningen. Diskmedlets molekyler tränger in mellan vattenmolekylerna vid ytan, så att de inte drar lika hårt i varandra. Droppar man diskmedel bredvid gemet sjunker det direkt.",
   "Washing-up liquid weakens surface tension. The detergent molecules squeeze in between the water molecules at the surface, so they do not pull on each other as hard. If you drip washing-up liquid next to the paper clip, it sinks at once.",
   "سائل الجلي يُضعف التوتر السطحي. تدخل جزيئاته بين جزيئات الماء عند السطح فلا تتجاذب بالقوة نفسها. وإذا قطّرت سائل الجلي بجانب المشبك غاص فورًا."),
  draw:()=>[A.wipe(),ttl("Diskmedel bryter ytan"),...beaker(70,200,260,200,.75,"b"),clip(200,252,.9),A.p("M300 90 L300 150 L292 168 L308 168 L300 150 M286 90 L314 90","k",3.5),A.hatch(ellP(300,190,6,9),"g"),A.p(ellP(300,190,6,9),"g",3),
   A.tx("diskmedel",330,110,26,"g","start"),A.arrow(350,300,440,300,"k"),...beaker(470,200,260,200,.75,"b"),clip(600,395,.9),A.tx("före",200,445,28),A.tx("efter",600,445,28),note("Gemet sjunker när ytspänningen försvinner.",480,"r",26)]},
 {say:t3("Krafterna mellan vattenmolekyler kallas kohesion. Krafterna mellan vatten och ett annat ämne, till exempel glas, kallas adhesion. I ett tunt glasrör drar adhesionen vattnet uppåt. Ju tunnare rör, desto högre stiger vattnet. Det kallas kapillärkraft.",
   "The forces between water molecules are called cohesion. The forces between water and another substance, for example glass, are called adhesion. In a thin glass tube adhesion pulls the water upwards. The thinner the tube, the higher the water rises. This is called capillary action.",
   "القوى بين جزيئات الماء تسمّى التماسك، والقوى بين الماء ومادة أخرى كالزجاج تسمّى الالتصاق. في أنبوب زجاجي رفيع يسحب الالتصاق الماء إلى أعلى، وكلما كان الأنبوب أرفع ارتفع الماء أكثر. ويسمّى هذا الخاصية الشعرية."),
  draw:()=>{const T=[[180,40,370],[280,24,300],[360,12,210]];return[A.wipe(),ttl("Kohesion och adhesion"),A.hatch("M110 380 L460 380 L460 418 L110 418 Z","b"),A.p("M100 360 L100 420 L470 420 L470 360","k",3.5),
   ...T.flatMap(([x,w,top])=>[A.hatch(poly([[x-w/2+2,top],[x+w/2-2,top],[x+w/2-2,400],[x-w/2+2,400]]),"b"),A.p(`M${x-w/2} 140L${x-w/2} 405M${x+w/2} 140L${x+w/2} 405`,"k",3)]),
   A.tx("kohesion:",510,170,30,"b","start"),A.tx("vatten drar i vatten",510,210,26,"k","start"),A.tx("adhesion:",510,280,30,"g","start"),A.tx("vatten dras mot glaset",510,320,26,"k","start"),
   A.tx("tunnare rör →",510,390,26,"o","start"),A.tx("högre vatten",510,425,26,"o","start")]}},
 {say:t3("Kom ihåg: krafter mellan partiklarna håller ihop materia. Starka krafter ger hög smältpunkt och kokpunkt. Under smältning och kokning står temperaturen still. Ytspänning gör vattenytan till en hinna, och kohesion och adhesion förklarar kapillärkraften.",
   "Remember: forces between particles hold matter together. Strong forces give a high melting and boiling point. During melting and boiling the temperature stays still. Surface tension makes the water surface a skin, and cohesion and adhesion explain capillary action.",
   "تذكّر: القوى بين الجسيمات تمسك المادة معًا. القوى القوية تعني درجتي انصهار وغليان مرتفعتين. وأثناء الانصهار والغليان تثبت درجة الحرارة. والتوتر السطحي يجعل سطح الماء غشاءً، والتماسك والالتصاق يفسّران الخاصية الشعرية."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["krafter håller ihop partiklarna","k"],["starka krafter → hög smältpunkt","r"],["smälter/kokar: temperaturen står still","o"],["ytspänning: ytan är som en hinna","b"],["kohesion och adhesion → kapillärkraft","g"]],50,150,62,30)]},
]};
const PIC6={curve:()=>[...tfxActs(heatGraph(false),.5,30,120),A.p(R.arrow(182,318,166,296,0),"r",4),A.tx("?",190,345,34,"r")],surf:()=>tfxActs(surfaceMol(),.8,10,60)};
/* scale a list of path/text actions into a smaller box (for question pictures) */
function tfxActs(list,k,ox,oy){return list.map(a=>a.t==="path"?Object.assign({},a,{d:tfx(a.d,ox,oy,k),w:a.w*.8}):a.t==="hatch"?Object.assign({},a,{d:tfx(a.d,ox,oy,k)}):a.t==="text"?Object.assign({},a,{x:ox+a.x*k,y:oy+a.y*k,size:a.size*.8}):a)}
const BANK6=[
 {lv:0,q:"Vad håller ihop partiklarna i ett fast ämne?",a:"krafter som drar partiklarna mot varandra",w:["lim mellan atomerna","luften runt omkring","tyngdkraften från jorden"]},
 {lv:0,q:"Vid vilken temperatur kokar vatten vid normalt lufttryck?",a:"100 °C",w:["0 °C","50 °C","212 °C"],lines:["Vid vilken temperatur","kokar vatten?"]},
 {lv:0,q:"Vad kallas temperaturen där ett ämne smälter?",a:"smältpunkt",w:["kokpunkt","daggpunkt","nollpunkt"]},
 {lv:0,q:"Vilket djur kan gå på vattenytan tack vare ytspänningen?",a:"skräddaren",w:["abborren","kon","snigeln"],lines:["Vilket djur kan gå","på vattenytan?"]},
 {lv:1,q:"Järn smälter vid 1 538 °C och syre kokar vid −183 °C. Vad säger det om krafterna?",a:"krafterna mellan järnatomer är mycket starkare",w:["krafterna mellan syremolekyler är starkare","krafterna är lika starka","det finns inga krafter i järn"],lines:["Järn smälter vid 1 538 °C.","Syre kokar vid −183 °C.","Vad säger det om krafterna?"]},
 {lv:1,q:"Varför är en vattendroppe rund?",a:"ytspänningen drar ihop ytan så mycket som möjligt",w:["vatten är alltid runt","luften trycker från ett håll","droppen snurrar"]},
 {lv:1,q:"Vad händer om man droppar diskmedel bredvid ett gem som ligger på vattnet?",a:"gemet sjunker",w:["gemet flyter ännu bättre","gemet löses upp","vattnet fryser"],lines:["Diskmedel droppas bredvid","ett gem som ligger på vattnet.","Vad händer?"]},
 {lv:1,q:"Vad är ytspänning?",a:"att vattenytan beter sig som en tunn hinna",w:["att vatten är tyngre vid ytan","att vatten kokar vid ytan","att ytan är varmare"]},
 {lv:1,q:"Vad händer där kurvan är vågrät vid 0 °C?",a:"isen smälter",w:["vattnet kokar","vattnet kyls ner","ingenting händer"],lines:["Is värms jämnt.","Vad händer där kurvan","är vågrät vid 0 °C?"],pic:PIC6.curve},
 {lv:1,q:"Molekylen vid ytan dras bara åt sidorna och nedåt. Vad blir följden?",a:"ytan blir som en spänd hinna",w:["vattnet kokar","ytan blir varmare","molekylerna flyger iväg"],lines:["De röda molekylerna dras","åt hållen som pilarna visar.","Vad blir följden vid ytan?"],pic:PIC6.surf},
 {lv:1,q:"Skriv ordet: temperaturen där en vätska kokar kallas …",a:["kokpunkt","kokpunkten"],lines:["Skriv ordet som saknas:","Temperaturen där en vätska","kokar kallas …"]},
 {lv:2,q:"Varför stiger inte temperaturen medan isen smälter?",a:"energin går åt till att lossa partiklarna från varandra",w:["termometern slutar fungera","isen släpper ut kyla","energin försvinner"]},
 {lv:2,q:"Vad är skillnaden mellan avdunstning och kokning?",a:"avdunstning sker vid ytan, kokning i hela vätskan",w:["avdunstning sker bara vid 100 °C","kokning sker bara vid ytan","det är ingen skillnad"]},
 {lv:2,q:"Gemet är av stål, som har högre densitet än vatten. Varför kan det ändå ligga på ytan?",a:"ytspänningen bär upp det",w:["det är fullt av luft","stål flyter alltid","vattnet blir tätare under gemet"],lines:["Gemet är av stål. Varför kan","det ändå ligga på vattenytan?"]},
 {lv:2,q:"Vatten stiger uppåt i ett tunt glasrör. Vad kallas det?",a:"kapillärkraft",w:["tyngdkraft","friktion","lufttryck"]},
 {lv:2,q:"Vad kallas kraften mellan vattenmolekyler och glaset?",a:"adhesion",w:["kohesion","friktion","densitet"]},
 {lv:2,q:"Vad kallas kraften mellan vattenmolekylerna själva?",a:"kohesion",w:["adhesion","friktion","densitet"]},
 {lv:2,q:"Skriv ordet: när en vätska blir gas vid ytan, utan att koka, kallas det …",a:["avdunstning","avdunstningen"],lines:["Skriv ordet som saknas:","Vätska blir gas vid ytan","utan att koka. Det kallas …"]},
];
LESSONS.push({id:"f7m6",subject:"science",grades:"7",kind:"wb",year:7,ord:6,
 title:t3("Lär mer: Materia hålls ihop av krafter","Learn more: Forces hold matter together","تعلّم أكثر: القوى تمسك المادة معًا"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M60 60L72 52L84 68L96 52L108 68L120 60M60 120L72 112L84 128L96 112L108 128L120 120M40 80L32 92L48 100L32 108L40 120M140 80L132 92L148 100L132 108L140 120" stroke="#9aa3b2" stroke-width="3" fill="none"/>${[[40,60],[140,60],[40,120],[140,120]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="16" fill="#e6eefc" stroke="#2257c9" stroke-width="3"/>`).join("")}<path d="M180 120Q240 140 300 120" stroke="#2257c9" stroke-width="4" fill="none"/><ellipse cx="240" cy="100" rx="28" ry="22" fill="#e6eefc" stroke="#2257c9" stroke-width="3"/></svg>`,
 steps:VM6.steps,mount:wbMount(VM6),gen:bankGen(BANK6)});
WORDS.f7m6=["f7_smaltpunkt","f7_kokpunkt","f7_ytspanning","f7_kohesion","f7_adhesion","f7_avdunstning"];

/* ===================================================================
   7. f7m7: Lär mer: Idéer om materia
   =================================================================== */
TERM("f7_modell",{sv:"modell",m:W("modell(en|er|erna)?"),d:t3("En förenklad bild av något vi inte kan se direkt. Den hjälper oss att förstå och förutsäga.","A simplified picture of something we cannot see directly. It helps us understand and predict.","صورة مبسّطة لشيء لا نستطيع رؤيته مباشرة، تساعدنا على الفهم والتوقّع."),ex:"Bohrs atommodell.",tr:{en:"model",ar:"نموذج"}});
TERM("f7_teori",{sv:"teori",m:W("teori(n|er|erna)?"),d:t3("En förklaring som bygger på många observationer och experiment.","An explanation built on many observations and experiments.","تفسير مبني على ملاحظات وتجارب كثيرة."),ex:"Daltons atomteori.",tr:{en:"theory",ar:"نظرية"}});
TERM("f7_element",{sv:"de fyra elementen",m:W("element(en)?"),d:t3("Aristoteles idé att allt består av jord, vatten, luft och eld.","Aristotle's idea that everything is made of earth, water, air and fire.","فكرة أرسطو أن كل شيء يتكوّن من التراب والماء والهواء والنار."),ex:"Eld är varm och torr.",tr:{en:"the four elements",ar:"العناصر الأربعة"}});
TERM("f7_skal",{sv:"elektronskal",m:W("(elektron)?skal(et|en)?"),d:t3("Bestämda avstånd från kärnan där elektronerna rör sig i Bohrs modell.","Fixed distances from the nucleus where the electrons move in Bohr's model.","مسافات محدّدة من النواة تتحرك فيها الإلكترونات في نموذج بور."),ex:"Natrium har 2, 8 och 1 elektroner i sina skal.",tr:{en:"electron shell",ar:"غلاف إلكتروني"}});
TERM("f7_alfa",{sv:"alfapartikel",m:W("alfapartik(el|eln|lar|larna)"),d:t3("En liten, positivt laddad partikel som Rutherford sköt mot guldfolie.","A small, positively charged particle that Rutherford fired at gold foil.","جسيم صغير موجب الشحنة أطلقه رذرفورد على رقاقة الذهب."),ex:"De flesta alfapartiklar gick rakt igenom.",tr:{en:"alpha particle",ar:"جسيم ألفا"}});

const pudding=(x,y,r,move=false)=>{const E=[[-60,-50],[40,-70],[80,10],[-20,0],[-80,40],[30,60],[0,-110],[100,-60],[-100,-20],[70,90]].filter(([a,b])=>Math.hypot(a,b)<r-20);
  return[A.hatch(R.circ(x,y,r),"p"),A.p(R.circ(x,y,r),"p",4),...sg([[-30,-80],[60,-30],[-60,70],[10,30],[-100,10],[80,50]].filter(([a,b])=>Math.hypot(a,b)<r-20).map(([a,b])=>[x+a,y+b]),"+",28),...E.flatMap(([a,b])=>chg(x+a,y+b,14,"–"))]};
const stadium=(x,y)=>[A.hatch(ellP(x,y,150,95),"g"),A.p(ellP(x,y,150,95)+ellP(x,y,120,70),"g",3),A.p(R.circ(x,y,4),"r",4)];
const daltonSym=(x,y,k,r=36)=>k==="H"?[A.p(R.circ(x,y,r),"k",4),A.p(R.circ(x,y,4),"k",6)]:k==="O"?[A.p(R.circ(x,y,r),"k",4)]:[A.hatch(R.circ(x,y,r),"k"),A.hatch(R.circ(x,y,r),"k"),A.p(R.circ(x,y,r),"k",4)];
const goldFoil=(move=true)=>{const B=[["M140 270 L760 270",5],["M140 280 L760 280",5],["M140 290 L760 290",5]];
  return[A.p(R.rect(60,250,80,60,.3),"k",3.5),A.tx("källa",100,340,22),A.p("M400 140 L400 420","o",7),
   ...(move?[...B.map(([d,n],i)=>A.flow(d,"r",n,2.6+i*.3,6)),A.flow("M140 278 L398 278 L700 150","r",2,3,6),A.flow("M140 284 L396 284 L160 420","r",1,3.2,6)]
    :[A.p("M140 270 L760 270 M140 280 L760 280 M140 290 L760 290","r",2.5),A.p("M140 278 L398 278 L700 150 M140 284 L396 284 L160 420","r",2.5)])]};
const VM7={steps:[
 {say:t3("I mer än 2 400 år har människor funderat på vad materia egentligen är. Idéerna har ändrats många gånger. Varje gång ett nytt experiment visade något som den gamla modellen inte kunde förklara fick forskarna tänka om. Så fungerar naturvetenskap.",
   "For more than 2,400 years people have wondered what matter really is. The ideas have changed many times. Every time a new experiment showed something the old model could not explain, scientists had to think again. That is how science works.",
   "منذ أكثر من 2400 سنة يتساءل الناس عن حقيقة المادة. وقد تغيّرت الأفكار مرّات كثيرة، فكلما أظهرت تجربة جديدة شيئًا لا يستطيع النموذج القديم تفسيره اضطرّ العلماء إلى إعادة التفكير. هكذا يعمل العلم."),
  draw:()=>{const T=[[90,"ca 400 f.Kr.","Demokritos",-1],[205,"ca 350 f.Kr.","Aristoteles",1],[370,"1803","Dalton",-1],[490,"1897","Thomson",1],[600,"1911","Rutherford",-1],[710,"1913","Bohr",1]];
   return[A.wipe(),ttl("Idéer om materia"),A.p("M50 280 L280 280 M300 280 L760 280 M748 270 L760 280 L748 290 M278 270 L288 290 M292 270 L302 290","k",3.5),
    ...T.flatMap(([x,yr,n,s])=>[A.p(R.circ(x,280,7),"b",4),A.tx(yr,x,s<0?205:330,24,"#5b6475"),A.tx(n,x,s<0?240:368,28,"b")]),note("Nya experiment → nya modeller",450,"g",30)]}},
 {say:t3("Den grekiske filosofen Demokritos tänkte så här: om man delar en sten i mindre och mindre bitar, måste man till slut komma till en bit som inte går att dela. Han kallade den atomos, som betyder odelbar. Han gjorde inga experiment, han resonerade.",
   "The Greek philosopher Democritus reasoned like this: if you split a stone into smaller and smaller pieces, you must finally reach a piece that cannot be split. He called it atomos, which means indivisible. He did no experiments; he reasoned.",
   "فكّر الفيلسوف اليوناني ديموقريطس هكذا: إذا قسمت حجرًا إلى قطع أصغر فأصغر فلا بدّ أن تصل في النهاية إلى قطعة لا يمكن تقسيمها. وسمّاها أتوموس، أي غير القابلة للانقسام. لم يُجرِ تجارب، بل استخدم التفكير."),
  draw:()=>{const S=[[60,120],[230,60],[350,30],[430,15],[490,8]];return[A.wipe(),ttl("Demokritos, ca 460–370 f.Kr."),...S.flatMap(([x,s],i)=>{const d=poly([[x,250-s/2],[x+s,250-s/2],[x+s,250+s/2],[x,250+s/2]]);
    return[A.hatch(d,"k"),A.p(d,"#5b6475",3),...(i<4?[A.arrow(x+s+10,250,S[i+1][0]-12,250,"k")]:[])]}),A.tx("…",540,262,40),...balls([[620,250]],8,"r"),A.tx("atomos",620,210,32,"r"),
   A.tx("atomos = odelbar",400,370,44,"r"),A.tx("Han resonerade – utan experiment.",400,440,28,"#5b6475")]}},
 {say:t3("Aristoteles trodde inte på atomer. Han menade att allt består av fyra element: jord, vatten, luft och eld, med egenskaperna varm, kall, torr och fuktig. Eld är varm och torr, vatten kallt och fuktigt. Hans idé styrde tänkandet i nästan 2 000 år.",
   "Aristotle did not believe in atoms. He thought that everything is made of four elements: earth, water, air and fire, with the qualities hot, cold, dry and wet. Fire is hot and dry, water cold and wet. His idea ruled people's thinking for almost 2,000 years.",
   "لم يؤمن أرسطو بالذرّات، بل رأى أن كل شيء يتكوّن من أربعة عناصر: التراب والماء والهواء والنار، بصفات الحار والبارد والجاف والرطب. فالنار حارّة جافّة، والماء بارد رطب. وقد سيطرت فكرته على التفكير قرابة 2000 سنة."),
  draw:()=>[A.wipe(),A.tx("Aristoteles, 384–322 f.Kr.",400,50,36,"b"),A.p("M400 130 L600 280 L400 430 L200 280 Z","#9aa3b2",3),
   A.tx("eld",400,118,38,"r"),A.tx("luft",640,292,38,"b"),A.tx("vatten",400,470,38,"b"),A.tx("jord",160,292,38,"#8a5a2b"),
   A.tx("varm",530,190,28,"o"),A.tx("fuktig",530,385,28,"b"),A.tx("kall",270,385,28,"b"),A.tx("torr",270,190,28,"o"),A.tx("fyra element",400,292,30,"k")]},
 {say:t3("År 1803 kom John Dalton med en ny atomteori. Varje grundämne har sitt eget slags atomer med egen massa, och atomer kan inte skapas eller förstöras. Han ritade atomer som små kulor med egna tecken. Dalton trodde att vatten var HO, i dag vet vi att det är H₂O.",
   "In 1803 John Dalton came up with a new atomic theory. Each element has its own kind of atom with its own mass, and atoms cannot be created or destroyed. He drew atoms as small balls with their own symbols. Dalton thought water was HO; today we know it is H₂O.",
   "في عام 1803 قدّم جون دالتون نظرية ذرّية جديدة: لكل عنصر نوع خاص من الذرّات بكتلة خاصة، والذرّات لا تُخلق ولا تفنى. ورسم الذرّات كرات صغيرة لكل منها رمز. ظنّ دالتون أن الماء HO، ونعرف اليوم أنه H₂O."),
  draw:()=>[A.wipe(),ttl("Dalton 1803: atomer som kulor"),...daltonSym(170,190,"H"),...daltonSym(400,190,"O"),...daltonSym(630,190,"C"),A.tx("väte",170,265,28),A.tx("syre",400,265,28),A.tx("kol",630,265,28),
   A.tx("Dalton: vatten =",250,360,30,"k","end"),...daltonSym(300,350,"H",24),...daltonSym(352,350,"O",24),A.tx("HO",420,360,30,"r","start"),
   A.tx("I dag: H₂O",250,430,30,"g","end"),...h2o(330,418,1),A.tx("varje grundämne: egna atomer",590,430,24,"b")]},
 {say:t3("År 1897 upptäckte J. J. Thomson elektronen, en negativ partikel som är mycket mindre än en atom. Då kunde atomen inte vara odelbar! Thomson föreslog russinbullemodellen: atomen är en positiv ”deg” med negativa elektroner instuckna som russin.",
   "In 1897 J. J. Thomson discovered the electron, a negative particle much smaller than an atom. So the atom could not be indivisible! Thomson suggested the plum pudding model: the atom is a positive 'dough' with negative electrons stuck in like raisins.",
   "في عام 1897 اكتشف ج. ج. طومسون الإلكترون، وهو جسيم سالب أصغر بكثير من الذرّة. إذن لا يمكن أن تكون الذرّة غير قابلة للانقسام! واقترح طومسون نموذج كعكة الزبيب: الذرّة «عجينة» موجبة غُرست فيها إلكترونات سالبة مثل الزبيب."),
  draw:()=>[A.wipe(),ttl("Thomson 1897: elektronen"),...pudding(240,290,150),A.tx("elektronen är",430,170,30,"k","start"),A.tx("mycket mindre än atomen",430,210,30,"k","start"),
   A.tx("russinbullemodellen:",430,290,30,"p","start"),A.tx("positiv ”deg”",430,335,28,"r","start"),A.tx("negativa ”russin”",430,380,28,"b","start")]},
 {say:t3("År 1911 förklarade Ernest Rutherford ett berömt försök. Positiva alfapartiklar sköts mot en tunn guldfolie. Nästan alla gick rakt igenom, men några böjdes av och någon enstaka studsade tillbaka! Det gick inte att förklara med russinbullemodellen.",
   "In 1911 Ernest Rutherford explained a famous experiment. Positive alpha particles were fired at thin gold foil. Almost all went straight through, but some were deflected and the odd one bounced back! That could not be explained with the plum pudding model.",
   "في عام 1911 فسّر إرنست رذرفورد تجربة مشهورة: أُطلقت جسيمات ألفا الموجبة على رقاقة ذهب رقيقة. مرّ معظمها مباشرة، لكن بعضها انحرف وارتدّ القليل منها إلى الخلف! ولم يكن ممكنًا تفسير ذلك بنموذج كعكة الزبيب."),
  draw:()=>[A.wipe(),ttl("Rutherfords guldfolie"),...goldFoil(true),A.tx("guldfolie",400,120,28,"o"),A.tx("alfapartiklar",230,240,24,"r"),A.tx("några böjs av",470,150,26,"k","start"),
   A.tx("nästan alla går rakt igenom",590,330,24,"k"),A.tx("någon studsar tillbaka!",90,470,26,"r","start")]},
 {say:t3("Rutherfords slutsats: nästan all massa och all positiv laddning finns i en pytteliten kärna i mitten. Resten av atomen är nästan tom, och där rör sig elektronerna. Om atomen vore lika stor som en fotbollsarena skulle kärnan vara ungefär som ett knappnålshuvud.",
   "Rutherford's conclusion: almost all the mass and all the positive charge is in a tiny nucleus in the middle. The rest of the atom is almost empty, and that is where the electrons move. If the atom were as big as a football stadium, the nucleus would be about the size of a pinhead.",
   "استنتج رذرفورد أن معظم الكتلة وكل الشحنة الموجبة موجودة في نواة صغيرة جدًا في الوسط، وأن بقية الذرّة شبه فارغة وفيها تتحرك الإلكترونات. لو كانت الذرّة بحجم ملعب كرة قدم لكانت النواة بحجم رأس دبّوس تقريبًا."),
  draw:()=>[A.wipe(),ttl("Rutherford 1911: en liten kärna"),A.p(R.circ(200,270,140),"#c7cfdc",2),...balls([[200,270]],6,"r"),A.flow("M200 160 a110 110 0 1 1 0 220 a110 110 0 1 1 0 -220","b",3,6,7),
   A.flow("M200 210 a60 60 0 1 0 0 120 a60 60 0 1 0 0 -120","b",2,4,7),A.tx("kärna",200,450,28,"r"),...stadium(590,270),A.tx("atomen = fotbollsarena",590,410,26,"g"),A.tx("kärnan = knappnålshuvud",590,450,26,"r")]},
 {say:t3("År 1913 förbättrade Niels Bohr modellen. Elektronerna kan bara röra sig i bestämda skal på vissa avstånd från kärnan. När en elektron hoppar till ett inre skal sänds ljus ut. Här är en natriumatom med 2, 8 och 1 elektroner i sina skal.",
   "In 1913 Niels Bohr improved the model. The electrons can only move in fixed shells at certain distances from the nucleus. When an electron jumps to an inner shell, light is given out. Here is a sodium atom with 2, 8 and 1 electrons in its shells.",
   "في عام 1913 حسّن نيلز بور النموذج: لا تتحرك الإلكترونات إلا في أغلفة محدّدة على مسافات معيّنة من النواة، وعندما يقفز إلكترون إلى غلاف داخلي يُطلق ضوءًا. هذه ذرّة صوديوم فيها 2 و8 و1 إلكترونات في أغلفتها."),
  draw:()=>[A.wipe(),ttl("Bohr 1913: elektronskal"),...atom(240,285,11,12,[[60,2],[115,8],[170,1]],true,7),A.p(R.arrow(386,200,350,226,10),"v",3.5),wave(420,200,600,150,"o",7,5),
   A.tx("ljus",620,150,30,"o","start"),A.tx("bestämda skal",450,300,30,"b","start"),A.tx("hopp inåt → ljus",450,350,30,"v","start"),A.tx("natrium: 2 + 8 + 1",450,420,30,"k","start")]},
 {say:t3("I dag beskriver vi elektronerna som ett moln runt kärnan, där vi bara kan säga var de troligen finns. Men Bohrs modell är fortfarande bra i skolan. Kom ihåg: modeller är förenklingar, och de förbättras när nya experiment visar något nytt.",
   "Today we describe the electrons as a cloud around the nucleus, where we can only say where they probably are. But Bohr's model is still good in school. Remember: models are simplifications, and they are improved when new experiments show something new.",
   "نصف الإلكترونات اليوم بأنها سحابة حول النواة، لا نستطيع إلا أن نقول أين توجد على الأرجح. لكن نموذج بور ما زال مفيدًا في المدرسة. تذكّر: النماذج تبسيطات، وتتحسّن عندما تُظهر التجارب الجديدة شيئًا جديدًا."),
  draw:()=>{let d="";for(let i=0;i<150;i++){const a=rnd(i*3.1)*Math.PI*2,r=20+Math.pow(rnd(i*7.7),1.6)*120;d+=`M${P2(180+Math.cos(a)*r,280+Math.sin(a)*r)}l.1 0`}
   return[A.wipe(),ttl("I dag: elektronmoln"),A.p(d,"b",5),...balls([[180,280]],8,"r"),...blist([["Demokritos: odelbara atomer","k"],["Dalton: atomer som kulor","k"],["Thomson: elektroner","p"],["Rutherford: liten kärna","r"],["Bohr: elektronskal","b"],["i dag: elektronmoln","g"]],360,140,54,28)]}},
]};
const PIC7={foil:()=>tfxActs(goldFoil(false).filter(a=>a.t!=="text"),.5,10,150),pud:()=>tfxActs(pudding(400,280,150),.85,-140,40)};
const BANK7=[
 {lv:0,q:"Vad betyder det grekiska ordet atomos?",a:"odelbar",w:["liten boll","osynlig","tung"]},
 {lv:0,q:"Vilka var Aristoteles fyra element?",a:"jord, vatten, luft och eld",w:["väte, syre, kol och kväve","protoner, neutroner, elektroner och kärnor","is, vatten, ånga och moln"]},
 {lv:0,q:"Vilken partikel upptäckte Thomson?",a:"elektronen",w:["protonen","neutronen","atomkärnan"]},
 {lv:0,q:"Vem kom på att elektronerna rör sig i bestämda skal?",a:"Niels Bohr",w:["Demokritos","Aristoteles","John Dalton"],lines:["Vem kom på att elektronerna","rör sig i bestämda skal?"]},
 {lv:1,q:"Vad kallas Thomsons atommodell?",a:"russinbullemodellen",w:["skalmodellen","kärnmodellen","elementmodellen"]},
 {lv:1,q:"Hur kom Demokritos fram till sin idé om atomer?",a:"genom att resonera, utan experiment",w:["med ett mikroskop","genom att skjuta partiklar mot guld","genom att väga gaser"],lines:["Hur kom Demokritos fram","till sin idé om atomer?"]},
 {lv:1,q:"Vad trodde Dalton om atomer?",a:"varje grundämne har sitt eget slags atomer",w:["alla atomer är likadana","atomer består av fyra element","atomer är fulla av russin"]},
 {lv:1,q:"Vad visade försöket på bilden?",a:"atomen är nästan tom med en liten kärna",w:["atomen är en massiv kula","guld består av elektroner","atomer går inte att träffa"],lines:["Alfapartiklar mot guldfolie.","Vad visade försöket?"],pic:PIC7.foil},
 {lv:1,q:"Varför ändrar forskare sina modeller?",a:"nya experiment visar saker som den gamla modellen inte kan förklara",w:["för att det ska bli modernare","för att de glömmer de gamla","för att modeller måste bytas varje år"]},
 {lv:1,q:"Vilken modell visar bilden?",a:"Thomsons russinbullemodell",w:["Bohrs skalmodell","Daltons kulmodell","Aristoteles fyra element"],lines:["Vilken modell","visar bilden?"],pic:PIC7.pud},
 {lv:1,q:"Skriv ordet: elektronerna i Bohrs modell rör sig i bestämda …",a:["skal","skalen","elektronskal"],lines:["Skriv ordet som saknas:","I Bohrs modell rör sig","elektronerna i bestämda …"]},
 {lv:2,q:"I Rutherfords försök studsade några alfapartiklar tillbaka. Vad betydde det?",a:"de träffade en liten, tät och positiv kärna",w:["guldet var magnetiskt","alfapartiklarna var negativa","folien hade hål"],lines:["Några alfapartiklar studsade","tillbaka. Vad betydde det?"]},
 {lv:2,q:"Om atomen vore lika stor som en fotbollsarena, hur stor vore kärnan?",a:"som ett knappnålshuvud",w:["som en fotboll","som halva arenan","som en bil"],lines:["Atomen = en fotbollsarena.","Hur stor är kärnan?"]},
 {lv:2,q:"Varför var Thomsons upptäckt ett problem för idén om odelbara atomer?",a:"elektronen är en del av atomen, så atomen kan delas",w:["elektronen är större än atomen","elektronen finns bara i guld","elektronen är oladdad"],lines:["Varför var elektronen ett","problem för idén om","odelbara atomer?"]},
 {lv:2,q:"Vilken formel trodde Dalton att vatten hade?",a:"HO",w:["H₂O","H₂O₂","HO₂"]},
 {lv:2,q:"Vilken ordning kom modellerna i?",a:"Dalton, Thomson, Rutherford, Bohr",w:["Thomson, Dalton, Bohr, Rutherford","Bohr, Rutherford, Thomson, Dalton","Rutherford, Dalton, Thomson, Bohr"]},
 {lv:2,q:"Vad sänds ut när en elektron hoppar till ett inre skal i Bohrs modell?",a:"ljus",w:["en proton","en neutron","en ny atom"],lines:["En elektron hoppar till","ett inre skal.","Vad sänds ut?"]},
 {lv:2,q:"Skriv namnet: forskaren som tolkade försöket med guldfolien hette …",a:["Rutherford","Ernest Rutherford"],lines:["Skriv namnet:","Forskaren som tolkade","guldfolie-försöket hette …"]},
];
LESSONS.push({id:"f7m7",subject:"science",grades:"7",kind:"wb",year:7,ord:7,
 title:t3("Lär mer: Idéer om materia","Learn more: Ideas about matter","تعلّم أكثر: أفكار عن المادة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M20 140H300" stroke="#1d2433" stroke-width="3"/><circle cx="60" cy="80" r="26" fill="#e3e6ec" stroke="#1d2433" stroke-width="3"/><circle cx="160" cy="80" r="30" fill="#f5d0e0" stroke="#c2417a" stroke-width="3"/><circle cx="150" cy="70" r="5" fill="#2257c9"/><circle cx="172" cy="94" r="5" fill="#2257c9"/><circle cx="260" cy="80" r="5" fill="#d63b2f"/><circle cx="260" cy="80" r="22" fill="none" stroke="#9fb3d1" stroke-width="2"/><circle cx="260" cy="80" r="40" fill="none" stroke="#9fb3d1" stroke-width="2"/><circle cx="282" cy="80" r="5" fill="#2257c9"/><circle cx="260" cy="40" r="5" fill="#2257c9"/></svg>`,
 steps:VM7.steps,mount:wbMount(VM7),gen:bankGen(BANK7)});
WORDS.f7m7=["f7_modell","f7_teori","f7_element","f7_skal","f7_alfa","f7_karna","f7_elektron"];

/* ===================================================================
   8. f7m8: Lär mer: Nanoforskning
   =================================================================== */
TERM("f7_nanometer",{sv:"nanometer",m:W("nanometer(n)?"),d:t3("En miljarddels meter, 0,000 000 001 m. Förkortas nm.","One billionth of a metre, 0.000 000 001 m. Written nm.","جزء من مليار من المتر، ويُختصر nm."),ex:"Ett virus är ungefär 100 nm.",tr:{en:"nanometre",ar:"نانومتر"}});
TERM("f7_nanoteknik",{sv:"nanoteknik",m:W("nano(teknik|teknologi|forskning)(en)?"),d:t3("Forskning och teknik med saker som är ungefär 1–100 nm stora.","Research and technology with things about 1–100 nm in size.","بحث وتقنية تتعامل مع أشياء حجمها نحو 1 إلى 100 نانومتر."),ex:"Självrengörande fönster är nanoteknik.",tr:{en:"nanotechnology",ar:"تقنية النانو"}});
TERM("f7_nanopartikel",{sv:"nanopartikel",m:W("nanopartik(el|eln|lar|larna)"),d:t3("En partikel som bara är några nanometer stor.","A particle that is only a few nanometres in size.","جسيم لا يتجاوز حجمه بضعة نانومترات."),ex:"Nanopartiklar av zinkoxid i solkräm.",tr:{en:"nanoparticle",ar:"جسيم نانوي"}});
TERM("f7_lotus",{sv:"lotuseffekten",m:W("lotuseffekt(en)?"),d:t3("Att vatten rullar av en yta med små knottror och tar med sig smuts.","That water rolls off a surface with tiny bumps and takes dirt with it.","أن الماء يتدحرج عن سطح ذي نتوءات دقيقة ويأخذ معه الأوساخ."),ex:"Lotusbladet blir aldrig smutsigt.",tr:{en:"lotus effect",ar:"تأثير اللوتس"}});
TERM("f7_grafen",{sv:"grafen",m:W("grafen(et)?"),d:t3("Ett lager kolatomer i sexhörningar som bara är en atom tjockt.","A layer of carbon atoms in hexagons that is only one atom thick.","طبقة من ذرّات الكربون في أشكال سداسية سمكها ذرّة واحدة."),ex:"Grafen är mycket starkt.",tr:{en:"graphene",ar:"الغرافين"}});

const hexes=(x0,y0,cols,rows,a)=>{let d="";const V=new Map(),w=Math.sqrt(3)*a;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const cx=x0+c*w+(r%2?w/2:0),cy=y0+r*a*1.5;
  const pts=[0,1,2,3,4,5].map(i=>{const t=Math.PI/180*(60*i-30);return[cx+a*Math.cos(t),cy+a*Math.sin(t)]});d+=poly(pts);pts.forEach(p=>V.set(Math.round(p[0]/4)+","+Math.round(p[1]/4),p))}return{d,V:[...V.values()]}};
const graphene=(x0,y0,cols,rows,a)=>{const H=hexes(x0,y0,cols,rows,a);return[A.p(H.d,"#9aa3b2",2.5),...balls(H.V,7,"k")]};
const bumps=(x0,x1,y,h=30,step=48)=>{let d=`M${x0} ${y}`,t="";for(let x=x0;x<x1;x+=step){d+=`Q${x+step/2} ${y-h*2} ${x+step} ${y}`;for(let k=-2;k<=2;k++){const xx=x+step/2+k*6,yy=y-h+Math.abs(k)*5;t+=`M${P2(xx,yy)}L${P2(xx+k*1.5,yy-8)}`}}return[A.p(d,"g",3.5),A.p(t,"g",2)]};
const cubeN=(x,yb,s,n,c)=>{const d=s*.4;let p=poly([[x,yb-s],[x+s,yb-s],[x+s,yb],[x,yb]])+poly([[x,yb-s],[x+d,yb-s-d],[x+s+d,yb-s-d],[x+s,yb-s]],false)+poly([[x+s+d,yb-s-d],[x+s+d,yb-d],[x+s,yb]],false),g="";
  for(let i=1;i<n;i++){const t=s*i/n,u=d*i/n;g+=`M${P2(x+t,yb-s)}L${P2(x+t,yb)}M${P2(x,yb-s+t)}L${P2(x+s,yb-s+t)}M${P2(x+t,yb-s)}L${P2(x+t+d,yb-s-d)}M${P2(x+u,yb-s-u)}L${P2(x+s+u,yb-s-u)}M${P2(x+s+u,yb-s-u)}L${P2(x+s+u,yb-u)}M${P2(x+s,yb-s+t)}L${P2(x+s+d,yb-s+t-d)}`}
  return[A.hatch(poly([[x,yb-s],[x+s,yb-s],[x+s,yb],[x,yb]]),c),...(g?[A.p(g,c,1.8)]:[]),A.p(p,c,3.5)]};
const tee=(x,y,s=1)=>A.p(tfx("M-60 -60 L-28 -78 Q0 -64 28 -78 L60 -60 L50 -28 L34 -34 L34 62 L-34 62 L-34 -34 L-50 -28 Z",x,y,s),"b",3.5);
const SCALE=[["hårstrå","80 000 nm",4.9],["blodkropp","7 000 nm",3.85],["bakterie","1 000 nm",3],["virus","100 nm",2],["DNA","2 nm",.3],["atom","0,1 nm",-1]];
const scaleX=l=>f1(80+(5-l)*112);
const VM8={steps:[
 {say:t3("Ordet nano kommer från grekiskans nanos, som betyder dvärg. En nanometer är en miljarddels meter. Dela en meter i tusen delar och du får en millimeter. Dela igen i tusen så får du en mikrometer, och en gång till så får du en nanometer.",
   "The word nano comes from the Greek nanos, which means dwarf. A nanometre is one billionth of a metre. Split a metre into a thousand parts and you get a millimetre. Split again into a thousand and you get a micrometre, and once more and you get a nanometre.",
   "كلمة نانو مأخوذة من الكلمة اليونانية نانوس وتعني القزم. والنانومتر جزء من مليار من المتر. قسّم المتر إلى ألف جزء تحصل على المليمتر، ثم قسّمه إلى ألف تحصل على الميكرومتر، ومرة أخرى تحصل على النانومتر."),
  draw:()=>[A.wipe(),ttl("Nano – en miljarddel"),...[["1 m","meter",""],["1 mm","millimeter","tusendel"],["1 µm","mikrometer","miljondel"],["1 nm","nanometer","miljarddel"]].flatMap(([a,b,c],i)=>{const x=100+i*200,col=i===3?"r":"b";
    return[A.p(R.rect(x-62,175,124,72,.4),col,3.5),A.tx(a,x,227,40,col),A.tx(b,x,290,24,"k"),...(c?[A.tx(c,x,325,24,"#5b6475")]:[]),...(i<3?[A.arrow(x+68,211,x+132,211,"k"),A.tx("÷ 1 000",x+100,195,20,"o")]:[])]}),
   A.tx("1 nm = 0,000 000 001 m",400,420,44,"r")]},
 {say:t3("Hur litet är det? Ett hårstrå är ungefär 80 000 nm tjockt. En röd blodkropp är ungefär 7 000 nm, en bakterie 1 000 nm och ett virus ungefär 100 nm. DNA-tråden är 2 nm bred och en atom bara några tiondels nanometer. Varje steg på linjen är tio gånger mindre.",
   "How small is it? A hair is about 80,000 nm thick. A red blood cell is about 7,000 nm, a bacterium 1,000 nm and a virus about 100 nm. The DNA strand is 2 nm wide and an atom only a few tenths of a nanometre. Each step on the line is ten times smaller.",
   "ما مدى صغره؟ سُمك الشعرة نحو 80 ألف نانومتر، وكرية الدم الحمراء نحو 7 آلاف، والبكتيريا ألف، والفيروس نحو 100 نانومتر. وعرض خيط الحمض النووي 2 نانومتر، والذرّة بضعة أعشار النانومتر فقط. وكل خطوة على الخط أصغر بعشر مرات."),
  draw:()=>{const I=[()=>A.p("M60 330 Q90 250 120 170","#8a5a2b",14),x=>A.p(ellP(x,260,38,24)+ellP(x,260,16,8),"r",3.5),x=>A.p(`M${x-36} 248 Q${x-48} 260 ${x-36} 272 L${x+36} 272 Q${x+48} 260 ${x+36} 248 Z`,"g",3.5),
    x=>A.p(R.circ(x,260,24)+[...Array(10)].map((_,i)=>{const a=i*Math.PI/5;return`M${P2(x+Math.cos(a)*24,260+Math.sin(a)*24)}L${P2(x+Math.cos(a)*34,260+Math.sin(a)*34)}`}).join(""),"v",3),
    x=>A.p(`M${x-12} 210 Q${x+24} 235 ${x-12} 260 Q${x-48} 285 ${x-12} 310 M${x+12} 210 Q${x-24} 235 ${x+12} 260 Q${x+48} 285 ${x+12} 310`,"b",3),x=>A.p(R.circ(x,260,8),"k",4)];
   return[A.wipe(),ttl("Hur litet är nano?"),A.p("M60 370 L770 370 M758 360 L770 370 L758 380","k",3),...SCALE.flatMap(([n,v,l],i)=>{const x=+scaleX(l);return[I[i](x),A.p(`M${x} 362 L${x} 378`,"k",3),A.tx(n,x,412,24,"k"),A.tx(v,x,445,22,"b")]}),
    A.tx("mindre →",760,330,24,"#5b6475","end")]}},
 {say:t3("Små saker har stor yta. Dela en kub på 1 cm³ i 8 mindre kuber, så fördubblas ytan från 6 till 12 cm². Delar man den ända ner till kuber på 1 nm blir ytan nästan lika stor som en fotbollsplan. Därför reagerar nanopartiklar lätt och kan få nya egenskaper.",
   "Small things have a large surface. Cut a cube of 1 cm³ into 8 smaller cubes, and the surface doubles from 6 to 12 cm². If you cut it all the way down to cubes of 1 nm, the surface becomes almost as big as a football pitch. That is why nanoparticles react easily and can get new properties.",
   "الأشياء الصغيرة لها مساحة سطح كبيرة. قسّم مكعبًا حجمه 1 سم³ إلى 8 مكعبات أصغر فتتضاعف المساحة من 6 إلى 12 سم². وإذا قسّمته حتى مكعبات طولها 1 نانومتر صارت المساحة تقارب ملعب كرة قدم. لذلك تتفاعل الجسيمات النانوية بسهولة وقد تكتسب خصائص جديدة."),
  draw:()=>[A.wipe(),ttl("Mindre bitar – större yta"),...cubeN(70,320,130,1,"o"),...cubeN(320,320,130,2,"o"),...cubeN(570,320,130,4,"o"),
   A.tx("1 kub",160,375,28,"k"),A.tx("8 kuber",410,375,28,"k"),A.tx("64 kuber",660,375,28,"k"),A.tx("yta 6 cm²",160,415,28,"o"),A.tx("12 cm²",410,415,28,"o"),A.tx("24 cm²",660,415,28,"o"),
   note("Samma volym – mycket större yta",470,"g",30)]},
 {say:t3("Lotusblomman har blad som alltid är rena. Ytan är täckt av små knottror med ännu mindre vaxkristaller i nanostorlek. Vattendroppar kan inte fästa, utan rullar av och tar med sig smutsen. Det kallas lotuseffekten och används i självrengörande färg och kläder.",
   "The lotus flower has leaves that are always clean. The surface is covered with tiny bumps with even smaller nano-sized wax crystals. Water drops cannot stick, but roll off and take the dirt with them. This is called the lotus effect and is used in self-cleaning paint and clothes.",
   "لزهرة اللوتس أوراق نظيفة دائمًا، فسطحها مغطّى بنتوءات صغيرة عليها بلّورات شمع أصغر بحجم النانو. لا تستطيع قطرات الماء الالتصاق بها، بل تتدحرج وتأخذ الأوساخ معها. ويسمّى هذا تأثير اللوتس، ويُستخدم في الدهانات والملابس ذاتية التنظيف."),
  draw:()=>[A.wipe(),ttl("Lotuseffekten"),...art("lily",680,150,1.2),...bumps(60,740,380),A.p(dotsP([[150,352],[290,350],[440,353],[600,351]]),"#8a5a2b",8),
   A.flow("M700 315 L80 315","b",1,7,33),A.tx("droppen rullar och tar med smutsen",380,240,28,"b"),...callout([108,352],140,450,"knottror med nanovax","g",26)]},
 {say:t3("Grafen är ett lager kolatomer i ett mönster av sexhörningar, bara en atom tjockt. Det är ett av de starkaste material vi känner till, leder ström mycket bra och är nästan genomskinligt. Forskarna som tog fram det fick Nobelpriset 2010.",
   "Graphene is a layer of carbon atoms in a pattern of hexagons, only one atom thick. It is one of the strongest materials we know, conducts electricity very well and is almost transparent. The scientists who produced it got the Nobel Prize in 2010.",
   "الغرافين طبقة من ذرّات الكربون في نمط من الأشكال السداسية، سُمكها ذرّة واحدة. وهو من أقوى المواد المعروفة، ويوصل الكهرباء جيدًا جدًا، ويكاد يكون شفافًا. وقد نال العالمان اللذان حضّراه جائزة نوبل عام 2010."),
  draw:()=>[A.wipe(),ttl("Grafen"),...graphene(110,170,6,4,36),A.tx("kolatomer",530,160,30,"k","start"),A.tx("1 atom tjockt",530,210,30,"r","start"),A.tx("mycket starkt",530,260,28,"k","start"),
   A.tx("leder ström",530,305,28,"k","start"),A.tx("nästan genomskinligt",530,350,28,"k","start"),A.tx("Nobelpris 2010",530,410,28,"o","start")]},
 {say:t3("Många solkrämer innehåller nanopartiklar av zinkoxid eller titandioxid. De stoppar solens UV-strålning, som kan skada huden. Eftersom partiklarna är så små sprider de nästan inget synligt ljus, så krämen blir genomskinlig i stället för vit.",
   "Many sunscreens contain nanoparticles of zinc oxide or titanium dioxide. They stop the sun's UV radiation, which can harm the skin. Because the particles are so small they scatter almost no visible light, so the cream is clear instead of white.",
   "تحتوي كثير من واقيات الشمس على جسيمات نانوية من أكسيد الزنك أو ثاني أكسيد التيتانيوم، توقف أشعة الشمس فوق البنفسجية التي قد تضرّ الجلد. ولأن الجسيمات صغيرة جدًا فهي لا تكاد تشتّت الضوء المرئي، فيصبح الكريم شفافًا بدل أن يكون أبيض."),
  draw:()=>[A.wipe(),ttl("Solkräm med nanopartiklar"),...art("sun",110,140,.6),A.hatch("M60 370 L740 370 L740 440 L60 440 Z","p"),A.p("M60 370 L740 370","p",3),
   A.p("M60 352 L740 352","#9aa3b2",2),A.p(dotsP([...Array(34)].map((_,i)=>[72+i*20,361+(i%2)*4])),"#7d8ca6",6),wave(170,170,300,345,"v",7,6),wave(230,160,380,345,"v",7,6),
   wave(330,345,420,220,"v",6,4),A.tx("UV",160,262,30,"v","end"),A.tx("stoppas",470,220,26,"v","start"),A.tx("solkräm",600,335,26,"#5b6475"),A.tx("huden",400,415,28,"p"),
   A.tx("synligt ljus går igenom",560,280,24,"o"),A.arrow(700,110,712,345,"o")]},
 {say:t3("Nanoteknik används på fler sätt. Forskare bygger nanopartiklar som kan bära medicin direkt till sjuka celler. Silverpartiklar i sportkläder dödar bakterier som luktar illa. Och geckoödlan kan gå i taket tack vare miljontals nanotunna hårstrån under fötterna.",
   "Nanotechnology is used in more ways. Researchers build nanoparticles that can carry medicine straight to sick cells. Silver particles in sports clothes kill bacteria that smell bad. And the gecko can walk on the ceiling thanks to millions of nano-thin hairs under its feet.",
   "تُستخدم تقنية النانو بطرق أخرى أيضًا: يصنع الباحثون جسيمات نانوية تحمل الدواء مباشرة إلى الخلايا المريضة، وجسيمات الفضة في الملابس الرياضية تقتل البكتيريا ذات الرائحة الكريهة، والوزغة تمشي على السقف بفضل ملايين الشعيرات النانوية تحت قدميها."),
  draw:()=>[A.wipe(),ttl("Fler exempel"),A.p(R.loop(160,240,70,60),"g",3.5),A.hatch(R.circ(170,240,22),"v"),...balls([[100,180],[232,205],[90,300]],9,"o"),A.arrow(60,140,92,172,"o"),
   tee(400,230,1.1),A.p(dotsP([[380,200],[420,220],[400,260],[370,280],[430,290],[395,230]]),"#7d8ca6",8),
   A.p(R.circ(640,270,26)+[[-60,-80],[-20,-95],[25,-90],[65,-70]].map(([dx,dy])=>`M640 ${270}L${640+dx} ${270+dy}`).join(""),"g",4),
   A.p([[-60,-80],[-20,-95],[25,-90],[65,-70]].map(([dx,dy])=>ellP(640+dx,270+dy,14,10)).join(""),"g",3.5),A.p([[-60,-80],[-20,-95],[25,-90],[65,-70]].map(([dx,dy])=>[-8,-3,2,7].map(k=>`M${640+dx+k} ${270+dy+10}L${640+dx+k} ${270+dy+18}`).join("")).join(""),"g",1.5),
   A.tx("medicin till",160,380,26,"k"),A.tx("sjuka celler",160,412,26,"k"),A.tx("silver mot",400,380,26,"k"),A.tx("bakterier",400,412,26,"k"),A.tx("geckons",640,380,26,"k"),A.tx("nanohår",640,412,26,"k")]},
 {say:t3("Nanoteknik ger stora möjligheter, men också risker. Nanopartiklar är så små att de kan andas in djupt i lungorna. Silverpartiklar som sköljs ut i tvätten kan skada nyttiga bakterier i naturen. Ingen vet säkert vad som händer på lång sikt, så det behövs mer forskning och regler.",
   "Nanotechnology gives great possibilities, but also risks. Nanoparticles are so small that they can be breathed deep into the lungs. Silver particles washed out in the laundry can harm useful bacteria in nature. Nobody knows for sure what happens in the long run, so more research and rules are needed.",
   "تقدّم تقنية النانو إمكانات كبيرة، لكن فيها مخاطر أيضًا. فالجسيمات النانوية صغيرة إلى حدّ أنها قد تُستنشق إلى عمق الرئتين، وجسيمات الفضة التي تخرج مع الغسيل قد تضرّ البكتيريا النافعة في الطبيعة. ولا أحد يعرف يقينًا ما يحدث على المدى الطويل، لذا نحتاج إلى مزيد من البحث والقوانين."),
  draw:()=>[A.wipe(),ttl("Möjligheter och risker"),A.band(30,95,360,350,"g"),A.band(410,95,360,350,"r"),A.tx("Möjligheter",210,140,34,"g"),A.tx("Risker",590,140,34,"r"),
   ...blist([["självrengörande ytor","g"],["starka, lätta material","g"],["bättre solskydd","g"],["medicin som hittar rätt","g"]],55,205,58,25),
   ...blist([["kan andas in djupt","r"],["kan läcka ut i naturen","r"],["okända effekter på sikt","r"],["kräver forskning och regler","r"]],435,205,58,25)]},
 {say:t3("Kom ihåg: en nanometer är en miljarddels meter. I nanoskala har materialen stor yta och kan få nya egenskaper. Lotuseffekten, grafen och solkräm är exempel på nanoteknik. Möjligheterna är stora, men riskerna måste undersökas.",
   "Remember: a nanometre is one billionth of a metre. At the nanoscale materials have a large surface and can get new properties. The lotus effect, graphene and sunscreen are examples of nanotechnology. The possibilities are great, but the risks must be investigated.",
   "تذكّر: النانومتر جزء من مليار من المتر. وفي مقياس النانو تكون مساحة سطح المواد كبيرة وقد تكتسب خصائص جديدة. تأثير اللوتس والغرافين وواقي الشمس أمثلة على تقنية النانو. والإمكانات كبيرة، لكن يجب دراسة المخاطر."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["1 nm = en miljarddels meter","r"],["små bitar → stor yta, nya egenskaper","o"],["lotuseffekten, grafen, solkräm","g"],["möjligheter – men också risker","b"]],60,160,66,30),...graphene(560,370,3,2,24)]},
]};
const PIC8={hex:()=>graphene(80,180,4,4,40),lotus:()=>[...bumps(40,380,360,26,40),A.hatch(ellP(220,302,40,32),"b"),A.p(ellP(220,302,40,32),"b",3.5),A.p(dotsP([[120,336],[300,334]]),"#8a5a2b",8),A.arrow(260,260,330,260,"b")]};
const BANK8=[
 {lv:0,q:"Hur lång är en nanometer?",a:"en miljarddels meter",w:["en tusendels meter","en miljondels meter","en hundradels meter"]},
 {lv:0,q:"Vad betyder grekiskans nanos?",a:"dvärg",w:["jätte","ljus","atom"]},
 {lv:0,q:"Vad händer med vattendroppar på ett lotusblad?",a:"de rullar av och tar med sig smuts",w:["de sugs in i bladet","de fastnar och blir platta","de fryser till is"]},
 {lv:0,q:"Vilket grundämne består grafen av?",a:"kol",w:["järn","guld","syre"]},
 {lv:1,q:"Ungefär hur tjockt är ett hårstrå?",a:"80 000 nm",w:["80 nm","8 nm","0,8 nm"]},
 {lv:1,q:"Ordna från störst till minst.",a:"bakterie, virus, atom",w:["atom, virus, bakterie","virus, bakterie, atom","virus, atom, bakterie"]},
 {lv:1,q:"Hur tjockt är grafen?",a:"en atom tjockt",w:["en millimeter tjockt","tusen atomer tjockt","lika tjockt som ett hårstrå"]},
 {lv:1,q:"Vilket material visar bilden?",a:"grafen",w:["guld","is","salt"],lines:["Kolatomer i sexhörningar.","Vilket material är det?"],pic:PIC8.hex},
 {lv:1,q:"Vad gör nanopartiklar av zinkoxid i solkräm?",a:"de stoppar UV-strålning",w:["de gör huden brun","de gör krämen vit","de värmer huden"],lines:["Vad gör nanopartiklar","av zinkoxid i solkräm?"]},
 {lv:1,q:"Vad kallas effekten som bilden visar?",a:"lotuseffekten",w:["växthuseffekten","dominoeffekten","magnetism"],lines:["Droppen rullar av","knottrorna och tar smuts.","Vad kallas effekten?"],pic:PIC8.lotus},
 {lv:1,q:"Varför syns inte solkräm med nanopartiklar på huden?",a:"partiklarna är för små för att sprida synligt ljus",w:["partiklarna är genomskinliga atomer","krämen avdunstar direkt","huden suger upp all kräm"],lines:["Varför syns inte solkräm","med nanopartiklar?"]},
 {lv:1,q:"Skriv ordet: en miljarddels meter kallas en …",a:["nanometer","nanometern"],lines:["Skriv ordet som saknas:","En miljarddels meter","kallas en …"]},
 {lv:2,q:"En kub delas i 8 lika små kuber. Vad händer med den totala ytan?",a:"den fördubblas",w:["den halveras","den blir lika stor","den blir 8 gånger mindre"],lines:["En kub delas i 8 små kuber.","Vad händer med den","totala ytan?"]},
 {lv:2,q:"Varför reagerar nanopartiklar lättare än stora bitar av samma ämne?",a:"en större del av atomerna sitter vid ytan",w:["de är varmare","de har fler protoner","de väger mer"],lines:["Varför reagerar nanopartiklar","lättare än stora bitar?"]},
 {lv:2,q:"Vilken risk finns med silvernanopartiklar i kläder?",a:"de kan sköljas ut och skada nyttiga bakterier",w:["de gör kläderna radioaktiva","de gör tyget tyngre","de lockar till sig mygg"],lines:["Vilken risk finns med","silverpartiklar i kläder?"]},
 {lv:2,q:"Guld i nanostorlek kan se rött ut. Vad visar det?",a:"egenskaper kan ändras när partiklar blir mycket små",w:["guld rostar","guld är egentligen rött","ljus gör guld varmt"],lines:["Guld i nanostorlek kan","se rött ut. Vad visar det?"]},
 {lv:2,q:"Ett virus är ungefär 100 nm. Hur många virus i rad blir 1 mm?",a:"10 000",w:["100","1 000","1 000 000"],lines:["Ett virus är 100 nm.","Hur många i rad blir 1 mm?"]},
 {lv:2,q:"Varför behövs mer forskning om nanopartiklar?",a:"man vet inte hur de påverkar hälsa och miljö på lång sikt",w:["de är för dyra att tillverka","de går inte att se","de finns inte i naturen"]},
 {lv:2,q:"Skriv ordet: ett lager kolatomer som bara är en atom tjockt heter …",a:["grafen","grafenet"],lines:["Skriv ordet som saknas:","Ett lager kol, en atom tjockt,","heter …"]},
];
LESSONS.push({id:"f7m8",subject:"science",grades:"7",kind:"wb",year:7,ord:8,
 title:t3("Lär mer: Nanoforskning","Learn more: Nanoscience","تعلّم أكثر: أبحاث النانو"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${(()=>{let s="";const a=24,w=Math.sqrt(3)*a;for(let r=0;r<3;r++)for(let c=0;c<4;c++){const cx=60+c*w+(r%2?w/2:0),cy=50+r*a*1.5;s+=`<polygon points="${[0,1,2,3,4,5].map(i=>{const t=Math.PI/180*(60*i-30);return(cx+a*Math.cos(t)).toFixed(1)+","+(cy+a*Math.sin(t)).toFixed(1)}).join(" ")}" fill="none" stroke="#1d2433" stroke-width="3"/>`}return s})()}<text x="236" y="110" font-size="44" fill="#d63b2f" font-family="cursive">nm</text></svg>`,
 steps:VM8.steps,mount:wbMount(VM8),gen:bankGen(BANK8)});
WORDS.f7m8=["f7_nanometer","f7_nanoteknik","f7_nanopartikel","f7_lotus","f7_grafen"];
}

import {IMG} from "./no-0art.js";
import {BRN,bankGen,blist,callout,ellP,tfx,ttl} from "./no-0body.js";
import {A,LESSONS,R,REDUCED,TERM,WORDS,f1,t3,wbMount} from "../../legacy/core.js";
/* ===== fys7-kraft.js: Fysik, Year 7, chapter "Kraft och rörelse" (the topics of Titano Fysik, in our own words) =====
   Base lessons f7k1-f7k8, "Lär mer" (harder) f7k9-f7k12:
   1 tyngdlöshet · 2 rörelse och fart · 3 pendeln · 4 krafter · 5 friktion · 6 balans · 7 enkla maskiner · 8 trafik och frisk luft
   9 kraftpilar och resultant · 10 Newtons lagar · 11 hävstångsregeln · 12 centralrörelse */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
const MV=!REDUCED;

/* ---------- drawings shared by the chapter (marker style, 800 x 500 board) ---------- */
/* a plain rectangle path (for hatching) and a box with an optional label in the middle */
const rp=(x,y,w,h)=>`M${x},${y}h${w}v${h}h${-w}Z`;
/* a box: hatched, or with a label a faint fill so the label stays easy to read (ly = the label's baseline, default the middle) */
const blk=(x,y,w,h,c="b",s,z=26,sc,ly)=>s?[A.band(x,y,w,h,c),A.p(R.rect(x,y,w,h,.4),c,4),A.tx(s,x+w/2,ly||y+h/2+z*.33,z,sc||c)]:[A.hatch(rp(x,y,w,h),c),A.p(R.rect(x,y,w,h,.4),c,4)];
/* the ground (hatched below) and a ceiling (hatched above) */
const gnd=(x1,x2,y,c="k")=>{let d=R.line(x1,y,x2,y,.4);for(let x=x1+12;x<=x2;x+=22)d+=`M${x},${y+3}L${x-11},${y+14}`;return A.p(d,c,3)};
const ceil=(x1,x2,y)=>{let d=R.line(x1,y,x2,y,.4);for(let x=x1+2;x<=x2-11;x+=22)d+=`M${x},${y-3}L${x+11},${y-14}`;return A.p(d,"k",3)};
/* a force arrow (thick), a dot, a dashed line and a ball */
const F=(x1,y1,x2,y2,c="r",w=6)=>A.p(R.arrow(x1,y1,x2,y2),c,w);
const dot=(x,y,c="k",r=6)=>A.p(`M${x},${y}L${x+.1},${y}`,c,r*2);
const dash=(x1,y1,x2,y2,c="k",w=2.5)=>A.p(R.dashed(x1,y1,x2,y2),c,w);
const ball=(x,y,r,c="o")=>[A.hatch(R.circ(x,y,r),c),A.p(R.circ(x,y,r),c,3.5)];
/* a weight hanging from a short string at (x,y) */
const wt=(x,y,w=44,h=40,c="k",s,z=22)=>{const d=`M${x-w/2+6},${y}L${x+w/2-6},${y}L${x+w/2},${y+h}L${x-w/2},${y+h}Z`;
  return[A.p(`M${x},${y}L${x},${y-10}`,"k",3),...(s?[A.band(x-w/2,y,w,h,c)]:[A.hatch(d,c)]),A.p(d,c,3.5),...(s?[A.tx(s,x,y+h/2+z*.36,z,c)]:[])]};
/* a spring scale (dynamometer) hanging from (x,y): ring, tube, spring, a red marker at the reading f (0..max N), the scale,
   and a rod with a hook that comes out further the more it is pulled. The hook's lowest point is at dyHook(y, f, max). */
const dyHook=(y,f,max=5)=>y+14+20+f/max*110+150+22;
const dyno=(x,y,f,max=5,c="b",nums=true)=>{const top=y+14,tl=170,S=110,iy=top+20+f/max*S,n=8,sy=top+6,hy=iy+150;let sp="",tk="";const lab=[];
  for(let i=0;i<=n;i++)sp+=(i?"L":"M")+f1(x+(i===0||i===n?0:(i%2?10:-10)))+","+f1(sy+(iy-sy)*i/n);
  for(let k=0;k<=max;k++){const ty=top+20+k/max*S;tk+=`M${x+16},${f1(ty)}h9`;if(nums)lab.push(A.tx(k,x+38,ty+6,18,"k"))}
  return[A.p(R.circ(x,y,7),"k",3),A.p(`M${x},${y+7}L${x},${top}`,"k",3),A.p(R.rect(x-16,top,32,tl,.3),"k",3.5),A.p(tk,"k",2.5),...lab,
   A.p(sp,c,3),A.p(`M${x-13},${f1(iy)}h26`,"r",4.5),A.p(`M${x},${f1(iy)}L${x},${f1(hy)}`,"k",3.5),
   A.p(`M${x},${f1(hy)}Q${x+14},${f1(hy+4)} ${x+8},${f1(hy+16)}Q${x},${f1(hy+22)} ${x-6},${f1(hy+14)}`,"k",3.5)]};
/* a pendulum: still at an angle, or swinging (an SVG picture with a rotation; still under reduced motion) */
const pendS=(px,py,L,deg,c="b",r=18)=>{const a=deg*Math.PI/180,bx=px+Math.sin(a)*L,by=py+Math.cos(a)*L;
  return[A.p(R.line(px,py,bx,by,.2),"k",3),A.hatch(R.circ(bx,by,r),c),A.p(R.circ(bx,by,r),c,3.5)]};
const PCOL={b:["#2257c9","#dbe6fb"],r:["#d63b2f","#f8dcd9"],g:["#1e9e5a","#d9f1e3"],o:["#e07b00","#fbe7cc"],v:["#7c3aed","#e8dcfc"],k:["#1d2433","#dfe3ea"]};
const spin=(amp,dur,inner)=>MV?`<g><animateTransform attributeName="transform" type="rotate" values="${amp};${-amp};${amp}" keyTimes="0;.5;1" calcMode="spline" keySplines=".37 0 .63 1;.37 0 .63 1" dur="${dur}s" repeatCount="indefinite"/>${inner}</g>`:`<g transform="rotate(${amp})">${inner}</g>`;
const swing=(px,py,L,amp,dur,c="b",r=18)=>{const [s,f]=PCOL[c];
  return A.art(spin(amp,dur,`<path d="M0 0L0 ${L}" stroke="#1d2433" stroke-width="3" stroke-linecap="round"/><circle cx="0" cy="${L}" r="${r}" fill="${f}" stroke="${s}" stroke-width="3.5"/><circle cx="${f1(-r*.35)}" cy="${f1(L-r*.35)}" r="${f1(r*.25)}" fill="#fff" opacity=".8"/>`),px,py,1)};
/* a car (wheels on y = 0, from x −72 to 76, facing right), still or driving from x0 to x1 */
const CAR=(c="#d63b2f")=>`<path d="M-72 -18L-72 -40Q-70 -48 -58 -50L-34 -52L-14 -76Q-8 -80 4 -80L34 -80Q44 -80 50 -72L66 -52Q78 -50 76 -38L76 -18Z" fill="${c}" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"/>
<path d="M-26 -54L-10 -72L10 -72L10 -54ZM18 -54L18 -72L40 -72L54 -54Z" fill="#cfe6ff" stroke="#1d2433" stroke-width="2.5" stroke-linejoin="round"/>
<circle cx="-42" cy="-16" r="16" fill="#1d2433"/><circle cx="-42" cy="-16" r="7" fill="#c9d1de"/><circle cx="46" cy="-16" r="16" fill="#1d2433"/><circle cx="46" cy="-16" r="7" fill="#c9d1de"/><circle cx="70" cy="-40" r="4" fill="#ffd84d"/>`;
const car=(x,y,s=1,c,flip)=>A.art(`<g${flip?' transform="scale(-1,1)"':""}>${CAR(c)}</g>`,x,y,s);
const drive=(x0,x1,y,dur,s=1,c)=>A.art(MV?`<g><animateTransform attributeName="transform" type="translate" values="0 0;${f1((x1-x0)/s)} 0" dur="${dur}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.88;1" dur="${dur}s" repeatCount="indefinite"/>${CAR(c)}</g>`:CAR(c),x0,y,s);
/* the Earth and the Moon */
const LAND="M-46 -40Q-20 -66 8 -50Q26 -36 6 -20Q-14 -6 -30 -16Q-50 -24 -46 -40ZM16 8Q44 -2 52 22Q46 46 22 44Q4 34 16 8ZM-40 24Q-26 16 -18 30Q-24 44 -38 38Z";
const earth=(x,y,r)=>[A.hatch(R.circ(x,y,r),"b"),A.p(R.circ(x,y,r),"b",4),A.hatch(tfx(LAND,x,y,r/80),"g"),A.p(tfx(LAND,x,y,r/80),"g",2.5)];
const moon=(x,y,r)=>[A.hatch(R.circ(x,y,r),"k"),A.p(R.circ(x,y,r),"k",3.5),A.p(R.circ(x-r*.3,y-r*.2,r*.22)+R.circ(x+r*.35,y+r*.3,r*.15),"k",2)];
/* an astronaut in a space suit and a space station, in their own boxes */
const ASTRO="M-18 -30L18 -30L22 20L-22 20ZM-18 -24L-46 -6M18 -24L44 -44M-12 20L-24 58M12 20L30 52M-30 -26L-20 -26L-20 12L-30 12Z";
const astro=(x,y,s=1,c="v")=>[A.hatch(tfx(ellP(0,-50,20,20),x,y,s),"k"),A.p(tfx(ASTRO,x,y,s),c,3.5),A.p(tfx(ellP(0,-50,20,20),x,y,s),c,3.5),A.p(tfx(ellP(5,-50,11,8),x,y,s),"b",3)];
const STATION="M-36 -10L36 -10L36 10L-36 10ZM-36 0L-48 0M36 0L48 0M-80 -36L-48 -36L-48 36L-80 36ZM48 -36L80 -36L80 36L48 36ZM-64 -36L-64 36M64 -36L64 36M-80 0L-48 0M48 0L80 0";
const station=(x,y,s=1)=>[A.hatch(tfx("M-80 -36L-48 -36L-48 36L-80 36ZM48 -36L80 -36L80 36L48 36Z",x,y,s),"b"),A.p(tfx(STATION,x,y,s),"k",3)];
/* a stick figure standing on (x, y); P moves the joints (head h, neck n, shoulder sh, hip, feet f1 f2, hands a1 a2) */
const man=(x,y,s=1,c="k",P={})=>{const d=Object.assign({h:[0,-134],n:[0,-116],sh:[0,-104],hip:[0,-58],f1:[-20,0],f2:[20,0],a1:[-30,-66],a2:[30,-66]},P),Q=([a,b])=>`${f1(x+a*s)},${f1(y+b*s)}`;
  return[A.p(R.circ(x+d.h[0]*s,y+d.h[1]*s,16*Math.abs(s)),c,3.5),A.p(`M${Q(d.n)}L${Q(d.hip)}M${Q(d.hip)}L${Q(d.f1)}M${Q(d.hip)}L${Q(d.f2)}M${Q(d.sh)}L${Q(d.a1)}M${Q(d.sh)}L${Q(d.a2)}`,c,4*Math.min(1.2,Math.max(.7,Math.abs(s))))]};
const PUSH={h:[22,-128],n:[16,-112],sh:[12,-102],hip:[-4,-56],f1:[16,0],f2:[-36,0],a1:[48,-96],a2:[50,-84]};
/* a lever: the support (a triangle with its top at x, y) and the bar */
const fulcrum=(x,y,c="k",h=40)=>{const d=`M${x},${y}L${x-h*.55},${y+h}L${x+h*.55},${y+h}Z`;return[A.hatch(d,c),A.p(d,c,3.5)]};
const beam=(x1,y1,x2,y2,c=BRN)=>A.p(R.line(x1,y1,x2,y2,.2),c,8);
/* graph axes from the origin (x0, y0), w wide and h high; ticks: [[px, label]] on each axis */
const axes=(x0,y0,w,h,xl,yl,xs=[],ys=[])=>{let d="";const o=[];xs.forEach(([px,l])=>{d+=`M${px},${y0-5}v10`;o.push(A.tx(l,px,y0+28,20))});
  ys.forEach(([py,l])=>{d+=`M${x0-5},${py}h10`;o.push(A.tx(l,x0-12,py+7,20,"k","end"))});
  return[A.p(R.arrow(x0,y0,x0+w,y0),"k",3),A.p(R.arrow(x0,y0,x0,y0-h),"k",3),A.p(d,"k",2.5),...o,A.tx(xl,x0+w,y0+56,24,"k","end"),A.tx(yl,x0+14,y0-h+8,24,"k","start")]};
/* a ramp from (x0, yb) up to (x1, yt), and a box of w x h resting on it at fraction t */
const ramp=(x0,yb,x1,yt,c="k")=>{const d=`M${x0},${yb}L${x1},${yb}L${x1},${yt}Z`;return[A.hatch(d,"o"),A.p(d,c,3.5)]};
const onRamp=(x0,yb,x1,yt,t,w,h)=>{const L=Math.hypot(x1-x0,yb-yt),ux=(x1-x0)/L,uy=(yt-yb)/L,nx=uy,ny=-ux,px=x0+(x1-x0)*t,py=yb+(yt-yb)*t;
  const P=[[px,py],[px+ux*w,py+uy*w],[px+ux*w+nx*h,py+uy*w+ny*h],[px+nx*h,py+ny*h]];
  return{d:"M"+P.map(p=>p.map(f1).join(",")).join("L")+"Z",c:[px+ux*w/2+nx*h/2,py+uy*w/2+ny*h/2],u:[ux,uy],n:[nx,ny]}};
/* a pulley wheel */
const pulley=(x,y,r=22,c="k")=>[A.p(R.circ(x,y,r),c,3.5),A.p(R.circ(x,y,r-7),c,2),dot(x,y,c,4)];
/* a stopwatch */
const watch=(x,y,r=34,c="k",min=8)=>{const a=(min/60*360-90)*Math.PI/180;
  return[A.p(R.circ(x,y,r),c,3.5),A.p(`M${x-6},${y-r-10}h12M${x},${y-r-10}v10`,c,3.5),A.p(`M${x},${y}L${f1(x+Math.cos(a)*r*.75)},${f1(y+Math.sin(a)*r*.75)}`,"r",3.5)]};
/* a "?" on a picture and a small X / tick */
const qm=(x,y,c="r",z=48)=>A.tx("?",x,y,z,c);
const CROSS=(x,y,c="r")=>A.p(`M${x-12},${y-12}L${x+12},${y+12}M${x+12},${y-12}L${x-12},${y+12}`,c,5);
const TICK=(x,y,c="g")=>A.p(`M${x-12},${y}L${x-3},${y+10}L${x+14},${y-12}`,c,5);
/* a small icon wrapper for the lesson cards */
const IC=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;

/* ---------- words ---------- */
TERM("f7k_tyngdkraft",{sv:"tyngdkraft",m:W("tyngdkraft(en|er|erna)?"),d:t3("Kraften som drar allt mot jordens mitt (eller mot en annan himlakropps mitt).","The force that pulls everything towards the centre of the Earth (or of another body in space).","القوة التي تجذب كل شيء نحو مركز الأرض (أو نحو مركز جرم سماوي آخر)."),ex:"Tyngdkraften får äpplet att falla.",tr:{en:"gravity (gravitational force)",ar:"قوة الجاذبية"}});
TERM("f7k_massa",{sv:"massa",m:W("massa(n)?"),d:t3("Hur mycket materia ett föremål har. Mäts i kilogram och är lika stor överallt.","How much matter an object has. Measured in kilograms and the same everywhere.","مقدار المادة في الجسم، تقاس بالكيلوغرام وهي نفسها في كل مكان."),ex:"Massan 50 kg är densamma på månen.",tr:{en:"mass",ar:"الكتلة"}});
TERM("f7k_tyngd",{sv:"tyngd",m:W("tyngd(en)?"),d:t3("Kraften som tyngdkraften drar ett föremål med. Mäts i newton: F = m · g.","The force with which gravity pulls an object. Measured in newtons: F = m · g.","القوة التي تجذب بها الجاذبية الجسم، وتقاس بالنيوتن: F = m · g."),ex:"50 kg har tyngden 490 N på jorden.",tr:{en:"weight",ar:"الوزن"}});
TERM("f7k_newton",{sv:"newton (N)",m:W("newton"),d:t3("Enheten för kraft. Ungefär 1 N behövs för att lyfta 100 g.","The unit of force. About 1 N is needed to lift 100 g.","وحدة القوة. يلزم نحو 1 نيوتن لرفع 100 غرام."),ex:"En liter mjölk drar med ca 10 N.",tr:{en:"newton",ar:"نيوتن"}});
TERM("f7k_tyngdlos",{sv:"tyngdlös",m:W("tyngdlös(a|het(en)?)?"),d:t3("Att inte känna sin tyngd, eftersom man faller fritt tillsammans med allt omkring sig.","Not feeling your weight, because you are falling freely together with everything around you.","ألّا تشعر بوزنك لأنك تسقط سقوطًا حرًّا مع كل ما حولك."),ex:"Astronauterna är tyngdlösa i ISS.",tr:{en:"weightless",ar:"عديم الوزن"}});
TERM("f7k_frittfall",{sv:"fritt fall",m:W("(fritt fall|faller fritt)"),d:t3("Ett fall där bara tyngdkraften verkar och farten hela tiden ökar.","A fall where only gravity acts and the speed keeps increasing.","سقوط تؤثّر فيه الجاذبية وحدها وتزداد السرعة باستمرار."),ex:"En sten faller fritt.",tr:{en:"free fall",ar:"السقوط الحر"}});

/* ---------------------------------------------------------------
   1. f7k1: tyngdlöshet – gravity, mass and weight, F = m·g, free fall
   --------------------------------------------------------------- */
/* a lift falling freely with a person standing on bathroom scales that show 0 */
const lift=(x,y,s=1)=>{const X=v=>x+v*s,Y=v=>y+v*s;
  return[A.p(R.rect(X(-70),Y(0),140*s,220*s,.4),"k",4),A.p(`M${X(0)},${Y(0)}L${X(0)},${Y(-60)}`,"k",3),A.p(`M${X(-6)},${Y(-36)}L${X(6)},${Y(-30)}`,"r",4),
   ...man(X(0),Y(196),s*1.05,"b"),A.p(R.rect(X(-34),Y(196),68*s,16*s,.3),"k",3)]};
const F7K1={steps:[
 {say:t3("Varför svävar astronauterna omkring i rymdstationen? Är det för att det inte finns någon tyngdkraft i rymden? I det här kapitlet handlar det om krafter och rörelse: hur saker faller, rör sig, bromsar och håller balansen. Vi börjar med tyngdkraften.",
   "Why do the astronauts float around in the space station? Is it because there is no gravity in space? This chapter is about forces and motion: how things fall, move, brake and keep their balance. We start with gravity.",
   "لماذا يطفو روّاد الفضاء داخل محطة الفضاء؟ هل لأنه لا توجد جاذبية في الفضاء؟ يتناول هذا الفصل القوى والحركة: كيف تسقط الأشياء وتتحرّك وتتوقّف وتحافظ على توازنها. نبدأ بالجاذبية."),
  draw:()=>[A.wipe(),ttl("Kraft och rörelse"),A.hatch("M0,500L0,440Q400,360 800,440L800,500Z","b"),A.p("M0,440Q400,360 800,440","b",4),
   ...station(560,190,1.1),...astro(250,230,1.2),A.tx("Varför svävar astronauten?",400,345,34,"v")]},
 {say:t3("Alla föremål som har massa drar i varandra. Jorden är så enorm att den drar i allt omkring sig, mot sin mitt. Den kraften kallas tyngdkraft. Därför faller ett äpple nedåt, och därför ramlar inte människor på andra sidan jorden av.",
   "All objects that have mass pull on each other. The Earth is so huge that it pulls everything around it towards its centre. That force is called gravity. That is why an apple falls down, and why people on the other side of the Earth don't fall off.",
   "كل الأجسام التي لها كتلة يجذب بعضها بعضًا. والأرض ضخمة جدًّا فتجذب كل ما حولها نحو مركزها. تسمّى هذه القوة الجاذبية. لهذا تسقط التفاحة إلى الأسفل، ولهذا لا يسقط الناس الذين على الجانب الآخر من الأرض."),
  draw:()=>{const cx=290,cy=280,r=120,o=[A.wipe(),ttl("Tyngdkraft"),...earth(cx,cy,r),dot(cx,cy,"r",5)];
   [0,45,90,135,180,225,270,315].forEach(dg=>{const a=dg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);o.push(...ball(cx+c*(r+58),cy+s*(r+58),11,"r"),F(cx+c*(r+44),cy+s*(r+44),cx+c*(r+8),cy+s*(r+8),"r",4.5))});
   return[...o,A.tx("Alla pilar pekar",470,220,30,"r","start"),A.tx("mot jordens mitt.",470,258,30,"r","start"),A.tx("Ingen ramlar av!",470,330,30,"k","start")]}},
 {say:t3("Massa och tyngd är inte samma sak. Massa är hur mycket materia något innehåller. Den mäts i kilogram och är densamma överallt. Tyngd är kraften som tyngdkraften drar med. Den mäts i newton, N, och beror på var du befinner dig.",
   "Mass and weight are not the same thing. Mass is how much matter something contains. It is measured in kilograms and is the same everywhere. Weight is the force with which gravity pulls. It is measured in newtons, N, and depends on where you are.",
   "الكتلة والوزن ليسا الشيء نفسه. الكتلة هي مقدار المادة في الشيء، وتقاس بالكيلوغرام وهي نفسها في كل مكان. أما الوزن فهو القوة التي تجذب بها الجاذبية، ويقاس بالنيوتن (N) ويعتمد على المكان الذي أنت فيه."),
  draw:()=>[A.wipe(),A.band(30,90,355,370,"g"),A.band(415,90,355,370,"r"),A.tx("massa",207,140,44,"g"),A.tx("tyngd",592,140,44,"r"),
   ...blk(147,200,120,90,"g","5 kg",34),A.tx("mäts i kilogram (kg)",207,360,28,"g"),A.tx("samma överallt",207,405,28),
   ...blk(532,180,120,80,"r","5 kg",34),F(592,262,592,330,"r",6),A.tx("49 N",612,320,28,"r","start"),A.tx("mäts i newton (N)",592,380,28,"r"),A.tx("beror på platsen",592,420,28)]},
 {say:t3("På jorden drar tyngdkraften med ungefär 9,8 newton på varje kilogram. Vi skriver g ≈ 9,8 N/kg. Tyngden får du om du multiplicerar massan med g: F = m · g. En elev med massan 50 kg har alltså tyngden 50 · 9,8 ≈ 490 N.",
   "On Earth gravity pulls with about 9.8 newtons on every kilogram. We write g ≈ 9.8 N/kg. You get the weight by multiplying the mass by g: F = m · g. A student with a mass of 50 kg therefore has a weight of 50 · 9.8 ≈ 490 N.",
   "على الأرض تجذب الجاذبية كل كيلوغرام بنحو 9,8 نيوتن، ونكتب g ≈ 9,8 N/kg. تحصل على الوزن بضرب الكتلة في g: F = m · g. إذن طالب كتلته 50 كغ وزنه 50 · 9,8 ≈ 490 نيوتن."),
  draw:()=>[A.wipe(),ttl("Tyngden räknas ut"),A.tx("F = m · g",400,165,72,"r"),A.hl(250,105,300,80),
   A.tx("F = tyngd i newton (N)",120,240,30,"r","start"),A.tx("m = massa i kilogram (kg)",120,285,30,"g","start"),A.tx("g ≈ 9,8 N/kg på jorden",120,330,30,"b","start"),
   A.tx("m = 50 kg:",120,400,32,"k","start"),A.tx("F = 50 · 9,8 ≈ 490 N",280,400,32,"r","start"),...man(680,430,1.1,"k"),F(680,350,680,470,"r",5),A.tx("490 N",700,470,24,"r","start")]},
 {say:t3("På månen är tyngdkraften ungefär sex gånger svagare: g ≈ 1,6 N/kg. Eleven har kvar sin massa på 50 kg, men tyngden blir bara 50 · 1,6 = 80 N. Därför kunde astronauterna på månen skutta fram trots sina tunga rymddräkter.",
   "On the Moon gravity is about six times weaker: g ≈ 1.6 N/kg. The student still has a mass of 50 kg, but the weight is only 50 · 1.6 = 80 N. That is why the astronauts on the Moon could bounce along despite their heavy space suits.",
   "على القمر الجاذبية أضعف بنحو ست مرات: g ≈ 1,6 N/kg. تبقى كتلة الطالب 50 كغ، لكن وزنه يصبح 50 · 1,6 = 80 نيوتن فقط. لهذا استطاع روّاد الفضاء على القمر أن يقفزوا رغم بدلاتهم الثقيلة."),
  draw:()=>[A.wipe(),ttl("Jorden och månen"),A.band(30,100,355,360,"b"),A.band(415,100,355,360,"k"),A.tx("jorden",207,145,36,"b"),A.tx("månen",592,145,36,"k"),
   ...blk(147,180,120,80,"g","50 kg",30),F(207,262,207,402,"r",7),A.tx("490 N",230,350,30,"r","start"),A.tx("g ≈ 9,8 N/kg",207,440,28,"b"),
   ...blk(532,180,120,80,"g","50 kg",30),F(592,262,592,288,"r",7),A.tx("80 N",620,290,30,"r","start"),A.tx("g ≈ 1,6 N/kg",592,440,28,"k"),
   A.tx("samma massa",400,485,26,"g")]},
 {say:t3("Släpp en boll. Den faller fritt: bara tyngdkraften verkar, och farten ökar hela tiden. Tänk dig nu en hiss vars vajer går av. Du och hissen faller lika fort, så du trycker inte mot golvet. En våg under fötterna skulle visa noll. Du känner dig tyngdlös.",
   "Drop a ball. It falls freely: only gravity acts, and the speed keeps increasing. Now imagine a lift whose cable breaks. You and the lift fall equally fast, so you don't press on the floor. A scale under your feet would show zero. You feel weightless.",
   "أفلت كرة فتسقط سقوطًا حرًّا: تؤثّر فيها الجاذبية وحدها وتزداد سرعتها باستمرار. تخيّل الآن مصعدًا انقطع حبله. أنت والمصعد تسقطان بالسرعة نفسها، فلا تضغط على الأرضية. والميزان تحت قدميك سيُظهر صفرًا. تشعر بأنك عديم الوزن."),
  draw:()=>[A.wipe(),ttl("Fritt fall"),...[0,1,2,3].flatMap(t=>ball(140,110+t*t*36,12,"o")),A.p(R.line(170,110,170,434,.3),"k",2),
   ...[0,1,2,3].map(t=>A.tx(t+" s",188,117+t*t*36,22,"k","start")),
   A.tx("allt längre",115,270,24,"o","end"),A.tx("för varje",115,298,24,"o","end"),A.tx("sekund",115,326,24,"o","end"),
   ...lift(470,130,1),F(590,170,590,320,"r",5),F(620,170,620,320,"r",5),A.tx("faller",660,230,28,"r","start"),A.tx("lika fort",660,264,28,"r","start"),A.tx("vågen visar 0 N",470,400,30,"r")]},
 {say:t3("Rymdstationen ISS flyger ungefär 400 km upp. Där är tyngdkraften nästan lika stark som här, cirka 90 procent. Ändå svävar astronauterna. Stationen faller hela tiden mot jorden, men den rör sig så fort framåt, ca 28 000 km/h, att den faller runt jorden.",
   "The space station ISS flies about 400 km up. There gravity is almost as strong as here, about 90 percent. Still the astronauts float. The station is falling towards the Earth all the time, but it moves forward so fast, about 28,000 km/h, that it falls around the Earth.",
   "تحلّق محطة الفضاء الدولية على ارتفاع نحو 400 كم. هناك الجاذبية تكاد تكون بقوتها هنا، نحو 90 في المئة. ومع ذلك يطفو الروّاد. فالمحطة تسقط نحو الأرض باستمرار، لكنها تتحرك إلى الأمام بسرعة كبيرة، نحو 28 000 كم/ساعة، فتسقط حول الأرض."),
  draw:()=>{const cx=270,cy=285,r=100,o=175;return[A.wipe(),...earth(cx,cy,r),A.p(R.circ(cx,cy,o),"#9aa3b2",2),A.flow(`M${cx},${cy-o}A${o},${o} 0 1 1 ${cx-.1},${cy-o}`,"v",8,9,5),
   ...station(cx,cy-o,.45),F(cx+44,cy-o,cx+150,cy-o,"b",5),A.tx("fart framåt",cx+160,cy-o+8,26,"b","start"),F(cx,cy-o+24,cx,cy-r-8,"r",5),A.tx("tyngdkraft",cx-14,cy-o+58,24,"r","end"),
   A.tx("ISS faller",560,290,32,"v","start"),A.tx("runt jorden",560,330,32,"v","start"),A.tx("– hela tiden",560,370,32,"v","start"),A.tx("ca 400 km upp",560,430,26,"k","start")]}},
 {say:t3("Kom ihåg: tyngdkraften drar allt mot jordens mitt. Massa mäts i kg och är densamma överallt. Tyngd är en kraft, mäts i newton och räknas ut med F = m · g. Den som faller fritt känner sig tyngdlös, även om tyngdkraften finns där.",
   "Remember: gravity pulls everything towards the centre of the Earth. Mass is measured in kg and is the same everywhere. Weight is a force, measured in newtons and worked out with F = m · g. Someone in free fall feels weightless, even though gravity is there.",
   "تذكّر: الجاذبية تجذب كل شيء نحو مركز الأرض. الكتلة تقاس بالكيلوغرام وهي نفسها في كل مكان. الوزن قوة تقاس بالنيوتن ونحسبها بالعلاقة F = m · g. ومن يسقط سقوطًا حرًّا يشعر بانعدام الوزن رغم وجود الجاذبية."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["tyngdkraften drar mot jordens mitt","r"],["massa: kg, samma överallt","g"],["tyngd: N, F = m · g","r"],["g ≈ 9,8 N/kg (månen 1,6)","b"],["fritt fall → tyngdlös","v"]],90,150,62,32),...astro(680,330,1.1)]},
]};
/* pictures for the questions */
const PIC1={
 arrows:()=>[A.hatch("M20,480Q210,400 400,480Z","b"),A.p("M20,480Q210,400 400,480","b",4),...ball(210,250,16,"o"),F(210,230,210,140,"k",4),F(232,250,330,250,"k",4),F(210,272,210,370,"k",4),F(188,250,90,250,"k",4),
  A.tx("A",210,128,30,"r"),A.tx("B",210,400,30,"r"),A.tx("C",350,260,30,"r"),A.tx("D",70,260,30,"r"),A.tx("jorden",210,470,24,"b")],
 lift:()=>[...lift(180,140,1),F(300,180,300,320,"r",5),A.tx("faller fritt",300,350,24,"r"),A.tx("vågen visar ? N",180,410,28,"r")],
 moon:()=>[A.band(30,110,170,300,"b"),A.band(220,110,170,300,"k"),A.tx("jorden",115,150,26,"b"),A.tx("månen",305,150,26,"k"),...blk(60,240,110,80,"g","12 kg",26),...blk(250,240,110,80,"g","? kg",26)],
};
const BANK1=[
 {lv:0,q:"Vad mäts massa i?",a:"kilogram (kg)",w:["newton (N)","meter (m)","sekunder (s)"]},
 {lv:0,q:"Vad mäts tyngd i?",a:"newton (N)",w:["kilogram (kg)","liter (l)","meter per sekund (m/s)"]},
 {lv:0,q:"Åt vilket håll drar jordens tyngdkraft?",a:"mot jordens mitt",w:["rakt ut i rymden","mot solen","alltid mot norr"]},
 {lv:0,q:"Ungefär hur stort är g på jorden?",a:"9,8 N/kg",w:["1,6 N/kg","98 N/kg","0 N/kg"]},
 {lv:0,q:"Vilken pil visar tyngdkraften på bollen?",a:"B",w:["A","C","D"],lines:["Vilken pil visar","tyngdkraften","på bollen?"],pic:PIC1.arrows},
 {lv:1,q:"En sten har massan 2 kg. Vilken tyngd har den på jorden?",a:"19,6 N",w:["2 N","196 N","11,8 N"],lines:["En sten har massan 2 kg.","Vilken tyngd har den","på jorden? (g ≈ 9,8 N/kg)"]},
 {lv:1,q:"Vad händer med din massa om du åker till månen?",a:"den är densamma",w:["den blir sex gånger mindre","den blir noll","den blir större"]},
 {lv:1,q:"Vad händer med din tyngd på månen?",a:"den blir ungefär sex gånger mindre",w:["den är densamma","den blir noll","den blir sex gånger större"]},
 {lv:1,q:"Varför svävar astronauterna i rymdstationen?",a:"de faller fritt runt jorden med stationen",w:["det finns ingen tyngdkraft i rymden","det finns ingen luft i rymden","månen drar i dem"]},
 {lv:1,q:"Hissen faller fritt. Vad visar vågen?",a:"0 N",w:["samma som vanligt","dubbelt så mycket","hälften så mycket"],lines:["Hissens vajer har gått av.","Vad visar vågen","under personen?"],pic:PIC1.lift},
 {lv:1,q:"Skriv ordet: kraften som drar allt mot jordens mitt heter …",a:["tyngdkraft","tyngdkraften","gravitation","gravitationen"],lines:["Skriv ordet som saknas:","Kraften som drar allt mot","jordens mitt heter …"]},
 {lv:2,q:"Ett paket har tyngden 49 N på jorden. Vilken massa har det?",a:"5 kg",w:["49 kg","480 kg","0,5 kg"],lines:["Ett paket har tyngden 49 N","på jorden. Vilken massa","har det? (g ≈ 9,8 N/kg)"]},
 {lv:2,q:"En astronaut har massan 80 kg. Vilken tyngd har hon på månen?",a:"128 N",w:["80 N","784 N","50 N"],lines:["En astronaut har massan 80 kg.","Vilken tyngd har hon på","månen? (g ≈ 1,6 N/kg)"]},
 {lv:2,q:"Hur stark är tyngdkraften på ISS jämfört med vid jordytan?",a:"nästan lika stark, ca 90 %",w:["noll","hälften så stark","tio gånger starkare"]},
 {lv:2,q:"En hammare och en fjäder släpps samtidigt på månen. Vilken landar först?",a:"de landar samtidigt",w:["hammaren","fjädern","ingen av dem faller"]},
 {lv:2,q:"Lådan har massan 12 kg på jorden. Vilken massa har den på månen?",a:"12 kg",w:["2 kg","72 kg","0 kg"],lines:["Lådan har massan 12 kg","på jorden. Vilken massa","har den på månen?"],pic:PIC1.moon},
 {lv:2,q:"Skriv tyngden i newton av 10 kg på jorden (g = 9,8 N/kg).",a:["98","98 n","98n","98 newton"],lines:["Skriv svaret i newton:","Vilken tyngd har 10 kg","på jorden? (g = 9,8 N/kg)"]},
];
LESSONS.push({id:"f7k1",subject:"science",grades:"7",kind:"wb",year:7,ord:21,
 title:t3("Tyngdlöshet","Weightlessness","انعدام الوزن"),
 icon:IC(`<path d="M0 180Q160 120 320 180Z" fill="#dbe6fb" stroke="#2257c9" stroke-width="3"/><rect x="190" y="52" width="70" height="18" fill="#fff" stroke="#1d2433" stroke-width="3"/><rect x="160" y="36" width="26" height="50" fill="#dbe6fb" stroke="#1d2433" stroke-width="3"/><rect x="264" y="36" width="26" height="50" fill="#dbe6fb" stroke="#1d2433" stroke-width="3"/><circle cx="90" cy="70" r="18" fill="#dfe3ea" stroke="#7c3aed" stroke-width="3"/><path d="M76 90H104L108 130H72ZM76 96L52 110M104 96L128 80M82 130L72 158M98 130L114 152" fill="none" stroke="#7c3aed" stroke-width="3.5" stroke-linecap="round"/>`),
 steps:F7K1.steps,mount:wbMount(F7K1),gen:bankGen(BANK1)});
WORDS.f7k1=["f7k_tyngdkraft","f7k_massa","f7k_tyngd","f7k_newton","f7k_tyngdlos","f7k_frittfall"];

/* ---------------------------------------------------------------
   2. f7k2: rörelse – speed, units, average speed, distance–time graphs
   --------------------------------------------------------------- */
TERM("f7k_fart",{sv:"fart",m:W("fart(en|er)?"),d:t3("Hur lång sträcka något rör sig per tidsenhet: fart = sträcka / tid.","How far something moves per unit of time: speed = distance / time.","المسافة التي يقطعها الجسم في وحدة الزمن: السرعة = المسافة ÷ الزمن."),ex:"100 m på 20 s ger farten 5 m/s.",tr:{en:"speed",ar:"السرعة"}});
TERM("f7k_stracka",{sv:"sträcka",m:W("sträcka(n|or)?"),d:t3("Hur långt något har förflyttat sig, till exempel i meter eller kilometer.","How far something has moved, for example in metres or kilometres.","المسافة التي تحرّكها الجسم، مثلًا بالمتر أو بالكيلومتر."),ex:"Sträckan till skolan är 2 km.",tr:{en:"distance",ar:"المسافة"}});
TERM("f7k_medelfart",{sv:"medelfart",m:W("medelfart(en)?"),d:t3("Hela sträckan delat med hela tiden, även om farten har varierat.","The whole distance divided by the whole time, even if the speed has varied.","المسافة الكلية مقسومة على الزمن الكلي حتى لو تغيّرت السرعة."),ex:"120 km på 2 h ger medelfarten 60 km/h.",tr:{en:"average speed",ar:"السرعة المتوسطة"}});
TERM("f7k_momentanfart",{sv:"momentanfart",m:W("momentanfart(en)?"),d:t3("Farten precis i ett visst ögonblick, som hastighetsmätaren visar.","The speed at one exact moment, as the speedometer shows.","السرعة في لحظة معيّنة، كما يُظهرها عدّاد السرعة."),ex:"Mätaren visar momentanfarten 70 km/h.",tr:{en:"instantaneous speed",ar:"السرعة اللحظية"}});
TERM("f7k_graf",{sv:"sträcka–tid-graf",m:W("(sträcka[–-]tid-graf(en)?|graf(en)?)"),d:t3("Ett diagram med tiden på den vågräta axeln och sträckan på den lodräta. Ju brantare linje, desto högre fart.","A diagram with time on the horizontal axis and distance on the vertical one. The steeper the line, the higher the speed.","رسم بياني فيه الزمن على المحور الأفقي والمسافة على المحور الرأسي. كلما كان الخط أشدّ انحدارًا كانت السرعة أكبر."),ex:"En vågrät linje: föremålet står still.",tr:{en:"distance–time graph",ar:"منحنى المسافة والزمن"}});
/* a speed sign */
const sign=(x,y,v,r=46)=>[A.p(R.circ(x,y,r),"r",9),A.tx(v,x,y+r*.36,r*.95,"k")];
/* a distance–time graph: 0..tmax s on x (w px) and 0..smax m on y (h px) */
const GX=110,GY=410,GW=420,GH=290;
const gpt=(t,s,tm=10,sm=60)=>[GX+t/tm*GW,GY-s/sm*GH];
const graph=(tm=10,sm=60,tstep=2,sstep=10,xl="tid (s)",yl="sträcka (m)")=>{const xs=[],ys=[];for(let t=tstep;t<=tm;t+=tstep)xs.push([gpt(t,0,tm,sm)[0],t]);for(let s=sstep;s<=sm;s+=sstep)ys.push([gpt(0,s,tm,sm)[1],s]);
  let gd="";xs.forEach(([px])=>gd+=`M${f1(px)},${GY}V${GY-GH}`);ys.forEach(([py])=>gd+=`M${GX},${f1(py)}H${GX+GW}`);
  return[A.p(gd,"#dde3ee",1.5),...axes(GX,GY,GW+30,GH+30,xl,yl,xs,ys)]};
const gline=(pts,c="b",tm=10,sm=60,w=5)=>A.p("M"+pts.map(([t,s])=>gpt(t,s,tm,sm).map(f1).join(",")).join("L"),c,w);
const F7K2={steps:[
 {say:t3("Allt omkring oss rör sig: bilar, cyklister, löpare och till och med jorden runt solen. För att beskriva en rörelse behöver vi veta två saker: hur långt något har förflyttat sig, alltså sträckan, och hur lång tid det tog.",
   "Everything around us moves: cars, cyclists, runners and even the Earth around the Sun. To describe a motion we need to know two things: how far something has moved, the distance, and how long it took.",
   "كل ما حولنا يتحرّك: السيارات وراكبو الدراجات والعدّاؤون، وحتى الأرض حول الشمس. لوصف الحركة نحتاج إلى معرفة أمرين: إلى أي مدى تحرّك الشيء، أي المسافة، وكم استغرق من الزمن."),
  draw:()=>[A.wipe(),ttl("Rörelse"),A.p(R.line(40,300,760,300,.3),"k",4),A.p(R.dashed(60,330,740,330,22),"#9aa3b2",3),drive(110,700,296,5,1),
   A.p("M80,300V200M80,200L120,212L80,226",  "g",4),A.p("M720,300V200M720,200L760,212L720,226","r",4),A.tx("start",80,185,26,"g"),A.tx("mål",720,185,26,"r"),
   A.p(R.arrow(420,380,90,380)+R.arrow(380,380,710,380),"b",3.5),A.tx("sträcka s",400,425,32,"b"),...watch(400,140,34,"k",20),A.tx("tid t",460,150,30,"k","start")]},
 {say:t3("Farten säger hur lång sträcka något rör sig på en viss tid. Den räknas ut som fart = sträcka / tid, eller v = s / t. Springer du 100 meter på 20 sekunder är din fart 100 / 20 = 5 meter per sekund, 5 m/s.",
   "Speed tells you how far something moves in a certain time. It is worked out as speed = distance / time, or v = s / t. If you run 100 metres in 20 seconds, your speed is 100 / 20 = 5 metres per second, 5 m/s.",
   "السرعة تخبرنا بالمسافة التي يقطعها الشيء في زمن معيّن، ونحسبها هكذا: السرعة = المسافة ÷ الزمن، أي v = s / t. إذا ركضت 100 متر في 20 ثانية فسرعتك 100 ÷ 20 = 5 أمتار في الثانية، 5 m/s."),
  draw:()=>[A.wipe(),ttl("Fart"),A.tx("fart = sträcka / tid",400,150,52,"b"),A.tx("v = s / t",400,220,48,"r"),A.hl(300,180,200,58),
   ...man(140,420,.9,"k",{h:[10,-130],n:[8,-114],sh:[6,-104],hip:[0,-58],f1:[30,-6],f2:[-30,-14],a1:[34,-80],a2:[-28,-76]}),
   A.tx("s = 100 m",300,320,32,"k","start"),A.tx("t = 20 s",300,365,32,"k","start"),A.tx("v = 100 / 20 = 5 m/s",300,430,36,"g","start")]},
 {say:t3("Farten kan anges i olika enheter. I fysik används ofta meter per sekund, m/s. På vägskyltar och i bilen står farten i kilometer per timme, km/h. Att något har farten 1 m/s betyder att det rör sig en meter varje sekund.",
   "Speed can be given in different units. Physics often uses metres per second, m/s. On road signs and in the car the speed is in kilometres per hour, km/h. A speed of 1 m/s means that something moves one metre every second.",
   "يمكن التعبير عن السرعة بوحدات مختلفة. في الفيزياء نستخدم غالبًا المتر في الثانية m/s، وعلى لافتات الطرق وفي السيارة تُكتب السرعة بالكيلومتر في الساعة km/h. السرعة 1 m/s تعني أن الشيء يتحرك مترًا واحدًا كل ثانية."),
  draw:()=>[A.wipe(),ttl("Enheter för fart"),A.band(40,100,340,340,"b"),A.band(420,100,340,340,"r"),A.tx("m/s",210,160,52,"b"),A.tx("meter per sekund",210,205,28,"b"),
   A.tx("används i fysik",210,250,26),...[0,1,2,3].map(i=>A.p(R.line(90+i*60,330,90+i*60,350,.2),"k",3)),A.p(R.line(90,340,270,340,.2),"k",3),A.tx("1 m varje sekund",210,400,26),
   A.tx("km/h",590,160,52,"r"),A.tx("kilometer per timme",590,205,28,"r"),A.tx("på skyltar och i bilen",590,250,26),...sign(590,350,50,50)]},
 {say:t3("En timme har 3 600 sekunder. Farten 1 m/s blir då 3 600 m på en timme, alltså 3,6 km/h. Från m/s till km/h multiplicerar du därför med 3,6, och från km/h till m/s delar du med 3,6. Till exempel är 10 m/s = 36 km/h och 90 km/h = 25 m/s.",
   "An hour has 3,600 seconds. A speed of 1 m/s is then 3,600 m in an hour, that is 3.6 km/h. So from m/s to km/h you multiply by 3.6, and from km/h to m/s you divide by 3.6. For example 10 m/s = 36 km/h and 90 km/h = 25 m/s.",
   "في الساعة 3600 ثانية، فالسرعة 1 m/s تعني 3600 متر في الساعة، أي 3,6 km/h. لذلك من m/s إلى km/h نضرب في 3,6، ومن km/h إلى m/s نقسم على 3,6. مثلًا 10 m/s = 36 km/h و 90 km/h = 25 m/s."),
  draw:()=>[A.wipe(),ttl("Byt enhet"),A.p(R.rect(110,150,180,90,.4),"b",4),A.tx("m/s",200,212,48,"b"),A.p(R.rect(510,150,180,90,.4),"r",4),A.tx("km/h",600,212,48,"r"),
   A.arrow(300,165,500,165,"g",-30),A.tx("· 3,6",400,125,34,"g"),A.arrow(500,228,300,228,"o",-30),A.tx(": 3,6",400,300,34,"o"),
   A.tx("1 m/s = 3 600 m/h = 3,6 km/h",400,360,32,"k"),A.tx("10 m/s · 3,6 = 36 km/h",400,410,30,"g"),A.tx("90 km/h : 3,6 = 25 m/s",400,455,30,"o")]},
 {say:t3("Under en bilresa står bilen ibland still vid rödljus och kör ibland fort. Farten som mätaren visar just nu kallas momentanfart. Är resan 120 km och tar 2 timmar är medelfarten 120 / 2 = 60 km/h, även om farten har varierat.",
   "During a car trip the car sometimes stands still at red lights and sometimes drives fast. The speed the speedometer shows right now is called the instantaneous speed. If the trip is 120 km and takes 2 hours, the average speed is 120 / 2 = 60 km/h, even though the speed has varied.",
   "أثناء رحلة بالسيارة تتوقف السيارة أحيانًا عند الإشارة الحمراء وتسرع أحيانًا. السرعة التي يُظهرها العدّاد الآن تسمّى السرعة اللحظية. إذا كانت الرحلة 120 كم واستغرقت ساعتين فالسرعة المتوسطة 120 ÷ 2 = 60 km/h رغم تغيّر السرعة."),
  draw:()=>{const a0=Math.PI*.85,a1=Math.PI*2.15,cx=620,cy=230,r=90,v=a0+(a1-a0)*70/160;let tk="";for(let k=0;k<=8;k++){const a=a0+(a1-a0)*k/8;tk+=`M${f1(cx+Math.cos(a)*r)},${f1(cy+Math.sin(a)*r)}L${f1(cx+Math.cos(a)*(r-14))},${f1(cy+Math.sin(a)*(r-14))}`}
   return[A.wipe(),ttl("Medelfart och momentanfart"),A.p("M60,330Q140,250 220,320T380,300T540,380","k",4),A.p("M60,330Q140,250 220,320T380,300T540,380","#ffd84d",2),
    A.p(R.rect(40,300,40,40,.3),"b",3),A.tx("stan",60,370,24,"b"),A.p("M520,370L545,345L570,370ZM525,370V400H565V370","g",3),A.tx("stugan",545,425,24,"g"),
    A.p(`M${f1(cx+Math.cos(a0)*r)},${f1(cy+Math.sin(a0)*r)}A${r},${r} 0 1 1 ${f1(cx+Math.cos(a1)*r)},${f1(cy+Math.sin(a1)*r)}`,"k",4),A.p(tk,"k",2.5),A.p(`M${cx},${cy}L${f1(cx+Math.cos(v)*(r-20))},${f1(cy+Math.sin(v)*(r-20))}`,"r",5),
    A.tx("70 km/h",cx,cy+60,26,"r"),A.tx("momentanfart",cx,cy-110,26,"r"),A.tx("120 km på 2 h",200,170,30,"k"),A.tx("medelfart = 120 / 2 = 60 km/h",400,470,34,"g")]}},
 {say:t3("En rörelse kan visas i en sträcka–tid-graf. Tiden står på den vågräta axeln och sträckan på den lodräta. En cyklist med jämn fart ger en rak, lutande linje. Här har cyklisten kommit 60 m efter 10 s, alltså 60 / 10 = 6 m/s.",
   "A motion can be shown in a distance–time graph. Time goes on the horizontal axis and distance on the vertical one. A cyclist with a steady speed gives a straight, sloping line. Here the cyclist has covered 60 m after 10 s, so 60 / 10 = 6 m/s.",
   "يمكن عرض الحركة في منحنى المسافة والزمن: الزمن على المحور الأفقي والمسافة على المحور الرأسي. راكب دراجة بسرعة ثابتة يعطي خطًّا مستقيمًا مائلًا. هنا قطع الراكب 60 مترًا بعد 10 ثوانٍ، أي 60 ÷ 10 = 6 m/s."),
  draw:()=>{const [x1,y1]=gpt(10,60),[x5,y5]=gpt(5,30);return[A.wipe(),...graph(),gline([[0,0],[10,60]],"b"),A.flow(`M${GX},${GY}L${f1(x1)},${f1(y1)}`,"r",1,4,9),
   dash(x5,GY,x5,y5,"o"),dash(GX,y5,x5,y5,"o"),dash(x1,GY,x1,y1,"g"),dash(GX,y1,x1,y1,"g"),
   A.tx("jämn fart:",590,170,30,"b","start"),A.tx("rak linje",590,208,30,"b","start"),A.tx("5 s → 30 m",590,290,28,"o","start"),A.tx("10 s → 60 m",590,330,28,"g","start"),A.tx("v = 60 / 10 = 6 m/s",590,390,28,"r","start")]}},
 {say:t3("Ju brantare linjen lutar, desto högre är farten. En vågrät linje betyder att sträckan inte ändras, alltså står föremålet still. I grafen kör A fortare än B. C kör först, står sedan still en stund och kör sedan vidare.",
   "The steeper the line, the higher the speed. A horizontal line means the distance does not change, so the object is standing still. In the graph A goes faster than B. C first moves, then stands still for a while and then moves on.",
   "كلما كان الخط أشدّ انحدارًا كانت السرعة أكبر. والخط الأفقي يعني أن المسافة لا تتغيّر، أي أن الجسم واقف. في الرسم A أسرع من B. أما C فيتحرّك أولًا ثم يقف فترة ثم يتابع."),
  draw:()=>{const [ax,ay]=gpt(5,60),[bx,by]=gpt(10,30),[cx,cy]=gpt(10,45);return[A.wipe(),...graph(),gline([[0,0],[5,60]],"r"),gline([[0,0],[10,30]],"b"),gline([[0,0],[3,20],[6,20],[10,45]],"g"),
   A.tx("A",ax+14,ay+10,32,"r","start"),A.tx("B",bx+14,by+8,32,"b","start"),A.tx("C",cx+14,cy+8,32,"g","start"),A.tx("står still",gpt(4.5,20)[0],gpt(4.5,20)[1]-14,24,"g"),
   A.tx("brant = fort",600,180,30,"r","start"),A.tx("flack = sakta",600,230,30,"b","start"),A.tx("vågrät = still",600,280,30,"g","start")]}},
 {say:t3("Kom ihåg: fart = sträcka / tid. Från m/s till km/h multiplicerar du med 3,6, och tillbaka delar du med 3,6. Medelfart är hela sträckan delat med hela tiden. I en sträcka–tid-graf betyder brant linje hög fart och vågrät linje stillastående.",
   "Remember: speed = distance / time. From m/s to km/h you multiply by 3.6, and back you divide by 3.6. Average speed is the whole distance divided by the whole time. In a distance–time graph a steep line means high speed and a horizontal line means standing still.",
   "تذكّر: السرعة = المسافة ÷ الزمن. من m/s إلى km/h نضرب في 3,6 وللعودة نقسم على 3,6. السرعة المتوسطة هي المسافة الكلية مقسومة على الزمن الكلي. وفي منحنى المسافة والزمن الخط الشديد الانحدار يعني سرعة كبيرة والخط الأفقي يعني الوقوف."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["v = s / t","b"],["m/s · 3,6 = km/h","g"],["km/h : 3,6 = m/s","o"],["medelfart = hela sträckan / hela tiden","r"],["brant linje = hög fart, vågrät = still","v"]],80,150,62,32)]},
]};
const PIC2={
 still:()=>[...graphS(),A.p(`M${SX},${SY-90}L${SX+300},${SY-90}`,"b",5)],
 ab:()=>[...graphS(),A.p(`M${SX},${SY}L${SX+150},${SY-240}`,"r",5),A.p(`M${SX},${SY}L${SX+300},${SY-120}`,"b",5),A.tx("A",SX+162,SY-238,30,"r","start"),A.tx("B",SX+305,SY-118,30,"b","start")],
 v5:()=>{const xs=[[SX+75,2],[SX+150,4],[SX+225,6],[SX+300,8]],ys=[[SY-60,10],[SY-120,20],[SY-180,30],[SY-240,40]];let gd="";xs.forEach(([p])=>gd+=`M${p},${SY}V${SY-260}`);ys.forEach(([,],i)=>gd+=`M${SX},${SY-60*(i+1)}H${SX+310}`);
  return[A.p(gd,"#dde3ee",1.5),...axes(SX,SY,330,280,"tid (s)","sträcka (m)",xs,ys),A.p(`M${SX},${SY}L${SX+300},${SY-240}`,"b",5),dash(SX+300,SY,SX+300,SY-240,"g"),dash(SX,SY-240,SX+300,SY-240,"g")]},
};
const SX=70,SY=420;
function graphS(){return axes(SX,SY,330,280,"tid","sträcka")}
const BANK2=[
 {lv:0,q:"Vilken formel ger farten?",a:"fart = sträcka / tid",w:["fart = sträcka · tid","fart = tid / sträcka","fart = sträcka + tid"]},
 {lv:0,q:"En löpare springer 100 m på 20 s. Vilken är farten?",a:"5 m/s",w:["2 000 m/s","0,2 m/s","120 m/s"]},
 {lv:0,q:"Vilken enhet för fart står på svenska vägskyltar?",a:"km/h",w:["m/s","N","km"]},
 {lv:0,q:"Hur många sekunder är en timme?",a:"3 600 s",w:["60 s","360 s","100 s"]},
 {lv:0,q:"Vad gör föremålet enligt grafen?",a:"det står still",w:["det rör sig med jämn fart","det ökar farten","det rör sig baklänges"],lines:["Grafen visar sträcka","mot tid. Vad gör","föremålet?"],pic:PIC2.still},
 {lv:1,q:"Vad är 10 m/s i km/h?",a:"36 km/h",w:["3,6 km/h","100 km/h","13,6 km/h"]},
 {lv:1,q:"Vad är 72 km/h i m/s?",a:"20 m/s",w:["259,2 m/s","72 m/s","7,2 m/s"]},
 {lv:1,q:"En bil kör 150 km på 3 timmar. Vilken är medelfarten?",a:"50 km/h",w:["450 km/h","153 km/h","30 km/h"]},
 {lv:1,q:"Vad kallas farten som hastighetsmätaren visar just nu?",a:"momentanfart",w:["medelfart","sträcka","acceleration"]},
 {lv:1,q:"Vilket föremål har högst fart?",a:"A",w:["B","de har samma fart","det går inte att se"],lines:["Två föremål, A och B.","Vilket har","högst fart?"],pic:PIC2.ab},
 {lv:1,q:"En cyklist åker 300 m på 60 s. Skriv farten i m/s.",a:["5","5 m/s","5m/s"],lines:["Skriv svaret i m/s:","En cyklist åker 300 m","på 60 s. Vilken är farten?"]},
 {lv:2,q:"Hur lång tid tar 45 km med medelfarten 90 km/h?",a:"30 minuter",w:["2 timmar","45 minuter","4 050 timmar"]},
 {lv:2,q:"Usain Bolt sprang 100 m på ungefär 10 s. Ungefär hur fort är det i km/h?",a:"36 km/h",w:["10 km/h","100 km/h","3,6 km/h"],lines:["Usain Bolt sprang 100 m","på ungefär 10 s. Ungefär","hur fort är det i km/h?"]},
 {lv:2,q:"Hur långt kommer en bil på 2 h med medelfarten 70 km/h?",a:"140 km",w:["35 km","72 km","70 km"]},
 {lv:2,q:"Vilken fart visar grafen?",a:"5 m/s",w:["320 m/s","0,2 m/s","40 m/s"],lines:["Vilken fart","visar grafen?"],pic:PIC2.v5},
 {lv:2,q:"Linjen i en sträcka–tid-graf blir brantare. Vad betyder det?",a:"farten ökar",w:["farten minskar","föremålet står still","föremålet vänder"]},
 {lv:2,q:"Ljudet går 340 m/s. Hur många meter går det på 3 s?",a:["1020","1 020","1020 m","1 020 m"],lines:["Skriv svaret i meter:","Ljudet går 340 m/s. Hur","långt går det på 3 s?"]},
];
LESSONS.push({id:"f7k2",subject:"science",grades:"7",kind:"wb",year:7,ord:22,
 title:t3("Rörelse","Motion","الحركة"),
 icon:IC(`<path d="M40 150H290M40 150V25" stroke="#1d2433" stroke-width="3" fill="none"/><path d="M40 150L170 40" stroke="#d63b2f" stroke-width="5"/><path d="M40 150L280 90" stroke="#2257c9" stroke-width="5"/><text x="230" y="58" font-family="Caveat,cursive" font-weight="700" font-size="40" fill="#1e9e5a" text-anchor="middle">v = s/t</text>`),
 steps:F7K2.steps,mount:wbMount(F7K2),gen:bankGen(BANK2)});
WORDS.f7k2=["f7k_fart","f7k_stracka","f7k_medelfart","f7k_momentanfart","f7k_graf"];

/* ---------------------------------------------------------------
   3. f7k3: pendeln mäter tid – the period depends on the length, not the mass; the pendulum clock
   --------------------------------------------------------------- */
TERM("f7k_pendel",{sv:"pendel",m:W("(pendel(n|ns)?|pendlar(na)?)"),d:t3("En vikt som hänger i ett snöre eller en stång och svänger fram och tillbaka i jämn takt.","A weight hanging on a string or rod that swings back and forth at a steady rate.","ثقل معلّق بخيط أو قضيب يتأرجح ذهابًا وإيابًا بإيقاع منتظم."),ex:"En gunga är en pendel.",tr:{en:"pendulum",ar:"البندول"}});
TERM("f7k_svangningstid",{sv:"svängningstid",m:W("svängningstid(en|er)?"),d:t3("Tiden för en hel svängning, fram och tillbaka. Den beror på pendelns längd.","The time for one whole swing, there and back. It depends on the length of the pendulum.","زمن تأرجح كامل ذهابًا وإيابًا، ويعتمد على طول البندول."),ex:"En 1 m lång pendel har svängningstiden ca 2 s.",tr:{en:"period (time of one swing)",ar:"زمن الذبذبة"}});
TERM("f7k_utslag",{sv:"utslag",m:W("utslag(et|en)?"),d:t3("Hur långt pendeln svänger ut från sitt viloläge.","How far the pendulum swings out from its resting position.","مدى ابتعاد البندول عن وضع سكونه."),ex:"Utslaget minskar sakta.",tr:{en:"amplitude",ar:"السعة"}});
TERM("f7k_pendelur",{sv:"pendelur",m:W("pendelur(et|en)?"),d:t3("En klocka där en pendel styr hur fort visarna går.","A clock where a pendulum controls how fast the hands move.","ساعة يتحكّم فيها بندول في سرعة حركة العقارب."),ex:"Huygens byggde det första pendeluret 1656.",tr:{en:"pendulum clock",ar:"ساعة البندول"}});
/* a stand (gallows) for pendulums: top bar from x1 to x2 at y, foot at yb */
/* an arrow along a circle round (cx, cy): from angle a0 to a1 (degrees from straight down, + to the right) */
const arcArrow=(cx,cy,r,a0,a1,c="g",w=3.5)=>{const P=a=>[cx+Math.sin(a*Math.PI/180)*r,cy+Math.cos(a*Math.PI/180)*r],[x0,y0]=P(a0),[x1,y1]=P(a1),[xb,yb]=P(a1-(a1-a0)*.08),an=Math.atan2(y1-yb,x1-xb),h=14;
  return A.p(`M${f1(x0)},${f1(y0)}A${r},${r} 0 0 ${a1>a0?0:1} ${f1(x1)},${f1(y1)}M${f1(x1)},${f1(y1)}L${f1(x1-h*Math.cos(an-.45))},${f1(y1-h*Math.sin(an-.45))}M${f1(x1)},${f1(y1)}L${f1(x1-h*Math.cos(an+.45))},${f1(y1-h*Math.sin(an+.45))}`,c,w)};
const stand=(x1,x2,y,yb)=>[A.p(R.line(x1,y,x2,y,.3)+R.line(x1+10,y,x1+10,yb,.3),BRN,7),gnd(x1-30,x1+60,yb)];
const F7K3={steps:[
 {say:t3("En pendel är en vikt som hänger i ett snöre eller en stång och kan svänga fram och tillbaka. En gunga är en pendel, och så är den svängande vikten i ett gammalt golvur. Pendlar har en viktig egenskap: de svänger i en jämn takt.",
   "A pendulum is a weight hanging on a string or rod that can swing back and forth. A swing is a pendulum, and so is the swinging weight in an old grandfather clock. Pendulums have an important property: they swing at a steady rate.",
   "البندول ثقل معلّق بخيط أو قضيب يمكنه أن يتأرجح ذهابًا وإيابًا. الأرجوحة بندول، وكذلك الثقل المتأرجح في ساعة الحائط القديمة. وللبندول خاصية مهمة: يتأرجح بإيقاع منتظم."),
  draw:()=>[A.wipe(),ttl("Pendeln"),...stand(150,420,110,460),A.p(R.line(330,110,228,338,.2)+R.line(330,110,432,338,.2),"#c7cfdc",2.5),A.p(R.circ(228,338,24)+R.circ(432,338,24),"#c7cfdc",2.5),
   ...pendS(330,110,250,0,"b",24),arcArrow(330,110,290,-20,20,"g"),
   ...callout([330,112],480,150,"upphängning","k"),...callout([330,230],480,250,"snöre","k"),...callout([352,360],480,370,"vikt (lod)","b"),A.tx("svänger fram och tillbaka",330,445,28,"g")]},
 {say:t3("Tiden för en hel svängning, från ena ytterläget till det andra och tillbaka igen, kallas svängningstid. Det är svårt att mäta en enda svängning exakt. Mät därför tiden för tio svängningar och dela med tio. Tio svängningar på 14 s ger 1,4 s.",
   "The time for one whole swing, from one end position to the other and back again, is called the period. It is hard to time a single swing exactly. So time ten swings and divide by ten. Ten swings in 14 s gives 1.4 s.",
   "زمن التأرجح الكامل، من الطرف الأول إلى الطرف الآخر ثم العودة، يسمّى زمن الذبذبة. من الصعب قياس تأرجح واحد بدقة، لذلك نقيس زمن عشر ذبذبات ونقسم على عشرة. عشر ذبذبات في 14 ثانية تعطي 1,4 ثانية."),
  draw:()=>[A.wipe(),ttl("Svängningstid"),ceil(140,380,110),dash(260,110,260,350,"#9aa3b2"),...pendS(260,110,220,-28,"k"),...pendS(260,110,220,28,"b"),
   arcArrow(260,110,262,-26,26,"g"),arcArrow(260,110,288,26,-26,"o"),A.tx("fram och tillbaka",260,440,28,"g"),A.tx("= en svängning",260,474,28,"g"),
   ...watch(560,180,40,"k",14),A.tx("10 svängningar: 14 s",450,280,30,"k","start"),A.tx("1 svängning:",450,330,30,"k","start"),A.tx("14 / 10 = 1,4 s",450,375,32,"r","start")]},
 {say:t3("Enligt en berättelse satt den unge Galileo Galilei i domkyrkan i Pisa på 1580-talet och såg en lampa svänga i taket. Han jämförde med sin puls och märkte att varje svängning tog lika lång tid, vare sig lampan svängde mycket eller lite.",
   "According to a story, the young Galileo Galilei sat in the cathedral of Pisa in the 1580s and watched a lamp swinging from the ceiling. He compared it with his pulse and noticed that every swing took the same time, whether the lamp swung a lot or a little.",
   "تقول قصة إن غاليليو غاليلي الشاب جلس في كاتدرائية بيزا في ثمانينيات القرن السادس عشر ورأى مصباحًا يتأرجح من السقف. قارنه بنبضه فلاحظ أن كل تأرجح يستغرق الزمن نفسه، سواء تأرجح المصباح كثيرًا أو قليلًا."),
  draw:()=>[A.wipe(),ttl("Galileos upptäckt"),ceil(90,360,110),swing(225,110,240,30,2.4,"o",22),ceil(440,710,110),swing(575,110,240,10,2.4,"o",22),
   A.tx("stort utslag",225,420,30,"o"),A.tx("litet utslag",575,420,30,"o"),A.tx("samma svängningstid!",400,470,34,"g")]},
 {say:t3("Gör ett försök: häng en lätt och en tung vikt i lika långa snören och släpp dem samtidigt. De svänger i exakt samma takt! Svängningstiden beror inte på vikten, och nästan inte på hur stort utslaget är så länge det är ganska litet.",
   "Try an experiment: hang a light and a heavy weight on strings of the same length and let them go at the same time. They swing at exactly the same rate! The period does not depend on the weight, and hardly on the size of the swing as long as it is fairly small.",
   "جرّب: علّق ثقلًا خفيفًا وآخر ثقيلًا بخيطين متساويين في الطول وأفلتهما معًا. يتأرجحان بالإيقاع نفسه تمامًا! زمن الذبذبة لا يعتمد على الثقل، ولا يكاد يعتمد على مقدار السعة ما دامت صغيرة نسبيًّا."),
  draw:()=>[A.wipe(),ttl("Spelar vikten någon roll?"),...stand(120,680,110,440),swing(320,110,240,20,2.2,"g",14),swing(560,110,240,20,2.2,"r",30),
   A.tx("50 g",320,410,30,"g"),A.tx("500 g",560,410,30,"r"),A.tx("lika långa snören → samma takt",400,480,30,"k")]},
 {say:t3("Det som avgör svängningstiden är pendelns längd. En lång pendel svänger långsamt och en kort snabbt. Gör du pendeln fyra gånger så lång blir svängningstiden dubbelt så lång. En pendel som är 1 m lång har svängningstiden ungefär 2 s.",
   "What decides the period is the length of the pendulum. A long pendulum swings slowly and a short one quickly. If you make the pendulum four times as long, the period becomes twice as long. A pendulum 1 m long has a period of about 2 s.",
   "الذي يحدّد زمن الذبذبة هو طول البندول. البندول الطويل يتأرجح ببطء والقصير بسرعة. إذا جعلت البندول أطول بأربع مرات يصبح زمن الذبذبة ضعفين. والبندول الذي طوله متر واحد زمن ذبذبته نحو ثانيتين."),
  draw:()=>[A.wipe(),ttl("Längden avgör"),...stand(80,720,100,460),swing(220,100,80,22,1,"r",16),swing(400,100,160,22,1.42,"o",16),swing(600,100,320,14,2,"b",16),
   A.tx("25 cm",220,250,28,"r"),A.tx("1 s",220,290,30,"r"),A.tx("50 cm",400,330,28,"o"),A.tx("1,4 s",400,370,30,"o"),A.tx("1 m",712,300,28,"b","start"),A.tx("2 s",712,340,30,"b","start")]},
 {say:t3("År 1656 byggde holländaren Christiaan Huygens det första pendeluret. Pendeln styr ett kugghjul så att visarna flyttas ett litet steg för varje svängning. Pendelur var de noggrannaste klockorna som fanns i nästan 300 år.",
   "In 1656 the Dutchman Christiaan Huygens built the first pendulum clock. The pendulum controls a gear wheel so that the hands move a small step for each swing. Pendulum clocks were the most accurate clocks there were for almost 300 years.",
   "في عام 1656 بنى الهولندي كريستيان هويغنز أول ساعة بندول. يتحكّم البندول في عجلة مسنّنة فتتحرك العقارب خطوة صغيرة مع كل ذبذبة. وكانت ساعات البندول أدقّ الساعات الموجودة طوال نحو 300 عام."),
  draw:()=>{let gear="";for(let k=0;k<=48;k++){const a=k*Math.PI/24,r=k%4<2?48:38;gear+=(k?"L":"M")+f1(560+Math.cos(a)*r)+","+f1(250+Math.sin(a)*r)}gear+="Z"+R.circ(560,250,10);
   return[A.wipe(),ttl("Pendeluret"),A.p("M210,95L330,95L350,130L350,470L190,470L190,130Z","#8a5a2b",4.5),A.p(R.circ(270,170,48),"k",3.5),A.p("M270,170L270,136M270,170L292,184","k",4),
    ...[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>dot(+f1(270+Math.cos(k*Math.PI/6)*40),+f1(170+Math.sin(k*Math.PI/6)*40),"k",2.5)),swing(270,225,200,10,2,"o",20),
    A.p(gear,"k",3),A.p("M510,196Q560,168 610,196M510,196L522,214M610,196L598,214M560,182L560,150","r",4),A.tx("kugghjul",560,330,28,"k"),A.tx("ankare",580,150,26,"r","start"),
    A.tx("Huygens 1656",560,410,32,"b")]}},
 {say:t3("Går ett pendelur för sakta skruvar man upp vikten på pendeln. Då blir pendeln kortare och svänger fortare. Går klockan för fort flyttar man vikten nedåt. När det är varmt blir metallstången lite längre, och då går klockan lite efter.",
   "If a pendulum clock runs slow, you screw the weight up the pendulum. The pendulum becomes shorter and swings faster. If the clock runs fast, you move the weight down. When it is warm the metal rod gets a little longer, and then the clock loses a little time.",
   "إذا كانت ساعة البندول بطيئة نرفع الثقل على البندول، فيصبح أقصر ويتأرجح أسرع. وإذا كانت سريعة ننزل الثقل. وعندما يكون الجو حارًّا يطول القضيب المعدني قليلًا فتتأخر الساعة قليلًا."),
  draw:()=>[A.wipe(),ttl("Ställ klockan"),ceil(150,330,100),A.p(R.line(240,100,240,380,.2),"k",4),A.hatch("M210,330L270,330L270,380L210,380Z","o"),A.p(R.rect(210,330,60,50,.3),"o",4),A.p("M232,390h16M240,380v20","k",3),
   F(320,330,320,230,"g",5),A.tx("vikten upp:",350,240,30,"g","start"),A.tx("kortare → snabbare",350,280,30,"g","start"),F(320,390,320,470,"r",5),A.tx("vikten ner:",350,420,30,"r","start"),A.tx("längre → långsammare",350,460,30,"r","start"),
   A.tx("värme → längre stång",590,150,26,"o"),A.tx("→ klockan går efter",590,185,26,"o")]},
 {say:t3("Kom ihåg: en pendel svänger i jämn takt. Svängningstiden är tiden för en hel svängning fram och tillbaka. Den beror på pendelns längd, inte på vikten. Fyra gånger så lång pendel ger dubbelt så lång svängningstid. Pendeln styr pendeluret.",
   "Remember: a pendulum swings at a steady rate. The period is the time for one whole swing there and back. It depends on the length of the pendulum, not on the weight. A pendulum four times as long has twice the period. The pendulum controls the pendulum clock.",
   "تذكّر: البندول يتأرجح بإيقاع منتظم. زمن الذبذبة هو زمن تأرجح كامل ذهابًا وإيابًا، ويعتمد على طول البندول لا على الثقل. البندول الأطول بأربع مرات زمن ذبذبته ضعفان. والبندول يتحكّم في ساعة البندول."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["svängningstid = en hel svängning","b"],["mät 10 svängningar, dela med 10","g"],["längden avgör, inte vikten","r"],["4 · längden → 2 · tiden","o"],["kortare pendel → klockan går fortare","v"]],60,150,62,32),ceil(650,770,150),swing(710,150,200,14,2,"b",18)]},
]};
const PIC3={
 two:()=>[...stand(40,380,120,440),...pendS(130,120,110,0,"r"),...pendS(290,120,260,0,"b"),A.tx("A",165,245,30,"r"),A.tx("B",325,400,30,"b")],
 amp:()=>{const a=25*Math.PI/180,bx=210+Math.sin(a)*260,by=120+Math.cos(a)*260;
  return[ceil(60,360,120),dash(210,120,210,400,"#9aa3b2"),...pendS(210,120,260,25,"b"),A.p(`M210,380Q${f1((210+bx)/2)},${f1(392)} ${f1(bx-12)},${f1(by-4)}`,"r",4),qm(250,440,"r",40)]},
 lens:()=>[...stand(40,380,120,440),...pendS(130,120,70,0,"r"),...pendS(290,120,280,0,"b"),A.tx("25 cm",130,240,24,"r"),A.tx("A",130,280,30,"r"),A.tx("1 m",340,300,24,"b","start"),A.tx("B",340,340,30,"b","start"),A.tx("2 s",340,380,24,"b","start")],
};
const BANK3=[
 {lv:0,q:"Vad kallas tiden för en hel svängning fram och tillbaka?",a:"svängningstid",w:["medelfart","utslag","tyngd"]},
 {lv:0,q:"Vad bestämmer en pendels svängningstid?",a:"pendelns längd",w:["viktens massa","viktens färg","hur hårt man knuffar"]},
 {lv:0,q:"Vem byggde det första pendeluret?",a:"Christiaan Huygens",w:["Isaac Newton","Albert Einstein","Anders Celsius"]},
 {lv:0,q:"Vilken av dessa är en pendel?",a:"en gunga",w:["en cykel","en våg","en termometer"]},
 {lv:0,q:"Vilken pendel svänger snabbast?",a:"A, den korta",w:["B, den långa","de svänger lika snabbt","den som har tyngst vikt"],lines:["Vilken pendel","svänger snabbast?"],pic:PIC3.two},
 {lv:1,q:"Två lika långa pendlar har olika tunga vikter. Hur är svängningstiderna?",a:"lika långa",w:["den tunga svänger snabbare","den lätta svänger snabbare","den tunga står still"]},
 {lv:1,q:"En pendel gör 10 svängningar på 15 s. Vilken är svängningstiden?",a:"1,5 s",w:["150 s","15 s","0,67 s"]},
 {lv:1,q:"Varför mäter man tiden för tio svängningar?",a:"för att få ett noggrannare värde",w:["för att pendeln ska bli varm","för att en svängning inte syns","för att vikten ska bli lättare"]},
 {lv:1,q:"Ett pendelur går för sakta. Vad gör man?",a:"gör pendeln kortare",w:["gör pendeln längre","byter till en tyngre vikt","knuffar pendeln hårdare"]},
 {lv:1,q:"Vad kallas det som den röda bågen visar?",a:"utslag",w:["svängningstid","längd","massa"],lines:["Vad kallas det","som den röda","bågen visar?"],pic:PIC3.amp},
 {lv:1,q:"Skriv ordet: en klocka som styrs av en pendel kallas …",a:["pendelur","pendeluret","pendelklocka"],lines:["Skriv ordet som saknas:","En klocka som styrs av","en pendel kallas ett …"]},
 {lv:2,q:"En pendel på 1 m har svängningstiden 2 s. Vilken svängningstid får den om den görs 4 m lång?",a:"4 s",w:["8 s","2 s","16 s"],lines:["En pendel på 1 m har","svängningstiden 2 s. Vad blir","den om pendeln är 4 m?"]},
 {lv:2,q:"En pendel med svängningstiden 1 s ska få svängningstiden 2 s. Hur mycket längre måste den bli?",a:"4 gånger längre",w:["2 gånger längre","hälften så lång","8 gånger längre"],lines:["En pendel har svängningstiden 1 s.","Den ska få 2 s. Hur mycket","längre måste den bli?"]},
 {lv:2,q:"Varför går ett pendelur lite efter när det är varmt?",a:"metallen utvidgas och pendeln blir längre",w:["luften blir tunnare","vikten blir lättare","jorden snurrar fortare"]},
 {lv:2,q:"Hur många svängningar gör en pendel med svängningstiden 2 s på en minut?",a:"30",w:["120","60","2"]},
 {lv:2,q:"Vilken svängningstid har pendel A?",a:"1 s",w:["0,5 s","4 s","2 s"],lines:["Pendel B är 1 m och","har svängningstiden 2 s.","A är 25 cm. Vilken","svängningstid har A?"],pic:PIC3.lens},
 {lv:2,q:"En pendel gör 20 svängningar på 40 s. Skriv svängningstiden i sekunder.",a:["2","2 s","2s"],lines:["Skriv svaret i sekunder:","En pendel gör 20 svängningar","på 40 s. Vilken är svängningstiden?"]},
];
LESSONS.push({id:"f7k3",subject:"science",grades:"7",kind:"wb",year:7,ord:23,
 title:t3("Pendeln mäter tid","The pendulum measures time","البندول يقيس الزمن"),
 icon:IC(`<path d="M60 25H260" stroke="#8a5a2b" stroke-width="6"/><path d="M160 25L120 130" stroke="#1d2433" stroke-width="3" opacity=".35"/><circle cx="120" cy="130" r="18" fill="#dbe6fb" opacity=".5"/><path d="M160 25L200 130" stroke="#1d2433" stroke-width="3"/><circle cx="200" cy="130" r="18" fill="#dbe6fb" stroke="#2257c9" stroke-width="3.5"/><path d="M120 160Q160 172 200 160" stroke="#1e9e5a" stroke-width="3" fill="none"/>`),
 steps:F7K3.steps,mount:wbMount(F7K3),gen:bankGen(BANK3)});
WORDS.f7k3=["f7k_pendel","f7k_svangningstid","f7k_utslag","f7k_pendelur"];

/* ---------------------------------------------------------------
   4. f7k4: krafter påverkar materia – newton, the dynamometer, form and motion, counterforce
   --------------------------------------------------------------- */
TERM("f7k_kraft",{sv:"kraft",m:W("kraft(en|er|erna)?"),d:t3("En dragning eller en knuff. En kraft kan ändra ett föremåls form eller rörelse.","A pull or a push. A force can change an object's shape or motion.","سحب أو دفع. يمكن للقوة أن تغيّر شكل الجسم أو حركته."),ex:"Du använder kraft när du lyfter en väska.",tr:{en:"force",ar:"القوة"}});
TERM("f7k_dynamometer",{sv:"dynamometer",m:W("dynamometer(n|rar|rarna)?"),d:t3("Ett instrument som mäter kraft med hjälp av en fjäder som sträcks.","An instrument that measures force with a spring that stretches.","أداة تقيس القوة بواسطة نابض يتمدّد."),ex:"Dynamometern visar 3 N.",tr:{en:"spring scale (newton meter)",ar:"الدينامومتر (مقياس القوة)"}});
TERM("f7k_elastisk",{sv:"elastisk",m:W("elastisk(a|t)?"),d:t3("Om formen går tillbaka när kraften försvinner är formändringen elastisk. Blir den kvar är den plastisk.","If the shape returns when the force is gone the change is elastic. If it stays, it is plastic.","إذا عاد الشكل بعد زوال القوة فالتغيّر مرن، وإذا بقي فهو لدن."),ex:"Ett gummiband är elastiskt.",tr:{en:"elastic",ar:"مرن"}});
TERM("f7k_motkraft",{sv:"motkraft",m:W("motkraft(en|er)?"),d:t3("Den lika stora kraft i motsatt riktning som alltid uppstår när två föremål påverkar varandra.","The equal force in the opposite direction that always appears when two objects act on each other.","القوة المساوية في الاتجاه المعاكس التي تنشأ دائمًا عندما يؤثّر جسمان أحدهما في الآخر."),ex:"Väggen trycker tillbaka med en motkraft.",tr:{en:"counterforce (reaction)",ar:"القوة المعاكسة (ردّ الفعل)"}});
TERM("f7k_angrepp",{sv:"angreppspunkt",m:W("angreppspunkt(en|er)?"),d:t3("Punkten där en kraft verkar på ett föremål. Där börjar kraftpilen.","The point where a force acts on an object. The force arrow starts there.","النقطة التي تؤثّر فيها القوة في الجسم، ومنها يبدأ سهم القوة."),ex:"Angreppspunkten är där handen trycker.",tr:{en:"point of application",ar:"نقطة التأثير"}});
const zz=(x,y,n,len,amp)=>{let d=`M${x},${y}`;for(let i=1;i<n;i++)d+=`L${f1(x+len*i/n)},${y+(i%2?-amp:amp)}`;return d+`L${x+len},${y}`};
const F7K4={steps:[
 {say:t3("En kraft är en dragning eller en knuff. Du använder krafter hela tiden: när du lyfter en väska, sparkar en boll eller trycker på en knapp. Krafter kan vi inte se, men vi kan se vad de gör med saker.",
   "A force is a pull or a push. You use forces all the time: when you lift a bag, kick a ball or press a button. We cannot see forces, but we can see what they do to things.",
   "القوة سحب أو دفع. أنت تستخدم القوى طوال الوقت: عندما ترفع حقيبة أو تركل كرة أو تضغط زرًّا. لا نستطيع أن نرى القوى، لكننا نرى ما تفعله بالأشياء."),
  draw:()=>[A.wipe(),ttl("Krafter"),A.band(30,100,355,360,"r"),A.band(415,100,355,360,"b"),A.tx("en knuff",207,150,36,"r"),A.tx("en dragning",592,150,36,"b"),
   gnd(50,370,400),...man(110,400,1,"k",PUSH),...blk(165,320,110,80,"r"),F(170,290,300,290,"r",5),
   gnd(430,750,400),...blk(460,330,100,70,"b"),A.p("M560,365L656,320","k",3),...man(690,400,1,"k",{h:[-14,-130],n:[-10,-114],sh:[-8,-104],hip:[6,-56],f1:[30,0],f2:[-10,0],a1:[-36,-80],a2:[-34,-72]}),F(600,280,500,280,"b",5)]},
 {say:t3("Krafter mäts i enheten newton, förkortat N, efter den engelske fysikern Isaac Newton. För att lyfta något som har massan 100 g behövs ungefär 1 N. För att lyfta en liter mjölk, som har massan cirka 1 kg, behövs ungefär 10 N.",
   "Forces are measured in the unit newton, written N, after the English physicist Isaac Newton. To lift something with a mass of 100 g you need about 1 N. To lift a litre of milk, which has a mass of about 1 kg, you need about 10 N.",
   "تقاس القوى بوحدة النيوتن، ويرمز لها N، نسبة إلى الفيزيائي الإنجليزي إسحاق نيوتن. لرفع شيء كتلته 100 غرام نحتاج إلى نحو 1 نيوتن، ولرفع لتر من الحليب كتلته نحو 1 كغ نحتاج إلى نحو 10 نيوتن."),
  draw:()=>[A.wipe(),ttl("Newton (N)"),IMG("apple",210,270,0,{h:110}),F(210,330,210,368,"r",6),A.tx("100 g",210,410,30,"k"),A.tx("≈ 1 N",210,450,34,"r"),
   A.p("M520,190L600,190L600,380L520,380ZM520,190L540,160L580,160L600,190","b",4),A.hatch("M520,250L600,250L600,380L520,380Z","b"),A.tx("MJÖLK",560,230,22,"b"),F(560,385,560,470,"r",6),A.tx("1 kg",660,300,30,"k","start"),A.tx("≈ 10 N",660,345,34,"r","start")]},
 {say:t3("Krafter mäts med en dynamometer. Inuti finns en fjäder. Ju större kraft som drar i kroken, desto mer sträcks fjädern. Dubbelt så stor kraft ger dubbelt så stor sträckning. Därför kan man sätta en jämn skala på dynamometern.",
   "Forces are measured with a spring scale, a dynamometer. Inside it there is a spring. The bigger the force pulling on the hook, the more the spring stretches. Twice the force gives twice the stretch. That is why the dynamometer can have an even scale.",
   "تقاس القوى بالدينامومتر، وفي داخله نابض. كلما كانت القوة التي تسحب الخطاف أكبر تمدّد النابض أكثر. القوة المضاعفة تعطي تمدّدًا مضاعفًا، ولهذا يمكن وضع تدريج منتظم على الدينامومتر."),
  draw:()=>[A.wipe(),ceil(80,720,40),...[[180,0],[400,2],[620,4]].flatMap(([x,f])=>[A.p(`M${x},40V52`,"k",3),...dyno(x,60,f,5),...(f?wt(x+2,dyHook(60,f)+12,40+f*4,f*10+20,"o"):[])]),
   A.tx("visar 0 N",230,150,26,"r","start"),A.tx("visar 2 N",450,150,26,"r","start"),A.tx("visar 4 N",670,150,26,"r","start"),A.tx("dubbel kraft → dubbel sträckning",400,485,28,"b")]},
 {say:t3("En kraft kan ändra formen på ett föremål. Går föremålet tillbaka till sin form när kraften försvinner, som en fjäder eller ett gummiband, är formändringen elastisk. Blir formen kvar, som när du trycker ihop en bit lera, är den plastisk.",
   "A force can change the shape of an object. If the object goes back to its shape when the force is gone, like a spring or a rubber band, the change is elastic. If the shape stays, like when you squeeze a piece of clay, it is plastic.",
   "يمكن للقوة أن تغيّر شكل الجسم. إذا عاد الجسم إلى شكله بعد زوال القوة، مثل النابض أو الشريط المطاطي، فالتغيّر مرن. وإذا بقي الشكل الجديد، كما عندما تضغط قطعة صلصال، فالتغيّر لدن."),
  draw:()=>[A.wipe(),ttl("Kraft ändrar form"),A.band(30,100,355,370,"g"),A.band(415,100,355,370,"o"),A.tx("elastisk",207,150,36,"g"),A.tx("plastisk",592,150,36,"o"),
    A.p(zz(60,220,10,140,14),"g",3.5),A.tx("i vila",230,228,24,"k","start"),A.p(zz(60,310,10,240,10),"g",3.5),F(300,310,350,310,"r",5),A.tx("dras ut",130,350,24),
    A.p(zz(60,410,10,140,14),"g",3.5),A.tx("tillbaka igen",230,418,24,"g","start"),
    A.hatch(R.circ(530,250,44),"o"),A.p(R.circ(530,250,44),"o",3.5),F(640,220,590,240,"r",5),A.arrow(530,305,530,350,"k"),
    A.hatch("M470,410Q470,380 530,376Q600,376 610,410Z","o"),A.p("M470,410Q470,380 530,376Q600,376 610,410Z","o",3.5),A.tx("formen blir kvar",592,450,26,"o")]},
 {say:t3("En kraft kan också ändra ett föremåls rörelse. Den kan få något att börja röra sig, öka eller minska farten, eller byta riktning. En spark sätter en boll i rörelse, målvaktens händer stoppar den, och en vägg kan få den att studsa åt ett annat håll.",
   "A force can also change an object's motion. It can make something start moving, speed up or slow down, or change direction. A kick sets a ball in motion, the goalkeeper's hands stop it, and a wall can make it bounce another way.",
   "يمكن للقوة أيضًا أن تغيّر حركة الجسم: أن تجعله يبدأ بالحركة، أو تزيد سرعته أو تنقصها، أو تغيّر اتجاهه. الركلة تحرّك الكرة، ويدا حارس المرمى توقفانها، والجدار يجعلها ترتدّ في اتجاه آخر."),
  draw:()=>[A.wipe(),ttl("Kraft ändrar rörelse"),gnd(40,450,410),...ball(110,385,22,"o"),F(50,385,84,385,"r",6),A.tx("sparken",80,345,24,"r"),
   ...[200,290,380].flatMap(x=>ball(x,385,22,"o")),A.tx("bollen sätts i rörelse",240,450,26),
   A.p(R.line(720,130,720,420,.2)+"M720,140L740,160M720,190L740,210M720,240L740,260M720,290L740,310M720,340L740,360M720,390L740,410","k",4),
   A.p(R.arrow(500,200,660,200),"b",3),A.tx("före",490,208,26,"b","end"),A.p(R.arrow(660,330,500,330),"b",3),A.tx("efter",490,338,26,"b","end"),
   ...ball(696,265,22,"o"),F(718,265,610,265,"r",6),A.tx("väggens kraft",600,273,24,"r","end"),A.tx("byter riktning",600,140,28,"b")]},
 {say:t3("För att beskriva en kraft behövs tre saker: hur stor den är, åt vilket håll den verkar och var den angriper, alltså angreppspunkten. Därför ritar vi krafter som pilar. Pilen börjar i angreppspunkten och pilens längd visar hur stor kraften är.",
   "To describe a force you need three things: how big it is, which way it acts and where it acts, the point of application. That is why we draw forces as arrows. The arrow starts at the point of application and its length shows how big the force is.",
   "لوصف القوة نحتاج إلى ثلاثة أشياء: مقدارها، واتجاهها، ومكان تأثيرها أي نقطة التأثير. لهذا نرسم القوى أسهمًا: يبدأ السهم من نقطة التأثير، ويُظهر طوله مقدار القوة."),
  draw:()=>[A.wipe(),ttl("Kraften som en pil"),gnd(60,560,380),...blk(100,250,160,130,"b"),dot(260,315,"r",7),F(260,315,500,315,"r",7),
   ...callout([262,318],300,440,"angreppspunkt","r",28,"start"),A.p(R.arrow(380,262,268,262)+R.arrow(380,262,492,262),"k",2.5),A.tx("längd = storlek",380,240,28,"k"),
   A.tx("riktning →",520,325,28,"r","start"),A.tx("F = 40 N",650,200,34,"r")]},
 {say:t3("Krafter kommer alltid i par. Trycker du mot en vägg, trycker väggen lika hårt tillbaka på dig. Den kraften kallas motkraft. Om du står på en skateboard och knuffar på väggen rullar du därför bort från väggen.",
   "Forces always come in pairs. If you push against a wall, the wall pushes back on you just as hard. That force is called the counterforce. So if you stand on a skateboard and push the wall, you roll away from the wall.",
   "القوى تأتي دائمًا في أزواج. إذا دفعت جدارًا يدفعك الجدار بالقوة نفسها. تسمّى هذه القوة القوة المعاكسة. لذلك إذا وقفت على لوح تزلّج ودفعت الجدار فإنك تتدحرج مبتعدًا عنه."),
  draw:()=>[A.wipe(),ttl("Motkraft"),gnd(60,600,420),A.hatch(rp(600,110,40,310),"k"),A.p(R.rect(600,110,40,310,.3),"k",4),
   ...man(470,392,1.1,"k",{h:[30,-128],n:[24,-112],sh:[20,-102],hip:[0,-56],f1:[12,0],f2:[-22,0],a1:[118,-104],a2:[118,-92]}),A.p("M410,394L530,394","k",4),A.p(R.circ(428,408,10)+R.circ(512,408,10),"k",3),
   F(642,262,740,262,"r",6),A.tx("på väggen",650,236,26,"r","start"),F(596,322,500,322,"b",6),A.tx("på dig",548,360,26,"b"),A.tx("lika stora, motsatt riktning",400,130,30,"k"),
   F(360,455,220,455,"g",5),A.tx("du rullar bort",200,465,28,"g","end")]},
 {say:t3("Kom ihåg: en kraft är en knuff eller en dragning och mäts i newton med en dynamometer. Kraft kan ändra ett föremåls form, elastiskt eller plastiskt, och dess rörelse. En kraft har storlek, riktning och angreppspunkt. Varje kraft har en motkraft.",
   "Remember: a force is a push or a pull and is measured in newtons with a spring scale. A force can change an object's shape, elastically or plastically, and its motion. A force has size, direction and a point of application. Every force has a counterforce.",
   "تذكّر: القوة دفع أو سحب وتقاس بالنيوتن بالدينامومتر. يمكن للقوة أن تغيّر شكل الجسم، تغييرًا مرنًا أو لدنًا، وأن تغيّر حركته. للقوة مقدار واتجاه ونقطة تأثير. ولكل قوة قوة معاكسة."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["kraft mäts i newton (N)","r"],["dynamometer: en fjäder sträcks","b"],["kraft ändrar form eller rörelse","g"],["storlek, riktning, angreppspunkt","o"],["varje kraft har en motkraft","v"]],80,150,62,32)]},
]};
const PIC4={
 dyn3:()=>[ceil(120,300,90),...dyno(210,100,3,5),...wt(212,dyHook(100,3)+12,44,46,"o")],
 skate:()=>[gnd(30,330,420),A.hatch(rp(330,140,30,280),"k"),A.p(R.rect(330,140,30,280,.3),"k",4),...man(220,392,1.05,"k",{h:[30,-128],n:[24,-112],sh:[20,-102],hip:[0,-56],f1:[12,0],f2:[-22,0],a1:[104,-104],a2:[104,-92]}),
  A.p("M160,394L280,394","k",4),A.p(R.circ(178,408,10)+R.circ(262,408,10),"k",3),qm(90,300,"r")],
 arrows:()=>[[130,60],[220,110],[310,180]].flatMap(([y,l],i)=>[...blk(80,y,60,50,"b"),F(140,y+25,140+l,y+25,"r",6),A.tx("ABC"[i],50,y+36,30,"k")]),
};
const BANK4=[
 {lv:0,q:"Vilken enhet har kraft?",a:"newton (N)",w:["kilogram (kg)","meter (m)","watt (W)"]},
 {lv:0,q:"Vilket instrument mäter kraft?",a:"dynamometer",w:["termometer","linjal","barometer"]},
 {lv:0,q:"Vad finns inuti en dynamometer?",a:"en fjäder",w:["en magnet","ett batteri","vatten"]},
 {lv:0,q:"Ungefär hur stor kraft behövs för att lyfta 100 g?",a:"1 N",w:["100 N","10 N","0,01 N"]},
 {lv:0,q:"Hur stor kraft visar dynamometern?",a:"3 N",w:["6 N","30 N","1 N"],lines:["Hur stor kraft","visar","dynamometern?"],pic:PIC4.dyn3},
 {lv:1,q:"Ett gummiband dras ut och går tillbaka. Vad kallas formändringen?",a:"elastisk",w:["plastisk","magnetisk","flytande"]},
 {lv:1,q:"Du trycker ihop en bit lera och den behåller formen. Vad kallas formändringen?",a:"plastisk",w:["elastisk","fjädrande","magnetisk"]},
 {lv:1,q:"En dynamometer sträcks 2 cm av 4 N. Hur långt sträcks den av 8 N?",a:"4 cm",w:["2 cm","8 cm","16 cm"]},
 {lv:1,q:"Vad kan en kraft INTE göra?",a:"ändra ett föremåls massa",w:["ändra föremålets form","ändra föremålets fart","ändra föremålets riktning"]},
 {lv:1,q:"Åt vilket håll rullar personen när hon knuffar på väggen?",a:"bort från väggen",w:["mot väggen","uppåt","hon står helt still"],lines:["Personen knuffar","på väggen. Åt vilket","håll rullar hon?"],pic:PIC4.skate},
 {lv:1,q:"Skriv ordet: instrumentet som mäter kraft heter …",a:["dynamometer","dynamometern","kraftmätare"],lines:["Skriv ordet som saknas:","Instrumentet som mäter","kraft heter en …"]},
 {lv:2,q:"Du trycker med 50 N mot en vägg. Hur stor är motkraften från väggen?",a:"50 N",w:["0 N","25 N","100 N"]},
 {lv:2,q:"Vilka tre saker behövs för att beskriva en kraft?",a:"storlek, riktning och angreppspunkt",w:["massa, färg och form","fart, tid och sträcka","längd, bredd och höjd"]},
 {lv:2,q:"En fjäder sträcks 3 cm av 1 N. Med vilken kraft drar man om den sträcks 12 cm?",a:"4 N",w:["12 N","36 N","3 N"]},
 {lv:2,q:"En boll studsar mot en vägg. Vad har kraften från väggen gjort?",a:"ändrat bollens riktning",w:["ändrat bollens massa","tagit bort tyngdkraften","gjort bollen plastisk"]},
 {lv:2,q:"Vilken pil visar störst kraft?",a:"C",w:["A","B","alla är lika stora"],lines:["Pilarna är ritade","i samma skala. Vilken","pil visar störst kraft?"],pic:PIC4.arrows},
 {lv:2,q:"En vikt får dynamometern att visa 5 N. Du hänger på en likadan vikt till. Skriv vad den visar då.",a:["10","10 n","10n","10 newton"],lines:["Skriv svaret i newton:","En vikt ger 5 N. Du hänger","på en likadan vikt till.","Vad visar dynamometern nu?"]},
];
LESSONS.push({id:"f7k4",subject:"science",grades:"7",kind:"wb",year:7,ord:24,
 title:t3("Krafter påverkar materia","Forces act on matter","القوى تؤثّر في المادة"),
 icon:IC(`<circle cx="100" cy="24" r="7" fill="none" stroke="#1d2433" stroke-width="3"/><rect x="86" y="34" width="28" height="90" fill="#fff" stroke="#1d2433" stroke-width="3"/><path d="M100 38L108 46L92 56L108 66L92 76L100 84" stroke="#2257c9" stroke-width="3" fill="none"/><path d="M88 84H112" stroke="#d63b2f" stroke-width="4"/><path d="M100 84V140" stroke="#1d2433" stroke-width="3"/><path d="M84 146H116L120 170H80Z" fill="#fbe7cc" stroke="#e07b00" stroke-width="3"/><text x="230" y="110" font-family="Caveat,cursive" font-weight="700" font-size="56" fill="#d63b2f" text-anchor="middle">N</text>`),
 steps:F7K4.steps,mount:wbMount(F7K4),gen:bankGen(BANK4)});
WORDS.f7k4=["f7k_kraft","f7k_newton","f7k_dynamometer","f7k_elastisk","f7k_motkraft","f7k_angrepp"];

/* ---------------------------------------------------------------
   5. f7k5: friktion – static and sliding friction, rolling, good and bad friction, lubrication, tyres, air resistance
   --------------------------------------------------------------- */
TERM("f7k_friktion",{sv:"friktion",m:W("friktion(en|er)?"),d:t3("En kraft som uppstår när två ytor gnids mot varandra. Den är riktad mot rörelsen och bromsar.","A force that appears when two surfaces rub against each other. It acts against the motion and slows it down.","قوة تنشأ عندما يحتكّ سطحان أحدهما بالآخر، تكون عكس اتجاه الحركة وتبطئها."),ex:"Friktionen får boken att stanna.",tr:{en:"friction",ar:"الاحتكاك"}});
TERM("f7k_vilofriktion",{sv:"vilofriktion",m:W("vilofriktion(en)?"),d:t3("Friktionen som håller kvar ett föremål som står still. Den är större än glidfriktionen.","The friction that holds an object that is standing still. It is larger than sliding friction.","الاحتكاك الذي يُبقي الجسم الساكن في مكانه، وهو أكبر من احتكاك الانزلاق."),ex:"Vilofriktionen måste övervinnas först.",tr:{en:"static friction",ar:"الاحتكاك السكوني"}});
TERM("f7k_glidfriktion",{sv:"glidfriktion",m:W("glidfriktion(en)?"),d:t3("Friktionen när ett föremål glider över en yta.","The friction when an object slides over a surface.","الاحتكاك عندما ينزلق جسم على سطح."),ex:"Glidfriktionen bromsar pulkan.",tr:{en:"sliding friction",ar:"احتكاك الانزلاق"}});
TERM("f7k_rullfriktion",{sv:"rullfriktion",m:W("rullfriktion(en)?"),d:t3("Friktionen när något rullar. Den är mycket mindre än glidfriktionen.","The friction when something rolls. It is much smaller than sliding friction.","الاحتكاك عندما يتدحرج شيء، وهو أصغر بكثير من احتكاك الانزلاق."),ex:"Hjul ger liten rullfriktion.",tr:{en:"rolling friction",ar:"احتكاك التدحرج"}});
TERM("f7k_smorjmedel",{sv:"smörjmedel",m:W("(smörjmedel|smörj(a|er|ning(en)?))"),d:t3("Olja eller fett som läggs mellan två ytor för att minska friktionen.","Oil or grease put between two surfaces to reduce friction.","زيت أو شحم يوضع بين سطحين لتقليل الاحتكاك."),ex:"Cykelkedjan behöver smörjmedel.",tr:{en:"lubricant",ar:"مادة التشحيم"}});
TERM("f7k_luftmotstand",{sv:"luftmotstånd",m:W("luftmotstånd(et)?"),d:t3("Den bromsande kraften från luften på något som rör sig. Den ökar mycket med farten.","The braking force from the air on something that moves. It grows a lot with speed.","قوة الكبح التي يؤثّر بها الهواء في جسم متحرك، وتزداد كثيرًا مع السرعة."),ex:"Fallskärmen ger stort luftmotstånd.",tr:{en:"air resistance",ar:"مقاومة الهواء"}});
/* a rough surface line: a zigzag with uneven teeth along y between x1 and x2 (up = teeth point up) */
const rough=(x1,x2,y,amp,up=1,step=18,seed=1)=>{let d=`M${x1},${y}`;for(let x=x1+step/2,i=0;x<x2;x+=step,i++){const a=amp*(.45+.55*Math.abs(Math.sin((i+1)*seed*1.7)));d+=`L${f1(x)},${f1(y-up*a)}L${f1(Math.min(x2,x+step/2))},${y}`}return d};
/* a spring scale lying down: hook at the left end (x, y), marker at reading f of max */
const hdyno=(x,y,f,max=15)=>{const L=170,S=120,ix=x+30+f/max*S;let tk="";for(let k=0;k<=max;k+=5)tk+=`M${f1(x+30+k/max*S)},${y-14}v-9`;
  return[A.p(`M${x},${y}h14`,"k",3.5),A.p(R.rect(x+14,y-12,L,24,.3),"k",3.5),A.p(tk,"k",2.5),A.p(`M${f1(ix)},${y-10}v20`,"r",4.5),A.p(`M${x+14+L},${y}h24`,"k",3.5)]};
const F7K5={steps:[
 {say:t3("Skjut en bok över bordet och släpp den. Boken stannar snart. Det beror på friktion, en kraft som uppstår när två ytor gnids mot varandra. Friktionen är alltid riktad mot rörelsen och bromsar den.",
   "Push a book across the table and let go. The book soon stops. That is because of friction, a force that appears when two surfaces rub against each other. Friction always acts against the motion and slows it down.",
   "ادفع كتابًا على الطاولة ثم اتركه. سرعان ما يتوقّف الكتاب. السبب هو الاحتكاك، وهو قوة تنشأ عندما يحتكّ سطحان أحدهما بالآخر. الاحتكاك يكون دائمًا عكس اتجاه الحركة ويبطئها."),
  draw:()=>[A.wipe(),ttl("Friktion"),A.p(R.line(40,330,760,330,.3),BRN,6),A.p("M90,330V440M710,330V440",BRN,6),
   ...[110,260,380,470].map(x=>A.p(R.rect(x,282,110,48,.3),"#c7cfdc",2.5)),...blk(520,282,110,48,"b"),
   F(300,240,520,240,"b",5),A.tx("rörelse",410,225,28,"b"),F(575,346,455,346,"r",6),A.tx("friktion",440,385,30,"r","end"),A.tx("boken stannar",640,265,26,"k","start")]},
 {say:t3("Även ytor som ser släta ut är ojämna om man förstorar dem. De små topparna hakar i varandra. Ju hårdare ytorna pressas mot varandra, till exempel av en tyngre bok, och ju strävare de är, desto större blir friktionen.",
   "Even surfaces that look smooth are uneven if you magnify them. The tiny peaks catch on each other. The harder the surfaces are pressed together, for example by a heavier book, and the rougher they are, the greater the friction.",
   "حتى الأسطح التي تبدو ملساء تكون غير مستوية إذا كبّرناها، فتتشابك نتوءاتها الصغيرة. وكلما ضُغط السطحان أحدهما على الآخر أكثر، مثلًا بكتاب أثقل، وكلما كانا أخشن، ازداد الاحتكاك."),
  draw:()=>[A.wipe(),ttl("Varför uppstår friktion?"),A.p(R.line(40,330,330,330,.3),BRN,6),...blk(110,270,130,60,"b"),A.p(R.circ(240,330,26),"k",3),
   A.p("M262,316L420,170M262,344L420,420","#9aa3b2",2),A.p(R.circ(560,290,150),"k",3.5),
   A.hatch(rough(420,700,300,22,1,30,3)+"L700,160L420,160Z","b"),A.p(rough(420,700,300,22,1,30,3),"b",3.5),
   A.hatch(rough(420,700,290,22,-1,30,5)+"L700,430L420,430Z","o"),A.p(rough(420,700,290,22,-1,30,5),BRN,3.5),
   A.tx("förstorat",560,120,28,"k"),A.tx("topparna hakar i",560,475,28,"r")]},
 {say:t3("Det är tyngre att få en tung låda att börja glida än att hålla den i rörelse. När lådan står still verkar vilofriktion, och den är störst. När lådan glider verkar glidfriktion, som är lite mindre. Med en dynamometer kan du mäta båda.",
   "It is harder to get a heavy box to start sliding than to keep it moving. While the box stands still, static friction acts, and it is the largest. When the box slides, sliding friction acts, which is a little smaller. You can measure both with a spring scale.",
   "دفع صندوق ثقيل ليبدأ بالانزلاق أصعب من إبقائه متحرّكًا. عندما يكون الصندوق ساكنًا يؤثّر الاحتكاك السكوني وهو الأكبر، وعندما ينزلق يؤثّر احتكاك الانزلاق وهو أصغر قليلًا. يمكنك قياس الاثنين بالدينامومتر."),
  draw:()=>[A.wipe(),ttl("Vilofriktion och glidfriktion"),gnd(40,500,240),...blk(70,170,120,70,"o"),A.p("M190,205H230","k",3),...hdyno(230,205,12),F(450,205,500,205,"k",4),
   A.tx("börjar glida",540,190,30,"r","start"),A.tx("12 N",540,228,32,"r","start"),
   gnd(40,500,420),...blk(110,350,120,70,"o"),A.p("M230,385H270","k",3),...hdyno(270,385,8),F(490,385,540,385,"k",4),F(130,330,80,330,"b",4),
   A.tx("glider",580,370,30,"b","start"),A.tx("8 N",580,408,32,"b","start"),A.tx("vilofriktion > glidfriktion",400,480,30,"k")]},
 {say:t3("Sätt hjul under lådan, så blir det mycket lättare. Rullfriktion är mycket mindre än glidfriktion. Därför har vagnar och bilar hjul, och därför sitter det kullager i cyklar, skateboards och maskiner.",
   "Put wheels under the box and it becomes much easier. Rolling friction is much smaller than sliding friction. That is why carts and cars have wheels, and why there are ball bearings in bikes, skateboards and machines.",
   "ضع عجلات تحت الصندوق فيصبح الأمر أسهل بكثير. احتكاك التدحرج أصغر بكثير من احتكاك الانزلاق، ولهذا للعربات والسيارات عجلات، ولهذا توجد محامل كروية في الدراجات ولوحات التزلّج والآلات."),
  draw:()=>{const balls=[...Array(10)].map((_,k)=>{const a=k*Math.PI/5;return R.circ(600+Math.cos(a)*70,280+Math.sin(a)*70,16)}).join("");
   return[A.wipe(),ttl("Rullfriktion"),gnd(40,420,380),...blk(90,250,180,100,"o"),A.p(R.circ(130,358,22)+R.circ(230,358,22),"k",4),dot(130,358,"k",4),dot(230,358,"k",4),
    F(290,300,380,300,"g",5),A.tx("lätt att dra",330,270,26,"g"),A.p(R.circ(600,280,100)+R.circ(600,280,40),"k",4),A.hatch(balls,"b"),A.p(balls,"b",3),A.tx("kullager",600,430,32,"b"),
    A.tx("kulorna rullar",600,470,26,"k")]}},
 {say:t3("Friktion är ofta bra. Utan friktion skulle vi inte kunna gå, eftersom skorna skulle glida. Bromsar fungerar tack vare friktion, och däcken måste greppa vägen. När det är halt sandar man gator för att öka friktionen.",
   "Friction is often good. Without friction we could not walk, because our shoes would slip. Brakes work thanks to friction, and tyres must grip the road. When it is slippery, roads are gritted to increase friction.",
   "الاحتكاك مفيد في أحيان كثيرة. فبدونه لا نستطيع المشي لأن الأحذية ستنزلق. المكابح تعمل بفضل الاحتكاك، والإطارات يجب أن تتمسّك بالطريق. وعندما يكون الطريق زلقًا تُرشّ الشوارع بالرمل لزيادة الاحتكاك."),
  draw:()=>[A.wipe(),ttl("Bra friktion"),
   A.p("M70,300Q70,240 120,236L160,232Q190,200 230,206L250,250Q260,292 250,300Z","k",4),A.p(rough(70,250,300,10,-1,16,2),"k",3.5),A.tx("skor som greppar",160,370,26),
   A.p(R.circ(400,260,70)+R.circ(400,260,20),"k",4),A.hatch(rp(460,230,30,60),"r"),A.p(R.rect(460,230,30,60,.3),"r",4),F(530,260,494,260,"r",5),A.tx("bromsen trycker",400,370,26),
   A.band(570,280,200,50,"b"),A.tx("is",590,272,22,"b","start"),A.p("M590,300l.1,0M620,312l.1,0M650,296l.1,0M680,318l.1,0M710,302l.1,0M740,314l.1,0M605,322l.1,0M695,288l.1,0",BRN,9),A.tx("sand på isen",670,370,26),
   A.tx("friktionen hjälper oss",400,450,32,"g")]},
 {say:t3("Friktion kan också vara ett problem. Den gör att delar nöts och blir varma. Gnid händerna mot varandra så känner du värmen! I en motor används olja som smörjmedel. Oljan lägger sig som ett tunt lager mellan ytorna så att de inte gnids direkt mot varandra.",
   "Friction can also be a problem. It makes parts wear and get hot. Rub your hands together and you feel the heat! In an engine, oil is used as a lubricant. The oil forms a thin layer between the surfaces so they don't rub directly against each other.",
   "قد يكون الاحتكاك مشكلة أيضًا، فهو يجعل الأجزاء تتآكل وتسخن. افرك يديك معًا وستشعر بالحرارة! في المحرك يُستخدم الزيت مادةً للتشحيم، فيشكّل طبقة رقيقة بين السطحين حتى لا يحتكّا مباشرة."),
  draw:()=>[A.wipe(),ttl("Smörjning"),A.band(30,100,355,370,"r"),A.band(415,100,355,370,"g"),A.tx("utan olja",207,150,34,"r"),A.tx("med olja",592,150,34,"g"),
   A.hatch(rough(60,350,280,16,1,26,3)+"L350,190L60,190Z","b"),A.p(rough(60,350,280,16,1,26,3),"b",3.5),A.hatch(rough(60,350,272,16,-1,26,5)+"L350,370L60,370Z","o"),A.p(rough(60,350,272,16,-1,26,5),BRN,3.5),
   A.p("M45,300Q37,280 45,260Q53,240 45,220M370,300Q362,280 370,260Q378,240 370,220","r",3),A.tx("nötning och värme",207,420,28,"r"),
   A.hatch(rough(445,740,250,16,1,26,3)+"L740,190L445,190Z","b"),A.p(rough(445,740,250,16,1,26,3),"b",3.5),A.band(445,256,295,38,"o"),A.p("M445,275Q520,266 595,275T740,275","o",3),
   A.hatch(rough(445,740,300,16,-1,26,5)+"L740,370L445,370Z","o"),A.p(rough(445,740,300,16,-1,26,5),BRN,3.5),A.tx("olja",760,282,26,"o","end"),A.tx("ytorna glider lätt",592,420,28,"g")]},
 {say:t3("Ett bildäck har ett mönster av spår. På våt väg leder spåren bort vattnet så att däcket får kontakt med asfalten. Med slitna däck kan bilen glida upp på ett vattenlager. Det kallas vattenplaning. På vintern ger dubbdäck eller mjuka vinterdäck bättre grepp.",
   "A car tyre has a pattern of grooves. On a wet road the grooves lead the water away so that the tyre touches the asphalt. With worn tyres the car can slide up onto a layer of water. That is called aquaplaning. In winter, studded or soft winter tyres give better grip.",
   "لإطار السيارة نقشة من الأخاديد. على الطريق المبلّل تُبعد الأخاديد الماء فيلامس الإطار الإسفلت. أما مع الإطارات البالية فقد تنزلق السيارة فوق طبقة من الماء، ويسمّى ذلك الانزلاق المائي. وفي الشتاء تعطي الإطارات ذات المسامير أو الإطارات الشتوية الطرية تماسكًا أفضل."),
  draw:()=>[A.wipe(),ttl("Däcken"),A.band(30,100,355,370,"g"),A.band(415,100,355,370,"r"),A.tx("djupa spår",207,134,32,"g"),A.tx("slitet däck",592,134,32,"r"),
   A.p("M110,190Q110,170 130,170L285,170Q305,170 305,190L305,360L110,360Z","k",4),...[140,180,220,260].map(x=>A.p(`M${x},180V350`,"k",4)),
   A.band(70,362,270,26,"b"),A.flow("M160,380Q160,300 160,200","b",4,2.2,5),A.flow("M240,380Q240,300 240,200","b",4,2.6,5),A.tx("vattnet leds bort",207,430,26,"g"),
   A.p("M495,170Q495,150 515,150L670,150Q690,150 690,170L690,320L495,320Z","k",4),...[530,570,610,650].map(x=>A.p(`M${x},160V180`,"k",3)),
   A.hatch(rp(460,322,270,36),"b"),A.p("M460,340Q530,330 595,340T730,340","b",3),A.tx("vattenplaning",592,410,30,"r"),A.tx("däcket glider på vattnet",592,450,24,"r")]},
 {say:t3("Även luft och vatten bromsar det som rör sig genom dem. Luftmotståndet ökar mycket när farten ökar. Därför har snabba bilar, tåg och cyklister strömlinjeform. En fallskärm använder i stället luftmotståndet för att bromsa fallet.",
   "Air and water also slow down things that move through them. Air resistance grows a lot as speed increases. That is why fast cars, trains and cyclists have a streamlined shape. A parachute instead uses air resistance to slow the fall.",
   "الهواء والماء يبطئان أيضًا ما يتحرّك خلالهما. وتزداد مقاومة الهواء كثيرًا عندما تزداد السرعة، ولهذا للسيارات والقطارات السريعة والدرّاجين شكل انسيابي. أما المظلة فتستخدم مقاومة الهواء لإبطاء السقوط."),
  draw:()=>[A.wipe(),ttl("Luftmotstånd"),A.p("M90,210Q200,90 310,210Z","o",4),A.hatch("M90,210Q200,90 310,210Z","o"),A.p("M95,210L190,330M305,210L210,330M200,200L200,330","k",2.5),
   ...man(200,420,.7,"k",{a1:[-14,-104],a2:[14,-104]}),F(200,190,200,110,"b",6),A.tx("luftmotstånd",225,112,26,"b","start"),F(200,430,200,485,"r",6),A.tx("tyngdkraft",225,480,26,"r","start"),
   A.p("M450,300Q470,240 560,236Q680,236 740,300Q680,330 560,330Q470,330 450,300Z","g",4),A.hatch("M450,300Q470,240 560,236Q680,236 740,300Q680,330 560,330Q470,330 450,300Z","g"),
   A.flow("M400,250Q460,200 580,210Q700,220 780,280","b",5,2.4,4),A.flow("M400,350Q460,380 580,360Q700,340 780,310","b",5,2.6,4),A.tx("strömlinjeform",595,420,30,"g")]},
 {say:t3("Kom ihåg: friktion bromsar när ytor gnids mot varandra. Vilofriktionen är större än glidfriktionen, och rullfriktionen är minst. Friktion behövs för att gå och bromsa men ger nötning och värme. Smörjmedel minskar friktionen.",
   "Remember: friction slows things when surfaces rub together. Static friction is larger than sliding friction, and rolling friction is smallest. Friction is needed to walk and brake but causes wear and heat. Lubricants reduce friction.",
   "تذكّر: الاحتكاك يبطئ الحركة عندما تحتكّ الأسطح. الاحتكاك السكوني أكبر من احتكاك الانزلاق، واحتكاك التدحرج هو الأصغر. نحتاج الاحتكاك للمشي والكبح لكنه يسبّب التآكل والحرارة. ومواد التشحيم تقلّل الاحتكاك."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["friktion är riktad mot rörelsen","r"],["vilo- > glid- > rullfriktion","o"],["bra: gå, bromsa, däck som greppar","g"],["dåligt: nötning och värme → olja","b"],["luftmotstånd växer med farten","v"]],80,150,62,32)]},
]};
const PIC5={
 slide:()=>[A.p(R.line(30,330,390,330,.3),BRN,6),...blk(150,270,110,60,"b"),F(270,250,370,250,"k",5),A.tx("A",320,232,30,"r"),F(250,346,150,346,"k",5),A.tx("B",200,390,30,"r"),A.tx("boken glider →",200,200,26,"b")],
 surf:()=>[A.tx("is",30,170,26,"b","start"),A.p("M120,170L380,170","b",4),A.tx("trägolv",30,280,26,BRN,"start"),A.p(rough(120,380,280,5,1,22,2),BRN,4),A.tx("sandpapper",30,390,26,"k","start"),A.p(rough(160,380,390,14,1,10,3),"k",3.5)],
 graph:()=>{const X=t=>80+t*60,Y=F=>420-F*22;return[...axes(80,420,320,300,"tid","kraft (N)",[],[[Y(4),4],[Y(8),8],[Y(12),12]]),A.p(`M${X(0)},${Y(0)}L${X(1.6)},${Y(12)}L${X(2)},${Y(8)}L${X(4.8)},${Y(8)}`,"r",5),dash(80,Y(12),X(1.6),Y(12),"k"),
  A.tx("lådan börjar glida",X(2.1),Y(12)+4,22,"k","start")]},
};
const BANK5=[
 {lv:0,q:"Vad kallas kraften som bromsar när två ytor gnids mot varandra?",a:"friktion",w:["tyngdkraft","magnetism","lyftkraft"]},
 {lv:0,q:"Åt vilket håll verkar friktionen?",a:"mot rörelsens riktning",w:["i rörelsens riktning","alltid uppåt","alltid nedåt"]},
 {lv:0,q:"Varför sandar man isiga gator?",a:"för att öka friktionen",w:["för att minska friktionen","för att smälta isen","för att det ser finare ut"]},
 {lv:0,q:"Vad använder man i en motor för att minska friktionen?",a:"olja",w:["sand","lim","saltvatten"]},
 {lv:0,q:"Vilken pil visar friktionen på boken?",a:"B",w:["A","båda pilarna","ingen av pilarna"],lines:["Vilken pil visar","friktionen","på boken?"],pic:PIC5.slide},
 {lv:1,q:"Vilken sorts friktion är störst?",a:"vilofriktion",w:["glidfriktion","rullfriktion","de är alltid lika stora"]},
 {lv:1,q:"Varför har en kärra hjul?",a:"rullfriktion är mycket mindre än glidfriktion",w:["hjul ökar friktionen","hjul gör kärran tyngre","hjul tar bort tyngdkraften"]},
 {lv:1,q:"Varför blir händerna varma när du gnider dem mot varandra?",a:"friktionen gör rörelse till värme",w:["blodet stannar","luften blir kall","händerna blir magnetiska"]},
 {lv:1,q:"Vad gör spåren i ett bildäck?",a:"leder bort vatten så att däcket greppar",w:["gör däcket lättare","minskar friktionen mot vägen","gör att bilen låter mindre"]},
 {lv:1,q:"På vilket underlag är friktionen störst?",a:"sandpapper",w:["is","trägolv","den är lika på alla"],lines:["På vilket underlag","är friktionen störst?"],pic:PIC5.surf},
 {lv:1,q:"Skriv ordet: när ett däck glider upp på ett vattenlager kallas det …",a:["vattenplaning","vattenplaningen","akvaplaning"],lines:["Skriv ordet som saknas:","När ett däck glider på","ett vattenlager kallas det …"]},
 {lv:2,q:"Det krävs 30 N för att få en låda att börja glida men bara 22 N för att hålla den i rörelse. Hur stor är glidfriktionen?",a:"22 N",w:["30 N","52 N","8 N"],lines:["30 N behövs för att lådan ska","börja glida, 22 N för att den","ska fortsätta. Hur stor är glidfriktionen?"]},
 {lv:2,q:"En låda dras med jämn fart med kraften 15 N. Hur stor är friktionen?",a:"15 N",w:["0 N","30 N","7,5 N"]},
 {lv:2,q:"Vad händer med friktionen om man lägger en tung vikt på lådan?",a:"den ökar",w:["den minskar","den blir noll","den ändras inte alls"]},
 {lv:2,q:"Varför har en fallskärm en stor yta?",a:"för att få stort luftmotstånd",w:["för att bli lättare","för att minska tyngdkraften","för att få litet luftmotstånd"]},
 {lv:2,q:"Hur stor är vilofriktionen som mest enligt grafen?",a:"12 N",w:["8 N","20 N","4 N"],lines:["Grafen visar kraften när","en låda dras igång. Hur stor","är vilofriktionen som mest?"],pic:PIC5.graph},
 {lv:2,q:"Skriv ordet: friktionen när något glider kallas …",a:["glidfriktion","glidfriktionen"],lines:["Skriv ordet som saknas:","Friktionen när något","glider kallas …"]},
];
LESSONS.push({id:"f7k5",subject:"science",grades:"7",kind:"wb",year:7,ord:25,
 title:t3("Friktion","Friction","الاحتكاك"),
 icon:IC(`<path d="M20 130H300" stroke="#8a5a2b" stroke-width="5"/><rect x="110" y="80" width="100" height="50" fill="#dbe6fb" stroke="#2257c9" stroke-width="4"/><path d="M130 64H240" stroke="#2257c9" stroke-width="4"/><path d="M232 56L244 64L232 72" fill="none" stroke="#2257c9" stroke-width="4"/><path d="M200 150H90" stroke="#d63b2f" stroke-width="5"/><path d="M100 140L86 150L100 160" fill="none" stroke="#d63b2f" stroke-width="5"/>`),
 steps:F7K5.steps,mount:wbMount(F7K5),gen:bankGen(BANK5)});
WORDS.f7k5=["f7k_friktion","f7k_vilofriktion","f7k_glidfriktion","f7k_rullfriktion","f7k_smorjmedel","f7k_luftmotstand"];

/* ---------------------------------------------------------------
   6. f7k6: hålla balansen – centre of gravity, base of support, stable / unstable / neutral equilibrium
   --------------------------------------------------------------- */
TERM("f7k_tyngdpunkt",{sv:"tyngdpunkt",m:W("tyngdpunkt(en|er)?"),d:t3("Punkten där man kan tänka sig att hela föremålets tyngd verkar.","The point where the whole weight of an object can be thought to act.","النقطة التي يمكن أن نعتبر أن وزن الجسم كله يؤثّر فيها."),ex:"Tyngdpunkten i en linjal ligger i mitten.",tr:{en:"centre of gravity",ar:"مركز الثقل"}});
TERM("f7k_stodyta",{sv:"stödyta",m:W("stödyt(a|an|or)"),d:t3("Ytan som ett föremål står på, mellan de yttersta stödpunkterna.","The area an object stands on, between its outermost points of support.","المساحة التي يرتكز عليها الجسم بين نقاط ارتكازه الخارجية."),ex:"En bred stödyta gör det stadigt.",tr:{en:"base of support",ar:"قاعدة الارتكاز"}});
TERM("f7k_jamvikt",{sv:"jämvikt",m:W("jämvikt(en|släge)?"),d:t3("När krafterna på ett föremål tar ut varandra. Jämvikten kan vara stabil, instabil eller indifferent.","When the forces on an object cancel out. The balance can be stable, unstable or neutral.","عندما تُلغي القوى المؤثّرة في الجسم بعضها بعضًا. ويكون الاتزان مستقرًّا أو غير مستقر أو محايدًا."),ex:"En kula i en skål är i stabil jämvikt.",tr:{en:"equilibrium (balance)",ar:"الاتزان"}});
TERM("f7k_stabil",{sv:"stabil",m:W("stabil(a|t)?"),d:t3("Stabil jämvikt: föremålet går tillbaka om det knuffas lite.","Stable equilibrium: the object goes back if it is nudged a little.","اتزان مستقر: يعود الجسم إلى وضعه إذا دُفع قليلًا."),ex:"En låg, bred låda står stabilt.",tr:{en:"stable",ar:"مستقر"}});
TERM("f7k_instabil",{sv:"instabil",m:W("instabil(a|t)?"),d:t3("Instabil jämvikt: föremålet faller bort om det knuffas det minsta.","Unstable equilibrium: the object falls away if it is nudged even slightly.","اتزان غير مستقر: يسقط الجسم إذا دُفع أدنى دفعة."),ex:"En penna på spetsen är instabil.",tr:{en:"unstable",ar:"غير مستقر"}});
/* a flat plate (local points), its centre of gravity, and the plate turned so it hangs from a hole */
const PLATE=[[0,0],[140,-20],[205,55],[160,150],[40,170],[-30,95]],HOLES=[[128,-6],[-14,92]];
const plateC=(()=>{let a=0,cx=0,cy=0;PLATE.forEach(([x1,y1],i)=>{const [x2,y2]=PLATE[(i+1)%PLATE.length],k=x1*y2-x2*y1;a+=k;cx+=(x1+x2)*k;cy+=(y1+y2)*k});a/=2;return[cx/(6*a),cy/(6*a)]})();
const hang=(hole,px,py)=>{const [hx,hy]=HOLES[hole],[cx,cy]=plateC,t=Math.PI/2-Math.atan2(cy-hy,cx-hx),T=([x,y])=>{const dx=x-hx,dy=y-hy;return[px+dx*Math.cos(t)-dy*Math.sin(t),py+dx*Math.sin(t)+dy*Math.cos(t)]};
  const d="M"+PLATE.map(p=>T(p).map(f1).join(",")).join("L")+"Z";return{d,T,c:T(plateC),h:HOLES.map(T)}};
/* a box of w x h tipped by deg about its bottom-right corner at (px, py): its outline and centre */
const tip=(px,py,w,h,deg)=>{const a=deg*Math.PI/180,T=([x,y])=>[px+x*Math.cos(a)-y*Math.sin(a),py+x*Math.sin(a)+y*Math.cos(a)];
  return{d:"M"+[[0,0],[-w,0],[-w,-h],[0,-h]].map(p=>T(p).map(f1).join(",")).join("L")+"Z",c:T([-w/2,-h/2])}};
const tipped=(px,py,w,h,deg,c="b")=>{const B=tip(px,py,w,h,deg),[cx,cy]=B.c;return[A.p(B.d,c,4),dot(cx,cy,"r",7),dash(cx,cy,cx,py,"r",3)]};
const F7K6={steps:[
 {say:t3("Hur kan en lindansare gå på en tunn lina utan att ramla? Och varför välter en hög, smal bokhylla lättare än en låg och bred? Svaren handlar om två saker: tyngdpunkt och stödyta.",
   "How can a tightrope walker walk on a thin rope without falling? And why does a tall, narrow bookcase tip over more easily than a low, wide one? The answers are about two things: the centre of gravity and the base of support.",
   "كيف يستطيع السائر على الحبل أن يمشي على حبل رفيع دون أن يسقط؟ ولماذا تنقلب خزانة كتب عالية وضيّقة أسهل من خزانة منخفضة وعريضة؟ الإجابة تتعلّق بأمرين: مركز الثقل وقاعدة الارتكاز."),
  draw:()=>[A.wipe(),ttl("Hålla balansen"),A.p("M80,460V240M720,460V240","k",5),A.p("M80,240Q400,262 720,240","k",3),
   ...man(400,252,1.05,"v",{a1:[-40,-80],a2:[40,-80]}),A.p("M230,230Q320,175 358,168M442,168Q480,175 570,230",BRN,5),A.p("M358,168L442,168",BRN,5),
   dot(400,190,"r",7),A.tx("tyngdpunkt",460,330,28,"r","start"),A.p(R.line(452,322,404,198,.3),"r",2.5)]},
 {say:t3("Tyngdkraften drar i varje liten del av ett föremål. Men vi kan låtsas att hela tyngden verkar i en enda punkt, tyngdpunkten. I en jämn linjal eller boll ligger den i mitten. Stöder du ett föremål precis under tyngdpunkten balanserar det.",
   "Gravity pulls on every little part of an object. But we can pretend that the whole weight acts at a single point, the centre of gravity. In an even ruler or ball it is in the middle. If you support an object exactly under its centre of gravity, it balances.",
   "تجذب الجاذبية كل جزء صغير من الجسم، لكن يمكننا أن نتخيّل أن الوزن كله يؤثّر في نقطة واحدة هي مركز الثقل. في المسطرة المنتظمة أو الكرة يكون في المنتصف. وإذا سندت الجسم تمامًا تحت مركز ثقله يتوازن."),
  draw:()=>[A.wipe(),ttl("Tyngdpunkt"),A.p(R.rect(90,230,400,24,.3),"o",4),...[110,150,190,230,270,310,350,390,430,470].map(x=>A.p(R.arrow(x,262,x,292),"#9aa3b2",2.5)),
   ...fulcrum(290,256,"k",50),dot(290,242,"r",7),F(290,250,290,400,"r",6),A.tx("hela tyngden",305,380,26,"r","start"),A.tx("verkar här",305,410,26,"r","start"),
   ...ball(640,260,70,"b"),dot(640,260,"r",7),A.tx("i mitten",640,380,28,"r")]},
 {say:t3("Tyngdpunkten i en platt skiva hittar man genom att hänga upp den. Den hänger alltid så att tyngdpunkten hamnar rakt under upphängningen. Häng den i två olika hål och dra ett lodrätt streck varje gång. Där strecken korsar varandra ligger tyngdpunkten.",
   "You find the centre of gravity of a flat plate by hanging it up. It always hangs so that the centre of gravity is straight below the point it hangs from. Hang it from two different holes and draw a vertical line each time. Where the lines cross is the centre of gravity.",
   "نجد مركز ثقل صفيحة مسطّحة بتعليقها، فهي تتدلّى دائمًا بحيث يقع مركز الثقل تحت نقطة التعليق مباشرة. علّقها من ثقبين مختلفين وارسم خطًّا رأسيًّا في كل مرة. مركز الثقل هو نقطة تقاطع الخطين."),
  draw:()=>{const H1=hang(0,210,130),H2=hang(1,590,130),[a,b]=H2.h,[c1x,c1y]=H2.c,dx=c1x-a[0],dy=c1y-a[1];
   return[A.wipe(),ttl("Hitta tyngdpunkten"),dot(210,130,"k",5),A.hatch(H1.d,"o"),A.p(H1.d,"o",4),dash(210,130,210,440,"r",3),A.tx("1",232,450,30,"r"),
    dot(590,130,"k",5),A.hatch(H2.d,"o"),A.p(H2.d,"o",4),dash(590,130,590,440,"r",3),A.p(R.dashed(a[0]-dx*.4,a[1]-dy*.4,a[0]+dx*1.6,a[1]+dy*1.6),"b",3),A.tx("2",612,450,30,"r"),
    dot(c1x,c1y,"g",8),...callout([c1x+4,c1y],660,330,"tyngdpunkt","g",28,"start")]}},
 {say:t3("Stödytan är ytan som ett föremål står på. Ett föremål står kvar så länge en lodrät linje från tyngdpunkten pekar ner innanför stödytan. Lutar du det så mycket att linjen hamnar utanför stödytan, välter det.",
   "The base of support is the area an object stands on. An object stays up as long as a vertical line from the centre of gravity points down inside the base of support. If you tilt it so much that the line ends up outside the base, it tips over.",
   "قاعدة الارتكاز هي المساحة التي يقف عليها الجسم. يبقى الجسم قائمًا ما دام الخط الرأسي النازل من مركز ثقله يقع داخل قاعدة الارتكاز. وإذا أملته حتى يقع الخط خارجها ينقلب."),
  draw:()=>[A.wipe(),ttl("Stödyta"),gnd(40,760,400),A.p(R.rect(140,240,90,160,.3),"#c7cfdc",2.5),...tipped(230,400,90,160,15,"b"),A.p("M140,400H230","g",8),A.tx("stödyta",185,440,26,"g"),
   A.tx("faller tillbaka",185,180,28,"g"),TICK(300,175,"g"),
   A.p(R.rect(510,240,90,160,.3),"#c7cfdc",2.5),...tipped(600,400,90,160,40,"b"),A.p("M510,400H600","g",8),A.tx("stödyta",555,440,26,"g"),A.tx("välter",640,180,28,"r"),CROSS(710,170,"r")]},
 {say:t3("Ett föremål blir stabilare ju lägre tyngdpunkten ligger och ju större stödytan är. Därför har en racerbil låg tyngdpunkt och bred hjulbas, och därför ska tunga saker stå längst ner i en bokhylla.",
   "An object becomes more stable the lower its centre of gravity and the larger its base of support. That is why a racing car has a low centre of gravity and a wide wheelbase, and why heavy things should go at the bottom of a bookcase.",
   "يصبح الجسم أكثر استقرارًا كلما انخفض مركز ثقله وكبرت قاعدة ارتكازه. لهذا لسيارة السباق مركز ثقل منخفض وقاعدة عجلات عريضة، ولهذا يجب وضع الأشياء الثقيلة في أسفل خزانة الكتب."),
  draw:()=>[A.wipe(),ttl("Stadigt eller ostadigt?"),gnd(40,760,420),...blk(80,180,60,240,"r"),dot(110,300,"k",7),A.tx("hög och smal",110,465,26,"r"),
   ...blk(190,340,190,80,"g"),dot(285,380,"k",7),A.tx("låg och bred",285,465,26,"g"),
   A.p(R.rect(500,140,180,280,.3),BRN,4),A.p("M500,233H680M500,326H680",BRN,3),...[0,1,2,3,4,5].map(k=>A.p(R.rect(512+k*27,336,22,84,.2),"k",3)),A.hatch(rp(512,336,157,84),"k"),
   ...[0,1,2].map(k=>A.p(R.rect(512+k*30,190,24,43,.2),"b",3)),A.tx("tungt längst ner",590,465,26,"k")]},
 {say:t3("Det finns tre sorters jämvikt. Stabil: föremålet går tillbaka när du knuffar det, som en kula i en skål. Instabil: det faller bort, som en kula på toppen av en kulle. Indifferent: det stannar där det hamnar, som en kula på ett plant bord.",
   "There are three kinds of equilibrium. Stable: the object goes back when you nudge it, like a marble in a bowl. Unstable: it falls away, like a marble on top of a hill. Neutral: it stays where it ends up, like a marble on a flat table.",
   "هناك ثلاثة أنواع من الاتزان. مستقر: يعود الجسم عندما تدفعه، مثل كرة صغيرة في وعاء. غير مستقر: يسقط بعيدًا، مثل كرة على قمة تلّة. محايد: يبقى حيث يصل، مثل كرة على طاولة مستوية."),
  draw:()=>[A.wipe(),ttl("Tre sorters jämvikt"),A.p("M40,220Q140,380 240,220","k",4),...ball(140,280,20,"b"),A.arrow(185,270,160,290,"g",-8),A.tx("stabil",140,410,32,"g"),A.tx("går tillbaka",140,450,24),
   A.p("M300,380Q400,180 500,380","k",4),...ball(400,258,20,"b"),A.arrow(425,262,465,300,"r",-10),A.tx("instabil",400,410,32,"r"),A.tx("faller bort",400,450,24),
   A.p("M560,320H760","k",4),...ball(620,300,20,"b"),A.p(R.circ(700,300,20),"#c7cfdc",2.5),A.arrow(645,270,680,270,"o"),A.tx("indifferent",660,410,32,"o"),A.tx("stannar där den hamnar",660,450,24)]},
 {say:t3("Ett föremål som hänger är i stabil jämvikt om tyngdpunkten ligger under stödpunkten. En leksaksfågel som balanserar på näbben har tunga vingspetsar som hänger långt ner. Därför ligger fågelns tyngdpunkt under näbben, och den rätar upp sig själv.",
   "A hanging object is in stable equilibrium if its centre of gravity is below the support point. A toy bird balancing on its beak has heavy wing tips that hang far down. So the bird's centre of gravity is below the beak, and it straightens up by itself.",
   "يكون الجسم المعلّق في اتزان مستقر إذا كان مركز ثقله تحت نقطة الارتكاز. طائر اللعبة الذي يتوازن على منقاره له أطراف أجنحة ثقيلة تتدلّى إلى الأسفل، فيقع مركز ثقله تحت المنقار ويستقيم من تلقاء نفسه."),
  draw:()=>[A.wipe(),ttl("Fågeln som balanserar"),A.p("M400,250V470","k",6),A.p("M370,470H430","k",5),
   A.p(R.circ(424,224,16)+"M436,214Q480,186 530,196Q505,236 438,236M446,232Q330,236 250,358M456,234Q525,262 556,356","g",4),
   A.hatch(R.circ(238,372,16)+R.circ(562,372,16),"o"),A.p(R.circ(238,372,16)+R.circ(562,372,16),"o",3.5),A.p("M410,234L400,250L416,238","o",3.5),dot(428,220,"k",3),
   dot(400,330,"r",8),...callout([404,330],560,250,"tyngdpunkt","r",28,"start"),...callout([400,252],250,170,"stödpunkt (näbben)","k",26,"end"),A.tx("tunga vingspetsar",238,425,26,"o")]},
 {say:t3("Din kropp har också en tyngdpunkt, ungefär strax under naveln när du står rakt. Bär du en tung väska i ena handen lutar du dig åt andra hållet, så att tyngdpunkten hamnar ovanför fötterna. Annars skulle du välta.",
   "Your body also has a centre of gravity, roughly just below your navel when you stand straight. If you carry a heavy bag in one hand, you lean the other way so that your centre of gravity is above your feet. Otherwise you would tip over.",
   "لجسمك أيضًا مركز ثقل يقع تقريبًا تحت السرّة بقليل عندما تقف مستقيمًا. وإذا حملت حقيبة ثقيلة بيد واحدة تميل إلى الجهة الأخرى حتى يبقى مركز الثقل فوق قدميك، وإلا لانقلبت."),
  draw:()=>[A.wipe(),ttl("Kroppens tyngdpunkt"),gnd(60,740,430),...man(220,430,1.9,"k"),dot(220,320,"r",8),dash(220,320,220,430,"r",3),A.p("M182,430H258","g",8),A.tx("står rakt",220,475,26),
   ...man(540,430,1.9,"k",{h:[-16,-132],n:[-12,-116],sh:[-10,-104],hip:[0,-58],a1:[-48,-80],a2:[30,-56]}),A.p(R.rect(578,316,50,60,.3),"o",4),A.hatch(rp(578,316,50,60),"o"),A.p("M597,316Q603,306 609,316","o",3),
   dot(548,322,"r",8),dash(548,322,548,430,"r",3),A.p("M502,430H578","g",8),A.tx("lutar sig åt andra hållet",540,475,26),A.tx("tyngdpunkten ovanför fötterna",400,130,28,"r")]},
 {say:t3("Kom ihåg: hela tyngden kan tänkas verka i tyngdpunkten. Ett föremål står kvar om lodlinjen från tyngdpunkten hamnar innanför stödytan. Låg tyngdpunkt och stor stödyta ger stabilitet. Jämvikt kan vara stabil, instabil eller indifferent.",
   "Remember: the whole weight can be thought to act at the centre of gravity. An object stays up if the vertical line from the centre of gravity falls inside the base of support. A low centre of gravity and a large base give stability. Equilibrium can be stable, unstable or neutral.",
   "تذكّر: يمكن اعتبار أن الوزن كله يؤثّر في مركز الثقل. يبقى الجسم قائمًا إذا وقع الخط الرأسي من مركز ثقله داخل قاعدة الارتكاز. مركز الثقل المنخفض والقاعدة الكبيرة يعطيان استقرارًا. والاتزان قد يكون مستقرًّا أو غير مستقر أو محايدًا."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["tyngdpunkt: där hela tyngden verkar","r"],["lodlinjen innanför stödytan → står kvar","g"],["låg tyngdpunkt + bred bas = stabilt","b"],["stabil, instabil, indifferent","o"],["hängande: tyngdpunkten under stödet","v"]],70,150,62,32)]},
]};
const PIC6={
 abc:()=>[A.p("M30,230Q90,330 150,230","k",4),...ball(90,265,16,"b"),A.tx("A",90,330,30,"r"),A.p("M160,320Q220,180 280,320","k",4),...ball(220,234,16,"b"),A.tx("B",220,360,30,"r"),
  A.p("M290,290H390","k",4),...ball(340,274,16,"b"),A.tx("C",340,360,30,"r")],
 box:()=>[gnd(40,380,400),A.p(R.rect(150,240,90,160,.3),"#c7cfdc",2.5),...tipped(240,400,90,160,38,"b"),A.p("M150,400H240","g",8),A.tx("stödyta",195,440,24,"g")],
 two:()=>[gnd(30,390,400),...tipped(160,400,80,200,25,"r"),...tipped(350,400,80,70,25,"g"),A.p("M80,400H160M270,400H350","g",8)],
};
const BANK6=[
 {lv:0,q:"Vad kallas punkten där hela tyngden kan tänkas verka?",a:"tyngdpunkt",w:["stödyta","angreppsyta","nollpunkt"]},
 {lv:0,q:"Var ligger tyngdpunkten i en jämn linjal?",a:"i mitten",w:["i ena änden","under linjalen","utanför linjalen"]},
 {lv:0,q:"Vilken låda står stadigast?",a:"en låg och bred",w:["en hög och smal","en hög och bred upptill","alla står lika stadigt"]},
 {lv:0,q:"Vilken jämvikt har en kula i botten av en skål?",a:"stabil",w:["instabil","indifferent","ingen jämvikt"]},
 {lv:0,q:"Vilken kula är i instabil jämvikt?",a:"B",w:["A","C","alla tre"],lines:["Vilken kula är","i instabil","jämvikt?"],pic:PIC6.abc},
 {lv:1,q:"Ett föremål välter om lodlinjen från tyngdpunkten hamnar …",a:"utanför stödytan",w:["innanför stödytan","mitt i stödytan","ovanför tyngdpunkten"]},
 {lv:1,q:"Vilken jämvikt har en penna som står på spetsen?",a:"instabil",w:["stabil","indifferent","fast"]},
 {lv:1,q:"Varför har racerbilar låg tyngdpunkt?",a:"så att de inte välter lätt i kurvor",w:["så att de blir tyngre","så att friktionen försvinner","så att de blir långsammare"]},
 {lv:1,q:"Hur hittar man tyngdpunkten i en platt skiva?",a:"häng upp den i två hål och se var lodlinjerna korsas",w:["väg den på en våg","mät den med linjal","lägg den i vatten"]},
 {lv:1,q:"Kommer lådan att välta eller falla tillbaka?",a:"välta",w:["falla tillbaka","stå kvar så","gå sönder"],lines:["Lådan lutas och släpps.","Kommer den att välta","eller falla tillbaka?"],pic:PIC6.box},
 {lv:1,q:"Skriv ordet: ytan som ett föremål står på kallas …",a:["stödyta","stödytan"],lines:["Skriv ordet som saknas:","Ytan som ett föremål","står på kallas …"]},
 {lv:2,q:"En kula ligger på ett plant golv och flyttas lite. Vilken jämvikt är det?",a:"indifferent",w:["stabil","instabil","ingen jämvikt"]},
 {lv:2,q:"Varför lutar du dig åt vänster när du bär en tung väska i högra handen?",a:"så att tyngdpunkten hamnar ovanför fötterna",w:["så att väskan blir lättare","så att stödytan blir mindre","så att tyngdkraften minskar"]},
 {lv:2,q:"En leksaksfågel balanserar på näbben. Var ligger tyngdpunkten?",a:"under näbben",w:["över näbben","i stjärten","i huvudet"]},
 {lv:2,q:"Varför håller en lindansare en lång stång?",a:"den gör det lättare att hålla tyngdpunkten över linan",w:["den gör lindansaren lättare","den tar bort tyngdkraften","den ökar friktionen mot luften"]},
 {lv:2,q:"Båda lådorna lutas lika mycket. Vilken välter?",a:"den höga, röda",w:["den låga, gröna","båda","ingen av dem"],lines:["Båda lådorna lutas","lika mycket och släpps.","Vilken välter?"],pic:PIC6.two},
 {lv:2,q:"Skriv ordet: jämvikten för en kula i en skål kallas … jämvikt",a:["stabil","stabil jämvikt"],lines:["Skriv ordet som saknas:","En kula i en skål är i","… jämvikt."]},
];
LESSONS.push({id:"f7k6",subject:"science",grades:"7",kind:"wb",year:7,ord:26,
 title:t3("Hålla balansen","Keeping your balance","المحافظة على التوازن"),
 icon:IC(`<path d="M30 150H290" stroke="#1d2433" stroke-width="3"/><path d="M110 150L70 150L80 60L120 60Z" fill="#dbe6fb" stroke="#2257c9" stroke-width="4" transform="rotate(14 110 150)"/><circle cx="110" cy="105" r="6" fill="#d63b2f"/><path d="M110 105V150" stroke="#d63b2f" stroke-width="3" stroke-dasharray="6 5"/><path d="M190 120Q240 170 290 120" fill="none" stroke="#1d2433" stroke-width="4"/><circle cx="240" cy="132" r="12" fill="#dbe6fb" stroke="#2257c9" stroke-width="3"/>`),
 steps:F7K6.steps,mount:wbMount(F7K6),gen:bankGen(BANK6)});
WORDS.f7k6=["f7k_tyngdpunkt","f7k_stodyta","f7k_jamvikt","f7k_stabil","f7k_instabil"];


/* ---------------------------------------------------------------
   7. f7k7: enkla maskiner – lever, ramp, pulleys, wedge, screw; what you gain in force you lose in distance
   --------------------------------------------------------------- */
TERM("f7k_maskin",{sv:"enkel maskin",m:W("enkl(a|e) maskin(er|erna)?"),d:t3("Ett enkelt redskap som gör att man kan använda en mindre kraft, till exempel en hävstång eller en ramp.","A simple tool that lets you use a smaller force, for example a lever or a ramp.","أداة بسيطة تتيح استخدام قوة أصغر، مثل الرافعة أو المستوى المائل."),ex:"En kofot är en enkel maskin.",tr:{en:"simple machine",ar:"آلة بسيطة"}});
TERM("f7k_havstang",{sv:"hävstång",m:W("hävstång(en|er|erna)?"),d:t3("En stång som vilar på en stödpunkt. Med lång arm behövs mindre kraft.","A bar resting on a support point. With a long arm, less force is needed.","قضيب يرتكز على نقطة ارتكاز، ويلزم قوة أصغر كلما طال الذراع."),ex:"Gungbrädan är en hävstång.",tr:{en:"lever",ar:"الرافعة"}});
TERM("f7k_lutande",{sv:"lutande plan",m:W("lutande plan(et)?"),d:t3("En sned yta, som en ramp, där man skjuter upp något i stället för att lyfta det rakt upp.","A sloping surface, like a ramp, where you push something up instead of lifting it straight up.","سطح مائل مثل المنحدر، ندفع عليه الشيء إلى الأعلى بدل رفعه مباشرة."),ex:"Rampen är ett lutande plan.",tr:{en:"inclined plane",ar:"المستوى المائل"}});
TERM("f7k_block",{sv:"block och talja",m:W("(block(et)?|talj(a|an|or))"),d:t3("Ett block är ett hjul med ett rep. Flera block tillsammans kallas en talja och minskar kraften som behövs.","A pulley is a wheel with a rope. Several pulleys together are called a block and tackle and reduce the force needed.","البكرة عجلة يمرّ عليها حبل، ومجموعة بكرات معًا تسمّى «بكرة مركّبة» وتقلّل القوة اللازمة."),ex:"Taljan på båten gör det lätt att hissa seglet.",tr:{en:"pulley and block and tackle",ar:"البكرة والبكرة المركّبة"}});
TERM("f7k_kil",{sv:"kil",m:W("kil(en|ar)?"),d:t3("Ett lutande plan som skjuts in i något och pressar isär det, till exempel en yxa.","An inclined plane that is pushed into something and forces it apart, for example an axe.","مستوى مائل يُدفع داخل شيء فيفصله، مثل الفأس."),ex:"Yxan är en kil.",tr:{en:"wedge",ar:"الإسفين"}});
TERM("f7k_gyllene",{sv:"mekanikens gyllene regel",m:W("gyllene regel(n)?"),d:t3("Det du vinner i kraft förlorar du i väg. Kraft gånger väg blir lika stort.","What you gain in force you lose in distance. Force times distance stays the same.","ما تكسبه في القوة تخسره في المسافة؛ فحاصل ضرب القوة في المسافة يبقى ثابتًا."),ex:"200 N · 3 m = 600 N · 1 m",tr:{en:"golden rule of mechanics",ar:"القاعدة الذهبية في الميكانيكا"}});
/* a stone and a log, and the little icons of the five machines */
const STONE="M-60 0Q-66 -40 -30 -56Q10 -70 44 -48Q66 -30 60 0Z";
const icoLever=(x,y)=>[...fulcrum(x-20,y-6,"k",26),beam(x-60,y-6,x+60,y-6),A.hatch(rp(x-58,y-34,26,26),"o"),A.p(R.rect(x-58,y-34,26,26,.2),"o",3),F(x+54,y-46,x+54,y-12,"r",4)];
const icoRamp=(x,y)=>[...ramp(x-60,y,x+60,y-60),A.p(onRamp(x-60,y,x+60,y-60,.35,30,22).d,"b",3)];
const icoPulley=(x,y)=>[ceil(x-30,x+30,y-90),A.p(`M${x},${y-90}V${y-70}`,"k",3),...pulley(x,y-56,16),A.p(`M${x-16},${y-56}V${y-24}M${x+16},${y-56}V${y-4}`,"k",3),A.hatch(rp(x-30,y-24,28,24),"o"),A.p(R.rect(x-30,y-24,28,24,.2),"o",3)];
const icoWedge=(x,y)=>[A.p(R.rect(x-50,y-36,100,36,.3),BRN,3.5),A.hatch(`M${x-14},${y-70}L${x+14},${y-70}L${x},${y-20}Z`,"k"),A.p(`M${x-14},${y-70}L${x+14},${y-70}L${x},${y-20}Z`,"k",3.5)];
const icoScrew=(x,y)=>[A.p(`M${x-20},${y-80}H${x+20}M${x-10},${y-80}V${y-10}L${x},${y}L${x+10},${y-10}V${y-80}`,"k",3.5),A.p([0,1,2,3,4,5].map(k=>`M${x-14},${y-66+k*10}L${x+14},${y-72+k*10}`).join(""),"k",3)];
/* a block and tackle: upper block at y1, lower block at y2, n rope parts between, the free end pulled down at (fx, fy) */
const tackle=(x,y1,y2,n=4,fx=x+140,fy=y2+40)=>{const w=n*26+20,xs=[...Array(n)].map((_,i)=>x-w/2+20+i*26);
  return[ceil(x-w/2-20,x+w/2+20,y1-34),A.p(`M${x},${y1-34}V${y1-20}`,"k",3),A.p(R.rect(x-w/2,y1-20,w,36,.3),"k",3.5),A.p(R.rect(x-w/2,y2-16,w,36,.3),"k",3.5),
   A.p(xs.map(px=>`M${px},${y1+16}L${px},${y2-16}`).join(""),BRN,3.5),...xs.map((px,i)=>A.tx(i+1,px+12,(y1+y2)/2+8,20,"b","start")),
   A.p(`M${x+w/2},${y1}L${fx},${fy}`,BRN,3.5),A.p(`M${x},${y2+20}V${y2+34}`,"k",3)]};
const F7K7={steps:[
 {say:t3("Människor har länge använt enkla redskap för att lyfta och flytta tunga saker. Sådana redskap kallas enkla maskiner. De fem vanligaste är hävstången, det lutande planet, block och talja, kilen och skruven.",
   "People have long used simple tools to lift and move heavy things. Such tools are called simple machines. The five most common are the lever, the inclined plane, the pulley and block and tackle, the wedge and the screw.",
   "استخدم الناس منذ زمن بعيد أدوات بسيطة لرفع الأشياء الثقيلة وتحريكها، وتسمّى هذه الأدوات الآلات البسيطة. أشهرها خمس: الرافعة، والمستوى المائل، والبكرة والبكرة المركّبة، والإسفين، واللولب."),
  draw:()=>[A.wipe(),ttl("Enkla maskiner"),...icoLever(100,320),...icoRamp(250,320),...icoPulley(400,320),...icoWedge(550,320),...icoScrew(700,320),
   ...[["hävstång",100],["lutande plan",250],["block",400],["kil",550],["skruv",700]].map(([s,x])=>A.tx(s,x,380,28,"b")),A.tx("mindre kraft – men längre väg",400,460,32,"g")]},
 {say:t3("En hävstång är en stång som vilar på en stödpunkt. Med en spett kan du lyfta en tung sten med liten kraft om du trycker långt från stödpunkten. Men din hand måste röra sig en lång väg för att stenen ska lyftas en kort bit.",
   "A lever is a bar resting on a support point. With a crowbar you can lift a heavy stone with a small force if you push far from the support. But your hand must move a long way for the stone to rise a short distance.",
   "الرافعة قضيب يرتكز على نقطة ارتكاز. بالعتلة يمكنك رفع حجر ثقيل بقوة صغيرة إذا ضغطت بعيدًا عن نقطة الارتكاز، لكن يدك يجب أن تتحرك مسافة طويلة لكي يرتفع الحجر مسافة قصيرة."),
  draw:()=>[A.wipe(),ttl("Hävstången"),gnd(40,760,420),A.hatch(tfx(STONE,130,330,1),"k"),A.p(tfx(STONE,130,330,1),"k",3.5),...fulcrum(240,342,"k",78),beam(100,340,700,340),
   F(690,220,690,326,"r",6),A.tx("liten kraft",680,200,28,"r","end"),A.tx("stödpunkt",240,465,26,"k"),A.p("M100,320Q90,290 100,262","g",4),A.p("M93,272L100,262L108,272","g",3.5),A.tx("kort väg",100,248,24,"g"),
   A.p("M720,300Q760,340 720,400","g",4),A.p("M714,388L720,400L730,390","g",3.5),A.tx("lång väg",740,462,24,"g"),A.tx("tung sten",130,195,26,"k")]},
 {say:t3("Det är tungt att lyfta en låda på 600 N rakt upp på ett flak 1 m högt. Skjuter du den i stället uppför en 3 m lång ramp behövs bara 200 N, om vi bortser från friktionen. I gengäld blir vägen tre gånger så lång.",
   "It is hard to lift a 600 N box straight up onto a platform 1 m high. If you push it up a 3 m long ramp instead, you only need 200 N, if we ignore friction. In return the distance is three times as long.",
   "رفع صندوق وزنه 600 نيوتن مباشرة إلى منصة ارتفاعها متر واحد عمل شاق. أما إذا دفعته على منحدر طوله 3 أمتار فلا يلزم إلا 200 نيوتن إذا أهملنا الاحتكاك، لكن المسافة تصبح ثلاثة أضعاف."),
  draw:()=>{const B=onRamp(170,420,594,270,.42,70,50),[cx,cy]=B.c,[ux,uy]=B.u;
   return[A.wipe(),ttl("Det lutande planet"),gnd(40,760,420),...ramp(170,420,594,270),A.p(R.rect(594,270,150,150,.3),"k",3.5),A.hatch(B.d,"b"),A.p(B.d,"b",4),
    F(cx+ux*50,cy+uy*50,cx+ux*150,cy+uy*150,"r",6),A.tx("200 N",cx+ux*150-20,cy+uy*150-22,30,"r","end"),A.tx("3 m",360,385,28,"k"),A.tx("1 m",742,350,28,"k","start"),
    A.hatch(rp(640,190,60,50),"o"),A.p(R.rect(640,190,60,50,.3),"o",4),F(670,186,670,110,"r",6),A.tx("600 N",690,130,28,"r","start"),A.tx("rakt upp",690,162,26,"o","start")]}},
 {say:t3("Ett block är ett hjul med ett rep över. Ett fast block sitter i taket och ändrar bara kraftens riktning: du drar nedåt och lasten åker uppåt. Ett löst block hänger i lasten. Då bärs lasten av två repdelar, och du behöver bara halva kraften.",
   "A pulley is a wheel with a rope over it. A fixed pulley hangs from the ceiling and only changes the direction of the force: you pull down and the load goes up. A movable pulley hangs on the load. Then the load is held by two rope parts, and you need only half the force.",
   "البكرة عجلة يمرّ عليها حبل. البكرة الثابتة معلّقة بالسقف وتغيّر اتجاه القوة فقط: تسحب إلى الأسفل فيرتفع الحمل. أما البكرة المتحركة فتتدلّى مع الحمل، فيحمله جزءان من الحبل ولا تحتاج إلا إلى نصف القوة."),
  draw:()=>[A.wipe(),ttl("Block"),A.band(30,95,355,385,"b"),A.band(415,95,355,385,"g"),A.tx("fast block",207,136,32,"b"),A.tx("löst block",592,136,32,"g"),
   ceil(150,270,160),A.p("M210,160V176","k",3),...pulley(210,200,26),A.p("M184,200V320M236,200V360",BRN,3.5),A.hatch(rp(154,320,60,60),"o"),A.p(R.rect(154,320,60,60,.3),"o",4),A.tx("100 N",184,410,24,"o"),
   F(236,370,236,440,"r",5),A.tx("100 N",250,430,24,"r","start"),
   ceil(500,650,160),A.p("M534,160V320M586,320V230",BRN,3.5),...pulley(560,320,26),A.p("M560,346V362","k",3),A.hatch(rp(530,362,60,50),"o"),A.p(R.rect(530,362,60,50,.3),"o",4),A.tx("100 N",560,440,24,"o"),
   F(586,226,586,176,"r",5),A.tx("50 N",604,200,26,"r","start"),A.tx("2 repdelar bär",660,290,24,"g","start")]},
 {say:t3("En talja består av flera block. Bärs lasten av fyra repdelar behöver du bara en fjärdedel av kraften. Men för att lyfta lasten 1 m måste du dra in 4 m rep. Taljor används på segelbåtar, i byggkranar och på gym.",
   "A block and tackle is made of several pulleys. If the load is held by four rope parts, you need only a quarter of the force. But to lift the load 1 m you must pull in 4 m of rope. Blocks and tackles are used on sailing boats, in cranes and at the gym.",
   "البكرة المركّبة تتكوّن من عدة بكرات. إذا حمل الحمل أربعة أجزاء من الحبل فلا تحتاج إلا إلى ربع القوة، لكن لرفع الحمل مترًا واحدًا يجب أن تسحب 4 أمتار من الحبل. تُستخدم البكرات المركّبة في المراكب الشراعية والرافعات والنوادي الرياضية."),
  draw:()=>[A.wipe(),ttl("Taljan"),...tackle(260,170,330,4,420,410),A.hatch(rp(220,364,80,60),"o"),A.p(R.rect(220,364,80,60,.3),"o",4),A.tx("400 N",260,458,28,"o"),
   F(420,410,440,450,"r",5),A.tx("100 N",460,450,28,"r","start"),A.tx("4 bärande repdelar",500,200,28,"b","start"),A.tx("kraft: 400 / 4 = 100 N",500,260,28,"r","start"),
   A.tx("lyft 1 m → dra 4 m rep",500,320,28,"g","start")]},
 {say:t3("En kil är ett lutande plan som man skjuter in i något. Yxan och kniven är kilar: kraften på bladet blir stora krafter åt sidorna som klyver veden. En skruv är ett lutande plan som lindats runt en stång. Varje varv flyttar skruven en liten bit med liten kraft.",
   "A wedge is an inclined plane that you push into something. The axe and the knife are wedges: the force on the blade becomes large sideways forces that split the wood. A screw is an inclined plane wound around a rod. Each turn moves the screw a small distance with a small force.",
   "الإسفين مستوى مائل ندفعه داخل شيء. الفأس والسكين إسفينان: تتحوّل القوة على النصل إلى قوى جانبية كبيرة تشقّ الخشب. واللولب مستوى مائل ملفوف حول قضيب، وكل لفّة تحرّكه مسافة صغيرة بقوة صغيرة."),
  draw:()=>[A.wipe(),ttl("Kil och skruv"),A.p(R.rect(80,300,300,130,.3),BRN,4),A.p("M80,330Q230,320 380,330M80,380Q230,372 380,384",BRN,2),
   A.hatch("M200,170L260,170L230,330Z","k"),A.p("M200,170L260,170L230,330Z","k",4),A.p("M230,170V110",BRN,8),F(230,90,230,150,"r",5),F(212,280,140,262,"r",5),F(248,280,320,262,"r",5),A.tx("kil",130,200,32,"k"),
   ...icoScrew(560,400).map(a=>a),A.p(`M520,200L640,200L520,260Z`,"b",3.5),A.hatch(`M520,200L640,200L520,260Z`,"b"),A.arrow(600,270,575,320,"b",-10),A.tx("ett lutande plan",650,230,24,"b","start"),A.tx("lindat runt",650,260,24,"b","start"),A.tx("skruv",620,430,32,"k","start")]},
 {say:t3("Alla enkla maskiner följer mekanikens gyllene regel: det du vinner i kraft förlorar du i väg. Kraften gånger vägen blir lika stort, om vi bortser från friktion. För rampen: 600 N · 1 m = 200 N · 3 m. Maskinen sparar alltså inget arbete, men gör det lättare.",
   "All simple machines follow the golden rule of mechanics: what you gain in force you lose in distance. Force times distance stays the same, if we ignore friction. For the ramp: 600 N · 1 m = 200 N · 3 m. So the machine saves no work, but it makes it easier.",
   "كل الآلات البسيطة تتبع القاعدة الذهبية في الميكانيكا: ما تكسبه في القوة تخسره في المسافة. حاصل ضرب القوة في المسافة يبقى ثابتًا إذا أهملنا الاحتكاك. للمنحدر: 600 N · 1 m = 200 N · 3 m. فالآلة لا توفّر شغلًا، لكنها تجعل العمل أسهل."),
  draw:()=>[A.wipe(),ttl("Mekanikens gyllene regel"),A.tx("Det du vinner i kraft",400,150,40,"g"),A.tx("förlorar du i väg.",400,205,40,"r"),A.hl(150,240,500,70),
   A.tx("kraft · väg = kraft · väg",400,290,40,"k"),A.tx("600 N · 1 m",230,380,36,"o"),A.tx("=",400,380,40),A.tx("200 N · 3 m",570,380,36,"b"),
   A.tx("rakt upp",230,425,26,"o"),A.tx("längs rampen",570,425,26,"b")]},
 {say:t3("Enkla maskiner finns överallt. Saxen och tången är hävstänger, flaggstången har ett fast block i toppen, och en rullstolsramp är ett lutande plan. Även skruvlocket på en burk är en skruv. Titta dig omkring: hur många hittar du hemma?",
   "Simple machines are everywhere. Scissors and pliers are levers, the flagpole has a fixed pulley at the top, and a wheelchair ramp is an inclined plane. Even the screw lid of a jar is a screw. Look around: how many can you find at home?",
   "الآلات البسيطة موجودة في كل مكان. المقصّ والكمّاشة رافعتان، وفي أعلى سارية العلم بكرة ثابتة، ومنحدر الكرسي المتحرك مستوى مائل، وحتى غطاء البرطمان الملولب لولب. انظر حولك: كم آلة بسيطة تجد في البيت؟"),
  draw:()=>[A.wipe(),ttl("Enkla maskiner i vardagen"),A.p("M70,180L220,300M70,300L220,180","k",5),A.p(R.circ(55,170,16)+R.circ(55,310,16),"r",4),dot(145,240,"b",8),A.tx("sax",145,370,30,"k"),A.tx("hävstång",145,405,24,"b"),
   A.p("M400,440V150","k",5),...pulley(400,140,14),A.p("M386,140V430M414,140V200",BRN,2.5),A.p("M414,170H480L470,190L480,210H414","r",3.5),A.tx("flaggstång",400,470,26,"k"),A.tx("fast block",470,250,24,"b","start"),
   ...ramp(560,430,760,330),A.p(R.circ(640,372,22)+"M640,372L660,340L690,340M660,340L654,315",  "k",3.5),A.tx("ramp",660,470,26,"k"),A.tx("lutande plan",680,300,24,"b")]},
 {say:t3("Kom ihåg: enkla maskiner är hävstång, lutande plan, block och talja, kil och skruv. De gör att du kan använda en mindre kraft, men vägen blir lika mycket längre. Det är mekanikens gyllene regel: kraft gånger väg är lika stort.",
   "Remember: simple machines are the lever, the inclined plane, the pulley and block and tackle, the wedge and the screw. They let you use a smaller force, but the distance becomes correspondingly longer. That is the golden rule of mechanics: force times distance stays the same.",
   "تذكّر: الآلات البسيطة هي الرافعة والمستوى المائل والبكرة والبكرة المركّبة والإسفين واللولب. تتيح لك استخدام قوة أصغر، لكن المسافة تطول بالقدر نفسه. هذه هي القاعدة الذهبية في الميكانيكا: حاصل ضرب القوة في المسافة ثابت."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["hävstång: lång arm → liten kraft","b"],["ramp: lång väg → liten kraft","o"],["fast block byter riktning, löst halverar","g"],["talja: n repdelar → kraften / n","r"],["kraft · väg = kraft · väg","v"]],70,150,62,32)]},
]};
const PIC7={
 ramp:()=>[gnd(30,390,400),...ramp(60,400,370,250),A.hatch(onRamp(60,400,370,250,.4,70,50).d,"b"),A.p(onRamp(60,400,370,250,.4,70,50).d,"b",4)],
 fixed:()=>[ceil(130,290,130),A.p("M210,130V146","k",3),...pulley(210,170,26),A.p("M184,170V300M236,170V350",BRN,3.5),...blk(150,300,68,60,"o","80 N",24),F(236,360,236,430,"r",5),qm(270,420,"r",40)],
 tackle:()=>[...tackle(160,150,300,4,330,380),...blk(115,334,90,60,"o","200 N",26),F(330,380,350,420,"r",5),qm(370,440,"r",40)],
};
const BANK7=[
 {lv:0,q:"Vilken av dessa är en enkel maskin?",a:"hävstång",w:["dynamometer","termometer","pendel"]},
 {lv:0,q:"Vad kallas punkten som en hävstång vilar på?",a:"stödpunkt",w:["tyngdpunkt","angreppspunkt","mittpunkt"]},
 {lv:0,q:"Vad gör ett fast block?",a:"ändrar kraftens riktning",w:["halverar kraften","fördubblar kraften","tar bort friktionen"]},
 {lv:0,q:"Vilken enkel maskin är en yxa?",a:"kil",w:["skruv","block","hävstång"]},
 {lv:0,q:"Vilken enkel maskin visar bilden?",a:"lutande plan",w:["talja","kil","skruv"],lines:["Vilken enkel","maskin visar","bilden?"],pic:PIC7.ramp},
 {lv:1,q:"Vad säger mekanikens gyllene regel?",a:"det du vinner i kraft förlorar du i väg",w:["en maskin ger mer energi än den får","kraften blir alltid dubbelt så stor","friktionen försvinner i en maskin"]},
 {lv:1,q:"Ett löst block lyfter en last på 300 N. Hur stor kraft behövs?",a:"150 N",w:["300 N","600 N","75 N"]},
 {lv:1,q:"Vad är en skruv egentligen?",a:"ett lutande plan lindat runt en stång",w:["ett block utan rep","en hävstång utan stödpunkt","en kil utan spets"]},
 {lv:1,q:"Vilken ramp kräver minst kraft för samma höjd?",a:"den längsta och flackaste",w:["den kortaste och brantaste","alla kräver lika mycket","den som är målad"]},
 {lv:1,q:"Med vilken kraft måste du dra?",a:"80 N",w:["40 N","160 N","20 N"],lines:["Ett fast block.","Lasten är 80 N. Med","vilken kraft måste du dra?"],pic:PIC7.fixed},
 {lv:1,q:"Skriv ordet: flera block tillsammans kallas en …",a:["talja","taljan","block och talja"],lines:["Skriv ordet som saknas:","Flera block tillsammans","kallas en …"]},
 {lv:2,q:"En låda på 900 N ska upp 1 m längs en 3 m lång ramp. Vilken kraft behövs utan friktion?",a:"300 N",w:["900 N","2 700 N","450 N"],lines:["En låda på 900 N ska upp 1 m","längs en 3 m lång ramp. Vilken","kraft behövs utan friktion?"]},
 {lv:2,q:"En talja med 4 bärande repdelar lyfter 400 N 2 m. Vilken kraft behövs, och hur mycket rep drar du in?",a:"100 N och 8 m",w:["100 N och 2 m","400 N och 8 m","1 600 N och 0,5 m"],lines:["En talja med 4 bärande repdelar","lyfter 400 N två meter. Vilken kraft","behövs och hur mycket rep drar du?"]},
 {lv:2,q:"Varför kan ingen enkel maskin spara arbete?",a:"kraft gånger väg blir aldrig mindre",w:["maskinen blir trött","tyngdkraften ökar","friktionen är alltid noll"]},
 {lv:2,q:"Vilket verktyg är en hävstång?",a:"en kofot",w:["en kil","en skruv","en ramp"]},
 {lv:2,q:"Hur stor kraft behövs i taljan?",a:"50 N",w:["200 N","100 N","800 N"],lines:["Lasten är 200 N och","bärs av fyra repdelar.","Hur stor kraft behövs?"],pic:PIC7.tackle},
 {lv:2,q:"En ramp är 4 m lång och 1 m hög. Lådan väger 800 N. Skriv kraften i N som behövs utan friktion.",a:["200","200 n","200n"],lines:["Skriv svaret i newton:","En ramp är 4 m lång och 1 m hög.","Lådan är 800 N. Vilken kraft behövs?"]},
];
LESSONS.push({id:"f7k7",subject:"science",grades:"7",kind:"wb",year:7,ord:27,
 title:t3("Enkla maskiner","Simple machines","الآلات البسيطة"),
 icon:IC(`<path d="M20 150H300" stroke="#1d2433" stroke-width="3"/><path d="M40 150L260 150L260 60Z" fill="#fbe7cc" stroke="#1d2433" stroke-width="3"/><rect x="132" y="88" width="50" height="34" fill="#dbe6fb" stroke="#2257c9" stroke-width="3" transform="rotate(-22 157 105)"/><path d="M190 80L240 60" stroke="#d63b2f" stroke-width="5"/><path d="M228 54L242 60L232 70" fill="none" stroke="#d63b2f" stroke-width="4"/>`),
 steps:F7K7.steps,mount:wbMount(F7K7),gen:bankGen(BANK7)});
WORDS.f7k7=["f7k_maskin","f7k_havstang","f7k_lutande","f7k_block","f7k_kil","f7k_gyllene"];

/* ---------------------------------------------------------------
   8. f7k8: hållbar utveckling – trafik och frisk luft: reaction and braking distance, exhaust, walking, cycling and public transport
   --------------------------------------------------------------- */
TERM("f7k_reaktion",{sv:"reaktionssträcka",m:W("reaktionssträcka(n)?"),d:t3("Sträckan bilen kör från att föraren ser faran tills bromsen tar.","The distance the car travels from when the driver sees the danger until the brake starts working.","المسافة التي تقطعها السيارة من لحظة رؤية السائق للخطر حتى تبدأ المكابح بالعمل."),ex:"I 50 km/h är reaktionssträckan ca 14 m.",tr:{en:"reaction distance",ar:"مسافة رد الفعل"}});
TERM("f7k_broms",{sv:"bromssträcka",m:W("bromssträcka(n|or)?"),d:t3("Sträckan bilen rullar medan den bromsar. Dubbel fart ger fyra gånger så lång bromssträcka.","The distance the car rolls while braking. Double the speed gives four times the braking distance.","المسافة التي تقطعها السيارة أثناء الكبح. السرعة المضاعفة تعطي مسافة كبح أطول بأربع مرات."),ex:"På is blir bromssträckan mycket längre.",tr:{en:"braking distance",ar:"مسافة الكبح"}});
TERM("f7k_stopp",{sv:"stoppsträcka",m:W("stoppsträcka(n)?"),d:t3("Reaktionssträckan plus bromssträckan: hela vägen tills bilen står still.","The reaction distance plus the braking distance: the whole way until the car stands still.","مسافة رد الفعل مضافًا إليها مسافة الكبح: كامل المسافة حتى تتوقّف السيارة."),ex:"Stoppsträckan i 30 km/h är ca 13 m.",tr:{en:"stopping distance",ar:"مسافة التوقّف"}});
TERM("f7k_avgaser",{sv:"avgaser",m:W("avgas(er|erna)"),d:t3("Gaser och partiklar som kommer ut ur en motor som bränner bensin eller diesel.","Gases and particles that come out of an engine burning petrol or diesel.","الغازات والجسيمات التي تخرج من محرك يحرق البنزين أو الديزل."),ex:"Avgaserna innehåller koldioxid.",tr:{en:"exhaust fumes",ar:"غازات العادم"}});
TERM("f7k_kollektiv",{sv:"kollektivtrafik",m:W("kollektivtrafik(en)?"),d:t3("Bussar, tåg, spårvagnar och tunnelbana som många reser med tillsammans.","Buses, trains, trams and the underground that many people travel on together.","الحافلات والقطارات والترام والمترو التي يسافر فيها كثير من الناس معًا."),ex:"En full buss ersätter många bilar.",tr:{en:"public transport",ar:"النقل العام"}});
/* a bike seen from the side (wheels on y), a bus, a small house, a child */
const bike=(x,y,s=1,c="k")=>{const P=(a,b)=>`${f1(x+a*s)},${f1(y+b*s)}`;return[A.p(R.circ(x-34*s,y-22*s,22*s)+R.circ(x+34*s,y-22*s,22*s),c,3.5),A.p(`M${P(-34,-22)}L${P(-6,-22)}L${P(-14,-54)}L${P(22,-54)}L${P(34,-22)}M${P(-6,-22)}L${P(22,-54)}M${P(-18,-58)}L${P(-8,-58)}M${P(22,-54)}L${P(24,-66)}`,c,3.5),
  ...man(x-6*s,y-58*s,s*.62,"b",{hip:[-10,-58],f1:[0,-2],f2:[10,10],a1:[50,-100],a2:[50,-96],sh:[10,-104],n:[8,-116],h:[12,-134]})]};
const BUS=`<rect x="-130" y="-92" width="260" height="76" rx="12" fill="#ffd84d" stroke="#1d2433" stroke-width="3"/>${[-110,-62,-14,34].map(x=>`<rect x="${x}" y="-80" width="40" height="30" rx="4" fill="#cfe6ff" stroke="#1d2433" stroke-width="2.5"/>`).join("")}<rect x="84" y="-80" width="34" height="56" rx="3" fill="#cfe6ff" stroke="#1d2433" stroke-width="2.5"/><circle cx="-80" cy="-16" r="16" fill="#1d2433"/><circle cx="-80" cy="-16" r="7" fill="#c9d1de"/><circle cx="80" cy="-16" r="16" fill="#1d2433"/><circle cx="80" cy="-16" r="7" fill="#c9d1de"/>`;
const house=(x,y,c="b")=>[A.p(`M${x-60},${y}V${y-80}L${x},${y-130}L${x+60},${y-80}V${y}Z`,c,4),A.p(R.rect(x-16,y-44,32,44,.2)+R.rect(x-46,y-70,24,22,.2)+R.rect(x+22,y-70,24,22,.2),c,3)];
const kid=(x,y,s=.8)=>man(x,y,s,"p",{a1:[-28,-80],a2:[30,-90]});
/* a road seen from the side, with distances as coloured bars: [from m, to m, colour, label] at px per metre */
const road=(y,x0=40,x1=760)=>[A.p(R.line(x0,y,x1,y,.3),"k",4)];
const seg=(x0,y,m0,m1,k,c,lab,ly=-12,z=24)=>{const a=x0+m0*k,b=x0+m1*k;return[A.p(`M${f1(a)},${y}H${f1(b)}`,c,10),A.p(`M${f1(a)},${y-12}v24M${f1(b)},${y-12}v24`,c,3),...(lab?[A.tx(lab,(a+b)/2,y+ly,z,c)]:[])]};
const F7K8={steps:[
 {say:t3("Trafiken tar oss till skolan, jobbet och fritiden. Men den har också baksidor: olyckor, buller och avgaser som gör luften sämre. Fysiken hjälper oss att förstå varför farten spelar så stor roll, och hur vi kan resa mer hållbart.",
   "Traffic takes us to school, work and our free time. But it also has downsides: accidents, noise and exhaust fumes that make the air worse. Physics helps us understand why speed matters so much, and how we can travel more sustainably.",
   "حركة المرور توصلنا إلى المدرسة والعمل وأنشطة وقت الفراغ، لكن لها أيضًا جوانب سلبية: الحوادث والضجيج وغازات العادم التي تُفسد الهواء. تساعدنا الفيزياء على فهم لماذا تهمّ السرعة كثيرًا، وكيف نتنقّل بطريقة أكثر استدامة."),
  draw:()=>[A.wipe(),ttl("Trafik och frisk luft"),...house(660,330,"b"),A.tx("skola",660,355,24,"b"),A.p(R.line(40,400,760,400,.3),"k",4),A.p(R.dashed(60,440,740,440,22),"#9aa3b2",3),
   drive(100,560,396,6,.9),A.flow("M60,370Q40,330 60,290Q80,250 60,210","#9aa3b2",5,4,9),...bike(300,470,.9),A.tx("avgaser",90,190,24,"#7d8ca6")]},
 {say:t3("När en förare upptäcker en fara tar det ungefär en sekund innan foten är på bromsen. Under den tiden kör bilen vidare med full fart. Den sträckan kallas reaktionssträcka. I 50 km/h, ungefär 14 m/s, hinner bilen 14 m innan den ens börjat bromsa.",
   "When a driver spots a danger, it takes about one second before the foot is on the brake. During that time the car keeps going at full speed. That distance is called the reaction distance. At 50 km/h, about 14 m/s, the car covers 14 m before it has even started to brake.",
   "عندما يرى السائق خطرًا يمرّ نحو ثانية قبل أن تصل قدمه إلى المكابح، وخلال هذا الوقت تستمر السيارة بسرعتها الكاملة. تسمّى هذه المسافة مسافة رد الفعل. عند 50 كم/ساعة، أي نحو 14 م/ث، تقطع السيارة 14 مترًا قبل أن تبدأ بالكبح."),
  draw:()=>{const k=14,x0=196;return[A.wipe(),ttl("Reaktionssträcka"),...road(330),car(120,326,1),...seg(x0,370,0,14,k,"o","14 m på 1 s",34,28),...kid(650,326,.8),...ball(610,316,10,"r"),
   A.tx("50 km/h ≈ 14 m/s",200,180,30,"k"),A.tx("föraren ser bollen …",450,180,28,"r","start"),A.tx("… men bromsen tar först här",x0+14*k,250,26,"o"),A.p(`M${x0+14*k},262V318`,"o",3)]}},
 {say:t3("När bromsen väl tar stannar bilen inte direkt. Sträckan den rullar medan den bromsar kallas bromssträcka. Reaktionssträckan plus bromssträckan blir stoppsträckan, alltså hela vägen från att föraren ser faran tills bilen står still.",
   "When the brake finally works, the car does not stop at once. The distance it rolls while braking is called the braking distance. The reaction distance plus the braking distance is the stopping distance, the whole way from when the driver sees the danger until the car stands still.",
   "عندما تبدأ المكابح بالعمل لا تتوقّف السيارة فورًا. المسافة التي تقطعها أثناء الكبح تسمّى مسافة الكبح. ومسافة رد الفعل مع مسافة الكبح تساوي مسافة التوقّف، أي كامل المسافة من رؤية السائق للخطر حتى تقف السيارة."),
  draw:()=>{const k=14,x0=150;return[A.wipe(),ttl("Stoppsträcka"),...road(300),car(x0-76,296,1),...seg(x0,340,0,14,k,"o","reaktionssträcka",34,26),...seg(x0,340,14,28,k,"r","bromssträcka",34,26),
   A.p(`M${x0},410H${x0+28*k}M${x0},400v20M${x0+28*k},400v20`,"b",4),A.tx("stoppsträcka = 14 m + 14 m = 28 m",x0+14*k,450,30,"b"),A.tx("i 50 km/h på torr väg",400,150,28,"k")]}},
 {say:t3("Bromssträckan växer mycket snabbare än farten. Fördubblas farten blir bromssträckan fyra gånger så lång. På torr asfalt är den ungefär 14 m i 50 km/h, men ungefär 4 · 14 = 56 m i 100 km/h. På is kan den bli många gånger längre.",
   "The braking distance grows much faster than the speed. If the speed doubles, the braking distance becomes four times as long. On dry asphalt it is about 14 m at 50 km/h, but about 4 · 14 = 56 m at 100 km/h. On ice it can be many times longer.",
   "تزداد مسافة الكبح أسرع بكثير من السرعة. إذا تضاعفت السرعة تصبح مسافة الكبح أطول بأربع مرات. على إسفلت جاف تكون نحو 14 مترًا عند 50 كم/ساعة، لكنها نحو 4 · 14 = 56 مترًا عند 100 كم/ساعة. وعلى الجليد قد تصبح أطول بمرات كثيرة."),
  draw:()=>[A.wipe(),ttl("Bromssträckan och farten"),...[[30,5],[50,14],[70,27],[100,56]].flatMap(([v,m],i)=>{const y=160+i*75;return[A.tx(v+" km/h",150,y+10,28,"k","end"),A.hatch(rp(170,y-16,m*8,30),"r"),A.p(R.rect(170,y-16,m*8,30,.2),"r",3.5),A.tx("ca "+m+" m",180+m*8,y+10,26,"r","start")]}),
   A.tx("dubbel fart → fyra gånger så lång bromssträcka",400,470,30,"b")]},
 {say:t3("I 30 km/h är stoppsträckan ungefär 13 m. Kör bilen i stället 50 km/h har den efter 13 m ännu inte börjat bromsa. Därför är det ofta 30 km/h vid skolor. En fotgängare som blir påkörd i 50 km/h löper mycket större risk att dö än i 30 km/h.",
   "At 30 km/h the stopping distance is about 13 m. If the car instead drives at 50 km/h, after 13 m it has not even started to brake. That is why the limit is often 30 km/h near schools. A pedestrian hit at 50 km/h is at much greater risk of dying than at 30 km/h.",
   "عند 30 كم/ساعة تكون مسافة التوقّف نحو 13 مترًا. أما إذا كانت السيارة تسير بسرعة 50 كم/ساعة فإنها بعد 13 مترًا لم تبدأ الكبح بعد. لهذا تكون السرعة غالبًا 30 كم/ساعة قرب المدارس. والمشاة الذين تصدمهم سيارة بسرعة 50 كم/ساعة معرّضون لخطر الموت أكثر بكثير مما عند 30 كم/ساعة."),
  draw:()=>{const k=18,x0=146,xc=x0+14*k;return[A.wipe(),ttl("30 eller 50 km/h?"),...road(220),car(100,216,.65),...seg(x0,250,0,8.3,k,"o"),...seg(x0,250,8.3,13.3,k,"r"),A.tx("30 km/h: stannar efter 13 m",x0+6*k,295,26,"g"),TICK(x0+13.3*k+30,250,"g"),
   ...road(390),car(100,386,.65),...seg(x0,420,0,13.9,k,"o"),...seg(x0,420,13.9,27.8,k,"r"),A.tx("50 km/h: har inte börjat bromsa",40,468,24,"r","start"),
   ...kid(xc,216,.55),...kid(xc,386,.55),dash(xc,120,xc,480,"p",2.5),A.tx("14 m",xc,115,24,"p")]}},
 {say:t3("Bilar med bensin- eller dieselmotor släpper ut avgaser. Koldioxiden förstärker växthuseffekten. Kväveoxider och små partiklar gör luften sämre att andas och kan ge astma och hjärtsjukdomar. Även däck och dubbar sliter loss partiklar från vägen.",
   "Cars with petrol or diesel engines give off exhaust fumes. The carbon dioxide strengthens the greenhouse effect. Nitrogen oxides and tiny particles make the air worse to breathe and can cause asthma and heart disease. Tyres and studs also tear particles off the road.",
   "تُطلق السيارات ذات محركات البنزين أو الديزل غازات العادم. ثاني أكسيد الكربون يقوّي ظاهرة الاحتباس الحراري، وأكاسيد النيتروجين والجسيمات الدقيقة تجعل الهواء أسوأ للتنفّس وقد تسبّب الربو وأمراض القلب. كما أن الإطارات والمسامير تقتلع جسيمات من الطريق."),
  draw:()=>[A.wipe(),ttl("Avgaser"),...road(420,40,420),car(300,416,1.2),A.flow("M200,400Q150,360 170,300Q190,240 150,180","#9aa3b2",7,5,10),
   A.tx("koldioxid (CO2)",60,140,26,"k","start"),A.tx("→ växthuseffekt",80,172,24,"o","start"),A.tx("kväveoxider",230,250,26,"k","start"),A.tx("partiklar",230,300,26,"k","start"),
   A.p("M330,430l.1,0M352,436l.1,0M372,428l.1,0M392,438l.1,0",BRN,7),A.tx("slitage från däck",380,470,24,BRN),IMG("organ-lungs",620,280,0,{h:190}),A.tx("sämre luft →",620,410,26,"r"),A.tx("astma, hjärtsjukdom",620,440,24,"r")]},
 {say:t3("Vad kan vi göra? Gå eller cykla korta sträckor, åk buss, tåg eller spårvagn, och samåk. En full buss ersätter många bilar. Elbilar släpper inte ut avgaser där de kör, men de sliter också på däck och väg, och elen behöver tillverkas hållbart.",
   "What can we do? Walk or cycle short distances, take the bus, train or tram, and share rides. A full bus replaces many cars. Electric cars give off no exhaust where they drive, but they also wear tyres and roads, and the electricity needs to be produced sustainably.",
   "ماذا نستطيع أن نفعل؟ نمشي أو نركب الدراجة للمسافات القصيرة، ونستقلّ الحافلة أو القطار أو الترام، ونتشارك السيارات. الحافلة الممتلئة تحلّ محلّ سيارات كثيرة. السيارات الكهربائية لا تطلق عادمًا حيث تسير، لكنها تُبلي الإطارات والطرق أيضًا، والكهرباء يجب أن تُنتج بطريقة مستدامة."),
  draw:()=>[A.wipe(),ttl("Hållbara resor"),A.band(30,100,355,320,"r"),A.band(415,100,355,320,"g"),A.tx("40 personer i bilar",207,140,28,"r"),A.tx("40 personer i en buss",592,140,28,"g"),
   ...[...Array(30)].map((_,i)=>A.p(R.rect(60+(i%6)*52,170+Math.floor(i/6)*46,40,24,.2)+R.circ(70+(i%6)*52,196+Math.floor(i/6)*46,4)+R.circ(90+(i%6)*52,196+Math.floor(i/6)*46,4),"r",2.5)),
   A.art(BUS,592,300,1),A.tx("ca 30 bilar",207,410,26,"r"),A.tx("1 buss",592,350,26,"g"),...bike(520,470,.75),...man(640,470,.55,"b"),A.tx("cykla och gå",690,440,24,"g","start")]},
 {say:t3("Diskutera: Borde det vara 30 km/h på alla gator där barn rör sig? Vilka för- och nackdelar finns för trafiksäkerheten, luften, restiden och dem som bor längs gatan? Och vad skulle du själv kunna ändra i hur du reser?",
   "Discuss: Should the limit be 30 km/h on all streets where children move about? What are the pros and cons for road safety, the air, travel time and the people who live along the street? And what could you yourself change in how you travel?",
   "ناقشوا: هل يجب أن تكون السرعة 30 كم/ساعة في كل الشوارع التي يتحرّك فيها الأطفال؟ ما الإيجابيات والسلبيات بالنسبة للسلامة المرورية والهواء ومدة الرحلة وسكان الشارع؟ وماذا يمكنك أنت أن تغيّر في طريقة تنقّلك؟"),
  draw:()=>[A.wipe(),ttl("Diskutera"),...sign(110,170,30,52),A.tx("30 km/h på alla gator",220,160,32,"k","start"),A.tx("där barn rör sig?",220,200,32,"k","start"),
   A.band(40,240,350,200,"g"),A.band(410,240,350,200,"r"),A.tx("för",215,280,32,"g"),A.tx("emot",585,280,32,"r"),
   A.p("M70,330H360M70,380H360M70,430H360","#9aa3b2",2),A.p("M440,330H730M440,380H730M440,430H730","#9aa3b2",2),A.tx("Vad kan du själv ändra?",400,480,30,"b")]},
]};
const PIC8={
 red:()=>{const k=10,x0=130;return[...road(300,30,390),car(x0-60,296,.8),...seg(x0,340,0,12,k,"o"),...seg(x0,340,12,24,k,"r"),qm(x0+18*k,400,"r",40)]},
 bars:()=>[A.tx("50 km/h",120,200,24,"k","end"),A.hatch(rp(130,180,56,30),"r"),A.p(R.rect(130,180,56,30,.2),"r",3.5),A.tx("14 m",196,204,24,"r","start"),
  A.tx("100 km/h",120,300,24,"k","end"),A.p(R.dashed(130,280,370,280)+R.dashed(130,310,370,310),"r",2.5),qm(250,306,"r",40)],
 stop:()=>{const k=9,x0=130;return[...road(300,30,390),car(x0-60,296,.8),...seg(x0,340,0,14,k,"o","14 m",34,22),...seg(x0,340,14,28,k,"r","14 m",34,22),A.p(`M${x0},410H${x0+28*k}`,"b",3),qm(x0+14*k,450,"b",40)]},
};
const BANK8=[
 {lv:0,q:"Vad kallas sträckan bilen kör innan föraren hunnit trycka på bromsen?",a:"reaktionssträcka",w:["bromssträcka","medelfart","stödyta"]},
 {lv:0,q:"Vad är stoppsträckan?",a:"reaktionssträckan + bromssträckan",w:["bara bromssträckan","fart · tid","bromssträckan − reaktionssträckan"]},
 {lv:0,q:"Vilken hastighet gäller ofta vid skolor?",a:"30 km/h",w:["70 km/h","90 km/h","110 km/h"]},
 {lv:0,q:"Vilket sätt att resa släpper ut minst avgaser?",a:"att cykla",w:["att köra bil ensam","att flyga","att åka moped"]},
 {lv:0,q:"Vad kallas den röda sträckan?",a:"bromssträcka",w:["reaktionssträcka","medelfart","stödyta"],lines:["Orange: föraren reagerar.","Vad kallas den","röda sträckan?"],pic:PIC8.red},
 {lv:1,q:"Ungefär hur lång är reaktionstiden för en uppmärksam förare?",a:"1 sekund",w:["1 minut","0,01 sekunder","10 sekunder"]},
 {lv:1,q:"En bil kör 20 m/s. Hur lång blir reaktionssträckan på 1 s?",a:"20 m",w:["2 m","40 m","72 m"]},
 {lv:1,q:"Vilken gas i avgaserna förstärker växthuseffekten?",a:"koldioxid",w:["syre","kväve","helium"]},
 {lv:1,q:"Vad händer med bromssträckan om farten fördubblas?",a:"den blir fyra gånger så lång",w:["den blir dubbelt så lång","den blir lika lång","den halveras"]},
 {lv:1,q:"Bromssträckan i 50 km/h är 14 m. Ungefär hur lång är den i 100 km/h?",a:"56 m",w:["28 m","14 m","100 m"],lines:["Bromssträckan i 50 km/h","är 14 m. Ungefär hur","lång är den i 100 km/h?"],pic:PIC8.bars},
 {lv:1,q:"Skriv ordet: buss, tåg och spårvagn kallas med ett ord …",a:["kollektivtrafik","kollektivtrafiken"],lines:["Skriv ordet som saknas:","Buss, tåg och spårvagn","kallas med ett ord …"]},
 {lv:2,q:"En bil kör 25 m/s. Föraren reagerar efter 1,5 s. Hur lång är reaktionssträckan?",a:"37,5 m",w:["25 m","16,7 m","135 m"]},
 {lv:2,q:"Bromssträckan i 30 km/h är 5 m. Ungefär hur lång är den i 90 km/h?",a:"45 m",w:["15 m","10 m","90 m"]},
 {lv:2,q:"Varför ger en mobil i handen längre stoppsträcka?",a:"reaktionssträckan blir längre",w:["bromssträckan blir kortare","bilen blir tyngre","friktionen ökar"]},
 {lv:2,q:"Varför släpper även elbilar ut partiklar?",a:"däck och vägbana slits",w:["batteriet ryker","motorn bränner olja","de har avgasrör"]},
 {lv:2,q:"Hur lång är stoppsträckan?",a:"28 m",w:["14 m","196 m","0 m"],lines:["Reaktionssträckan är 14 m","och bromssträckan 14 m.","Hur lång är stoppsträckan?"],pic:PIC8.stop},
 {lv:2,q:"En bil kör 15 m/s och föraren reagerar efter 2 s. Skriv reaktionssträckan i meter.",a:["30","30 m","30m"],lines:["Skriv svaret i meter:","En bil kör 15 m/s. Föraren","reagerar efter 2 s. Hur lång","är reaktionssträckan?"]},
];
LESSONS.push({id:"f7k8",subject:"science",grades:"7",kind:"wb",year:7,ord:28,
 title:t3("Hållbar utveckling: Trafik och frisk luft","Sustainable development: Traffic and clean air","التنمية المستدامة: المرور والهواء النقي"),
 icon:IC(`<path d="M10 140H310" stroke="#1d2433" stroke-width="4"/><g transform="translate(120 138) scale(.9)">${CAR()}</g><path d="M40 130Q20 100 40 70Q60 40 40 20" stroke="#9aa3b2" stroke-width="6" fill="none" stroke-dasharray="2 14" stroke-linecap="round"/><circle cx="250" cy="70" r="40" fill="#fff" stroke="#d63b2f" stroke-width="9"/><text x="250" y="84" font-family="Caveat,cursive" font-weight="700" font-size="40" text-anchor="middle">30</text>`),
 steps:F7K8.steps,mount:wbMount(F7K8),gen:bankGen(BANK8)});
WORDS.f7k8=["f7k_reaktion","f7k_broms","f7k_stopp","f7k_avgaser","f7k_kollektiv"];


/* ---------- helpers for the "Lär mer" lessons ---------- */
/* a measuring bracket from x1 to x2 at height y, with the label below (up=true: above) */
const R5=v=>Math.round(v);
const brk=(x1,x2,y,s,c="k",z=24,up)=>[A.p(`M${x1},${y-8}v16M${x2},${y-8}v16M${x1},${y}H${x2}`,c,2.5),A.tx(s,(x1+x2)/2,up?y-14:y+28,z,c)];
/* a rocket standing on (x, y) = its middle, with a flame */
const RKT="M-24 60L-24 -40Q0 -100 24 -40L24 60Z";
const rocket=(x,y,s=1)=>[A.hatch(tfx(RKT,x,y,s),"k"),A.p(tfx(RKT,x,y,s),"k",3.5),A.p(tfx("M-24 20L-50 66L-24 60ZM24 20L50 66L24 60Z",x,y,s),"r",3.5),A.p(R.circ(x,y-30*s,10*s),"b",3),
  A.hatch(tfx("M-16 64Q0 124 16 64Z",x,y,s),"o"),A.p(tfx("M-16 64Q0 124 16 64",x,y,s),"o",3.5)];
/* a puck on ice (seen a little from the side) */
const puck=(x,y)=>[A.hatch(ellP(x,y,34,12),"k"),A.p(ellP(x,y,34,12),"k",3)];
/* a rotated rectangle (a car seen from above), centre (cx, cy), length l along the angle a (degrees), width w */
const rrect=(cx,cy,l,w,a)=>{const r=a*Math.PI/180,ux=Math.cos(r),uy=Math.sin(r),P=[[l/2,w/2],[l/2,-w/2],[-l/2,-w/2],[-l/2,w/2]].map(([p,q])=>f1(cx+ux*p-uy*q)+","+f1(cy+uy*p+ux*q));return"M"+P.join("L")+"Z"};
/* a ball whirling on a string around (cx, cy): turns round under motion, stands still otherwise */
const whirl=(cx,cy,r,dur,c="o")=>{const [s,f]=PCOL[c],inner=`<path d="M0 0L${r} 0" stroke="#1d2433" stroke-width="3" stroke-linecap="round"/><circle cx="${r}" cy="0" r="18" fill="${f}" stroke="${s}" stroke-width="3.5"/>`;
  return A.art(MV?`<g><animateTransform attributeName="transform" type="rotate" values="0;-360" dur="${dur}s" repeatCount="indefinite"/>${inner}</g>`:`<g transform="rotate(-35)">${inner}</g>`,cx,cy,1)};
/* stick figures pulling on a rope: leaning back to the left (dir −1) or to the right (dir 1) */
const puller=(x,y,s,c,dir)=>man(x,y,s,c,{h:[14*dir,-130],n:[10*dir,-114],sh:[8*dir,-104],hip:[0,-58],f1:[24*dir,0],f2:[-22*dir,0],a1:[-34*dir,-66],a2:[-34*dir,-60]});

/* ---------- words ---------- */
TERM("f7k_kraftpil",{sv:"kraftpil",m:W("kraftpil(en|ar|arna)?"),d:t3("En pil som visar en kraft: längden visar storleken, spetsen visar riktningen och pilen börjar i angreppspunkten.","An arrow that shows a force: the length shows the size, the tip shows the direction, and the arrow starts at the point of application.","سهم يمثّل القوة: طوله يدل على مقدارها، ورأسه على اتجاهها، ويبدأ من نقطة تأثيرها."),ex:"En kraftpil på 3 cm kan visa 30 N.",tr:{en:"force arrow",ar:"سهم القوة"}});
TERM("f7k_resultant",{sv:"resultant",m:W("resultant(en|er|erna)?"),d:t3("En enda kraft som har samma verkan som alla krafterna på ett föremål tillsammans.","A single force that has the same effect as all the forces on an object together.","قوة واحدة لها التأثير نفسه الذي لجميع القوى المؤثّرة في الجسم معًا."),ex:"200 N och 150 N åt samma håll ger resultanten 350 N.",tr:{en:"resultant (net force)",ar:"المحصّلة"}});
TERM("f7k_kraftdiagram",{sv:"kraftdiagram",m:W("kraftdiagram(met|men)?"),d:t3("En bild av ett föremål där alla krafter som verkar på det är ritade som pilar.","A picture of an object where all the forces acting on it are drawn as arrows.","رسم لجسم تُرسم فيه كل القوى المؤثّرة فيه على شكل أسهم."),ex:"I kraftdiagrammet pekar tyngdkraften nedåt.",tr:{en:"force diagram",ar:"مخطّط القوى"}});
TERM("f7k_kraftskala",{sv:"skala",m:W("skala(n)?"),d:t3("Hur många newton varje centimeter av en kraftpil motsvarar.","How many newtons each centimetre of a force arrow stands for.","عدد النيوتنات التي يمثّلها كل سنتيمتر من سهم القوة."),ex:"Med skalan 1 cm = 10 N blir 50 N en pil på 5 cm.",tr:{en:"scale",ar:"مقياس الرسم"}});
TERM("f7k_normalkraft",{sv:"normalkraft",m:W("normalkraft(en|er)?"),d:t3("Kraften från ett underlag som trycker rakt ut från ytan, till exempel uppåt från ett bord.","The force from a surface that pushes straight out from it, for example upwards from a table.","القوة التي يؤثّر بها سطح عموديًّا عليه، مثل دفع الطاولة إلى الأعلى."),ex:"Bordet ger boken en normalkraft uppåt.",tr:{en:"normal force",ar:"القوة العمودية"}});

/* ---------------------------------------------------------------
   9. f7k9 (Lär mer): krafter kan ritas – kraftpilar, skala, resultant, jämvikt, kraftdiagram
   --------------------------------------------------------------- */
const F7K9={steps:[
 {say:t3("En kraft kan inte ses, men vi kan rita den som en pil. Pilen börjar i angreppspunkten, där kraften verkar. Spetsen visar riktningen. Längden visar hur stor kraften är: ju längre pil, desto större kraft. En sådan pil kallas kraftpil.",
   "A force cannot be seen, but we can draw it as an arrow. The arrow starts at the point of application, where the force acts. The tip shows the direction. The length shows how big the force is: the longer the arrow, the bigger the force. Such an arrow is called a force arrow.",
   "لا يمكن رؤية القوة، لكن يمكننا رسمها سهمًا. يبدأ السهم من نقطة التأثير حيث تؤثّر القوة، ويدل رأسه على الاتجاه، ويدل طوله على مقدار القوة: كلما طال السهم كبرت القوة. يسمّى هذا السهم سهم القوة."),
  draw:()=>[A.wipe(),ttl("Kraftpilar"),gnd(40,760,340),...blk(120,230,160,110,"b"),F(280,285,600,285,"r",7),dot(280,285,"r",7),A.tx("30 N",440,265,30,"r"),
   ...callout([280,285],330,185,"angreppspunkt","r",28,"start"),A.tx("riktning",618,294,28,"r","start"),...brk(280,600,400,"längden visar storleken","k",28)]},
 {say:t3("För att kunna jämföra krafter ritar vi pilarna i en skala. Om skalan är 1 cm = 10 N blir en kraft på 30 N en pil som är 3 cm lång, och en kraft på 50 N en pil som är 5 cm. Linjalen under pilarna visar centimetrarna.",
   "To be able to compare forces we draw the arrows to scale. If the scale is 1 cm = 10 N, a force of 30 N becomes an arrow 3 cm long, and a force of 50 N an arrow 5 cm long. The ruler under the arrows shows the centimetres.",
   "لكي نقارن بين القوى نرسم الأسهم بمقياس رسم. إذا كان المقياس 1 سم = 10 نيوتن، فإن قوة 30 نيوتن تصبح سهمًا طوله 3 سم، وقوة 50 نيوتن سهمًا طوله 5 سم. تُظهر المسطرة تحت الأسهم السنتيمترات."),
  draw:()=>{let d=R.line(150,390,650,390,.2);for(let i=0;i<=10;i++)d+=`M${150+i*50},${i%5?382:376}V398`;
   return[A.wipe(),ttl("Kraftskala"),...blk(540,120,220,60,"g","1 cm = 10 N",30),F(150,220,300,220,"r",7),dot(150,220,"r",6),A.tx("30 N",320,229,30,"r","start"),
    F(150,310,400,310,"b",7),dot(150,310,"b",6),A.tx("50 N",420,319,30,"b","start"),dash(150,220,150,390,"k",1.5),dash(300,228,300,390,"r",1.5),dash(400,318,400,390,"b",1.5),
    A.p(d,"k",2.5),...[0,1,2,3,4,5,6,7,8,9,10].map(i=>A.tx(i,150+i*50,424,20)),A.tx("cm",690,424,22,"k","start")]}},
 {say:t3("Två personer skjuter på en låda åt samma håll, den ena med 200 N och den andra med 150 N. Krafterna hjälps åt. Den sammanlagda kraften kallas resultant. Rita pilarna efter varandra: resultanten blir 200 N + 150 N = 350 N.",
   "Two people push a box in the same direction, one with 200 N and the other with 150 N. The forces help each other. The combined force is called the resultant. Draw the arrows one after the other: the resultant is 200 N + 150 N = 350 N.",
   "يدفع شخصان صندوقًا في الاتجاه نفسه، أحدهما بقوة 200 نيوتن والآخر بقوة 150 نيوتن. تتعاون القوتان، وتسمّى القوة المجموعة المحصّلة. ارسم السهمين واحدًا بعد الآخر: المحصّلة 200 + 150 = 350 نيوتن."),
  draw:()=>[A.wipe(),ttl("Krafter åt samma håll"),gnd(40,760,330),...blk(480,210,150,120,"o"),F(300,240,476,240,"r",6),A.tx("200 N",388,224,26,"r"),F(344,295,476,295,"b",6),A.tx("150 N",410,280,26,"b"),
   F(140,390,316,390,"r",6),F(316,390,448,390,"b",6),A.tx("200 N",228,375,22,"r"),A.tx("150 N",382,375,22,"b"),F(140,445,448,445,"g",7),A.tx("350 N",470,453,28,"g","start"),
   A.tx("200 N + 150 N = 350 N",640,400,28,"k")]},
 {say:t3("I en dragkamp drar laget till vänster med 600 N och laget till höger med 450 N. Krafterna är motriktade, så vi räknar skillnaden: 600 N − 450 N = 150 N. Resultanten är 150 N åt vänster, och repet börjar röra sig åt vänster.",
   "In a tug of war the team on the left pulls with 600 N and the team on the right with 450 N. The forces point in opposite directions, so we take the difference: 600 N − 450 N = 150 N. The resultant is 150 N to the left, and the rope starts to move to the left.",
   "في لعبة شدّ الحبل يشدّ الفريق الأيسر بقوة 600 نيوتن والفريق الأيمن بقوة 450 نيوتن. القوتان متعاكستان فنحسب الفرق: 600 − 450 = 150 نيوتن. المحصّلة 150 نيوتن نحو اليسار، فيبدأ الحبل بالتحرّك نحو اليسار."),
  draw:()=>[A.wipe(),ttl("Dragkamp"),gnd(40,760,420),A.p("M110,360H690",BRN,4),A.p("M400,350V372","r",4),
   ...puller(150,420,.9,"b",-1),...puller(230,420,.9,"b",-1),...puller(570,420,.9,"v",1),...puller(650,420,.9,"v",1),
   A.p("M400,140V180","k",3),F(400,160,160,160,"r",6),A.tx("600 N",280,142,28,"r"),F(400,160,580,160,"b",6),A.tx("450 N",490,142,28,"b"),
   F(400,225,340,225,"g",7),A.tx("resultant 150 N",410,234,26,"g","start"),A.tx("600 N − 450 N = 150 N åt vänster",400,475,28,"k")]},
 {say:t3("Om två krafter drar åt olika håll kan vi inte bara lägga ihop dem. Här drar 30 N åt höger och 40 N uppåt. Rita en rektangel med pilarna som sidor. Diagonalen är resultanten. Med skalan 1 cm = 10 N mäter den 5 cm, alltså 50 N, inte 70 N.",
   "If two forces pull in different directions we cannot just add them. Here 30 N pulls to the right and 40 N upwards. Draw a rectangle with the arrows as sides. The diagonal is the resultant. With the scale 1 cm = 10 N it measures 5 cm, so 50 N, not 70 N.",
   "إذا شدّت قوتان في اتجاهين مختلفين فلا يمكننا جمعهما ببساطة. هنا تشدّ قوة 30 نيوتن إلى اليمين و40 نيوتن إلى الأعلى. ارسم مستطيلًا ضلعاه السهمان، فيكون قطره هو المحصّلة. بمقياس 1 سم = 10 نيوتن يكون طوله 5 سم، أي 50 نيوتن وليس 70."),
  draw:()=>[A.wipe(),ttl("Krafter åt olika håll"),dash(295,420,295,240,"k",2),dash(160,240,295,240,"k",2),F(160,420,295,420,"r",6),A.tx("30 N",228,456,28,"r"),
   F(160,420,160,240,"b",6),A.tx("40 N",145,330,28,"b","end"),F(160,420,293,243,"g",7),A.tx("50 N",236,352,28,"g","start"),dot(160,420,"k",8),
   A.tx("skala: 1 cm = 10 N",420,170,28,"k","start"),A.tx("30 N → 3 cm, 40 N → 4 cm",420,220,26,"k","start"),A.tx("diagonalen mäter 5 cm",420,270,28,"g","start"),
   A.tx("resultant = 50 N",420,320,32,"g","start"),A.tx("inte 30 + 40 = 70 N!",420,380,28,"r","start")]},
 {say:t3("Ett kraftdiagram visar alla krafter på ett föremål. En bok ligger på ett bord. Tyngdkraften drar boken nedåt med 12 N. Bordet trycker uppåt med lika stor kraft, 12 N, som kallas normalkraft. Resultanten är 0 N och boken ligger still. Krafterna är i jämvikt.",
   "A force diagram shows all the forces on an object. A book lies on a table. Gravity pulls the book down with 12 N. The table pushes up with an equal force, 12 N, called the normal force. The resultant is 0 N and the book lies still. The forces are in equilibrium.",
   "يُظهر مخطّط القوى كل القوى المؤثّرة في جسم. كتاب على طاولة: تجذبه الجاذبية إلى الأسفل بقوة 12 نيوتن، وتدفعه الطاولة إلى الأعلى بقوة مساوية 12 نيوتن تسمّى القوة العمودية. المحصّلة 0 نيوتن فيبقى الكتاب ساكنًا، والقوى في حالة اتزان."),
  draw:()=>[A.wipe(),ttl("Kraftdiagram"),A.p("M80,300H460M100,300V450M440,300V450",BRN,7),...blk(190,250,140,50,"b"),
   F(220,276,220,396,"r",6),A.tx("tyngdkraft 12 N",232,392,24,"r","start"),F(300,298,300,178,"g",6),A.tx("normalkraft 12 N",312,190,24,"g","start"),
   A.tx("12 N uppåt",520,200,30,"g","start"),A.tx("12 N nedåt",520,250,30,"r","start"),A.p("M520,268H700","k",3),A.tx("resultant 0 N",520,310,30,"k","start"),A.tx("→ jämvikt,",520,370,28,"b","start"),A.tx("boken ligger still",520,408,28,"b","start")]},
 {say:t3("En bil kör på en rak väg med konstant fart. Motorn ger en drivande kraft framåt på 500 N. Luftmotstånd och friktion bromsar med 500 N. Resultanten är 0 N, så farten ändras inte. Blir drivkraften större än motståndet ökar farten.",
   "A car drives along a straight road at a constant speed. The engine gives a driving force forwards of 500 N. Air resistance and friction brake with 500 N. The resultant is 0 N, so the speed does not change. If the driving force becomes bigger than the resistance, the speed increases.",
   "تسير سيارة على طريق مستقيم بسرعة ثابتة. يعطي المحرّك قوة دافعة إلى الأمام مقدارها 500 نيوتن، ويكبحها الهواء والاحتكاك بقوة 500 نيوتن. المحصّلة 0 نيوتن فلا تتغيّر السرعة. وإذا صارت القوة الدافعة أكبر من المقاومة تزداد السرعة."),
  draw:()=>[A.wipe(),ttl("Konstant fart"),...road(380),car(400,380,1.3),F(510,330,670,330,"g",7),A.tx("drivkraft 500 N",590,310,26,"g"),F(290,330,130,330,"r",7),A.tx("motstånd 500 N",210,310,26,"r"),
   A.tx("resultant: 500 N − 500 N = 0 N",400,430,28,"k"),A.tx("→ farten är konstant",400,470,28,"b")]},
 {say:t3("Kom ihåg: en kraftpil visar storlek, riktning och angreppspunkt. Krafter åt samma håll läggs ihop och motriktade krafter dras ifrån. Är resultanten noll ligger föremålet still eller rör sig med konstant fart. Krafter åt olika håll ritas ihop till en rektangel.",
   "Remember: a force arrow shows size, direction and point of application. Forces in the same direction are added and opposite forces are subtracted. If the resultant is zero, the object lies still or moves at a constant speed. Forces in different directions are drawn together into a rectangle.",
   "تذكّر: يُظهر سهم القوة المقدار والاتجاه ونقطة التأثير. تُجمع القوى التي في الاتجاه نفسه وتُطرح القوى المتعاكسة. إذا كانت المحصّلة صفرًا يبقى الجسم ساكنًا أو يتحرّك بسرعة ثابتة. والقوى في اتجاهات مختلفة تُرسم معًا على شكل مستطيل."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["kraftpil: start = angreppspunkt, längd = storlek","r"],["samma håll: lägg ihop","b"],["motsatt håll: dra ifrån","o"],["resultant 0 N: still eller konstant fart","g"],["olika håll: rita en rektangel, mät diagonalen","v"]],60,150,62,30)]},
]};
const PIC9={
 opp:()=>[gnd(20,380,300),...blk(150,220,100,80,"b"),F(150,260,40,260,"r",6),A.tx("40 N",95,240,26,"r"),F(250,260,360,260,"r",6),A.tx("40 N",305,240,26,"r"),qm(200,400,"g")],
 chain:()=>[gnd(20,380,310),...blk(150,230,100,80,"b"),F(250,250,340,250,"r",6),A.tx("30 N",295,234,24,"r"),F(250,290,310,290,"o",6),A.tx("20 N",318,298,24,"o","start"),F(150,270,120,270,"g",6),A.tx("10 N",108,278,24,"g","end"),qm(200,420,"k",44)],
 book:()=>[A.p("M30,300H370M50,300V450M350,300V450",BRN,7),...blk(130,250,140,50,"b"),F(180,276,180,396,"r",6),A.tx("12 N",192,392,24,"r","start"),F(240,298,240,180,"g",6),qm(270,200,"g",40)],
};
const BANK9=[
 {lv:0,q:"Vad visar längden på en kraftpil?",a:"kraftens storlek",w:["kraftens riktning","angreppspunkten","föremålets massa"]},
 {lv:0,q:"Var börjar en kraftpil?",a:"i angreppspunkten",w:["alltid i föremålets mitt","vid marken","var som helst"]},
 {lv:0,q:"Vad kallas den kraft som har samma verkan som alla krafterna tillsammans?",a:"resultant",w:["motkraft","tyngdpunkt","normalkraft"]},
 {lv:0,q:"Två krafter på 40 N drar åt var sitt håll. Hur stor är resultanten?",a:"0 N",w:["80 N","40 N","20 N"],lines:["Två krafter på 40 N","drar åt var sitt håll.","Hur stor är resultanten?"],pic:PIC9.opp},
 {lv:0,q:"200 N och 150 N verkar åt samma håll. Hur stor är resultanten?",a:"350 N",w:["50 N","200 N","300 N"]},
 {lv:1,q:"I en dragkamp drar vänster lag med 600 N och höger lag med 450 N. Vad blir resultanten?",a:"150 N åt vänster",w:["1050 N åt vänster","150 N åt höger","0 N"]},
 {lv:1,q:"Skalan är 1 cm = 10 N. Hur lång pil ritar du för 35 N?",a:"3,5 cm",w:["35 cm","0,35 cm","7 cm"]},
 {lv:1,q:"Skalan är 1 cm = 20 N. En kraftpil är 4 cm. Hur stor är kraften?",a:"80 N",w:["20 N","24 N","5 N"]},
 {lv:1,q:"Hur stor är resultanten av de tre krafterna?",a:"40 N åt höger",w:["60 N åt höger","20 N åt höger","40 N åt vänster"],lines:["Tre krafter verkar","på lådan. Hur stor","är resultanten?"],pic:PIC9.chain},
 {lv:1,q:"En bok ligger still på ett bord. Hur stor är resultanten av krafterna på boken?",a:"0 N",w:["lika stor som bokens tyngd","dubbla tyngden","lika stor som normalkraften"]},
 {lv:1,q:"Skriv ordet: den kraft som har samma verkan som alla krafterna tillsammans kallas …",a:["resultant","resultanten","resultanter"],lines:["Skriv ordet som saknas:","Den sammanlagda kraften","av alla krafter kallas …"]},
 {lv:2,q:"Boken väger 12 N och ligger still. Hur stor är kraften från bordet?",a:"12 N uppåt",w:["12 N nedåt","0 N","24 N uppåt"],lines:["Boken har tyngden 12 N","och ligger still. Hur stor","är kraften från bordet?"],pic:PIC9.book},
 {lv:2,q:"En cyklist kör med konstant fart. Trampkraften framåt är 40 N. Hur stort är motståndet?",a:"40 N",w:["0 N","80 N","mindre än 40 N"]},
 {lv:2,q:"30 N åt höger och 40 N uppåt verkar på samma föremål. Hur stor är resultanten?",a:"50 N",w:["70 N","10 N","35 N"]},
 {lv:2,q:"En bil kör med konstant fart rakt fram. Vad gäller för krafterna?",a:"drivkraften är lika stor som motståndet",w:["drivkraften är större än motståndet","det verkar inga krafter alls","motståndet är större än drivkraften"]},
 {lv:2,q:"Krafterna 5 N och 8 N verkar på samma föremål, i valfria riktningar. Vilken resultant är OMÖJLIG?",a:"15 N",w:["3 N","8 N","13 N"]},
 {lv:2,q:"9 N och 12 N verkar vinkelrätt mot varandra. Skriv resultanten i newton.",a:["15","15 n","15n","15 newton"],lines:["Skriv svaret i newton:","9 N och 12 N verkar","vinkelrätt mot varandra.","Hur stor är resultanten?"]},
];
LESSONS.push({id:"f7k9",subject:"science",grades:"7",kind:"wb",year:7,ord:29,
 title:t3("Lär mer: Krafter kan ritas","Learn more: Drawing forces","تعلّم المزيد: رسم القوى"),
 icon:IC(`<rect x="110" y="70" width="80" height="60" fill="#dbe6fb" stroke="#2257c9" stroke-width="4"/><path d="M190 90H260M248 80L262 90L248 100" stroke="#d63b2f" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M110 110H50M62 100L48 110L62 120" stroke="#2257c9" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M150 155H230M218 145L232 155L218 165" stroke="#1e9e5a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M40 130H280" stroke="#1d2433" stroke-width="3"/>`),
 steps:F7K9.steps,mount:wbMount(F7K9),gen:bankGen(BANK9)});
WORDS.f7k9=["f7k_kraftpil","f7k_resultant","f7k_kraftdiagram","f7k_kraftskala","f7k_normalkraft","f7k_jamvikt"];

/* ---------------------------------------------------------------
   10. f7k10 (Lär mer): Newtons lagar – tröghet, F = m · a, verkan och reaktion
   --------------------------------------------------------------- */
TERM("f7k_troghet",{sv:"tröghet",m:W("tröghet(en)?"),d:t3("Att ett föremål fortsätter att ligga still eller röra sig rakt fram med samma fart om ingen resultant verkar.","That an object keeps lying still or moving straight ahead at the same speed if no resultant acts on it.","أن يبقى الجسم ساكنًا أو يتحرّك في خط مستقيم بالسرعة نفسها ما دامت لا تؤثّر فيه محصّلة."),ex:"På grund av trögheten far du framåt när bussen bromsar.",tr:{en:"inertia",ar:"القصور الذاتي"}});
TERM("f7k_acceleration",{sv:"acceleration",m:W("acceleration(en|er)?"),d:t3("Hur snabbt farten ändras. Mäts i meter per sekund i kvadrat, m/s².","How quickly the speed changes. Measured in metres per second squared, m/s².","مدى سرعة تغيّر السرعة، ويقاس بالمتر لكل ثانية مربّعة m/s²."),ex:"Ökar farten med 3 m/s varje sekund är accelerationen 3 m/s².",tr:{en:"acceleration",ar:"التسارع"}});
TERM("f7k_kraftlagen",{sv:"kraftlagen",m:W("kraftlag(en)?"),d:t3("Newtons andra lag: F = m · a. Resultanten är lika med massan gånger accelerationen.","Newton's second law: F = m · a. The resultant equals the mass times the acceleration.","قانون نيوتن الثاني: F = m · a، أي المحصّلة تساوي الكتلة مضروبة في التسارع."),ex:"1000 kg · 3 m/s² = 3000 N.",tr:{en:"Newton's second law",ar:"قانون نيوتن الثاني"}});
TERM("f7k_verkan",{sv:"verkan och reaktion",m:W("(verkan och reaktion|reaktionskraft(en)?)"),d:t3("Newtons tredje lag: när ett föremål påverkar ett annat med en kraft, påverkar det andra tillbaka med lika stor kraft åt motsatt håll.","Newton's third law: when one object acts on another with a force, the other acts back with an equal force in the opposite direction.","قانون نيوتن الثالث: عندما يؤثّر جسم في آخر بقوة، يؤثّر الآخر فيه بقوة مساوية في الاتجاه المعاكس."),ex:"Raketen trycker gasen nedåt och gasen trycker raketen uppåt.",tr:{en:"action and reaction",ar:"الفعل وردّ الفعل"}});
const skaters=(x1,x2,y,s=.9)=>[...man(x1,y,s,"b",{a1:[40,-92],a2:[44,-86]}),...man(x2,y,s,"v",{a1:[-40,-92],a2:[-44,-86]})];
const F7K10={steps:[
 {say:t3("Isaac Newton var en engelsk forskare. År 1687 gav han ut en bok där han beskrev hur krafter och rörelse hänger ihop, med tre lagar. Lagarna gäller allt från fotbollar till planeter, och de används än i dag när man bygger bilar och skickar upp raketer.",
   "Isaac Newton was an English scientist. In 1687 he published a book in which he described how forces and motion are connected, with three laws. The laws apply to everything from footballs to planets, and they are still used today to build cars and launch rockets.",
   "كان إسحاق نيوتن عالمًا إنجليزيًّا. في عام 1687 نشر كتابًا وصف فيه العلاقة بين القوى والحركة بثلاثة قوانين. تنطبق هذه القوانين على كل شيء من كرة القدم إلى الكواكب، وما زالت تُستخدم اليوم في صنع السيارات وإطلاق الصواريخ."),
  draw:()=>[A.wipe(),ttl("Newtons tre lagar"),IMG("apple",140,250,0,{h:110}),A.tx("Newton",140,350,30,"k"),A.tx("1687",140,390,30,"k"),
   ...blk(280,125,470,70,"b","1   tröghetslagen",30),...blk(280,220,470,70,"g","2   kraftlagen: F = m · a",30),...blk(280,315,470,70,"o","3   verkan och reaktion",30)]},
 {say:t3("Newtons första lag: ett föremål ligger still eller rör sig rakt fram med konstant fart så länge resultanten är noll. Det kallas tröghet. En puck på helt friktionsfri is skulle glida för evigt. På riktig is stannar den, eftersom friktion och luftmotstånd bromsar.",
   "Newton's first law: an object lies still or moves straight ahead at constant speed as long as the resultant is zero. This is called inertia. A puck on completely frictionless ice would slide forever. On real ice it stops, because friction and air resistance slow it down.",
   "قانون نيوتن الأول: يبقى الجسم ساكنًا أو يتحرّك في خط مستقيم بسرعة ثابتة ما دامت المحصّلة صفرًا، وهذا يسمّى القصور الذاتي. قرص على جليد عديم الاحتكاك تمامًا سينزلق إلى الأبد، أما على الجليد الحقيقي فيتوقّف لأن الاحتكاك ومقاومة الهواء يبطئانه."),
  draw:()=>[A.wipe(),ttl("Första lagen: tröghet"),A.band(40,260,720,80,"b"),...[110,250,390,530,670].flatMap(x=>puck(x,295)),F(130,200,670,200,"g",5),A.tx("samma fart, rakt fram",400,180,28,"g"),
   ...[180,320,460,600].map(x=>A.tx("1 s",x,245,22,"k")),A.tx("resultant 0 N → rörelsen ändras inte",400,400,30,"k"),A.tx("på riktig is: friktionen bromsar till slut",400,450,26,"r")]},
 {say:t3("Trögheten märks när farten ändras snabbt. Om en vagn tvärstannar mot en vägg fortsätter lådan på vagnen framåt. Samma sak händer med dig i en bil som krockar. Bilbältet ger den kraft som stoppar dig, så att du inte slungas framåt.",
   "Inertia is noticed when the speed changes quickly. If a cart stops suddenly against a wall, the box on the cart keeps moving forwards. The same happens to you in a car that crashes. The seat belt gives the force that stops you, so that you are not thrown forwards.",
   "يظهر القصور الذاتي عندما تتغيّر السرعة بسرعة. إذا توقّفت عربة فجأة عند جدار، يستمر الصندوق الذي عليها في التحرّك إلى الأمام. وهذا ما يحدث لك في سيارة تصطدم. حزام الأمان يعطي القوة التي توقفك حتى لا تُقذف إلى الأمام."),
  draw:()=>[A.wipe(),ttl("Tröghet i vardagen"),gnd(40,760,400),A.hatch(rp(600,190,40,210),"k"),A.p(R.rect(600,190,40,210,.3),"k",4),
   A.p(R.rect(360,330,236,40,.3),"k",4),A.p(R.circ(400,385,15)+R.circ(556,385,15),"k",3.5),
   dash(380,250,470,250,"k",2),dash(470,250,470,330,"k",2),dash(380,250,380,330,"k",2),...blk(500,250,90,80,"o"),F(420,222,560,222,"o",5),A.tx("lådan fortsätter",490,200,26,"o"),
   A.tx("vagnen stannar",478,452,26,"k"),A.tx("Bilbältet",190,250,30,"g"),A.tx("stoppar dig",190,290,30,"g"),A.tx("vid en krock.",190,330,30,"g")]},
 {say:t3("Newtons andra lag: en resultant ändrar föremålets fart. Hur snabbt farten ändras kallas acceleration och mäts i m/s². Lagen skrivs F = m · a. En bil på 1000 kg som får resultanten 3000 N får accelerationen a = F / m = 3000 / 1000 = 3 m/s².",
   "Newton's second law: a resultant changes the object's speed. How quickly the speed changes is called acceleration and is measured in m/s². The law is written F = m · a. A car of 1000 kg that gets the resultant 3000 N gets the acceleration a = F / m = 3000 / 1000 = 3 m/s².",
   "قانون نيوتن الثاني: المحصّلة تغيّر سرعة الجسم. ويسمّى مدى سرعة تغيّر السرعة التسارع ويقاس بـ m/s². يُكتب القانون F = m · a. سيارة كتلتها 1000 كغ تؤثّر فيها محصّلة 3000 نيوتن يكون تسارعها a = F / m = 3000 / 1000 = 3 m/s²."),
  draw:()=>[A.wipe(),ttl("Andra lagen: kraftlagen"),A.tx("F = m · a",400,165,64,"r"),A.hl(260,110,280,75),
   A.tx("F = resultant (N)",80,240,28,"r","start"),A.tx("m = massa (kg)",80,282,28,"g","start"),A.tx("a = acceleration (m/s²)",80,324,28,"b","start"),
   ...road(330,520,790),car(620,330,.9),F(694,300,776,300,"r",6),A.tx("3000 N",735,280,24,"r"),A.tx("1000 kg",620,362,24,"g"),A.tx("a = F / m = 3000 / 1000 = 3 m/s²",400,440,32,"k")]},
 {say:t3("Samma kraft ger en lätt sak större acceleration än en tung. En kraft på 10 N ger en boll på 0,5 kg accelerationen 10 / 0,5 = 20 m/s². Samma kraft på en låda på 5 kg ger bara 10 / 5 = 2 m/s². Därför är en full kundvagn svårare att få fart på än en tom.",
   "The same force gives a light object a bigger acceleration than a heavy one. A force of 10 N gives a 0.5 kg ball the acceleration 10 / 0.5 = 20 m/s². The same force on a 5 kg box gives only 10 / 5 = 2 m/s². That is why a full shopping trolley is harder to get moving than an empty one.",
   "القوة نفسها تعطي الجسم الخفيف تسارعًا أكبر من الثقيل. قوة 10 نيوتن تعطي كرة كتلتها 0,5 كغ تسارعًا 10 / 0,5 = 20 m/s²، أما على صندوق كتلته 5 كغ فتعطي 10 / 5 = 2 m/s² فقط. لذلك يصعب تحريك عربة تسوّق ممتلئة أكثر من فارغة."),
  draw:()=>[A.wipe(),ttl("Samma kraft, olika massa"),gnd(40,760,252),...ball(220,225,26,"o"),F(110,225,190,225,"r",6),A.tx("10 N",150,205,24,"r"),A.tx("0,5 kg",220,292,22,"o"),
   A.tx("a = 10 / 0,5 = 20 m/s²",300,234,30,"k","start"),gnd(40,760,420),...blk(180,330,90,90,"b","5 kg",26),F(90,375,176,375,"r",6),A.tx("10 N",133,355,24,"r"),
   A.tx("a = 10 / 5 = 2 m/s²",300,384,30,"k","start"),A.tx("liten massa → stor acceleration",400,475,28,"g")]},
 {say:t3("När något faller fritt är tyngdkraften den enda kraften: F = m · g. Då blir a = F / m = g. Utan luftmotstånd faller allt med accelerationen 9,8 m/s². Farten ökar med 9,8 m/s varje sekund: 9,8 m/s efter 1 s, 19,6 m/s efter 2 s och 29,4 m/s efter 3 s.",
   "When something falls freely, gravity is the only force: F = m · g. Then a = F / m = g. Without air resistance everything falls with the acceleration 9.8 m/s². The speed increases by 9.8 m/s every second: 9.8 m/s after 1 s, 19.6 m/s after 2 s and 29.4 m/s after 3 s.",
   "عندما يسقط شيء سقوطًا حرًّا تكون الجاذبية القوة الوحيدة: F = m · g، فيكون a = F / m = g. من دون مقاومة الهواء يسقط كل شيء بتسارع 9,8 m/s²، فتزداد السرعة 9,8 m/s كل ثانية: 9,8 بعد ثانية، و19,6 بعد ثانيتين، و29,4 بعد ثلاث ثوانٍ."),
  draw:()=>[A.wipe(),ttl("Fritt fall och kraftlagen"),...[0,1,2,3].flatMap(t=>ball(140,110+t*t*36,12,"o")),A.p(R.line(170,110,170,434,.3),"k",2),
   ...[0,1,2,3].map(t=>A.tx(t+" s",188,117+t*t*36,22,"k","start")),A.tx("tid",420,150,28,"k"),A.tx("fart",620,150,28,"k"),A.p("M360,166H700","k",2.5),
   ...[["0 s","0 m/s"],["1 s","9,8 m/s"],["2 s","19,6 m/s"],["3 s","29,4 m/s"]].flatMap(([a,b],i)=>[A.tx(a,420,205+i*45,28,"k"),A.tx(b,620,205+i*45,28,"b")]),
   A.tx("a = g ≈ 9,8 m/s²",530,430,34,"r")]},
 {say:t3("Newtons tredje lag: krafter kommer alltid i par. Knuffar du på något, knuffar det tillbaka lika mycket åt motsatt håll. En raket trycker ut gas nedåt, och gasen trycker raketen uppåt. Två skridskoåkare som knuffar på varandra glider isär åt var sitt håll.",
   "Newton's third law: forces always come in pairs. If you push on something, it pushes back just as much in the opposite direction. A rocket pushes gas out downwards, and the gas pushes the rocket upwards. Two skaters who push each other glide apart in opposite directions.",
   "قانون نيوتن الثالث: القوى تأتي دائمًا أزواجًا. إذا دفعت شيئًا دفعك بالمقدار نفسه في الاتجاه المعاكس. يدفع الصاروخ الغاز إلى الأسفل، فيدفع الغاز الصاروخ إلى الأعلى. ومتزلّجان يدفع كل منهما الآخر ينزلقان مبتعدين في اتجاهين متعاكسين."),
  draw:()=>[A.wipe(),ttl("Tredje lagen: verkan och reaktion"),...rocket(170,230,1.1),F(240,250,240,140,"g",6),A.tx("på raketen",254,165,24,"g","start"),
   F(170,370,170,460,"r",6),A.tx("på gasen",186,450,24,"r","start"),gnd(400,760,420),...skaters(530,630,420),
   F(520,250,430,250,"b",6),A.tx("120 N",475,232,24,"b"),F(640,250,730,250,"v",6),A.tx("120 N",685,232,24,"v"),A.tx("lika stora, motsatt riktade",580,475,26,"k")]},
 {say:t3("Kom ihåg Newtons tre lagar. Ett: utan resultant ändras inte rörelsen, det är tröghet. Två: F = m · a, så en liten massa får stor acceleration. Tre: varje kraft har en lika stor motkraft åt motsatt håll. Allt faller fritt med accelerationen 9,8 m/s².",
   "Remember Newton's three laws. One: without a resultant the motion does not change, that is inertia. Two: F = m · a, so a small mass gets a big acceleration. Three: every force has an equal counterforce in the opposite direction. Everything falls freely with the acceleration 9.8 m/s².",
   "تذكّر قوانين نيوتن الثلاثة. الأول: بلا محصّلة لا تتغيّر الحركة، وهذا هو القصور الذاتي. الثاني: F = m · a، فالكتلة الصغيرة تحصل على تسارع كبير. الثالث: لكل قوة قوة مساوية لها في الاتجاه المعاكس. وكل شيء يسقط سقوطًا حرًّا بتسارع 9,8 m/s²."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["1: resultant 0 → ingen ändring (tröghet)","r"],["2: F = m · a, a mäts i m/s²","g"],["a = F / m: liten massa → stor a","b"],["fritt fall: a = g ≈ 9,8 m/s²","o"],["3: varje kraft har en lika stor motkraft","v"]],60,150,62,30)]},
]};
const PIC10={
 rocket:()=>[...rocket(200,220,1.1),F(200,360,200,450,"r",6),A.tx("gasen",216,440,24,"r","start"),qm(290,180,"g")],
 puck:()=>[A.band(20,250,370,90,"b"),...puck(90,295),F(130,295,220,295,"g",5),A.tx("is utan friktion",200,380,24,"b"),qm(310,300,"k",44)],
 skate:()=>[gnd(20,380,420),...skaters(150,250,420),F(140,250,60,250,"b",6),qm(100,232,"b",36),F(260,250,350,250,"v",6),A.tx("120 N",305,232,24,"v"),A.tx("Anna 40 kg",130,460,22,"b"),A.tx("Bo",260,460,22,"v")],
};
const BANK10=[
 {lv:0,q:"Vem beskrev lagarna om kraft och rörelse år 1687?",a:"Isaac Newton",w:["Galileo Galilei","Albert Einstein","Christiaan Huygens"]},
 {lv:0,q:"Vad kallas det att ett föremål vill fortsätta röra sig som det gör?",a:"tröghet",w:["friktion","tyngd","acceleration"]},
 {lv:0,q:"Bussen bromsar hårt. Åt vilket håll far passagerarna?",a:"framåt",w:["bakåt","uppåt","de står helt still"]},
 {lv:0,q:"Vilken formel är Newtons andra lag?",a:"F = m · a",w:["F = m / a","v = s / t","F = a / m"]},
 {lv:0,q:"Raketen trycker gasen nedåt. Åt vilket håll trycker gasen raketen?",a:"uppåt",w:["nedåt","åt sidan","inte alls"],lines:["Raketen trycker","gasen nedåt. Åt vilket","håll trycker gasen","raketen?"],pic:PIC10.rocket},
 {lv:1,q:"Vilken enhet har acceleration?",a:"m/s²",w:["m/s","N","kg"]},
 {lv:1,q:"En bil på 1000 kg får resultanten 3000 N. Hur stor blir accelerationen?",a:"3 m/s²",w:["3000 m/s²","0,3 m/s²","30 m/s²"]},
 {lv:1,q:"Samma kraft knuffar en tom och en full kundvagn. Vilken får störst acceleration?",a:"den tomma",w:["den fulla","båda får lika stor","ingen av dem"]},
 {lv:1,q:"Puckan glider på is helt utan friktion. Vad händer?",a:"den glider vidare med samma fart",w:["den stannar snart","den går allt fortare","den svänger av"],lines:["Puckan glider på is","helt utan friktion.","Vad händer sedan?"],pic:PIC10.puck},
 {lv:1,q:"Varför ska man ha bilbälte?",a:"kroppen fortsätter framåt när bilen tvärstannar",w:["bältet gör bilen snabbare","bältet minskar tyngdkraften","kroppen far bakåt vid en krock"]},
 {lv:1,q:"Skriv ordet: att ett föremål vill fortsätta i samma rörelse kallas …",a:["tröghet","trögheten","troghet"],lines:["Skriv ordet som saknas:","Att ett föremål vill fortsätta","i samma rörelse kallas …"]},
 {lv:2,q:"En kraft på 10 N verkar på en boll med massan 0,5 kg. Hur stor blir accelerationen?",a:"20 m/s²",w:["5 m/s²","10,5 m/s²","2 m/s²"]},
 {lv:2,q:"En sten faller fritt utan luftmotstånd. Hur stor är farten efter 3 s?",a:"29,4 m/s",w:["9,8 m/s","12,8 m/s","88,2 m/s"]},
 {lv:2,q:"Anna (40 kg) knuffar Bo med 120 N. Hur stor blir Annas acceleration?",a:"3 m/s²",w:["0 m/s²","4800 m/s²","0,3 m/s²"],lines:["Anna (40 kg) knuffar","Bo med 120 N. Hur stor","blir Annas acceleration?"],pic:PIC10.skate},
 {lv:2,q:"Du står på marken och trycker på jorden med 500 N. Hur stor kraft trycker jorden på dig?",a:"500 N",w:["0 N","mindre än 500 N","mer än 500 N"]},
 {lv:2,q:"En hiss på 800 kg ska få accelerationen 1 m/s² uppåt. Hur stor resultant behövs?",a:"800 N",w:["8000 N","80 N","801 N"]},
 {lv:2,q:"Kraften 30 N ger ett föremål accelerationen 6 m/s². Skriv massan i kilogram.",a:["5","5 kg","5kg","5 kilogram"],lines:["Skriv svaret i kilogram:","Kraften 30 N ger","accelerationen 6 m/s².","Hur stor är massan?"]},
];
LESSONS.push({id:"f7k10",subject:"science",grades:"7",kind:"wb",year:7,ord:30,
 title:t3("Lär mer: Newtons lagar","Learn more: Newton's laws","تعلّم المزيد: قوانين نيوتن"),
 icon:IC(`<path d="M80 40Q100 0 120 40V120H80Z" fill="#dfe3ea" stroke="#1d2433" stroke-width="4"/><path d="M80 100L62 132L80 124ZM120 100L138 132L120 124Z" fill="#f8dcd9" stroke="#d63b2f" stroke-width="3"/><path d="M88 124Q100 172 112 124Z" fill="#fbe7cc" stroke="#e07b00" stroke-width="3"/><text x="225" y="105" font-family="Caveat,cursive" font-weight="700" font-size="46" fill="#d63b2f" text-anchor="middle">F = m·a</text>`),
 steps:F7K10.steps,mount:wbMount(F7K10),gen:bankGen(BANK10)});
WORDS.f7k10=["f7k_troghet","f7k_acceleration","f7k_kraftlagen","f7k_verkan","f7k_newton","f7k_frittfall"];

/* ---------------------------------------------------------------
   11. f7k11 (Lär mer): hävstången – hävarm, moment, hävstångsregeln F1 · l1 = F2 · l2
   --------------------------------------------------------------- */
TERM("f7k_stodpunkt",{sv:"stödpunkt",m:W("stödpunkt(en|er|erna)?"),d:t3("Punkten som en hävstång vilar på och vrids kring.","The point that a lever rests on and turns around.","النقطة التي ترتكز عليها الرافعة وتدور حولها."),ex:"Gungbrädans stödpunkt sitter i mitten.",tr:{en:"fulcrum (pivot)",ar:"نقطة الارتكاز"}});
TERM("f7k_havarm",{sv:"hävarm",m:W("hävarm(en|ar|arna)?"),d:t3("Avståndet från stödpunkten till platsen där kraften verkar.","The distance from the fulcrum to the place where the force acts.","المسافة من نقطة الارتكاز إلى موضع تأثير القوة."),ex:"Ju längre hävarm, desto mindre kraft behövs.",tr:{en:"lever arm",ar:"ذراع القوة"}});
TERM("f7k_moment",{sv:"moment",m:W("(vrid)?moment(et)?"),d:t3("Kraften gånger hävarmen. Mäts i newtonmeter (Nm) och visar hur mycket kraften vrider.","The force times the lever arm. Measured in newton metres (Nm) and shows how much the force turns.","القوة مضروبة في ذراعها، ويقاس بالنيوتن متر (Nm) ويُظهر مقدار ما تُدير به القوة."),ex:"50 N · 2 m = 100 Nm.",tr:{en:"moment (torque)",ar:"العزم"}});
TERM("f7k_havregel",{sv:"hävstångsregeln",m:W("hävstångsregel(n)?"),d:t3("En hävstång är i balans när F1 · l1 = F2 · l2, alltså när momenten på båda sidor är lika stora.","A lever is balanced when F1 · l1 = F2 · l2, that is when the moments on both sides are equal.","تكون الرافعة متّزنة عندما F1 · l1 = F2 · l2، أي عندما يتساوى العزمان على الجانبين."),ex:"300 N · 2 m = 600 N · 1 m.",tr:{en:"law of the lever",ar:"قانون الرافعة"}});
const F7K11={steps:[
 {say:t3("Den grekiske forskaren Arkimedes levde för över 2000 år sedan. Han förstod hur hävstången fungerar och ska ha sagt: Ge mig en fast punkt, så ska jag flytta jorden. Med en tillräckligt lång stång kan en liten kraft lyfta något mycket tungt.",
   "The Greek scientist Archimedes lived more than 2000 years ago. He understood how the lever works and is said to have said: Give me a fixed point and I will move the Earth. With a long enough bar a small force can lift something very heavy.",
   "عاش العالم الإغريقي أرخميدس قبل أكثر من 2000 عام. فهم كيف تعمل الرافعة، ويُروى أنه قال: أعطني نقطة ارتكاز وسأحرّك الأرض. بقضيب طويل بما يكفي يمكن لقوة صغيرة أن ترفع شيئًا ثقيلًا جدًّا."),
  draw:()=>[A.wipe(),ttl("Arkimedes och hävstången"),beam(110,330,740,250),...earth(160,250,70),...fulcrum(260,312,"k",60),F(720,170,720,246,"r",6),A.tx("liten kraft",705,155,26,"r","end"),
   A.tx("stödpunkt",260,402,24,"k"),A.tx("Ge mig en fast punkt …",540,400,30,"v"),A.tx("… så ska jag flytta jorden.",540,442,30,"v")]},
 {say:t3("En hävstång är en stång som kan vridas kring en stödpunkt. Avståndet från stödpunkten till en kraft kallas hävarm. På ena sidan verkar lasten, på andra sidan din kraft. Ju längre hävarm din kraft har, desto mindre kraft behöver du.",
   "A lever is a bar that can turn around a fulcrum. The distance from the fulcrum to a force is called the lever arm. On one side the load acts, on the other side your force. The longer the lever arm of your force, the less force you need.",
   "الرافعة قضيب يمكن أن يدور حول نقطة ارتكاز. وتسمّى المسافة من نقطة الارتكاز إلى القوة ذراع القوة. على أحد الجانبين يؤثّر الحمل، وعلى الآخر قوتك. كلما طال ذراع قوتك قلّت القوة التي تحتاج إليها."),
  draw:()=>[A.wipe(),ttl("Stödpunkt och hävarm"),beam(100,260,700,260),...fulcrum(300,264,"k",60),...blk(110,190,80,66,"o","last",24),F(660,150,660,252,"r",6),A.tx("din kraft",660,135,26,"r"),
   ...brk(150,300,350,"hävarm l1","o",24),...brk(300,660,350,"hävarm l2","r",24),A.tx("stödpunkt",300,430,26,"k")]},
 {say:t3("Kraften gånger hävarmen kallas moment och mäts i newtonmeter, Nm. Hävstången är i balans när momenten på båda sidor är lika stora. Det kallas hävstångsregeln: F1 · l1 = F2 · l2. Dubbelt så lång hävarm betyder att det räcker med halva kraften.",
   "The force times the lever arm is called the moment and is measured in newton metres, Nm. The lever is balanced when the moments on both sides are equal. This is called the law of the lever: F1 · l1 = F2 · l2. A lever arm twice as long means half the force is enough.",
   "القوة مضروبة في ذراعها تسمّى العزم وتقاس بالنيوتن متر Nm. تكون الرافعة متّزنة عندما يتساوى العزمان على الجانبين، وهذا قانون الرافعة: F1 · l1 = F2 · l2. ذراع أطول بمرتين يعني أن نصف القوة يكفي."),
  draw:()=>[A.wipe(),ttl("Hävstångsregeln"),A.tx("F1 · l1 = F2 · l2",400,170,56,"r"),A.hl(190,115,420,75),A.tx("moment = kraft · hävarm (Nm)",400,245,30,"b"),
   beam(150,370,650,370),...fulcrum(350,374,"k",50),F(250,296,250,364,"o",6),A.tx("600 N",236,308,26,"o","end"),F(550,316,550,364,"g",6),A.tx("300 N",566,330,26,"g","start"),
   ...brk(250,350,446,"1 m","o",24),...brk(350,550,446,"2 m","g",24),A.tx("600 · 1 = 300 · 2",690,440,26,"k")]},
 {say:t3("Lisa har tyngden 300 N och sitter 2 m från stödpunkten. Hennes pappa har tyngden 600 N. Var ska han sitta? Lisas moment är 300 · 2 = 600 Nm. Pappa behöver samma moment: 600 · l = 600, alltså l = 1 m. Den som är tyngst sitter närmast stödpunkten.",
   "Lisa has a weight of 300 N and sits 2 m from the fulcrum. Her dad has a weight of 600 N. Where should he sit? Lisa's moment is 300 · 2 = 600 Nm. Dad needs the same moment: 600 · l = 600, so l = 1 m. The heaviest person sits closest to the fulcrum.",
   "وزن ليزا 300 نيوتن وتجلس على بعد 2 م من نقطة الارتكاز، ووزن أبيها 600 نيوتن. أين يجلس؟ عزم ليزا 300 · 2 = 600 Nm، ويحتاج الأب العزم نفسه: 600 · l = 600، إذن l = 1 م. الأثقل يجلس الأقرب إلى نقطة الارتكاز."),
  draw:()=>[A.wipe(),ttl("Gungbrädan"),gnd(40,760,400),...fulcrum(400,330,"k",70),beam(90,326,710,326),...man(100,322,.75,"p"),...man(250,322,1,"b"),
   A.tx("Lisa 300 N",100,198,24,"p"),A.tx("pappa 600 N",250,162,24,"b"),...brk(250,400,446,"1 m","b",22,true),A.p("M100,470v16M400,470v16M100,478H400","p",2.5),A.tx("2 m",175,470,22,"p"),
   A.tx("Lisa: 300 · 2 = 600 Nm",470,180,28,"p","start"),A.tx("pappa: 600 · 1 = 600 Nm",470,225,28,"b","start"),A.tx("lika stora → balans",470,272,28,"g","start")]},
 {say:t3("En sten som väger 900 N ligger 0,1 m från spettets stödpunkt. Du trycker 0,9 m från stödpunkten. Hävstångsregeln ger F · 0,9 = 900 · 0,1 = 90. Alltså F = 90 / 0,9 = 100 N. Din hävarm är nio gånger längre, så kraften blir nio gånger mindre.",
   "A stone weighing 900 N lies 0.1 m from the crowbar's fulcrum. You push 0.9 m from the fulcrum. The law of the lever gives F · 0.9 = 900 · 0.1 = 90. So F = 90 / 0.9 = 100 N. Your lever arm is nine times longer, so the force is nine times smaller.",
   "حجر وزنه 900 نيوتن على بعد 0,1 م من نقطة ارتكاز العتلة، وأنت تضغط على بعد 0,9 م منها. يعطي قانون الرافعة F · 0,9 = 900 · 0,1 = 90، إذن F = 90 / 0,9 = 100 نيوتن. ذراعك أطول بتسع مرات، فالقوة أصغر بتسع مرات."),
  draw:()=>[A.wipe(),ttl("Räkna med spettet"),gnd(40,760,420),A.hatch(tfx(STONE,130,330,1),"k"),A.p(tfx(STONE,130,330,1),"k",3.5),A.tx("900 N",130,248,26,"k"),...fulcrum(240,342,"k",78),beam(100,340,700,340),
   F(690,230,690,330,"r",6),A.tx("F = ?",690,215,28,"r"),...brk(190,240,450,"0,1 m","k",22),...brk(240,690,450,"0,9 m","r",22),
   A.tx("F · 0,9 = 900 · 0,1",330,150,30,"k","start"),A.tx("F · 0,9 = 90",330,195,30,"k","start"),A.tx("F = 90 / 0,9 = 100 N",330,240,30,"g","start")]},
 {say:t3("Hävstänger finns i tre sorter. Stödpunkten kan sitta i mitten, som på en gungbräda eller en sax. Lasten kan sitta i mitten, som i en skottkärra. Kraften kan sitta i mitten, som i en pincett eller din underarm. Då krävs stor kraft, men rörelsen blir lång och snabb.",
   "Levers come in three kinds. The fulcrum can be in the middle, as on a seesaw or a pair of scissors. The load can be in the middle, as in a wheelbarrow. The force can be in the middle, as in tweezers or your forearm. Then a big force is needed, but the movement becomes long and fast.",
   "للروافع ثلاثة أنواع: قد تكون نقطة الارتكاز في الوسط كما في الأرجوحة أو المقص، وقد يكون الحمل في الوسط كما في عربة اليد، وقد تكون القوة في الوسط كما في الملقط أو ساعدك. عندها تلزم قوة كبيرة لكن الحركة تصبح طويلة وسريعة."),
  draw:()=>{const col=(cx,fx,lx,kx,up)=>[beam(cx-100,250,cx+100,250),...fulcrum(fx,254,"k",30),A.hatch(rp(lx-15,222,30,26),"o"),A.p(R.rect(lx-15,222,30,26,.3),"o",3.5),
     up?F(kx,330,kx,258,"r",6):F(kx,160,kx,244,"r",6)];
   return[A.wipe(),ttl("Tre sorters hävstänger"),...col(140,140,60,220,false),...col(400,300,380,490,true),...col(660,560,740,640,true),
    A.tx("stödpunkt i mitten",140,385,24,"k"),A.tx("last i mitten",400,385,24,"o"),A.tx("kraft i mitten",660,385,24,"r"),
    A.tx("gungbräda, sax",140,425,24,"b"),A.tx("skottkärra",400,425,24,"b"),A.tx("pincett, underarm",660,425,24,"b"),A.tx("orange = last, röd = kraft",400,475,22,"k")]}},
 {say:t3("Din underarm är en hävstång och armbågen är stödpunkten. Bicepsmuskeln fäster ca 4 cm från armbågen, men handen håller vikten 35 cm bort. Väger vikten 20 N måste biceps dra med F · 4 = 20 · 35, alltså F = 700 / 4 = 175 N. Muskeln jobbar hårt, men handen rör sig snabbt.",
   "Your forearm is a lever and the elbow is the fulcrum. The biceps muscle is attached about 4 cm from the elbow, but the hand holds the weight 35 cm away. If the weight is 20 N the biceps must pull with F · 4 = 20 · 35, so F = 700 / 4 = 175 N. The muscle works hard, but the hand moves fast.",
   "ساعدك رافعة ومرفقك نقطة الارتكاز. تتصل العضلة ذات الرأسين على بعد نحو 4 سم من المرفق، بينما تحمل اليد الثقل على بعد 35 سم. إذا كان الثقل 20 نيوتن فيجب أن تشدّ العضلة بقوة F · 4 = 20 · 35، أي F = 700 / 4 = 175 نيوتن. تعمل العضلة بجهد، لكن اليد تتحرّك بسرعة."),
  draw:()=>[A.wipe(),ttl("Armen är en hävstång"),A.p("M190,120L200,330","p",14),A.p("M200,330L600,330","p",14),A.hatch(ellP(222,228,20,66),"r"),A.p(ellP(222,228,20,66),"r",3),
   dot(200,330,"k",9),A.tx("armbåge =",150,330,24,"k","end"),A.tx("stödpunkt",150,360,24,"k","end"),F(246,322,246,214,"r",6),A.tx("biceps: F = ?",262,232,26,"r","start"),
   ...wt(600,350,60,44,"o","20 N",22),...brk(200,600,290,"35 cm","o",24,true),...brk(200,246,372,"4 cm","r",22),
   A.tx("F · 4 = 20 · 35 = 700",520,440,28,"k"),A.tx("F = 700 / 4 = 175 N",520,480,28,"g")]},
 {say:t3("Sitter flera vikter på samma sida lägger man ihop deras moment. Till vänster hänger 10 N på 0,3 m och 20 N på 0,1 m: 10 · 0,3 + 20 · 0,1 = 3 + 2 = 5 Nm. Till höger hänger 25 N. För balans behövs 25 · l = 5, alltså l = 0,2 m.",
   "If several weights hang on the same side, you add their moments. On the left 10 N hangs at 0.3 m and 20 N at 0.1 m: 10 · 0.3 + 20 · 0.1 = 3 + 2 = 5 Nm. On the right 25 N hangs. For balance 25 · l = 5 is needed, so l = 0.2 m.",
   "إذا عُلّقت عدة أثقال في الجانب نفسه نجمع عزومها. على اليسار 10 نيوتن على بعد 0,3 م و20 نيوتن على بعد 0,1 م: 10 · 0,3 + 20 · 0,1 = 3 + 2 = 5 Nm. وعلى اليمين يتدلّى 25 نيوتن، وللاتزان يلزم 25 · l = 5، أي l = 0,2 م."),
  draw:()=>[A.wipe(),ttl("Flera vikter"),beam(80,200,720,200),...fulcrum(400,204,"k",50),...wt(100,214,64,44,"o","10 N",22),...wt(300,214,64,44,"o","20 N",22),...wt(600,214,64,44,"b","25 N",22),
   ...brk(100,400,310,"0,3 m","o",22),...brk(300,400,355,"0,1 m","o",22),...brk(400,600,310,"0,2 m","b",22),
   A.tx("vänster: 10 · 0,3 + 20 · 0,1 = 5 Nm",400,430,28,"o"),A.tx("höger: 25 · 0,2 = 5 Nm",400,470,28,"b")]},
 {say:t3("Kom ihåg: en hävstång vrids kring en stödpunkt. Hävarmen är avståndet från stödpunkten till kraften. Moment är kraft gånger hävarm. Hävstången är i balans när momenten är lika stora på båda sidor. Med en lång hävarm räcker en liten kraft.",
   "Remember: a lever turns around a fulcrum. The lever arm is the distance from the fulcrum to the force. Moment is force times lever arm. The lever is balanced when the moments are equal on both sides. With a long lever arm a small force is enough.",
   "تذكّر: تدور الرافعة حول نقطة ارتكاز. ذراع القوة هو المسافة من نقطة الارتكاز إلى القوة. العزم هو القوة مضروبة في الذراع. تكون الرافعة متّزنة عندما يتساوى العزمان على الجانبين. ومع ذراع طويلة تكفي قوة صغيرة."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["stödpunkt: där stången vrids","k"],["hävarm: avstånd stödpunkt → kraft","o"],["moment = kraft · hävarm (Nm)","b"],["balans: F1 · l1 = F2 · l2","r"],["lång hävarm → liten kraft","g"]],70,150,62,32)]},
]};
const PIC11={
 point:()=>[beam(40,260,380,260),...fulcrum(150,264,"k",50),...blk(50,210,60,46,"o"),F(360,170,360,252,"r",6),A.tx("A",80,196,32,"k"),A.tx("B",150,354,32,"k"),A.tx("C",360,156,32,"k")],
 seesaw:()=>[...fulcrum(200,340,"k",60),beam(40,336,370,336),...blk(85,276,70,56,"b","40 kg",20),...blk(330,286,60,46,"g","20 kg",17),...brk(120,200,430,"1 m","b",22),...brk(200,360,430,"2 m","g",22)],
 lev:()=>[beam(30,300,370,300),...fulcrum(160,304,"k",50),F(40,200,40,294,"o",6),A.tx("300 N",44,186,24,"o"),F(340,200,340,294,"r",6),A.tx("F = ?",340,186,26,"r"),...brk(40,160,400,"0,4 m","o",22),...brk(160,340,400,"0,6 m","r",22)],
};
const BANK11=[
 {lv:0,q:"Vad kallas punkten som en hävstång vrids kring?",a:"stödpunkt",w:["tyngdpunkt","hävarm","moment"]},
 {lv:0,q:"Vad är hävarmen?",a:"avståndet från stödpunkten till kraften",w:["kraftens storlek","hela stångens längd","stångens tyngd"]},
 {lv:0,q:"Vilken bokstav visar stödpunkten?",a:"B",w:["A","C","ingen av dem"],lines:["Vilken bokstav","visar stödpunkten?"],pic:PIC11.point},
 {lv:0,q:"Var ska du trycka på ett spett för att det ska gå lättast?",a:"långt från stödpunkten",w:["nära stödpunkten","precis på stödpunkten","mitt på stenen"]},
 {lv:0,q:"Vilken grekisk forskare beskrev hävstången för över 2000 år sedan?",a:"Arkimedes",w:["Newton","Galilei","Huygens"]},
 {lv:1,q:"Hur räknar man ut ett moment?",a:"kraft · hävarm",w:["kraft / hävarm","kraft + hävarm","massa · fart"]},
 {lv:1,q:"Är gungbrädan i balans?",a:"ja, momenten är lika stora",w:["nej, vänster sida går ner","nej, höger sida går ner","det går inte att veta"],lines:["40 kg sitter 1 m och","20 kg sitter 2 m från","stödpunkten. Är gung-","brädan i balans?"],pic:PIC11.seesaw},
 {lv:1,q:"En kraft på 50 N verkar 2 m från stödpunkten. Hur stort är momentet?",a:"100 Nm",w:["25 Nm","52 Nm","100 N"]},
 {lv:1,q:"Vilken hävstång har stödpunkten i mitten?",a:"gungbräda",w:["skottkärra","pincett","underarm"]},
 {lv:1,q:"I vilket redskap sitter lasten mellan stödpunkten och kraften?",a:"skottkärra",w:["sax","gungbräda","pincett"]},
 {lv:1,q:"Skriv ordet: kraft · hävarm kallas …",a:["moment","momentet","vridmoment","kraftmoment"],lines:["Skriv ordet som saknas:","Kraften gånger","hävarmen kallas …"]},
 {lv:2,q:"Hur stor kraft F behövs för balans?",a:"200 N",w:["300 N","450 N","180 N"],lines:["Hur stor måste","kraften F vara för","att stången ska","vara i balans?"],pic:PIC11.lev},
 {lv:2,q:"En sten på 900 N ligger 0,1 m från stödpunkten. Du trycker 0,9 m från stödpunkten. Hur stor kraft behövs?",a:"100 N",w:["900 N","810 N","90 N"]},
 {lv:2,q:"Biceps fäster 4 cm från armbågen. Handen håller 20 N, 35 cm från armbågen. Hur stor kraft måste biceps ge?",a:"175 N",w:["20 N","35 N","700 N"]},
 {lv:2,q:"Till vänster hänger 10 N på 0,3 m och 20 N på 0,1 m. Var ska 25 N hänga till höger för balans?",a:"0,2 m",w:["0,4 m","1,2 m","0,1 m"]},
 {lv:2,q:"Varför är det lättare att öppna en dörr om du trycker långt från gångjärnen?",a:"hävarmen blir längre, så det behövs mindre kraft",w:["dörren blir lättare där","friktionen försvinner","tyngdkraften blir mindre där"]},
 {lv:2,q:"Pappa (800 N) sitter 1,5 m från stödpunkten. Hur långt bort ska barnet (400 N) sitta? Skriv i meter.",a:["3","3 m","3m","3 meter"],lines:["Skriv svaret i meter:","Pappa (800 N) sitter 1,5 m","från stödpunkten. Var ska","barnet (400 N) sitta?"]},
];
LESSONS.push({id:"f7k11",subject:"science",grades:"7",kind:"wb",year:7,ord:31,
 title:t3("Lär mer: Hävstång – en enkel maskin","Learn more: The lever – a simple machine","تعلّم المزيد: الرافعة – آلة بسيطة"),
 icon:IC(`<path d="M160 110L135 160H185Z" fill="#dfe3ea" stroke="#1d2433" stroke-width="4"/><path d="M40 118L280 102" stroke="#8a5a2b" stroke-width="8" stroke-linecap="round"/><rect x="50" y="70" width="40" height="44" fill="#fbe7cc" stroke="#e07b00" stroke-width="4"/><path d="M260 30V90M250 78L260 92L270 78" stroke="#d63b2f" stroke-width="6" fill="none" stroke-linecap="round"/>`),
 steps:F7K11.steps,mount:wbMount(F7K11),gen:bankGen(BANK11)});
WORDS.f7k11=["f7k_stodpunkt","f7k_havarm","f7k_moment","f7k_havregel","f7k_havstang"];

/* ---------------------------------------------------------------
   12. f7k12 (Lär mer): centralrörelse – kraft in mot mitten, tangent, karusell, månen, kurvor, F = m · v² / r
   --------------------------------------------------------------- */
TERM("f7k_centralrorelse",{sv:"centralrörelse",m:W("centralrörelse(n|r)?"),d:t3("Rörelse i en cirkel runt en mittpunkt. Det krävs en kraft riktad in mot mitten.","Motion in a circle around a centre. It needs a force directed towards the centre.","حركة في دائرة حول نقطة مركزية، وتحتاج إلى قوة متّجهة نحو المركز."),ex:"Månen gör en centralrörelse runt jorden.",tr:{en:"circular motion",ar:"الحركة الدائرية"}});
TERM("f7k_centripetal",{sv:"centripetalkraft",m:W("centripetalkraft(en)?"),d:t3("Kraften som pekar in mot cirkelns mitt och håller kvar föremålet i cirkelbanan.","The force that points towards the centre of the circle and keeps the object in its circular path.","القوة المتّجهة نحو مركز الدائرة والتي تُبقي الجسم في مساره الدائري."),ex:"Snöret ger bollen en centripetalkraft.",tr:{en:"centripetal force",ar:"القوة الجاذبة المركزية"}});
TERM("f7k_bana",{sv:"bana",m:W("bana(n)?"),d:t3("Vägen som ett föremål rör sig längs, till exempel en cirkel runt jorden.","The path an object moves along, for example a circle around the Earth.","الطريق الذي يتحرّك عليه الجسم، مثل دائرة حول الأرض."),ex:"Satelliten går i en bana runt jorden.",tr:{en:"orbit, path",ar:"المدار، المسار"}});
TERM("f7k_omloppstid",{sv:"omloppstid",m:W("omloppstid(en)?"),d:t3("Tiden det tar att gå ett helt varv i banan.","The time it takes to go one whole lap of the orbit.","الزمن اللازم لإكمال دورة كاملة في المدار."),ex:"Månens omloppstid är ungefär 27 dygn.",tr:{en:"orbital period",ar:"زمن الدورة"}});
TERM("f7k_tangent",{sv:"tangent",m:W("tangent(en|er)?"),d:t3("En rak linje som nuddar en cirkel i en enda punkt.","A straight line that touches a circle at a single point.","خط مستقيم يمسّ الدائرة في نقطة واحدة."),ex:"Bollen flyger iväg längs en tangent.",tr:{en:"tangent",ar:"المماس"}});
const F7K12={steps:[
 {say:t3("Snurra en boll i ett snöre runt handen. Bollen rör sig i en cirkel. Det kallas centralrörelse. Bollens fart kan vara densamma hela tiden, men riktningen ändras hela tiden. Enligt Newtons första lag behövs då en kraft. Varifrån kommer den?",
   "Whirl a ball on a string around your hand. The ball moves in a circle. This is called circular motion. The ball's speed can stay the same, but its direction changes all the time. According to Newton's first law a force is then needed. Where does it come from?",
   "أدِر كرة مربوطة بخيط حول يدك فتتحرّك في دائرة، وهذا يسمّى الحركة الدائرية. قد تبقى سرعة الكرة ثابتة، لكن اتجاهها يتغيّر باستمرار. وحسب قانون نيوتن الأول يلزم عندها وجود قوة. فمن أين تأتي؟"),
  draw:()=>[A.wipe(),ttl("Centralrörelse"),A.p(R.circ(400,280,140),"b",2),whirl(400,280,140,2.4,"o"),dot(400,280,"k",9),A.tx("Vad håller bollen kvar i cirkeln?",400,478,30,"v")]},
 {say:t3("Kraften kommer från snöret. Snöret drar hela tiden bollen in mot cirkelns mitt. En sådan kraft kallas centripetalkraft. Bollens rörelse pekar däremot längs banan, vinkelrätt mot snöret. Kraften ändrar inte farten, bara riktningen.",
   "The force comes from the string. The string pulls the ball towards the centre of the circle all the time. Such a force is called a centripetal force. The ball's motion, however, points along the path, at right angles to the string. The force does not change the speed, only the direction.",
   "تأتي القوة من الخيط، فهو يشدّ الكرة باستمرار نحو مركز الدائرة، وتسمّى هذه القوة القوة الجاذبة المركزية. أما حركة الكرة فتتّجه على طول المسار، عموديًّا على الخيط. القوة لا تغيّر مقدار السرعة بل اتجاهها فقط."),
  draw:()=>{const cx=290,cy=285,r=150,o=[A.wipe(),ttl("Kraft in mot mitten"),A.p(R.circ(cx,cy,r),"k",2),dot(cx,cy,"k",7)];
   [[1,0,0,-1],[0,-1,-1,0],[-1,0,0,1],[0,1,1,0]].forEach(([ux,uy,vx,vy])=>{const bx=cx+ux*r,by=cy+uy*r;
    o.push(A.p(R.line(cx,cy,bx-ux*14,by-uy*14,.2),"k",2),...ball(bx,by,14,"o"),F(bx-ux*16,by-uy*16,bx-ux*84,by-uy*84,"r",5),F(bx+vx*16,by+vy*16,bx+vx*92,by+vy*92,"g",5))});
   return[...o,A.tx("röd: kraften från snöret",500,200,26,"r","start"),A.tx("→ in mot mitten",500,235,26,"r","start"),A.tx("grön: rörelsens riktning",500,300,26,"g","start"),A.tx("→ längs banan",500,335,26,"g","start")]}},
 {say:t3("Vad händer om snöret går av? Då försvinner kraften in mot mitten. Enligt första lagen fortsätter bollen rakt fram i den riktning den hade just då. Den flyger iväg längs en tangent till cirkeln, alltså inte rakt ut från mitten.",
   "What happens if the string breaks? Then the force towards the centre disappears. According to the first law the ball continues straight ahead in the direction it had at that moment. It flies off along a tangent to the circle, not straight out from the centre.",
   "ماذا يحدث إذا انقطع الخيط؟ تختفي القوة المتّجهة نحو المركز، وحسب القانون الأول تستمر الكرة في خط مستقيم في الاتجاه الذي كانت فيه لحظتها. فتطير على طول مماس للدائرة، وليس مبتعدة مباشرة عن المركز."),
  draw:()=>{const cx=240,cy=310,r=130,px=cx+r*.7071,py=cy-r*.7071;
   return[A.wipe(),ttl("Om snöret går av"),A.p(R.circ(cx,cy,r),"k",2),dot(cx,cy,"k",7),A.p(R.line(cx,cy,cx+46,cy-46,.2),"k",2.5),A.p(`M${cx+42},${cy-52}L${cx+50},${cy-40}`,"k",2.5),
    ...ball(R5(px),R5(py),14,"o"),dash(R5(px+12),R5(py+12),580,466,"g",3),...ball(R5(px+120),R5(py+120),14,"g"),...ball(R5(px+220),R5(py+220),14,"g"),
    A.tx("rätt: rakt fram",480,300,28,"g","start"),A.tx("längs tangenten",480,334,28,"g","start"),
    dash(R5(px+12),R5(py-12),420,130,"r",3),CROSS(436,116,"r"),A.tx("fel: rakt ut",462,124,28,"r","start")]}},
 {say:t3("I en kedjekarusell känns det som att något slungar dig utåt. Egentligen vill din kropp bara fortsätta rakt fram. Kedjorna drar dig hela tiden snett inåt och tvingar dig att svänga. Ju fortare karusellen snurrar, desto större kraft behövs och desto mer lutar kedjorna.",
   "In a chain carousel it feels as if something throws you outwards. In fact your body just wants to continue straight ahead. The chains keep pulling you diagonally inwards and force you to turn. The faster the carousel spins, the bigger the force needed and the more the chains lean.",
   "في الأرجوحة الدوّارة ذات السلاسل تشعر كأن شيئًا يقذفك إلى الخارج، لكن جسمك في الحقيقة يريد فقط أن يستمر في خط مستقيم. تشدّك السلاسل باستمرار بشكل مائل نحو الداخل فتجبرك على الدوران. كلما دارت أسرع لزمت قوة أكبر ومالت السلاسل أكثر."),
  draw:()=>[A.wipe(),ttl("Kedjekarusellen"),gnd(40,760,440),A.p("M400,440V140","k",8),A.hatch("M250,172L400,118L550,172Z","r"),A.p("M250,172L400,118L550,172Z","r",4),
   A.p("M280,172L196,318M520,172L604,318","k",2.5),...ball(190,330,16,"b"),...ball(610,330,16,"b"),F(204,302,236,244,"r",5),F(596,302,564,244,"r",5),
   A.tx("fortare →",690,210,26,"o"),A.tx("mer lutning",690,244,26,"o"),A.tx("kedjorna drar in mot mitten",400,484,28,"r")]},
 {say:t3("Månen går runt jorden i en nästan cirkelformad bana. Ett varv tar ungefär 27 dygn. Här finns inget snöre. I stället är det jordens tyngdkraft som drar månen in mot jorden och håller kvar den i banan. Samma sak gäller satelliter och rymdstationen ISS.",
   "The Moon goes around the Earth in an almost circular orbit. One lap takes about 27 days. There is no string here. Instead it is the Earth's gravity that pulls the Moon towards the Earth and keeps it in its orbit. The same goes for satellites and the space station ISS.",
   "يدور القمر حول الأرض في مدار شبه دائري، وتستغرق الدورة نحو 27 يومًا. لا يوجد خيط هنا، بل جاذبية الأرض هي التي تشدّ القمر نحوها وتُبقيه في مداره. وينطبق الشيء نفسه على الأقمار الصناعية ومحطة الفضاء ISS."),
  draw:()=>[A.wipe(),ttl("Månen och jorden"),A.p(R.circ(330,285,180),"k",2),...earth(330,285,60),...moon(510,285,24),F(484,285,404,285,"r",6),A.tx("tyngdkraft",444,314,24,"r"),
   F(510,259,510,180,"g",5),A.tx("ett varv ≈ 27 dygn",570,200,26,"k","start"),A.tx("tyngdkraften drar",570,290,26,"r","start"),A.tx("in mot jorden",570,324,26,"r","start")]},
 {say:t3("När en bil kör genom en kurva är det friktionen mellan däcken och vägen som ger kraften in mot kurvans mitt. På is är friktionen mycket liten. Då räcker inte kraften, och bilen fortsätter nästan rakt fram, ut ur kurvan. Sänk därför farten före kurvan.",
   "When a car drives through a bend, the friction between the tyres and the road gives the force towards the centre of the bend. On ice the friction is very small. Then the force is not enough, and the car continues almost straight ahead, out of the bend. So slow down before the bend.",
   "عندما تسير سيارة في منعطف، فإن الاحتكاك بين الإطارات والطريق هو الذي يعطي القوة نحو مركز المنعطف. على الجليد يكون الاحتكاك صغيرًا جدًّا فلا تكفي القوة، وتستمر السيارة تقريبًا في خط مستقيم خارج المنعطف. لذلك خفّف السرعة قبل المنعطف."),
  draw:()=>{const cx=140,cy=460,c=Math.SQRT1_2,px=cx+260*c,py=cy-260*c;
   return[A.wipe(),ttl("Bilen i kurvan"),A.p(`M${cx},${cy-300}A300,300 0 0 1 ${cx+300},${cy}M${cx},${cy-220}A220,220 0 0 1 ${cx+220},${cy}`,"k",4),
    A.hatch(rrect(R5(px),R5(py),62,32,45),"r"),A.p(rrect(R5(px),R5(py),62,32,45),"r",3.5),F(R5(px-16),R5(py+16),R5(px-64),R5(py+64),"r",5),A.tx("friktion",236,372,24,"r","end"),
    A.arrow(R5(px+28),R5(py+28),470,422,"b",0),A.tx("på is: bilen glider rakt fram",470,470,26,"b","start"),
    A.tx("torr väg: friktionen",480,180,26,"g","start"),A.tx("håller kvar bilen i kurvan",480,214,26,"g","start")]}},
 {say:t3("Hur stor kraft behövs? Den beror på massan m, farten v och radien r: F = m · v² / r. En bil på 1000 kg som kör 20 m/s i en kurva med radien 50 m behöver F = 1000 · 20² / 50 = 8000 N. Dubbelt så hög fart ger fyra gånger så stor kraft: 32 000 N.",
   "How big a force is needed? It depends on the mass m, the speed v and the radius r: F = m · v² / r. A car of 1000 kg driving at 20 m/s in a bend with radius 50 m needs F = 1000 · 20² / 50 = 8000 N. Twice the speed gives four times the force: 32 000 N.",
   "ما مقدار القوة اللازمة؟ يعتمد على الكتلة m والسرعة v ونصف القطر r: F = m · v² / r. سيارة كتلتها 1000 كغ تسير بسرعة 20 m/s في منعطف نصف قطره 50 م تحتاج F = 1000 · 20² / 50 = 8000 نيوتن. ومضاعفة السرعة تعطي قوة أكبر بأربع مرات: 32 000 نيوتن."),
  draw:()=>[A.wipe(),ttl("Hur stor kraft?"),A.tx("F = m · v² / r",400,160,60,"r"),A.hl(220,105,360,75),A.tx("m = massa (kg)    v = fart (m/s)    r = radie (m)",400,225,24,"k"),
   A.tx("m = 1000 kg, v = 20 m/s, r = 50 m",80,290,26,"k","start"),A.tx("F = 1000 · 20 · 20 / 50 = 8000 N",80,335,30,"g","start"),
   A.tx("dubbel fart, v = 40 m/s:",80,400,26,"b","start"),A.tx("F = 1000 · 40 · 40 / 50 = 32 000 N",80,445,30,"r","start")]},
 {say:t3("Vad kräver mer kraft? Dubbel massa ger dubbel kraft. Dubbel fart ger fyra gånger så stor kraft, eftersom farten står i kvadrat. Halva radien, alltså en snävare kurva, ger dubbel kraft. Därför är hög fart i snäva kurvor särskilt farligt.",
   "What needs more force? Double the mass gives double the force. Double the speed gives four times the force, because the speed is squared. Half the radius, that is a tighter bend, gives double the force. That is why high speed in tight bends is especially dangerous.",
   "ما الذي يحتاج إلى قوة أكبر؟ مضاعفة الكتلة تضاعف القوة. ومضاعفة السرعة تجعل القوة أكبر بأربع مرات لأن السرعة مربّعة. ونصف نصف القطر، أي منعطف أضيق، يضاعف القوة. لذلك تكون السرعة العالية في المنعطفات الضيّقة خطيرة جدًّا."),
  draw:()=>[A.wipe(),ttl("Vad kräver mer kraft?"),...[["dubbel massa","2 · kraften","b","g"],["dubbel fart","4 · kraften","b","r"],["halva radien","2 · kraften","b","o"]].flatMap(([a,b,c1,c2],i)=>
   [...blk(80,130+i*100,300,70,c1,a,28),F(400,165+i*100,470,165+i*100,"k",4),...blk(490,130+i*100,230,70,c2,b,28)]),A.tx("hög fart + snäv kurva = farligt",400,465,30,"r")]},
 {say:t3("Kom ihåg: för att något ska röra sig i en cirkel behövs en kraft in mot mitten. Snöret, friktionen eller tyngdkraften kan ge den. Försvinner kraften fortsätter föremålet rakt fram längs en tangent. Kraften ökar med massan, med farten i kvadrat och när radien minskar.",
   "Remember: for something to move in a circle a force towards the centre is needed. The string, friction or gravity can provide it. If the force disappears, the object continues straight ahead along a tangent. The force grows with the mass, with the speed squared, and when the radius gets smaller.",
   "تذكّر: لكي يتحرّك شيء في دائرة تلزم قوة نحو المركز، وقد يعطيها الخيط أو الاحتكاك أو الجاذبية. إذا اختفت القوة استمر الجسم في خط مستقيم على طول مماس. وتزداد القوة مع الكتلة ومع مربّع السرعة وعندما يصغر نصف القطر."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["centralrörelse: cirkel runt en mittpunkt","b"],["kraften pekar in mot mitten","r"],["utan kraft: rakt fram längs tangenten","g"],["månen: tyngdkraften, ca 27 dygn per varv","v"],["F = m · v² / r","o"]],60,150,62,30)]},
]};
const PIC12={
 arrows:()=>[A.p(R.circ(190,280,120),"k",2),dot(190,280,"k",6),A.p(R.line(190,280,296,280,.2),"k",2),...ball(310,280,14,"o"),
  F(310,264,310,180,"k",5),A.tx("A",332,200,30,"k"),F(294,280,236,280,"k",5),A.tx("B",256,262,30,"k"),F(326,280,388,280,"k",5),A.tx("C",370,262,30,"k")],
 ice:()=>[A.p("M20,157.5A280,280 0 0 1 374.5,220M50,209.5A220,220 0 0 1 328.5,258.6","k",3.5),A.hatch(rp(132,138,56,24),"r"),A.p(R.rect(132,138,56,24,.3),"r",3.5),
  dash(190,150,370,150,"b",3),A.tx("A",380,158,28,"b"),A.p("M190,151A250,250 0 0 1 336.8,223.2","g",3),A.tx("B",352,250,28,"g"),dash(190,144,320,96,"o",3),A.tx("C",334,100,28,"o"),A.tx("isig väg",160,330,26,"b")],
 formula:()=>[A.p(R.circ(170,270,110),"k",2),dot(170,270,"k",6),A.p(R.line(170,270,266,270,.2),"k",2),...ball(280,270,14,"o"),A.tx("r = 1 m",220,256,22,"k"),
  F(280,256,280,180,"g",5),A.tx("v = 4 m/s",294,200,22,"g","start"),A.tx("m = 0,5 kg",292,318,22,"o","start"),qm(170,440,"r",44)],
};
const BANK12=[
 {lv:0,q:"Åt vilket håll pekar kraften från snöret på en boll som snurrar?",a:"in mot mitten",w:["ut från mitten","framåt längs banan","rakt nedåt"]},
 {lv:0,q:"Vad kallas rörelse i en cirkel runt en mittpunkt?",a:"centralrörelse",w:["fritt fall","friktion","pendelrörelse"]},
 {lv:0,q:"Vad håller månen kvar i sin bana runt jorden?",a:"jordens tyngdkraft",w:["luftmotståndet","solvinden","friktion"]},
 {lv:0,q:"Vilken pil visar kraften från snöret på bollen?",a:"B",w:["A","C","ingen av dem"],lines:["Bollen snurrar i","ett snöre. Vilken pil","visar kraften från","snöret på bollen?"],pic:PIC12.arrows},
 {lv:0,q:"Ungefär hur lång tid tar ett varv för månen runt jorden?",a:"ca 27 dygn",w:["ca 1 dygn","ca 365 dygn","ca 7 dygn"]},
 {lv:1,q:"Snöret går av medan bollen snurrar. Hur flyger bollen?",a:"rakt fram längs en tangent",w:["rakt ut från mitten","vidare i cirkeln","rakt in mot mitten"]},
 {lv:1,q:"Vad ger bilen kraften in mot mitten när den kör genom en kurva?",a:"friktionen mellan däck och väg",w:["luftmotståndet","motorns ljud","tyngdkraften"]},
 {lv:1,q:"Bilen kör på is utan friktion. Vilken väg tar den?",a:"A",w:["B","C","bilen stannar"],lines:["Vägen är helt isig.","Vilken väg tar bilen","när den kommer","till kurvan?"],pic:PIC12.ice},
 {lv:1,q:"Du känner dig pressad utåt i en karusell. Vad händer egentligen?",a:"kroppen vill fortsätta rakt fram men dras inåt",w:["en kraft drar dig utåt","tyngdkraften försvinner","karusellen knuffar dig bakåt"]},
 {lv:1,q:"Farten i en kurva fördubblas. Hur ändras kraften som behövs?",a:"den blir 4 gånger så stor",w:["den blir 2 gånger så stor","den halveras","den ändras inte"]},
 {lv:1,q:"Skriv ordet: kraften som pekar in mot cirkelns mitt kallas …",a:["centripetalkraft","centripetalkraften","centralkraft","centralkraften"],lines:["Skriv ordet som saknas:","Kraften som pekar in","mot mitten kallas …"]},
 {lv:2,q:"Hur stor kraft behövs in mot mitten?",a:"8 N",w:["2 N","4 N","16 N"],lines:["Använd F = m · v² / r.","Hur stor kraft behövs","in mot mitten?"],pic:PIC12.formula},
 {lv:2,q:"En bil på 1000 kg kör 20 m/s i en kurva med radien 50 m. Hur stor kraft behövs in mot mitten?",a:"8000 N",w:["400 N","20 000 N","1000 N"]},
 {lv:2,q:"Samma bil kör 40 m/s i samma kurva. Hur stor kraft behövs nu?",a:"32 000 N",w:["16 000 N","8000 N","64 000 N"]},
 {lv:2,q:"Varför är snäva kurvor farligare än svaga i samma fart?",a:"en mindre radie kräver större kraft",w:["en mindre radie kräver mindre kraft","tyngdkraften är större där","farten ökar av sig själv"]},
 {lv:2,q:"En satellit går i bana runt jorden. Vad händer om jordens tyngdkraft plötsligt försvann?",a:"den flyger rakt fram längs en tangent",w:["den faller rakt ner","den stannar helt","den fortsätter i sin bana"]},
 {lv:2,q:"En boll på 2 kg snurrar med farten 3 m/s i en cirkel med radien 1 m. Skriv kraften i newton.",a:["18","18 n","18n","18 newton"],lines:["Skriv svaret i newton:","m = 2 kg, v = 3 m/s, r = 1 m.","Hur stor kraft behövs","in mot mitten?"]},
];
LESSONS.push({id:"f7k12",subject:"science",grades:"7",kind:"wb",year:7,ord:32,
 title:t3("Lär mer: Centralrörelse","Learn more: Circular motion","تعلّم المزيد: الحركة الدائرية"),
 icon:IC(`<circle cx="160" cy="90" r="62" fill="none" stroke="#1d2433" stroke-width="3" stroke-dasharray="8 8"/><circle cx="160" cy="90" r="6" fill="#1d2433"/><path d="M160 90L216 64" stroke="#1d2433" stroke-width="3"/><circle cx="216" cy="64" r="14" fill="#fbe7cc" stroke="#e07b00" stroke-width="4"/><path d="M200 70L176 82M186 72L174 83L190 86" stroke="#d63b2f" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M226 76L246 116M236 104L247 118L252 102" stroke="#1e9e5a" stroke-width="5" fill="none" stroke-linecap="round"/>`),
 steps:F7K12.steps,mount:wbMount(F7K12),gen:bankGen(BANK12)});
WORDS.f7k12=["f7k_centralrorelse","f7k_centripetal","f7k_bana","f7k_omloppstid","f7k_tangent"];
}

import {A,LESSONS,R,pick,rint,t3} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE · KOORDINATSYSTEM: axes and reading/placing points, the four
   quadrants with negative coordinates, distances and figures (with
   Pythagoras for a slanted distance), cheat sheet.
   ===================================================================== */
import {lines,qMount,fitT,P,rowC,rowW} from "./q-0kit.js";
{
const S=(sv,en,ar)=>t3(sv,en,ar);
const m=n=>String(n).replace("-","−");
const pt=(x,y)=>`(${m(x)}, ${m(y)})`;
const LT2=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:220});
const quick=a=>Object.assign(a,{dur:30});
const hintT=(sv,en,ar,draw=[])=>({say:S(sv,en,ar),draw});
const GRID="#c9d0dc";
const XY=[t3("x","x","x"),t3("y","y","y")];
const rowFit=(str,cx,y,s,c,max=330)=>{const it=P(str);while(rowW(it,s)>max&&s>16)s-=2;return rowC(it,cx,y,s,c).acts};

/* a coordinate plane: origin (ox,oy) in px, u px per step, from x0..x1 and y0..y1 */
function plane(ox,oy,u,x0,x1,y0,y1){const X=x=>ox+x*u,Y=y=>oy-y*u;let g="";
  for(let x=x0;x<=x1;x++)if(x)g+=R.line(X(x),Y(y0),X(x),Y(y1),.04);for(let y=y0;y<=y1;y++)if(y)g+=R.line(X(x0),Y(y),X(x1),Y(y),.04);
  const o=[A.p(g,GRID,1.6),A.arrow(X(x0),oy,X(x1)+22,oy,"k"),A.arrow(ox,Y(y0),ox,Y(y1)-22,"k"),quick(A.tx("x",X(x1)+24,oy+30,24,"k")),quick(A.tx("y",ox-22,Y(y1)-10,24,"k"))];
  for(let x=x0;x<=x1;x++)if(x)o.push(quick(A.tx(m(x),X(x),oy+24,17,"k")));
  for(let y=y0;y<=y1;y++)if(y)o.push(quick(A.tx(m(y),ox-9,Y(y)+6,17,"k","end")));
  o.push(quick(A.tx("0",ox-9,oy+22,17,"k","end")));return{o,X,Y,x1,y1}}
/* a point with its name (the name up and to the right) */
const dot=(pl,x,y,name,c="r",lab=true)=>{const px=pl.X(x),py=pl.Y(y);
  /* keep the name away from the axis names: near the top it goes below, near the right end (or next to the 0) it goes to the left */
  const corner=x===-1&&y===-1,top=y>=pl.y1-1||corner,right=x>=pl.x1-1&&Math.abs(y)<=1||corner;
  return[A.hatch(R.circ(px,py,8),c),A.p(R.circ(px,py,8),c,3),...(lab?[LT2(name,right?px-12:px+12,top?py+32:py-12,24,c,right?"end":"start")]:[])]};
const Q1=()=>plane(60,450,50,0,7,0,8);                 /* first quadrant: 0..7 × 0..8 */
const Q4=()=>plane(250,250,40,-5,5,-5,5);              /* four quadrants: −5..5 */
/* the text column at the right of a plane: lines from y, centred at cx */
const col=(rows,cx=640,y=110,gap=70,s=34)=>rows.flatMap((r,i)=>{const [t,c,ss]=typeof r==="string"?[r,"k",s]:[r[0],r[1],r[2]||s];return rowFit(t,cx,y+i*gap-ss*.36,ss,c,280)});
/* walk from the origin: along x first (red), then up or down along y (blue) */
const walk=(pl,x,y)=>[...(x?[A.arrow(pl.X(0),pl.Y(0),pl.X(x),pl.Y(0),"r")]:[]),...(y?[A.arrow(pl.X(x),pl.Y(0),pl.X(x),pl.Y(y),"b")]:[])];
const readQ=(pl,x,y,title)=>({kind:"pair",ans:[x,y],sep:",",labels:XY,signed:x<0||y<0||undefined,show:pt(x,y),
  q:[A.wipe(),...pl.o,...dot(pl,x,y,"P"),...col([title[0],title[1]],640,150,56,30)],
  sol:[A.wipe(),...pl.o,...walk(pl,x,y),...dot(pl,x,y,"P"),...col([[`x = ${m(x)}`,"r"],[`y = ${m(y)}`,"b"],[`P = ${pt(x,y)}`,"g"]],640,140,80,40)],
  hint:hintT("Gå först åt sidan längs x-axeln, sedan uppåt eller nedåt. x kommer först.","First go sideways along the x-axis, then up or down. x comes first.","تحرّك أولًا أفقيًا على محور x، ثم إلى أعلى أو أسفل. الإحداثي x يأتي أولًا.")});

/* ======================= drills ======================= */
function gRead(n){let x,y;
  if(n<3){do{x=rint(n===2?0:1,7);y=rint(n===2?0:1,7)}while(n===2&&x&&y);return readQ(Q1(),x,y,["Vilka koordinater","har punkten P?"])}
  if(n===3){do{x=rint(1,7);y=rint(1,7)}while(x===y);const opts=[pt(x,y),pt(y,x),pt(x+1,y)].filter((v,i,a)=>a.indexOf(v)===i);while(opts.length<3)opts.push(pt(x,y+1));
    const sh=[...opts].sort(()=>Math.random()-.5),pl=Q1();
    return{kind:"choice",opts:sh,ans:sh.indexOf(pt(x,y)),show:pt(x,y),q:[A.wipe(),...pl.o,...dot(pl,x,y,"P"),...col(["Vilka koordinater","har P?"],640,150,56,30)],
      sol:[A.wipe(),...pl.o,...walk(pl,x,y),...dot(pl,x,y,"P"),...col([[`P = ${pt(x,y)}`,"g"],"x först, sedan y"],640,160,80,40)],
      hint:hintT("Vilket tal kommer först? Det som visar hur långt åt sidan.","Which number comes first? The one for how far sideways.","أي عدد يأتي أولًا؟ الذي يدل على المسافة الأفقية.")}}
  x=rint(1,7);y=rint(1,7);const pl=Q1();
  return{kind:"pair",ans:[x,y],sep:",",labels:XY,show:pt(x,y),q:[A.wipe(),...pl.o,...col(["Gå "+x+" steg åt höger","och "+y+" steg uppåt.","Vilken punkt","kommer du till?"],640,110,56,30)],
    sol:[A.wipe(),...pl.o,...walk(pl,x,y),...dot(pl,x,y,"P","g"),...col([[`P = ${pt(x,y)}`,"g"]],640,200,80,40)],
    hint:hintT("Steg åt höger är x. Steg uppåt är y.","Steps right are x. Steps up are y.","الخطوات إلى اليمين هي x، والخطوات إلى أعلى هي y.")}}
const QN=["första","andra","tredje","fjärde"];
const quad=(x,y)=>x>0?(y>0?0:3):(y>0?1:2);
function gQuad(n){let x,y;
  if(n===4){do{x=rint(-9,9);y=rint(-9,9)}while(!x||!y);const k=quad(x,y),opts=QN.map(q=>q[0].toUpperCase()+q.slice(1));
    return{kind:"choice",opts,ans:k,show:opts[k],q:[A.wipe(),A.tx("I vilken kvadrant ligger punkten?",400,90,36,"b"),A.tx(pt(x,y),400,260,100)],
      sol:[A.wipe(),...quadBoard(),...col([[pt(x,y),"g"],`x ${x>0?"positiv":"negativ"}, y ${y>0?"positiv":"negativ"}`,`${QN[k]} kvadranten`],640,140,80,34)],
      hint:hintT("Titta på tecknen: är x plus eller minus? Är y plus eller minus?","Look at the signs: is x plus or minus? Is y plus or minus?","انظر إلى الإشارات: هل x موجب أم سالب؟ وهل y موجب أم سالب؟")}}
  const want=[1,2,3,1][n];do{x=rint(-4,4);y=rint(-4,4)}while(!x||!y||quad(x,y)!==want);return readQ(Q4(),x,y,["Vilka koordinater","har punkten P?"])}
function gDist(n){
  if(n<2){let a,b,c;if(n===0){c=rint(-4,4);a=rint(-5,0);b=rint(1,5);const pl=Q4(),d=b-a;
      return{kind:"num",ans:d,show:String(d),q:[A.wipe(),...pl.o,...dot(pl,a,c,"A"),...dot(pl,b,c,"B","b"),...col([`A = ${pt(a,c)}`,`B = ${pt(b,c)}`,"Hur långt är det","från A till B?"],640,110,56,30)],
        sol:[A.wipe(),...pl.o,A.p(R.line(pl.X(a),pl.Y(c),pl.X(b),pl.Y(c),.1),"g",5),...dot(pl,a,c,"A"),...dot(pl,b,c,"B","b"),...col(["samma y: räkna x-stegen",[`${m(b)} − (${m(a)}) = ${d}`,"g"]],640,160,80,32)],
        hint:hintT("Punkterna har samma y. Räkna stegen längs x, eller ta det största x minus det minsta.","The points have the same y. Count the steps along x, or take the bigger x minus the smaller.","للنقطتين الإحداثي y نفسه. عُدّ الخطوات على محور x، أو اطرح x الأصغر من الأكبر.")}}
    c=rint(-4,4);a=rint(-5,-1);b=rint(1,5);const pl=Q4(),d=b-a;
    return{kind:"num",ans:d,show:String(d),q:[A.wipe(),...pl.o,...dot(pl,c,a,"A"),...dot(pl,c,b,"B","b"),...col([`A = ${pt(c,a)}`,`B = ${pt(c,b)}`,"Hur långt är det","från A till B?"],640,110,56,30)],
      sol:[A.wipe(),...pl.o,A.p(R.line(pl.X(c),pl.Y(a),pl.X(c),pl.Y(b),.1),"g",5),...dot(pl,c,a,"A"),...dot(pl,c,b,"B","b"),...col(["samma x: räkna y-stegen",[`${m(b)} − (${m(a)}) = ${d}`,"g"]],640,160,80,32)],
      hint:hintT("Punkterna har samma x. Räkna stegen längs y. Glöm inte stegen under noll.","The points have the same x. Count the steps along y. Don't forget the steps below zero.","للنقطتين الإحداثي x نفسه. عُدّ الخطوات على محور y، ولا تنسَ الخطوات تحت الصفر.")}}
  if(n<4){const x0=rint(-5,-1),x1=rint(1,5),y0=rint(-5,-1),y1=rint(1,5),w=x1-x0,h=y1-y0,area=n===2,ans=area?w*h:2*(w+h),pl=Q4();
    const C=[[x0,y0,"A"],[x1,y0,"B"],[x1,y1,"C"],[x0,y1,"D"]],rect=A.p(R.rect(pl.X(x0),pl.Y(y1),w*40,h*40,.2),"g",4);
    return{kind:"num",ans,show:String(ans),q:[A.wipe(),...pl.o,rect,...C.flatMap(([x,y,nm])=>dot(pl,x,y,nm,"g")),...col(["Rektangeln ABCD.",`A = ${pt(x0,y0)}`,`C = ${pt(x1,y1)}`,area?"Vilken area har den?":"Vilken omkrets har den?"],640,110,56,28)],
      sol:[A.wipe(),...pl.o,rect,...C.flatMap(([x,y,nm])=>dot(pl,x,y,nm,"g")),...col([`bredd: ${m(x1)} − (${m(x0)}) = ${w}`,`höjd: ${m(y1)} − (${m(y0)}) = ${h}`,[area?`${w} · ${h} = ${ans}`:`2 · (${w} + ${h}) = ${ans}`,"g"]],640,140,80,28)],
      hint:hintT("Räkna först bredden och höjden i rutor.","First count the width and the height in squares.","احسب أولًا العرض والارتفاع بالمربعات.")}}
  const [a,b,c]=pick([[3,4,5],[4,3,5],[6,8,10],[8,6,10]]),k=a>5?.5:1,pl=plane(80,440,a>5?36:60,0,a>5?9:6,0,a>5?10:6);
  return{kind:"num",ans:c,show:String(c),q:[A.wipe(),...pl.o,A.p(R.line(pl.X(0),pl.Y(0),pl.X(a),pl.Y(b),.1),"g",4),...dot(pl,0,0,"O","b",false),...dot(pl,a,b,"A"),...col([`O = (0, 0)`,`A = ${pt(a,b)}`,"Hur långt är det","från O till A?"],640,110,56,30)],
    sol:[A.wipe(),...pl.o,A.p(R.line(pl.X(0),pl.Y(0),pl.X(a),pl.Y(0),.1)+R.line(pl.X(a),pl.Y(0),pl.X(a),pl.Y(b),.1),"o",4),A.p(R.line(pl.X(0),pl.Y(0),pl.X(a),pl.Y(b),.1),"g",4),...dot(pl,a,b,"A"),
      ...col([`${a}^2 + ${b}^2 = ${a*a+b*b}`,[`√{${a*a+b*b}} = ${c}`,"g"]],640,170,80,34)],
    hint:hintT(`Rita en rätvinklig triangel. Kateterna är ${a} och ${b}. Använd Pythagoras sats.`,`Draw a right triangle. The legs are ${a} and ${b}. Use Pythagoras' theorem.`,`ارسم مثلثًا قائمًا ضلعاه القائمان ${a} و${b}، واستخدم مبرهنة فيثاغورس.`)}}

/* the four quadrants with their signs */
function quadBoard(){const pl=Q4(),o=[...pl.o],lab=[["I  (+, +)",3,3,"b"],["II  (−, +)",-3,3,"v"],["III  (−, −)",-3,-3,"o"],["IV  (+, −)",3,-3,"g"]];
  lab.forEach(([t,x,y,c])=>o.push(LT2(t,pl.X(x),pl.Y(y)+8,22,c)));return o}

/* ======================= the boards ======================= */
const steps=[],parts=[];const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};
const pboard=(x,y,name,c="r")=>{const pl=Q1();return[A.wipe(),...pl.o,...walk(pl,x,y),...dot(pl,x,y,name,c),...col([[`${name} = ${pt(x,y)}`,c,42],[`x = ${x}`,"r"],[`y = ${y}`,"b"]],640,150,80)]};

part("📍",S("Punkter","Points","النقاط"),[
 {say:S("Ett koordinatsystem har två axlar. x-axeln går åt sidan och y-axeln går uppåt. De möts i origo, punkten (0, 0). Varje punkt har två koordinater: först x, sedan y.",
   "A coordinate system has two axes. The x-axis goes sideways and the y-axis goes up. They meet at the origin, the point (0, 0). Every point has two coordinates: first x, then y.",
   "لنظام الإحداثيات محوران: محور x أفقي ومحور y رأسي، ويلتقيان في نقطة الأصل (0, 0). لكل نقطة إحداثيان: x أولًا ثم y."),
  draw:()=>{const pl=Q1();return[A.wipe(),...pl.o,A.p(R.circ(pl.X(0),pl.Y(0),12),"g",4),LT2("origo (0, 0)",pl.X(0)+20,pl.Y(0)-18,22,"g","start"),...col([["x-axeln: åt sidan","r"],["y-axeln: uppåt","b"],["först x, sedan y","k"]],640,150,80,30)]}},
 {say:S("Punkten A har koordinaterna (3, 5). Gå 3 steg åt höger längs x-axeln, sedan 5 steg uppåt. Tänk: först korridoren, sedan trappan.",
   "Point A has the coordinates (3, 5). Walk 3 steps right along the x-axis, then 5 steps up. Think: first the corridor, then the stairs.",
   "النقطة A إحداثياها (3, 5): تحرّك 3 خطوات إلى اليمين على محور x، ثم 5 خطوات إلى أعلى. فكّر: الممر أولًا ثم الدرج."),
  draw:()=>[...pboard(3,5,"A"),LT2("först korridoren, sedan trappan",640,430,22,"o")]},
 {say:S("Exempel 1: B ligger 6 steg åt höger och 2 steg upp. B = (6, 2).","Example 1: B is 6 steps right and 2 steps up. B = (6, 2).","مثال 1: النقطة B على بعد 6 خطوات يمينًا وخطوتين إلى أعلى: B = (6, 2)."),draw:()=>pboard(6,2,"B","b")},
 {say:S("Exempel 2: C ligger på y-axeln, 4 steg upp. Inga steg åt sidan, så x = 0. C = (0, 4).","Example 2: C is on the y-axis, 4 steps up. No steps sideways, so x = 0. C = (0, 4).","مثال 2: النقطة C على محور y بارتفاع 4 خطوات، ولا خطوات أفقية، إذن x = 0 وC = (0, 4)."),draw:()=>pboard(0,4,"C","g")},
 {say:S("Exempel 3: D ligger på x-axeln, 5 steg åt höger. Inga steg uppåt, så y = 0. D = (5, 0).","Example 3: D is on the x-axis, 5 steps right. No steps up, so y = 0. D = (5, 0).","مثال 3: النقطة D على محور x على بعد 5 خطوات، ولا خطوات إلى أعلى، إذن y = 0 وD = (5, 0)."),draw:()=>pboard(5,0,"D","v")},
 {say:S("Exempel 4: blanda inte ihop dem! (2, 6) och (6, 2) är olika punkter.","Example 4: don't mix them up! (2, 6) and (6, 2) are different points.","مثال 4: لا تخلط بينهما! (2, 6) و(6, 2) نقطتان مختلفتان."),
  draw:()=>{const pl=Q1();return[A.wipe(),...pl.o,...walk(pl,2,6),...dot(pl,2,6,"E","b"),...dot(pl,6,2,"F","r"),...col([["E = (2, 6)","b",40],["F = (6, 2)","r",40],"olika punkter!"],640,150,80)]}},
 {drill:{gen:gRead,n:5,intro:S("Din tur! Läs av punkter.","Your turn! Read points.","دورك! اقرأ إحداثيات النقاط.")}},
]);
part("➕",S("Fyra kvadranter","Four quadrants","الأرباع الأربعة"),[
 {say:S("Axlarna fortsätter åt vänster och nedåt med negativa tal. Då får vi fyra kvadranter. Tecknen visar var punkten ligger.",
   "The axes continue left and down with negative numbers. Then we get four quadrants. The signs show where the point is.",
   "يمتد المحوران إلى اليسار وإلى أسفل بأعداد سالبة، فنحصل على أربعة أرباع. والإشارات تدل على موقع النقطة."),
  draw:()=>[A.wipe(),...quadBoard(),...col([["vänster: x negativ","r"],["nedåt: y negativ","b"],"I, II, III, IV","moturs från höger uppe"],640,130,70,28)]},
 {say:S("Exempel 1: P = (−3, 2). Gå 3 steg åt vänster, sedan 2 steg upp.","Example 1: P = (−3, 2). Walk 3 steps left, then 2 steps up.","مثال 1: P = (−3, 2): ثلاث خطوات إلى اليسار ثم خطوتان إلى أعلى."),
  draw:()=>{const pl=Q4();return[A.wipe(),...pl.o,...walk(pl,-3,2),...dot(pl,-3,2,"P"),...col([[`P = ${pt(-3,2)}`,"r",40],"3 steg åt vänster","2 steg upp"],640,150,80)]}},
 {say:S("Exempel 2: Q = (2, −4). Gå 2 steg åt höger, sedan 4 steg ner.","Example 2: Q = (2, −4). Walk 2 steps right, then 4 steps down.","مثال 2: Q = (2, −4): خطوتان إلى اليمين ثم 4 خطوات إلى أسفل."),
  draw:()=>{const pl=Q4();return[A.wipe(),...pl.o,...walk(pl,2,-4),...dot(pl,2,-4,"Q","g"),...col([[`Q = ${pt(2,-4)}`,"g",40],"2 steg åt höger","4 steg ner"],640,150,80)]}},
 {say:S("Exempel 3: R = (−4, −1). Båda är negativa: vänster och ner. R ligger i tredje kvadranten.","Example 3: R = (−4, −1). Both are negative: left and down. R is in the third quadrant.","مثال 3: R = (−4, −1): كلاهما سالب، يسارًا وإلى أسفل، فتقع R في الربع الثالث."),
  draw:()=>{const pl=Q4();return[A.wipe(),...pl.o,...walk(pl,-4,-1),...dot(pl,-4,-1,"R","v"),...col([[`R = ${pt(-4,-1)}`,"v",40],"vänster och ner","tredje kvadranten"],640,150,80)]}},
 {drill:{gen:gQuad,n:5,intro:S("Din tur! Punkter i alla fyra kvadranter.","Your turn! Points in all four quadrants.","دورك! نقاط في الأرباع الأربعة.")}},
]);
part("📏",S("Avstånd och figurer","Distance and shapes","المسافات والأشكال"),[
 {say:S("Har två punkter samma y, ligger de på en vågrät linje. Avståndet är skillnaden mellan x: A = (−2, 3) och B = (4, 3) ger 4 − (−2) = 6.",
   "If two points have the same y, they lie on a horizontal line. The distance is the difference in x: A = (−2, 3) and B = (4, 3) give 4 − (−2) = 6.",
   "إذا كان للنقطتين الإحداثي y نفسه فهما على خط أفقي، والمسافة هي الفرق بين x: النقطتان A = (−2, 3) وB = (4, 3) تعطيان 4 − (−2) = 6."),
  draw:()=>{const pl=Q4();return[A.wipe(),...pl.o,A.p(R.line(pl.X(-2),pl.Y(3),pl.X(4),pl.Y(3),.1),"g",5),...dot(pl,-2,3,"A"),...dot(pl,4,3,"B","b"),...col(["samma y = 3","räkna x-stegen",["4 − (−2) = 6","g",40]],640,150,80)]}},
 {say:S("Exempel 1: en rektangel har hörnen (−3, −2), (3, −2), (3, 2) och (−3, 2). Bredden är 6, höjden 4. Arean är 6 · 4 = 24.",
   "Example 1: a rectangle has corners (−3, −2), (3, −2), (3, 2) and (−3, 2). The width is 6, the height 4. The area is 6 × 4 = 24.",
   "مثال 1: مستطيل رؤوسه (−3, −2) و(3, −2) و(3, 2) و(−3, 2). العرض 6 والارتفاع 4، والمساحة 6 × 4 = 24."),
  draw:()=>{const pl=Q4();return[A.wipe(),...pl.o,A.hatch(`M${pl.X(-3)},${pl.Y(2)}h240v160h-240Z`,"g"),A.p(R.rect(pl.X(-3),pl.Y(2),240,160,.2),"g",4),...col(["bredd: 3 − (−3) = 6","höjd: 2 − (−2) = 4",["area: 6 · 4 = 24","g",36]],640,150,80,28)]}},
 {say:S("Exempel 2: avståndet från A = (−1, −4) till B = (−1, 3). Samma x, så räkna y: 3 − (−4) = 7.","Example 2: the distance from A = (−1, −4) to B = (−1, 3). Same x, so count y: 3 − (−4) = 7.","مثال 2: المسافة من A = (−1, −4) إلى B = (−1, 3): x نفسه، فنحسب y: 3 − (−4) = 7."),
  draw:()=>{const pl=Q4();return[A.wipe(),...pl.o,A.p(R.line(pl.X(-1),pl.Y(-4),pl.X(-1),pl.Y(3),.1),"g",5),...dot(pl,-1,-4,"A"),...dot(pl,-1,3,"B","b"),...col(["samma x = −1","räkna y-stegen",["3 − (−4) = 7","g",40]],640,150,80)]}},
 {say:S("Exempel 3: från origo till A = (3, 4) går en sned sträcka. Rita en rätvinklig triangel med kateterna 3 och 4. Pythagoras: 3² + 4² = 25, och √25 = 5.",
   "Example 3: from the origin to A = (3, 4) there is a slanted line. Draw a right triangle with legs 3 and 4. Pythagoras: 3² + 4² = 25, and √25 = 5.",
   "مثال 3: من نقطة الأصل إلى A = (3, 4) قطعة مائلة. ارسم مثلثًا قائمًا ضلعاه 3 و4. فيثاغورس: 3² + 4² = 25، و√25 = 5."),
  draw:()=>{const pl=plane(80,440,60,0,6,0,6);return[A.wipe(),...pl.o,A.p(R.line(pl.X(0),pl.Y(0),pl.X(3),pl.Y(0),.1),"r",4),A.p(R.line(pl.X(3),pl.Y(0),pl.X(3),pl.Y(4),.1),"b",4),A.p(R.line(pl.X(0),pl.Y(0),pl.X(3),pl.Y(4),.1),"g",5),
   LT2("3",pl.X(1.5),pl.Y(0)-10,26,"r"),LT2("4",pl.X(3)+20,pl.Y(2),26,"b","start"),...dot(pl,3,4,"A"),...col(["3^2 + 4^2 = 9 + 16 = 25",["√{25} = 5","g",44],"Pythagoras sats"],640,150,90,32)]}},
 {drill:{gen:gDist,n:5,intro:S("Din tur! Räkna avstånd och figurer.","Your turn! Work out distances and shapes.","دورك! احسب المسافات والأشكال.")}},
]);
const card=(x,y,c,head,line,rule)=>[A.band(x,y,360,222,c),A.tx(head,x+180,y+40,28,c),...rowFit(line,x+180,y+112,36,"k",330),A.tx(rule,x+180,y+195,fitT(rule,330,24),"k")];
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 {say:S("Allt om koordinatsystemet på en tavla.","Everything about the coordinate system on one board.","كل شيء عن نظام الإحداثيات على لوحة واحدة."),
  draw:()=>[A.wipe(),...card(30,16,"r","Punkt","(x, y) = (3, 5)","först åt sidan, sedan upp"),...card(410,16,"b","Kvadranter","I (+, +) och II (−, +)","III (−, −) och IV (+, −)"),
   ...card(30,262,"g","Avstånd","4 − (−2) = 6","samma y: räkna x, samma x: räkna y"),...card(410,262,"o","Sned sträcka","3^2 + 4^2 = 5^2","Pythagoras: rita en triangel")]},
]);

LESSONS.push({id:"qkoord",subject:"quick",grades:"6–9",kind:"wb",
 title:t3("Koordinatsystem: allt på ett ställe","Coordinates: everything in one place","نظام الإحداثيات: كل شيء في مكان واحد"),icon:"",
 steps,parts,mount:qMount({steps})});
}

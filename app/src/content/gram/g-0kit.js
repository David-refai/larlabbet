import {A,LESSONS,R,rint,t3} from "../../legacy/core.js";
/* =====================================================================
   ENGELSK GRAMMATIK · the kit. A topic is one lesson in parts (units).
   Every unit: the rule (form table + a key sentence), when we use it
   (a timeline for tenses, or a comparison), examples with the grammar
   in colour, then 5 questions from easy to hard. The last part lists
   all key sentences of the topic, to learn by heart.
   Markup in board text: {form} red (the grammar point), [word] blue
   (a signal word such as "every day", "yesterday", "since").
   ===================================================================== */
import {qMount,fitT} from "../snabb/q-0kit.js";

export const S=t3;
const T3=a=>Array.isArray(a)?t3(a[0],a[1],a[2]):a;

/* "She {works} [every day]." -> plain text and coloured spans */
export function spans(str,cf="r",cs="b"){const out=[];let plain="";String(str).split(/(\{[^}]*\}|\[[^\]]*\])/).forEach(t=>{if(!t)return;
  const k=t[0]==="{"?cf:t[0]==="["?cs:null,s=k?t.slice(1,-1):t;plain+=s;out.push(k?{s,c:k}:{s})});return{plain,spans:out}}
/* a line of board text with markup, shrunk to fit max px */
export const ln=(str,x,y,size,c="k",anchor="middle",max=700,o={})=>{const sp=spans(str,o.cf,o.cs),s=Math.min(size,fitT(sp.plain,max,size));
  return Object.assign(A.tx(sp.plain,x,y,s,c,anchor),{spans:sp.spans,dur:o.dur||Math.max(300,Math.min(900,sp.plain.length*28))})};

/* the same, on two lines when one line would get too small: split at the space nearest the middle (never inside {} or []) */
export function ln2(str,x,y,size,c="k",anchor="middle",max=700,o={}){const sp=spans(str),force=o.split;o=Object.assign({},o);delete o.split;if(!force&&fitT(sp.plain,max,size)>=size*.8)return[ln(str,x,y,size,c,anchor,max,o)];
  let depth=0,best=-1,dbl=-1;const mid=str.length/2,near=(i,b)=>b<0||Math.abs(i-mid)<Math.abs(b-mid);[...str].forEach((ch,i)=>{if(ch==="{"||ch==="[")depth++;else if(ch==="}"||ch==="]")depth--;else if(ch===" "&&!depth){if(near(i,best))best=i;if(str[i+1]===" "&&near(i,dbl))dbl=i}});
  if(dbl>=0&&Math.abs(dbl-mid)<str.length*.3)best=dbl;
  if(best<0)return[ln(str,x,y,size,c,anchor,max,o)];const a=str.slice(0,best).trim().replace(/\s*·$/,""),b=str.slice(best+1).trim().replace(/^·\s*/,""),s2=Math.min(size,fitT(spans(a).plain,max,size),fitT(spans(b).plain,max,size));
  return[ln(a,x,y-s2*.58,s2,c,anchor,max,o),ln(b,x,y+s2*.62,s2,c,anchor,max,o)]}

/* the key sentence in a soft box at the bottom of a board */
const keyBox=(key,y=388)=>{if(!key)return[];if(fitT(spans(key).plain,680,36)>=36*.78)return[A.band(40,y,720,92,"o"),Object.assign(A.tx("Key sentence",60,y+24,18,"o","start"),{dur:120}),ln(key,400,y+66,36,"k","middle",680)];
  return[A.band(40,y-22,720,114,"o"),Object.assign(A.tx("Key sentence",60,y+2,18,"o","start"),{dur:120}),...ln2(key,400,y+58,32,"k","middle",680)]};
const SIGN={"+":["+","g"],"-":["−","r"],"?":["?","b"]};
const head=(title,lv,c="b")=>[A.wipe(),ln(title,40,58,38,c,"start",600),...(lv?[A.band(668,26,92,44,"v"),Object.assign(A.tx(lv,714,58,24,"v"),{dur:80})]:[])];

/* 1 · the rule: rows of form ("+ I {work}.", "- I {don't work}.", "? {Do} you {work}?" or plain lines), then the key sentence */
export function ruleBoard(u){const rows=u.rows||[],n=rows.length,top=118,bot=u.key?(fitT(spans(u.key).plain,680,36)>=36*.78?350:330):440,gap=n>1?Math.min(64,(bot-top)/(n-1)):0,o=head(u.name,u.lv),
    L=(r,x,y,max)=>gap>=60&&fitT(spans(r).plain,max,34)<34*.8?ln2(r,x,y,28,"k","start",max,{split:1}):[ln(r,x,y,34,"k","start",max)];
  rows.forEach((r,i)=>{const y=top+i*gap,m=/^([+?-]) /.exec(r);
    if(m){const [s,c]=SIGN[m[1]];o.push(A.p(R.circ(64,y-10,17),c,3),Object.assign(A.tx(s,64,y,26,c),{dur:60}),...L(r.slice(2),96,y,660))}
    else o.push(...L(r,60,y,690))});
  return[...o,...keyBox(u.key)]}

/* 2 · when we use it: a timeline (tenses) and the uses */
const X=(x,y,c="r",s=11)=>A.p(R.line(x-s,y-s,x+s,y+s,.1)+R.line(x+s,y-s,x-s,y+s,.1),c,5);
const wavy=(x1,x2,y,c="b")=>{let d=`M${x1},${y}`;const n=Math.max(4,Math.round((x2-x1)/22));for(let i=1;i<=n;i++){const x=x1+(x2-x1)*i/n;d+=`Q${x-(x2-x1)/n/2},${y+(i%2?-16:16)} ${x},${y}`}return A.p(d,c,4)};
const NOW=480;
export function timeline(kind,y=170){const o=[A.arrow(70,y,750,y,"k"),A.p(R.dashed(NOW,y-58,NOW,y+30),"k",3),Object.assign(A.tx("now",NOW,y+56,22,"k"),{dur:60}),
  Object.assign(A.tx("past",120,y+40,22,"k"),{dur:60}),Object.assign(A.tx("future",700,y+40,22,"k"),{dur:60})],lab=(t,x,yy,c)=>Object.assign(A.tx(t,x,yy,22,c),{dur:200});
  const K={
   habit:()=>[...[140,220,300,380,580,660].map(x=>X(x,y,"r",9)),lab("again and again",NOW,y-70,"r")],
   now:()=>[wavy(NOW-70,NOW+70,y-24),lab("happening around now",NOW,y-70,"b")],
   point:()=>[X(260,y),lab("finished, at a time in the past",260,y-36,"r")],
   pastProg:()=>[wavy(170,370,y-24),X(280,y,"r"),lab("in progress",270,y-70,"b"),lab("then something happened",280,y+76,"r")],
   usedTo:()=>[...[130,190,250,310].map(x=>X(x,y,"r",9)),lab("again and again, then it stopped",230,y-36,"r"),X(NOW,y-36,"k",8)],
   perf:()=>[X(260,y,"r"),A.arrow(272,y-14,NOW-6,y-20,"g",-40),lab("past action, result now",360,y-80,"g")],
   perfDur:()=>[A.p(R.line(240,y-14,240,y+14,.1),"g",5),wavy(240,NOW,y-24,"g"),lab("from then until now",360,y-70,"g")],
   pastPerf:()=>[X(190,y,"r"),lab("1st",190,y-34,"r"),X(350,y,"b"),lab("2nd",350,y-34,"b"),lab("the earlier past",190,y+76,"r")],
   future:()=>[X(650,y,"v"),lab("later",650,y-36,"v")],
   plan:()=>[A.p(R.circ(NOW,y,8),"o",5),lab("plan / evidence now",NOW-10,y-70,"o"),A.arrow(NOW+12,y-10,640,y-12,"o",-30),X(650,y,"v")],
   futProg:()=>[wavy(590,710,y-24,"v"),lab("in progress then",650,y-70,"v")],
   futPerf:()=>[X(600,y,"v"),A.p(R.line(690,y-30,690,y+30,.1),"k",4),lab("done before then",640,y-50,"v")],
  };return[...o,...(K[kind]?K[kind]():[])]}
export function useBoard(u){const o=head(u.useT||"When do we use it?",null),uses=u.use||[],tl=u.tl?timeline(u.tl):[],y0=u.tl?290:130,gap=u.tl?44:58;
  uses.forEach((t,i)=>{o.push(A.p(R.circ(64,y0+i*gap-10,6),"o",5),ln(t,86,y0+i*gap,u.tl?28:32,"k","start",670))});
  return[...o,...tl,...(u.tl&&uses.length>2?[]:keyBox(u.key))]}
/* a comparison: two columns, each with a head and lines */
export function cmpBoard(u){const c=u.cmp,o=head(c.t||"Compare",null);[[c.a,40,"b"],[c.b,410,"g"]].forEach(([s,x,col])=>{o.push(A.band(x,90,350,380,col),ln(s.h,x+175,134,32,col,"middle",320));
  s.l.forEach((t,i)=>o.push(ln(t,x+20,200+i*58,26,"k","start",315)))});return o}
/* 3 · examples, numbered, the grammar in colour */
export function exBoard(list,title="Examples"){const o=head(title,null),n=list.length,gap=n>1?Math.min(78,320/(n-1)):0;
  list.forEach((t,i)=>{const y=126+i*gap,L=ln2(t,84,y,34,"k","start",680);o.push(Object.assign(A.tx(String(i+1),56,L[0].y,22,"o"),{dur:50}),...L)});return o}

/* answers: contractions count both ways ("doesn't" = "does not") */
const PRO="i|you|he|she|it|we|they|that|there|what|who|where|here";
const expand=a=>a.replace(/\bwon't\b/gi,"will not").replace(/\bcan't\b/gi,"cannot").replace(/\bshan't\b/gi,"shall not").replace(/(\w+)n't\b/gi,"$1 not")
  .replace(/\b(i)'m\b/gi,"$1 am").replace(/'re\b/gi," are").replace(/'ve\b/gi," have").replace(/'ll\b/gi," will").replace(new RegExp(`\\b(${PRO})'s\\b`,"gi"),"$1 is");
const contract=a=>a.replace(/\bwill not\b/gi,"won't").replace(/\bcannot\b|\bcan not\b/gi,"can't").replace(/\b(do|does|did|is|are|was|were|have|has|had|could|should|would|must|need)\s+not\b/gi,"$1n't");
const alts=a=>{const out=new Set([a,expand(a),contract(a),contract(expand(a))]);const d=expand(a);
  if(/'d\b/.test(a)){out.add(a.replace(/'d\b/," would"));out.add(a.replace(/'d\b/," had"))}
  if(new RegExp(`\\b(${PRO})'s\\b`,"i").test(a))out.add(a.replace(new RegExp(`\\b(${PRO})'s\\b`,"i"),"$1 has"));
  if(/\bcannot\b/.test(d))out.add(d.replace(/\bcannot\b/,"can not"));return[...out]};

/* one question from a pool entry: ["She ___ (work) here.", "works" | ["works","..."]] typed, or ["...", [opts], index] chosen */
export function question(u,it){const [s,a,k]=it,choice=Array.isArray(a)&&typeof k==="number",right=choice?a[k]:[].concat(a)[0];
  const gap=/_{2,}/.test(s),qs=s.replace(/_{2,}/,"{_____}"),
    full=!gap?`{${right}}`:right==="—"?s.replace(/\s*_{2,}\s*/," ").trim().replace(/^./,c=>c.toUpperCase()).replace(/\s*\([^)]*\)/,""):s.replace(right[0]==="'"?/\s*_{2,}/:/_{2,}/,`{${right}}`).replace(/\s*\([^)]*\)/,""),
    ins=!gap?s:choice?"Choose the right answer.":"Write the missing word(s).";
  const ord=choice?a.map((_,i)=>i).sort(()=>Math.random()-.5):null,opts=choice?ord.map(i=>a[i]):null;
  const q=[A.wipe(),Object.assign(A.tx(ins,400,72,32,"b"),{dur:200}),...(gap?ln2(qs,400,250,46,"k","middle",720,{cf:"o"}):choice?opts.flatMap((o,i)=>[Object.assign(A.tx("ABC"[i],70,190+i*100,34,"o"),{dur:60}),ln(o,110,190+i*100,38,"k","start",660)]):[])];
  const sol=[A.wipe(),...ln2(full,400,200,46,"k","middle",720,{cf:"g"}),...(u.short?ln2(u.short,400,330,30,"o","middle",700):[])];
  const hint={say:T3(u.tip||u.say),draw:u.short?ln2(u.short,400,420,30,"o","middle",700):[]};
  if(choice)return{kind:"choice",opts,ans:ord.indexOf(k),show:right,q,sol,hint};
  return{kind:"text",exact:true,ans:[].concat(a).flatMap(alts),show:right,q,sol,hint}}
/* the drill of a unit: question n (0..4) comes from the n-th fifth of the pool, so they go from easy to hard and never repeat */
const drillGen=u=>n=>{const L=u.q.length,lo=Math.floor(n*L/5),hi=Math.max(lo,Math.floor((n+1)*L/5)-1);return question(u,u.q[rint(lo,Math.min(hi,L-1))])};

const EXSAY=S("Läs exemplen högt. Det röda är regeln, det blå är signalord som hör ihop med den.","Read the examples aloud. The red part is the rule; the blue words are signal words that go with it.","اقرأ الأمثلة بصوت عالٍ. الجزء الأحمر هو القاعدة، والكلمات الزرقاء كلمات دالّة ترافقها.");
const DRILL=S("Din tur! Fem meningar, från lätt till svår.","Your turn! Five sentences, from easy to hard.","دورك! خمس جمل من السهل إلى الصعب.");

/* a topic: {id, title:[sv,en,ar], grades, units:[...]} -> one lesson in parts; the last part has all key sentences */
export function topic(def){const steps=[],parts=[];
  def.units.forEach((u,k)=>{parts.push({icon:`${def.no}.${k+1}`,name:t3(u.name,u.name,u.name),at:steps.length});
    steps.push({say:T3(u.say),draw:()=>ruleBoard(u)});
    if(u.cmp)steps.push({say:T3(u.useSay),draw:()=>cmpBoard(u)});
    else if(u.use||u.tl)steps.push({say:T3(u.useSay),draw:()=>useBoard(u)});
    steps.push({say:u.exSay?T3(u.exSay):EXSAY,draw:()=>exBoard(u.ex)});
    if(u.ex2)steps.push({say:T3(u.ex2Say||u.exSay)||EXSAY,draw:()=>exBoard(u.ex2,u.ex2T||"More examples")});
    steps.push({drill:{gen:drillGen(u),n:5,intro:DRILL}})});
  const keys=def.units.filter(u=>u.key);parts.push({icon:"🔑",name:t3("Nyckelmeningar","Key sentences","الجمل المفتاحية"),at:steps.length});
  for(let i=0;i<keys.length;i+=5){const grp=keys.slice(i,i+5);
    steps.push({say:S("Nyckelmeningarna: en mening per regel. Lär dig dem utantill, så har du hela regeln med dig.","The key sentences: one sentence per rule. Learn them by heart and you carry the whole rule with you.","الجمل المفتاحية: جملة لكل قاعدة. احفظها عن ظهر قلب فتبقى القاعدة كاملة معك."),
     draw:()=>{const o=head("Key sentences",null,"o");grp.forEach((u,j)=>{const y=120+j*76;o.push(Object.assign(A.tx(u.name,60,y-6,20,"b","start"),{dur:100}),ln(u.key,60,y+28,32,"k","start",690))});return o}})}
  LESSONS.push({id:def.id,subject:"gram",grades:def.grades,kind:"wb",title:T3(def.title),icon:"",steps,parts,mount:qMount({steps})})}

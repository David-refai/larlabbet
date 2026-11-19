import {A,R,WB,f1,pieLines} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE: shared tools. A Snabbmatte lesson is one topic (fractions,
   decimals ...) in parts. Each part: a few explaining boards, worked
   examples drawn line by line, then a drill of 5 questions (easy -> hard),
   then the next part. The lesson runner reads `parts` and `drill` steps.
   ===================================================================== */

export const LRI=s=>"⁦"+s+"⁩";      /* keeps a formula left-to-right inside Arabic speech */
export const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a), lcm=(a,b)=>a/gcd(a,b)*b;

/* ---------- items of a maths row: fraction, text, mixed number ---------- */
export const F=(n,d,c)=>d===1||d==="1"?{k:"t",s:String(n),c}:{k:"f",n,d,c};
export const X=(s,c)=>({k:"t",s:String(s),c});
export const M=(w,n,d,c)=>({k:"m",w,n,d,c});
export const fwid=(n,d,s)=>Math.max(String(n).length,String(d).length)*s*.42+s*.3;
export const twid=(t,s)=>[...String(t)].reduce((a,ch)=>a+(ch===" "?.26:/[·,.:]/.test(ch)?.26:/[a-zåäöé]/i.test(ch)?.46:/[=+−]/.test(ch)?.56:.5),0)*s;
const iw=(it,s)=>it.k==="f"?fwid(it.n,it.d,s):it.k==="m"?String(it.w).length*s*.62+s*.16+fwid(it.n,it.d,s):twid(it.s,s);
export const rowW=(Ls,s)=>Ls.reduce((a,it)=>a+iw(it,s),0)+s*.3*Math.max(0,Ls.length-1);
/* a row drawn from x (left); y is the fraction line. Returns the actions and where the row ends */
export function rowAt(Ls,x,y,s,col){const out=[];let cx=x;
  Ls.forEach((it,i)=>{if(i)cx+=s*.3;const w=iw(it,s),c=it.c||col||"k",m=cx+w/2;
    if(it.k==="f")out.push(...A.frac(it.n,it.d,m,y,s,c));
    else if(it.k==="m"){const ww=String(it.w).length*s*.62;out.push(A.tx(it.w,cx+ww/2,y+s*.5,s*1.4,c),...A.frac(it.n,it.d,cx+ww+s*.16+fwid(it.n,it.d,s)/2,y,s,c))}
    else out.push(A.tx(it.s,m,y+s*.36,s,c));
    cx+=w});
  return{acts:out,end:cx}}
export const rowC=(Ls,cx,y,s,col)=>rowAt(Ls,cx-rowW(Ls,s)/2,y,s,col);

/* font size so a line of text fits in max px */
export const fitT=(t,max,size)=>Math.min(size,max/(String(t).length*.47));
const wrap=(t,max)=>{const o=[];let cur="";String(t).split(" ").forEach(w=>{if(cur&&(cur+" "+w).length>max){o.push(cur);cur=w}else cur=cur?cur+" "+w:w});if(cur)o.push(cur);return o};

/* a worked solution: the problem, then "= ..." lines with the "=" signs under each other.
   steps: rows of items; notes: a short orange note per row (row 0 above it, later rows in the left margin).
   The last row is green on a highlighter. */
export function work(prob,steps,notes=[],o={}){
  const n=steps.length;let s=o.s||(n<=1?64:n===2?56:46);const gap=o.gap||(n>3?106:n===3?112:120),y0=o.y0||Math.round(262-(n-1)*gap/2);
  const size=s=>{const pw=rowW(prob,s),eqw=twid("=",s),g=s*.3,sw=Math.max(...steps.map(r=>rowW(r,s)));return{pw,eqw,g,tot:pw+2*g+eqw+sw}};
  while(size(s).tot>740&&s>26)s-=2;
  const {pw,eqw,g,tot}=size(s),x0=Math.max(30,(800-tot)/2),eqX=x0+pw+g+eqw/2,x1=eqX+eqw/2+g,out=[...rowAt(prob,x0,y0,s).acts];
  steps.forEach((r,j)=>{const y=y0+j*gap,last=j===steps.length-1,c=last?"g":"k",row=rowAt(r,x1,y,s,c);
    if(last)out.push(A.hl(eqX-eqw/2-12,y-s*.98,row.end-eqX+eqw/2+26,s*1.98));
    const nt=notes[j];
    if(nt&&j===0)out.push(Object.assign(A.tx(nt,x1,y-s*1.2,22,"o","start"),{dur:150}));
    out.push(A.tx("=",eqX,y+s*.36,s,c),...row.acts);
    if(nt&&j>0){const ls=wrap(nt,Math.max(10,Math.floor((eqX-46)/11)));ls.forEach((ln,q)=>out.push(Object.assign(A.tx(ln,eqX-24,y+8+(q-(ls.length-1)/2)*26,22,"o","end"),{dur:150})))}});
  return out}

/* ---------- pictures ---------- */
const prt=(x,y,w,h,n,from,k)=>`M${f1(x+w*from/n)},${y}h${f1(w*k/n)}v${h}h${f1(-w*k/n)}Z`;
export const bar=(x,y,w,h,n,k=0,c="b",from=0)=>[A.p(R.bar(x,y,w,h,n),"k",3.5),...(k?[A.hatch(prt(x,y,w,h,n,from,k),c)]:[])];
export const barPart=(x,y,w,h,n,from,k,c)=>A.hatch(prt(x,y,w,h,n,from,k),c);
export const pie=(cx,cy,r,n,k=0,c="r",from=0)=>[pieLines(cx,cy,r,n),...[...Array(k)].map((_,i)=>A.hatch(R.wedge(cx,cy,r,n,from+i),c))];
export const okM=(x,y,c="g")=>A.p(`M${x-13},${y-1}L${x-4},${y+10}L${x+14},${y-14}`,c,5.5);
export const noM=(x,y,c="r")=>A.p(R.line(x-11,y-11,x+11,y+11,.2)+R.line(x+11,y-11,x-11,y+11,.2),c,5);
/* a rule card: a coloured band with a title and up to 4 numbered lines */
export function rules(title,lines,c="b",y=40){const o=[A.wipe(),A.band(40,y,720,500-y-30,c),A.tx(title,400,y+52,40,c)];
  lines.forEach((t,i)=>{const yy=y+122+i*78;o.push(A.p(R.circ(92,yy-10,22),c,3.5),A.tx(i+1,92,yy,30,c),Object.assign(A.tx(t,132,yy,fitT(t,610,30),"k","start"),{dur:260}))});return o}
/* a part's opening card: big icon, title, one key sentence */
export const opener=(icon,title,key,c="b")=>[A.wipe(),A.band(110,60,580,380,c),A.tx(icon,400,190,110,c),A.tx(title,400,290,fitT(title,540,52),c),
  Object.assign(A.tx(key,400,370,fitT(key,540,30),"k"),{dur:300})];

/* the board of a lesson in parts: every step starts on a clean board, so a step draws only itself */
export const qMount=def=>(stage,ctrl)=>{const wb=new WB(stage);ctrl.innerHTML="";
  return{wb,step(k){wb.cancel();wb.clear();const s=def.steps[k];return s.draw?wb.run(s.draw()):Promise.resolve(true)},stop(){wb.cancel()}}};

/* the question board of a drill: a title and the problem, big, with "= ?" */
export const qBoard=(title,prob,ask="?",s=66)=>{const row=[...prob,X("="),X(ask,"o")];while(rowW(row,s)>720&&s>34)s-=4;
  return[A.wipe(),A.tx(title,400,72,fitT(title,740,36),"b"),...rowC(row,400,236,s).acts]};
export const QL=(sv,en,ar)=>({sv,en,ar});

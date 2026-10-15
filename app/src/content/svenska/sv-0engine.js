import {A,L,R,TERM,TERMS,WB,WORDS,esc,pick,qt,shuffle,t3,wordCard} from "../../legacy/core.js";
/* ======================================================================
   Svenska: a unit = a short illustrated story read in parts (new words are tappable),
   the new words, one grammar point drawn on the whiteboard, then practice
   (words, grammar, understanding, one earlier unit). Words are TERMs, so the
   📖 chips, word cards and word checks of maths work here too.
   ====================================================================== */
/* shared helpers for unit files: const {rx,boxes,pic,kid,W,sent,cap}=SVH;
   rx: whole-word regex; boxes: coloured sentence parts on the board; pic/kid: SVG story pictures; W: a word (TERM) that comes back in later stories */
const SVH=(()=>{const B="(?<![a-zåäöé])",E="(?![a-zåäöé])",rx=s=>new RegExp(B+s+E,"i");
const boxes=(parts,y,size=40)=>{const w=parts.map(([s])=>Math.max(60,s.length*size*.46+28)),gap=16,tot=w.reduce((a,b)=>a+b,0)+gap*(parts.length-1);let x=400-tot/2;const out=[];
  parts.forEach(([s,c,lab],i)=>{const cx=x+w[i]/2;if(c)out.push(A.p(R.rect(x,y-size*.95,w[i],size*1.35,.6),c,3.5));out.push(A.tx(s,cx,y,size,c||"k"));if(lab)out.push(qt(lab,cx,y+size*.95,22,c||"k"));x+=w[i]+gap});return out};
const pic=(body,bg="#eef4fb")=>`<svg viewBox="0 0 300 300" aria-hidden="true"><rect width="300" height="300" rx="18" fill="${bg}"/>${body}</svg>`;
const kid=(x,y,shirt,hair,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><rect x="-22" y="20" width="44" height="62" rx="18" fill="${shirt}"/><circle cy="0" r="22" fill="#f1c7a3"/><path d="M-23 -4 Q-20 -28 0 -26 Q22 -28 23 -4 Q14 -16 0 -15 Q-14 -16 -23 -4Z" fill="${hair}"/><circle cx="-7" cy="2" r="2.4" fill="#1d2433"/><circle cx="7" cy="2" r="2.4" fill="#1d2433"/><path d="M-6 11 Q0 15 6 11" stroke="#1d2433" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="-18" y="80" width="14" height="34" rx="6" fill="#33415c"/><rect x="4" y="80" width="14" height="34" rx="6" fill="#33415c"/></g>`;
const W=(k,o)=>TERM(k,Object.assign({sw:true},o));
const sent=a=>a.filter(Boolean).join(" ")+".",cap=s=>s[0].toUpperCase()+s.slice(1);
return{rx,boxes,pic,kid,W,sent,cap}})();
const SVU={};   /* unit id -> definition, for the practice generators */
/* the story layer sits over the whiteboard; whiteboard steps (grammar, practice) hide it */
function svMount(U){return function(stage,ctrl){
  stage.classList.add("svstage");stage.innerHTML='<div class="svwb"></div><div class="svstory" hidden></div>';
  const wb=new WB(stage.querySelector(".svwb")),story=stage.querySelector(".svstory"),run0=wb.run.bind(wb);
  /* a story page may use the whole height on a phone; the whiteboard keeps its shape */
  const show=on=>{story.hidden=!on;if(stage.classList.contains("svtall")!==on){stage.classList.toggle("svtall",on);window.dispatchEvent(new Event("resize"))}};
  wb.run=(c,f)=>{show(false);return run0(c,f)};ctrl.innerHTML="";
  /* the story reads like a book: it opens from a cover and the pages turn (svFlip); a swipe turns a page too */
  story.classList.add("svbook");let at=-1,sx=null;
  story.addEventListener("touchstart",e=>{sx=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});
  story.addEventListener("touchend",e=>{if(!sx)return;const t=e.changedTouches[0],dx=t.clientX-sx[0],dy=t.clientY-sx[1];sx=null;
    if(Math.abs(dx)>60&&Math.abs(dx)>2*Math.abs(dy)){const b=document.getElementById(dx<0?"next":"prev");if(b&&!b.disabled)b.click()}});
  return{wb,step(k){wb.cancel();const s=U.steps[k];
    if(s.html){wb.clear();const was=story.hidden?-1:at;show(true);svFlip(story,U,was,k,()=>s.html());at=k;svWire(story);return null}
    at=-1;
    show(false);return(async()=>{wb.clear();let j=k;while(j>0&&!U.steps[j-1].html)j--;for(;j<k;j++)if(!(await run0(U.steps[j].draw(),true)))return false;return run0(s.draw())})()},
   stop(){wb.cancel()}}}}
/* a page turn. A story page is a spread: picture on the left page, text on the right one.
   Forward, the right page lifts at the spine and turns over to the left, its back is the next picture;
   backward, the left page turns back to the right. The first page opens from a cover.
   On a phone (one page) or to or from the word page the whole page turns. */
let svLeaf=null;
function svFlip(story,U,from,to,html){
  if(svLeaf){svLeaf.getAnimations().forEach(a=>a.finish());svLeaf.remove();svLeaf=null}
  const n=U.story.length,old=story.querySelector(".svpage,.svwords"),oldPic=old&&old.querySelector(".svpic"),oldTxt=old&&old.querySelector(".svtext");
  story.innerHTML=html();story.scrollTop=0;
  const still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(still||from===to||(from<0&&to!==0))return;
  const pg=story.querySelector(".svpage,.svwords"),pic=pg.querySelector(".svpic"),txt=pg.querySelector(".svtext"),
    spread=pic&&getComputedStyle(pg).gridTemplateColumns.split(" ").length>1,fwd=to>from;
  const cover=from<0?`<div class="svcover"><div class="svcpic">${U.story[0].pic||U.pic}</div><b>${esc(U.storyTitle)}</b></div>`:null;
  const face=(h,cls)=>`<div class="svface ${cls}">${h}<i class="svshade"></i></div>`;
  const leaf=document.createElement("div");leaf.className="svleaf";leaf.setAttribute("aria-hidden","true");let rot;
  if(spread&&(cover||(oldPic&&oldTxt))){
    const half=fwd?"right":"left";leaf.classList.add(half);
    /* front: what the turning page showed; back: what it shows when it lands on the other side */
    const front=cover||(fwd?oldTxt.outerHTML:oldPic.outerHTML),back=fwd?pic.outerHTML:txt.outerHTML;
    leaf.innerHTML=face(front,"front"+(cover?" iscover":""))+face(back,"back");
    /* until the page has turned, the half it lands on still shows the old page */
    const under=fwd?pic:txt,keep=fwd?(cover?null:oldPic):oldTxt;
    if(keep){const c=keep.cloneNode(true);c.classList.add("svkeep");under.appendChild(c)}
    else if(cover)under.classList.add("svblank");
    rot=fwd?[0,-180]:[0,180];
    story.appendChild(leaf);
    const a=leaf.animate([{transform:`rotateY(${rot[0]}deg)`},{transform:`rotateY(${rot[1]}deg)`}],{duration:cover?1100:850,easing:"cubic-bezier(.45,.05,.25,1)"});
    leaf.querySelectorAll(".svshade").forEach((sh,i)=>sh.animate([{opacity:0},{opacity:.55,offset:.5},{opacity:i?0:.55}],{duration:a.effect.getTiming().duration}));
    /* the old picture/text under the landing half goes when the page passes the spine */
    setTimeout(()=>{under.querySelectorAll(".svkeep").forEach(e=>e.remove());under.classList.remove("svblank")},a.effect.getTiming().duration/2);
    svLeaf=leaf;a.onfinish=()=>{under.querySelectorAll(".svkeep").forEach(e=>e.remove());under.classList.remove("svblank");leaf.remove();if(svLeaf===leaf)svLeaf=null};
  }else{
    /* one page: the old page turns away to the left (forward) or the new one turns in from the left (back) */
    leaf.classList.add("full");
    const front=cover||(old?old.outerHTML:"");if(!front)return;
    if(fwd){leaf.innerHTML=face(front,"front"+(cover?" iscover":""));rot=[0,-110]}
    else{leaf.innerHTML=face(pg.outerHTML,"front");rot=[-110,0]}
    story.appendChild(leaf);
    const a=leaf.animate([{transform:`rotateY(${rot[0]}deg)`,opacity:fwd?1:.6},{transform:`rotateY(${rot[1]}deg)`,opacity:fwd?.6:1}],{duration:cover?1000:700,easing:"cubic-bezier(.45,.05,.25,1)"});
    svLeaf=leaf;a.onfinish=()=>{leaf.remove();if(svLeaf===leaf)svLeaf=null};
  }
}
function svWire(el){el.querySelectorAll("[data-w]").forEach(b=>b.onclick=()=>wordCard([b.dataset.w]))}
/* story text with the unit's words (and earlier units' words) made tappable */
function svMark(text,newKeys){const hits=[];
  Object.keys(TERMS).forEach(k=>{const w=TERMS[k];if(!w.m||!(newKeys.includes(k)||w.sw))return;const re=new RegExp(w.m.source,"gi");let m;
    while((m=re.exec(text))){if(!m[0].length){re.lastIndex++;continue}hits.push({s:m.index,e:m.index+m[0].length,k})}});
  hits.sort((a,b)=>a.s-b.s||b.e-a.e||newKeys.includes(b.k)-newKeys.includes(a.k));let out="",pos=0;
  hits.forEach(h=>{if(h.s<pos)return;out+=esc(text.slice(pos,h.s))+`<button class="svw${newKeys.includes(h.k)?" new":""}" data-w="${h.k}">${esc(text.slice(h.s,h.e))}</button>`;pos=h.e});
  return out+esc(text.slice(pos))}
function svPage(U,part){const p=U.story[part];return`<div class="svpage"><div class="svpic">${p.pic||U.pic}</div><div class="svtext">
  ${part===0?`<h3>${esc(U.storyTitle)}</h3>`:""}${p.text.map(t=>`<p>${svMark(t,U.words)}</p>`).join("")}<span class="svnum">${part+1}/${U.story.length}</span></div></div>`}
function svWordsPage(U){return`<div class="svwords">${U.words.map(k=>{const w=TERMS[k];return`<button class="svcard" data-w="${k}"><b>${esc(w.sv)}</b><span>${esc(w.form||"")}</span></button>`}).join("")}</div>`}
/* builds the lesson steps: intro, story parts, the new words, grammar scenes */
function svUnit(U){SVU[U.id]=U;WORDS[U.id]=U.words.concat(U.terms||[]);
  U.steps=[...U.story.map((p,i)=>({html:()=>svPage(U,i),say:p.say})),{html:()=>svWordsPage(U),say:U.wordsSay},...U.grammar];
  return{startLv:0,id:U.id,subject:"swedish",grades:String(U.year),year:U.year,ord:U.ord,kind:"wb",title:U.title,icon:U.icon,steps:U.steps,mount:svMount(U),help:U.help,gen:lv=>svGen(U,lv)}}
/* ---- practice ---- */
const svQ=(q,head)=>[A.wipe(),A.tx(head,400,70,34,"b"),...q];
function svLines(s,y,size=40,c="k",max=34){const words=s.split(" "),lines=[];let cur="";words.forEach(w=>{if((cur+" "+w).trim().length>max){lines.push(cur);cur=w}else cur=(cur+" "+w).trim()});lines.push(cur);
  return lines.map((l,i)=>A.tx(l,400,y+i*(size*1.3),size,c))}
function svGen(U,lv){const kinds=lv===0?["mean","syn","gap"]:lv===1?["gap","gram","syn","read"]:["gram","read","write"];
  for(let t=0;t<12;t++){const g=SVK[pick(kinds)](U,lv);if(g)return g}return SVK.mean(U,lv)}
const SVK={
 /* which word means …? */
 mean(U){const k=pick(U.words),w=TERMS[k],others=shuffle(U.words.filter(x=>x!==k)).slice(0,2),opts=shuffle([k,...others]);
  return{kind:"choice",opts:opts.map(x=>TERMS[x].sv.split(" (")[0]),ans:opts.indexOf(k),show:w.sv,
   q:svQ(svLines(L(w.d),200,36),L(t3("Vilket ord betyder:","Which word means:","أي كلمة تعني:"))),sol:[...svLines(w.ex||"",420,34,"g")]}},
 /* synonym or opposite from the word's own list */
 syn(U){const ks=U.words.filter(k=>TERMS[k].syn&&TERMS[k].syn.length);if(!ks.length)return null;const k=pick(ks),w=TERMS[k],[right,...wrong]=w.syn,opp=w.opp;
  const kind=opp&&Math.random()<.4?"opp":"syn",ans=kind==="opp"?opp[0]:right,pool=shuffle([...new Set([...(w.wrong||[]),...U.words.filter(x=>x!==k).map(x=>TERMS[x].sv.split(" (")[0])])]).filter(x=>x!==ans).slice(0,2),opts=shuffle([ans,...pool]);
  return{kind:"choice",opts,ans:opts.indexOf(ans),show:ans,
   q:svQ([A.tx(w.sv.split(" (")[0],400,230,76)],L(kind==="opp"?t3("Vilket ord är en motsats till:","Which word is an opposite of:","أي كلمة عكس:"):t3("Vilket ord är en synonym till:","Which word is a synonym of:","أي كلمة مرادفة لـ:"))),
   sol:[A.tx(`${w.sv.split(" (")[0]} ${kind==="opp"?"↔":"≈"} ${ans}`,400,420,40,"g")]}},
 /* fill the gap in a sentence from the story */
 gap(U){const k=pick(U.words.filter(x=>TERMS[x].gap)),w=k&&TERMS[k];if(!w)return null;const [pre,word,post]=w.gap,others=shuffle(U.words.filter(x=>x!==k&&TERMS[x].gapForm)).slice(0,2).map(x=>TERMS[x].gapForm);
  if(others.length<2)return null;const opts=shuffle([word,...others]);
  return{kind:"choice",opts,ans:opts.indexOf(word),show:word,q:svQ(svLines(`${pre} ____ ${post}`.trim(),210,40),L(t3("Vilket ord passar i luckan?","Which word fits the gap?","أي كلمة تناسب الفراغ؟"))),
   sol:svLines(`${pre} ${word} ${post}`.trim(),390,36,"g")}},
 /* the unit's grammar questions (written by the unit) */
 gram(U,lv){return U.gram?U.gram(lv):null},
 /* understanding the story */
 read(U){const r=pick(U.read||[]);if(!r)return null;const opts=shuffle(r.o.map((o,j)=>({o,j})));
  return{kind:"choice",opts:opts.map(x=>x.o),ans:opts.findIndex(x=>x.j===0),show:r.o[0],q:svQ(svLines(r.q,200,40),L(t3("Läs och svara","Read and answer","اقرأ وأجب"))),sol:svLines(r.why||"",400,32,"g")}},
 /* write one word yourself */
 write(U,lv){return U.gram?U.gram(2,true):null}};
(()=>{const st=document.createElement("style");st.textContent=`
.svstage{container-type:inline-size}.svstage .svwb{position:absolute;inset:0}.svstage .svwb.wbframe{border:0;box-shadow:none}
.svstory{direction:ltr;text-align:left;position:absolute;inset:0;background:#fffdf7;color:#1d2433;overflow:auto;font-size:2.6cqw}
.svstory[hidden]{display:none}
.svpage{display:grid;grid-template-columns:36% 1fr;height:100%}
.svpic{display:grid;place-items:center;background:#eef4fb;padding:3%}.svpic svg{width:100%;height:auto;max-height:100%}
.svtext{padding:4% 5% 3%;display:flex;flex-direction:column;gap:.6em;position:relative;line-height:1.55}
.svtext h3{margin:0;font-size:1.25em;color:#1f4fb0}.svtext p{margin:0}
.svnum{position:absolute;bottom:3%;inset-inline-end:4%;font-size:.75em;color:#7d8aa5}
.svw{font:inherit;color:inherit;background:none;border:0;padding:0 .08em;cursor:pointer;border-bottom:2px dotted #9aa8c4}
.svw.new{color:#1f4fb0;font-weight:700;background:#e7f0ff;border-radius:.25em;border-bottom:0}
.svbook{perspective:2400px;overflow-x:hidden}
.svbook .svpage{grid-template-columns:1fr 1fr;position:relative;background:#fffaf0}
.svbook .svpage::after{content:"";position:absolute;inset:0 auto 0 calc(50% - 22px);width:44px;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(60,40,10,.16) 45%,rgba(60,40,10,.22) 50%,rgba(60,40,10,.10) 55%,transparent)}
.svbook .svtext{background:#fffaf0;font-family:Georgia,"Times New Roman",serif;overflow:auto}
.svbook .svpic,.svbook .svtext{position:relative}
.svkeep{position:absolute!important;inset:0;margin:0}
.svblank>*{visibility:hidden}.svblank{background:#fffaf0!important}
.svleaf{position:absolute;top:0;bottom:0;transform-style:preserve-3d;pointer-events:none;z-index:3}
.svleaf.right{left:50%;right:0;transform-origin:0 50%}.svleaf.left{left:0;right:50%;transform-origin:100% 50%}
.svleaf.full{inset:0;transform-origin:0 50%}
.svface{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;background:#fffaf0;box-shadow:0 0 18px rgba(30,20,0,.18)}
.svface>.svpic,.svface>.svtext,.svface>.svpage,.svface>.svwords{position:absolute;inset:0;height:100%}
.svface.back{transform:rotateY(180deg)}
.svshade{position:absolute;inset:0;opacity:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,0,0,0) 60%)}
.svleaf.left .svface.front .svshade{background:linear-gradient(270deg,rgba(0,0,0,.35),rgba(0,0,0,0) 60%)}
.svface.iscover{background:linear-gradient(135deg,#1f4fb0,#16367a);border-radius:0 .5em .5em 0}
.svcover{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5%;padding:8%;color:#fff;text-align:center}
.svcover .svcpic{width:78%;aspect-ratio:1;border-radius:.4em;overflow:hidden;border:4px solid #f3d27a;box-shadow:0 6px 20px rgba(0,0,0,.35);display:grid;place-items:center;background:#eef4fb}
.svcover .svcpic>*{width:100%;height:100%;object-fit:cover}
.svcover b{font-family:Georgia,serif;font-size:1.5em;line-height:1.2;color:#f9e7b0;text-shadow:0 2px 6px rgba(0,0,0,.35)}
.svwords{display:grid;grid-template-columns:repeat(4,1fr);gap:3%;padding:5%;height:100%;align-content:center}
.svcard{font:inherit;border:0;border-radius:.6em;background:#fff;box-shadow:0 2px 8px rgba(19,33,63,.12);padding:.8em .4em;display:flex;flex-direction:column;gap:.3em;cursor:pointer;color:#1d2433}
.svcard b{font-family:Caveat,cursive;font-size:1.6em;color:#1f4fb0}.svcard span{font-size:.7em;color:#5b6884}
.answer input.txtin{width:min(26em,72vw);text-align:start;font-size:1.15rem}
@media (max-width:620px){.svpage{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr) auto}.svpic{min-height:0;padding:2%}.svpic svg{height:100%}.svstage:not(.svtall) .svpic{display:none}.svstory{font-size:4.4cqw}.svwords{grid-template-columns:repeat(2,1fr);gap:2%}.svbook .svpage{grid-template-columns:1fr}.svbook .svpage::after{display:none}}`;document.head.appendChild(st)})();

export {SVH,SVU,svMount,svLeaf,svFlip,svWire,svMark,svPage,svWordsPage,svUnit,svQ,svLines,svGen,SVK};

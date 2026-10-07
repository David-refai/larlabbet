/* ======================================================================
   Accounts on the public site (Supabase): a parent signs up with email and adds
   children; a child logs in with the family code, their name and a 4-digit PIN.
   Inside Claude (window.claude) the app keeps using the Claude account instead.
   Talks to Supabase with plain fetch: Auth for parents, SQL functions for children
   (see supabase/schema.sql).
   ====================================================================== */
const SB={url:"https://olzlxkncmwzukoiywsks.supabase.co",key:"sb_publishable_JpPCJcC1xOh-66A6cO_p2w_SRZ2hBx8"};
const AKEY={par:"larlabbet-parent",kid:"larlabbet-kid",fam:"larlabbet-fam",local:"larlabbet-local"};
const ACC={on:false,par:null,kid:null,view:null,t:0,busy:false,again:false};
const AUI={
 sv:{accHello:"Välkommen till Lärlabbet!",accIntro:"Logga in för att spara allt du lär dig, på alla enheter.",imKid:"Jag är elev",imPar:"Jag är förälder",tryLocal:"Prova utan konto",
  famCode:"Familjekod",famPh:"t.ex. K7QX3M",yourName:"Ditt namn",pin:"PIN-kod (4 siffror)",login:"Logga in",logout:"Logga ut",signup:"Skapa konto",email:"E-post",password:"Lösenord (minst 8 tecken)",
  forgot:"Glömt lösenordet?",resetSent:"Vi har skickat ett mejl för att byta lösenord.",confirmMail:"Konto skapat! Öppna mejlet vi skickade och bekräfta, logga sedan in.",
  eUnknown:"Hittar ingen elev med den koden och det namnet.",ePin:"Fel PIN-kod. Försök igen.",eLocked:"För många försök. Vänta 10 minuter.",eNet:"Ingen kontakt med servern. Försök igen.",eLoginPar:"Fel e-post eller lösenord.",
  famT:"Min familj",famShow:"Barnen loggar in med familjekoden, sitt namn och sin PIN-kod.",kidsT:"Barnen",noKids:"Inga barn ännu. Lägg till ditt första barn nedan.",
  addKid:"Lägg till barn",kidName:"Barnets namn",kidGrade:"Årskurs",add:"Lägg till",report:"Rapport",studyHere:"Plugga här",newPin:"Byt PIN",del:"Ta bort",delSure:"Tryck igen för att ta bort",
  pinSet:"Ny PIN sparad",added:"Tillagt!",moveT:"Barn som bara finns på den här enheten",moveS:"Lägg till dem i kontot så sparas deras framsteg.",moveBtn:"Lägg till i kontot",
  toParent:"Föräldrar",account:"Konto",lessonsDone:n=>n===1?"1 lektion klar":`${n} lektioner klara`,needPin:"PIN-koden ska vara 4 siffror",needAll:"Fyll i alla fält",back:"← Tillbaka",
  kidMenu:"Inloggad som",savedDb:"Sparas i ditt konto"},
 en:{accHello:"Welcome to Lärlabbet!",accIntro:"Log in to save everything you learn, on every device.",imKid:"I'm a student",imPar:"I'm a parent",tryLocal:"Try without an account",
  famCode:"Family code",famPh:"e.g. K7QX3M",yourName:"Your name",pin:"PIN (4 digits)",login:"Log in",logout:"Log out",signup:"Create account",email:"Email",password:"Password (at least 8 characters)",
  forgot:"Forgot your password?",resetSent:"We sent you an email to change your password.",confirmMail:"Account created! Open the email we sent, confirm, then log in.",
  eUnknown:"No student with that code and name.",ePin:"Wrong PIN. Try again.",eLocked:"Too many tries. Wait 10 minutes.",eNet:"Can't reach the server. Try again.",eLoginPar:"Wrong email or password.",
  famT:"My family",famShow:"Your children log in with the family code, their name and their PIN.",kidsT:"Children",noKids:"No children yet. Add your first child below.",
  addKid:"Add a child",kidName:"Child's name",kidGrade:"School year",add:"Add",report:"Report",studyHere:"Study here",newPin:"Change PIN",del:"Delete",delSure:"Tap again to delete",
  pinSet:"New PIN saved",added:"Added!",moveT:"Children only on this device",moveS:"Add them to the account so their progress is kept.",moveBtn:"Add to account",
  toParent:"Parents",account:"Account",lessonsDone:n=>n===1?"1 lesson done":`${n} lessons done`,needPin:"The PIN must be 4 digits",needAll:"Fill in every field",back:"← Back",
  kidMenu:"Logged in as",savedDb:"Saved in your account"},
 ar:{accHello:"أهلًا بك في Lärlabbet!",accIntro:"سجّل الدخول لتحفظ كل ما تتعلمه على كل الأجهزة.",imKid:"أنا طالب",imPar:"أنا وليّ أمر",tryLocal:"جرّب بدون حساب",
  famCode:"رمز العائلة",famPh:"مثلًا K7QX3M",yourName:"اسمك",pin:"الرمز السري (4 أرقام)",login:"دخول",logout:"خروج",signup:"إنشاء حساب",email:"البريد الإلكتروني",password:"كلمة المرور (8 أحرف على الأقل)",
  forgot:"نسيت كلمة المرور؟",resetSent:"أرسلنا لك بريدًا لتغيير كلمة المرور.",confirmMail:"تم إنشاء الحساب! افتح البريد الذي أرسلناه وأكّده، ثم سجّل الدخول.",
  eUnknown:"لا يوجد طالب بهذا الرمز وهذا الاسم.",ePin:"الرمز السري خطأ. حاول مرة أخرى.",eLocked:"محاولات كثيرة. انتظر 10 دقائق.",eNet:"لا اتصال بالخادم. حاول مرة أخرى.",eLoginPar:"البريد أو كلمة المرور خطأ.",
  famT:"عائلتي",famShow:"يدخل الأولاد برمز العائلة واسمهم ورمزهم السري.",kidsT:"الأولاد",noKids:"لا يوجد أولاد بعد. أضف ولدك الأول في الأسفل.",
  addKid:"إضافة ولد",kidName:"اسم الولد",kidGrade:"الصف",add:"إضافة",report:"التقرير",studyHere:"ادرس هنا",newPin:"تغيير الرمز",del:"حذف",delSure:"اضغط مرة أخرى للحذف",
  pinSet:"تم حفظ الرمز الجديد",added:"تمت الإضافة!",moveT:"أولاد موجودون على هذا الجهاز فقط",moveS:"أضفهم إلى الحساب ليُحفظ تقدّمهم.",moveBtn:"أضف إلى الحساب",
  toParent:"وليّ الأمر",account:"الحساب",lessonsDone:n=>`${n} دروس منتهية`,needPin:"يجب أن يكون الرمز 4 أرقام",needAll:"املأ كل الحقول",back:"→ رجوع",
  kidMenu:"دخلت باسم",savedDb:"محفوظ في حسابك"}};
const AT=k=>AUI[lang][k];
(()=>{const st=document.createElement("style");st.textContent=`
.acc input[type=email],.acc input[type=password],.acc input[inputmode=numeric]{font:inherit;width:100%;border:0;box-shadow:0 0 0 1.5px var(--line) inset;border-radius:12px;padding:10px 14px;background:var(--bg);color:var(--ink)}
.acc .choices{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.acc .choice{display:flex;flex-direction:column;align-items:center;gap:8px;padding:22px;border:0;border-radius:20px;background:var(--surface);box-shadow:var(--shadow);cursor:pointer;font:inherit;color:var(--ink);font-weight:700;font-size:1.1rem}
.acc .choice span{font-size:2.4rem}.acc .choice:hover{transform:translateY(-3px)}
.acc .code{font-family:var(--display);font-size:2rem;letter-spacing:.2em;background:var(--bg);border-radius:14px;padding:6px 16px;display:inline-block}
.acc .krow{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:12px 0;border-top:1px solid var(--line)}.acc .krow:first-child{border-top:0}
.acc .krow b{font-size:1.1rem}.acc .krow .sp{flex:1}.acc .err{color:#c0392b;font-weight:700;min-height:1.2em}.acc .ok{color:#1e7a4a;font-weight:700}
.acc .linkb{background:none;border:0;color:var(--blue);font:inherit;cursor:pointer;text-decoration:underline;padding:0}
.acc label{font-weight:700;font-size:.92rem}`;document.head.appendChild(st)})();

/* ---------- talking to Supabase ---------- */
async function sb(path,o={}){const h={apikey:SB.key,"Content-Type":"application/json"};if(o.auth)h.Authorization="Bearer "+o.auth;if(o.prefer)h.Prefer=o.prefer;
  let r;try{r=await fetch(SB.url+path,{method:o.method||"POST",headers:h,body:o.body!==undefined?JSON.stringify(o.body):undefined})}catch(e){const x=new Error("net");x.net=true;throw x}
  const txt=await r.text();let j=null;try{j=txt?JSON.parse(txt):null}catch(e){}
  if(!r.ok){const x=new Error((j&&(j.msg||j.message||j.error_description||j.error))||String(r.status));x.status=r.status;throw x}return j}
const rpc=(fn,args,auth)=>sb("/rest/v1/rpc/"+fn,{body:args,auth});
const aget=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}};
const aset=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function parKeep(j){ACC.par={access:j.access_token,refresh:j.refresh_token,exp:Date.now()+(j.expires_in||3600)*1000,email:(j.user&&j.user.email)||(ACC.par&&ACC.par.email)||""};aset(AKEY.par,ACC.par)}
async function parTok(){const p=ACC.par;if(!p)throw new Error("no parent");if(p.exp-60000>Date.now())return p.access;
  const j=await sb("/auth/v1/token?grant_type=refresh_token",{body:{refresh_token:p.refresh}});parKeep(j);return ACC.par.access}
const kidState=()=>{const o=JSON.parse(JSON.stringify(S));delete o.id;return o};

/* ---------- saving the active child to the database ---------- */
function accPush(){if(!ACC.on||!S.name||!S.grade)return;const dbId=String(S.id||"").startsWith("db-")?S.id.slice(3):null;if(!dbId)return;
  clearTimeout(ACC.t);ACC.t=setTimeout(async()=>{if(ACC.busy){ACC.again=true;return}ACC.busy=true;
    try{if(ACC.kid&&ACC.kid.id===dbId){const ok=await rpc("kid_save",{p_token:ACC.kid.token,p_state:kidState(),p_upd:S.upd||0});if(ok===false){accKidOut();toast(AT("eLoginPar"))}}
      else if(ACC.par&&ACC.view===dbId)await sb("/rest/v1/kids?id=eq."+dbId,{method:"PATCH",auth:await parTok(),body:{state:kidState(),upd:S.upd||0,grade:S.grade,name:S.name}})}
    catch(e){if(e.net)toast(AT("eNet"))}
    ACC.busy=false;if(ACC.again){ACC.again=false;accPush()}},1500)}
/* the child's copy from the server becomes S, merged with this device's copy of the same child */
function accUse(row){const id="db-"+row.id,mine=PROF.kids[id],srv=Object.assign(clean(row.state||{}),{id,name:row.name,grade:(row.state&&row.state.grade)||row.grade||S.grade});
  srv.upd=Math.max(srv.upd||0,row.upd||0);const m=mine?mergeState(mine,srv):srv;m.id=id;m.name=row.name;m.grade=m.grade||row.grade;
  PROF.kids[id]=m;S=m;useKid(id);picked=true}
function accKidOut(){if(ACC.kid){rpc("kid_logout",{p_token:ACC.kid.token}).catch(()=>{});delete PROF.kids["db-"+ACC.kid.id];if(PROF.cur==="db-"+ACC.kid.id)PROF.cur=null}
  ACC.kid=null;aset(AKEY.kid,null);S=Object.assign(fresh(),{id:newId(),lang});saveLocal();hud();startScreen()}
async function accParOut(){try{if(ACC.par)await sb("/auth/v1/logout",{auth:ACC.par.access})}catch(e){}
  Object.keys(PROF.kids).filter(k=>k.startsWith("db-")).forEach(k=>delete PROF.kids[k]);PROF.cur=null;
  ACC.par=null;ACC.view=null;aset(AKEY.par,null);S=Object.assign(fresh(),{id:newId(),lang});saveLocal();hud();startScreen()}

/* ---------- header: who is logged in ---------- */
const hudBase=hud;
hud=function(){hudBase();if(!ACC.on)return;const h=$("#hud"),wh=$("#who");
  if(ACC.kid&&wh){wh.onclick=()=>kidMenu()}
  else if(ACC.par&&ACC.view&&wh){wh.onclick=()=>parentHome()}
  if(ACC.par&&!$("#accp")){h.insertAdjacentHTML("beforeend",`<button class="chip" id="accp">👪 ${AT("toParent")}</button>`);$("#accp").onclick=()=>parentHome()}
  if(!ACC.par&&!ACC.kid&&!$("#acck")){h.insertAdjacentHTML("beforeend",`<button class="chip" id="acck">🔑 ${AT("account")}</button>`);$("#acck").onclick=()=>startScreen()}};
function kidMenu(){const p=$("#wpop");p.innerHTML=`<div class="wcard acc"><p class="muted">${AT("kidMenu")}</p><h3>👤 ${esc(S.name)}</h3><p class="muted">☁️ ${AT("savedDb")}</p>
  <div class="row"><button class="btn ghost" id="kmx">${AT("back")}</button><button class="btn" id="kmo">${AT("logout")}</button></div></div>`;p.hidden=false;
  const close=()=>{p.hidden=true;p.innerHTML=""};$("#kmx").onclick=close;$("#kmo").onclick=()=>{close();accKidOut()};p.onclick=e=>{if(e.target===p)close()}}

/* ---------- screens ---------- */
function startScreen(){screen=startScreen;leave();hud();
  app.innerHTML=`<div class="stack acc">
   <section class="hello">${OWL}<div class="stack" style="gap:10px"><h1>${AT("accHello")}</h1><p class="muted">${AT("accIntro")}</p></div></section>
   <div class="choices"><button class="choice" id="ak"><span>🎒</span>${AT("imKid")}</button><button class="choice" id="ap"><span>👪</span>${AT("imPar")}</button></div>
   <p style="text-align:center"><button class="linkb" id="al">${AT("tryLocal")}</button></p></div>`;
  $("#ak").onclick=kidLogin;$("#ap").onclick=()=>parLogin(false);$("#al").onclick=()=>{aset(AKEY.local,1);route()}}
function kidLogin(){screen=kidLogin;leave();hud();
  app.innerHTML=`<div class="stack acc"><div class="lhead"><button class="btn ghost" id="bk" style="padding:5px 16px">${AT("back")}</button><h2>🎒 ${AT("imKid")}</h2></div>
   <form class="panel stack" id="kf" autocomplete="on">
    <label for="kc">${AT("famCode")}</label><input type="text" id="kc" maxlength="8" placeholder="${AT("famPh")}" autocapitalize="characters" value="${esc(aget(AKEY.fam)||"")}">
    <label for="kn">${AT("yourName")}</label><input type="text" id="kn" maxlength="30" autocomplete="given-name">
    <label for="kp">${AT("pin")}</label><input type="password" id="kp" inputmode="numeric" maxlength="4" autocomplete="current-password">
    <p class="err" id="ke"></p><div class="row"><button class="btn" type="submit">${AT("login")}</button></div></form></div>`;
  $("#bk").onclick=startScreen;
  $("#kf").onsubmit=async e=>{e.preventDefault();const c=$("#kc").value.trim().toUpperCase(),n=$("#kn").value.trim(),pn=$("#kp").value.trim(),er=$("#ke");er.textContent="";
    if(!c||!n||!pn){er.textContent=AT("needAll");return}if(!/^\d{4}$/.test(pn)){er.textContent=AT("needPin");return}
    try{const j=await rpc("kid_login",{p_code:c,p_name:n,p_pin:pn});
      if(!j||j.error){er.textContent=AT({unknown:"eUnknown",pin:"ePin",locked:"eLocked"}[j&&j.error]||"eUnknown");return}
      aset(AKEY.fam,c);ACC.kid={token:j.token,id:j.id,name:j.name};aset(AKEY.kid,ACC.kid);accUse(j);save();hud();map()}
    catch(x){er.textContent=AT("eNet")}};
  setTimeout(()=>($("#kc").value?$("#kn"):$("#kc")).focus(),30)}
function parLogin(signup){screen=()=>parLogin(signup);leave();hud();
  app.innerHTML=`<div class="stack acc"><div class="lhead"><button class="btn ghost" id="bk" style="padding:5px 16px">${AT("back")}</button><h2>👪 ${AT("imPar")}</h2></div>
   <div class="seg" role="group" style="align-self:flex-start"><button id="t1" aria-pressed="${!signup}">${AT("login")}</button><button id="t2" aria-pressed="${signup}">${AT("signup")}</button></div>
   <form class="panel stack" id="pf">
    <label for="pe">${AT("email")}</label><input type="email" id="pe" autocomplete="email" value="${esc((aget(AKEY.par)||{}).email||"")}">
    <label for="pw">${AT("password")}</label><input type="password" id="pw" autocomplete="${signup?"new-password":"current-password"}" minlength="8">
    <p class="err" id="pr"></p><p class="ok" id="po"></p>
    <div class="row"><button class="btn" type="submit">${signup?AT("signup"):AT("login")}</button>${signup?"":`<button class="linkb" type="button" id="fg">${AT("forgot")}</button>`}</div></form></div>`;
  $("#bk").onclick=startScreen;$("#t1").onclick=()=>parLogin(false);$("#t2").onclick=()=>parLogin(true);
  const fg=$("#fg");if(fg)fg.onclick=async()=>{const em=$("#pe").value.trim();if(!em){$("#pr").textContent=AT("needAll");return}
    try{await sb("/auth/v1/recover",{body:{email:em}});$("#po").textContent=AT("resetSent")}catch(x){$("#pr").textContent=x.net?AT("eNet"):x.message}};
  $("#pf").onsubmit=async e=>{e.preventDefault();const em=$("#pe").value.trim(),pw=$("#pw").value,er=$("#pr");er.textContent="";$("#po").textContent="";
    if(!em||pw.length<8){er.textContent=AT("needAll");return}
    try{if(signup){const j=await sb("/auth/v1/signup",{body:{email:em,password:pw}});if(j&&j.access_token){parKeep(j);parentHome()}else $("#po").textContent=AT("confirmMail")}
      else{const j=await sb("/auth/v1/token?grant_type=password",{body:{email:em,password:pw}});parKeep(j);parentHome()}}
    catch(x){er.textContent=x.net?AT("eNet"):signup?x.message:AT("eLoginPar")}}}
async function parentHome(){screen=parentHome;leave();ACC.view=null;
  if(String(S.id||"").startsWith("db-")){S=Object.assign(fresh(),{id:newId(),lang})}hud();
  app.innerHTML=`<div class="stack acc"><p class="muted">…</p></div>`;
  let fam,kids;try{const t=await parTok();fam=await rpc("my_family",{},t);kids=await sb("/rest/v1/kids?select=id,name,grade,state,upd&order=name",{method:"GET",auth:t})}
  catch(x){if(x.status===401||x.status===400){accParOut();return}app.innerHTML=`<div class="stack acc"><p class="err">${AT("eNet")}</p><button class="btn" id="rt">↻</button></div>`;$("#rt").onclick=parentHome;return}
  if(screen!==parentHome)return;
  const local=kidList().filter(k=>!String(k.id).startsWith("db-")&&!kids.some(r=>r.name.toLowerCase()===k.name.toLowerCase()));
  const done=r=>Object.values((r.state||{}).lessons||{}).filter(x=>x.stars||x.known).length;
  app.innerHTML=`<div class="stack acc">
   <section class="panel stack" style="gap:8px"><h2>👪 ${AT("famT")}</h2><p class="muted">${AT("famShow")}</p><div><span class="muted">${AT("famCode")}:</span> <span class="code">${esc(fam.code)}</span></div></section>
   <section class="panel stack" style="gap:4px"><h3>${AT("kidsT")}</h3>${kids.length?kids.map(r=>`<div class="krow" data-k="${r.id}"><b>👤 ${esc(r.name)}</b><span class="muted">${T("gradeChip")(r.grade||"?")} · ★ ${((r.state||{}).xp)||0} · ${AT("lessonsDone")(done(r))}</span><span class="sp"></span>
      <button class="btn" data-a="study">${AT("studyHere")}</button><button class="btn ghost" data-a="rep">${AT("report")}</button><button class="btn ghost" data-a="pin">${AT("newPin")}</button><button class="btn ghost" data-a="del">🗑</button></div>`).join(""):`<p class="muted">${AT("noKids")}</p>`}</section>
   ${local.length?`<section class="panel stack" style="gap:4px"><h3>${AT("moveT")}</h3><p class="muted">${AT("moveS")}</p>${local.map(k=>`<div class="krow"><b>👤 ${esc(k.name)}</b><span class="muted">${T("gradeChip")(k.grade)} · ★ ${k.xp}</span><span class="sp"></span><button class="btn ghost" data-mv="${k.id}">${AT("moveBtn")}</button></div>`).join("")}</section>`:""}
   <form class="panel stack" id="af"><h3>${AT("addKid")}</h3>
    <label for="an2">${AT("kidName")}</label><input type="text" id="an2" maxlength="30">
    <span class="label">${AT("kidGrade")}</span><div class="grades" id="ag">${[4,5,6,7,8,9].map(g=>`<button type="button" data-g="${g}" aria-pressed="false">${g}</button>`).join("")}</div>
    <label for="ap2">${AT("pin")}</label><input type="password" id="ap2" inputmode="numeric" maxlength="4" autocomplete="new-password">
    <p class="err" id="ae"></p><div class="row"><button class="btn" type="submit">${AT("add")}</button></div></form>
   <p class="muted">${esc(ACC.par.email)} · <button class="linkb" id="lo">${AT("logout")}</button></p></div>`;
  let g=null,mv=null;const pickG=v=>{g=v;app.querySelectorAll("#ag button").forEach(x=>x.setAttribute("aria-pressed",+x.dataset.g===g))};
  app.querySelectorAll("#ag button").forEach(b=>b.onclick=()=>pickG(+b.dataset.g));
  app.querySelectorAll("[data-mv]").forEach(b=>b.onclick=()=>{const k=PROF.kids[b.dataset.mv];mv=k;$("#an2").value=k.name;pickG(k.grade);$("#ap2").focus()});
  $("#af").onsubmit=async e=>{e.preventDefault();const n=$("#an2").value.trim(),pn=$("#ap2").value.trim(),er=$("#ae");er.textContent="";
    if(n.length<2||!g){er.textContent=AT("needAll");return}if(!/^\d{4}$/.test(pn)){er.textContent=AT("needPin");return}
    const st=mv&&mv.name.toLowerCase()===n.toLowerCase()?Object.assign(JSON.parse(JSON.stringify(mv)),{name:n,grade:g}):Object.assign(fresh(),{name:n,grade:g,lang});delete st.id;
    try{await rpc("add_kid",{p_name:n,p_pin:pn,p_grade:g,p_state:st},await parTok());if(mv){delete PROF.kids[mv.id];if(PROF.cur===mv.id)PROF.cur=null;saveLocal()}toast(AT("added"));parentHome()}
    catch(x){er.textContent=x.net?AT("eNet"):x.message}};
  app.querySelectorAll(".krow[data-k]").forEach(row=>{const r=kids.find(x=>x.id===row.dataset.k);
    row.querySelector('[data-a="study"]').onclick=()=>{ACC.view=r.id;accUse(r);hud();map()};
    row.querySelector('[data-a="rep"]').onclick=()=>{ACC.view=r.id;accUse(r);hud();parents()};
    row.querySelector('[data-a="pin"]').onclick=async()=>{const pn=prompt(AT("pin"));if(pn==null)return;if(!/^\d{4}$/.test(pn.trim())){toast(AT("needPin"));return}
      try{await rpc("set_kid_pin",{p_kid:r.id,p_pin:pn.trim()},await parTok());toast(AT("pinSet"))}catch(x){toast(x.net?AT("eNet"):x.message)}};
    const d=row.querySelector('[data-a="del"]');d.onclick=async()=>{if(!d.dataset.sure){d.dataset.sure=1;d.textContent="🗑 "+AT("delSure")+" "+r.name;d.classList.add("bad");return}
      try{await sb("/rest/v1/kids?id=eq."+r.id,{method:"DELETE",auth:await parTok()});delete PROF.kids["db-"+r.id];saveLocal();parentHome()}catch(x){toast(x.net?AT("eNet"):x.message)}}});
  $("#lo").onclick=accParOut}

/* ---------- opening the app on the public site ---------- */
function accStart(){
  if(window.claude&&typeof window.claude.use==="function")return false;   /* inside Claude: the Claude account keeps the progress */
  if(location.protocol==="file:"&&!window.LARL_ACC)return false;          /* a file opened from disk (and the older tests) stays local */
  ACC.on=true;ACC.kid=aget(AKEY.kid);ACC.par=aget(AKEY.par);
  if(ACC.kid){const k=ACC.kid,id="db-"+k.id;if(PROF.kids[id]){useKid(id);picked=true;hud();map()}else{app.innerHTML=`<div class="stack acc"><p class="muted">…</p></div>`}
    rpc("kid_load",{p_token:k.token}).then(j=>{if(!j){accKidOut();return}const was=screen;accUse(j);hud();if(!active)(was===map||!PROF.kids[id]?map():screen())}).catch(()=>{if(!PROF.kids[id])startScreen()});return true}
  if(ACC.par){parentHome();return true}
  if(aget(AKEY.local))return false;
  startScreen();return true}

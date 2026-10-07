// Accounts on the public site, against a fake Supabase: parent signs up and adds children, a child logs in with code+name+PIN,
// progress is saved to the database, the parent studies/reports per child, local children move into the account, PIN lockout.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/acc';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};
/* ---- fake Supabase ---- */
const db={users:[],tok:{},fam:[],kids:[],ks:{}};let n=0;const uid=()=>'u'+(++n)+'-'+Math.random().toString(36).slice(2,8);
const sess=u=>{const a='a'+uid(),r='r'+uid();db.tok[a]=u.id;db.tok[r]=u.id;return{access_token:a,refresh_token:r,expires_in:3600,user:{id:u.id,email:u.email}}};
function fake(method,path,q,body,auth){const who=auth&&db.tok[auth];
 if(path==='/auth/v1/signup'){if(db.users.some(u=>u.email===body.email))return[400,{msg:'User already registered'}];const u={id:uid(),email:body.email,pw:body.password};db.users.push(u);return[200,sess(u)]}
 if(path==='/auth/v1/token'&&q.get('grant_type')==='password'){const u=db.users.find(u=>u.email===body.email&&u.pw===body.password);return u?[200,sess(u)]:[400,{error_description:'Invalid login credentials'}]}
 if(path==='/auth/v1/token'){const u=db.users.find(u=>u.id===db.tok[body.refresh_token]);return u?[200,sess(u)]:[400,{error:'bad'}]}
 if(path==='/auth/v1/logout')return[204,null];
 const fn=path.startsWith('/rest/v1/rpc/')?path.slice(13):null;
 const myFam=()=>{let f=db.fam.find(f=>f.owner===who);if(!f){f={id:uid(),owner:who,code:'K7QX3M'.slice(0,5)+db.fam.length};db.fam.push(f)}return f};
 if(fn==='my_family'){if(!who)return[401,{message:'jwt'}];return[200,myFam()]}
 if(fn==='add_kid'){if(!who)return[401,{}];const f=myFam();if(db.kids.some(k=>k.family_id===f.id&&k.name.toLowerCase()===body.p_name.toLowerCase()))return[409,{message:'duplicate key'}];
  const k={id:uid(),family_id:f.id,name:body.p_name,pin:body.p_pin,grade:body.p_grade,state:body.p_state||{},upd:(body.p_state||{}).upd||0,fails:0,locked:0};db.kids.push(k);return[200,k.id]}
 if(fn==='set_kid_pin'){const k=db.kids.find(k=>k.id===body.p_kid);k.pin=body.p_pin;return[200,null]}
 const pub=k=>({id:k.id,name:k.name,grade:k.grade,state:k.state,upd:k.upd});
 if(fn==='kid_login'){const f=db.fam.find(f=>f.code===body.p_code.toUpperCase());const k=f&&db.kids.find(k=>k.family_id===f.id&&k.name.toLowerCase()===body.p_name.toLowerCase());
  if(!k)return[200,{error:'unknown'}];if(k.locked>Date.now())return[200,{error:'locked'}];
  if(k.pin!==body.p_pin){k.fails++;if(k.fails>=5)k.locked=Date.now()+600000;return[200,{error:'pin'}]}k.fails=0;const t='t'+uid();db.ks[t]=k.id;return[200,Object.assign({token:t},pub(k))]}
 if(fn==='kid_load'){const k=db.kids.find(k=>k.id===db.ks[body.p_token]);return[200,k?pub(k):null]}
 if(fn==='kid_save'){const k=db.kids.find(k=>k.id===db.ks[body.p_token]);if(!k)return[200,false];k.state=body.p_state;k.upd=body.p_upd;return[200,true]}
 if(fn==='kid_logout'){delete db.ks[body.p_token];return[204,null]}
 if(path==='/rest/v1/kids'){if(!who)return[401,{}];const f=db.fam.find(f=>f.owner===who);const mine=db.kids.filter(k=>f&&k.family_id===f.id);
  if(method==='GET')return[200,mine.map(pub).sort((a,b)=>a.name.localeCompare(b.name))];
  const id=(q.get('id')||'').replace('eq.','');const k=mine.find(k=>k.id===id);if(!k)return[200,[]];
  if(method==='PATCH'){Object.assign(k,body);return[204,null]}if(method==='DELETE'){db.kids=db.kids.filter(x=>x!==k);return[204,null]}}
 return[404,{message:'no '+method+' '+path}]}
(async()=>{const b=await chromium.launch();const pages=[];
const mk=async(seed,w=1100,h=900)=>{const c=await b.newContext({viewport:{width:w,height:h},reducedMotion:'reduce'});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));pages.push(p);
 p.on('dialog',d=>d.accept(p.nextPrompt||''));
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 await p.route(/supabase\.co/,r=>{const u=new URL(r.request().url()),rq=r.request();const auth=(rq.headers()['authorization']||'').replace('Bearer ','');
  const [st,j]=fake(rq.method(),u.pathname,u.searchParams,rq.postData()?JSON.parse(rq.postData()):null,auth);
  r.fulfill({status:st,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:j==null?'':JSON.stringify(j)})});
 await p.addInitScript(seed=>{window.LARL_ACC=1;if(seed)localStorage.setItem("larlabbet-kids",seed)},seed);
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(700);return p};
const W=ms=>new Promise(r=>setTimeout(r,ms));
/* parent signs up and adds two children */
const A=await mk(null);
ok(!!await A.$('#ak')&&!!await A.$('#ap'),'start screen: student / parent / try');await A.screenshot({path:D+'/1-start.png'});
await A.click('#ap');await A.click('#t2');await A.fill('#pe','dad@example.com');await A.fill('#pw','hemligt123');await A.click('#pf button[type=submit]');await A.waitForTimeout(500);
const code=await A.$eval('.code',e=>e.textContent);ok(/^K7QX3/.test(code),'parent home shows family code '+code);
for(const [nm,g,pin] of [['Sara',7,'1234'],['Omar',5,'5678']]){await A.fill('#an2',nm);await A.click(`#ag button[data-g="${g}"]`);await A.fill('#ap2',pin);await A.click('#af button[type=submit]');await A.waitForTimeout(500)}
ok((await A.$$eval('.krow[data-k]',e=>e.map(x=>x.querySelector('b').textContent))).join()==='👤 Omar,👤 Sara','two children listed');await A.screenshot({path:D+'/2-parent.png'});
ok(db.kids.every(k=>k.pin&&!('pin_hash' in k)),'children stored');
/* the child logs in on another device */
const B=await mk(null,390,844);await B.click('#ak');await B.fill('#kc',code.toLowerCase());await B.fill('#kn','sara');await B.fill('#kp','0000');await B.click('#kf button[type=submit]');await B.waitForTimeout(300);
ok(/PIN/.test(await B.textContent('#ke')),'wrong PIN message: '+await B.textContent('#ke'));
await B.fill('#kp','1234');await B.click('#kf button[type=submit]');await B.waitForTimeout(600);
ok(await B.evaluate(()=>S.name==='Sara'&&S.grade===7&&S.id.startsWith('db-')),'Sara logged in, grade 7');await B.screenshot({path:D+'/3-kid-map.png'});
await B.evaluate(()=>{S.lessons.int7={stars:3,level:1};S.xp=60;save()});await B.waitForTimeout(1900);
ok(db.kids.find(k=>k.name==='Sara').state.lessons.int7.stars===3,'progress saved to the database');
await B.reload();await B.waitForTimeout(900);ok(await B.evaluate(()=>S.name==='Sara'&&S.lessons.int7&&screen===map),'reload keeps the child logged in');
/* parent sees it and studies as Omar */
await A.evaluate(()=>parentHome());await A.waitForTimeout(500);
const sara=await A.$$eval('.krow[data-k]',e=>e.map(x=>x.textContent).find(t=>t.includes('Sara')));ok(/★ 60/.test(sara)&&/1 lektion/.test(sara),'parent sees Sara progress: '+sara.replace(/\s+/g,' ').slice(0,60));
const oid=db.kids.find(k=>k.name==='Omar').id;await A.click(`.krow[data-k="${oid}"] [data-a="study"]`);await A.waitForTimeout(400);
ok(await A.evaluate(()=>S.name==='Omar'&&screen===map),'parent device studies as Omar');
await A.evaluate(()=>{S.lessons.neg={stars:2};save()});await A.waitForTimeout(1900);ok(db.kids.find(k=>k.name==='Omar').state.lessons.neg.stars===2,'Omar saved through parent');
await A.click('#accp');await A.waitForTimeout(500);const sid=db.kids.find(k=>k.name==='Sara').id;await A.click(`.krow[data-k="${sid}"] [data-a="rep"]`);await A.waitForTimeout(400);
ok(await A.$eval('.course h2',e=>e.textContent==='Sara'),'report for Sara');
/* change PIN, child logs out */
await A.click('#accp');await A.waitForTimeout(500);A.nextPrompt='4321';await A.click(`.krow[data-k="${sid}"] [data-a="pin"]`);await A.waitForTimeout(300);ok(db.kids.find(k=>k.name==='Sara').pin==='4321','PIN changed');
await B.click('#who');await B.click('#kmo');await B.waitForTimeout(300);ok(!!await B.$('#ak')&&await B.evaluate(()=>!localStorage.getItem('larlabbet-kid')),'child logged out');
/* lockout */
await B.click('#ak');await B.fill('#kn','Omar');for(let k=0;k<6;k++){await B.fill('#kp','9999');await B.click('#kf button[type=submit]');await B.waitForTimeout(150)}
ok(/10/.test(await B.textContent('#ke')),'locked after 5 wrong PINs: '+await B.textContent('#ke'));
/* a child who only lived on this device moves into the account */
const C=await mk(JSON.stringify({cur:'k1',kids:{k1:{name:'Lina',grade:6,xp:90,lang:'sv',lessons:{prime6:{stars:3}},upd:5}},gone:{}}));
ok(!!await C.$('#ak'),'device with local child still starts at login');
await C.click('#ap');await C.fill('#pe','dad@example.com');await C.fill('#pw','hemligt123');await C.click('#pf button[type=submit]');await C.waitForTimeout(600);
ok(!!await C.$('[data-mv="k1"]'),'parent offered to move Lina');await C.click('[data-mv="k1"]');await C.fill('#ap2','1111');await C.click('#af button[type=submit]');await C.waitForTimeout(600);
const lina=db.kids.find(k=>k.name==='Lina');ok(lina&&lina.state.lessons.prime6.stars===3&&lina.state.xp===90,'Lina moved with her progress');
ok(!await C.$('[data-mv]'),'nothing left to move');
/* parent logs out */
await C.click('#lo');await C.waitForTimeout(300);ok(!!await C.$('#ap')&&await C.evaluate(()=>!Object.keys(PROF.kids).some(k=>k.startsWith('db-'))),'parent logged out, no account children left on device');
/* try without an account */
await C.click('#al');ok(await C.evaluate(()=>screen===welcome||screen===who||screen===map),'try without account opens the local app');
for(const p of pages)ok(!p.errs.length,'no page errors '+p.errs.join('|'));
await b.close()})();

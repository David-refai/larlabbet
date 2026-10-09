const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
// "I don't get it" help scenes and practice hints for every maths lesson of one year (YEAR=4 default; IDS=a,b to test some)
const LANG=process.argv[2]||'sv',D='build/shots2',Y=+(process.env.YEAR||4);require('fs').mkdirSync(D,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:900,height:1100},reducedMotion:'reduce'});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(800);
await p.click(`#langs button[data-l="${LANG}"]`);await p.fill('#nm','Test');await p.click(`#gr button[data-g="${Y}"]`);await p.click('#go');
let ids=await p.evaluate((Y)=>(Y=>LESSONS.filter(l=>l.year===Y&&l.subject==='math'))(Y).sort((a,b)=>a.ord-b.ord).map(l=>l.id),Y);if(process.env.IDS)ids=process.env.IDS.split(',');
for(const id of ids){await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(300);
 await p.click('#help');await p.waitForTimeout(400);let h=0;
 while(true){await (await p.$('#stage')).screenshot({path:`${D}/${LANG}-${id}-h${h}.png`});if(h===0&&id==='pv4')await p.screenshot({path:`${D}/${LANG}-help-full.png`});const m=await p.$('#hmore');if(!m)break;await m.click();await p.waitForTimeout(300);h++}
 await p.click('#hback');await p.waitForTimeout(300);
 const st=await p.evaluate(()=>[document.querySelector('#next').hidden,document.querySelector('#help').hidden]);
 if(id!=='triangle'){for(let lv=0;lv<3;lv++){await p.evaluate(([id,lv])=>{S.lessons[id]={stars:0,level:lv};save()},[id,lv]);await p.click('#back');await p.click(`.card[data-l="${id}"]`);await p.waitForTimeout(200);
  for(let k=0;k<10&&!(await p.$('#chk')||await p.$('.ch'));k++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(150)}
  await p.click('#help');await p.waitForTimeout(300);await (await p.$('#stage')).screenshot({path:`${D}/${LANG}-${id}-hint${lv}.png`});
  if(id==='sub'&&lv===1)await p.screenshot({path:`${D}/${LANG}-hint-full.png`});
  const t=await p.textContent('#say');console.log(id,lv,'hint:',t.slice(0,60))}}
 console.log(id,'after help back: next hidden',st[0],'help hidden',st[1]);await p.click('#back')}
console.log('errors',errs);await b.close()})();

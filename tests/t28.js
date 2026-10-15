// "Utforska kroppen" in real 3D (React Three Fiber, WebGL through SwiftShader here). The canvas opens,
// a drag turns the body all the way round, the reset button brings the camera back, layers fade in
// and out, tapping the heart selects it (card + "Förenklad modell" note), Isolera centres it, the
// heart's detail view has its labels and flowing blood (still under reduced motion), the lungs and
// brain details open, the translation shows, the way back works, one screen without scrolling,
// no page errors and no console errors, the canvas goes away when the explorer closes. Also: the
// heart's walls keep the right and left heart apart (tests/heart-check.js), switching the translation
// with an organ picked keeps its name tag, a missing or broken GLB model falls back to the procedural
// one silently (a working one is used), and without WebGL (or when the 3D context cannot be made)
// the SVG explorer is shown.
const {chromium}=require(process.env.PW);const fs=require('fs');
const fmap=Object.fromEntries(fs.readFileSync('tests/fonts/fontmap.txt','utf8').trim().split('\n').map(l=>l.split(' ')));
const D='build/explorer3d';fs.mkdirSync(D,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1};

/* a tiny glTF (one triangle) as a data URL: a GLB slot that loads */
const tri=(()=>{const b=Buffer.alloc(36);[0,0,0,1,0,0,0,1,0].forEach((v,i)=>b.writeFloatLE(v,i*4));
 const g={asset:{version:'2.0'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0,name:'liver'}],
  meshes:[{primitives:[{attributes:{POSITION:0},material:0}]}],materials:[{pbrMetallicRoughness:{baseColorFactor:[.6,.2,.15,1]}}],
  accessors:[{bufferView:0,componentType:5126,count:3,type:'VEC3',min:[0,0,0],max:[1,1,0]}],bufferViews:[{buffer:0,byteLength:36}],
  buffers:[{byteLength:36,uri:'data:application/octet-stream;base64,'+b.toString('base64')}]};
 return 'data:model/gltf+json;base64,'+Buffer.from(JSON.stringify(g)).toString('base64')})();

(async()=>{
/* the heart's geometry: no hole between the right and the left heart, the septum label on the wall */
for(const [c,m] of await require('./heart-check')())ok(c,'heart model: '+m);
const b=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const open=async(w,h,rm,init,br=b,wait3d=true)=>{
 const p=await br.newPage({viewport:{width:w,height:h},reducedMotion:rm});p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
 p.cerrs=[];p.on('console',m=>{if(m.type()==='error')p.cerrs.push(m.text().slice(0,160))});
 await p.route(/jsdelivr.*d3/,r=>r.fulfill({body:fs.readFileSync('tests/vendor/d3.min.js','utf8'),contentType:'application/javascript'}));
 await p.route(/fonts\.googleapis/,r=>r.fulfill({body:fs.readFileSync('tests/fonts/fonts.css','utf8'),contentType:'text/css'}));
 await p.route(/fonts\.gstatic/,r=>{const f=fmap[r.request().url()];f?r.fulfill({body:fs.readFileSync(f),contentType:'font/woff2'}):r.abort()});
 if(init)await p.addInitScript(init);
 await p.goto('file://'+process.cwd()+'/build/test.html');await p.waitForTimeout(500);
 await p.fill('#nm','Test');await p.click('#gr button[data-g="4"]');await p.click('#go');await p.waitForTimeout(300);
 await p.click('.tab[data-t="bio"]');await p.waitForTimeout(200);
 await p.click('#texplore');
 if(wait3d)await p.waitForFunction(()=>window.__ex3d&&window.__ex3d.state.ready,null,{timeout:60000}).catch(()=>{});
 await p.waitForTimeout(600);
 return p;
};
const st=p=>p.evaluate(()=>window.__ex3d.state);
/* do the drops move? (a slow software-GPU frame can take a while, so look for up to 4 s; with reduced motion look for 1.5 s) */
const movesIn=async(p,a,ms)=>{if(!a.length)return false;const t0=Date.now();while(Date.now()-t0<ms){await p.waitForTimeout(300);const b=await p.evaluate(()=>window.__ex3d.particles());if(a.some((v,i)=>Math.abs(v-b[i])>1e-4))return true}return false};
const settle=async(p,ms=1200)=>{await p.waitForTimeout(ms);await p.waitForFunction(()=>!window.__ex3d.state.camera.tweening,null,{timeout:20000}).catch(()=>{});await p.waitForTimeout(200)};
/* wait (up to 10 s) until all the named labels show; returns the labels on show */
const visLabels=p=>p.$$eval('.x3labels .xlab',e=>e.filter(x=>getComputedStyle(x).visibility==='visible').map(x=>x.getAttribute('aria-label')));
const waitLabels=async(p,names)=>{await p.waitForFunction(n=>{const v=[...document.querySelectorAll('.x3labels .xlab')].filter(x=>getComputedStyle(x).visibility==='visible').map(x=>x.getAttribute('aria-label'));return n.every(k=>v.includes(k))},names,{timeout:10000}).catch(()=>{});return visLabels(p)};
const fadeTo=(p,k,v)=>p.waitForFunction(([k,v])=>{const l=window.__ex3d.state.layers[k];return l&&Math.abs(l.opacity-v)<.02},[k,v],{timeout:20000}).then(()=>true,()=>false);

for(const [w,h,tag,rm] of [[1366,768,'laptop','no-preference'],[390,844,'phone','reduce']]){
 const p=await open(w,h,rm);const still=rm==='reduce';const moves=a=>movesIn(p,a,still?1500:4000);
 const noScroll=async n=>{const s=await p.evaluate(()=>({h:document.documentElement.scrollHeight,w:document.documentElement.scrollWidth,ih:innerHeight,iw:innerWidth}));
  ok(s.h<=s.ih+1&&s.w<=s.iw+1,`${tag} ${n}: one screen, no page scroll ${JSON.stringify(s)}`)};

 /* the canvas */
 ok(!!(await p.$('.xstage.x3d canvas')),tag+' the 3D explorer opens a WebGL canvas');
 ok(!(await p.$('.xstage svg.xbody')),tag+' (not the 2D one)');
 let s=await st(p);
 ok(s.ready&&s.mode==='body',tag+' ready, mode A (Kroppen) '+s.mode);
 ok(s.layers.skin.opacity>.99&&s.layers.shell.opacity<.01,tag+' the warm skin shows, no see-through shell');
 ok(s.still===still,tag+' reduced motion is '+(still?'on':'off'));
 ok(await p.isVisible('#x3reset')&&(await p.textContent('#x3reset')).includes('Återställ kameran'),tag+' a visible "Återställ kameran" button');
 const steps=await p.$$eval('.xsteps button',e=>e.map(x=>x.textContent.replace(/\d/g,'').trim()));
 ok(steps.join()==='Kroppen,Inuti,Organ,Detaljer',tag+' four mode tabs '+steps);
 await noScroll('mode A');
 await p.screenshot({path:`${D}/t28-${tag}-A.png`});

 /* turning: a drag goes past 90 degrees (and on round), reset comes back */
 const pos0=s.camera.position;
 const bb=await (await p.$('.xstage canvas')).boundingBox();
 const drag=async dx=>{const x=bb.x+bb.width/2,y=bb.y+bb.height/2;await p.mouse.move(x,y);await p.mouse.down();for(let i=1;i<=15;i++){await p.mouse.move(x+dx*i/15,y);await p.waitForTimeout(25)}await p.mouse.up();await p.waitForTimeout(700)};
 await drag(-bb.height*.45);
 s=await st(p);const deg=s.camera.azimuth*180/Math.PI;
 ok(Math.abs(deg)>90,tag+` a drag turns the body more than 90° (${deg.toFixed(0)}°)`);
 await drag(-bb.height*.45);await drag(-bb.height*.45);
 s=await st(p);const deg2=s.camera.azimuth*180/Math.PI;
 ok(Math.abs(deg2)>300,tag+` it goes on all the way round (${deg2.toFixed(0)}°)`);
 await p.screenshot({path:`${D}/t28-${tag}-A-turned.png`});
 await p.click('#x3reset');await settle(p);
 s=await st(p);
 const az=((s.camera.azimuth%(2*Math.PI))+3*Math.PI)%(2*Math.PI)-Math.PI;
 const dpos=Math.hypot(...s.camera.position.map((v,i)=>v-pos0[i]));
 ok(Math.abs(az)<.03&&dpos<.05,tag+` reset brings the camera back (az ${az.toFixed(3)}, moved ${dpos.toFixed(3)})`);

 /* mode B: inside, layers */
 await p.click('.xsteps button[data-s="inside"]');
 ok(await fadeTo(p,'skin',0)&&await fadeTo(p,'shell',1),tag+' Inuti: the skin fades to the see-through shell');
 ok(await fadeTo(p,'heart',1),tag+' the organs show');s=await st(p);ok(s.mode==='inside',tag+' the mode is Inuti');
 ok(s.camera.position.every((v,i)=>Math.abs(v-pos0[i])<.05),tag+' the body (and camera) stays where it was');
 await p.click('.xchip[data-layer="skeleton"]');
 ok(await p.$eval('.xchip[data-layer="skeleton"]',e=>e.getAttribute('aria-pressed'))==='true',tag+' skeleton button aria-pressed=true');
 ok(await fadeTo(p,'skeleton',1),tag+' the skeleton fades in');
 ok(await p.evaluate(()=>{let n=0;window.__ex3dThree.scene.getObjectByName('slot:skeleton').traverse(o=>{if(o.isMesh)n++});return n>5}),tag+' the skeleton is real meshes');
 await p.click('.xchip[data-layer="organs"]');
 ok(await fadeTo(p,'heart',0),tag+' organs off: the heart fades out');
 await p.screenshot({path:`${D}/t28-${tag}-B-skeleton.png`});
 await p.click('.xchip[data-layer="skeleton"]');await p.click('.xchip[data-layer="organs"]');
 ok(await fadeTo(p,'skeleton',0)&&await fadeTo(p,'heart',1),tag+' skeleton off, organs back');
 await noScroll('mode B');

 /* mode C: tap the heart in 3D */
 await settle(p,300);
 const pt=await p.evaluate(()=>window.__ex3d.point('heart'));
 ok(!!pt,tag+' the heart can be found on screen '+JSON.stringify(pt));
 if(pt)await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(500);
 s=await st(p);
 ok(s.selected==='heart',tag+' tapping the heart selects it ('+s.selected+')');
 ok((await p.textContent('#xname')).includes('Hjärtat'),tag+' the card shows "Hjärtat"');
 ok(await p.waitForFunction(()=>{const t=document.querySelector('#x3tag');return t&&!t.hidden&&getComputedStyle(t).visibility==='visible'},null,{timeout:8000}).then(()=>true,()=>false)&&(await p.textContent('#x3tag')).includes('Hjärtat'),tag+' its name shows in the scene');
 ok(await p.isVisible('#x3note')&&(await p.textContent('#x3note')).includes('Förenklad modell – formen är förenklad för att visa hur det fungerar'),tag+' the "Förenklad modell" note');
 await p.click('#xiso');await settle(p,1500);
 s=await st(p);
 ok(s.mode==='organ'&&s.isolated==='heart',tag+' Isolera: mode C, the heart alone');
 ok(await fadeTo(p,'liver',0)&&s.layers.heart.to===1,tag+' the other organs fade away');
 const c=await p.evaluate(()=>{const t=window.__ex3dThree,c=t.controls.target;const r=t.gl.domElement.getBoundingClientRect();const pt=window.__ex3d.point('heart');return{d:Math.hypot(c.x-.08,c.y-6.5,c.z-.19),dx:pt?Math.abs(pt.x-(r.left+r.width/2))/r.width:1,dy:pt?Math.abs(pt.y-(r.top+r.height/2))/r.height:1,dist:window.__ex3d.state.camera.distance}});
 ok(c.d<.05&&c.dx<.3&&c.dy<.3&&c.dist<10,tag+' the camera centres on the heart and comes close '+JSON.stringify(c));
 ok(await p.isVisible('#xwhole')&&(await p.textContent('#xwhole')).includes('Tillbaka till hela kroppen'),tag+' "Tillbaka till hela kroppen" in mode C');
 await p.screenshot({path:`${D}/t28-${tag}-C-heart.png`});await noScroll('mode C');

 /* mode D: the heart */
 await p.click('#xmorebtn');await settle(p,1500);
 s=await st(p);ok(s.mode==='detail'&&s.detail==='heart'&&s.tab==='oversikt',tag+' Detaljer: the heart, Översikt');
 const HL=['Höger förmak','Vänster kammare','Aorta','Lungartär','Hålvener','Lungvener'];
 let L=await waitLabels(p,HL);
 ok(HL.every(n=>L.includes(n)),tag+' heart labels on the model: '+L.join(', '));
 ok(await p.isVisible('#x3note'),tag+' the note in the detail view');
 const tabs=await p.$$eval('[role=tab][data-tab]',e=>e.map(x=>x.textContent));
 ok(tabs.join()==='Översikt,Kammare,Klaffar,Blodflöde',tag+' heart tabs '+tabs);
 await p.click('[data-tab="kammare"]');await settle(p);
 L=await waitLabels(p,['Skiljevägg','Höger kammare']);ok(L.includes('Skiljevägg')&&L.includes('Höger kammare'),tag+' Kammare: the cut-open heart with its chambers and septum');
 /* the septum label sits on the wall between the ventricles (heart-check.js tests the same point in the model) */
 const sa=await p.evaluate(()=>window.__ex3d.anchor('skiljevagg'));
 ok(!!sa&&Math.abs(sa[0])<.2&&sa[1]<-.1&&sa[1]>-.6,tag+' the Skiljevägg label point is between the ventricles '+JSON.stringify(sa&&sa.map(v=>+v.toFixed(3))));
 await p.click('[data-tab="klaffar"]');await settle(p);
 const VL=['Trikuspidalklaff','Mitralisklaff','Pulmonalisklaff','Aortaklaff'];L=await waitLabels(p,VL);ok(VL.every(n=>L.includes(n)),tag+' Klaffar: four valves');
 await p.click('.x3labels .xlab[data-part="k-tri"]');await p.waitForTimeout(300);
 ok((await p.textContent('#xname')).includes('Trikuspidalklaff'),tag+' tapping a label explains that part');
 await p.click('[data-tab="flode"]');await settle(p);
 const a=await p.evaluate(()=>window.__ex3d.particles());const moved=await moves(a);
 ok(a.length>=6,tag+' Blodflöde: blood drops along the paths');
 ok(still?!moved:moved,tag+(still?' the drops stand still (reduced motion)':' the drops move'));
 if(!still){await p.click('#xplay');await p.waitForTimeout(300);const b1=await p.evaluate(()=>window.__ex3d.particles());await p.waitForTimeout(500);const b2=await p.evaluate(()=>window.__ex3d.particles());
  ok(b1.every((v,i)=>v===b2[i]),tag+' Pausa stops them');await p.click('#xplay');}
 await p.screenshot({path:`${D}/t28-${tag}-D-heart-flode.png`});await noScroll('heart detail');

 /* translation (the app redraws the explorer in place) */
 await p.click('#langs button[data-l="en"]');await p.waitForFunction(()=>window.__ex3d&&window.__ex3d.state.ready,null,{timeout:60000});await p.waitForTimeout(800);
 s=await st(p);ok(s.detail==='heart',tag+' after switching the translation the heart detail is still open');
 ok((await p.textContent('#xinfo')).includes('Simplified model'),tag+' English translation of the note');
 await p.click('[data-tab="kammare"]').catch(()=>{});await p.waitForTimeout(300);
 await p.click('.x3labels .xlab[data-part="hk"]').catch(()=>{});await p.waitForTimeout(300);
 ok((await p.textContent('#xinfo')).includes('Right ventricle'),tag+' English name of the part');
 await p.click('#langs button[data-l="ar"]');await p.waitForFunction(()=>window.__ex3d&&window.__ex3d.state.ready,null,{timeout:60000});await p.waitForTimeout(800);
 ok((await p.textContent('#xinfo')).includes('نموذج مبسّط'),tag+' Arabic translation of the note');
 await p.click('#langs button[data-l="sv"]');await p.waitForFunction(()=>window.__ex3d&&window.__ex3d.state.ready,null,{timeout:60000});await p.waitForTimeout(800);

 /* the lungs and the brain */
 for(const [o,first,names] of [['lungs','vagar',['Luftstrupe','Luftrör','Höger lunga','Vänster lunga']],['brain','delar',['Storhjärna','Lillhjärna','Hjärnstam','Ryggmärg']]]){
  await p.click('#xwhole');await settle(p,800);
  await p.click(`.xorgs [data-organ="${o}"]`);await p.waitForTimeout(300);await p.click('#xmorebtn');await settle(p,1500);
  s=await st(p);L=await waitLabels(p,names);
  ok(s.detail===o&&s.tab===first,tag+` the ${o} detail opens (${s.tab})`);
  ok(names.every(n=>L.includes(n)),tag+` ${o} labels: `+L.join(', '));
  ok(s.partSources[o+'-detail']==='procedural',tag+` ${o} detail is the procedural model`);
  await p.screenshot({path:`${D}/t28-${tag}-D-${o}.png`});
 }
 await p.click('[data-tab="signal"]');await settle(p);
 L=await waitLabels(p,['Nervsignaler']);ok(L.includes('Nervsignaler'),tag+' brain Signaler tab');
 await p.click('#xwhole');await settle(p,800);await p.click('.xorgs [data-organ="lungs"]');await p.waitForTimeout(300);await p.click('#xmorebtn');await settle(p,1200);
 await p.click('[data-tab="blasor"]');await settle(p);
 const BL=['Lungblåsor','Syre in','Koldioxid ut','Små blodkärl'];L=await waitLabels(p,BL);ok(BL.every(n=>L.includes(n)),tag+' Lungblåsor: air sacs, oxygen, carbon dioxide, tiny vessels');
 await p.click('[data-tab="luft"]');await settle(p);
 const q1=await p.evaluate(()=>window.__ex3d.particles());const qm=await moves(q1);
 ok(still?!qm:qm,tag+' Luftflöde: '+(still?'the air stands still':'air moves in and out'));
 if(!still)ok(await p.isVisible('#x3phase'),tag+' "Andas in / Andas ut" shows');
 await noScroll('lungs detail');

 /* back to the whole body, then to Kroppen */
 await p.click('#xwhole');await settle(p,1000);
 s=await st(p);ok(s.mode==='inside'&&!s.detail&&!s.selected,tag+' "Tillbaka till hela kroppen" returns to the whole body');
 await p.click('.xsteps button[data-s="body"]');
 ok(await fadeTo(p,'skin',1),tag+' back to Kroppen: the skin returns');

 /* the translation switched with an organ picked: its name tag stays (in the new language too), and picking another one works */
 await p.click('.xsteps button[data-s="inside"]');await settle(p,800);
 await p.click('.xorgs [data-organ="liver"]');await p.waitForTimeout(400);
 await p.click('#langs button[data-l="en"]');await p.waitForFunction(()=>window.__ex3d&&window.__ex3d.state.ready,null,{timeout:60000});await p.waitForTimeout(800);
 const tagOn=()=>p.waitForFunction(()=>{const t=document.querySelector('#x3tag');return t&&!t.hidden&&getComputedStyle(t).visibility==='visible'},null,{timeout:8000}).then(()=>true,()=>false);
 ok(await tagOn()&&(await p.textContent('#x3tag')).includes('Levern')&&(await p.textContent('#x3tag')).includes('The liver'),tag+' after switching to English the liver keeps its name tag: '+await p.textContent('#x3tag'));
 await p.click('#xiso');await settle(p,1200);
 ok(await tagOn(),tag+' the name tag stays when the liver is isolated');
 await p.click('#xwhole');await settle(p,800);
 await p.click('.xorgs [data-organ="stomach"]');await p.waitForTimeout(500);
 ok(await tagOn()&&(await p.textContent('#x3tag')).includes('Magsäcken'),tag+' picking another organ after the switch shows its tag: '+await p.textContent('#x3tag'));
 await p.click('#langs button[data-l="sv"]');await p.waitForFunction(()=>window.__ex3d&&window.__ex3d.state.ready,null,{timeout:60000});await p.waitForTimeout(600);
 await p.click('.xsteps button[data-s="body"]');await fadeTo(p,'skin',1);

 ok(p.errs.length===0,tag+' no page errors '+p.errs.join(' | '));
 ok(p.cerrs.length===0,tag+' no console errors '+p.cerrs.join(' | '));
 /* leaving frees the canvas */
 await p.click('#back');await p.waitForTimeout(800);
 ok(!(await p.$('canvas'))&&await p.evaluate(()=>!window.__ex3d&&!!window.__ex3dGone),tag+' leaving the explorer removes the canvas');
 await p.close();
}

/* GLB slots: a missing file and a broken one fall back, silently; a working one is used */
const junk='data:model/gltf-binary;base64,'+Buffer.from('this is not a model at all, just some bytes').toString('base64');
{const p=await open(1366,768,'no-preference',`window.EX3D_GLB={heart:'models/missing-heart.glb',stomach:${JSON.stringify(junk)},liver:${JSON.stringify(tri)}}`);
 await p.click('.xsteps button[data-s="inside"]');await p.waitForTimeout(2500);
 const s=await st(p);
 ok(s.partSources.heart==='procedural',' a missing GLB (heart) falls back to the procedural model: '+s.partSources.heart);
 ok(await p.evaluate(()=>{let n=0;window.__ex3dThree.scene.getObjectByName('slot:heart').traverse(o=>{if(o.isMesh&&o.visible)n++});return n>3}),' the procedural heart is drawn');
 ok(s.partSources.liver==='glb',' a working glTF (liver) is used: '+s.partSources.liver);
 ok(await p.evaluate(()=>{let g=null;window.__ex3dThree.scene.getObjectByName('slot:liver').traverse(o=>{if(o.userData.glb)g=o});if(!g)return false;const b=new (window.__ex3dThree.camera.position.constructor)();return g.position.distanceTo(b.set(-.25,5.59,.1))<.01}),' the GLB is fitted to the liver anchor');
 ok(s.partSources.stomach==='procedural',' a broken GLB (stomach) falls back to the procedural model: '+s.partSources.stomach);
 ok(p.errs.length===0,' no page errors with GLB slots '+p.errs.join(' | '));
 /* the browser itself logs the missing file under file://; nothing else */
 const ce=p.cerrs.filter(m=>!/Failed to load resource|ERR_FILE_NOT_FOUND|missing-heart/.test(m));
 ok(ce.length===0,' no console errors with GLB slots '+ce.join(' | '));
 await p.close();}

/* no WebGL at all: the SVG explorer */
{const b2=await chromium.launch({args:['--disable-webgl','--disable-3d-apis']});
 const p=await open(1366,768,'no-preference','',b2,false);await p.waitForTimeout(800);
 ok(!!(await p.$('.xstage svg.xbody'))&&!(await p.$('.xstage canvas')),' without WebGL the SVG explorer is shown');
 ok(p.errs.length===0&&p.cerrs.length===0,' no errors without WebGL '+[...p.errs,...p.cerrs].join(' | '));
 await b2.close();}
/* WebGL is there but the 3D explorer cannot make its context: it hands over to the SVG one */
{const p=await open(1366,768,'no-preference',`(()=>{const g=HTMLCanvasElement.prototype.getContext;let n=0;HTMLCanvasElement.prototype.getContext=function(t,...a){if(/webgl/.test(t)&&n++>0)return null;return g.call(this,t,...a)}})()`,b,false);
 await p.waitForSelector('.xstage svg.xbody',{timeout:20000}).catch(()=>{});
 ok(!!(await p.$('.xstage svg.xbody'))&&!(await p.$('.xstage canvas')),' when the 3D context fails the SVG explorer takes over');
 ok(p.errs.length===0,' no page errors when the context fails '+p.errs.join(' | '));
 /* the expected one: three.js reports that it could not create the context */
 const ce=p.cerrs.filter(m=>!/WebGL|context/i.test(m));
 ok(ce.length===0,' no other console errors '+ce.join(' | '));
 await p.close();}
await b.close();})();

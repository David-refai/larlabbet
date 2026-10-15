// The heart's walls (no holes between the right and the left heart). Builds model/heartShape.ts on its
// own and checks its signed distances on a 0.01 grid:
//   - the right cavities (right atrium, right ventricle, tricuspid passage, pulmonary outflow) and the
//     left ones (left atrium, left ventricle, mitral passage, aortic outflow) never overlap, and keep at
//     least 0.06 of wall between them everywhere
//   - the line between the two ventricles' centres crosses solid wall (the septum)
//   - the "Skiljevägg" label point is inside the solid wall
// Run alone (node tests/heart-check.js) or from t28.
const path=require('path'),fs=require('fs');
async function check(){
 const {rolldown}=await import('rolldown');
 const root=path.join(__dirname,'..'),out=path.join(root,'build','heart-check.mjs');
 const bundle=await rolldown({input:path.join(root,'app/src/explorer/3d/model/heartShape.ts'),external:[/^three/],logLevel:'silent'});
 await bundle.write({file:out,format:'esm'});await bundle.close();
 const H=await import('file://'+out+'?t='+Date.now());
 const R=H.rightCavities(),L=H.leftCavities(),solid=H.solid(),res=[];
 const ok=(c,m)=>res.push([!!c,m]);
 const lo=[-1.1,-1.2,-.7],hi=[1.0,1.0,.7],h=.01;
 let both=0,thin=0,minGap=Infinity,where=null;
 for(let x=lo[0];x<=hi[0];x+=h)for(let y=lo[1];y<=hi[1];y+=h)for(let z=lo[2];z<=hi[2];z+=h){
  const r=R.f(x,y,z);if(r>.06)continue;const l=L.f(x,y,z);if(l>.06)continue;
  if(r<0&&l<0)both++;if(r<.03&&l<.03)thin++;
  const m=Math.max(r,l);if(m<minGap){minGap=m;where=[x,y,z].map(v=>+v.toFixed(2))}}
 ok(both===0,`no point is inside both a right and a left cavity (${both})`);
 ok(thin===0,`at least 0.06 of wall between the right and the left heart everywhere (${thin} thin points; thinnest ~${(2*minGap).toFixed(3)} at ${where})`);
 /* the septum on the line between the ventricles' centres */
 const a=H.CH_AT.rv,b=H.CH_AT.lv;let run=0,best=0,wall=0;
 for(let t=0;t<=1;t+=.002){const p=a.map((v,i)=>v+(b[i]-v)*t);const s=solid.f(...p)<0&&R.f(...p)>0&&L.f(...p)>0;run=s?run+1:0;best=Math.max(best,run);if(s)wall++}
 const len=Math.hypot(...a.map((v,i)=>b[i]-v));
 ok(best*.002*len>=.06,`solid septum on the line between the ventricles (${(best*.002*len).toFixed(3)} thick)`);
 const sa=H.septumAnchor();
 ok(solid.f(sa[0],sa[1],sa[2]-.01)<0&&R.f(...sa)>.02&&L.f(...sa)>.02,`the Skiljevägg label point ${sa.map(v=>v.toFixed(3))} is in the wall (f ${solid.f(sa[0],sa[1],sa[2]-.01).toFixed(3)})`);
 return res;
}
module.exports=check;
if(require.main===module)check().then(r=>{for(const [c,m] of r){console.log((c?'PASS ':'FAIL ')+m);if(!c)process.exitCode=1}}).catch(e=>{console.log('FAIL heart check: '+e.message);process.exitCode=1});

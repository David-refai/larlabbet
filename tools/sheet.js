const {chromium}=require(process.env.PW);const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1500,height:900}});
const [pfx,out]=process.argv.slice(2);const files=fs.readdirSync(process.env.DIR||"shots").filter(f=>new RegExp(pfx).test(f)&&f.endsWith(".png")).sort();
fs.writeFileSync((process.env.DIR||"shots")+"/_s.html",`<body style="margin:0;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:#333">${files.map(f=>`<figure style="margin:0;color:#fff;font:12px sans-serif"><img src="${f}" style="width:100%;display:block">${f}</figure>`).join('')}</body>`);await p.goto("file://"+process.cwd()+"/"+(process.env.DIR||"shots")+"/_s.html");
await p.waitForTimeout(500);await p.screenshot({path:out,fullPage:true});await b.close()})();

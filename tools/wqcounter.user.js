// ==UserScript==
// @name         عدّاد علمني الإسلام
// @namespace    wq-counter
// @version      6
// @updateURL    https://islamkwt.com/tools/wqcounter.user.js
// @downloadURL  https://islamkwt.com/tools/wqcounter.user.js
// @match        https://eservices-cp.awqaf.gov.kw/RequestedServices/ReceivedForms*
// @grant        none
// @run-at       document-idle
// ==/UserScript==
const __run=()=>(async()=>{
const EP='https://nybuospfwbbtejvjivhd.supabase.co/functions/v1/counter-ingest',KEY='353f5968f8e3a988be42f1b940e0ea0a5eeb856b',EXCL=[2,220];
const ld=u=>new Promise((res,rej)=>{if(document.querySelector('script[src="'+u+'"]'))return res();const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=rej;document.head.appendChild(s)});
const rel=t=>{t=(t||'').toLowerCase();if(/غير\s*مسلم|كاف[ر]/.test(t))return'أخرى/غير محدد';const h=[];if(/مسيح|مسح|نصران|christ|catholic|كاثول|كرست/.test(t))h.push('مسيحية');if(/مسلم|اسلم|إسلام|اسلام|islam|muslim/.test(t))h.push('إسلام');if(/هندو|هنود|hindu|اندو/.test(t))h.push('هندوسية');if(/بوذ|buddh/.test(t))h.push('بوذية');return h.length===1?h[0]:'أخرى/غير محدد'};
const nat=t=>{t=t||'';if(/فل[يى]بين|فلبين|phil/i.test(t))return'الفلبين';if(/نيبال|nepal/i.test(t))return'النيبال';if(/سيلان|سريلانك|sri/i.test(t))return'سريلانكا';if(/بنج?لاديش|بنغلاديش|bangla/i.test(t))return'بنجلاديش';if(/[إأا]ثيوب|ethiop/i.test(t))return'إثيوبيا';if(/[إأا]ر[يت]+ر|eritr/i.test(t))return'إريتريا';if(/أوكران|اوكران|ukrain/i.test(t))return'أوكرانيا';if(/بنين|benin/i.test(t))return'بنين';if(/هند|india/i.test(t))return'الهند';return t||'غير محدد'};
const L1={hindi:'الهندية',tagalog:'التاغالوغ',filipino:'التاغالوغ',tamil:'التاميلية',nepali:'النيبالية',sinhala:'السنهالية',sinhalese:'السنهالية',english:'الإنجليزية',urdu:'الأردية',bengali:'البنغالية',bangla:'البنغالية',amharic:'الأمهرية',arabic:'العربية',russian:'الروسية',malayalam:'المالايالامية',oromo:'الأورومية',french:'الفرنسية',telugu:'التيلوغوية'};
const L2=[[/روس/,'الروسية'],[/عرب/,'العربية'],[/مل[يا]+لم/,'المالايالامية'],[/[أا]مار|[أا]مهر/,'الأمهرية'],[/فرنس/,'الفرنسية'],[/telugu|تيلوغ|تلغ/i,'التيلوغوية'],[/نيبال/,'النيبالية'],[/سيلان|سبلان|سنهال|سيريلانك|سريلانك/,'السنهالية'],[/أمهر|امهر/,'الأمهرية'],[/ارومو|أورومو|اورومو/,'الأورومية'],[/هند/,'الهندية'],[/تامل|تميل/,'التاميلية'],[/اردو|أردو/,'الأردية'],[/بنغال|بنجال/,'البنغالية'],[/تاغالوغ|تاجالوج|فلبين|فليبين/,'التاغالوغ']];
const lang=(a,b)=>{const k=(a||'').trim().toLowerCase();if(k&&k!=='other')return L1[k]||a;for(const[r,v]of L2)if(r.test(b||''))return v;return'غير محددة'};
await ld('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const g=jQuery('[data-role=grid]').first().data('kendoGrid');if(!g)return'nogrid';
g.dataSource.pageSize(300);await new Promise(r=>setTimeout(r,2500));
let cache={};try{cache=JSON.parse(localStorage.getItem('wq_cache')||'{}')}catch(e){}
const rows=g.dataSource.data().toJSON().filter(x=>!EXCL.includes(x.requestServiceId));
const parse=async n=>{const buf=await(await fetch('/RequestedServices/GetFile?serviceId=54&requestServiceId='+n)).arrayBuffer();const doc=await pdfjsLib.getDocument({data:new Uint8Array(buf)}).promise;let it=[];for(let p=1;p<=doc.numPages;p++){const t=await doc.getPage(p).then(x=>x.getTextContent());it.push(...t.items.map(i=>i.str.normalize('NFKC').trim()).filter(Boolean))}const a=it.indexOf('اللغة المفضلة الثانية'),b=it.findIndex(x=>x.startsWith('رقم هاتف آخر'));const m=(a>=0&&b>a)?it.slice(a+1,b):[];return{religion:rel(m[1]),gender:it.find(x=>x==='ذكر'||x==='أنثى')||null,nationality:nat(m[0]),lang:lang(m[2],m[3])}};
let fresh=0;for(const r of rows){const n=r.requestServiceId;if(!cache[n]){try{cache[n]=await parse(n);fresh++;localStorage.setItem('wq_cache',JSON.stringify(cache))}catch(e){}}}
const HOLD=[];
const docs=rows.filter(r=>cache[r.requestServiceId]).map(r=>({id:r.requestServiceId,status:(HOLD.includes(r.requestServiceId)?0:r.statusId),day:String(r.createdDate).slice(0,10),...cache[r.requestServiceId]}));
const res=await fetch(EP,{method:'POST',headers:{'content-type':'application/json','x-key':KEY},body:JSON.stringify({docs,exclude:EXCL})});
// ربط لجنة التعريف بالإسلام (ipcsystem): كل طلب جديد يُحوَّل آليًا عبر دالة آمنة (المفتاح السري على الخادم فقط)
const IPC='https://nybuospfwbbtejvjivhd.supabase.co/functions/v1/ipc-forward',IPC_FROM=235;
let isent=[];try{isent=JSON.parse(localStorage.getItem('wq_ipc_sent')||'[]')}catch(e){}
const ph=x=>{const d=String(x||'').replace(/[^\d+]/g,'');if(!d)return undefined;if(/^\d{8}$/.test(d))return'+965'+d;return d};
const dg=x=>String(x||'').replace(/[٠-٩]/g,c=>c.charCodeAt(0)-1632).replace(/[۰-۹]/g,c=>c.charCodeAt(0)-1776);
const isTel=x=>/^\+?\d{7,11}$/.test(String(x||'').replace(/\s/g,''));
const seeker=async n=>{const buf=await(await fetch('/RequestedServices/GetFile?serviceId=54&requestServiceId='+n)).arrayBuffer();const doc=await pdfjsLib.getDocument({data:new Uint8Array(buf)}).promise;let it=[];for(let p=1;p<=doc.numPages;p++){const t=await doc.getPage(p).then(x=>x.getTextContent());it.push(...t.items.map(i=>dg(i.str.normalize('NFKC').trim())).filter(Boolean))}
 const k=it.indexOf('مكفول مقدم الطلب');if(k<0)return null;const top=it.slice(0,k),S=it.slice(k);
 const b=S.findIndex(x=>x.startsWith('رقم هاتف آخر')),a=S.indexOf('اللغة المفضلة الثانية');const m=(a>=0&&b>a)?S.slice(a+1,b):[];
 const tels=(b>0?S.slice(0,b):S).filter(isTel),alt=b>=0?S.slice(b+1).find(isTel):undefined;
 const l1=(m[2]||'').trim(),l2=(m[3]||'').trim();
 const tel=ph(tels[0]||alt),wa=ph(alt);
 return{id:n,name:S[S.indexOf('الاسم')+1],tel,whatsapp:wa&&wa!==tel?wa:undefined,gender:S.find(x=>x==='ذكر'||x==='أنثى'),country:m[0],religion:m[1],language:(l1&&l1.toLowerCase()!=='other')?l1:(l2||undefined),language2:(l1&&l1.toLowerCase()!=='other')?(l2||undefined):undefined,sponsor_name:top[top.indexOf('الاسم')+1],sponsor_tel:ph(top.filter(isTel).find(x=>!/^\d{1,6}$/.test(x)))}};
const todo=rows.map(r=>r.requestServiceId).filter(n=>n>=IPC_FROM&&!isent.includes(n)).sort((x,y)=>x-y);
let ipcOut='';
for(let i=0;i<Math.max(todo.length,1);i+=20){const seekers=[];for(const n of todo.slice(i,i+20)){try{const s=await seeker(n);if(s)seekers.push(s)}catch(e){}}
 try{const r2=await fetch(IPC,{method:'POST',headers:{'content-type':'application/json','x-key':KEY},body:JSON.stringify({seekers})});const o=await r2.json();
  for(const x of (o.results||[]))if(x.http===202||x.http===409)isent.push(x.id);
  for(const sk of seekers)if(!(o.results||[]).some(x=>x.id===sk.id))isent.push(sk.id); // سبق إرساله على الخادم
  localStorage.setItem('wq_ipc_sent',JSON.stringify([...new Set(isent)]));ipcOut+=' ipc '+JSON.stringify(o.results||[]);}catch(e){ipcOut+=' ipcerr'}}
return'sent '+docs.length+' fresh '+fresh+' '+res.status+ipcOut;
})();
let __t;const __go=(d)=>{clearTimeout(__t);__t=setTimeout(()=>__run().catch(()=>{}),d)};
__go(4000);
// بلا استطلاع دوري: يعمل عند فتح الصفحة، وعند أي تغيير حالة تحفظه أنت (SaveStatus)
try{jQuery(document).ajaxComplete((e,x,o)=>{if(/SaveStatus/.test(o.url||''))__go(6000)})}catch(e){}

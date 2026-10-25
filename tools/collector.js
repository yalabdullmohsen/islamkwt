(async()=>{
const EP='https://nybuospfwbbtejvjivhd.supabase.co/functions/v1/counter-ingest',KEY='353f5968f8e3a988be42f1b940e0ea0a5eeb856b',EXCL=[2];
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
const HOLD=[196];
const docs=rows.filter(r=>cache[r.requestServiceId]).map(r=>({id:r.requestServiceId,status:(HOLD.includes(r.requestServiceId)?0:r.statusId),day:String(r.createdDate).slice(0,10),...cache[r.requestServiceId]}));
const res=await fetch(EP,{method:'POST',headers:{'content-type':'application/json','x-key':KEY},body:JSON.stringify({docs,exclude:EXCL})});
return'sent '+docs.length+' fresh '+fresh+' '+res.status;
})()

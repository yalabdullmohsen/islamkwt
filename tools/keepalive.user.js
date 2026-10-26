// ==UserScript==
// @name         إبقاء الجلسة — بوابة الأوقاف ووثيقة
// @namespace    islamkwt
// @version      1
// @description  يبقي جلسة بوابة الخدمات الإلكترونية ووثيقة مفتوحة (نبضة كل 3 دقائق) ويضغط «تسجيل الدخول» إن عبّأ المتصفح بياناتك المحفوظة. لا يحفظ أي كلمة سر.
// @match        https://eservices-cp.awqaf.gov.kw/*
// @match        https://watheqa.awqaf.gov.kw/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://islamkwt.com/tools/keepalive.user.js
// @downloadURL  https://islamkwt.com/tools/keepalive.user.js
// ==/UserScript==
(function(){
  'use strict';
  const PING_MS = 3*60*1000;      // نبضة كل 3 دقائق
  const RELOAD_MS = 25*60*1000;   // تحديث الصفحة كل 25 دقيقة (يجدد الجلسة والرموز)
  const isLogin = () => !!document.querySelector('input[type=password]');

  // 1) نبضة: طلب خفيف لنفس الصفحة بكوكيز الجلسة + حركة وهمية للفأرة
  const ping = () => {
    if (isLogin()) return;
    fetch(location.pathname + '?ka=' + Date.now(), {credentials:'include', cache:'no-store'}).catch(()=>{});
    document.dispatchEvent(new MouseEvent('mousemove', {bubbles:true, clientX:5+Math.random()*50, clientY:5+Math.random()*50}));
  };
  setInterval(ping, PING_MS);

  // 2) تحديث دوري للصفحة (إلا إذا كان المستخدم يكتب في حقل)
  setInterval(() => {
    const a = document.activeElement;
    const typing = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.value;
    if (!typing && !isLogin()) location.reload();
  }, RELOAD_MS);

  // 3) إن ظهرت صفحة الدخول وكانت الحقول معبّأة من حفظ المتصفح: اضغط دخول (بلا كتابة أي بيانات من السكربت)
  let tries = 0;
  const relogin = setInterval(() => {
    if (!isLogin()) { tries = 0; return; }
    if (++tries > 6) return;
    const pw = document.querySelector('input[type=password]');
    if (pw && pw.value) {
      const btn = [...document.querySelectorAll('button,input[type=submit]')].find(b => /تسجيل الدخول|دخول|login/i.test((b.innerText||b.value||'')));
      if (btn) btn.click();
    }
  }, 5000);
})();

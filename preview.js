(() => {
 'use strict';
 // A courtesy viewing gate for a static client preview, not server authentication.
 const sessionKey='uva-impact-client-preview';
 const gate=document.getElementById('previewGate');
 const form=document.getElementById('previewForm');
 const password=document.getElementById('previewPassword');
 const button=document.getElementById('previewSubmit');
 const message=document.getElementById('previewMessage');
 let loading=false;
 const loadScript=src=>new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=src;
  script.onload=resolve;script.onerror=()=>{script.remove();reject(new Error('Unable to load preview'))};
  document.head.append(script);
 });
 async function unlock(){
  if(loading)return;loading=true;button.disabled=true;message.textContent='Opening the report…';
  try{
   if(!window.UVA_REPORT)await loadScript('data.js');
   await loadScript('app.js');
   try{sessionStorage.setItem(sessionKey,'open')}catch{}
   gate.hidden=true;document.body.classList.remove('preview-locked');document.getElementById('app').inert=false;
   const target=document.getElementById(location.hash.slice(1))||document.getElementById('cover');
   requestAnimationFrame(()=>{target.setAttribute('tabindex','-1');target.focus({preventScroll:true});target.scrollIntoView({behavior:'instant',block:'start'})});
  }catch{
   message.textContent='The preview could not load. Please try again.';button.disabled=false;loading=false;
  }
 }
 window.UVA_PREVIEW={lock(){try{sessionStorage.removeItem(sessionKey)}catch{}location.reload()}};
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(password.value!=='uva'){message.textContent='That password doesn’t match. Please try again.';password.setAttribute('aria-invalid','true');password.focus();return}
  password.removeAttribute('aria-invalid');unlock();
 });
 password.addEventListener('input',()=>{password.removeAttribute('aria-invalid');message.textContent=''});
 try{if(sessionStorage.getItem(sessionKey)==='open')unlock()}catch{}
})();

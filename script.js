function setupMenu(){
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.main-nav');
  if(!toggle||!nav) return;
  toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

function setupYear(){
  document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
}

function init(){
  setupMenu();
  setupYear();
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

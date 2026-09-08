const PRODUCTS = {
  gris: {name:'Piedra Gris', prices:{'1–2':{'20':45,'40':60},'2–3':{'20':30,'40':50},'3–5':{'20':15,'40':30}}},
  mixta:{name:'Piedra Mixta', prices:{'1–2':{'20':25,'40':44},'2–3':{'20':18,'40':32},'3–5':{'20':12,'40':20}}},
  beige:{name:'Piedra Beige', prices:{'1–2':{'20':32,'40':54},'2–3':{'20':20,'40':34},'3–5':{'20':15,'40':25}}},
  roja:{name:'Piedra Roja', prices:{'1–2':{'20':35,'40':60},'2–3':{'20':25,'40':40},'3–5':{'20':19,'40':33}}},
  blanca:{name:'Piedra Blanca', prices:{'1–2':{'20':40,'40':72},'2–3':{'20':30,'40':52},'3–5':{'20':22,'40':37}}},
  lunar:{name:'Piedra Lunar', prices:{'1–2':{'20':32,'40':59},'2–3':{'20':24,'40':40},'3–5':{'20':18,'40':30}}},
  pulida:{name:'Piedra Pulida', prices:{'1–2':{'20':45,'40':60},'2–3':{'20':30,'40':50},'3–5':{'20':15,'40':30}}}
};

function setupMenu(){
  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.main-nav');
  if(!toggle||!nav) return;
  toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
}

function fillProducts(select){
  if(!select) return;
  select.innerHTML='';
  Object.entries(PRODUCTS).forEach(([key,p])=>{
    const o=document.createElement('option');
    o.value=key;
    o.textContent=p.name;
    select.appendChild(o);
  });
}

function fillSizes(productKey,select){
  if(!select) return;
  select.innerHTML='';
  const p=PRODUCTS[productKey];
  if(!p) return;
  Object.keys(p.prices).forEach(size=>{
    const o=document.createElement('option');
    o.value=size;
    o.textContent=size+'"';
    select.appendChild(o);
  });
}

function setupVolumeForm(){
  const product=document.getElementById('exportProduct');
  const size=document.getElementById('exportSize');
  const button=document.getElementById('exportWhatsApp');
  if(!product||!size||!button) return;

  fillProducts(product);
  const refresh=()=>fillSizes(product.value,size);
  product.addEventListener('change',refresh);
  refresh();

  button.addEventListener('click',()=>{
    const type=document.getElementById('exportType')?.value||'Pedido por volumen';
    const qty=document.getElementById('exportQty')?.value.trim()||'Por confirmar';
    const country=document.getElementById('exportCountry')?.value.trim()||'Perú';
    const city=document.getElementById('exportCity')?.value.trim()||'Por confirmar';
    const notes=document.getElementById('exportNotes')?.value.trim()||'Sin detalle adicional';
    const p=PRODUCTS[product.value];
    const text=[
      'Hola Eco Roca, quisiera realizar una consulta:',
      'Tipo: '+type,
      'Producto: '+(p?.name||'Por confirmar'),
      'Calibre: '+(size.value||'Por confirmar')+'"',
      'Cantidad aproximada: '+qty,
      'Destino: '+city+', '+country,
      'Detalle: '+notes
    ].join('\n');
    window.open('https://wa.me/51917285203?text='+encodeURIComponent(text),'_blank','noopener');
  });
}

function setupYear(){
  document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
}

function init(){
  setupMenu();
  setupVolumeForm();
  setupYear();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
else init();

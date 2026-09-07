const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '☰';
  }));
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const PRODUCTS = {
  piedra12: {name:'Piedra 1/2"', image:'img/piedra1.jpg', page:'piedra12.html', prices:{'1/2':{'20':45,'40':60}}},
  piedra23: {name:'Piedra 2/3"', image:'img/piedra2.jpg', page:'piedra23.html', prices:{'2/3':{'20':30,'40':50}}},
  piedra35: {name:'Piedra 3/5"', image:'img/piedramixta.jpg', page:'piedra35.html', prices:{'3/5':{'20':15,'40':30}}},
  mixta: {name:'Piedra Mixta', image:'img/piedra3.jpg', page:'piedraMixta.html', prices:{'1/2':{'20':25,'40':44},'2/3':{'20':18,'40':32},'3/5':{'20':12,'40':20}}},
  beige: {name:'Canto Rodado Beige', image:'img/piedrabeige.jpg', page:'piedraBeige.html', prices:{'1/2':{'20':32,'40':54},'2/3':{'20':20,'40':34},'3/5':{'20':15,'40':25}}},
  roja: {name:'Canto Rodado Rojo', image:'img/piedraRoja.jpg', page:'piedraRoja.html', prices:{'1/2':{'20':35,'40':60},'2/3':{'20':25,'40':40},'3/5':{'20':19,'40':33}}},
  blanca: {name:'Canto Rodado Blanco', image:'img/piedraBlanca.jpg', page:'piedraBlanca.html', prices:{'1/2':{'20':40,'40':72},'2/3':{'20':30,'40':52},'3/5':{'20':22,'40':37}}},
  lunar: {name:'Canto Rodado Lunar', image:'img/piedra_lunar.jpg', page:'piedralunar.html', prices:{'1/2':{'20':32,'40':59},'2/3':{'20':24,'40':40},'3/5':{'20':18,'40':30}}},
  pulida: {name:'Piedra Pulida', image:'img/piedra_pulida.jpg', page:'piedraPulida.html', prices:{'1/2':{'20':45,'40':60},'2/3':{'20':30,'40':50},'3/5':{'20':15,'40':30}}}
};

const productEntries = Object.entries(PRODUCTS);
const qp=document.getElementById('quoteProduct'), qs=document.getElementById('quoteSize'), qw=document.getElementById('quoteWeight'), qq=document.getElementById('quoteQty');
const qDest=document.getElementById('quoteDestination'), qTransport=document.getElementById('quoteTransport');

function fillProductSelect(select, selected='mixta') {
  if (!select) return;
  select.innerHTML = productEntries.map(([key,p]) => `<option value="${key}"${key===selected?' selected':''}>${p.name}</option>`).join('');
}
function fillSizeSelect(productKey, select) {
  if (!select) return;
  const sizes=Object.keys(PRODUCTS[productKey].prices);
  const old=select.value;
  select.innerHTML=sizes.map(size=>`<option value="${size}">${size}&quot;</option>`).join('');
  if (sizes.includes(old)) select.value=old;
}
function money(v){ return `S/ ${Number(v).toLocaleString('es-PE')}`; }
function quoteData(){
  const product=PRODUCTS[qp.value];
  const qty=Math.max(1,parseInt(qq.value||'1',10)); qq.value=qty;
  const size=qs.value, weight=qw.value;
  const unit=Number(product.prices[size]?.[weight]||0);
  return {product, qty, size, weight:Number(weight), unit, kg:qty*Number(weight), total:unit*qty};
}
function refreshQuote(){
  if(!qp) return;
  const d=quoteData();
  document.getElementById('quoteUnit').textContent=money(d.unit);
  document.getElementById('quoteKg').textContent=`${d.kg.toLocaleString('es-PE')} kg`;
  document.getElementById('quoteTotal').textContent=money(d.total);
  document.getElementById('quoteImage').src=d.product.image;
  document.getElementById('quoteImage').alt=d.product.name;
  document.getElementById('quoteName').textContent=d.product.name;
  document.getElementById('quoteProductLink').href=d.product.page;
}
function quoteText(){
  const d=quoteData(), dest=qDest.value.trim()||'Por confirmar', transport=qTransport.value;
  return `Hola Eco Roca, quisiera cotizar ${d.product.name}.\nCalibre: ${d.size}\"\nPresentación: ${d.weight} kg\nCantidad: ${d.qty} bolsa(s)\nPeso total: ${d.kg} kg\nPrecio por bolsa: ${money(d.unit)}\nTotal de productos: ${money(d.total)}\nDestino: ${dest}\nTransporte: ${transport}.\n¿Me confirman disponibilidad y costo final?`;
}
if(qp){
  fillProductSelect(qp,'mixta'); fillSizeSelect(qp.value,qs); refreshQuote();
  qp.addEventListener('change',()=>{fillSizeSelect(qp.value,qs);refreshQuote();});
  [qs,qw,qq].forEach(x=>x&&x.addEventListener('input',refreshQuote));
}
document.getElementById('quoteWhatsApp')?.addEventListener('click',()=>window.open(`https://wa.me/51917285203?text=${encodeURIComponent(quoteText())}`,'_blank','noopener'));
document.getElementById('quoteCopy')?.addEventListener('click', async(e)=>{
  try{await navigator.clipboard.writeText(quoteText()); const old=e.currentTarget.textContent; e.currentTarget.textContent='Resumen copiado ✓'; setTimeout(()=>e.currentTarget.textContent=old,1800);}catch{alert('No se pudo copiar automáticamente. Puedes enviar el resumen por WhatsApp.');}
});

function refreshCoverage(){
  const a=Math.max(0,Number(document.getElementById('areaM2')?.value||0)), k=Math.max(1,Number(document.getElementById('kgM2')?.value||1)), w=Number(document.getElementById('coverageWeight')?.value||20), kg=Math.ceil(a*k), bags=Math.ceil(kg/w);
  document.getElementById('coverageKg').textContent=`${kg.toLocaleString('es-PE')} kg`;
  document.getElementById('coverageBags').textContent=`≈ ${bags.toLocaleString('es-PE')} bolsa(s) de ${w} kg`;
}
['areaM2','kgM2','coverageWeight'].forEach(id=>document.getElementById(id)?.addEventListener('input',refreshCoverage)); refreshCoverage();

const bp=document.getElementById('bulkProduct'), bs=document.getElementById('bulkSize');
if(bp){fillProductSelect(bp,'mixta'); fillSizeSelect(bp.value,bs); bp.addEventListener('change',()=>fillSizeSelect(bp.value,bs));}
document.getElementById('bulkWhatsApp')?.addEventListener('click',()=>{
  const amount=document.getElementById('bulkAmount').value, product=PRODUCTS[bp.value], size=bs.value, dest=document.getElementById('bulkDestination').value.trim()||'Por confirmar', transport=document.getElementById('bulkTransport').value;
  const msg=`Hola Eco Roca, solicito una cotización mayorista.\nCantidad aproximada: ${amount}\nProducto: ${product.name}\nCalibre: ${size}\"\nDestino: ${dest}\nTransporte: ${transport}.\nQuisiera conocer disponibilidad, precio y condiciones.`;
  window.open(`https://wa.me/51917285203?text=${encodeURIComponent(msg)}`,'_blank','noopener');
});

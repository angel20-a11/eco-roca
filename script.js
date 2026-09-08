const PRODUCTS = {
  gris: {name:'Piedra Gris',image:'img/piedra1.jpg',page:'piedraGris.html',prices:{'1–2':{'20':45,'40':60},'2–3':{'20':30,'40':50},'3–5':{'20':15,'40':30}}},
  mixta:{name:'Piedra Mixta',image:'img/piedra3.jpg',page:'piedraMixta.html',prices:{'1–2':{'20':25,'40':44},'2–3':{'20':18,'40':32},'3–5':{'20':12,'40':20}}},
  beige:{name:'Piedra Beige',image:'img/piedrabeige.jpg',page:'piedraBeige.html',prices:{'1–2':{'20':32,'40':54},'2–3':{'20':20,'40':34},'3–5':{'20':15,'40':25}}},
  roja:{name:'Piedra Roja',image:'img/piedraRoja.jpg',page:'piedraRoja.html',prices:{'1–2':{'20':35,'40':60},'2–3':{'20':25,'40':40},'3–5':{'20':19,'40':33}}},
  blanca:{name:'Piedra Blanca',image:'img/piedraBlanca.jpg',page:'piedraBlanca.html',prices:{'1–2':{'20':40,'40':72},'2–3':{'20':30,'40':52},'3–5':{'20':22,'40':37}}},
  lunar:{name:'Piedra Lunar',image:'img/piedra_lunar.jpg',page:'piedralunar.html',prices:{'1–2':{'20':32,'40':59},'2–3':{'20':24,'40':40},'3–5':{'20':18,'40':30}}},
  pulida:{name:'Piedra Pulida',image:'img/piedra_pulida.jpg',page:'piedraPulida.html',prices:{'1–2':{'20':45,'40':60},'2–3':{'20':30,'40':50},'3–5':{'20':15,'40':30}}}
};


function fillProductOptions(selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  Object.entries(PRODUCTS).forEach(([key, product]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = product.name;
    selectEl.appendChild(option);
  });
}

function fillCalibreOptions(productKey, selectEl) {
  if (!selectEl) return;
  selectEl.innerHTML = '';
  const product = PRODUCTS[productKey];
  if (!product) return;
  Object.keys(product.prices).forEach(calibre => {
    const option = document.createElement('option');
    option.value = calibre;
    option.textContent = calibre + '"';
    selectEl.appendChild(option);
  });
}

function initProjectCalculator() {
  const productEl = document.getElementById('projectProduct');
  const sizeEl = document.getElementById('projectSize');
  const areaEl = document.getElementById('projectArea');
  const depthEl = document.getElementById('projectDepth');
  const bagEl = document.getElementById('projectBag');

  if (!productEl || !sizeEl || !areaEl || !depthEl || !bagEl) return;

  fillProductOptions(productEl);

  function calculate() {
    const product = PRODUCTS[productEl.value];
    if (!product) return;

    const calibre = sizeEl.value || Object.keys(product.prices)[0];
    const area = Math.max(0, Number(areaEl.value) || 0);
    const depthCm = Number(depthEl.value) || 4;
    const bagKg = Number(bagEl.value) || 40;

    const densityKgM3 = 1600;
    const estimatedKg = Math.ceil(area * (depthCm / 100) * densityKgM3);
    const bags = estimatedKg ? Math.ceil(estimatedKg / bagKg) : 0;
    const purchasedKg = bags * bagKg;
    const unitPrice = product.prices[calibre]?.[String(bagKg)];
    const subtotal = unitPrice == null ? null : bags * unitPrice;

    const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
    set('projectBags', bags);
    set('projectKg', estimatedKg.toLocaleString('es-PE') + ' kg');
    set('projectBagLabel', bagKg + ' kg');
    set('projectPrice', subtotal == null ? 'Consultar' : 'S/ ' + subtotal.toFixed(2));
    set('projectExplanation',
      area.toLocaleString('es-PE') + ' m² de ' + product.name +
      ' calibre ' + calibre + '" con una capa aproximada de ' + depthCm +
      ' cm requieren cerca de ' + estimatedKg.toLocaleString('es-PE') +
      ' kg. Redondeando a sacos completos: ' + bags + ' sacos (' +
      purchasedKg.toLocaleString('es-PE') + ' kg comprados).'
    );

    const btn=document.getElementById('projectWhatsApp');
    if(btn){
      btn.onclick=()=>{
        const text=[
          'Hola Eco Roca, quisiera consultar este proyecto:',
          'Producto: '+product.name,
          'Calibre: '+calibre+'"',
          'Área: '+area+' m²',
          'Espesor aproximado: '+depthCm+' cm',
          'Presentación: '+bagKg+' kg',
          'Estimación: '+bags+' sacos / '+purchasedKg+' kg',
          subtotal == null ? 'Precio: consultar' : 'Subtotal estimado: S/ '+subtotal.toFixed(2),
          'Quisiera confirmar cantidad, disponibilidad y transporte.'
        ].join('\n');
        window.open('https://wa.me/51917285203?text='+encodeURIComponent(text),'_blank','noopener');
      };
    }
  }

  function refreshCalibres() {
    fillCalibreOptions(productEl.value, sizeEl);
    calculate();
  }

  productEl.addEventListener('change', refreshCalibres);
  sizeEl.addEventListener('change', calculate);
  areaEl.addEventListener('input', calculate);
  depthEl.addEventListener('change', calculate);
  bagEl.addEventListener('change', calculate);

  refreshCalibres();
}

function initEcoRoca() {
  try { initProjectCalculator(); } catch (e) { console.error('Calculadora Eco Roca:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEcoRoca);
} else {
  initEcoRoca();
}

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

const CART_KEY='ecoRocaQuoteCartV24';let quoteCart=[];try{quoteCart=JSON.parse(localStorage.getItem(CART_KEY)||'[]');if(!Array.isArray(quoteCart))quoteCart=[];}catch{quoteCart=[];}
function cartTotals(){return quoteCart.reduce((a,i)=>({bags:a.bags+i.qty,kg:a.kg+i.kg,total:a.total+i.total}),{bags:0,kg:0,total:0});}
function saveCart(){localStorage.setItem(CART_KEY,JSON.stringify(quoteCart));renderCart();}
function renderCart(){const box=document.getElementById('cartItems'),empty=document.getElementById('cartEmpty'),t=cartTotals();document.getElementById('navCartCount')&&(document.getElementById('navCartCount').textContent=t.bags);document.getElementById('cartUnits')&&(document.getElementById('cartUnits').textContent=`${t.bags} bolsa(s)`);document.getElementById('cartKg')&&(document.getElementById('cartKg').textContent=`${t.kg.toLocaleString('es-PE')} kg`);document.getElementById('cartTotal')&&(document.getElementById('cartTotal').textContent=money(t.total));if(!box||!empty)return;empty.style.display=quoteCart.length?'none':'grid';box.innerHTML=quoteCart.map((i,n)=>`<article class="cart-item"><img src="${i.image}" alt="${i.name}"><div><h4>${i.name}</h4><p>Calibre ${i.size}&quot; · ${i.weight} kg · ${i.qty} bolsa(s)</p><p>${i.kg} kg · ${money(i.unit)} por bolsa</p></div><div class="cart-item-price"><strong>${money(i.total)}</strong><button type="button" data-remove="${n}">Quitar</button></div></article>`).join('');box.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{quoteCart.splice(Number(b.dataset.remove),1);saveCart();}));}
document.getElementById('quoteAddCart')?.addEventListener('click',(e)=>{const d=quoteData(),key=qp.value,ex=quoteCart.find(i=>i.key===key&&i.size===d.size&&i.weight===d.weight);if(ex){ex.qty+=d.qty;ex.kg=ex.qty*ex.weight;ex.total=ex.qty*ex.unit;}else quoteCart.push({key,name:d.product.name,image:d.product.image,size:d.size,weight:d.weight,qty:d.qty,unit:d.unit,kg:d.kg,total:d.total});saveCart();const old=e.currentTarget.textContent;e.currentTarget.textContent='Agregado ✓';setTimeout(()=>e.currentTarget.textContent=old,1200);});
document.getElementById('cartClear')?.addEventListener('click',()=>{if(quoteCart.length&&confirm('¿Vaciar todos los productos del pedido?')){quoteCart=[];saveCart();}});
document.getElementById('cartWhatsApp')?.addEventListener('click',()=>{if(!quoteCart.length){alert('Agrega al menos un producto al pedido.');return;}const t=cartTotals(),dest=document.getElementById('cartDestination')?.value.trim()||'Por confirmar',transport=document.getElementById('cartTransport')?.value||'Por confirmar',lines=quoteCart.map((i,n)=>`${n+1}. ${i.name} | calibre ${i.size}" | ${i.weight} kg | ${i.qty} bolsa(s) | ${money(i.total)}`),msg=`Hola Eco Roca, quisiera cotizar este pedido combinado:\n\n${lines.join('\n')}\n\nTotal de bolsas: ${t.bags}\nPeso total: ${t.kg} kg\nSubtotal productos: ${money(t.total)}\nDestino: ${dest}\nTransporte: ${transport}\n\n¿Me confirman disponibilidad, transporte y costo final?`;window.open(`https://wa.me/51917285203?text=${encodeURIComponent(msg)}`,'_blank','noopener');});renderCart();

// Eco Roca v3.0 — consulta comercial / exportación
const ep=document.getElementById('exportProduct'), es=document.getElementById('exportSize');
if(ep){fillProductSelect(ep,'mixta');fillSizeSelect(ep.value,es);ep.addEventListener('change',()=>fillSizeSelect(ep.value,es));}
document.getElementById('exportWhatsApp')?.addEventListener('click',()=>{
  const type=document.getElementById('exportType').value;
  const product=PRODUCTS[ep.value],size=es.value;
  const amount=document.getElementById('exportAmount').value.trim()||'Por confirmar';
  const country=document.getElementById('exportCountry').value.trim()||'Por confirmar';
  const dest=document.getElementById('exportDestination').value.trim()||'Por confirmar';
  const notes=document.getElementById('exportNotes').value.trim()||'Sin observaciones adicionales';
  const msg=`Hola Eco Roca, quisiera realizar una consulta comercial.\n\nTipo: ${type}\nProducto: ${product.name}\nCalibre: ${size}"\nCantidad aproximada: ${amount}\nPaís: ${country}\nCiudad / destino: ${dest}\nPresentación o requerimiento: ${notes}\n\nQuisiera conocer disponibilidad, precio y condiciones aplicables.`;
  window.open(`https://wa.me/51917285203?text=${encodeURIComponent(msg)}`,'_blank','noopener');
});




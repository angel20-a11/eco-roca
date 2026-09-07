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

const quotePrices={mixta:{"1/2":{"20":25,"40":44},"2/3":{"20":18,"40":32},"3/5":{"20":12,"40":20}}};
const qp=document.getElementById('quoteProduct'),qs=document.getElementById('quoteSize'),qw=document.getElementById('quoteWeight'),qq=document.getElementById('quoteQty');
function refreshQuote(){if(!qp)return;const qty=Math.max(1,parseInt(qq.value||'1',10));qq.value=qty;const unit=Number(quotePrices[qp.value]?.[qs.value]?.[qw.value]||0);document.getElementById('quoteUnit').textContent=`S/ ${unit}`;document.getElementById('quoteKg').textContent=`${qty*Number(qw.value)} kg`;document.getElementById('quoteTotal').textContent=`S/ ${unit*qty}`;}
[qp,qs,qw,qq].forEach(x=>x&&x.addEventListener('input',refreshQuote));refreshQuote();
document.getElementById('quoteWhatsApp')?.addEventListener('click',()=>{const qty=Math.max(1,parseInt(qq.value||'1',10)),unit=Number(quotePrices[qp.value]?.[qs.value]?.[qw.value]||0),dest=document.getElementById('quoteDestination').value.trim()||'Por confirmar',transport=document.getElementById('quoteTransport').value;const msg=`Hola Eco Roca, quisiera cotizar Piedra Mixta.\nCalibre: ${qs.value}"\nPresentación: ${qw.value} kg\nCantidad: ${qty} bolsa(s)\nPeso total: ${qty*Number(qw.value)} kg\nTotal referencial: S/ ${unit*qty}\nDestino: ${dest}\nTransporte: ${transport}.\n¿Me confirman disponibilidad y costo final?`;window.open(`https://wa.me/51917285203?text=${encodeURIComponent(msg)}`,'_blank','noopener');});
function refreshCoverage(){const a=Math.max(0,Number(document.getElementById('areaM2')?.value||0)),k=Math.max(1,Number(document.getElementById('kgM2')?.value||1)),w=Number(document.getElementById('coverageWeight')?.value||20),kg=Math.ceil(a*k),bags=Math.ceil(kg/w);document.getElementById('coverageKg').textContent=`${kg} kg`;document.getElementById('coverageBags').textContent=`≈ ${bags} bolsa(s) de ${w} kg`;}
['areaM2','kgM2','coverageWeight'].forEach(id=>document.getElementById(id)?.addEventListener('input',refreshCoverage));refreshCoverage();
document.getElementById('bulkWhatsApp')?.addEventListener('click',()=>{const amount=document.getElementById('bulkAmount').value,product=document.getElementById('bulkProduct').value.trim()||'Por definir',dest=document.getElementById('bulkDestination').value.trim()||'Por confirmar',transport=document.getElementById('bulkTransport').value;const msg=`Hola Eco Roca, solicito una cotización mayorista.\nCantidad aproximada: ${amount}\nProducto/calibre: ${product}\nDestino: ${dest}\nTransporte: ${transport}.\nQuisiera conocer disponibilidad y condiciones.`;window.open(`https://wa.me/51917285203?text=${encodeURIComponent(msg)}`,'_blank','noopener');});

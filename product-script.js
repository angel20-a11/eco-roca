const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(menuToggle&&nav){menuToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});}
const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
const body=document.body;
const prices=JSON.parse(body.dataset.prices||'{}');
const product=body.dataset.product||'Piedra canto rodado';
const size=document.getElementById('size');
const weight=document.getElementById('weight');
const qty=document.getElementById('qty');
const price=document.getElementById('price');
const total=document.getElementById('total');
function current(){const s=size.value;const w=weight.value;const unit=Number(prices[s]?.[w]||0);const quantity=Math.max(1,parseInt(qty.value||'1',10));return{s,w,unit,quantity,total:unit*quantity};}
function refresh(){const c=current();qty.value=c.quantity;price.textContent=`S/ ${c.unit}`;total.textContent=`S/ ${c.total}`;}
[size,weight,qty].forEach(el=>el&&el.addEventListener('input',refresh));refresh();
document.getElementById('orderButton')?.addEventListener('click',()=>{const c=current();const msg=`Hola Eco Roca, quisiera cotizar ${product}.\nCalibre: ${c.s}\"\nPresentación: ${c.w} kg\nCantidad: ${c.quantity} bolsa(s)\nTotal referencial: S/ ${c.total}.\n¿Me confirman disponibilidad y condiciones de entrega?`;window.open(`https://wa.me/51917285203?text=${encodeURIComponent(msg)}`,'_blank','noopener');});

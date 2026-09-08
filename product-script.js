document.addEventListener('DOMContentLoaded',()=>{
  const body=document.body;
  const product=body.dataset.product||'Piedra Eco Roca';
  let prices={};
  try{prices=JSON.parse(body.dataset.prices||'{}')}catch(e){console.error('Precios no válidos',e)}

  const size=document.getElementById('size');
  const weight=document.getElementById('weight');
  const qty=document.getElementById('qty');
  const price=document.getElementById('price');
  const total=document.getElementById('total');
  const button=document.getElementById('orderButton');

  function calculate(){
    if(!size||!weight||!qty) return;
    const unit=Number(prices[size.value]?.[weight.value]||0);
    const amount=Math.max(1,parseInt(qty.value||'1',10));
    qty.value=amount;
    const subtotal=unit*amount;
    if(price) price.textContent=unit ? 'S/ '+unit.toFixed(2) : 'Consultar';
    if(total) total.textContent=unit ? 'S/ '+subtotal.toFixed(2) : 'Consultar';
  }

  [size,weight].forEach(el=>el&&el.addEventListener('change',calculate));
  qty&&qty.addEventListener('input',calculate);

  if(button){
    button.addEventListener('click',()=>{
      const unit=Number(prices[size?.value]?.[weight?.value]||0);
      const amount=Math.max(1,parseInt(qty?.value||'1',10));
      const subtotal=unit*amount;
      const kg=Number(weight?.value||0)*amount;
      const text=[
        'Hola Eco Roca, quisiera cotizar:',
        'Producto: '+product,
        'Calibre: '+(size?.value||'Por confirmar')+'"',
        'Presentación: '+(weight?.value||'Por confirmar')+' kg',
        'Cantidad: '+amount+' bolsa'+(amount===1?'':'s'),
        'Peso total: '+kg+' kg',
        unit ? 'Subtotal del producto: S/ '+subtotal.toFixed(2) : 'Precio: consultar',
        'Quisiera confirmar disponibilidad y transporte.'
      ].join('\n');
      window.open('https://wa.me/51917285203?text='+encodeURIComponent(text),'_blank','noopener');
    });
  }

  const toggle=document.querySelector('.menu-toggle');
  const nav=document.querySelector('.main-nav');
  if(toggle&&nav){
    toggle.addEventListener('click',()=>nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  }

  document.querySelectorAll('#year').forEach(el=>el.textContent=new Date().getFullYear());
  calculate();
});

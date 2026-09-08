(() => {
 const cfg=window.ECO_ROCA_SUPABASE||{};
 if(!cfg.url||!cfg.publishableKey||!window.supabase)return;
 const db=window.supabase.createClient(cfg.url,cfg.publishableKey);
 async function load(){
  const {data,error}=await db.from('products').select('*').order('sort_order');
  if(error||!data?.length)return;
  const cards=[...document.querySelectorAll('#productos .product-card')];
  data.forEach((p,i)=>{
   const c=cards[i]; if(!c)return;
   c.href=p.page_url||c.href;
   const im=c.querySelector('img'); if(im&&p.image_url)im.src=p.image_url;
   const h=c.querySelector('h3'); if(h)h.textContent=p.name;
   const d=c.querySelector('p'); if(d)d.textContent=p.description||'';
   const s=c.querySelector('strong'); if(s)s.textContent=p.available?(p.from_price?'Desde S/ '+Number(p.from_price).toFixed(0):'Ver precios'):'Consultar disponibilidad';
  });
 }
 document.addEventListener('DOMContentLoaded',load);
})();
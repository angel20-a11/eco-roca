const cfg=window.ECO_ROCA_SUPABASE||{},ok=cfg.url&&cfg.publishableKey;
const db=ok?window.supabase.createClient(cfg.url,cfg.publishableKey):null,$=s=>document.querySelector(s);
if(!ok)$('#setup').classList.remove('hide');
function loginView(){$('#login').classList.remove('hide');$('#dashboard').classList.add('hide')}
async function enter(){
 if(!db)return loginView();
 const {data:{session}}=await db.auth.getSession(); if(!session)return loginView();
 const {data:a}=await db.from('admins').select('user_id').eq('user_id',session.user.id).maybeSingle();
 if(!a){await db.auth.signOut();$('#msg').textContent='Cuenta sin permiso de administrador.';return loginView()}
 $('#login').classList.add('hide');$('#dashboard').classList.remove('hide');load();
}
$('#loginForm').addEventListener('submit',async e=>{
 e.preventDefault();
 const msg=$('#msg');
 if(!db){msg.textContent='Primero conecta Supabase.';return}
 msg.textContent='Verificando acceso…';
 const email=$('#email').value.trim();
 const password=$('#password').value;
 const {error}=await db.auth.signInWithPassword({email,password});
 if(error){
   const raw=(error.message||'Error desconocido').trim();
   const text=raw.toLowerCase();
   if(text.includes('email not confirmed')){
     msg.textContent='Tu correo todavía no está confirmado en Supabase. En Authentication > Users revisa que el usuario figure como confirmado.';
   }else if(text.includes('invalid login credentials')){
     msg.textContent='Supabase rechazó el acceso: correo o contraseña incorrectos. Revisa el correo exacto del usuario y, si hace falta, cambia su contraseña en Authentication > Users.';
   }else if(text.includes('user not found')){
     msg.textContent='Supabase no encuentra ese usuario. Revisa el correo exacto en Authentication > Users.';
   }else{
     msg.textContent='Supabase respondió: '+raw;
   }
   console.error('Eco Roca login error:',error);
   return;
 }
 msg.textContent='';
 enter();
});
$('#logout').addEventListener('click',async()=>{await db.auth.signOut();loginView()});
async function load(){const {data,error}=await db.from('products').select('*').order('sort_order');if(error)return $('#list').innerHTML='<p>Error cargando productos.</p>';$('#list').innerHTML='';data.forEach(render)}
function render(p){const n=$('#tpl').content.cloneNode(true),card=n.querySelector('.product'),q=s=>card.querySelector(s),pr=p.prices||{};
 q('.preview').src=p.image_url||p.local_image;q('.name').value=p.name;q('.description').value=p.description||'';q('.available').checked=p.available;
 q('.a').value=pr['1–2']?.['20']??'';q('.b').value=pr['1–2']?.['40']??'';q('.c').value=pr['2–3']?.['20']??'';q('.d').value=pr['2–3']?.['40']??'';q('.e').value=pr['3–5']?.['20']??'';q('.f').value=pr['3–5']?.['40']??'';
 q('.file').addEventListener('change',async ev=>{const f=ev.target.files[0];if(!f)return;const m=q('.fileMsg');m.textContent='Subiendo…';const ext=f.name.split('.').pop();const path=p.slug+'/'+Date.now()+'.'+ext;const {error}=await db.storage.from('product-images').upload(path,f,{contentType:f.type});if(error)return m.textContent='Error al subir.';const {data}=db.storage.from('product-images').getPublicUrl(path);const u=data.publicUrl;const r=await db.from('products').update({image_url:u}).eq('id',p.id);if(r.error)return m.textContent='Error al guardar.';q('.preview').src=u;m.textContent='Imagen actualizada.'});
 q('.save').addEventListener('click',async()=>{const num=s=>Number(q(s).value||0),prices={'1–2':{'20':num('.a'),'40':num('.b')},'2–3':{'20':num('.c'),'40':num('.d')},'3–5':{'20':num('.e'),'40':num('.f')}};const vals=Object.values(prices).flatMap(Object.values).filter(x=>x>0);const b=q('.save');b.textContent='Guardando…';const {error}=await db.from('products').update({name:q('.name').value.trim(),description:q('.description').value.trim(),available:q('.available').checked,prices,from_price:vals.length?Math.min(...vals):null,updated_at:new Date().toISOString()}).eq('id',p.id);b.textContent=error?'Error':'Guardado ✓';setTimeout(()=>b.textContent='Guardar cambios',1600)});
 $('#list').appendChild(n)}
enter();

const forgotBtn=document.querySelector('#forgotBtn');
if(forgotBtn)forgotBtn.addEventListener('click',async()=>{
 const msg=$('#msg');
 if(!db){msg.textContent='No hay conexión con Supabase.';return}
 const email=$('#email').value.trim();
 if(!email){msg.textContent='Escribe primero tu correo en el campo Correo.';return}
 forgotBtn.disabled=true;forgotBtn.textContent='Enviando…';
 const redirectTo=new URL('restablecer-clave.html',window.location.href).href;
 const {error}=await db.auth.resetPasswordForEmail(email,{redirectTo});
 forgotBtn.disabled=false;forgotBtn.textContent='Olvidé mi contraseña';
 if(error){msg.textContent='Supabase respondió: '+(error.message||'No se pudo enviar el correo.');return}
 msg.textContent='Revisa tu correo. Te enviamos un enlace para crear una contraseña nueva.';
});

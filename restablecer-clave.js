const cfg=window.ECO_ROCA_SUPABASE||{};
const msg=document.querySelector('#resetMsg');
const form=document.querySelector('#resetForm');
const intro=document.querySelector('#intro');
const back=document.querySelector('#backAdmin');

function show(text){msg.textContent=text}
if(!cfg.url||!cfg.publishableKey||!window.supabase){
  show('No se pudo conectar con Supabase.');
}else{
  const db=window.supabase.createClient(cfg.url,cfg.publishableKey);

  async function prepare(){
    show('Verificando enlace de recuperación…');

    // PKCE recovery links can arrive with ?code=...
    const params=new URLSearchParams(window.location.search);
    const code=params.get('code');
    if(code){
      const {error}=await db.auth.exchangeCodeForSession(code);
      if(error){
        show('El enlace no pudo validarse o ya venció. Solicita un nuevo cambio de contraseña.');
        return;
      }
      history.replaceState({},document.title,'restablecer-clave.html');
    }

    const {data:{session}}=await db.auth.getSession();
    if(session){
      show('');
      intro.textContent='Escribe una contraseña nueva para tu cuenta de administración.';
      form.classList.remove('hide');
    }else{
      // Implicit recovery links are processed by supabase-js from URL hash.
      let resolved=false;
      const {data:{subscription}}=db.auth.onAuthStateChange((event,session)=>{
        if(session && (event==='PASSWORD_RECOVERY'||event==='SIGNED_IN'||event==='INITIAL_SESSION')){
          resolved=true;
          show('');
          intro.textContent='Escribe una contraseña nueva para tu cuenta de administración.';
          form.classList.remove('hide');
        }
      });
      setTimeout(async()=>{
        if(resolved)return;
        const {data:{session:s}}=await db.auth.getSession();
        if(s){
          show('');
          intro.textContent='Escribe una contraseña nueva para tu cuenta de administración.';
          form.classList.remove('hide');
        }else{
          show('No hay una sesión de recuperación válida. Abre esta página desde un enlace nuevo de recuperación.');
        }
      },1200);
    }

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const p=document.querySelector('#newPassword').value;
      const c=document.querySelector('#confirmPassword').value;
      if(p.length<8){show('La contraseña debe tener al menos 8 caracteres.');return}
      if(p!==c){show('Las dos contraseñas no coinciden.');return}
      const button=document.querySelector('#savePassword');
      button.disabled=true; button.textContent='Guardando…';
      const {error}=await db.auth.updateUser({password:p});
      button.disabled=false;
      if(error){
        button.textContent='Guardar nueva contraseña';
        show('Supabase respondió: '+(error.message||'No se pudo cambiar la contraseña.'));
        return;
      }
      form.classList.add('hide');
      intro.textContent='Contraseña actualizada correctamente.';
      show('Ya puedes iniciar sesión en el panel con tu nueva contraseña.');
      back.classList.remove('hide');
    });
  }
  prepare();
}

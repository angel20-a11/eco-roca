# Eco Roca v5.0
1. Crea un proyecto en Supabase.
2. En SQL Editor ejecuta `supabase-setup.sql`.
3. En Authentication > Users crea tu usuario administrador con correo y contraseña.
4. Copia el UUID de ese usuario y ejecuta:
   `insert into public.admins(user_id) values ('TU-UUID');`
5. Copia Project URL y Publishable key de Supabase.
6. Completa `supabase-config.js` con esos dos valores.
7. Nunca pongas la contraseña ni la service_role key dentro de la web.
8. Sube todos los archivos a Netlify/GitHub.
9. El panel quedará en `/admin/`.

La tienda actual sigue funcionando aunque Supabase todavía no esté configurado.

-- ============================================================
-- Migración: foto de perfil para alumnas
-- Ejecuta esto en Supabase → SQL Editor (además del schema.sql
-- original, no lo reemplaza)
-- ============================================================

-- 1. Nueva columna para guardar la URL de la foto
alter table alumnas add column if not exists foto_url text;

-- 2. Bucket de almacenamiento para las fotos (público de lectura)
insert into storage.buckets (id, name, public)
values ('fotos-alumnas', 'fotos-alumnas', true)
on conflict (id) do nothing;

-- 3. Cualquiera puede VER las fotos (son de lectura pública, como
--    cualquier imagen de perfil)
create policy "fotos_alumnas_select"
on storage.objects for select
using (bucket_id = 'fotos-alumnas');

-- 4. Solo el admin puede subir, reemplazar o borrar fotos
create policy "fotos_alumnas_admin_insert"
on storage.objects for insert
with check (bucket_id = 'fotos-alumnas' and is_admin());

create policy "fotos_alumnas_admin_update"
on storage.objects for update
using (bucket_id = 'fotos-alumnas' and is_admin());

create policy "fotos_alumnas_admin_delete"
on storage.objects for delete
using (bucket_id = 'fotos-alumnas' and is_admin());

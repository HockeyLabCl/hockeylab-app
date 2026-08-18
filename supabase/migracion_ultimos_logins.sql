-- ============================================================
-- Migración: función para que el admin vea el último ingreso
-- de cada apoderado. Ejecuta esto en Supabase → SQL Editor.
-- ============================================================

create or replace function admin_ultimos_logins()
returns table(id uuid, email text, last_sign_in_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'No autorizado';
  end if;

  return query
    select u.id, u.email, u.last_sign_in_at
    from auth.users u;
end;
$$;

grant execute on function admin_ultimos_logins() to authenticated;

-- ============================================================
-- HockeyLab / Hockey Greenhouse - Esquema de base de datos
-- Ejecutar completo en: Supabase > SQL Editor > New query
-- ============================================================

-- Extensión para generar UUIDs
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. PROFILES: extiende auth.users con rol y datos de contacto
-- ------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'apoderado')) default 'apoderado',
  nombre text not null,
  telefono text,
  created_at timestamptz not null default now()
);

-- Crea automáticamente un profile cuando alguien se registra
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'apoderado')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ------------------------------------------------------------
-- 2. ALUMNAS: ficha de cada niña
-- ------------------------------------------------------------
create table if not exists alumnas (
  id uuid primary key default gen_random_uuid(),
  apoderado_id uuid not null references profiles(id) on delete cascade,
  nombre text not null,
  fecha_nacimiento date,
  categoria text not null, -- ej: Sub10, Sub12, Sub14, Sub16, Primera
  contacto_emergencia_nombre text,
  contacto_emergencia_telefono text,
  alergias_observaciones text,
  monto_mensualidad integer not null default 0, -- en pesos CLP
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. PAGOS: un registro por alumna/mes
-- ------------------------------------------------------------
create table if not exists pagos (
  id uuid primary key default gen_random_uuid(),
  alumna_id uuid not null references alumnas(id) on delete cascade,
  periodo date not null, -- siempre día 1 del mes, ej '2026-08-01'
  monto integer not null,
  estado text not null check (estado in ('pendiente', 'pagado', 'atrasado')) default 'pendiente',
  fecha_pago date,
  metodo text, -- 'transferencia', 'efectivo', 'otro'
  comentario text,
  registrado_por uuid references profiles(id),
  updated_at timestamptz not null default now(),
  unique (alumna_id, periodo)
);

-- ------------------------------------------------------------
-- 4. ASISTENCIA: un registro por alumna/fecha
-- ------------------------------------------------------------
create table if not exists asistencia (
  id uuid primary key default gen_random_uuid(),
  alumna_id uuid not null references alumnas(id) on delete cascade,
  fecha date not null,
  presente boolean not null default true,
  comentario text,
  registrado_por uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (alumna_id, fecha)
);

-- ------------------------------------------------------------
-- 5. COMUNICADOS: avisos generales o por categoría
-- ------------------------------------------------------------
create table if not exists comunicados (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  contenido text not null,
  categoria_destino text, -- null = para todas las categorías
  autor_id uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 6. DATOS_PAGO: configuración única con datos de transferencia
-- ------------------------------------------------------------
create table if not exists datos_pago (
  id int primary key default 1 check (id = 1), -- fuerza fila única
  nombre_titular text,
  rut_titular text,
  banco text,
  tipo_cuenta text,
  numero_cuenta text,
  email_pago text,
  qr_image_url text,
  instrucciones_adicionales text,
  updated_at timestamptz not null default now()
);
insert into datos_pago (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table profiles enable row level security;
alter table alumnas enable row level security;
alter table pagos enable row level security;
alter table asistencia enable row level security;
alter table comunicados enable row level security;
alter table datos_pago enable row level security;

-- Función helper: ¿el usuario actual es admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- PROFILES: cada uno ve el suyo, admin ve todos
create policy "profiles_select" on profiles for select
  using (id = auth.uid() or is_admin());
create policy "profiles_update_own" on profiles for update
  using (id = auth.uid());
create policy "profiles_admin_all" on profiles for all
  using (is_admin());

-- ALUMNAS: apoderado ve/edita solo las suyas, admin ve/edita todas
create policy "alumnas_select" on alumnas for select
  using (apoderado_id = auth.uid() or is_admin());
create policy "alumnas_update_own" on alumnas for update
  using (apoderado_id = auth.uid() or is_admin());
create policy "alumnas_admin_insert" on alumnas for insert
  with check (is_admin());
create policy "alumnas_admin_delete" on alumnas for delete
  using (is_admin());

-- PAGOS: apoderado ve solo pagos de sus alumnas (solo lectura), admin todo
create policy "pagos_select" on pagos for select
  using (
    is_admin() or
    exists (select 1 from alumnas a where a.id = pagos.alumna_id and a.apoderado_id = auth.uid())
  );
create policy "pagos_admin_write" on pagos for insert with check (is_admin());
create policy "pagos_admin_update" on pagos for update using (is_admin());
create policy "pagos_admin_delete" on pagos for delete using (is_admin());

-- ASISTENCIA: mismo patrón que pagos
create policy "asistencia_select" on asistencia for select
  using (
    is_admin() or
    exists (select 1 from alumnas a where a.id = asistencia.alumna_id and a.apoderado_id = auth.uid())
  );
create policy "asistencia_admin_write" on asistencia for insert with check (is_admin());
create policy "asistencia_admin_update" on asistencia for update using (is_admin());
create policy "asistencia_admin_delete" on asistencia for delete using (is_admin());

-- COMUNICADOS: todos los autenticados pueden leer, solo admin escribe
create policy "comunicados_select" on comunicados for select
  using (auth.uid() is not null);
create policy "comunicados_admin_write" on comunicados for insert with check (is_admin());
create policy "comunicados_admin_update" on comunicados for update using (is_admin());
create policy "comunicados_admin_delete" on comunicados for delete using (is_admin());

-- DATOS_PAGO: todos los autenticados pueden leer, solo admin escribe
create policy "datos_pago_select" on datos_pago for select
  using (auth.uid() is not null);
create policy "datos_pago_admin_update" on datos_pago for update using (is_admin());

-- ============================================================
-- Fin del esquema. Después de ejecutar esto:
-- 1. Ve a Authentication > Users y crea tu primer usuario (tú, el admin)
-- 2. Ejecuta: update profiles set role = 'admin' where id = '<tu-user-id>';
-- ============================================================

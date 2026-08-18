-- ============================================================
-- Migración: indicador de "nuevo" para comunicados, pagos y
-- asistencia en el portal del apoderado.
-- Ejecuta esto en Supabase → SQL Editor.
-- ============================================================

create table if not exists ultimas_visitas (
  apoderado_id uuid primary key references profiles(id) on delete cascade,
  comunicados_visto_at timestamptz not null default '2000-01-01',
  pagos_visto_at timestamptz not null default '2000-01-01',
  asistencia_visto_at timestamptz not null default '2000-01-01'
);

alter table ultimas_visitas enable row level security;

-- Cada apoderado solo puede ver y actualizar su propia fila
create policy "ultimas_visitas_select_own" on ultimas_visitas for select
  using (apoderado_id = auth.uid());

create policy "ultimas_visitas_upsert_own" on ultimas_visitas for insert
  with check (apoderado_id = auth.uid());

create policy "ultimas_visitas_update_own" on ultimas_visitas for update
  using (apoderado_id = auth.uid());

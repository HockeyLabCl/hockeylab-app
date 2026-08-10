# HockeyLab — App para Academia Hockey Greenhouse

App para administrar la academia: fichas de alumnas, asistencia, pagos (registro manual con
transferencia/QR) y comunicados. Portal separado para administración y para apoderados.

## 1. Crear el proyecto en Supabase (gratis)

1. Ve a https://supabase.com y crea una cuenta / un nuevo proyecto.
2. Cuando esté listo, ve a **SQL Editor** → **New query**, pega todo el contenido de
   `supabase/schema.sql` y ejecútalo. Esto crea todas las tablas, seguridad (RLS) y triggers.
3. Ve a **Project Settings → API** y copia:
   - `Project URL` → esto va en `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → esto va en `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Configurar el proyecto localmente

```bash
cp .env.example .env.local
# edita .env.local y pega tus datos de Supabase
npm install
npm run dev
```

Abre http://localhost:3000 — te va a redirigir a `/login`.

## 3. Crear tu primer usuario administrador (tú)

1. En Supabase, ve a **Authentication → Users → Add user** (o "Invite user" si prefieres que
   te llegue un correo para poner tu propia contraseña).
2. Crea tu usuario con tu correo.
3. Ve a **Table Editor → profiles**, busca la fila con tu `id` (mismo id que en Authentication)
   y cambia la columna `role` de `apoderado` a `admin`.
4. Ya puedes entrar a la app con ese correo y verás el panel de administración.

## 4. Crear cuentas para los apoderados

Por ahora, la forma más simple y segura es que tú (admin) los invites desde Supabase:

1. **Authentication → Users → Invite user** → ingresa el correo del apoderado.
   Les llega un correo para definir su contraseña.
2. Su `profile` se crea automáticamente con `role = apoderado`.
3. Luego, en la app, ve a **Admin → Alumnas → Nueva alumna** y asígnale la alumna a ese
   apoderado desde el listado desplegable.

(Para 30 familias esto es perfectamente manejable a mano. Si más adelante quieres que los
apoderados se auto-registren, se puede agregar una pantalla de registro — pero no es
recomendable sin validar antes quién debe tener acceso.)

## 5. Datos de transferencia / QR

Ve a **Admin → Datos de pago** y completa el nombre del titular, RUT, banco, tipo y número
de cuenta. Si quieres mostrar una imagen de QR de tu banco (en vez de un QR genérico
generado automáticamente), sube la imagen a cualquier hosting de imágenes (o a
**Supabase Storage**, creando un bucket público) y pega esa URL en "URL de imagen QR".

## 6. Uso mensual

- **Admin → Pagos**: al empezar el mes, presiona "Generar cobro" para crear el registro
  pendiente de todas las alumnas activas. Cuando una familia transfiera, marca "Pagado".
- **Admin → Asistencia**: cada día de entrenamiento, marca presente/ausente por alumna.
- **Admin → Comunicados**: publica avisos (a todas o a una categoría específica).
- Los apoderados ven todo esto reflejado automáticamente en su portal (`/apoderado`).

## 7. Desplegar en producción (Vercel, gratis para este tamaño)

1. Sube este proyecto a un repositorio de GitHub.
2. Ve a https://vercel.com → **New Project** → importa el repositorio.
3. En **Environment Variables**, agrega `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (los mismos valores de tu `.env.local`).
4. Despliega. Vercel te da una URL tipo `hockeylab-app.vercel.app` que puedes compartir
   con las familias (o conectar tu propio dominio después).

## Estructura del proyecto

```
app/
  login/              — inicio de sesión
  admin/               — panel de administración (protegido, solo role=admin)
    alumnas/           — crear/editar/eliminar fichas de alumnas
    pagos/             — generar cobros mensuales y marcarlos pagados
    asistencia/        — marcar asistencia por día
    comunicados/       — publicar avisos
    config/            — datos de transferencia y QR
  apoderado/           — portal de apoderados (protegido, solo su propia info)
    alumna/            — ver/editar ficha de su hija
    pagos/             — ver estado de pago + datos de transferencia
    asistencia/        — ver asistencia de su hija
    comunicados/        — ver avisos publicados
lib/supabase/          — clientes de Supabase (browser y servidor)
middleware.ts          — protección de rutas por sesión y rol
supabase/schema.sql    — esquema completo de base de datos + seguridad (RLS)
```

## Notas importantes de seguridad

- La seguridad de quién ve qué **no depende del código del frontend**, sino de las políticas
  RLS definidas en `schema.sql` — así que aunque alguien inspeccione la app, Supabase impide
  que un apoderado vea datos de otra familia.
- El pago sigue siendo 100% manual: nadie transfiere dinero dentro de la app, solo se
  muestran los datos bancarios. Tú confirmas cada pago a mano cuando veas la transferencia
  en tu cuenta.

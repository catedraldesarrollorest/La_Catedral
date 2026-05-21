# 🗄️ Configuración de Supabase para La Catedral

## Paso 1: Crear las Tablas en Supabase

1. Accede a tu proyecto en Supabase: https://app.supabase.com
2. Ve a **SQL Editor** (icono de base de datos en el menú izquierdo)
3. Haz clic en **"New Query"**
4. Copia y pega **todo el contenido** del archivo `supabase/migrations/001_create_catedral_tables.sql`
5. Haz clic en el botón verde **"Run"** (o presiona Ctrl + Enter)
6. Espera a que se complete ✓

## Paso 2: Verificar las Tablas

Después de ejecutar la query:
- Abre **Table Editor** en Supabase
- Deberías ver 3 nuevas tablas:
  - `menu_items`
  - `gallery_items`
  - `general_info`

## Paso 3: Configurar las Credenciales en tu Aplicación

1. Crea un archivo `.env.local` en la raíz del proyecto (copiar de `.env.example`)
2. Asegúrate de que tenga:
   ```
   SUPABASE_URL="https://hadbwpdcpimylcjqeoph.supabase.com"
   SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ADMIN_PIN="1059"
   ```

## Paso 4: Instalar Dependencias

```bash
npm install
```

## Paso 5: Probar Localmente

```bash
npm run dev
```

Cuando accedas a http://localhost:3000 y abras el panel admin (#admin):
- Los cambios se guardarán en Supabase en lugar de en un archivo local
- Las imágenes seguirán siendo Base64 por ahora (próximo paso)

## Próximos Pasos: Migrar Imágenes a Buckets

Una vez que todo funcione, puedo ayudarte a:
1. **Crear Edge Functions** en Supabase para procesar uploads
2. **Migrar imágenes** de Base64 a los buckets
3. **Configurar Vercel** para que funcione en producción

---

¿Problemas? Revisa la consola del servidor para mensajes de error.

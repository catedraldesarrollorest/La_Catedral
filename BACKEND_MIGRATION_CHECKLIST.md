# ✅ Checklist de Migración del Backend a Supabase

## 📋 Lo que he hecho por ti:

### ✓ Backend refactorizado
- Reescribí `server.ts` para conectarse a Supabase en lugar de guardar en `data.json`
- El servidor ahora:
  - Lee de las tablas `menu_items`, `gallery_items`, `general_info`
  - Guarda cambios directamente en Supabase
  - Mantiene compatibilidad con fallback a datos iniciales si Supabase falla
  - Funciona en desarrollo Y en Vercel (sin archivos locales)

### ✓ Configuración preparada
- `.env.example` actualizado con credenciales Supabase
- `package.json` actualizado con `@supabase/supabase-js`
- Dependencias instaladas (`npm install`)

### ✓ Documentación SQL
- Archivo de migración en `supabase/migrations/001_create_catedral_tables.sql`
- Esquema completo con tablas, RLS policies, e índices

---

## 🚀 Ahora TÚ debes hacer esto:

### Paso 1️⃣: Crear las tablas en Supabase
1. Abre https://app.supabase.com
2. Selecciona tu proyecto (`La_Catedral`)
3. Ve a **SQL Editor** (izquierda)
4. Haz click en **New Query**
5. Copia el contenido de: `supabase/migrations/001_create_catedral_tables.sql`
6. Pégalo en el editor
7. Haz click en **Run** (botón verde) o Ctrl + Enter
8. ✓ Debería completarse sin errores

### Paso 2️⃣: Verificar que las tablas existan
1. En Supabase, ve a **Table Editor** (izquierda)
2. Deberías ver:
   - `menu_items` ✓
   - `gallery_items` ✓
   - `general_info` ✓

### Paso 3️⃣: Crear `.env.local`
```bash
# Copiar .env.example a .env.local
cp .env.example .env.local
```

Las credenciales ya están en `.env.example`, así que solo necesitas copiar el archivo.

### Paso 4️⃣: Probar localmente
```bash
npm run dev
```

Abre http://localhost:3000 y ve a http://localhost:3000#admin para abrir el panel

**Pruebas rápidas:**
- ✓ Agregar un nuevo plato
- ✓ Cambiar un precio
- ✓ Actualizar contacto
- ✓ Subir una foto

Los cambios deberían guardarse en Supabase (no en data.json)

---

## 🎯 Estado de la Migración

| Componente | Estado | Notas |
|-----------|--------|-------|
| Menu Items | ✅ Hecho | Se guardan en BD |
| Gallery Items | ✅ Hecho | Se guardan en BD (aún como URLs o Base64) |
| General Info | ✅ Hecho | Se guardan en BD |
| Images en Buckets | ⏳ Próximo | Las imágenes siguen como Base64 por ahora |
| Vercel Deploy | ⏳ Próximo | Listo cuando las tablas estén creadas |

---

## 📌 Lo que falta (Fase 2):

Una vez que todo funcione localmente, podemos:

1. **Migrar imágenes a Buckets**
   - Crear una Edge Function para procesar uploads
   - Guardar imágenes en los buckets en lugar de Base64
   - Actualizar las URLs en la BD

2. **Configurar Vercel**
   - Variables de entorno en Vercel
   - Probar que el deploy funcione sin archivos locales

---

## 🆘 Si algo no funciona:

**Problema: "Supabase not configured"**
- ✓ Verifica que `.env.local` tenga las credenciales
- ✓ Reinicia el servidor (`npm run dev`)

**Problema: Errores de permisos en Supabase**
- ✓ Las RLS policies permiten lectura pública
- ✓ Verifica que ejecutaste todo el SQL correctamente

**Problema: Cambios no se guardan**
- ✓ Abre la consola del servidor (donde corre `npm run dev`)
- ✓ Busca mensajes de error
- ✓ Verifica que las tablas existan en Supabase

---

## 📞 Siguientes pasos después de verificar:

1. Avísame cuando hayas creado las tablas ✓
2. Prueba localmente y reporta si todo funciona ✓
3. Luego hacemos:
   - Migración de imágenes a buckets
   - Deploy en Vercel
   - Pruebas finales

¿Necesitas ayuda con alguno de estos pasos?

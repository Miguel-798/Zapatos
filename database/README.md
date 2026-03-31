# Base de Datos - Inventario de Zapatos

Este directorio contiene el esquema de base de datos para el sistema de inventario de zapatos, diseñado para Supabase (PostgreSQL).

## Estructura de Archivos

| Archivo | Descripción |
|---------|-------------|
| `schema.sql` | Script completo con tablas, índices y datos iniciales |

## Tablas Creadas

### Catálogos (Tablas Base)
- **categories** - Categorías de zapatos (deportivas, botas, sandalias, etc.)
- **brands** - Marcas de calzado
- **suppliers** - Proveedores
- **locations** - Ubicaciones en el almacén
- **colors** - Colores disponibles
- **materials** - Materiales (cuero, sintético, tela, etc.)
- **sizes** - Tallas europeas (35-46)
- **seasons** - Temporadas (primavera, verano, otoño, invierno)
- **genders** - Géneros (hombre, mujer, niño, unisex)

### Tabla Principal
- **shoes** - Registro principal de zapatos con SKU único

### Tablas Pivot
- **shoe_colors** - Relación muchos a muchos zapato-colores
- **shoe_materials** - Relación muchos a muchos zapato-materiales
- **shoe_sizes** - Relación zapato-talla con stock por talla

## Cómo Ejecutar en Supabase

### Opción 1: SQL Editor (Recomendado para desarrollo)

1. Accede a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor** en el menú lateral
3. Copia todo el contenido de `schema.sql`
4. Pega en el editor y ejecuta (presiona **Run** o Ctrl+Enter)
5. Verifica que no haya errores en la salida

### Opción 2: Línea de Comandos (CLI)

```bash
# Conectarse al proyecto
supabase projects list
supabase links list

# Ejecutar el script
supabase db execute -f database/schema.sql

# O importar desde archivo
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f database/schema.sql
```

### Opción 3: Migrações (Recomendado para producción)

Supabase recomienda usar migraciones para cambios evolutivos:

```bash
# Crear una migración
supabase migration new init_schema

# Editar la migración creada en supabase/migrations/
# Copiar el contenido de schema.sql

# Aplicar migraciones
supabase db push
```

## Verificación Post-Instalación

Para verificar que todo se creó correctamente, ejecuta:

```sql
-- Ver tablas creadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Contar registros en catálogos
SELECT 'categories' as table_name, COUNT(*) as total FROM categories
UNION ALL SELECT 'brands', COUNT(*) FROM brands
UNION ALL SELECT 'colors', COUNT(*) FROM colors
UNION ALL SELECT 'genders', COUNT(*) FROM genders
UNION ALL SELECT 'materials', COUNT(*) FROM materials
UNION ALL SELECT 'seasons', COUNT(*) FROM seasons
UNION ALL SELECT 'sizes', COUNT(*) FROM sizes
UNION ALL SELECT 'locations', COUNT(*) FROM locations;
```

## Notas Importantes

1. **UUIDs**: Todas las tablas usan `gen_random_uuid()` para generar IDs automáticamente
2. **Timestamps**: Las fechas se manejan con `TIMESTAMP WITH TIME ZONE`
3. **Restricciones**: Las tablas tienen foreign keys y constraints de unicidad
4. **Índices**: Se crearon índices para optimizar consultas frecuentes
5. **Datos Seed**: El script incluye datos de ejemplo para pruebas iniciales

## Siguientes Pasos

1. **Habilitar Row Level Security (RLS)** - Para seguridad a nivel de filas
2. **Crear funciones/utilities** - Para operaciones comunes
3. **Configurar replicación** - Si se necesita sincronización en tiempo real
4. **Configurar backups** - En la configuración del proyecto Supabase

## Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase SQL Editor](https://supabase.com/docs/guides/database/sql-editor)

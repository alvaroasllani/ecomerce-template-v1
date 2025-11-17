# ⚡ Guía de Inicio Rápido

## 🚀 Puesta en marcha en 5 pasos

### 1️⃣ Instalar dependencias
```bash
cd backend
npm install
```

### 2️⃣ Configurar PostgreSQL

**Opción más fácil con Docker:**
```bash
docker run --name postgres-ecommerce -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecommerce_db -p 5432:5432 -d postgres:15
```

**O si ya tienes PostgreSQL instalado:**
```bash
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

### 3️⃣ Configurar variables de entorno

El archivo `.env` ya está creado con valores por defecto. Si usas otra configuración de PostgreSQL, edítalo:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/ecommerce_db?schema=public"
```

### 4️⃣ Crear tablas y cargar datos

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 5️⃣ Iniciar el servidor

```bash
npm run start:dev
```

¡Listo! El servidor estará en `http://localhost:3001/api`

## 🧪 Probar la API

### Login como usuario demo:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@ejemplo.com","password":"demo123"}'
```

### Login como administrador:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techstore.com","password":"admin123"}'
```

### Ver productos:
```bash
curl http://localhost:3001/api/products
```

### Ver categorías:
```bash
curl http://localhost:3001/api/categories
```

## 📊 Visualizar base de datos

```bash
npm run prisma:studio
```

Abre: `http://localhost:5555`

## 🔄 Resetear base de datos

Si quieres empezar de cero:

```bash
npx prisma migrate reset
npm run prisma:seed
```

## ⚠️ Problemas comunes

### PostgreSQL no conecta
- Verifica que esté corriendo: `docker ps` o `pg_ctl status`
- Revisa el `DATABASE_URL` en `.env`

### Error en migraciones
```bash
npx prisma migrate reset
npm run prisma:migrate -- --name init
```

### Puerto 3001 ocupado
Cambia el `PORT` en el archivo `.env`

---

Para más detalles, consulta el [README.md](./README.md) completo.


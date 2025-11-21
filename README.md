# E-commerce Template (Next.js + NestJS)

## Tecnologías

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Autenticación:** JWT, Role-Based Access Control (RBAC)
- **Almacenamiento:** Cloudinary (Imágenes)

## Estructura del Proyecto

- `/frontend`: Aplicación cliente (Next.js)
- `/backend`: API REST (NestJS)

## Requisitos Previos

- Node.js (v18+)
- PostgreSQL
- Cuenta en Cloudinary (para subida de imágenes)

## Configuración Rápida

### 1. Backend

```bash
cd backend
npm install
```

Crea un archivo `.env.development` en `/backend` basado en el ejemplo (o usa las variables de entorno necesarias):

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/ecommerce_db"
JWT_SECRET="tu_secreto_super_seguro"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

Ejecuta las migraciones de base de datos:

```bash
npx prisma migrate dev
```

Inicia el servidor:

```bash
npm run start:dev
```

### 2. Frontend

```bash
cd frontend
npm install
```

Crea un archivo `.env.local` en `/frontend` si es necesario (por defecto apunta a localhost:3001).

Inicia la aplicación:

```bash
npm run dev
```

## Características Incluidas

-  Autenticación (Login, Registro, Recuperar Contraseña)
-  Gestión de Productos (CRUD completo, Subida de Imágenes)
-  Carrito de Compras
-  Gestión de Órdenes
-  Panel de Administración
-  Perfil de Usuario


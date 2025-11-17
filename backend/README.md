# 🚀 E-commerce Backend API

Backend API REST desarrollado con NestJS, PostgreSQL y Prisma para un sistema de e-commerce completo.

## 📋 Características

- ✅ Autenticación JWT (login, registro)
- ✅ Autorización por roles (ADMIN, CUSTOMER)
- ✅ CRUD completo de productos
- ✅ Gestión de categorías y marcas
- ✅ Sistema de órdenes/pedidos
- ✅ Validaciones con class-validator
- ✅ Base de datos PostgreSQL con Prisma ORM
- ✅ Seguridad con bcrypt
- ✅ CORS configurado

## 🛠️ Tecnologías

- **NestJS 10** - Framework progresivo de Node.js
- **PostgreSQL** - Base de datos relacional
- **Prisma** - ORM moderno
- **JWT** - Autenticación con tokens
- **Bcrypt** - Hash de contraseñas
- **TypeScript** - Tipado estático

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar PostgreSQL

Asegúrate de tener PostgreSQL instalado y corriendo en tu sistema.

**Opción A: PostgreSQL local**

```bash
# Crear la base de datos
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

**Opción B: Docker (recomendado)**

```bash
docker run --name postgres-ecommerce -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ecommerce_db -p 5432:5432 -d postgres:15
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y ajusta según tu configuración:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"
JWT_SECRET="tu_secreto_super_seguro"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
```

### 4. Ejecutar migraciones de Prisma

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Crear las tablas en la base de datos
npm run prisma:migrate
```

### 5. Cargar datos de prueba (seed)

```bash
npm run prisma:seed
```

Esto creará:

- 6 usuarios (5 clientes + 1 admin)
- 7 categorías
- 3 marcas
- 14 productos

### 6. Iniciar el servidor

**Modo desarrollo:**

```bash
npm run start:dev
```

**Modo producción:**

```bash
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3001/api`

## 🔑 Usuarios de prueba

### Cliente

- **Email:** demo@ejemplo.com
- **Password:** demo123

### Administrador

- **Email:** admin@techstore.com
- **Password:** admin123

## 📚 Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Endpoint         | Descripción                | Auth |
| ------ | ---------------- | -------------------------- | ---- |
| POST   | `/auth/register` | Registrar nuevo usuario    | ❌   |
| POST   | `/auth/login`    | Iniciar sesión             | ❌   |
| GET    | `/auth/profile`  | Obtener perfil del usuario | ✅   |

### Productos (`/api/products`)

| Método | Endpoint              | Descripción                | Auth     |
| ------ | --------------------- | -------------------------- | -------- |
| GET    | `/products`           | Listar todos los productos | ❌       |
| GET    | `/products/featured`  | Productos destacados       | ❌       |
| GET    | `/products/:id`       | Obtener producto por ID    | ❌       |
| POST   | `/products`           | Crear producto             | ✅ Admin |
| PATCH  | `/products/:id`       | Actualizar producto        | ✅ Admin |
| DELETE | `/products/:id`       | Eliminar producto          | ✅ Admin |
| PATCH  | `/products/:id/stock` | Actualizar stock           | ✅ Admin |

**Filtros disponibles:**

- `?categoryId=1` - Filtrar por categoría
- `?brandId=1` - Filtrar por marca
- `?featured=true` - Solo destacados
- `?inStock=true` - Solo en stock
- `?search=teclado` - Búsqueda por texto

### Categorías (`/api/categories`)

| Método | Endpoint                 | Descripción                | Auth     |
| ------ | ------------------------ | -------------------------- | -------- |
| GET    | `/categories`            | Listar categorías          | ❌       |
| GET    | `/categories/:id`        | Obtener categoría por ID   | ❌       |
| GET    | `/categories/slug/:slug` | Obtener categoría por slug | ❌       |
| POST   | `/categories`            | Crear categoría            | ✅ Admin |
| PATCH  | `/categories/:id`        | Actualizar categoría       | ✅ Admin |
| DELETE | `/categories/:id`        | Eliminar categoría         | ✅ Admin |

### Marcas (`/api/brands`)

| Método | Endpoint             | Descripción            | Auth     |
| ------ | -------------------- | ---------------------- | -------- |
| GET    | `/brands`            | Listar marcas          | ❌       |
| GET    | `/brands/:id`        | Obtener marca por ID   | ❌       |
| GET    | `/brands/slug/:slug` | Obtener marca por slug | ❌       |
| POST   | `/brands`            | Crear marca            | ✅ Admin |
| PATCH  | `/brands/:id`        | Actualizar marca       | ✅ Admin |
| DELETE | `/brands/:id`        | Eliminar marca         | ✅ Admin |

### Órdenes (`/api/orders`)

| Método | Endpoint                      | Descripción              | Auth     |
| ------ | ----------------------------- | ------------------------ | -------- |
| POST   | `/orders`                     | Crear orden              | ✅       |
| GET    | `/orders`                     | Listar todas las órdenes | ✅ Admin |
| GET    | `/orders/stats`               | Estadísticas de órdenes  | ✅ Admin |
| GET    | `/orders/my-orders`           | Mis órdenes              | ✅       |
| GET    | `/orders/:id`                 | Obtener orden por ID     | ✅       |
| GET    | `/orders/number/:orderNumber` | Obtener orden por número | ✅       |
| PATCH  | `/orders/:id/status`          | Actualizar estado        | ✅ Admin |
| DELETE | `/orders/:id`                 | Eliminar orden           | ✅ Admin |

### Usuarios (`/api/users`)

| Método | Endpoint     | Descripción            | Auth     |
| ------ | ------------ | ---------------------- | -------- |
| GET    | `/users`     | Listar usuarios        | ✅ Admin |
| GET    | `/users/:id` | Obtener usuario por ID | ✅       |
| PATCH  | `/users/:id` | Actualizar usuario     | ✅       |
| DELETE | `/users/:id` | Eliminar usuario       | ✅ Admin |

## 🔐 Autenticación

Para acceder a endpoints protegidos, incluye el token JWT en el header:

```
Authorization: Bearer <tu_token_jwt>
```

**Ejemplo de login:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@ejemplo.com",
    "password": "demo123"
  }'
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "demo@ejemplo.com",
    "fullName": "Demo User",
    "role": "CUSTOMER"
  }
}
```

## 📊 Prisma Studio

Para visualizar y editar datos en una interfaz gráfica:

```bash
npm run prisma:studio
```

Se abrirá en: `http://localhost:5555`

## 🧪 Scripts disponibles

```bash
npm run start          # Iniciar en modo normal
npm run start:dev      # Iniciar en modo desarrollo (hot reload)
npm run start:prod     # Iniciar en modo producción
npm run build          # Compilar para producción
npm run lint           # Ejecutar linter
npm run format         # Formatear código con Prettier

# Prisma
npm run prisma:generate  # Generar cliente de Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:seed      # Cargar datos de prueba
```

## 📁 Estructura del proyecto

```
backend/
├── prisma/
│   ├── schema.prisma      # Schema de la base de datos
│   └── seed.ts            # Datos iniciales
├── src/
│   ├── auth/              # Módulo de autenticación
│   │   ├── decorators/    # Decoradores (roles, etc)
│   │   ├── dto/           # DTOs de auth
│   │   ├── guards/        # Guards (JWT, Roles)
│   │   └── strategies/    # Estrategias de Passport
│   ├── brands/            # Módulo de marcas
│   ├── categories/        # Módulo de categorías
│   ├── orders/            # Módulo de órdenes
│   ├── prisma/            # Servicio de Prisma
│   ├── products/          # Módulo de productos
│   ├── users/             # Módulo de usuarios
│   ├── app.module.ts      # Módulo principal
│   └── main.ts            # Punto de entrada
├── .env                   # Variables de entorno
├── .env.example           # Ejemplo de variables
├── nest-cli.json          # Configuración de Nest CLI
├── package.json           # Dependencias
├── tsconfig.json          # Configuración de TypeScript
└── README.md              # Este archivo
```

## 🚨 Solución de problemas

### Error de conexión a PostgreSQL

```bash
Error: Can't reach database server at localhost:5432
```

**Solución:** Asegúrate de que PostgreSQL esté corriendo:

```bash
# Windows (si instalaste PostgreSQL)
pg_ctl status

# Docker
docker ps | grep postgres
```

### Error en las migraciones

```bash
npm run prisma:migrate -- --name init
```

### Resetear la base de datos

```bash
npx prisma migrate reset
npm run prisma:seed
```

## 📝 Notas importantes

1. **Cambiar JWT_SECRET en producción**: Usa un secreto fuerte y único
2. **CORS**: Ajusta `CORS_ORIGINS` según tus dominios
3. **PostgreSQL**: En producción usa un servidor dedicado
4. **Contraseñas**: Los hashes se generan automáticamente con bcrypt

## 🔗 Recursos

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 📄 Licencia

MIT

---

Desarrollado con ❤️ para tu proyecto de e-commerce

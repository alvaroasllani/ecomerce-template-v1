# Tech Accessories - Ecommerce Application

Aplicación de ecommerce completa construida con Next.js 16, React 19 y Tailwind CSS 4 para la venta de accesorios tecnológicos.

## Stack Tecnológico

- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca UI con Hooks y Context API
- **Tailwind CSS 4** - Framework CSS utility-first
- **Context API** - Gestión de estado global (carrito, autenticación)
- **localStorage** - Persistencia de datos del lado del cliente

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn

## Estructura del Proyecto

```
ecommerce-app/
├── src/
│   ├── app/
│   │   ├── page.js                 # Página principal
│   │   ├── products/               # Catálogo de productos
│   │   │   ├── page.js
│   │   │   └── [id]/page.js        # Detalle de producto
│   │   ├── cart/                   # Carrito completo
│   │   ├── checkout/               # Proceso de pago
│   │   │   └── confirmation/       # Confirmación de pedido
│   │   ├── orders/                 # Historial de pedidos
│   │   ├── account/                # Perfil de usuario
│   │   ├── contact/                # Formulario de contacto
│   │   ├── login/                  # Inicio de sesión
│   │   ├── signup/                 # Registro
│   │   ├── about/                  # Acerca de nosotros
│   │   └── admin/                  # Panel de administración
│   │       ├── layout.js           # Layout protegido
│   │       ├── dashboard/          # Dashboard con métricas
│   │       ├── products/           # CRUD de productos
│   │       │   ├── page.js
│   │       │   ├── new/            # Crear producto
│   │       │   └── edit/[id]/      # Editar producto
│   │       ├── orders/             # Gestión de pedidos
│   │       └── inventory/          # Control de stock
│   ├── components/
│   │   ├── Header.jsx              # Navegación principal
│   │   ├── Footer.jsx              # Pie de página
│   │   ├── ProductCard.jsx         # Tarjeta de producto
│   │   ├── CartDrawer.jsx          # Vista rápida del carrito
│   │   └── AdminSidebar.jsx        # Barra lateral admin
│   ├── context/
│   │   └── CartContext.jsx         # Gestión global del carrito
│   └── data/
│       ├── products.js             # Datos de productos
│       └── users.js                # Usuarios de ejemplo
└── package.json
```

## Funcionalidades Principales

### Panel de Administración

Sistema completo de administración con autenticación por roles:

**Acceso:**

- Email: `admin@techstore.com`
- Contraseña: `admin123`

**Dashboard:**

- Métricas en tiempo real (ventas, pedidos, productos, stock)
- Ingresos totales y del día
- Productos más vendidos
- Pedidos recientes
- Alertas de stock bajo
- Accesos rápidos a funciones principales

**Gestión de Productos (CRUD):**

- Listar todos los productos con filtros y búsqueda
- Crear nuevos productos con formulario completo
- Editar productos existentes
- Eliminar productos con confirmación
- Toggle de disponibilidad (En Stock / Sin Stock)
- Gestión de categorías, marcas, precios y colores
- Vista previa en la tienda

**Gestión de Pedidos:**

- Lista completa de pedidos con filtros por estado
- Cambio de estado (Procesando → Enviado → Entregado → Cancelado)
- Vista detallada de cada pedido
- Información completa del cliente y dirección de envío
- Resumen de productos y totales
- Estadísticas por estado
- Búsqueda por número de pedido, nombre o email

**Control de Inventario:**

- Gestión de stock en tiempo real
- Actualización de cantidad disponible
- Configuración de stock mínimo por producto
- Ajustes rápidos (+10 / -10 unidades)
- Alertas automáticas de stock bajo
- Alertas de productos sin stock
- Filtros por estado de inventario
- Valor total del inventario

### Autenticación

- Sistema de login y registro de usuarios
- Validación de credenciales
- Persistencia de sesión con localStorage
- **Sistema de roles** (customer / admin)
- Redirección automática según rol
- Menú de usuario dinámico (login/logout)
- Protección de rutas (Mi Cuenta requiere autenticación)
- Protección del panel admin (requiere rol de administrador)

### Navegación

- Barra de navegación completa: Inicio, Tienda, Categorías, Contacto, Mi Cuenta, Carrito, Mis Pedidos
- Dropdown de categorías con 7 opciones
- Búsqueda funcional con filtrado en tiempo real
- Filtrado automático por categoría desde URL
- Vista rápida del carrito (drawer lateral)

### Catálogo de Productos

- Lista de productos con filtros múltiples (categoría, marca, precio)
- Ordenamiento (precio, rating, novedad)
- Paginación (6 productos por página)
- Búsqueda por nombre, descripción, categoría y marca
- Detalle de producto con pestañas (Descripción, Especificaciones, Reseñas)
- Galería de imágenes
- Sistema de rating y reseñas

### Carrito de Compras

- Agregar/eliminar productos
- Ajuste de cantidades (incrementar/decrementar)
- Vista rápida (CartDrawer) y vista completa (página /cart)
- Cálculo automático de subtotal y total
- Envío gratis para compras superiores a $200
- Barra de progreso para envío gratis
- Persistencia en localStorage

### Proceso de Pago

- Formulario de checkout con validación
- Información de contacto, envío y pago
- Sistema de códigos de descuento
- Resumen dinámico del pedido
- Página de confirmación con número de orden
- Guardado automático del pedido

### Mi Cuenta

Sistema completo de gestión de perfil con 6 secciones:

- **Datos Personales**: nombre, apellido, email, teléfono
- **Direcciones**: gestión de direcciones de envío y facturación
- **Mis Pedidos**: enlace al historial completo
- **Métodos de Pago**: gestión de tarjetas guardadas
- **Lista de Deseos**: productos favoritos
- **Configuración**: cambiar contraseña, idioma, notificaciones, eliminar cuenta

### Historial de Pedidos

- Lista de todos los pedidos realizados
- Estados: Procesando, Enviado, Entregado, Cancelado
- Detalles expandibles por pedido
- Información de envío
- Resumen de costos

### Contacto

- Formulario de contacto funcional
- Información de empresa (email, teléfono, dirección)
- Enlaces a redes sociales
- Validación de campos

## Usuarios de Prueba

### Administrador:

```
Email: admin@techstore.com
Contraseña: admin123
Rol: admin
```

### Clientes:

```
Email: juan@ejemplo.com
Contraseña: 123456
Rol: customer

Email: demo@ejemplo.com
Contraseña: demo123
```

Más usuarios disponibles en `src/data/users.js`

## Almacenamiento de Datos

La aplicación utiliza localStorage del navegador:

```javascript
// Carrito
localStorage.getItem("cart");

// Productos personalizados (CRUD admin)
localStorage.getItem("customProducts");

// Inventario
localStorage.getItem("adminInventory");

// Pedidos
localStorage.getItem("orders");

// Sesión de usuario
localStorage.getItem("userSession");

// Perfil de usuario (por ID)
localStorage.getItem("profile_{userId}");
```

Para limpiar todos los datos:

```javascript
localStorage.clear();
```

## Configuración de Productos

Agregar productos en `src/data/products.js`:

```javascript
{
  id: 1,
  name: "Nombre del Producto",
  description: "Descripción breve",
  price: 99.99,
  category: "Categoría",
  brand: "Marca",
  bgColor: "bg-slate-800",
  featured: true,
  inStock: true,
  rating: 4.5,
  reviews: 100
}
```

Categorías disponibles:

- Teclados
- Ratones
- Alfombrillas
- Cables
- Accesorios
- Audio
- Almacenamiento

## Categorías y URLs

El sistema mapea automáticamente entre slugs de URL y nombres de categorías:

```
/products?category=keyboards → Teclados
/products?category=mice → Ratones
/products?category=desk-mats → Alfombrillas
```

## Notas Técnicas

### Optimizaciones

- Funciones del carrito envueltas en `useCallback` para prevenir re-renders
- `useRef` en confirmación de pedido para evitar múltiples limpiezas
- Actualización de URL sin recargar página en filtros
- Lazy loading preparado para imágenes

### Diseño Responsivo

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Navegación sticky
- Drawer lateral en móvil

## Paleta de Colores

- **Primario**: `indigo-600` (botones, enlaces)
- **Secundario**: `gray-*` (textos, bordes)
- **Éxito**: `green-600` (confirmaciones)
- **Error**: `red-600` (errores, eliminar)
- **Advertencia**: `amber-500` (alertas)

## Resolución de Problemas

### El carrito no persiste

Verificar que localStorage esté habilitado en el navegador.

### Error "Maximum update depth exceeded"

Ya resuelto mediante `useCallback` en funciones del contexto.

### Categorías no filtran correctamente

Verificar el mapeo en `categorySlugToName` en `src/app/products/page.js`.

### Usuario no puede acceder a Mi Cuenta

Asegurarse de iniciar sesión primero en `/login`.

## Próximas Mejoras Sugeridas

- Integración con backend real (API REST o GraphQL)
- Pasarela de pago real (Stripe, PayPal)
- Sistema de imágenes real (Cloudinary, AWS S3)
- Base de datos (PostgreSQL, MongoDB)
- Autenticación JWT
- Envío de emails transaccionales
- Panel de administración
- Analytics y métricas

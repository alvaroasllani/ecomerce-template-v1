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

## Instalación

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

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
│   │   └── about/                  # Acerca de nosotros
│   ├── components/
│   │   ├── Header.jsx              # Navegación principal
│   │   ├── Footer.jsx              # Pie de página
│   │   ├── ProductCard.jsx         # Tarjeta de producto
│   │   └── CartDrawer.jsx          # Vista rápida del carrito
│   ├── context/
│   │   └── CartContext.jsx         # Gestión global del carrito
│   └── data/
│       ├── products.js             # Datos de productos
│       └── users.js                # Usuarios de ejemplo
└── package.json
```

## Funcionalidades Principales

### Autenticación

- Sistema de login y registro
- Validación de credenciales
- Sesión persistente en localStorage
- Usuarios de ejemplo para pruebas
- Protección de rutas (Mi Cuenta requiere autenticación)

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

## Usuarios de Ejemplo

Para probar el sistema de autenticación:

```
Email: juan@ejemplo.com
Contraseña: 123456

Email: demo@ejemplo.com
Contraseña: demo123
```

Más usuarios disponibles en `src/data/users.js`

## Códigos de Descuento

Códigos disponibles para pruebas en checkout:

- `WELCOME10` - $10 de descuento
- `SAVE20` - $20 de descuento

## Almacenamiento de Datos

La aplicación utiliza localStorage del navegador:

```javascript
// Carrito
localStorage.getItem("cart");

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

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo en http://localhost:3000
npm run build    # Construir para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
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

### Accesibilidad

- Atributos ARIA en botones interactivos
- Contraste de colores optimizado
- Navegación por teclado
- Labels descriptivos en formularios

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

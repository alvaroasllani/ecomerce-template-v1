# 📖 Ejemplos de Uso de la API

## 🔐 Autenticación

### Registrar nuevo usuario
```javascript
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'nuevo@ejemplo.com',
    password: 'password123',
    fullName: 'Usuario Nuevo'
  })
});

const data = await response.json();
// { access_token: "...", user: {...} }
```

### Login
```javascript
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'demo@ejemplo.com',
    password: 'demo123'
  })
});

const { access_token, user } = await response.json();
localStorage.setItem('token', access_token);
```

### Obtener perfil (requiere autenticación)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const profile = await response.json();
```

## 🛍️ Productos

### Listar todos los productos
```javascript
const response = await fetch('http://localhost:3001/api/products');
const products = await response.json();
```

### Productos destacados
```javascript
const response = await fetch('http://localhost:3001/api/products/featured');
const featured = await response.json();
```

### Buscar productos
```javascript
// Por categoría
const response = await fetch('http://localhost:3001/api/products?categoryId=1');

// Por marca
const response = await fetch('http://localhost:3001/api/products?brandId=2');

// Por texto
const response = await fetch('http://localhost:3001/api/products?search=teclado');

// Solo en stock
const response = await fetch('http://localhost:3001/api/products?inStock=true');

// Combinado
const response = await fetch('http://localhost:3001/api/products?categoryId=1&featured=true&inStock=true');
```

### Obtener un producto
```javascript
const response = await fetch('http://localhost:3001/api/products/1');
const product = await response.json();
```

### Crear producto (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Nuevo Producto',
    description: 'Descripción del producto',
    price: 99.99,
    categoryId: 1,
    brandId: 2,
    image: '/products/nuevo.jpg',
    bgColor: 'bg-blue-500',
    featured: false,
    inStock: true,
    rating: 4.5,
    reviews: 0
  })
});

const newProduct = await response.json();
```

### Actualizar producto (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/products/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    price: 89.99,
    inStock: false
  })
});
```

### Actualizar stock (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/products/1/stock', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    inStock: true
  })
});
```

### Eliminar producto (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/products/1', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📂 Categorías

### Listar categorías
```javascript
const response = await fetch('http://localhost:3001/api/categories');
const categories = await response.json();
```

### Obtener categoría por slug
```javascript
const response = await fetch('http://localhost:3001/api/categories/slug/keyboards');
const category = await response.json();
// Incluye los productos de esa categoría
```

### Crear categoría (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Nueva Categoría',
    slug: 'nueva-categoria'
  })
});
```

## 🏷️ Marcas

### Listar marcas
```javascript
const response = await fetch('http://localhost:3001/api/brands');
const brands = await response.json();
```

### Obtener marca por slug con sus productos
```javascript
const response = await fetch('http://localhost:3001/api/brands/slug/aero');
const brand = await response.json();
```

## 🛒 Órdenes

### Crear orden (requiere autenticación)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 1 }
    ],
    shippingName: 'Juan Pérez',
    shippingEmail: 'juan@ejemplo.com',
    shippingAddress: 'Calle Principal 123',
    shippingCity: 'Ciudad',
    shippingZip: '12345',
    shippingCountry: 'México',
    shipping: 15.00
  })
});

const order = await response.json();
// { id, orderNumber, status, total, ... }
```

### Ver mis órdenes
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/orders/my-orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const myOrders = await response.json();
```

### Ver orden específica
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/orders/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const order = await response.json();
```

### Ver orden por número
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/orders/number/ORD-1234567890-ABC', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const order = await response.json();
```

### Actualizar estado de orden (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/orders/1/status', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    status: 'SHIPPED' // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  })
});
```

### Ver estadísticas de órdenes (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/orders/stats', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const stats = await response.json();
// { totalOrders, pendingOrders, totalRevenue, ... }
```

### Listar todas las órdenes (solo admin)
```javascript
const token = localStorage.getItem('token');

// Todas las órdenes
const response = await fetch('http://localhost:3001/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Filtrar por estado
const response = await fetch('http://localhost:3001/api/orders?status=PENDING', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 👥 Usuarios

### Listar usuarios (solo admin)
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const users = await response.json();
```

### Obtener usuario específico
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3001/api/users/1', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const user = await response.json();
```

## 🛡️ Manejo de Errores

### Error 401 - No autenticado
```javascript
const response = await fetch('http://localhost:3001/api/orders/my-orders');

if (response.status === 401) {
  // Redirigir al login
  window.location.href = '/login';
}
```

### Error 403 - No autorizado (sin permisos)
```javascript
const response = await fetch('http://localhost:3001/api/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({...})
});

if (response.status === 403) {
  alert('No tienes permisos para realizar esta acción');
}
```

### Error 404 - No encontrado
```javascript
const response = await fetch('http://localhost:3001/api/products/999');

if (response.status === 404) {
  const error = await response.json();
  console.log(error.message); // "Producto con ID 999 no encontrado"
}
```

### Error 400 - Validación
```javascript
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'invalid-email',
    password: '123' // muy corta
  })
});

if (response.status === 400) {
  const error = await response.json();
  console.log(error.message); // Array con errores de validación
}
```

## 🔧 Hook de React para usar la API

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        };

        const response = await fetch(`http://localhost:3001/api${url}`, {
          ...options,
          headers
        });

        if (!response.ok) {
          throw new Error('Error en la petición');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Uso:
// const { data: products, loading, error } = useApi('/products');
```

## 🌐 Variables de entorno en Frontend

```javascript
// .env.local (Next.js)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

// Uso en el código:
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const response = await fetch(`${API_URL}/products`);
```

---

¡Listo para integrar con tu frontend! 🚀


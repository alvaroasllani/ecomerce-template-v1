export const products = [
  {
    id: 1,
    name: "Cargador Inalámbrico",
    description: "Carga rápida y confiable.",
    price: 49.99,
    category: "Accesorios",
    brand: "Flow",
    image: "/products/wireless-charger.jpg",
    bgColor: "bg-slate-800",
    featured: true,
    inStock: true,
    rating: 4.5,
    reviews: 127
  },
  {
    id: 2,
    name: "Funda para Laptop Elegante",
    description: "Protección premium, diseño minimalista.",
    price: 79.99,
    category: "Accesorios",
    brand: "Aero",
    image: "/products/laptop-sleeve.jpg",
    bgColor: "bg-gray-200",
    featured: true,
    inStock: true,
    rating: 4.8,
    reviews: 89
  },
  {
    id: 3,
    name: "Adaptador de Viaje",
    description: "Tu compañero global perfecto.",
    price: 34.99,
    category: "Accesorios",
    brand: "Flow",
    image: "/products/travel-adapter.jpg",
    bgColor: "bg-teal-300",
    featured: true,
    inStock: true,
    rating: 4.6,
    reviews: 203
  },
  {
    id: 4,
    name: "Soporte Magnético para Teléfono",
    description: "Resistente, ajustable y elegante.",
    price: 29.99,
    category: "Accesorios",
    brand: "Orbit",
    image: "/products/phone-stand.jpg",
    bgColor: "bg-teal-700",
    featured: true,
    inStock: true,
    rating: 4.7,
    reviews: 156
  },
  {
    id: 5,
    name: "Hub USB-C",
    description: "Solución de conectividad 7 en 1.",
    price: 59.99,
    category: "Cables",
    brand: "Orbit",
    image: "/products/usb-hub.jpg",
    bgColor: "bg-gray-800",
    featured: false,
    inStock: true,
    rating: 4.4,
    reviews: 78
  },
  {
    id: 6,
    name: "Audífonos Bluetooth",
    description: "Sonido cristalino, comodidad todo el día.",
    price: 129.99,
    category: "Audio",
    brand: "Aero",
    image: "/products/headphones.jpg",
    bgColor: "bg-blue-900",
    featured: false,
    inStock: true,
    rating: 4.9,
    reviews: 342
  },
  {
    id: 7,
    name: "SSD Portátil",
    description: "1TB de almacenamiento ultra rápido.",
    price: 149.99,
    category: "Almacenamiento",
    brand: "Flow",
    image: "/products/portable-ssd.jpg",
    bgColor: "bg-purple-900",
    featured: false,
    inStock: true,
    rating: 4.8,
    reviews: 167
  },
  {
    id: 8,
    name: "Cámara Web 4K",
    description: "Calidad de video profesional.",
    price: 99.99,
    category: "Accesorios",
    brand: "Aero",
    image: "/products/webcam.jpg",
    bgColor: "bg-indigo-800",
    featured: false,
    inStock: false,
    rating: 4.6,
    reviews: 92
  },
  {
    id: 9,
    name: "Teclado Inalámbrico Aero 75",
    description: "Teclado mecánico premium.",
    price: 189.00,
    category: "Teclados",
    brand: "Aero",
    image: "/products/keyboard-aero.jpg",
    bgColor: "bg-teal-800",
    featured: false,
    inStock: true,
    rating: 4.9,
    reviews: 456
  },
  {
    id: 10,
    name: "Mouse Orbit Pro",
    description: "Mouse inalámbrico ergonómico.",
    price: 99.00,
    category: "Ratones",
    brand: "Orbit",
    image: "/products/mouse-orbit.jpg",
    bgColor: "bg-slate-900",
    featured: false,
    inStock: true,
    rating: 4.7,
    reviews: 289
  },
  {
    id: 11,
    name: "Alfombrilla Flow - Grande",
    description: "Protección premium para tu escritorio.",
    price: 45.00,
    category: "Alfombrillas",
    brand: "Flow",
    image: "/products/deskmat-flow.jpg",
    bgColor: "bg-amber-200",
    featured: false,
    inStock: true,
    rating: 4.6,
    reviews: 178
  },
  {
    id: 12,
    name: "Cable Personalizado CoilFlex",
    description: "Cable enrollado hecho a mano.",
    price: 65.00,
    category: "Cables",
    brand: "Flow",
    image: "/products/cable-coil.jpg",
    bgColor: "bg-amber-100",
    featured: false,
    inStock: true,
    rating: 4.8,
    reviews: 234
  },
  {
    id: 13,
    name: "Teclado RGB Spectra",
    description: "Teclado mecánico RGB completo.",
    price: 159.00,
    category: "Teclados",
    brand: "Aero",
    image: "/products/keyboard-rgb.jpg",
    bgColor: "bg-slate-900",
    featured: false,
    inStock: true,
    rating: 4.7,
    reviews: 312
  },
  {
    id: 14,
    name: "Mouse Ergonómico Glide",
    description: "Mouse ergonómico vertical.",
    price: 85.00,
    category: "Ratones",
    brand: "Orbit",
    image: "/products/mouse-ergo.jpg",
    bgColor: "bg-slate-800",
    featured: false,
    inStock: true,
    rating: 4.8,
    reviews: 198
  }
];

export const categories = [
  { id: 1, name: "Todos los Productos", slug: "all" },
  { id: 2, name: "Teclados", slug: "keyboards" },
  { id: 3, name: "Ratones", slug: "mice" },
  { id: 4, name: "Alfombrillas", slug: "desk-mats" },
  { id: 5, name: "Cables", slug: "cables" },
  { id: 6, name: "Accesorios", slug: "accessories" },
  { id: 7, name: "Audio", slug: "audio" },
  { id: 8, name: "Almacenamiento", slug: "storage" }
];

export const brands = [
  { id: 1, name: "Aero", slug: "aero" },
  { id: 2, name: "Orbit", slug: "orbit" },
  { id: 3, name: "Flow", slug: "flow" }
];

export const getFeaturedProducts = () => {
  return products.filter(product => product.featured);
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  if (category === "all") return products;
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
};

export const getProductsByBrand = (brand) => {
  return products.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
};

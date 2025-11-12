export const products = [
  {
    id: 1,
    name: "Wireless Charger",
    description: "Fast and reliable charging.",
    price: 49.99,
    category: "Accessories",
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
    name: "Sleek Laptop Sleeve",
    description: "Premium protection, minimal design.",
    price: 79.99,
    category: "Accessories",
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
    name: "Travel Adapter",
    description: "Your perfect global companion.",
    price: 34.99,
    category: "Accessories",
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
    name: "Magnetic Phone Stand",
    description: "Sturdy, adjustable, and stylish.",
    price: 29.99,
    category: "Accessories",
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
    name: "USB-C Hub",
    description: "7-in-1 connectivity solution.",
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
    name: "Bluetooth Headphones",
    description: "Crystal clear sound, all day comfort.",
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
    name: "Portable SSD",
    description: "1TB ultra-fast storage.",
    price: 149.99,
    category: "Storage",
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
    name: "Webcam 4K",
    description: "Professional video quality.",
    price: 99.99,
    category: "Accessories",
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
    name: "Aero 75 Wireless Keyboard",
    description: "Premium mechanical keyboard.",
    price: 189.00,
    category: "Keyboards",
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
    name: "Orbit Pro Mouse",
    description: "Ergonomic wireless mouse.",
    price: 99.00,
    category: "Mice",
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
    name: "Flow Desk Mat - Large",
    description: "Premium workspace protection.",
    price: 45.00,
    category: "Desk Mats",
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
    name: "CoilFlex Custom Cable",
    description: "Handcrafted coiled cable.",
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
    name: "Spectra RGB Keyboard",
    description: "Full RGB mechanical keyboard.",
    price: 159.00,
    category: "Keyboards",
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
    name: "Glide Ergo Mouse",
    description: "Vertical ergonomic mouse.",
    price: 85.00,
    category: "Mice",
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
  { id: 1, name: "All Products", slug: "all" },
  { id: 2, name: "Keyboards", slug: "keyboards" },
  { id: 3, name: "Mice", slug: "mice" },
  { id: 4, name: "Desk Mats", slug: "desk-mats" },
  { id: 5, name: "Cables", slug: "cables" },
  { id: 6, name: "Accessories", slug: "accessories" },
  { id: 7, name: "Audio", slug: "audio" },
  { id: 8, name: "Storage", slug: "storage" }
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

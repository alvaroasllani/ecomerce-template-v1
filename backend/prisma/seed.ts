import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes (en orden debido a las relaciones)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Datos existentes eliminados');

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('123456', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'juan@ejemplo.com',
        password: hashedPassword,
        fullName: 'Juan Pérez',
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria@ejemplo.com',
        password: hashedPassword,
        fullName: 'María García',
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos@ejemplo.com',
        password: hashedPassword,
        fullName: 'Carlos Rodríguez',
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana@ejemplo.com',
        password: hashedPassword,
        fullName: 'Ana Martínez',
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'demo@ejemplo.com',
        password: await bcrypt.hash('demo123', 10),
        fullName: 'Demo User',
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'admin@techstore.com',
        password: hashedAdminPassword,
        fullName: 'Administrador TechStore',
        role: Role.ADMIN,
      },
    }),
  ]);

  console.log(`✅ ${users.length} usuarios creados`);

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Accesorios', slug: 'accessories' } }),
    prisma.category.create({ data: { name: 'Cables', slug: 'cables' } }),
    prisma.category.create({ data: { name: 'Audio', slug: 'audio' } }),
    prisma.category.create({ data: { name: 'Almacenamiento', slug: 'storage' } }),
    prisma.category.create({ data: { name: 'Teclados', slug: 'keyboards' } }),
    prisma.category.create({ data: { name: 'Ratones', slug: 'mice' } }),
    prisma.category.create({ data: { name: 'Alfombrillas', slug: 'desk-mats' } }),
  ]);

  console.log(`✅ ${categories.length} categorías creadas`);

  // Crear marcas
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Flow', slug: 'flow' } }),
    prisma.brand.create({ data: { name: 'Aero', slug: 'aero' } }),
    prisma.brand.create({ data: { name: 'Orbit', slug: 'orbit' } }),
  ]);

  console.log(`✅ ${brands.length} marcas creadas`);

  // Obtener IDs de categorías y marcas
  const accesoriosCategory = categories.find(c => c.slug === 'accessories');
  const cablesCategory = categories.find(c => c.slug === 'cables');
  const audioCategory = categories.find(c => c.slug === 'audio');
  const almacenamientoCategory = categories.find(c => c.slug === 'storage');
  const tecladosCategory = categories.find(c => c.slug === 'keyboards');
  const ratonesCategory = categories.find(c => c.slug === 'mice');
  const alfombrillasCategory = categories.find(c => c.slug === 'desk-mats');

  const flowBrand = brands.find(b => b.slug === 'flow');
  const aeroBrand = brands.find(b => b.slug === 'aero');
  const orbitBrand = brands.find(b => b.slug === 'orbit');

  // Verificar que todas las categorías y marcas existen
  if (!accesoriosCategory || !cablesCategory || !audioCategory || !almacenamientoCategory || 
      !tecladosCategory || !ratonesCategory || !alfombrillasCategory) {
    throw new Error('Error: No se encontraron todas las categorías necesarias');
  }

  if (!flowBrand || !aeroBrand || !orbitBrand) {
    throw new Error('Error: No se encontraron todas las marcas necesarias');
  }

  // Crear productos
  // Nota: Se dejan las imágenes vacías ("") según solicitud
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Cargador Inalámbrico',
        description: 'Carga rápida y confiable.',
        price: 49.99,
        categoryId: accesoriosCategory.id,
        brandId: flowBrand.id,
        image: '',
        bgColor: 'bg-slate-800',
        featured: true,
        inStock: true,
        rating: 4.5,
        reviews: 127,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Funda para Laptop Elegante',
        description: 'Protección premium, diseño minimalista.',
        price: 79.99,
        categoryId: accesoriosCategory.id,
        brandId: aeroBrand.id,
        image: '',
        bgColor: 'bg-gray-200',
        featured: true,
        inStock: true,
        rating: 4.8,
        reviews: 89,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Adaptador de Viaje',
        description: 'Tu compañero global perfecto.',
        price: 34.99,
        categoryId: accesoriosCategory.id,
        brandId: flowBrand.id,
        image: '',
        bgColor: 'bg-teal-300',
        featured: true,
        inStock: true,
        rating: 4.6,
        reviews: 203,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Soporte Magnético para Teléfono',
        description: 'Resistente, ajustable y elegante.',
        price: 29.99,
        categoryId: accesoriosCategory.id,
        brandId: orbitBrand.id,
        image: '',
        bgColor: 'bg-teal-700',
        featured: true,
        inStock: true,
        rating: 4.7,
        reviews: 156,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Hub USB-C',
        description: 'Solución de conectividad 7 en 1.',
        price: 59.99,
        categoryId: cablesCategory.id,
        brandId: orbitBrand.id,
        image: '',
        bgColor: 'bg-gray-800',
        featured: false,
        inStock: true,
        rating: 4.4,
        reviews: 78,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Audífonos Bluetooth',
        description: 'Sonido cristalino, comodidad todo el día.',
        price: 129.99,
        categoryId: audioCategory.id,
        brandId: aeroBrand.id,
        image: '',
        bgColor: 'bg-blue-900',
        featured: false,
        inStock: true,
        rating: 4.9,
        reviews: 342,
      },
    }),
    prisma.product.create({
      data: {
        name: 'SSD Portátil',
        description: '1TB de almacenamiento ultra rápido.',
        price: 149.99,
        categoryId: almacenamientoCategory.id,
        brandId: flowBrand.id,
        image: '',
        bgColor: 'bg-purple-900',
        featured: false,
        inStock: true,
        rating: 4.8,
        reviews: 167,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cámara Web 4K',
        description: 'Calidad de video profesional.',
        price: 99.99,
        categoryId: accesoriosCategory.id,
        brandId: aeroBrand.id,
        image: '',
        bgColor: 'bg-indigo-800',
        featured: false,
        inStock: false,
        rating: 4.6,
        reviews: 92,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Teclado Inalámbrico Aero 75',
        description: 'Teclado mecánico premium.',
        price: 189.00,
        categoryId: tecladosCategory.id,
        brandId: aeroBrand.id,
        image: '',
        bgColor: 'bg-teal-800',
        featured: false,
        inStock: true,
        rating: 4.9,
        reviews: 456,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mouse Orbit Pro',
        description: 'Mouse inalámbrico ergonómico.',
        price: 99.00,
        categoryId: ratonesCategory.id,
        brandId: orbitBrand.id,
        image: '',
        bgColor: 'bg-slate-900',
        featured: false,
        inStock: true,
        rating: 4.7,
        reviews: 289,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Alfombrilla Flow - Grande',
        description: 'Protección premium para tu escritorio.',
        price: 45.00,
        categoryId: alfombrillasCategory.id,
        brandId: flowBrand.id,
        image: '',
        bgColor: 'bg-amber-200',
        featured: false,
        inStock: true,
        rating: 4.6,
        reviews: 178,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cable Personalizado CoilFlex',
        description: 'Cable enrollado hecho a mano.',
        price: 65.00,
        categoryId: cablesCategory.id,
        brandId: flowBrand.id,
        image: '',
        bgColor: 'bg-amber-100',
        featured: false,
        inStock: true,
        rating: 4.8,
        reviews: 234,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Teclado RGB Spectra',
        description: 'Teclado mecánico RGB completo.',
        price: 159.00,
        categoryId: tecladosCategory.id,
        brandId: aeroBrand.id,
        image: '',
        bgColor: 'bg-slate-900',
        featured: false,
        inStock: true,
        rating: 4.7,
        reviews: 312,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Mouse Ergonómico Glide',
        description: 'Mouse ergonómico vertical.',
        price: 85.00,
        categoryId: ratonesCategory.id,
        brandId: orbitBrand.id,
        image: '',
        bgColor: 'bg-slate-800',
        featured: false,
        inStock: true,
        rating: 4.8,
        reviews: 198,
      },
    }),
  ]);

  console.log(`✅ ${products.length} productos creados`);

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📊 Resumen:');
  console.log(`   - ${users.length} usuarios`);
  console.log(`   - ${categories.length} categorías`);
  console.log(`   - ${brands.length} marcas`);
  console.log(`   - ${products.length} productos`);
  console.log('');
  console.log('👤 Usuarios de prueba:');
  console.log('   Cliente: demo@ejemplo.com / demo123');
  console.log('   Admin: admin@techstore.com / admin123');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

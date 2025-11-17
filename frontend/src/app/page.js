"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Cargar productos dinámicos o usar los iniciales
    const customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
    if (customProducts.length > 0) {
      // Filtrar solo los destacados
      const featured = customProducts.filter(p => p.featured);
      setFeaturedProducts(featured.length > 0 ? featured : customProducts.slice(0, 4));
    } else {
      setFeaturedProducts(getFeaturedProducts());
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Eleva tu Tecnología Diaria
            </h1>
            <p className="text-xl text-gray-600">
              Accesorios minimalistas diseñados para la vida moderna.
            </p>
            <Link href="/products">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl">
                Explorar Colección
              </button>
            </Link>
          </div>
          
          <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-700 via-amber-200 to-orange-600 shadow-2xl">
            <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.3)_0%,_transparent_50%)]"></div>
            <div className="absolute top-8 left-8 w-24 h-24 bg-teal-900 rounded-full opacity-70"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-orange-700 rounded-full opacity-60"></div>
            <div className="absolute bottom-16 left-16 w-40 h-40 bg-teal-800 rounded-full opacity-50"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Destacados de la Semana
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products">
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-indigo-600 hover:text-white transition-colors">
              Ver Todos los Productos
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Envío Gratis</h3>
            <p className="text-gray-600">En pedidos superiores a Bs 500</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pago Seguro</h3>
            <p className="text-gray-600">Transacciones 100% seguras</p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Devoluciones Fáciles</h3>
            <p className="text-gray-600">Política de devolución de 30 días</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

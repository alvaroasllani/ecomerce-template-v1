"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories, getBrands } from "@/lib/api";

const ITEMS_PER_PAGE = 6;

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categorySlug = searchParams.get("category") || "";

  const [selectedCategories, setSelectedCategories] = useState([]); // Array of IDs
  const [selectedBrands, setSelectedBrands] = useState([]); // Array of IDs
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Array of objects {id, name, slug}
  const [brands, setBrands] = useState([]); // Array of objects {id, name}
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar categorías y marcas al inicio
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cats, brds] = await Promise.all([
          getCategories(),
          getBrands()
        ]);
        setCategories(cats);
        setBrands(brds);
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    }
    loadFilters();
  }, []);

  // Aplicar categoría desde URL al cargar
  useEffect(() => {
    if (categorySlug && categories.length > 0) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategories([category.id]);
      }
    } else if (!categorySlug) {
      setSelectedCategories([]);
    }
  }, [categorySlug, categories]);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        const filters = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sort: sortBy,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          search: searchQuery,
        };

        if (selectedCategories.length > 0) filters.categoryId = selectedCategories[0];
        if (selectedBrands.length > 0) filters.brandId = selectedBrands[0];

        const response = await getProducts(filters);
        setProducts(response.data);
        setTotalProducts(response.meta.total);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      loadProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, sortBy, priceRange, searchQuery, selectedCategories, selectedBrands]);

  // Handlers
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [categoryId]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [brandId]
    );
    setCurrentPage(1);
  };

  const removeFilter = (type, value) => {
    if (type === "category") {
      setSelectedCategories(prev => prev.filter(id => id !== value));
    } else if (type === "brand") {
      setSelectedBrands(prev => prev.filter(id => id !== value));
    }
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedBrands.length > 0 ||
    priceRange[0] !== 0 || priceRange[1] !== 500;

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Categoría</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Marca</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => toggleBrand(brand.id)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-gray-900">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Precio</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {searchQuery ? `Resultados para "${searchQuery}"` : "Todos los Productos"}
              </h1>
              <p className="text-gray-600">
                Mostrando {products.length} de {totalProducts} productos
              </p>
            </div>

            {/* Active Filters & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Active Filter Tags */}
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Búsqueda: {searchQuery}
                  </div>
                )}
                {selectedCategories.map((catId) => {
                  const cat = categories.find(c => c.id === catId);
                  if (!cat) return null;
                  return (
                    <button
                      key={catId}
                      onClick={() => removeFilter("category", catId)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Categoría: {cat.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })}
                {selectedBrands.map((brandId) => {
                  const brand = brands.find(b => b.id === brandId);
                  if (!brand) return null;
                  return (
                    <button
                      key={brandId}
                      onClick={() => removeFilter("brand", brandId)}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      Marca: {brand.name}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 whitespace-nowrap">Ordenar por:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="newest">Más Recientes</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor Valorados</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="flex justify-between items-center pt-4">
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-10"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentPage === index + 1
                            ? "bg-indigo-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600 mb-4">Intenta ajustar los filtros</p>
                <button
                  onClick={clearAllFilters}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminInventoryPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  const checkAuth = () => {
    const sessionStr = localStorage.getItem("userSession");
    if (!sessionStr) {
      router.push("/login?redirect=/admin/inventory");
      return;
    }
    
    const session = JSON.parse(sessionStr);
    if (session.role !== "ADMIN") {
      router.push("/");
      return;
    }
  };

  const getAuthHeaders = () => {
    const sessionStr = localStorage.getItem("userSession");
    const session = JSON.parse(sessionStr);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    };
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/products?limit=1000`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`${apiUrl}/products/${product.id}/stock`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inStock: !product.inStock }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar stock");
      }

      alert(`Producto ${!product.inStock ? 'activado' : 'desactivado'} exitosamente`);
      loadProducts();
    } catch (error) {
      console.error("Error toggling stock:", error);
      alert("Error al actualizar stock");
    }
  };

  // Filtrar productos
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterStatus === "all") return matchesSearch;
      if (filterStatus === "in-stock") return matchesSearch && p.inStock;
      if (filterStatus === "out-of-stock") return matchesSearch && !p.inStock;
      
      return matchesSearch;
    });

  // Estadísticas
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Control de Inventario</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gestiona el stock de tus productos
              </p>
            </div>
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              ← Volver al Panel
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Stock</p>
                <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-lg p-3">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sin Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Producto
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
              >
                <option value="all">Todos los productos</option>
                <option value="in-stock">En Stock</option>
                <option value="out-of-stock">Sin Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">Sin img</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.brand?.name || 'Sin marca'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        Bs. {product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "En Stock" : "Sin Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          product.inStock
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {product.inStock ? "Marcar Sin Stock" : "Marcar En Stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { products as initialProducts } from "@/data/products";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState({});
  const [editingStock, setEditingStock] = useState(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Cargar productos
    const customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
    const productsToUse = customProducts.length > 0 ? customProducts : initialProducts;
    setProducts(productsToUse);

    // Cargar inventario o crear uno inicial
    let savedInventory = JSON.parse(localStorage.getItem("adminInventory") || "{}");
    
    // Si no existe inventario, crear uno inicial
    if (Object.keys(savedInventory).length === 0) {
      const initialInventory = {};
      productsToUse.forEach(product => {
        initialInventory[product.id] = {
          stock: Math.floor(Math.random() * 100) + 20, // Stock aleatorio entre 20-120
          minStock: 10,
          lastUpdated: new Date().toISOString(),
        };
      });
      savedInventory = initialInventory;
      localStorage.setItem("adminInventory", JSON.stringify(savedInventory));
    }
    
    setInventory(savedInventory);
  }, []);

  const getStockStatus = (productId) => {
    const stock = inventory[productId]?.stock || 0;
    const minStock = inventory[productId]?.minStock || 10;

    if (stock === 0) return { label: "Sin Stock", color: "bg-red-600 text-white", status: "out" };
    if (stock < minStock) return { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-800", status: "low" };
    return { label: "Stock OK", color: "bg-green-100 text-green-800", status: "ok" };
  };

  const handleUpdateStock = (productId) => {
    const value = parseInt(newStockValue);
    if (isNaN(value) || value < 0) {
      alert("Por favor ingresa un número válido");
      return;
    }

    const updatedInventory = {
      ...inventory,
      [productId]: {
        ...inventory[productId],
        stock: value,
        lastUpdated: new Date().toISOString(),
      },
    };

    setInventory(updatedInventory);
    localStorage.setItem("adminInventory", JSON.stringify(updatedInventory));
    setEditingStock(null);
    setNewStockValue("");
  };

  const handleUpdateMinStock = (productId, value) => {
    const minStock = parseInt(value);
    if (isNaN(minStock) || minStock < 0) return;

    const updatedInventory = {
      ...inventory,
      [productId]: {
        ...inventory[productId],
        minStock,
        lastUpdated: new Date().toISOString(),
      },
    };

    setInventory(updatedInventory);
    localStorage.setItem("adminInventory", JSON.stringify(updatedInventory));
  };

  const handleQuickAdjust = (productId, adjustment) => {
    const currentStock = inventory[productId]?.stock || 0;
    const newStock = Math.max(0, currentStock + adjustment);

    const updatedInventory = {
      ...inventory,
      [productId]: {
        ...inventory[productId],
        stock: newStock,
        lastUpdated: new Date().toISOString(),
      },
    };

    setInventory(updatedInventory);
    localStorage.setItem("adminInventory", JSON.stringify(updatedInventory));
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;
    
    const status = getStockStatus(product.id).status;
    return status === filterStatus;
  });

  // Stats
  const stats = {
    total: products.length,
    outOfStock: products.filter(p => (inventory[p.id]?.stock || 0) === 0).length,
    lowStock: products.filter(p => {
      const stock = inventory[p.id]?.stock || 0;
      const minStock = inventory[p.id]?.minStock || 10;
      return stock > 0 && stock < minStock;
    }).length,
    inStock: products.filter(p => {
      const stock = inventory[p.id]?.stock || 0;
      const minStock = inventory[p.id]?.minStock || 10;
      return stock >= minStock;
    }).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * (inventory[p.id]?.stock || 0)), 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Control de Inventario</h1>
        <p className="text-gray-600 mt-1">Gestiona el stock de tus productos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <button
          onClick={() => setFilterStatus("all")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "all" ? "border-indigo-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Total Productos</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </button>

        <button
          onClick={() => setFilterStatus("ok")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "ok" ? "border-green-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">En Stock</p>
          <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
        </button>

        <button
          onClick={() => setFilterStatus("low")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "low" ? "border-yellow-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-gray-600">Stock Bajo</p>
            {stats.lowStock > 0 && (
              <span className="animate-pulse">
                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
        </button>

        <button
          onClick={() => setFilterStatus("out")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "out" ? "border-red-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-gray-600">Sin Stock</p>
            {stats.outOfStock > 0 && (
              <span className="animate-pulse">
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </button>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-sm p-4 text-white">
          <p className="text-sm opacity-90">Valor Total</p>
          <p className="text-2xl font-bold">Bs {stats.totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar productos por nombre o categoría..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Mínimo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stock = inventory[product.id]?.stock || 0;
                  const minStock = inventory[product.id]?.minStock || 10;
                  const stockStatus = getStockStatus(product.id);
                  const value = product.price * stock;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${product.bgColor} rounded-lg flex-shrink-0`}></div>
                          <div>
                            <p className="font-semibold text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingStock === product.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={newStockValue}
                              onChange={(e) => setNewStockValue(e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-600 text-gray-900"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateStock(product.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setEditingStock(null);
                                setNewStockValue("");
                              }}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStock(product.id);
                              setNewStockValue(stock.toString());
                            }}
                            className="font-bold text-gray-900 hover:text-indigo-600"
                          >
                            {stock} unidades
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          value={minStock}
                          onChange={(e) => handleUpdateMinStock(product.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-600 text-gray-900"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">Bs {value.toFixed(2)}</p>
                        <p className="text-xs text-gray-600">Bs {product.price}/ud</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickAdjust(product.id, 10)}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs font-medium"
                            title="Agregar 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleQuickAdjust(product.id, -10)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                            title="Restar 10"
                          >
                            -10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">Alerta de Stock Bajo</p>
              <p className="text-sm text-yellow-700">
                Hay {stats.lowStock} producto{stats.lowStock > 1 ? 's' : ''} con stock por debajo del mínimo. 
                Considera reponer inventario pronto.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Out of Stock Alert */}
      {stats.outOfStock > 0 && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-red-800">¡Productos Sin Stock!</p>
              <p className="text-sm text-red-700">
                Hay {stats.outOfStock} producto{stats.outOfStock > 1 ? 's' : ''} sin stock. 
                Estos productos no están disponibles para compra.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


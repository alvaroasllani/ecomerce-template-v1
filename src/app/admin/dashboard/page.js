"use client";

import { useState, useEffect } from "react";
import { products } from "@/data/products";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    // Obtener datos del localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const inventory = JSON.parse(localStorage.getItem("adminInventory") || "{}");

    // Calcular estadísticas
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => {
      const stock = inventory[p.id]?.stock || 100;
      return stock < 10;
    }).length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "Procesando").length;

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Revenue del día (simulado - últimas 24 horas)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const todayOrders = orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= oneDayAgo;
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    setStats({
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
      todayRevenue,
    });

    // Órdenes recientes (últimas 5)
    const sortedOrders = orders
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentOrders(sortedOrders);

    // Productos más vendidos
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.id]) {
          productSales[item.id].quantity += item.quantity;
        } else {
          productSales[item.id] = {
            ...item,
            quantity: item.quantity,
          };
        }
      });
    });

    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    setTopProducts(topProductsList);
  }, []);

  const statusColors = {
    "Procesando": "bg-yellow-100 text-yellow-800",
    "Enviado": "bg-blue-100 text-blue-800",
    "Entregado": "bg-green-100 text-green-800",
    "Cancelado": "bg-red-100 text-red-800",
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido al panel de administración de TechStore
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              +Bs {stats.todayRevenue.toFixed(2)} hoy
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            Bs {stats.totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Ingresos Totales</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              {stats.pendingOrders} pendientes
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalOrders}</p>
          <p className="text-sm text-gray-600">Pedidos Totales</p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <Link
              href="/admin/products/new"
              className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
            >
              + Agregar
            </Link>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.totalProducts}</p>
          <p className="text-sm text-gray-600">Productos en Catálogo</p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
            >
              Ver todo
            </Link>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{stats.lowStockProducts}</p>
          <p className="text-sm text-gray-600">Productos con Bajo Stock</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pedidos Recientes</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No hay pedidos aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.orderNumber}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.customer?.fullName || order.shippingAddress?.fullName || "Cliente"}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Bs {order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Productos Más Vendidos</h2>
            <Link
              href="/admin/products"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p>No hay ventas registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className={`w-12 h-12 ${product.bgColor || 'bg-gray-200'} rounded-lg flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">Bs {product.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{product.quantity}</p>
                    <p className="text-xs text-gray-500">vendidos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="font-semibold">Agregar Producto</p>
            <p className="text-sm opacity-80">Crear un nuevo producto</p>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-semibold">Gestionar Pedidos</p>
            <p className="text-sm opacity-80">Ver y actualizar pedidos</p>
          </Link>
          <Link
            href="/admin/inventory"
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg p-4 transition-colors"
          >
            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="font-semibold">Control de Stock</p>
            <p className="text-sm opacity-80">Actualizar inventario</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


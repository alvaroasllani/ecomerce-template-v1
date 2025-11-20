"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    loadOrders();
    loadStats();
  }, []);

  const checkAuth = () => {
    const sessionStr = localStorage.getItem("userSession");
    if (!sessionStr) {
      router.push("/login?redirect=/admin/orders");
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

  const loadOrders = async () => {
    try {
      const url = filterStatus === "all" 
        ? `${apiUrl}/orders`
        : `${apiUrl}/orders?status=${filterStatus}`;
      
      const res = await fetch(url, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Error al cargar órdenes");
      }

      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${apiUrl}/orders/stats`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Error al cargar estadísticas");
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadOrders();
    }
  }, [filterStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al actualizar estado");
      }

      alert("Estado actualizado exitosamente");
      loadOrders();
      loadStats();

      // Actualizar el pedido seleccionado si está abierto
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await res.json();
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.message || "Error al actualizar estado");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const statusConfig = {
    PENDING: { label: "Pendiente", color: "bg-gray-100 text-gray-800" },
    PROCESSING: { label: "Procesando", color: "bg-yellow-100 text-yellow-800" },
    SHIPPED: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
    DELIVERED: { label: "Entregado", color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
  };

  const getStatusColor = (status) => {
    return statusConfig[status]?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    return statusConfig[status]?.label || status;
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery) return true;
    
    const customerName = order.user?.fullName || order.shippingName || "";
    const customerEmail = order.user?.email || order.shippingEmail || "";
    const orderNumber = order.orderNumber.toLowerCase();
    const query = searchQuery.toLowerCase();

    return orderNumber.includes(query) ||
           customerName.toLowerCase().includes(query) ||
           customerEmail.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-1">Administra y actualiza el estado de los pedidos</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <button
            onClick={() => setFilterStatus("all")}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
              filterStatus === "all" ? "border-indigo-600" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </button>

          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
              filterStatus === "PENDING" ? "border-gray-600" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </button>

          <button
            onClick={() => setFilterStatus("PROCESSING")}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
              filterStatus === "PROCESSING" ? "border-yellow-600" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600">Procesando</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
          </button>

          <button
            onClick={() => setFilterStatus("SHIPPED")}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
              filterStatus === "SHIPPED" ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600">Enviados</p>
            <p className="text-2xl font-bold text-blue-600">{stats.shipped}</p>
          </button>

          <button
            onClick={() => setFilterStatus("DELIVERED")}
            className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
              filterStatus === "DELIVERED" ? "border-green-600" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600">Entregados</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </button>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm p-4 text-white">
            <p className="text-sm opacity-90">Ingresos</p>
            <p className="text-2xl font-bold">Bs. {stats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por número de orden, cliente o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border-0 focus:ring-0 text-gray-900 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="font-medium">No hay pedidos</p>
                    <p className="text-sm mt-1">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{order.orderItems?.length || 0} productos</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{order.user?.fullName || order.shippingName}</p>
                        <p className="text-xs text-gray-500">{order.user?.email || order.shippingEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">Bs. {order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        {Object.entries(statusConfig).map(([value, config]) => (
                          <option key={value} value={value}>{config.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Detalles del Pedido</h2>
                <p className="text-sm text-gray-600 mt-1">#{selectedOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha del pedido</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-900">
                  <p><span className="font-medium">Nombre:</span> {selectedOrder.user?.fullName || selectedOrder.shippingName}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.user?.email || selectedOrder.shippingEmail}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dirección de Envío</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-gray-900">
                  <p>{selectedOrder.shippingAddress}</p>
                  <p>{selectedOrder.shippingCity}, {selectedOrder.shippingZip}</p>
                  <p>{selectedOrder.shippingCountry}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Productos</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Producto</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase">Cantidad</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Precio</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.orderItems?.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{item.product?.name || 'Producto'}</p>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-right text-gray-900">Bs. {item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-900">
                            Bs. {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>Bs. {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>Bs. {selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span>Bs. {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

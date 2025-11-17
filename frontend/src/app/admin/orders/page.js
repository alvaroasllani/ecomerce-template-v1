"use client";

import { useState, useEffect } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Cargar pedidos desde localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
    setFilteredOrders(savedOrders);
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let result = orders;

    if (filterStatus !== "all") {
      result = result.filter(order => order.status === filterStatus);
    }

    if (searchQuery) {
      result = result.filter(order => {
        const customerName = order.customer?.fullName || order.shippingAddress?.fullName || "";
        const customerEmail = order.customer?.email || order.email || "";
        const orderNumber = order.orderNumber.toString();
        return orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
               customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredOrders(result);
  }, [filterStatus, searchQuery, orders]);

  const handleStatusChange = (orderNumber, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.orderNumber === orderNumber
        ? { ...order, status: newStatus }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Actualizar el pedido seleccionado si está abierto
    if (selectedOrder?.orderNumber === orderNumber) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const statusOptions = [
    { value: "Procesando", label: "Procesando", color: "bg-yellow-100 text-yellow-800" },
    { value: "Enviado", label: "Enviado", color: "bg-blue-100 text-blue-800" },
    { value: "Entregado", label: "Entregado", color: "bg-green-100 text-green-800" },
    { value: "Cancelado", label: "Cancelado", color: "bg-red-100 text-red-800" },
  ];

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: orders.length,
    procesando: orders.filter(o => o.status === "Procesando").length,
    enviado: orders.filter(o => o.status === "Enviado").length,
    entregado: orders.filter(o => o.status === "Entregado").length,
    cancelado: orders.filter(o => o.status === "Cancelado").length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600 mt-1">Administra y actualiza el estado de los pedidos</p>
      </div>

      {/* Stats */}
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
          onClick={() => setFilterStatus("Procesando")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "Procesando" ? "border-yellow-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Procesando</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.procesando}</p>
        </button>

        <button
          onClick={() => setFilterStatus("Enviado")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "Enviado" ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Enviado</p>
          <p className="text-2xl font-bold text-blue-600">{stats.enviado}</p>
        </button>

        <button
          onClick={() => setFilterStatus("Entregado")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "Entregado" ? "border-green-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Entregado</p>
          <p className="text-2xl font-bold text-green-600">{stats.entregado}</p>
        </button>

        <button
          onClick={() => setFilterStatus("Cancelado")}
          className={`bg-white rounded-lg shadow-sm border-2 p-4 text-left transition-all ${
            filterStatus === "Cancelado" ? "border-red-600" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <p className="text-sm text-gray-600">Cancelado</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelado}</p>
        </button>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-sm p-4 text-white">
          <p className="text-sm opacity-90">Ingresos</p>
          <p className="text-2xl font-bold">Bs {stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por número de pedido, nombre o email del cliente..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pedido
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    {searchQuery ? "No se encontraron pedidos con esos criterios" : "No hay pedidos aún"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.items.length} items</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.customer?.fullName || order.shippingAddress?.fullName || "Cliente"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customer?.email || order.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.date).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">Bs {order.total.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.orderNumber, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pedido #{selectedOrder.orderNumber}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedOrder.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Pedido
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.orderNumber, e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium border-2 cursor-pointer ${getStatusColor(selectedOrder.status)}`}
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nombre:</span> {selectedOrder.customer?.fullName || selectedOrder.shippingAddress?.fullName || "N/A"}</p>
                  <p><span className="font-medium">Email:</span> {selectedOrder.customer?.email || selectedOrder.email || "N/A"}</p>
                  <p><span className="font-medium">Dirección:</span> {selectedOrder.customer?.address || selectedOrder.shippingAddress?.address || "N/A"}</p>
                  <p><span className="font-medium">Ciudad:</span> {selectedOrder.customer?.city || selectedOrder.shippingAddress?.city || "N/A"}, {selectedOrder.customer?.postalCode || selectedOrder.shippingAddress?.postalCode || "N/A"}</p>
                  <p><span className="font-medium">País:</span> {selectedOrder.customer?.country || selectedOrder.shippingAddress?.country || "N/A"}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Productos</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`${item.bgColor || 'bg-gray-200'} w-16 h-16 rounded-lg flex-shrink-0`}></div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">Bs {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold text-gray-900">Bs {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.shipping === 0 ? "GRATIS" : `Bs ${selectedOrder.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-indigo-600">Bs {selectedOrder.total.toFixed(2)}</span>
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


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Cargar pedidos desde localStorage
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders);
      // Ordenar por fecha más reciente primero
      parsedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(parsedOrders);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Processing":
        return "Procesando";
      case "Shipped":
        return "Enviado";
      case "Delivered":
        return "Entregado";
      case "Cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-gray-600">
            Rastrea y gestiona tus pedidos
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay pedidos aún</h2>
            <p className="text-gray-600 mb-6">
              Comienza a comprar para ver tu historial de pedidos aquí
            </p>
            <Link href="/products">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors">
                Comenzar a Comprar
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div
                key={order.orderNumber}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          Pedido #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Realizado el {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        Bs {order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items.length} {order.items.length === 1 ? "artículo" : "artículos"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div
                          className={`${item.bgColor} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <div className="w-8 h-8 bg-white/20 rounded"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                            {item.color && ` • Color: ${item.color}`}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          Bs {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        setSelectedOrder(
                          selectedOrder === order.orderNumber ? null : order.orderNumber
                        )
                      }
                      className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      {selectedOrder === order.orderNumber ? "Ocultar" : "Ver"} Detalles
                    </button>
                    {order.status === "Shipped" && (
                      <button className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Rastrear Pedido
                      </button>
                    )}
                    {order.status === "Delivered" && (
                      <Link href={`/products/${order.items[0].id}`}>
                        <button className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                          Comprar de Nuevo
                        </button>
                      </Link>
                    )}
                  </div>

                  {/* Order Details (Expandable) */}
                  {selectedOrder === order.orderNumber && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.fullName}<br />
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Resumen del Pedido</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">Bs {order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Envío</span>
                            <span className="text-gray-900">
                              {order.shipping === 0 ? "GRATIS" : `Bs ${order.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">Bs {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      {order.email && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Contacto</h4>
                          <p className="text-sm text-gray-600">{order.email}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

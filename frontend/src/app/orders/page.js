"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const sessionStr = localStorage.getItem("userSession");
      if (!sessionStr) {
        router.push("/login");
        return;
      }

      try {
        const session = JSON.parse(sessionStr);
        const token = session.token;
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/orders/my-orders`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error("Error fetching orders");
          // Si falla por auth, redirigir
          if (res.status === 401) router.push("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Pendiente";
      case "PROCESSING":
        return "Procesando";
      case "SHIPPED":
        return "Enviado";
      case "DELIVERED":
        return "Entregado";
      case "CANCELLED":
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      </div>
    );
  }

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
                key={order.id}
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
                        Realizado el {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        Bs {Number(order.total).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.orderItems.length} {order.orderItems.length === 1 ? "artículo" : "artículos"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4 mb-4">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div
                          className={`${item.product.bgColor || 'bg-gray-100'} w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden`}
                        >
                           {item.product.image ? (
                             <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-8 h-8 bg-white/20 rounded"></div>
                           )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
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
                          selectedOrder === order.id ? null : order.id
                        )
                      }
                      className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      {selectedOrder === order.id ? "Ocultar" : "Ver"} Detalles
                    </button>
                    {order.status === "SHIPPED" && (
                      <button className="flex-1 sm:flex-none px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Rastrear Pedido
                      </button>
                    )}
                  </div>

                  {/* Order Details (Expandable) */}
                  {selectedOrder === order.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Dirección de Envío</h4>
                        <p className="text-sm text-gray-600">
                          {order.shippingName}<br />
                          {order.shippingAddress}<br />
                          {order.shippingCity}, {order.shippingZip}<br />
                          {order.shippingCountry}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Resumen del Pedido</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">Bs {Number(order.subtotal).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Envío</span>
                            <span className="text-gray-900">
                              {order.shipping === 0 ? "GRATIS" : `Bs ${Number(order.shipping).toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">Bs {Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      {order.shippingEmail && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Contacto</h4>
                          <p className="text-sm text-gray-600">{order.shippingEmail}</p>
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

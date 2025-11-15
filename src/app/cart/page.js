"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, cartTotal, incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <svg
            className="w-32 h-32 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
          <p className="text-xl text-gray-600 mb-8">
            Agrega algunos productos increíbles a tu carrito.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Explorar Productos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
          <p className="text-gray-600">{cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.color}`}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className={`${item.bgColor} w-32 h-32 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <div className="w-16 h-16 bg-white/20 rounded"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        {item.color && (
                          <p className="text-sm text-gray-600 mt-1">Color: {item.color}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.color)}
                        className="text-red-600 hover:text-red-700 transition-colors p-2"
                        aria-label="Eliminar producto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => decrementQuantity(item.id, item.color)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 text-gray-900 font-medium border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => incrementQuantity(item.id, item.color)}
                          className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button */}
            <button
              onClick={() => router.push("/products")}
              className="w-full mt-6 text-indigo-600 hover:text-indigo-700 font-medium py-3 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              ← Seguir Comprando
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Envío</span>
                  <span className="font-semibold">
                    {cartTotal > 200 ? "GRATIS" : "$5.00"}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${(cartTotal > 200 ? cartTotal : cartTotal + 5).toFixed(2)}
                  </span>
                </div>
              </div>

              {cartTotal < 200 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    Agrega <span className="font-semibold">${(200 - cartTotal).toFixed(2)}</span> más para obtener envío gratis
                  </p>
                  <div className="mt-2 bg-white rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-300"
                      style={{ width: `${(cartTotal / 200) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl mb-4"
              >
                Proceder al Pago
              </button>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Pago seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Devoluciones gratuitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Soporte 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}


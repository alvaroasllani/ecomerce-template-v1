"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();
  
  const router = useRouter();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Tu Carrito</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-24 h-24 text-gray-300 mb-4"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 mb-6">
                ¡Agrega algunos productos para comenzar!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  router.push("/products");
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Seguir Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.color}`}
                  className="flex gap-4 pb-4 border-b border-gray-100"
                >
                  {/* Product Image */}
                  <div
                    className={`${item.bgColor} w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <div className="w-10 h-10 bg-white/20 rounded"></div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    {item.color && (
                      <p className="text-sm text-gray-600 mb-2">
                        Color: {item.color}
                      </p>
                    )}
                    <p className="font-bold text-gray-900">
                      Bs {item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id, item.color)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Remove item"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id, item.color)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id, item.color)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">Subtotal</span>
              <span className="text-2xl font-bold text-gray-900">
                Bs {cartTotal.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Impuestos y envío calculados al finalizar la compra.
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                router.push("/cart");
              }}
              className="w-full bg-white text-indigo-600 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Ver Carrito Completo
            </button>
            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Proceder al Pago
            </button>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-full text-indigo-600 py-2 font-medium hover:text-indigo-700 transition-colors"
            >
              Seguir Comprando
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}


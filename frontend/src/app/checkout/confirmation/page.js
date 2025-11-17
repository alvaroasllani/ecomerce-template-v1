"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Limpiar el carrito solo una vez cuando llegamos a la confirmación
    if (!hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [clearCart]);

  if (!orderNumber) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold text-gray-900">Tech Accessories Store</span>
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">¡Gracias!</h1>
          
          {/* Message */}
          <p className="text-gray-600 mb-2">¡Tu pedido está en camino!</p>
          <p className="text-sm text-gray-500 mb-6">
            Número de Pedido: <span className="font-semibold text-gray-900">#{orderNumber}</span>. 
            Se ha enviado un correo de confirmación a tu dirección.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link href="/products">
              <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Seguir Comprando
              </button>
            </Link>
            <Link href="/orders">
              <button className="w-full text-indigo-600 py-3 px-6 font-semibold hover:text-indigo-700 transition-colors">
                Ver Mis Pedidos
              </button>
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas ayuda? <Link href="/contact" className="text-indigo-600 hover:text-indigo-700 font-medium">Contacta a nuestro equipo de soporte</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

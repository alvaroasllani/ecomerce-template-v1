"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className={`${product.bgColor} h-64 flex items-center justify-center relative overflow-hidden`}>
          <div className="w-32 h-32 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-300"></div>
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">${product.price}</p>
            <button 
              onClick={handleAddToCart}
              className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

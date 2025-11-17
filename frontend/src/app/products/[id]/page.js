"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products as initialProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  // Cargar producto dinámico
  useEffect(() => {
    const customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
    const productsToUse = customProducts.length > 0 ? customProducts : initialProducts;
    setProducts(productsToUse);
    
    const foundProduct = productsToUse.find(p => p.id === parseInt(params.id));
    setProduct(foundProduct || null);
  }, [params.id]);

  // Mostrar loading mientras carga
  if (product === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Producto No Encontrado</h1>
          <p className="text-gray-600 mb-8">El producto que buscas no existe.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
          >
            Volver a Productos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => router.push("/")} className="hover:text-gray-900">Inicio</button>
          <span>/</span>
          <button onClick={() => router.push("/products")} className="hover:text-gray-900">Productos</button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className={`${product.bgColor} rounded-2xl h-[500px] flex items-center justify-center mb-4`}>
              <div className="w-64 h-64 bg-white/20 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`${product.bgColor} rounded-lg h-24 flex items-center justify-center ${
                    selectedImage === index ? "ring-2 ring-indigo-600" : ""
                  }`}
                >
                  <div className="w-12 h-12 bg-white/20 rounded"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reseñas)
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900 mb-6">Bs {product.price.toFixed(2)}</p>
              <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">En Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Envío gratis en pedidos mayores a $50</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Política de devolución de 30 días</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-6 py-2 text-gray-900 font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                Agregar al Carrito
              </button>
            </div>

            <button className="w-full border-2 border-gray-300 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Agregar a Favoritos
            </button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === "description"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Descripción
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === "specifications"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Especificaciones
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Reseñas
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="prose max-w-none">
            {/* Descripción */}
            {activeTab === "description" && (
              <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.name} combina tecnología de vanguardia con diseño minimalista. 
                  Perfecto para profesionales modernos que valoran tanto la forma como la función. 
                  Elaborado con materiales premium y construido para durar, este accesorio 
                  elevará tu configuración tecnológica mientras mantiene una estética limpia y sofisticada.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Características Principales</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Materiales de calidad premium</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Diseño minimalista y moderno</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Compatible con todos los dispositivos principales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Garantía de 1 año incluida</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Especificaciones */}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Marca:</span>
                    <span className="text-gray-700 ml-2">{product.brand}</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Categoría:</span>
                    <span className="text-gray-700 ml-2">{product.category}</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">SKU:</span>
                    <span className="text-gray-700 ml-2">TA-{product.id.toString().padStart(5, '0')}</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Disponibilidad:</span>
                    <span className="text-green-600 ml-2 font-medium">En Stock</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Peso:</span>
                    <span className="text-gray-700 ml-2">250g</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Dimensiones:</span>
                    <span className="text-gray-700 ml-2">15 x 10 x 3 cm</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Material:</span>
                    <span className="text-gray-700 ml-2">Aluminio y Plástico Premium</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Garantía:</span>
                    <span className="text-gray-700 ml-2">12 meses</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Conectividad:</span>
                    <span className="text-gray-700 ml-2">USB-C, Bluetooth 5.0</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Compatibilidad:</span>
                    <span className="text-gray-700 ml-2">Windows, macOS, Linux</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reseñas */}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Reseñas de Clientes</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-900 font-semibold">{product.rating}</span>
                      <span className="text-gray-600">({product.reviews} reseñas)</span>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Escribir Reseña
                  </button>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-semibold">JM</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">Juan Martínez</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">Hace 2 semanas</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">
                          Excelente producto, la calidad es notable y el diseño es perfecto. 
                          Totalmente recomendado para cualquiera que busque algo premium.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold">AS</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">Ana Silva</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">Hace 1 mes</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <p className="text-gray-700">
                          Muy buen producto, cumple con lo que promete. El envío fue rápido y llegó en perfectas condiciones.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold">CR</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">Carlos Rodríguez</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-500 text-sm">Hace 2 meses</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">
                          ¡Increíble! La mejor compra que he hecho. La calidad es excepcional y el servicio al cliente es de primera.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">También te Puede Gustar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

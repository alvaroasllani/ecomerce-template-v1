"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();

  // Cargar producto dinámico
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // 1. Cargar producto principal
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/products/${params.id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setProduct(null);
            setLoading(false);
            return;
          }
          throw new Error('Error al cargar el producto');
        }
        
        const productData = await res.json();
        setProduct(productData);
        
        // 2. Cargar productos relacionados (misma categoría)
        if (productData?.categoryId) {
          try {
            const relatedRes = await fetch(
              `${apiUrl}/products?categoryId=${productData.categoryId}&limit=5`
            );
            if (relatedRes.ok) {
              const relatedData = await relatedRes.json();
              // Filtramos el producto actual de los relacionados
              // El endpoint puede devolver { data: [], meta: {} } o directamente [] dependiendo de la implementación de paginación
              const productsArray = Array.isArray(relatedData) ? relatedData : (relatedData.data || []);
              setRelatedProducts(productsArray.filter(p => p.id !== productData.id).slice(0, 4));
            }
          } catch (err) {
            console.error("Error loading related products", err);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Mostrar loading mientras carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Producto no encontrado
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Producto No Encontrado</h1>
          <p className="text-gray-600 mb-8">El producto que buscas no existe o ha sido eliminado.</p>
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
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className={`relative rounded-2xl h-[500px] flex items-center justify-center mb-4 overflow-hidden ${product.bgColor || 'bg-gray-100'}`}>
               {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
              ) : (
                <div className="w-64 h-64 bg-white/20 rounded-lg flex items-center justify-center">
                   <span className="text-gray-400 text-6xl">📦</span>
                </div>
              )}
            </div>
            {/* Miniaturas (Placeholder visual ya que solo tenemos 1 imagen real) */}
            <div className="grid grid-cols-4 gap-4">
               <button
                  className={`rounded-lg h-24 flex items-center justify-center border-2 border-indigo-600 overflow-hidden ${product.bgColor || 'bg-gray-100'}`}
                >
                  {product.image ? (
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  )}
                </button>
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              {product.category && (
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full mb-4">
                  {product.category.name || product.category}
                </span>
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
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
                    {product.rating || 0} ({product.reviews || 0} reseñas)
                  </span>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-900 mb-6">Bs {Number(product.price).toFixed(2)}</p>
              <p className="text-lg text-gray-600 mb-6">{product.description}</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-2">
                <svg className={`w-5 h-5 ${product.inStock ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{product.inStock ? 'En Stock' : 'Agotado'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Envío gratis en pedidos mayores a Bs 350</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">Garantía de devolución de 30 días</span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={!product.inStock}
                >
                  -
                </button>
                <span className="px-6 py-2 text-gray-900 font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  disabled={!product.inStock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 text-white px-8 py-3 rounded-full font-medium transition-colors ${
                  product.inStock 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Agregar al Carrito' : 'Agotado'}
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
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "description"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Descripción
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`pb-4 font-medium transition-colors whitespace-nowrap ${
                  activeTab === "specifications"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Especificaciones
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 font-medium transition-colors whitespace-nowrap ${
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
                  {product.description}
                </p>
                <p className="text-gray-600">
                  Este producto de la marca <strong>{product.brand?.name || 'Genérica'}</strong> destaca por su calidad y diseño.
                  Es una excelente adición para tu colección de {product.category?.name?.toLowerCase() || 'accesorios'}.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Características Principales</h3>
                <ul className="space-y-2 mb-6">
                   {/* Estas son características genéricas ya que no vienen del backend aun */}
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Materiales de alta calidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Diseño moderno y funcional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Garantía de fábrica</span>
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
                    <span className="text-gray-700 ml-2">{product.brand?.name || 'N/A'}</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Categoría:</span>
                    <span className="text-gray-700 ml-2">{product.category?.name || 'N/A'}</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">SKU:</span>
                    <span className="text-gray-700 ml-2">PRD-{product.id.toString().padStart(6, '0')}</span>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-900">Disponibilidad:</span>
                    <span className={`${product.inStock ? 'text-green-600' : 'text-red-600'} ml-2 font-medium`}>
                      {product.inStock ? 'En Stock' : 'Agotado'}
                    </span>
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
                              i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-900 font-semibold">{product.rating || 0}</span>
                      <span className="text-gray-600">({product.reviews || 0} reseñas)</span>
                    </div>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                    Escribir Reseña
                  </button>
                </div>
                
                {/* Placeholder de reseñas ya que no hay endpoint de reseñas aun */}
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aún no hay reseñas detalladas para este producto.</p>
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
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

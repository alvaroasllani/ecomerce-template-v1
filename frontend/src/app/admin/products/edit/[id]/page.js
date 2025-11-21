"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "@/lib/api";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id);

  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("file");

  // Cargar categorías y marcas
  useEffect(() => {
    const savedCategories = JSON.parse(localStorage.getItem("customCategories") || "[]");
    const savedBrands = JSON.parse(localStorage.getItem("customBrands") || "[]");
    setCategories(savedCategories);
    setBrands(savedBrands);
  }, []);
  const colors = [
    { name: "Gris", value: "bg-gray-200" },
    { name: "Gris Oscuro", value: "bg-gray-800" },
    { name: "Azul", value: "bg-blue-900" },
    { name: "Índigo", value: "bg-indigo-800" },
    { name: "Púrpura", value: "bg-purple-900" },
    { name: "Verde Azulado", value: "bg-teal-300" },
    { name: "Verde Azulado Oscuro", value: "bg-teal-700" },
    { name: "Verde Azulado Muy Oscuro", value: "bg-teal-800" },
    { name: "Pizarra", value: "bg-slate-800" },
    { name: "Pizarra Oscuro", value: "bg-slate-900" },
    { name: "Ámbar", value: "bg-amber-100" },
    { name: "Ámbar Medio", value: "bg-amber-200" },
  ];

  useEffect(() => {
    // Cargar producto
    const customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");
    const product = customProducts.find(p => p.id === productId);

    if (product) {
      setFormData(product);
    } else {
      alert("Producto no encontrado");
      router.push("/admin/products");
    }
    setLoading(false);
  }, [productId, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Por favor selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no debe superar 5MB");
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        const result = await uploadImage(file);
        setFormData({ ...formData, image: result.secure_url });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error al subir la imagen: " + error.message);
        setImagePreview(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Obtener productos actuales
    const customProducts = JSON.parse(localStorage.getItem("customProducts") || "[]");

    // Actualizar producto
    const updatedProduct = {
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
    };

    const updatedProducts = customProducts.map(p =>
      p.id === productId ? updatedProduct : p
    );

    localStorage.setItem("customProducts", JSON.stringify(updatedProducts));

    alert("Producto actualizado exitosamente");
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a Productos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
        <p className="text-gray-600 mt-1">Actualiza los detalles del producto</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Product ID */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">ID del Producto: <span className="font-bold text-gray-900">#{productId}</span></p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="ej: Teclado Mecánico RGB"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe las características principales del producto..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Producto
            </label>

            {/* Método de carga */}
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadMethod("file")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${uploadMethod === "file"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                📁 Subir desde PC/Teléfono
              </button>
              <button
                type="button"
                onClick={() => setUploadMethod("url")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${uploadMethod === "url"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                🔗 URL / Google Drive
              </button>
            </div>

            {/* Upload desde archivo */}
            {uploadMethod === "file" && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hasta 5MB</p>
                </label>
              </div>
            )}

            {/* Upload desde URL */}
            {uploadMethod === "url" && (
              <div>
                <input
                  type="url"
                  name="image"
                  value={formData.image && !formData.image.startsWith('data:') ? formData.image : ""}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/... o cualquier URL de imagen"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Para Google Drive: Comparte el archivo → Copiar enlace → Pégalo aquí
                </p>
              </div>
            )}

            {/* Preview de imagen */}
            {(imagePreview || formData.image) && (
              <div className="mt-4 relative">
                <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                <div className="relative inline-block">
                  <img
                    src={imagePreview || formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                    onError={(e) => {
                      e.target.src = "/products/placeholder.jpg";
                      e.target.onerror = null;
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Eliminar imagen"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price, Category, Brand */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              >
                {categories.length === 0 ? (
                  <option value="">No hay categorías disponibles</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))
                )}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Primero debes crear categorías en la sección de Categorías
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca <span className="text-red-500">*</span>
              </label>
              <select
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              >
                {brands.length === 0 ? (
                  <option value="">No hay marcas disponibles</option>
                ) : (
                  brands.map(brand => (
                    <option key={brand.id} value={brand.name}>{brand.name}</option>
                  ))
                )}
              </select>
              {brands.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Primero debes crear marcas en la sección de Marcas
                </p>
              )}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color de Fondo (para la tarjeta)
            </label>
            <select
              name="bgColor"
              value={formData.bgColor}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            >
              {colors.map(color => (
                <option key={color.value} value={color.value}>{color.name}</option>
              ))}
            </select>
            <div className={`mt-2 w-20 h-20 ${formData.bgColor} rounded-lg border-2 border-gray-300`}></div>
          </div>

          {/* Rating & Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Reseñas
              </label>
              <input
                type="number"
                name="reviews"
                min="0"
                value={formData.reviews}
                onChange={handleChange}
                placeholder="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
              />
              <label className="ml-2 text-sm text-gray-700">
                Producto destacado (aparecerá en la página principal)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
              />
              <label className="ml-2 text-sm text-gray-700">
                En stock (disponible para compra)
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
          <Link
            href="/admin/products"
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </Link>
          <Link
            href={`/products/${productId}`}
            target="_blank"
            className="ml-auto text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
          >
            Ver en Tienda
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </form>
    </div>
  );
}


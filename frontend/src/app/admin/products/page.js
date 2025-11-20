"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    brandId: "",
    image: "",
    bgColor: "",
    featured: false,
    inStock: true,
    rating: 0,
    reviews: 0,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    loadProducts();
    loadCategories();
    loadBrands();
  }, []);

  const checkAuth = () => {
    const sessionStr = localStorage.getItem("userSession");
    if (!sessionStr) {
      router.push("/login?redirect=/admin/products");
      return;
    }
    
    const session = JSON.parse(sessionStr);
    if (session.role !== "ADMIN") {
      router.push("/");
      return;
    }
  };

  const getAuthHeaders = () => {
    const sessionStr = localStorage.getItem("userSession");
    const session = JSON.parse(sessionStr);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    };
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${apiUrl}/products?limit=1000`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadBrands = async () => {
    try {
      const res = await fetch(`${apiUrl}/brands`);
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Error al eliminar producto");
      }

      alert("Producto eliminado exitosamente");
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar producto");
    }
  };

  const handleToggleStock = async (product) => {
    try {
      const res = await fetch(`${apiUrl}/products/${product.id}/stock`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inStock: !product.inStock }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar stock");
      }

      loadProducts();
    } catch (error) {
      console.error("Error toggling stock:", error);
      alert("Error al actualizar stock");
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        categoryId: product.categoryId.toString(),
        brandId: product.brandId.toString(),
        image: product.image || "",
        bgColor: product.bgColor || "",
        featured: product.featured,
        inStock: product.inStock,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        brandId: "",
        image: "",
        bgColor: "",
        featured: false,
        inStock: true,
        rating: 0,
        reviews: 0,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      categoryId: parseInt(formData.categoryId),
      brandId: parseInt(formData.brandId),
      image: formData.image || "",
      bgColor: formData.bgColor || "",
      featured: formData.featured,
      inStock: formData.inStock,
      rating: parseFloat(formData.rating) || 0,
      reviews: parseInt(formData.reviews) || 0,
    };

    try {
      const url = editingProduct 
        ? `${apiUrl}/products/${editingProduct.id}` 
        : `${apiUrl}/products`;
      
      const method = editingProduct ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al guardar producto");
      }

      alert(editingProduct ? "Producto actualizado exitosamente" : "Producto creado exitosamente");
      closeModal();
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Error al guardar producto");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Filtrar y ordenar productos
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.categoryId.toString() === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredProducts.length} productos encontrados
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                ← Volver al Panel
              </Link>
              <button
                onClick={() => openModal()}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                + Nuevo Producto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
              >
                <option value="newest">Más recientes</option>
                <option value="name">Nombre (A-Z)</option>
                <option value="price-asc">Precio (menor a mayor)</option>
                <option value="price-desc">Precio (mayor a menor)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destacado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-200 flex items-center justify-center">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">Sin img</span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {product.brand?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        Bs. {product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStock(product)}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          product.inStock
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {product.inStock ? "En Stock" : "Agotado"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.featured && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          ⭐ Destacado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio (Bs.) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Category and Brand */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      name="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    >
                      <option value="">Seleccionar...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca *
                    </label>
                    <select
                      name="brandId"
                      required
                      value={formData.brandId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    >
                      <option value="">Seleccionar...</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL and BG Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de Imagen
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color de Fondo
                    </label>
                    <input
                      type="text"
                      name="bgColor"
                      value={formData.bgColor}
                      onChange={handleChange}
                      placeholder="#FFFFFF"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Rating and Reviews */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Reviews
                    </label>
                    <input
                      type="number"
                      name="reviews"
                      min="0"
                      value={formData.reviews}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Producto Destacado
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      En Stock
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingProduct ? "Actualizar" : "Crear"} Producto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

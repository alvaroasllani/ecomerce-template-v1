"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    checkAuth();
    loadCategories();
  }, []);

  const checkAuth = () => {
    const sessionStr = localStorage.getItem("userSession");
    if (!sessionStr) {
      router.push("/login?redirect=/admin/categories");
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

  const loadCategories = async () => {
    try {
      const res = await fetch(`${apiUrl}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      name,
      slug: generateSlug(name)
    });
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
      };

      const res = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al crear categoría");
      }

      alert("Categoría creada exitosamente");
      setFormData({ name: "", slug: "" });
      setIsAdding(false);
      loadCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.message || "Error al crear categoría");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
      };

      const res = await fetch(`${apiUrl}/categories/${editingId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al actualizar categoría");
      }

      alert("Categoría actualizada exitosamente");
      setEditingId(null);
      setFormData({ name: "", slug: "" });
      loadCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error.message || "Error al actualizar categoría");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría? Los productos con esta categoría quedarán sin categoría asignada.")) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al eliminar categoría");
      }

      alert("Categoría eliminada exitosamente");
      loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.message || "Error al eliminar categoría");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", slug: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-1">Administra las categorías de productos</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Categoría
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isAdding ? "Nueva Categoría" : "Editar Categoría"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="ej: Monitores"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Se genera automáticamente"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder:text-gray-400 bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">URL amigable para esta categoría</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={isAdding ? handleAdd : handleUpdate}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              {isAdding ? "Agregar" : "Guardar Cambios"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-4 rounded-lg">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
            <p className="text-gray-600">Categorías totales</p>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="font-medium">No hay categorías</p>
                  <p className="text-sm mt-1">Crea tu primera categoría haciendo clic en "Agregar Categoría"</p>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600">#{category.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{category.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono">
                      {category.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {category._count?.products || 0} productos
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

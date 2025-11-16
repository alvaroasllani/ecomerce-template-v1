"use client";

import { useState, useEffect } from "react";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  useEffect(() => {
    // Cargar marcas desde localStorage
    const savedBrands = JSON.parse(localStorage.getItem("customBrands") || "[]");
    
    // Si no hay marcas, usar las iniciales
    if (savedBrands.length === 0) {
      const initialBrands = [
        { id: 1, name: "Aero", slug: "aero" },
        { id: 2, name: "Orbit", slug: "orbit" },
        { id: 3, name: "Flow", slug: "flow" },
      ];
      setBrands(initialBrands);
      localStorage.setItem("customBrands", JSON.stringify(initialBrands));
    } else {
      setBrands(savedBrands);
    }
  }, []);

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

  const handleAdd = () => {
    if (!formData.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const newBrand = {
      id: Math.max(...brands.map(b => b.id), 0) + 1,
      name: formData.name.trim(),
      slug: formData.slug || generateSlug(formData.name),
    };

    const updatedBrands = [...brands, newBrand];
    setBrands(updatedBrands);
    localStorage.setItem("customBrands", JSON.stringify(updatedBrands));
    
    setFormData({ name: "", slug: "" });
    setIsAdding(false);
  };

  const handleEdit = (brand) => {
    setEditingId(brand.id);
    setFormData({ name: brand.name, slug: brand.slug });
  };

  const handleUpdate = () => {
    if (!formData.name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }

    const updatedBrands = brands.map(brand =>
      brand.id === editingId
        ? { ...brand, name: formData.name.trim(), slug: formData.slug || generateSlug(formData.name) }
        : brand
    );

    setBrands(updatedBrands);
    localStorage.setItem("customBrands", JSON.stringify(updatedBrands));
    
    setEditingId(null);
    setFormData({ name: "", slug: "" });
  };

  const handleDelete = (id) => {
    if (!confirm("¿Estás seguro de eliminar esta marca? Los productos con esta marca quedarán sin marca asignada.")) {
      return;
    }

    const updatedBrands = brands.filter(brand => brand.id !== id);
    setBrands(updatedBrands);
    localStorage.setItem("customBrands", JSON.stringify(updatedBrands));
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", slug: "" });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Marcas</h1>
          <p className="text-gray-600 mt-1">Administra las marcas de productos</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Marca
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {isAdding ? "Nueva Marca" : "Editar Marca"}
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
                placeholder="ej: Logitech"
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
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
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
          <div className="bg-purple-100 p-4 rounded-lg">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">{brands.length}</p>
            <p className="text-gray-600">Marcas totales</p>
          </div>
        </div>
      </div>

      {/* Brands Table */}
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
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {brands.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  No hay marcas
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600">#{brand.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{brand.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-mono">
                      {brand.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
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


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Datos del perfil
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  // Direcciones
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Lista de deseos
  const [wishlist, setWishlist] = useState([]);

  // Configuración
  const [settings, setSettings] = useState({
    language: "es",
    notifications: true,
  });

  // Formulario de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Verificar sesión
    const session = localStorage.getItem("userSession");
    if (!session) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(session);
    setUser(userData);

    // Cargar datos del perfil desde localStorage
    const savedProfile = localStorage.getItem(`profile_${userData.id}`);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setProfileData(profile.personal || {
        firstName: userData.fullName.split(" ")[0] || "",
        lastName: userData.fullName.split(" ").slice(1).join(" ") || "",
        email: userData.email,
        phone: "",
      });
      setAddresses(profile.addresses || []);
      setPaymentMethods(profile.paymentMethods || []);
      setWishlist(profile.wishlist || []);
      setSettings(profile.settings || { language: "es", notifications: true });
    } else {
      // Datos iniciales
      setProfileData({
        firstName: userData.fullName.split(" ")[0] || "",
        lastName: userData.fullName.split(" ").slice(1).join(" ") || "",
        email: userData.email,
        phone: "",
      });
    }

    setIsLoading(false);
  }, [router]);

  const saveProfile = () => {
    const profileToSave = {
      personal: profileData,
      addresses,
      paymentMethods,
      wishlist,
      settings,
    };
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileToSave));
    alert("Perfil guardado exitosamente");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const addAddress = (address) => {
    setAddresses([...addresses, { ...address, id: Date.now() }]);
    setShowAddressForm(false);
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    alert("Contraseña actualizada exitosamente");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const deleteAccount = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      localStorage.removeItem("userSession");
      localStorage.removeItem(`profile_${user.id}`);
      router.push("/");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "personal", name: "Datos Personales", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { id: "addresses", name: "Direcciones", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { id: "orders", name: "Mis Pedidos", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    { id: "payment", name: "Métodos de Pago", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { id: "wishlist", name: "Lista de Deseos", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { id: "settings", name: "Configuración", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
          <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">
                      {profileData.firstName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Datos Personales */}
              {activeTab === "personal" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos Personales</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Apellido
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede cambiar</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="+34 600 000 000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={saveProfile}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Guardar Cambios
                    </button>
                  </form>
                </div>
              )}

              {/* Direcciones */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Direcciones</h2>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Nueva Dirección
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        Agregar tu primera dirección
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-lg p-4 relative">
                          {addr.isDefault && (
                            <span className="absolute top-2 right-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                              Principal
                            </span>
                          )}
                          <h3 className="font-semibold text-gray-900 mb-2">{addr.type}</h3>
                          <p className="text-sm text-gray-600">{addr.fullName}</p>
                          <p className="text-sm text-gray-600">{addr.address}</p>
                          <p className="text-sm text-gray-600">
                            {addr.city}, {addr.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">{addr.country}</p>
                          <div className="mt-4 flex gap-2">
                            <button className="text-sm text-indigo-600 hover:text-indigo-700">Editar</button>
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Address Form Modal */}
                  {showAddressForm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Nueva Dirección</h3>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            addAddress({
                              type: formData.get("type"),
                              fullName: formData.get("fullName"),
                              address: formData.get("address"),
                              city: formData.get("city"),
                              postalCode: formData.get("postalCode"),
                              country: formData.get("country"),
                              isDefault: formData.get("isDefault") === "on",
                            });
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                            <select
                              name="type"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                            >
                              <option value="Envío">Envío</option>
                              <option value="Facturación">Facturación</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
                            <input
                              type="text"
                              name="fullName"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                            <input
                              type="text"
                              name="address"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                              <input
                                type="text"
                                name="city"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                              <input
                                type="text"
                                name="postalCode"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                            <input
                              type="text"
                              name="country"
                              defaultValue="España"
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="isDefault"
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                            />
                            <label className="ml-2 text-sm text-gray-700">Establecer como dirección principal</label>
                          </div>
                          <div className="flex gap-3 mt-6">
                            <button
                              type="submit"
                              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddressForm(false)}
                              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mis Pedidos */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p className="text-gray-600 mb-4">Historial de pedidos completo</p>
                    <Link href="/orders" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Ver todos mis pedidos →
                    </Link>
                  </div>
                </div>
              )}

              {/* Métodos de Pago */}
              {activeTab === "payment" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Agregar Tarjeta
                    </button>
                  </div>

                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-gray-600 mb-2">No tienes métodos de pago guardados</p>
                    <p className="text-sm text-gray-500">Agrega una tarjeta para realizar pagos más rápido</p>
                  </div>
                </div>
              )}

              {/* Lista de Deseos */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Lista de Deseos</h2>
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <p className="text-gray-600 mb-4">Tu lista de deseos está vacía</p>
                    <Link href="/products" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Explorar productos →
                    </Link>
                  </div>
                </div>
              )}

              {/* Configuración */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuración de Cuenta</h2>

                  {/* Cambiar Contraseña */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambiar Contraseña</h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contraseña Actual
                        </label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Actualizar Contraseña
                      </button>
                    </form>
                  </div>

                  {/* Idioma */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Idioma</h3>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900"
                    >
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  {/* Notificaciones */}
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificaciones</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) =>
                          setSettings({ ...settings, notifications: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Recibir notificaciones por correo electrónico
                      </label>
                    </div>
                  </div>

                  {/* Eliminar Cuenta */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Zona Peligrosa</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-800 mb-4">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                      </p>
                      <button
                        onClick={deleteAccount}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Eliminar Cuenta
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { setIsCartOpen, cartItemsCount } = useCart();
  const router = useRouter();
  
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Categorías dinámicas desde el admin
  const [categories, setCategories] = useState([]);

  // Verificar sesión y cargar categorías al cargar
  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const userData = JSON.parse(session);
      setIsAuthenticated(true);
      setCurrentUser(userData);
    }

    // Cargar categorías desde localStorage
    const savedCategories = JSON.parse(localStorage.getItem("customCategories") || "[]");
    if (savedCategories.length > 0) {
      setCategories(savedCategories);
    } else {
      // Categorías por defecto si no hay ninguna
      const defaultCategories = [
        { id: 1, name: "Teclados", slug: "keyboards" },
        { id: 2, name: "Ratones", slug: "mice" },
        { id: 3, name: "Alfombrillas", slug: "desk-mats" },
        { id: 4, name: "Cables", slug: "cables" },
        { id: 5, name: "Accesorios", slug: "accessories" },
        { id: 6, name: "Audio", slug: "audio" },
        { id: 7, name: "Almacenamiento", slug: "storage" },
      ];
      setCategories(defaultCategories);
      localStorage.setItem("customCategories", JSON.stringify(defaultCategories));
    }
  }, []);

  // Cerrar búsqueda con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Cerrar menú de usuario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuOpen && !e.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (categoriesOpen && !e.target.closest('.categories-menu-container')) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen, categoriesOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <svg className="w-6 h-6 text-indigo-600 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Tech Accessories</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Inicio */}
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group">
              Inicio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Tienda */}
            <Link href="/products" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group">
              Tienda
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Categorías - Dropdown */}
            <div className="relative categories-menu-container">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group flex items-center gap-1"
              >
                Categorías
                <svg className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/products?category=${category.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contacto */}
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group">
              Contacto
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mi Cuenta */}
            <Link href="/account" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group">
              Mi Cuenta
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Carrito - Página */}
            <Link href="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group flex items-center gap-1">
              Carrito
              {cartItemsCount > 0 && (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {cartItemsCount}
                </span>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mis Pedidos */}
            <Link href="/orders" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium relative group">
              Mis Pedidos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-700 hover:text-indigo-600 transition-all hover:scale-110 hover:rotate-12" 
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Vista Rápida del Carrito */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-gray-700 hover:text-indigo-600 transition-all hover:scale-110 hover:-rotate-6 relative" 
              aria-label="Vista rápida del carrito"
              title="Vista rápida del carrito"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
            
            {/* User Menu */}
            <div className="hidden md:block relative user-menu-container">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-gray-700 hover:text-indigo-600 transition-all hover:scale-110 hover:rotate-6" 
                aria-label="User account"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && !isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                  <Link
                    href="/login"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Iniciar Sesión
                    </div>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Registrarse
                    </div>
                  </Link>
                </div>
              )}

              {/* Authenticated User Menu */}
              {userMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fade-in">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{currentUser?.fullName}</p>
                    <p className="text-xs text-gray-600">{currentUser?.email}</p>
                    {currentUser?.role === "admin" && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                        Administrador
                      </span>
                    )}
                  </div>
                  
                  {/* Panel Admin - Solo para admins */}
                  {currentUser?.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Panel Administrador
                      </div>
                    </Link>
                  )}
                  
                  <Link
                    href="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Cuenta
                    </div>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      Mis Pedidos
                    </div>
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("userSession");
                      setIsAuthenticated(false);
                      setCurrentUser(null);
                      setUserMenuOpen(false);
                      router.push("/");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar Sesión
                    </div>
                  </button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-all hover:scale-110"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-fade-in">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  autoFocus
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
                <svg 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                Presiona Enter para buscar o Esc para cerrar
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            <Link
              href="/products"
              className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 py-2 px-3 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              href="/orders"
              className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 py-2 px-3 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mis Pedidos
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 py-2 px-3 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/account"
              className="block text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 py-2 px-3 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mi Cuenta
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

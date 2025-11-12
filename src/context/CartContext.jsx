"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product, quantity = 1, color = null) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.color === color
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { ...product, quantity, color }];
    });
    setIsCartOpen(true);
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Incrementar cantidad
  const incrementQuantity = (productId, color) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.color === color
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrementar cantidad
  const decrementQuantity = (productId, color) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && item.color === color
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId, color) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === productId && item.color === color))
    );
  };

  // Limpiar carrito
  const clearCart = () => {
    setCart([]);
  };

  // Calcular totales
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


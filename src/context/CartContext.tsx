
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProductPackage } from '@/components/ProductCard'; // Import the package interface

// The new structure for an item in the cart
export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  package: ProductPackage; // Contains size, price, sku, etc.
  quantity: number;
}

// The object passed to addToCart
export type NewCartItem = Omit<CartItem, 'quantity'> & { quantity: number };

// Definiamo cosa conterrà il nostro context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: NewCartItem) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

// Creiamo il Context con un valore di default
const CartContext = createContext<CartContextType | undefined>(undefined);

// Creiamo il Provider, il componente che fornirà i dati del carrello
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: NewCartItem) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.package.sku === newItem.package.sku);
      if (itemExists) {
        // Se l'articolo (stesso prodotto E stessa confezione) esiste, aumenta la quantità
        return prevItems.map((item) =>
          item.package.sku === newItem.package.sku
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Altrimenti, aggiungi il nuovo articolo
        return [...prevItems, { ...newItem }];
      }
    });
  };

  const removeFromCart = (sku: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.package.sku !== sku));
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.package.sku === sku ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.package.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizzato per usare facilmente il context del carrello
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

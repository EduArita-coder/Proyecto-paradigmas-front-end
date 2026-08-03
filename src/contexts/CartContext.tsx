import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api } from "../services/api";
import type { CartDto, CartItemDto } from "../interfaces/cart";
import type { Producto } from "../interfaces/product";
import { getSessionId } from "../utils/session";

interface CartContextType {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
  addItem: (product: Producto) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<{ approvalUrl?: string; orderId?: string } | void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sessionId = getSessionId();

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.get<CartDto>(`/carrito/${sessionId}`);
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (product: Producto) => {
    try {
      setError(null);
      const itemPayload: CartItemDto = {
        productId: product.id,
        quantity: 1,
      };
      const updatedCart = await api.post<CartDto>(`/carrito/${sessionId}/items`, itemPayload);
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error al agregar el producto al carrito");
      await refreshCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    try {
      setError(null);
      const updatedCart = await api.put<CartDto>(`/carrito/${sessionId}/items/${productId}`, quantity);
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error al actualizar la cantidad");
      await refreshCart();
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setError(null);
      const updatedCart = await api.delete<CartDto>(`/carrito/${sessionId}/items/${productId}`);
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error al eliminar el producto");
      await refreshCart();
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const updatedCart = await api.delete<CartDto>(`/carrito/${sessionId}`);
      setCart(updatedCart);
    } catch (err: any) {
      setError(err.message || "Error al vaciar el carrito");
      await refreshCart();
    }
  };

  const checkout = async () => {
    try {
      setError(null);
      const res = await api.post<{ approvalUrl?: string; orderId?: string }>(`/carrito/${sessionId}/checkout`);
      if (res?.approvalUrl) {
        window.location.href = res.approvalUrl;
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      throw err;
    }
  };

  const total = cart?.totalAmount || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, error, addItem, updateQuantity, removeItem, clearCart, checkout, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}
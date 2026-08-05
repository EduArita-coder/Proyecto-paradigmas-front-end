import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCart, addToCart, updateCartItemQuantity, removeFromCart, clearCart as apiClearCart, checkoutCart, capturePayPalPayment, getPayPalSuccess, type Cart } from "../services/apiService";
import { useAuth } from "./AuthContext";
import type { Producto } from "../interfaces/product";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addItem: (product: Producto) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<{ approvalUrl?: string; orderId?: string } | void>;
  capturePayment: (token: string, payerId?: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar el carrito");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [refreshCart, token]);

  const addItem = async (product: Producto) => {
    try {
      setError(null);
      await addToCart(product.id, 1);
      await refreshCart();
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
      await updateCartItemQuantity(productId, quantity);
      await refreshCart();
    } catch (err: any) {
      setError(err.message || "Error al actualizar la cantidad");
      await refreshCart();
    }
  };

  const removeItem = async (productId: string) => {
    try {
      setError(null);
      await removeFromCart(productId);
      await refreshCart();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el producto");
      await refreshCart();
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await apiClearCart();
      await refreshCart();
    } catch (err: any) {
      setError(err.message || "Error al vaciar el carrito");
      await refreshCart();
    }
  };

  const checkout = async () => {
    try {
      setError(null);
      const res = await checkoutCart();
      if (res?.approvalUrl) {
        window.location.href = res.approvalUrl;
      }
      return res;
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      throw err;
    }
  };

  const capturePayment = async (token: string, payerId?: string) => {
    try {
      setError(null);
      // Llamar al backend para capturar/confirmar el pago de PayPal
      await capturePayPalPayment(token, payerId);
      // Limpiar el carrito local después de captura exitosa
      setCart({ items: [], total: 0, totalAmount: 0 });
    } catch {
      // Si falla la captura con POST, intentar con el endpoint GET alternativo
      try {
        await getPayPalSuccess(token, payerId);
        setCart({ items: [], total: 0, totalAmount: 0 });
      } catch (captureErr: any) {
        setError(captureErr.response?.data?.message || captureErr.message || "Error al confirmar el pago");
        throw captureErr;
      }
    }
  };

  const total = cart?.totalAmount ?? cart?.total ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, error, addItem, updateQuantity, removeItem, clearCart, checkout, capturePayment, refreshCart, total }}
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
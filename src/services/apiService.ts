import api from '../api/axios';
import type { Producto } from '../interfaces/product';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  cpu: string;
  ram: string;
  slots: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  price: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Cart {
  userId?: string;
  items: CartItem[];
  total: number;
  totalAmount: number;
}

export interface Transaction {
  id: string;
  externalTransactionId: string;
  amount: number;
  status: string;
  createdAt: string;
  customerEmail: string;
  productId?: string;
  productName?: string;
}

// Servidor / Productos
export const getProductos = async (): Promise<Producto[]> => {
  const response = await api.get('/productos');
  return response.data;
};

export const createProducto = async (productData: Omit<Producto, 'id'>): Promise<Producto> => {
  const response = await api.post('/productos', productData);
  return response.data;
};

export const updateProducto = async (id: string, productData: Omit<Producto, 'id'>): Promise<Producto> => {
  const response = await api.put(`/productos/${id}`, productData);
  return response.data;
};

export const deleteProducto = async (id: string): Promise<void> => {
  await api.delete(`/productos/${id}`);
};

export const uploadProductoImagen = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/productos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.imageUrl;
};

// Carrito (Backend maneja userId automáticamente vía JWT)
export const getCart = async (): Promise<Cart> => {
  const response = await api.get('/carrito');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number = 1): Promise<void> => {
  await api.post('/carrito/items', { productId, quantity });
};

export const updateCartItemQuantity = async (productId: string, quantity: number): Promise<void> => {
  await api.put(`/carrito/items/${productId}`, { quantity });
};

export const removeFromCart = async (productId: string): Promise<void> => {
  await api.delete(`/carrito/items/${productId}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete('/carrito');
};

export const checkoutCart = async (): Promise<{ approvalUrl?: string; orderId?: string }> => {
  const response = await api.post('/carrito/checkout');
  return response.data;
};

// Capturar/confirmar pago de PayPal después de la aprobación del usuario
export const capturePayPalPayment = async (token: string, payerId?: string): Promise<void> => {
  await api.post('/pagos/capture', { token, payerId });
};

export const getPayPalSuccess = async (token: string, payerId?: string): Promise<void> => {
  await api.get(`/pagos/success?token=${token}${payerId ? `&PayerID=${payerId}` : ''}`);
};

// Transacciones (Filtra por el usuario autenticado)
export const getTransacciones = async (): Promise<Transaction[]> => {
  const response = await api.get('/transacciones');
  return response.data;
};

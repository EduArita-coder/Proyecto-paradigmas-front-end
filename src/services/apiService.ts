import api from '../api/axios';

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
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
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
export const getProductos = async (): Promise<Product[]> => {
  const response = await api.get('/productos');
  return response.data;
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

// Transacciones (Filtra por el usuario autenticado)
export const getTransacciones = async (): Promise<Transaction[]> => {
  const response = await api.get('/transacciones');
  return response.data;
};

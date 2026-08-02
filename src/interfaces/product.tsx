export interface Producto {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  cpu: string;
  ram: string;
  slots: number;
}

export type Product = Producto;

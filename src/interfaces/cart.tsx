export interface CartItemDto {
  productId: string;
  quantity: number;
  productName?: string;
  unitPrice?: number;
  subtotal?: number;
}

export interface CartDto {
  userId: string;
  items: CartItemDto[];
  totalAmount: number;
}

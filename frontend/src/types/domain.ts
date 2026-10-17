export type Role = "customer" | "admin";
export type Status = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  status: Status;
}

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  sku: string;
  stock: number;
  active: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  image: string;
  price: number;
  status: Status;
  variants: ProductVariant[];
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface OrderItem extends CartItem {
  purchasePrice: number;
}

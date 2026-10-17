import type { Product } from "../../../types/domain";
import { products } from "../../../lib/catalog";

export const productService = {
  list: async () => [...products],
  get: async (slug: string) => products.find((product) => product.slug === slug),
  create: async (data: Product) => { products.push(data); return data; },
  update: async (id: string, data: Partial<Product>) => {
    const index = products.findIndex((product) => product.id === id);
    if (index < 0) throw new Error("Product not found.");
    products[index] = { ...products[index], ...data };
    return products[index];
  },
};

import type { CartItem } from "../../../types/domain";

const storageKey = "ikram-demo-cart";
function readCart(): CartItem[] {
  const saved = localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) as CartItem[] : [];
}
function saveCart(items: CartItem[]) { localStorage.setItem(storageKey, JSON.stringify(items)); }

export const cartService = {
  get: async () => readCart(),
  add: async (variantId: string, quantity: number) => {
    const items = readCart();
    const found = items.find((item) => item.variant.id === variantId);
    if (!found) throw new Error("Cart item not found in the demo catalog.");
    found.quantity = quantity;
    saveCart(items);
    return found;
  },
  update: async (itemId: string, variantId: string, quantity: number) => {
    const items = readCart();
    const found = items.find((item) => item.id === itemId);
    if (!found) throw new Error("Cart item not found.");
    const variant = found.product.variants.find((entry) => entry.id === variantId);
    if (!variant) throw new Error("Variant not found.");
    found.variant = variant;
    found.quantity = quantity;
    saveCart(items);
    return found;
  },
};

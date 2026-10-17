import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../features/auth/services/authService";
import type { CartItem, Product, ProductVariant, User } from "../types/domain";

type AuthValue = { user: User | null; authenticate: (user: User) => void; logout: () => void };
const AuthContext = createContext<AuthValue | null>(null);
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("AuthProvider missing"); return value; }

type CartValue = { items: CartItem[]; add: (p: Product, v: ProductVariant) => void; changeVariant: (id: string, v: ProductVariant) => void; count: number };
const CartContext = createContext<CartValue | null>(null);
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("CartProvider missing"); return value; }

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("ikram-demo-cart");
    return saved ? JSON.parse(saved) as CartItem[] : [];
  });
  useEffect(() => { void authService.me().then(setUser); }, []);
  useEffect(() => { localStorage.setItem("ikram-demo-cart", JSON.stringify(items)); }, [items]);
  const auth = useMemo(() => ({
    user,
    authenticate: (authenticatedUser: User) => { localStorage.setItem("ikram-demo-user", JSON.stringify(authenticatedUser)); setUser(authenticatedUser); },
    logout: () => { void authService.logout(); setUser(null); },
  }), [user]);
  const cart = useMemo(() => ({ items, count: items.reduce((n, i) => n + i.quantity, 0), add: (product: Product, variant: ProductVariant) => setItems((current) => {
    const found = current.find((i) => i.variant.id === variant.id);
    return found ? current.map((i) => i.id === found.id ? { ...i, quantity: Math.min(i.quantity + 1, variant.stock) } : i) : [...current, { id: crypto.randomUUID(), product, variant, quantity: 1, unitPrice: product.price }];
  }), changeVariant: (id: string, variant: ProductVariant) => setItems((current) => current.map((i) => i.id === id ? { ...i, variant, quantity: Math.min(i.quantity, variant.stock) } : i)) }), [items]);
  return <AuthContext.Provider value={auth}><CartContext.Provider value={cart}>{children}</CartContext.Provider></AuthContext.Provider>;
}

import type { Category, Product } from "../types/domain";

export const images = {
  hero: "https://images.unsplash.com/photo-1654254124839-851f6103d1f2?auto=format&fit=crop&w=1800&q=88",
  white: "https://images.unsplash.com/photo-1659522761084-79196b64abe4?auto=format&fit=crop&w=1000&q=85",
  suit: "https://images.unsplash.com/photo-1779406167603-d0afe0a4cdd7?auto=format&fit=crop&w=1000&q=85",
  coat: "https://images.unsplash.com/photo-1624486278831-bb1620d04adf?auto=format&fit=crop&w=1000&q=85",
  river: "https://images.unsplash.com/photo-1652746775243-e09b2e9dd236?auto=format&fit=crop&w=1000&q=85",
  bag: "https://images.unsplash.com/photo-1758171692659-024183c2c272?auto=format&fit=crop&w=1000&q=85",
};

export const categories: Category[] = [
  { id: "c1", name: "Dresses", slug: "dresses", description: "Fluid occasion and everyday silhouettes.", image: images.white, productCount: 12, status: "active" },
  { id: "c2", name: "Tailoring", slug: "tailoring", description: "Modern structure in softly finished cloth.", image: images.suit, productCount: 8, status: "active" },
  { id: "c3", name: "Outerwear", slug: "outerwear", description: "Considered layers for every season.", image: images.coat, productCount: 6, status: "active" },
  { id: "c4", name: "Accessories", slug: "accessories", description: "The details that complete the story.", image: images.bag, productCount: 9, status: "inactive" },
];

export const products: Product[] = [
  { id: "p1", slug: "celeste-draped-dress", name: "Celeste Draped Dress", description: "An elegant draped dress cut from luminous, softly structured cloth.", category: categories[0], image: images.white, price: 189, status: "active", variants: [
    { id: "v1", size: "XS", sku: "CEL-IV-XS", stock: 5, active: true },
    { id: "v2", size: "S", sku: "CEL-IV-S", stock: 12, active: true },
    { id: "v3", size: "M", sku: "CEL-IV-M", stock: 0, active: true },
    { id: "v4", size: "L", sku: "CEL-IV-L", stock: 4, active: true },
    { id: "v5", size: "XL", sku: "CEL-IV-XL", stock: 0, active: false },
  ]},
  { id: "p2", slug: "aurelia-linen-blazer", name: "Aurelia Linen Blazer", description: "Relaxed tailoring with a quietly precise line.", category: categories[1], image: images.suit, price: 154, status: "active", variants: [
    { id: "v6", size: "36", sku: "AUR-BE-36", stock: 8, active: true },
    { id: "v7", size: "38", sku: "AUR-BE-38", stock: 3, active: true },
    { id: "v8", size: "40", sku: "AUR-BE-40", stock: 7, active: true },
  ]},
  { id: "p3", slug: "noor-tailored-coat", name: "Noor Tailored Coat", description: "A signature longline coat with understated presence.", category: categories[2], image: images.coat, price: 218, status: "active", variants: [
    { id: "v9", size: "S", sku: "NOO-ST-S", stock: 2, active: true },
    { id: "v10", size: "M", sku: "NOO-ST-M", stock: 6, active: true },
    { id: "v11", size: "L", sku: "NOO-ST-L", stock: 0, active: true },
  ]},
  { id: "p4", slug: "lina-silk-ensemble", name: "Lina Silk Ensemble", description: "Fluid separates designed to move beautifully.", category: categories[0], image: images.river, price: 176, status: "active", variants: [
    { id: "v12", size: "S", sku: "LIN-SA-S", stock: 8, active: true },
    { id: "v13", size: "M", sku: "LIN-SA-M", stock: 4, active: true },
    { id: "v14", size: "L", sku: "LIN-SA-L", stock: 5, active: true },
  ]},
];

import type { Category } from "../../../types/domain";
import { categories } from "../../../lib/catalog";

export const categoryService = {
  list: async () => [...categories],
  create: async (data: Category) => { categories.push(data); return data; },
  update: async (id: string, data: Partial<Category>) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index < 0) throw new Error("Category not found.");
    categories[index] = { ...categories[index], ...data };
    return categories[index];
  },
  remove: async (id: string) => {
    const index = categories.findIndex((category) => category.id === id);
    if (index >= 0) categories.splice(index, 1);
  },
};

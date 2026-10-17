import type { User } from "../../../types/domain";

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? "admin@ikramfashion.com";
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "ChangeMe123!";

export const authService = {
  me: async (): Promise<User | null> => {
    const saved = localStorage.getItem("ikram-demo-user");
    return saved ? JSON.parse(saved) as User : null;
  },
  login: async (email: string, password: string, admin = false): Promise<User> => {
    if (admin) {
      if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
        throw new Error("Invalid admin email or password.");
      }
      return { id: "demo-admin", name: "Store Admin", email: adminEmail, role: "admin", status: "active" };
    }
    if (!email.includes("@") || password.length < 8) throw new Error("Enter a valid email and a password with at least 8 characters.");
    return { id: `demo-${email.toLowerCase()}`, name: email.split("@")[0] || "Customer", email, role: "customer", status: "active" };
  },
  register: async (name: string, email: string, password: string): Promise<User> => {
    if (name.trim().length < 2 || !email.includes("@") || password.length < 8) throw new Error("Enter a name, valid email, and password with at least 8 characters.");
    return { id: `demo-${email.toLowerCase()}`, name: name.trim(), email, role: "customer", status: "active" };
  },
  logout: async (): Promise<void> => { localStorage.removeItem("ikram-demo-user"); },
};

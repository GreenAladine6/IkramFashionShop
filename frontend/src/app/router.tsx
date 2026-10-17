import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./providers";
import { PublicLayout } from "./layouts/PublicLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { HomePage } from "../pages/public/HomePage";
import { ShopPage } from "../pages/public/ShopPage";
import { ProductDetailsPage } from "../pages/public/ProductDetailsPage";
import { CartPage } from "../pages/public/CartPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { PasswordPage } from "../pages/auth/PasswordPage";
import { CustomerDashboardPage } from "../pages/customer/CustomerDashboardPage";
import { CustomerSectionPage } from "../pages/customer/CustomerSectionPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import { AdminListPage } from "../pages/admin/AdminListPage";
import { CategoriesPage } from "../pages/admin/CategoriesPage";
import { CategoryFormPage } from "../pages/admin/CategoryFormPage";
import { ProductFormPage } from "../pages/admin/ProductFormPage";
import { Heading } from "../components/ui/Heading";

function Guard({ role }: { role: "customer" | "admin" }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to={role === "admin" ? "/admin/login" : "/login"} state={{ from: location.pathname }} replace />;
  if (user.role !== role) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}
function MessagePage({ title, text }: { title: string; text: string }) { return <main className="message-page"><Heading eyebrow="IKRAM FASHION SHOP" title={title} text={text} /><a className="button button--primary" href="/">Return home</a></main>; }

export const router = createBrowserRouter([
  { Component: PublicLayout, children: [
    { index: true, Component: HomePage },
    { path: "shop", Component: ShopPage },
    { path: "shop/category/:slug", Component: ShopPage },
    { path: "products/:slug", Component: ProductDetailsPage },
    { path: "cart", Component: CartPage },
    { path: "about", element: <MessagePage title="The Ikram Atelier" text="Craft, confidence, and individuality shape every collection." /> },
  ]},
  { Component: AuthLayout, children: [
    { path: "login", Component: LoginPage },
    { path: "register", Component: RegisterPage },
    { path: "forgot-password", element: <PasswordPage /> },
    { path: "reset-password", element: <PasswordPage reset /> },
    { path: "admin/login", element: <LoginPage admin /> },
  ]},
  { element: <Guard role="customer" />, children: [{ Component: CustomerLayout, children: [
    { path: "account", Component: CustomerDashboardPage },
    { path: "account/orders", element: <CustomerSectionPage title="Orders" /> },
    { path: "account/orders/:id", element: <CustomerSectionPage title="Order details" /> },
    { path: "account/profile", element: <CustomerSectionPage title="Profile" /> },
    { path: "account/addresses", element: <CustomerSectionPage title="Addresses" /> },
    { path: "account/favorites", element: <CustomerSectionPage title="Favorites" /> },
  ]}]},
  { element: <Guard role="admin" />, children: [{ Component: AdminLayout, children: [
    { path: "admin", Component: AdminDashboardPage },
    { path: "admin/products", element: <AdminListPage title="Products" /> },
    { path: "admin/products/new", Component: ProductFormPage },
    { path: "admin/products/:id/edit", Component: ProductFormPage },
    { path: "admin/categories", Component: CategoriesPage },
    { path: "admin/categories/new", Component: CategoryFormPage },
    { path: "admin/categories/:id/edit", Component: CategoryFormPage },
    { path: "admin/orders", element: <AdminListPage title="Orders" /> },
    { path: "admin/customers", element: <AdminListPage title="Customers" /> },
    { path: "admin/inventory", element: <AdminListPage title="Variant Inventory" /> },
    { path: "admin/settings", element: <AdminListPage title="Settings" /> },
  ]}]},
  { path: "unauthorized", element: <MessagePage title="Access denied" text="Your authenticated role does not permit access to this area." /> },
  { path: "*", element: <MessagePage title="Page not found" text="The page you requested could not be found." /> },
]);

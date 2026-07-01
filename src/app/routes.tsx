import { createBrowserRouter } from "react-router";
import AppLayout from "./components/AppLayout";
import AdminLayout from "./components/AdminLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "shop", Component: CategoryPage },
      { path: "product/:id", Component: ProductPage },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "orders", Component: UserOrdersPage },
      { path: "orders/:id", Component: OrderDetailPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "orders", Component: AdminOrdersPage },
      { path: "products", Component: AdminProductsPage },
    ]
  }
]);

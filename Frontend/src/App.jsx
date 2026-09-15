import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductCatalogPage from "./pages/customer/ProductCatalogPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductFormPage from "./pages/admin/ProductFormPage";
import CategoryListPage from "./pages/admin/CategoryListPage";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Customer-facing storefront: read-only browsing */}
          <Route path="/" element={<ProductCatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          {/* Admin console: full CRUD for products and categories */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/:id/edit" element={<ProductFormPage />} />
            <Route path="categories" element={<CategoryListPage />} />
          </Route>
</Routes>
      </main>
    </>
  );
}

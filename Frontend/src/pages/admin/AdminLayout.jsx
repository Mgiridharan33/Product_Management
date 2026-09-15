import { NavLink, Outlet } from "react-router-dom";
import { Package, Tags } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <span className="admin-sidebar-title">Admin</span>
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
          <Package size={16} />
          Products
        </NavLink>
        <NavLink to="/admin/categories" className={({ isActive }) => (isActive ? "active" : "")}>
          <Tags size={16} />
          Categories
        </NavLink>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

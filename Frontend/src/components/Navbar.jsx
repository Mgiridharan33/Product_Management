import { NavLink } from "react-router-dom";
import { Store, ShieldCheck, Boxes } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <Boxes size={20} />
        <div>
          <strong>Shopwise</strong>
          <small>Product &amp; Category Management</small>
        </div>
      </div>

      <nav className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          <Store size={16} />
          Shop
        </NavLink>
        <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
          <ShieldCheck size={16} />
          Admin Panel
        </NavLink>
      </nav>
    </header>
  );
}

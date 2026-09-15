import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { productApi } from "../../api/productApi";
import { resolveImageUrl } from "../../api/httpClient";
import { formatCurrency } from "../../utils/formatters";
import StatusBadge from "../../components/StatusBadge";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  async function loadProducts() {
    try {
      const result = await productApi.list();
      setProducts(result.data);
    } catch (err) {
      window.alert(err.message);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleToggleStatus(product) {
    try {
      const nextStatus = product.status === "Active" ? "Inactive" : "Active";
      await productApi.updateStatus(product.id, nextStatus);
      loadProducts();
    } catch (err) {
      window.alert(err.message);
    }
  }

  async function handleDeleteProduct(product) {
    try {
      await productApi.remove(product.id);
      loadProducts();
    } catch (err) {
      window.alert(err.message);
    }
  }

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.category_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Admin Console</span>
          <h1>Products</h1>
          <p>Create, update and manage every product in the catalog.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/admin/products/new")}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="panel">
        <div className="panel-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name, SKU or category..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <span className="panel-count">{filteredProducts.length} product(s)</span>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="plain-message">No products yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-product">
                      {product.image_url ? (
                        <img src={resolveImageUrl(product.image_url)} alt={product.name} />
                      ) : (
                        <span className="table-product-placeholder">IMG</span>
                      )}
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.brand || "No brand"}</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.sku}</td>
                  <td>{product.category_name}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <StatusBadge status={product.status} onToggle={() => handleToggleStatus(product)} />
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/products/${product.id}`} title="View" className="icon-btn">
                        <Eye size={16} />
                      </Link>
                      <Link to={`/admin/products/${product.id}/edit`} title="Edit" className="icon-btn">
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        title="Delete"
                        className="icon-btn icon-btn-danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${product.name}"? This cannot be undone.`)) {
                            handleDeleteProduct(product);
                          }
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

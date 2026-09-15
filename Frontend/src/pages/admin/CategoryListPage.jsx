import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoryApi } from "../../api/categoryApi";
import StatusBadge from "../../components/StatusBadge";
import CategoryFormModal from "../../components/CategoryFormModal";

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  async function loadCategories() {
    try {
      const result = await categoryApi.list();
      setCategories(result.data);
    } catch (err) {
      window.alert(err.message);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleToggleStatus(category) {
    try {
      const nextStatus = category.status === "Active" ? "Inactive" : "Active";
      await categoryApi.updateStatus(category.id, nextStatus);
      loadCategories();
    } catch (err) {
      window.alert(err.message);
    }
  }

  async function handleDeleteCategory(category) {
    try {
      await categoryApi.remove(category.id);
      loadCategories();
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Admin Console</span>
          <h1>Categories</h1>
          <p>Every product belongs to one category.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="panel">
        {categories.length === 0 ? (
          <p className="plain-message">No categories yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <strong>{category.name}</strong>
                  </td>
                  <td>{category.description || "—"}</td>
                  <td>{category.product_count}</td>
                  <td>
                    <StatusBadge status={category.status} onToggle={() => handleToggleStatus(category)} />
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" className="icon-btn" title="Edit" onClick={() => setEditingCategory(category)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn-danger"
                        title="Delete"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
                            handleDeleteCategory(category);
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

      {(isCreating || editingCategory) && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => {
            setIsCreating(false);
            setEditingCategory(null);
          }}
          onSaved={() => {
            setIsCreating(false);
            setEditingCategory(null);
            loadCategories();
          }}
        />
      )}
    </div>
  );
}

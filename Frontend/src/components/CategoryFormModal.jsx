import { useState } from "react";
import { X } from "lucide-react";
import { categoryApi } from "../api/categoryApi";
import { EMPTY_CATEGORY_FORM } from "../utils/formatters";

export default function CategoryFormModal({ category, onClose, onSaved }) {
  const isEditMode = Boolean(category);
  const [form, setForm] = useState(category || EMPTY_CATEGORY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setFormError("Category name is required.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      if (isEditMode) {
        await categoryApi.update(category.id, form);
      } else {
        await categoryApi.create(form);
      }
      onSaved();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-box dialog-box-wide" onClick={(event) => event.stopPropagation()}>
        <div className="dialog-header">
          <h3>{isEditMode ? "Edit Category" : "Create Category"}</h3>
          <button type="button" className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {formError && <div className="form-error">{formError}</div>}

        <form onSubmit={handleSubmit}>
          <label>
            <span>Category Name *</span>
            <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          </label>

          <label>
            <span>Description</span>
            <textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
          </label>

          <label>
            <span>Status</span>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>

          <div className="dialog-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditMode ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import { resolveImageUrl } from "../../api/httpClient";
import { EMPTY_PRODUCT_FORM } from "../../utils/formatters";

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id && id !== "new" && id !== "edit");
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    categoryApi.list().then((result) => setCategories(result.data.filter((c) => c.status === "Active")));
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    productApi
      .get(id)
      .then((result) => {
        const product = result.data;
        setForm({
          name: product.name,
          sku: product.sku,
          description: product.description || "",
          price: product.price,
          stock: product.stock,
          brand: product.brand || "",
          category_id: String(product.category_id),
          product_type: product.product_type,
          availability: product.availability,
          featured: product.featured,
          returnable: product.returnable,
          available_date: product.available_date ? product.available_date.slice(0, 10) : "",
          expiry_date: product.expiry_date ? product.expiry_date.slice(0, 10) : "",
          status: product.status,
        });
        setExistingImageUrl(product.image_url || "");
      })
      .catch((err) => setFormError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.sku.trim() || !form.category_id || form.price === "" || form.stock === "") {
      setFormError("Please fill in all required fields marked with *.");
      return;
    }

    setFormError("");
    setIsSaving(true);

    try {
      if (isEditMode) {
        await productApi.update(id, form, imageFile);
      } else {
        await productApi.create(form, imageFile);
      }
      navigate("/admin/products");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="page"><p className="plain-message">Loading product...</p></div>;

  return (
    <div className="page">
      <Link to="/admin/products" className="back-link">
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="page-header">
        <div>
          <span className="page-eyebrow">Admin Console</span>
          <h1>{isEditMode ? "Edit Product" : "Create Product"}</h1>
          <p>Fields marked with * are required.</p>
        </div>
      </div>

      {formError && <div className="form-error">{formError}</div>}

      <form className="form-panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Product Name *</span>
            <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
          </label>

          <label>
            <span>SKU *</span>
            <input type="text" value={form.sku} onChange={(e) => updateField("sku", e.target.value)} />
          </label>

          <label>
            <span>Price (₹) *</span>
            <input type="text" inputMode="decimal" value={form.price} onChange={(e) => updateField("price", e.target.value)} />
          </label>

          <label>
            <span>Stock *</span>
            <input type="text" inputMode="numeric" value={form.stock} onChange={(e) => updateField("stock", e.target.value)} />
          </label>

          <label>
            <span>Brand</span>
            <input type="text" value={form.brand} onChange={(e) => updateField("brand", e.target.value)} />
          </label>

          {/* <label>
            <span>Category *</span>
            <select value={form.category_id} onChange={(e) => updateField("category_id", e.target.value)}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label> */}

          <label>
            <span>Category *</span>
            <select
              value={form.category_id}
              onChange={(e) => {
                const selectedValue = e.target.value;
                console.log("Selected category_id:", selectedValue); // 👈 check here
                updateField("category_id", parseInt(selectedValue));
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>


          <label>
            <span>Product Type</span>
            <div className="radio-group">
              {["Physical", "Digital", "Service"].map((type) => (
                <label key={type} className="radio-option">
                  <input
                    type="radio"
                    name="product_type"
                    value={type}
                    checked={form.product_type === type}
                    onChange={(e) => updateField("product_type", e.target.value)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </label>

          <label>
            <span>Availability</span>
            <select value={form.availability} onChange={(e) => updateField("availability", e.target.value)}>
              <option>Available</option>
              <option>Pre-order</option>
              <option>Out of stock</option>
            </select>
          </label>

          <label>
            <span>Status</span>
            <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>

          <label>
            <span>Available Date</span>
            <input type="date" value={form.available_date} onChange={(e) => updateField("available_date", e.target.value)} />
          </label>

          <label>
            <span>Expiry Date</span>
            <input type="date" value={form.expiry_date} onChange={(e) => updateField("expiry_date", e.target.value)} />
          </label>

          <label>
            <span>Product Image</span>
            <label className="upload-box">
              <UploadCloud size={16} />
              {imageFile?.name || (existingImageUrl ? "Replace current image" : "Choose an image")}
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
            {existingImageUrl && !imageFile && (
              <img className="upload-preview" src={resolveImageUrl(existingImageUrl)} alt="Current" />
            )}
          </label>
        </div>

        <label className="full-width">
          <span>Description</span>
          <textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} />
        </label>

        <div className="checkbox-row">
          <label className="checkbox-option">
            <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} />
            Featured product
          </label>
          <label className="checkbox-option">
            <input type="checkbox" checked={form.returnable} onChange={(e) => updateField("returnable", e.target.checked)} />
            Returnable
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

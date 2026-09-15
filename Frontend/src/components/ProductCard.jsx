import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/formatters";
import { resolveImageUrl } from "../api/httpClient";

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        {product.image_url ? (
          <img src={resolveImageUrl(product.image_url)} alt={product.name} />
        ) : (
          <span>No image</span>
        )}
        {product.featured && <span className="product-card-flag">Featured</span>}
      </div>

      <div className="product-card-body">
        <span className="product-card-category">{product.category_name}</span>
        <h3>{product.name}</h3>
        <p>{product.brand || "Unbranded"}</p>
        <div className="product-card-footer">
          <strong>{formatCurrency(product.price)}</strong>
          <span className={product.stock > 0 ? "in-stock" : "out-of-stock"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}

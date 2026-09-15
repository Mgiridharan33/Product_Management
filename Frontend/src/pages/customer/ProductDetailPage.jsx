import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Tag, Layers, CalendarDays, RotateCcw, Star } from "lucide-react";
import { productApi } from "../../api/productApi";
import { resolveImageUrl } from "../../api/httpClient";
import { formatCurrency, formatDate } from "../../utils/formatters";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    productApi
      .get(id)
      .then((result) => {
        if (isMounted) setProduct(result.data);
      })
      .catch(() => {
        if (isMounted) setProduct(null);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!product) {
    return (
      <div className="page">
        <p className="plain-message">Product not found.</p>
        <Link to="/" className="btn btn-ghost">
          <ArrowLeft size={16} /> Back to ShopWise
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to ShopWise
      </Link>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.image_url ? (
            <img src={resolveImageUrl(product.image_url)} alt={product.name} />
          ) : (
            <span>No image available</span>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-card-category">{product.category_name}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-price">{formatCurrency(product.price)}</p>
          <p className="product-detail-description">{product.description || "No description provided."}</p>

          <div className="product-detail-facts">
            <div>
              <Tag size={16} />
              <div>
                <small>SKU</small>
                <strong>{product.sku}</strong>
              </div>
            </div>
            <div>
              <Layers size={16} />
              <div>
                <small>Stock</small>
                <strong>{product.stock > 0 ? `${product.stock} units` : "Out of stock"}</strong>
              </div>
            </div>
            <div>
              <Star size={16} />
              <div>
                <small>Featured</small>
                <strong>{product.featured ? "Yes" : "No"}</strong>
              </div>
            </div>
            <div>
              <RotateCcw size={16} />
              <div>
                <small>Returnable</small>
                <strong>{product.returnable ? "Yes" : "No"}</strong>
              </div>
            </div>
            <div>
              <CalendarDays size={16} />
              <div>
                <small>Available From</small>
                <strong>{formatDate(product.available_date)}</strong>
              </div>
            </div>
            <div>
              <CalendarDays size={16} />
              <div>
                <small>Expiry</small>
                <strong>{formatDate(product.expiry_date)}</strong>
              </div>
            </div>
          </div>

          <div className="product-detail-tags">
            <span className="tag">{product.product_type}</span>
            <span className="tag">{product.availability}</span>
            <span className="tag">{product.brand || "Unbranded"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

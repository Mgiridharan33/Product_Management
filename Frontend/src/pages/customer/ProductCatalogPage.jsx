import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { productApi } from "../../api/productApi";
import { categoryApi } from "../../api/categoryApi";
import ProductCard from "../../components/ProductCard";

export default function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadCatalog() {
      try {
        const [productsResult, categoriesResult] = await Promise.all([
          productApi.list(),
          categoryApi.list(),
        ]);
        if (!isMounted) return;
        setProducts(productsResult.data);
        setCategories(categoriesResult.data);
      } catch (err) {
        if (isMounted) console.error(err.message);
      }
    }

    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products
      .filter((product) => product.status === "Active")
      .filter((product) => categoryFilter === "all" || String(product.category_id) === categoryFilter)
      .filter((product) => {
        const haystack = `${product.name} ${product.brand} ${product.sku}`.toLowerCase();
        return haystack.includes(searchTerm.trim().toLowerCase());
      });
  }, [products, categoryFilter, searchTerm]);

  const activeCategories = categories.filter((category) => category.status === "Active");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">ShopWise</span>
          <h1>Browse products</h1>
          <p>Explore what's currently available across every active category.</p>
        </div>
      </div>

      <div className="catalog-toolbar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, brand or SKU..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option value="all">All categories</option>
          {activeCategories.map((category) => (
            <option key={category.id} value={String(category.id)}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {visibleProducts.length === 0 ? (
        <p className="plain-message">No products found.</p>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

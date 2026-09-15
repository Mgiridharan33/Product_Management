export function formatCurrency(amount) {
  const value = Number(amount) || 0;
  return `₹${value.toFixed(2)}`;
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export const EMPTY_PRODUCT_FORM = {
  name: "",
  sku: "",
  description: "",
  price: "",
  stock: "",
  brand: "",
  category_id: "",
  product_type: "Physical",
  availability: "Available",
  featured: false,
  returnable: true,
  available_date: "",
  expiry_date: "",
  status: "Active",
};

export const EMPTY_CATEGORY_FORM = {
  name: "",
  description: "",
  status: "Active",
};

import { request, requestJson } from "./httpClient";

function toFormData(product, imageFile) {
  const formData = new FormData();

  Object.entries(product).forEach(([key, value]) => {
    if (key === "id") return;
    formData.append(key, value ?? "");
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
}

export const productApi = {
  list: () => request("/products"),
  get: (id) => request(`/products/${id}`),

  create: (product, imageFile) =>
    request("/products", { method: "POST", body: toFormData(product, imageFile) }),

  update: (id, product, imageFile) =>
    request(`/products/${id}`, { method: "PUT", body: toFormData(product, imageFile) }),

  save: (product, imageFile) => {
    const hasId = !!product.id;
    return hasId
      ? productApi.update(product.id, product, imageFile)
      : productApi.create(product, imageFile);
  },

  updateStatus: (id, status) =>
    requestJson(`/products/${id}`, "PATCH", { status }),

  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};


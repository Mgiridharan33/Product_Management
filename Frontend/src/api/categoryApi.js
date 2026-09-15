import { request, requestJson } from "./httpClient";

export const categoryApi = {
  list: () => request("/categories"),
  get: (id) => request(`/categories/${id}`),
  create: (data) => requestJson("/categories", "POST", data),
  update: (id, data) => requestJson(`/categories/${id}`, "PUT", data),
  updateStatus: (id, status) => requestJson(`/categories/${id}`, "PATCH", { status }),
  remove: (id) => request(`/categories/${id}`, { method: "DELETE" }),
};

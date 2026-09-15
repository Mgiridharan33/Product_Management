const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Invalid server response',
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
}

function jsonBody(payload) {
  return {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

export const api = {
  categories: {
    list: () => request('/categories'),

    create: (data) =>
      request('/categories', {
        method: 'POST',
        ...jsonBody(data),
      }),

    update: (id, data) =>
      request(`/categories/${id}`, {
        method: 'PUT',
        ...jsonBody(data),
      }),

    status: (id, status) =>
      request(`/categories/${id}`, {
        method: 'PATCH',
        ...jsonBody({ status }),
      }),

    remove: (id) =>
      request(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  products: {
    list: () => request('/products'),

    create: (formData) =>
      request('/products', {
        method: 'POST',
        body: formData,
      }),

    update: (id, formData) =>
      request(`/products/${id}`, {
        method: 'PUT',
        body: formData,
      }),

    status: (id, status) =>
      request(`/products/${id}`, {
        method: 'PATCH',
        ...jsonBody({ status }),
      }),

    remove: (id) =>
      request(`/products/${id}`, {
        method: 'DELETE',
      }),
  },
};

export const imageUrl = (path) => (path ? `${API.replace('/api', '')}${path}` : '');

// Base URL for the backend API. Falls back to localhost for local development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// The uploads folder is served from the API root (one level up from /api),
// so a stored value like "/uploads/foo.jpg" needs the "/api" suffix stripped.
export function resolveImageUrl(imagePath) {
  if (!imagePath) return "";
  return API_BASE_URL.replace(/\/api\/?$/, "") + imagePath;
}

// Thin wrapper around fetch that understands our API's JSON envelope
// ({ success, data, message }) and throws a plain Error on failure so
// callers can just try/catch.
export async function request(path, options = {}) {
  console.log("path",path);
  
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = { success: false, message: "The server returned an unexpected response." };
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Something went wrong. Please try again.");
  }

  return payload;
}

export function requestJson(path, method, body) {
  return request(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

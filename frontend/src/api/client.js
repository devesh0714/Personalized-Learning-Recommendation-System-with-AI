const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const request = async (path, { method = "GET", body, token } = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  getRecommendations: (token) => request("/recommendations", { token }),
  getProgress: (token) => request("/progress", { token }),
  saveProgress: (token, payload) =>
    request("/progress", { method: "POST", body: payload, token }),
};
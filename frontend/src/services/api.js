const BASE_URL = "http://localhost:5001";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = getToken();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  return response.json();
};
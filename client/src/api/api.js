const API_BASE = "http://localhost:4000";

export async function apiRequest(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
}

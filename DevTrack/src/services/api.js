

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";



function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {

    throw new Error(data.message || `Erreur ${response.status}`);
  }

  return data;
}


export const authAPI = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};



export const userAPI = {
  getProfile: () => request("/users/profile"),

  updateProfile: (payload) =>
    request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};



export const projectsAPI = {
  getAll: () => request("/projects"),

  create: (payload) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    request(`/projects/${id}`, {
      method: "DELETE",
    }),
};


export const skillsAPI = {
  getAll: () => request("/skills"),

  create: (payload) =>
    request("/skills", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    request(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id) =>
    request(`/skills/${id}`, {
      method: "DELETE",
    }),
};


export const dashboardAPI = {
  getStats: () => request("/dashboard"),
};
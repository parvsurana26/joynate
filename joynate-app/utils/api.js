const API_BASE_URL = "http://localhost:3001/api"

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token")
}

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken()

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Auth API calls
export const authAPI = {
  register: (userData) =>
    makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  forgotPassword: (email) =>
    makeRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, password) =>
    makeRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    }),

  getProfile: () => makeRequest("/auth/profile"),

  updateProfile: (userData) =>
    makeRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
}

// Donations API calls
export const donationsAPI = {
  getAll: () => makeRequest("/donations"),

  getByUser: (userId) => makeRequest(`/donations/user/${userId}`),

  getAssigned: () => makeRequest("/donations/assigned"),

  getCount: () => makeRequest("/donations/count"),

  create: (donationData) =>
    makeRequest("/donations", {
      method: "POST",
      body: JSON.stringify(donationData),
    }),

  update: (id, updateData) =>
    makeRequest(`/donations/${id}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    }),

  delete: (id) =>
    makeRequest(`/donations/${id}`, {
      method: "DELETE",
    }),

  getStats: () => makeRequest("/donations/stats"),

  getUserStats: (userId) => makeRequest(`/donations/user/${userId}/stats`),
}

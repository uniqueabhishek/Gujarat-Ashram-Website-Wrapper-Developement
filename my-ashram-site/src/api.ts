const API_BASE = "http://localhost:4000/api";

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include", // Important for cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// ============================================
// AUTH API
// ============================================

export const authAPI = {
  login: async (username: string, password: string) => {
    return apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async () => {
    return apiCall("/auth/logout", { method: "POST" });
  },

  me: async () => {
    return apiCall("/auth/me");
  },
};

// ============================================
// CONTENT API
// ============================================

export const contentAPI = {
  // Menu Items
  getMenuItems: async () => {
    return apiCall("/menu-items");
  },

  saveMenuItems: async (items: any[]) => {
    return apiCall("/menu-items", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  },

  // Hero Buttons
  getHeroButtons: async () => {
    return apiCall("/hero-buttons");
  },

  saveHeroButtons: async (buttons: any[]) => {
    return apiCall("/hero-buttons", {
      method: "POST",
      body: JSON.stringify({ buttons }),
    });
  },

  // Footer Links
  getFooterLinks: async () => {
    return apiCall("/footer-links");
  },

  saveFooterLinks: async (links: any[]) => {
    return apiCall("/footer-links", {
      method: "POST",
      body: JSON.stringify({ links }),
    });
  },
};

// ============================================
// IMAGE API
// ============================================

export const imageAPI = {
  getImagesByCategory: async (category: string) => {
    return apiCall(`/images/${category}`);
  },

  uploadImage: async (file: File, category: string, order: number = 0) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);
    formData.append("order", order.toString());

    const response = await fetch(`${API_BASE}/images/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || "Upload failed");
    }

    return response.json();
  },

  deleteImage: async (id: number) => {
    return apiCall(`/images/${id}`, { method: "DELETE" });
  },

  reorderImages: async (images: { id: number; order: number }[]) => {
    return apiCall("/images/reorder", {
      method: "POST",
      body: JSON.stringify({ images }),
    });
  },
};

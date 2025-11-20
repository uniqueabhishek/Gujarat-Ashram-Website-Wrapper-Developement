// API Base URL - this should match your backend server
const API_BASE = "http://localhost:4000";

// TypeScript types for our API responses
export interface MenuItem {
  id: string;
  name: string;
  url: string;
}

export interface HeroButton {
  id: string;
  name: string;
  url: string;
  variant: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface Image {
  id: string;
  filename: string;
  path: string;
  category: string;
}

// Content API - handles menu items, hero buttons, and footer links
export const contentAPI = {
  // Get navigation menu items
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(`${API_BASE}/api/content/menu`);
      if (!response.ok) throw new Error("Failed to fetch menu items");
      return await response.json();
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
  },

  // Save/update menu items
  async saveMenuItems(items: MenuItem[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/content/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving menu items:", error);
      return false;
    }
  },

  // Get hero section buttons
  async getHeroButtons(): Promise<HeroButton[]> {
    try {
      const response = await fetch(`${API_BASE}/api/content/hero-buttons`);
      if (!response.ok) throw new Error("Failed to fetch hero buttons");
      return await response.json();
    } catch (error) {
      console.error("Error fetching hero buttons:", error);
      return [];
    }
  },

  // Save/update hero buttons
  async saveHeroButtons(buttons: HeroButton[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/content/hero-buttons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buttons),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving hero buttons:", error);
      return false;
    }
  },

  // Get footer links
  async getFooterLinks(): Promise<FooterLink[]> {
    try {
      const response = await fetch(`${API_BASE}/api/content/footer-links`);
      if (!response.ok) throw new Error("Failed to fetch footer links");
      return await response.json();
    } catch (error) {
      console.error("Error fetching footer links:", error);
      return [];
    }
  },

  // Save/update footer links
  async saveFooterLinks(links: FooterLink[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/content/footer-links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(links),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving footer links:", error);
      return false;
    }
  },
};

// Image API - handles image fetching by category
export const imageAPI = {
  // Get images by category (e.g., "hero", "gallery")
  async getImagesByCategory(category: string): Promise<Image[]> {
    try {
      const response = await fetch(`${API_BASE}/api/images/${category}`);
      if (!response.ok) throw new Error(`Failed to fetch ${category} images`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${category} images:`, error);
      return [];
    }
  },
};

// Auth API - handles authentication
export const authAPI = {
  // Login with password
  async login(password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session
        body: JSON.stringify({ password }),
      });
      return response.ok;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  },

  // Verify admin password
  async verifyPassword(password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error("Error verifying password:", error);
      return false;
    }
  },

  // Get current user/session info
  async me(): Promise<{ authenticated: boolean; user?: string }> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include", // Include cookies for session
      });
      if (!response.ok) return { authenticated: false };
      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { authenticated: false };
    }
  },

  // Logout current user
  async logout(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error logging out:", error);
      return false;
    }
  },
};

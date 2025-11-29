// api.ts - Complete API library for all website content
// This file handles all communication between frontend and backend

const API_BASE = "http://localhost:4000";

// ============================================
// TYPE DEFINITIONS
// ============================================

// Existing types
export interface MenuItem {
  id: string;
  name: string;
  url: string;
  isSpecial?: boolean;  // ✅ NEW: Optional field
  variant?: string;     // ✅ NEW: Optional field
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
  alt?: string;
}

// New types for complete content management
export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  buttonText?: string;
  buttonUrl?: string;
  isActive?: boolean;
}

export interface AboutContent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  videoUrl?: string;
}

export interface InfoCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive?: boolean;
}

export interface ContactInfo {
  id: string;
  type: string;
  label: string;
  value: string;
  url?: string;
  isActive?: boolean;
}

// ============================================
// CONTENT API - Original content management
// ============================================

export const contentAPI = {
  // Menu Items
  async getMenuItems(): Promise<MenuItem[]> {
    try {
        const response = await fetch(`${API_BASE}/api/menu-items`);
      if (!response.ok) throw new Error("Failed to fetch menu items");
      return await response.json();
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return [];
    }
  },

  async saveMenuItems(items: MenuItem[]): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/api/menu-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(items),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving menu items:", error);
      return false;
    }
  },

  // Hero Buttons
  async getHeroButtons(): Promise<HeroButton[]> {
    try {
        const response = await fetch(`${API_BASE}/api/hero-buttons`);
      if (!response.ok) throw new Error("Failed to fetch hero buttons");
      return await response.json();
    } catch (error) {
      console.error("Error fetching hero buttons:", error);
      return [];
    }
  },

  async saveHeroButtons(buttons: HeroButton[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/hero-buttons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(buttons),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving hero buttons:", error);
      return false;
    }
  },

  // Footer Links
  async getFooterLinks(): Promise<FooterLink[]> {
    try {
      const response = await fetch(`${API_BASE}/api/footer-links`);
      if (!response.ok) throw new Error("Failed to fetch footer links");
      return await response.json();
    } catch (error) {
      console.error("Error fetching footer links:", error);
      return [];
    }
  },

  async saveFooterLinks(links: FooterLink[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/footer-links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(links),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving footer links:", error);
      return false;
    }
  },
};

// ============================================
// EVENTS API - New events management
// ============================================

export const eventsAPI = {
  async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE}/api/events`);
      if (!response.ok) throw new Error("Failed to fetch events");
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      // Return default events if API fails
      return [
        {
          id: "1",
          title: "Happiness Program",
          date: "Dec 5 - Dec 7, 2025",
          description: "A weekend immersion in breathing and mindfulness.",
        },
        {
          id: "2",
          title: "Sudarshan Kriya Workshop",
          date: "Jan 10, 2026",
          description: "Guided practice with certified instructors.",
        },
        {
          id: "3",
          title: "Silence Retreat",
          date: "Feb 14 - Feb 20, 2026",
          description: "Deep reflective retreat in nature.",
        },
      ];
    }
  },

  async saveEvents(events: Event[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/content/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(events),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving events:", error);
      return false;
    }
  },
};

// ============================================
// ABOUT API - About section content
// ============================================

export const aboutAPI = {
  async getAboutContent(): Promise<AboutContent> {
    try {
      const response = await fetch(`${API_BASE}/api/about`);
      if (!response.ok) throw new Error("Failed to fetch about content");
      return await response.json();
    } catch (error) {
      console.error("Error fetching about content:", error);
      // Return default content if API fails
      return {
        id: "default",
        title: "Welcome to Gujarat Ashram",
        subtitle: "A Sanctuary for Inner Peace",
        description:
          "Gujarat Ashram has been a beacon of spiritual learning and holistic wellness for over 50 years. Nestled in serene natural surroundings, our ashram offers a perfect environment for meditation, yoga, and self-discovery.",
      };
    }
  },

  async saveAboutContent(content: AboutContent): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/about`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(content),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving about content:", error);
      return false;
    }
  },
};

// ============================================
// INFO CARDS API - Facilities/features cards
// ============================================

export const infoCardsAPI = {
  async getInfoCards(): Promise<InfoCard[]> {
    try {
      const response = await fetch(`${API_BASE}/api/info-cards`);
      if (!response.ok) throw new Error("Failed to fetch info cards");
      return await response.json();
    } catch (error) {
      console.error("Error fetching info cards:", error);
      // Return default cards if API fails
      return [
        {
          id: "1",
          title: "Meditation Hall",
          description: "A peaceful sanctuary designed for deep meditation",
          icon: "Home",
        },
        {
          id: "2",
          title: "Accommodation",
          description: "Clean, comfortable rooms with modern amenities",
          icon: "Users",
        },
        {
          id: "3",
          title: "Organic Meals",
          description: "Nutritious vegetarian meals prepared with love",
          icon: "Users",
        },
        {
          id: "4",
          title: "Nature Trails",
          description: "Beautiful walking paths through gardens",
          icon: "MapPin",
        },
      ];
    }
  },

  async saveInfoCards(cards: InfoCard[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/info-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(cards),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving info cards:", error);
      return false;
    }
  },
};

// ============================================
// CONTACT API - Contact information
// ============================================

export const contactAPI = {
  async getContactInfo(): Promise<ContactInfo[]> {
    try {
      const response = await fetch(`${API_BASE}/api/contact`);
      if (!response.ok) throw new Error("Failed to fetch contact info");
      return await response.json();
    } catch (error) {
      console.error("Error fetching contact info:", error);
      // Return default contact info if API fails
      return [
        {
          id: "1",
          type: "phone",
          label: "Call Us",
          value: "+91 98765 43210",
          url: "tel:+919876543210",
        },
        {
          id: "2",
          type: "email",
          label: "Email Us",
          value: "info@gujaratashram.org",
          url: "mailto:info@gujaratashram.org",
        },
        {
          id: "3",
          type: "whatsapp",
          label: "WhatsApp",
          value: "+91 98765 43210",
          url: "https://wa.me/919876543210",
        },
      ];
    }
  },

  async saveContactInfo(contacts: ContactInfo[]): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(contacts),
      });
      return response.ok;
    } catch (error) {
      console.error("Error saving contact info:", error);
      return false;
    }
  },
};

// ============================================
// IMAGE API - Image management
// ============================================

export const imageAPI = {
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

  async uploadImage(file: File, category: string): Promise<Image | null> {
    try {
      console.log("API: Creating FormData with file:", file.name, "category:", category);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", category);

      console.log("API: Sending POST to", `${API_BASE}/api/images/upload`);
      const response = await fetch(`${API_BASE}/api/images/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      console.log("API: Response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API: Upload failed with response:", errorText);
        throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("API: Upload successful, result:", result);
      return result;
    } catch (error) {
      console.error("API: Error uploading image:", error);
      throw error; // Re-throw instead of returning null
    }
  },

  async deleteImage(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/images/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  },
};

// ============================================
// AUTH API - Authentication
// ============================================

export const authAPI = {
  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      return response.ok;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  },

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

  async me(): Promise<{ authenticated: boolean; user?: string }> {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        credentials: "include",
      });
      if (!response.ok) return { authenticated: false };
      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      return { authenticated: false };
    }
  },
};

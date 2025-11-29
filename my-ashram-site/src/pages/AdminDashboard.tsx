// AdminDashboard.tsx - SIMPLE version with only hardcoded authentication
// NO backend authentication - just simple username/password check

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LogOut,
  Menu,
  Image as ImageIcon,
  Link,
  Upload,
  Calendar,
  FileText,
  Grid3x3,
  Phone,
  Trash2,
  Plus,
  Lock,
} from "lucide-react";

import {
  contentAPI,
  eventsAPI,
  aboutAPI,
  infoCardsAPI,
  contactAPI,
  imageAPI,
  MenuItem,
  HeroButton,
  FooterLink,
  Event,
  AboutContent,
  InfoCard,
  ContactInfo,
  Image,
} from "@/lib/api";

// ═══════════════════════════════════════════════════════════
// HARDCODED CREDENTIALS - CHANGE THESE TO YOUR DESIRED VALUES
// ═══════════════════════════════════════════════════════════
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Type definitions
interface EditorProps<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
}

interface AboutEditorProps {
  content: AboutContent;
  setContent: React.Dispatch<React.SetStateAction<AboutContent>>;
}

interface ImageManagerProps {
  heroImages: Image[];
  galleryImages: Image[];
  onRefresh: () => void;
}

// ═══════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ─────────────────────────────────────────
  // AUTHENTICATION STATE
  // ─────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ─────────────────────────────────────────
  // DASHBOARD STATE
  // ─────────────────────────────────────────
  const [tab, setTab] = useState("menu");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Content states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: "default",
    title: "",
    subtitle: "",
    description: "",
  });
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);

  // ─────────────────────────────────────────
  // CHECK IF ALREADY LOGGED IN
  // ─────────────────────────────────────────
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("isAdminAuthenticated");
    if (savedAuth === "true") {
      // Re-authenticate with backend to refresh the cookie
      fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }),
      }).then(response => {
        if (response.ok) {
          setIsAuthenticated(true);
          loadAllData();
        } else {
          sessionStorage.removeItem("isAdminAuthenticated");
        }
      });
    }
  }, []);

  // ─────────────────────────────────────────
  // SIMPLE LOGIN CHECK
  // ─────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login attempt with:", username, password);

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log("Frontend credentials matched!");

      try {
        const response = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        console.log("Backend response status:", response.status);
        const data = await response.json();
        console.log("Backend response data:", data);

        if (response.ok) {
          setIsAuthenticated(true);
          sessionStorage.setItem("isAdminAuthenticated", "true");
          setLoginError("");
          loadAllData();
        } else {
          setLoginError("Backend error: " + (data.error || "Unknown"));
        }
      } catch (error) {
        console.error("Backend auth error:", error);
        setLoginError("Backend authentication error: " + error);
      }
    } else {
      setLoginError("Invalid username or password");
    }
  };

  // ─────────────────────────────────────────
  // LOGOUT
  // ─────────────────────────────────────────
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAdminAuthenticated");
    setUsername("");
    setPassword("");
    navigate("/");
  };

  // ─────────────────────────────────────────
  // LOAD DATA FROM BACKEND
  // ─────────────────────────────────────────
  async function loadAllData() {
    try {
      const [
        menuData,
        heroData,
        footerData,
        eventsData,
        aboutData,
        cardsData,
        contactData,
        heroImgs,
        galleryImgs,
      ] = await Promise.all([
        contentAPI.getMenuItems(),
        contentAPI.getHeroButtons(),
        contentAPI.getFooterLinks(),
        eventsAPI.getEvents(),
        aboutAPI.getAboutContent(),
        infoCardsAPI.getInfoCards(),
        contactAPI.getContactInfo(),
        imageAPI.getImagesByCategory("hero"),
        imageAPI.getImagesByCategory("gallery"),
      ]);

      setMenuItems(menuData);
      setHeroButtons(heroData);
      setFooterLinks(footerData);
      setEvents(eventsData);
      setAboutContent(aboutData);
      setInfoCards(cardsData);
      setContactInfo(contactData);
      setHeroImages(heroImgs);
      setGalleryImages(galleryImgs);
    } catch (error) {
      console.error("Failed to load data:", error);
      setMessage("⚠️ Failed to load some data from server");
    }
  }

  // ─────────────────────────────────────────
  // SAVE CHANGES
  // ─────────────────────────────────────────
  async function handleSave() {
    setLoading(true);
    setMessage("");

    try {
      let success = false;

      switch (tab) {
        case "menu":
          success = await contentAPI.saveMenuItems(menuItems);
          break;
        case "hero":
          success = await contentAPI.saveHeroButtons(heroButtons);
          break;
        case "footer":
          success = await contentAPI.saveFooterLinks(footerLinks);
          break;
        case "events":
          success = await eventsAPI.saveEvents(events);
          break;
        case "about":
          success = await aboutAPI.saveAboutContent(aboutContent);
          break;
        case "cards":
          success = await infoCardsAPI.saveInfoCards(infoCards);
          break;
        case "contact":
          success = await contactAPI.saveContactInfo(contactInfo);
          break;
      }

      if (success) {
        setMessage("✅ Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to save changes");
      }
    } catch (error) {
      setMessage(
        "❌ Error: " + (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Admin Login
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Gujarat Ashram Admin Panel
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter password"
                  required
                />
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
              >
                Login
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                ← Back to Main Site
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ADMIN DASHBOARD
  // ═══════════════════════════════════════════════════════════

  const tabs = [
    { id: "menu", label: "Menu", icon: Menu },
    { id: "hero", label: "Hero Buttons", icon: ImageIcon },
    { id: "footer", label: "Footer", icon: Link },
    { id: "events", label: "Events", icon: Calendar },
    { id: "about", label: "About", icon: FileText },
    { id: "cards", label: "Info Cards", icon: Grid3x3 },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "images", label: "Images", icon: Upload },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gujarat Ashram Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all website content from here
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Message */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              message.includes("✅")
                ? "bg-green-100 text-green-700"
                : message.includes("❌")
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border flex-wrap">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <Button
                key={t.id}
                variant={tab === t.id ? "default" : "ghost"}
                onClick={() => setTab(t.id)}
                className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </Button>
            );
          })}
        </div>

        {/* Content Editor */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            {tab === "menu" && <MenuEditor items={menuItems} setItems={setMenuItems} />}
            {tab === "hero" && <HeroEditor items={heroButtons} setItems={setHeroButtons} />}
            {tab === "footer" && <FooterEditor items={footerLinks} setItems={setFooterLinks} />}
            {tab === "events" && <EventsEditor items={events} setItems={setEvents} />}
            {tab === "about" && <AboutEditor content={aboutContent} setContent={setAboutContent} />}
            {tab === "cards" && <InfoCardsEditor items={infoCards} setItems={setInfoCards} />}
            {tab === "contact" && <ContactEditor items={contactInfo} setItems={setContactInfo} />}
            {tab === "images" && (
              <ImageManager
                heroImages={heroImages}
                galleryImages={galleryImages}
                onRefresh={loadAllData}
              />
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        {tab !== "images" && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// EDITOR COMPONENTS
// ═══════════════════════════════════════════════════════════

function MenuEditor({ items, setItems }: EditorProps<MenuItem>) {
    const addItem = () => {
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          name: "New Menu Item",
          url: "https://",
          isSpecial: false,
          variant: "default",
        },
      ]);
    };

    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: string | boolean) => {
      const updated = [...items];
      updated[index] = { ...updated[index], [field]: value };
      setItems(updated);
    };

    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Navigation Menu Items</h2>
        <p className="text-sm text-gray-600 mb-4">
          💡 Toggle "Special" to display as a button instead of a text link
        </p>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={idx} className="border rounded-lg p-3 space-y-2">
              {/* Name and URL inputs */}
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Menu Name"
                  value={item.name}
                  onChange={(e) => updateItem(idx, "name", e.target.value)}
                />
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="URL"
                  value={item.url}
                  onChange={(e) => updateItem(idx, "url", e.target.value)}
                />
                <Button variant="outline" onClick={() => removeItem(idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Special Button Toggle */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isSpecial || false}
                    onChange={(e) => updateItem(idx, "isSpecial", e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Display as Button
                  </span>
                </label>

                {/* Show variant selector only if isSpecial is true */}
                {item.isSpecial && (
                  <select
                    className="px-3 py-1.5 border rounded text-sm"
                    value={item.variant || "default"}
                    onChange={(e) => updateItem(idx, "variant", e.target.value)}
                  >
                    <option value="default">Primary (Amber)</option>
                    <option value="outline">Outline (White Border)</option>
                    <option value="ghost">Ghost (Transparent)</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
        <Button onClick={addItem} variant="outline" className="mt-4 w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Menu Item
        </Button>
      </div>
    );
  }
  
function HeroEditor({ items, setItems }: EditorProps<HeroButton>) {
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: "New Button", url: "https://", variant: "default" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Hero Section Buttons</h2>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Button Text"
              value={item.name}
              onChange={(e) => updateItem(idx, "name", e.target.value)}
            />
            <input
              className="flex-1 px-3 py-2 border rounded"
              placeholder="URL"
              value={item.url}
              onChange={(e) => updateItem(idx, "url", e.target.value)}
            />
            <select
              className="px-3 py-2 border rounded"
              value={item.variant}
              onChange={(e) => updateItem(idx, "variant", e.target.value)}
            >
              <option value="default">Primary</option>
              <option value="outline">Outline</option>
            </select>
            <Button variant="outline" onClick={() => removeItem(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Hero Button
      </Button>
    </div>
  );
}

function FooterEditor({ items, setItems }: EditorProps<FooterLink>) {
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), label: "New Link", url: "https://" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Footer Contact Links</h2>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded"
              placeholder="Label"
              value={item.label}
              onChange={(e) => updateItem(idx, "label", e.target.value)}
            />
            <input
              className="flex-1 px-3 py-2 border rounded"
              placeholder="URL"
              value={item.url}
              onChange={(e) => updateItem(idx, "url", e.target.value)}
            />
            <Button variant="outline" onClick={() => removeItem(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Footer Link
      </Button>
    </div>
  );
}

function EventsEditor({ items, setItems }: EditorProps<Event>) {
  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      title: "New Event",
      date: "Date TBD",
      description: "Event description",
      buttonText: "Register Now",
      buttonUrl: ""
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Event Title"
                  value={item.title}
                  onChange={(e) => updateItem(idx, "title", e.target.value)}
                />
                <Button variant="outline" onClick={() => removeItem(idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Date"
                value={item.date}
                onChange={(e) => updateItem(idx, "date", e.target.value)}
              />
              <textarea
                className="w-full px-3 py-2 border rounded"
                placeholder="Description"
                rows={2}
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Button Text"
                  value={item.buttonText || ""}
                  onChange={(e) => updateItem(idx, "buttonText", e.target.value)}
                />
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Button URL"
                  value={item.buttonUrl || ""}
                  onChange={(e) => updateItem(idx, "buttonUrl", e.target.value)}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Event
      </Button>
    </div>
  );
}

function AboutEditor({ content, setContent }: AboutEditorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About Section</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={content.subtitle || ""}
            onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            rows={6}
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video URL</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={content.videoUrl || ""}
            onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function InfoCardsEditor({ items, setItems }: EditorProps<InfoCard>) {
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), title: "New Feature", description: "Description", icon: "Home" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const iconOptions = ["Home", "Users", "MapPin", "Calendar", "Heart", "Star", "Sun", "Moon"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Info Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border rounded"
                  value={item.icon}
                  onChange={(e) => updateItem(idx, "icon", e.target.value)}
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => updateItem(idx, "title", e.target.value)}
                />
                <Button variant="outline" onClick={() => removeItem(idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <textarea
                className="w-full px-3 py-2 border rounded"
                placeholder="Description"
                rows={2}
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
              />
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Card
      </Button>
    </div>
  );
}

function ContactEditor({ items, setItems }: EditorProps<ContactInfo>) {
  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), type: "phone", label: "New Contact", value: "", url: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const types = ["phone", "email", "whatsapp", "address", "website"];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <select
                className="px-3 py-2 border rounded"
                value={item.type}
                onChange={(e) => updateItem(idx, "type", e.target.value)}
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                className="px-3 py-2 border rounded"
                placeholder="Label"
                value={item.label}
                onChange={(e) => updateItem(idx, "label", e.target.value)}
              />
              <input
                className="px-3 py-2 border rounded"
                placeholder="Value"
                value={item.value}
                onChange={(e) => updateItem(idx, "value", e.target.value)}
              />
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="URL"
                  value={item.url || ""}
                  onChange={(e) => updateItem(idx, "url", e.target.value)}
                />
                <Button variant="outline" onClick={() => removeItem(idx)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Contact
      </Button>
    </div>
  );
}

function ImageManager({ heroImages, galleryImages, onRefresh }: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await imageAPI.uploadImage(file, category);
      onRefresh();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Image Management</h2>

      <div className="mb-8">
        <h3 className="font-medium mb-3">Hero Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {heroImages.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={`http://localhost:4000${img.path}`}
                alt={img.alt || ""}
                className="w-full h-32 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="default"
                className="absolute top-2 right-2"
                onClick={async () => {
                  await imageAPI.deleteImage(img.id);
                  onRefresh();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "hero")}
          disabled={uploading}
          className="mt-3"
        />
      </div>

      <div>
        <h3 className="font-medium mb-3">Gallery Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {galleryImages.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={`http://localhost:4000${img.path}`}
                alt={img.alt || ""}
                className="w-full h-32 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="default"
                className="absolute top-2 right-2"
                onClick={async () => {
                  await imageAPI.deleteImage(img.id);
                  onRefresh();
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e, "gallery")}
          disabled={uploading}
          className="mt-3"
        />
      </div>
    </div>
  );
}

export default AdminDashboard;

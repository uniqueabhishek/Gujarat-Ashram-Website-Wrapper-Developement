// AdminDashboard.tsx - Complete admin panel with TypeScript fixes ONLY (UI unchanged)
import { useEffect, useState, useRef } from "react";
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
  X,
} from "lucide-react";

import {
  authAPI,
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

// Type definitions for props
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
  onSave: () => Promise<void>;
  imagesToDelete: Set<string>;
  setImagesToDelete: React.Dispatch<React.SetStateAction<Set<string>>>;
}

// ============================================
// MAIN ADMIN DASHBOARD COMPONENT
// ============================================

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("menu");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Original content states
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  // New content states
  const [events, setEvents] = useState<Event[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent>({
    id: "default",
    title: "",
    subtitle: "",
    description: "",
  });
  const [infoCards, setInfoCards] = useState<InfoCard[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);

  // Images
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<Set<string>>(new Set());

  // Load all data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

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
      setMessage("âš ï¸ Failed to load some data from server");
    }
  }

  // Save handler for current tab
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
        case "images":
          // Delete marked images
          if (imagesToDelete.size > 0) {
            const deletePromises = Array.from(imagesToDelete).map(id =>
              imageAPI.deleteImage(id)
            );
            await Promise.all(deletePromises);
            setImagesToDelete(new Set());
            await loadAllData();
            success = true;
          } else {
            success = true;
          }
          break;
      }

      if (success) {
        setMessage(" Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(" Failed to save changes");
      }
    } catch (error) {
      setMessage(" Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    // Clear localStorage authentication
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("adminUser");

    // Call backend logout API
    await authAPI.logout();

    // Navigate to login page
    navigate("/login");
  };

  // Tab configuration
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
              message.includes("âœ…")
                ? "bg-green-100 text-green-700"
                : message.includes("âŒ")
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

        {/* Content Editor Panel */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            {/* Menu Items Editor */}
            {tab === "menu" && (
              <MenuEditor items={menuItems} setItems={setMenuItems} />
            )}

            {/* Hero Buttons Editor */}
            {tab === "hero" && (
              <HeroEditor items={heroButtons} setItems={setHeroButtons} />
            )}

            {/* Footer Links Editor */}
            {tab === "footer" && (
              <FooterEditor items={footerLinks} setItems={setFooterLinks} />
            )}

            {/* Events Editor */}
            {tab === "events" && (
              <EventsEditor items={events} setItems={setEvents} />
            )}

            {/* About Content Editor */}
            {tab === "about" && (
              <AboutEditor content={aboutContent} setContent={setAboutContent} />
            )}

            {/* Info Cards Editor */}
            {tab === "cards" && (
              <InfoCardsEditor items={infoCards} setItems={setInfoCards} />
            )}

            {/* Contact Info Editor */}
            {tab === "contact" && (
              <ContactEditor items={contactInfo} setItems={setContactInfo} />
            )}

            {/* Image Manager */}
            {tab === "images" && (
              <ImageManager
                heroImages={heroImages}
                galleryImages={galleryImages}
                onRefresh={loadAllData}
                onSave={handleSave}
                imagesToDelete={imagesToDelete}
                setImagesToDelete={setImagesToDelete}
              />
            )}
          </CardContent>
        </Card>

        {/* Save Button (for all tabs) */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EDITOR COMPONENTS
// ============================================

// Menu Items Editor (existing)
function MenuEditor({ items, setItems }: EditorProps<MenuItem>) {
  const addItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: "New Menu Item",
      url: "https://",
      isSpecial: false,
      variant: "default",
    };
    setItems([...items, newItem]);
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

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-2 p-3 border rounded-lg bg-gray-50">
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
              <Button
                variant="outline"
                size="default"
                onClick={() => removeItem(idx)}
              >
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
                  className="w-4 h-4 text-orange-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Special Button
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

// Hero Buttons Editor (existing)
function HeroEditor({ items, setItems }: EditorProps<HeroButton>) {
  const addItem = () => {
    const newItem: HeroButton = {
      id: Date.now().toString(),
      name: "New Button",
      url: "https://",
      variant: "default",
    };
    setItems([...items, newItem]);
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
            <Button
              variant="outline"
              size="default"
              onClick={() => removeItem(idx)}
            >
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

// Footer Links Editor (existing)
function FooterEditor({ items, setItems }: EditorProps<FooterLink>) {
  const addItem = () => {
    const newItem: FooterLink = {
      id: Date.now().toString(),
      label: "New Link",
      url: "https://",
    };
    setItems([...items, newItem]);
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
            <Button
              variant="outline"
              size="default"
              onClick={() => removeItem(idx)}
            >
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

// NEW: Events Editor
function EventsEditor({ items, setItems }: EditorProps<Event>) {
  const addItem = () => {
    const newItem: Event = {
      id: Date.now().toString(),
      title: "New Event",
      date: "Date TBD",
      description: "Event description here",
      buttonText: "Register Now",
      buttonUrl: "",
    };
    setItems([...items, newItem]);
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
      <p className="text-sm text-gray-600 mb-4">
        Manage events that appear on the homepage
      </p>

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
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <input
                className="w-full px-3 py-2 border rounded"
                placeholder="Date (e.g., Dec 5 - Dec 7, 2025)"
                value={item.date}
                onChange={(e) => updateItem(idx, "date", e.target.value)}
              />

              <textarea
                className="w-full px-3 py-2 border rounded"
                placeholder="Event Description"
                rows={2}
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
              />

              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Button Text"
                  value={item.buttonText || "Register Now"}
                  onChange={(e) => updateItem(idx, "buttonText", e.target.value)}
                />
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Registration URL (optional)"
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

// NEW: About Content Editor
function AboutEditor({ content, setContent }: AboutEditorProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">About Section Content</h2>
      <p className="text-sm text-gray-600 mb-4">
        Edit the main content for the About section
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="Welcome to Gujarat Ashram"
            value={content.title}
            onChange={(e) =>
              setContent({ ...content, title: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Subtitle (optional)
          </label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="A Sanctuary for Inner Peace"
            value={content.subtitle || ""}
            onChange={(e) =>
              setContent({ ...content, subtitle: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Main Description
          </label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter the main about text..."
            rows={6}
            value={content.description}
            onChange={(e) =>
              setContent({ ...content, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Video URL (optional)
          </label>
          <input
            className="w-full px-3 py-2 border rounded"
            placeholder="https://youtube.com/..."
            value={content.videoUrl || ""}
            onChange={(e) =>
              setContent({ ...content, videoUrl: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
}

// NEW: Info Cards Editor
function InfoCardsEditor({ items, setItems }: EditorProps<InfoCard>) {
  const addItem = () => {
    const newItem: InfoCard = {
      id: Date.now().toString(),
      title: "New Feature",
      description: "Description here",
      icon: "Home",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const iconOptions = [
    "Home",
    "Users",
    "MapPin",
    "Calendar",
    "Heart",
    "Star",
    "Sun",
    "Moon",
    "Mountain",
    "Trees",
    "Flower",
    "Coffee",
    "ImageIcon",
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Info Cards / Facilities</h2>
      <p className="text-sm text-gray-600 mb-4">
        Manage the feature cards that appear on the homepage. Colors auto-assign in rotation: Orange → Green → Blue.
      </p>

      {/* Add color preview indicator */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          Card Colors
        </h3>
        <p className="text-sm text-blue-800">
          Cards automatically cycle through colors:
          <span className="inline-flex gap-2 ml-2 mt-1 flex-wrap">
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">1st - Orange</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">2nd - Green</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">3rd - Blue</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">4th - Orange</span>
            <span className="text-xs text-blue-700">etc...</span>
          </span>
        </p>
      </div>

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
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Card Title"
                  value={item.title}
                  onChange={(e) => updateItem(idx, "title", e.target.value)}
                />
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <textarea
                className="w-full px-3 py-2 border rounded"
                placeholder="Card Description"
                rows={2}
                value={item.description}
                onChange={(e) =>
                  updateItem(idx, "description", e.target.value)
                }
              />
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Info Card
      </Button>
    </div>
  );
}

// NEW: Contact Info Editor
function ContactEditor({ items, setItems }: EditorProps<ContactInfo>) {
  const addItem = () => {
    const newItem: ContactInfo = {
      id: Date.now().toString(),
      type: "phone",
      label: "New Contact",
      value: "",
      url: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const typeOptions = [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "address", label: "Address" },
    { value: "map", label: "Map Embed" },
    { value: "website", label: "Website" },
    { value: "other", label: "Other" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
      <p className="text-sm text-gray-600 mb-4">
        Manage contact details shown in the Location & Contact section
      </p>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          💡 How to Configure Contact Information
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li><strong>Address:</strong> Set type to "Address", add your ashram address in the value field</li>
          <li><strong>Phone/WhatsApp:</strong> Add phone numbers with proper tel: or WhatsApp URLs</li>
          <li><strong>Map Embed:</strong> Set type to "Map Embed", paste Google Maps embed URL in the URL field</li>
          <li className="ml-6 text-xs">To get Google Maps embed: Open Google Maps → Share → Embed a map → Copy HTML → Extract the src URL</li>
        </ul>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card key={idx} className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <select
                className="px-3 py-2 border rounded"
                value={item.type}
                onChange={(e) => updateItem(idx, "type", e.target.value)}
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                className="px-3 py-2 border rounded"
                placeholder="Display Label"
                value={item.label}
                onChange={(e) => updateItem(idx, "label", e.target.value)}
              />

              <input
                className="px-3 py-2 border rounded"
                placeholder="Value (phone, email, etc.)"
                value={item.value}
                onChange={(e) => updateItem(idx, "value", e.target.value)}
              />

              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border rounded"
                  placeholder="Link URL (optional)"
                  value={item.url || ""}
                  onChange={(e) => updateItem(idx, "url", e.target.value)}
                />
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => removeItem(idx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addItem} variant="outline" className="mt-4 w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Contact Info
      </Button>
    </div>
  );
}

// Image Manager (Enhanced with preview modal, delete marking, and save functionality)
function ImageManager({
  heroImages,
  galleryImages,
  onRefresh,
  imagesToDelete,
  setImagesToDelete,
}: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Image preview modal state
  const [previewImage, setPreviewImage] = useState<{ url: string; filename: string } | null>(null);

  // Handle file selection and upload immediately
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
    category: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log(`File selected: ${file.name}, Size: ${file.size}, Type: ${file.type}, Category: ${category}`);

    // Check image limit (15 images per category)
    const currentImages = category === "hero" ? heroImages : galleryImages;
    if (currentImages.length >= 15) {
      alert(`Maximum limit of 15 images reached for ${category} category. Please delete some images first.`);
      // Reset file input
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      console.log("Starting upload...");
      const uploaded = await imageAPI.uploadImage(file, category);
      console.log("Upload response:", uploaded);

      if (uploaded) {
        console.log("Upload successful, refreshing images...");
        // Refresh images
        onRefresh();
        // Reset file input
        event.target.value = "";
        alert("Image uploaded successfully!");
      } else {
        console.error("Upload returned null/false");
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  // Mark/unmark image for deletion
  const toggleDeleteMark = (id: string) => {
    setImagesToDelete(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Image Management</h2>

      {/* Hero Images */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Hero Slider Images</h3>
          <span className="text-sm text-gray-600">
            {heroImages.length} / 15 images
          </span>
        </div>

        {/* Existing Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {heroImages.map((img) => {
            const isMarkedForDelete = imagesToDelete.has(img.id);
            return (
              <div
                key={img.id}
                className={`relative group cursor-pointer ${isMarkedForDelete ? 'opacity-50' : ''}`}
                onClick={() => setPreviewImage({ url: `http://localhost:4000${img.path}`, filename: img.filename })}
              >
                <img
                  src={`http://localhost:4000${img.path}`}
                  alt={img.alt || "Hero image"}
                  className={`w-full h-48 object-cover rounded-lg border-2 transition-all ${
                    isMarkedForDelete
                      ? 'border-red-500 grayscale'
                      : 'border-gray-200 group-hover:border-orange-400'
                  }`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg" />

                {/* Delete X button */}
                <button
                  className={`absolute top-2 right-2 transition-opacity z-10 rounded-md px-2 py-1 text-white font-medium ${
                    isMarkedForDelete
                      ? 'opacity-100 bg-green-600 hover:bg-green-700'
                      : 'opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDeleteMark(img.id);
                  }}
                >
                  {isMarkedForDelete ? (
                    <span className="text-xs">Undo</span>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>

                {/* Filename overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {isMarkedForDelete && <span className="text-red-400 font-semibold">MARKED FOR DELETE - </span>}
                  {img.filename}
                </div>
              </div>
            );
          })}
        </div>

        {heroImages.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No hero images uploaded yet</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="mt-4">
          <input
            ref={heroFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "hero")}
            disabled={uploading}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              console.log("Hero upload button clicked");
              console.log("Hero file input ref:", heroFileInputRef.current);
              if (heroFileInputRef.current) {
                heroFileInputRef.current.click();
                console.log("File input click triggered");
              } else {
                console.error("Hero file input ref is null");
              }
            }}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Add Hero Image"}
          </Button>
        </div>
      </div>

      {/* Gallery Images */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Gallery Images</h3>
          <span className="text-sm text-gray-600">
            {galleryImages.length} / 15 images
          </span>
        </div>

        {/* Existing Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {galleryImages.map((img) => {
            const isMarkedForDelete = imagesToDelete.has(img.id);
            return (
              <div
                key={img.id}
                className={`relative group cursor-pointer ${isMarkedForDelete ? 'opacity-50' : ''}`}
                onClick={() => setPreviewImage({ url: `http://localhost:4000${img.path}`, filename: img.filename })}
              >
                <img
                  src={`http://localhost:4000${img.path}`}
                  alt={img.alt || "Gallery image"}
                  className={`w-full h-48 object-cover rounded-lg border-2 transition-all ${
                    isMarkedForDelete
                      ? 'border-red-500 grayscale'
                      : 'border-gray-200 group-hover:border-orange-400'
                  }`}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg" />

                {/* Delete X button */}
                <button
                  className={`absolute top-2 right-2 transition-opacity z-10 rounded-md px-2 py-1 text-white font-medium ${
                    isMarkedForDelete
                      ? 'opacity-100 bg-green-600 hover:bg-green-700'
                      : 'opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-700'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDeleteMark(img.id);
                  }}
                >
                  {isMarkedForDelete ? (
                    <span className="text-xs">Undo</span>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </button>

                {/* Filename overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {isMarkedForDelete && <span className="text-red-400 font-semibold">MARKED FOR DELETE - </span>}
                  {img.filename}
                </div>
              </div>
            );
          })}
        </div>

        {galleryImages.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No gallery images uploaded yet</p>
          </div>
        )}

        {/* Upload Section */}
        <div className="mt-4">
          <input
            ref={galleryFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, "gallery")}
            disabled={uploading}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              console.log("Gallery upload button clicked");
              console.log("Gallery file input ref:", galleryFileInputRef.current);
              if (galleryFileInputRef.current) {
                galleryFileInputRef.current.click();
                console.log("File input click triggered");
              } else {
                console.error("Gallery file input ref is null");
              }
            }}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Add Gallery Image"}
          </Button>
        </div>
      </div>

      {/* Pending Changes Indicator */}
      {imagesToDelete.size > 0 && (
        <div className="mt-6 p-3 bg-amber-50 border-2 border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            ⚠️ {imagesToDelete.size} image(s) marked for deletion. Click "Save Changes" button below to confirm.
          </p>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.filename}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-10 left-0 right-0 text-center text-white text-sm">
              {previewImage.filename}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

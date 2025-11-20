import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Menu, Image as ImageIcon, Link, Upload } from "lucide-react";
import { authAPI, contentAPI, imageAPI, MenuItem, HeroButton, FooterLink, Image } from "@/lib/api";

// ─────────────────────────────────────────
// Admin Dashboard Component
// ─────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("menu");
  const [loading, setLoading] = useState(false);

  // MENU ITEMS
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // HERO BUTTONS
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);

  // FOOTER LINKS
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  // IMAGES
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [menu, hero, footer, heroImgs, galleryImgs] = await Promise.all([
        contentAPI.getMenuItems(),
        contentAPI.getHeroButtons(),
        contentAPI.getFooterLinks(),
        imageAPI.getImagesByCategory("hero"),
        imageAPI.getImagesByCategory("gallery"),
      ]);

      setMenuItems(menu);
      setHeroButtons(hero);
      setFooterLinks(footer);
      setHeroImages(heroImgs);
      setGalleryImages(galleryImgs);
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load data from server");
    }
  }

  async function handleSave() {
    setLoading(true);
    try {
      await Promise.all([
        contentAPI.saveMenuItems(menuItems),
        contentAPI.saveHeroButtons(heroButtons),
        contentAPI.saveFooterLinks(footerLinks),
      ]);
      alert("✅ Changes saved successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Failed to save: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Ashram Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your website content
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
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border flex-wrap">
          <Button
            variant={tab === "menu" ? "default" : "ghost"}
            onClick={() => setTab("menu")}
            className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
          >
            <Menu className="w-4 h-4" />
            Menu
          </Button>

          <Button
            variant={tab === "hero" ? "default" : "ghost"}
            onClick={() => setTab("hero")}
            className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
          >
            <ImageIcon className="w-4 h-4" />
            Hero Buttons
          </Button>

          <Button
            variant={tab === "footer" ? "default" : "ghost"}
            onClick={() => setTab("footer")}
            className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
          >
            <Link className="w-4 h-4" />
            Footer
          </Button>

          <Button
            variant={tab === "images" ? "default" : "ghost"}
            onClick={() => setTab("images")}
            className="flex-1 flex items-center justify-center gap-2 min-w-[120px]"
          >
            <Upload className="w-4 h-4" />
            Images
          </Button>
        </div>

        {/* Editor Panel */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            {tab === "menu" && (
              <MenuEditor items={menuItems} setItems={setMenuItems} />
            )}

            {tab === "hero" && (
              <HeroEditor items={heroButtons} setItems={setHeroButtons} />
            )}

            {tab === "footer" && (
              <FooterEditor items={footerLinks} setItems={setFooterLinks} />
            )}

            {tab === "images" && (
              <ImageManager
                heroImages={heroImages}
                galleryImages={galleryImages}
                onRefresh={loadData}
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
              {loading ? "Saving..." : "💾 Save All Changes"}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

// ─────────────────────────────────────────
// MENU EDITOR
// ─────────────────────────────────────────
interface EditorProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
}

function MenuEditor({ items, setItems }: EditorProps<MenuItem>) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Menu Items</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage navigation menu items that appear in the header
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: MenuItem, idx: number) => (
          <Card key={idx} className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Menu Name
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Meditation Hall"
                    value={item.name}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      setItems(copy);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    URL
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com"
                    value={item.url}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setItems(copy);
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setItems(items.filter((_: MenuItem, i: number) => i !== idx))}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    🗑️ Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-dashed border-2 hover:border-orange-500 hover:bg-orange-50"
        onClick={() =>
          setItems([...items, { id: Date.now().toString(), name: "New Item", url: "https://" }])
        }
      >
        + Add Menu Item
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────
// HERO BUTTONS EDITOR
// ─────────────────────────────────────────
function HeroEditor({ items, setItems }: EditorProps<HeroButton>) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Hero Section Buttons</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage call-to-action buttons in the hero section
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: HeroButton, idx: number) => (
          <Card key={idx} className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Button Text
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Visit Ashram"
                    value={item.name}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], name: e.target.value };
                      setItems(copy);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    URL
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com"
                    value={item.url}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setItems(copy);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Button Style
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={item.variant}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], variant: e.target.value };
                      setItems(copy);
                    }}
                  >
                    <option value="default">Primary (Orange)</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost (Transparent)</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setItems(items.filter((_: HeroButton, i: number) => i !== idx))}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    🗑️ Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-dashed border-2 hover:border-orange-500 hover:bg-orange-50"
        onClick={() =>
          setItems([...items, { id: Date.now().toString(), name: "New Button", url: "https://", variant: "default" }])
        }
      >
        + Add Hero Button
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────
// FOOTER LINKS EDITOR
// ─────────────────────────────────────────
function FooterEditor({ items, setItems }: EditorProps<FooterLink>) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Footer Links</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage contact links that appear in the footer
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: FooterLink, idx: number) => (
          <Card key={idx} className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Label
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Call, Email, WhatsApp"
                    value={item.label}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], label: e.target.value };
                      setItems(copy);
                    }}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    URL
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="tel:+919876543210, mailto:email@example.com"
                    value={item.url}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx] = { ...copy[idx], url: e.target.value };
                      setItems(copy);
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setItems(items.filter((_: FooterLink, i: number) => i !== idx))}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    🗑️ Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-4 w-full border-dashed border-2 hover:border-orange-500 hover:bg-orange-50"
        onClick={() =>
          setItems([...items, { id: Date.now().toString(), label: "New Link", url: "https://" }])
        }
      >
        + Add Footer Link
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────
// IMAGE MANAGER
// ─────────────────────────────────────────
interface ImageManagerProps {
  heroImages: Image[];
  galleryImages: Image[];
  onRefresh: () => void;
}

function ImageManager({ heroImages, galleryImages, onRefresh }: ImageManagerProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Image Management</h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload and manage images for hero slider and gallery
        </p>
      </div>

      <div className="space-y-8">
        {/* Hero Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Hero Slider Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {heroImages.map((image: Image) => (
              <div key={image.id} className="relative group">
                <img
                  src={`http://localhost:4000${image.path}`}
                  alt={image.filename}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                    {image.filename}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {heroImages.length === 0 && (
            <p className="text-gray-400 text-center py-8">No hero images uploaded yet</p>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Gallery Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image: Image) => (
              <div key={image.id} className="relative group">
                <img
                  src={`http://localhost:4000${image.path}`}
                  alt={image.filename}
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                  <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                    {image.filename}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {galleryImages.length === 0 && (
            <p className="text-gray-400 text-center py-8">No gallery images uploaded yet</p>
          )}
        </div>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>💡 Image upload functionality requires backend API implementation</p>
          <Button variant="outline" onClick={onRefresh} className="mt-4">
            🔄 Refresh Images
          </Button>
        </div>
      </div>
    </div>
  );
}

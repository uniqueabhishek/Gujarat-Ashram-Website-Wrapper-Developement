import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Menu, Image as ImageIcon, Link, Upload, Save, Trash2, X, Lock } from "lucide-react";
import { contentAPI, imageAPI, MenuItem, HeroButton, FooterLink, Image } from "@/lib/api";

// ─────────────────────────────────────────
// HARDCODED CREDENTIALS - CHANGE THESE
// ─────────────────────────────────────────
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// ─────────────────────────────────────────
// Admin Dashboard Component with Built-in Auth
// ─────────────────────────────────────────
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

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

  // New images to upload
  const [newHeroImages, setNewHeroImages] = useState<Array<{id: number, file: File, url: string, saved: boolean}>>([]);
  const [newGalleryImages, setNewGalleryImages] = useState<Array<{id: number, file: File, url: string, saved: boolean}>>([]);

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("adminAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setLoginError("");
      loadData();
    } else {
      setLoginError("Invalid username or password");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setLoginForm({ username: "", password: "" });
  };

  // Load data from backend
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

  // Image file selection handler
  const handleImageSelect = (category: 'hero' | 'gallery', event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        // Fixed: Added null check for e.target
        if (e.target && e.target.result) {
          const newImage = {
            id: Date.now(),
            file: file,
            url: e.target.result as string,
            saved: false
          };

          if (category === 'hero') {
            setNewHeroImages([...newHeroImages, newImage]);
          } else {
            setNewGalleryImages([...newGalleryImages, newImage]);
          }
        }
      };

      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // Save individual image
  const handleSaveImage = async (category: 'hero' | 'gallery', id: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('category', category);

      // Fixed: Check if uploadImage method exists
      if ('uploadImage' in imageAPI && typeof imageAPI.uploadImage === 'function') {
        await imageAPI.uploadImage(formData);
      } else {
        throw new Error("uploadImage method not implemented in imageAPI");
      }

      if (category === 'hero') {
        setNewHeroImages(newHeroImages.map(img =>
          img.id === id ? { ...img, saved: true } : img
        ));
      } else {
        setNewGalleryImages(newGalleryImages.map(img =>
          img.id === id ? { ...img, saved: true } : img
        ));
      }

      alert("✅ Image saved successfully!");
      setTimeout(() => loadData(), 500);

    } catch (error) {
      console.error("Failed to save image:", error);
      alert("Failed to save image. Please try again.");
    }
  };

  // Remove new image before saving
  const handleRemoveNewImage = (category: 'hero' | 'gallery', id: number) => {
    if (category === 'hero') {
      setNewHeroImages(newHeroImages.filter(img => img.id !== id));
    } else {
      setNewGalleryImages(newGalleryImages.filter(img => img.id !== id));
    }
  };

  // Delete saved image from server
  const handleDeleteSavedImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // Fixed: Check if deleteImage method exists
      if ('deleteImage' in imageAPI && typeof imageAPI.deleteImage === 'function') {
        await imageAPI.deleteImage(imageId);
      } else {
        throw new Error("deleteImage method not implemented in imageAPI");
      }
      alert("✅ Image deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  // ─────────────────────────────────────────
  // LOGIN SCREEN (Shown when not authenticated)
  // ─────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Access</h1>
              <p className="text-gray-500">Enter credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 text-center">
                  {loginError}
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium"
              >
                Login to Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // ADMIN DASHBOARD (Shown when authenticated)
  // ─────────────────────────────────────────
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
                newHeroImages={newHeroImages}
                newGalleryImages={newGalleryImages}
                onImageSelect={handleImageSelect}
                onSaveImage={handleSaveImage}
                onRemoveNewImage={handleRemoveNewImage}
                onDeleteSavedImage={handleDeleteSavedImage}
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
  newHeroImages: Array<{id: number, file: File, url: string, saved: boolean}>;
  newGalleryImages: Array<{id: number, file: File, url: string, saved: boolean}>;
  onImageSelect: (category: 'hero' | 'gallery', event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveImage: (category: 'hero' | 'gallery', id: number, file: File) => void;
  onRemoveNewImage: (category: 'hero' | 'gallery', id: number) => void;
  onDeleteSavedImage: (imageId: string) => void;
  onRefresh: () => void;
}

function ImageManager({
  heroImages,
  galleryImages,
  newHeroImages,
  newGalleryImages,
  onImageSelect,
  onSaveImage,
  onRemoveNewImage,
  onDeleteSavedImage,
  onRefresh
}: ImageManagerProps) {
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

          {/* Saved Images */}
          {heroImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Saved Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {heroImages.map((image: Image) => (
                  <div key={image.id} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:4000${image.path}`}
                      alt={image.filename}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                      <Button
                        variant="destructive"
                        onClick={() => onDeleteSavedImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 p-2 truncate bg-white">
                      {image.filename}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images to Upload */}
          {newHeroImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">New Images (Not saved yet):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {newHeroImages.map((img) => (
                  <div key={img.id} className="border-2 border-orange-300 rounded-lg p-3">
                    <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
                      <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-2">{img.file.name}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onSaveImage('hero', img.id, img.file)}
                        disabled={img.saved}
                        className={`flex-1 ${img.saved ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {img.saved ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onRemoveNewImage('hero', img.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <label className="cursor-pointer inline-block">
            <div className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 w-fit">
              <Upload className="w-4 h-4" />
              Select Hero Image
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageSelect('hero', e)}
              className="hidden"
            />
          </label>

          {heroImages.length === 0 && newHeroImages.length === 0 && (
            <p className="text-gray-400 text-center py-8">No hero images uploaded yet</p>
          )}
        </div>

        {/* Gallery Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Gallery Images</h3>

          {/* Saved Images */}
          {galleryImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Saved Images:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((image: Image) => (
                  <div key={image.id} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:4000${image.path}`}
                      alt={image.filename}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                      <Button
                        variant="destructive"
                        onClick={() => onDeleteSavedImage(image.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 p-2 truncate bg-white">
                      {image.filename}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images to Upload */}
          {newGalleryImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">New Images (Not saved yet):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {newGalleryImages.map((img) => (
                  <div key={img.id} className="border-2 border-orange-300 rounded-lg p-3">
                    <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
                      <img src={img.url} alt={img.file.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-2">{img.file.name}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onSaveImage('gallery', img.id, img.file)}
                        disabled={img.saved}
                        className={`flex-1 ${img.saved ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}
                      >
                        <Save className="w-3 h-3 mr-1" />
                        {img.saved ? 'Saved' : 'Save'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onRemoveNewImage('gallery', img.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <label className="cursor-pointer inline-block">
            <div className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 w-fit">
              <Upload className="w-4 h-4" />
              Select Gallery Image
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onImageSelect('gallery', e)}
              className="hidden"
            />
          </label>

          {galleryImages.length === 0 && newGalleryImages.length === 0 && (
            <p className="text-gray-400 text-center py-8">No gallery images uploaded yet</p>
          )}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={onRefresh} className="mt-4">
            🔄 Refresh Images
          </Button>
        </div>
      </div>
    </div>
  );
}

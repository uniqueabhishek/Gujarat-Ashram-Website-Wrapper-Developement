import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Menu, Image, Link } from "lucide-react";

// ─────────────────────────────────────────
// LocalStorage helpers
// ─────────────────────────────────────────
function load(key: string, fallback: any) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function save(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─────────────────────────────────────────
// Admin Dashboard Component
// ─────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState("menu");

  // MENU ITEMS
  const [menuItems, setMenuItems] = React.useState(() =>
    load("aol_menu_items", [
      { name: "Meditation Hall", url: "https://example.com" },
      { name: "Programs", url: "https://example.com" },
    ])
  );

  // HERO BUTTONS
  const [heroButtons, setHeroButtons] = React.useState(() =>
    load("hero_buttons", [
      { name: "Visit Ashram", url: "https://example.com", variant: "default" },
      { name: "Upcoming Programs", url: "https://example.com", variant: "outline" },
      { name: "Contact", url: "https://example.com", variant: "ghost" },
    ])
  );

  // FOOTER LINKS
  const [footerLinks, setFooterLinks] = React.useState(() =>
    load("footer_links", [
      { label: "Call", url: "tel:+910000000000" },
      { label: "WhatsApp", url: "https://wa.me/910000000000" },
      { label: "Email", url: "mailto:info@example.com" },
      { label: "Map", url: "https://maps.google.com" },
    ])
  );

  function handleSave() {
    save("aol_menu_items", menuItems);
    save("hero_buttons", heroButtons);
    save("footer_links", footerLinks);
    alert("✅ Changes saved successfully! Refresh the main site to see updates.");
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
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
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border">
          <Button
            variant={tab === "menu" ? "default" : "ghost"}
            onClick={() => setTab("menu")}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Menu className="w-4 h-4" />
            Menu Items
          </Button>

          <Button
            variant={tab === "hero" ? "default" : "ghost"}
            onClick={() => setTab("hero")}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Image className="w-4 h-4" />
            Hero Buttons
          </Button>

          <Button
            variant={tab === "footer" ? "default" : "ghost"}
            onClick={() => setTab("footer")}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Link className="w-4 h-4" />
            Footer Links
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
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-center">
          <Button
            size="lg"
            onClick={handleSave}
            className="px-8 bg-orange-500 hover:bg-orange-600"
          >
            💾 Save All Changes
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;

// ─────────────────────────────────────────
// MENU EDITOR
// ─────────────────────────────────────────
function MenuEditor({ items, setItems }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Menu Items</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage navigation menu items that appear in the header
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: any, idx: number) => (
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
                      copy[idx].name = e.target.value;
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
                      copy[idx].url = e.target.value;
                      setItems(copy);
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}
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
          setItems([...items, { name: "New Item", url: "https://" }])
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
function HeroEditor({ items, setItems }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Hero Section Buttons</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage call-to-action buttons in the hero section
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: any, idx: number) => (
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
                      copy[idx].name = e.target.value;
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
                      copy[idx].url = e.target.value;
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
                      copy[idx].variant = e.target.value;
                      setItems(copy);
                    }}
                  >
                    <option value="default">Solid (Default)</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost (Minimal)</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}
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
          setItems([...items, { name: "New Button", url: "https://", variant: "default" }])
        }
      >
        + Add Button
      </Button>
    </div>
  );
}

// ─────────────────────────────────────────
// FOOTER LINKS EDITOR
// ─────────────────────────────────────────
function FooterEditor({ items, setItems }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Footer Links</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage contact links in the footer section
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item: any, idx: number) => (
          <Card key={idx} className="border-2 hover:border-orange-200 transition-colors">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Link Label
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., WhatsApp, Email, Map"
                    value={item.label}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx].label = e.target.value;
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
                    placeholder="tel:+91, mailto:, https://"
                    value={item.url}
                    onChange={(e) => {
                      const copy = [...items];
                      copy[idx].url = e.target.value;
                      setItems(copy);
                    }}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}
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
          setItems([...items, { label: "New Link", url: "https://" }])
        }
      >
        + Add Link
      </Button>
    </div>
  );
}

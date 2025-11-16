import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    alert("Saved successfully! Refresh main site.");
  }

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-8 py-10">
      <div className="max-w-4xl mx-auto">

        {/* TITLE & LOGOUT */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Ashram Website — Admin Dashboard
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-4 mb-6">
          <Button variant={tab === "menu" ? "default" : "outline"} onClick={() => setTab("menu")}>
            Menu
          </Button>

          <Button variant={tab === "hero" ? "default" : "outline"} onClick={() => setTab("hero")}>
            Hero Buttons
          </Button>

          <Button variant={tab === "footer" ? "default" : "outline"} onClick={() => setTab("footer")}>
            Footer Links
          </Button>
        </div>

        {/* PANEL */}
        <Card className="p-4">
          <CardContent>
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

        {/* SAVE BUTTON */}
        <div className="mt-6 text-center">
          <Button className="px-6 py-3" onClick={handleSave}>
            Save All Changes
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
      <h2 className="text-xl font-semibold mb-4">Menu Items</h2>

      {items.map((item: any, idx: number) => (
        <div key={idx} className="mb-4 border p-3 rounded-lg bg-white shadow-sm">
          <input
            className="border p-2 w-full mb-2"
            placeholder="Name"
            value={item.name}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].name = e.target.value;
              setItems(copy);
            }}
          />

          <input
            className="border p-2 w-full"
            placeholder="URL"
            value={item.url}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].url = e.target.value;
              setItems(copy);
            }}
          />

          <div className="text-right mt-2">
            <Button
              variant="ghost"
              onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
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
      <h2 className="text-xl font-semibold mb-4">Hero Buttons</h2>

      {items.map((item: any, idx: number) => (
        <div key={idx} className="mb-4 border p-3 rounded-lg bg-white shadow-sm">

          <input
            className="border p-2 w-full mb-2"
            placeholder="Button Name"
            value={item.name}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].name = e.target.value;
              setItems(copy);
            }}
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="URL"
            value={item.url}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].url = e.target.value;
              setItems(copy);
            }}
          />

          <select
            className="border p-2 w-full"
            value={item.variant}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].variant = e.target.value;
              setItems(copy);
            }}
          >
            <option value="default">Default</option>
            <option value="outline">Outline</option>
            <option value="ghost">Ghost</option>
          </select>

          <div className="text-right mt-2">
            <Button
              variant="ghost"
              onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}
            >
              Remove
            </Button>
          </div>

        </div>
      ))}

      <Button
        variant="outline"
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
      <h2 className="text-xl font-semibold mb-4">Footer Links</h2>

      {items.map((item: any, idx: number) => (
        <div key={idx} className="mb-4 border p-3 rounded-lg bg-white shadow-sm">

          <input
            className="border p-2 w-full mb-2"
            placeholder="Label (WhatsApp, Email…)"
            value={item.label}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].label = e.target.value;
              setItems(copy);
            }}
          />

          <input
            className="border p-2 w-full"
            placeholder="URL"
            value={item.url}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].url = e.target.value;
              setItems(copy);
            }}
          />

          <div className="text-right mt-2">
            <Button
              variant="ghost"
              onClick={() => setItems(items.filter((_: any, i: number) => i !== idx))}
            >
              Remove
            </Button>
          </div>

        </div>
      ))}

      <Button
        variant="outline"
        onClick={() =>
          setItems([...items, { label: "New Link", url: "https://" }])
        }
      >
        + Add Link
      </Button>
    </div>
  );
}

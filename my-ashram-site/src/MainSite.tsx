import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Home,
  Users,
  Image as ImageIcon,
  Phone,
  Mail,
  Navigation as NavigationIcon,
  Menu,
  X,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";

// ✅ Backend API Integration
import { contentAPI, imageAPI, contactAPI, MenuItem, HeroButton, FooterLink, Image, ContactInfo } from "@/lib/api";

const API_BASE = "http://localhost:4000";

export default function MainSite() {
  // ✅ State for backend data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Original UI state
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Load content from backend
  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      console.log("MainSite: Loading content from backend...");
      const [menu, hero, footer, contact, heroImgs, galleryImgs] = await Promise.all([
        contentAPI.getMenuItems(),
        contentAPI.getHeroButtons(),
        contentAPI.getFooterLinks(),
        contactAPI.getContactInfo(),
        imageAPI.getImagesByCategory("hero"),
        imageAPI.getImagesByCategory("gallery"),
      ]);

      console.log("MainSite: Hero images received:", heroImgs);
      console.log("MainSite: Gallery images received:", galleryImgs);

      // ✅ SIMPLIFIED: API already returns correct type
      setMenuItems(menu.length > 0 ? menu : [
        { id: "1", name: "Meditation Hall", url: "https://example.com", isSpecial: false, variant: "default" },
        { id: "2", name: "Programs", url: "https://example.com", isSpecial: false, variant: "default" }
      ]);

      setHeroButtons(hero.length > 0 ? hero : [
        { id: "1", name: "Visit Ashram", url: "https://example.com", variant: "default" },
        { id: "2", name: "Upcoming Programs", url: "https://example.com", variant: "outline" },
        { id: "3", name: "Contact", url: "https://example.com", variant: "ghost" }
      ]);

      setFooterLinks(footer.length > 0 ? footer : [
        { id: "1", label: "Call", url: "tel:+910000000000" },
        { id: "2", label: "WhatsApp", url: "https://wa.me/910000000000" },
        { id: "3", label: "Email", url: "mailto:info@example.com" },
        { id: "4", label: "Map", url: "https://maps.google.com" }
      ]);

      setContactInfo(contact.length > 0 ? contact : [
        { id: "1", type: "address", label: "Address", value: "Vasad, Gujarat 388306, India", url: "" },
        { id: "2", type: "phone", label: "Call", value: "+91 98765 43210", url: "tel:+919876543210" },
        { id: "3", type: "whatsapp", label: "WhatsApp", value: "+91 98765 43210", url: "https://wa.me/919876543210" },
        { id: "4", type: "email", label: "Email", value: "info@example.com", url: "mailto:info@example.com" },
        { id: "5", type: "other", label: "Map", value: "View on Map", url: "https://maps.google.com" }
      ]);

      setHeroImages(heroImgs);
      setGalleryImages(galleryImgs);
      console.log("MainSite: Content loaded successfully");
    } catch (error) {
      console.error("Failed to load content:", error);
      // Set fallback data
      setMenuItems([
        { id: "1", name: "Meditation Hall", url: "https://example.com", isSpecial: false, variant: "default" },
        { id: "2", name: "Programs", url: "https://example.com", isSpecial: false, variant: "default" }
      ]);
      setHeroButtons([
        { id: "1", name: "Visit Ashram", url: "https://example.com", variant: "default" },
        { id: "2", name: "Upcoming Programs", url: "https://example.com", variant: "outline" },
        { id: "3", name: "Contact", url: "https://example.com", variant: "ghost" }
      ]);
      setFooterLinks([
        { id: "1", label: "Call", url: "tel:+910000000000" },
        { id: "2", label: "WhatsApp", url: "https://wa.me/910000000000" },
        { id: "3", label: "Email", url: "mailto:info@example.com" },
        { id: "4", label: "Map", url: "https://maps.google.com" }
      ]);
      setContactInfo([
        { id: "1", type: "address", label: "Address", value: "Vasad, Gujarat 388306, India", url: "" },
        { id: "2", type: "phone", label: "Call", value: "+91 98765 43210", url: "tel:+919876543210" },
        { id: "3", type: "whatsapp", label: "WhatsApp", value: "+91 98765 43210", url: "https://wa.me/919876543210" },
        { id: "4", type: "email", label: "Email", value: "info@example.com", url: "mailto:info@example.com" },
        { id: "5", type: "other", label: "Map", value: "View on Map", url: "https://maps.google.com" }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Original scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Display images with fallback
  const HERO_IMAGES = heroImages.length > 0
    ? heroImages.map(img => {
        const url = `${API_BASE}${img.path}`;
        console.log(`MainSite: Hero image URL: ${url}`);
        return url;
      })
    : [
        "/images/ashram-hero1.jpg",
        "/images/ashram-hero2.jpg",
        "/images/ashram-hero3.jpg"
      ];

  const GALLERY = galleryImages.length > 0
    ? galleryImages.map(img => {
        const url = `${API_BASE}${img.path}`;
        console.log(`MainSite: Gallery image URL: ${url}`);
        return url;
      })
    : [
        "/images/meditation-hall.jpg",
        "/images/nature-walk.jpg",
        "/images/group-session.jpg",
        "/images/accommodation.jpg"
      ];

  console.log("MainSite: HERO_IMAGES array:", HERO_IMAGES);
  console.log("MainSite: Using fallback?", heroImages.length === 0);

  const EVENTS = [
    {
      id: "e1",
      title: "Happiness Program — Weekend Batch",
      date: "Dec 5 - Dec 7, 2025",
      desc: "A weekend immersion in breathing and mindfulness."
    },
    {
      id: "e2",
      title: "Sudarshan Kriya Workshop",
      date: "Jan 10, 2026",
      desc: "Guided practice with certified instructors."
    },
    {
      id: "e3",
      title: "Silence Retreat",
      date: "Feb 14 - Feb 20, 2026",
      desc: "Deep reflective retreat in nature."
    }
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Gujarat Ashram...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ashram-sand text-ashram-stone selection:bg-ashram-amber selection:text-white">

      {/* TOP NAVIGATION BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className={`font-serif font-bold text-2xl tracking-tight ${isScrolled ? 'text-ashram-clay' : 'text-white'}`}>
            Gujarat Ashram
          </div>

            {/* Desktop Menu */}
    <div className="hidden md:flex gap-8 items-center">
    {menuItems.map((item: MenuItem, i: number) => {
        // ✅ If item is marked as "special", render as Button
        if (item.isSpecial) {
        // Determine button styling based on variant and scroll state
        let buttonClassName = "";
        let buttonVariant: "default" | "outline" | "ghost" | "secondary" = "default";

        if (item.variant === "outline") {
            buttonVariant = "outline";
            buttonClassName = isScrolled
            ? "border-ashram-stone text-ashram-stone hover:bg-ashram-stone hover:text-white"
            : "border-white/40 text-white hover:bg-white hover:text-ashram-clay";
        } else if (item.variant === "ghost") {
            buttonVariant = "ghost";
            buttonClassName = isScrolled
            ? "text-ashram-stone hover:bg-ashram-stone/10"
            : "text-white hover:bg-white/10";
        } else {
            // default variant (primary amber button)
            buttonVariant = isScrolled ? "default" : "secondary";
            buttonClassName = isScrolled
            ? "bg-ashram-amber hover:bg-ashram-amber/90 text-white"
            : "bg-white text-ashram-clay hover:bg-white/90";
        }

        return (
            <Button
            key={i}
            variant={buttonVariant}
            className={buttonClassName}
            onClick={() => window.open(item.url, "_blank")}
            >
            {item.name}
            </Button>
        );
        }

        // ✅ Otherwise, render as regular text link (preserves original UI)
        return (
        <button
            key={i}
            className={`text-sm font-medium tracking-wide hover:text-ashram-amber transition-colors ${
            isScrolled ? 'text-ashram-stone' : 'text-white/90 hover:text-white'
            }`}
            onClick={() => window.open(item.url, "_blank")}
        >
            {item.name}
        </button>
        );
    })}
    </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={isScrolled ? "text-ashram-stone" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-ashram-stone" : "text-white"} />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-ashram-sand absolute w-full shadow-lg overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                {menuItems.map((item: MenuItem, i: number) => {
                  // ✅ Render special items as buttons in mobile menu too
                  if (item.isSpecial) {
                    return (
                      <Button
                        key={i}
                        variant={item.variant === "outline" ? "outline" : item.variant === "ghost" ? "ghost" : "default"}
                        className="w-full"
                        onClick={() => window.open(item.url, "_blank")}
                      >
                        {item.name}
                      </Button>
                    );
                  }

                  // ✅ Regular menu items stay as text links
                  return (
                    <button
                      key={i}
                      className="text-left text-ashram-stone font-medium py-2 border-b border-ashram-sand"
                      onClick={() => window.open(item.url, "_blank")}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <header className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Swiper
            modules={[EffectFade, Autoplay, Navigation, Pagination]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            navigation={false}
            pagination={{ clickable: true, dynamicBullets: true }}
            loop
            className="h-full w-full"
          >
            {HERO_IMAGES.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform scale-105 animate-slow-zoom"
                    style={{
                      backgroundImage: `url(${src})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="relative z-10 h-full flex items-center justify-center text-center px-6">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-2 mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm uppercase tracking-wider"
            >
              Welcome to Serenity
            </motion.div>

            <motion.h1
              className="font-serif font-bold text-white mb-6 drop-shadow-lg text-5xl md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              Art of Living <br />
              <span className="italic text-ashram-amber">Gujarat Ashram</span>
            </motion.h1>

            <motion.p
              className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Discover a sanctuary for inner peace, ancient wisdom, and holistic rejuvenation amidst nature's embrace.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {heroButtons.map((btn: HeroButton, i: number) => {
                let variant: "default" | "outline" | "ghost" = "default";
                let className = "";

                if (btn.variant === "outline") {
                  variant = "outline";
                  className = "border-white/40 text-white hover:bg-white hover:text-ashram-clay";
                } else if (btn.variant === "ghost") {
                  variant = "ghost";
                  className = "text-white hover:bg-white/10";
                } else {
                  variant = "default";
                  className = "bg-ashram-amber hover:bg-ashram-amber/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-1";
                }

                return (
                  <Button
                    key={i}
                    size="lg"
                    variant={variant}
                    className={`px-8 py-6 rounded-full transition-all ${className}`}
                    onClick={() => window.open(btn.url, "_blank")}
                  >
                    {btn.name}
                  </Button>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="h-12 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </motion.div>
      </header>

      <main>
        {/* INFO CARDS */}
        <section className="px-6 -mt-20 relative z-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: "Ashram Overview",
                desc: "Spreading happiness through yoga, meditation, and seva in a pristine environment.",
                color: "bg-orange-50",
                iconColor: "text-orange-500"
              },
              {
                icon: Users,
                title: "Activities & Programs",
                desc: "Join Sudarshan Kriya, silence retreats, and community service projects.",
                color: "bg-green-50",
                iconColor: "text-green-500"
              },
              {
                icon: ImageIcon,
                title: "Facilities",
                desc: "Comfortable accommodation, sattvic dining, lush gardens, and meditation halls.",
                color: "bg-blue-50",
                iconColor: "text-blue-500"
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all border-none overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-ashram-amber to-transparent w-0 group-hover:w-full transition-all duration-500" />
                    <CardContent className="p-8 text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${card.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 ${card.iconColor}`} />
                      </div>
                      <h3 className="font-serif font-bold text-xl mb-3 text-ashram-clay">{card.title}</h3>
                      <p className="text-ashram-stone/70 leading-relaxed">{card.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ABOUT & GALLERY */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">Discover</span>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-ashram-clay mt-2 mb-6">
                Why Visit the <br />Gujarat Ashram?
              </h3>
              <p className="text-ashram-stone/70 text-lg leading-relaxed mb-8">
                Experience a calm environment filled with wisdom and transformative meditation practices.
                Our programs are designed for all levels, from beginners to advanced practitioners, providing
                a path to inner silence and outer dynamism.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {GALLERY.map((src, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden shadow-md aspect-[4/3]"
                  >
                    <img
                      src={src}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      alt={`Gallery ${i + 1}`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Modern Location Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-ashram-sand/30 to-white shadow-2xl border border-ashram-amber/20">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-ashram-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-100/50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-ashram-amber to-orange-400 rounded-2xl shadow-lg">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl font-bold text-ashram-clay">Get in Touch</h3>
                      <p className="text-ashram-stone/60 text-sm mt-1">We're here to help you on your journey</p>
                    </div>
                  </div>

                  {/* Address Section - Enhanced */}
                  {contactInfo.filter((info) => info.type === "address").map((address) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-ashram-amber/10 hover:border-ashram-amber/30 transition-all hover:shadow-lg group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl group-hover:scale-110 transition-transform">
                          <NavigationIcon className="w-6 h-6 text-ashram-amber" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-ashram-clay mb-1 flex items-center gap-2">
                            {address.label}
                            <span className="text-xs px-2 py-1 bg-ashram-amber/10 text-ashram-amber rounded-full font-medium">Primary</span>
                          </h4>
                          <p className="text-ashram-stone leading-relaxed">{address.value}</p>
                          {address.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-3 text-ashram-amber hover:text-ashram-clay hover:bg-ashram-amber/10 gap-2"
                              onClick={() => window.open(address.url, "_blank")}
                            >
                              <NavigationIcon className="w-4 h-4" />
                              Get Directions
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Contact Methods Grid - Modern Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactInfo
                      .filter((info) => info.type !== "address" && info.type !== "map")
                      .map((contact: ContactInfo, idx: number) => {
                        const iconConfig: Record<string, {
                          Icon: React.ComponentType<{ className?: string }>,
                          gradient: string,
                          bgGradient: string
                        }> = {
                          phone: {
                            Icon: Phone,
                            gradient: "from-blue-500 to-blue-600",
                            bgGradient: "from-blue-50 to-blue-100"
                          },
                          whatsapp: {
                            Icon: Phone,
                            gradient: "from-green-500 to-green-600",
                            bgGradient: "from-green-50 to-green-100"
                          },
                          email: {
                            Icon: Mail,
                            gradient: "from-purple-500 to-purple-600",
                            bgGradient: "from-purple-50 to-purple-100"
                          },
                          website: {
                            Icon: NavigationIcon,
                            gradient: "from-orange-500 to-orange-600",
                            bgGradient: "from-orange-50 to-orange-100"
                          },
                          other: {
                            Icon: NavigationIcon,
                            gradient: "from-gray-500 to-gray-600",
                            bgGradient: "from-gray-50 to-gray-100"
                          }
                        };

                        const config = iconConfig[contact.type] || iconConfig.other;
                        const Icon = config.Icon;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group cursor-pointer"
                            onClick={() => window.open(contact.url || "#", "_blank")}
                          >
                            <div className="h-full p-5 bg-white rounded-xl border-2 border-transparent hover:border-ashram-amber/30 shadow-md hover:shadow-xl transition-all">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 bg-gradient-to-br ${config.bgGradient} rounded-xl group-hover:scale-110 transition-transform`}>
                                  <Icon className={`w-5 h-5 ${contact.type === 'whatsapp' ? 'text-green-600' : contact.type === 'phone' ? 'text-blue-600' : contact.type === 'email' ? 'text-purple-600' : 'text-orange-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold text-ashram-stone/60 uppercase tracking-wider mb-1">
                                    {contact.label}
                                  </p>
                                  <p className="font-medium text-ashram-clay truncate group-hover:text-ashram-amber transition-colors">
                                    {contact.value}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-ashram-stone/30 group-hover:text-ashram-amber group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Google Maps Embed - Modern Frame */}
              {(() => {
                const mapInfo = contactInfo.find((info) => info.type === "map");
                const mapUrl = mapInfo?.url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.123456789!2d72.123456!3d23.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA3JzI0LjQiTiA3MsKwMDcnMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890";

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-ashram-amber to-orange-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white">
                      <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200">
                        {mapUrl.includes('google.com/maps') ? (
                          <iframe
                            src={mapUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl mb-4">
                              <MapPin className="w-12 h-12 text-ashram-amber mx-auto" />
                            </div>
                            <p className="text-ashram-stone font-medium mb-2">Map View</p>
                            <p className="text-sm text-ashram-stone/60 max-w-xs">
                              Configure Google Maps embed URL in Admin Dashboard → Contact section
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Map Overlay Label */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-sm font-semibold text-ashram-clay mb-1">📍 Find Us Here</p>
                        <p className="text-xs text-ashram-stone/70">Click to explore the map and get directions</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </motion.div>
          </div>
        </section>

        {/* EVENTS */}
        <section className="py-20 px-6 bg-ashram-sand/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">Calendar</span>
                <h3 className="font-serif text-4xl font-bold text-ashram-clay mt-2">Upcoming Events</h3>
              </div>
              <Button variant="ghost" className="text-ashram-amber hover:text-ashram-clay hover:bg-ashram-amber/10 gap-2">
                View All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {EVENTS.map((ev) => (
                <motion.div
                  key={ev.id}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden group">
                    <div className="h-2 bg-ashram-amber w-0 group-hover:w-full transition-all duration-500" />
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 text-ashram-amber font-medium text-sm mb-4 bg-ashram-amber/10 w-fit px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {ev.date}
                      </div>
                      <h4 className="font-serif font-bold text-xl mb-3 text-ashram-clay group-hover:text-ashram-amber transition-colors">
                        {ev.title}
                      </h4>
                      <p className="text-ashram-stone/70 mb-6 leading-relaxed">
                        {ev.desc}
                      </p>

                      <Button className="w-full bg-ashram-stone text-white hover:bg-ashram-clay transition-colors">
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-ashram-stone text-ashram-sand pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            <div className="col-span-1 md:col-span-2">
              <h4 className="font-serif font-bold text-3xl mb-6 text-white">Gujarat Ashram</h4>
              <p className="text-ashram-sand/70 text-lg leading-relaxed max-w-md mb-8">
                A sanctuary for peace, meditation, and spiritual growth in the heart of Gujarat.
                Open to all, serving all.
              </p>
              <div className="flex gap-4">
                {/* Social Icons placeholders */}
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/10 hover:bg-ashram-amber transition-colors cursor-pointer flex items-center justify-center">
                    <div className="w-5 h-5 bg-white/50 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
              <div className="space-y-3">
                {menuItems.map((item: MenuItem, i: number) => (
                  <button
                    key={i}
                    className="block text-ashram-sand/70 hover:text-ashram-amber transition-colors text-left"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    {item.name}
                  </button>
                ))}
                <button className="block text-ashram-sand/70 hover:text-ashram-amber transition-colors text-left">
                  Donate
                </button>
                <button className="block text-ashram-sand/70 hover:text-ashram-amber transition-colors text-left">
                  Volunteer
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
              <div className="space-y-4">
                {footerLinks.map((link: FooterLink, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-ashram-sand/70 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-ashram-amber" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ashram-sand/50">
            <div>
              © {new Date().getFullYear()} Art of Living Gujarat Ashram. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

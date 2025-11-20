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

// TypeScript interfaces
interface HeroButton {
  name: string;
  url: string;
  variant: string;
}

interface MenuItem {
  name: string;
  url: string;
}

interface FooterLink {
  label: string;
  url: string;
}

// Load Hero Buttons from localStorage
function useHeroButtons() {
  const [buttons] = React.useState<HeroButton[]>(() => {
    const saved = localStorage.getItem("hero_buttons");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Visit Ashram", url: "https://example.com", variant: "default" },
          { name: "Upcoming Programs", url: "https://example.com", variant: "outline" },
          { name: "Contact", url: "https://example.com", variant: "ghost" }
        ];
  });

  return buttons;
}

// Load Top Menu from localStorage
function useMenu() {
  const [items] = React.useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("aol_menu_items");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Meditation Hall", url: "https://example.com" },
          { name: "Programs", url: "https://example.com" }
        ];
  });

  return items;
}

// Load Footer Links from localStorage
function useFooterLinks() {
  const [links] = React.useState<FooterLink[]>(() => {
    const saved = localStorage.getItem("footer_links");
    return saved
      ? JSON.parse(saved)
      : [
          { label: "Call", url: "tel:+910000000000" },
          { label: "WhatsApp", url: "https://wa.me/910000000000" },
          { label: "Email", url: "mailto:info@example.com" },
          { label: "Map", url: "https://maps.google.com" }
        ];
  });

  return links;
}

export default function MainSite() {
  const heroButtons = useHeroButtons();
  const menuItems = useMenu();
  const footerLinks = useFooterLinks();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const HERO_IMAGES = [
    "/images/ashram-hero1.jpg",
    "/images/ashram-hero2.jpg",
    "/images/ashram-hero3.jpg"
  ];

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

  const GALLERY = [
    "/images/meditation-hall.jpg",
    "/images/nature-walk.jpg",
    "/images/group-session.jpg",
    "/images/accommodation.jpg"
  ];

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
            {menuItems.map((item: MenuItem, i: number) => (
              <button
                key={i}
                className={`text-sm font-medium tracking-wide hover:text-ashram-amber transition-colors ${
                  isScrolled ? 'text-ashram-stone' : 'text-white/90 hover:text-white'
                }`}
                onClick={() => window.open(item.url, "_blank")}
              >
                {item.name}
              </button>
            ))}
            <Button
              variant={isScrolled ? "default" : "secondary"}
              className={isScrolled ? "bg-ashram-amber hover:bg-ashram-amber/90" : "bg-white text-ashram-clay hover:bg-white/90"}
            >
              Donate
            </Button>
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
                {menuItems.map((item: MenuItem, i: number) => (
                  <button
                    key={i}
                    className="text-left text-ashram-stone font-medium py-2 border-b border-ashram-sand"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    {item.name}
                  </button>
                ))}
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

        {/* HERO TEXT */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-xs font-medium tracking-wider uppercase mb-6 border border-white/30">
              Welcome to Serenity
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight drop-shadow-lg">
              Art of Living <br />
              <span className="text-ashram-amber italic">Gujarat Ashram</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90 mb-10 font-light">
              Discover a sanctuary for inner peace, ancient wisdom, and holistic rejuvenation amidst nature's embrace.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {heroButtons.map((btn: HeroButton, idx: number) => (
                <Button
                  key={idx}
                  variant={btn.variant === "default" ? "default" : "outline"}
                  onClick={() => window.open(btn.url, "_blank")}
                  className={`px-8 py-6 text-base rounded-full transition-all duration-300 ${
                    btn.variant === "default"
                      ? "bg-ashram-amber hover:bg-ashram-amber/90 text-white shadow-lg hover:shadow-ashram-amber/40 hover:-translate-y-1"
                      : "bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-ashram-clay"
                  }`}
                >
                  {btn.name}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/70"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </motion.div>
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* INFO CARDS */}
        <section className="relative z-20 -mt-20 px-6 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: "Ashram Overview",
                desc: "Spreading happiness through yoga, meditation, and seva in a pristine environment.",
                color: "text-ashram-amber",
                bg: "bg-orange-50"
              },
              {
                icon: Users,
                title: "Activities & Programs",
                desc: "Join Sudarshan Kriya, silence retreats, and community service projects.",
                color: "text-ashram-green",
                bg: "bg-green-50"
              },
              {
                icon: ImageIcon,
                title: "Facilities",
                desc: "Comfortable accommodation, sattvic dining, lush gardens, and meditation halls.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full border-none shadow-xl bg-white/95 backdrop-blur hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  <div className={`h-1 w-full ${item.bg.replace('bg-', 'bg-gradient-to-r from-transparent via-').replace('50', '500')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${item.bg} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-3 text-ashram-clay">{item.title}</h3>
                    <p className="text-ashram-stone/80 leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHY VISIT + GALLERY */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">Discover</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-ashram-clay mt-2">
                Why Visit the <br/>Gujarat Ashram?
              </h2>
              <p className="text-lg leading-relaxed text-ashram-stone/80 mb-8">
                Experience a calm environment filled with wisdom and transformative meditation practices.
                Our programs are designed for all levels, from beginners to advanced practitioners, providing a path to inner silence and outer dynamism.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {GALLERY.map((src, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
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
              className="space-y-8"
            >
              <div className="bg-ashram-sand/50 p-8 rounded-3xl border border-ashram-amber/10">
                <h3 className="font-serif text-2xl font-bold mb-6 text-ashram-clay flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-ashram-amber" />
                  Location & Contact
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                      <NavigationIcon className="w-5 h-5 text-ashram-clay" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ashram-stone">Address</h4>
                      <p className="text-ashram-stone/70">Vasad, Gujarat 388306, India</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {footerLinks.map((link: FooterLink, idx: number) => {
                      const icons: Record<string, any> = {
                        Call: Phone,
                        WhatsApp: Phone,
                        Email: Mail,
                        Map: NavigationIcon
                      };
                      const Icon = icons[link.label] || NavigationIcon;

                      return (
                        <Button
                          key={idx}
                          variant="outline"
                          className="flex items-center justify-start gap-3 h-auto py-3 px-4 bg-white border-ashram-amber/20 hover:border-ashram-amber hover:bg-ashram-amber/5 text-ashram-clay"
                          onClick={() => window.open(link.url, "_blank")}
                        >
                          <Icon className="w-4 h-4 text-ashram-amber" />
                          {link.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
                 {/* Placeholder for map */}
                 <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Google Map Embed</p>
                 </div>
              </div>
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

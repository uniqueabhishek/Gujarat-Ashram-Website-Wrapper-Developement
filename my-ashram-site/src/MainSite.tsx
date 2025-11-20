import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Home,
  Users,
  Image as ImageIcon,
  Phone,
  Mail,
  Navigation as NavigationIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";

import { contentAPI, imageAPI, MenuItem, HeroButton, FooterLink, Image } from "@/lib/api";

const API_BASE = "http://localhost:4000";

export default function MainSite() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [heroImages, setHeroImages] = useState<Image[]>([]);
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
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
      console.error("Failed to load content:", error);
    } finally {
      setLoading(false);
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 text-neutral-900">

      {/* TOP NAVIGATION BAR */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/40 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-white font-bold text-xl">
            Gujarat Ashram
          </div>
          <div className="flex gap-6">
            {menuItems.map((item: MenuItem, i: number) => (
              <button
                key={i}
                className="text-white text-sm font-medium hover:text-amber-200 transition-colors"
                onClick={() => window.open(item.url, "_blank")}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative overflow-hidden h-[600px]">
        <div className="absolute inset-0">
          {heroImages.length > 0 ? (
            <Swiper
              modules={[EffectFade, Autoplay, Navigation, Pagination]}
              effect="fade"
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation
              pagination={{ clickable: true }}
              loop
              className="h-full w-full"
            >
              {heroImages.map((image: Image) => (
                <SwiperSlide key={image.id}>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${API_BASE}${image.path})`,
                      filter: 'brightness(0.7)'
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-600" />
          )}
        </div>

        {/* HERO TEXT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold drop-shadow-2xl mb-6">
              Art of Living
            </h1>
            <p className="text-xl sm:text-2xl font-light mb-2 drop-shadow-lg">
              Gujarat Ashram
            </p>
            <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed opacity-90 mb-10">
              A space for inner peace, wisdom, and rejuvenation
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              {heroButtons.map((btn: HeroButton, idx: number) => (
                <Button
                  key={idx}
                  variant={btn.variant === "default" || btn.variant === "outline" || btn.variant === "ghost" ? btn.variant : "default"}
                  onClick={() => window.open(btn.url, "_blank")}
                  className="px-8 py-6 text-base shadow-xl hover:scale-105 transition-transform"
                >
                  {btn.name}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-amber-50 to-transparent" />
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* INFO CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-32 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-lg">
                    <Home className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Ashram Overview</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Spreading happiness through yoga, meditation, and seva
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Users className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Activities & Programs</h3>
                    <ul className="text-sm space-y-1 text-neutral-600">
                      <li>• Sudarshan Kriya</li>
                      <li>• Meditation retreats</li>
                      <li>• Yoga sessions</li>
                      <li>• Seva projects</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg hover:shadow-xl transition-shadow bg-white/95 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-sky-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Facilities</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Accommodation • Dining • Gardens • Meditation spaces
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* WHY VISIT + GALLERY */}
        <section className="bg-white p-8 rounded-2xl shadow-lg mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            <div>
              <h2 className="text-3xl font-bold mb-4 text-neutral-800">
                Why Visit the Gujarat Ashram?
              </h2>
              <p className="text-base leading-relaxed text-neutral-600 mb-6">
                Experience a calm environment filled with wisdom and transformative meditation practices.
                Our programs are designed for all levels, from beginners to advanced practitioners.
              </p>

              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.slice(0, 4).map((image: Image) => (
                    <motion.img
                      key={image.id}
                      whileHover={{ scale: 1.05 }}
                      src={`${API_BASE}${image.path}`}
                      className="rounded-xl shadow-md h-40 w-full object-cover cursor-pointer"
                      alt={image.filename}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No gallery images yet</p>
                </div>
              )}
            </div>

            <div>
              <Card className="shadow-lg border-2 border-amber-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl flex items-center gap-3 mb-4">
                    <MapPin className="w-6 h-6 text-amber-600" />
                    Location & Contact
                  </h3>

                  <p className="text-neutral-700 mb-6">
                    Ahmedabad, Gujarat — India
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {footerLinks.map((link: FooterLink, idx: number) => {
                      const icons: Record<string, typeof Phone | typeof Mail | typeof NavigationIcon> = {
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
                          className="flex items-center gap-2"
                          onClick={() => window.open(link.url, "_blank")}
                        >
                          <Icon className="w-4 h-4" />
                          {link.label}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </section>

        {/* EVENTS */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-7 h-7 text-amber-600" />
            <h3 className="text-2xl font-bold text-neutral-800">Upcoming Events</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EVENTS.map((ev) => (
              <motion.div
                key={ev.id}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-2">{ev.title}</h4>
                    <p className="text-sm text-amber-600 font-medium mb-3">{ev.date}</p>
                    <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{ev.desc}</p>

                    <Button className="w-full bg-amber-500 hover:bg-amber-600">
                      Register Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div>
              <h4 className="font-bold text-xl mb-4">Gujarat Ashram</h4>
              <p className="text-amber-100 text-sm leading-relaxed">
                A sanctuary for peace, meditation, and spiritual growth in the heart of Gujarat.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <div className="space-y-2">
                {menuItems.map((item: MenuItem, i: number) => (
                  <button
                    key={i}
                    className="block text-amber-100 hover:text-white text-sm transition-colors"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <div className="space-y-3">
                {footerLinks.map((footerLink: FooterLink, idx: number) => (
                  <a
                    key={idx}
                    href={footerLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-amber-100 hover:text-white text-sm transition-colors"
                  >
                    → {footerLink.label}
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-amber-700 mt-8 pt-6 text-center text-amber-200 text-sm">
            © {new Date().getFullYear()} Art of Living Gujarat Ashram. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

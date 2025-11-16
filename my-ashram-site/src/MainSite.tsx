import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Home,
  Users,
  Image as ImageIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";

// Load Hero Buttons from localStorage
function useHeroButtons() {
  const [buttons, setButtons] = React.useState(() => {
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
  const [items] = React.useState(() => {
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

export default function MainSite() {
  const heroButtons = useHeroButtons();
  const menuItems = useMenu();

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
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50 text-neutral-900">

      {/* TOP RIGHT MENU */}
      <div className="absolute top-4 right-6 z-50 text-white flex gap-4">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className="text-lg font-semibold hover:underline"
            onClick={() => window.open(item.url, "_blank")}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* HERO SECTION */}
      <header className="relative overflow-hidden h-[480px]">
        <div className="absolute inset-0">
          <Swiper
            modules={[EffectFade, Autoplay, Navigation, Pagination]}
            effect="fade"
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation
            pagination={{ clickable: true }}
            loop
            className="h-full w-full"
          >
            {HERO_IMAGES.map((src, i) => (
              <SwiperSlide key={i}>
                <div
                  className="w-full h-full bg-cover bg-center filter brightness-75"
                  style={{ backgroundImage: `url(${src})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* HERO TEXT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold drop-shadow-md"
          >
            Art of Living — Gujarat Ashram
          </motion.h1>

          <p className="mt-4 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            A space for inner peace, wisdom, and rejuvenation.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            {heroButtons.map((btn, idx) => (
              <Button
                key={idx}
                variant={btn.variant as any}
                onClick={() => window.open(btn.url, "_blank")}
                className="px-6 py-3 rounded-2xl shadow"
              >
                {btn.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-24 bg-gradient-to-b from-transparent to-amber-50" />
      </header>

      {/* REST OF UI (info cards, gallery, events)… */}
      {/* (kept exactly same, no changes) */}

      {/* INFO CARDS */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-12">
          <Card>
            <CardContent className="flex items-start gap-4">
              <Home className="w-8 h-8 text-amber-600" />
              <div>
                <h3 className="font-semibold text-lg">Ashram Overview</h3>
                <p className="mt-1 text-sm text-neutral-600">Spreading happiness through yoga, meditation, and seva.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4">
              <Users className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="font-semibold text-lg">Activities & Programs</h3>
                <ul className="mt-1 text-sm list-disc list-inside text-neutral-600">
                  <li>Sudarshan Kriya</li>
                  <li>Meditation retreats</li>
                  <li>Yoga sessions</li>
                  <li>Seva projects</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4">
              <ImageIcon className="w-8 h-8 text-sky-600" />
              <div>
                <h3 className="font-semibold text-lg">Facilities</h3>
                <p className="mt-1 text-sm text-neutral-600">Accommodation • Dining • Gardens • Meditation spaces</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* WHY VISIT + GALLERY */}
        <section className="mt-10 bg-white p-6 rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">

            <div>
              <h2 className="text-2xl font-bold">Why Visit the Gujarat Ashram?</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                Calm environment, wisdom, meditation experiences — programs for all levels.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {GALLERY.map((src, i) => (
                  <img key={i} src={src} className="rounded-lg shadow-sm h-28 w-full object-cover" />
                ))}
              </div>
            </div>

            <div>
              <Card className="p-4">
                <CardContent>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Location & Directions
                  </h3>

                  <p className="mt-2 text-sm text-neutral-600">Ahmedabad, Gujarat — India</p>

                  <div className="mt-4 flex gap-3">
                    <Button>Navigate</Button>
                    <Button variant="outline">Call</Button>
                    <Button variant="ghost">WhatsApp</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </section>

        {/* EVENTS */}
        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-600" /> Upcoming Events
          </h3>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {EVENTS.map((ev) => (
              <motion.div
                key={ev.id}
                whileHover={{ scale: 1.02 }}
                className="min-w-[260px] bg-white rounded-2xl shadow p-4"
              >
                <h4 className="font-semibold">{ev.title}</h4>
                <p className="text-sm text-neutral-600 mt-1">{ev.date}</p>
                <p className="text-sm mt-2">{ev.desc}</p>

                <div className="mt-4">
                  <Button className="w-full">Register Now</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

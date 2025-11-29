// ═══════════════════════════════════════════════════════════════════════════
// IMPORTS SECTION - Bringing in all the tools and libraries we need
// ═══════════════════════════════════════════════════════════════════════════

// React is the main library that lets us build user interfaces with components
// useState = lets us store and update data (like a notepad for the app)
// useEffect = lets us run code when the page loads or when something changes
import React, { useEffect, useState } from "react";

// Framer Motion = Animation library that makes things move smoothly on screen
// motion = wraps regular HTML elements to make them animate
// AnimatePresence = helps show/hide elements with smooth animations
import { motion, AnimatePresence } from "framer-motion";

// Lucide-react = Icon library (gives us pretty icons like phone, email, menu, etc.)
// Each import below is a different icon we'll use throughout the website
import {
  MapPin,           // Map location pin icon
  Calendar,         // Calendar icon for events
  Home,             // House icon
  Users,            // People icon
  Image as ImageIcon, // Picture icon (renamed to avoid conflict with HTML img)
  Phone,            // Phone icon
  Mail,             // Email envelope icon
  Navigation as NavigationIcon, // Compass/navigation icon
  Menu,             // Hamburger menu icon (three lines)
  X,                // Close/X icon for closing mobile menu
  ArrowRight        // Right arrow icon
} from "lucide-react";

// Our custom UI components (pre-built reusable pieces)
// Button = Clickable button component with different styles
// Card & CardContent = Container components for organizing content nicely
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Swiper = Image slider/carousel library (for slideshow of images)
// Swiper = Main component for creating the slider
// SwiperSlide = Wrapper for each individual slide/image
import { Swiper, SwiperSlide } from "swiper/react";

// CSS files for Swiper styling (makes the slider look good)
import "swiper/css";                    // Base Swiper styles
import "swiper/css/effect-fade";        // Fade transition effect styles
import "swiper/css/navigation";         // Arrow navigation styles
import "swiper/css/pagination";         // Dots/pagination styles

// Swiper modules = Extra features we want to add to our slider
// EffectFade = Makes slides fade in/out instead of sliding
// Autoplay = Automatically moves to next slide
// Navigation = Adds left/right arrow buttons
// Pagination = Adds dots at bottom to show which slide you're on
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";

// ✅ BACKEND CONNECTION - Functions to talk to our database
// contentAPI = Functions to get menu items, buttons, links from database
// imageAPI = Functions to get images from database
// MenuItem, HeroButton, FooterLink, Image = TypeScript "shapes" that tell us what data looks like
import { contentAPI, imageAPI, MenuItem, HeroButton, FooterLink, Image } from "@/lib/api";

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION - Settings and constants
// ═══════════════════════════════════════════════════════════════════════════

// API_BASE = The web address where our backend server is running
// localhost:4000 means it's running on your own computer on port 4000
const API_BASE = "http://localhost:4000";

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT - The entire website starts here
// ═══════════════════════════════════════════════════════════════════════════

export default function MainSite() {

  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ STATE MANAGEMENT - Variables that can change and trigger re-renders │
  // └─────────────────────────────────────────────────────────────────────┘

  // ✅ BACKEND DATA STATE - Data coming from our database
  // These start empty [] and get filled when we load data from the server

  // menuItems = List of navigation menu links (Home, Programs, etc.)
  // useState<MenuItem[]>([]) means:
  //   - It's an array of MenuItem objects
  //   - It starts empty []
  //   - setMenuItems is the function to update this data
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // heroButtons = Buttons shown on the main hero section (Visit Ashram, Contact, etc.)
  const [heroButtons, setHeroButtons] = useState<HeroButton[]>([]);

  // footerLinks = Contact links in the footer (Call, WhatsApp, Email, Map)
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  // heroImages = Main slideshow images at the top of the page
  const [heroImages, setHeroImages] = useState<Image[]>([]);

  // galleryImages = Images shown in the gallery section
  const [galleryImages, setGalleryImages] = useState<Image[]>([]);

  // loading = True while fetching data, False when done
  // Used to show a "Loading..." spinner while data is being fetched
  const [loading, setLoading] = useState(true);

  // ✅ UI STATE - Controls how the page looks and behaves

  // isScrolled = Has the user scrolled down the page?
  // Changes the navigation bar appearance when you scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // mobileMenuOpen = Is the mobile menu currently open?
  // Controls showing/hiding the menu on mobile phones
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ EFFECTS - Code that runs automatically at certain times             │
  // └─────────────────────────────────────────────────────────────────────┘

  // ✅ LOAD CONTENT WHEN PAGE FIRST OPENS
  // useEffect with empty [] means "run this once when the page loads"
  useEffect(() => {
    loadContent(); // Call our function to fetch data from backend
  }, []); // Empty [] = only run once when component mounts

  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ LOAD CONTENT FUNCTION - Fetches all data from backend              │
  // └─────────────────────────────────────────────────────────────────────┘

  // async = This function takes time to complete (waits for server responses)
  async function loadContent() {
    try {
      // Promise.all = Run multiple requests at the same time (faster!)
      // Instead of waiting for each one individually, we fetch everything together
      // This is like ordering multiple items at once instead of one by one
      const [menu, hero, footer, heroImgs, galleryImgs] = await Promise.all([
        contentAPI.getMenuItems(),                      // Get menu items
        contentAPI.getHeroButtons(),                    // Get hero buttons
        contentAPI.getFooterLinks(),                    // Get footer links
        imageAPI.getImagesByCategory("hero"),           // Get hero images
        imageAPI.getImagesByCategory("gallery"),        // Get gallery images
      ]);

      // ✅ SET MENU ITEMS WITH FALLBACK
      // If database has menu items (menu.length > 0), use them
      // Otherwise use default/example menu items
      // This ensures the website always shows something even if database is empty
      setMenuItems(menu.length > 0 ? menu : [
        { id: "1", name: "Meditation Hall", url: "https://example.com", isSpecial: false, variant: "default" },
        { id: "2", name: "Programs", url: "https://example.com", isSpecial: false, variant: "default" }
      ]);

      // ✅ SET HERO BUTTONS WITH FALLBACK
      // Same logic: Use database buttons if available, otherwise use defaults
      setHeroButtons(hero.length > 0 ? hero : [
        { id: "1", name: "Visit Ashram", url: "https://example.com", variant: "default" },
        { id: "2", name: "Upcoming Programs", url: "https://example.com", variant: "outline" },
        { id: "3", name: "Contact", url: "https://example.com", variant: "ghost" }
      ]);

      // ✅ SET FOOTER LINKS WITH FALLBACK
      setFooterLinks(footer.length > 0 ? footer : [
        { id: "1", label: "Call", url: "tel:+910000000000" },
        { id: "2", label: "WhatsApp", url: "https://wa.me/910000000000" },
        { id: "3", label: "Email", url: "mailto:info@example.com" },
        { id: "4", label: "Map", url: "https://maps.google.com" }
      ]);

      // ✅ SET IMAGES (no fallback needed as we have fallback in the display section)
      setHeroImages(heroImgs);
      setGalleryImages(galleryImgs);

    } catch (error) {
      // If anything goes wrong (server down, network error, etc.), we catch it here
      console.error("Failed to load content:", error); // Print error to browser console for debugging

      // Set fallback data so the website still works even if backend fails
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
    } finally {
      // finally = This always runs, whether try succeeded or catch caught an error
      // Stop showing loading spinner because we're done (either succeeded or failed)
      setLoading(false);
    }
  }

  // ✅ SCROLL DETECTION - Watch when user scrolls and update navigation bar
  useEffect(() => {
    // This function runs every time the user scrolls
    const handleScroll = () => {
      // window.scrollY = how many pixels user has scrolled from top
      // If scrolled more than 50 pixels, set isScrolled to true
      setIsScrolled(window.scrollY > 50);
    };

    // addEventListener = Tell browser to run handleScroll whenever user scrolls
    window.addEventListener("scroll", handleScroll);

    // Return a cleanup function that removes the listener when component unmounts
    // This prevents memory leaks (important for good performance)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty [] means this effect only sets up once

  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ IMAGE DATA PREPARATION - Prepare images for display                │
  // └─────────────────────────────────────────────────────────────────────┘

  // ✅ HERO IMAGES (Main slideshow at top)
  // If we have images from database, create full URLs by adding server address
  // Example: "/uploads/hero1.jpg" becomes "http://localhost:4000/uploads/hero1.jpg"
  // .map() = Loop through each image and transform it
  const HERO_IMAGES = heroImages.length > 0
    ? heroImages.map(img => `${API_BASE}${img.path}`)
    : [
        // Fallback images if database has none
        "/images/ashram-hero1.jpg",
        "/images/ashram-hero2.jpg",
        "/images/ashram-hero3.jpg"
      ];

  // ✅ GALLERY IMAGES (Gallery section images)
  // Same logic as hero images
  const GALLERY = galleryImages.length > 0
    ? galleryImages.map(img => `${API_BASE}${img.path}`)
    : [
        // Fallback images if database has none
        "/images/meditation-hall.jpg",
        "/images/nature-walk.jpg",
        "/images/group-session.jpg",
        "/images/accommodation.jpg"
      ];

  // ✅ EVENTS DATA (Currently hardcoded, will be from database later)
  // This is an array of event objects
  // Each event has: id, title, date, and description
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

  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ LOADING STATE - Show spinner while fetching data                   │
  // └─────────────────────────────────────────────────────────────────────┘

  // If still loading data from server, show this loading screen
  if (loading) {
    return (
      // Full-screen container with gradient background
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          {/* Spinning circle animation */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          {/* Loading text */}
          <p className="text-gray-600 text-lg">Loading Gujarat Ashram...</p>
        </div>
      </div>
    );
  }

  // ┌─────────────────────────────────────────────────────────────────────┐
  // │ MAIN WEBSITE RENDER - The actual website HTML structure            │
  // └─────────────────────────────────────────────────────────────────────┘

  return (
    // Main container for entire website
    // Tailwind classes explained:
    // min-h-screen = At least as tall as the screen
    // bg-ashram-sand = Custom background color (light beige)
    // text-ashram-stone = Custom text color (dark brown)
    // selection:bg-ashram-amber = When you select text, highlight color is amber
    <div className="min-h-screen bg-ashram-sand text-ashram-stone selection:bg-ashram-amber selection:text-white">

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TOP NAVIGATION BAR - Sticky header that changes when scrolling */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3"    // Scrolled style: white, blurred, shadow
            : "bg-transparent py-6"                             // Not scrolled: transparent
        }`}
      >
        {/* Container for navigation content */}
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

          {/* ──────────────────────────────────────────────────────────── */}
          {/* LOGO/BRAND NAME - Changes color based on scroll state       */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className={`font-serif font-bold text-2xl tracking-tight ${isScrolled ? 'text-ashram-clay' : 'text-white'}`}>
            Gujarat Ashram
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* DESKTOP MENU - Only visible on medium+ screens (md:flex)    */}
          {/* ──────────────────────────────────────────────────────────── */}
          <div className="hidden md:flex gap-8 items-center">
            {/* Loop through each menu item from database/fallback */}
            {menuItems.map((item: MenuItem, i: number) => {

              // ✅ CHECK IF THIS IS A "SPECIAL" MENU ITEM (rendered as button)
              if (item.isSpecial) {
                // Variables to store button styling
                let buttonClassName = "";
                let buttonVariant: "default" | "outline" | "ghost" | "secondary" = "default";

                // ▸ OUTLINE VARIANT - Button with border, no fill
                if (item.variant === "outline") {
                  buttonVariant = "outline";
                  buttonClassName = isScrolled
                    ? "border-ashram-stone text-ashram-stone hover:bg-ashram-stone hover:text-white"    // Scrolled
                    : "border-white/40 text-white hover:bg-white hover:text-ashram-clay";              // Not scrolled
                }
                // ▸ GHOST VARIANT - Minimal button, background appears on hover
                else if (item.variant === "ghost") {
                  buttonVariant = "ghost";
                  buttonClassName = isScrolled
                    ? "text-ashram-stone hover:bg-ashram-stone/10"     // Scrolled
                    : "text-white hover:bg-white/20";                  // Not scrolled
                }
                // ▸ DEFAULT VARIANT - Solid filled button
                else {
                  buttonVariant = "default";
                  buttonClassName = isScrolled
                    ? "bg-ashram-stone text-white hover:bg-ashram-clay"        // Scrolled
                    : "bg-white text-ashram-clay hover:bg-ashram-sand";        // Not scrolled
                }

                // Render the menu item as a Button component
                return (
                  <Button
                    key={i}                              // Unique key for React list
                    variant={buttonVariant}              // Button style variant
                    className={buttonClassName}          // Custom classes for colors
                    onClick={() => window.open(item.url, "_blank")}  // Open link in new tab when clicked
                  >
                    {item.name}                          {/* Display button text */}
                  </Button>
                );
              }

              // ✅ REGULAR MENU ITEM (rendered as simple link)
              return (
                <button
                  key={i}
                  onClick={() => window.open(item.url, "_blank")}
                  className={`font-medium transition-colors duration-200 ${
                    isScrolled
                      ? "text-ashram-stone hover:text-ashram-amber"    // Scrolled: dark text
                      : "text-white hover:text-ashram-amber"           // Not scrolled: white text
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* MOBILE MENU BUTTON - Only visible on small screens          */}
          {/* ──────────────────────────────────────────────────────────── */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}  // Toggle menu open/closed
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? 'text-ashram-clay' : 'text-white'
            }`}
          >
            {/* Show X icon if menu is open, Menu icon if closed */}
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* MOBILE MENU DROPDOWN - Slides in when menu button clicked   */}
        {/* ──────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {/* Only render mobile menu if mobileMenuOpen is true */}
          {mobileMenuOpen && (
            <motion.div
              // Animation when menu appears
              initial={{ opacity: 0, height: 0 }}      // Start invisible and collapsed
              animate={{ opacity: 1, height: "auto" }} // Fade in and expand
              exit={{ opacity: 0, height: 0 }}         // Fade out and collapse when closing
              transition={{ duration: 0.2 }}           // Animation takes 0.2 seconds
              className="md:hidden bg-white shadow-lg overflow-hidden"  // Only show on mobile
            >
              <div className="px-6 py-4 space-y-2">
                {/* Loop through menu items and display them vertically */}
                {menuItems.map((item: MenuItem, i: number) => {

                  // ✅ SPECIAL MENU ITEMS (as buttons)
                  if (item.isSpecial) {
                    let buttonVariant: "default" | "outline" | "ghost" | "secondary" = "default";
                    let buttonClassName = "w-full justify-start"; // Full width, text aligned left

                    // Set button style based on variant
                    if (item.variant === "outline") {
                      buttonVariant = "outline";
                      buttonClassName += " border-ashram-stone text-ashram-stone hover:bg-ashram-stone hover:text-white";
                    } else if (item.variant === "ghost") {
                      buttonVariant = "ghost";
                      buttonClassName += " text-ashram-stone hover:bg-ashram-stone/10";
                    } else {
                      buttonVariant = "default";
                      buttonClassName += " bg-ashram-stone text-white hover:bg-ashram-clay";
                    }

                    return (
                      <Button
                        key={i}
                        variant={buttonVariant}
                        className={buttonClassName}
                        onClick={() => {
                          window.open(item.url, "_blank");    // Open link
                          setMobileMenuOpen(false);           // Close mobile menu after clicking
                        }}
                      >
                        {item.name}
                      </Button>
                    );
                  }

                  // ✅ REGULAR MENU ITEMS (as text buttons)
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        window.open(item.url, "_blank");
                        setMobileMenuOpen(false);             // Close menu after clicking
                      }}
                      className="block w-full text-left py-2 text-ashram-stone hover:text-ashram-amber transition-colors font-medium"
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA - All page sections go here                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <main>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* HERO SECTION - Large image slider at the top of the page     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="relative h-screen w-full overflow-hidden">

          {/* ▸ IMAGE SLIDER COMPONENT - Using Swiper library */}
          <Swiper
            // Configuration for the slider
            modules={[EffectFade, Autoplay, Navigation, Pagination]}  // Features to enable
            effect="fade"                    // Images fade in/out instead of sliding
            loop={true}                      // When reaching last image, loop back to first
            autoplay={{
              delay: 5000,                   // Wait 5 seconds before auto-advancing
              disableOnInteraction: false    // Keep auto-playing even after user interaction
            }}
            navigation={true}                // Show left/right arrow buttons
            pagination={{ clickable: true }} // Show dots at bottom (clickable to jump to slide)
            className="h-full w-full"        // Make slider fill entire container
          >
            {/* Loop through hero images and create a slide for each */}
            {HERO_IMAGES.map((src, i) => (
              <SwiperSlide key={i}>
                {/* Image container with dark overlay */}
                <div className="relative h-full w-full">
                  {/* The actual image */}
                  <img
                    src={src}
                    className="absolute inset-0 w-full h-full object-cover"  // Cover entire area
                    alt={`Ashram Hero ${i + 1}`}
                  />
                  {/* Dark overlay to make text readable */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* ▸ TEXT OVERLAY ON TOP OF SLIDER */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white px-6 text-center">

            {/* Main headline with animation */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}     // Start invisible and below final position
              animate={{ opacity: 1, y: 0 }}      // Fade in and move to final position
              transition={{ duration: 0.8 }}      // Animation takes 0.8 seconds
              className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Welcome to Gujarat Ashram
            </motion.h1>

            {/* Subtitle with delayed animation */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}  // Starts 0.2s after headline
              className="text-xl md:text-2xl mb-12 max-w-2xl font-light leading-relaxed"
            >
              A sacred space for meditation, peace, and spiritual growth
            </motion.p>

            {/* Action buttons with staggered animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}  // Starts 0.4s after headline
              className="flex flex-wrap gap-4 justify-center"
            >
              {/* Loop through hero buttons from database */}
              {heroButtons.map((btn: HeroButton, idx: number) => {
                // Determine button style based on variant
                let buttonVariant: "default" | "outline" | "ghost" | "secondary" = "default";
                let buttonClassName = "text-lg px-8 py-6 rounded-full";

                if (btn.variant === "outline") {
                  buttonVariant = "outline";
                  buttonClassName += " border-white/40 text-white hover:bg-white hover:text-ashram-clay";
                } else if (btn.variant === "ghost") {
                  buttonVariant = "ghost";
                  buttonClassName += " text-white hover:bg-white/20";
                } else {
                  buttonVariant = "default";
                  buttonClassName += " bg-white text-ashram-clay hover:bg-ashram-sand";
                }

                return (
                  <Button
                    key={idx}
                    variant={buttonVariant}
                    className={buttonClassName}
                    onClick={() => window.open(btn.url, "_blank")}
                  >
                    {btn.name}
                  </Button>
                );
              })}
            </motion.div>
          </div>

          {/* ▸ SCROLL DOWN INDICATOR - Bouncing arrow at bottom */}
          <motion.div
            // Continuous bouncing animation
            animate={{ y: [0, 10, 0] }}         // Move down 10px and back
            transition={{
              duration: 2,                      // Each bounce cycle takes 2 seconds
              repeat: Infinity,                 // Bounce forever
              ease: "easeInOut"                 // Smooth acceleration/deceleration
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-10"
          >
            {/* Down arrow icon */}
            <div className="w-8 h-12 border-2 border-white rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* ABOUT SECTION - Information about the ashram                 */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">

            {/* Grid layout: 2 columns on desktop, 1 column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* ▸ LEFT SIDE - Text content with animation */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}     // Start invisible and to the left
                whileInView={{ opacity: 1, x: 0 }}   // Fade in and move to position when scrolled into view
                viewport={{ once: true }}            // Only animate once (not every scroll)
                className="space-y-6"
              >
                {/* Small label above main heading */}
                <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">
                  About Us
                </span>

                {/* Main heading */}
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-ashram-clay leading-tight">
                  A Sanctuary for Inner Peace
                </h2>

                {/* Description paragraphs */}
                <p className="text-ashram-stone/80 text-lg leading-relaxed">
                  Nestled in the serene landscapes of Gujarat, our ashram has been a beacon of
                  spiritual wisdom and holistic well-being for over two decades.
                </p>
                <p className="text-ashram-stone/80 text-lg leading-relaxed">
                  We offer a variety of programs rooted in ancient yogic traditions, breathing
                  techniques, and meditation practices designed to bring harmony to body, mind, and spirit.
                </p>

                {/* Action button */}
                <Button className="bg-ashram-amber text-white hover:bg-ashram-clay mt-8 text-lg px-8 py-6">
                  Learn More About Our Mission
                </Button>
              </motion.div>

              {/* ▸ RIGHT SIDE - Image with animation */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}      // Start invisible and to the right
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Main image */}
                <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/about-ashram.jpg"
                    className="w-full h-full object-cover"
                    alt="About Gujarat Ashram"
                  />
                </div>

                {/* Decorative background element (orange square) */}
                <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-ashram-amber/20 rounded-3xl -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PROGRAMS/OFFERINGS SECTION - What the ashram offers          */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-gradient-to-br from-ashram-sand via-white to-ashram-sand/50">
          <div className="max-w-7xl mx-auto">

            {/* Section header */}
            <div className="text-center mb-16">
              <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">
                Our Offerings
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-ashram-clay mt-2">
                Programs & Activities
              </h3>
            </div>

            {/* Grid of program cards: 3 columns on desktop, 1 on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Array of program offerings (hardcoded for now) */}
              {[
                {
                  icon: Home,                          // Icon component
                  title: "Meditation Sessions",
                  desc: "Daily guided meditation for all experience levels."
                },
                {
                  icon: Users,
                  title: "Yoga & Wellness",
                  desc: "Holistic yoga classes combining asanas and pranayama."
                },
                {
                  icon: ImageIcon,
                  title: "Retreats & Workshops",
                  desc: "Immersive programs for deep spiritual transformation."
                }
              ].map((item, i) => {
                const Icon = item.icon;  // Get the icon component

                return (
                  <motion.div
                    key={i}
                    // Lift card up when hovering
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Card container with gradient background */}
                    <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-ashram-sand/20 overflow-hidden group">
                      {/* Orange bar that expands on hover */}
                      <div className="h-2 bg-ashram-amber w-0 group-hover:w-full transition-all duration-500" />

                      <CardContent className="p-8 text-center">
                        {/* Icon in circle with gradient background */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-ashram-amber to-ashram-clay mb-6">
                          <Icon className="w-8 h-8 text-white" />
                        </div>

                        {/* Card title */}
                        <h4 className="font-serif font-bold text-xl mb-3 text-ashram-clay">
                          {item.title}
                        </h4>

                        {/* Card description */}
                        <p className="text-ashram-stone/70 leading-relaxed">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* GALLERY & CONTACT SECTION - Images and location info         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">

            {/* Section header */}
            <div className="text-center mb-16">
              <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">
                Visit Us
              </span>
              <h3 className="font-serif text-4xl md:text-5xl font-bold text-ashram-clay mt-2">
                Gallery & Location
              </h3>
            </div>

            {/* Two-column layout: Gallery left, Contact right */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* ▸ LEFT SIDE - Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {/* Grid of gallery images: 2 columns */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Loop through gallery images */}
                  {GALLERY.map((src, i) => (
                    <motion.div
                      key={i}
                      // Zoom in on hover
                      whileHover={{ scale: 1.05 }}
                      className="relative h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
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

              {/* ▸ RIGHT SIDE - Contact & Location Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Contact information card */}
                <div className="bg-ashram-sand/50 p-8 rounded-3xl border border-ashram-amber/10">
                  {/* Card header */}
                  <h3 className="font-serif text-2xl font-bold mb-6 text-ashram-clay flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-ashram-amber" />
                    Location & Contact
                  </h3>

                  <div className="space-y-6">
                    {/* Address section */}
                    <div className="flex items-start gap-4">
                      {/* Icon in circle */}
                      <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                        <NavigationIcon className="w-5 h-5 text-ashram-clay" />
                      </div>
                      <div>
                        <h4 className="font-bold text-ashram-stone">Address</h4>
                        <p className="text-ashram-stone/70">Vasad, Gujarat 388306, India</p>
                      </div>
                    </div>

                    {/* Contact buttons grid: 2 columns on small screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {/* Loop through footer links (Call, WhatsApp, Email, Map) */}
                      {footerLinks.map((link: FooterLink, idx: number) => {
                        // Map link labels to their corresponding icons
                        const icons: Record<string, React.ComponentType<{ className?: string }>> = {
                          Call: Phone,
                          WhatsApp: Phone,
                          Email: Mail,
                          Map: NavigationIcon
                        };
                        // Get the appropriate icon, default to NavigationIcon if not found
                        const Icon = icons[link.label] || NavigationIcon;

                        return (
                          <Button
                            key={idx}
                            variant="outline"
                            className="flex items-center justify-start gap-3 h-auto py-3 px-4 bg-white border-ashram-amber/20 hover:border-ashram-amber hover:bg-ashram-amber/5 text-ashram-clay"
                            onClick={() => window.open(link.url, "_blank")}  // Open link in new tab
                          >
                            <Icon className="w-4 h-4 text-ashram-amber" />
                            {link.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Google Map placeholder */}
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
                  {/* Placeholder - will be replaced with actual Google Map embed */}
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Google Map Embed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* EVENTS SECTION - Upcoming programs and workshops             */}
        {/* ───────────────────────────────────────────────────────────── */}
        <section className="py-20 px-6 bg-ashram-sand/30">
          <div className="max-w-7xl mx-auto">

            {/* Section header with "View All" button */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-ashram-amber font-medium tracking-wider uppercase text-sm">
                  Calendar
                </span>
                <h3 className="font-serif text-4xl font-bold text-ashram-clay mt-2">
                  Upcoming Events
                </h3>
              </div>
              {/* "View All Events" button */}
              <Button variant="ghost" className="text-ashram-amber hover:text-ashram-clay hover:bg-ashram-amber/10 gap-2">
                View All Events <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Grid of event cards: 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Loop through events array */}
              {EVENTS.map((ev) => (
                <motion.div
                  key={ev.id}
                  // Lift card up when hovering
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden group">
                    {/* Orange bar that fills on hover */}
                    <div className="h-2 bg-ashram-amber w-0 group-hover:w-full transition-all duration-500" />

                    <CardContent className="p-8">
                      {/* Date badge */}
                      <div className="flex items-center gap-2 text-ashram-amber font-medium text-sm mb-4 bg-ashram-amber/10 w-fit px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {ev.date}
                      </div>

                      {/* Event title (changes color on hover) */}
                      <h4 className="font-serif font-bold text-xl mb-3 text-ashram-clay group-hover:text-ashram-amber transition-colors">
                        {ev.title}
                      </h4>

                      {/* Event description */}
                      <p className="text-ashram-stone/70 mb-6 leading-relaxed">
                        {ev.desc}
                      </p>

                      {/* Register button */}
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FOOTER - Bottom of the website                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-ashram-stone text-ashram-sand pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">

          {/* Footer content grid: 4 columns on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            {/* ▸ COLUMN 1 & 2 - About ashram and social icons */}
            <div className="col-span-1 md:col-span-2">
              {/* Ashram name */}
              <h4 className="font-serif font-bold text-3xl mb-6 text-white">
                Gujarat Ashram
              </h4>

              {/* Brief description */}
              <p className="text-ashram-sand/70 text-lg leading-relaxed max-w-md mb-8">
                A sanctuary for peace, meditation, and spiritual growth in the heart of Gujarat.
                Open to all, serving all.
              </p>

              {/* Social media icon placeholders */}
              <div className="flex gap-4">
                {/* Create 4 placeholder circles for social icons */}
                {[1, 2, 3, 4].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-ashram-amber transition-colors cursor-pointer flex items-center justify-center"
                  >
                    {/* Placeholder icon */}
                    <div className="w-5 h-5 bg-white/50 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* ▸ COLUMN 3 - Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
              <div className="space-y-3">
                {/* Loop through menu items to create footer links */}
                {menuItems.map((item: MenuItem, i: number) => (
                  <button
                    key={i}
                    className="block text-ashram-sand/70 hover:text-ashram-amber transition-colors text-left"
                    onClick={() => window.open(item.url, "_blank")}
                  >
                    {item.name}
                  </button>
                ))}

                {/* Additional static links */}
                <button className="block text-ashram-sand/70 hover:text-ashram-amber transition-colors text-left">
                  Donate
                </button>
                <button className="block text-ashram-sand/70 hover:text-ashram-amber transition-colors text-left">
                  Volunteer
                </button>
              </div>
            </div>

            {/* ▸ COLUMN 4 - Contact Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Contact</h4>
              <div className="space-y-4">
                {/* Loop through footer links (Call, WhatsApp, Email, Map) */}
                {footerLinks.map((link: FooterLink, idx: number) => (
                  <a
                    key={idx}
                    href={link.url}                      // Use href for proper link functionality
                    target="_blank"                      // Open in new tab
                    rel="noopener noreferrer"            // Security best practice for external links
                    className="flex items-center gap-3 text-ashram-sand/70 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-ashram-amber" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* ▸ FOOTER BOTTOM - Copyright and legal links */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ashram-sand/50">
            {/* Copyright notice with dynamic year */}
            <div>
              © {new Date().getFullYear()} Art of Living Gujarat Ashram. All rights reserved.
            </div>

            {/* Legal links */}
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

// ═══════════════════════════════════════════════════════════════════════════
// END OF MAINSITE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

// KEY CONCEPTS SUMMARY FOR NON-TECHNICAL LEARNERS:
//
// 1. COMPONENTS: Reusable pieces of UI (like Button, Card)
// 2. STATE: Data that can change and updates the UI when it does
// 3. EFFECTS: Code that runs at specific times (page load, scroll, etc.)
// 4. PROPS: Data passed to components (like function parameters)
// 5. MAPPING: Looping through arrays to display multiple items
// 6. CONDITIONAL RENDERING: Showing different things based on conditions
// 7. EVENT HANDLERS: Functions that run when user interacts (clicks, scrolls)
// 8. ANIMATIONS: Visual effects that make transitions smooth
// 9. RESPONSIVE DESIGN: Layout that adapts to different screen sizes
// 10. API INTEGRATION: Fetching data from backend server
//
// Remember: The code is working perfectly! These comments are just to help
// you understand how everything works together.

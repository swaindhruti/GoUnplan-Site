"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Globe,
  MapPin,
  Calendar,
  Star,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const featuresRef = useRef(null);

  // Redirect to coming-soon page when this page is loaded
  useEffect(() => {
    router.replace("/coming-soon");
  }, [router]);

  // Intersection observer for features section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const currentRef = featuresRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Auto-rotate features
  useEffect(() => {
    if (isIntersecting) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isIntersecting]);

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-black" strokeWidth={2.5} />,
      title: "Unique Destinations",
      description:
        "Discover hidden gems and extraordinary places you won't find in typical travel guides.",
    },
    {
      icon: <MapPin className="h-8 w-8 text-black" strokeWidth={2.5} />,
      title: "Local Expertise",
      description:
        "Connect with passionate local hosts who share authentic experiences and insider knowledge.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-black" strokeWidth={2.5} />,
      title: "Flexible Planning",
      description:
        "Enjoy the freedom to customize your journey while having the security of experienced guides.",
    },
  ];

  // The rest of your component will only be rendered if the redirect doesn't happen immediately
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-yellow-300 border-b-4 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-black text-black"
          >
            UNPLAN
          </motion.div>

          <nav className="hidden md:flex space-x-6 items-center">
            {["destinations", "experiences", "about"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-black font-bold uppercase hover:bg-pink-400 px-3 py-1 border-2 border-black rounded-md transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/auth/signin">
                <Button className="text-black bg-white border-3 border-black rounded-md font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="/auth/signup">
                <Button className="bg-blue-400 text-black border-3 border-black rounded-md font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white p-2 border-3 border-black rounded-md"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-black" strokeWidth={2.5} />
              ) : (
                <Menu className="h-6 w-6 text-black" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t-3 border-black"
          >
            <div className="px-4 py-3 space-y-3">
              {["destinations", "experiences", "about"].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="block text-black font-bold uppercase hover:bg-pink-400 px-3 py-2 border-2 border-black rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full text-black bg-yellow-300 border-3 border-black rounded-md font-black">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-blue-400 text-black border-3 border-black rounded-md font-black">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-20 lg:py-24 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight mb-4 uppercase">
                Travel without{" "}
                <span className="bg-green-400 px-2 inline-block transform -rotate-1">
                  boundaries
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-bold text-black mb-8 max-w-xl">
                Discover spontaneous adventures tailored to your style.
                Experience authentic journeys crafted by local hosts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button className="bg-pink-400 text-black border-3 border-black rounded-md font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-8 py-6 text-lg">
                    Start Your Journey{" "}
                    <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2.5} />
                  </Button>
                </Link>
                <Link href="/dashboard/host">
                  <Button className="bg-white text-black border-3 border-black rounded-md font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-8 py-6 text-lg">
                    Become a Host
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <motion.div
                  className="bg-yellow-300 p-3 rounded-none border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Travel adventure"
                    height={400}
                    width={600}
                    className="w-full object-cover h-80 md:h-96 border-2 border-black"
                  />
                </motion.div>

                {/* Floating card */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-none border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 hidden md:block"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-pink-400 flex items-center justify-center border-2 border-black">
                      <Star className="h-5 w-5 text-black" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-black">
                        Trusted by 10,000+
                      </p>
                      <p className="text-xs font-bold text-black">
                        Happy travelers worldwide
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-100" id="about" ref={featuresRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={
              isIntersecting ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
            }
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black text-black mb-4 uppercase border-b-4 border-black inline-block pb-2">
              Why Choose Unplan?
            </h2>
            <p className="text-xl font-bold text-black max-w-2xl mx-auto">
              The perfect blend of spontaneity and careful planning for
              unforgettable travel experiences
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 relative">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={
                  isIntersecting
                    ? {
                        y: 0,
                        opacity: 1,
                        scale: activeFeature === index ? 1.05 : 1,
                      }
                    : { y: 50, opacity: 0 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                  scale: { duration: 0.3 },
                }}
                className={`bg-white rounded-none p-8 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex-1 cursor-pointer
                  ${
                    activeFeature === index
                      ? "bg-green-200"
                      : "hover:bg-yellow-100"
                  }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="h-16 w-16 bg-pink-400 flex items-center justify-center mb-6 border-2 border-black">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-black mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="text-black font-bold">{feature.description}</p>
                <div className="mt-6 flex justify-end">
                  {activeFeature === index ? (
                    <ChevronUp
                      className="h-6 w-6 text-black"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <ChevronDown
                      className="h-6 w-6 text-black"
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-pink-400 py-16 border-y-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl font-black text-black mb-6 uppercase">
              Ready to start your adventure?
            </h2>
            <p className="text-xl font-bold text-black mb-8 max-w-2xl mx-auto">
              Join thousands of travelers discovering the world in a new way
              with Unplan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/auth/signup">
                  <Button className="bg-white text-black border-3 border-black rounded-md font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-8 py-6 text-lg">
                    Create Account
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/explore">
                  <Button className="bg-blue-400 text-black border-3 border-black rounded-md font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all px-8 py-6 text-lg">
                    Explore Trips
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-yellow-300 border-t-4 border-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-black text-black mb-4 uppercase">
                Unplan
              </h3>
              <p className="font-bold text-black">
                Travel with vibe. Discover authentic experiences crafted by
                locals.
              </p>
            </div>

            {[
              {
                title: "Company",
                links: ["About", "Careers", "Press"],
              },
              {
                title: "Resources",
                links: ["Blog", "Community", "Help Center"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Cookie Policy"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h4 className="font-black text-black mb-4 uppercase border-b-2 border-black pb-1">
                  {column.title}
                </h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-black font-bold hover:bg-blue-400 px-2 py-1 inline-block border-2 border-black hover:border-black transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t-3 border-black mt-12 pt-8 text-center">
            <p className="text-sm font-black text-black">
              © 2025 UNPLAN. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

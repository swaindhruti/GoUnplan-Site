"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain } from "lucide-react";
/* import Link from "next/link"; */
import { smoothScrollToSection } from "../global/Handlescroll";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigationItems = [
    { name: "Home", href: "/", section: "#home" },
    { name: "About", href: "/about", section: "#about" },
    { name: "vibes", href: "/vibes", section: "#vibes" },
    { name: "Contact", href: "/contact", section: "#contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /*   const handleNavigation = (
    item: (typeof navigationItems)[0],
  ) => {
    if (window.location.pathname === "/" && item.section) {
  
      
      setIsOpen(false);
    }
  }; */

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-white" />
            <span className="text-white text-xl font-bold tracking-wide">
              UNPLan
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                /*  href={item.href} */
                onClick={() => {
                  smoothScrollToSection(item.section, {
                    duration: 1.2,
                    ease: "power2.out",
                    offset: 0
                  });
                }}
                className="text-white select-none hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer"
              >
                {item.name}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-white hover:text-purple-300 hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60"
            >
              Sign In
            </Link>
            <Link
              href="/trips"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 border "
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-black/20 backdrop-blur-md border-none"
              >
                <div className="flex flex-col space-y-6 pt-8">
                  <nav className="flex flex-col space-y-4">
                    {navigationItems.map((item) => (
                      <div
                        key={item.name}
                        /*  href={item.href} */
                        onClick={() => {
                          smoothScrollToSection(item.section, {
                            duration: 1.2,
                            ease: "power2.out",
                            offset: 0
                          });
                        }}
                        className="text-white select-none hover:text-purple-300 transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-white/10 cursor-pointer"
                      >
                        {item.name}
                      </div>
                    ))}
                  </nav>
                  <div className="flex flex-col space-y-3 pt-6 border-t border-white/20">
                    <Link
                      href="/auth/signin"
                      className="text-white text-center hover:text-purple-300 hover:bg-white/10 transition-all duration-200 justify-center border border-white/40"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/trips"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      onClick={() => setIsOpen(false)}
                    >
                      Plan Your Trip
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

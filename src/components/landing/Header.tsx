"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain, X } from "lucide-react";
import { handleScroll } from "../global/Handlescroll";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();

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

  const handleNavClick = (section: string) => {
    handleScroll({ location: section });
    setIsOpen(false);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Mountain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              <span className="text-white text-lg sm:text-xl font-bold tracking-wide">
                UNPLan
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.name}
                  onClick={() => handleNavClick(item.section)}
                  className="text-white select-none font-montserrat hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-200 group-hover:w-full"></span>
                </div>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex  font-montserrat items-center space-x-3">
              <Button
                onClick={() => router.push(`/auth/signin`)}
                className="text-white hover:text-purple-300 bg-transparent hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60 px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push(`/trips`)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm backdrop-blur-sm border border-purple-500/30"
              >
                Plan Your Trip
              </Button>
            </div>

            {/* Tablet Navigation (hidden on mobile and desktop) */}
            <div className="hidden md:flex lg:hidden items-center space-x-4">
              <nav className="flex items-center space-x-4">
                {navigationItems.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleNavClick(item.section)}
                    className="text-white font-montserrat select-none hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer text-sm px-2 py-1 rounded hover:bg-white/10"
                  >
                    {item.name}
                  </div>
                ))}
              </nav>
              <div className="flex items-center font-montserrat space-x-2">
                <Button
                  onClick={() => router.push(`/auth/signin`)}
                  className="text-white hover:text-purple-300 hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60 px-3 py-1.5 rounded-lg font-medium text-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push(`/trips`)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                >
                  Plan Trip
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden font-montserrat">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-none border border-white/40 hover:border-white/60 transition-all duration-200 h-10 w-10"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full h-full bg-black/95 backdrop-blur-md border-none p-0"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Header with Close Button */}
                    <div className="flex items-center justify-between p-6 border-b border-white/20">
                      <div className="flex items-center space-x-2">
                        <Mountain className="h-6 w-6 text-white" />
                        <span className="text-white text-lg font-bold tracking-wide">
                          UNPLan
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        className="text-white  border border-white/40 hover:border-white/60 transition-all duration-200 h-10 w-10"
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 flex flex-col justify-center px-6 space-y-4">
                      {navigationItems.map((item, index) => (
                        <div
                          key={item.name}
                          onClick={() => handleNavClick(item.section)}
                          className="text-white select-none hover:text-purple-300 transition-all duration-300 font-medium py-4 px-6 rounded-xl hover:bg-white/10 cursor-pointer group text-center relative overflow-hidden"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: isOpen
                              ? "slideInFromRight 0.5s ease-out forwards"
                              : "none"
                          }}
                        >
                          <span className="flex items-center justify-center text-xl relative z-10">
                            {item.name}
                            <span className="ml-2 text-purple-300 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1">
                              →
                            </span>
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-700/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </div>
                      ))}
                    </nav>

                    {/* Mobile CTA Buttons */}
                    <div className="flex flex-col space-y-4 p-6 border-t border-white/20 bg-black/50">
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/auth/signin`);
                        }}
                        className="text-white text-center hover:text-purple-300 hover:bg-white/10 transition-all duration-200 py-4 px-6 rounded-xl border border-white/40 hover:border-white/60 font-medium text-lg"
                      >
                        Sign In
                      </Button>
                      <Link
                        href="/trips"
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-center transform hover:-translate-y-0.5 text-lg"
                        onClick={() => {
                          router.push(`/trips`);
                          setIsOpen(false);
                        }}
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
    </>
  );
}

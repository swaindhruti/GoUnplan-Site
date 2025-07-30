"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Mountain, X, LogOut, User } from "lucide-react";
import { handleScroll } from "../global/Handlescroll";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Check if navbar should be hidden
  const shouldHideNavbar = () => {
    const hiddenPaths = ["/auth", "/dashboard", "/bookings"];

    return hiddenPaths.some((path) => pathname.startsWith(path));
  };

  const navigationItems = [
    { name: "Home", href: "/", section: "#home" },
    { name: "Trips", href: "/trips", section: "#trips" },
    { name: "About", href: "/about", section: "#about" },
    { name: "Contact", href: "/contact", section: "#contact" },
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

  const handleNavClick = (item: {
    name: string;
    href: string;
    section: string;
  }) => {
    if (item.name === "Home") {
      router.push("/");
    } else if (item.name === "Trips" || item.name === "Contact") {
      router.push(item.href);
    } else {
      // For About, scroll to sections on landing page
      handleScroll({ location: item.section });
    }
    setIsOpen(false);
  };

  const getDashboardUrl = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "HOST":
        return "/dashboard/host";
      case "USER":
      default:
        return "/dashboard/user";
    }
  };

  // Don't render navbar on auth, dashboard, or booking pages
  if (shouldHideNavbar()) {
    return null;
  }

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
                  onClick={() => handleNavClick(item)}
                  className="text-white select-none font-montserrat hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer px-3 py-2 rounded-lg hover:bg-white/10 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-200 group-hover:w-full"></span>
                </div>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex font-montserrat items-center space-x-3">
              {status === "loading" ? (
                <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center space-x-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="p-0 h-10 w-10 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-200"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={session.user?.image || ""}
                            alt={session.user?.name || "User"}
                          />
                          <AvatarFallback className="bg-purple-600 text-white text-sm font-semibold">
                            {session.user?.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 bg-white/95 backdrop-blur-md border border-white/20">
                      <div className="space-y-2">
                        <div className="px-3 py-2">
                          <p className="text-sm font-semibold text-gray-800">
                            {session.user?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {session.user?.email}
                          </p>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <Button
                          onClick={() =>
                            router.push(
                              getDashboardUrl(session.user?.role || "USER")
                            )
                          }
                          variant="ghost"
                          className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    onClick={() => router.push(`/trips`)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm backdrop-blur-sm border border-purple-500/30"
                  >
                    Plan Your Trip
                  </Button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Tablet Navigation (hidden on mobile and desktop) */}
            <div className="hidden md:flex lg:hidden items-center space-x-4">
              <nav className="flex items-center space-x-4">
                {navigationItems.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className="text-white font-montserrat select-none hover:text-purple-300 transition-colors duration-200 font-medium cursor-pointer text-sm px-2 py-1 rounded hover:bg-white/10"
                  >
                    {item.name}
                  </div>
                ))}
              </nav>
              <div className="flex items-center font-montserrat space-x-2">
                {status === "loading" ? (
                  <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse"></div>
                ) : session ? (
                  <div className="flex items-center space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="p-0 h-8 w-8 rounded-full border border-white/40 hover:border-white/60 transition-all duration-200"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={session.user?.image || ""}
                              alt={session.user?.name || "User"}
                            />
                            <AvatarFallback className="bg-purple-600 text-white text-xs font-semibold">
                              {session.user?.name?.charAt(0).toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2 bg-white/95 backdrop-blur-md border border-white/20">
                        <div className="space-y-2">
                          <div className="px-2 py-1">
                            <p className="text-xs font-semibold text-gray-800">
                              {session.user?.name}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {session.user?.email}
                            </p>
                          </div>
                          <div className="border-t border-gray-200"></div>
                          <Button
                            onClick={() =>
                              router.push(
                                getDashboardUrl(session.user?.role || "USER")
                              )
                            }
                            variant="ghost"
                            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-50 text-xs"
                          >
                            <User className="w-3 h-3 mr-1" />
                            Dashboard
                          </Button>
                          <Button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                          >
                            <LogOut className="w-3 h-3 mr-1" />
                            Sign Out
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      onClick={() => router.push(`/trips`)}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                    >
                      Plan Trip
                    </Button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
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
                          onClick={() => handleNavClick(item)}
                          className="text-white select-none hover:text-purple-300 transition-all duration-300 font-medium py-4 px-6 rounded-xl hover:bg-white/10 cursor-pointer group text-center relative overflow-hidden"
                          style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: isOpen
                              ? "slideInFromRight 0.5s ease-out forwards"
                              : "none",
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
                      {status === "loading" ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                        </div>
                      ) : session ? (
                        <>
                          <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl border border-white/20">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={session.user?.image || ""}
                                alt={session.user?.name || "User"}
                              />
                              <AvatarFallback className="bg-purple-600 text-white text-lg font-semibold">
                                {session.user?.name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-white font-semibold text-lg">
                                {session.user?.name}
                              </p>
                              <p className="text-white/70 text-sm">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => {
                              router.push(
                                getDashboardUrl(session.user?.role || "USER")
                              );
                              setIsOpen(false);
                            }}
                            className="text-white text-center hover:text-purple-300 hover:bg-white/10 transition-all duration-200 py-4 px-6 rounded-xl border border-white/40 hover:border-white/60 font-medium text-lg"
                          >
                            <User className="w-5 h-5 mr-2" />
                            Dashboard
                          </Button>
                          <Button
                            onClick={() => {
                              signOut({ callbackUrl: "/" });
                              setIsOpen(false);
                            }}
                            className="text-red-400 text-center hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 py-4 px-6 rounded-xl border border-red-500/40 hover:border-red-500/60 font-medium text-lg"
                          >
                            <LogOut className="w-5 h-5 mr-2" />
                            Sign Out
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
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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

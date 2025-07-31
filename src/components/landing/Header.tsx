"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Mountain,
  X,
  User,
  Settings,
  LogOut,
  Calendar,
  MapPin
} from "lucide-react";
import { handleScroll } from "../global/Handlescroll";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();

  const navigationItems = [
    { name: "Home", href: "/", section: "#home" },
    { name: "Vibes", href: "/vibes", section: "#vibes" },
    { name: "About", href: "/about", section: "#about" },
    { name: "Contact", href: "/contact", section: "#contact" }
  ];

  useEffect(() => {
    const handleScrollEvent = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScrollEvent, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollEvent);
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

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
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
        className={`fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md transition-transform duration-500 ease-in-out ${
          isVisible ? "transform translate-y-0" : "transform -translate-y-full"
        }`}
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out"
        }}
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

            <div className="hidden lg:flex font-montserrat items-center space-x-3">
              {/*   <Button
                onClick={() => router.push(`/trips`)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-5 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm backdrop-blur-sm border border-purple-500/30"
              >
                Plan a Trip
              </Button> */}

              {status === "unauthenticated" ? (
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="text-white hover:text-purple-300 bg-transparent hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60 px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-sm"
                >
                  Sign In
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="text-white hover:text-purple-300 bg-transparent hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60 px-2 py-2 rounded-lg font-medium text-sm backdrop-blur-sm">
                      <Menu className="h-8 w-8" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 py-2 px-2 bg-black/90 backdrop-blur-md border-white/20 text-white"
                    align="end"
                  >
                    <DropdownMenuLabel className="text-white font-roboto text-lg">
                      {session?.user?.email || "My Account"}
                    </DropdownMenuLabel>
                    <DropdownMenuLabel className=" text-purple-300 font-roboto -mt-2">
                      {session?.user?.name || "My Account"}
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            getDashboardUrl(session?.user?.role || "USER")
                          )
                        }
                        className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/trips")}
                        className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        My Trips
                        <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/profile/settings")}
                        className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push("/")}
                        className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Explore
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-white/20" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

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
                {status === "unauthenticated" ? (
                  <Button
                    onClick={() => router.push("/auth/signin")}
                    className="text-white hover:text-purple-300 bg-transparent hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60 px-4 py-2 rounded-lg font-medium text-sm backdrop-blur-sm"
                  >
                    Sign In
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="text-white hover:text-purple-300 bg-transparent hover:bg-white/10 transition-all duration-200 border border-white/40 hover:border-white/60 px-2 py-2 rounded-lg font-medium text-sm backdrop-blur-sm">
                        <Menu className="h-8 w-8" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 py-2 px-2 bg-black/90 backdrop-blur-md border-white/20 text-white"
                      align="end"
                    >
                      <DropdownMenuLabel className="text-white font-roboto text-lg">
                        {session?.user?.email || "My Account"}
                      </DropdownMenuLabel>
                      <DropdownMenuLabel className=" text-purple-300 font-roboto -mt-2">
                        {session?.user?.name || "My Account"}
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              getDashboardUrl(session?.user?.role || "USER")
                            )
                          }
                          className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                          <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/trips")}
                          className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          My Trips
                          <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/profile/settings")}
                          className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => router.push("/")}
                          className="text-white hover:bg-white/10 hover:text-purple-300 cursor-pointer"
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Explore
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                    {/* Mobile Header */}
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
                        className="text-white border border-white/40 hover:border-white/60 transition-all duration-200 h-10 w-10"
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

                      {/* Mobile User Menu Items */}
                      {status === "authenticated" && (
                        <>
                          <div className="border-t border-white/20 my-4"></div>
                          <div
                            onClick={() => {
                              setIsOpen(false);
                              router.push(
                                getDashboardUrl(session?.user?.role || "USER")
                              );
                            }}
                            className="text-white select-none hover:text-purple-300 transition-all duration-300 font-medium py-4 px-6 rounded-xl hover:bg-white/10 cursor-pointer group text-center relative overflow-hidden"
                          >
                            <span className="flex items-center justify-center text-xl relative z-10">
                              <User className="mr-2 h-5 w-5" />
                              Dashboard
                              <span className="ml-2 text-purple-300 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1">
                                →
                              </span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-700/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                          </div>
                          <div
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/profile/settings");
                            }}
                            className="text-white select-none hover:text-purple-300 transition-all duration-300 font-medium py-4 px-6 rounded-xl hover:bg-white/10 cursor-pointer group text-center relative overflow-hidden"
                          >
                            <span className="flex items-center justify-center text-xl relative z-10">
                              <Settings className="mr-2 h-5 w-5" />
                              Settings
                              <span className="ml-2 text-purple-300 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-1">
                                →
                              </span>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-700/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                          </div>
                        </>
                      )}
                    </nav>

                    {/* Mobile CTA Buttons */}
                    <div className="flex flex-col space-y-4 p-6 border-t border-white/20 bg-black/50">
                      {status === "unauthenticated" ? (
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            router.push(`/auth/signin`);
                          }}
                          className="text-white text-center hover:text-purple-300 hover:bg-white/10 transition-all duration-200 py-4 px-6 rounded-xl border border-white/40 hover:border-white/60 font-medium text-lg"
                        >
                          Sign In
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            setIsOpen(false);
                            handleSignOut();
                          }}
                          className="text-red-400 text-center hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 py-4 px-6 rounded-xl border border-red-500/40 hover:border-red-500/60 font-medium text-lg"
                        >
                          <LogOut className="mr-2 h-5 w-5" />
                          Sign Out
                        </Button>
                      )}
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

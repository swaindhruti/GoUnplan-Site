"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  Calendar,
  Home,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Crown,
  Shield,
  UserCog,
  FileText,
  MapPin
} from "lucide-react";
import { handleScroll } from "../global/Handlescroll";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // State for dashboard menu toggle (desktop)
  const [isDashboardMenuOpen, setIsDashboardMenuOpen] = useState(false);
  // State for mobile dashboard menu toggle
  const [isMobileDashboardOpen, setIsMobileDashboardOpen] = useState(false);
  // State for host mode toggle
  const [isHostMode, setIsHostMode] = useState(false);
  // State for admin mode toggle
  const [isAdminMode, setIsAdminMode] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Determine text color based on route

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
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
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
      handleScroll({ location: item.section });
    }
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleDashboardClick = () => {
    const userRole = session?.user?.role || "USER";

    if (userRole === "USER") {
      router.push("/dashboard/user");
      setIsDashboardMenuOpen(false);
      return;
    }

    setIsDashboardMenuOpen(!isDashboardMenuOpen);
  };

  const handleMobileDashboardClick = () => {
    const userRole = session?.user?.role || "USER";

    if (userRole === "USER") {
      router.push("/dashboard/user");
      setIsOpen(false);
      return;
    }

    setIsMobileDashboardOpen(!isMobileDashboardOpen);
  };

  const getDashboardMenuItems = () => {
    const userRole = session?.user?.role || "USER";
    const items = [];

    if (userRole === "HOST" || userRole === "ADMIN") {
      items.push({
        label: "User Dashboard",
        href: "/dashboard/user",
        icon: User
      });
      items.push({
        label: "Host Dashboard",
        href: "/dashboard/host",
        icon: Crown
      });
    }

    if (userRole === "ADMIN") {
      items.push({
        label: "Admin Dashboard",
        href: "/dashboard/admin",
        icon: Shield
      });
    }

    return items;
  };

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");
    const breadcrumbs = [];

    breadcrumbs.push({
      label: "Home",
      href: "/",
      isActive: pathname === "/"
    });

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Capitalize and clean up segment names
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (label === "Dashboard") {
        label =
          session?.user?.role === "ADMIN"
            ? "Admin Dashboard"
            : session?.user?.role === "HOST"
            ? "Host Dashboard"
            : "Dashboard";
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  const isHomePage = pathname === "/";

  // Unified header styling for all pages
  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
    bg-white backdrop-blur-xl border-b border-gray-200 shadow-sm
    ${isVisible ? "translate-y-0" : "-translate-y-full"}
  `;

  const shouldShowHostButton =
    status === "authenticated" &&
    session?.user?.role !== "HOST" &&
    session?.user?.role !== "ADMIN";

  // Determine if current user is a host
  const isUserHost = session?.user?.role === "HOST";

  // Determine if current user is an admin
  const isUserAdmin = session?.user?.role === "ADMIN";

  // Handle host mode toggle
  const handleHostModeToggle = (checked: boolean) => {
    setIsHostMode(checked);
    if (checked) {
      router.push("/dashboard/host");
    } else {
      router.push("/");
    }
    setIsDashboardMenuOpen(false);
  };

  // Handle admin mode toggle
  const handleAdminModeToggle = (checked: boolean) => {
    setIsAdminMode(checked);
    if (checked) {
      router.push("/dashboard/admin");
    } else {
      router.push("/");
    }
    setIsDashboardMenuOpen(false);
  };

  // Update host mode and admin mode state based on current route
  useEffect(() => {
    setIsHostMode(pathname.startsWith("/dashboard/host"));
    setIsAdminMode(pathname.startsWith("/dashboard/admin"));
  }, [pathname]);

  // Prevent horizontal scrolling when dropdown is open
  useEffect(() => {
    if (isDashboardMenuOpen) {
      document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowX = "";
    }

    // Cleanup function
    return () => {
      document.body.style.overflowX = "";
    };
  }, [isDashboardMenuOpen]);

  // Standard Dropdown Menu Component (used for both home and non-home pages)
  const StandardDropdownMenu = () => (
    <DropdownMenu
      open={isDashboardMenuOpen}
      onOpenChange={setIsDashboardMenuOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full">
          <Menu className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl rounded-xl max-w-[calc(100vw-2rem)]"
        align="end"
        sideOffset={8}
        avoidCollisions={true}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {session?.user?.name || "User"}
              </p>
              <p className="text-gray-500 text-xs">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        <DropdownMenuGroup className="p-2">
          {/* Dashboard Menu Item - Toggleable for HOST/ADMIN, Direct for USER */}
          <div className="relative">
            <DropdownMenuItem
              onClick={handleDashboardClick}
              className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer group"
              aria-expanded={
                isDashboardMenuOpen &&
                (session?.user?.role === "HOST" ||
                  session?.user?.role === "ADMIN")
              }
              aria-haspopup={session?.user?.role !== "USER"}
            >
              <UserCog className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
              <span className="font-medium text-gray-900 flex-1">
                Dashboard
              </span>
              {/* Show toggle icon for HOST/ADMIN roles */}
              {(session?.user?.role === "HOST" ||
                session?.user?.role === "ADMIN") && (
                <>
                  {isDashboardMenuOpen ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </>
              )}
              {/* Show shortcut only for USER role */}
              {session?.user?.role === "USER" && (
                <DropdownMenuShortcut className="text-gray-400">
                  ⌘D
                </DropdownMenuShortcut>
              )}
            </DropdownMenuItem>

            {/* Nested Dashboard Options */}
            {isDashboardMenuOpen &&
              (session?.user?.role === "HOST" ||
                session?.user?.role === "ADMIN") && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-100 pl-3">
                  {getDashboardMenuItems().map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      onClick={() => {
                        router.push(item.href);
                        setIsDashboardMenuOpen(false);
                      }}
                      className="flex items-center p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer group text-sm"
                    >
                      <item.icon className="mr-3 h-3 w-3 text-gray-600 group-hover:text-purple-600" />
                      <span className="font-medium text-gray-800">
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
          </div>

          <DropdownMenuItem
            onClick={() => router.push("/trips")}
            className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer group"
          >
            <MapPin className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
            <span className="font-medium text-gray-900">Explore Trips</span>
            <DropdownMenuShortcut className="text-gray-400">
              ⌘E
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/my-trips")}
            className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer group"
          >
            <Calendar className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
            <span className="font-medium text-gray-900">My Trips</span>
            <DropdownMenuShortcut className="text-gray-400">
              ⌘T
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          {/* Apply for Host button - only show for non-hosts */}
          {shouldShowHostButton && (
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/host")}
              className="flex items-center p-3 rounded-lg hover:bg-amber-50 transition-colors duration-200 cursor-pointer group"
            >
              <Crown className="mr-3 h-4 w-4 text-gray-600 group-hover:text-amber-600" />
              <span className="font-medium text-gray-900 group-hover:text-amber-600">
                Apply for Host
              </span>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => window.open("/terms-and-conditions.pdf", "_blank")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
          >
            <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
            <span className="font-medium text-gray-900 ">
              Terms and Conditions
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open("/privacy-policy.pdf", "_blank")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
          >
            <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
            <span className="font-medium text-gray-900 ">Privacy Policy</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => window.open("/cancellation-policy.pdf", "_blank")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
          >
            <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
            <span className="font-medium text-gray-900 ">
              Cancellation Policy
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <div className="border-t border-gray-100 p-2">
          <DropdownMenuItem
            onClick={handleSignOut}
            className="flex items-center p-3 rounded-lg hover:bg-red-50 transition-colors duration-200 cursor-pointer group"
          >
            <LogOut className="mr-3 h-4 w-4 text-gray-600 group-hover:text-red-600" />
            <span className="font-medium text-gray-900 group-hover:text-red-600">
              Sign Out
            </span>
            <DropdownMenuShortcut className="text-gray-400">
              ⇧⌘Q
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (!isHomePage) {
    return (
      <div className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo and Breadcrumb - Left Side */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center group flex-shrink-0">
                <div className="relative bg-white rounded-full">
                  <Image
                    src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754613844/unplan_6_l0vcxr.png"
                    alt="GoUnplan Logo"
                    width={50}
                    height={50}
                    className="rounded-full object-cover transition-all duration-300 hover:scale-105"
                    priority
                  />
                </div>
              </Link>

              <div className="hidden md:flex items-center">
                <Breadcrumb>
                  <BreadcrumbList className="flex items-center gap-2 text-gray-600">
                    {breadcrumbs.map((crumb, index) => (
                      <div
                        key={crumb.href}
                        className="flex items-center min-w-0"
                      >
                        <BreadcrumbItem>
                          {crumb.isActive ? (
                            <BreadcrumbPage className="font-semibold text-purple-600 font-instrument">
                              {crumb.label}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink
                              href={crumb.href}
                              className="font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200 font-instrument"
                            >
                              {index === 0 ? (
                                <Home className="h-4 w-4" />
                              ) : (
                                crumb.label
                              )}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && (
                          <BreadcrumbSeparator className="mx-2 text-gray-400">
                            <ChevronRight className="h-3 w-3" />
                          </BreadcrumbSeparator>
                        )}
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>

            {/* Menu Button - Right Side */}
            <div className="flex items-center">
              {status === "authenticated" ? (
                <div className="flex items-center space-x-4">
                  {/* Host Mode Toggle - Show only for HOST role */}
                  {isUserHost && (
                    <div className="flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                      <Crown className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-gray-700 text-sm font-instrument">
                        Host Mode
                      </span>
                      <Switch
                        checked={isHostMode}
                        onCheckedChange={handleHostModeToggle}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  )}

                  {/* Admin Mode Toggle - Show only for ADMIN role */}
                  {isUserAdmin && (
                    <div className="flex items-center gap-2 bg-red-50 rounded-full px-4 py-2 border border-red-200">
                      <Shield className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-gray-700 text-sm font-instrument">
                        Admin Mode
                      </span>
                      <Switch
                        checked={isAdminMode}
                        onCheckedChange={handleAdminModeToggle}
                        className="data-[state=checked]:bg-red-600"
                      />
                    </div>
                  )}

                  <StandardDropdownMenu />
                </div>
              ) : (
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full header for home page - consistent styling
  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative bg-white rounded-full">
              <Image
                src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754613844/unplan_6_l0vcxr.png"
                alt="GoUnplan Logo"
                width={60}
                height={60}
                className="rounded-full object-cover transition-all duration-300 hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-2 xl:gap-x-4">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className="relative px-4 py-2 font-instrument font-semibold transition-all duration-300 rounded-lg group text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:w-3/4 rounded-full"></span>
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {status === "unauthenticated" ? (
              <Button
                onClick={() => router.push("/auth/signin")}
                className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
              >
                Sign In
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Host Mode Toggle - Show only for HOST role */}
                {isUserHost && (
                  <div className="flex items-center gap-2 bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-gray-700 text-sm font-instrument">
                      Host Mode
                    </span>
                    <Switch
                      checked={isHostMode}
                      onCheckedChange={handleHostModeToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                )}

                {/* Admin Mode Toggle - Show only for ADMIN role */}
                {isUserAdmin && (
                  <div className="flex items-center gap-2 bg-red-50 rounded-full px-4 py-2 border border-red-200">
                    <Shield className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-gray-700 text-sm font-instrument">
                      Admin Mode
                    </span>
                    <Switch
                      checked={isAdminMode}
                      onCheckedChange={handleAdminModeToggle}
                      className="data-[state=checked]:bg-red-600"
                    />
                  </div>
                )}

                <StandardDropdownMenu />
              </div>
            )}
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-6">
            <nav className="flex items-center space-x-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className="px-3 py-2 font-instrument font-semibold transition-all duration-300 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              {status === "unauthenticated" ? (
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  onClick={handleSignOut}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-instrument font-semibold transition-colors duration-200 px-6 py-2 rounded-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full h-full bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 backdrop-blur-xl border-none p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Navigation */}
                  <nav className="flex-1 flex flex-col justify-start px-6 py-8 space-y-2 overflow-y-auto">
                    {/* Navigation Items */}
                    {navigationItems.map((item, index) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item)}
                        className="group relative  p-4 rounded-2xl  hover:scale-105 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-purple-300/60 hover:shadow-lg"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: isOpen
                            ? "slideInRight 0.6s ease-out forwards"
                            : "none"
                        }}
                      >
                        <span className="flex items-center justify-between text-lg font-semibold text-gray-900 relative z-10">
                          {item.name}
                          <ChevronRight className="h-5 w-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                        </span>
                      </button>
                    ))}

                    {/* Authenticated User Menu Items */}
                    {status === "authenticated" && (
                      <>
                        <div className="border-t overflow-auto border-gray-200/60 my-6"></div>

                        {/* Mobile Dashboard Menu - Toggleable */}
                        <div className="space-y-2">
                          <button
                            onClick={handleMobileDashboardClick}
                            className="group relative overflow-hidden p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-purple-300/60 hover:shadow-lg w-full"
                            aria-expanded={
                              isMobileDashboardOpen &&
                              (session?.user?.role === "HOST" ||
                                session?.user?.role === "ADMIN")
                            }
                            aria-haspopup={session?.user?.role !== "USER"}
                          >
                            <span className="flex items-center justify-between text-lg font-semibold text-gray-900 relative z-10">
                              <div className="flex items-center">
                                <UserCog className="mr-3 h-5 w-5 text-purple-600" />
                                Dashboard
                              </div>
                              {/* Show toggle icon for HOST/ADMIN, navigation arrow for USER */}
                              {session?.user?.role === "USER" ? (
                                <ChevronRight className="h-5 w-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                              ) : (
                                <>
                                  {isMobileDashboardOpen ? (
                                    <ChevronUp className="h-5 w-5 text-purple-600 transition-transform duration-300" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-purple-600 transition-transform duration-300" />
                                  )}
                                </>
                              )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                          </button>

                          {/* Mobile Nested Dashboard Options */}
                          {isMobileDashboardOpen &&
                            (session?.user?.role === "HOST" ||
                              session?.user?.role === "ADMIN") && (
                              <div className="ml-4 space-y-2 border-l-2 border-purple-200 pl-4">
                                {getDashboardMenuItems().map((item, index) => (
                                  <button
                                    key={item.href}
                                    onClick={() => {
                                      router.push(item.href);
                                      setIsOpen(false);
                                      setIsMobileDashboardOpen(false);
                                    }}
                                    className="group relative overflow-hidden p-3 rounded-xl transition-all duration-300 hover:scale-105 bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-gray-200/40 hover:border-purple-300/40 hover:shadow-md w-full"
                                    style={{
                                      animationDelay: `${(index + 1) * 100}ms`,
                                      animation: isMobileDashboardOpen
                                        ? "slideInRight 0.4s ease-out forwards"
                                        : "none"
                                    }}
                                  >
                                    <span className="flex items-center justify-between text-base font-medium text-gray-800 relative z-10">
                                      <div className="flex items-center">
                                        <item.icon className="mr-3 h-4 w-4 text-purple-600" />
                                        {item.label}
                                      </div>
                                      <ChevronRight className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-xl"></div>
                                  </button>
                                ))}
                              </div>
                            )}
                        </div>

                        {/* Explore Trips */}
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/trips");
                          }}
                          className="group relative p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-purple-300/60 hover:shadow-lg"
                        >
                          <span className="flex items-center justify-between text-lg font-semibold text-gray-900 relative z-10">
                            <div className="flex items-center">
                              <MapPin className="mr-3 h-5 w-5 text-purple-600" />
                              Explore Trips
                            </div>
                            <ChevronRight className="h-5 w-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                        </button>

                        {/* My Trips */}
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/my-trips");
                          }}
                          className="group relative  p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-purple-300/60 hover:shadow-lg"
                        >
                          <span className="flex items-center justify-between text-lg font-semibold text-gray-900 relative z-10">
                            <div className="flex items-center">
                              <Calendar className="mr-3 h-5 w-5 text-purple-600" />
                              My Trips
                            </div>
                            <ChevronRight className="h-5 w-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                        </button>

                        {/* Want to be Host - conditionally shown */}
                        {shouldShowHostButton && (
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              router.push("/dashboard/host");
                            }}
                            className="group relative  p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-amber-300/60 hover:shadow-lg"
                          >
                            <span className="flex items-center justify-between text-lg font-semibold text-gray-900 relative z-10">
                              <div className="flex items-center">
                                <Crown className="mr-3 h-5 w-5 text-amber-600" />
                                Want to be Host
                              </div>
                              <ChevronRight className="h-5 w-5 text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                          </button>
                        )}
                      </>
                    )}
                  </nav>

                  {/* Mobile CTA */}
                  <div className="flex flex-col space-y-4 p-6 border-t border-gray-200/60 bg-white/60 backdrop-blur-sm">
                    {status === "unauthenticated" ? (
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          router.push("/auth/signin");
                        }}
                        className="w-full bg-purple-600  hover:bg-purple-700  text-white font-semibold py-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-lg"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Sign In to Continue
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsOpen(false);
                          handleSignOut();
                        }}
                        className="w-full bg-red-50 py-6 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                      </Button>
                    )}
                    <Button
                      className="w-full bg-purple-600  hover:bg-purple-700 flex justify-center items-center text-white font-semibold py-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-105 shadow-lg text-center "
                      onClick={() => {
                        setIsOpen(false);
                        router.push("/trips");
                      }}
                    >
                      <MapPin className="inline mr-2 h-5 w-5" />
                      Explore Trips
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
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
    </header>
  );
}

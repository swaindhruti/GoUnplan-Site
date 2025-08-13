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
  Settings,
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
  FileText
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

  const router = useRouter();
  const pathname = usePathname();

  // Determine text color based on route
  const isBlackText = pathname === "/chat" || pathname === "/contactus";
  const textColorClass = "text-white";

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

  /*   const getDashboardUrl = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "HOST":
        return "/dashboard/host";
      case "USER":
      default:
        return "/dashboard/user";
    }
  }; */

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

  // Simple header styling - consistent for home page
  const homeHeaderClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all overflow-x-hidden duration-500 ease-out
    bg-white/[0.5] backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-black/5
    ${isVisible ? "translate-y-0" : "-translate-y-full"}
  `;

  const otherRoutesHeaderClasses = `
    fixed top-0 left-0 right-0 z-100 overflow-x-hidden transition-all duration-500 ease-out
    bg-black/[0.6] backdrop-blur-lg backdrop-blur-sm
    ${isVisible ? "translate-y-0" : "-translate-y-full"}
  `;

  const shouldShowHostButton =
    status === "authenticated" &&
    session?.user?.role !== "HOST" &&
    session?.user?.role !== "ADMIN";

  // Determine if current user is a host
  const isUserHost =
    session?.user?.role === "HOST" || session?.user?.role === "ADMIN";

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

  // Update host mode state based on current route
  useEffect(() => {
    setIsHostMode(pathname.startsWith("/dashboard/host"));
  }, [pathname]);

  if (!isHomePage) {
    return (
      <div className={otherRoutesHeaderClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Breadcrumb Navigation - Left Side */}
            <div className="flex-1 flex justify-start min-w-0 max-w-full overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2 sm:pr-0">
              <Breadcrumb>
                <BreadcrumbList
                  className={`flex items-center gap-1 sm:gap-2 ${textColorClass} min-w-fit`}
                >
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center min-w-0">
                      <BreadcrumbItem>
                        {crumb.isActive ? (
                          <BreadcrumbPage
                            className={`font-semibold truncate transition-colors duration-300 ${textColorClass}`}
                            style={{ maxWidth: 120 }}
                          >
                            {crumb.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            href={crumb.href}
                            className={`font-medium truncate transition-all duration-300 hover:scale-105 ${textColorClass} ${
                              isBlackText
                                ? "hover:text-black"
                                : "hover:text-white"
                            }`}
                            style={{ maxWidth: 120 }}
                          >
                            <span className="flex items-center">
                              {index === 0 && <Home className="h-4 w-4 mr-2" />}
                              {crumb.label}
                            </span>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator
                          className={`mx-2 text-black/50 transition-colors duration-300 ${textColorClass}`}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </BreadcrumbSeparator>
                      )}
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Menu Button - Right Side */}
            <div className="flex items-center">
              {status === "authenticated" ? (
                <div className="flex items-center space-x-4">
                  {/* Host Mode Toggle - Show outside dropdown for hosts */}
                  {isUserHost && (
                    <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                      <Crown className="h-4 w-4 text-white" />
                      <span className="font-medium text-white text-sm">
                        Host Mode
                      </span>
                      <Switch
                        checked={isHostMode}
                        onCheckedChange={handleHostModeToggle}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  )}

                  <DropdownMenu
                    open={isDashboardMenuOpen}
                    onOpenChange={setIsDashboardMenuOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button className="relative group transition-all duration-300 hover:shadow-lg bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
                        <Menu className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Menu</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl rounded-xl"
                      align="end"
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
                            <p className="text-gray-500 text-xs">
                              {session?.user?.email}
                            </p>
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
                          <Calendar className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                          <span className="font-medium text-gray-900">
                            My Trips
                          </span>
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
                          onClick={() => router.push("/profile/settings")}
                          className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <Settings className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                          <span className="font-medium text-gray-900">
                            Settings
                          </span>
                          <DropdownMenuShortcut className="text-gray-400">
                            ⌘S
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            window.open("/terms-and-conditions.pdf", "_blank")
                          }
                          className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                          <span className="font-medium text-gray-900 ">
                            Terms and Conditions
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open("/privacy-policy.pdf", "_blank")
                          }
                          className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                        >
                          <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                          <span className="font-medium text-gray-900 ">
                            Privacy Policy
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            window.open("/cancellation-policy.pdf", "_blank")
                          }
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
                </div>
              ) : (
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="relative group transition-all duration-300 hover:shadow-lg bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 backdrop-blur-sm"
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

  // Full header for home page - consistent styling, no color changes
  return (
    <header className={homeHeaderClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative bg-white rounded-full shadow-lg">
              <Image
                src="https://res.cloudinary.com/dfe8sdlkc/image/upload/v1754613844/unplan_6_l0vcxr.png"
                alt="GoUnplan Logo"
                width={80}
                height={80}
                className="rounded-full object-cover
        w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
        transition-all duration-300"
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
                className="relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg group hover:scale-105 text-gray-700 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-300"
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
                className="relative group transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-200"
              >
                Sign In
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Host Mode Toggle - Show outside dropdown for hosts */}
                {isUserHost && (
                  <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                    <Crown className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-gray-800 text-sm">
                      Host Mode
                    </span>
                    <Switch
                      checked={isHostMode}
                      onCheckedChange={handleHostModeToggle}
                      className="data-[state=checked]:bg-purple-600"
                    />
                  </div>
                )}

                <DropdownMenu
                  open={isDashboardMenuOpen}
                  onOpenChange={setIsDashboardMenuOpen}
                >
                  <DropdownMenuTrigger asChild>
                    <Button className="relative group transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white/[0.55] hover:bg-gray-50 text-gray-900 border-gray-200 shadow-md ">
                      <Menu className="h-4 w-4 mr-2" />
                      Menu
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/60 shadow-xl rounded-xl"
                    align="end"
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
                          <p className="text-gray-500 text-xs">
                            {session?.user?.email}
                          </p>
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
                        <Calendar className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                        <span className="font-medium text-gray-900">
                          My Trips
                        </span>
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
                        onClick={() => router.push("/profile/settings")}
                        className="flex items-center p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 cursor-pointer group"
                      >
                        <Settings className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                        <span className="font-medium text-gray-900">
                          Settings
                        </span>
                        <DropdownMenuShortcut className="text-gray-400">
                          ⌘S
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() =>
                          window.open("/terms-and-conditions.pdf", "_blank")
                        }
                        className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                      >
                        <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                        <span className="font-medium text-gray-900 ">
                          Terms and Conditions
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open("/privacy-policy.pdf", "_blank")
                        }
                        className="flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer group"
                      >
                        <FileText className="mr-3 h-4 w-4 text-gray-600 group-hover:text-purple-600" />
                        <span className="font-medium text-gray-900 ">
                          Privacy Policy
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          window.open("/cancellation-policy.pdf", "_blank")
                        }
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
                  className="px-3 py-2 font-semibold transition-all duration-300 rounded-lg hover:scale-105 text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="flex items-center space-x-3">
              {status === "unauthenticated" ? (
                <Button
                  onClick={() => router.push("/auth/signin")}
                  className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  onClick={handleSignOut}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-300 hover:border-red-400 transition-all duration-300 hover:scale-105"
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
                  className="transition-all duration-300 hover:scale-110 text-gray-900 hover:bg-gray-100 border-gray-200 border"
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
                  {/* Mobile Header - Fixed close button issue */}

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

                        {/* My Trips */}
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/trips");
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

                        {/* Settings */}
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            router.push("/profile/settings");
                          }}
                          className="group relative  p-4 rounded-2xl transition-all duration-300 hover:scale-105 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-purple-300/60 hover:shadow-lg"
                        >
                          <span className="flex items-center justify-between text-lg font-semibold text-gray-900 relative z-10">
                            <div className="flex items-center">
                              <Settings className="mr-3 h-5 w-5 text-purple-600" />
                              Settings
                            </div>
                            <ChevronRight className="h-5 w-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                        </button>
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
                      <Calendar className="inline mr-2 h-5 w-5" />
                      Plan Your Trip
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

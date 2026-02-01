"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/lib/auth-context";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/app/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, X, Moon, Sun } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import LoadingBar from "react-top-loading-bar";
import logo from "../../public/folionewslogo.png";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  const { user } = useUser();
  const themeContext = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  useEffect(() => {
    setProgress(20);

    setTimeout(() => {
      setProgress(40);
    }, 100);

    setTimeout(() => {
      setProgress(100);
    }, 400);
  }, [pathname]);

  const { theme, toggleTheme } = themeContext;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <LoadingBar
        color="#808080"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 h-18 w-18">
            <Image src={logo} alt="FolioNews" className="drop-shadow-lg" />
            <span className="font-bold text-xl text-shadow-lg">FolioNews</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/")
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Home
              </Button>
            </Link>
            <Link href="/categories">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/categories")
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Categories
              </Button>
            </Link>
            <Link href="/trending">
              <Button
                variant="ghost"
                className={`transition-all duration-300 ${
                  isActive("/trending")
                    ? "text-primary font-semibold bg-primary/10"
                    : "text-foreground hover:text-primary"
                }`}
              >
                Trending
              </Button>
            </Link>
            {user && (
              <Link href="/bookmarks">
                <Button
                  variant="ghost"
                  className={`transition-all duration-300 ${
                    isActive("/bookmarks")
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Bookmarks
                </Button>
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex items-center gap-2"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </form>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={themeContext.toggleTheme}
                className="hover:bg-primary/10"
                aria-label="Toggle theme"
              >
                {themeContext.theme === "light" ? (
                  <Moon className="w-5 h-5 transition-transform duration-300" />
                ) : (
                  <Sun className="w-5 h-5 transition-transform duration-300" />
                )}
              </Button>
            )}
            <div className="flex items-center gap-4">
              <SignedOut>
                {/* Sign In: Minimalist Ghost Style */}
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-slate-700 hover:text-[#322b24] transition-colors cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>

                {/* Sign Up: Primary Action Style */}
                <SignUpButton mode="modal">
                  <button className="bg-[#37322a] hover:bg-[#322b24] text-white rounded-full font-medium text-sm h-10 px-5 transition-all active:scale-95 shadow-sm cursor-pointer">
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <div className="border-l pl-4 border-slate-200">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-10 w-10",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSearch} className="mb-4 mt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </form>
            <div className="flex flex-col gap-2 mb-4">
              <Link href="/" className="w-full">
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/")
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Home
                </Button>
              </Link>
              <Link href="/categories" className="w-full">
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/categories")
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Categories
                </Button>
              </Link>
              <Link href="/trending" className="w-full">
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    isActive("/trending")
                      ? "text-primary font-semibold bg-primary/10"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  Trending
                </Button>
              </Link>
              {user && (
                <Link href="/bookmarks" className="w-full">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-300 ${
                      isActive("/bookmarks")
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-foreground hover:text-primary"
                    }`}
                  >
                    Bookmarks
                  </Button>
                </Link>
              )}
            </div>
            <div className="border-t border-border pt-4 flex flex-col gap-3">
              {mounted && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 bg-transparent"
                  onClick={themeContext.toggleTheme}
                >
                  {themeContext.theme === "light" ? (
                    <>
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      Light Mode
                    </>
                  )}
                </Button>
              )}
              <UserButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

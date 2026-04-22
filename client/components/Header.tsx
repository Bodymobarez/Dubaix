import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
  Globe,
  LayoutDashboard,
  Heart,
  UserCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { language, setLanguage, theme, setTheme, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
            <span className="text-sm font-bold text-white">DX</span>
          </div>
          <span className="hidden font-bold text-foreground sm:inline">
            Dubaix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {t("header.browse")}
          </Link>
          <Link
            to="/categories"
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {t("header.categories")}
          </Link>
          <Link
            to="/sell"
            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            {t("header.selling")}
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden sm:flex flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("header.search")}
              className="w-full rounded-lg border border-border bg-muted pl-10 pr-4 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Actions - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && (
            <Link
              to="/messages"
              className="p-2 hover:bg-muted rounded-lg transition-colors relative group"
            >
              <MessageSquare className="h-5 w-5 text-foreground" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5 text-foreground" />
            ) : (
              <Sun className="h-5 w-5 text-foreground" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="p-2 hover:bg-muted rounded-lg transition-colors text-sm font-semibold"
            title="Toggle Language"
          >
            <Globe className="h-5 w-5 text-foreground" />
          </button>

          {/* Auth-aware section */}
          {isAuthenticated ? (
            <>
              <Link
                to="/post-ad"
                className="btn-secondary gap-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                {t("header.postAd")}
              </Link>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-xs font-bold">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
                    {user?.firstName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 animate-fade-in z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-sm">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      {t("header.dashboard")}
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      {t("header.profile")}
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      {t("header.favorites")}
                    </Link>
                    <hr className="my-2 border-border" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary gap-2 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Search className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card md:hidden animate-slide-in">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder={t("header.search")}
                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {t("header.browse")}
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {t("header.categories")}
            </Link>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              {t("header.selling")}
            </Link>

            <hr className="my-2 border-border" />

            {isAuthenticated ? (
              <>
                {/* User info on mobile */}
                <div className="px-4 py-2 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-xs font-bold">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {t("header.dashboard")}
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center justify-between"
                >
                  {t("header.messages")}
                  <span className="h-2 w-2 bg-destructive rounded-full"></span>
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {t("header.favorites")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            <hr className="my-2 border-border" />

            {/* Theme & Language Toggles - Mobile */}
            <div className="flex gap-2 px-4 py-2">
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="flex-1 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                {theme === "light" ? "Dark" : "Light"}
              </button>

              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="flex-1 px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                title="Toggle Language"
              >
                <Globe className="h-4 w-4" />
                {language === "en" ? "العربية" : "English"}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/post-ad"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary w-full justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("header.postAd")}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-muted rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  {t("header.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/post-ad"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-secondary w-full justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("header.postAd")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

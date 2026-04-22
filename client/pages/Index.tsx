import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import {
  Car,
  Home,
  Wrench,
  Smartphone,
  Zap,
  Heart,
  Star,
  Shield,
  Clock,
  Eye,
  ChevronRight,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  {
    id: 1,
    name: "Motors",
    icon: Car,
    description: "Cars, bikes, and vehicles",
    color: "from-blue-500 to-blue-600",
    count: "12,450",
  },
  {
    id: 2,
    name: "Property",
    icon: Home,
    description: "Rentals and for sale",
    color: "from-emerald-500 to-emerald-600",
    count: "8,320",
  },
  {
    id: 3,
    name: "Services",
    icon: Wrench,
    description: "Professional services",
    color: "from-purple-500 to-purple-600",
    count: "5,890",
  },
  {
    id: 4,
    name: "Electronics",
    icon: Smartphone,
    description: "Gadgets and devices",
    color: "from-pink-500 to-pink-600",
    count: "18,670",
  },
  {
    id: 5,
    name: "Furniture",
    icon: Home,
    description: "Home and office",
    color: "from-orange-500 to-orange-600",
    count: "7,245",
  },
  {
    id: 6,
    name: "Jobs",
    icon: Zap,
    description: "Career opportunities",
    color: "from-indigo-500 to-indigo-600",
    count: "3,120",
  },
];

const FEATURED_LISTINGS = [
  {
    id: 1,
    title: "2023 Toyota Land Cruiser",
    price: "AED 185,000",
    location: "Dubai Marina, Dubai",
    category: "Motors",
    image:
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=400&h=300&fit=crop",
    verified: true,
    rating: 4.8,
    views: 2451,
    saved: 145,
  },
  {
    id: 2,
    title: "Luxury Apartment in Downtown",
    price: "AED 3.2M",
    location: "Downtown Dubai, Dubai",
    category: "Property",
    image:
      "https://images.unsplash.com/photo-1545457529-d1e8a9a2cc8f?w=400&h=300&fit=crop",
    verified: true,
    rating: 4.9,
    views: 5678,
    saved: 342,
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max 256GB",
    price: "AED 4,299",
    location: "Al Baraha, Dubai",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1592286927505-1def25115558?w=400&h=300&fit=crop",
    verified: true,
    rating: 4.7,
    views: 8901,
    saved: 521,
  },
  {
    id: 4,
    title: "Professional Web Development Services",
    price: "AED 150 - 500/hour",
    location: "Abu Dhabi, UAE",
    category: "Services",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    verified: true,
    rating: 5.0,
    views: 3412,
    saved: 234,
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t } = useLanguage();

  // Fetch featured listings from API
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ["featuredListings"],
    queryFn: async () => {
      const response = await fetch("/api/listings/featured");
      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
    // Don't retry if API is unavailable (e.g. Prisma not installed)
    retry: false,
    // Use mock data as placeholder while API is unavailable
    placeholderData: {
      listings: FEATURED_LISTINGS,
    },
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        {/* Hero Section */}
        <section className="container mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="space-y-8">
            {/* Hero Content */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t("home.title")}{" "}
                <span className="gradient-text">{t("home.titleHighlight")}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t("home.subtitle")}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t("home.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-4 pl-12 py-4 text-base placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                />
              </div>
              <button className="btn-primary whitespace-nowrap gap-2">
                {t("home.search")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("home.popular")}</span>
              </div>
              {["Toyota", "iPhone", "Apartments", "Services"].map(
                (filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-muted text-foreground hover:bg-muted/80 hover:border-primary border border-transparent transition-all"
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-t border-border py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {t("home.categories")}
                </h2>
                <p className="text-muted-foreground">
                  {t("home.categoriesSubtitle")}
                </p>
              </div>
              <Link
                to="/categories"
                className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
              >
                {t("home.viewAll")} <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                    ></div>

                    <div className="relative space-y-3">
                      <div
                        className={`inline-flex rounded-lg bg-gradient-to-br ${category.color} p-3`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>

                      <div className="text-left">
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border">
                        <p className="text-sm font-semibold text-primary">
                          {category.count} listings
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Link
              to="/categories"
              className="mt-8 flex md:hidden btn-outline w-full justify-center"
            >
              {t("home.viewAll")} {t("home.categories").toLowerCase()}
            </Link>
          </div>
        </section>

        {/* Featured Listings Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {t("home.featured")}
                </h2>
                <p className="text-muted-foreground">
                  {t("home.featuredSubtitle")}
                </p>
              </div>
              <Link
                to="/listings"
                className="hidden md:flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
              >
                {t("home.viewAll")} <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {isFeaturedLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(featuredData?.listings || FEATURED_LISTINGS).map((listing: any) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="group card-hover rounded-lg border border-border bg-card overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                    <img
                      src={listing.images?.[0] || listing.image || "https://via.placeholder.com/400x300"}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {(listing.verified || listing.seller?.isVerifiedSeller) && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-success/90 text-success-foreground px-2.5 py-1 text-xs font-semibold backdrop-blur">
                          <Shield className="h-3 w-3" />
                          {t("home.verified")}
                        </div>
                      )}
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background transition-all backdrop-blur"
                    >
                      <Heart className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                    </button>

                    {/* Stats */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-white text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.views.toLocaleString()} {t("home.views")}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {listing.location}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(listing.seller?.rating || listing.rating || 4)
                                ? "fill-warning text-warning"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {(listing.seller?.rating || listing.rating || 4).toFixed(1)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-t border-border">
                      <p className="text-lg font-bold text-primary">
                        {listing.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="border-t border-border py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {t("home.trusted")}
              </h2>
              <p className="text-muted-foreground">
                {t("home.trustedSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  titleKey: "home.verifiedSellers",
                  descKey: "home.verifiedSellersDesc",
                },
                {
                  icon: Clock,
                  titleKey: "home.fastSecure",
                  descKey: "home.fastSecureDesc",
                },
                {
                  icon: Star,
                  titleKey: "home.reviews",
                  descKey: "home.reviewsDesc",
                },
                {
                  icon: Eye,
                  titleKey: "home.monitoring",
                  descKey: "home.monitoringDesc",
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-border bg-card p-6 text-center"
                  >
                    <div className="mb-4 flex justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.descKey)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t("home.cta")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("home.ctaDesc")}
              </p>

              <Link to="/post-ad" className="btn-secondary gap-2 inline-flex">
                <ArrowRight className="h-4 w-4" />
                {t("home.ctaButton")}
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">{t("home.footerBrowse")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerAllCategories")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerFeatured")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerRecent")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t("home.footerSell")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/post-ad" className="hover:text-foreground transition-colors">
                    {t("home.footerPostAd")}
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-foreground transition-colors">
                    {t("home.footerMyListings")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerPricing")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t("home.footerSupport")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerHelpCenter")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerSafetyTips")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerContact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">{t("home.footerLegal")}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerTerms")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerPrivacy")}
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-foreground transition-colors">
                    {t("home.footerCookie")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                  <span className="text-xs font-bold text-white">DX</span>
                </div>
                <span className="font-bold">Dubaix</span>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t("home.footerCopyright")}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

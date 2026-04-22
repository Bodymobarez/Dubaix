import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "ar";
export type Theme = "light" | "dark";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.browse": "Browse",
    "header.categories": "Categories",
    "header.selling": "Selling?",
    "header.search": "Search listings...",
    "header.postAd": "Post Ad",
    "header.dashboard": "My Dashboard",
    "header.profile": "My Profile",
    "header.favorites": "Saved Listings",
    "header.logout": "Logout",
    "header.messages": "Messages",

    // Home
    "home.title": "Buy and Sell Anything in the",
    "home.titleHighlight": "UAE",
    "home.subtitle":
      "Connect with millions of buyers and sellers. Fast, safe, and easy. No hidden fees.",
    "home.searchPlaceholder": "Search Toyota, iPhone, apartment...",
    "home.search": "Search",
    "home.popular": "Popular:",
    "home.categories": "Browse Categories",
    "home.categoriesSubtitle": "Explore what's trending in your area",
    "home.viewAll": "View all",
    "home.featured": "Featured Listings",
    "home.featuredSubtitle": "Handpicked deals updated daily",
    "home.motors": "Motors",
    "home.motorsDesc": "Cars, bikes, and vehicles",
    "home.property": "Property",
    "home.propertyDesc": "Rentals and for sale",
    "home.services": "Services",
    "home.servicesDesc": "Professional services",
    "home.electronics": "Electronics",
    "home.electronicsDesc": "Gadgets and devices",
    "home.furniture": "Furniture",
    "home.furnitureDesc": "Home and office",
    "home.jobs": "Jobs",
    "home.jobsDesc": "Career opportunities",
    "home.listings": "listings",
    "home.verified": "Verified",
    "home.views": "views",
    "home.trusted": "Trusted & Safe",
    "home.trustedSubtitle": "Your security is our priority",
    "home.verifiedSellers": "Verified Sellers",
    "home.verifiedSellersDesc": "All sellers are verified and rated by the community",
    "home.fastSecure": "Fast & Secure",
    "home.fastSecureDesc": "Quick transactions with buyer protection",
    "home.reviews": "Reviews & Ratings",
    "home.reviewsDesc": "Real feedback from real buyers and sellers",
    "home.monitoring": "24/7 Monitoring",
    "home.monitoringDesc": "Our team monitors listings to prevent fraud",
    "home.cta": "Ready to Sell?",
    "home.ctaDesc":
      "Post your first ad in seconds. Reach millions of potential buyers across the UAE with no listing fees.",
    "home.ctaButton": "Post Your First Ad",
    "home.footerBrowse": "Browse",
    "home.footerAllCategories": "All Categories",
    "home.footerFeatured": "Featured Listings",
    "home.footerRecent": "Recent Listings",
    "home.footerSell": "Sell",
    "home.footerPostAd": "Post an Ad",
    "home.footerMyListings": "My Listings",
    "home.footerPricing": "Pricing",
    "home.footerSupport": "Support",
    "home.footerHelpCenter": "Help Center",
    "home.footerSafetyTips": "Safety Tips",
    "home.footerContact": "Contact Us",
    "home.footerLegal": "Legal",
    "home.footerTerms": "Terms of Service",
    "home.footerPrivacy": "Privacy Policy",
    "home.footerCookie": "Cookie Policy",
    "home.footerCopyright": "© 2024 Dubaix. All rights reserved. Made in Dubai.",

    // Listing Detail
    "listing.postedBy": "Posted",
    "listing.specifications": "Specifications",
    "listing.description": "Description",
    "listing.staySafe": "Stay Safe",
    "listing.safetyTip1": "Never pay before you see and inspect the item in person",
    "listing.safetyTip2": "Only meet in safe, public places",
    "listing.safetyTip3": "Check the authenticity of documents",
    "listing.safetyTip4": "Pay only after receiving the item",
    "listing.safetyTip5": "Report suspicious listings or sellers immediately",
    "listing.sellerInfo": "Seller Information",
    "listing.verified": "Verified Seller",
    "listing.responds": "Responds",
    "listing.viewOtherListings": "View Other Listings",
    "listing.sendMessage": "Send Message",
    "listing.showPhone": "Show Phone Number",
    "listing.save": "Save",
    "listing.share": "Share",
    "listing.report": "Report Listing",
    "listing.secureTrade": "Secure Trading",
    "listing.secureTradeDesc": "Protected buyer and seller",
    "listing.activeCommunity": "Active Community",
    "listing.activeCommunityDesc": "Millions of trusted users",
    "listing.moreListings": "More",
    "listing.moreListingsDesc": "Check out these similar listings",
    "listing.reviews": "reviews",

    // Post Ad Page
    "postAd.title": "Post Your Ad",
    "postAd.subtitle": "Step {step} of 5",
    "postAd.step1": "Basic Info",
    "postAd.step2": "Details",
    "postAd.step3": "Images",
    "postAd.step4": "Location",
    "postAd.step5": "Review",
    "postAd.category": "Category",
    "postAd.categoryPlaceholder": "Select a category",
    "postAd.itemTitle": "Title",
    "postAd.itemTitlePlaceholder": "e.g., 2023 Toyota Land Cruiser",
    "postAd.price": "Price (AED)",
    "postAd.pricePlaceholder": "e.g., 185000",
    "postAd.description": "Description",
    "postAd.descriptionPlaceholder": "Describe your item in detail...",
    "postAd.images": "Upload Images (Up to 25)",
    "postAd.uploadText": "Click to upload or drag and drop",
    "postAd.uploadSubtext": "PNG, JPG, GIF up to 10MB",
    "postAd.location": "Location",
    "postAd.locationPlaceholder": "e.g., Dubai Marina, Dubai",
    "postAd.locationTips": "Location Tips:",
    "postAd.back": "Back",
    "postAd.next": "Next",
    "postAd.post": "Post Your Ad",
    "postAd.posting": "Posting...",
    "postAd.readyToPost": "Ready to post?",
    "postAd.readyDesc": "Your ad will be live immediately and visible to millions of buyers.",

    // Dashboard Page
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Welcome back! Here's your marketplace overview",
    "dashboard.postNew": "Post New Ad",
    "dashboard.activeListings": "Active Listings",
    "dashboard.soldItems": "Sold Items",
    "dashboard.totalViews": "Total Views",
    "dashboard.messages": "Messages",
    "dashboard.savedItems": "Saved Items",
    "dashboard.sellerProfile": "Seller Profile",
    "dashboard.verified": "Verified Seller",
    "dashboard.verifiedDesc": "Your account is fully verified",
    "dashboard.rating": "Rating",
    "dashboard.viewProfile": "View Profile",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.manage": "Manage Listings",
    "dashboard.thisMonth": "This Month",
    "dashboard.adsPosted": "Ads Posted",
    "dashboard.itemsSold": "Items Sold",
    "dashboard.yourListings": "Your Listings",
    "dashboard.active": "Active",
    "dashboard.sold": "Sold",
    "dashboard.all": "All",
    "dashboard.listing": "Listing",
    "dashboard.price": "Price",
    "dashboard.status": "Status",
    "dashboard.stats": "Stats",
    "dashboard.actions": "Actions",
    "dashboard.edit": "Edit",
    "dashboard.delete": "Delete",
    "dashboard.previous": "Previous",
    "dashboard.next": "Next",
  },
  ar: {
    // Header
    "header.browse": "تصفح",
    "header.categories": "الفئات",
    "header.selling": "هل تريد البيع؟",
    "header.search": "البحث في الإعلانات...",
    "header.postAd": "نشر إعلان",
    "header.dashboard": "لوحة تحكمي",
    "header.profile": "ملفي الشخصي",
    "header.favorites": "قوائمي المحفوظة",
    "header.logout": "تسجيل الخروج",
    "header.messages": "الرسائل",

    // Home
    "home.title": "اشتري وبع أي شيء في",
    "home.titleHighlight": "الإمارات",
    "home.subtitle":
      "تواصل مع ملايين المشترين والبائعين. سريع وآمن وسهل. لا توجد رسوم مخفية.",
    "home.searchPlaceholder": "ابحث عن تويوتا أو آيفون أو شقة...",
    "home.search": "بحث",
    "home.popular": "شهير:",
    "home.categories": "تصفح الفئات",
    "home.categoriesSubtitle": "استكشف ما هو رائج في منطقتك",
    "home.viewAll": "عرض الكل",
    "home.featured": "الإعلانات المميزة",
    "home.featuredSubtitle": "عروض مختارة يتم تحديثها يوميًا",
    "home.motors": "السيارات",
    "home.motorsDesc": "السيارات والدراجات والمركبات",
    "home.property": "العقارات",
    "home.propertyDesc": "الإيجار والبيع",
    "home.services": "الخدمات",
    "home.servicesDesc": "الخدمات الاحترافية",
    "home.electronics": "الإلكترونيات",
    "home.electronicsDesc": "الأجهزة والأدوات",
    "home.furniture": "الأثاث",
    "home.furnitureDesc": "الأثاث المنزلي والمكتبي",
    "home.jobs": "الوظائف",
    "home.jobsDesc": "فرص العمل",
    "home.listings": "قائمة إعلانات",
    "home.verified": "موثق",
    "home.views": "مشاهدات",
    "home.trusted": "موثوق وآمن",
    "home.trustedSubtitle": "أمانك هو أولويتنا",
    "home.verifiedSellers": "بائعون موثقون",
    "home.verifiedSellersDesc": "جميع البائعين موثقون ومقيمون من المجتمع",
    "home.fastSecure": "سريع وآمن",
    "home.fastSecureDesc": "معاملات سريعة مع حماية المشترين",
    "home.reviews": "التقييمات والمراجعات",
    "home.reviewsDesc": "ملاحظات حقيقية من المشترين والبائعين الحقيقيين",
    "home.monitoring": "المراقبة 24/7",
    "home.monitoringDesc": "فريقنا يراقب الإعلانات لمنع الاحتيال",
    "home.cta": "هل أنت مستعد للبيع؟",
    "home.ctaDesc":
      "انشر إعلانك الأول في ثوانٍ. وصل إلى ملايين المشترين المحتملين في جميع أنحاء الإمارات دون رسوم الإعلان.",
    "home.ctaButton": "انشر إعلانك الأول",
    "home.footerBrowse": "تصفح",
    "home.footerAllCategories": "جميع الفئات",
    "home.footerFeatured": "الإعلانات المميزة",
    "home.footerRecent": "الإعلانات الأخيرة",
    "home.footerSell": "بيع",
    "home.footerPostAd": "انشر إعلان",
    "home.footerMyListings": "إعلاناتي",
    "home.footerPricing": "الأسعار",
    "home.footerSupport": "الدعم",
    "home.footerHelpCenter": "مركز المساعدة",
    "home.footerSafetyTips": "نصائح الأمان",
    "home.footerContact": "اتصل بنا",
    "home.footerLegal": "قانوني",
    "home.footerTerms": "شروط الخدمة",
    "home.footerPrivacy": "سياسة الخصوصية",
    "home.footerCookie": "سياسة ملفات تعريف الارتباط",
    "home.footerCopyright": "© 2024 دبايكس. جميع الحقوق محفوظة. صُنع في دبي.",

    // Listing Detail
    "listing.postedBy": "تم النشر",
    "listing.specifications": "المواصفات",
    "listing.description": "الوصف",
    "listing.staySafe": "ابقَ آمنًا",
    "listing.safetyTip1": "لا تدفع أبدًا قبل أن ترى وتفتش العنصر شخصيًا",
    "listing.safetyTip2": "التقِ فقط في أماكن آمنة وعامة",
    "listing.safetyTip3": "تحقق من أصالة المستندات",
    "listing.safetyTip4": "ادفع فقط بعد استقبال العنصر",
    "listing.safetyTip5": "أبلغ عن الإعلانات أو البائعين المريبين على الفور",
    "listing.sellerInfo": "معلومات البائع",
    "listing.verified": "بائع موثق",
    "listing.responds": "يرد",
    "listing.viewOtherListings": "عرض الإعلانات الأخرى",
    "listing.sendMessage": "إرسال رسالة",
    "listing.showPhone": "إظهار رقم الهاتف",
    "listing.save": "حفظ",
    "listing.share": "مشاركة",
    "listing.report": "الإبلاغ عن الإعلان",
    "listing.secureTrade": "التجارة الآمنة",
    "listing.secureTradeDesc": "حماية المشتري والبائع",
    "listing.activeCommunity": "المجتمع النشط",
    "listing.activeCommunityDesc": "ملايين المستخدمين الموثوقين",
    "listing.moreListings": "أكثر",
    "listing.moreListingsDesc": "تحقق من هذه الإعلانات المشابهة",
    "listing.reviews": "تقييمات",

    // Post Ad Page
    "postAd.title": "نشر إعلانك",
    "postAd.subtitle": "الخطوة {step} من 5",
    "postAd.step1": "المعلومات الأساسية",
    "postAd.step2": "التفاصيل",
    "postAd.step3": "الصور",
    "postAd.step4": "الموقع",
    "postAd.step5": "المراجعة",
    "postAd.category": "الفئة",
    "postAd.categoryPlaceholder": "اختر فئة",
    "postAd.itemTitle": "العنوان",
    "postAd.itemTitlePlaceholder": "مثال: تويوتا لاند كروزر 2023",
    "postAd.price": "السعر (درهم)",
    "postAd.pricePlaceholder": "مثال: 185000",
    "postAd.description": "الوصف",
    "postAd.descriptionPlaceholder": "صف العنصر بالتفصيل...",
    "postAd.images": "تحميل الصور (حتى 5)",
    "postAd.uploadText": "انقر للتحميل أو اسحب وأفلت",
    "postAd.uploadSubtext": "PNG, JPG, GIF حتى 10MB",
    "postAd.location": "الموقع",
    "postAd.locationPlaceholder": "مثال: جزيرة نخلة، دبي",
    "postAd.locationTips": "نصائح الموقع:",
    "postAd.back": "السابق",
    "postAd.next": "التالي",
    "postAd.post": "نشر إعلانك",
    "postAd.posting": "جاري النشر...",
    "postAd.readyToPost": "هل أنت مستعد للنشر؟",
    "postAd.readyDesc": "سيكون إعلانك مباشرًا ومرئيًا لملايين المشترين.",

    // Dashboard Page
    "dashboard.title": "لوحة التحكم",
    "dashboard.subtitle": "أهلا وسهلا! إليك نظرة عامة على السوق",
    "dashboard.postNew": "نشر إعلان جديد",
    "dashboard.activeListings": "الإعلانات النشطة",
    "dashboard.soldItems": "العناصر المباعة",
    "dashboard.totalViews": "إجمالي المشاهدات",
    "dashboard.messages": "الرسائل",
    "dashboard.savedItems": "العناصر المحفوظة",
    "dashboard.sellerProfile": "ملف البائع",
    "dashboard.verified": "بائع موثق",
    "dashboard.verifiedDesc": "تم التحقق من حسابك بالكامل",
    "dashboard.rating": "التقييم",
    "dashboard.viewProfile": "عرض الملف الشخصي",
    "dashboard.quickActions": "الإجراءات السريعة",
    "dashboard.manage": "إدارة الإعلانات",
    "dashboard.thisMonth": "هذا الشهر",
    "dashboard.adsPosted": "الإعلانات المنشورة",
    "dashboard.itemsSold": "العناصر المباعة",
    "dashboard.yourListings": "إعلاناتك",
    "dashboard.active": "نشط",
    "dashboard.sold": "مباع",
    "dashboard.all": "الكل",
    "dashboard.listing": "الإعلان",
    "dashboard.price": "السعر",
    "dashboard.status": "الحالة",
    "dashboard.stats": "الإحصائيات",
    "dashboard.actions": "الإجراءات",
    "dashboard.edit": "تحرير",
    "dashboard.delete": "حذف",
    "dashboard.previous": "السابق",
    "dashboard.next": "التالي",
  },
};

// Initialize state synchronously from localStorage
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("language") as Language;
  return saved || "en";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme") as Theme;
  if (saved) return saved;

  const systemDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return systemDarkMode ? "dark" : "light";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply theme and language on mount
  useEffect(() => {
    applyTheme(theme);
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, theme]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (theme: Theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, theme, setTheme, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

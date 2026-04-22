import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { useQuery } from "@tanstack/react-query";
import {
  Star,
  Shield,
  MapPin,
  Heart,
  Share2,
  Flag,
  Clock,
  Users,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface ListingDetailsType {
  id: string;
  title: string;
  price: string;
  location: string;
  category: string;
  description: string;
  images: string[];
  postedDate: string;
  views: number;
  
  seller: {
    name: string;
    rating: number;
    reviews: number;
    verified: boolean;
    responseTime: string;
    phone: string;
    joinedDate: string;
  };
  
  specifications: {
    make: string;
    model: string;
    year: string;
    mileage: string;
    transmission: string;
    fuel: string;
  };
  
  relatedListings: Array<{
    id: string;
    title: string;
    price: string;
    image: string;
    location: string;
  }>;
}

// Mock data - in real app would come from API
const mockListing: ListingDetailsType = {
  id: "1",
  title: "2023 Toyota Land Cruiser - Immaculate Condition",
  price: "AED 185,000",
  location: "Dubai Marina, Dubai",
  category: "Motors",
  description: `Immaculate 2023 Toyota Land Cruiser with only 15,000 km on the odometer. Fully serviced, all original parts, never been in accident. Comes with full warranty transfer, insurance valid until Dec 2024.

Features:
• Panoramic sunroof
• Premium leather interior
• Advanced safety features
• Bluetooth connectivity
• Rear camera and sensors
• Cruise control
• Climate control

The vehicle is in perfect condition, regularly maintained at authorized service center. Serious inquiries only. All documents are clear.

Viewing by appointment. Contact for more details.`,
  images: [
    "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519641471654-76ce0107795f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581917694597-4b9ff45b0fb0?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1594894292054-b51450e91bf2?w=800&h=600&fit=crop",
  ],
  postedDate: "2 days ago",
  views: 2451,
  
  seller: {
    name: "Ahmed Al Mazrouei",
    rating: 4.8,
    reviews: 127,
    verified: true,
    responseTime: "Within 1 hour",
    phone: "+971 50 XXX XXXX",
    joinedDate: "Joined 2 years ago",
  },
  
  specifications: {
    make: "Toyota",
    model: "Land Cruiser",
    year: "2023",
    mileage: "15,000 km",
    transmission: "Automatic",
    fuel: "Petrol",
  },
  
  relatedListings: [
    {
      id: "2",
      title: "2022 Toyota Camry",
      price: "AED 95,000",
      image: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=400&h=300&fit=crop",
      location: "Abu Dhabi",
    },
    {
      id: "3",
      title: "2023 Honda Accord",
      price: "AED 120,000",
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107795f?w=400&h=300&fit=crop",
      location: "Dubai",
    },
    {
      id: "4",
      title: "2024 Nissan Patrol",
      price: "AED 210,000",
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop",
      location: "Dubai",
    },
  ],
};

export default function ListingDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Fetch listing details from API
  const { data: listingData, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!id) throw new Error("No listing ID provided");
      const response = await fetch(`/api/listings/${id}`);
      if (!response.ok) throw new Error("Failed to fetch listing");
      return response.json();
    },
    // Fallback to mock data if API fails
    fallbackData: {
      listing: mockListing,
      relatedListings: mockListing.relatedListings,
      seller: mockListing.seller,
    },
  });

  const listing = listingData?.listing || mockListing;

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-muted/30 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load listing</p>
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/categories" className="hover:text-foreground">
              {listing.category}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium line-clamp-1">
              {listing.title}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Main Image */}
                <div className="relative bg-black aspect-video lg:aspect-square">
                  <img
                    src={listing.images[currentImageIndex]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  <button
                    onClick={goToPreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-all backdrop-blur z-10"
                  >
                    <ChevronLeft className="h-5 w-5 text-foreground" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-all backdrop-blur z-10"
                  >
                    <ChevronRight className="h-5 w-5 text-foreground" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-background/80 text-foreground px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
                    {currentImageIndex + 1} / {listing.images.length}
                  </div>

                  {/* Verified Badge */}
                  {listing.seller.verified && (
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-success text-success-foreground px-3 py-1 text-sm font-semibold">
                      <Shield className="h-4 w-4" />
                      Verified Seller
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                <div className="bg-card border-t border-border overflow-x-auto">
                  <div className="flex gap-2 p-4">
                    {listing.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                          currentImageIndex === index
                            ? "border-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Listing Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {listing.category} • Posted {listing.postedDate}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    {listing.title}
                  </h1>
                  <p className="text-4xl font-bold text-primary">
                    {listing.price}
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{listing.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.views.toLocaleString()} views
                    </p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(listing.specifications).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-muted-foreground capitalize">
                          {key}
                        </p>
                        <p className="font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Description</h3>
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Safety Tips */}
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-3 text-warning">
                    Stay Safe
                  </h3>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li>
                      • Never pay before you see and inspect the item in person
                    </li>
                    <li>• Only meet in safe, public places</li>
                    <li>• Check the authenticity of documents</li>
                    <li>• Pay only after receiving the item</li>
                    <li>
                      • Report suspicious listings or sellers immediately
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Seller Info and CTA */}
            <div className="space-y-6">
              {/* Seller Card */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-lg">Seller Information</h3>

                {/* Seller Profile */}
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-lg">{listing.seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.seller.joinedDate}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(listing.seller.rating)
                              ? "fill-warning text-warning"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {listing.seller.rating} ({listing.seller.reviews} reviews)
                    </span>
                  </div>

                  {/* Verification */}
                  {listing.seller.verified && (
                    <div className="flex items-center gap-2 text-success text-sm">
                      <Shield className="h-4 w-4" />
                      Verified Seller
                    </div>
                  )}

                  {/* Response Time */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Responds {listing.seller.responseTime}
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  {/* View Seller Listings */}
                  <button className="btn-outline w-full text-sm">
                    View Other Listings
                  </button>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button className="btn-primary w-full gap-2 justify-center">
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </button>
                <button className="btn-secondary w-full gap-2 justify-center">
                  <Phone className="h-4 w-4" />
                  Show Phone Number
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-medium transition-all ${
                      isSaved
                        ? "bg-destructive/10 border-destructive text-destructive"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                    <span className="hidden sm:inline">Save</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary font-medium transition-all">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Report Listing */}
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-destructive hover:bg-destructive/10 font-medium transition-all">
                  <Flag className="h-4 w-4" />
                  Report Listing
                </button>
              </div>

              {/* Trust Badges */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Secure Trading</p>
                    <p className="text-muted-foreground">
                      Protected buyer and seller
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold">Active Community</p>
                    <p className="text-muted-foreground">
                      Millions of trusted users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Listings */}
          <section className="mt-16 space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                More {listing.category} Listings
              </h2>
              <p className="text-muted-foreground">
                Check out these similar listings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(listingData?.relatedListings || mockListing.relatedListings).map((item: any) => (
                <Link
                  key={item.id}
                  to={`/listing/${item.id}`}
                  className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                    <p className="text-lg font-bold text-primary">{item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

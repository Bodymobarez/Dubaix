import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Star,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="bg-card border border-border rounded-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-3 bg-primary/10 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const { t } = useLanguage();
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  // Fetch user's listings from the API
  const {
    data: listingsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myListings", statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await fetch(`/api/my-listings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
    enabled: !!token,
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(`/api/my-listings/${listingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete listing");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });

  // Update status mutation
  const statusMutation = useMutation({
    mutationFn: async ({
      listingId,
      status,
    }: {
      listingId: string;
      status: string;
    }) => {
      const response = await fetch(`/api/my-listings/${listingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myListings"] });
    },
  });

  const listings = listingsData?.listings || [];
  const totalListings = listingsData?.total || 0;

  // Calculate stats from fetched data
  const activeCount = listings.filter(
    (l: any) => l.status === "active"
  ).length;
  const soldCount = listings.filter((l: any) => l.status === "sold").length;
  const totalViews = listings.reduce(
    (sum: number, l: any) => sum + (l.views || 0),
    0
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.firstName}! Here's your marketplace
                overview
              </p>
            </div>
            <Link to="/post-ad" className="btn-secondary gap-2">
              <Plus className="h-4 w-4" />
              Post New Ad
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <StatCard
              icon={TrendingUp}
              label="Active Listings"
              value={activeCount}
            />
            <StatCard
              icon={CheckCircle}
              label="Sold Items"
              value={soldCount}
            />
            <StatCard
              icon={Eye}
              label="Total Views"
              value={totalViews.toLocaleString()}
            />
            <StatCard
              icon={Star}
              label="Rating"
              value={user?.rating?.toFixed(1) || "5.0"}
            />
          </div>

          {/* Seller Info & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Seller Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Seller Profile</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">
                      {user?.isVerifiedSeller
                        ? "Verified Seller"
                        : "Standard Seller"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.isVerifiedSeller
                        ? "Your account is fully verified"
                        : "Complete verification for a badge"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">
                      Rating: {user?.rating?.toFixed(1) || "5.0"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.totalReviews || 0} reviews
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <Link
                    to="/profile"
                    className="w-full px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm text-center block"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <Link
                  to="/post-ad"
                  className="block w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm text-center"
                >
                  Post New Ad
                </Link>
                <button
                  onClick={() => setStatusFilter("active")}
                  className="w-full px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm"
                >
                  Manage Listings
                </button>
                <Link
                  to="/messages"
                  className="block w-full px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors font-medium text-sm text-center"
                >
                  View Messages
                </Link>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Overview</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Listings</span>
                    <span className="text-lg font-bold">{totalListings}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (totalListings / 10) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Items Sold</span>
                    <span className="text-lg font-bold">{soldCount}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success transition-all"
                      style={{
                        width: `${
                          totalListings > 0
                            ? (soldCount / totalListings) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Views</span>
                    <span className="text-lg font-bold">
                      {totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (totalViews / 10000) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg">Your Listings</h3>
              <div className="flex gap-2">
                {["all", "active", "sold"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      statusFilter === filter
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mb-2" />
                <p>Failed to load listings</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
                <p className="font-medium mb-2">No listings yet</p>
                <p className="text-sm mb-4">
                  Start selling by posting your first ad
                </p>
                <Link to="/post-ad" className="btn-primary gap-2">
                  <Plus className="h-4 w-4" />
                  Post Your First Ad
                </Link>
              </div>
            ) : (
              <>
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b border-border">
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Listing
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">
                          Views
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map((listing: any) => (
                        <tr
                          key={listing.id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {listing.images?.[0] ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <Link
                                  to={`/listing/${listing.id}`}
                                  className="font-medium line-clamp-1 hover:text-primary transition-colors"
                                >
                                  {listing.title}
                                </Link>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    listing.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold">
                              AED{" "}
                              {typeof listing.price === "number"
                                ? listing.price.toLocaleString()
                                : listing.price}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                listing.status === "active"
                                  ? "bg-success/10 text-success"
                                  : listing.status === "sold"
                                  ? "bg-muted text-muted-foreground"
                                  : "bg-warning/10 text-warning"
                              }`}
                            >
                              <CheckCircle className="h-3 w-3" />
                              {listing.status.charAt(0).toUpperCase() +
                                listing.status.slice(1)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              {(listing.views || 0).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {listing.status === "active" && (
                                <button
                                  onClick={() =>
                                    statusMutation.mutate({
                                      listingId: listing.id,
                                      status: "sold",
                                    })
                                  }
                                  className="px-3 py-1 text-xs rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors font-medium"
                                >
                                  Mark Sold
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  deleteMutation.mutate(listing.id)
                                }
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Info */}
                <div className="p-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {listings.length} of {totalListings} listings
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

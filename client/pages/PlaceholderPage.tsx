import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { ArrowLeft, Lightbulb } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
        <div className="container mx-auto max-w-3xl px-4 py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>

          {/* Placeholder Content */}
          <div className="rounded-xl border border-border bg-card p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <Lightbulb className="h-12 w-12 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              <p className="text-lg text-muted-foreground">
                This page is coming soon. Check back soon for updates!
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left max-w-md mx-auto">
              <p className="text-sm font-semibold text-primary">
                💡 Want to see this page built out?
              </p>
              <p className="text-sm text-muted-foreground">
                Prompt the AI to generate the full content for this page. We've
                built the foundation, and you can customize it with any specific
                features or design you'd like.
              </p>
            </div>

            {/* Suggested Next Steps */}
            <div className="space-y-4">
              <p className="font-semibold">Try asking the AI to build:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {getPageSuggestions(title).map((suggestion, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground border border-border hover:border-primary transition-colors cursor-default"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>

            {/* Home Button */}
            <div className="pt-6">
              <a href="/" className="btn-primary inline-flex gap-2">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function getPageSuggestions(title: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    Categories: [
      "Category grid with filtering",
      "Category statistics",
      "Popular items per category",
    ],
    "All Listings": [
      "Advanced search filters",
      "Grid view with sorting",
      "Save and compare listings",
    ],
    "Selling Guide": [
      "Step-by-step guide",
      "Best practices section",
      "Pricing tips",
    ],
    "Post Your Ad": [
      "Multi-step form wizard",
      "Image upload area",
      "Category-specific fields",
    ],
    "My Dashboard": [
      "Stats overview",
      "Recent listings",
      "Earnings report",
      "Messages overview",
    ],
    Messages: ["Conversation list", "Message search", "Notification system"],
    "My Profile": [
      "Seller rating section",
      "Verification status",
      "Edit profile form",
    ],
    "Saved Listings": [
      "Organized by category",
      "Price tracking",
      "Bulk actions",
    ],
  };

  return suggestions[title] || [
    "Feature A",
    "Feature B",
    "Feature C",
  ];
}

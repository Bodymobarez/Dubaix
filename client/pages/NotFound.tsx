import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-muted/30">
        <div className="text-center px-4 space-y-6">
          <div className="flex justify-center">
            <div className="text-6xl md:text-8xl font-bold text-muted">
              404
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Page Not Found
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist. It might have been
              removed or the URL is incorrect.
            </p>
          </div>
          <div className="pt-4">
            <a href="/" className="btn-primary gap-2 inline-flex">
              <Home className="h-4 w-4" />
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

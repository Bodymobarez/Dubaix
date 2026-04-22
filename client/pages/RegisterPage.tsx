import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@shared/api";
import { z } from "zod";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

const registerFormSchema = registerSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormInput = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { register: authRegister, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
  });

  // Redirect if already logged in
  if (isAuthenticated && !success) {
    navigate("/dashboard");
    return null;
  }

  const onSubmit = async (data: RegisterFormInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword: _, ...registerData } = data;
      await authRegister(registerData);
      setSuccess(true);

      // Redirect after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-success/10 p-6">
                <CheckCircle2 className="h-12 w-12 text-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold">Account Created!</h2>
            <p className="text-muted-foreground">
              Welcome to Dubaix. Redirecting to your dashboard...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary">
                <span className="text-sm font-bold text-white">DX</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join millions of buyers and sellers
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="John"
                    {...register("firstName")}
                    className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Doe"
                    {...register("lastName")}
                    className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Email <span className="text-destructive">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone <span className="text-muted-foreground text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="+971 50 XXX XXXX"
                  {...register("phone")}
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-12 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                At least 8 characters required
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full rounded-lg border border-border bg-card pl-10 pr-12 py-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer mt-4">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border border-border"
              />
              <span className="text-xs text-muted-foreground">
                I agree to the{" "}
                <Link to="/" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

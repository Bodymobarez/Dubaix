import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createListingSchema } from "@shared/api";
import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Loader2,
  Check,
  FileText,
  Images,
  DollarSign,
  MapPin,
} from "lucide-react";

type ListingInput = typeof createListingSchema._type;

const STEPS = [
  { id: 1, title: "Basic Info", icon: FileText },
  { id: 2, title: "Details", icon: DollarSign },
  { id: 3, title: "Images", icon: Images },
  { id: 4, title: "Location", icon: MapPin },
  { id: 5, title: "Review", icon: Check },
];

export default function PostAdPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ListingInput>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      categoryId: "",
      title: "",
      description: "",
      price: 0,
      location: "",
      images: [],
    },
  });

  const formData = watch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In real app, would upload to cloud storage (S3, Cloudinary, etc.)
    // For now, use Data URLs for demo
    for (let i = 0; i < Math.min(files.length, 25); i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUploadedImages((prev) => [...prev, dataUrl]);
        setValue("images", [...uploadedImages, dataUrl]);
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("images", newImages);
  };

  const onSubmit = async (data: ListingInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/my-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          ...data,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      // Success - redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating listing:", error);
      // Show error toast or message
    } finally {
      setIsSubmitting(false);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.categoryId;
      case 2:
        return formData.price && formData.description;
      case 3:
        return uploadedImages.length > 0;
      case 4:
        return formData.location;
      default:
        return true;
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-success text-success-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>

                    {idx < STEPS.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          isCompleted ? "bg-success" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Post Your Ad</h1>
              <p className="text-muted-foreground">
                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      {...register("categoryId")}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    >
                      <option value="">Select a category</option>
                      <option value="motors">Motors</option>
                      <option value="property">Property</option>
                      <option value="services">Services</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="jobs">Jobs</option>
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.categoryId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 2023 Toyota Land Cruiser"
                      {...register("title")}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    {errors.title && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (AED) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 185000"
                      {...register("price", { valueAsNumber: true })}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      placeholder="Describe your item in detail..."
                      rows={6}
                      {...register("description")}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    {errors.description && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Images */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-4">
                      Upload Images (Up to 25) *
                    </label>

                    {/* Upload Area */}
                    {uploadedImages.length < 25 && (
                      <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}

                    {/* Uploaded Images */}
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                        {uploadedImages.map((image, idx) => (
                          <div key={idx} className="relative rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`Upload ${idx + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/80"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {uploadedImages.length === 0 && (
                      <p className="text-xs text-destructive">
                        At least 1 image is required
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Location */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Dubai Marina, Dubai"
                      {...register("location")}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    {errors.location && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-muted rounded-lg text-sm">
                    <p className="font-medium mb-2">Location Tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Be specific (area, emirate)</li>
                      <li>This helps buyers find your item easier</li>
                      <li>You can add coordinates for map view</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{formData.categoryId}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm text-muted-foreground">Title</p>
                      <p className="font-semibold">{formData.title}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold">AED {formData.price}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{formData.location}</p>
                    </div>

                    <div className="border-l-4 border-primary pl-4">
                      <p className="text-sm text-muted-foreground">Images</p>
                      <p className="font-semibold">
                        {uploadedImages.length} image(s) uploaded
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-sm">
                    <p className="font-medium mb-2 text-success">Ready to post?</p>
                    <p className="text-muted-foreground">
                      Your ad will be live immediately and visible to millions of
                      buyers.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="btn-outline gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            {currentStep < 5 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canGoNext()}
                className="btn-primary gap-2 flex-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                className="btn-primary gap-2 flex-1 justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Post Your Ad
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

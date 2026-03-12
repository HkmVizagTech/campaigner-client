import { Ghost, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5" />

      <div className="relative z-10 text-center max-w-xl w-full">
        {/* Premium Card Wrapper */}
        <div className="gradient-card shadow-xl">
          <div className="bg-card rounded-2xl p-10 space-y-6 relative overflow-hidden">
            {/* Floating Glow Icon */}
            <div className="flex justify-center">
              <div className="drake-glow p-0.5 rounded-full">
                <div className="drake-inner p-6 rounded-full">
                  <Ghost className="h-14 w-14 text-primary animate-soft-bounce" />
                </div>
              </div>
            </div>

            {/* 404 Heading */}
            <h1 className="text-6xl font-bold glow-text tracking-tight">404</h1>

            {/* Title */}
            <h2 className="text-2xl font-semibold">Page Not Found</h2>

            {/* Description */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              The page you are looking for might have been removed, renamed, or
              is temporarily unavailable. Please return to the Home.
            </p>

            {/* Button */}
            <div className="pt-4">
              <Button
                onClick={() => navigate("/")}
                className="h-11 px-6 text-base font-medium shadow-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;

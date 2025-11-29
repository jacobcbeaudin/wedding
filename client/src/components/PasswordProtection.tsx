import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import photo1 from "@assets/generated_images/couple_engagement_photo_1.png";

const SITE_PASSWORD = "carolineandjake2026";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export default function PasswordProtection({ children }: PasswordProtectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = sessionStorage.getItem("wedding_authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.toLowerCase() === SITE_PASSWORD.toLowerCase()) {
      sessionStorage.setItem("wedding_authenticated", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please check your invitation.");
      setPassword("");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="elegant-serif text-2xl text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${photo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-full max-w-md p-10 text-center coastal-shadow border-0 bg-background/95 backdrop-blur-sm">
        <div className="mb-8">
          <h1 className="elegant-serif text-5xl text-primary mb-4 tracking-wide">
            Caroline & Jake
          </h1>
          <p className="elegant-serif text-xl text-muted-foreground">
            September 12, 2026
          </p>
        </div>

        <div className="mb-8">
          <p className="text-foreground mb-2">
            Welcome to our wedding website!
          </p>
          <p className="text-sm text-muted-foreground">
            Please enter the password from your invitation to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-lg"
              data-testid="input-password"
            />
            {error && (
              <p className="text-destructive text-sm mt-2" data-testid="text-password-error">
                {error}
              </p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            size="lg"
            data-testid="button-submit-password"
          >
            Enter Site
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-8">
          Having trouble? Contact Jake or Caroline directly.
        </p>
      </Card>
    </div>
  );
}

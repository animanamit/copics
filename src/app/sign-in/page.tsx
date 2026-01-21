"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Palette, Loader2 } from "lucide-react";

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      setError("something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pastel-peach/20 to-background p-4">
      <Card className="w-full max-w-sm animate-fade-up">
        <CardHeader className="text-center space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 group"
            aria-label="copics home"
          >
            <div className="p-2 rounded-xl bg-pastel-peach/60 group-hover:bg-pastel-coral/60 transition-colors">
              <Palette className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
            <span className="font-semibold text-xl">copics</span>
          </Link>
          <div>
            <CardTitle className="text-2xl">welcome to copics</CardTitle>
            <CardDescription>
              sign in to analyze your artwork
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p
              className="text-sm text-destructive text-center"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 gap-3 text-base border-border/50 hover:bg-accent/50"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                signing in...
              </>
            ) : (
              <>
                <GoogleLogo className="w-5 h-5" />
                continue with google
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            by continuing, you agree to our terms of service
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

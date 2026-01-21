"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Link from "next/link";
import { Palette, Sparkles, Wand2, ArrowRight } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  );
}

function LandingPage() {
  const { data: session } = useSession();

  return (
    <>
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pastel-peach/30 text-sm animate-fade-up stagger-1">
            <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>ai-powered color analysis</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight animate-fade-up stagger-2">
            find the perfect copic markers for your artwork
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto animate-fade-up stagger-3">
            upload any image and get personalized copic marker recommendations
            with blending tips from our ai
          </p>

          <div className="flex items-center justify-center gap-4 animate-fade-up stagger-4">
            {session?.user ? (
              <Link href="/new">
                <Button size="lg" className="gap-2">
                  <Wand2 className="w-5 h-5" aria-hidden="true" />
                  start analyzing
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button size="lg" className="gap-2">
                  get started
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Palette className="w-6 h-6" />}
            title="accurate color matching"
            description="our ai identifies color regions and recommends specific copic sketch marker codes"
            index={0}
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="blending tips"
            description="get professional blending techniques for smooth gradients and transitions"
            index={1}
          />
          <FeatureCard
            icon={<Wand2 className="w-6 h-6" />}
            title="skill-based guidance"
            description="recommendations tailored to your skill level, from beginner to advanced"
            index={2}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/30 mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" aria-hidden="true" />
            <span>copics</span>
          </div>
          <p>made with love for artists</p>
        </div>
      </footer>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  const staggerClass = `stagger-${Math.min(index + 5, 8)}`;

  return (
    <div
      className={`rounded-2xl bg-card p-6 space-y-3 border border-border/30 animate-fade-up ${staggerClass} transition-colors hover:bg-muted/30`}
    >
      <div
        className="p-3 rounded-xl bg-pastel-peach/30 w-fit text-primary"
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

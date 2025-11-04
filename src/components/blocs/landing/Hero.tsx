"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="bg-image relative flex h-screen items-end justify-center overflow-hidden bg-cover bg-center text-center"
    >
      {/* Overlay glow or tint */}
      <div className="absolute inset-0 bg-gradient-to-b"></div>

      <div className="text-foreground relative z-10 max-w-3xl justify-end px-4 pb-32">
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/market">
            <Button size="default" className="rounded-sm shadow-xl">
              Explore Market
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="default"
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 rounded-sm"
            >
              Find Services
            </Button>
          </Link>
          <Link href="/tourism"></Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

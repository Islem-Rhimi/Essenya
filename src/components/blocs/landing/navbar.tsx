"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Featured", href: "/#featured" },
  { label: "FAQ", href: "/#faq" },
  { label: "Products", href: "/products" },
  { label: "Events", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-white shadow-sm dark:bg-black">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="text-primary text-xl font-bold">
          <h1 className="text-primary essenya font-extrabold">ÈSSÈNYA</h1>
        </Link>

        {/* Center Nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 transform gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 transition hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Globe size={18} />
          </Button>
          <Link href="/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="space-y-2 bg-white px-4 pb-4 shadow-md md:hidden dark:bg-black">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex gap-2">
            <Button variant="ghost" size="icon">
              <Globe size={18} />
            </Button>
            <ThemeToggle />
            <Link href="/signin" className="w-full">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="w-full">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

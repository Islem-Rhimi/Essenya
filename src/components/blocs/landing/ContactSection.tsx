"use client";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-2 lg:gap-20">
        {/* Left Side - Contact Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h2 className="text-3xl font-bold">🌱 Contact Us</h2>
          <p className="text-muted-foreground">
            We're here to help with any questions about our farm products,
            tours, or services.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="text-primary h-5 w-5" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-primary h-5 w-5" />
              <span className="text-sm">contact@essenya.farm</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-primary h-5 w-5" />
              <span className="text-sm">123 Green Valley Rd, Farmville</span>
            </div>
          </div>

          <div className="mt-4 flex gap-4">
            <Link href="#" className="hover:text-primary transition">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-primary transition">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-primary transition">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <form className="space-y-4">
            <h3 className="mb-4 text-xl font-semibold">Send us a message</h3>
            <Input type="text" placeholder="Your Name" required />
            <Input type="email" placeholder="Your Email" required />
            <Textarea placeholder="Your Message" rows={4} required />

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

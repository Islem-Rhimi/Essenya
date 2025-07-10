import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-border bg-muted border-t px-6 pt-16 pb-6">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {/* About */}
        <div>
          <h4 className="text-primary mb-3 text-xl font-semibold">Essenya</h4>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Farm-fresh products delivered to your door. Support local farmers
            with every purchase.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-primary mb-3 text-xl font-semibold">
            Quick Links
          </h4>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              <Link href="/#featured" className="hover:text-primary">
                Featured Products
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-primary">
                Shop All
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="hover:text-primary">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-primary mb-3 text-xl font-semibold">
            Stay Connected
          </h4>
          <p className="text-muted-foreground mb-3 text-sm">
            Follow us for farm updates & seasonal offers.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary text-muted-foreground">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-primary text-muted-foreground">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="hover:text-primary text-muted-foreground">
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-border text-muted-foreground mt-12 border-t pt-6 text-center text-xs">
        &copy; {new Date().getFullYear()} Essenya. All rights reserved.
      </div>
    </footer>
  );
}

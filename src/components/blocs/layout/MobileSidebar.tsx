// components/layout/MobileSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  LayoutDashboard,
  Store,
  Wrench,
  Plane,
  User,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Market", href: "/market", icon: Store },
  { name: "Services", href: "/services", icon: Wrench },
  { name: "Tourism", href: "/tourism", icon: Plane },
  { name: "Profile", href: "/profile", icon: User },
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50 md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 text-xl font-bold">MyFarm</div>
          <nav className="space-y-1 px-4">
            {navItems.map(({ name, href, icon: Icon }) => (
              <Link
                key={name}
                href={href}
                className="hover:bg-muted-foreground/10 flex items-center gap-3 rounded-md px-3 py-2 text-sm"
                onClick={() => setOpen(false)}
              >
                <Icon className="h-5 w-5" />
                {name}
              </Link>
            ))}
            <Button
              variant="ghost"
              className="mt-4 flex items-center gap-2 text-sm"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

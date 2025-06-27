// components/layout/Navbar.tsx
"use client";

import { Bell, LogOut, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "../landing/ThemeToggle";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname() ?? "";

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    if (pathname.startsWith("/Market")) return "market";
    if (pathname.startsWith("/farm-service")) return "Services";
    if (pathname.startsWith("/product-management")) return "My Products";
    if (pathname.startsWith("/tourism")) return "Tourism";
    if (pathname.startsWith("/profile")) return "Profile";
    if (pathname.startsWith("/market")) return "Market";

    return "Dashboard";
  };
  return (
    <header className="bg-background sticky top-0 z-40 flex items-center justify-between px-6 py-4 shadow-2xs">
      <h1 className="hidden text-lg font-semibold md:block">{getTitle()}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <ShoppingCart className="h-5 w-5" />
        </Button>
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>MF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

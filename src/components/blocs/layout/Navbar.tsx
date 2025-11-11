// components/layout/Navbar.tsx
"use client";

import { Bell, Globe, LogOut, ShoppingCart } from "lucide-react";
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
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname() ?? "";

  const getTitle = () => {
    if (pathname.startsWith("/dashboard")) return "Tableau de bord";
    if (pathname.startsWith("/market")) return "Marché";
    if (pathname.startsWith("/farm-service")) return "Services agricoles";
    if (pathname.startsWith("/product-management")) return "Mes produits";
    if (pathname.startsWith("/service-management")) return "Mes services";
    if (pathname.startsWith("/event-management")) return "Mes événements";
    if (pathname.startsWith("/tourism")) return "Tourisme";
    if (pathname.startsWith("/event")) return "Événements";
    if (pathname.startsWith("/my-reservations")) return "Mes réservations";
    if (pathname.startsWith("/my-orders")) return "Mes commandes";
    if (pathname.startsWith("/profile")) return "Profil";

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
        <Button variant="ghost" size="icon">
          <Globe size={18} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.jpg" alt="User" />
                <AvatarFallback>
                  {session?.user?.name?.split(" ")[0]?.charAt(0)}
                  {session?.user?.name?.split(" ")[1]?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={() => void signOut()}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

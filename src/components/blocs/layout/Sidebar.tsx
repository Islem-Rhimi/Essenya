"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Wrench,
  Plane,
  User,
  LogOut,
  PackageCheck,
  AlignLeft,
  CalendarDays,
  X,
  HandPlatter,
  CalendarCheck,
  BookCheck,
  PackageOpen,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import type { Session } from "@prisma/client";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}
type Role = "ADMIN" | "VENDEUR" | "CLIENT" | null;

const MENU_BY_ROLE: Record<NonNullable<Role>, NavItem[]> = {
  ADMIN: [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/farm-service", icon: HandPlatter },
    { name: "Tourisme", href: "/tourism", icon: Plane },
    {
      name: "Événements",
      href: "/event",
      icon: CalendarDays,
    },
    {
      name: "Gestion des produits",
      href: "/product-management",
      icon: PackageCheck,
    },
    {
      name: "Gestion des événements",
      href: "/event-management",
      icon: CalendarCheck,
    },
    {
      name: "Gestion des services",
      href: "/service-management",
      icon: Wrench,
    },
    { name: "Profil", href: "/profile", icon: User },
  ],

  VENDEUR: [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/farm-service", icon: HandPlatter },
    { name: "Tourisme", href: "/tourism", icon: Plane },
    {
      name: "Événements",
      href: "/event",
      icon: CalendarDays,
    },
    {
      name: "Gestion des produits",
      href: "/product-management",
      icon: PackageCheck,
    },
    {
      name: "Gestion des événements",
      href: "/event-management",
      icon: CalendarCheck,
    },
    {
      name: "Gestion des services",
      href: "/service-management",
      icon: Wrench,
    },
    {
      name: "Mes commandes reçues",
      href: "/my-recived-orders",
      icon: Truck,
    },
    { name: "Profil", href: "/profile", icon: User },
  ],

  CLIENT: [
    { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    { name: "Services", href: "/farm-service", icon: HandPlatter },
    { name: "Tourisme", href: "/tourism", icon: Plane },
    {
      name: "Événements",
      href: "/event",
      icon: CalendarDays,
    },
    {
      name: "Gestion des services",
      href: "/service-management",
      icon: Wrench,
    },
    { name: "Mes réservations", href: "/my-reservations", icon: BookCheck },
    { name: "Mes commandes", href: "/my-orders", icon: PackageOpen },
    { name: "Profil", href: "/profile", icon: User },
  ],
};

export default function Sidebar() {
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(true);

  const role = (session as unknown as Session)?.sessionType as Role;
  const navItems = role ? (MENU_BY_ROLE[role] ?? []) : [];

  if (status === "loading") {
    return (
      <aside className="bg-card-car sticky top-0 hidden w-16 flex-col md:flex" />
    );
  }

  return (
    <aside
      className={clsx(
        "sticky top-0 hidden max-h-screen flex-col border-r-1 border-gray-100 transition-all duration-300 md:flex",
        collapsed ? "w-15" : "w-56",
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && <span className="text-xl font-bold">Essenya</span>}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted-foreground/10 flex h-5 w-5 items-center rounded-md px-3 py-2 text-sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <AlignLeft /> : <X />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            className="hover:bg-muted-foreground/10 flex items-center gap-3 rounded-md px-3 py-2 text-sm"
          >
            <Icon className="h-5 w-5" />
            {!collapsed && <span>{name}</span>}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" className="m-4 flex items-center gap-2 text-sm">
        <LogOut className="h-4 w-4" />
        {!collapsed && "Logout"}
      </Button>
    </aside>
  );
}

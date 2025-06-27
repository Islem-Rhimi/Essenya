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
  Truck,
  CalendarDays,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Services", href: "/farm-service", icon: Wrench },
  { name: "Tourism", href: "/tourism", icon: Plane },
  { name: "Profile", href: "/profile", icon: User },
  {
    name: "Product Management",
    href: "/product-management",
    icon: PackageCheck,
  },
  {
    name: "Event Management",
    href: "/event-management",
    icon: CalendarDays,
  },
  {
    name: "Service Management",
    href: "/service-management",
    icon: Truck,
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);

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

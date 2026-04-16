"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Store,
  Terminal,
  Package,
  BarChart3,
  Settings,
  Users,
  DollarSign,
  User,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { User as AuthUser } from "@/lib/auth";

const nav_items = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/terminal", label: "Terminal", icon: Terminal },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/sales", label: "Sales", icon: DollarSign },
  { href: "/customers", label: "Customers", icon: Users },
];

const bottom_nav_items = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user as AuthUser;

  const get_link_class = (href: string) => {
    const is_active = pathname === href || pathname.startsWith(href + "/");
    if (is_active) {
      return "flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-md transition-all font-bold group border border-primary/20 cursor-pointer";
    }
    return "flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-primary/5 rounded-md transition-all font-semibold group cursor-pointer";
  };

  const get_icon_class = (href: string) => {
    const is_active = pathname === href || pathname.startsWith(href + "/");
    return is_active ? "" : "group-hover:scale-110 transition-transform";
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 text-primary">
        <Store className="text-primary" size={24} />
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight shrink-0">
          <span className="text-primary font-black">Dawaare</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {nav_items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={get_link_class(item.href)}
            >
              <Icon size={20} className={get_icon_class(item.href)} />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-primary/10">
          {bottom_nav_items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={get_link_class(item.href)}
              >
                <Icon size={20} className={get_icon_class(item.href)} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="relative p-4">
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-primary/5 rounded-md border border-transparent dark:border-primary/10">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 border border-primary/40 bg-slate-200 dark:bg-slate-800"
            data-alt="User profile avatar portrait"
            style={
              user?.image
                ? {
                    backgroundImage: `url(${user.image})`,
                  }
                : undefined
            }
          >
            {!user?.image && (
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 border border-primary/40 flex items-center justify-center"
                data-alt="User profile avatar portrait"
              >
                <User size={20} className={"text-primary"} />
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            {user ? (
              <>
                <p className="text-sm font-bold leading-none truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-wider">
                  {user.role === "ADMIN" ? "Admin Mode" : "Seller Mode"}
                </p>
              </>
            ) : (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

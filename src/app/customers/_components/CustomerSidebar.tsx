"use client";

import React from "react";
import { UserSearch, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DUMMY_CUSTOMERS = [
  { id: "1", name: "John Doe", lastVisit: "2 days ago", balance: 120.0 },
  { id: "2", name: "Sarah Williams", lastVisit: "Yesterday", balance: 45.5 },
  { id: "3", name: "Michael Chen", lastVisit: "1 week ago", balance: 312.0 },
  { id: "4", name: "Elena Rodriguez", lastVisit: "3 hours ago", balance: 12.25 },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-1/3 border-r border-slate-200 dark:border-primary/20 flex flex-col bg-slate-50 dark:bg-primary/5">
      <div className="p-6 border-b border-slate-200 dark:border-primary/20">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          Debt Customers
        </h3>
        <div className="relative group flex items-center">
          <UserSearch
            size={20}
            className="absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors"
          />
          <input
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            placeholder="Search customers..."
            type="text"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {DUMMY_CUSTOMERS.map((customer) => {
          const isActive = pathname === `/customers/${customer.id}`;
          return (
            <Link
              key={customer.id}
              href={`/customers/${customer.id}`}
              className={`p-4 flex items-center justify-between border-b border-slate-200 dark:border-primary/10 transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary/10 border-l-4 border-l-primary"
                  : "hover:bg-primary/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full border flex items-center justify-center ${
                    isActive
                      ? "bg-primary/20 border-primary/30"
                      : "bg-slate-200 dark:bg-primary/10 border-transparent dark:border-primary/10"
                  }`}
                >
                  <User
                    size={20}
                    className={isActive ? "text-primary" : "text-slate-500"}
                  />
                </div>
                <div>
                  <p
                    className={`font-bold ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {customer.name}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">
                    Last visit: {customer.lastVisit}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-primary">
                  ${customer.balance.toFixed(2)}
                </p>
                <p className="text-[10px] uppercase text-slate-400 font-bold">
                  Balance
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

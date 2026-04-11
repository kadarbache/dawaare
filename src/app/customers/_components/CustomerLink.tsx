"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";

interface CustomerLinkProps {
  id: string;
  name: string;
}

export default function CustomerLink({ id, name }: CustomerLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === `/customers/${id}`;

  return (
    <Link href={`/customers/${id}`}>
      <div
        className={`p-4 flex items-center justify-between border-b border-slate-200 dark:border-primary/10 cursor-pointer transition-colors ${
          isActive
            ? "bg-primary/10 border-l-4 border-l-primary"
            : "hover:bg-primary/5"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isActive
                ? "bg-primary/20 border border-primary/30"
                : "bg-slate-200 dark:bg-primary/10 border border-transparent dark:border-primary/10"
            }`}
          >
            <User
              size={20}
              className={isActive ? "text-primary" : "text-slate-500"}
            />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              {name}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Last visit: 1 week ago
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-primary">$0.00</p>
          <p className="text-[10px] uppercase text-slate-400 font-bold">
            Balance
          </p>
        </div>
      </div>
    </Link>
  );
}

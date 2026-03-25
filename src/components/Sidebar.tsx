import React from "react";
import Link from "next/link";
import {
  Store,
  LayoutDashboard,
  Terminal,
  Package,
  BarChart3,
  Settings,
  Users,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 text-primary">
        <Store className="text-primary" size={24} />
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold tracking-tight shrink-0">
          <span className="text-primary font-black">Dawaare</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-primary/5 rounded-xl transition-all font-semibold group cursor-pointer"
        >
          <LayoutDashboard
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Dashboard
        </Link>
        <Link
          href="/terminal"
          className="flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-primary/5 rounded-xl transition-all font-semibold group cursor-pointer"
        >
          <Terminal
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Terminal
        </Link>
        <Link
          href="/inventory"
          className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary rounded-xl transition-all font-bold group border border-primary/20 cursor-pointer"
        >
          <Package size={20} />
          Inventory
        </Link>
        <Link
          href="/debt"
          className="flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-primary/5 rounded-xl transition-all font-semibold group cursor-pointer"
        >
          <Users
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Customers
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-primary/5 rounded-xl transition-all font-semibold group cursor-pointer"
        >
          <BarChart3
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          Analytics
        </Link>

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-primary/10">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-primary/5 rounded-xl transition-all font-semibold group cursor-pointer"
          >
            <Settings
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            Settings
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-primary/10">
        <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-primary/5 rounded-xl border border-transparent dark:border-primary/10">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 border border-primary/40"
            data-alt="User profile avatar portrait"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQSINJfNXAlsT4El4PBkY63-W-ECWcJvH150JVe8fX3Y1ly_dH1aKRNyVNjJvjRuIYhDcWv6CSaEUOGLYtvomGuwMp9idPBiiKGElvbsutPnr-C00B3NVcB_hzzMdLx2tr_JmySVVY7YZNR2nL0Jqpx_MDMnnr7kgfrN2wfz8pGU_ejv1-0oZXP1w8Yw4r3LnDLwOANd6DSWHk1xhVxhD3eWXbl-CDubq40zr_m1OUU858hWiRoD-ra1Imkgg7noCfIBDcjMLFZrM")',
            }}
          ></div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold leading-none truncate">
              Alex Morgan
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-wider">
              Admin Mode
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import SummarySidebar from "@/app/terminal/_components/SummarySidebar";
import { Barcode, SearchIcon } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import ButtomAcionBar from "./_components/ButtomAcionBar";
import CartTable from "./_components/CartTable";

export default function TerminalPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        {/* Top Navigation Bar */}
        <Topbar page="Terminal" subPage="Register #04" />

        {/* POS Workspace */}
        <main className="flex flex-1 overflow-hidden">
          {/* Left Side: Scanning Zone */}
          <section className="w-[70%] flex flex-col p-8 gap-6 overflow-hidden">
            {/* Search & Barcode Area */}
            <div className="flex gap-3">
              <div className="relative group flex-1">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <SearchIcon size={24} className="text-primary" />
                </div>
                <input
                  autoFocus
                  className="w-full h-14 bg-white dark:bg-[#2d1e16] border border-slate-200 dark:border-primary/20 rounded-xl pl-14 pr-16 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none shadow-sm"
                  placeholder="type product name (F10)..."
                  type="text"
                />
                <div className="absolute inset-y-0 right-5 flex items-center">
                  <kbd className="px-2 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded text-xs font-bold text-primary">
                    F10
                  </kbd>
                </div>
              </div>
              <div
                className="relative group flex-none"
                style={{ width: "30%" }}
              >
                <button
                  type="button"
                  className="w-full h-14 bg-white dark:bg-[#2d1e16] border border-slate-200 dark:border-primary/20 rounded-xl pl-5 pr-16 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none shadow-sm flex items-center cursor-pointer"
                  title="Scan Barcode/QR Code"
                >
                  <Barcode size={24} className="text-primary" />
                  <span className="ml-3 text-slate-400 dark:text-slate-500">
                    Barcode...
                  </span>
                </button>
                <div className="absolute inset-y-0 right-5 flex items-center">
                  <kbd className="px-2 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded text-xs font-bold text-primary">
                    F9
                  </kbd>
                </div>
              </div>
            </div>

            {/* Cart Table Card */}
            <CartTable />
          </section>

          {/* Right Side: Summary Sidebar */}
          <SummarySidebar />
        </main>

        {/* Bottom Action Bar */}
        <ButtomAcionBar />
      </div>
    </div>
  );
}

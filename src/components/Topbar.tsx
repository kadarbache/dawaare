"use client";

import { ChevronRight, Search } from "lucide-react";
import { useState, useEffect } from "react";
import SearchModal from "@/components/ui/SearchModal";

export default function Topbar({
  page,
  subPage,
}: {
  page: string;
  subPage?: string;
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-8 py-2 border-b border-primary/10 w-full">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{page}</span>
          {subPage && (
            <>
              <ChevronRight size={14} />
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {subPage}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors"
            />
            <div className="pl-10 pr-16 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-sm text-slate-500 hover:border-primary/50 transition-colors w-72 sm:w-80 flex items-center">
              Search...
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-white border border-slate-300 dark:border-transparent">
                CTRL+K
              </span>
            </div>
          </div>
        </div>
      </header>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

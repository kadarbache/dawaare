import { ChevronRight, Search } from "lucide-react";

export default function Topbar({
  page,
  subPage,
}: {
  page: string;
  subPage: string;
}) {
  return (
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
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-sm focus:border-primary focus:bg-primary/50 focus:outline-none w-80 transition-colors cursor-pointer"
            placeholder="Search components..."
            type="text"
          />
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2">
            <span className="bg-slate-700 px-1 rounded text-white">
              CTR+K
            </span>{" "}
          </div>
        </div>
        {/* ctrl+k */}
      </div>
    </header>
  );
}

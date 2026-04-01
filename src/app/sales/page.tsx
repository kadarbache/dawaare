import Topbar from "@/components/Topbar";
import { get_sales, get_sale_stats } from "./server";
import SalesClient from "./_components/SalesClient";

// Default date range: current month
function get_default_dates() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    start_date?: string;
    end_date?: string;
  }>;
}) {
  const params = await searchParams;
  const defaults = get_default_dates();

  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const start_date = params.start_date ?? defaults.start;
  const end_date = params.end_date ?? defaults.end;

  const [{ sales, total }, stats] = await Promise.all([
    get_sales(page, start_date, end_date),
    get_sale_stats(start_date, end_date),
  ]);

  return (
    <>
      <Topbar page="Sales" subPage="" />

      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
        <div className="max-w-360 mx-auto px-8 py-8">
          <SalesClient
            sales={sales}
            stats={stats}
            total={total}
            currentPage={page}
            startDate={start_date}
            endDate={end_date}
          />
        </div>
      </main>

      {/* Bottom Status Bar */}
      <footer className="h-10 bg-slate-900 text-slate-400 px-6 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider shrink-0 border-t border-white/5 z-40">
        <div className="flex items-center gap-1">
          <span className="bg-slate-700 px-1 rounded text-white">F1</span> HELP
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-slate-700 px-1 rounded text-white">F10</span>{" "}
          SEARCH
        </div>
        <div className="ml-auto text-slate-500 flex items-center gap-4">
          <span>SYSTEM READY</span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>SALES MANAGER • V2.4.0</span>
        </div>
      </footer>
    </>
  );
}

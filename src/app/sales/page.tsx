import Topbar from "@/components/Topbar";
import { get_sales, get_sale_stats } from "./server";
import SalesClient from "./_components/SalesClient";
import ButtomAcionBar from "../terminal/_components/ButtomAcionBar";

// Default date range: last 30 days
function get_default_dates() {
  const now = new Date();

  // End date is today
  const end = now;

  // Start date is 29 days before today (making 30 days total)
  const start = new Date();
  start.setDate(now.getDate() - 29);

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
      <ButtomAcionBar
        shortcuts={[
          { label: "Search", key: "CTR+K" },
          { label: "Cancel", key: "ESC" },
        ]}
        pathname={"/sales"}
      />
    </>
  );
}

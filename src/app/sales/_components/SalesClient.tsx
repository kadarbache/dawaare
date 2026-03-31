"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { SaleRow, SaleStats } from "../server";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
  Filter,
  Eye,
  Clock,
} from "lucide-react";
import StatusCard from "@/components/StatusCard";
import { PAGE_SIZE } from "../constants";

type SaleStatus = "paid" | "partial" | "unpaid";

function get_status_class(status: string) {
  switch (status as SaleStatus) {
    case "paid":
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    case "partial":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    case "unpaid":
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
  }
}

function format_payment(method: string) {
  switch (method) {
    case "ZAAD":
      return "Zaad";
    case "E_DAHAB":
      return "eDahab";
    case "CASH":
      return "Cash";
    default:
      return method;
  }
}

function get_initials(name: string | null) {
  if (!name) return "—";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function time_ago(date: Date | null) {
  if (!date) return "No sales yet";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function SalesClient({
  sales,
  stats,
  total,
  currentPage,
  startDate,
  endDate,
}: {
  sales: SaleRow[];
  stats: SaleStats;
  total: number;
  currentPage: number;
  startDate: string;
  endDate: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);

  const total_pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function push_params(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => next.set(k, v));
    startTransition(() => router.push(`/sales?${next.toString()}`));
  }

  function handle_filter() {
    push_params({ start_date: localStart, end_date: localEnd, page: "1" });
  }

  function handle_page(p: number) {
    push_params({ page: String(p) });
  }

  const page_numbers = Array.from(
    { length: total_pages },
    (_, i) => i + 1,
  ).filter(
    (p) => p === 1 || p === total_pages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
        <div>
          <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">
            Sales History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-1">
            Track and manage all your transaction records
          </p>
        </div>

        {/* Date Filter */}
        <div className="bg-white dark:bg-primary/5 p-2 rounded-xl border border-slate-200 dark:border-primary/20 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-primary/10 rounded-lg border border-slate-200 dark:border-primary/20">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mr-2 font-bold">
              Start
            </span>
            <input
              type="date"
              value={localStart}
              onChange={(e) => setLocalStart(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 focus:ring-0 p-0 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-primary/10 rounded-lg border border-slate-200 dark:border-primary/20">
            <Calendar size={14} className="text-slate-400" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 mr-2 font-bold">
              End
            </span>
            <input
              type="date"
              value={localEnd}
              onChange={(e) => setLocalEnd(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 focus:ring-0 p-0 cursor-pointer"
            />
          </div>
          <button
            onClick={handle_filter}
            disabled={isPending}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer disabled:opacity-60"
          >
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Total Sales Count"
          value={stats.total_sales_count.toLocaleString()}
          description="All time transactions"
          variant="success"
          icon={<ShoppingBag size={20} className="text-primary" />}
          trendIcon={<TrendingUp size={12} />}
        />

        <div className="flex flex-col gap-2 rounded-2xl p-6 border border-slate-200 dark:border-primary/30 bg-white dark:bg-background-dark shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
              Total Revenue
            </p>
            <DollarSign size={20} className="text-primary" />
          </div>
          <p className="text-primary text-3xl font-black">
            $
            {stats.total_revenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-xs font-bold flex items-center gap-1 text-emerald-500">
            <TrendingUp size={12} />
            Revenue this period
          </p>
        </div>

        <StatusCard
          title="Avg. Sales Value"
          value={`$${stats.avg_order_value.toFixed(2)}`}
          description="Based on all transactions"
          variant="primary"
          icon={<Activity size={20} className="text-primary" />}
        />

        {/* Last Sale */}
        <div className="flex flex-col gap-2 rounded-2xl p-6 bg-linear-to-br from-primary/20 to-transparent border border-primary/30 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-primary text-[10px] font-black uppercase tracking-widest">
              real time
            </p>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
          </div>
          <p className="text-slate-900 dark:text-slate-100 text-xl font-bold">
            Last sale
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
            <Clock size={12} />
            {time_ago(stats.last_sale_at)}
          </p>
        </div>
      </div>

      {/* Transaction Table */}
      <div
        className={`bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden flex flex-col mb-12 transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/10">
          <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <DollarSign size={20} className="text-primary" />
            Transaction Registry
          </h3>
          <div className="flex gap-2">
            <button className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
              <Download size={14} />
              Export CSV
            </button>
            <button className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
              <Printer size={14} />
              Print
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-600">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="text-lg font-bold">No transactions found</p>
              <p className="text-sm mt-1">Try adjusting your date filter</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10">
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Date &amp; Time
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Items
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest text-right">
                    Total
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                {sales.map((sale) => {
                  const d = new Date(sale.created_at);
                  const date_str = d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const time_str = d.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const short_id = sale.id.slice(0, 8).toUpperCase();

                  return (
                    <tr
                      key={sale.id}
                      className="hover:bg-primary/5 transition-colors group"
                    >
                      <td className="px-6 py-4 font-black text-sm text-primary">
                        #{short_id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 dark:text-slate-100 text-xs">
                            {date_str}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                            {time_str}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            {get_initials(sale.customer_name)}
                          </div>
                          <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">
                            {sale.customer_name ?? (
                              <span className="text-slate-400 italic text-xs">
                                Walk-in
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                        {sale.items_count}{" "}
                        {sale.items_count === 1 ? "item" : "items"}
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-right text-slate-900 dark:text-slate-100">
                        $
                        {sale.total_amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-slate-800 dark:bg-slate-700 text-slate-300">
                          {format_payment(sale.payment_method)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${get_status_class(sale.status)}`}
                        >
                          {sale.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline flex items-center gap-1 ml-auto cursor-pointer">
                          <Eye size={12} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
          <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Showing{" "}
            <span className="font-bold text-primary">
              {Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}–
              {Math.min(currentPage * PAGE_SIZE, total)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {total.toLocaleString()}
            </span>{" "}
            transactions
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1 || isPending}
              onClick={() => handle_page(currentPage - 1)}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>

            {page_numbers.map((p, i) => {
              const prev = page_numbers[i - 1];
              return (
                <>
                  {prev && p - prev > 1 && (
                    <span
                      key={`gap-${p}`}
                      className="text-slate-400 dark:text-slate-600 px-1"
                    >
                      ...
                    </span>
                  )}
                  <button
                    key={p}
                    onClick={() => handle_page(p)}
                    disabled={isPending}
                    className={`size-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-60 ${
                      p === currentPage
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {p}
                  </button>
                </>
              );
            })}

            <button
              disabled={currentPage >= total_pages || isPending}
              onClick={() => handle_page(currentPage + 1)}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

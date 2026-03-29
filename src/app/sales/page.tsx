"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatusCard from "@/components/StatusCard";
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
} from "lucide-react";

const mock_sales = [
  {
    order_id: "ORD-1024",
    date: "Oct 24, 2023",
    time: "14:32",
    customer_name: "Ahmed Salad",
    customer_initials: "AS",
    items_count: 3,
    total_amount: 145.0,
    payment_method: "Zaad",
    status: "completed" as const,
  },
  {
    order_id: "ORD-1023",
    date: "Oct 24, 2023",
    time: "13:15",
    customer_name: "Muna Farah",
    customer_initials: "MF",
    items_count: 1,
    total_amount: 12.5,
    payment_method: "Cash",
    status: "completed" as const,
  },
  {
    order_id: "ORD-1022",
    date: "Oct 24, 2023",
    time: "11:04",
    customer_name: "Hassan Osman",
    customer_initials: "HO",
    items_count: 5,
    total_amount: 342.0,
    payment_method: "eDahab",
    status: "refunded" as const,
  },
  {
    order_id: "ORD-1021",
    date: "Oct 23, 2023",
    time: "18:50",
    customer_name: "Jamila Duale",
    customer_initials: "JD",
    items_count: 2,
    total_amount: 58.0,
    payment_method: "Zaad",
    status: "completed" as const,
  },
  {
    order_id: "ORD-1020",
    date: "Oct 23, 2024",
    time: "16:22",
    customer_name: "Ismail Hirsi",
    customer_initials: "IH",
    items_count: 8,
    total_amount: 1102.45,
    payment_method: "eDahab",
    status: "completed" as const,
  },
  {
    order_id: "ORD-1019",
    date: "Oct 23, 2023",
    time: "14:10",
    customer_name: "Fatima Ali",
    customer_initials: "FA",
    items_count: 4,
    total_amount: 89.99,
    payment_method: "Cash",
    status: "completed" as const,
  },
  {
    order_id: "ORD-1018",
    date: "Oct 22, 2023",
    time: "09:45",
    customer_name: "Omar Noor",
    customer_initials: "ON",
    items_count: 2,
    total_amount: 67.5,
    payment_method: "Zaad",
    status: "pending" as const,
  },
];

type SaleStatus = "completed" | "refunded" | "pending";

function get_status_class(status: SaleStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
    case "refunded":
      return "bg-red-500/10 text-red-500 border border-red-500/20";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
  }
}

function get_payment_class() {
  return "bg-slate-800 dark:bg-slate-700 text-slate-300";
}

export default function SalesPage() {
  const [start_date, set_start_date] = useState("2023-10-01");
  const [end_date, set_end_date] = useState("2023-10-31");

  const total_sales_count = 1428;
  const total_revenue = 42905.5;
  const avg_order_value = 30.04;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20">
        <Topbar page="Sales" subPage="" />

        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
          <div className="max-w-360 mx-auto px-8 py-8">
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
                    value={start_date}
                    onChange={(e) => set_start_date(e.target.value)}
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
                    value={end_date}
                    onChange={(e) => set_end_date(e.target.value)}
                    className="bg-transparent border-none text-xs text-slate-900 dark:text-slate-100 focus:ring-0 p-0 cursor-pointer"
                  />
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
                  <Filter size={14} />
                  Filter
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatusCard
                title="Total Sales Count"
                value={total_sales_count.toLocaleString()}
                description="+12% vs last month"
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
                  {total_revenue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs font-bold flex items-center gap-1 text-emerald-500">
                  <TrendingUp size={12} />
                  +8.4% vs last month
                </p>
              </div>

              <StatusCard
                title="Avg. Order Value"
                value={`$${avg_order_value.toFixed(2)}`}
                description="Based on all transactions"
                variant="primary"
                icon={<Activity size={20} className="text-primary" />}
              />

              {/* last sale */}
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
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Last sale 2m ago
                </p>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden flex flex-col mb-12">
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
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10">
                      <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                        Saler
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
                    {mock_sales.map((sale) => (
                      <tr
                        key={sale.order_id}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        <td className="px-6 py-4 font-black text-sm text-primary">
                          #{sale.order_id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-100 text-xs">
                              {sale.date}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-[10px]">
                              {sale.time}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                              {sale.customer_initials}
                            </div>
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-medium">
                              {sale.customer_name}
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
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${get_payment_class()}`}
                          >
                            {sale.payment_method}
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
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Showing <span className="font-bold text-primary">1-7</span> of{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {total_sales_count.toLocaleString()}
                  </span>{" "}
                  transactions
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 cursor-pointer">
                    1
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all cursor-pointer">
                    2
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all cursor-pointer">
                    3
                  </button>
                  <span className="text-slate-400 dark:text-slate-600 px-2">
                    ...
                  </span>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all cursor-pointer">
                    286
                  </button>
                  <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors cursor-pointer">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Status Bar */}
        <footer className="h-10 bg-slate-900 text-slate-400 px-6 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider shrink-0 border-t border-white/5 z-40">
          <div className="flex items-center gap-1">
            <span className="bg-slate-700 px-1 rounded text-white">F1</span>{" "}
            HELP
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-slate-700 px-1 rounded text-white">F10</span>{" "}
            SEARCH
          </div>
          <div className="ml-auto text-slate-500 flex items-center gap-4">
            <span>SYSTEM READY</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>SALES MANAGER • V2.4.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

import Topbar from "@/components/Topbar";
import StatusCard from "@/components/StatusCard";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import {
  get_dashboard_stats,
  get_sales_trend,
  get_best_sellers,
  get_recent_transactions,
  get_recent_debt_clearances,
} from "./server";
import { SalesTrendChart } from "./SalesTrendChart";
import FilterButtons from "@/components/FilterButtons";
import ButtomAcionBar from "../terminal/_components/ButtomAcionBar";
// TODO: implement the dashboard stats to be dynamic based on the filter buttons and use the same pattern as the sales page
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

function format_date(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function format_time(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    filter?: string;
  }>;
}) {
  const params = await searchParams;
  const filter = params.filter ?? "daily";

  // the trend is the total amount of sales in that period of time
  const [stats, trend, best_sellers, transactions, debt_clearances] =
    await Promise.all([
      get_dashboard_stats(filter),
      get_sales_trend(filter),
      get_best_sellers(filter),
      get_recent_transactions(filter),
      get_recent_debt_clearances(filter),
    ]);

  return (
    <>
      <Topbar page="Dashboard" />

      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
        <div className="max-w-360 mx-auto px-8 py-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal mt-1">
                Real-time overview of your shop performance
              </p>
            </div>
            <FilterButtons />
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatusCard
              title={`Total Sales ${filter === "weekly" ? "This Week" : filter === "monthly" ? "This Month" : filter === "all" ? "All Time" : "Today"}`}
              value={`$${stats.total_sales.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              description={`${stats.total_sales_change >= 0 ? "+" : ""}${stats.total_sales_change.toFixed(1)}% from ${filter === "weekly" ? "last week" : filter === "monthly" ? "last month" : filter === "all" ? "beginning" : "yesterday"}`}
              variant={stats.total_sales_change >= 0 ? "success" : "danger"}
              icon={<DollarSign size={20} className="text-primary" />}
              trendIcon={
                stats.total_sales_change >= 0 ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )
              }
            />

            <div className="flex flex-col gap-2 rounded-2xl p-6 border border-slate-200 dark:border-primary/30 bg-white dark:bg-background-dark shadow-lg">
              <div className="flex justify-between items-start">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                  Net Profit
                </p>
                <TrendingUp size={20} className="text-primary" />
              </div>
              <p className="text-slate-900 dark:text-slate-100 text-3xl font-black">
                $
                {stats.net_profit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="mt-1 h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${Math.min((stats.net_profit / (stats.total_sales || 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <StatusCard
              title="Pending Debts"
              value={`$${stats.pending_debts.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              description={
                stats.pending_debts > 0
                  ? "Requires attention"
                  : "No pending debts"
              }
              variant={stats.pending_debts > 0 ? "danger" : "success"}
              icon={<AlertTriangle size={20} className="text-primary" />}
              trendIcon={
                stats.pending_debts > 0 ? (
                  <AlertTriangle size={12} />
                ) : (
                  <TrendingUp size={12} />
                )
              }
            />

            <StatusCard
              title="Low Stock Count"
              value={stats.low_stock_count.toString()}
              description={
                stats.low_stock_count > 0
                  ? "Items need restocking"
                  : "All items well stocked"
              }
              variant={stats.low_stock_count > 0 ? "danger" : "success"}
              icon={<Package size={20} className="text-primary" />}
              trendIcon={
                stats.low_stock_count > 0 ? (
                  <AlertTriangle size={12} />
                ) : (
                  <TrendingUp size={12} />
                )
              }
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Trend (2/3 width) */}
            <SalesTrendChart trend={trend} filter={filter} />

            {/* Best Sellers (1/3 width) */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Best Sellers
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Top Products{" "}
                    {filter === "weekly"
                      ? "This Week"
                      : filter === "monthly"
                        ? "This Month"
                        : filter === "all"
                          ? "All Time"
                          : "Today"}
                  </p>
                </div>
                <BarChart3 size={20} className="text-primary" />
              </div>
              {best_sellers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
                  <Package size={32} className="mb-3 opacity-30" />
                  <p className="text-sm font-bold">No sales data yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {best_sellers.map((item, i) => {
                    const max_qty = best_sellers[0].total_qty || 1;
                    const pct = (item.total_qty / max_qty) * 100;
                    return (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-900 dark:text-slate-100 truncate pr-2">
                            {item.product_name}
                          </span>
                          <span className="text-primary whitespace-nowrap">
                            {item.total_qty} Units
                          </span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Recent Transactions */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                  Recent Transactions
                </h2>
                <Link
                  href="/sales"
                  className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline"
                >
                  View All
                </Link>
              </div>
              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                  <DollarSign size={32} className="mb-3 opacity-30" />
                  <p className="text-sm font-bold">No transactions yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#2d1e16] text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th className="px-6 py-4">Time</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Method</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                      {transactions.map((tx) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-mono text-slate-500">
                                {format_time(tx.created_at)}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {format_date(tx.created_at)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-900 dark:text-slate-100">
                            {tx.customer_name}
                          </td>
                          <td className="px-6 py-4 text-xs font-black text-primary">
                            $
                            {tx.total_amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 text-[10px] font-bold rounded text-slate-600 dark:text-slate-400 uppercase">
                              {format_payment(tx.payment_method)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Debt Clearances */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center">
                <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
                  Debt Clearances
                </h2>
                <Link
                  href="/sales"
                  className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline"
                >
                  Full Ledger
                </Link>
              </div>
              {debt_clearances.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
                  <AlertTriangle size={32} className="mb-3 opacity-30" />
                  <p className="text-sm font-bold">No debt clearances yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#2d1e16] text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <th className="px-6 py-4">Customer Name</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                      {debt_clearances.map((dc, i) => (
                        <tr
                          key={`${dc.customer_name}-${dc.created_at.toISOString()}`}
                          className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                                {dc.initial}
                              </div>
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                {dc.customer_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {format_date(dc.created_at)}
                          </td>
                          <td className="px-6 py-4 text-xs font-black text-emerald-500 text-right">
                            $
                            {dc.amount_paid.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Status Bar */}
      <ButtomAcionBar
        shortcuts={[
          { label: "Search", key: "CTR+K" },
          { label: "Cancel", key: "ESC" },
        ]}
        pathname={"/dashboard"}
      />
    </>
  );
}

import Topbar from "@/components/Topbar";
import { prisma } from "@/lib/db";
import dayjs from "dayjs";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  DollarSign,
  Edit,
  Package,
  RefreshCw,
  Share,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
// TODO: remove stock movements list table (ui)
export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const sale_items = await prisma.saleItem.findMany({
    where: { product_id: id },
    include: {
      sale: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const all_sale_items = await prisma.saleItem.findMany({
    where: { product_id: id },
  });

  const total_revenue = all_sale_items.reduce(
    (sum: number, item) => sum + item.total_price,
    0,
  );

  const total_units_sold = all_sale_items.reduce(
    (sum: number, item) => sum + item.quantity,
    0,
  );

  const total_cost = all_sale_items.reduce(
    (sum: number, item) => sum + product.cost_price * item.quantity,
    0,
  );

  const net_profit = total_revenue - total_cost;

  const last_month = dayjs().subtract(1, "month");
  const recent_items = all_sale_items.filter((item) =>
    dayjs(item.created_at).isAfter(last_month),
  );
  const older_items = all_sale_items.filter((item) =>
    dayjs(item.created_at).isBefore(last_month),
  );

  const recent_revenue = recent_items.reduce(
    (sum: number, item) => sum + item.total_price,
    0,
  );
  const older_revenue = older_items.reduce(
    (sum: number, item) => sum + item.total_price,
    0,
  );
  const revenue_change =
    older_revenue > 0
      ? ((recent_revenue - older_revenue) / older_revenue) * 100
      : 0;

  const recent_units = recent_items.reduce(
    (sum: number, item) => sum + item.quantity,
    0,
  );
  const older_units = older_items.reduce(
    (sum: number, item) => sum + item.quantity,
    0,
  );
  const units_change =
    older_units > 0 ? ((recent_units - older_units) / older_units) * 100 : 0;

  const recent_profit =
    recent_revenue -
    recent_items.reduce(
      (sum: number, item) => sum + product.cost_price * item.quantity,
      0,
    );
  const older_profit =
    older_revenue -
    older_items.reduce(
      (sum: number, item) => sum + product.cost_price * item.quantity,
      0,
    );
  const profit_change =
    older_profit > 0
      ? ((recent_profit - older_profit) / older_profit) * 100
      : 0;

  const last_30_days = Array.from({ length: 30 }, (_, i) => {
    const date = dayjs().subtract(29 - i, "day");
    const day_items = all_sale_items.filter(
      (item) =>
        dayjs(item.created_at).format("YYYY-MM-DD") ===
        date.format("YYYY-MM-DD"),
    );
    return {
      date: date.format("MMM DD"),
      revenue: day_items.reduce(
        (sum: number, item) => sum + item.total_price,
        0,
      ),
    };
  });

  const max_revenue = Math.max(...last_30_days.map((d) => d.revenue), 1);

  const stock_movements = [
    ...sale_items.slice(0, 5).map((item) => ({
      type: "sale" as const,
      description: `Sale to ${item.sale.customer?.name || "Walk-in Customer"}`,
      quantity: item.quantity,
      date: item.created_at,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20">
        <Topbar page="Inventory" subPage={product.name} />

        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
          <div className="max-w-360 mx-auto px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link
                href="/inventory"
                className="hover:text-primary transition-colors"
              >
                Inventory
              </Link>
              <ChevronRight size={14} />
              <span className="text-slate-900 dark:text-slate-100 font-medium">
                {product.name}
              </span>
            </div>

            {/* Product Header */}
            <section className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white dark:bg-background-dark p-6 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg mb-8">
              <div className="flex items-center gap-6">
                <div className="size-32 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800 relative shrink-0 border border-slate-200 dark:border-primary/30">
                  {product.image ? (
                    <Image
                      alt={product.name}
                      className="w-full h-full object-cover absolute"
                      fill
                      src={product.image}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={40} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {product.is_low_stock ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary">
                        Low Stock
                      </span>
                    ) : product.stock_qty === 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-500">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-500">
                        In Stock
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-mono">
                      SKU: {product.sku}
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                    {product.name}
                  </h1>
                  <p className="text-slate-500 flex items-center gap-2 text-sm">
                    <BarChart3 size={14} />
                    {product.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors cursor-pointer">
                  <Edit size={16} />
                  Edit Product
                </button>
                <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-primary text-white font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-primary/20">
                  <Share size={16} />
                  Export Data
                </button>
              </div>
            </section>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-background-dark p-5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Total Revenue
                  </p>
                  <DollarSign size={20} className="text-primary" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    $
                    {total_revenue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </h3>
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${revenue_change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {revenue_change >= 0 ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {revenue_change >= 0 ? "+" : ""}
                    {revenue_change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-background-dark p-5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Units Sold
                  </p>
                  <ShoppingCart size={20} className="text-primary" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {total_units_sold.toLocaleString()} units
                  </h3>
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${units_change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {units_change >= 0 ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {units_change >= 0 ? "+" : ""}
                    {units_change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-background-dark p-5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Net Profit
                  </p>
                  <DollarSign size={20} className="text-primary" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    $
                    {net_profit.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </h3>
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${profit_change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {profit_change >= 0 ? (
                      <TrendingUp size={12} />
                    ) : (
                      <TrendingDown size={12} />
                    )}
                    {profit_change >= 0 ? "+" : ""}
                    {profit_change.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-background-dark p-5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Current Stock
                  </p>
                  <Package size={20} className="text-primary" />
                </div>
                <div className="flex items-end justify-between mt-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {product.stock_qty} units
                  </h3>
                  {product.is_low_stock && (
                    <span className="text-primary text-sm font-bold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Low
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sales Trend Chart */}
            <section className="bg-white dark:bg-background-dark rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Sales Trends
                  </h2>
                  <p className="text-sm text-slate-500">
                    Daily revenue over the last 30 days
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs font-bold rounded-lg bg-primary/10 text-primary cursor-pointer">
                    30 Days
                  </button>
                  <button className="px-3 py-1 text-xs font-bold rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                    90 Days
                  </button>
                </div>
              </div>
              <div className="h-64 w-full relative">
                <div className="absolute inset-0 flex items-end justify-between gap-1 px-2">
                  {last_30_days.map((day, i) => {
                    const height_pct =
                      max_revenue > 0 ? (day.revenue / max_revenue) * 100 : 0;
                    const is_highlighted =
                      day.revenue ===
                      Math.max(...last_30_days.map((d) => d.revenue));
                    return (
                      <div
                        key={i}
                        className={`w-full rounded-t-sm relative group cursor-pointer transition-all hover:opacity-80 ${
                          is_highlighted
                            ? "bg-primary"
                            : day.revenue > 0
                              ? "bg-primary/40"
                              : "bg-primary/10"
                        }`}
                        style={{
                          height: `${Math.max(height_pct, day.revenue > 0 ? 4 : 2)}%`,
                        }}
                      >
                        <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                          ${day.revenue.toFixed(0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>{last_30_days[0]?.date}</span>
                <span>{last_30_days[7]?.date}</span>
                <span>{last_30_days[14]?.date}</span>
                <span>{last_30_days[21]?.date}</span>
                <span>{last_30_days[29]?.date}</span>
              </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
              {/* Recent Sales Table */}
              <section className="bg-white dark:bg-background-dark rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-primary/10">
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Recent Sales History
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold">
                      <tr>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest">
                          Date
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-center">
                          Qty
                        </th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                      {sale_items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-12 text-center text-slate-500"
                          >
                            No sales recorded yet
                          </td>
                        </tr>
                      ) : (
                        sale_items.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-primary/5 transition-colors"
                          >
                            <td className="px-6 py-4 text-slate-500">
                              {dayjs(item.created_at).format("MMM DD, YYYY")}
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                              {item.sale.customer?.name || "Walk-in Customer"}
                            </td>
                            <td className="px-6 py-4 text-center text-slate-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-slate-100">
                              $
                              {item.total_price.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {sale_items.length > 0 && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-200 dark:border-primary/10">
                    <Link
                      href="/sales"
                      className="text-primary text-xs font-bold hover:underline"
                    >
                      View All Sales
                    </Link>
                  </div>
                )}
              </section>

              {/* Stock Movement Log */}
              <section className="bg-white dark:bg-background-dark rounded-2xl border border-slate-200 dark:border-primary/20 shadow-lg overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-primary/10">
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Stock Movement Log
                  </h2>
                </div>
                <div className="p-6 space-y-6">
                  {stock_movements.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">
                      No stock movements recorded
                    </p>
                  ) : (
                    stock_movements.map((movement, i) => (
                      <div
                        key={i}
                        className={`relative flex gap-4 pl-8 ${i < stock_movements.length - 1 ? "before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-0 before:w-px before:bg-primary/20" : ""}`}
                      >
                        <div
                          className={`absolute left-0 top-1.5 size-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-background-dark ${
                            movement.type === "sale"
                              ? "bg-red-500/20"
                              : movement.type === "inbound"
                                ? "bg-emerald-500/20"
                                : "bg-primary/20"
                          }`}
                        >
                          {movement.type === "sale" ? (
                            <ArrowUpRight
                              size={14}
                              className="text-red-500 font-bold"
                            />
                          ) : movement.type === "inbound" ? (
                            <ArrowDownLeft
                              size={14}
                              className="text-emerald-500 font-bold"
                            />
                          ) : (
                            <RefreshCw
                              size={14}
                              className="text-primary font-bold"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {movement.type === "sale"
                                ? "Sale Transaction"
                                : movement.type === "inbound"
                                  ? "Stock Inbound"
                                  : "Inventory Adjustment"}
                            </p>
                            <span className="text-xs text-slate-500">
                              {dayjs(movement.date).format("MMM DD")}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {movement.description}
                          </p>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-widest ${
                              movement.type === "sale"
                                ? "text-red-500"
                                : movement.type === "inbound"
                                  ? "text-emerald-500"
                                  : "text-primary"
                            }`}
                          >
                            {movement.type === "sale" ? "-" : "+"}
                            {movement.quantity} units
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-200 dark:border-primary/10">
                  <button className="text-primary text-xs font-bold hover:underline cursor-pointer">
                    View Full Logs
                  </button>
                </div>
              </section>
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
            <span>INVENTORY MANAGER • V2.4.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

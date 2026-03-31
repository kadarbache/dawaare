import ButtonAddProduct from "@/components/buttonAddProduct";
import StatusCard from "@/components/StatusCard";
import { prisma } from "@/lib/db";
import dayjs from "dayjs";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Layers,
  ListChecks,
  PackageOpen,
  Pencil,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

export default async function InventoryPage() {
  const data = await prisma.product.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  const products = data;

  const lowStockProducts = products.filter(
    (product) => product.is_low_stock,
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock_qty === 0,
  ).length;

  const outOfStockSinceYesterday = products.filter(
    (product) =>
      product.stock_qty === 0 &&
      dayjs(product.updated_at).isAfter(dayjs().subtract(1, "day")),
  ).length;

  const productsAddedLastMonth = products.filter((product) =>
    dayjs(product.created_at).isAfter(dayjs().subtract(1, "month")),
  ).length;

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock_qty,
    0,
  );

  // inventory value from last month (products that existed before last month)
  const lastMonthCutoff = dayjs().subtract(1, "month");
  const inventoryValueFromLastMonth = products
    .filter((product) => dayjs(product.created_at).isBefore(lastMonthCutoff))
    .reduce((sum, product) => sum + product.price * product.stock_qty, 0);

  const inventoryValueChange =
    inventoryValueFromLastMonth > 0
      ? ((inventoryValue - inventoryValueFromLastMonth) /
          inventoryValueFromLastMonth) *
        100
      : 0;

  const isInventoryValueDown = inventoryValueChange < 0;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20">
        {/* Top Navigation Bar */}
        <Topbar page="Inventory" subPage="" />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
          <div className="max-w-360 mx-auto px-8 py-8">
            {/* Page Header & Stats */}
            <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">
                  Inventory Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                  Real-time overview of your product stock and performance
                </p>
              </div>
              <div className="flex gap-3">
                {/* Add Product Button */}
                <ButtonAddProduct />
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-primary/10 border border-slate-200 dark:border-primary/30 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-primary/20 transition-all cursor-pointer">
                  <SlidersHorizontal size={16} />
                  Filter
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatusCard
                title="Total Products"
                value={products.length.toString()}
                description={`${productsAddedLastMonth} added since last month`}
                variant="success"
                icon={<Layers size={20} className="text-primary" />}
                trendIcon={<TrendingUp size={12} />}
              />

              <StatusCard
                title="Low Stock Items"
                value={lowStockProducts.toString()}
                description={
                  lowStockProducts > 0
                    ? "Critical attention"
                    : "All items well stocked"
                }
                variant={lowStockProducts > 0 ? "danger" : "success"}
                icon={<AlertTriangle size={20} className="text-primary" />}
                trendIcon={<AlertCircle size={12} />}
              />

              <StatusCard
                title="Out of Stock"
                value={outOfStockProducts.toString()}
                description={
                  outOfStockSinceYesterday > 0
                    ? `${outOfStockSinceYesterday} went out of stock since yesterday`
                    : "No change from yesterday"
                }
                variant={outOfStockProducts > 0 ? "danger" : "success"}
                icon={<Ban size={20} className="text-primary" />}
                trendIcon={<AlertCircle size={12} />}
              />

              <div className="flex flex-col gap-2 rounded-2xl p-6 border border-slate-200 dark:border-primary/30 bg-white dark:bg-background-dark shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Inventory Value
                  </p>
                  <Wallet size={20} className="text-primary" />
                </div>
                <p className="text-primary text-3xl font-black">
                  $
                  {inventoryValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p
                  className={`text-xs font-bold flex items-center gap-1 ${
                    isInventoryValueDown ? "text-red-500" : "text-emerald-500"
                  }`}
                >
                  {isInventoryValueDown ? (
                    <TrendingDown size={12} />
                  ) : (
                    <TrendingUp size={12} />
                  )}
                  {inventoryValueChange === 0
                    ? "No change from last month"
                    : `${isInventoryValueDown ? "" : "+"}${inventoryValueChange.toFixed(1)}% vs last month`}
                </p>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden flex flex-col mb-12">
              <div className="p-4 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/10">
                <h3 className="font-bold flex items-center gap-2">
                  <ListChecks size={20} className="text-primary" />
                  Stock List
                </h3>
              </div>

              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <PackageOpen size={40} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    No products yet
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-6">
                    Your inventory is empty. Add your first product to get
                    started with tracking stock and sales.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10">
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Image
                          </th>
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Product Name
                          </th>
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Category
                          </th>
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Price
                          </th>
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Cost Price
                          </th>
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Stock Count
                          </th>
                          <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="hover:bg-primary/5 transition-colors group"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-12 border border-slate-200 dark:border-primary/30 group-hover:border-primary/50 transition-colors"
                                data-alt={product.name}
                                style={{
                                  backgroundImage: `url("${product.image}")`,
                                }}
                              ></div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <Link
                                  href={`/inventory/${product.id}`}
                                  className="text-slate-900 dark:text-slate-100 font-bold text-sm hover:text-primary transition-colors"
                                >
                                  {product.name}
                                </Link>
                                <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
                                  SKU: {product.sku}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-bold text-sm">
                              {product.price}
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                              {product.cost_price}
                            </td>
                            <td className="px-6 py-4">
                              {product.is_low_stock ? (
                                <span className="text-primary font-black text-sm flex items-center gap-1">
                                  {product.stock_qty}{" "}
                                  <span className="text-[10px] font-bold uppercase tracking-widest">
                                    (Low)
                                  </span>
                                </span>
                              ) : (
                                <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                                  {product.stock_qty}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">
                                  <Pencil size={14} />
                                  Edit
                                </button>
                                <Link
                                  href={`/inventory/${product.id}`}
                                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <BarChart3 size={14} />
                                  Analytics
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                      Showing{" "}
                      <span className="font-bold text-primary">1-5</span> of{" "}
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        1,240
                      </span>{" "}
                      products
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
                        disabled={true}
                      >
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
                        248
                      </button>
                      <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors cursor-pointer">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </>
              )}
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

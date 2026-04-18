"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import Link from "next/link";
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
import StatusCard from "@/components/StatusCard";
import ButtonAddProduct from "@/components/buttonAddProduct";
import SimpleDropdown from "@/components/ui/SimpleDropdown";
import { Filter } from "../page";
import { ItemsCategory, Product } from "@/utils/types";

export const PAGE_SIZE = 15;

export type InventoryStats = {
  totalProducts: number;
  productsAddedLastMonth: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  outOfStockSinceYesterday: number;
  inventoryValue: number;
  inventoryValueChange: number;
  isInventoryValueDown: boolean;
};

type FilterOption = {
  value: Filter;
  label: string;
};

export default function InventoryClient({
  products,
  stats,
  total,
  currentPage,
  categories,
}: {
  products: Product[];
  stats: InventoryStats;
  total: number;
  currentPage: number;
  categories: ItemsCategory[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const filterOptions: FilterOption[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "lowest price", label: "Lowest Price" },
    { value: "highest price", label: "Highest Price" },
    { value: "out of stock", label: "Out of Stock" },
    { value: "low stock", label: "Low Stock" },
  ];

  const [selectedFilter, setSelectedFilter] = useState<Filter>("newest");

  const total_pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // work on filtering functionality
  function push_params(params: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => next.set(k, v));
    startTransition(() => router.push(`/inventory?${next.toString()}`));
  }

  function handle_page(p: number) {
    push_params({ page: String(p) });
  }

  function handle_filter(value: Filter) {
    push_params({ filter: value, page: "1" });
  }

  const page_numbers = Array.from(
    { length: total_pages },
    (_, i) => i + 1,
  ).filter(
    (p) => p === 1 || p === total_pages || Math.abs(p - currentPage) <= 1,
  );

  return (
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
          <ButtonAddProduct categories={categories} />
          <SimpleDropdown
            placeholder="Filter products"
            options={filterOptions}
            icon={<SlidersHorizontal size={20} className="text-primary" />}
            value={selectedFilter}
            onChange={(value) => {
              handle_filter(value as Filter);
              setSelectedFilter(value as Filter);
            }}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          description={`${stats.productsAddedLastMonth} added since last month`}
          variant="success"
          icon={<Layers size={20} className="text-primary" />}
          trendIcon={<TrendingUp size={12} />}
        />

        <StatusCard
          title="Low Stock Items"
          value={stats.lowStockProducts.toString()}
          description={
            stats.lowStockProducts > 0
              ? "Critical attention"
              : "All items well stocked"
          }
          variant={stats.lowStockProducts > 0 ? "danger" : "success"}
          icon={<AlertTriangle size={20} className="text-primary" />}
          trendIcon={<AlertCircle size={12} />}
        />

        <StatusCard
          title="Out of Stock"
          value={stats.outOfStockProducts.toString()}
          description={
            stats.outOfStockSinceYesterday > 0
              ? `${stats.outOfStockSinceYesterday} went out of stock since yesterday`
              : "No change from yesterday"
          }
          variant={stats.outOfStockProducts > 0 ? "danger" : "success"}
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
            {stats.inventoryValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p
            className={`text-xs font-bold flex items-center gap-1 ${
              stats.isInventoryValueDown ? "text-red-500" : "text-emerald-500"
            }`}
          >
            {stats.isInventoryValueDown ? (
              <TrendingDown size={12} />
            ) : (
              <TrendingUp size={12} />
            )}
            {stats.inventoryValueChange === 0
              ? "No change from last month"
              : `${stats.isInventoryValueDown ? "" : "+"}${stats.inventoryValueChange.toFixed(1)}% vs last month`}
          </p>
        </div>
      </div>

      {/* Inventory Table */}
      <div
        className={`bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden flex flex-col mb-12 transition-opacity duration-200 ${isPending ? "opacity-50" : ""}`}
      >
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
              Your inventory is empty. Add your first product to get started
              with tracking stock and sales.
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
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12 border border-slate-200 dark:border-primary/30 group-hover:border-primary/50 transition-colors"
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
                products
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
                    <Fragment key={p}>
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
                    </Fragment>
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
          </>
        )}
      </div>
    </div>
  );
}

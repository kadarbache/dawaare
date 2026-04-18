"use client";

import ButtonAddProduct from "@/components/buttonAddProduct";
import SimpleDropdown from "@/components/ui/SimpleDropdown";
import { ItemsCategory, Product } from "@/utils/types";
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  PackageOpen,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState, useTransition } from "react";
import { Filter } from "../page";
import ProductList from "./ProductList";
import Status from "./Status";

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
      <Status stats={stats} />

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
              <ProductList products={products} categories={categories} />
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

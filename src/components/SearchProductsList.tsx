import React, { use } from "react";
import { Product } from "./ui/SearchModal";
import Image from "next/image";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchProductsList({
  promise,
  query,
}: {
  promise: Promise<Product[]>;
  query: string;
}) {
  const products = use(promise);

  if (!query.trim()) {
    // Idle state
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400 h-full min-h-[200px]">
        <Search className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-base font-medium text-slate-900 dark:text-slate-100">
          Discover products
        </p>
        <p className="text-sm mt-1 text-center max-w-sm">
          Type a name or SKU to search through your inventory.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    // Empty state
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400 h-full min-h-[200px]">
        <Search className="w-8 h-8 mb-4 text-slate-300 dark:text-slate-600" />
        <p className="text-base font-medium text-slate-900 dark:text-slate-100">
          No results found
        </p>
        <p className="text-sm mt-1">
          We couldn&apos;t find anything matching &quot;{query}&quot;.
        </p>
      </div>
    );
  }

  // Success state
  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="group flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all cursor-pointer"
        >
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-background-dark/10 dark:bg-background-dark flex items-center justify-center">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-xl text-slate-400 font-bold uppercase">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                {product.name}
              </h3>
              <span className="text-primary font-bold text-sm sm:text-base shrink-0">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              <span className="bg-slate-200/50 dark:bg-background-dark px-1.5 sm:px-2 py-0.5 rounded border border-slate-300 dark:border-primary/10">
                SKU: {product.sku}
              </span>
              {product.stock_qty > 0 ? (
                product.is_low_stock || product.stock_qty < 10 ? (
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Low Stock ({product.stock_qty} left)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock
                  </span>
                )
              ) : (
                <span className="flex items-center gap-1 text-slate-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          <Link href={`/inventory/${product.id}`}>
            <button
              type="button"
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-200 hover:bg-slate-300 dark:bg-background-dark dark:hover:bg-primary/20 border border-slate-300 dark:border-primary/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0"
            >
              Select
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

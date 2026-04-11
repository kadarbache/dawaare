"use client";

import { useRef, useState, useTransition, Suspense } from "react";
import { Search, X, Loader2 } from "lucide-react";
import DialogModal from "../DialogModel";
import SearchProductsList from "../SearchProductsList";

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  sku: string;
  stock_qty: number;
  is_low_stock: boolean;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function fetchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return Promise.resolve([]);
  return fetch(`/api/products?query=${encodeURIComponent(query)}`)
    .then((res) => res.json())
    .catch(() => []);
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "customers">(
    "products",
  );

  // We manage the promise in state so use() doesn't suspend on every render
  const [productsPromise, setProductsPromise] = useState<Promise<Product[]>>(
    () => Promise.resolve([]),
  );
  const [isPending, startTransition] = useTransition();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      startTransition(() => {
        setProductsPromise(fetchProducts(val));
      });
    }, 300);
  };

  const clearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    startTransition(() => {
      setProductsPromise(Promise.resolve([]));
    });
  };

  return (
    <>
      <DialogModal
        isOpen={isOpen}
        onClose={onClose}
        title="Search Results"
        description="Search for products or customers"
      >
        {/* Search Input Container */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search products..."
            className="block w-full pl-11 pr-12 py-3 bg-background-dark/5 dark:bg-background-dark/50 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
            ) : null}
            <button
              type="button"
              className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 border-b border-primary/5 shrink-0 flex overflow-x-auto custom-scrollbar mt-4">
          <div className="flex gap-6 sm:gap-8 min-w-max">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 border-b-2 font-semibold text-sm whitespace-nowrap outline-none transition-colors ${activeTab === "products" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`py-4 border-b-2 font-semibold text-sm whitespace-nowrap outline-none transition-colors ${activeTab === "customers" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              Customers
            </button>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar min-h-[300px]">
          {activeTab === "products" ? (
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center p-8 text-slate-500 h-full min-h-[200px]">
                  <Loader2 className="w-8 h-8 border-primary animate-spin mb-4" />
                  <p className="text-sm">Searching products...</p>
                </div>
              }
            >
              <SearchProductsList query={query} promise={productsPromise} />
            </Suspense>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-slate-500 h-full min-h-[200px]">
              <p className="text-sm">Customer search coming soon.</p>
            </div>
          )}
        </div>
      </DialogModal>
    </>
  );
}

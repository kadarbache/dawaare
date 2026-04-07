"use client";

import { useRef } from "react";
import { Search, X } from "lucide-react";
import Image from "next/image";
import DialogModal from "../DialogModel";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // TODO: use the reusable DialogModal component
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
            defaultValue="Coffee"
            placeholder="Search products..."
            className="block w-full pl-11 pr-12 py-3 bg-background-dark/5 dark:bg-background-dark/50 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all outline-none"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              className="text-slate-400 hover:text-primary transition-colors focus:outline-none"
              aria-label="Clear search"
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = "";
                  inputRef.current.focus();
                }
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 border-b border-primary/5 shrink-0 flex overflow-x-auto custom-scrollbar">
          <div className="flex gap-6 sm:gap-8 min-w-max">
            <button className="py-4 border-b-2 border-primary text-primary font-semibold text-sm whitespace-nowrap outline-none">
              Products (12)
            </button>
            <button className="py-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium text-sm transition-colors whitespace-nowrap outline-none focus-visible:text-primary">
              Orders
            </button>
            <button className="py-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium text-sm transition-colors whitespace-nowrap outline-none focus-visible:text-primary">
              Customers
            </button>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 custom-scrollbar min-h-[300px]">
          <div className="space-y-2">
            {/* Result Item 1 */}
            <div className="group flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all cursor-pointer">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-background-dark/10 dark:bg-background-dark flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB57yWnAzQfOeu2jl9p_cFMYsPyD5GmeiYxZ5AJtKABQKFZh7ItOWxtXLQ2yDv9fP1xn_DdFZgKEqyFtdpPIldaeEUEv_RmBVRQkRVARpa7SP9Du0OH2eejt2415ULfls03IaP-78YEWSI-WD4YOP-ZUY36_LF0xEAxJz_Xd4p8_6XGTI3g778A6OqDQ4Eo6XrNbgxLUJfkW_In1mRY6M7xo35bhA8HQMgs76WnjIzFJpWjMaa6jilGZDEFAFB1SQkNvOseTGQOM2Q"
                  alt="Arabica Coffee Beans"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                    Arabica Coffee Beans
                  </h3>
                  <span className="text-primary font-bold text-sm sm:text-base shrink-0">
                    $15.00
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-200/50 dark:bg-background-dark px-1.5 sm:px-2 py-0.5 rounded border border-slate-300 dark:border-primary/10">
                    SKU: ABC-123
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 shrink-0"
              >
                Select
              </button>
            </div>

            {/* Result Item 2 */}
            <div className="group flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all cursor-pointer">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-background-dark/10 dark:bg-background-dark flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdjEgHcPTzWIasDgTeS_Y-plA_qbaHgYQobmN6uvcBmYQrSYWJ9EUs4fG6m1nRk-IuEw2jxQ7fbxLszYai_FUnIOGM23RVqZa8fb_6_F7a0mkmsZftazNySij2zenktkacd-bbFDfjtmi3YBop7woxySOGABWpHb5xn0-vlwU8NuF7yPD5UBD4X6nPAqKfiDnxhzlKmvpEFKYAsl9w1nLbsLDB5Mve9LcPyiUaIkYQozz5Q6RyjGP2YBtA8DhZReFIwGBpspINayI"
                  alt="Dark Roast Blend"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                    Dark Roast Blend
                  </h3>
                  <span className="text-primary font-bold text-sm sm:text-base shrink-0">
                    $18.50
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-200/50 dark:bg-background-dark px-1.5 sm:px-2 py-0.5 rounded border border-slate-300 dark:border-primary/10">
                    SKU: DRK-456
                  </span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    Low Stock (3 left)
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-200 hover:bg-slate-300 dark:bg-background-dark dark:hover:bg-primary/20 border border-slate-300 dark:border-primary/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0"
              >
                Select
              </button>
            </div>

            {/* Result Item 3 */}
            <div className="group flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all cursor-pointer">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-background-dark/10 dark:bg-background-dark flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_ByadxzdxoQzP0dpAiUlj1auHdcvAP4U4Qad6wtHP13OHbTarbwVwVyaiifQvOU26Gv0PsH49SUMgh72QIg5jojknTXnBYvfhonbU2IB-OmfHmYQU_1B2RmPzoPscVq0udIvOx-sdDxUXb5v4bE6EerPLsHMmAyoPQK-2H5MVPPY6cywFPMVm319GHVt8ohj6Rlh96CAqxpaEBpdvIHT-AMgt-5qzEQPAI6Nie8lmhGer3UJzdBp7ZDPAQGYXDqmVUiVZIYNfpFs"
                  alt="Espresso Gold Edition"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                    Espresso Gold Edition
                  </h3>
                  <span className="text-primary font-bold text-sm sm:text-base shrink-0">
                    $22.00
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-200/50 dark:bg-background-dark px-1.5 sm:px-2 py-0.5 rounded border border-slate-300 dark:border-primary/10">
                    SKU: ESP-789
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-200 hover:bg-slate-300 dark:bg-background-dark dark:hover:bg-primary/20 border border-slate-300 dark:border-primary/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0"
              >
                Select
              </button>
            </div>

            {/* Result Item 4 */}
            <div className="group flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all cursor-pointer">
              <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-lg overflow-hidden bg-background-dark/10 dark:bg-background-dark flex items-center justify-center">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3KaJ36E8STsSsmsJMlzExbld_S9uf2Ut2eFGz3gEJpWP4rnzXHmdqHvl3ciyI9KAhl9eACuVvkG70SO7765PoinrrEynT9MnqCzcvvGW04lMnlqwlfENl7_S1Tcke86fTfeRjRdNi7Gs2H7sfVyGtsXgCFQBDShWHI2ZYas-Xj1tcqN0O4BQbaxckVF8ZC_ZqnbazSpmqLVW-rEYZiJR3Kt-m7fwNHoHy4Q9qaANhE7di0vvwGhlouhhuvHan_jpSRkTskZ5o4QI"
                  alt="Cold Brew Concentrate"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between mb-1 gap-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate pr-2">
                    Cold Brew Concentrate
                  </h3>
                  <span className="text-primary font-bold text-sm sm:text-base shrink-0">
                    $12.99
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span className="bg-slate-200/50 dark:bg-background-dark px-1.5 sm:px-2 py-0.5 rounded border border-slate-300 dark:border-primary/10">
                    SKU: CBC-001
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-200 hover:bg-slate-300 dark:bg-background-dark dark:hover:bg-primary/20 border border-slate-300 dark:border-primary/20 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </DialogModal>
    </>
  );
}

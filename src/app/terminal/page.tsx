"use client";

import React from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Barcode,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  Banknote,
  Wallet,
  CreditCard,
  UserPlus,
  FileText,
  Pen,
} from "lucide-react";

export default function TerminalPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        {/* Top Navigation Bar */}
        <Topbar page="Terminal" subPage="Register #04" />

        {/* POS Workspace */}
        <main className="flex flex-1 overflow-hidden">
          {/* Left Side: Scanning Zone */}
          <section className="w-[60%] flex flex-col p-8 gap-6 overflow-hidden">
            {/* Search & Barcode Area */}
            <div className="relative group shrink-0">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Barcode size={24} className="text-primary" />
              </div>
              <input
                autoFocus
                className="w-full h-14 bg-white dark:bg-[#2d1e16] border border-slate-200 dark:border-primary/20 rounded-xl pl-14 pr-16 text-lg font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none shadow-sm"
                placeholder="Scan barcode or type product name (F10)..."
                type="text"
              />
              <div className="absolute inset-y-0 right-5 flex items-center">
                <kbd className="px-2 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded text-xs font-bold text-primary">
                  F10
                </kbd>
              </div>
            </div>

            {/* Cart Table Card */}
            <div className="flex-1 bg-white dark:bg-[#2d1e16] rounded-xl border border-slate-200 dark:border-primary/10 overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/5 shrink-0">
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <ShoppingCart size={16} className="text-primary" />
                  Current Sale (4 items)
                </h3>
                <button className="text-[10px] font-black text-red-500 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded transition-colors uppercase tracking-wider">
                  <Trash2 size={14} />
                  Clear All
                </button>
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10 text-slate-500 uppercase text-[11px] font-bold tracking-wider z-10">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-center">Qty</th>
                      <th className="px-6 py-4 text-right">Subtotal</th>
                      <th className="px-6 py-4 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                    {/* Row 1 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-5 font-medium text-slate-900 dark:text-white">
                        Fresh Organic Espresso Beans (1kg)
                      </td>
                      <td className="px-6 py-5 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                        EB-9012
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                        $24.50
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
                            2
                          </span>
                          <button className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-right text-primary">
                        $49.00
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-5 font-medium text-slate-900 dark:text-white">
                        Premium Ceramic Mug - Black
                      </td>
                      <td className="px-6 py-5 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                        CM-4402
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                        $12.00
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
                            1
                          </span>
                          <button className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-right text-primary">
                        $12.00
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>

                    {/* Row 3 */}
                    <tr className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-5 font-medium text-slate-900 dark:text-white">
                        Milk Frother Wand - Pro
                      </td>
                      <td className="px-6 py-5 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
                        MF-1011
                      </td>
                      <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                        $35.00
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <button className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
                            1
                          </span>
                          <button className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-right text-primary">
                        $35.00
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors">
                          <Pen size={18} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Right Side: Summary Sidebar */}
          <aside className="w-[40%] flex flex-col p-8 border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 overflow-y-auto">
            {/* Amount and Payment Card */}
            <div className="bg-white dark:bg-[#2d1e16] p-8 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-2xl mb-6 flex-1 flex flex-col">
              <div className="mb-10">
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
                  Total Amount Payable
                </p>
                <h1 className="text-7xl font-black text-primary leading-none">
                  $96.00
                </h1>
                <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-primary/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      $91.43
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax (5%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      $4.57
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">
                  Select Payment Method
                </p>

                {/* Cash Payment */}
                <button className="w-full py-5 px-6 bg-[#4b2c20] text-white rounded-xl flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-lg border border-white/5">
                  <div className="flex items-center gap-4">
                    <Banknote size={32} />
                    <div className="text-left">
                      <p className="text-lg font-black leading-tight">Cash</p>
                      <p className="text-white/60 text-[10px] uppercase tracking-wider">
                        Standard checkout
                      </p>
                    </div>
                  </div>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] font-black">
                    F1
                  </kbd>
                </button>

                {/* Zaad Payment */}
                <button className="w-full py-5 px-6 bg-[#22c55e] text-white rounded-xl flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-green-900/20">
                  <div className="flex items-center gap-4">
                    <Wallet size={32} />
                    <div className="text-left">
                      <p className="text-lg font-black leading-tight">Zaad</p>
                      <p className="text-white/80 text-[10px] uppercase tracking-wider">
                        Direct Wallet Transfer
                      </p>
                    </div>
                  </div>
                  <kbd className="px-2 py-1 bg-black/10 rounded text-[10px] font-black">
                    F2
                  </kbd>
                </button>

                {/* eDahab Payment */}
                <button className="w-full py-5 px-6 bg-[#facc15] text-slate-900 rounded-xl flex items-center justify-between hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-yellow-900/20">
                  <div className="flex items-center gap-4">
                    <CreditCard size={32} />
                    <div className="text-left">
                      <p className="text-lg font-black leading-tight">eDahab</p>
                      <p className="text-slate-900/70 text-[10px] uppercase tracking-wider">
                        Tap or Phone Scan
                      </p>
                    </div>
                  </div>
                  <kbd className="px-2 py-1 bg-black/10 rounded text-[10px] font-black">
                    F3
                  </kbd>
                </button>
              </div>
            </div>

            {/* Customer & Note Area shrink-0 keeps its size */}
            <div className="flex flex-col gap-4 shrink-0">
              <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-xl border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
                <UserPlus
                  size={20}
                  className="text-slate-400 dark:text-slate-500"
                />
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
                  placeholder="Add Customer (Optional)"
                  type="text"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-xl border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
                <FileText
                  size={20}
                  className="text-slate-400 dark:text-slate-500"
                />
                <input
                  className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
                  placeholder="Order Note..."
                  type="text"
                />
              </div>
            </div>
          </aside>
        </main>

        {/* Bottom Action Bar */}
        <footer className="h-10 bg-slate-100 dark:bg-[#1a110c] text-slate-500 px-8 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] shrink-0 border-t border-slate-200 dark:border-primary/10 z-40">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 dark:bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              F1
            </span>{" "}
            Cash
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 dark:bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              F2
            </span>{" "}
            Zaad
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 dark:bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              F3
            </span>{" "}
            eDahab
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 dark:bg-primary/20 text-primary px-1.5 py-0.5 rounded">
              F10
            </span>{" "}
            Scan
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-50 dark:bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded">
              ESC
            </span>{" "}
            Cancel
          </div>
          <div className="ml-auto flex items-center gap-4 text-slate-400 dark:text-slate-600">
            <span>POS TERMINAL #04</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>V2.4.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

import React from "react";
import { Minus, Pen, Plus, ShoppingCart, Trash2 } from "lucide-react";

export default function CartTable() {
  return (
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
  );
}

import React from "react";
import { Filter, History, PlusCircle, TrendingUp, Wallet } from "lucide-react";
export default function page() {
  return (
    <>
      {/* Summary Card */}
      <div className="bg-white dark:bg-background-dark rounded-2xl border border-slate-200 dark:border-primary/30 p-8 mb-8 flex items-center justify-between shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={20} className="text-primary" />
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Total Outstanding Balance
            </h4>
          </div>
          <p className="text-7xl font-black text-primary">$120.00</p>
          <p className="text-xs text-slate-400 mt-4 italic">
            Calculated from 3 unpaid transactions
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:scale-[1.02] active:scale-95 text-white font-bold rounded-md transition-all shadow-lg shadow-primary/20">
            <PlusCircle size={20} />
            Add New Sale
          </button>
        </div>
      </div>

      {/* Debt History Table */}
      <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/10 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History size={20} className="text-primary" />
            Debt History
          </h3>
          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider">
            <Filter size={14} />
            Filter History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Items Bought
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
              {/* Row 1 */}
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">Oct 24, 2023</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">Grocery Bundle A, Milk 2L</p>
                  <p className="text-xs text-slate-500 font-mono">Inv #8821</p>
                </td>
                <td className="px-6 py-4 font-black">$45.00</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20">
                      Unpaid
                    </span>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">Oct 18, 2023</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">Household Cleaning Kit</p>
                  <p className="text-xs text-slate-500 font-mono">Inv #8792</p>
                </td>
                <td className="px-6 py-4 font-black">$75.00</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Partial
                    </span>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">Sep 30, 2023</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">Electronic Repair Parts</p>
                  <p className="text-xs text-slate-500 font-mono">Inv #8610</p>
                </td>
                <td className="px-6 py-4 font-black">$120.00</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Paid
                    </span>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-4 text-sm font-medium">Sep 15, 2023</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold">Bulk Sugar (50kg)</p>
                  <p className="text-xs text-slate-500 font-mono">Inv #8555</p>
                </td>
                <td className="px-6 py-4 font-black">$55.00</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Paid
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-primary/10 border-t border-slate-200 dark:border-primary/10 flex justify-center">
          <button className="text-[10px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.2em]">
            Load More Transactions
          </button>
        </div>
      </div>

      {/* Additional Stats/Notes */}
      <div className="mt-8 grid grid-cols-2 gap-6 pb-8">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark shadow-lg">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Customer Notes
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Preferred payment on the 1st of every month. Usually buys for
            business use. Trusted regular customer.
          </p>
        </div>
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark shadow-lg flex items-center gap-6">
          <div className="h-14 w-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
            <TrendingUp size={28} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
              Repayment Rate
            </h4>
            <p className="text-4xl font-black text-primary">84%</p>
          </div>
        </div>
      </div>
    </>
  );
}

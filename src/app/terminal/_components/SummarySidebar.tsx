import React, { useState } from "react";
import SimpleDropdown from "@/components/ui/SimpleDropdown";
import { Banknote, ShoppingCart, UserPlus } from "lucide-react";
const paymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "Zaad", value: "zaad" },
  { label: "eDahab", value: "edahab" },
];
export default function SummarySidebar() {
  const [paymentMethod, setPaymentMethod] = useState("");
  return (
    <aside className="w-[30%] flex flex-col p-8 border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 overflow-y-auto">
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

          <SimpleDropdown
            options={paymentOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Payment method..."
            icon={<Banknote size={20} />}
          />
        </div>
      </div>

      {/* Customer & Note Area shrink-0 keeps its size */}
      <div className="flex flex-col gap-4 shrink-0">
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-xl border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
          <UserPlus size={20} className="text-slate-400 dark:text-slate-500" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
            placeholder="Add Customer (Optional)"
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-xl border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
          <Banknote size={20} className="text-slate-400 dark:text-slate-500" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
            placeholder="Amount Paid (leave empty for full debt)..."
            type="number"
          />
        </div>
        <button className="w-full py-4 bg-primary text-white rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg font-bold text-lg uppercase tracking-wider">
          <ShoppingCart size={20} />
          Complete Sale
        </button>
      </div>
    </aside>
  );
}

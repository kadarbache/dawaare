"use client";

import RepayDebtModal from "@/app/customers/_components/RepayDebtModal";
import {
  Repayment,
  SaleWithCustomerWithRepaymentsAndItems,
} from "@/utils/types";
import dayjs from "dayjs";
import { CheckCircle2, Clock, History, Plus, Receipt } from "lucide-react";
import { useState } from "react";

interface SaleDetailClientProps {
  sale: SaleWithCustomerWithRepaymentsAndItems;
}

export default function SaleDetailClient({ sale }: SaleDetailClientProps) {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);

  const currentDebt = sale.remaining;
  const totalAmount = sale.total_amount;
  const amountPaid = sale.amount_paid;
  const repayPercentage =
    totalAmount > 0 ? Math.round((amountPaid / totalAmount) * 100) : 100;

  return (
    <div className="flex-1 overflow-y-auto bg-background-dark text-[#f8ddd4]">
      <main className="pt-10 pb-12 px-4 lg:px-6 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-orange-600/10 text-primary text-[10px] font-black tracking-widest uppercase border border-orange-600/20">
                {sale.status === "paid" ? "Paid in Full" : "Active Sale"}
              </span>
              <span className="text-stone-500 text-[10px] font-bold tracking-widest uppercase">
                ID: #{sale.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#f8ddd4] tracking-tighter">
              Debt Sale Details
            </h1>
            <p className="text-stone-400 text-sm mt-2 font-medium">
              Transaction initiated on{" "}
              {dayjs(sale.created_at).format("MMM DD, YYYY")} • Customer:{" "}
              {sale.customer?.name || "Walk-in"}
            </p>
          </div>

          {sale.remaining > 0 && (
            <button
              onClick={() => setIsRepayModalOpen(true)}
              className="bg-primary text-white px-8 py-4 rounded-md font-black text-xs tracking-widest uppercase shadow-[0_0_20px_rgba(236,91,19,0.4)] active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={16} strokeWidth={3} />
              Add Repayment
            </button>
          )}
        </div>

        {/* Sale Summary Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Main Balance Card */}
          <div className="md:col-span-2 bg-[#2d1e16] rounded-md p-8 border border-orange-600/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-orange-600/10"></div>
            <p className="text-[10px] font-black tracking-widest uppercase text-primary mb-4">
              Remaining Balance
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-[#f8ddd4] tracking-tighter">
                ${currentDebt.toFixed(2)}
              </span>
              <span className="text-stone-500 text-sm font-bold uppercase tracking-widest">
                USD
              </span>
            </div>
            <div className="mt-8 flex gap-4 items-center">
              <div className="h-1 flex-1 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-600 shadow-[0_0_10px_rgba(236,91,19,0.8)] transition-all duration-1000"
                  style={{ width: `${repayPercentage}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-stone-400 whitespace-nowrap">
                {repayPercentage}% REPAID
              </span>
            </div>
          </div>

          {/* Total Sale Card */}
          <div className="bg-[#2d1e16] rounded-md p-6 border border-orange-600/10 hover:border-orange-600/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-stone-900/50 p-2 rounded-md">
                <Receipt size={20} className="text-stone-500" />
              </div>
            </div>
            <p className="text-[10px] font-black tracking-widest uppercase text-stone-500 mb-1">
              Total Sale Amount
            </p>
            <p className="text-2xl font-black text-[#f8ddd4]">
              ${sale.total_amount.toFixed(2)}
            </p>
          </div>

          {/* Amount Paid Card */}
          <div className="bg-[#2d1e16] rounded-md p-6 border border-orange-600/10 hover:border-orange-600/30 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-[#10b9811a] p-2 rounded-md">
                <CheckCircle2 size={20} className="text-[#10b981]" />
              </div>
            </div>
            <p className="text-[10px] font-black tracking-widest uppercase text-stone-500 mb-1">
              Amount Paid
            </p>
            <p className="text-2xl font-black text-[#10b981]">
              ${sale.amount_paid.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Repayment History Section */}
        <section className="bg-[#2d1e16] rounded-md border border-orange-600/10 overflow-hidden mb-12">
          <div className="px-8 py-6 border-b border-orange-600/10 flex justify-between items-center">
            <h3 className="font-black tracking-tighter text-lg uppercase text-[#f8ddd4] flex items-center gap-2">
              <History size={20} className="text-primary" />
              Repayment History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#261813]">
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest uppercase text-stone-500">
                    Repayment ID
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest uppercase text-stone-500">
                    Date
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest uppercase text-stone-500 text-right">
                    Repaid Amount
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black tracking-widest uppercase text-stone-500">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-600/5">
                {sale.repayments?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Clock size={32} className="mb-2" />
                        <p className="text-[10px] font-black tracking-widest uppercase">
                          No repayments recorded yet
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sale.repayments.map((repayment: Repayment) => (
                    <tr
                      key={repayment.id}
                      className="group hover:bg-orange-600/5 transition-colors"
                    >
                      <td className="px-8 py-5 font-mono text-xs text-stone-400">
                        {repayment.id.slice(0, 24)}...
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-[#f8ddd4]">
                        {dayjs(repayment.created_at).format("MMM DD, YYYY")}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-[#10b981] text-right">
                        ${repayment.repaid_amount.toFixed(2)}
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full bg-orange-600/10 text-primary text-[10px] font-black tracking-widest uppercase border border-orange-600/20">
                          {repayment.payment_method}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {sale.repayments?.length > 0 && (
                  <tr className="bg-orange-600/2]">
                    <td className="px-8 py-10 text-center" colSpan={4}>
                      <div className="flex flex-col items-center opacity-40">
                        <p className="text-[10px] font-black tracking-widest uppercase italic">
                          {sale.repayments?.length} repayments recorded
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Repay Debt Modal Integration */}
      <RepayDebtModal
        isOpen={isRepayModalOpen}
        onClose={() => setIsRepayModalOpen(false)}
        sale={sale}
      />
    </div>
  );
}

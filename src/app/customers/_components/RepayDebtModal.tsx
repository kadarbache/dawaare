"use client";

import DialogModal from "@/components/DialogModel";
import { SaleWithCustomerAndItems } from "@/utils/types";
import { Banknote, Smartphone, Landmark } from "lucide-react";
import { useState, useActionState, useEffect } from "react";
import { repayDebt } from "../server";

interface RepayDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleWithCustomerAndItems | null;
}

/**
 * RepayDebtModal Component
 *
 * Provides a UI for recording payments against an existing debt.
 * Features a large terminal-style input for the payment amount
 * and a summary breakdown of the remaining balance.
 */
export default function RepayDebtModal({
  isOpen,
  onClose,
  sale,
}: RepayDebtModalProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  // Hook up server action using useActionState (React 19+)
  const [state, formAction, isPending] = useActionState(repayDebt, null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

  if (!sale) return null;

  const currentDebt = sale.remaining;
  const amountToPay = parseFloat(paymentAmount) || 0;
  const remainingBalance = Math.max(0, currentDebt - amountToPay);
  const isOverpaying = amountToPay > currentDebt;

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Debt Payment"
      max_width="max-w-lg"
    >
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="saleId" value={sale.id} />
        <input type="hidden" name="paymentMethod" value={paymentMethod} />
        {/* Read-only Metrics (Bento Style) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-[#2d1e16] p-4 rounded-md border border-slate-200 dark:border-primary/10">
            <p className="text-[10px] text-slate-500 dark:text-stone-500 uppercase tracking-widest font-medium mb-1">
              Total Sale Amount
            </p>
            <p className="text-slate-900 dark:text-slate-100 font-black text-xl">
              ${sale.total_amount.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-[#2d1e16] p-4 rounded-md border border-slate-200 dark:border-primary/10">
            <p className="text-[10px] text-slate-500 dark:text-stone-500 uppercase tracking-widest font-medium mb-1">
              Amount Already Paid
            </p>
            <p className="text-emerald-500 font-black text-xl">
              ${sale.amount_paid.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Primary Input Section (Terminal style) */}
        <div className="space-y-2">
          <label className="text-[11px] text-primary uppercase tracking-widest font-bold">
            Amount to Pay
          </label>
          <div className="relative bg-white dark:bg-[#1a110c] rounded-md border border-slate-200 dark:border-primary/30 shadow-2xl flex items-center px-6 h-20 group focus-within:border-primary transition-all">
            <span className="text-primary font-black text-3xl mr-4">$</span>
            <input
              autoFocus
              className="bg-transparent border-none focus:ring-0 font-black text-3xl dark:placeholder-stone-700 w-full tracking-tight outline-none text-slate-900 dark:text-slate-100 placeholder-slate-300"
              placeholder="0.00"
              type="number"
              step="0.01"
              name="paymentAmount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Summary Breakdown */}
        <div className="bg-slate-50 dark:bg-primary/5 p-4 rounded-md border border-primary/10 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 dark:text-stone-400">
              Current Debt Balance
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-semibold">
              ${currentDebt.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-primary">
            <span className="font-medium">Payment Entry</span>
            <span className="font-black">-${amountToPay.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 dark:border-primary/20 flex justify-between items-center">
            <span className="text-[11px] text-slate-500 dark:text-stone-500 uppercase tracking-widest font-black">
              Remaining Balance
            </span>
            <span className="text-slate-900 dark:text-slate-100 font-black text-lg">
              ${remainingBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-3">
          <p className="text-[11px] text-slate-500 dark:text-stone-500 uppercase tracking-widest font-bold">
            Payment Method
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "CASH", label: "Cash", icon: Banknote },
              { id: "ZAAD", label: "Zaad", icon: Smartphone },
              { id: "E_DAHAB", label: "eDahab", icon: Landmark },
            ].map((method) => {
              const Icon = method.icon;
              const isActive = paymentMethod === method.id;
              return (
                <button
                  type="button"
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md border-2 transition-all ${
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-primary/10"
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {method.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-4 px-6 rounded-md font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-center disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isOverpaying || isPending || amountToPay <= 0}
            className={`flex-2 py-4 px-6 bg-primary text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center ${
              isOverpaying || isPending || amountToPay <= 0
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isPending ? "Processing..." : "Process Payment"}
          </button>
        </div>
        {state?.error && (
          <p className="text-red-500 text-sm font-bold text-center mt-2">
            {state.error}
          </p>
        )}
      </form>
    </DialogModal>
  );
}

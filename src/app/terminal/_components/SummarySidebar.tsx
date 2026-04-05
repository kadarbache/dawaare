import React, { useActionState, useEffect } from "react";
import SimpleDropdown from "@/components/ui/SimpleDropdown";
import { Banknote, ShoppingCart, UserPlus } from "lucide-react";
import { useTerminal } from "../_context/TerminalContext";
import { submitSale, ActionState } from "../actions";
import toast from "react-hot-toast";

const paymentOptions = [
  { label: "Cash", value: "CASH" },
  { label: "Zaad", value: "ZAAD" },
  { label: "eDahab", value: "E_DAHAB" },
];

export default function SummarySidebar() {
  const { cartTotal, cartItems, paymentMethod, setPaymentMethod, clearCart } =
    useTerminal();

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    submitSale,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      clearCart();
      toast.success("Sale completed successfully!");
    } else if (state?.error) {
      toast.error(state.error || "Can't complete sale");
    }
  }, [state, clearCart]);

  const tax = cartTotal * 0.05;
  const grandTotal = cartTotal + tax;

  return (
    <aside className="w-[30%] flex flex-col p-8 border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 overflow-y-auto">
      {/* Amount and Payment Card */}
      <div className="bg-white dark:bg-[#2d1e16] p-8 rounded-md border border-slate-200 dark:border-primary/20 shadow-2xl mb-6 flex-1 flex flex-col">
        <div className="mb-10">
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
            Total Amount Payable
          </p>
          <h1 className="text-7xl font-black text-primary leading-none">
            ${grandTotal.toFixed(2)}
          </h1>
          <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-primary/10">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax (5%)</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ${tax.toFixed(2)}
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

      {/* Checkout Form */}
      <form action={formAction} className="flex flex-col gap-4 shrink-0">
        <input
          type="hidden"
          name="cart_payload"
          value={JSON.stringify(cartItems)}
        />
        <input type="hidden" name="payment_method" value={paymentMethod} />

        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-md border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
          <UserPlus size={20} className="text-slate-400 dark:text-slate-500" />
          <input
            name="customer_id"
            className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
            placeholder="Add Customer ID (Optional)"
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-md border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
          <Banknote size={20} className="text-slate-400 dark:text-slate-500" />
          <input
            name="amount_paid"
            step="0.01"
            className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
            placeholder="Amount Paid (leave empty for full debt)..."
            type="number"
          />
        </div>
        <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-[#2d1e16] rounded-md border border-slate-200 dark:border-primary/20 transition-all focus-within:border-primary shadow-lg">
          <Banknote size={20} className="text-slate-400 dark:text-slate-500" />
          <input
            name="notes"
            className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
            placeholder="Notes (Optional)"
            type="text"
          />
        </div>
        <button
          disabled={cartItems.length === 0 || isPending}
          className="w-full py-4 bg-primary text-white rounded-md flex items-center justify-center gap-3 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg font-bold text-lg uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingCart size={20} />
          )}
          {isPending ? "Processing..." : "Complete Sale"}
        </button>
      </form>
    </aside>
  );
}

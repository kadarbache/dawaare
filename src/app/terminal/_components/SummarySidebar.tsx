import React, { ChangeEvent, useActionState, useEffect } from "react";
import SimpleDropdown from "@/components/ui/SimpleDropdown";
import {
  Banknote,
  ShoppingCart,
  ChevronDownIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useTerminal } from "../_context/TerminalContext";
import { submitSale, ActionState } from "../actions";
import toast from "react-hot-toast";
import CustomerProfile from "@/components/CustomerProfile";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const paymentOptions = [
  { label: "Cash", value: "CASH" },
  { label: "Zaad", value: "ZAAD" },
  { label: "eDahab", value: "E_DAHAB" },
];

export default function SummarySidebar() {
  const {
    cartTotal,
    cartItems,
    paymentMethod,
    setPaymentMethod,
    clearCart,
    selectedCustomer,
    amountPaid,
    setAmountPaid,
    exchangeRate,
    repaymentDate,
    setRepaymentDate,
  } = useTerminal();

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

  const grandTotal = cartTotal;
  const slshAmount = grandTotal * (exchangeRate || 0);

  const liveUnpaidBalance = grandTotal - Number(amountPaid || 0);

  return (
    <aside className="w-[30%] flex flex-col p-8 border-l border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5 overflow-y-auto">
      {/* Amount and Payment Card */}
      <div className="min-h-[420px] bg-white dark:bg-[#2d1e16] p-8 rounded-md border border-slate-200 dark:border-primary/20 shadow-2xl mb-6 flex-1 flex flex-col justify-between">
        <div className="mb-10">
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-2">
            Total Amount Payable
          </p>
          <h1 className="text-7xl font-black text-primary leading-none">
            ${grandTotal.toFixed(2)}
          </h1>
          <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-slate-200 dark:border-primary/10">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Paid</span>
              <span className="font-bold text-slate-900 dark:text-white">
                ${amountPaid}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">SLSH</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {slshAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        {selectedCustomer && (
          <CustomerProfile
            unpaidBalance={liveUnpaidBalance}
            user={selectedCustomer}
          />
        )}
      </div>

      {/* Checkout Form */}
      <form action={formAction} className="flex flex-col gap-4 shrink-0">
        <div className="mt-auto flex flex-col gap-4">
          <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black mb-1">
            Select Payment Method
          </p>

          <SimpleDropdown
            options={paymentOptions}
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Payment method..."
            className="px-5 py-4"
            icon={<Banknote size={20} />}
          />
        </div>
        <input
          type="hidden"
          name="cart_payload"
          value={JSON.stringify(cartItems)}
        />
        <input type="hidden" name="payment_method" value={paymentMethod} />
        {selectedCustomer && (
          <input type="hidden" name="customer_id" value={selectedCustomer.id} />
        )}
        {selectedCustomer && (
          <input
            type="hidden"
            name="repayment_date"
            value={repaymentDate?.toISOString() || ""}
          />
        )}
        {selectedCustomer && (
          <div className="flex items-center gap-3 px-5 py-4 bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
            <Banknote
              size={20}
              className="text-slate-400 dark:text-slate-500"
            />
            <input
              name="amount_paid"
              step="0.01"
              value={amountPaid}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAmountPaid(e.target.value)
              }
              className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none"
              placeholder="Amount Paid"
              type="number"
            />
          </div>
        )}
        {selectedCustomer && (
          <div className="flex flex-col gap-2">
            <p className="text-slate-500 uppercase tracking-widest text-[10px] font-black">
              Repayment Date
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-5 py-7 bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-md font-medium text-sm"
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon
                      size={20}
                      className="text-slate-400 dark:text-slate-500"
                    />
                    {repaymentDate ? (
                      dayjs(repaymentDate).format("MMMM D, YYYY")
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">
                        Pick a repayment date
                      </span>
                    )}
                  </div>
                  <ChevronDownIcon
                    size={16}
                    className="text-slate-400 dark:text-slate-500"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={repaymentDate}
                  onSelect={setRepaymentDate}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
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

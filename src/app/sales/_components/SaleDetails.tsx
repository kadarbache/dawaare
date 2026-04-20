"use client";

import DialogModel from "@/components/DialogModel";
import dayjs from "dayjs";
import { SaleRow } from "../server";
import { AlertCircle, CheckCircle2, CreditCard, Package, Trash, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { delete_sale } from "../server";
import toast from "react-hot-toast";
import AlertWindow from "@/components/AlertWindow";

interface SaleDetailsProps {
  is_open: boolean;
  on_close: () => void;
  sale: SaleRow | null;
}

export default function SaleDetails({
  is_open,
  on_close,
  sale,
}: SaleDetailsProps) {
  const [is_alert_open, set_is_alert_open] = useState(false);

  if (!sale) return null;

  const handle_delete = async () => {
    const toastId = toast.loading("Deleting sale...");
    const result = await delete_sale(sale.id);

    if (result.success) {
      toast.success("Sale deleted successfully", { id: toastId });
      set_is_alert_open(false);
      on_close();
    } else {
      toast.error(result.error || "Failed to delete sale", { id: toastId });
    }
  };

  const get_status_styles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "partial":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "unpaid":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  const formatted_date = dayjs(sale.created_at).format("MMM D, YYYY | h:mm A");

  return (
    <DialogModel
      isOpen={is_open}
      onClose={on_close}
      title={`Sale Details - #${sale.id.slice(0, 8).toUpperCase()}`}
      description={formatted_date}
      max_width="max-w-2xl"
    >
      <div className="flex flex-col gap-8">
        {/* Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <User size={10} />
              Seller
            </label>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Walk-in
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <User size={10} />
              Customer
            </label>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {sale.customer_name ?? "Walk-in Customer"}
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <CreditCard size={10} />
              Payment Method
            </label>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {sale.payment_method.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              {sale.status.toLowerCase() === "paid" ? (
                <CheckCircle2 size={10} />
              ) : (
                <AlertCircle size={10} />
              )}
              Status
            </label>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${get_status_styles(
                  sale.status,
                )}`}
              >
                {sale.status}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 px-1">
            <Package size={10} />
            Items Summary
          </label>
          <div className="bg-slate-50 dark:bg-primary/5 rounded-md border border-primary/10 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">
                    Qty
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5">
                {sale.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className="group hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-white dark:bg-slate-800 flex items-center justify-center border border-primary/10 overflow-hidden relative">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package size={14} className="text-slate-400" />
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-5 text-sm font-black text-slate-900 dark:text-slate-100 text-right">
                      $
                      {item.total_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer with Grand Total and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-4 p-6 bg-slate-50 dark:bg-primary/10 border-t border-primary/10 -mx-6 -mb-6">
          <button
            onClick={() => set_is_alert_open(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/10 rounded-md transition-all cursor-pointer"
          >
            <Trash size={16} />
            Void Sale
          </button>
          
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
              Grand Total
            </span>
            <span className="text-2xl font-black text-primary">
              $
              {sale.total_amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
      
      <AlertWindow
        isOpen={is_alert_open}
        onClose={() => set_is_alert_open(false)}
        onConfirm={handle_delete}
        title="Void Sale"
        description="This action cannot be undone. This will permanently delete the sale record and return items to stock."
      />
    </DialogModel>
  );
}

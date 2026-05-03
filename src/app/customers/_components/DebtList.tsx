"use client";
import { SaleWithCustomerAndItems } from "@/utils/types";
import { Eye } from "lucide-react";
import { useState } from "react";
import { format_sale_row } from "@/utils/helpers";
import SaleDetails from "@/app/sales/_components/SaleDetails";
import { useRouter } from "next/navigation";

export default function DebtList({
  sales,
}: {
  sales: SaleWithCustomerAndItems[];
}) {
  const router = useRouter();
  const [openView, setopenView] = useState(false);
  const [selectedSale, setSelectedSale] =
    useState<SaleWithCustomerAndItems | null>(null);

  // Status styling helper
  function getStatusStyle(status: string) {
    switch (status) {
      case "paid":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "partial":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "unpaid":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  }

  const HandleSaleView = (sale: SaleWithCustomerAndItems) => {
    if (sale.customer_id) {
      router.push(`/customers/${sale.customer_id}/${sale.id}`);
    } else {
      setSelectedSale(sale);
      setopenView(true);
    }
  };

  const rowSales = selectedSale ? format_sale_row(selectedSale) : null;

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-white dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Paid
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Remaining
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Repayment Date
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              view
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
          {sales.length === 0 && (
            <tr>
              <td
                colSpan={9}
                className="w-full px-6 py-12 text-center text-slate-400 italic"
              >
                No sales recorded yet
              </td>
            </tr>
          )}
          {sales.map((sale: SaleWithCustomerAndItems) => (
            <tr
              key={sale.id}
              className="hover:bg-primary/5 transition-colors cursor-pointer"
              onClick={() => HandleSaleView(sale)}
            >
              <td className="px-6 py-4 text-sm font-medium">
                {new Date(sale.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4 text-center ">
                <p className="text-sm font-bold">
                  {sale.sale_items.length}{" "}
                  <span className="ml-1 text-xs text-slate-500 font-mono">
                    items
                  </span>
                </p>
              </td>
              <td className="px-6 py-4 font-black">
                ${sale.total_amount.toFixed(2)}
              </td>
              <td className="px-6 py-4 font-medium text-emerald-600">
                ${sale.amount_paid.toFixed(2)}
              </td>
              <td className="px-6 py-4 font-medium text-red-500">
                ${sale.remaining.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm font-medium">
                {new Date(sale.repayment_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(sale.status)}`}
                  >
                    {sale.status}
                  </span>
                </div>
              </td>
              <td
                className="px-6 py-4 text-right"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSale(sale);
                  setopenView(true);
                }}
              >
                <button className="text-[10px] uppercase tracking-widest font-bold text-primary hover:underline flex items-center gap-1 ml-auto cursor-pointer">
                  <Eye size={12} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rowSales && (
        <SaleDetails
          is_open={openView}
          on_close={() => setopenView(false)}
          sale={rowSales}
        />
      )}
    </>
  );
}

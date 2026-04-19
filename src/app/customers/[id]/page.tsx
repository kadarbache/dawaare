import { prisma } from "@/lib/db";
import { SaleWithCustomerAndItems } from "@/utils/types";
import { History, PlusCircle, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DebtList from "../_components/DebtList";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      sales: {
        orderBy: { created_at: "desc" },
        include: {
          customer: { select: { name: true, id: true } },
          _count: { select: { sale_items: true } },
          sale_items: {
            select: {
              product_id: true,
              quantity: true,
              unit_price: true,
              total_price: true,
              product: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  const sales = customer.sales;

  // Calculate outstanding balance (sum of remaining from unpaid/partial sales)
  const outstandingBalance = sales.reduce(
    (sum: number, sale: SaleWithCustomerAndItems) => sum + sale.remaining,
    0,
  );

  // Count unpaid transactions
  const unpaidCount = sales.filter(
    (sale: SaleWithCustomerAndItems) =>
      sale.status === "unpaid" || sale.status === "partial",
  ).length;

  // Calculate repayment rate
  const totalOwed = sales.reduce(
    (sum: number, sale: SaleWithCustomerAndItems) => sum + sale.total_amount,
    0,
  );
  const totalPaid = sales.reduce(
    (sum: number, sale: SaleWithCustomerAndItems) => sum + sale.amount_paid,
    0,
  );
  const repaymentRate =
    totalOwed > 0 ? Math.round((totalPaid / totalOwed) * 100) : 100;

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
          <p className="text-7xl font-black text-primary">
            ${outstandingBalance.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400 mt-4 italic">
            Calculated from {unpaidCount} unpaid transaction
            {unpaidCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href={`/terminal?customer_id=${id}`}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:scale-[1.02] active:scale-95 text-white font-bold rounded-md transition-all shadow-lg shadow-primary/20"
          >
            <PlusCircle size={20} />
            Add New Sale
          </Link>
        </div>
      </div>

      {/* Sales History Table */}
      <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/10 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <History size={20} className="text-primary" />
            Sales History
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {sales.length} total sale{sales.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="overflow-x-auto">
          <DebtList sales={sales} />
        </div>
      </div>

      {/* Additional Stats/Notes */}
      <div className="mt-8 grid grid-cols-2 gap-6 pb-8">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-primary/20 bg-white dark:bg-background-dark shadow-lg">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Customer Notes
          </h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            {customer.notes || "No notes for this customer."}
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
            <p className="text-4xl font-black text-primary">{repaymentRate}%</p>
          </div>
        </div>
      </div>
    </>
  );
}

import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import SaleDetailClient from "../../_components/SaleDetailClient";

export default async function CustomerSaleDetailPage({
  params,
}: {
  params: Promise<{ id: string; saleId: string }>;
}) {
  const { id, saleId } = await params;

  const sale = await prisma.sale.findUnique({
    where: { id: saleId },
    include: {
      customer: {
        select: { name: true, id: true },
      },
      _count: {
        select: { sale_items: true },
      },

      repayments: {
        orderBy: { created_at: "desc" },
      },
      sale_items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!sale || sale.customer_id !== id) {
    notFound();
  }

  return (
    <>
      <SaleDetailClient sale={sale} />
    </>
  );
}

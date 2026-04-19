"use server";

import { prisma } from "@/lib/db";
import { PAGE_SIZE } from "./constants";
import { format_sale_row } from "@/utils/helpers";

export type SaleRow = {
  id: string;
  created_at: Date;
  total_amount: number;
  amount_paid: number;
  remaining: number;
  status: string;
  payment_method: string;
  repayment_date: Date;
  notes: string | null;
  items_count: number;
  customer_name: string | null;
  customer_id: string | null;
  items: {
    quantity: number;
    unit_price: number;
    total_price: number;
    product_id: string;
    name: string;
    image: string;
  }[];
};

export type SaleStats = {
  total_sales_count: number;
  total_revenue: number;
  avg_order_value: number;
  last_sale_at: Date | null;
};

export async function get_sales(
  page: number = 1,
  start_date?: string,
  end_date?: string,
): Promise<{ sales: SaleRow[]; total: number }> {
  const where = {
    ...(start_date && end_date
      ? {
          created_at: {
            gte: new Date(`${start_date}T00:00:00`),
            lte: new Date(`${end_date}T23:59:59.999`),
          },
        }
      : {}),
  };

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
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
    }),
    prisma.sale.count({ where }),
  ]);

  return {
    sales: sales.map(format_sale_row),
    total,
  };
}

export async function get_sale_stats(
  start_date?: string,
  end_date?: string,
): Promise<SaleStats> {
  const where = {
    ...(start_date && end_date
      ? {
          created_at: {
            gte: new Date(`${start_date}T00:00:00`),
            lte: new Date(`${end_date}T23:59:59.999`),
          },
        }
      : {}),
  };

  const [agg, lastSale] = await Promise.all([
    prisma.sale.aggregate({
      where,
      _count: { id: true },
      _sum: { total_amount: true },
      _avg: { total_amount: true },
    }),
    prisma.sale.findFirst({
      orderBy: { created_at: "desc" },
      select: { created_at: true },
    }),
  ]);

  return {
    total_sales_count: agg._count.id,
    total_revenue: agg._sum.total_amount ?? 0,
    avg_order_value: agg._avg.total_amount ?? 0,
    last_sale_at: lastSale?.created_at ?? null,
  };
}

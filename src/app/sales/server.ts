"use server";

import { prisma } from "@/lib/db";
import { PAGE_SIZE } from "./constants";

export type SaleRow = {
  id: string;
  created_at: Date;
  total_amount: number;
  amount_paid: number;
  remaining: number;
  status: string;
  payment_method: string;
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
    sales: sales.map((s) => ({
      id: s.id,
      created_at: s.created_at,
      total_amount: s.total_amount,
      amount_paid: s.amount_paid,
      remaining: s.remaining,
      status: s.status,
      payment_method: s.payment_method,
      notes: s.notes,
      items_count: s._count.sale_items,
      customer_name: s.customer?.name ?? null,
      customer_id: s.customer?.id ?? null,
      items: s.sale_items.map((si) => ({
        quantity: si.quantity,
        unit_price: si.unit_price,
        total_price: si.total_price,
        product_id: si.product_id,
        name: si.product.name,
        image: si.product.image,
      })),
    })),
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

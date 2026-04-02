// Server-side data fetching helpers (not Server Actions)

import { prisma } from "@/lib/db";
import dayjs from "dayjs";

export type DashboardStats = {
  total_sales_today: number;
  total_sales_today_change: number;
  net_profit: number;
  pending_debts: number;
  low_stock_count: number;
};

export type SalesTrendDay = {
  label: string;
  date: string;
  total: number;
};

export type BestSeller = {
  product_name: string;
  total_qty: number;
};

export type RecentTransaction = {
  id: string;
  created_at: Date;
  customer_name: string;
  total_amount: number;
  payment_method: string;
};

export type DebtClearance = {
  customer_name: string;
  initial: string;
  created_at: Date;
  amount_paid: number;
};

export async function get_dashboard_stats(): Promise<DashboardStats> {
  const today_start = dayjs().startOf("day").toDate();
  const today_end = dayjs().endOf("day").toDate();
  const yesterday_start = dayjs().subtract(1, "day").startOf("day").toDate();
  const yesterday_end = dayjs().subtract(1, "day").endOf("day").toDate();

  const [today_agg, yesterday_agg, pending_debts_agg, low_stock_count] =
    await Promise.all([
      prisma.sale.aggregate({
        where: {
          created_at: { gte: today_start, lte: today_end },
        },
        _sum: { total_amount: true },
      }),
      prisma.sale.aggregate({
        where: {
          created_at: { gte: yesterday_start, lte: yesterday_end },
        },
        _sum: { total_amount: true },
      }),
      prisma.sale.aggregate({
        where: {
          remaining: { gt: 0 },
        },
        _sum: { remaining: true },
      }),
      prisma.product.count({
        where: { is_low_stock: true },
      }),
    ]);

  const total_sales_today = today_agg._sum.total_amount ?? 0;
  const total_sales_yesterday = yesterday_agg._sum.total_amount ?? 0;
  const total_sales_today_change =
    total_sales_yesterday > 0
      ? ((total_sales_today - total_sales_yesterday) /
          total_sales_yesterday) *
        100
      : total_sales_today > 0
        ? 100
        : 0;

  const net_profit = total_sales_today * 0.36;
  const pending_debts = pending_debts_agg._sum.remaining ?? 0;

  return {
    total_sales_today,
    total_sales_today_change,
    net_profit,
    pending_debts,
    low_stock_count,
  };
}

export async function get_sales_trend(): Promise<SalesTrendDay[]> {
  const days: SalesTrendDay[] = [];
  const today = dayjs();

  const start_date = today.subtract(6, "day").startOf("day").toDate();
  const end_date = today.endOf("day").toDate();

  const sales = await prisma.sale.findMany({
    where: {
      created_at: { gte: start_date, lte: end_date },
    },
    select: {
      created_at: true,
      total_amount: true,
    },
  });

  for (let i = 6; i >= 0; i--) {
    const d = today.subtract(i, "day");
    const date_str = d.format("YYYY-MM-DD");
    const day_total = sales
      .filter(
        (s) => dayjs(s.created_at).format("YYYY-MM-DD") === date_str,
      )
      .reduce((sum, s) => sum + s.total_amount, 0);

    days.push({
      label: d.format("ddd"),
      date: date_str,
      total: day_total,
    });
  }

  return days;
}

export async function get_best_sellers(): Promise<BestSeller[]> {
  const thirty_days_ago = dayjs().subtract(30, "day").startOf("day").toDate();

  const sale_items = await prisma.saleItem.groupBy({
    by: ["product_id", "product_name"],
    where: {
      sale: {
        created_at: { gte: thirty_days_ago },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 5,
  });

  return sale_items.map((item) => ({
    product_name: item.product_name,
    total_qty: item._sum.quantity ?? 0,
  }));
}

export async function get_recent_transactions(): Promise<RecentTransaction[]> {
  const sales = await prisma.sale.findMany({
    orderBy: { created_at: "desc" },
    take: 5,
    include: {
      customer: { select: { name: true } },
    },
  });

  return sales.map((s) => ({
    id: s.id,
    created_at: s.created_at,
    customer_name: s.customer?.name ?? "Walk-in",
    total_amount: s.total_amount,
    payment_method: s.payment_method,
  }));
}

export async function get_recent_debt_clearances(): Promise<DebtClearance[]> {
  // Fetch cleared sales from customers (remaining = 0, amount_paid > 0)
  // Prisma doesn't support column-to-column comparisons, so we post-filter
  // to exclude full upfront cash payments (updated_at === created_at means
  // no subsequent debt clearing update happened)
  const payments = await prisma.sale.findMany({
    where: {
      remaining: 0,
      amount_paid: { gt: 0 },
      customer_id: { not: null },
    },
    orderBy: { updated_at: "desc" },
    take: 20, // over-fetch so post-filter still gets 5
    include: {
      customer: { select: { name: true } },
    },
  });

  // Keep only sales that were partial debts (updated_at differs from created_at)
  type PaymentResult = (typeof payments)[number];
  const cleared_debts = payments
    .filter((p: PaymentResult) => p.updated_at.getTime() !== p.created_at.getTime())
    .slice(0, 5);

  return cleared_debts.map((p) => {
    const name = p.customer?.name ?? "Unknown";
    const parts = name.split(" ");
    const initial =
      parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.substring(0, 2).toUpperCase();

    return {
      customer_name: name,
      initial,
      created_at: p.updated_at, // updated_at = when debt was cleared
      amount_paid: p.amount_paid,
    };
  });
}

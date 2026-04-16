// Server-side data fetching helpers (not Server Actions)

import { prisma } from "@/lib/db";
import dayjs from "dayjs";

export type DashboardStats = {
  total_sales: number;
  total_sales_change: number;
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

export async function get_dashboard_stats(
  filter: string = "daily",
): Promise<DashboardStats> {
  const today = dayjs();
  let current_start: Date;
  let current_end: Date;
  let prev_start: Date;
  let prev_end: Date;

  if (filter === "weekly") {
    current_start = today.subtract(6, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
    prev_start = today.subtract(13, "day").startOf("day").toDate();
    prev_end = today.subtract(7, "day").endOf("day").toDate();
  } else if (filter === "monthly") {
    current_start = today.subtract(29, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
    prev_start = today.subtract(59, "day").startOf("day").toDate();
    prev_end = today.subtract(30, "day").endOf("day").toDate();
  } else if (filter === "all") {
    current_start = new Date("2000-01-01");
    current_end = today.endOf("day").toDate();
    prev_start = new Date("1900-01-01");
    prev_end = new Date("1900-01-01");
  } else {
    current_start = today.startOf("day").toDate();
    current_end = today.endOf("day").toDate();
    prev_start = today.subtract(1, "day").startOf("day").toDate();
    prev_end = today.subtract(1, "day").endOf("day").toDate();
  }

  const [
    current_agg,
    prev_agg,
    pending_debts_agg,
    low_stock_count,
    sold_items,
  ] = await Promise.all([
    prisma.sale.aggregate({
      where: {
        created_at: { gte: current_start, lte: current_end },
      },
      _sum: { total_amount: true },
    }),
    prisma.sale.aggregate({
      where: {
        created_at: { gte: prev_start, lte: prev_end },
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
    prisma.saleItem.findMany({
      where: {
        sale: {
          created_at: { gte: current_start, lte: current_end },
        },
      },
      include: {
        product: {
          select: { cost_price: true },
        },
      },
    }),
  ]);

  const total_sales = current_agg._sum.total_amount ?? 0;
  const total_sales_prev = prev_agg._sum.total_amount ?? 0;
  const total_sales_change =
    total_sales_prev > 0
      ? ((total_sales - total_sales_prev) / total_sales_prev) * 100
      : total_sales > 0
        ? 100
        : 0;

  // Calculate actual net profit: (unit_price - cost_price) * quantity
  const net_profit = sold_items.reduce((acc: number, item) => {
    const cost = item.product?.cost_price ?? 0;
    return acc + (item.unit_price - cost) * item.quantity;
  }, 0);

  const pending_debts = pending_debts_agg._sum.remaining ?? 0;

  return {
    total_sales,
    total_sales_change,
    net_profit,
    pending_debts,
    low_stock_count,
  };
}

export async function get_sales_trend(
  filter: string = "daily",
): Promise<SalesTrendDay[]> {
  const days: SalesTrendDay[] = [];
  const today = dayjs();

  let num_days = 6;
  if (filter === "monthly" || filter === "all") {
    num_days = 29;
  }

  const start_date = today.subtract(num_days, "day").startOf("day").toDate();
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

  for (let i = num_days; i >= 0; i--) {
    const d = today.subtract(i, "day");
    const date_str = d.format("YYYY-MM-DD");
    const day_total = sales
      .filter((s) => dayjs(s.created_at).format("YYYY-MM-DD") === date_str)
      .reduce((sum: number, s) => sum + s.total_amount, 0);

    days.push({
      label: num_days > 7 ? d.format("MMM D") : d.format("ddd"),
      date: date_str,
      total: day_total,
    });
  }

  return days;
}

export async function get_best_sellers(
  filter: string = "daily",
): Promise<BestSeller[]> {
  const today = dayjs();
  let current_start: Date;
  let current_end: Date;

  if (filter === "weekly") {
    current_start = today.subtract(6, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  } else if (filter === "monthly") {
    current_start = today.subtract(29, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  } else if (filter === "all") {
    current_start = new Date("2000-01-01");
    current_end = today.endOf("day").toDate();
  } else {
    current_start = today.startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  }

  const sale_items = await prisma.saleItem.groupBy({
    by: ["product_id", "product_name"],
    where: {
      sale: {
        created_at: { gte: current_start, lte: current_end },
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

export async function get_recent_transactions(
  filter: string = "daily",
): Promise<RecentTransaction[]> {
  const today = dayjs();
  let current_start: Date;
  let current_end: Date;

  if (filter === "weekly") {
    current_start = today.subtract(6, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  } else if (filter === "monthly") {
    current_start = today.subtract(29, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  } else if (filter === "all") {
    current_start = new Date("2000-01-01");
    current_end = today.endOf("day").toDate();
  } else {
    current_start = today.startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  }

  const sales = await prisma.sale.findMany({
    where: {
      created_at: { gte: current_start, lte: current_end },
    },
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

export async function get_recent_debt_clearances(
  filter: string = "daily",
): Promise<DebtClearance[]> {
  const today = dayjs();
  let current_start: Date;
  let current_end: Date;

  if (filter === "weekly") {
    current_start = today.subtract(6, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  } else if (filter === "monthly") {
    current_start = today.subtract(29, "day").startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  } else if (filter === "all") {
    current_start = new Date("2000-01-01");
    current_end = today.endOf("day").toDate();
  } else {
    current_start = today.startOf("day").toDate();
    current_end = today.endOf("day").toDate();
  }

  const payments = await prisma.sale.findMany({
    where: {
      remaining: 0,
      amount_paid: { gt: 0 },
      customer_id: { not: null },
      updated_at: { gte: current_start, lte: current_end },
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
    .filter(
      (p: PaymentResult) => p.updated_at.getTime() !== p.created_at.getTime(),
    )
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

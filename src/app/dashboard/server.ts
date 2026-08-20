// Server-side data fetching helpers (not Server Actions)

import { prisma } from "@/lib/db";
import { RecentTransactionsWithCustomerName } from "@/utils/types";
import { resolve_range, shop_now, shop_day_key } from "@/lib/dates";

export type DashboardStats = {
  total_sales: number;
  /** null when the selected period has no prior period to compare against. */
  total_sales_change: number | null;
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
  const { current, previous } = resolve_range(filter);

  const [current_agg, prev_agg, pending_debts_agg, low_stock_count, sold_items] =
    await Promise.all([
      prisma.sale.aggregate({
        where: {
          created_at: { gte: current.start, lte: current.end },
        },
        _sum: { total_amount: true },
      }),
      previous
        ? prisma.sale.aggregate({
            where: {
              created_at: { gte: previous.start, lte: previous.end },
            },
            _sum: { total_amount: true },
          })
        : null,
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
            created_at: { gte: current.start, lte: current.end },
          },
        },
        select: {
          quantity: true,
          unit_price: true,
          cost_price: true,
          product: { select: { cost_price: true } },
        },
      }),
    ]);

  const total_sales = current_agg._sum.total_amount ?? 0;

  let total_sales_change: number | null = null;
  if (prev_agg) {
    const total_sales_prev = prev_agg._sum.total_amount ?? 0;
    if (total_sales_prev > 0) {
      total_sales_change =
        ((total_sales - total_sales_prev) / total_sales_prev) * 100;
    } else {
      total_sales_change = total_sales > 0 ? 100 : 0;
    }
  }

  // Profit uses the cost captured at sale time; older rows predate that column
  // and fall back to the product's current cost.
  const net_profit = sold_items.reduce((acc, item) => {
    const cost = item.cost_price ?? item.product?.cost_price ?? 0;
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
  const today = shop_now();

  // The chart labels itself "Last 7/30 Operating Days", so the window is
  // deliberately fixed rather than following the page filter's full range.
  const num_days = filter === "monthly" || filter === "all" ? 29 : 6;

  const sales = await prisma.sale.findMany({
    where: {
      created_at: {
        gte: today.subtract(num_days, "day").startOf("day").toDate(),
        lte: today.endOf("day").toDate(),
      },
    },
    select: {
      created_at: true,
      total_amount: true,
    },
  });

  const totals_by_day = new Map<string, number>();
  for (const sale of sales) {
    const key = shop_day_key(sale.created_at);
    totals_by_day.set(key, (totals_by_day.get(key) ?? 0) + sale.total_amount);
  }

  const days: SalesTrendDay[] = [];
  for (let i = num_days; i >= 0; i--) {
    const d = today.subtract(i, "day");
    const date_str = d.format("YYYY-MM-DD");

    days.push({
      label: num_days > 7 ? d.format("MMM D") : d.format("ddd"),
      date: date_str,
      total: totals_by_day.get(date_str) ?? 0,
    });
  }

  return days;
}

type SaleItemGroupByResult = {
  product_id: string;
  product_name: string;
  _sum: {
    quantity: number | null;
  };
};

export async function get_best_sellers(
  filter: string = "daily",
): Promise<BestSeller[]> {
  const { current } = resolve_range(filter);

  const sale_items = await prisma.saleItem.groupBy({
    by: ["product_id", "product_name"],
    where: {
      sale: {
        created_at: { gte: current.start, lte: current.end },
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

  return sale_items.map((item: SaleItemGroupByResult) => ({
    product_name: item.product_name,
    total_qty: item._sum.quantity ?? 0,
  }));
}

export async function get_recent_transactions(
  filter: string = "daily",
): Promise<RecentTransaction[]> {
  const { current } = resolve_range(filter);

  const sales = await prisma.sale.findMany({
    where: {
      created_at: { gte: current.start, lte: current.end },
    },
    orderBy: { created_at: "desc" },
    take: 5,
    include: {
      customer: { select: { name: true } },
    },
  });

  return sales.map((s: RecentTransactionsWithCustomerName) => ({
    id: s.id,
    created_at: s.created_at,
    customer_name: s.customer?.name ?? "Walk-in",
    total_amount: s.total_amount,
    payment_method: s.payment_method,
  }));
}

function customer_initials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export async function get_recent_debt_clearances(
  filter: string = "daily",
): Promise<DebtClearance[]> {
  const { current } = resolve_range(filter);

  const repayments = await prisma.repayment.findMany({
    where: {
      created_at: { gte: current.start, lte: current.end },
    },
    orderBy: { created_at: "desc" },
    take: 5,
    select: {
      repaid_amount: true,
      created_at: true,
      sale: {
        select: { customer: { select: { name: true } } },
      },
    },
  });

  return repayments.map((r) => {
    const name = r.sale.customer?.name ?? "Unknown";

    return {
      customer_name: name,
      initial: customer_initials(name),
      created_at: r.created_at,
      amount_paid: r.repaid_amount,
    };
  });
}

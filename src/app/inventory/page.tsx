import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import Topbar from "../../components/Topbar";
import ButtomAcionBar from "../terminal/_components/ButtomAcionBar";
import InventoryClient from "./_components/InventoryClient";
import { ItemsCategory, Product } from "@/utils/types";

const PAGE_SIZE = 15;
export type Filter =
  | "newest"
  | "oldest"
  | "lowest price"
  | "highest price"
  | "out of stock"
  | "low stock";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: Filter }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const filter = params.filter ?? "newest";

  // Full table read for dashboard stats, which are computed across all
  // products regardless of the current filter/page.
  const data = await prisma.product.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  const categories: ItemsCategory[] = await prisma.itemsCategory.findMany();

  const products: Product[] = data;

  const lowStockProducts = products.filter(
    (product: Product) => product.is_low_stock,
  ).length;

  const outOfStockProducts = products.filter(
    (product: Product) => product.stock_qty === 0,
  ).length;

  const outOfStockSinceYesterday = products.filter(
    (product: Product) =>
      product.stock_qty === 0 &&
      dayjs(product.updated_at).isAfter(dayjs().subtract(1, "day")),
  ).length;

  const productsAddedLastMonth = products.filter((product: Product) =>
    dayjs(product.created_at).isAfter(dayjs().subtract(1, "month")),
  ).length;

  const inventoryValue = products.reduce(
    (sum: number, product: Product) => sum + product.price * product.stock_qty,
    0,
  );

  // inventory value from last month (products that existed before last month)
  const lastMonthCutoff = dayjs().subtract(1, "month");
  const inventoryValueFromLastMonth = products
    .filter((product: Product) =>
      dayjs(product.created_at).isBefore(lastMonthCutoff),
    )
    .reduce(
      (sum: number, product: Product) =>
        sum + product.price * product.stock_qty,
      0,
    );

  const inventoryValueChange =
    inventoryValueFromLastMonth > 0
      ? ((inventoryValue - inventoryValueFromLastMonth) /
          inventoryValueFromLastMonth) *
        100
      : 0;

  const isInventoryValueDown = inventoryValueChange < 0;

  const stats = {
    totalProducts: products.length,
    productsAddedLastMonth,
    lowStockProducts,
    outOfStockProducts,
    outOfStockSinceYesterday,
    inventoryValue,
    inventoryValueChange,
    isInventoryValueDown,
  };

  const listWhere: Prisma.ProductWhereInput =
    filter === "out of stock"
      ? { stock_qty: 0 }
      : filter === "low stock"
        ? { is_low_stock: true }
        : {};

  const listOrderBy: Prisma.ProductOrderByWithRelationInput =
    filter === "lowest price"
      ? { price: "asc" }
      : filter === "highest price"
        ? { price: "desc" }
        : filter === "oldest"
          ? { created_at: "asc" }
          : { created_at: "desc" };

  const [paginatedProducts, total] = await Promise.all([
    prisma.product.findMany({
      where: listWhere,
      orderBy: listOrderBy,
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where: listWhere }),
  ]);

  return (
    <>
      {/* Top Navigation Bar */}
      <Topbar page="Inventory" />

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
        <InventoryClient
          products={paginatedProducts}
          stats={stats}
          total={total}
          currentPage={currentPage}
          categories={categories}
        />
      </main>

      {/* Bottom Status Bar */}
      <ButtomAcionBar
        shortcuts={[
          { label: "Search", key: "CTR+K" },
          { label: "Cancel", key: "ESC" },
        ]}
        pathname={"/inventory"}
      />
    </>
  );
}

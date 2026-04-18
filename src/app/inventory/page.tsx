import { prisma } from "@/lib/db";
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

  const total = products.length;

  // memory pagination and filtering since we already fetched all to calculate stats
  const paginatedProducts: Product[] = products
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    .filter((product: Product) => {
      if (filter === "out of stock") {
        return product.stock_qty === 0;
      }
      if (filter === "low stock") {
        return product.is_low_stock;
      }
      if (filter === "newest") {
        return product.created_at;
      }
      if (filter === "oldest") {
        return product.created_at;
      }
      if (filter === "lowest price") {
        return product.price;
      }
      if (filter === "highest price") {
        return product.price;
      }
      return true;
    });

  if (filter === "lowest price") {
    paginatedProducts.sort((a: Product, b: Product) => a.price - b.price);
  }
  if (filter === "highest price") {
    paginatedProducts.sort((a: Product, b: Product) => b.price - a.price);
  }
  if (filter === "newest") {
    paginatedProducts.sort(
      (a: Product, b: Product) =>
        b.created_at.getTime() - a.created_at.getTime(),
    );
  }
  if (filter === "oldest") {
    paginatedProducts.sort(
      (a: Product, b: Product) =>
        a.created_at.getTime() - b.created_at.getTime(),
    );
  }

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

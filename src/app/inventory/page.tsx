import { prisma } from "@/lib/db";
import dayjs from "dayjs";
import Topbar from "../../components/Topbar";
import ButtomAcionBar from "../terminal/_components/ButtomAcionBar";
import InventoryClient from "./_components/InventoryClient";

const PAGE_SIZE = 15;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));

  const data = await prisma.product.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  const products = data;

  const lowStockProducts = products.filter(
    (product) => product.is_low_stock,
  ).length;

  const outOfStockProducts = products.filter(
    (product) => product.stock_qty === 0,
  ).length;

  const outOfStockSinceYesterday = products.filter(
    (product) =>
      product.stock_qty === 0 &&
      dayjs(product.updated_at).isAfter(dayjs().subtract(1, "day")),
  ).length;

  const productsAddedLastMonth = products.filter((product) =>
    dayjs(product.created_at).isAfter(dayjs().subtract(1, "month")),
  ).length;

  const inventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stock_qty,
    0,
  );

  // inventory value from last month (products that existed before last month)
  const lastMonthCutoff = dayjs().subtract(1, "month");
  const inventoryValueFromLastMonth = products
    .filter((product) => dayjs(product.created_at).isBefore(lastMonthCutoff))
    .reduce((sum, product) => sum + product.price * product.stock_qty, 0);

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
  // memory pagination since we already fetched all to calculate stats
  const paginatedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  console.log(paginatedProducts);

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

import { prisma } from "@/lib/db";
import Topbar from "../../components/Topbar";
import TerminalWorkspace from "./_components/TerminalWorkspace";
export default async function TerminalPage({
  searchParams,
}: {
  searchParams: Promise<{ customer_id?: string }>;
}) {
  const { customer_id } = await searchParams;

  // Fetch active products to hydrate the fast-search POS client state
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      cost_price: true,
      price: true,
      stock_qty: true,
      image: true,
      category: true,
    },
  });

  const customer = customer_id
    ? await prisma.customer.findUnique({
        where: { id: customer_id },
      })
    : null;

  const exchangeRate = await prisma.exchangeRate.findUnique({
    where: { currency: "SLSH" },
  });

  return (
    <>
      {/* Top Navigation Bar */}
      <Topbar page="Terminal" />

      {/* POS Workspace hydrated with initial data */}
      <TerminalWorkspace
        products={products}
        customer={customer}
        exchangeRate={exchangeRate?.rate}
      />
    </>
  );
}

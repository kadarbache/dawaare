import { prisma } from "@/lib/db";
import Topbar from "../../components/Topbar";
import TerminalWorkspace from "./_components/TerminalWorkspace";
//  TODO: fix the rounded values in this page
export default async function TerminalPage() {
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

  return (
    <>
      {/* Top Navigation Bar */}
      <Topbar page="Terminal" subPage="Register #04" />

      {/* POS Workspace hydrated with initial data */}
      <TerminalWorkspace products={products} />
    </>
  );
}

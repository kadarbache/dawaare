import { prisma } from "@/lib/db";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import TerminalWorkspace from "./_components/TerminalWorkspace";

export default async function TerminalPage() {
  // Fetch active products to hydrate the fast-search POS client state
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock_qty: true,
      image: true,
      category: true,
    },
  });

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        {/* Top Navigation Bar */}
        <Topbar page="Terminal" subPage="Register #04" />

        {/* POS Workspace hydrated with initial data */}
        <TerminalWorkspace products={products} />
      </div>
    </div>
  );
}

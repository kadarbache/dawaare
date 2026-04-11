import { UserSearch } from "lucide-react";
import { prisma } from "@/lib/db";
import CustomerLink from "./CustomerLink";

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export default async function CustomersList() {
  const customers = await prisma.customer.findMany();
  const lastPurchase = await prisma.sale.findMany({
    where: {
      customer_id: {
        in: customers.map((customer) => customer.id),
      },
    },
    orderBy: { created_at: "desc" },
    take: 1,
  });

  const lastPurchaseDate = lastPurchase[0]?.created_at;
  const lastPurchaseStr = lastPurchaseDate
    ? formatRelativeTime(new Date(lastPurchaseDate))
    : "Never";

  return (
    <aside className="w-1/3 border-r border-slate-200 dark:border-primary/20 flex flex-col bg-slate-50 dark:bg-primary/5">
      <div className="p-6 border-b border-slate-200 dark:border-primary/20">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
          Debt Customers
        </h3>
        <div className="relative group flex items-center">
          <UserSearch
            size={20}
            className="absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors"
          />
          <input
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            placeholder="Search customers..."
            type="text"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {customers.map((customer) => (
          <CustomerLink
            key={customer.id}
            id={customer.id}
            name={customer.name}
            lastPurchase={lastPurchaseStr}
          />
        ))}
      </div>
    </aside>
  );
}

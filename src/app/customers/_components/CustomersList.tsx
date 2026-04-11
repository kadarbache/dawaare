import { UserSearch } from "lucide-react";
import { prisma } from "@/lib/db";
import CustomerLink from "./CustomerLink";

export default async function CustomersList() {
  const customers = await prisma.customer.findMany();
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
          <CustomerLink key={customer.id} id={customer.id} name={customer.name} />
        ))}
      </div>
    </aside>
  );
}

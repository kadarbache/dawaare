import { Customer } from "@/app/terminal/_context/TerminalContext";
import { User } from "lucide-react";

export default function CustomerProfile({
  className = "",
  user,
  unpaidBalance,
}: {
  className?: string;
  user: Customer | null;
  unpaidBalance: number;
}) {
  if (!user) {
    return null;
  }
  return (
    <div className={`p-0 ${className}`}>
      <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-primary/5 rounded-md border border-transparent dark:border-primary/10">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10 border border-primary/40 flex items-center justify-center"
          data-alt="User profile avatar portrait"
        >
          <User size={20} className={"text-primary"} />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold leading-none truncate">{user.name}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase font-bold tracking-wider">
            unpaid balance: ${unpaidBalance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

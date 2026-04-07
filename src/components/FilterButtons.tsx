"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "daily";

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    router.push(`?${params.toString()}`);
  };

  const getBtnClass = (active: boolean) =>
    `px-5 py-2 text-[11px] font-black uppercase tracking-widest cursor-pointer ${
      active
        ? "bg-primary text-white rounded-md shadow-lg active:scale-95 transition-all"
        : "text-stone-400 hover:text-primary transition-colors duration-200"
    }`;

  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex items-center bg-white/5 rounded-md p-1 border border-white/10 backdrop-blur-sm w-fit">
        <button onClick={() => setFilter("all")} className={getBtnClass(currentFilter === "all")}>
          All Time
        </button>
        <button onClick={() => setFilter("weekly")} className={getBtnClass(currentFilter === "weekly")}>
          Weekly
        </button>
        <button onClick={() => setFilter("monthly")} className={getBtnClass(currentFilter === "monthly")}>
          Monthly
        </button>
        <button onClick={() => setFilter("daily")} className={getBtnClass(currentFilter === "daily")}>
          Daily
        </button>
      </div>
    </div>
  );
}

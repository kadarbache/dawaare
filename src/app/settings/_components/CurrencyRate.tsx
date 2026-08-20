import { DollarSign, RefreshCcw } from "lucide-react";
import { ChangeEvent, useTransition } from "react";
import { addExchangeRate } from "../server";
import toast from "react-hot-toast";
export default function CurrencyRate({
  exchangeRate,
  setExchangeRate,
}: {
  exchangeRate: number | "";
  setExchangeRate: (value: number | 0) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateRate = () => {
    const rate = Number(exchangeRate);
    startTransition(async () => {
      const res = await addExchangeRate(rate);
      if (res.status === "success") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <section className="col-span-12">
      <div className="bg-white dark:bg-[#2d1e16] border border-primary/10 rounded-md p-8 shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none"></div>

        <div className="flex items-start justify-between mb-8 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[12px] mb-1">
              Currency Rate
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage your daily exchange rate for automated conversion.
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <DollarSign className="text-primary w-8 h-8 opacity-40 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch relative z-10">
          <div className="p-6 rounded-md bg-slate-50 dark:bg-background-dark/50 border border-primary/10 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
              Live Status
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Current Rate :{" "}
              <span className="text-primary">
                1 USD = {exchangeRate ? exchangeRate.toLocaleString() : "0"}{" "}
                SLSH
              </span>
            </div>
          </div>

          <div className=" flex flex-col justify-between">
            <div className="relative group h-full">
              <div className="flex flex-col items-center h-full gap-3 px-5 py-4 bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md text-slate-900 dark:text-slate-100 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent outline-none transition-all shadow-lg">
                <label
                  htmlFor="exchange-rate"
                  className="block text-left w-full text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2"
                >
                  New Conversion Rate
                </label>
                <div className="flex items-center justify-end w-full">
                  <span className="min-w-20 text-sm text-slate-500 font-medium">
                    1 USD =
                  </span>
                  <input
                    id="exchange-rate"
                    className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 font-medium outline-none min-h-full"
                    placeholder="e.g 8500"
                    type="number"
                    value={exchangeRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setExchangeRate(
                        e.target.value === "" ? 0 : Number(e.target.value),
                      )
                    }
                  />
                  <span className="text-sm text-slate-500 font-bold tracking-widest">
                    SLSH
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleUpdateRate}
          disabled={isPending}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-md transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 mt-8"
        >
          {isPending ? (
            <RefreshCcw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCcw className="w-4 h-4" />
          )}
          {isPending ? "Updating..." : "Update Rate"}
        </button>
      </div>
    </section>
  );
}

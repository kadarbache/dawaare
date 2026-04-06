export default function FilterButtons() {
  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex items-center bg-white/5 rounded-md p-1 border border-white/10 backdrop-blur-sm w-fit">
        <button className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors duration-200 cursor-pointer">
          All Time
        </button>
        <button className="px-5 py-2 text-[11px] font-black uppercase tracking-widest bg-primary text-white rounded-md shadow-lg active:scale-95 transition-all cursor-pointer">
          Weekly
        </button>
        <button className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors duration-200 cursor-pointer">
          Monthly
        </button>
        <button className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-stone-400 hover:text-primary transition-colors duration-200 cursor-pointer">
          Daily
        </button>
      </div>
    </div>
  );
}

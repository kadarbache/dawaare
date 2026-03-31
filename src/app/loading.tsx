import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background-light dark:bg-[#1a110c] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
        <div className="flex gap-2">
          <span className="size-3 animate-ping rounded-full bg-primary/80"></span>
          <span className="size-3 animate-ping rounded-full bg-primary/80 [animation-delay:0.2s]"></span>
          <span className="size-3 animate-ping rounded-full bg-primary/80 [animation-delay:0.4s]"></span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-primary/60">
            System
          </span>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-600">
            Loading page...
          </span>
        </div>
      </div>
    </div>
  );
}

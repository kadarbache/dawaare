import React from "react";
interface shortCut {
  label: string;
  key: string;
}

export default function ButtomAcionBar({
  shortcuts,
  pathname,
}: {
  shortcuts: shortCut[];
  pathname: string;
}) {
  return (
    <footer className="h-10 bg-slate-100 dark:bg-[#1a110c] text-slate-500 px-8 flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] shrink-0 border-t border-slate-200 dark:border-primary/10 z-40">
      {shortcuts.map((shortcut: shortCut) => (
        <div className="flex items-center gap-2 font-bold" key={shortcut.key}>
          <span className="bg-primary/10 dark:bg-primary/20 font-normal text-primary px-1.5 py-0.5 rounded">
            {shortcut.key}
          </span>{" "}
          {shortcut.label}
        </div>
      ))}
      <div className="ml-auto flex items-center gap-4 text-slate-400 dark:text-slate-600">
        <span>{pathname.toUpperCase()}</span>
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        <span>V1.0.0</span>
      </div>
    </footer>
  );
}

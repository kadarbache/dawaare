"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

export interface ContextMenuAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface ContextMenuProps {
  actions: ContextMenuAction[];
  className?: string;
  triggerIcon?: React.ReactNode;
}

export default function ContextMenu({
  actions,
  className = "",
  triggerIcon,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultActions = actions.filter((a) => a.variant !== "danger");
  const dangerActions = actions.filter((a) => a.variant === "danger");

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-primary/10 transition-colors focus:outline-none"
      >
        {triggerIcon || <MoreVertical size={20} className="text-slate-500" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-100 divide-y divide-slate-100 dark:divide-slate-700">
          {defaultActions.length > 0 && (
            <div className="p-1">
              {defaultActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white rounded transition-colors group"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}
          {dangerActions.length > 0 && (
            <div className="p-1">
              {dangerActions.map((action, i) => (
                <button
                  key={`danger-${i}`}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors group"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

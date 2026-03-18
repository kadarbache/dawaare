"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className = "",
}: MultiSelectDropdownProps) {
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

  const handleToggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const selectedLabels = options
    .filter((o) => value.includes(o.value))
    .map((o) => o.label);

  const displayText =
    selectedLabels.length > 0
      ? `${selectedLabels.slice(0, 2).join(", ")}${
          selectedLabels.length > 2 ? ` (+${selectedLabels.length - 2})` : ""
        }`
      : placeholder;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-left transition-all"
      >
        <span className="text-sm text-slate-900 dark:text-white truncate pr-4">
          {displayText}
        </span>
        <ChevronDown size={20} className="text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-100 min-w-[200px]">
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-transparent"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
          <div className="p-2 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-between">
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs font-bold text-primary px-2 py-1"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
  id?: string;
}

interface SimpleDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  setCatId?: (val: string) => void;
}

export default function SimpleDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
  icon,
  setCatId,
}: SimpleDropdownProps) {
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

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className={`relative `} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${className}`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <span
            className={
              selectedOption
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-400 dark:text-slate-500"
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={20} className="ml-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-lg shadow-xl overflow-hidden z-100">
          <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setCatId?.(option?.id || "");
                  setIsOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                  selectedOption?.value === option.value
                    ? "text-slate-900 dark:text-white hover:bg-primary/10 hover:text-primary font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

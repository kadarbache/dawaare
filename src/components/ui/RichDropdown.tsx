"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface RichOption {
  value: string;
  title: string;
  description: string;
}

interface RichDropdownProps {
  options: RichOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}: RichDropdownProps) {
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
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-left transition-all"
      >
        <span className="text-slate-900 dark:text-white">
          {selectedOption ? selectedOption.title : placeholder}
        </span>
        <ChevronDown size={20} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-100">
          <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer transition-all border-l-4 ${
                  selectedOption?.value === option.value
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-primary/5 hover:border-primary/50"
                }`}
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {option.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

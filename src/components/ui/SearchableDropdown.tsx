"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export default function SearchableDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Filter list...",
  className = "",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-left transition-all"
      >
        <span className="text-sm text-slate-900 dark:text-white">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Search size={20} className="text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-100 flex flex-col max-h-[220px]">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800">
            <div className="relative flex items-center">
              <Search
                size={18}
                className="absolute left-2 text-slate-400"
              />
              <input
                autoFocus
                type="text"
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border-none rounded focus:ring-1 focus:ring-primary/50 text-slate-900 dark:text-slate-200 outline-none"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto py-1 custom-scrollbar flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                    selectedOption?.value === option.value
                      ? "text-slate-900 dark:text-white hover:bg-primary/10 hover:text-primary font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-slate-400 italic">
                No results found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { ChangeEvent } from "react";

interface PhoneInputProps {
  id?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const COUNTRY_CODE = "+252";

export default function PhoneInput({
  id,
  name,
  value,
  onChange,
  required,
}: PhoneInputProps) {
  return (
    <div className="flex items-stretch w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all shadow-sm overflow-hidden">
      <span className="flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-r border-slate-300 dark:border-primary/20 font-bold select-none text-sm font-mono">
        {COUNTRY_CODE}
      </span>
      <input type="hidden" name={name} value={`${COUNTRY_CODE} ${value}`} />
      <input
        id={id}
        placeholder="6X XXXXXXX"
        className="flex-1 bg-transparent px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none w-full"
        type="tel"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        pattern="\d{2} ?\d{7}"
        title="Enter a valid phone number, e.g. 63 1234567"
      />
    </div>
  );
}

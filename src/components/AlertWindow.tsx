"use client";

import DialogModel from "@/components/DialogModel";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

/**
 * Reusable Alert Window Component
 * Following the "Component Swap" rule: Encapsulating the alert design inside the existing DialogModel.
 */
export default function AlertWindow({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}: AlertWindowProps) {
  return (
    <DialogModel
      isOpen={isOpen}
      onClose={onClose}
      title={""} // We use custom header styling to match the design
      max_width="max-w-md"
    >
      <div className="flex flex-col items-center text-center p-4">
        {/* Warning Icon Container */}
        <div className="mb-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <AlertCircle className="text-primary size-9" />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3 mb-8 w-full">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed px-4">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row-reverse gap-3 w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={cn(
              "flex-1 bg-primary text-white font-bold py-3 px-6 rounded-md shadow-[0_0_15px_rgba(236,91,19,0.3)] hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest text-xs cursor-pointer",
              variant === "danger" && "bg-primary shadow-primary/30",
            )}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-transparent text-slate-500 font-bold py-3 px-6 rounded-md border border-slate-200 dark:border-stone-800 hover:bg-slate-100 dark:hover:bg-stone-800/50 hover:text-slate-900 dark:hover:text-slate-100 transition-all active:scale-95 uppercase tracking-widest text-xs cursor-pointer"
          >
            {cancelText}
          </button>
        </div>

        {/* Decorative Glow Element */}
        <div className="absolute -bottom-1 -left-1 -right-1 h-2 bg-linear-to-r from-transparent via-primary/20 to-transparent blur-md"></div>
      </div>
    </DialogModel>
  );
}

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  max_width?: string;
}

/**
 * Reusable Dialog Modal Component
 *
 * This component provides a consistent backdrop, container, and header/close logic.
 * It uses the design system's colors and animations.
 */
export default function DialogModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  max_width = "max-w-2xl",
}: DialogModalProps) {
  // Handle Escape key to close for better accessibility
  useEffect(() => {
    const handle_key_down = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handle_key_down);
    return () => window.removeEventListener("keydown", handle_key_down);
  }, [isOpen, onClose]);

  // Don't render anything if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 sm:pt-[10vh]">
      {/* Modal Backdrop: Clicking here closes the modal */}
      <div
        className="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-0"
        onClick={onClose}
      ></div>

      {/* Modal Container: We stop propagation so clicking content doesn't trigger the backdrop close */}
      <div
        className={`relative z-10 w-full ${max_width} bg-background-light dark:bg-[#2d1e16] rounded-md shadow-2xl border border-primary/10 flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-in fade-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        {title && (
          <header className="p-4 sm:p-6 border-b border-primary/10 shrink-0 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </button>
          </header>
        )}

        {/* Header close button (fallback if no title provided) */}
        {!title && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary/10 rounded-full transition-colors group"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            </button>
          </div>
        )}

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

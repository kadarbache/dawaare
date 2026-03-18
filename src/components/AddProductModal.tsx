"use client";

import React, { useState } from "react";
import { X, Check, Package } from "lucide-react";
import SimpleDropdown from "./ui/SimpleDropdown";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-background-light dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-modal-pop">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-primary/10">
          <div className="flex items-center gap-3">
            <X size={20} className="text-primary" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Add New Product
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-primary/10 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="p-6 space-y-5 overflow-y-auto max-h-[70vh]"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Product Name
            </label>
            <input
              className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="e.g. Wireless Ergonomic Mouse"
              type="text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <SimpleDropdown
                options={[
                  { label: "Electronics", value: "electronics" },
                  { label: "Furniture", value: "furniture" },
                  { label: "Clothing", value: "clothing" },
                  { label: "Accessories", value: "accessories" },
                ]}
                value={category}
                onChange={setCategory}
                placeholder="Select category"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                SKU Code
              </label>
              <input
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="PROD-12345"
                type="text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Price (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 dark:text-primary/60">
                  $
                </span>
                <input
                  className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-lg pl-8 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  step="0.01"
                  type="number"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Stock Count
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 dark:text-primary/60">
                  <Package size={20} />
                </span>
                <input
                  className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="0"
                  type="number"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description (Optional)
            </label>
            <textarea
              className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              placeholder="Enter product details..."
              rows={3}
            ></textarea>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-background-dark/20 border-t border-slate-200 dark:border-primary/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
          >
            <Check size={20} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;

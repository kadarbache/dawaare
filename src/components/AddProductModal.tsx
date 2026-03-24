"use client";

import React, { useState, useRef } from "react";
import { X, Check, Package, Pencil, Trash2, ImagePlus } from "lucide-react";
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
          {/* Image Selection Section */}
          <div className="mb-8 container-query">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />

            <div className="relative group">
              {selectedImage ? (
                <div
                  className="w-full h-56 bg-slate-100 dark:bg-primary/5 rounded-lg overflow-hidden border border-dashed border-slate-300 dark:border-primary/30 flex items-center justify-center bg-center bg-cover"
                  style={{ backgroundImage: `url(${selectedImage})` }}
                >
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="bg-white dark:bg-background-dark p-2 rounded-lg shadow-lg text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-white dark:bg-background-dark p-2 rounded-lg shadow-lg text-slate-500 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full h-56 bg-slate-100 dark:bg-primary/5 rounded-lg overflow-hidden border border-dashed border-slate-300 dark:border-primary/30 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-primary/40 hover:text-primary dark:hover:text-primary/60 hover:bg-slate-200 dark:hover:bg-primary/10 transition-all cursor-pointer group"
                >
                  <div className="p-4 rounded-full bg-slate-50 dark:bg-primary/5 group-hover:bg-primary/10 transition-colors">
                    <ImagePlus size={32} />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      Upload Product Image
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-widest">
                      JPG, PNG or WEBP (Max 2MB)
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Input Section: Product Name - Used to identify the item in the inventory */}
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
            {/* Input Section: Category - Organizes products into groups (e.g., Electronics, Accessories) */}
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

            {/* Input Section: SKU Code - Unique identifier for stock keeping and tracking */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Input Section: Selling Price - The price the customer pays for the product */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Selling Price
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

            {/* Input Section: Cost Price - The amount paid to acquire the product from the supplier */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Cost Price
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

            {/* Input Section: Stock Count - Total number of items currently available in stock */}
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

import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, X } from "lucide-react";
import { TerminalProduct } from "../_context/TerminalContext";
import Image from "next/image";

interface TerminalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  products: TerminalProduct[];
  onSelectProduct: (product: TerminalProduct) => void;
}

export default function TerminalSearchOverlay({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}: TerminalSearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter products based on search term
  const filteredProducts = products
    .filter(
      (p: TerminalProduct) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .slice(0, 10); // Limit to 10 results for performance

  // this 10 minutes delay is to prevent the search overlay from rendering before the terminal workspace
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSelectedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      setSearchTerm("");
      setSelectedIndex(0);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredProducts.length > 0) {
        onSelectProduct(filteredProducts[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center pt-24 px-6 bg-background-dark/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl relative animate-in slide-in-from-top-4 duration-300">
        {/* Search Input Box */}
        <div className="w-full bg-white dark:bg-[#1a110c] rounded-t-xl border-x border-t border-slate-200 dark:border-primary/30 shadow-2xl flex items-center px-6 h-20 transition-all duration-300 relative z-10">
          <SearchIcon className="text-primary text-3xl mr-4" size={28} />
          <input
            ref={inputRef}
            className="bg-transparent border-none focus:ring-0   font-medium dark:placeholder-stone-600 w-full tracking-tight outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500"
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={() => {
              onClose();
              setSearchTerm("");
              setSelectedIndex(0);
            }}
            className="p-2 text-slate-400 dark:text-stone-500 hover:text-primary transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Dropdown Menu */}
        <div className="w-full bg-white dark:bg-[#1a110c] rounded-b-xl border-x border-b border-slate-200 dark:border-primary/30 shadow-2xl overflow-hidden flex flex-col relative z-10">
          {/* Header Label */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-primary/20 bg-slate-50 dark:bg-primary/5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              Product Results ({filteredProducts.length})
            </span>
          </div>

          {/* Result Items */}
          <div className="flex flex-col max-h-[50vh] overflow-y-auto custom-scrollbar">
            {filteredProducts.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-500 font-medium">
                No products found matching &quot;{searchTerm}&quot;
              </div>
            ) : (
              filteredProducts.map(
                (product: TerminalProduct, index: number) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        setSearchTerm("");
                        onSelectProduct(product);
                      }}
                      className={`px-6 py-5 border-b border-slate-100 dark:border-primary/10 flex items-center justify-between cursor-pointer transition-all duration-200 group ${
                        isSelected
                          ? "bg-orange-50 dark:bg-orange-600/20 border-l-4 border-l-orange-500 dark:border-l-orange-600"
                          : "hover:bg-slate-50 dark:hover:bg-stone-800/30 border-l-4 border-l-transparent"
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-orange-500/30 bg-slate-100 dark:bg-background-dark flex items-center justify-center shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={56}
                              height={56}
                              className={`w-full h-full object-cover ${!isSelected && "opacity-80"}`}
                            />
                          ) : (
                            <div className="text-xs text-slate-400 font-bold">
                              No Img
                            </div>
                          )}
                        </div>
                        <div>
                          <h3
                            className={`text-lg font-semibold leading-tight ${isSelected ? "text-slate-900 dark:text-orange-50" : "text-slate-700 dark:text-slate-200"}`}
                          >
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span
                              className={`text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded ${
                                isSelected
                                  ? "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/50"
                                  : "text-slate-500 dark:text-stone-500 bg-slate-100 dark:bg-background-dark"
                              }`}
                            >
                              {product.sku}
                            </span>
                            <span className="text-[11px] text-emerald-500 dark:text-emerald-400 font-semibold uppercase tracking-widest flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              In Stock: {product.stock_qty}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-2xl font-bold transition-colors ${isSelected ? "text-primary" : "text-slate-700 dark:text-slate-300 group-hover:text-primary"}`}
                        >
                          ${product.price.toFixed(2)}
                        </p>
                        {isSelected && (
                          <span className="text-[10px] text-slate-400 dark:text-stone-500 font-semibold uppercase tracking-widest">
                            Press Enter to Add
                          </span>
                        )}
                      </div>
                    </div>
                  );
                },
              )
            )}
          </div>
        </div>
      </div>

      {/* Invisible backdrop closer */}
      <div
        className="absolute inset-0 z-0"
        onClick={() => {
          onClose();
          setSearchTerm("");
          setSelectedIndex(0);
        }}
      />
    </div>
  );
}

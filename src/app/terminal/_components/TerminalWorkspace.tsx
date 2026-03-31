"use client";

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Barcode, SearchIcon, X } from "lucide-react";
import CartTable from "./CartTable";
import SummarySidebar from "./SummarySidebar";
import ButtomAcionBar from "./ButtomAcionBar";
import TerminalSearchOverlay from "./TerminalSearchOverlay";
import {
  TerminalProvider,
  TerminalProduct,
  useTerminal,
} from "../_context/TerminalContext";

function WorkspaceContent() {
  const { products, addToCart } = useTerminal();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  const handleSelectProduct = (product: TerminalProduct) => {
    addToCart(product);
    setIsSearchOpen(false);
  };

  const handleScan = (detectedCodes: { rawValue: string }[]) => {
    if (detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      const matched = products.find(
        (p) => p.sku.toLowerCase() === scannedValue.toLowerCase(),
      );
      if (matched) {
        addToCart(matched);
      }
      setIsScanning(false);
    }
  };

  // Listen for F10 to open search, F9 to toggle scanner
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F10") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "F9") {
        e.preventDefault();
        setIsScanning((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Side: Scanning Zone */}
        <section className="w-[70%] flex flex-col p-8 gap-6 overflow-hidden">
          {/* Search & Barcode Area */}
          <div className="flex gap-3">
            <div
              className="relative group flex-1 cursor-text"
              onClick={() => setIsSearchOpen(true)}
            >
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <SearchIcon size={24} className="text-primary" />
              </div>
              <div className="w-full h-14 bg-white dark:bg-[#2d1e16] border border-slate-200 dark:border-primary/20 rounded-xl pl-14 pr-16 text-lg font-medium text-slate-400 dark:text-slate-500 hover:border-primary transition-all shadow-sm flex items-center">
                Type product name or SKU & press enter...
              </div>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <kbd className="px-2 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded text-xs font-bold text-primary">
                  F10
                </kbd>
              </div>
            </div>
            <div className="relative flex-none" style={{ width: "30%" }}>
              <button
                type="button"
                onClick={() => setIsScanning((prev) => !prev)}
                className={`w-full h-14 border rounded-xl pl-5 pr-16 text-lg font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm flex items-center cursor-pointer active:scale-[0.98] ${
                  isScanning
                    ? "bg-primary/10 dark:bg-primary/20 border-primary/50 dark:border-primary/50"
                    : "bg-white dark:bg-[#2d1e16] border-slate-200 dark:border-primary/20 hover:bg-slate-50 dark:hover:bg-primary/5"
                }`}
                title="Scan Barcode/QR Code"
              >
                <Barcode size={24} className="text-primary" />
                <span className="ml-3 text-slate-400 dark:text-slate-500">
                  {isScanning ? "Scanning..." : "Barcode..."}
                </span>
              </button>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <kbd className="px-2 py-1 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded text-xs font-bold text-primary">
                  F9
                </kbd>
              </div>

              {/* Scanner dropdown */}
              {isScanning && (
                <>
                  {/* Click-away backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsScanning(false)}
                  />
                  <div
                    className="absolute top-full left-0 mt-2 w-full z-50 rounded-xl overflow-hidden border-2 border-primary/40 bg-black shadow-2xl shadow-primary/10"
                    style={{ height: "220px" }}
                  >
                    <Scanner
                      onScan={handleScan}
                      onError={(error) => {
                        console.error("Scanner Error:", error);
                      }}
                      components={{
                        finder: true,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsScanning(false)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70 z-10 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cart Table Card */}
          <CartTable />
        </section>

        {/* Right Side: Summary Sidebar */}
        <SummarySidebar />

        {/* Drodown Overlay injected here */}
        <TerminalSearchOverlay
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          products={products}
          onSelectProduct={handleSelectProduct}
        />
      </main>

      {/* Bottom Action Bar */}
      <ButtomAcionBar />
    </>
  );
}

export default function TerminalWorkspace({
  products,
}: {
  products: TerminalProduct[];
}) {
  return (
    <TerminalProvider initialProducts={products}>
      <WorkspaceContent />
    </TerminalProvider>
  );
}

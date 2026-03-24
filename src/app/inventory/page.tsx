"use client";

import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import AddProductModal from "../../components/AddProductModal";
import {
  Plus,
  SlidersHorizontal,
  Layers,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  Ban,
  Wallet,
  ListChecks,
  Pencil,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import StatusCard from "@/components/StatusCard";

const products = [
  {
    id: 1,
    name: "Sony WH-1000XM4",
    sku: "AUD-2023-001",
    category: "Electronics",
    price: "$349.00",
    costPrice: "$280.00",
    stockCount: 3,
    isLowStock: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChmsiOr397ceoV7PlvRBOK-zRIspy5luCA8i_7Rd-nmakHCpRqkBmoL5Ssq3I1mNrQl4GVwTKbtgtWnMwiGH_W4ZQLxhB5aIFoBFgB2LGSqT2JKgISVcUxN6kUObM8_xP3i8LGaqP1ynRDZJTI-LHivzhOOz9O-OyBwgJ-laEAVxI-vlcZxLffn9Y43jH8em6aAaEbp8xw0wCZyZsR0kRN0DlUT3Qtl-3Bz82NaQ5SBzXJ0MxeGhF344JuTLQTbYGptIFBjNz3h48",
  },
  {
    id: 2,
    name: "Nordic Chronograph",
    sku: "WCH-8821-X",
    category: "Accessories",
    price: "$189.00",
    costPrice: "$120.00",
    stockCount: 42,
    isLowStock: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIhYWzUAmrZzvQc7tAgS6Jyw7ee9xa4eyOMFRf90NZr9KV4TbcUcxIuDp5vPyfpLiHwQ3Kt4hG0ZFzCEEBWHV47KhlH9-V0MFOi0i5c41fq8g5poJkJyPYlKwcipi1_aRjBrh1OBduu3aCjQceq1UMtycfmxuzMmDPQ5_di5gL0JVzfQOCeYNqHX0g2nhydGhUN_JVz4dqYDSNokYlfpJbfph5vTP2V-wCpqduYzZcX-x4UrFuroG2yTix-iBLcEs6TIc28CfzZw4",
  },
  {
    id: 3,
    name: "Polaroid Now+ Gen 2",
    sku: "CAM-9001-P",
    category: "Electronics",
    price: "$149.99",
    costPrice: "$95.00",
    stockCount: 4,
    isLowStock: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC5e5suMRG0gzm-7i4wwzDmV7NE27IVEyiLhDCyMHmzLJ2opAjCBKu_GS3MUbkqpgesgHXpdKKbCUqnUjFNzkTxAISbgCSrI_uvaFf3nNKYcOkGkyZ-EDQQnYE25A0PMbtclk3vpUdUqX-m3lcA5dR4bTqdgsSHtlm98yIOWI5NPlHb8atnPQGiM_8RxbXauEZILnKvWXzARBgipiDLlIi4eFqOFK71FkZJqCVvEQos4f91y6RpF1k6hfGbPSvjOTsrj7I0Pc_tAY",
  },
];

export default function InventoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProduct = () => {
    console.log("Saving product...");
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden relative border-l border-slate-200 dark:border-primary/20">
        {/* Top Navigation Bar */}
        <Topbar page="Inventory" subPage="" />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-[#1a110c]">
          <div className="max-w-[1440px] mx-auto px-8 py-8">
            {/* Page Header & Stats */}
            <div className="flex flex-wrap justify-between items-end gap-3 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">
                  Inventory Management
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
                  Real-time overview of your product stock and performance
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:scale-[1.02] active:scale-95 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Plus size={16} />
                  Add Product
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-primary/10 border border-slate-200 dark:border-primary/30 rounded-xl text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-primary/20 transition-all cursor-pointer">
                  <SlidersHorizontal size={16} />
                  Filter
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatusCard
                title="Total Products"
                value="1,240"
                description="+2.5% from last month"
                variant="success"
                icon={<Layers size={20} className="text-primary" />}
                trendIcon={<TrendingUp size={12} />}
              />

              <StatusCard
                title="Low Stock Items"
                value="8"
                description="Critical attention"
                variant="danger"
                icon={<AlertTriangle size={20} className="text-primary" />}
                trendIcon={<AlertCircle size={12} />}
              />

              <StatusCard
                title="Out of Stock"
                value="3"
                description="No change from yesterday"
                variant="danger"
                icon={<Ban size={20} className="text-primary" />}
                trendIcon={<AlertCircle size={12} />}
              />

              <div className="flex flex-col gap-2 rounded-2xl p-6 border border-slate-200 dark:border-primary/30 bg-white dark:bg-background-dark shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Inventory Value
                  </p>
                  <Wallet size={20} className="text-primary" />
                </div>
                <p className="text-primary text-3xl font-black">$45,200.00</p>
                <p className="text-emerald-500 text-xs font-bold flex items-center gap-1">
                  <TrendingUp size={12} />
                  +5.4% increase
                </p>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl overflow-hidden flex flex-col mb-12">
              <div className="p-4 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/10">
                <h3 className="font-bold flex items-center gap-2">
                  <ListChecks size={20} className="text-primary" />
                  Stock List
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10">
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Image
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Product Name
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Category
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Price
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Cost Price
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Stock Count
                      </th>
                      <th className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-widest text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-primary/5 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-12 border border-slate-200 dark:border-primary/30 group-hover:border-primary/50 transition-colors"
                            data-alt={product.name}
                            style={{
                              backgroundImage: `url("${product.image}")`,
                            }}
                          ></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                              {product.name}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-slate-900 dark:text-slate-100 font-bold text-sm">
                          {product.price}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                          {product.costPrice}
                        </td>
                        <td className="px-6 py-4">
                          {product.isLowStock ? (
                            <span className="text-primary font-black text-sm flex items-center gap-1">
                              {product.stockCount}{" "}
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                (Low)
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                              {product.stockCount}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">
                              <Pencil size={14} />
                              Edit
                            </button>
                            <button className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 cursor-pointer">
                              <BarChart3 size={14} />
                              Analytics
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-primary/10 bg-slate-50 dark:bg-primary/5">
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Showing <span className="font-bold text-primary">1-5</span> of{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    1,240
                  </span>{" "}
                  products
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
                    disabled={true}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg bg-primary text-white text-xs font-bold shadow-md shadow-primary/20 cursor-pointer">
                    1
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all cursor-pointer">
                    2
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all cursor-pointer">
                    3
                  </button>
                  <span className="text-slate-400 dark:text-slate-600 px-2">
                    ...
                  </span>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-primary/20 dark:hover:bg-primary/20 text-slate-600 dark:text-slate-400 text-xs font-bold transition-all cursor-pointer">
                    248
                  </button>
                  <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary transition-colors cursor-pointer">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Status Bar */}
        <footer className="h-10 bg-slate-900 text-slate-400 px-6 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider shrink-0 border-t border-white/5 z-40">
          <div className="flex items-center gap-1">
            <span className="bg-slate-700 px-1 rounded text-white">F1</span>{" "}
            HELP
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-slate-700 px-1 rounded text-white">F10</span>{" "}
            SEARCH
          </div>
          <div className="ml-auto text-slate-500 flex items-center gap-4">
            <span>SYSTEM READY</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>INVENTORY MANAGER • V2.4.0</span>
          </div>
        </footer>

        {/* Add Product Modal */}
        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
        />
      </div>
    </div>
  );
}

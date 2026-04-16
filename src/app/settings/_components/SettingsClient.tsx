"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import CurrencyRate from "./CurrencyRate";
import Catalog from "./Catalog";
import CategoryModel from "./CategoryModel";
import { Categories } from "../page";
import Profile from "./Profile";

export default function SettingsClient({
  categories,
}: {
  categories: Categories[];
}) {
  const [activeTab, setActiveTab] = useState("Currency & Categories");
  const [exchangeRate, setExchangeRate] = useState<number | "">(8500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categories | null>(
    null,
  );

  const tabs = [
    "Currency & Categories",
    "Profile",
    "Receipts (inactive)",
    "Users (inactive)",
    "Currency (inactive)",
  ];

  const handleUpdateRate = () => {
    toast.success(`Exchange rate updated to 1 USD = ${exchangeRate} SLSH`);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Categories) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-primary tracking-tight">
          Shop Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage your daily exchange rate and product catalog
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-primary/10 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabs.map((tab: string) => (
          <button
            key={tab}
            onClick={() => !tab.includes("(inactive)") && setActiveTab(tab)}
            className={`pb-4 text-sm font-medium transition-all ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary font-bold"
                : "text-slate-500 hover:text-primary"
            } ${tab.includes("(inactive)") ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Currency & Categories" && (
        <div className="grid grid-cols-12 gap-8">
          {/* Section 1: Currency Rate */}
          <CurrencyRate
            exchangeRate={exchangeRate}
            setExchangeRate={setExchangeRate}
            handleUpdateRate={handleUpdateRate}
          />
          {/* Section 2: Categories */}
          <Catalog
            categories={categories}
            handleAddCategory={handleAddCategory}
            handleEditCategory={handleEditCategory}
          />
        </div>
      )}

      {activeTab === "Profile" && <Profile />}

      {/* Category Modal - Component Swap implementation */}
      <CategoryModel
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingCategory={editingCategory}
      />
    </div>
  );
}

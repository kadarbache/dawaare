import React from "react";
import StatusCard from "@/components/StatusCard";
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Layers,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { InventoryStats } from "./InventoryClient";

export default function Status({ stats }: { stats: InventoryStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatusCard
        title="Total Products"
        value={stats.totalProducts.toString()}
        description={`${stats.productsAddedLastMonth} added since last month`}
        variant="success"
        icon={<Layers size={20} className="text-primary" />}
        trendIcon={<TrendingUp size={12} />}
      />

      <StatusCard
        title="Low Stock Items"
        value={stats.lowStockProducts.toString()}
        description={
          stats.lowStockProducts > 0
            ? "Critical attention"
            : "All items well stocked"
        }
        variant={stats.lowStockProducts > 0 ? "danger" : "success"}
        icon={<AlertTriangle size={20} className="text-primary" />}
        trendIcon={<AlertCircle size={12} />}
      />

      <StatusCard
        title="Out of Stock"
        value={stats.outOfStockProducts.toString()}
        description={
          stats.outOfStockSinceYesterday > 0
            ? `${stats.outOfStockSinceYesterday} went out of stock since yesterday`
            : "No change from yesterday"
        }
        variant={stats.outOfStockProducts > 0 ? "danger" : "success"}
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
        <p className="text-primary text-3xl font-black">
          $
          {stats.inventoryValue.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p
          className={`text-xs font-bold flex items-center gap-1 ${
            stats.isInventoryValueDown ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {stats.isInventoryValueDown ? (
            <TrendingDown size={12} />
          ) : (
            <TrendingUp size={12} />
          )}
          {stats.inventoryValueChange === 0
            ? "No change from last month"
            : `${stats.isInventoryValueDown ? "" : "+"}${stats.inventoryValueChange.toFixed(1)}% vs last month`}
        </p>
      </div>
    </div>
  );
}

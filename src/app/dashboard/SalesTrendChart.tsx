"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import Link from "next/link"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export type SalesTrendDay = {
  label: string;
  date: string;
  total: number;
};

const chartConfig = {
  total: {
    label: "Sales",
    color: "#ec5b13", // Primary color
  },
} satisfies ChartConfig

export function SalesTrendChart({ trend, filter }: { trend: SalesTrendDay[], filter: string }) {
  // If the filter is monthly or all, we show monthly trend (30 days)
  const isMonthly = filter === "monthly" || filter === "all";

  return (
    <div className="lg:col-span-2 bg-white dark:bg-primary/5 rounded-2xl border border-slate-200 dark:border-primary/20 shadow-xl p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Sales Trend
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Last {isMonthly ? "30" : "7"} Operating Days
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            scroll={false}
            href="?filter=weekly"
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${!isMonthly ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary"}`}
          >
            Weekly
          </Link>
          <Link
            scroll={false}
            href="?filter=monthly"
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors ${isMonthly ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-primary"}`}
          >
            Monthly
          </Link>
        </div>
      </div>

      <div className="grow min-h-[300px] relative w-full">
        <ChartContainer config={chartConfig} className="w-full h-full min-h-[300px]">
          <LineChart
            accessibilityLayer
            data={trend}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={3}
              dot={{
                fill: "var(--color-total)",
                r: 4,
              }}
              activeDot={{
                r: 6,
                fill: "var(--color-total)",
              }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  )
}

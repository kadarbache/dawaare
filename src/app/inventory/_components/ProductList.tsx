import React from "react";
import { Product } from "@prisma/client";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import EditProductBtn from "./EditProduct";
import { ItemsCategory } from "@prisma/client";

export default function ProductList({
  products,
  categories,
}: {
  products: Product[];
  categories: ItemsCategory[];
}) {
  return (
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
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-md size-12 border border-slate-200 dark:border-primary/30 group-hover:border-primary/50 transition-colors"
                data-alt={product.name}
                style={{
                  backgroundImage: `url("${product.image}")`,
                }}
              ></div>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <Link
                  href={`/inventory/${product.id}`}
                  className="text-slate-900 dark:text-slate-100 font-bold text-sm hover:text-primary transition-colors"
                >
                  {product.name}
                </Link>
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
              {product.cost_price}
            </td>
            <td className="px-6 py-4">
              {product.is_low_stock ? (
                <span className="text-primary font-black text-sm flex items-center gap-1">
                  {product.stock_qty}{" "}
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    (Low)
                  </span>
                </span>
              ) : (
                <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                  {product.stock_qty}
                </span>
              )}
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex justify-end gap-2">
                <EditProductBtn categories={categories} product={product} />
                <Link
                  href={`/inventory/${product.id}`}
                  className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <BarChart3 size={14} />
                  Analytics
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

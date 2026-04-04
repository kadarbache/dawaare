import React from "react";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useTerminal } from "../_context/TerminalContext";

export default function CartTable() {
  const { cartItems, updateQuantity, updatePrice, removeFromCart, clearCart } =
    useTerminal();

  return (
    <div className="flex-1 bg-white dark:bg-[#2d1e16] rounded-xl border border-slate-200 dark:border-primary/10 overflow-hidden flex flex-col shadow-xl">
      <div className="p-4 border-b border-slate-200 dark:border-primary/10 flex justify-between items-center bg-slate-50 dark:bg-primary/5 shrink-0">
        <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
          <ShoppingCart size={16} className="text-primary" />
          Current Sale ({cartItems.length} items)
        </h3>
        <button
          onClick={clearCart}
          className="text-[10px] font-black text-red-500 flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-500/10 px-2 py-1 rounded transition-colors uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={cartItems.length === 0}
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left text-sm table-auto">
          <thead className="sticky top-0 bg-slate-50 dark:bg-[#2d1e16] border-b border-slate-200 dark:border-primary/10 text-slate-500 uppercase text-[11px] font-bold tracking-wider z-10">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap w-fit">Product</th>
              <th className="px-6 py-4 whitespace-nowrap w-fit">SKU</th>
              <th className="px-6 py-4 whitespace-nowrap w-fit">Cost</th>
              <th className="px-6 py-4 text-center whitespace-nowrap w-fit">
                Price
              </th>
              <th className="px-6 py-4 text-center whitespace-nowrap w-fit">
                Qty
              </th>
              <th className="px-6 py-4 text-right whitespace-nowrap w-fit">
                Subtotal
              </th>
              <th className="px-6 py-4 text-center whitespace-nowrap w-fit">
                remove
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-primary/5">
            {cartItems.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium italic"
                >
                  No items in the cart. Start scanning or searching...
                </td>
              </tr>
            ) : (
              cartItems.map((item) => (
                <tr
                  key={item.product.id}
                  className="hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
                >
                  <td className="px-6 py-5 font-medium text-slate-900 dark:text-white whitespace-nowrap w-fit">
                    {item.product.name}
                  </td>
                  <td className="px-6 py-5 text-slate-400 dark:text-slate-500 font-mono text-[11px] whitespace-nowrap w-fit">
                    {item.product.sku}
                  </td>
                  <td className="px-6 py-5 text-slate-400 dark:text-slate-500 font-mono text-[11px] whitespace-nowrap w-fit">
                    {item.product.cost_price}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap w-fit min-w-64">
                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={() =>
                          updatePrice(item.product.id, item.product.price - 0.1)
                        }
                        className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-fit text-center font-bold text-slate-900 dark:text-white">
                        ${item.product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          updatePrice(item.product.id, item.product.price + 0.1)
                        }
                        className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap w-fit">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-4 text-center font-bold text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-right text-primary whitespace-nowrap w-fit">
                    ${item.subtotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-5 text-center whitespace-nowrap w-fit">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

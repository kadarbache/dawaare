"use client";

import type { User } from "@prisma/client";
import { MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SellerModal from "./SellerModal";

interface SellersListProps {
  users?: User[];
}

export default function SellersList({ users = [] }: SellersListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
            Sellers & Staff
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Manage your team of sellers and internal staff members. Monitor
            activity, update contact information, and adjust access privileges.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-md shadow-lg shadow-primary/20 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} />
          Add New Seller
        </button>
      </div>

      {/* Data Table Card */}
      <div className="bg-white dark:bg-background-dark/50 rounded-md border border-slate-200 dark:border-primary/10 p-6 shadow-sm relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex gap-4"></div>
          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
            {" "}
            sellers {users?.filter((s) => s.role == "SELLER").length}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative z-10 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-primary/10">
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                  Seller Name
                </th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                  Contact Info
                </th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                  Date Joined
                </th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
                  Status
                </th>
                <th className="py-4 px-4 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => {
                const isPending = !user.emailVerified;
                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 dark:border-primary/5 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <div className="h-10 w-10 relative">
                            <Image
                              alt={user.name}
                              fill
                              className="absolute top-0 left-0 w-full h-full rounded-md border border-slate-200 dark:border-primary/20 object-cover"
                              src={user.image}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-slate-100 dark:bg-primary/5 flex items-center justify-center border border-slate-200 dark:border-primary/10 text-slate-600 dark:text-slate-400 font-bold uppercase">
                            {user.name.substring(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                            {user.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-0.5">
                            ID: #{user.id.split("-")[0].substring(0, 6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-slate-700 dark:text-slate-300">
                        {user.email}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {user.number || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </td>
                    <td className="py-4 px-4">
                      {!isPending ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 border border-green-200 dark:border-green-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-500/20">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-md hover:bg-primary/10">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    No sellers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SellerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

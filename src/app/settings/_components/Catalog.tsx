import { ChevronLeft, ChevronRight, Edit, Plus, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Categories } from "../page";
import { deleteCategory } from "../server";
import { useTransition, useState } from "react";

const PAGE_SIZE = 5;

export default function Catalog({
  categories,
  handleAddCategory,
  handleEditCategory,
}: {
  categories: Categories[];
  handleAddCategory: () => void;
  handleEditCategory: (category: Categories) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(categories.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleDeleteCategory = async (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.status === "success") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <section className="col-span-12">
      <div className="bg-white dark:bg-[#2d1e16] border border-primary/10 rounded-md overflow-hidden shadow-sm">
        <div className="p-8 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 uppercase tracking-widest text-[12px] mb-1">
              Product Categories
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Organize your products by category to optimize inventory
              reporting.
            </p>
          </div>
          <button
            onClick={handleAddCategory}
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-bold py-2.5 px-5 rounded-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-background-dark/30 border-b border-primary/10">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Category Name
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Product Count
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">
                      There are no categories configured yet.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat: Categories) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-primary/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                        {cat.count.toLocaleString()} Items
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                          onClick={() => handleDeleteCategory(cat.id)}
                          disabled={isPending}
                        >
                          {/* TODO: FIXING THE SPINNER SHOWING ON EVERY BUTTON */}
                          {isPending ? (
                            <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {categories.length > 0 && (
          <div className="p-4 border-t border-primary/10 bg-slate-50 dark:bg-background-dark/30 flex justify-between items-center px-8">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Showing {Math.min(startIndex + 1, categories.length)} to{" "}
              {Math.min(startIndex + PAGE_SIZE, categories.length)} of{" "}
              {categories.length} categories
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 border border-primary/10 rounded-md hover:bg-white dark:hover:bg-background-dark transition-all text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="h-8 min-w-[32px] border border-primary bg-primary text-white transition-all text-[10px] font-bold px-3 rounded-md">
                {currentPage}
              </button>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="p-2 border border-primary/10 rounded-md hover:bg-white dark:hover:bg-background-dark transition-all text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

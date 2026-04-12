import DialogModal from "@/components/DialogModel";
import toast from "react-hot-toast";
import { Categories } from "../page";

export default function CategoryModel({
  isModalOpen,
  setIsModalOpen,
  editingCategory,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  editingCategory: Categories | null;
}) {
  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={editingCategory ? "Edit Category" : "Add New Category"}
      description="Organize your product catalog for better reporting and sales analytics."
      max_width="max-w-md"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Category Name
          </label>
          <input
            type="text"
            defaultValue={editingCategory?.name || ""}
            className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
            placeholder="e.g. Beverages"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button
            onClick={() => setIsModalOpen(false)}
            className="flex-1 px-4 py-3 border border-primary/10 rounded-md font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.success(
                editingCategory ? "Category updated!" : "Category created!",
              );
              setIsModalOpen(false);
            }}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-md font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            {editingCategory ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </div>
    </DialogModal>
  );
}

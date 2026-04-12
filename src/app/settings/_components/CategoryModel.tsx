import DialogModal from "@/components/DialogModel";
import toast from "react-hot-toast";
import { Categories } from "../page";
import { useActionState, useEffect, useRef } from "react";
import { add_category, edit_category, type ActionState } from "../server";
export default function CategoryModel({
  isModalOpen,
  setIsModalOpen,
  editingCategory,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
  editingCategory: Categories | null;
}) {
  const [state, formAction, isPending] = useActionState(
    editingCategory ? edit_category : add_category,
    {
      status: "idle",
      message: "",
    } as ActionState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      setIsModalOpen(false);
      formRef.current?.reset();
    } else if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state, setIsModalOpen]);

  return (
    <DialogModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={editingCategory ? "Edit Category" : "Add New Category"}
      description={editingCategory ? "Update the name of an existing product category." : "Please make sure the category name that you are about to add is not already in our product catalog."}
      max_width="max-w-md"
    >
      <form key={editingCategory?.id || 'new'} ref={formRef} action={formAction} className="space-y-6">
        {editingCategory && (
          <input type="hidden" name="category_id" value={editingCategory.id} />
        )}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Category Name
          </label>
          <input
            type="text"
            name="category_name"
            defaultValue={editingCategory?.name || ""}
            className="w-full bg-slate-50 dark:bg-background-dark border border-primary/10 rounded-md px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
            placeholder="e.g. Beverages"
            required
            disabled={isPending}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
            className="flex-1 px-4 py-3 border border-primary/10 rounded-md font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-primary/5 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 px-4 py-3 bg-primary text-white rounded-md font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : editingCategory ? (
              "Save Changes"
            ) : (
              "Create Category"
            )}
          </button>
        </div>
      </form>
    </DialogModal>
  );
}

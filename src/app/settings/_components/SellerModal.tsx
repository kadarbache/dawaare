import DialogModal from "@/components/DialogModel";
import PhoneInput from "@/components/PhoneInput";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { addSellerAction } from "../authentication";
import toast from "react-hot-toast";

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SellerModal({ isOpen, onClose }: SellerModalProps) {
  const [state, action, isPending] = useActionState(addSellerAction, null);
  const [phoneInput, setPhoneInput] = useState("");

  useEffect(() => {
    if (state?.success) {
      if (state.temporaryPassword) {
        toast.success(
          `Seller added. Temporary password: ${state.temporaryPassword}`,
          { duration: 15000 },
        );
      } else {
        toast.success("Seller added successfully");
      }
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose]);

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Seller"
      description="Register a new staff member or administrator for your store."
      max_width="max-w-xl"
    >
      <form action={action} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <label
              htmlFor="seller-first-name"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              First Name
            </label>
            <input
              id="seller-first-name"
              name="firstName"
              placeholder="e.g. Naruto"
              className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="seller-last-name"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Last Name
            </label>
            <input
              id="seller-last-name"
              name="lastName"
              placeholder="e.g. Uzumaki"
              className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="seller-email"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Email Address
            </label>
            <input
              id="seller-email"
              name="email"
              placeholder="ninja@konoha.com"
              className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
              type="email"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="seller-phone"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Phone Number
            </label>
            <PhoneInput
              id="seller-phone"
              name="phone"
              value={phoneInput}
              onChange={setPhoneInput}
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="seller-role"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"
            >
              Role / Position
            </label>
            <input
              id="seller-role"
              name="role"
              value="Seller"
              disabled
              className="w-full bg-slate-100/50 dark:bg-slate-900/20 border border-slate-200 dark:border-primary/10 rounded-md px-4 py-2.5 text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none shadow-sm"
              type="text"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-primary/10">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 w-full md:w-auto"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Staff Account
          </button>
        </div>
      </form>
    </DialogModal>
  );
}

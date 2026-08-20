"use client";

import { createCustomer } from "@/app/customers/server";
import { Loader2 } from "lucide-react";
import React, { useActionState, useEffect, useRef, useState } from "react";
import DialogModal from "@/components/DialogModel";
import PhoneInput from "@/components/PhoneInput";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({
  isOpen,
  onClose,
}: AddCustomerModalProps) {
  const [state, formAction, isPending] = useActionState(createCustomer, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (state?.success) {
      if (formRef.current) formRef.current.reset();
      onClose();
    }
  }, [state, onClose]);

  const handleCloseModal = () => {
    if (formRef.current) formRef.current.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Add New Customer"
      description="Fill out the details to add a new customer."
    >
      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && (
          <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label
              htmlFor="customer-name"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Full Name *
            </label>
            <input
              id="customer-name"
              name="name"
              required
              className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="e.g. John Doe"
              type="text"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5 md:col-span-1">
            <label
              htmlFor="customer-phone"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Phone Number *
            </label>
            <PhoneInput
              id="customer-phone"
              name="phone"
              value={phone}
              onChange={setPhone}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label
              htmlFor="customer-email"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Email{" "}
              <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              id="customer-email"
              name="email"
              className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="e.g. johndoe@example.com"
              type="email"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="customer-address"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Address{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <textarea
            id="customer-address"
            name="address"
            rows={2}
            className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
            placeholder="Enter customer address..."
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="customer-notes"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Notes <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <textarea
            id="customer-notes"
            name="notes"
            rows={2}
            className="w-full bg-slate-50 dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
            placeholder="Add any internal notes..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center min-w-[120px] px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Save Customer"
            )}
          </button>
        </div>
      </form>
    </DialogModal>
  );
}

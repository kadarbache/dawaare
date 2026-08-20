"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useState } from "react";
import AddCustomerModal from "./addCustomerModel";

export function NoCustomer() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 mb-6">
          <User size={48} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          No Customer Selected
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
          Select a customer or create a new one.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="mt-4"
          onClick={handleOpen}
        >
          Create New Customer
        </Button>
      </div>
      <AddCustomerModal
        key={open ? "open" : "closed"}
        isOpen={open}
        onClose={handleClose}
      />
    </>
  );
}

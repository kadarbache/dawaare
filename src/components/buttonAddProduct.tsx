"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import ProductModel from "../app/inventory/_components/ProductModal";
import { ItemsCategory } from "@/utils/types";
import { createProduct } from "@/app/inventory/server";

export default function ButtonAddProduct({
  categories,
}: {
  categories: ItemsCategory[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:scale-[1.02] active:scale-95 rounded-md text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
      >
        <Plus size={16} />
        Add Product
      </button>
      {/* Add Product Modal */}
      <ProductModel
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categories={categories}
        editProduct={null}
        action={createProduct}
      />
    </>
  );
}

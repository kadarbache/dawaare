"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddProductModal from "./AddProductModal";

export default function ButtonAddProduct() {
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
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:scale-[1.02] active:scale-95 rounded-xl text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 cursor-pointer"
      >
        <Plus size={16} />
        Add Product
      </button>
      {/* Add Product Modal */}
      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

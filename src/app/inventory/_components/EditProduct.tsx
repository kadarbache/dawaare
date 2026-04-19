import { Product } from "@/utils/types";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import EditProductModel from "./EditProductModel";
import { updateProduct } from "../server";
import { ItemsCategory } from "@prisma/client";

export default function EditProductBtn({
  product,
  categories,
}: {
  product: Product;
  categories: ItemsCategory[];
}) {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(
    product || null,
  );
  return (
    <>
      <button
        className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
        onClick={() => {
          setEditProduct(product);
          setOpenModal(true);
        }}
      >
        <Pencil size={14} />
        Edit
      </button>
      {openModal && editProduct && (
        <EditProductModel
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          categories={categories}
          action={updateProduct}
          editProduct={editProduct}
        />
      )}
    </>
  );
}


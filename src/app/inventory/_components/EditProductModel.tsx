"use client";

import { deleteImage, uploadImage } from "@/lib/upload";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Barcode,
  Check,
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import React, {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import SimpleDropdown from "../../../components/ui/SimpleDropdown";
import { ItemsCategory, Product } from "@/utils/types";
import toast from "react-hot-toast";
import DialogModal from "@/components/DialogModel";

interface ActionResult {
  status: string;
  message: string;
}

interface EditProductModelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ItemsCategory[];
  editProduct: Product;
  action: (
    prev: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
}

const buildInitialFormState = (product: Product) => ({
  category: product.category || "",
  previewImage: product.image || null,
  uploadedUrl: product.image || null,
  uploadedPublicId: product.public_id || null,
  sku: product.sku || "",
  catId: "",
  isScanning: false,
});

export default function EditProductModel({
  isOpen,
  onClose,
  categories,
  editProduct,
  action,
}: EditProductModelProps) {
  const initialState = buildInitialFormState(editProduct);

  const [state, formAction, isPending] = useActionState(action, null);
  const [category, setCategory] = useState(initialState.category);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialState.previewImage,
  );
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(
    initialState.uploadedUrl,
  );
  const [uploadedPublicId, setUploadedPublicId] = useState<string | null>(
    initialState.uploadedPublicId,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [sku, setSku] = useState(initialState.sku);
  const [catId, setCatId] = useState(initialState.catId);
  const [isScanning, setIsScanning] = useState(initialState.isScanning);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const initialPublicIdRef = useRef(editProduct.public_id || null);

  const options = categories.map((cat) => ({
    id: cat.id,
    label: cat.name,
    value: cat.name,
  }));

  const clearImageState = useCallback(() => {
    setPreviewImage(null);
    setUploadedUrl(null);
    setUploadedPublicId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleRemoveImage = useCallback(async () => {
    if (uploadedPublicId) await deleteImage(uploadedPublicId);
    clearImageState();
  }, [uploadedPublicId, clearImageState]);

  const resetFormState = useCallback((product: Product) => {
    const next = buildInitialFormState(product);
    setSku(next.sku);
    setCategory(next.category);
    setCatId(next.catId);
    setPreviewImage(next.previewImage);
    setUploadedUrl(next.uploadedUrl);
    setUploadedPublicId(next.uploadedPublicId);
    setIsScanning(next.isScanning);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    initialPublicIdRef.current = editProduct.public_id || null;
    if (isOpen) {
      resetFormState(editProduct);
    }
  }, [editProduct, isOpen, resetFormState]);

  useEffect(() => {
    if (state?.status === "success") {
      onClose();
    } else if (state?.status === "error") {
      toast.error(state?.message || "Failed to update product");
    }
  }, [state, onClose]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (!result) {
        toast.error("Failed to upload image");
        return;
      }
      setUploadedUrl(result.url);
      setUploadedPublicId(result.publicId);
    } catch {
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = async () => {
    const hasNewUpload =
      uploadedPublicId && uploadedPublicId !== initialPublicIdRef.current;
    if (hasNewUpload) {
      await deleteImage(uploadedPublicId);
    }
    resetFormState(editProduct);
    onClose();
  };

  return (
    <DialogModal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="Edit Product"
      description="Update the details for this product below."
      max_width="max-w-xl"
    >
      <form ref={formRef} action={formAction} className="space-y-5">
        <input
          type="hidden"
          name="image"
          defaultValue={editProduct.image}
          value={uploadedUrl ?? ""}
        />
        <input
          type="hidden"
          name="public_id"
          defaultValue={editProduct.public_id}
          value={uploadedPublicId ?? ""}
        />
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="catId" value={catId} />
        <input type="hidden" name="oldCat" value={editProduct.category || ""} />
        <input type="hidden" name="id" value={editProduct.id || ""} />

        {state?.status === "error" && (
          <div className="px-4 py-3 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold">
            {state.message}
          </div>
        )}

        {/* Image Selection Section */}
        <div className="mb-8 container-query">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />

          <div className="relative group">
            {previewImage ? (
              <div
                className="w-full h-56 bg-slate-100 dark:bg-primary/5 rounded-md overflow-hidden border border-dashed border-slate-300 dark:border-primary/30 flex items-center justify-center bg-center bg-cover"
                style={{ backgroundImage: `url(${previewImage})` }}
              >
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md">
                    <Loader2 size={32} className="text-white animate-spin" />
                  </div>
                )}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className="bg-white dark:bg-background-dark p-2 rounded-md shadow-lg text-primary hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="bg-white dark:bg-background-dark p-2 rounded-md shadow-lg text-slate-500 hover:text-red-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full h-56 bg-slate-100 dark:bg-primary/5 rounded-md overflow-hidden border border-dashed border-slate-300 dark:border-primary/30 flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-primary/40 hover:text-primary dark:hover:text-primary/60 hover:bg-slate-200 dark:hover:bg-primary/10 transition-all cursor-pointer group"
              >
                <div className="p-4 rounded-full bg-slate-50 dark:bg-primary/5 group-hover:bg-primary/10 transition-colors">
                  <ImagePlus size={32} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Upload Product Image
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-widest">
                    JPG, PNG or WEBP (Max 2MB)
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Input Section: Product Name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="w-full text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
            Product Name
          </label>
          <input
            name="name"
            defaultValue={editProduct.name}
            className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="e.g. Wireless Ergonomic Mouse"
            type="text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="w-full text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <SimpleDropdown
              options={options}
              value={category}
              onChange={setCategory}
              setCatId={setCatId}
              placeholder="Select category"
            />
          </div>

          {/* SKU Code */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="w-full text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              SKU Code
            </label>
            <div className="flex gap-2">
              <input
                name="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="PROD-12345"
                type="text"
              />

              <button
                type="button"
                onClick={() => setIsScanning(!isScanning)}
                className="px-3 py-2 bg-slate-100 dark:bg-primary/10 text-slate-600 dark:text-primary hover:bg-slate-200 dark:hover:bg-primary/20 rounded-md transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title="Scan Barcode/QR Code"
              >
                <Barcode size={20} />
              </button>
            </div>

            {isScanning && (
              <div className="mt-2 w-full h-48 sm:h-64 rounded-md overflow-hidden border-2 border-primary/40 relative bg-black">
                <Scanner
                  onScan={(detectedCodes) => {
                    if (detectedCodes.length > 0) {
                      setSku(detectedCodes[0].rawValue);
                      setIsScanning(false);
                    }
                  }}
                  onError={(error) => {
                    console.error("Scanner Error:", error);
                  }}
                  components={{
                    finder: true,
                  }}
                />

                <button
                  type="button"
                  onClick={() => setIsScanning(false)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-md hover:bg-black/70 z-10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Selling Price */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="w-full text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Selling Price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 dark:text-primary/60">
                $
              </span>
              <input
                name="price"
                defaultValue={editProduct.price}
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md pl-8 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </div>
          </div>

          {/* Cost Price */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="w-full text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Cost Price
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 dark:text-primary/60">
                $
              </span>
              <input
                name="cost_price"
                defaultValue={editProduct.cost_price}
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md pl-8 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </div>
          </div>

          {/* Stock Count */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="w-full text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
              Stock Count
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 dark:text-primary/60">
                <Package size={20} />
              </span>
              <input
                name="stock_qty"
                defaultValue={editProduct.stock_qty}
                className="w-full bg-white dark:bg-primary/5 border border-slate-300 dark:border-primary/20 rounded-md pl-10 pr-4 py-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="0"
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-primary/10">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-5 py-2.5 rounded-md text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-primary/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isPending || isUploading}
            className="px-6 py-2.5 rounded-md text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Check size={20} />
            )}
            {isPending ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </DialogModal>
  );
}

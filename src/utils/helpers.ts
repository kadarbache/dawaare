import { SaleWithCustomerAndItems } from "./types";
import { SaleRow } from "@/app/sales/server";

export function format_sale_row(s: SaleWithCustomerAndItems): SaleRow {
  return {
    id: s.id,
    created_at: s.created_at,
    total_amount: s.total_amount,
    amount_paid: s.amount_paid,
    remaining: s.remaining,
    status: s.status,
    payment_method: s.payment_method,
    repayment_date: s.repayment_date,
    notes: s.notes,
    items_count: s._count.sale_items,
    customer_name: s.customer?.name ?? null,
    customer_id: s.customer?.id ?? null,
    items: s.sale_items.map((si) => ({
      quantity: si.quantity,
      unit_price: si.unit_price,
      total_price: si.total_price,
      product_id: si.product_id,
      name: si.product.name,
      image: si.product.image,
    })),
    seller_name: s.seller?.name ?? null,
    seller_id: s.seller?.id ?? null,
    seller_image: s.seller?.image ?? null,
  };
}

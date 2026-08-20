CREATE INDEX IF NOT EXISTS "sales_customer_id_idx" ON "sales" ("customer_id");
CREATE INDEX IF NOT EXISTS "sales_seller_id_idx" ON "sales" ("seller_id");
CREATE INDEX IF NOT EXISTS "sale_items_sale_id_idx" ON "sale_items" ("sale_id");
CREATE INDEX IF NOT EXISTS "sale_items_product_id_idx" ON "sale_items" ("product_id");
CREATE INDEX IF NOT EXISTS "repayments_sale_id_idx" ON "repayments" ("sale_id");

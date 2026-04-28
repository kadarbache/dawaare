-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "seller_id" TEXT;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "repayment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "repayments" (
    "id" TEXT NOT NULL,
    "sale_id" TEXT NOT NULL,
    "repaid_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repayments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "repayments" ADD CONSTRAINT "repayments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `payment_method` to the `repayments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "repayments" ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL;

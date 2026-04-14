-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SELLER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'SELLER';

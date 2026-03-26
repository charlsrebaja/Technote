/*
  Warnings:

  - You are about to drop the column `customerId` on the `Repair` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Utang` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerName` to the `Repair` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerName` to the `Utang` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Repair" DROP CONSTRAINT "Repair_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Utang" DROP CONSTRAINT "Utang_customerId_fkey";

-- DropIndex
DROP INDEX "Repair_customerId_idx";

-- DropIndex
DROP INDEX "Sale_customerId_idx";

-- DropIndex
DROP INDEX "Utang_customerId_idx";

-- AlterTable
ALTER TABLE "Repair" DROP COLUMN "customerId",
ADD COLUMN     "customerName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "customerId",
ADD COLUMN     "customerName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Utang" DROP COLUMN "customerId",
ADD COLUMN     "customerName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- CreateIndex
CREATE INDEX "Repair_customerName_idx" ON "Repair"("customerName");

-- CreateIndex
CREATE INDEX "Sale_customerName_idx" ON "Sale"("customerName");

-- CreateIndex
CREATE INDEX "Utang_customerName_idx" ON "Utang"("customerName");

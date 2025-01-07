/*
  Warnings:

  - Added the required column `clientId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `Order2` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "Order2" ADD COLUMN     "clientId" TEXT NOT NULL;

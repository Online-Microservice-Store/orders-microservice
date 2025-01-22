/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_invoiceId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "invoiceId",
ADD COLUMN     "invoiceStoreId" TEXT;

-- CreateTable
CREATE TABLE "InvoiceStore" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "storeId" TEXT NOT NULL,
    "invoiceId" TEXT,

    CONSTRAINT "InvoiceStore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_invoiceStoreId_fkey" FOREIGN KEY ("invoiceStoreId") REFERENCES "InvoiceStore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvoiceStore" ADD CONSTRAINT "InvoiceStore_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

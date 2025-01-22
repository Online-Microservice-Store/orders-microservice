/*
  Warnings:

  - Added the required column `discount` to the `InvoiceStore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `InvoiceStore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InvoiceStore" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tax" DOUBLE PRECISION NOT NULL;

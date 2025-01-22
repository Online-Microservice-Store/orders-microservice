/*
  Warnings:

  - You are about to drop the `Order2` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order2" DROP CONSTRAINT "Order2_invoiceId_fkey";

-- DropTable
DROP TABLE "Order2";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "coordinate" TEXT NOT NULL,
    "deliveryTime" TIMESTAMP(3) NOT NULL,
    "orderState" "OrderState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "invoiceId" TEXT,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

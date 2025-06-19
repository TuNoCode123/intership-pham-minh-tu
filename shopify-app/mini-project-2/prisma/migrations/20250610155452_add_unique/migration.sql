/*
  Warnings:

  - A unique constraint covering the columns `[customerId,productId]` on the table `OrderNumber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderNumber_customerId_productId_key" ON "OrderNumber"("customerId", "productId");

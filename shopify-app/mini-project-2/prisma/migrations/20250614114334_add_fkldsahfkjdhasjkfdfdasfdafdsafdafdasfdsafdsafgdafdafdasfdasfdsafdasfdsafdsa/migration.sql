/*
  Warnings:

  - A unique constraint covering the columns `[shop_id,tierName]` on the table `CustomerRanking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CustomerRanking_tierName_key";

-- CreateIndex
CREATE UNIQUE INDEX "CustomerRanking_shop_id_tierName_key" ON "CustomerRanking"("shop_id", "tierName");

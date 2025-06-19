/*
  Warnings:

  - You are about to drop the `Redeemed_Code` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Redeemed_Code";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Redeemed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "codeId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "point_used" INTEGER NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Redeemed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "PointToVoucher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "customerId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Redeemed_codeId_key" ON "Redeemed"("codeId");

-- CreateIndex
CREATE UNIQUE INDEX "Redeemed_customerId_key" ON "Redeemed"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Redeemed_exchangeId_key" ON "Redeemed"("exchangeId");

-- CreateIndex
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Code_customerId_key" ON "Code"("customerId");

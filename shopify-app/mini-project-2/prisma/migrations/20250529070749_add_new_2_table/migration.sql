/*
  Warnings:

  - You are about to drop the `Exchange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Exchange";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MoneyToPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "moneyAmount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "condition" INTEGER DEFAULT 0
);

-- CreateTable
CREATE TABLE "PointToVoucher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointNumber" INTEGER NOT NULL,
    "moneyAmount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Redeemed_Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "point_used" INTEGER NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Redeemed_Code_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_Code_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "PointToVoucher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Redeemed_Code" ("amount", "code", "created_at", "customerId", "exchangeId", "id", "point_used") SELECT "amount", "code", "created_at", "customerId", "exchangeId", "id", "point_used" FROM "Redeemed_Code";
DROP TABLE "Redeemed_Code";
ALTER TABLE "new_Redeemed_Code" RENAME TO "Redeemed_Code";
CREATE UNIQUE INDEX "Redeemed_Code_code_key" ON "Redeemed_Code"("code");
CREATE UNIQUE INDEX "Redeemed_Code_customerId_key" ON "Redeemed_Code"("customerId");
CREATE UNIQUE INDEX "Redeemed_Code_exchangeId_key" ON "Redeemed_Code"("exchangeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

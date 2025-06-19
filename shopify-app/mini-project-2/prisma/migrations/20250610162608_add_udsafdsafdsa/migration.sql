-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "purchaseNumber" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "OrderNumber_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderNumber" ("customerId", "id", "productId", "purchaseNumber") SELECT "customerId", "id", "productId", "purchaseNumber" FROM "OrderNumber";
DROP TABLE "OrderNumber";
ALTER TABLE "new_OrderNumber" RENAME TO "OrderNumber";
CREATE UNIQUE INDEX "OrderNumber_customerId_productId_key" ON "OrderNumber"("customerId", "productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rankingId" INTEGER NOT NULL DEFAULT 1,
    "total_spent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Customers_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Customers_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "CustomerRanking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customers" ("created_at", "customerId", "email", "firstName", "id", "lastName", "rankingId", "shop_id", "total_spent") SELECT "created_at", "customerId", "email", "firstName", "id", "lastName", "rankingId", "shop_id", "total_spent" FROM "Customers";
DROP TABLE "Customers";
ALTER TABLE "new_Customers" RENAME TO "Customers";
CREATE UNIQUE INDEX "Customers_customerId_key" ON "Customers"("customerId");
CREATE UNIQUE INDEX "Customers_shop_id_email_key" ON "Customers"("shop_id", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

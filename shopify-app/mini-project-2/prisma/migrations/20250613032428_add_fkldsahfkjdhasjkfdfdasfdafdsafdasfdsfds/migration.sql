-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rankingId" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Customers_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "CustomerRanking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customers" ("created_at", "customerId", "email", "firstName", "id", "lastName") SELECT "created_at", "customerId", "email", "firstName", "id", "lastName" FROM "Customers";
DROP TABLE "Customers";
ALTER TABLE "new_Customers" RENAME TO "Customers";
CREATE UNIQUE INDEX "Customers_customerId_key" ON "Customers"("customerId");
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - Added the required column `customerId` to the `Point_Logs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Point_Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "Point_Logs_type_fkey" FOREIGN KEY ("type") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Point_Logs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point_Logs" ("amount", "created_at", "id", "reason", "type") SELECT "amount", "created_at", "id", "reason", "type" FROM "Point_Logs";
DROP TABLE "Point_Logs";
ALTER TABLE "new_Point_Logs" RENAME TO "Point_Logs";
CREATE UNIQUE INDEX "Point_Logs_type_key" ON "Point_Logs"("type");
CREATE UNIQUE INDEX "Point_Logs_customerId_key" ON "Point_Logs"("customerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

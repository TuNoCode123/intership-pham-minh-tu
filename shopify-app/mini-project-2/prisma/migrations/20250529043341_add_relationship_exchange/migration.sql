/*
  Warnings:

  - Added the required column `type` to the `Exchange` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exchange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointAmount" INTEGER NOT NULL,
    "moneyAmount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Exchange" ("created_at", "id", "moneyAmount", "pointAmount") SELECT "created_at", "id", "moneyAmount", "pointAmount" FROM "Exchange";
DROP TABLE "Exchange";
ALTER TABLE "new_Exchange" RENAME TO "Exchange";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

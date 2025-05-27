/*
  Warnings:

  - You are about to drop the column `shopId` on the `LogDeleteProduct` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogDeleteProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "shopName" TEXT NOT NULL
);
INSERT INTO "new_LogDeleteProduct" ("id", "productId", "shopName") SELECT "id", "productId", "shopName" FROM "LogDeleteProduct";
DROP TABLE "LogDeleteProduct";
ALTER TABLE "new_LogDeleteProduct" RENAME TO "LogDeleteProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

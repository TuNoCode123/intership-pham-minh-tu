/*
  Warnings:

  - Added the required column `shopId` to the `LogDeleteProduct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopName` to the `LogDeleteProduct` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogDeleteProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "shopName" TEXT NOT NULL
);
INSERT INTO "new_LogDeleteProduct" ("id", "productId") SELECT "id", "productId" FROM "LogDeleteProduct";
DROP TABLE "LogDeleteProduct";
ALTER TABLE "new_LogDeleteProduct" RENAME TO "LogDeleteProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - You are about to alter the column `productId` on the `LogDeleteProduct` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LogDeleteProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "shopName" TEXT NOT NULL
);
INSERT INTO "new_LogDeleteProduct" ("id", "productId", "shopName") SELECT "id", "productId", "shopName" FROM "LogDeleteProduct";
DROP TABLE "LogDeleteProduct";
ALTER TABLE "new_LogDeleteProduct" RENAME TO "LogDeleteProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

/*
  Warnings:

  - The primary key for the `Customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `customerId` on the `Point_Logs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `customerId` on the `Points` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `customerId` on the `Redeemed_Code` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `id` to the `Customers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Customers" ("created_at", "customerId", "email", "firstName", "lastName") SELECT "created_at", "customerId", "email", "firstName", "lastName" FROM "Customers";
DROP TABLE "Customers";
ALTER TABLE "new_Customers" RENAME TO "Customers";
CREATE UNIQUE INDEX "Customers_customerId_key" ON "Customers"("customerId");
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");
CREATE TABLE "new_Point_Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "customerId" INTEGER NOT NULL,
    CONSTRAINT "Point_Logs_type_fkey" FOREIGN KEY ("type") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Point_Logs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point_Logs" ("amount", "created_at", "customerId", "id", "reason", "type") SELECT "amount", "created_at", "customerId", "id", "reason", "type" FROM "Point_Logs";
DROP TABLE "Point_Logs";
ALTER TABLE "new_Point_Logs" RENAME TO "Point_Logs";
CREATE UNIQUE INDEX "Point_Logs_type_key" ON "Point_Logs"("type");
CREATE UNIQUE INDEX "Point_Logs_customerId_key" ON "Point_Logs"("customerId");
CREATE TABLE "new_Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Points" ("created_at", "customerId", "id", "total_points", "updated_at") SELECT "created_at", "customerId", "id", "total_points", "updated_at" FROM "Points";
DROP TABLE "Points";
ALTER TABLE "new_Points" RENAME TO "Points";
CREATE UNIQUE INDEX "Points_customerId_key" ON "Points"("customerId");
CREATE TABLE "new_Redeemed_Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "point_used" INTEGER NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Redeemed_Code_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
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

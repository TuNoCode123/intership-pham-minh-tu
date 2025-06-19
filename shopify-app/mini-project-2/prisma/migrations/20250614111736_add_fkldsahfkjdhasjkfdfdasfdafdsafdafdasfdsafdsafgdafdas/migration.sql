-- CreateTable
CREATE TABLE "shops" (
    "shopify_shop_id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "accessToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'installed'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CustomerRanking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tierName" TEXT NOT NULL,
    "pointRate" REAL NOT NULL,
    "min_spent" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT,
    CONSTRAINT "CustomerRanking_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CustomerRanking" ("created_at", "id", "min_spent", "pointRate", "tierName") SELECT "created_at", "id", "min_spent", "pointRate", "tierName" FROM "CustomerRanking";
DROP TABLE "CustomerRanking";
ALTER TABLE "new_CustomerRanking" RENAME TO "CustomerRanking";
CREATE UNIQUE INDEX "CustomerRanking_tierName_key" ON "CustomerRanking"("tierName");
CREATE TABLE "new_Customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT,
    "customerId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rankingId" INTEGER NOT NULL DEFAULT 1,
    "total_spent" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Customers_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Customers_rankingId_fkey" FOREIGN KEY ("rankingId") REFERENCES "CustomerRanking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Customers" ("created_at", "customerId", "email", "firstName", "id", "lastName", "rankingId", "total_spent") SELECT "created_at", "customerId", "email", "firstName", "id", "lastName", "rankingId", "total_spent" FROM "Customers";
DROP TABLE "Customers";
ALTER TABLE "new_Customers" RENAME TO "Customers";
CREATE UNIQUE INDEX "Customers_customerId_key" ON "Customers"("customerId");
CREATE UNIQUE INDEX "Customers_shop_id_email_key" ON "Customers"("shop_id", "email");
CREATE TABLE "new_OrderNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT,
    "productId" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "purchaseNumber" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "OrderNumber_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrderNumber_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderNumber" ("customerId", "id", "productId", "purchaseNumber") SELECT "customerId", "id", "productId", "purchaseNumber" FROM "OrderNumber";
DROP TABLE "OrderNumber";
ALTER TABLE "new_OrderNumber" RENAME TO "OrderNumber";
CREATE UNIQUE INDEX "OrderNumber_customerId_productId_key" ON "OrderNumber"("customerId", "productId");
CREATE TABLE "new_PointToVoucher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointNumber" INTEGER NOT NULL,
    "moneyAmount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shop_id" TEXT,
    CONSTRAINT "PointToVoucher_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_PointToVoucher" ("created_at", "id", "moneyAmount", "pointNumber") SELECT "created_at", "id", "moneyAmount", "pointNumber" FROM "PointToVoucher";
DROP TABLE "PointToVoucher";
ALTER TABLE "new_PointToVoucher" RENAME TO "PointToVoucher";
CREATE TABLE "new_Point_Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "customerId" INTEGER NOT NULL,
    "shop_id" TEXT,
    CONSTRAINT "Point_Logs_type_fkey" FOREIGN KEY ("type") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Point_Logs_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Point_Logs_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Point_Logs" ("amount", "created_at", "customerId", "id", "reason", "type") SELECT "amount", "created_at", "customerId", "id", "reason", "type" FROM "Point_Logs";
DROP TABLE "Point_Logs";
ALTER TABLE "new_Point_Logs" RENAME TO "Point_Logs";
CREATE TABLE "new_Redeemed" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT,
    "codeId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "point_used" INTEGER NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Redeemed_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "PointToVoucher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "Code" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Redeemed" ("amount", "codeId", "created_at", "customerId", "exchangeId", "id", "point_used") SELECT "amount", "codeId", "created_at", "customerId", "exchangeId", "id", "point_used" FROM "Redeemed";
DROP TABLE "Redeemed";
ALTER TABLE "new_Redeemed" RENAME TO "Redeemed";
CREATE UNIQUE INDEX "Redeemed_codeId_key" ON "Redeemed"("codeId");
CREATE TABLE "new_ReviewAward" (
    "shop_id" TEXT,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startNumber" INTEGER NOT NULL,
    "point" INTEGER NOT NULL,
    CONSTRAINT "ReviewAward_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ReviewAward" ("id", "point", "startNumber") SELECT "id", "point", "startNumber" FROM "ReviewAward";
DROP TABLE "ReviewAward";
ALTER TABLE "new_ReviewAward" RENAME TO "ReviewAward";
CREATE TABLE "new_Reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT,
    "product_id" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "award" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Reviews_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops" ("shopify_shop_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews" ("approved", "award", "content", "created_at", "customer_id", "id", "product_id", "rating") SELECT "approved", "award", "content", "created_at", "customer_id", "id", "product_id", "rating" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
CREATE INDEX "Reviews_product_id_idx" ON "Reviews"("product_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "shops_shopify_shop_id_key" ON "shops"("shopify_shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "shops_domain_key" ON "shops"("domain");

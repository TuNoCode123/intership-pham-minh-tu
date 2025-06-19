-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "award" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews" ("approved", "award", "content", "created_at", "customer_id", "id", "product_id", "rating") SELECT "approved", "award", "content", "created_at", "customer_id", "id", "product_id", "rating" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
CREATE INDEX "Reviews_product_id_idx" ON "Reviews"("product_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

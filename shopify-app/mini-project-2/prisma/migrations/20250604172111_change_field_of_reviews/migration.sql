-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "award" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Reviews" ("approved", "content", "created_at", "customer_id", "id", "product_id", "rating") SELECT "approved", "content", "created_at", "customer_id", "id", "product_id", "rating" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

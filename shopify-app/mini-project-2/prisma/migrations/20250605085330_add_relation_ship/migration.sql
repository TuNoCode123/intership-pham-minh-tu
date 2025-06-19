/*
  Warnings:

  - Added the required column `imageId` to the `Reviews_Image` table without a default value. This is not possible if the table is not empty.

*/
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
    "award" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews" ("approved", "award", "content", "created_at", "customer_id", "id", "product_id", "rating") SELECT "approved", "award", "content", "created_at", "customer_id", "id", "product_id", "rating" FROM "Reviews";
DROP TABLE "Reviews";
ALTER TABLE "new_Reviews" RENAME TO "Reviews";
CREATE TABLE "new_Reviews_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewsId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    CONSTRAINT "Reviews_Image_reviewsId_fkey" FOREIGN KEY ("reviewsId") REFERENCES "Reviews" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reviews_Image" ("id", "image", "reviewsId") SELECT "id", "image", "reviewsId" FROM "Reviews_Image";
DROP TABLE "Reviews_Image";
ALTER TABLE "new_Reviews_Image" RENAME TO "Reviews_Image";
CREATE UNIQUE INDEX "Reviews_Image_imageId_key" ON "Reviews_Image"("imageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

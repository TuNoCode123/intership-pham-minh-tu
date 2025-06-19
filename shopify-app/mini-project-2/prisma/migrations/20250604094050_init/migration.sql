-- CreateTable
CREATE TABLE "Reviews" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Reviews_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reviewsId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    CONSTRAINT "Reviews_Image_reviewsId_fkey" FOREIGN KEY ("reviewsId") REFERENCES "Reviews" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

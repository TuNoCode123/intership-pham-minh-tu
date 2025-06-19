-- CreateTable
CREATE TABLE "OrderNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "purchaseNumber" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "OrderNumber_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

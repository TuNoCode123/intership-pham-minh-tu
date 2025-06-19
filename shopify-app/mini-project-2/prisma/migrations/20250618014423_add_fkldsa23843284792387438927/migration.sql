-- CreateTable
CREATE TABLE "sync_customers_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    CONSTRAINT "sync_customers_logs_state_fkey" FOREIGN KEY ("state") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

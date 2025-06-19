-- CreateTable
CREATE TABLE "Customers" (
    "customerId" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Points" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" TEXT NOT NULL,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Points_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AllCodes" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Point_Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Point_Logs_type_fkey" FOREIGN KEY ("type") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Redeemed_Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "point_used" INTEGER NOT NULL,
    "exchangeId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Redeemed_Code_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("customerId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Redeemed_Code_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointAmount" INTEGER NOT NULL,
    "moneyAmount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Customers_email_key" ON "Customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Points_customerId_key" ON "Points"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "AllCodes_value_key" ON "AllCodes"("value");

-- CreateIndex
CREATE UNIQUE INDEX "Point_Logs_type_key" ON "Point_Logs"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Redeemed_Code_code_key" ON "Redeemed_Code"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Redeemed_Code_customerId_key" ON "Redeemed_Code"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Redeemed_Code_exchangeId_key" ON "Redeemed_Code"("exchangeId");

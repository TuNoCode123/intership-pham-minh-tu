-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Code" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "customerId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Code" ("code", "created_at", "customerId", "id", "isUsed") SELECT "code", "created_at", "customerId", "id", "isUsed" FROM "Code";
DROP TABLE "Code";
ALTER TABLE "new_Code" RENAME TO "Code";
CREATE UNIQUE INDEX "Code_code_key" ON "Code"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

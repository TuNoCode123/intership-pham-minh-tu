-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exchange" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointAmount" INTEGER NOT NULL,
    "moneyAmount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "condition" INTEGER DEFAULT 0,
    CONSTRAINT "Exchange_type_fkey" FOREIGN KEY ("type") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exchange" ("condition", "created_at", "id", "moneyAmount", "pointAmount", "type") SELECT "condition", "created_at", "id", "moneyAmount", "pointAmount", "type" FROM "Exchange";
DROP TABLE "Exchange";
ALTER TABLE "new_Exchange" RENAME TO "Exchange";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

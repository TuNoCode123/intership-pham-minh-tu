-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Point_Logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Point_Logs_type_fkey" FOREIGN KEY ("type") REFERENCES "AllCodes" ("key") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Point_Logs" ("created_at", "id", "reason", "type") SELECT "created_at", "id", "reason", "type" FROM "Point_Logs";
DROP TABLE "Point_Logs";
ALTER TABLE "new_Point_Logs" RENAME TO "Point_Logs";
CREATE UNIQUE INDEX "Point_Logs_type_key" ON "Point_Logs"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

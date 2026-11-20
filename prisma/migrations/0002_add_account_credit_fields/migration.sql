-- AlterTable
ALTER TABLE "accounts" ADD COLUMN "bank_id" TEXT;
ALTER TABLE "accounts" ADD COLUMN "credit_limit" DECIMAL(15,2) DEFAULT 0.00;
ALTER TABLE "accounts" ADD COLUMN "due_day" INTEGER DEFAULT 15;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "accounts_bank_id_idx" ON "accounts"("bank_id");

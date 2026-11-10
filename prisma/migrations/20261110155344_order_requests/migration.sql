-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "clientIp" TEXT,
ADD COLUMN     "requestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_requestId_key" ON "orders"("requestId");

-- CreateIndex
CREATE INDEX "orders_clientIp_placedAt_idx" ON "orders"("clientIp", "placedAt");

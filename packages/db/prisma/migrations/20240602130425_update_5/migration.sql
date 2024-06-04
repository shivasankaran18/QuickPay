/*
  Warnings:

  - You are about to drop the column `offRamped` on the `merchant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "merchant" DROP COLUMN "offRamped";

-- CreateTable
CREATE TABLE "OffRamp" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "receiver" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "merchname" TEXT NOT NULL,

    CONSTRAINT "OffRamp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OffRamp" ADD CONSTRAINT "OffRamp_merchname_fkey" FOREIGN KEY ("merchname") REFERENCES "merchant"("name") ON DELETE CASCADE ON UPDATE CASCADE;

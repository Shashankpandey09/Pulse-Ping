/*
  Warnings:

  - You are about to drop the column `lastStatus` on the `Monitor` table. All the data in the column will be lost.
  - Added the required column `interval` to the `Monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Monitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Monitor" DROP COLUMN "lastStatus",
ADD COLUMN     "interval" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "monitorId" INTEGER NOT NULL,
    "lastStatus" TEXT NOT NULL,
    "lastPing" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responseTime" INTEGER,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

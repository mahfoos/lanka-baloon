-- CreateEnum
CREATE TYPE "CashbookKind" AS ENUM ('OPENING', 'INCOME', 'EXPENSE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Currency" ADD VALUE 'EUR';
ALTER TYPE "Currency" ADD VALUE 'TRY';

-- AlterEnum
ALTER TYPE "BookingSource" ADD VALUE 'GUIDE';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "actualPax" INTEGER,
ADD COLUMN     "advancePaid" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "driverDropoff" TEXT,
ADD COLUMN     "driverPickup" TEXT,
ADD COLUMN     "flightTimeCash" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "guideName" TEXT,
ADD COLUMN     "pickupTime" TEXT;

-- CreateTable
CREATE TABLE "CrewRosterEntry" (
    "id" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "worked" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewRosterEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashbookEntry" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "kind" "CashbookKind" NOT NULL,
    "description" TEXT NOT NULL,
    "people" INTEGER,
    "currency" "Currency" NOT NULL DEFAULT 'LKR',
    "amount" DECIMAL(12,2) NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CashbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CrewRosterEntry_date_idx" ON "CrewRosterEntry"("date");

-- CreateIndex
CREATE UNIQUE INDEX "CrewRosterEntry_crewId_date_key" ON "CrewRosterEntry"("crewId", "date");

-- CreateIndex
CREATE INDEX "CashbookEntry_date_idx" ON "CashbookEntry"("date");

-- CreateIndex
CREATE INDEX "CashbookEntry_kind_idx" ON "CashbookEntry"("kind");

-- AddForeignKey
ALTER TABLE "CrewRosterEntry" ADD CONSTRAINT "CrewRosterEntry_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "CrewMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;


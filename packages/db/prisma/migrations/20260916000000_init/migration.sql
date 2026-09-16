-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('LKR', 'USD');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('SHARED_FLIGHT', 'PRIVATE_FLIGHT', 'MARRIAGE_PROPOSAL', 'BIRTHDAY_CELEBRATION', 'WEDDING_ANNIVERSARY', 'GIFT_VOUCHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('ENQUIRY', 'PENDING_PAYMENT', 'CONFIRMED', 'FLOWN', 'CANCELLED', 'WEATHER_HOLD', 'REFUNDED');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('WEBSITE', 'PHONE', 'EMAIL', 'WALK_IN', 'TRAVEL_AGENT', 'HOTEL_CONCIERGE');

-- CreateEnum
CREATE TYPE "FlightStatus" AS ENUM ('SCHEDULED', 'BOARDING', 'IN_FLIGHT', 'COMPLETED', 'CANCELLED_WEATHER', 'POSTPONED');

-- CreateEnum
CREATE TYPE "BalloonManufacturer" AS ENUM ('ULTRAMAGIC', 'LINDSTRAND');

-- CreateEnum
CREATE TYPE "BalloonStatus" AS ENUM ('AIRWORTHY', 'IN_MAINTENANCE', 'GROUNDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "CrewRole" AS ENUM ('COMMERCIAL_PILOT', 'CO_PILOT', 'GROUND_CREW_LEAD', 'GROUND_CREW', 'CHASE_DRIVER', 'RETRIEVE_CREW');

-- CreateEnum
CREATE TYPE "CrewStatus" AS ENUM ('ACTIVE', 'ON_LEAVE', 'OFF_SEASON', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('TOURIST', 'LOCAL', 'CORPORATE', 'TRAVEL_AGENT');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('PASSENGER_VAN', 'CHASE_4X4', 'RECOVERY_TRUCK', 'CAR');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'ON_TRIP', 'SERVICING', 'OFF_ROAD');

-- CreateEnum
CREATE TYPE "VoucherStatus" AS ENUM ('ACTIVE', 'REDEEMED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BANK_TRANSFER', 'CASH', 'ONLINE_GATEWAY', 'AGENT_CREDIT');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "MaintenanceAssetType" AS ENUM ('BALLOON', 'VEHICLE');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('ANNUAL_INSPECTION', 'ENVELOPE_REPAIR', 'BURNER_SERVICE', 'BASKET_SERVICE', 'VEHICLE_SERVICE', 'FUEL_SYSTEM_CHECK', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "ComplianceKind" AS ENUM ('AIR_OPERATOR_CERTIFICATE', 'AIRCRAFT_REGISTRATION', 'AIRWORTHINESS_CERTIFICATE', 'PILOT_LICENCE', 'VALIDATION_CERTIFICATE', 'INSURANCE_POLICY', 'VEHICLE_REVENUE_LICENCE');

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "ref" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "packageType" "PackageType" NOT NULL DEFAULT 'SHARED_FLIGHT',
    "flightDate" DATE NOT NULL,
    "flightId" TEXT,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'LKR',
    "pricePerHead" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" "BookingStatus" NOT NULL DEFAULT 'ENQUIRY',
    "source" "BookingSource" NOT NULL DEFAULT 'WEBSITE',
    "giftVoucher" BOOLEAN NOT NULL DEFAULT false,
    "birthdayCake" BOOLEAN NOT NULL DEFAULT false,
    "specialOccasion" TEXT,
    "hotel" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "handled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "launchTime" TEXT NOT NULL,
    "launchSite" TEXT NOT NULL,
    "balloonId" TEXT,
    "pilotId" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "status" "FlightStatus" NOT NULL DEFAULT 'SCHEDULED',
    "windSpeedKts" INTEGER,
    "windDirection" TEXT,
    "durationMins" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balloon" (
    "id" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" "BalloonManufacturer" NOT NULL,
    "model" TEXT NOT NULL,
    "envelopeVolumeM3" INTEGER NOT NULL DEFAULT 0,
    "basketCapacity" INTEGER NOT NULL DEFAULT 0,
    "yearBuilt" INTEGER,
    "totalFlightHours" DECIMAL(10,1) NOT NULL DEFAULT 0,
    "status" "BalloonStatus" NOT NULL DEFAULT 'AIRWORTHY',
    "airworthinessExpiry" DATE,
    "lastInspection" DATE,
    "hasSafetyBelts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Balloon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewMember" (
    "id" TEXT NOT NULL,
    "empId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "CrewRole" NOT NULL,
    "status" "CrewStatus" NOT NULL DEFAULT 'ACTIVE',
    "licenseNo" TEXT,
    "licenseExpiry" DATE,
    "validationExpiry" DATE,
    "yearsExperience" INTEGER NOT NULL DEFAULT 0,
    "totalFlightHours" DECIMAL(10,1),
    "phone" TEXT,
    "email" TEXT,
    "joinDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrewMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CustomerType" NOT NULL DEFAULT 'TOURIST',
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "makeModel" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 0,
    "hasAirConditioning" BOOLEAN NOT NULL DEFAULT true,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "revenueLicenseExpiry" DATE,
    "insuranceExpiry" DATE,
    "lastServiceOdo" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voucher" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "packageType" "PackageType" NOT NULL DEFAULT 'GIFT_VOUCHER',
    "purchaserName" TEXT NOT NULL,
    "recipientName" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'LKR',
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "issuedDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiryDate" DATE NOT NULL,
    "status" "VoucherStatus" NOT NULL DEFAULT 'ACTIVE',
    "redeemedBookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'LKR',
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "reference" TEXT,
    "description" TEXT,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "assetType" "MaintenanceAssetType" NOT NULL,
    "balloonId" TEXT,
    "vehicleId" TEXT,
    "type" "MaintenanceType" NOT NULL,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDate" DATE NOT NULL,
    "completedDate" DATE,
    "currency" "Currency" NOT NULL DEFAULT 'LKR',
    "cost" DECIMAL(12,2),
    "engineer" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceRecord" (
    "id" TEXT NOT NULL,
    "kind" "ComplianceKind" NOT NULL,
    "reference" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "relatesTo" TEXT NOT NULL,
    "issuedDate" DATE,
    "expiryDate" DATE NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplianceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "country" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'TripAdvisor',
    "date" DATE NOT NULL,
    "flightRef" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_ref_key" ON "Booking"("ref");

-- CreateIndex
CREATE INDEX "Booking_flightDate_idx" ON "Booking"("flightDate");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_createdAt_idx" ON "Booking"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_code_key" ON "Flight"("code");

-- CreateIndex
CREATE INDEX "Flight_date_idx" ON "Flight"("date");

-- CreateIndex
CREATE INDEX "Flight_status_idx" ON "Flight"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Balloon_registration_key" ON "Balloon"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "CrewMember_empId_key" ON "CrewMember"("empId");

-- CreateIndex
CREATE INDEX "Customer_email_idx" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registration_key" ON "Vehicle"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_code_key" ON "Voucher"("code");

-- CreateIndex
CREATE INDEX "Voucher_status_idx" ON "Voucher"("status");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");

-- CreateIndex
CREATE INDEX "MaintenanceLog_scheduledDate_idx" ON "MaintenanceLog"("scheduledDate");

-- CreateIndex
CREATE INDEX "MaintenanceLog_status_idx" ON "MaintenanceLog"("status");

-- CreateIndex
CREATE INDEX "ComplianceRecord_expiryDate_idx" ON "ComplianceRecord"("expiryDate");

-- CreateIndex
CREATE INDEX "Review_date_idx" ON "Review"("date");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_balloonId_fkey" FOREIGN KEY ("balloonId") REFERENCES "Balloon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_pilotId_fkey" FOREIGN KEY ("pilotId") REFERENCES "CrewMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_redeemedBookingId_fkey" FOREIGN KEY ("redeemedBookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_balloonId_fkey" FOREIGN KEY ("balloonId") REFERENCES "Balloon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Booking channels become the office's own vocabulary, plus the fields that a
-- WhatsApp booking message actually carries.
--
-- Written by hand rather than generated. The generated version drops and
-- recreates BookingSource, which would take every existing booking's channel
-- with it. Swapping the type and mapping the old values across keeps them.

-- CreateEnum: the new list, alongside the old one for the moment.
ALTER TYPE "BookingSource" RENAME TO "BookingSource_old";

CREATE TYPE "BookingSource" AS ENUM (
  'AGENT',
  'GUIDE',
  'ONLINE',
  'HOTEL',
  'SIGIRIYA_POINT',
  'LAST_MINUTE',
  'DIRECT',
  'PHONE'
);

-- The default has to go before the column type can change, and comes back after.
ALTER TABLE "Booking" ALTER COLUMN "source" DROP DEFAULT;

-- Map the old vocabulary onto the new one. EMAIL has no successor; those
-- bookings were taken by someone in the office, so they become DIRECT.
ALTER TABLE "Booking"
  ALTER COLUMN "source" TYPE "BookingSource"
  USING (
    CASE "source"::text
      WHEN 'WEBSITE'         THEN 'ONLINE'
      WHEN 'TRAVEL_AGENT'    THEN 'AGENT'
      WHEN 'HOTEL_CONCIERGE' THEN 'HOTEL'
      WHEN 'WALK_IN'         THEN 'DIRECT'
      WHEN 'EMAIL'           THEN 'DIRECT'
      WHEN 'GUIDE'           THEN 'GUIDE'
      WHEN 'PHONE'           THEN 'PHONE'
      ELSE 'DIRECT'
    END::"BookingSource"
  );

ALTER TABLE "Booking" ALTER COLUMN "source" SET DEFAULT 'ONLINE';

DROP TYPE "BookingSource_old";

-- AlterTable: what the booking messages carry that the schema did not.
ALTER TABLE "Booking"
  ADD COLUMN "passengerNames" TEXT,
  ADD COLUMN "vatRegistered" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "exchangeRate" DECIMAL(12,4);

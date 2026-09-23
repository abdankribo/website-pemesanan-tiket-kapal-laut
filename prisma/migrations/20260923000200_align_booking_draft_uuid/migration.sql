-- Align the Prisma UUID default for booking drafts with the schema.
ALTER TABLE "booking_drafts"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

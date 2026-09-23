-- Add server-side booking drafts and reset-token expiry.
ALTER TABLE "password_reset_tokens"
ADD COLUMN IF NOT EXISTS "expires_at" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "booking_drafts" (
  "id" UUID NOT NULL,
  "user_id" INTEGER NOT NULL,
  "payload" JSONB NOT NULL,
  "payment_method" TEXT,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "booking_drafts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "booking_drafts_user_id_expires_at_idx"
ON "booking_drafts"("user_id", "expires_at");

DO $$ BEGIN
  ALTER TABLE "booking_drafts"
    ADD CONSTRAINT "booking_drafts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

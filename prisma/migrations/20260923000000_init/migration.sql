-- Initial PostgreSQL schema for the ticket booking application.
CREATE TABLE "users" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "google_id" TEXT,
  "email_verified_at" TIMESTAMP(3),
  "password" TEXT NOT NULL,
  "remember_token" TEXT,
  "phone" TEXT,
  "nik" TEXT,
  "birth_date" DATE,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

CREATE TABLE "password_reset_tokens" (
  "email" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "created_at" TIMESTAMP(3),
  CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("email")
);

CREATE TABLE "tickets" (
  "id" SERIAL NOT NULL,
  "user_id" INTEGER,
  "ticket_id" UUID NOT NULL,
  "passenger_name" TEXT NOT NULL,
  "passenger_nik" TEXT NOT NULL,
  "passenger_phone" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "departure_date" DATE NOT NULL,
  "vehicle" TEXT,
  "vehicle_plate" TEXT,
  "status" TEXT NOT NULL DEFAULT 'booked',
  "scanned_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tickets_ticket_id_key" ON "tickets"("ticket_id");
CREATE INDEX "tickets_user_id_idx" ON "tickets"("user_id");

ALTER TABLE "tickets"
  ADD CONSTRAINT "tickets_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

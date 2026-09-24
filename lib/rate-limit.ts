import "server-only";
import { createHash } from "node:crypto";
import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

function hashKey(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function checkRateLimit(request: Request, scope: string, identity: string, limit: number, windowMs: number) {
  const key = hashKey(`${scope}:${clientIp(request)}:${identity.toLowerCase()}`);
  const resetAt = new Date(Date.now() + windowMs);
  const rows = await prisma.$queryRaw<{ count: number; reset_at: Date }[]>(Prisma.sql`
    INSERT INTO "rate_limit_buckets" ("key", "count", "reset_at")
    VALUES (${key}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE
    SET "count" = CASE WHEN "rate_limit_buckets"."reset_at" <= NOW() THEN 1 ELSE "rate_limit_buckets"."count" + 1 END,
        "reset_at" = CASE WHEN "rate_limit_buckets"."reset_at" <= NOW() THEN EXCLUDED."reset_at" ELSE "rate_limit_buckets"."reset_at" END
    RETURNING "count", "reset_at"
  `);

  const currentCount = rows[0]?.count ?? 0;
  if (currentCount === 1) {
    await prisma.$executeRaw`DELETE FROM "rate_limit_buckets"
      WHERE "reset_at" < NOW()
        AND "key" IN (
          SELECT "key"
          FROM "rate_limit_buckets"
          WHERE "reset_at" < NOW()
          ORDER BY "reset_at"
          LIMIT 100
        )`;
  }

  return currentCount <= limit;
}

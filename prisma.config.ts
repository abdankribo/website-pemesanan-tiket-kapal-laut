import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // prisma generate does not connect to the database. Keep the URL
    // optional here so CI/CD installs can generate the client before runtime
    // database credentials are injected.
    //
    // Neon exposes the direct/unpooled connection as DATABASE_URL_UNPOOLED.
    // Prefer an explicitly configured DIRECT_URL when present, then fall back
    // to Neon's unpooled URL for migrations, and finally the runtime URL.
    url:
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DATABASE_URL ||
      "",
  },
});

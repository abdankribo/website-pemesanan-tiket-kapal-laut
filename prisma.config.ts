import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Neon provides DATABASE_URL_UNPOOLED as the direct connection for
    // migrations. Prefer it over a legacy DIRECT_URL so an old placeholder
    // cannot prevent production migrations from reaching the active Neon DB.
    url:
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DIRECT_URL ||
      process.env.DATABASE_URL ||
      "",
  },
});

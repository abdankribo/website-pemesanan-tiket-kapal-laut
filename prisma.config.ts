import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // `prisma generate` does not connect to the database. Keep the URL
    // optional here so CI/CD installs can generate the client before runtime
    // database credentials are injected.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});

import { execFileSync } from "node:child_process";

function run(command, args) {
  execFileSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });
}

const isVercelProduction =
  process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

if (isVercelProduction) {
  console.log("Running Prisma production migrations...");
  run("npx", ["prisma", "migrate", "deploy"]);
}

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build"]);

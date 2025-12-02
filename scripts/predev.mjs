import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const lockFile = join(process.cwd(), ".next", "dev", "lock");

if (existsSync(lockFile)) {
  rmSync(lockFile);
  console.info(`[predev] Removed stale Next.js lock: ${lockFile}`);
}

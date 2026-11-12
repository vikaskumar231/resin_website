import fs from "fs";
import path from "path";

/**
 * Performs an atomic file write to prevent JSON corruption during
 * concurrent requests, sudden process restarts, or partial disk flushes.
 * 
 * Writes payload to a uniquely named sibling temporary file and uses
 * atomic filesystem rename (`fs.renameSync`).
 */
export function atomicWriteJsonSync(targetPath: string, data: any): void {
  try {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const tmpPath = `${targetPath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
    const content = JSON.stringify(data, null, 2);

    fs.writeFileSync(tmpPath, content, "utf-8");
    fs.renameSync(tmpPath, targetPath);
  } catch (err: any) {
    // Handle serverless read-only environments (Vercel, AWS Lambda) where process.cwd() is read-only
    if (err.code === "EROFS" || err.message?.includes("read-only")) {
      console.warn(
        `[Storage Warning] Serverless read-only filesystem detected (${err.code}). Persistent write to ${targetPath} skipped. In production, configure DATABASE_URL (PostgreSQL/Supabase/Neon) for multi-instance persistence.`
      );
      return;
    }
    throw err;
  }
}


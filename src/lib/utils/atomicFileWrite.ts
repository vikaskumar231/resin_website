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
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tmpPath = `${targetPath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 8)}`;
  const content = JSON.stringify(data, null, 2);

  try {
    fs.writeFileSync(tmpPath, content, "utf-8");
    fs.renameSync(tmpPath, targetPath);
  } catch (err) {
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch {
        // Ignore temporary file cleanup errors
      }
    }
    throw err;
  }
}


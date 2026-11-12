import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { verifyAdminSession } from "@/lib/auth/adminGuard";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB maximum
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

/**
 * Validates image buffer magic bytes (file signature)
 * Protects against disguised executables, HTML Stored XSS, and script injection.
 */
function validateImageMagicBytes(buffer: Buffer): { isValid: boolean; normalizedExt: string } {
  if (buffer.length < 12) {
    return { isValid: false, normalizedExt: "" };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, normalizedExt: "jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { isValid: true, normalizedExt: "png" };
  }

  // WebP: 'RIFF' .... 'WEBP'
  const isRiff = buffer.subarray(0, 4).toString("ascii") === "RIFF";
  const isWebp = buffer.subarray(8, 12).toString("ascii") === "WEBP";
  if (isRiff && isWebp) {
    return { isValid: true, normalizedExt: "webp" };
  }

  return { isValid: false, normalizedExt: "" };
}

// POST /api/admin/upload - Hardened Secure Image Upload (Admin Protected)
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Artisan Admin Cryptographic Session (Defense-in-depth)
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    const contentType = req.headers.get("content-type") || "";

    let buffer: Buffer;
    let claimedExt = "jpg";
    let originalName = "upload.jpg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }

      originalName = file.name;
      const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
      if (extMatch) {
        claimedExt = extMatch[1].toLowerCase();
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
    } else {
      // JSON payload with base64 dataUrl fallback
      const body = await req.json();
      const { dataUrl, fileName } = body;

      if (!dataUrl) {
        return NextResponse.json({ success: false, error: "No image data provided" }, { status: 400 });
      }

      if (fileName) originalName = fileName;

      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9-+]+);base64,(.+)$/);
      if (matches) {
        claimedExt = matches[1] === "jpeg" ? "jpg" : matches[1].toLowerCase();
        buffer = Buffer.from(matches[2], "base64");
      } else {
        buffer = Buffer.from(dataUrl, "base64");
      }
    }

    // 2. Enforce File Size Limit (DoS Prevention)
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5MB maximum allowed limit (${(buffer.length / 1024 / 1024).toFixed(2)} MB).`,
        },
        { status: 413 }
      );
    }

    // 3. Extension Whitelist Check
    if (!ALLOWED_EXTENSIONS.has(claimedExt)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file extension '.${claimedExt}'. Only JPG, PNG, and WebP images are permitted for security.`,
        },
        { status: 400 }
      );
    }

    // 4. Cryptographic Magic Bytes Verification (Content Integrity)
    const { isValid, normalizedExt } = validateImageMagicBytes(buffer);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Corrupted or forged image file. File content does not match allowed image formats (JPEG, PNG, WebP).",
        },
        { status: 400 }
      );
    }

    // 5. Secure Unpredictable Filename (Path Traversal Prevention)
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    const savedFileName = `artisan_${Date.now()}_${randomSuffix}.${normalizedExt}`;
    const sizeInKb = Math.round(buffer.length / 1024);

    let publicUrl = "";
    let isEphemeral = false;
    let warning: string | undefined = undefined;

    // Strategy A: Vercel Blob Storage (Zero-dependency native REST API)
    // Automatically activated when BLOB_READ_WRITE_TOKEN is configured in Vercel Dashboard
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const contentType = normalizedExt === "jpg" ? "image/jpeg" : `image/${normalizedExt}`;
        const blobRes = await fetch(
          `https://blob.vercel-storage.com/uploads/${savedFileName}`,
          {
            method: "PUT",
            headers: {
              authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
              "x-api-version": "7",
              "content-type": contentType,
            },
            body: new Uint8Array(buffer),
          }
        );
        if (blobRes.ok) {
          const blobData = (await blobRes.json()) as { url?: string };
          if (blobData?.url) {
            publicUrl = blobData.url;
          }
        }
      } catch (blobErr: any) {
        console.warn("[Admin Upload] Vercel Blob upload failed, checking fallback:", blobErr.message);
      }
    }

    // Strategy B: Local / Docker Static Filesystem Storage (public/uploads)
    if (!publicUrl) {
      try {
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const destinationPath = path.join(uploadsDir, savedFileName);
        fs.writeFileSync(destinationPath, buffer);
        publicUrl = `/uploads/${savedFileName}`;
      } catch (fsErr: any) {
        // Strategy C: Graceful Serverless Fallback (Base64 Data URL)
        // If deployed on Vercel without Vercel Blob configured, prevent 500 crash
        if (fsErr.code === "EROFS" || fsErr.message?.includes("read-only")) {
          const mimeType = normalizedExt === "jpg" ? "image/jpeg" : `image/${normalizedExt}`;
          publicUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
          isEphemeral = true;
          warning = "Vercel serverless read-only filesystem detected. Image is served as an inline Data URL. For persistent global CDN hosting, enable Vercel Blob in your Vercel Dashboard.";
        } else {
          throw fsErr;
        }
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: originalName,
      sizeInKb: `${sizeInKb} KB`,
      ...(isEphemeral ? { isEphemeral, warning } : {}),
    });
  } catch (error: any) {
    console.error("[API POST /api/admin/upload] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image upload securely." },
      { status: 500 }
    );
  }
}

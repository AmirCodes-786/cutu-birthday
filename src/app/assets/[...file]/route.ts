import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ file: string[] }> }
) {
  const { file } = await context.params;
  if (!file || file.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Decode the URL components to support spaces and special characters
  const decodedSegments = file.map((segment) => decodeURIComponent(segment));
  const filePath = path.join(process.cwd(), "Assets", ...decodedSegments);

  // Security check: ensure the resolved path stays within the Assets directory
  const assetsDir = path.resolve(process.cwd(), "Assets");
  const resolvedPath = path.resolve(filePath);

  if (!resolvedPath.startsWith(assetsDir)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(resolvedPath)) {
    return new NextResponse("Asset Not Found", { status: 404 });
  }

  try {
    const fileBuffer = await fs.promises.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error serving asset:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


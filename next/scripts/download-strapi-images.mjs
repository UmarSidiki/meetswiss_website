#!/usr/bin/env node
/**
 * download-strapi-images.mjs
 *
 * Downloads all uploaded files from Strapi to public/strapi-images/
 * so the Next.js site can serve images statically without a runtime
 * dependency on Strapi.
 *
 * Usage:
 *   node scripts/download-strapi-images.mjs
 *
 * Environment:
 *   NEXT_PUBLIC_API_URL — Strapi base URL (default: http://localhost:1337)
 */
import { createWriteStream, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const OUT_DIR = join(process.cwd(), 'public', 'strapi-images');
const PAGE_SIZE = 100;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

async function downloadFile(url, destPath) {
  ensureDir(destPath);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const body = Readable.fromWeb(res.body);
  const ws = createWriteStream(destPath);
  await pipeline(body, ws);
}

function fileExists(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Fetch all upload entries from Strapi (paginated)
// ---------------------------------------------------------------------------

async function fetchAllUploads() {
  const allFiles = [];
  let page = 1;
  let hasMore = true;

  const headers = {};
  if (process.env.STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`;
  }

  while (hasMore) {
    const url = `${API_URL}/api/upload/files?pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;

    let res;
    try {
      res = await fetch(url, { headers });
    } catch (err) {
      console.warn(
        `[download-images] Could not reach Strapi at ${API_URL}: ${err.message}`
      );
      console.warn(
        '[download-images] Skipping image download. Images may be missing.'
      );
      return allFiles;
    }

    if (!res.ok) {
      // Try the alternative Strapi 5 upload API format
      const altUrl = `${API_URL}/api/upload/files?start=${(page - 1) * PAGE_SIZE}&limit=${PAGE_SIZE}`;
      try {
        res = await fetch(altUrl, { headers });
      } catch {
        console.warn(`[download-images] Upload API not available. Skipping.`);
        return allFiles;
      }

      if (!res.ok) {
        console.warn(
          `[download-images] Upload API returned ${res.status}. Skipping.`
        );
        return allFiles;
      }
    }

    const data = await res.json();
    const files = Array.isArray(data) ? data : data.results || data.data || [];

    if (files.length === 0) {
      hasMore = false;
    } else {
      allFiles.push(...files);
      page++;
      if (files.length < PAGE_SIZE) {
        hasMore = false;
      }
    }
  }

  return allFiles;
}

// ---------------------------------------------------------------------------
// Collect all image URLs from a single upload entry (original + formats)
// ---------------------------------------------------------------------------

function collectUrls(entry) {
  const urls = [];

  // Main file
  if (entry.url) {
    urls.push(entry.url);
  }

  // Strapi generates size variants (thumbnail, small, medium, large)
  if (entry.formats && typeof entry.formats === 'object') {
    for (const format of Object.values(entry.formats)) {
      if (format && format.url) {
        urls.push(format.url);
      }
    }
  }

  return urls;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`[download-images] Strapi URL: ${API_URL}`);
  console.log(`[download-images] Output dir: ${OUT_DIR}`);

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  const uploads = await fetchAllUploads();

  if (uploads.length === 0) {
    console.log(
      '[download-images] No uploads found or Strapi unreachable. Done.'
    );
    return;
  }

  console.log(`[download-images] Found ${uploads.length} upload entries.`);

  // Collect all unique URLs to download
  const urlsToDownload = new Map(); // url → destPath

  for (const entry of uploads) {
    for (const url of collectUrls(entry)) {
      // url is either absolute (https://...) or relative (/uploads/...)
      let relativePath;
      let downloadUrl;

      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Absolute URL — extract path
        try {
          const parsed = new URL(url);
          relativePath = parsed.pathname;
          downloadUrl = url;
        } catch {
          continue;
        }
      } else if (url.startsWith('/')) {
        // Relative path
        relativePath = url;
        downloadUrl = `${API_URL}${url}`;
      } else {
        continue;
      }

      const destPath = join(OUT_DIR, relativePath);
      urlsToDownload.set(downloadUrl, destPath);
    }
  }

  console.log(`[download-images] ${urlsToDownload.size} files to process.`);

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const [url, destPath] of urlsToDownload) {
    // Skip files that already exist (incremental)
    if (fileExists(destPath)) {
      skipped++;
      continue;
    }

    try {
      await downloadFile(url, destPath);
      downloaded++;
    } catch (err) {
      console.warn(
        `[download-images] Failed to download ${url}: ${err.message}`
      );
      errors++;
    }
  }

  console.log(
    `[download-images] Done: ${downloaded} downloaded, ${skipped} skipped (already exist), ${errors} errors.`
  );
}

main().catch((err) => {
  console.error('[download-images] Fatal error:', err);
  // Don't exit with error code — image download failure shouldn't fail the build
  // process.exit(1);
});

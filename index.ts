#!/usr/bin/env bun

import { UploadClient } from "@uploadcare/upload-client";
import { readFileSync } from "fs";
import { basename } from "path";

const publicKey = process.env.UPLOADCARE_PUBLIC_KEY;

if (!publicKey) {
  console.error("Error: UPLOADCARE_PUBLIC_KEY environment variable is required");
  process.exit(1);
}

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: uploadcare <file>");
  console.error("  Uploads a file to Uploadcare and prints the CDN URL");
  console.error("");
  console.error("Environment variables:");
  console.error("  UPLOADCARE_PUBLIC_KEY - Your Uploadcare public key (required)");
  process.exit(1);
}

const client = new UploadClient({ publicKey });

try {
  const fileData = readFileSync(filePath);
  const fileName = basename(filePath);

  const file = await client.uploadFile(fileData, {
    fileName,
    contentType: undefined,
  });

  console.log(`https://ucarecdn.com/${file.uuid}/`);
} catch (error) {
  console.error("Upload failed:", error instanceof Error ? error.message : error);
  process.exit(1);
}

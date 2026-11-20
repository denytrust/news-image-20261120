// news-image-20261120 entry program.
//
// The finished front page ships as entry.png next to this file. All the
// grader does is run this program: it confirms entry.png is a whole,
// well-formed image of the right size, then copies its bytes unchanged
// into the grader's output directory. The program uses only the Node 22
// standard library, touches no network, and holds no randomness, so two
// runs write identical bytes.

import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const MAX_BYTES = 1024 * 1024;
const WANT_WIDTH = 1024;
const WANT_HEIGHT = 1024;

function fail(message: string): never {
  throw new Error(`news-image-20261120: ${message}`);
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function isJpeg(bytes: Buffer): boolean {
  return (
    bytes.length >= 4 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[bytes.length - 2] === 0xff &&
    bytes[bytes.length - 1] === 0xd9
  );
}

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PNG_IEND = Buffer.from([
  0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
]);

function isPng(bytes: Buffer): boolean {
  if (bytes.length < 24) return false;
  if (!PNG_MAGIC.every((byte, i) => bytes[i] === byte)) return false;
  // A whole PNG ends with its IEND chunk.
  return bytes.subarray(bytes.length - 12).equals(PNG_IEND);
}

// Read width and height out of a JPEG by walking its marker segments
// until a Start Of Frame header. Stops (returns null) if the scan data
// starts first or a segment looks malformed.
function jpegDimensions(bytes: Buffer): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    const marker = bytes[offset + 1];
    if (marker === 0xda) return null; // start of scan
    const length = bytes.readUInt16BE(offset + 2);
    if (length < 2 || offset + 2 + length > bytes.length) return null;
    const isSof =
      marker >= 0xc0 && marker <= 0xcf &&
      marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

function pngDimensions(bytes: Buffer): { width: number; height: number } | null {
  if (!isPng(bytes)) return null;
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

function dimensions(bytes: Buffer): { width: number; height: number } {
  const found = isJpeg(bytes)
    ? jpegDimensions(bytes)
    : pngDimensions(bytes);
  if (found === null) fail("could not read image dimensions");
  return found;
}

function checkImage(bytes: Buffer, size: number, label: string): void {
  if (size === 0 || size > MAX_BYTES) {
    fail(`${label} is ${size} bytes, outside 1..${MAX_BYTES}`);
  }
  if (bytes.length !== size) fail(`${label} changed while reading`);
  if (!isJpeg(bytes) && !isPng(bytes)) {
    fail(`${label} is neither a whole JPEG nor a whole PNG`);
  }
  const { width, height } = dimensions(bytes);
  if (width !== WANT_WIDTH || height !== WANT_HEIGHT) {
    fail(`${label} is ${width}x${height}, want ${WANT_WIDTH}x${WANT_HEIGHT}`);
  }
}

function main(): void {
  const source = new URL("./entry.png", import.meta.url);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const target = join(outDir, "entry.png");

  let info;
  try {
    info = statSync(source);
  } catch {
    fail("entry.png is missing");
  }
  if (!info.isFile()) fail("entry.png is not a file");
  const bytes = readFileSync(source);
  checkImage(bytes, info.size, "entry.png");

  mkdirSync(outDir, { recursive: true });
  copyFileSync(source, target);

  // Verify the copy itself, not just the source: same length, same hash,
  // and the same readable dimensions.
  const written = readFileSync(target);
  checkImage(written, written.length, "written entry.png");
  if (sha256(written) !== sha256(bytes)) {
    fail("written file differs from entry.png");
  }

  console.log(
    `wrote ${target} (${written.length} bytes, sha256 ${sha256(written)})`,
  );
}

main();

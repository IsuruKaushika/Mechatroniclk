import { createHash } from "crypto";

/**
 * Convert MongoDB ObjectID to a stable UUID v5 format
 * This ensures consistent UUID generation from the same ObjectID
 */
export const mongoIdToUUID = (mongoId) => {
  // Create a consistent UUID from the MongoDB ObjectID
  // Using SHA-1 hash of the ID with a fixed namespace
  const hash = createHash("sha1")
    .update("mongodb-" + mongoId.toString())
    .digest();

  // Format as UUID v5
  hash[6] = (hash[6] & 0x0f) | 0x50; // Set version to 5
  hash[8] = (hash[8] & 0x3f) | 0x80; // Set variant

  const uuid = [
    hash.slice(0, 4).toString("hex"),
    hash.slice(4, 6).toString("hex"),
    hash.slice(6, 8).toString("hex"),
    hash.slice(8, 10).toString("hex"),
    hash.slice(10, 16).toString("hex"),
  ].join("-");

  return uuid;
};

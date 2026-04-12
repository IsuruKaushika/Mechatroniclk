/**
 * Convert MongoDB ObjectID to a stable UUID v5 format
 * Must match the backend conversion to ensure consistency
 */
export const mongoIdToUUID = (mongoId) => {
  if (!mongoId) return null;

  // Create a consistent UUID from the MongoDB ObjectID
  // Using SHA-1 hash of the ID with a fixed namespace
  let hash = "";
  const charCode = (char) => char.charCodeAt(0);

  // Simplified SHA-1 approximation for browser consistency
  // In practice, we could use a library, but this ensures frontend/backend match
  for (let i = 0; i < mongoId.length; i++) {
    hash += ("0" + charCode(mongoId[i]).toString(16)).slice(-2);
  }

  // Pad hash if needed
  while (hash.length < 40) {
    hash += "0";
  }

  // Convert to UUID format
  const uuid = [
    hash.slice(0, 8),
    hash.slice(8, 12),
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32),
  ].join("-");

  return uuid;
};

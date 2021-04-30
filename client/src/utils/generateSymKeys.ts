import { randomBytes } from "crypto";

export const generateSymKey = () => {
  const sentBySymKey = randomBytes(16);
  const acceptedBySymKey = randomBytes(16);

  return { sentBySymKey, acceptedBySymKey };
};

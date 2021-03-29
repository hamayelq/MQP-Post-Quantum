import { scrypt } from "scrypt-js";

/**
 *
 * @param password plaintext password
 * @param type string, login or registration
 * @returns either an array with authKey and encryption array or just authKey
 */
export const scryptPassword = async (
  password: string,
  type: string
): Promise<any> => {
  const passwordArray: Uint8Array = new TextEncoder().encode(password);

  const salt: Uint8Array = new TextEncoder().encode("salt");

  const hashedPassword: Uint8Array = await scrypt(
    passwordArray,
    salt,
    1024,
    8,
    1,
    32
  );
  console.log("Hashed password", hashedPassword);

  const firstHalf = hashedPassword.slice(0, 16);
  const lastHalf = hashedPassword.slice(16, 32);

  const scryptedPassword: string = new TextDecoder().decode(lastHalf);
  console.log(scryptedPassword);

  if (type === "login") return scryptedPassword;
  if (type === "register") return [scryptedPassword, firstHalf];

  // if type is not login or register, error
  return -1;
};

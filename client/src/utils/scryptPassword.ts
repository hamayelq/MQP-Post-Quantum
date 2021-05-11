import { scrypt } from "scrypt-js";

export const scryptPassword = async (password: string): Promise<any> => {
  const passwordArray: Uint8Array = new TextEncoder().encode(password);

  const salt: Uint8Array = new TextEncoder().encode("salt"); // randomly generate (seed? datetime), store at database

  const hashedPassword: Uint8Array = await scrypt(
    passwordArray,
    salt,
    1024,
    8,
    1,
    32
  );

  const firstHalf = hashedPassword.slice(0, 16);
  const lastHalf = hashedPassword.slice(16, 32);

  const scryptedPassword: string = new TextDecoder().decode(lastHalf);
  return [scryptedPassword, firstHalf];
};

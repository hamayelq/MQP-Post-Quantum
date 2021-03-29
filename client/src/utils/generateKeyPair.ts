import { ntru } from "ntru";

export const generateKeyPair = async () => {
  const keyPair: Object = await ntru.keyPair;
  return keyPair;
};

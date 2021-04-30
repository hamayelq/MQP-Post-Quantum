import { ntru } from "ntru";
import { default as aesjs } from "aes-js";

export const generateKeyPair = async () => {
  const keyPair: any = await ntru.keyPair();

  const privateKey = keyPair.privateKey;
  const publicKey = aesjs.utils.hex.fromBytes(keyPair.publicKey);

  return { privateKey, publicKey };
};

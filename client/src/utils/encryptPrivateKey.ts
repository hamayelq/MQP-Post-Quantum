import { AES, enc } from "crypto-js";

export const encryptPrivateKey = (
  publicKey: any,
  privateKey: string,
  encrKey: string
) => {
  /**
   * Simply encrypting public key with "public" in order to be able
   * to send to backend, currently backend doesn't like the public key
   */
  const publicKeyText = AES.encrypt(publicKey, "public").toString();
  const encryptedPrivateKey = AES.encrypt(privateKey, encrKey).toString();
  return { encryptedPrivateKey, publicKeyText };
};

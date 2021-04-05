import { AES, enc } from "crypto-js";

export const decryptPrivateKey = (
  publicKeyText: string,
  encryptedPrivateKey: string,
  encrKey: string
) => {
  const privateKey = AES.decrypt(encryptedPrivateKey, encrKey).toString(
    enc.Utf8
  );
  const publicKey = AES.decrypt(publicKeyText, "public").toString(enc.Utf8);

  return { privateKey, publicKey };
};

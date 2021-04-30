import { default as aesjs } from "aes-js";

export const decryptPrivateKey = (
  encryptedPrivateKey: string,
  encrArray: Uint8Array
) => {
  const aesCtr = new aesjs.ModeOfOperation.ctr(encrArray);
  const encryptedBytes = aesjs.utils.hex.toBytes(encryptedPrivateKey);
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  return decryptedBytes;
};

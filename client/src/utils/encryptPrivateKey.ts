import { default as aesjs } from "aes-js";

export const encryptPrivateKey = (
  privateKey: Uint8Array,
  encrArray: Uint8Array
) => {
  const aesCtr = new aesjs.ModeOfOperation.ctr(encrArray);
  const encryptedBytes = aesCtr.encrypt(privateKey);
  const encryptedPrivateKey = aesjs.utils.hex.fromBytes(encryptedBytes);

  return encryptedPrivateKey;
};

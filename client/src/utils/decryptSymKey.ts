import { default as aesjs } from "aes-js";

export const decryptSymKey = (symKey: string) => {
  const symKeyBytes = aesjs.utils.hex.toBytes(symKey);
  const encrArray: any = Object.values(
    JSON.parse(sessionStorage.getItem("encrArray")!)
  );

  const aesCtr = new aesjs.ModeOfOperation.ctr(encrArray);
  const decryptedSymKeyBytes = aesCtr.decrypt(symKeyBytes);

  const decryptedSymKey = aesjs.utils.hex.fromBytes(decryptedSymKeyBytes);

  return { decryptedSymKey, decryptedSymKeyBytes };
};

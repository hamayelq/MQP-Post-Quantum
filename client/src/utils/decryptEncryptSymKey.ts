import { default as aesjs } from "aes-js";

export const decryptEncryptSymKey = (symKey: string) => {
  const symKeyBytes = aesjs.utils.hex.toBytes(symKey);
  const privateKeyBytes: any = Object.values(
    JSON.parse(sessionStorage.getItem("privateKey")!)
  ).slice(300, 332);
  const encrArray: any = Object.values(
    JSON.parse(sessionStorage.getItem("encrArray")!)
  );

  const aesCtr = new aesjs.ModeOfOperation.ctr(privateKeyBytes);
  const decryptedSymKeyBytes = aesCtr.decrypt(symKeyBytes);

  console.log("Decrypted symkey bytes", decryptedSymKeyBytes);

  const aesCtr2 = new aesjs.ModeOfOperation.ctr(encrArray);
  const encryptedSymKeyBytes = aesCtr2.encrypt(decryptedSymKeyBytes);

  const encryptedSymKey = aesjs.utils.hex.fromBytes(encryptedSymKeyBytes);

  return encryptedSymKey;
};

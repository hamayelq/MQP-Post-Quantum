import { AES, enc } from "crypto-js";

export const encryptPrivateKey = (privateKey: string, encrKey: string) => {
  //TO DO - Gantt Chart for requirements to fill each week
  //      - Begin process of writing report
  // console.log("Private key", privateKey);
  // console.log("Encryption key", encrKey);

  const encryptedPrivateKey = AES.encrypt(privateKey, encrKey);
  console.log("Encrypted", encryptedPrivateKey.toString());
  const decryptedPrivateKey = AES.decrypt(privateKey, encrKey);
  console.log("Decrypted", decryptedPrivateKey.toString(enc.Utf8));

  return encryptedPrivateKey;
};

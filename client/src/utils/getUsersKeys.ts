import { default as aesjs } from "aes-js";

export const getUsersKeys = (publicKey: string) => {
  let encrArray = JSON.parse(sessionStorage.getItem("encrArray")!);
  encrArray = [...Object.values(encrArray)];
  const friendPublicKey = aesjs.utils.hex.toBytes(publicKey);

  return { encrArray, friendPublicKey };
};

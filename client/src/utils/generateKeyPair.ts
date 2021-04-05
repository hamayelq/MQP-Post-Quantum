import { ntru } from "ntru";

export const generateKeyPair = async () => {
  const keyPair: any = await ntru.keyPair();
  const privateKey = new TextDecoder().decode(keyPair.privateKey);
  const publicKey = new TextDecoder().decode(keyPair.publicKey);
  // const publicKey = keyPair.publicKey.toString();
  return { privateKey, publicKey };
};

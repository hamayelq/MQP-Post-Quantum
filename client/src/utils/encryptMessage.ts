import { default as aesjs } from "aes-js";

export const encryptMessage = (symKey: Uint8Array, message: string) => {
  const messageBytes = aesjs.utils.utf8.toBytes(message);

  const aesCtr = new aesjs.ModeOfOperation.ctr(symKey, new aesjs.Counter(5));
  const encryptedMessageBytes = aesCtr.encrypt(messageBytes);

  const encryptedMessage = aesjs.utils.hex.fromBytes(encryptedMessageBytes);

  return encryptedMessage;
};

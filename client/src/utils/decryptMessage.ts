import { default as aesjs } from "aes-js";

export const decryptMessage = (symKey: Uint8Array, message: string) => {
  const messageBytes = aesjs.utils.hex.toBytes(message);

  const aesCtr = new aesjs.ModeOfOperation.ctr(symKey, new aesjs.Counter(5));
  const decryptedMessageBytes = aesCtr.decrypt(messageBytes);

  const decryptedMessage = aesjs.utils.utf8.fromBytes(decryptedMessageBytes);

  return decryptedMessage;
};

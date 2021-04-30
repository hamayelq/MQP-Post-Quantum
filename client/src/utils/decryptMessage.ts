import { default as aesjs } from "aes-js";

// export const decryptMessages = (symKey: Uint8Array, messages: string[]) => {
//   let decryptedMessages: string[] = [];

//   [...messages].forEach((message) => {
//     const messageBytes = aesjs.utils.hex.toBytes(message);

//     const aesCtr = new aesjs.ModeOfOperation.ctr(symKey);
//     const decryptedMessageBytes = aesCtr.decrypt(messageBytes);

//     const decryptedMessage = aesjs.utils.utf8.fromBytes(decryptedMessageBytes);

//     decryptedMessages.push(decryptedMessage);
//   });

//   return decryptedMessages;
// };

export const decryptMessage = (symKey: Uint8Array, message: string) => {
  const messageBytes = aesjs.utils.hex.toBytes(message);

  const aesCtr = new aesjs.ModeOfOperation.ctr(symKey);
  const decryptedMessageBytes = aesCtr.decrypt(messageBytes);

  const decryptedMessage = aesjs.utils.utf8.fromBytes(decryptedMessageBytes);

  return decryptedMessage;
};

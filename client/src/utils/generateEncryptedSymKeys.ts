import { randomBytes } from "crypto";
import { default as aesjs } from "aes-js";

export const generateEncryptedSymKeys = (
  userEncryptionArr: Uint8Array,
  friendPublicKey: Uint8Array
) => {
  const symKey = randomBytes(32);

  console.log("Sym key", symKey);

  const friendPublicKeyBytes = friendPublicKey.slice(300, 332); // choosing bytes 300 to 315 (16 bytes total), as aes only supports 16, 24, or 32

  const aesCtr1 = new aesjs.ModeOfOperation.ctr(userEncryptionArr);
  const encryptedSentBySymKeyBytes = aesCtr1.encrypt(symKey);

  const aesCtr2 = new aesjs.ModeOfOperation.ctr(friendPublicKeyBytes);
  const encryptedAcceptedBySymKeyBytes = aesCtr2.encrypt(symKey);

  const encryptedSentBySymKey = aesjs.utils.hex.fromBytes(
    encryptedSentBySymKeyBytes
  );
  const encryptedAcceptedBySymKey = aesjs.utils.hex.fromBytes(
    encryptedAcceptedBySymKeyBytes
  );

  return {
    encryptedSentBySymKey,
    encryptedAcceptedBySymKey,
  };
};

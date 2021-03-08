import React, { useState } from "react";
import "./ntrutest.css";
import "ntru";
import { ntru } from "ntru";

interface Props {}

const Ntrutest: React.FC<Props> = () => {
  const [plainText, setPlainText] = useState("");
  const [showEncrypt, setShowEncrypt] = useState(false);
  const [showDecrypt, setShowDecrypt] = useState(false);
  const [encodedArray, setEncodedArray] = useState(new Uint8Array());
  const [encryptedArray, setEncryptedArray] = useState(new Uint8Array());
  const [decryptedArray, setDecryptedArray] = useState(new Uint8Array());
  const [decoded, setDecoded] = useState("");

  const encryptAndDecrypt = async (plainText: string) => {
    const keyPair = await ntru.keyPair();
    const encodedArray = new TextEncoder().encode(plainText);
    const encrypted = await ntru.encrypt(encodedArray, keyPair.publicKey);
    const decrypted = await ntru.decrypt(encrypted, keyPair.privateKey); // same as plainText
    const decodedPlainText = new TextDecoder().decode(decrypted);

    setEncodedArray(encodedArray);
    setEncryptedArray(encrypted);
    setDecryptedArray(decrypted);
    setDecoded(decodedPlainText);

    console.log("Key pair: ", keyPair);
    console.log("Plain text: ", plainText);
    console.log("Plain text encoded: ", encodedArray);
    console.log("Plain text encrypted: ", encrypted);
    console.log("Plain text decrypted: ", decrypted);
    console.log("Plain text decoded: ", decodedPlainText);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <label>
            Enter plaintext
            <input
              type="text"
              name="plainText"
              value={plainText}
              onChange={(e) => {
                setPlainText(e.target.value);
                setShowEncrypt(false);
                setShowDecrypt(false);
              }}
              style={{ marginLeft: "20px" }}
            />
          </label>
          <button
            style={{ marginLeft: "20px" }}
            onClick={() => {
              encryptAndDecrypt(plainText);
              setShowEncrypt(true);
              setShowDecrypt(false);
            }}
          >
            begin
          </button>
        </div>
        {showEncrypt && (
          <>
            <div style={{ marginBottom: 20 }}>
              <h4>Entered plain text: {plainText}</h4>
              <h4>Encoded array: </h4>
              {[].slice.call(encodedArray).map((el: number, i: number) => (
                <li key={i}>
                  {i} - {el}
                </li>
              ))}
              <h4>Encrypted array: </h4>
              {[].slice.call(encryptedArray).map((el: number, i: number) =>
                i < 40 ? (
                  <li key={i}>
                    {i} - {el}
                  </li>
                ) : (
                  i === 40 && <p>Open console for more...</p>
                )
              )}
              <h4>
                Number of elements in encrypted array{" "}
                {[].slice.call(encryptedArray).length}
              </h4>
              {/* <h4>Encrypted array: {encryptedArray}</h4> */}
            </div>
            <button
              onClick={() => setShowDecrypt(true)}
              style={{ marginBottom: 20 }}
            >
              Click to decrypt
            </button>
          </>
        )}
        {showDecrypt && (
          <>
            <div style={{ flexDirection: "row", width: window.innerWidth }}>
              <h4>Decrypted array: </h4>
              {[].slice.call(decryptedArray).map((el: number, i: number) => {
                return (
                  <li key={i}>
                    {i} - {el}
                  </li>
                );
              })}
              <h4>Decrypted plain text: {decoded}</h4>
            </div>
          </>
        )}
      </header>
    </div>
  );
};

export default Ntrutest;

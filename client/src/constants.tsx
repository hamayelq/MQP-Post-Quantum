import React, { useEffect } from 'react';
import { ntru } from 'ntru';

window.onload = async function () {
    const keyPair = await ntru.keyPair();
    localStorage.setItem("publicKey", JSON.stringify(keyPair.publicKey));
    localStorage.setItem("privateKey", JSON.stringify(keyPair.privateKey));
    console.log(JSON.stringify(keyPair.publicKey));
}

/*: {privateKey: Uint8Array; publicKey: Uint8Array} */
// export const getKeyPair = (): any => {
//     let keyPair;
//     (async () => {
//         keyPair = await ntru.keyPair();
//     })();
//     console.log(keyPair);
//     // const keyPair = ntru.keyPair();
//     // return keyPair;
// }
// export const keyPair = async (): Promise<any> => { return ntru.keyPair(); } // returns key pair



// console.log(keyPair);




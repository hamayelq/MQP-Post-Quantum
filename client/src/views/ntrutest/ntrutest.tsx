import React, { useState } from "react";
import "ntru";
import { ntru } from "ntru";
import {
  Button,
  TextField,
  Box,
  useTheme,
  Collapse,
  Typography,
  Grid,
} from "@material-ui/core";

interface Props {}

const Ntrutest: React.FC<Props> = () => {
  const [plainText, setPlainText] = useState("");
  const [showEncrypt, setShowEncrypt] = useState(false);
  const [showDecrypt, setShowDecrypt] = useState(false);
  const [encodedArray, setEncodedArray] = useState(new Uint8Array());
  const [encryptedArray, setEncryptedArray] = useState(new Uint8Array());
  const [decryptedArray, setDecryptedArray] = useState(new Uint8Array());
  const [decoded, setDecoded] = useState("");

  const theme = useTheme();

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
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={1} sm={2} lg={4} />
        <Grid item xs={10} sm={8} lg={4}>
          {/* <div style={{ marginBottom: 20 }}> */}
          <Box
            style={{
              display: "flex",
              // width: "30vw",
            }}
            component="div"
          >
            <TextField
              placeholder="Enter plaintext"
              multiline
              fullWidth
              type="text"
              name="plainText"
              size="small"
              value={plainText}
              onChange={(e) => {
                setPlainText(e.target.value);
                setShowEncrypt(false);
                setShowDecrypt(false);
              }}
              style={{}}
            />

            <Button
              variant="contained"
              style={{ marginLeft: "20px" }}
              onClick={() => {
                encryptAndDecrypt(plainText);
                setShowEncrypt(true);
                setShowDecrypt(false);
              }}
            >
              Encrypt
            </Button>
          </Box>
          {/* </div> */}
        </Grid>
        <Grid item xs={1} sm={2} lg={4} />

        <Grid item xs={1} sm={2} lg={4} />
        <Grid item xs={10} sm={8} lg={4}>
          <Collapse in={showEncrypt}>
            <Box component="div" style={{}}>
              <Typography color="textPrimary" variant="h5">
                Entered plain text:
              </Typography>
              <Typography color="textPrimary" variant="subtitle1">
                <i>{plainText}</i>
              </Typography>
              <Typography color="textPrimary" variant="h5">
                Encoded array:{" "}
              </Typography>
              <Typography
                color="textPrimary"
                // style={{ maxWidth: "10vw" }}
                variant="subtitle1"
              >
                {[].slice
                  .call(encodedArray)
                  .map((el, i) => (i < 40 ? `${el}, ` : i === 40 && "..."))}
              </Typography>

              <Typography color="textPrimary" variant="h5">
                Encrypted array:{" "}
              </Typography>
              <Typography
                color="textPrimary"
                style={{ maxWidth: "50vw" }}
                variant="subtitle1"
              >
                {[].slice
                  .call(encryptedArray)
                  .map((el, i) => (i < 40 ? `${el}, ` : i === 40 && "..."))}
              </Typography>

              <Typography color="textPrimary">
                Number of elements in encrypted array{" "}
                {[].slice.call(encryptedArray).length}
              </Typography>

              <Button
                variant="contained"
                onClick={() => setShowDecrypt(true)}
                style={{ marginTop: 10 }}
              >
                Click to decrypt
              </Button>
            </Box>
          </Collapse>
        </Grid>
        <Grid item xs={1} sm={2} lg={4} />

        <Grid item xs={1} sm={2} lg={4} />
        <Grid item xs={10} sm={8} lg={4}>
          <Collapse in={showDecrypt}>
            <Box component="div" style={{}}>
              <Typography color="textPrimary" variant="h5">
                Decrypted array:{" "}
              </Typography>
              <Typography color="textPrimary" variant="subtitle1">
                {[].slice
                  .call(decryptedArray)
                  .map((el, i) => (i < 40 ? `${el}, ` : i === 40 && "..."))}
              </Typography>
              <Typography color="textPrimary" variant="h5">
                Decrypted plain text:
              </Typography>
              <Typography color="textPrimary" variant="subtitle1">
                <i>{decoded}</i>
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setShowDecrypt(false);
                  setShowEncrypt(false);
                  setPlainText("");
                }}
                style={{ marginBottom: 20, marginTop: 10 }}
              >
                Reset
              </Button>
            </Box>
          </Collapse>
        </Grid>
        <Grid item xs={1} sm={2} lg={4} />
      </Grid>
    </Box>
  );
};

export default Ntrutest;

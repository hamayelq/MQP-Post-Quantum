import { Alert, Box, Button, Fade, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { setAccessToken } from "../../accessToken";
import { MeQuery, MeDocument, useLoginMutation } from "../../generated/graphql";
import { useHistory } from "react-router-dom";
import { scryptPassword } from "../../utils/scryptPassword";
import { decryptPrivateKey } from "../../utils/decryptPrivateKey";
import { default as aesjs } from "aes-js";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [error, setError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  const history = useHistory();

  const storeValues = (
    encrArray: Uint8Array,
    encryptedPrivateKey: string,
    publicKey: string
  ) => {
    const privateKey = decryptPrivateKey(encryptedPrivateKey, encrArray);
    console.log("decrypted private key", privateKey);

    sessionStorage.setItem("privateKey", JSON.stringify(privateKey));
    sessionStorage.setItem(
      "publicKey",
      JSON.stringify(aesjs.utils.hex.toBytes(publicKey))
    );
    sessionStorage.setItem("encrArray", JSON.stringify(encrArray));
  };

  const submitForm = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    console.log("form submitted");

    const scryptArray: any = await scryptPassword(password);
    const authKey = scryptArray[0];
    const encrArray = scryptArray[1];
    // const encrKey = new TextDecoder().decode(encrArray);

    let response;
    try {
      response = await login({
        variables: {
          username,
          password: authKey,
        },
        update: (store, { data }) => {
          // update cache and set curr user to this
          if (!data) {
            return null;
          }
          sessionStorage.setItem("userUuid", data.login.user.uuid);
          sessionStorage.setItem("userUsername", data.login.user.username);
          store.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          });
        },
      });
    } catch (err) {
      console.log(err.message);
      setError(true);
    }

    if (response && response.data) {
      console.log("Login succesful. Data: ", response.data.login);
      const { encryptedPrivateKey, publicKey } = response.data.login;
      storeValues(encrArray, encryptedPrivateKey, publicKey);
      setAccessToken(response.data.login.accessToken);
      history.push("/chat");
    }
  };

  return (
    <form name="form" noValidate onSubmit={(e) => submitForm(e)}>
      <TextField
        id="username"
        required
        fullWidth
        autoFocus
        margin="normal"
        label="Username"
        type="username"
        variant="outlined"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError(false);
        }}
      />
      <TextField
        id="password"
        required
        fullWidth
        autoFocus
        margin="normal"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(false);
        }}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!username || !password}
        >
          Log In
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {error === false ? (
          <Alert severity="info">
            <div>
              Use username <b>demo</b> and password <b>Password!123</b>
            </div>
          </Alert>
        ) : (
          <Fade in={error} mountOnEnter unmountOnExit>
            <Alert severity="error">
              <div>Incorrect username or password. Try again.</div>
            </Alert>
          </Fade>
        )}
      </Box>
    </form>
  );
};

import { Alert, Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { setAccessToken } from "../../accessToken";
import { MeQuery, MeDocument, useLoginMutation } from "../../generated/graphql";
import { scrypt } from "scrypt-js";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  const submitForm = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    console.log("form submitted");

    const passwordArray: Uint8Array = new TextEncoder().encode(password);
    const saltArray: Uint8Array = new TextEncoder().encode("salt");

    const pass: any = await scrypt(passwordArray, saltArray, 1024, 8, 1, 32);
    console.log(pass);

    const finalPass: string = new TextDecoder().decode(pass);
    console.log(finalPass);

    let response;
    try {
      response = await login({
        variables: {
          username,
          password: finalPass,
        },
        update: (store, { data }) => {
          // update cash and set curr user to this
          if (!data) {
            return null;
          }
          store.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: data.login.user,
            },
          });
        },
      });
      console.log(response);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }

    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
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
          setError("");
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
          setError("");
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
        {error === "" ? (
          <Alert severity="info">
            <div>
              Use username <b>demo</b> and password <b>Password!123</b>
            </div>
          </Alert>
        ) : (
          <Alert severity="error">
            <div>Incorrect username or password. Try again.</div>
          </Alert>
        )}
      </Box>
    </form>
  );
};

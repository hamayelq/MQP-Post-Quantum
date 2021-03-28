import { Alert, Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { setAccessToken } from "../../accessToken";
import { MeQuery, MeDocument, useLoginMutation } from "../../generated/graphql";
import { scrypt } from "scrypt-js";

interface LoginProps {}

export const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { error }] = useLoginMutation();

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
          email,
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
      console.log(err);
    }

    if (response && response.data) {
      setAccessToken(response.data.login.accessToken);
    }
  };

  return (
    <form name="form" noValidate onSubmit={(e) => submitForm(e)}>
      <TextField
        id="email"
        required
        fullWidth
        autoFocus
        margin="normal"
        label="Username"
        type="email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!email || !password}
        >
          Log In
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          <div>
            Use username <b>demo</b> and password <b>Password!123</b>
          </div>
        </Alert>
      </Box>
    </form>
  );
};

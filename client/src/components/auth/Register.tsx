import { useState } from "react";
import { Alert, Box, Button, Collapse, TextField } from "@material-ui/core";
import { useRegisterMutation } from "../../generated/graphql";
import { useHistory } from "react-router-dom";
import { scryptPassword } from "../../utils/scryptPassword";
import { generateKeyPair } from "../../utils/generateKeyPair";
import { encryptPrivateKey } from "../../utils/encryptPrivateKey";

interface Props {}

export const Register: React.FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isError, setIsError] = useState(false);
  const [register, { error }] = useRegisterMutation();

  const history = useHistory();

  const submitForm = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();

    const passwordRegex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(true);
      return;
    }

    const scryptArray: any = await scryptPassword(password);
    const authKey = scryptArray[0];
    const encrArray = scryptArray[1];
    // const encrKey = aesjs.utils.hex.fromBytes(encrArray);
    // const encrKey = new TextDecoder().decode(encrArray);

    const { privateKey, publicKey } = await generateKeyPair();

    const encryptedPrivateKey = encryptPrivateKey(privateKey, encrArray);
    // console.log("private key", privateKey);
    // console.log("encrypted private key", encryptedPrivateKey);
    // console.log("public key", publicKeyText);

    let response;
    try {
      response = await register({
        variables: {
          email, // CHANGE THIS TO USERNAME, NEED TO CHANGE GRAPHQL SERVER TOO
          username,
          password: authKey,
          publicKey: publicKey,
          encryptedPrivateKey,
        },
      });

      console.log(response);

      if (response.data?.register) history.push("/login");
    } catch (err) {
      console.log(error?.message);
      setIsError(true);
    }

    // console.log("form submitted");
  };

  return (
    <form name="form" onSubmit={(e) => submitForm(e)}>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        required
        name="email"
        onChange={(e) => {
          setEmail(e.target.value);
          setIsError(false);
        }}
        type="email"
        value={email}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Username"
        margin="normal"
        required
        name="username"
        onChange={(e) => {
          setUsername(e.target.value);
          setIsError(false);
        }}
        type="username"
        value={username}
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        required
        name="password"
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(false);
        }}
        type="password"
        value={password}
        variant="outlined"
      />
      <Box sx={{ mt: 2 }}>
        <Button
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={!email || !password || !username}
        >
          Register
        </Button>
      </Box>

      <Collapse in={passwordError} mountOnEnter unmountOnExit>
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">
            <div>
              Make sure your password contains a minimum of eight characters
              with at least one letter, one number, and one special character.
            </div>
          </Alert>
        </Box>
      </Collapse>

      {error?.message === "exists" && (
        <Collapse in={isError} mountOnEnter unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Alert severity="error">
              <div>A user with that username or email already exists.</div>
            </Alert>
          </Box>
        </Collapse>
      )}
    </form>
  );
};

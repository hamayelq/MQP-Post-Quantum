import { useState } from "react";
import { scrypt } from "scrypt-js";
import { Box, Button, TextField } from "@material-ui/core";
import { useRegisterMutation } from "../../generated/graphql";
import { useHistory } from "react-router";
import { scryptPassword } from "../../utils/scryptPassword";

interface Props {}

export const Register: React.FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, { error }] = useRegisterMutation();

  const history = useHistory();

  const submitForm = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    console.log("form submitted");

    const scryptArray: any = await scryptPassword(password, "register");
    const authKey = scryptArray[0];
    const encrArray = scryptArray[1];

    console.log(authKey, encrArray);

    // const passwordArray: Uint8Array = new TextEncoder().encode(password);
    // const salt: Uint8Array = new TextEncoder().encode("salt");
    // console.log("Salt array", salt);

    // const pass: Uint8Array = await scrypt(passwordArray, salt, 1024, 8, 1, 32);
    // console.log("Hashed password", pass);

    // const finalPass: string = new TextDecoder().decode(pass);
    // console.log("Final password", finalPass);

    const response = await register({
      variables: {
        email, // CHANGE THIS TO USERNAME, NEED TO CHANGE GRAPHQL SERVER TOO
        username,
        password: authKey,
      },
    });

    console.log(response);
    history.push("/login");
  };

  return (
    <form name="form" onSubmit={(e) => submitForm(e)}>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        required
        name="email"
        onChange={(e) => setEmail(e.target.value)}
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
        onChange={(e) => setUsername(e.target.value)}
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
        onChange={(e) => setPassword(e.target.value)}
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
    </form>
  );
};

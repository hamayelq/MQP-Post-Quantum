import { useState } from "react";
import { scrypt } from "scrypt-js";
import { Box, Button, TextField } from "@material-ui/core";
import { useRegisterMutation } from "../../generated/graphql";
import { useHistory } from "react-router";

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

    const passwordArray: Uint8Array = new TextEncoder().encode(password);
    const saltArray: Uint8Array = new TextEncoder().encode("salt");

    const pass: Uint8Array = await scrypt(
      passwordArray,
      saltArray,
      1024,
      8,
      1,
      32
    );
    console.log(pass);

    const finalPass: string = new TextDecoder().decode(pass);
    console.log(finalPass);

    const response = await register({
      variables: {
        email, // CHANGE THIS TO USERNAME, NEED TO CHANGE GRAPHQL SERVER TOO
        username,
        password: finalPass,
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

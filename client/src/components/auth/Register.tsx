import { useState } from "react";
import { Alert, Box, Button, Collapse, TextField } from "@material-ui/core";
import { useRegisterMutation } from "../../generated/graphql";
import { useHistory } from "react-router";
import { scryptPassword } from "../../utils/scryptPassword";

interface Props {}

export const Register: React.FC<Props> = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [register, { error }] = useRegisterMutation();

  const history = useHistory();

  const submitForm = async (event: React.FormEvent<EventTarget>) => {
    event.preventDefault();
    console.log("form submitted");

    const scryptArray: any = await scryptPassword(password, "register");
    const authKey = scryptArray[0];
    const encrArray = scryptArray[1];

    let response;
    try {
      response = await register({
        variables: {
          email, // CHANGE THIS TO USERNAME, NEED TO CHANGE GRAPHQL SERVER TOO
          username,
          password: authKey,
        },
      });

      console.log(response);
      history.push("/login");
    } catch (err) {
      console.log(error?.message);
      setIsError(true);
    }
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

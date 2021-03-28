import { scrypt } from "scrypt-js";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../../generated/graphql";

interface RegisterProps {}

export const Register: React.FC<RegisterProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register] = useRegisterMutation();

  const history = useHistory();

  return (
    <div className="col-lg-8 offset-lg-2">
      <h2>Register</h2>
      <form
        name="form"
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("form submitted");

          const passwordArray: Uint8Array = new TextEncoder().encode(password);
          const saltArray: Uint8Array = new TextEncoder().encode("salt");

          const pass: any = await scrypt(
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
              email,
              password: finalPass,
            },
          });

          console.log(response);
          history.push("/");
        }}
      >
        <div className="form-group">
          <input
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            register
          </button>
          <Link to="/login" className="btn btn-link">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

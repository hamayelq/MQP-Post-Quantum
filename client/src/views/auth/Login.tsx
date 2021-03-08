import { scrypt } from "scrypt-js";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { setAccessToken } from "../../accessToken";
import { MeDocument, MeQuery, useLoginMutation } from "../../generated/graphql";

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { error }] = useLoginMutation();

  return (
    <div className="col-lg-8 offset-lg-2">
      <h2>Login</h2>
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

          // crypto.getCiphers();

          // scrypt("asdasd", "salt", 32, (err, derivedKey) => {
          //   if (err) throw err;
          //   console.log(derivedKey.toString("hex"));
          // });

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
            login
          </button>
          <Link to="/register" className="btn btn-link">
            Register
          </Link>
        </div>
        {error && (
          <div className="form-group">incorrect username or password</div>
        )}
      </form>
    </div>
  );
};

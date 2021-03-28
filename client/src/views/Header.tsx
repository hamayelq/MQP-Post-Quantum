import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  // look into fetch policy and how it works
  // don't want to use network only everywhere
  // cuz no cache (can just get rid of "network-only" then in query)

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>you are logged in as: {data.me.email} </div>;
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <header>
      <div>
        <Link to="/">home</Link>
      </div>
      <div>
        <Link to="/register">register</Link>
      </div>
      <div>
        <Link to="/login">login</Link>
      </div>
      <div>
        <Link to="/logindemo">Login (updated)</Link>
      </div>
      <div>
        <Link to="/bye">bye</Link>
      </div>
      <div>
        <Link to="/ntru">ntru test</Link>
      </div>
      {/* <div>
        {!loading && data && data.me && (
          <button
            onClick={async () => {
              await logout(); // logout
              setAccessToken(""); // set access token to null as well
              await client.resetStore();
            }}
          >
            logout
          </button>
        )}
      </div> */}
      {body}
    </header>
  );
};

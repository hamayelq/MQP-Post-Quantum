import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" }); // network-only not reading from cache, request every time
  const [logout, { client }] = useLogoutMutation();

  if (loading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>no data</div>;
  }

  return (
    <div>
      <div>
        <div>users:</div>
        <ul>
          {data.users.map((user) => {
            return (
              <li key={user.id}>
                {user.email}, {user.id}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        {!loading && data && (
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
      </div>
    </div>
  );
};

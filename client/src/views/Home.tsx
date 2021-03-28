import React from "react";
import { LogoutButton } from "../components/LogoutButton";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" }); // network-only not reading from cache, request every time

  if (loading) {
    return <div>loading!!!!...</div>;
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
        <LogoutButton />
      </div>
    </div>
  );
};

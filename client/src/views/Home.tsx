import React from "react";
import { Link } from "react-router-dom";
import { useUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data, loading } = useUsersQuery({ fetchPolicy: "network-only" }); // network-only not reading from cache, request every time

  if (!data || loading) {
    return <div>loading...</div>;
  }

  return (
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
  );
};

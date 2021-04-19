import React from "react";
import { LogoutButton } from "../components/LogoutButton";
import { useGetUsersQuery } from "../generated/graphql";

interface Props {}

export const Home: React.FC<Props> = () => {
  const userUuid: string = sessionStorage.getItem("userUuid") || "";

  const { data, loading } = useGetUsersQuery({
    variables: { uuid: userUuid },
    fetchPolicy: "network-only",
  }); // network-only not reading from cache, request every time

  if (loading) {
    return <div>loading!!!!...</div>;
  }

  if (!data) {
    console.log(data);
    return <div>no data</div>;
  }

  return (
    <div>
      <div>
        <div>users:</div>
        <ul>
          {data.getUsers.map((user) => {
            return (
              <li key={user.id}>
                {user.username}, {user.uuid}
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

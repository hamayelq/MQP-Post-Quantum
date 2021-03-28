import React from "react";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface LogoutButtonProps {}

export const LogoutButton: React.FC<LogoutButtonProps> = () => {
  const [logout, { client }] = useLogoutMutation();
  const { data, loading } = useMeQuery();

  return (
    <>
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
    </>
  );
};

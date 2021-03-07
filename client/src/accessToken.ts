import { access } from "fs";

export let accessToken = "";

export const setAccessToken = (s: string) => {
  accessToken = s;
};

export const getAccessToken = () => {
  return access;
};

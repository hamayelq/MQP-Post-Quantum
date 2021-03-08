export let accessToken: string | null = "";

/* should be sticking this in state management library */
/* and/or put this into localstorage */

export const setAccessToken = (s: string | null) => {
  accessToken = s;
};

export const getAccessToken = () => {
  return accessToken;
};

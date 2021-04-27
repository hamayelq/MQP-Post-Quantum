/* should be sticking this in state management library */
/* and/or put this into localstorage */

export const setAccessToken = (newToken: string) => {
  localStorage.setItem("accessToken", newToken);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

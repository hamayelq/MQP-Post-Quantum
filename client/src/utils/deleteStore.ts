import { setAccessToken } from "../accessToken";

export const deleteStore = () => {
  setAccessToken("");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userUuid");
  sessionStorage.removeItem("userUsername");
  sessionStorage.removeItem("ntruPublicKey");
  sessionStorage.removeItem("ntruPrivateKey");
  sessionStorage.removeItem("encrArray");
};

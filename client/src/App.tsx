import React, { useState, useEffect } from "react";
import { setAccessToken } from "./accessToken";
import { ThemeProvider } from "@material-ui/core";
import GlobalStyles from "./components/GlobalStyles";
import useSettings from "./hooks/useSettings";
import { createTheme } from "./theme";
import { Routes } from "./Routes";
import RTL from "./components/RTL";
import LoadingScreen from "./components/LoadingScreen";

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={settings.direction}>
        <GlobalStyles />
        <Routes />
      </RTL>
    </ThemeProvider>
    // <div className="jumbotron">
    //   <div className="container">
    //     <div className="col-md-8 offset-md-2">
    //       <Routes />
    //     </div>
    //   </div>
    // </div>
  );
};

export default App;

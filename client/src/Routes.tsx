import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Bye } from "./views/auth/Bye";
import { LoginView } from "./views/authentication/LoginView";
import { RegisterView } from "./views/authentication/RegisterView";
import { Chat } from "./views/chat/Chat";
import { Home } from "./views/Home";
import Ntrutest from "./views/ntrutest/ntrutest";

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        {/* <Header /> */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={RegisterView} />
          <Route exact path="/login" component={LoginView} />
          <Route exact path="/chat" component={Chat} />
          <Route exact path="/bye" component={Bye} />
          <Route exact path="/ntru" component={Ntrutest} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

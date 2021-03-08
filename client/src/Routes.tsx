import React from "react";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Bye } from "./views/auth/Bye";
import { Login } from "./views/auth/Login";
import { Register } from "./views/auth/Register";
import { Header } from "./views/Header";
import { Home } from "./views/Home";
import Ntrutest from "./views/ntrutest/ntrutest";

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/bye" component={Bye} />
          <Route exact path="/ntru" component={Ntrutest} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

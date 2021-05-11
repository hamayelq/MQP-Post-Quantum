import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Bye } from "./views/auth/Bye";
import { LoginView } from "./views/authentication/LoginView";
import { RegisterView } from "./views/authentication/RegisterView";
import { Chat } from "./views/chat/Chat";
import { Home } from "./views/Home";
import Ntrutest from "./views/ntrutest/ntrutest";

interface GuardedRouteProps {
  component: React.FC;
  exact: boolean;
  path: string;
}

const GuardedRoute: React.FC<GuardedRouteProps> = (props) => {
  const { component: Component, exact, path } = props;
  const auth = sessionStorage.getItem("userUuid");

  if (auth && (path === "/login" || path === "register"))
    return <Redirect to="/chat" />;

  return (
    <Route
      path={path}
      exact={exact}
      render={() => (auth ? <Component /> : <Redirect to="/login" />)}
    />
  );
};

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        {/* <Header /> */}
        <Switch>
          <GuardedRoute exact={true} path="/" component={Home} />
          <Route exact={true} path="/register" component={RegisterView} />
          <Route exact={true} path="/login" component={LoginView} />
          <GuardedRoute exact={true} path="/chat/" component={Chat} />
          <GuardedRoute exact={true} path="/chat/:threadKey" component={Chat} />
          <GuardedRoute exact={true} path="/bye" component={Bye} />
          <Route exact={true} path="/ntru" component={Ntrutest} />
        </Switch>
      </div>
    </BrowserRouter>
  );
};

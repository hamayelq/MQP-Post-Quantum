import ReactDOM from "react-dom";
import "./index.css";
import { Routes } from "./Routes";
// import ApolloClient from "apollo-boost";
import {
  ApolloProvider,
  ApolloLink,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  concat,
} from "@apollo/client";
import { getAccessToken } from "./accessToken";

const httpLink = new HttpLink({
  uri: "http://172.27.76.249:4000/graphql",
  credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward): any => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        authorization: `bearer ${accessToken}`,
      },
    });
  }

  return forward(operation);
});

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  // link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>,
  document.getElementById("root")
);

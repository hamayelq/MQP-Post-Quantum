import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'ntru';
import { ntru } from 'ntru';
import encrypt from './utils/encrypt';
// import { getKeyPair } from "./constants";

function App() {
  (async () => {
    // const response = await ntru.keyPair();
    // getKeyPair();
    // console.log(response);
  })();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >

          U WHATs
        </a>
      </header>
    </div>
  );
}

export default App;

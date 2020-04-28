import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/protected.route";
import SignIn from "./components/signIn";
import Home from "./components/home";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={SignIn} />
        <ProtectedRoute path="/app" component={Home} />
        <Route path="*" component={Home} />
      </Switch>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  rootElement
);

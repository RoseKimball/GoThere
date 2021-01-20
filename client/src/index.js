import React, { useContext, useReducer } from "react";
import context from "./context";
import reducer from "./reducer";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserRoute from "./protectedRoute";

import App from "./pages/App";
import Splash from "./pages/Splash";

import "mapbox-gl/dist/mapbox-gl.css";
import * as serviceWorker from "./serviceWorker";

const Root = () => {
  const initialState = useContext(context);
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);
  return (
    <Router>
      <context.Provider value={{ state, dispatch }}>
        <Switch>
          <UserRoute exact path="/" component={App} />
          <Route path="/login" component={Splash} />
        </Switch>
      </context.Provider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

serviceWorker.unregister();

import React, { useContext } from "react";
import context from "./context";
import { Redirect } from "react-router-dom";
import { Route } from "react-router-dom";

const UserRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(context);

  return (
    <Route
      {...rest}
      render={props =>
        !state.isAuth ? <Redirect to="/login" /> : <Component {...props} />
      }
    />
  );
};

export default UserRoute;

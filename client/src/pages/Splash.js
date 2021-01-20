import React, { useContext } from "react";
import Login from "../components/Auth/Login";
import context from "../context";
import { Redirect } from "react-router-dom";

const Splash = () => {
  const { state } = useContext(context);

  return state.isAuth ? <Redirect to="/" /> : <Login />;
};

export default Splash;

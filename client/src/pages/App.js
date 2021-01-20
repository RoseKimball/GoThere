import React from "react";
import withRoot from "../withRoot";
import Header from "../components/Header";
import Map from "../components/Map";
import "mapbox-gl/dist/mapbox-gl.css";

const App = () => {
  return (
    <div>
      <Header />
      <Map />
    </div>
  );
};

export default withRoot(App);

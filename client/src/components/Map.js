import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import MapGL, { Marker } from "react-map-gl";
import PinIcon from "./PinIcon";
import context from "../context";
import Blog from "./Blog";
import { useClient } from "../client";
import { GET_PINS_QUERY } from "../graphql/queries";
import differenceInMinutes from "date-fns/difference_in_minutes";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const initial_viewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 8
};

const Map = ({ classes }) => {
  useEffect(() => {
    getPins();
  }, []);
  const [viewport, setViewport] = useState(initial_viewport);
  const [userPosition, setUserPosition] = useState(null);

  const client = useClient();
  const { state, dispatch } = useContext(context);

  useEffect(() => {
    getUserPosition();
  }, []);

  // console.log("viewport after setviewport", viewport);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    console.log("pins", { getPins });
    dispatch({ type: "GET_PINS", payload: getPins });
  };

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        // console.log("viewport in getUserPosition", viewport);
        const { latitude, longitude } = position.coords;
        // console.log(latitude, longitude);
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) {
      return;
    }
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: { longitude, latitude }
    });
  };

  const highlightNewPin = pin => {
    const isNewPin =
      differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "limeGreen" : "darkGreen";
  };

  return (
    <div className={classes.root}>
      <MapGL
        mapboxApiAccessToken="pk.eyJ1IjoibWljaGVsbGVraW1iYWxsIiwiYSI6ImNrazFncHk3NDAwdWcycW51ZnJibWx2NnUifQ.gR7zB0tDjrZ4tNT7Ee_t_A"
        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
        width="100vw"
        height="100vh"
        {...viewport}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        onClick={handleMapClick}
      >
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="red" />
          </Marker>
        )}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size={40} color="hotpink" />
          </Marker>
        )}
        {state.pins &&
          state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon size={40} color={highlightNewPin(pin)} />
            </Marker>
          ))}
      </MapGL>
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);

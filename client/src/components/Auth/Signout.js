import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { GoogleLogout } from "react-google-login";
import context from "../../context";

const Signout = ({ classes }) => {
  const { dispatch } = useContext(context);

  const onSignout = () => {
    dispatch({ type: "SIGNOUT_USER" });
    console.log("user signed out");
  };

  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography variant="body1" className={classes.buttonText}>
            Signout
          </Typography>
          <ExitToAppIcon className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "#b2ff59"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "#b2ff59"
  }
};

export default withStyles(styles)(Signout);

import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import context from "../context";
import NoContent from "../components/Pin/NoContent";
import CreatePin from "../components/Pin/CreatePin";
import { Paper } from "@material-ui/core";
import PinContent from "../components/Pin/PinContent";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const Blog = ({ classes }) => {
  const { state } = useContext(context);
  const { draft, currentPin } = state;
  const mobileSize = useMediaQuery("(max-width: 650px)");

  let blogContent;

  if (!draft && !currentPin) {
    blogContent = <NoContent />;
  } else if (draft && !currentPin) {
    blogContent = <CreatePin />;
  } else if (!draft && currentPin) {
    blogContent = <PinContent />;
  }

  return (
    <Paper className={mobileSize ? classes.rootMobile : classes.root}>
      {blogContent}
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 1000,
    maxHeight: "100vh",
    overflowY: "hidden",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    minWidth: 400,
    width: "100vw",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);

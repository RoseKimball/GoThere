import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import context from "../context";
import NoContent from "../components/Pin/NoContent";
import CreatePin from "../components/Pin/CreatePin";
import { Paper } from "@material-ui/core";

const Blog = ({ classes }) => {
  const { state } = useContext(context);
  const { draft } = state;

  let blogContent;

  if (!draft) {
    blogContent = <NoContent />;
  } else if (draft) {
    blogContent = <CreatePin />;
  }

  return <Paper className={classes.root}>{blogContent}</Paper>;
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    height: "100vh",
    overflowY: "hidden",
    display: "flex",
    justifyContent: "center"
  },
  rootMobile: {
    maxWidth: "100%",
    maxHeight: 300,
    overflowX: "hidden",
    overflowY: "scroll"
  }
};

export default withStyles(styles)(Blog);

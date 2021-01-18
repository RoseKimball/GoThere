import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { withStyles } from "@material-ui/core/styles";
import { GraphQLClient } from "graphql-request"; // library to make requests with GQL
import context from "../../context";
import Typography from "@material-ui/core/Typography";
import { ME_QUERY } from "../../graphql/queries";

const Login = ({ classes }) => {
  const { dispatch } = useContext(context);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: {
          authorization: idToken
        }
      });
      const { me } = await client.request(ME_QUERY);
      // console.log(me);
      dispatch({ type: "LOGIN_USER", payload: me });
    } catch (err) {
      onFailure(err);
    }
  };

  const onFailure = err => {
    console.error("Error logging in", err);
  };

  return (
    <div className={classes.root}>
      <Typography
        component="h1"
        variant="h3"
        gutterBottom
        noWrap
        classes={{ h3: classes.typography }}
      >
        Welcome
      </Typography>
      <GoogleLogin
        clientId="413808682583-07se0uv9u6i9kma6g4dbb2jt7vd0d8ue.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        theme="dark"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  typography: {
    color: "rbg(66, 133, 244)"
  }
};

export default withStyles(styles)(Login);

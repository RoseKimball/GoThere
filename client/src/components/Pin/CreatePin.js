import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import context from "../../context";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../client";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

const CreatePin = ({ classes }) => {
  const client = useClient();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { state, dispatch } = useContext(context);

  const mobileSize = useMediaQuery("(max-width: 650px)");

  useEffect(() => {
    console.log("create pin mounted");
  }, []);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setSubmitting(true);

      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude };
      await client.request(CREATE_PIN_MUTATION, variables);
      clearDraft();
      // dispatch({ type: "CREATE_PIN", payload: createPin });
      setSubmitting(false);
      // console.log("pin", { createPin });
    } catch (err) {
      setSubmitting(false);
      console.log("error creating pin", err);
    }
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "GoThere");
    data.append("cloud_name", "dhrvawivc");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dhrvawivc/image/upload",
      data
    );
    return res.data.url;
  };

  const handleDeleteDraft = e => {
    e.preventDefault();
    setTitle("");
    setImage("");
    setContent("");
    dispatch({
      type: "DELETE_DRAFT"
    });
  };

  const clearDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({
      type: "DELETE_DRAFT"
    });
  };

  return (
    <form className={classes.form}>
      <Typography component="h2" variant="h4" color="primary">
        <LandscapeIcon className={classes.iconLarge} color="secondary" />
        Pin Location
      </Typography>
      <TextField
        name="title"
        label="title"
        placeholder="Pin Title"
        onChange={e => setTitle(e.target.value)}
      />

      <div>
        <Typography
          variant="body1"
          color="primary"
          className={classes.imageTitle}
        >
          Add an Image
        </Typography>
        <div color="#b2ff5">
          <input
            accept="image/*"
            id="image"
            type="file"
            className={classes.input}
            onChange={e => setImage(e.target.files[0])}
          />
          <label htmlFor="image">
            <Button
              style={{ color: image && "green" }}
              component="span"
              size="small"
              className={classes.button}
            >
              <AddAPhotoIcon />
            </Button>
          </label>
        </div>
      </div>

      <TextField
        className={classes.contentField}
        name="content"
        label="Content"
        multiline={true}
        rows={mobileSize ? "3" : "6"}
        margin="normal"
        fullwidth="true"
        variant="outlined"
        onChange={e => setContent(e.target.value)}
      ></TextField>

      <div>
        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>

        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !content.trim() || !image || submitting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: "20px"
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%",
    color: "yellow"
  },
  input: {
    display: "none"
  },
  imageTitle: {
    paddingTop: "20px"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);

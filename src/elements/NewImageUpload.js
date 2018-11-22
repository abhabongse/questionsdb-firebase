import React from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import debounce from "lodash/debounce";
import firebase from "firebase/app";
import compose from "recompose/compose";
import classNames from "classnames";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { withPushMessage } from "./MessagePopup";


class NewImageUpload extends React.Component {
  static propTypes = {
    /** This props is provided by message popup. */
    pushMessage: PropTypes.func.isRequired,
    /** This props are provided by Material UI. */
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    /** Where in Firebase storage to store data. */
    storageNamespace: PropTypes.string.isRequired,
    /** Notify of successful new image. */
    pushImageUrl: PropTypes.func.isRequired,
  };

  state = {
    url: "",
    previewUrl: "",
    dropzoneActive: false,
  };

  setPreviewUrl = debounce(
    () => { this.setState(state => ({ previewUrl: state.url })); },
    800,
  );

  handleAddImage = () => {
    if (!this.state.url) {
      return;
    }
    this.props.pushImageUrl(this.state.url);
    this.setState({
      url: "",
      previewUrl: "",
      dropzoneActive: false,
      /** Whether to display progress bar while saving */
      savingPreview: null,
    });
  };

  handleUrlChange = event => {
    const url = event.target.value;
    this.setState({ url });
    this.setPreviewUrl();
  }

  handleUrlKeyPress = event => {
    if (event.key === "Enter") {
      this.handleAddImage();
    }
  }

  performImageUpload = async (files) => {
    this.setState({ dropzoneActive: false });
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    const fileName = file.name;
    const imageRef = firebase.storage()
      .ref(this.props.storageNamespace)
      .child(fileName);

    this.setState({ savingPreview: file.preview });
    try {
      await imageRef.put(file);
      const url = await imageRef.getDownloadURL();
      this.props.pushImageUrl(url);
      this.setState({ savingPreview: null });
      this.props.pushMessage("Image uploaded, but still need to save the question.");
      window.URL.revokeObjectURL(file.preview);
    } catch (error) {
      this.setState({ savingPreview: null });
      this.props.pushMessage(`Error while uploading and image: ${error.message}`);
    }
  };

  cancelImageUpload = () => {
    this.props.pushMessage("Cannot upload the given file.");
    this.setState({ dropzoneActive: false });
  };

  renderImagePreview = () => (
    <CardMedia
      image={this.state.previewUrl}
      title="Thumb Preview"
      className={this.props.classes.imageThumb}
    />
  );

  renderDropzone = () => {
    const dropzoneClassNames = this.state.dropzoneActive
      ? classNames(this.props.classes.dropzone, this.props.classes.active)
      : this.props.classes.dropzone;
    if (this.state.savingPreview) {
      return (
        <CardMedia
          image={this.state.savingPreview}
          title="Thumb Preview"
          className={this.props.classes.imageThumb}
        />
      );
    }
    return (
      <Dropzone
        accept="image/*"
        multiple={false}
        maxSize={1024 * 1024}
        onDropAccepted={this.performImageUpload}
        onDropRejected={this.cancelImageUpload}
        onDragEnter={() => this.setState({ dropzoneActive: true })}
        onDragLeave={() => this.setState({ dropzoneActive: false })}
        style={{ position: "relative" }}
        ref={element => { this.dropzoneRef = element; }}
      >
        <div className={dropzoneClassNames}>
          {this.state.dropzoneActive
            ? "drop the image now"
            : (
              <React.Fragment>
                <div>
                  <FontAwesomeIcon icon="camera" size="2x"/>
                </div>
                <br/>
                click to upload
                <br/>
                (or drag and drop)
              </React.Fragment>
            )
          }
        </div>
      </Dropzone>
    );
  }

  render() {
    return (
      <Grid item xs={12} md={6}>
        <Card className={this.props.classes.imageCard} elevation={2}>
          {this.state.previewUrl
            ? this.renderImagePreview()
            : this.renderDropzone()}
          {this.state.savingPreview && <LinearProgress/>}
          <CardContent className={this.props.classes.content}>
            <TextField
              id="imageUrl"
              name="imageUrl"
              fullWidth
              label="Add new image by URL"
              helperText="Copy and paste image URL here"
              FormHelperTextProps={{
                classes: { root: this.props.classes.helperText }
              }}
              value={this.state.url}
              onChange={this.handleUrlChange}
              onKeyPress={this.handleUrlKeyPress}
            />
            <Button
              color="secondary"
              size="small"
              onClick={this.handleAddImage}
            >
              Add
            </Button>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}


const styles = theme => ({
  imageCard: {
    display: "flex",
    flexDirection: "column",
    fontSize: "1rem",
  },
  imageThumb: {
    height: "120px",
  },
  dropzone: {
    ...theme.typography.button,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: theme.transitions.create(),
    cursor: "pointer",
    height: "120px",
    textAlign: "center",
    background: theme.palette.grey[100],
    "&:hover": {
      background: theme.palette.grey[300],
    },
  },
  active: {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.contrastText,
  },
  content: {
    display: "flex",
    alignItems: "baseline",
  },
  helperText: {
    marginTop: 0.5 * theme.spacing.unit,
  },
});



const withAttached = compose(
  withPushMessage,
  withStyles(styles),
);
export default withAttached(NewImageUpload);

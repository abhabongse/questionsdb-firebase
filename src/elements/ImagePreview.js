import React from "react";
import PropTypes from "prop-types";

import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/core/styles";


class ImagePreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    imageUrl: PropTypes.string,
    onClose: PropTypes.func,
  };

  render () {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={!!this.props.imageUrl}
        onClose={this.props.onClose}
        className={this.props.classes.expandedImageContainer}
      >
        <img
          src={this.props.imageUrl}
          alt="im-modal"
          className={this.props.classes.expandedImage}
        />
      </Modal>
    );
  }
}

const styles = () => ({
  expandedImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedImage: {
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
});

export default withStyles(styles)(ImagePreview);

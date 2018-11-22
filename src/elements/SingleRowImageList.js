import React from "react";
import PropTypes from "prop-types";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { withStyles } from "@material-ui/core/styles";

import ImagePreview from "./ImagePreview";


class SingleRowImageList extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  };

  state = {
    modalImageUrl: null,
  };

  displayImageModal = imageUrl => () => {
    this.setState({ modalImageUrl: imageUrl });
  };

  closeImageModal = () => {
    this.setState({ modalImageUrl: null });
  };

  render () {
    const length = this.props.imageUrls.length;
    const cols = length > 2 ? 2.5 : length;
    return (
      <div className={this.props.classes.root}>
        <GridList className={this.props.classes.gridList} cols={cols}>
          {this.props.imageUrls.map((url, idx) => (
            <GridListTile key={url}>
              <img
                src={url}
                alt={`im-${idx}`}
                onClick={this.displayImageModal(url)}
                className={this.props.classes.image}
              />
            </GridListTile>
          ))}
        </GridList>
        <ImagePreview
          imageUrl={this.state.modalImageUrl}
          onClose={this.closeImageModal}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  image: {
    transition: theme.transitions.create(),
    cursor: "pointer",
    opacity: 1,
    filter: "blur(0)",
    "&:hover": {
      opacity: 0.6,
      filter: "blur(2px)",
    },
  },
});

export default withStyles(styles)(SingleRowImageList);

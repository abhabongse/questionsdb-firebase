import React, { Component } from "react";
import PropTypes from "prop-types";

import Chip from "@material-ui/core/Chip";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  root: {
    height: 24,
    fontWeight: 500,
    marginLeft: 0.25 * theme.spacing.unit,
    marginRight: 0.25 * theme.spacing.unit,
    marginTop: 0.5 * theme.spacing.unit,
  },
  avatar: {
    height: 24,
    width: 24,
    fontSize: "85%",
  },
  label: {
    fontSize: "90%"
  },
  deleteIcon: {
    height: 20,
    width: 20,
    fontSize: "85%",
  },
});

class TokenChip extends Component {
  static propTypes = {
    label: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  }

  render() {
    const { label, classes, ...otherProps } = this.props;
    const chipProps = {
      key: label,
      label: label,
      // color: "primary",
      classes: {
        root: classes.root,
        avatar: classes.avatar,
        label: classes.label,
        deleteIcon: classes.deleteIcon,
      },
      ...otherProps
    };
    return <Chip {...chipProps}/>;
  }
}


export default withStyles(styles)(TokenChip);

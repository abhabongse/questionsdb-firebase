// TODO: add blur filtering above the content

import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";


// Add global funtion to enable/disable bypassing spoilers.
const BYPASS_SPOILERS_LS_ID = "bypass-spoilers";
window.enableByPassSpoilers = () => {
  localStorage.setItem(BYPASS_SPOILERS_LS_ID, "true");
};
window.disableByPassSpoilers = () => {
  localStorage.removeItem(BYPASS_SPOILERS_LS_ID);
};

const styles = theme => ({
  button: {
    marginTop: 0.75 * theme.spacing.unit,
    marginLeft: 1.5 * theme.spacing.unit,
    "& svg": {
      marginLeft: "0.5rem",
    },
  },
  label: {
    color: theme.palette.grey[600],
  },
});

class Spoilers extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);
    // Lookup specific key in local storage to bypass spoiler warning.
    const flag = JSON.parse(localStorage.getItem(BYPASS_SPOILERS_LS_ID));
    this.state = {
      contentHidden: !flag,
    };
  }

  showSpoilers = () => {
    this.setState({ contentHidden: false });
  }

  render() {
    const { children, classes } = this.props;
    if (!this.state.contentHidden) {
      return children;
    }
    return (
      <Button
        onClick={this.showSpoilers}
        className={classes.button}
        classes={{ label: classes.label }}
      >
        Show spoilers
      </Button>
    );
  }
}

export default withStyles(styles)(Spoilers);

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  delayedMessage: {
    ...theme.typography.caption,
    marginTop: 2 * theme.spacing.unit,
    textAlign: "center",
  },
  spinner: {
    display: "flex",
    justifyContent: "space-around",
  },
});

class LoadingSpinner extends Component {
  static propTypes = {
    delayedMessage: PropTypes.string,
    timeout: PropTypes.number,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  state = {
    /** Notify use of some delay after a few seconds have passed. */
    messageShown: false,
  };

  componentDidMount() {
    // Set up timeout before displaying message.
    if (this.props.timeout) {
      this.messageTimeout = setTimeout(() => {
        this.setState({ messageShown: true });
      }, this.props.timeout);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.messageTimeout);
  }

  renderDelayedMessage = () => {
    if (!this.state.messageShown) {
      return null;
    }
    return (
      <div className={this.props.classes.delayedMessage}>
        {this.props.delayedMessage}
      </div>
    );
  };

  render() {
    return (
      <Fragment>
        <div className={this.props.classes.spinner}>
          <CircularProgress size={60}/>
        </div>
        <div className={this.props.classes.delayedMessage}>
          {this.state.messageShown
            ? this.props.delayedMessage
            : "Loading…"
          }
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(LoadingSpinner);

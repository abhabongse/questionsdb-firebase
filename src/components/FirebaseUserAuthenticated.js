import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";

import { withStyles } from "@material-ui/core/styles";

import LoadingSpinner from "../elements/LoadingSpinner";


const styles = theme => ({
  text: {
    ...theme.typography.caption,
    marginTop: 2 * theme.spacing.unit,
    textAlign: "center",
  },
});

/** Render the children only when signed in.*/
class FirebaseUserAuthenticated extends Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  state = {
    authInitialzed: false,
    user: null,
  };

  componentDidMount() {
    // Save the event listener unsubscriber.
    this.authStateChangedDisposer = firebase.auth()
      .onAuthStateChanged(user => {
        this.setState({ authInitialzed: true, user });
      });
  }

  componentWillUnmount() {
    this.authStateChangedDisposer();
  }

  render() {
    if (!this.state.authInitialzed) {
      return <LoadingSpinner/>;
    }
    if (!this.state.user) {
      return (
        <div className={this.props.classes.text}>
          You must be signed in.
        </div>
      );
    }
    return this.props.children;
  }
}

export default withStyles(styles)(FirebaseUserAuthenticated);

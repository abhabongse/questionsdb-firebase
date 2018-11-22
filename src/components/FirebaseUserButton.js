import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import compose from "recompose/compose";

import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { withPushMessage } from "../elements/MessagePopup";
import { mobileTest } from "../helpers/browserHelper";


const styles = theme => ({
  button: {
    transition: theme.transitions.create(),
    borderColor: "hsla(0, 0%, 100%, 0.4)",
    "&:hover": {
      backgroundColor: "hsla(0, 0%, 80%, 0.2)",
    },
    "& svg": {
      marginLeft: "0.5rem",
    },
  },
});

class UserButton extends Component {
  static propTypes = {
    pushMessage: PropTypes.func.isRequired,
    children: PropTypes.node,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  state = {
    authInitialzed: false,
    user: null,
  };

  componentDidMount() {
    // This will display signing in snackbar just in case an
    // authentication with signInWithRedirect is performed on mobile.
    firebase.auth()
      .getRedirectResult()
      .then(
        result => { result.user && this.signInSuccessCallback(result); },
        this.signInErrorCallback,
      );
    // Save the event listener unsubscriber.
    this.authStateChangedDisposer = firebase.auth()
      .onAuthStateChanged(user => {
        this.setState({ authInitialzed: true, user });
      });
  }

  componentWillUnmount() {
    this.authStateChangedDisposer();
  }

  displayMessage = message => {
    this.props.pushMessage(message);
  };

  signInSuccessCallback = result => {
    this.displayMessage(`Signed in as ${result.user.email}`);
  };

  signInErrorCallback = error => {
    this.displayMessage(`Error: ${error.message}`);
  };

  signOutCallback = () => {
    this.displayMessage("Signed out successfully.");
  };

  /**
   * Authenticate user with Firebase:
   * Pop-up on desktop; Redirect on mobile.
   */
  handleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    if (mobileTest()) {
      // Delayed authentication with page redirect
      firebase.auth()
        .signInWithRedirect(provider)
        .catch(this.signInErrorCallback);
    } else {
      // Authentication with pop-up window
      firebase.auth()
        .signInWithPopup(provider)
        .then(this.signInSuccessCallback, this.signInErrorCallback);
    }
  };

  /** Just sign out. */
  handleSignOut = () => {
    firebase.auth().signOut().then(this.signOutCallback);
  };

  /** Render sign-in or sign-out button according to sign-in status. */
  renderButton = (text, icon, clickHandler) => (
    <Button
      variant="outlined"
      color="inherit"
      onClick={clickHandler}
      className={this.props.classes.button}
    >
      {text}
      <FontAwesomeIcon icon={icon} transform="up-1"/>
    </Button>
  );

  render() {
    if (!this.state.authInitialzed) {
      return null;
    }
    if (this.state.user) {
      return this.renderButton("Sign Out", "sign-out-alt", this.handleSignOut);
    } else {
      return this.renderButton("Sign In", "sign-in-alt", this.handleSignIn);
    }
  }
}

const withAttached = compose(
  withPushMessage,
  withStyles(styles),
);
export default withAttached(UserButton);

import React, { Component, Fragment, createContext } from "react";
import PropTypes from "prop-types";
import wrapDisplayName from "recompose/wrapDisplayName";

import Snackbar from "@material-ui/core/Snackbar";


const Context = createContext();

class MessagePopupContext extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  messageQueue = [];
  state = {
    messageOpen: false,
    currentMessage: {},
  };

  processQueue = () => {
    if (this.messageQueue.length > 0) {
      this.setState({
        messageOpen: true,
        currentMessage: this.messageQueue.shift(),
      });
    }
  };

  pushMessage = message => {
    this.messageQueue.push({
      message,
      key: new Date().getTime(),
    });
    if (this.state.messageOpen) {
      this.setState({ messageOpen: false });
    } else {
      this.processQueue();
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ messageOpen: false });
  }

  handleExited = () => {
    this.processQueue();
  }

  popMessage = () => {
    // Pop the oldest messsage at the beginning of the array
    this.setState(state => ({ messages: state.messages.splice(1) }));
  };

  renderMessage = () => (
    <Snackbar
      key={this.state.currentMessage.key}
      open={this.state.messageOpen}
      autoHideDuration={6000}
      onClose={this.handleClose}
      onExited={this.handleExited}
      ContentProps={{ "aria-describedby": "message-id" }}
      message={<span id="message-id">{this.state.currentMessage.message}</span>}
    />
  );

  render() {
    return (
      <Fragment>
        <Context.Provider value={{ pushMessage: this.pushMessage }}>
          {this.props.children}
        </Context.Provider>
        {this.renderMessage()}
      </Fragment>
    );
  }
}

// Second-order component for pushRenderer function on the receiving end.
function withPushMessage(Component) {
  const ComponentWithPushMessage = (props) => (
    <Context.Consumer>
      {value => <Component {...value} {...props}/>}
    </Context.Consumer>
  );
  ComponentWithPushMessage.displayName =
    wrapDisplayName(Component, "withPushMessage");
  return ComponentWithPushMessage;
}

export { MessagePopupContext, withPushMessage };

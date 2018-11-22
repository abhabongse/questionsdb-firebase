// NOT CURRENTLY IN USE

import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


class ConfirmDialog extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    dialogOpen: PropTypes.bool,
    onCloseDialog: PropTypes.func,
    onClickOk: PropTypes.func,
    okLabel: PropTypes.string,
    onClickCancel: PropTypes.func,
    cancelLabel: PropTypes.string,
  };

  renderDescription = () => {
    if (!this.props.description) {
      return null;
    }
    return (
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {this.props.description}
        </DialogContentText>
      </DialogContent>
    );
  }

  render() {
    const {
      title,
      dialogOpen, onCloseDialog,
      onClickOk, okLabel,
      onClickCancel, cancelLabel,
    } = this.props;
    return (
      <Dialog
        open={dialogOpen} onClose={onCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        {this.renderDescription()}
        <DialogActions>
          <Button onClick={onClickCancel}>
            {cancelLabel || "Cancel"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClickOk}
            autoFocus
          >
            {okLabel || "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmDialog;

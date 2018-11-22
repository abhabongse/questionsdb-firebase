import React, { Component } from "react";
import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";


const styles = theme => ({
  root: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    overflow: "hidden",
    flexGrow: 1,
    width: "100%",
  },
  topbar: {
    background: theme.palette.topbar,
  },
  title: {
    flexGrow: 1,
    [theme.breakpoints.up("sm")]: {
      fontSize: "1.6rem",
    },
  },
  topbarButtons: {
    "& svg": {
      marginLeft: "0.5rem",
    },
  },
  toolbarMixin: theme.mixins.toolbar,
  contentLevelA: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.default,
  },
  contentLevelB: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    paddingTop: 2 * theme.spacing.unit,
    paddingRight: 2 * theme.spacing.unit,
    paddingBottom: 6 * theme.spacing.unit,
    paddingLeft: 2 * theme.spacing.unit,
    [theme.breakpoints.up("md")]: {
      paddingTop: 4 * theme.spacing.unit,
      paddingRight: 4 * theme.spacing.unit,
      paddingBottom: 12 * theme.spacing.unit,
      paddingLeft: 4 * theme.spacing.unit,
    },
  },
  contentLevelC: {
    flexGrow: 1,
    width: "100%",
    maxWidth: theme.breakpoints.values.lg,
  },
});


class ResponsiveDrawer extends Component {
  static propTypes = {
    title: PropTypes.node,
    topbarButtons: PropTypes.node,
    content: PropTypes.node,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    theme: PropTypes.object.isRequired,
  };

  state = {
    loginDialogOpen: false,
  };

  toggleLoginDialog = () => {
    this.setState(state => ({ loginDialogOpen: !state.loginDialogOpen }));
  }

  renderTitle = () => (
    <Typography
      variant="title"
      color="inherit"
      noWrap
      className={this.props.classes.title}
    >
      {this.props.title}
    </Typography>
  );

  render() {
    const { classes, topbarButtons, content } = this.props;
    return (
      <div className={classes.root}>
        <AppBar className={classes.topbar}>
          <Toolbar>
            {this.renderTitle()}
            {topbarButtons}
          </Toolbar>
        </AppBar>
        <div className={classes.contentLevelA}>
          <div className={classes.toolbarMixin}/>
          <div className={classes.contentLevelB}>
            <main className={classes.contentLevelC}>
              {content}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import markdown from "../config/markdown";


const styles = theme => ({
  container: {
    ...theme.typography.body1,
    "&, & *": {
      overflowWrap: "break-word",
      boxSizing: "border-box",
      wordWrap: "break-word",
      wordBreak: "break-word",
    },
    "& svg": {
      marginRight: "0.5rem",
    },
    "& p.disabled": {
      color: theme.palette.text.disabled,
    },
    "& img": {
      maxWidth: "100%",
    },
    "& code": {
      paddingRight: "0.125rem",
      paddingLeft: "0.125rem",
      fontSize: "1.1rem",
      color: theme.palette.grey[800],
    },
    "& pre > code.hljs": {
      boxShadow: theme.shadows[1],
      marginTop: 0.75 * theme.spacing.unit,
      marginBottom: 0,
      paddingRight: 2 * theme.spacing.unit,
      paddingLeft: 2 * theme.spacing.unit,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: "white",
      fontSize: "0.875rem",
      lineHeight: 1.25,
      color: "black",
    },
  },
  enhanced: {
    // marginTop: 2 * theme.spacing.unit,
    borderRadius: theme.shape.borderRadius,
    paddingTop: 0.25 * theme.spacing.unit,
    paddingRight: 2 * theme.spacing.unit,
    paddingBottom: 0.25 * theme.spacing.unit,
    paddingLeft: 2 * theme.spacing.unit,
    background: theme.palette.grey[50],
  },
});

class MarkdownDisplay extends Component {
  static propTypes = {
    // TODO: rename to text
    rawtext: PropTypes.string,
    enhanced: PropTypes.bool,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  renderContent = rawtext => (
    markdown.processSync(rawtext).contents
  );

  renderBlank = () => (
    <p className="disabled">
      <FontAwesomeIcon size="sm" icon="comment-slash"/>
      The content is empty.
    </p>
  );

  renderInternal = resolvedClassName => (
    <div className={resolvedClassName}>
      {this.props.rawtext && this.props.rawtext.trim()
        ? this.renderContent(this.props.rawtext)
        : this.renderBlank()}
    </div>
  );

  render() {
    const { enhanced, classes } = this.props;
    if (!enhanced) {
      return this.renderInternal(classes.container);
    }
    const className = classNames(classes.enhanced, classes.container);
    return <Paper elevation={1}>{this.renderInternal(className)}</Paper>;
  }
}

export default withStyles(styles)(MarkdownDisplay);

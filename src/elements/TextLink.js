import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { withStyles } from "@material-ui/core/styles";


const styles = () => ({
  root: {
    color: "inherit",
  },
  underline: {
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline"
    },
    "&:focus": {
      textDecoration: "underline"
    },
  },
});

class TextLink extends Component {
  static propTypes = {
    underline: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    children: PropTypes.node,
    className: PropTypes.string,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  render() {
    const { underline, children, className, classes, ...otherProps }
      = this.props;
    const resolvedUnderline =
      (typeof underline === "function") ? underline() : underline;
    const computedClassName = resolvedUnderline
      ? classNames(classes.root, className)
      : classNames(classes.root, classes.underline, className);
    return (
      <Link className={computedClassName} {...otherProps}>
        {children}
      </Link>
    );
  }
}

export default withStyles(styles)(TextLink);

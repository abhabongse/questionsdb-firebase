import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import IconButton from "@material-ui/core/IconButton";


class IconButtonLink extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    replace: PropTypes.bool,
    innerRef: PropTypes.func,
    children: PropTypes.node,
  };

  render() {
    const { to, replace, innerRef, children, ...otherProps } = this.props;
    const linkRenderer = linkProps => (
      <Link to={to} replace={replace} innerRef={innerRef} {...linkProps}/>
    );
    return (
      <IconButton component={linkRenderer} {...otherProps}>
        {children}
      </IconButton>
    );
  }
}

export default IconButtonLink;

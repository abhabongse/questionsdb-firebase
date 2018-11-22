import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "@material-ui/core/Button";


class ButtonLink extends Component {
  static propTypes = {
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    replace: PropTypes.bool,
    innerRef: PropTypes.func,
    children: PropTypes.node,
  };

  renderLink = linkProps => (
    <Link
      to={this.props.to}
      replace={this.props.replace}
      innerRef={this.props.innerRef}
      {...linkProps}
    />
  );

  render() {
    const { children, ...otherProps } = this.props;
    delete otherProps.to;
    delete otherProps.replace;
    delete otherProps.innerRef;
    return (
      <Button component={this.renderLink} {...otherProps}>
        {children}
      </Button>
    );
  }
}

export default ButtonLink;

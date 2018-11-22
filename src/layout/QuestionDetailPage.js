import React from "react";
import PropTypes from "prop-types";

import Portal from "@material-ui/core/Portal";
import ArrowBack from "@material-ui/icons/ArrowBack";

import QuestionContentCard from "../components/QuestionContentCard";
import IconButtonLink from "../elements/IconButtonLink";


class QuestionDetailPage extends React.Component {
  static propTypes = {
    /** These 3 props are passed down via router. */
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    /** Reference of title DOM. */
    titleRef: PropTypes.object.isRequired,
  };

  getQuestionId = () => this.props.match.params.questionId;

  renderBackButton = () => (
    <Portal container={this.props.titleRef.current}>
      <IconButtonLink to="/questions" color="inherit">
        <ArrowBack/>
      </IconButtonLink>
      {" "}
      Question Details
    </Portal>
  );

  render() {
    return (
      <React.Fragment>
        {this.renderBackButton()}
        <QuestionContentCard single questionId={this.getQuestionId()}/>
      </React.Fragment>
    );
  }
}

export default QuestionDetailPage;

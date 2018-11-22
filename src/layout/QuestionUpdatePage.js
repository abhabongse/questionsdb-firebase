import React from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import uuidv4 from "uuid/v4";

import Portal from "@material-ui/core/Portal";
import ArrowBack from "@material-ui/icons/ArrowBack";

import QuestionEditorCard from "../components/QuestionEditorCard";
import IconButtonLink from "../elements/IconButtonLink";
import LoadingSpinner from "../elements/LoadingSpinner";
import { withPushMessage } from "../elements/MessagePopup";
import { getEmptyQuestion } from "../helpers/dataHelper";


class QuestionUpdatePage extends React.Component {
  static propTypes = {
    /** These 3 props are passed down via router. */
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    /** This props is provided by message popup. */
    pushMessage: PropTypes.func.isRequired,
    /** Reference of title DOM. */
    titleRef: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // To be filled from Firestore
      populated: false,
      question: null,
      updatedCount: 0,
    };
    this.newQuestion = !this.props.match.params.questionId;
    this.questionId = this.props.match.params.questionId || uuidv4();
    this.docRef = firebase.firestore()
      .collection("questions")
      .doc(this.questionId);
  }

  componentDidMount() {
    this.detachFirestore = this.docRef.onSnapshot(doc => {
      this.setState(state => ({
        populated: true,
        question: doc.data() || getEmptyQuestion(),
        updatedCount: state.updatedCount + 1,
      }));
    });
  }

  renderBackButton = () => (
    <Portal container={this.props.titleRef.current}>
      <IconButtonLink
        to={this.newQuestion
          ? "/questions"
          : `/questions/${this.questionId}`
        }
        color="inherit"
      >
        <ArrowBack/>
      </IconButtonLink>
      {" "}
      {this.newQuestion ? "Create Question" : "Edit Question"}
    </Portal>
  );

  render() {
    // Data is not yet ready
    if (!this.state.populated) {
      return <LoadingSpinner/>;
    }
    return (
      <React.Fragment>
        {this.renderBackButton()}
        <QuestionEditorCard
          questionId={this.questionId}
          startingQuestion={this.state.question}
          externallyModified={this.state.updatedCount > 1}
        />
      </React.Fragment>
    );
  }
}

export default withPushMessage(QuestionUpdatePage);

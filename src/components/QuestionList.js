import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import firebase from "firebase/app";
import compose from "recompose/compose";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import QuestionContentCard from "../components/QuestionContentCard";
import { withPushMessage } from "../elements/MessagePopup";
import LoadingSpinner from "../elements/LoadingSpinner";


const QUERY_LIMIT = 10;

class QuestionList extends React.Component {
  static propTypes = {
    /** This props is provided by message popup. */
    pushMessage: PropTypes.func.isRequired,
    /** This props are provided by Material UI. */
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    /**
      This prop contains content filtering information, which is
      an array of 3-element arrays. Each inner array represents
      the arguments to the where-clause of Firestore filtering.
      */
    filters: PropTypes.arrayOf(PropTypes.array),
  };

  constructor(props) {
    super(props);
    this.state = {
      populated: false,  // whether data has been populated by Firestore
      questionList: [],  // list of question IDs
      nextBatchAnchor: null,  // next page anchor
      loadingMore: false,     // whether a batch is still loading
      errorCode: null,
    };
    this.collectionRef = firebase.firestore().collection("questions");
  }

  getQueryRef = () => {
    let queryRef = this.collectionRef;
    for (const filter of this.props.filters || []) {
      queryRef = queryRef.where(...filter);
    }
    queryRef = queryRef.orderBy("createdAt");
    return queryRef;
  };

  componentDidMount() {
    this.fetchFirstPage();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.filters, prevProps.filters)) {
      this.fetchFirstPage();
    }
  }

  fetchFirstPage = () => {
    this.runQuery(this.getQueryRef().limit(QUERY_LIMIT), true);
  }

  fetchNextPage = () => {
    if (this.state.nextBatchAnchor) {
      const nextBatchAnchor = this.state.nextBatchAnchor;
      this.setState({ nextBatchAnchor: null, loadingMore: true });
      this.runQuery(
        this.getQueryRef()
          .startAfter(nextBatchAnchor)
          .limit(QUERY_LIMIT)
      );
    }
  }

  runQuery = async (query, isFirstPage) => {
    try {
      const querySnapshot = await query.get();
      const questionList = isFirstPage ? [] : this.state.questionList.slice();
      querySnapshot.forEach(doc => {
        if (questionList.indexOf(doc.id) === -1) {
          questionList.push(doc.id);
        }
      });
      const nextBatchAnchor = querySnapshot.size === QUERY_LIMIT
        ? querySnapshot.docs[querySnapshot.size-1]
        : null;
      this.setState({
        populated: true,
        questionList,
        nextBatchAnchor,
        loadingMore: false,
      });
    } catch (error) {
      const code = error.code;
      this.setState({
        populated: true,
        loadingMore: false,
        errorCode: code,
      });
    }
  };

  renderQuestion = questionId => (
    <Grid item xs={12} key={questionId}>
      <QuestionContentCard questionId={questionId}/>
    </Grid>
  );

  renderLoadMoreButton = () => {
    if (this.state.loadingMore) {
      return (
        <Card elevation={2} className={this.props.classes.loadMoreCard}>
          <Button size="large" className={this.props.classes.loadMoreButton}>
            Loading ...
          </Button>
        </Card>
      );
    }
    if (this.state.nextBatchAnchor) {
      return (
        <Card elevation={2} className={this.props.classes.loadMoreCard}>
          <Button
            size="large"
            className={this.props.classes.loadMoreButton}
            onClick={() => { this.fetchNextPage(); }}
          >
            Load More
          </Button>
        </Card>
      );
    } else {
      return (
        <div className={this.props.classes.endMessage}>
          All questions are loaded.
        </div>
      );
    }
  };

  render() {
    if (!this.state.populated) {
      // Data is not yet ready
      return <LoadingSpinner/>;
    }
    if (this.state.errorCode) {
      return (
        <div className={this.props.classes.endMessage}>
          {this.state.errorCode === "permission-denied"
            ? "You do not have permission."
            : "An error occurred."
          }
        </div>
      );
    }
    if (this.state.questionList.length === 0) {
      return (
        <div className={this.props.classes.endMessage}>
          There are no results.
        </div>
      );
    }
    return (
      <Grid container spacing={16}>
        {this.state.questionList.map(questionId => this.renderQuestion(questionId))}
        <Grid item xs={12}>
          {this.renderLoadMoreButton()}
        </Grid>
      </Grid>
    );
  }
}

const styles = theme => ({
  loadMoreCard: {
    display: "flex",
  },
  loadMoreButton: {
    flexGrow: 1,
    height: 48,
    color: theme.palette.grey[700],
  },
  endMessage: {
    ...theme.typography.caption,
    padding: theme.spacing.unit,
  },
});

const withAttached = compose(
  withPushMessage,
  withStyles(styles),
);
export default withAttached(QuestionList);

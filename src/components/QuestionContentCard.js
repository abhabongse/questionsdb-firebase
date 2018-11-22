import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import capitalize from "lodash/capitalize";
import firebase from "firebase/app";
import compose from "recompose/compose";
import classNames from "classnames";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ButtonLink from "../elements/ButtonLink";
import LoadingSpinner from "../elements/LoadingSpinner";
import MarkdownDisplay from "../elements/MarkdownDisplay";
import { withPushMessage } from "../elements/MessagePopup";
import SingleRowImageList from "../elements/SingleRowImageList";
import Spoilers from "../elements/Spoilers";
import TokenChip from "../elements/TokenChip";
import TextLink from "../elements/TextLink";
import { mobileTest } from "../helpers/browserHelper";
import { Categories, getAvatar } from "../helpers/dataHelper";


class QuestionContentCard extends React.Component {
  static propTypes = {
    /** This props is provided by message popup. */
    pushMessage: PropTypes.func.isRequired,
    /** This props are provided by Material UI. */
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    /** ID of question to display. */
    questionId: PropTypes.string.isRequired,
    /** Whether this question is viewed on its own page. */
    single: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      // To be filled from Firestore
      populated: false,
      question: null,
      errorCode: null,
      displayModeButton: null,
    };
    this.docRef = firebase.firestore()
      .collection("questions")
      .doc(props.questionId);
  }

  componentDidMount() {
    this.detachFirestore = this.docRef.onSnapshot(
      doc => {
        this.setState({
          populated: true,
          question: doc.data(),
        });
      },
      error => {
        const code = error.code;
        this.setState({
          populated: true,
          errorCode: code,
        });
      }
    );
  }

  componentWillUnmount() {
    this.detachFirestore();
  }

  getDisplayMode = () => {
    const mode = this.state.question.deleted
      ? "deleted"
      : (this.state.question.archived ? "archived" : "ok");
    const icon = {
      ok: "check-circle", archived: "archive", deleted: "trash"
    }[mode];
    return { mode, icon };
  }

  toggleDisplayModeDropdown = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      displayModeButton: state.displayModeButton ? null : currentTarget
    }));
  };

  closeDisplayModeDropdown = () => {
    this.setState({ displayModeButton: null });
  };

  markQuestion = (archived, deleted) => async () => {
    this.closeDisplayModeDropdown();
    try {
      await this.docRef.update({ archived, deleted });
      this.props.pushMessage("The question is updated.");
    } catch (error) {
      this.props.pushMessage(`Failed updating question: ${error.message}`);
    }
  };


  renderQuestionId = () => (
    <div className={this.props.classes.questionId}>
      <TextLink
        to={`/questions/${this.props.questionId}`}
        underline={mobileTest()}
      >
        {this.props.questionId}
        <FontAwesomeIcon size="sm" icon="link"/>
      </TextLink>
    </div>
  );

  renderDisplayModeButton = () => {
    const { mode, icon } = this.getDisplayMode();
    return (
      <ClickAwayListener onClickAway={this.closeDisplayModeDropdown}>
        <div>
          <Popper
            open={!!this.state.displayModeButton}
            anchorEl={this.state.displayModeButton}
            placement="top-end"
            transition
            disablePortal
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps}>
                <Paper>
                  <MenuList>
                    <MenuItem onClick={this.markQuestion(false, false)}>
                      Default
                    </MenuItem>
                    <MenuItem onClick={this.markQuestion(false, true)}>
                      Mark deleted
                    </MenuItem>
                    <MenuItem onClick={this.markQuestion(true, false)}>
                      Mark archived
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Button
            size="small"
            color="secondary"
            onClick={this.toggleDisplayModeDropdown}
            className={this.props.classes.displayModeButton}
          >
            {mode}
            <FontAwesomeIcon
              size="sm"
              icon={icon}
              className="icon-pad-left"
            />
          </Button>
        </div>
      </ClickAwayListener>
    );
  };

  renderEmpty = () => (
    <div className={this.props.classes.emptyData}>
      <i>None specified</i>
    </div>
  );

  renderText = field => {
    const rawtext = this.state.question[field] || "";
    return (
      <div>
        <div className={this.props.classes.fieldLabel}>
          {capitalize(field)}
        </div>
        {rawtext.trim()
          ? <Spoilers><MarkdownDisplay rawtext={rawtext}/></Spoilers>
          : this.renderEmpty()
        }
      </div>
    );
  }

  renderSingleChip = value => (
    <TokenChip key={value} label={capitalize(value)} avatar={getAvatar(value)}/>
  );

  renderChipList = (category, label) => {
    const allSubfields = Categories[category];
    const selectedSubfields = allSubfields.filter(
      subfield => this.state.question[category][subfield]
    );
    return (
      <div>
        <div className={this.props.classes.fieldLabel}>
          {label}
        </div>
        {selectedSubfields.length
          ? selectedSubfields.map(this.renderSingleChip)
          : this.renderEmpty()
        }
      </div>
    );
  }

  renderSingleTag = value => (
    <TokenChip key={value} label={value} avatar={getAvatar("tag")}/>
  );

  renderTagList = () => {
    const tags = this.state.question.tags;
    return (
      <div>
        <div className={this.props.classes.fieldLabel}>
          Tags
        </div>
        {tags.length
          ? tags.map(this.renderSingleTag)
          : this.renderEmpty()
        }
      </div>
    );
  }

  renderActionButtons = () => (
    <span>
      {!this.props.single &&
        <ButtonLink to={`/questions/${this.props.questionId}`}>
          View Single
        </ButtonLink>
      }
      <ButtonLink to={`/questions/${this.props.questionId}/edit`}>
        Edit
      </ButtonLink>
    </span>
  );

  render() {
    // Data is not yet ready
    if (!this.state.populated) {
      return (
        <Card elevation={2}>
          <CardContent>
            <LoadingSpinner/>
          </CardContent>
        </Card>
      );
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
    // Data is empty, redirect to main page
    if (!this.state.question) {
      this.props.pushMessage("The question does not exist.");
      return <Redirect to="/questions"/>;
    }

    const chipSectionClassName = classNames(
      this.props.classes.container,
      this.props.classes.addLeftBorder
    );
    return (
      <Card elevation={2}>
        <CardContent>
          <div className={this.props.classes.cardHeader}>
            {this.renderQuestionId()}
          </div>
          {this.state.question.imageUrls &&
            this.state.question.imageUrls.length > 0 &&
            <SingleRowImageList imageUrls={this.state.question.imageUrls}/>
          }
          <MarkdownDisplay enhanced rawtext={this.state.question.statement}/>
          <Grid container>
            <Grid item xs={12} md={8} className={this.props.classes.container}>
              {this.renderText("solution")}
              {this.renderText("note")}
            </Grid>
            <Grid item xs={12} md={4} className={chipSectionClassName}>
              {this.renderChipList("format", "Question Format")}
              {this.renderChipList("round", "Competition Round")}
              {this.renderChipList("region", "Region")}
              {this.renderTagList()}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className={this.props.classes.cardActions}>
          {this.renderActionButtons()}
          {this.renderDisplayModeButton()}
        </CardActions>
      </Card>
    );
  }
}

const styles = theme => ({
  cardHeader: {
    marginBottom: theme.spacing.unit,
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between",
  },
  displayModeButton: {
    fontSize: "80%",
  },
  questionId: {
    ...theme.typography.caption,
    marginBottom: 1.5 * theme.spacing.unit,
    fontSize: "1rem",
    fontWeight: 500,
    "& a, & > span": {
      fontSize: "100%",
      fontFamily: "monospace",
    },
    "& svg": {
      color: theme.palette.text.hint,
      marginLeft: "0.25rem",
    },
    "&, & *": {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: theme.palette.text.secondary,
    },
  },
  container: {
    "& > div": {
      boxSizing: "border-box",
      marginTop: theme.spacing.unit,
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
    },
    [theme.breakpoints.up("md")]: {
      marginTop: 2 * theme.spacing.unit,
      marginBottom: 2 * theme.spacing.unit,
      "& > div": {
        paddingLeft: 2 * theme.spacing.unit,
        paddingRight: 2 * theme.spacing.unit,
      }
    }
  },
  addLeftBorder: {
    [theme.breakpoints.up("md")]: {
      borderLeft: `1px ${theme.palette.divider} solid`,
    }
  },
  fieldLabel: {
    ...theme.typography.subheading,
    fontWeight: 500,
  },
  emptyData: {
    ...theme.typography.body1,
    color: theme.palette.text.secondary,
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
export default withAttached(QuestionContentCard);

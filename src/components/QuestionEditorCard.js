import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import pullAll from "lodash/pullAll";
import firebase from "firebase/app";
import compose from "recompose/compose";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ButtonLink from "../elements/ButtonLink";
import ConfirmDialog from "../elements/ConfirmDialog";
import ImagePreview from "../elements/ImagePreview";
import MarkdownDisplay from "../elements/MarkdownDisplay";
import { withPushMessage } from "../elements/MessagePopup";
import NewImageUpload from "../elements/NewImageUpload";
import TextLink from "../elements/TextLink";
import TokenMultipleSelect from "../elements/TokenMultipleSelect";
import TokenTextField from "../elements/TokenTextField";
import { mobileTest } from "../helpers/browserHelper";
import { Categories } from "../helpers/dataHelper";


class QuestionEditorCard extends React.Component {
  static propTypes = {
    /** This props is provided by message popup. */
    pushMessage: PropTypes.func.isRequired,
    /** These 3 props are passed down via withRouter. */
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    /** This props are provided by Material UI. */
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    /** ID of question to display. */
    questionId: PropTypes.string.isRequired,
    startingQuestion: PropTypes.object,
    externallyModified: PropTypes.bool,
    /** Whether this question is viewed on its own page. */
    single: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      /** Question in edit */
      question: props.startingQuestion,
      /** List of already-uploaded images marked for removal. */
      removedImageUrls: [],
      /** List of pending images to save. */
      addedImageUrls: [],
      /**
       * Whether the confirm dialog for save is displayed
       * Only important when the question is externally modified
       * which implies an override in content
       */
      confirmSaveDialog: false,
      /** Whether to display progress bar while saving */
      saving: false,
      /** Image URL to show modal preview. null = hidden */
      imagePreviewUrl: null,
    };
    this.docRef = firebase.firestore()
      .collection("questions")
      .doc(this.props.questionId);
  }

  getSerializedQuestion = () => {
    const { imageUrls, ...question } = this.state.question;
    pullAll(imageUrls, this.state.removedImageUrls);
    return {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      imageUrls,
      ...question,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
  };

  redirectToDetailPage = () => {
    const TIMEOUT_MILLISECONDS = 500;
    setTimeout(
      () => this.props.history.push(`/questions/${this.props.questionId}`),
      TIMEOUT_MILLISECONDS
    );
  };

  openConfirmSaveDialog = () => {
    this.setState({ confirmSaveDialog: true });
  };

  closeConfirmSaveDialog = () => {
    this.setState({ confirmSaveDialog: false });
  };

  saveToFirestore = async () => {
    this.setState({ saving: true });
    this.closeConfirmSaveDialog();
    try {
      await this.docRef.set(this.getSerializedQuestion());
      // this.setState({ saving: false });
      this.props.pushMessage("The question has been saved.");
      this.redirectToDetailPage();
    } catch (error) {
      this.setState({ saving: false });
      this.props.pushMessage(`Error while saving question: ${error.message}`);
    }
  };

  handleSave = () => {
    if (this.props.externallyModified) {
      this.openConfirmSaveDialog();
    } else {
      this.saveToFirestore();
    }
  };

  /** Watch for shortcut keystroke (Ctrl-Enter) */
  handleTextKeyPress = event => {
    const { key, ctrlKey } = event;
    if (ctrlKey && key === "Enter") {
      this.handleSave();
    }
  }

  /** Triggers when text field change its value. */
  handleTextChange = event => {
    const { name, value } = event.target;
    this.setState(state => ({
      question: {
        ...state.question,
        [name]: value,
      },
    }));
  }

  /** Triggers when image is (un)marked for removal */
  handleExistingImageCheckboxChange = event => {
    const url = event.target.value;
    this.setState(state => {
      const removedImageUrls = [...state.removedImageUrls];
      const idx = removedImageUrls.indexOf(url);
      if (idx === -1) {
        removedImageUrls.push(url);
      } else {
        removedImageUrls.splice(idx, 1);
      }
      return { removedImageUrls };
    });
  };

  /** Triggers when a new image is added. */
  handleNewImage = url => {
    const { imageUrls, ...question } = this.state.question;
    if (imageUrls.indexOf(url) !== -1) {
      return;  // already exists
    }
    imageUrls.push(url);
    this.setState({
      question: {
        imageUrls,
        ...question,
      },
      addedImageUrls: [
        ...this.state.addedImageUrls,
        url,
      ],
    });
  };

  /** Triggers when select field change its value. */
  handleSelectChange = (category, selectedItems) => {
    this.setState(state => {
      const categoryObject = {};
      for (const field of Categories[category]) {
        categoryObject[field] = false;
      }
      for (const field of selectedItems) {
        categoryObject[field] = true;
      }
      return {
        question: {
          ...state.question,
          [category]: categoryObject,
        },
      };
    });
  }

  /** Triggers when tag field changed its value. */
  handleTagsChange = tags => {
    this.setState(state => ({
      question: {
        ...state.question,
        tags,
      },
    }));
  }

  renderQuestionId = () => (
    <div className={this.props.classes.questionId}>
      <TextLink to={`/questions/${this.props.questionId}`} underline={mobileTest()}>
        {this.props.questionId}
        <FontAwesomeIcon size="sm" icon="link"/>
      </TextLink>
    </div>
  );

  renderFormSection = sectionName => (
    <Grid item md={3} xs={12}>
      <div className={this.props.classes.formSection}>
        {sectionName}
      </div>
    </Grid>
  );

  renderImageCard = url => (
    <Grid item key={url} xs={12} md={6}>
      <Card className={this.props.classes.imageCard} elevation={2}>
        <CardMedia
          image={url}
          title="Thumb Preview"
          onClick={() => { this.setState({ imagePreviewUrl: url }); }}
          className={this.props.classes.imageThumb}
        />
        <CardContent className={this.props.classes.imageUrl}>
          {url}
        </CardContent>
        <CardActions className={this.props.classes.actions}>
          <FormControlLabel
            label="Delete this"
            control={
              <Checkbox
                checked={this.state.removedImageUrls.indexOf(url) !== -1}
                onChange={this.handleExistingImageCheckboxChange}
                value={url}
              />
            }
          />
          {this.state.addedImageUrls.indexOf(url) !== -1 &&
            <span className={this.props.classes.warnToSave}>
              Still need to save
            </span>
          }
        </CardActions>
      </Card>
    </Grid>
  );

  renderImageUpload = () => (
    <React.Fragment>
      <Grid container spacing={8}>
        {this.state.question.imageUrls.map(this.renderImageCard)}
        <NewImageUpload
          storageNamespace={`/questions/${this.props.questionId}`}
          pushImageUrl={this.handleNewImage}
        />
      </Grid>
      <ImagePreview
        imageUrl={this.state.imagePreviewUrl}
        onClose={() => { this.setState({ imagePreviewUrl: null }); }}
      />
    </React.Fragment>
  );

  renderTextField = (field, label, helperText) => (
    <TextField
      id={field} name={field}
      margin="normal" multiline fullWidth
      label={label} helperText={helperText}
      FormHelperTextProps={{
        classes: { root: this.props.classes.helperText }
      }}
      value={this.state.question[field]}
      onKeyPress={this.handleTextKeyPress}
      onChange={this.handleTextChange}
    />
  );

  renderMultipleSelect = (category, label, helperText) => {
    const allValues = Categories[category];
    const selectedValues = allValues
      .filter(item => this.state.question[category][item]);
    return (
      <TokenMultipleSelect
        name={category}
        label={label}
        helperText={helperText}
        allValues={allValues}
        selectedValues={selectedValues}
        onChange={this.handleSelectChange}
      />
    );
  }

  renderTagsField = () => (
    <TokenTextField
      values={this.state.question.tags}
      label="Tags"
      helperText="Additional tags; hit [Tab] or [Enter] to add."
      onKeyPress={this.handleTextKeyPress}
      onChange={this.handleTagsChange}
    />
  );

  renderSaving = () => (
    this.state.saving ? <LinearProgress/> : null
  );

  renderActionButtons = () => (
    <div className={this.props.classes.actions}>
      <ButtonLink to={`/questions/${this.props.questionId}`}>
        Discard
      </ButtonLink>
      <Button
        color="secondary"
        variant={this.props.externallyModified ? "outlined" : "contained"}
        onClick={this.handleSave}
      >
        {this.props.externallyModified ? "Force Save" : "Save"}
      </Button>
      <ConfirmDialog
        title="Question externally modified"
        description={
          "This question has been modified by other people while " +
          "you are editing this question. If you proceed, your changes " +
          "will override theirs. Proceed?"
        }
        dialogOpen={this.state.confirmSaveDialog}
        onCloseDialog={this.closeConfirmSaveDialog}
        onClickOk={this.saveToFirestore}
        okLabel="Force Save"
        onClickCancel={this.closeConfirmSaveDialog}
        cancelLabel="Go Back"
      />
    </div>
  );

  render() {
    return (
      <Grid container alignItems="flex-start" spacing={16}>
        {this.renderFormSection("Problem Statement")}
        <Grid item md={9} xs={12}>
          <Card elevation={2}>
            {this.renderSaving()}
            <CardContent>
              {this.renderQuestionId()}
              <MarkdownDisplay enhanced rawtext={this.state.question.statement}/>
              {this.renderTextField(
                "statement", "Question Statement",
                "Includes multiple choices via bullet points. Supports Markdown and KaTeX."
              )}
            </CardContent>
          </Card>
        </Grid>
        {this.renderFormSection("Upload Images")}
        <Grid item md={9} xs={12}>
          {/* <Card elevation={2}>
          <CardContent> */}
          {this.renderImageUpload()}
          {/* </CardContent>
          </Card> */}
        </Grid>
        {this.renderFormSection("Additional Information")}
        <Grid item md={9} xs={12}>
          <Card elevation={2}>
            <CardContent>
              {this.renderTextField(
                "solution", "Solution",
                "Expected answer; correct choice or text."
              )}
              {this.renderTextField(
                "note", "Note",
                "Something to note about this question; but not part of statement."
              )}
            </CardContent>
          </Card>
        </Grid>
        {this.renderFormSection("Categorization")}
        <Grid item md={9} xs={12}>
          <Card elevation={2}>
            <CardContent>
              {this.renderMultipleSelect(
                "format", "Question Format",
                "Suitable format(s) for this question."
              )}
              {this.renderMultipleSelect(
                "round", "Competition Round",
                "At which stage of competition to use this question."
              )}
              {this.renderMultipleSelect(
                "region", "Region",
                "Designated region to use this question."
              )}
              {this.renderTagsField()}
            </CardContent>
            {this.renderSaving()}
          </Card>
        </Grid>
        <Grid item md={3} xs={12}/>
        <Grid item md={9} xs={12}>
          {!this.state.saving && this.renderActionButtons()}
        </Grid>
      </Grid>
    );
  }
}

const styles = theme => ({
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
  formSection: {
    ...theme.typography.title,
    fontSize: "1.15rem",
    marginTop: theme.spacing.unit,
    [theme.breakpoints.down("sm")]: {
      marginTop: 2 * theme.spacing.unit,
    },
  },
  imageCard: {
    display: "flex",
    flexDirection: "column",
  },
  imageThumb: {
    transition: theme.transitions.create(),
    cursor: "pointer",
    opacity: 1,
    filter: "blur(0)",
    height: "120px",
    "&:hover": {
      opacity: 0.6,
      filter: "blur(2px)",
    },
  },
  imageUrl: {
    overflowX: "scroll",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    fontFamily: "monospace",
    fontSize: "75%",
    "&, &:last-child": {
      padding: 1.5 * theme.spacing.unit,
      margin: 0,
    },
  },
  helperText: {
    marginTop: 0.5 * theme.spacing.unit,
  },
  emptyData: {
    ...theme.typography.body1,
    color: theme.palette.text.secondary,
  },
  warnToSave: {
    ...theme.typography.caption,
    fontWeight: 500,
    color: theme.palette.secondary.main,
  },
  actions: {
    ...theme.typography.caption,
    display: "flex",
    justifyContent: "space-between",
  },
});

const withAttached = compose(
  withPushMessage,
  withRouter,
  withStyles(styles),
);
export default withAttached(QuestionEditorCard);

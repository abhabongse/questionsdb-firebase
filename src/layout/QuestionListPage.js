import React from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import debounce from "lodash/debounce";
import compose from "recompose/compose";

import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Portal from "@material-ui/core/Portal";
import TextField from "@material-ui/core/TextField";
import withWidth from "@material-ui/core/withWidth";
import { withStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import QuestionList from "../components/QuestionList";
import ButtonLink from "../elements/ButtonLink";
import { Categories, getFilterName, getIcon } from "../helpers/dataHelper";


const displayModes = Object.freeze({
  "default": [["archived", "==", false], ["deleted", "==", false]],
  "include-archived": [["deleted", "==", false]],
  "archived-only": [["archived", "==", true], ["deleted", "==", false]],
  "deleted-only": [["archived", "==", false], ["deleted", "==", true]],
});

class QuestionListPage extends React.Component {
  static propTypes = {
    /** These 3 props are passed down via router. */
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    /** These 2 props are provided by Material UI. */
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    /** Reference of title DOM. */
    titleRef: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      filterPanelOpen: false,
      /** Enabled values in filter panel */
      displayMode: null,
      format: null,
      round: null,
      region: null,
      tag: "",
    };
  }

  /** True if the current viewport is 'sm' or smaller. */
  smallWidth = () => ["sm", "xs"].indexOf(this.props.width) !== -1;

  /** Serialize enabled filters in forms recognizable by Firestore. */
  getFilters = () => {
    // Start off with filters on display mode
    const filters = [
      ...displayModes[this.state.displayMode || "default"]
    ];
    // Apply filters based on value from each category
    for (const category of ["format", "round", "region"]) {
      const field = this.state[category];
      if (field) {
        const filterName = getFilterName(category, field);
        filters.push([filterName, "==", true]);
      }
    }
    // If tag value is specified, also apply it to filtering
    const tag = this.state.tag.trim();
    tag && filters.push(["tags", "array-contains", tag]);

    return filters;
  };

  /** Show or hide filter panel (works only on small viewport). */
  toggleFilterPanel = () => {
    this.smallWidth() && this.setState(state => ({
      filterPanelOpen: !state.filterPanelOpen
    }));
  };

  /** Check or uncheck each categorical subfield in filters. */
  toggleFilterChecked = (category, field) => () => {
    this.setState(state => ({
      [category]: state[category] !== field ? field : null
    }));
  };

  /** Delay for 800ms before setting the tag state. */
  setTag = debounce(tag => { this.setState({ tag }); }, 800);

  renderFilterOption = (category, value) => {
    const checked = this.state[category] === value;
    return (
      <ListItem
        key={value}
        button
        className={checked ? this.props.classes.checked : ""}
        onClick={this.toggleFilterChecked(category, value)}
      >
        <ListItemIcon>{getIcon(value)}</ListItemIcon>
        <ListItemText primary={capitalize(value).replace("-", " ")} />
        {checked && <FontAwesomeIcon icon="check" />}
      </ListItem>
    );
  };

  renderDisplayModeFilter = () => (
    <React.Fragment>
      <ListSubheader component="div">Display Mode</ListSubheader>
      {Object.keys(displayModes)
        .filter(value => value !== "default")
        .map(value => this.renderFilterOption("displayMode", value))
      }
    </React.Fragment>
  );

  renderCategoryFilter = category => (
    <React.Fragment>
      <ListSubheader component="div">{capitalize(category)}</ListSubheader>
      {Categories[category]
        .map(field => this.renderFilterOption(category, field))
      }
    </React.Fragment>
  );

  renderTagFilter = () => (
    <ListItem>
      <TextField
        fullWidth
        margin="none"
        onChange={event => { this.setTag(event.target.value); }}
        label={
          <React.Fragment>
            <FontAwesomeIcon icon="tag" className="icon-pad-right"/>
            Search by tag
          </React.Fragment>
        }
      />
    </ListItem>
  );

  /** Add question button + filter panel */
  renderSidePanel = () => (
    <React.Fragment>
      <div className={this.props.classes.sidePanelButtons}>
        <div className={this.props.classes.addButton}>
          <ButtonLink variant="outlined" size="large" to="/questions/new">
            <FontAwesomeIcon icon="plus" size="sm" className="icon-pad-right"/>
            New Question
          </ButtonLink>
        </div>
        <div>
          <Button
            variant={this.smallWidth() ? "outlined" : "text"}
            size="large"
            onClick={this.toggleFilterPanel}
          >
            <FontAwesomeIcon icon="sliders-h" size="sm" className="icon-pad-right"/>
            Filters
          </Button>
        </div>
      </div>
      <Collapse in={this.state.filterPanelOpen || !this.smallWidth()}>
        <List>
          {this.renderDisplayModeFilter()}
          {this.renderCategoryFilter("format")}
          {this.renderCategoryFilter("round")}
          {this.renderCategoryFilter("region")}
          {this.renderTagFilter()}
        </List>
      </Collapse>
    </React.Fragment>
  );

  render() {
    return (
      <React.Fragment>
        <Portal container={this.props.titleRef.current}>
          Questions
        </Portal>
        <Grid container spacing={32}>
          <Grid item xs={12} md={3}>
            {this.renderSidePanel()}
          </Grid>
          <Grid item xs={12} md={9}>
            <QuestionList filters={this.getFilters()}/>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const styles = theme => ({
  sidePanelButtons: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    }
  },
  addButton: {
    flexGrow: 1,
    [theme.breakpoints.up("md")]: {
      display: "flex",
      marginBottom: 2 * theme.spacing.unit,
      "& a": {
        flexGrow: 1,
      },
    }
  },
  checked: {
    transition: theme.transitions.create(),
    backgroundColor: theme.palette.tertiary.light,
    "& *": {
      color: theme.palette.tertiary.contrastText,
    },
    "&:hover, &:focus": {
      backgroundColor: theme.palette.tertiary.main,
    },
  },
});

const withAttached = compose(
  withStyles(styles),
  withWidth(),
);
export default withAttached(QuestionListPage);

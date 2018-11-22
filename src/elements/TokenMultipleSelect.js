import React from "react";
import PropTypes from "prop-types";
import capitalize from "lodash/capitalize";
import pull from "lodash/pull";
import compose from "recompose/compose";

import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";

import TokenChip from "../elements/TokenChip";
import { getAvatar } from "../helpers/dataHelper";


class TokenMultipleSelect extends React.Component {
  static propTypes = {
    /** This props are provided by Material UI. */
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    theme: PropTypes.object.isRequired,
    /** Data to render */
    name: PropTypes.string,
    label: PropTypes.string,
    helperText: PropTypes.string,
    /** Possible values to list in select */
    allValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    /** Invoked by this component when list item changes */
    onChange: PropTypes.func,
  };

  /** Triggers when delete button is clicked on chip. */
  handleDeleteChip = item => () => {
    const selectedValues = pull(this.props.selectedValues, item);
    this.props.onChange(this.props.name, selectedValues);
  };

  /** Triggers when select field change its value. */
  handleSelectChange = event => {
    const selectedValues = event.target.value;
    this.props.onChange(this.props.name, selectedValues);
  }

  renderSingleChip = item => (
    <TokenChip
      key={item}
      label={capitalize(item)}
      avatar={getAvatar(item)}
      onDelete={this.handleDeleteChip(item)}
    />
  );

  renderChipList = () => (
    <div className={this.props.classes.chipContainer}>
      {this.props.selectedValues.map(this.renderSingleChip)}
    </div>
  );

  renderMenuItem = item => (
    <MenuItem
      key={item}
      value={item}
      style={{
        fontWeight: this.props.selectedValues.indexOf(item) !== -1
          ? this.props.theme.typography.fontWeightMedium
          : this.props.theme.typography.fontWeightRegular,
      }}
    >
      {item}
    </MenuItem>
  );

  render() {
    const formId = `select-multiple-${this.props.name}`;
    return (
      <FormControl margin="normal" fullWidth>
        <InputLabel htmlFor={formId}>{this.props.label}</InputLabel>
        <Select
          name={this.props.name}
          value={this.props.selectedValues}
          multiple
          autoWidth
          input={<Input id={formId} />}
          onChange={this.handleSelectChange}
          renderValue={this.renderChipList}
        >
          {this.props.allValues.map(this.renderMenuItem)}
        </Select>
        <FormHelperText classes={{ root: this.props.classes.helperText }}>
          {this.props.helperText}
        </FormHelperText>
      </FormControl>
    );
  }
}


const styles = theme => ({
  helperText: {
    marginTop: 0.5 * theme.spacing.unit,
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
});


const withAttached = compose(
  withStyles(styles, { withTheme: true }),
);
export default withAttached(TokenMultipleSelect);

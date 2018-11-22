/* eslint-disable react/prop-types */

import React from "react";
import classNames from "classnames";
import CreatableSelect from "react-select/lib/Creatable";

import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { emphasize } from "@material-ui/core/styles/colorManipulator";

import TokenChip from "./TokenChip";


const styles = theme => ({
  input: {
    display: "flex",
    paddingTop: 0.25 * theme.spacing.unit,
    paddingBottom: 0.25 * theme.spacing.unit,
  },
  helperText: {
    marginTop: 0.5 * theme.spacing.unit,
  },
  valueContainer: {
    display: "flex",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
  },
  chip: {
    margin: `0px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  paper: {
    marginTop: theme.spacing.unit,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      margin="normal"
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      FormHelperTextProps={{
        classes: { root: props.selectProps.classes.helperText }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function MultiValue(props) {
  return (
    <TokenChip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={event => {
        props.removeProps.onClick();
        props.removeProps.onMouseDown(event);
      }}
    />
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

const components = {
  Control,
  DropdownIndicator: null,
  MultiValue,
  ValueContainer,
};

class TokenTextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextValue: "",         // String not yet tokenized
      values: props.values,  // List of tokens
    };
  }

  valuesAsOptions = () => (
    this.state.values.map(value => ({ label: value, value }))
  );

  handleChange = options => {
    const values = options.map(option => option.value);
    this.setState({ values });
    this.props.onChange(values);
  };

  handleInputChange = nextValue => {
    this.setState({ nextValue });
  };

  handleKeyDown = event => {
    if (this.state.nextValue && ["Enter", "Tab"].indexOf(event.key) !== -1) {
      if (this.state.values.indexOf(this.state.nextValue) !== -1) {
        return;  // ignore duplicated num
      }
      const values = [...this.state.values, this.state.nextValue];
      this.setState({ nextValue: "", values });
      this.props.onChange(values);

      event.preventDefault();
      return;
    }
    this.props.onKeyPress(event);
  };

  render() {
    return (
      <CreatableSelect
        classes={this.props.classes}
        textFieldProps={{
          label: this.props.label,
          helperText: this.props.helperText,
          InputLabelProps: {
            shrink: (this.state.values.length > 0 || undefined),
          },
        }}
        components={components}
        inputValue={this.state.nextValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder=""
        value={this.valuesAsOptions()}
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(TokenTextField);

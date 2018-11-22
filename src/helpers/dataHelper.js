import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


/** List of all possible question formats. */
const Formats = Object.freeze([
  "choices", "quickfire", "ponder", "coding"
]);

/** List of all possible rounds. */
const Rounds = Object.freeze([
  "audition", "regional", "national"
]);

/** List of all possible regions. */
const Regions = Object.freeze([
  "south", "northeast", "north", "central"
]);

/** All categories. */
const Categories = Object.freeze({
  format: Formats,
  round: Rounds,
  region: Regions,
});

/** Filter name getter. */
const getFilterName = (category, field) => `${category}.${field}`;

/** Generate empty question but with all fields. */
const getEmptyQuestion = () => {
  const question = {
    statement: "",
    solution: "",
    note: "",
    imageUrls: [],
    archived: false,
    deleted: false,
    tags: [],
  };
  for (const category of Object.keys(Categories)) {
    question[category] = {};
    for (const field of Categories[category]) {
      question[category][field] = false;
    }
  }
  return question;
};


/** Icons for different category subfields */
const iconTable = Object.freeze({
  /** Regions */
  south: {
    icon: "location-arrow",
    transform: "rotate-135 up-3",
  },
  northeast: { icon: "location-arrow" },
  north: {
    icon: "location-arrow",
    transform: "rotate-315 down-3",
  },
  central: { icon: "crosshairs" },
  /** Rounds */
  audition: { icon: "map-signs" },
  regional: { icon: "map-marked-alt" },
  national: { icon: "globe-asia" },
  /** Formats */
  choices: { icon: "list-ol" },
  quickfire: { icon: "bolt" },
  ponder: { icon: "brain" },
  coding: { icon: "code" },
  /** Tags */
  tag: { icon: "tag" },
  tags: { icon: "tags" },
  /** Status */
  "include-archived": { icon: "boxes" },
  "archived-only": { icon: "archive" },
  "deleted-only": { icon: "trash" },
});

const getIcon = field => (
  iconTable[field] && <FontAwesomeIcon fixedWidth {...iconTable[field]}/>
);

const getAvatar = field => (
  iconTable[field] && <Avatar><FontAwesomeIcon {...iconTable[field]}/></Avatar>
);

export {
  Formats, Rounds, Regions, Categories,
  getFilterName, getEmptyQuestion, getIcon, getAvatar,
};

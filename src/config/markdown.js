import React from "react";
import low from "lowlight/lib/core";

import unified from "unified";
import markdown from "remark-parse";
import subsuper from "remark-sub-super";
import math from "./hotfix/remark-math";
import remark2rehype from "remark-rehype";
import katex from "./hotfix/rehype-katex";
import highlight from "rehype-highlight";
import rehype2react from "rehype-react";

import "highlight.js/styles/github.css";
import "katex/dist/katex.css";

/** Create a new language for pseudocode. */
low.registerLanguage("pseudocode", function(hljs) {
  const KEYWORDS = {
    keyword:
      "function procedure input output return print halt terminate exit " +
      "for each to downto loop while do repeat until break continue end " +
      "if then else elseif case and or not xor div mod is in " +
      "add remove insert delete push pop ",
    literal: "true false empty nil",
  };
  return {
    keywords: KEYWORDS,
    contains: [
      hljs.C_NUMBER_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.HASH_COMMENT_MODE,
    ],
  };
});

/**
 * Establish the customized markdown processor.
 * To use this processor on an input string, call the following:
 *     processor.processSync(inputMarkdownString).contents
 */
const processor = unified()
  .use(markdown)
  .use(subsuper)
  .use(math)
  .use(remark2rehype)
  .use(katex)
  .use(highlight, { ignoreMissing: true })
  .use(rehype2react, { createElement: React.createElement });

export default processor;

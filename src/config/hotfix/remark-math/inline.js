function locator(value, fromIndex) {
  return value.indexOf('$', fromIndex);
}

var ESCAPED_INLINE_MATH = /^\\\$/;
var INLINE_MATH = /^\$((?:\\\$|[^$])+)\$/;
var INLINE_MATH_DOUBLE = /^\$\$((?:\\\$|[^$])+)\$\$/;

module.exports = function inlinePlugin(opts) {
  function inlineTokenizer(eat, value, silent) {
    var isDouble = true;
    var match = INLINE_MATH_DOUBLE.exec(value);
    if (!match) {
      match = INLINE_MATH.exec(value);
      isDouble = false;
    }
    var escaped = ESCAPED_INLINE_MATH.exec(value);

    if (escaped) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true;
      }
      return eat(escaped[0])({
        type: 'text',
        value: '$'
      });
    }

    if (value.slice(-2) === '\\$') {
      return eat(value)({
        type: 'text',
        value: value.slice(0, -2) + '$'
      });
    }

    if (match) {
      /* istanbul ignore if - never used (yet) */
      if (silent) {
        return true;
      }

      var endingDollarInBackticks = match[0].includes('`') && value.slice(match[0].length).includes('`');
      if (endingDollarInBackticks) {
        var toEat = value.slice(0, value.indexOf('`'));
        return eat(toEat)({
          type: 'text',
          value: toEat
        });
      }

      var trimmedContent = match[1].trim();

      return eat(match[0])({
        type: 'inlineMath',
        value: trimmedContent,
        data: {
          hName: 'span',
          hProperties: {
            className: 'inlineMath' + (isDouble && opts.inlineMathDouble ? ' inlineMathDouble' : '')
          },
          hChildren: [{
            type: 'text',
            value: trimmedContent
          }]
        }
      });
    }
  }
  inlineTokenizer.locator = locator;

  var Parser = this.Parser;

  // Inject inlineTokenizer
  var inlineTokenizers = Parser.prototype.inlineTokenizers;
  var inlineMethods = Parser.prototype.inlineMethods;
  inlineTokenizers.math = inlineTokenizer;
  inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'math');

  var Compiler = this.Compiler;

  // Stringify for math inline
  if (Compiler != null) {
    var visitors = Compiler.prototype.visitors;
    visitors.inlineMath = function (node) {
      return '$' + node.value + '$';
    };
  }
};

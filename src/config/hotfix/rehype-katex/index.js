var visit = require('unist-util-visit');
var katex = require('katex');
var unified = require('unified');
var parse = require('rehype-parse');
var position = require('unist-util-position');

function parseMathHtml(html) {
  return unified().use(parse, {
    fragment: true,
    position: false
  }).parse(html);
}

function hasClass(element, className) {
  return element.properties.className && element.properties.className.includes(className);
}

function isTag(element, tag) {
  return element.tagName === tag;
}

module.exports = function plugin() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (opts.throwOnError == null) opts.throwOnError = false;
  if (opts.errorColor == null) opts.errorColor = '#cc0000';
  if (opts.macros == null) opts.macros = {};
  return function transform(node, file) {
    visit(node, 'element', function (element) {
      var isInlineMath = isTag(element, 'span') && hasClass(element, 'inlineMath');
      var isMath = (opts.inlineMathDoubleDisplay && hasClass(element, 'inlineMathDouble')) || (isTag(element, 'div') && hasClass(element, 'math'));

      if (isInlineMath || isMath) {
        var renderedValue = void 0;
        try {
          renderedValue = katex.renderToString(element.children[0].value, {
            displayMode: isMath,
            macros: opts.macros
          });
        } catch (err) {
          if (opts.throwOnError) {
            throw err;
          } else {
            file.message(err.message, position.start(element));
            try {
              renderedValue = katex.renderToString(element.children[0].value, {
                displayMode: isMath,
                macros: opts.macros,
                throwOnError: false,
                errorColor: opts.errorColor
              });
            } catch (err) {
              renderedValue = '<code class="katex" style="color: ' + opts.errorColor + '">' + element.children[0].value + '</code>';
            }
          }
        }

        var inlineMathAst = parseMathHtml(renderedValue).children[0];

        Object.assign(element.properties, { className: element.properties.className });
        element.children = [inlineMathAst];
      }
    });
    return node;
  };
};

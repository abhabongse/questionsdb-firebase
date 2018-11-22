var inlinePlugin = require('./inline');
var blockPlugin = require('./block');

module.exports = function mathPlugin() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  blockPlugin.call(this, opts);
  inlinePlugin.call(this, opts);
};

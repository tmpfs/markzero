var marked = require('marked');
var manual = require('manual');

module.exports = {
  MarkdownRenderer: require('./render/renderer'),
  TextRenderer: require('./render/text'),
  ManualRenderer: require('./render/man'),
  Parser: require('./parser'),
  Lexer: require('./parser'),
  marked: marked,
  manual: manual,
  tokens: require('./tokens'),
  stringify: require('./stringify'),
  links: require('./links')
}

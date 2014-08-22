// derived from marked@0.3.1

var manual = require('manual');
var Parser = require('./parser');

module.exports = {
  MarkdownRenderer: require('./render/markdown'),
  TextRenderer: require('./render/text'),
  ManualRenderer: require('./render/man'),
  Renderer: require('./renderer'),
  Parser: Parser,
  parser: Parser.parse,
  Lexer: require('./lexer'),
  manual: manual,
  tokens: require('./tokens'),
  stringify: require('./stringify'),
  links: require('./links'),
  defaults: require('./defaults')
}

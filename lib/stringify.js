var EOL = require('os').EOL;
var Renderer = require('./render/markdown');
var TextRenderer = require('./render/text');
var ManualRenderer = require('./render/man');
var Parser = require('./parser');

var ref = require('./links').ref;

/**
 *  @func stringify(tokens, [modifiers])
 *
 *  @api private
 *
 *  Converts the lexer tokens back to a markdown string.
 *
 *  @param tokens The lexer tokens.
 *  @param renderer The renderer instance to use.
 */
function stringify(tokens, renderer, suppress) {
  renderer = renderer || new Renderer;
  var options = {renderer: renderer};
  // do not mangle links for these renderer types
  if(renderer instanceof TextRenderer) {
    options.mangle = false;
  }
  var parser = new Parser(options);
  var md =  parser.parse(tokens);
  if(!suppress) {
    for(var z in tokens.links) {
      md += ref(z, tokens.links[z].href) + EOL;
    }
  }
  return md;
}

module.exports = stringify;

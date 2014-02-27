var marked = require('marked');
var manual = require('manual');

// reproduced from marked for the moment
// as the module does not expose them
function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
  return html.replace(/&([#\w]+);/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

module.exports = {
  MarkdownRenderer: require('./render/renderer'),
  TextRenderer: require('./render/text'),
  ManualRenderer: require('./render/man'),
  Parser: require('./parser'),
  escape: escape,
  unescape: unescape,
  marked: marked,
  manual: manual,
  tokens: require('./tokens'),
  stringify: require('./stringify'),
  links: require('./links')
}

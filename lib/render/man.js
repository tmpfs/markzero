var EOL = require('os').EOL;
var util = require('util');
var TextRenderer = require('./text');
var repeat = require('cli-util').repeat;
var dnl = EOL + EOL;

var elements = require('manual').elements;
var escape = require('manual').sanitize;
var strip = function(text) {
  return text.replace(/^\.[a-zA-Z]+\n/gmi, '');
}

function ManRenderer(options) {
  TextRenderer.apply(this, arguments);
}

util.inherits(ManRenderer, TextRenderer);

ManRenderer.prototype.token = function(token, parser) {
  //if(token.text === '`') {
    //console.dir(token);
  //}
}

ManRenderer.prototype.code = function(code, lang, escaped) {
  var single = !/\n/.test(code);
  //console.dir(lang);
  if(single) {
    // single line code blocks are bold
    return EOL +  (lang !== 'synopsis' ? '  ' : '') + escape(code) + EOL;
  }
  //return EOL + util.format(elements.sp, escape(code));
  if(lang !== 'synopsis') {
    var lines = code.split('\n');
    lines = lines.map(function(value) {
      return '  ' + value;
    })
    code = lines.join('\n')
  }
  return EOL + elements.sp + escape(code) + EOL;
};

ManRenderer.prototype.blockquote = function(quote) {
  // TODO: remove formatting from child elements
  //
  //console.log('got blockquote element "%s"', quote);
  //if(!quote) return '';

  return elements.tp + escape(strip(quote));
};

ManRenderer.prototype.html = function(html) {
  return html;
};

ManRenderer.prototype.heading = function(text, level, raw) {
  level = level || 1;
  level = Math.min(level, 3);
  var sh = level == 1 || level == 2;
  var elem = sh ? elements.sh : elements.ss;
  if(sh) text = text.toUpperCase();
  return util.format(elem, escape(text));
};

ManRenderer.prototype.hr = function() {
  //return repeat(80, '-');
};

ManRenderer.prototype.liststart = function(ordered, token, next) {
  //console.dir(arguments);
  //return elements.bl + body + elements.el;
  //console.dir('liststart');
  //console.dir(arguments);
  this.ordered = ordered;
  this.count = 0;
};

ManRenderer.prototype.list = function(body, ordered, next) {
  //console.dir(arguments);
  this.ordered = ordered;
  return elements.bl + body + elements.el;
};

ManRenderer.prototype.listitem = function(text, start, end) {
  //console.dir('listitem');
  //console.dir(arguments);
  if(!this.ordered) {
    return util.format(elements.it, escape(text));
  }else{
    this.count++;
    return EOL + util.format('  '
      + this.count + '. ', escape(text)) + EOL;
  }
};

ManRenderer.prototype.paragraph = function(text, token, parent) {
  //if(parent) console.dir('man renderer paragraph got parent %s', text);
  if(parent) return '';
  return util.format(elements.pp, escape(text));
};

ManRenderer.prototype.table = function(header, body) {
  //return '<table>\n'
    //+ '<thead>\n'
    //+ header
    //+ '</thead>\n'
    //+ '<tbody>\n'
    //+ body
    //+ '</tbody>\n'
    //+ '</table>\n';
};

ManRenderer.prototype.tablerow = function(content) {
  //return '<tr>\n' + content + '</tr>\n';
};

ManRenderer.prototype.tablecell = function(content, flags) {
  //var type = flags.header ? 'th' : 'td';
  //var tag = flags.align
    //? '<' + type + ' style="text-align:' + flags.align + '">'
    //: '<' + type + '>';
  //return tag + content + '</' + type + '>\n';
};

ManRenderer.prototype.href = function(href, title, text) {
  // sadly no easy way to tell if the link references a
  // SH or SS otherwise we would use title case for SS
  if(/^#/.test(href)) {
    text = text.toUpperCase();
    return this.strong(text);
  }
  return TextRenderer.prototype.href.apply(this, arguments);
}

// span level renderer
ManRenderer.prototype.strong = function(text) {
  return elements.fb + escape(text) + elements.fr;
};

ManRenderer.prototype.em = function(text) {
  // only underline simple terms
  if(/ /.test(text)) return escape(text);
  return elements.fi + escape(text) + elements.fr;
};

ManRenderer.prototype.codespan = function(text) {
  return elements.fb + text + elements.fr;
};

ManRenderer.prototype.br = function() {
  return EOL + elements.br;
};

ManRenderer.prototype.del = function(text) {
  return text;
};

ManRenderer.prototype.image = function(href, title, text) {
  return text;
};

module.exports = ManRenderer;
module.exports.escape = escape;
module.exports.elements = elements;

var EOL = require('os').EOL;
var util = require('util');
var HtmlRenderer = require('../renderer');
var repeat = require('cli-util').repeat;
var links = require('../links');
var dnl = EOL + EOL;

function header(text) {
  return text + EOL + repeat(text.length, '=');
}

function MarkdownRenderer(options) {
  HtmlRenderer.apply(this, arguments);
  this.lists = [];
  this.depth = -1;
  //this.raw = true;
}

util.inherits(MarkdownRenderer, HtmlRenderer);

MarkdownRenderer.prototype.insideList = function() {
  return this.depth > -1;
}

MarkdownRenderer.prototype.tok = function(tok) {
  if(this.insideList()) return false;
  return tok.raw ? tok.raw : false;
}

MarkdownRenderer.prototype.comment = function(tok) {
  return tok.raw;
}

MarkdownRenderer.prototype.code = function(code, lang, escaped) {
  return '```' + (lang || '') + EOL + code + EOL + '```' + dnl;
};

MarkdownRenderer.prototype.blockquote = function(quote) {
  //console.dir(arguments)
  //console.log('MARKDOWN RENDERER BLOCKQUOTE > %s', quote);
  return '> ' + quote;
};

MarkdownRenderer.prototype.html = function(html) {
  return html;
};

MarkdownRenderer.prototype.heading = function(text, level, raw) {
  if(level == 1) return header(text) + dnl;
  return repeat(level, '#') + ' ' + text + dnl;
};

MarkdownRenderer.prototype.hr = function() {
  return repeat(80, '-');
};

MarkdownRenderer.prototype.token = function(token, parser) {
  switch(token.type) {
    case 'list_start':
      this.depth = token.depth - 1;
      if(token.ordered && !this.lists[this.depth]) {
        this.lists[this.depth] = {counter: 0, ordered: token.ordered};
      }
      break;
    case 'list_item_end':
      if(this.lists[this.depth]) this.lists[this.depth].counter++;
      break;
    case 'list_end':
      var next = parser.peek();
      // not a consecutive list
      if(next.type !== 'list_start') {
        // reset depth so that li elements for ul elements
        // are restored
        this.depth = -1;
        this.lists = [];
      }
      break;
  }
}

MarkdownRenderer.prototype.list = function(body, ordered, next) {
  return body + (next.type !== 'list_start' ? EOL : '');
};

MarkdownRenderer.prototype.listitem = function(text, start, end) {
  var padding = start && start.indent ? repeat(start.indent * 2) : '';
  var li = '*';
  if(this.lists[this.depth]) {
    li = this.depth == -1 ? li : this.lists[this.depth].counter + '.';
  }
  return padding + li + ' ' + text + EOL;
};

MarkdownRenderer.prototype.paragraph = function(text, token, parent) {
  //if(parent) console.log('markdown renderer paragraph got parent %j', parent);
  if(parent) return '';
  return text + dnl;
};

// span level renderer
MarkdownRenderer.prototype.strong = function(text) {
  return '**' + text + '**';
};

MarkdownRenderer.prototype.em = function(text) {
  return '*' + text + '*';
};

MarkdownRenderer.prototype.codespan = function(text) {
  return '`' + text + '`';
};

MarkdownRenderer.prototype.br = function() {
  return EOL;
};

MarkdownRenderer.prototype.link = function(href, title, text) {
  if(this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  return links.anchor(text, href, title);
};

module.exports = MarkdownRenderer;

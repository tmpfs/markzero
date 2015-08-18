//var util = require('util');
var defaults = require('./defaults');
var InlineLexer = require('./inline');
var Renderer = require('./renderer');

/**
 * Parsing & Compiling
 */
function Parser(options) {
  options = options || {};
  this.tokens = [];
  this.token = null;
  this.options = options || defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
  this.options.sanitize = false;
  this.renderer.parser = this;
}

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  //console.log('parser parsing');
  //console.dir(this.renderer.constructor.name);
  //console.dir(src);
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.renderer.tokens(src);
  this.tokens = src.reverse();
  var out = '', tok;
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;
  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }
  return this.inline.output(body);
};

/**
 * Next Token
 */
Parser.prototype.next = function() {
  this.token = this.tokens.pop();
  // TODO: rename this to before
  if(this.token) this.renderer.token(this.token, this);
  return this.token;
};

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Current Token
 */
Parser.prototype.tok = function(parent) {

  //if(parent) {
    //console.log('tok got parent ref %j', parent);
  //}

  //var res;
  //if(this.renderer.raw) {
     //res = this.renderer.tok(this.token);
     //if(typeof res === 'string') {
      //return res;
     //}
  //}

  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr(this.token);
    }
    case 'comment': {
      return this.renderer.comment(this.token);
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text,
        this.token);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped,
        this.token);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = ''
        , p = this.token;

      //console.log('PARSER GOT BLOCKQUOTE %j', this.token);

      while (this.next().type !== 'blockquote_end') {
        //console.log('blockquote consuming %s', this.token.type);
        body += this.tok();
      }

      //console.dir('blockquote body')
      //console.dir(body)

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      //var body = ''
        //, ordered = this.token.ordered;

      //while (this.next().type !== 'list_end') {
        //body += this.tok();
      //}

      //return this.renderer.list(body, ordered);

      var body = ''
        , ordered = this.token.ordered;

      this.renderer.liststart(ordered, this.token, this.peek());

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, this.peek());
    }
    case 'list_item_start': {
      //var body = '';

      //while (this.next().type !== 'list_item_end') {
        //body += this.token.type === 'text'
          //? this.parseText()
          //: this.tok();
      //}

      //return this.renderer.listitem(body);


      var body = '', start = this.token;

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body, start, this.token);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html, this.token);
    }
    case 'paragraph': {
      //if(parent) console.log('paragraph got parent %s', this.renderer.paragraph);
      return this.renderer.paragraph(
        this.inline.output(this.token.text), this.token, parent);
    }
    case 'text': {
      return this.renderer.paragraph(
        this.parseText(), this.token, parent);
    }
  }
};

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

module.exports = Parser;

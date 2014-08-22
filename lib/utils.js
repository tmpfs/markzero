function noop() {}
noop.exec = noop;

var escape = function(text){return text;};
var unescape = escape;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

module.exports = {
  noop: noop,
  escape: escape,
  unescape: unescape,
  merge: merge,
  replace: replace
}

//function escape(html, encode) {
  //return html
    //.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    //.replace(/</g, '&lt;')
    //.replace(/>/g, '&gt;')
    //.replace(/"/g, '&quot;')
    //.replace(/'/g, '&#39;');
//}

//function unescape(html) {
  //return html.replace(/&([#\w]+);/g, function(_, n) {
    //n = n.toLowerCase();
    //if (n === 'colon') return ':';
    //if (n.charAt(0) === '#') {
      //return n.charAt(1) === 'x'
        //? String.fromCharCode(parseInt(n.substring(2), 16))
        //: String.fromCharCode(+n.substring(1));
    //}
    //return '';
  //});
//}


// ----------------------------------------------------------------------------
// HBShelper
// ----------------------------------------------------------------------------
let blocks = {};

/**
 * {{{block "stylesheets"}}}
 */

exports.block = (name) => {
  var str = (blocks[name] || []).join("");
  blocks[name] = [];
  return str;
};

/**
 {{#extend "stylesheets"}}
   <link rel="stylesheet" href="/css/index.css"/>
 {{/extend}}
 */
exports.extend = (name, options) => {
  if (!blocks[name]) {return;}
  blocks[name].push(options.fn(this));
};

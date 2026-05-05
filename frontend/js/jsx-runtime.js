// JSX runtime shim — maps esbuild/Bun jsx-factory calls to React.createElement
// esbuild --jsx-factory passes children as extra args: jsxDEV(type, props, child1, child2, ...)
// Bun passes children inside props.children
var jsxDEV_7x81h0kn = function(type, props) {
  if (arguments.length > 2) {
    var children = Array.prototype.slice.call(arguments, 2);
    return React.createElement.apply(React, [type, props].concat(children));
  }
  if (props && props.children !== undefined) {
    var c = props.children;
    delete props.children;
    if (Array.isArray(c)) {
      return React.createElement.apply(React, [type, props].concat(c));
    }
    return React.createElement(type, props, c);
  }
  return React.createElement(type, props);
};

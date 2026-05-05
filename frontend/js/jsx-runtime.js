// JSX runtime shim — maps Bun's jsxDEV to React.createElement
var jsxDEV_7x81h0kn = function(type, props, key) {
  if (props && props.children !== undefined) {
    var children = props.children;
    delete props.children;
    if (Array.isArray(children)) {
      return React.createElement.apply(React, [type, props].concat(children));
    }
    return React.createElement(type, props, children);
  }
  return React.createElement(type, props);
};

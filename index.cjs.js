'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var path = _interopDefault(require('path'));
var postcss = _interopDefault(require('postcss'));
var stylelint = _interopDefault(require('stylelint'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

// return custom selectors from the css root, conditionally removing them
var getCustomPropertiesFromRoot = (root => {
  // initialize custom selectors
  const customProperties = {}; // for each custom property declaration

  root.walkDecls(customPropertyRegExp, decl => {
    const prop = decl.prop; // write the parsed value to the custom property

    customProperties[prop] = decl.value;
  }); // return all custom properties, preferring :root properties over html properties

  return customProperties;
}); // match custom properties

const customPropertyRegExp = /^--[A-z][\w-]*$/;

/* Get Custom Properties from CSS File
/* ========================================================================== */

function getCustomPropertiesFromCSSFile(_x) {
  return _getCustomPropertiesFromCSSFile.apply(this, arguments);
}
/* Get Custom Properties from Object
/* ========================================================================== */


function _getCustomPropertiesFromCSSFile() {
  _getCustomPropertiesFromCSSFile = _asyncToGenerator(function* (from) {
    const css = yield readFile(from);
    const root = postcss.parse(css, {
      from
    });
    return getCustomPropertiesFromRoot(root);
  });
  return _getCustomPropertiesFromCSSFile.apply(this, arguments);
}

function getCustomPropertiesFromObject(object) {
  const customProperties = Object.assign({}, Object(object).customProperties, Object(object)['custom-properties']);
  return customProperties;
}
/* Get Custom Properties from JSON file
/* ========================================================================== */


function getCustomPropertiesFromJSONFile(_x2) {
  return _getCustomPropertiesFromJSONFile.apply(this, arguments);
}
/* Get Custom Properties from JS file
/* ========================================================================== */


function _getCustomPropertiesFromJSONFile() {
  _getCustomPropertiesFromJSONFile = _asyncToGenerator(function* (from) {
    const object = yield readJSON(from);
    return getCustomPropertiesFromObject(object);
  });
  return _getCustomPropertiesFromJSONFile.apply(this, arguments);
}

function getCustomPropertiesFromJSFile(_x3) {
  return _getCustomPropertiesFromJSFile.apply(this, arguments);
}
/* Get Custom Properties from Sources
/* ========================================================================== */


function _getCustomPropertiesFromJSFile() {
  _getCustomPropertiesFromJSFile = _asyncToGenerator(function* (from) {
    const object = yield Promise.resolve(require(from));
    return getCustomPropertiesFromObject(object);
  });
  return _getCustomPropertiesFromJSFile.apply(this, arguments);
}

function getCustomPropertiesFromSources(sources) {
  return sources.map(source => {
    if (source instanceof Promise) {
      return source;
    } else if (source instanceof Function) {
      return source();
    } // read the source as an object


    const opts = source === Object(source) ? source : {
      from: String(source)
    }; // skip objects with Custom Properties

    if (opts.customProperties || opts['custom-properties']) {
      return opts;
    } // source pathname


    const from = path.resolve(String(opts.from || '')); // type of file being read from

    const type = (opts.type || path.extname(from).slice(1)).toLowerCase();
    return {
      type,
      from
    };
  }).reduce(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (customProperties, source) {
      const _ref2 = yield source,
            type = _ref2.type,
            from = _ref2.from;

      if (type === 'css') {
        return Object.assign((yield customProperties), (yield getCustomPropertiesFromCSSFile(from)));
      }

      if (type === 'js') {
        return Object.assign((yield customProperties), (yield getCustomPropertiesFromJSFile(from)));
      }

      if (type === 'json') {
        return Object.assign((yield customProperties), (yield getCustomPropertiesFromJSONFile(from)));
      }

      return Object.assign((yield customProperties), (yield getCustomPropertiesFromObject((yield source))));
    });

    return function (_x4, _x5) {
      return _ref.apply(this, arguments);
    };
  }(), {});
}
/* Promise-ified utilities
/* ========================================================================== */

const readFile = from => new Promise((resolve, reject) => {
  fs.readFile(from, 'utf8', (error, result) => {
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  });
});

const readJSON =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(function* (from) {
    return JSON.parse((yield readFile(from)));
  });

  return function readJSON(_x6) {
    return _ref3.apply(this, arguments);
  };
}();

const ruleName = 'plugin/postcss-custom-properties';

function isCustomPropertyDecl(prop) {
  return prop.includes('--');
}

function prepareValue(value) {
  if (typeof value === 'string') {
    value = value.toUpperCase();
  }

  return value;
}

function foundCustomPropertyInValue(properies, value) {
  value = prepareValue(value);

  for (let i in properies) {
    const property = prepareValue(properies[i]);
    if (value.includes(property)) return i;
  }
}

function getCustomProperties(_x, _x2) {
  return _getCustomProperties.apply(this, arguments);
}

function _getCustomProperties() {
  _getCustomProperties = _asyncToGenerator(function* (root, importFrom) {
    // all custom properties from the file and imports
    return Object.assign({}, (yield getCustomPropertiesFromSources(importFrom)), getCustomPropertiesFromRoot(root));
  });
  return _getCustomProperties.apply(this, arguments);
}

function checkDeclOnCustomProperty(decl, customProperties, result) {
  const foundVariable = foundCustomPropertyInValue(customProperties, decl.value);

  if (foundVariable) {
    stylelint.utils.report({
      ruleName,
      result,
      node: decl,
      message: 'The value (or a part of it) should be presented as a custom property: "' + decl.value + '" is "' + foundVariable + '" (' + ruleName + ')'
    });
  }
}

module.exports = stylelint.createPlugin(ruleName, function (options) {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (root, result) {
        const importFrom = options && options.importFrom ? options.importFrom : [];
        const customProperties = yield getCustomProperties(root, importFrom);
        root.walkRules(function (rule) {
          rule.walkDecls(function (decl) {
            // Skip custom properties declarations
            if (!isCustomPropertyDecl(decl.prop)) {
              checkDeclOnCustomProperty(decl, customProperties, result);
            }
          });
        });
      });

      return function (_x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }()
  );
});
//# sourceMappingURL=index.cjs.js.map

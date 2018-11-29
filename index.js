var stylelint = require('stylelint');

var ruleName = 'plugin/postcss-custom-properties';

function prepareValue(value) {
  if (typeof value === 'string') {
    value = value.toUpperCase();
  }

  return value;
}

function foundCustomPropertyInValue(properies, value) {
  value = prepareValue(value);

  for (var i in properies) {
    var property = prepareValue(properies[i]);

    if (value.includes(property)) return i;
  }
}

module.exports = stylelint.createPlugin(ruleName, function(options) {
  return function(root, result) {
    if (!options || !options.customPropertiesFilePath) return;

    var file = require(process.cwd() + '/' + options.customPropertiesFilePath)
    var customProperties = file.customProperties || file['custom-properties'];

    if (!customProperties) return;

    root.walkRules(function(rule) {
      rule.walkDecls(function(decl) {
        var foundVariable = foundCustomPropertyInValue(customProperties, decl.value);

        if (foundVariable) {
          stylelint.utils.report({
            ruleName: ruleName,
            result: result,
            node: decl,
            message: 'The value (or a part of it) should be presented as a custom property: "' + 
              decl.value + '" is "' + foundVariable + '" (' + ruleName + ')'
          });
        }
      });
    });
  }
});
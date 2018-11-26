var stylelint = require('stylelint');

var ruleName = 'plugin/postcss-custom-properties';

function foundVariableInValue(variables, value) {
  for (var i in variables) {
    if (value.includes(variables[i])) return i;
  }
}

module.exports = stylelint.createPlugin(ruleName, function(options) {
  return function(root, result) {
    if (!options || !options.customPropertiesJsonFilePath) return;

    var variables = require(process.cwd() + '/' + options.customPropertiesJsonFilePath);

    root.walkRules(function(rule) {
      rule.walkDecls(function(decl) {
        var foundVariable = foundVariableInValue(variables, decl.value);
        if (foundVariable) {
          console.log(foundVariable);
          stylelint.utils.report({
            ruleName: ruleName,
            result: result,
            node: root,
            line: decl.source.start.line,
            column: decl.source.start.column,
            message: 'The value (or a part of it) should be presented as a custom property: "' + 
              decl.value + '" is "' + foundVariable + '" (' + ruleName + ')'
          });
        }
      });
    });
  }
});
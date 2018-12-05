import stylelint from 'stylelint';
import getCustomPropertiesFromRoot from './lib/get-custom-properties-from-root';
import getCustomPropertiesFromImports from './lib/get-custom-properties-from-imports';

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

async function getCustomProperties(root, importFrom) {
  // all custom properties from the file and imports
  return Object.assign(
    {},
    await getCustomPropertiesFromImports(importFrom),
    getCustomPropertiesFromRoot(root)
  );
}

function checkDeclOnCustomProperty(decl, customProperties, result) {
  const foundVariable = foundCustomPropertyInValue(customProperties, decl.value);

  if (foundVariable) {
    stylelint.utils.report({
      ruleName,
      result,
      node: decl,
      message: 'The value (or a part of it) should be presented as a custom property: "' + 
        decl.value + '" is "' + foundVariable + '" (' + ruleName + ')'
    });
  }
}

module.exports = stylelint.createPlugin(ruleName, function(options) {
  return async function(root, result) {
    const importFrom = options && options.importFrom ? options.importFrom : [];
    const customProperties = await getCustomProperties(root, importFrom);

    root.walkRules(function(rule) {
      rule.walkDecls(function(decl) {
        // Skip custom properties declarations
        if (!isCustomPropertyDecl(decl.prop)) {
          checkDeclOnCustomProperty(decl, customProperties, result);
        }
      });
    });
  }
});
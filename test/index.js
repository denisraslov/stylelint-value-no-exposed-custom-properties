var testRule = require('stylelint-test-rule-tape');
var plugin = require('..');

testRule(plugin.rule, {
  ruleName: plugin.ruleName,
  config: { variablesJsonFilePath: './test/variables.json' },
  skipBasicChecks: true,

  accept: [
    { code: '.Foo { color: #EEE; }' }
  ],

  reject: [
    {
      code: '.Foo { color: #FFF; }',
      message: 'The value (or a part of it) should be presented as a CSS variable:' +
        ' "#FFF" is "white" (' + plugin.ruleName + ')',
      line: 1,
      column: 1
    },
  ],
});
var testRule = require('stylelint-test-rule-tape');
var plugin = require('../index.cjs');

/* TEST CUSTOM PROPERTIES FROM ROOT */
testRule(plugin.rule, {
  ruleName: plugin.ruleName,
  skipBasicChecks: true,

  accept: [
    { code: '.Foo { color: #EEE; }' }
  ],

  reject: [
    {
      code: ':root { --white: #FFF; } .Foo { color: #FFF; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#FFF" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 33
    },
    {
      code: ':root { --white: #FFF; } .Foo { color: #fff; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#fff" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 33
    },
  ],
});
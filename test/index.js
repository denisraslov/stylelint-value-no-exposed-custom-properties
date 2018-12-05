var testRule = require('stylelint-test-rule-tape');
var plugin = require('../index.cjs');

/* TEST JSON IMPORT */
testRule(plugin.rule, {
  ruleName: plugin.ruleName,
  config: {
    importFrom: ['./test/customProperties.json']
  },
  skipBasicChecks: true,

  accept: [
    { code: '.Foo { color: #EEE; }' }
  ],

  reject: [
    {
      code: '.Foo { color: #FFF; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#FFF" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 8
    },
    {
      code: '.Foo { color: #fff; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#fff" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 8
    },
  ],
});

/* TEST JS IMPORT */
testRule(plugin.rule, {
  ruleName: plugin.ruleName,
  config: {
    importFrom: ['./test/customProperties.js']
  },
  skipBasicChecks: true,

  accept: [
    { code: '.Foo { color: #EEE; }' }
  ],

  reject: [
    {
      code: '.Foo { color: #FFF; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#FFF" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 8
    },
    {
      code: '.Foo { color: #fff; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#fff" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 8
    },
  ],
});

/* TEST CSS IMPORT */
testRule(plugin.rule, {
  ruleName: plugin.ruleName,
  config: {
    importFrom: ['./test/customProperties.css']
  },
  skipBasicChecks: true,

  accept: [
    { code: '.Foo { color: #EEE; }' }
  ],

  reject: [
    {
      code: '.Foo { color: #FFF; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#FFF" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 8
    },
    {
      code: '.Foo { color: #fff; }',
      message: 'The value (or a part of it) should be presented as a custom property:' +
        ' "#fff" is "--white" (' + plugin.ruleName + ')',
      line: 1,
      column: 8
    },
  ],
});

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
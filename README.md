# stylelint-postcss-custom-properties

A [stylelint](https://github.com/stylelint/stylelint) plugin that reveals values defined with [PostCSS Custom Properties plugin](https://github.com/postcss/postcss-custom-properties).

A error from the plugin looks like this:
```
1:1  ✖  The value (or a part of it) should be presented as a custom property: "#FFF" is "--white"
```

## Installation

```
npm install stylelint-postcss-custom-properties
```

## Usage

Add it to your stylelint config `plugins` array, then add `"plugin/postcss-custom-properties"` to your rules,
specifying the `customPropertiesJsonFilePath` option with path of a JSON-file that contains list of custom properties.

Like so:

```js
// .stylelintrc
{
  "plugins": [
    "stylelint-postcss-custom-properties"
  ],
  "rules": {
    // ...
    "plugin/postcss-custom-properties": {
       "customPropertiesJsonFilePath": "./customProperties.json"
    },
    // ...
  }
}
```

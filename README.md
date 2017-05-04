<img src="https://s3.amazonaws.com/media.briandavidvaughn.com/images/palettable-rainbow-logo.png" width="371" height="43" title="Palettable">

> Generate HTML color palette from [SASS/SCSS](http://sass-lang.com/) or [Stylus](http://learnboost.github.io/stylus/) stylesheets.

So that these...

```js
// app/css/scss.scss
$red: #e35256;

// app/css/sass.sass
green: rgb(141, 181, 23)

// app/css/stylus.styl
blue = #0073bA
```

Becomes these...

<img src="https://s3.amazonaws.com/media.briandavidvaughn.com/images/palettable-sample-rgb-palette.png" width="628" height="170" title="Palettable sample palette">

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with either [Bower](http://bower.io/) or [NPM](https://www.npmjs.org/):

##### Bower
```shell
bower install palettable --save-dev
```

##### NPM
```shell
npm install palettable --save-dev
```
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('palettable');
```

This plugin also makes use of the [TinyColor JavaScript library](https://github.com/bgrins/TinyColor). Special thanks to Brian Grinstead!

## Overview

In your project's Gruntfile, add a section named `palettable` to the data object passed into `grunt.initConfig()`. Although Palettable does not *require* any configuration settings it is recommended to specify the location of your project's stylesheets as follows:

```js
grunt.initConfig({
  palettable: {
    options: {
      stylesDirectory: 'app/css/',
      excludedFiles: '**/kss.scss'
      // Optional configuration options go here
    }
  }
})
```

See below for a complete list of configuration options.

### Which formats are supported?

This plugin supports SASS (both SASS and SCSS varieties) as well as Stylus.
The following table illustrates what types of color variables the plugin will recognize:

SASS | SCSS | Styuls | &nbsp;
--- |--- |--- |:---:
`$red: #FF0000` | `$red: #FF0000;` | `red = #FF0000` | ✓
`$red: #F00` | `$red: #F00;` | `red = #F00` | ✓
`$red: rgb(255,0,0)` | `$red: rgb(255,0,0);` | `red = rgb(255,0,0)` | ✓
`$red: rgba(255,0,0,1)` | `$red: rgba(255,0,0,1);` | `red = rgba(255,0,0,1)` | ✓
`$red: red` | `$red: red;` | `red = blue` | x
`$color: $other-color` | `$color: $other-color;` | `color = other-red` | x
`border-color: #F00` | `border-color: #F00;` | `border-color #F00` | x

Not that with the above rgb/rgba examples, spacing between the rgb values is ignored.
With rgba() variables the alpha channel is also ignored.

## Configuration Options

#### stylesDirectory
Type: `String`;
Default `.`

This is the base directory for all of your SASS/SCSS files. Grunt will recurse this directory looking for color variables.

#### excludedFiles
Type: `String`;
Default `null`

Here you can specify the file(s) you want to exclude from the process. Grunt will ignore those files.

#### outputFilePath
Type: `String`;
Default `color-palette.html`

Color palette HTML output will be written to this file.

#### templateSwatchPath
Type: `String`;
Defaults to bundled template.

Customize this template to control the presentation of an individual color-swatch.
This type of template can be injected with multiple parameters.
Refer to section *Customizing HTML swatches template* below.

#### templateLayoutPath
Type: `String`;
Defaults to bundled template.

Customize this template to override the layout and/or CSS styles of the color palette HTML.
Refer to section *Customizing Layout template* below.

#### hoverColorFunction
Type: `Function`;
Optionally overrides built-in hover conversion

This function receives a single parameter (a `tinycolor` instance) and should return the same. The default implementation is as follows:

#### tintColorFunction
Type: `Function`;
Optionally overrides built-in tint conversion

This function receives a single parameter (a `tinycolor` instance) and should return the same. The default implementation is as follows:

```js
function tintColor( color ) {
  return tinycolor({ h: color.toHsv().h, s: 10, v: 99 });
}
```

#### shadeColorFunction
Type: `Function`;
Optionally overrides built-in shade conversion

This function receives a single parameter (a `tinycolor` instance) and should return the same. The default implementation is as follows:


```js
function shadeColor( color ) {
  return color.clone().darken(15);
}
```

#### colorSortFunction
Type: `Function`;
Optionally overrides built-in color sort

This is not a JavaScript sort function, but a function that computes the sort-weight.
It receives a single parameter (a `tinycolor` object) and should return a numeric value.
For example, a simple implementation that sorts based on hue would look like:

```js
function hoverColor( color ) {
  return color.toHsv().h;
}
```

For more infomration on JavaScript sorting refer to the [w3 schools documentation](http://www.w3schools.com/jsref/jsref_sort.asp).

#### openInBrowser
Type: `Boolean`;
Defaults to false

Automatically opens the default system web browser to the newly-created color palette on completion.

## Customizing HTML templates

### Layout template

If you choose to override the default `templateLayoutPath` your template must declare a `swatchesHtml` variable as follows:

```html
<body>
  <%= swatchesHtml %>
</body>
```

### Swatches template

If you choose to override the default `templateSwatchPath` your template can make use of the following variables:

* **color**: Hex value of color variable
* **contrastColor**: High-contrast variation of the main swatch color; good for primary text
* **lowContrastColor**: Low-contrast variation of the main swatch color; good for secondary text
* **fileName**: Name of file in which the color variable is defined
* **variableName**: Name of variable that defines this color
* **hoverColor**: Color variation subtable for a hover transition
* **tintColor**: Color variation subtable for complimentary background transition
* **shadeColor**: Color variation subtable for a click/active transition

Variables are inserted into the template using `grunt.template.process` and should be declared as follows:

```html
<div class="name" style="background-color: <%= color %>; color: <%= contrastColor %>;">
  <%= variableName %>
</div>
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

2017-05-02   v1.1.0   Added a parameter to exclude specific file(s).
2014-07-14   v1.0.0   Initial release. Full SASS and Stylus support.

## License
Copyright (c) 2014 Brian Vaughn. Licensed under the MIT license.

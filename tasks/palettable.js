/*
 * palettable
 *
 * Copyright (c) 2014 Brian Vaughn
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {
  grunt.registerTask('palettable', 'Generate HTML color palette from SCSS source code.', function() {
    var tinycolor = require('tinycolor2');
    var palettable = require(__dirname + '/../lib/palettable');

    // Add a couple of convenience methods to Tiny Object instances.
    tinycolor.prototype.clone = function() {
      return tinycolor(this.toHex());
    };
    tinycolor.prototype.getContrast = function() {
      return tinycolor.mostReadable(this.toHex(), ['#FFFFFF', '#000000']);
    };

    // Merge configuration with default settings.
    var options = this.options({
      colorSortFunction: palettable.defaultColorSortWeightFunction,
      openInBrowser: false,
      outputFilePath: 'color-palette.html',
      stylesDirectory: '.',
      excludedFiles: '/',
      templateLayoutPath: __dirname + '/../templates/layout.html',
      templateSwatchPath: __dirname + '/../templates/swatch.html',
      hoverColorFunction: palettable.defaultHoverColorFunction,
      tintColorFunction: palettable.defaultTintColorFunction,
      shadeColorFunction: palettable.defaultShadeColorFunction
    });

    if (!grunt.file.isDir(options.stylesDirectory)) {
      console.log('Invalid SCSS directory', options.stylesDirectory);

      return;
    }

    // All of our gathered color variables will be added to this collection.
    var colors = [];

    // Gather all $colors in our SCSS files
    grunt.file.expand({cwd: options.stylesDirectory}, '**/*.scss', '!' + options.excludedFiles).
    forEach(function(file) {
      palettable.parseSCSS(
        grunt.file.read(options.stylesDirectory + '/' + file),
        file,
        colors);
    });

    // Gather all $colors in our SCSS files
    grunt.file.expand({cwd: options.stylesDirectory}, '**/*.sass', '!' + options.excludedFiles).
    forEach(function(file) {
      palettable.parseSASS(
        grunt.file.read(options.stylesDirectory + '/' + file),
        file,
        colors);
    });

    // Gather all $colors in our SCSS files
    grunt.file.expand({cwd: options.stylesDirectory}, '**/*.styl', '!' + options.excludedFiles).
    forEach(function(file) {
      palettable.parseStylus(
        grunt.file.read(options.stylesDirectory + '/' + file),
        file,
        colors);
    });

    // Sort by hue
    colors = palettable.sortColors(colors, options.colorSortFunction);

    // Calculate all derivative values based on the initial color
    palettable.calculateDerivativeInformation(
      colors,
      options.hoverColorFunction,
      options.shadeColorFunction,
      options.tintColorFunction);

    var divs = [];

    // Construct HTML swatches
    colors.forEach(function(colorHash) {
      var contents =
        grunt.template.process(
          grunt.file.read(options.templateSwatchPath),
          { data: colorHash } );

      divs.push(contents);
    });

    // Assemble final color palette HTML
    var html =
      grunt.template.process(
        grunt.file.read(options.templateLayoutPath),
        { data: { swatchesHtml: divs.join('') } } );

    grunt.file.write(options.outputFilePath, html);

    if (options.openInBrowser) {
      require('open')(options.outputFilePath);
    }
  });
};

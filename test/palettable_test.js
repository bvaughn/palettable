'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

var palettable = require('../lib/palettable');

exports.palettable = {

  // Tests overall parsing of SASS, SCSS, and Stylus files within a styles directory.
  sanity_check: function(test) {
    test.expect(1);

    test.equal(
      grunt.file.read('tmp/sanity-check.html'),
      grunt.file.read('test/expected/sanity-check.html'),
      'Should parse a single SCSS file and generate an HTML template');

    test.done();
  },

  test_scss_parsing: function(test) {
    var lines = [];
    lines.push('$red: #FF0000;');
    lines.push('$red: #f00;');
    lines.push('$red: rgb(255,0,0);');
    lines.push('$red: rgba(255, 0, 0, 1);');

    for (var i = 0; i < lines.length; i++ ) {
      var matches = palettable.parseSCSS(lines[i], 'file');

      test.equal(matches.length, 1);

      var data = matches[0];

      test.equal(data.variableName, 'red');
      test.equal(data.fileName, 'file');
      test.equal(data.tinycolor.toHexString().toUpperCase(), '#FF0000');
    }

    test.done();
  },

  test_sass_parsing: function(test) {
    var lines = [];
    lines.push('$red: #FF0000');
    lines.push('$red: #f00');
    lines.push('$red: rgb(255,0,0)');
    lines.push('$red: rgba(255, 0, 0, 1)');

    for (var i = 0; i < lines.length; i++ ) {
      var matches = palettable.parseSASS(lines[i], 'file');

      test.equal(matches.length, 1);

      var data = matches[0];

      test.equal(data.variableName, 'red');
      test.equal(data.fileName, 'file');
      test.equal(data.tinycolor.toHexString().toUpperCase(), '#FF0000');
    }

    test.done();
  },

  test_stylus_parsing: function(test) {
    var lines = [];
    lines.push('red = #FF0000');
    lines.push('red = #f00');
    lines.push('red = rgb(255,0,0)');
    lines.push('red = rgba(255, 0, 0, 1)');

    for (var i = 0; i < lines.length; i++ ) {
      var matches = palettable.parseStylus(lines[i], 'file');

      test.equal(matches.length, 1);

      var data = matches[0];

      test.equal(data.variableName, 'red');
      test.equal(data.fileName, 'file');
      test.equal(data.tinycolor.toHexString().toUpperCase(), '#FF0000');
    }

    test.done();
  },

  test_create_tinycolor: function(test) {
    test.ok( palettable.createTinyColor('#FF0000') );
    test.equal( palettable.createTinyColor('foobar'), null );
    test.done();
  },

  test_default_sort: function(test) {
    var black = { variableName: 'black',  tinycolor: palettable.createTinyColor('#000000') };
    var white = { variableName: 'white',  tinycolor: palettable.createTinyColor('#FFFFFF') };
    var red   = { variableName: 'red',    tinycolor: palettable.createTinyColor('#FF0000') };
    var green = { variableName: 'green',  tinycolor: palettable.createTinyColor('#00FF00') };
    var blue  = { variableName: 'blue',   tinycolor: palettable.createTinyColor('#0000FF') };

    var sortedArray =
      palettable.sortColors(
        [black, blue, green, red, white],
        palettable.defaultColorSortWeightFunction);

    test.equal(black, sortedArray[0]);
    test.equal(white, sortedArray[1]);
    test.equal(red, sortedArray[2]);
    test.equal(green, sortedArray[3]);
    test.equal(blue, sortedArray[4]);

    test.done();
  }
};

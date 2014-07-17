/*
 * palettable
 *
 *
 * Copyright (c) 2014 Brian Vaughn
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    palettable: {
      options: {
        outputFilePath: 'tmp/sanity-check.html',
        stylesDirectory: 'test/fixtures/sanity-check',
        templateLayoutPath: 'test/templates/layout.html',
        templateSwatchPath: 'test/templates/swatch.html'
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'palettable', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};

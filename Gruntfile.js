module.exports = function (grunt) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        jshint: {
            all: ['Gruntfile.js', './*.js', 'lib/**/*.js', 'test/**/*.js'],
            options: {
              globals: {
                require: false,
                module: false,
                describe: false,
                exports: false,
                it: false,
                console: false,
                beforeEach: false,
                before: false,
                after: false,
                __dirname: false,
                afterEach: false
              },
              strict: true,
              globalstrict: true
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', './*.js', 'lib/**/*.js', 'test/**/*.js'],
                tasks: ['jshint','mochaTest'],
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default task(s).
    grunt.registerTask('default', ['mochaTest']);
};
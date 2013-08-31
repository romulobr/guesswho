module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all:['Gruntfile.js', './*.js', 'lib/**/*.js', 'specs/**/*.js']
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', './*.js', 'lib/**/*.js', 'specs/**/*.js'],
        tasks: ['jshint'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};

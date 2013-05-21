



/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: [
          'source/nes.js',
          'source/utils.js',
          'source/cpu.js',
          'source/keyboard.js',
          'source/mappers.js',
          'source/papu.js',
          'source/ppu.js',
          'source/rom.js',
          'source/ui.js'
        ],
        dest: 'dist/<%= pkg.name %>.src.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    },
    mocha_phantomjs: {
      all: ['test/**/*.html']
    },
    'gh-pages': {
      options: {
      },
      src: ['index.html', 'dist/**/*', 'lib/**/*', 'roms/**/*.nes']
    },
    bower: {
      install: {
         cleanBowerDir: true,

        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },


  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.registerTask('build', ['bower', 'concat', 'uglify']);
  // Default task.
  grunt.registerTask('default', ['build']);

  grunt.registerTask('test', ['build', 'build_test_roms', 'mocha_phantomjs']);
  grunt.registerTask('test:only', ['mocha_phantomjs']);
  grunt.registerTask('release', ['build', 'test', 'gh-pages']);
  grunt.registerTask('build_test_roms', 'Creates browser-friendly roms in test/roms files for testing', function() {
    var done = this.async();
    grunt.log.writeln('Looking for roms...');
    var path = require('path'),
      fs = require('fs'),
      walker;

    var files = require('findit').sync("./roms");
    var filesTexts = files.filter(function (file){
      return (path.extname(file)==".nes");
    }).map(function (file) {
      grunt.log.writeln("Found "+file);
      var romData = fs.readFileSync(file);
      var base64Rom = new Buffer(romData, 'binary').toString('base64');
      var romName = path.basename(file, path.extname(file));
      return "'"+romName+"':'"+base64Rom+"'";

    });
    var licenseData = fs.readFileSync(path.join("roms", "licenses"));
    var jsRomsData = filesTexts.join(",\n");

    var M = require('mstring');

    var jsRomsResult = "/*\n"+licenseData+"*/\n" + M(function(){/***
var getTestRom = (function() {
  var roms = {
***/}) +"\n"+ jsRomsData+ "\n"+ M(function(){/***
}
  return function(romName) {
    var rom = roms[romName];
    // Requires base64.js
    if (typeof atob === 'undefined') {
      return Base64.decode(rom);
    }
    else {
      return atob(rom);
    }
  };
})();
    ***/});
    fs.writeFileSync(path.join("test","_roms_for_test.js"), jsRomsResult);

    grunt.log.writeln("Done");
    done();

  });

};

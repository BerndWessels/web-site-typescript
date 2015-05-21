'use strict';

module.exports = function (grunt) {
  // Load the express server local configuration.
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed.
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    env: 'grunt-env'
  });

  // Used for delaying livereload until after server has restarted.
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  // Serve development build.
  grunt.registerTask('serve-dev', [
    'clean:default', 'clean:dist',
    'injector:less', 'less', 'autoprefixer',
    'tsd', 'html2ts', 'tslint', 'typescript', 'tso',
    'wiredep',
    'express:dev', 'open', 'watch'
  ]);

  // Serve production build.
  grunt.registerTask('serve-prod', [
    'clean:default', 'clean:dist',
    'injector:less', 'less', 'autoprefixer',
    'tsd', 'html2ts', 'tslint', 'typescript', 'tso',
    'wiredep',
    'useminPrepare', 'concat', 'copy:dist', 'cssmin', 'uglify', 'rev', 'usemin',
    'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive'
  ]);

  // Project configuration.
  grunt.initConfig({

      // Import the package.json.
      pkg: grunt.file.readJSON('package.json'),

      cfg: {
        // configurable paths
        client: require('./bower.json').appPath || 'client',
        dist: 'dist'
      },

      // Empties folders to start fresh.
      clean: {
        css: {
          src: ['<%= cfg.client %>/.css']
        },
        js: {
          src: ['<%= cfg.client %>/.js']
        },
        ts: {
          src: ['<%= cfg.client %>/.ts']
        },
        tsd: {
          src: ['<%= cfg.client %>/.tsd']
        },
        default: {
          src: [
            '<%= cfg.client %>/.js',
            '<%= cfg.client %>/.ts',
            '<%= cfg.client %>/.css'
          ]
        },
        dist: {
          src: [
            '.dist',
            '<%= cfg.dist %>'
          ]
        }
      },

      //
      // Client
      //

      // Inject dynamic code.
      injector: {
        options: {},
        // Inject component less into app.less
        less: {
          options: {
            sort: function (a, b) {
              return a.length > b.length;
            },
            transform: function (filePath) {
              filePath = filePath.replace('/' + grunt.config.get('cfg').client + '/app/', '');
              filePath = filePath.replace('/' + grunt.config.get('cfg').client + '/components/', '../components/');
              return '@import \'' + filePath + '\';';
            },
            starttag: '// injector',
            endtag: '// endinjector'
          },
          files: {
            '<%= cfg.client %>/app/app.less': [
              '<%= cfg.client %>/{app,components}/**/*.less',
              '!<%= cfg.client %>/{app,components}/**/*.whitelabel1.less',
              '!<%= cfg.client %>/{app,components}/**/*.whitelabel2.less',
              '!<%= cfg.client %>/app/app.less',
              '!<%= cfg.client %>/app/app.*.less'
            ],
            '<%= cfg.client %>/app/app.whitelabel1.less': [
              '<%= cfg.client %>/{app,components}/**/*.whitelabel1.less',
              '!<%= cfg.client %>/app/app.less',
              '!<%= cfg.client %>/app/app.*.less'
            ],
            '<%= cfg.client %>/app/app.whitelabel2.less': [
              '<%= cfg.client %>/{app,components}/**/*.whitelabel2.less',
              '!<%= cfg.client %>/app/app.less',
              '!<%= cfg.client %>/app/app.*.less'
            ]
          }
        },
        // Inject component css into index.html
        css: {
          options: {
            transform: function (filePath) {
              filePath = filePath.replace('/' + grunt.config.get('cfg').client + '/', '');
              return '<link rel="stylesheet" href="' + filePath + '">';
            },
            starttag: '<!-- injector:css -->',
            endtag: '<!-- endinjector -->'
          },
          files: {
            '<%= cfg.client %>/index.html': [
              '<%= cfg.client %>/{app,components}/**/*.css'
            ]
          }
        }
      },

      // Compiles Less to CSS.
      less: {
        server: {
          files: {
            '<%= cfg.client %>/.css/app/app.css': '<%= cfg.client %>/app/app.less',
            '<%= cfg.client %>/.css/app/app.whitelabel1.css': '<%= cfg.client %>/app/app.whitelabel1.less',
            '<%= cfg.client %>/.css/app/app.whitelabel2.css': '<%= cfg.client %>/app/app.whitelabel2.less'
          }
        }
      },

      // Automatically add vendor prefixed styles.
      autoprefixer: {
        options: {
          browsers: ['last 2 version']
        },
        dist: {
          files: [{
            expand: true,
            cwd: 'client/.css/',
            src: '{,*/}*.css',
            dest: 'client/.css/'
          }]
        }
      },

      // TypeScript Definition Task for DefinitelyTyped.
      tsd: {
        refresh: {
          options: {
            // Execute a command.
            command: 'reinstall',
            // Optional: Always get from HEAD.
            latest: true,
            // Specify config file.
            config: 'tsd.json',
            // Experimental: Options to pass to tsd.API.
            opts: {
              // Props from tsd.Options.
            }
          }
        }
      },

      // Transform HTML into Typescript templates.
      html2ts: {
        default: {
          options: {
            truncateNamespace: 'client',
            truncateDir: '<%= cfg.client %>',
            htmlOutDir: '<%= cfg.client %>/.ts'
          }
          ,
          files: {
            options: ['<%= cfg.client %>/app/**/*.html', '<%= cfg.client %>/components/**/*.html']
          }
        }
      },

      // Typescript Linting Task.
      tslint: {
        options: {
          configuration: grunt.file.readJSON('tslint.json')
        }
        ,
        default: {
          src: ['<%= cfg.client %>/app/**/*.ts', '<%= cfg.client %>/.ts/**/*.ts', '<%= cfg.client %>/components/**/*.ts']
        }
      },

      // Typescript Compiler Task.
      typescript: {
        default: {
          src: ['<%= cfg.client %>/app/**/*.ts', '<%= cfg.client %>/.ts/**/*.ts', '<%= cfg.client %>/components/**/*.ts'],
          dest: '<%= cfg.client %>/.js',
          options: {
            references: ['<%= cfg.client %>/.tsd/tsd.d.ts'],
            module: 'amd', //or commonjs
            target: 'es5', //or es3
            basePath: '<%= cfg.client %>',
            sourceMap: true,
            declaration: false
          }
        }
      },

      // Analyze the Typescript order and generate HTML script tags.
      tso: {
        default: {
          options: {
            truncateDir: '<%= cfg.client %>',
            htmlOutDir: '.js',
            htmlOutExt: '.js',
            starttag: '<!-- injector:js -->',
            endtag: '<!-- endinjector -->'
          }
          ,
          files: {
            html: ['<%= cfg.client %>/index.html'],
            ts: ['<%= cfg.client %>/app/**/*.ts', '<%= cfg.client %>/.ts/**/*.ts', '<%= cfg.client %>/components/**/*.ts']
          }
        }
      },

      // Automatically inject Bower components into the app
      wiredep: {
        default: {
          src: '<%= cfg.client %>/index.html',
          ignorePath: '<%= cfg.client %>/',
          exclude: [
            /bootstrap-sass-official/,
            /bootstrap.css/,
            /bootstrap.js/,
            /font-awesome.css/,
            /jquery/,
            '/json3/',
            '/es5-shim/'
          ]
        }
      },

      // Renames files for browser caching purposes.
      rev: {
        dist: {
          files: {
            src: [
              '<%= cfg.dist %>/public/{,*/}*.js',
              '<%= cfg.dist %>/public/{,*/}*.css',
              '<%= cfg.dist %>/public/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
              '<%= cfg.dist %>/public/assets/fonts/{,*/}*.{eot,ttf,woff,woff2,svg}'
            ]
          }
        }
      },

      // Configure CSS minification to remove ALL comments.
      cssmin: {
        options: {
          keepSpecialComments: 0
        }
      },

      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files. Creates configurations in memory so
      // additional tasks can operate on them
      useminPrepare: {
        html: ['<%= cfg.client %>/index.html'],
        options: {
          staging: '.dist',
          dest: '<%= cfg.dist %>/public'
        }
      },

      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= cfg.client %>',
            dest: '<%= cfg.dist %>/public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'bower_components/**/*',
              'assets/images/{,*/}*.{webp}',
              'assets/fonts/**/*',
              'assets/translations/**/*',
              'index.html'
            ]
          }, {
            expand: true,
            cwd: '.dist/images',
            dest: '<%= cfg.dist %>/public/assets/images',
            src: ['generated/*']
          }, {
            expand: true,
            dest: '<%= cfg.dist %>',
            src: [
              'package.json',
              'server/**/*'
            ]
          }]
        }
      },

      // Performs rewrites based on rev and the useminPrepare configuration
      usemin: {
        html: ['<%= cfg.dist %>/public/{,*/}*.html'],
        css: ['<%= cfg.dist %>/public/{,*/}*.css'],
        js: ['<%= cfg.dist %>/public/{,*/}*.js'],
        options: {
          assetsDirs: [
            '<%= cfg.dist %>/public',
            '<%= cfg.dist %>/public/assets/images',
            '<%= cfg.dist %>/public/assets/translations'
          ],
          // This is so we update image references in our ng-templates
          patterns: {
            js: [
              [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
            ]
          }
        }
      },

      // The following *-min tasks produce minified files in the dist folder
      imagemin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%= cfg.client %>/assets/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= cfg.dist %>/public/assets/images'
          }]
        }
      },

      svgmin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%= cfg.client %>/assets/images',
            src: '{,*/}*.svg',
            dest: '<%= cfg.dist %>/public/assets/images'
          }]
        }
      },

      //
      // Server
      //

      // Set the environment for the express server.
      env: {
        test: {
          NODE_ENV: 'test'
        },
        prod: {
          NODE_ENV: 'production'
        },
        all: localConfig
      },

      // Run the express server application.
      express: {
        options: {
          port: process.env.PORT || 9000
        },
        dev: {
          options: {
            script: 'server/app.js',
            debug: true
          }
        },
        prod: {
          options: {
            script: '<%= cfg.dist %>/server/app.js'
          }
        }
      },

      // Open the application.
      open: {
        server: {
          url: 'http://localhost:<%= express.options.port %>'
        }
      },

      // Start watching for changes.
      watch: {
        options: {
          event: ['changed', 'added', 'deleted']
        },
        typescript: {
          files: [
            '<%= cfg.client %>/app/**/*.ts', '<%= cfg.client %>/.ts/**/*.ts', '<%= cfg.client %>/components/**/*.ts'
          ],
          tasks: ['tslint', 'typescript', 'tso']
        },
        html: {
          files: [
            '<%= cfg.client %>/app/**/*.html', '<%= cfg.client %>/components/**/*.html'
          ],
          tasks: ['html2ts']
        },
        less: {
          files: [
            '<%= cfg.client %>/app/**/*.less', '<%= cfg.client %>/components/**/*.less'
          ],
          tasks: ['injector:less', 'less', 'autoprefixer']
        },
        livereload: {
          files: [
            '<%= cfg.client %>/index.html',
            '<%= cfg.client %>/.css/**/*.css',
            '<%= cfg.client %>/.js/**/*.js'
          ],
          options: {
            livereload: {
              port: 35729
            }
          }
        }
      }

    }
  );
};

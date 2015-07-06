module.exports = function(grunt){
    "use strict";
    // ====================== CONFIGURATION ============== //
    var SOURCE_DIR = "./",
        BUILD_DIR = "build",
        // DEFAULT LESS SOURCE DIRECTORY
        LESS_ROOT_DIR = "assets/less",
        LESS_SOURCE_DIR = ["*.less"],
        lESS_WATCH_DIR = [
            "assets/less/*.less",
            "assets/less/**/*.less"
        ],
        CSS_ROOT_DIR = "assets/css",
        // DEFAULT CSS SOURCE DIRECTORY
        CSS_SOURCE_DIR = [
            "assets/css/*.css", 
            "assets/css/**/*.css",
            "!assets/css/*.min.css",
            "!assets/css/**/*.min.css"
        ],
        // LIST ALL OF JAVASCRIPT MODULES
        ALMOND_LIBRARY_PATH = "assets/js/vendor/almond/almond",
        JS_MODULE_DIR = [
            {
                "name" : "app/main",
                "include" : ALMOND_LIBRARY_PATH
            }
        ],
        JS_CONFIG_FILE = [
            "config/config.js"
        ],
        // LIST OF JAVASCRIPT FILES BEING DEPLOYED
        JS_SOURCE_DIR = [
            "app/**/*.js",
            "app/*.js",
            "assets/js/*.js",
            "assets/js/**/*.js",
            "!app/**/*.min.js",
            "!app/*.min.js",
            "!assets/js/*.min.js",
            "!assets/js/**/*.min.js",
            "!assets/js/vendor/**/*.js"
        ];

    // ====================== END OF CONFIGURATION ============== //

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            dev: {
                options: {
                    port: 3000,
                    base: ".",
                    keepalive: true
                }
            },
            live : {
                options: {
                    port: 8080,
                    base: "build",
                    keepalive: true
                }
            }
        },
        clean : {
            vendors : ["assets/js/vendor"],
            build : ["build"]
        },
        cssmin : {
            build : {
                files : [
                    {
                        expand : true,
                        cwd : BUILD_DIR,
                        src : CSS_SOURCE_DIR,
                        dest: BUILD_DIR
                    }
                ]
            }
        },
        compare_size : {
            files : [
                'assets/css/**/*.css',
                'assets/js/**/*.js',
                'build/assets/css/**/*.css',
                'build/assets/js/**/*.js'
            ]
        },
        less : {
            build : {
                options : {
                    compress : false, // cssmin will be later used on build
                    ieCompat : true,
                    banner : "/*This is auto generated CSS files - <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %>*/"
                },
                files : [
                    {
                        expand:true,
                        cwd : LESS_ROOT_DIR,
                        src : LESS_SOURCE_DIR,
                        dest: CSS_ROOT_DIR,
                        ext : ".css"                
                    }
                ]
            }
        },
        requirejs : {
            build : {
                options : {
                    optimize : "none",
                    optimizeCss : "none",
                    baseUrl : SOURCE_DIR,
                    dir : BUILD_DIR,
                    findNestedDependencies : true,
                    mainConfigFile : JS_CONFIG_FILE,
                    modules : JS_MODULE_DIR
                }
            }
        },
        uglify : {
            options : {
                sourceMap : true,
                compress : true,
                banner : '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            build : {
                files : [
                    {
                        expand : true,
                        cwd : BUILD_DIR,
                        src : JS_SOURCE_DIR,
                        dest: BUILD_DIR
                    }
                ]
            }
        },
        useminPrepare : {
            build : "*.html",
            options : {
                dest : BUILD_DIR,
                flow : {
                    build : {
                        steps : {
                            css : ['concat'], // cssmin will take care of the minimalization
                            js : ['requirejs'] // requirejs build will take care of this
                        },
                        post : {}
                    }
                }
            }
        },
        usemin : {
            build : BUILD_DIR + "/*.html",
            options : {
                dirs : BUILD_DIR
            }
        },
        watch: {
            less : {
                files : lESS_WATCH_DIR,
                tasks : ['less:build'],
                options : {
                    nospawn : true
                }
            }
        }       
    });

    // load all grunt--* plugins
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Default task(s).
    grunt.registerTask('default', [
        'less',
        'connect:dev'
    ]);
    grunt.registerTask('build', [
        'clean:build',                  // clean directory
        'less',                         // generate new css from less sources
        'requirejs:build',              // build the requirejs modules deps
        'uglify:build',                 // minify and aggregate js
        'cssmin',                       // minify css
        'buildHTML',                    // optimize HTML output
        'complete_task'
    ]);
    grunt.registerTask('buildHTML', [
        'useminPrepare',
        'concat:generated',
        'usemin'
    ]);
    grunt.registerTask('complete_task', 'Completed Task', function(){
        grunt.log.subhead("All tasks are completed");
    });
}

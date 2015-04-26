module.exports = function(grunt){
    "use strict";

    var BUILD_DIR = "build";

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
            build : ["build", "assets/css/main.css", "assets/css/main.css.map"]
        },
        cssmin : {
            build : {
                options : {
                    sourceMap : true
                },
                files : [
                    {
                        expand : true,
                        cwd : BUILD_DIR,
                        src : ["assets/css/*.css", "assets/css/**/*.css", "!assets/css/*.min.css", "!assets/css/**/*.min.css"],
                        dest: BUILD_DIR
                    }
                ]
            }
        },
        requirejs : {
            build : {
                options : {
                    optimize : "uglify2",
                    findNestedDependencies : false,
                    baseUrl : "./",
                    dir : BUILD_DIR,
                    skipDirOptimize: true,
                    optimizeCss : "none",
                    logLevel : 1,
                    mainConfigFile : [
                        "assets/js/config.js"
                    ],
                    modules : [
                        {
                            "name" : "assets/js/main"
                        }
                    ]
                }
            }
        },
        less : {
            options : {
                compress : true,
                sourceMap : true,
                outputSourceFiles : true
            },
            mainCss : {
                options : {
                    sourceMapURL : "main.css.map",
                    sourceMapFilename : "assets/css/main.css.map",
                },
                files : {
                    "assets/css/main.css" : "assets/less/main.less"
                }
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
        'clean:build', 
        'less',
        'requirejs:build',
        'buildHTML',
        'cssmin:build' 
    ]);
    grunt.registerTask('buildHTML', [
        'useminPrepare',
        'concat:generated',
        'usemin'
    ]);
}

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
            build : ["build"]
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
                        src : "assets/css",
                        dest: BUILD_DIR
                    }
                ]
            }
        },
        requirejs : {
            build : {
                options : {
                    optimize : "none",
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
        }

    });

    // load all grunt--* plugins
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['connect:dev']);
    grunt.registerTask('build', ['clean:build', 'requirejs:build', 'cssmin']);


}
module.exports = function(grunt){
    
    // ====================== CONFIGURATION ============== //
    var SOURCE_DIR = "./",
        BUILD_DIR = grunt.option("build_dir") || "build",
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
        // Default: only concern of everything under app/** and assets/**
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
        ],
        // List of files to be watched by browserSync
        // Default, will watch any changes of JS, CSS, HTML
        BROWSER_SYNC_WATCHED_FILES = [
            "**/*.html", "*.html",
            "**/*.js","*.js",
            "**/*.css", "*.css"
        ],        
        // File exclusions during sites build
        BUILD_EXCLUSIONS = /^(build|dist|bower\_components|node\_modules|\.|Gruntfile|config|package\.json|bower\.json).*/i,
        TEST_DIR = "test",
        KARMA_CONFIGURATION_FILES = [
            {pattern: 'config/**/*.js', included: true},
            {pattern: 'app/**/templates/**/*.html', included : false},
            {pattern: 'app/**/i18n/**/*.properties', included : false},
            {pattern: 'app/**/*.js', included: false},
            {pattern: 'assets/**/*.js', included: false}
        ];
    // ====================== END OF CONFIGURATION ============== //

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserSync : {
            dev  : {
                options : {
                    server : {
                        baseDir : "."
                    },
                    watchTask : true
                },
                bsFiles : {
                    src : BROWSER_SYNC_WATCHED_FILES, 
                },
                port : 3000
            }
        },        
        connect: {
            dev: {
                options: {
                    port: 3000,
                    base: "."
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
            build : [BUILD_DIR]
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
        karma : {
            options : {
                files : KARMA_CONFIGURATION_FILES
            },
            e2e : {
                configFile : TEST_DIR + "/config/e2e_karma.conf.js"
            },
            file : {
                configFile : TEST_DIR + "/config/individual_karma.conf.js"
            }
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
            options : {
                optimize : "none",
                optimizeCss : "none",
                baseUrl : SOURCE_DIR,
                dir : BUILD_DIR,
                findNestedDependencies : true,
                mainConfigFile : JS_CONFIG_FILE,
                modules : JS_MODULE_DIR
            },
            build : {
                options : {
                    fileExclusionRegExp : BUILD_EXCLUSIONS
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
        'browserSync:dev',
        'watch:less'
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

    // Register Karma Individual unit test
    grunt.registerTask('test', 'Run unit test test', function(){
        var unittestFile = grunt.option("file") || "";

        if (unittestFile === ""){
            grunt.log.subhead("Running end 2 end unit testing");
            var e2eKarmaFiles = KARMA_CONFIGURATION_FILES;
            e2eKarmaFiles.push("test/config/e2e_test_main.js");
            e2eKarmaFiles.push({pattern : 'test/**/*Spec.js', included:false});
            e2eKarmaFiles.push({pattern : 'test/**/*spec.js', included:false});
            grunt.config('karma.config.files', e2eKarmaFiles);
            grunt.log.writeln('Config files ', e2eKarmaFiles);
            grunt.task.run("karma:e2e");
        } else {
            grunt.log.subhead("Running individual unit testing");
            var individualKarmaFiles = KARMA_CONFIGURATION_FILES;
            if (unittestFile.indexOf(".js") <= -1){
                unittestFile += ".js";
            }
            individualKarmaFiles.push("test/config/individual_test_main.js");
            individualKarmaFiles.push({pattern : 'test/**/' + unittestFile, included:false});
            grunt.config('karma.config.files', individualKarmaFiles);
            grunt.log.writeln('Config files ', individualKarmaFiles);
            grunt.task.run("karma:file");
        }
    });
}

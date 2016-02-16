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
        // *****************************************************************//
        //              LIST OF JAVASCRIPT FILES BEING DEPLOYED             //
        // Default: only concern of everything under app/** and assets/**   //
        // *****************************************************************//
        JS_SOURCE_DIR = [<% if (generatorType === "site") {%>
            "<%= destinationAppFolder %>/**/*.js",
            "<%= destinationAppFolder %>/*.js",<%}%><% if (generatorType === "component") {%>
            "src/**/*.js", "src/*.js",<% } %>
            "assets/js/*.js",
            "assets/js/**/*.js",
            "!<%= destinationAppFolder %>/**/*.min.js",
            "!<%= destinationAppFolder %>/*.min.js",
            "!assets/js/*.min.js",
            "!assets/js/**/*.min.js",
            "!assets/js/vendor/**/*.js",
            "!node-modules/**",
            "!bower_components/**"
        ],
        ES6_SOURCE_DIR = [<% if (generatorType === "site") {%>
            "<%= destinationAppFolder %>/**/*.es6",
            "<%= destinationAppFolder %>/*.es6",<%}%><% if (generatorType === "component") {%>
            "src/**/*.es6", "src/*.es6",<% } %>
            "assets/js/*.es6",
            "assets/js/**/*.es6",
            "!<%= destinationAppFolder %>/**/*.min.es6",
            "!<%= destinationAppFolder %>/*.min.es6",
            "!assets/js/*.min.es6",
            "!assets/js/**/*.min.es6",
            "!assets/js/vendor/**/*.es6",
            "!node-modules/**",
            "!bower_components/**"
        ],
        // *****************************************************************//

        // *****************************************************************//
        //              SITE BUILD CONFIGURATION                            //
        // Note: Change below configuration to match your specific module   //
        // *****************************************************************//
        ALMOND_LIBRARY_PATH = "assets/js/vendor/almond/almond",
        // Modules which will be build
        JS_MODULE_DIR = [
            {<% if (generatorType === "site") { %>
                "name" : "<%= destinationAppFolder %>/main",<% } else if (generatorType === "component") { %> 
                "name" : "src/<%=appName %>", <% } %>
                "include" : ALMOND_LIBRARY_PATH
            }
        ],
        JS_CONFIG_FILE = [
            "config/config.js"
        ],
        // File exclusions during sites build
        BUILD_EXCLUSIONS = /^(build|dist|bower\_components|node\_modules|\.|Gruntfile|config|package\.json|bower\.json).*/i,
        // *****************************************************************//
        <% if (generatorType === "site") { %>
        // *****************************************************************//
        //              INDIVIDUAL MODULE BUILD CONFIGURATION               //
        // Note: Change below configuration to match your specific module   //
        //       - Replace INDIVIDUAL_MODULE_NAME to match the component/   //
        //          module path (e.x app/components/HelloWorldComponent)    //
        //       - Replace the output module name (e.g module.min.js) with  //
        //          desired output javascript name                          //
        //       - Go to app/config/wrap.end, replace <CHANGEME> with your  //
        //          module name. (e.x require('HelloWorldComponent'))       //
        //       - Make sure the component are using correct format         //
        //          define("<name>", function(require){})                   //
        //          <name> --> should match with <CHANGEME> on the previous //
        //                      step                                        //
        // *****************************************************************//
        // Module path e.g app/components/MyComponent
        INDIVIDUAL_MODULE_NAME = "app/main",
        // Output module name
        INDIVIDUAL_MODULE_OUTPUT_NAME = BUILD_DIR + "/" + "module.min.js",
        // DEFAULT MODULE building configuration
        REQUIREJS_MODULE_CONFIG = {
            generateSourceMaps : true,
            preserveLicenseComments : false,
            optimize : "uglify2",
            uglify2 : {
                output : {
                    beautify : false
                },
                compress : {
                    sequences : false,
                    dead_code : true,
                    drop_debugger : true,
                    unused : true
                },
                mangle : false,
                warnings : false
            },
            baseUrl : SOURCE_DIR,
            // Specify individual modules here
            name : INDIVIDUAL_MODULE_NAME,
            out : INDIVIDUAL_MODULE_OUTPUT_NAME,
            include : ALMOND_LIBRARY_PATH,
            // wrap the module with standard wrapping.
            // NOTE: Configure wrap.end to match the module name.
            wrap : {
                "startFile" : "config/wrap.start",
                "endFile" : "config/wrap.end"
            }
        },
        <% } %>
        // *****************************************************************//

        // *****************************************************************//
        //              BrowserSync CONFIGURATION                           //
        // List of files to be watched by browserSync                       //
        // Default, will watch any changes of JS, CSS, HTML                 //
        // *****************************************************************//
        BROWSER_SYNC_WATCHED_FILES = [
            "**/*.html", "*.html",
            "<%= destinationAppFolder %>/**/*.js","<%= destinationAppFolder %>/*.js",
            "config/**/*.js", "config/*.js",
            "assets/css/**/*.css", "assets/css/*.css",
            "!node-modules/**",
            "!bower_components/**"
        ],
        // *****************************************************************//

        // *****************************************************************//
        //              Unit Test with Karma CONFIGURATION                  //
        // *****************************************************************//
        TEST_DIR = "test",
        KARMA_CONFIGURATION_FILES = [
            {pattern: 'config/**/*.js', included: true},
            {pattern: '<%= mainFolder %>/**/templates/**/*.html', included : false},
            {pattern: '<%= mainFolder %>/**/i18n/**/*.properties', included : false},
            {pattern: '<%= mainFolder %>/**/*.js', included: false},
            {pattern: 'assets/**/*.js', included: false}
        ];
        // *****************************************************************//
    // ====================== END OF CONFIGURATION ============== //

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // ** Transpile ES6 into ES5 ** //
        babel : {
            options : {
                presets : ['es2015', 'react'],
                plugins : ['transform-es2015-modules-amd']
            },
            build : {
                files : [{
                        expand : true,
                        cwd : SOURCE_DIR,
                        src : ES6_SOURCE_DIR,
                        ext : '.js'
                }]
            }
        },
        // ** BrowserSync for local development ** //
        browserSync : {
            dev  : {
                options : {
                    server : {
                        baseDir : <% destinationAppFolder === "app" ? "." : destinationAppFolder %>
                    },
                    watchTask : true,
                    open : false  // disable automatically open browser
                },
                bsFiles : {
                    src : BROWSER_SYNC_WATCHED_FILES,
                },
                port : 3000
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
                    banner : "/*This is auto generated CSS files - <%%= pkg.name %> <%%= grunt.template.today('yyyy-mm-dd') %>*/"
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
                findNestedDependencies : true,
                mainConfigFile : JS_CONFIG_FILE
            },
            build : {
                options : {
                    baseUrl : SOURCE_DIR,
                    dir : BUILD_DIR,
                    modules : JS_MODULE_DIR,
                    fileExclusionRegExp : BUILD_EXCLUSIONS
                }
            <% if (generatorType === "component") { %>
            }
            <% } else { %>
            },
            build_component : {
                options : REQUIREJS_MODULE_CONFIG
            }
            <% } %>
        },
        uglify : {
            options : {
                sourceMap : true,
                compress : true,
                banner : '/* <%%= pkg.name %> <%%= grunt.template.today("yyyy-mm-dd") %> */'
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
            // options : {
            //     interval : 5007
            // },
            less : {
                files : lESS_WATCH_DIR,
                tasks : ['less:build'],
                options : {
                    nospawn : true
                }
            },
            babel : {
                files : ES6_SOURCE_DIR,
                tasks : ['babel:build'],
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
        'less:build',
        'babel:build',
        'browserSync:dev',
        'watch'
    ]);
    grunt.registerTask('build', [
        'clean:build',                  // clean directory
        'less',                         // generate new css from less sources
        'babel:build',                  // Transpile ES6 files into JS
        'requirejs:build',              // build the requirejs modules deps
        'uglify:build',                 // minify and aggregate js
        'cssmin',                       // minify css
        'buildHTML',                    // optimize HTML output
        'complete_task'
    ]);
    grunt.registerTask('build_component', [
        'clean:build',                  // clean directory
        'less',                         // generate new css from less sources
        'requirejs:build_component',    // build the requirejs modules deps
        'uglify:build',                 // minify and aggregate js
        // 'cssmin',                    // minify css, uncomment if additional css is needed
        // 'buildHTML',                 // optimize HTML output, uncomment if buildHTML needs to be invoked
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

    // Help info to show available tasks

}

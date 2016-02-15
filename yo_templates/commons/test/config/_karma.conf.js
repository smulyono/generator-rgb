/* global module */

// Module Karma configuration

module.exports = function (config) {
    "use strict";

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        // RGB pattern will put this files under test/config
        basePath: '../../',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-ajax', 'jasmine', 'requirejs'],
        // list of files / patterns to load in the browser
        files: [
            // List other files needed for unit test
        ],
        // list of files to exclude
        exclude: [
            "**/app.js"
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // all of source files which need to calculate coverage on
            'app/**/*.js' : ['coverage']
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['coverage', 'mocha'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // Chrome or PhantomJS
        browsers: ['PhantomJS'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        // IMPORTANT.... on any CI environment this singleRun must be TRUE, never commit
        // this file with singleRun: false
        singleRun: true,
        // JUnit reporter
        junitReporter: {
            outputFile: '<%=rootFolder%>/coverage/test-results.xml'
        },
        // Code coverage
        coverageReporter: {
            dir: "<%=rootFolder%>/coverage",
            watermarks: {
                statements: [65, 85],
                functions: [65, 85],
                branches:[65, 85],
                lines: [65, 85]
            },
            reporters: [
                {type: "html" ,"subdir" : "html", includeAllSources:true},
                {type: "cobertura", subdir: "cobertura", file: "cobertura.xml", includeAllSources: true},
                {type: "text"},
                {type: "text-summary"}
            ]
        }
    });
};

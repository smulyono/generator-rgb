/* global require */

"use strict";

var allTestFiles = [];
var modules = []; // list of all files which will be part of preprocessing
var TEST_REGEXP = /(spec|test)\.js$/i;
var ROUTE_REGEXP = /.*(route|path)$/i;

var pathToModule = function (path) {
    return path.replace(/^\/base\//, '')
        .replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

<% if (suiteGeneration) {%>
Object.keys(require.s.contexts._.config.paths).forEach(function (file) {
    if (!ROUTE_REGEXP.test(file)){
        modules.push(file);
    };
});
<% } %>

function startTest() {
    // get all available "requirejs" modules to be loaded so that code coverage
    // can be calculated
    require(modules, function () {
        window.__karma__.start();
    });
}

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/',
    // dynamically load all test files
    deps: allTestFiles,
    // we have to kickoff jasmine, as it is asynchronous
    callback: startTest,
    waitSeconds: 0
});
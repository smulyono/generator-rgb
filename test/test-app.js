'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');

describe('rgb:app', function() {
    describe("Test Site creation without npm install", function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../app'))
            // mock any options
            .withOptions({
                'skip-install': true
            })
            // mock any prompts
            .withPrompts({
                "generatorType" : "site",
                "appName" : "rgbTestApp",
                "appDescription" : "some description",
                "version" : "1.0.0",
                "author" : "testname",
                "email" : "c@email",
                "destDirectory" : "."
            })
            .on('end', function(){
                done();
            });
        });
        it('create correct files', function() {
            assert.file(['bower.json', 'package.json', '.editorconfig', '.jshintrc', 'Gruntfile.js']);
            // check the package.json contents
            assert.fileContent('package.json', /rgbTestApp/);
        });
    });
    describe('Test application creation', function() {
        
    });
    describe('Test unit test creation', function() {
        
    });
});

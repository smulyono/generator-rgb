'use strict';
var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('rgb:app', function() {
    describe("Test without npm install", function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../app'))
            .inDir(path.join(os.tmpdir(), './temp-test'))
            // mock any options
            .withOptions({
                'skip-install': true
            })
            // mock any prompts
            .withPrompt({
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
});

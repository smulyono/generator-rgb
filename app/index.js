'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

String.prototype.endsWith = function(searchString, position) {
  var subjectString = this.toString();
  if (position === undefined || position > subjectString.length) {
    position = subjectString.length;
  }
  position -= searchString.length;
  var lastIndex = subjectString.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};

var DEFAULT_UNITTEST_FOLDER = "./test/javascript";

module.exports = yeoman.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },
    welcome: function() {
        var message = 'Welcome to ' + chalk.red('RGB') + ' generator! - ' + this.pkg.version +
            '\n' +
            'Let\'s get started!';
        // Have Yeoman greet the user.
        this.log(yosay(message, {maxLength : 48}));

        this.destDirectory = ".";

    },
    generatorType : function(){
        var done = this.async();
        var prompts = [
        {
            name : "generatorType",
            type : "list",
            message : 'What are we generating today? ',
            choices: [
                {
                    name : 'Complete site/app generation',
                    value: 'site'
                },
                {
                    name : 'Component generation (bower package)',
                    value: 'component'
                },
                {
                    name : 'New spec test',
                    value: 'spec'
                }
            ]
        }];
        this.prompt(prompts, function(props){
            this.generatorType = props.generatorType;
            done();
        }.bind(this));
    },
    prepareApplicationStructureSite : function(){
        var done = this.async();
        // ask for application name argument
        if (this.generatorType === "site" || this.generatorType === "component"){
            var AppPrompts = [
            {
                name : "appName",
                type : "String",
                default : "HelloWorld",
                required : true,
                message : "what would you like to name this " + this.generatorType + " ?"
            },{
                name : "appDescription",
                message : 'Brief description on the ' + this.generatorType,
                default : "-"
            },{
                name : "author",
                message : "What is your name",
                default : ""
            }, {
                name : "email",
                message : "What is your email",
                default : ""
            },{
                name : "version",
                message: "What is the version number?",
                default : "1.0.0"
            }];

            this.prompt(AppPrompts, function(props){
                this.appName = props.appName;
                this.appDescription = props.appDescription;
                this.author = props.author;
                this.email = props.email;
                this.appVersion = props.version;
                done();
            }.bind(this));
        } else {
            done();
        }
    },
    prepareStructureForSpec : function(){
        var done = this.async();

        if (this.generatorType === "spec") {
            this.log("");
            this.log("  -----------------------------------------------------------------------------------");
            this.log("    All spec file will be generated under 'test' folder");
            this.log("    All spec file MUST ended with 'spec' on their name to be picked up during unit test");
            this.log("  -----------------------------------------------------------------------------------");
            this.log("");
            // Creating individual spec
            var IndividualSpecPrompts = [
            {
                name : "specDirectory",
                type : "string",
                default : "",
                required : true,
                message : "Specify folder name (under 'test') where spec file will be generated ?"
            },
            {
                name : "specName",
                type : "String",
                required : true,
                message : "What would you like to name this spec (e.g myViewSpec)?"
            },
            {
                name : "specModuleName",
                type : "String",
                required : true,
                message : "What module will be tested (requirejs module)?"
            }
            ];


            this.prompt(IndividualSpecPrompts, function(props){
                this.specDirectory = props.specDirectory;
                this.specName = props.specName;
                this.specModuleName = props.specModuleName;
                done();
            }.bind(this));
        } else {
            done();
        }
    },    
    destinationFolder : function(){
        var done = this.async();
        if (this.generatorType != "spec"){
            var destinationFolderPrompts = [
                {
                    name : "destDirectory",
                    type : "string",
                    default : (this.generatoryType == "spec" ? "." : this.appName) ,
                    required : true,
                    message : "Specificy where this " + this.generatorType + " to be created ? (use . for current directory)"
                }
            ];
            this.prompt(destinationFolderPrompts, function(props){
                this.destDirectory = props.destDirectory;
                done();
            }.bind(this));
        } else {
            done();
        }
    },
    structureCreationInit : function(){
        if (!this.destDirectory.endsWith("/")){
            this.destDirectory += "/";
        }        
    },
    structureCreationForSpec : function(){
        if (this.generatorType === "spec") {
            // ------------ Spec creation ----------------
            if (this.specName.indexOf("Spec") <= -1 &&
                this.specName.indexOf("spec") <= -1){
                this.specName += "Spec";
            }
            if (this.specName.indexOf(".js") <= -1){
                this.specName += ".js";
            }

            var specTemplateData = {
                moduleName : this.specModuleName
            };

            this.specCreatedDirectory = "test/";
            if (this.specDirectory !== ""){
                // create folder under test folder
                if (!this.fs.exists("test/" + this.specDirectory)){
                    this.mkdir("test/" + this.specDirectory);
                }
                this.specCreatedDirectory += this.specDirectory + "/";
            }

            // Root directory to templates for spec
            this.sourceRoot(path.join(__dirname, '../yo_templates/testspecs/'));

            // create specFile
            this.fs.copyTpl(
                this.templatePath("spec/_spec_template.js"),
                this.specCreatedDirectory + this.specName,
                specTemplateData
                );
        } 
    },
    structureCreationForCommons : function(){
        if (this.generatorType === "site" || 
            this.generatorType === "component") {

            // *****************************************************************//
            //                          Common Folders                         //
            // *****************************************************************//

            this.sourceRoot(path.join(__dirname, '../yo_templates/commons/'));

            // move all of the files which don't need any templating first
            this.fs.copy(
                this.templatePath("editorconfig"),
                this.destDirectory + ".editorconfig"
                );
            this.fs.copy(
                this.templatePath("jshintrc"),
                this.destDirectory + ".jshintrc"
                );

            // ------------ Sites Data ---------------
            this.destinationAppFolder = "app";
            if (this.generatorType === "component"){
                this.destinationAppFolder = "testpage/app";
            }

            this.mainFolder = "app";
            if (this.generatorType === "component"){
                this.mainFolder = "src";
            }

            this.siteData = {
                appName : this.appName,
                appDescription : this.appDescription,
                appVersion : this.appVersion,
                author : this.author,
                authorEmail : this.email,
                generatorType : this.generatorType,
                destinationAppFolder : this.destinationAppFolder,
                mainFolder : this.mainFolder
            };

            this.fs.copyTpl(
                this.templatePath("_gruntfile.js"),
                this.destDirectory + "Gruntfile.js",
                this.siteData
                );
            this.fs.copyTpl(
                    this.templatePath("_README.md"),
                    this.destDirectory + "README.md",
                    this.siteData);
            this.fs.copyTpl(
                    this.templatePath("_bower.json"),
                    this.destDirectory + "bower.json",
                    this.siteData);
            this.fs.copyTpl(
                    this.templatePath("_package.json"),
                    this.destDirectory + "package.json",
                    this.siteData);

            this.fs.copyTpl(
                    this.templatePath("_index.html"),
                    this.destDirectory + (this.destinationAppFolder === "app" ? "" : "testpage/") + "index.html",
                    this.siteData);

            // The assets folder

            this.directory(
                this.templatePath("assets"),
                this.destDirectory + "assets"
                );

            // config
            this.fs.copyTpl(
                this.templatePath("config/_config.js"),
                this.destDirectory + "config/config.js",
                this.siteData
                );
            this.fs.copy(
                this.templatePath("config/_wrap.start"),
                this.destDirectory + "config/wrap.start"
                );
            this.fs.copy(
                this.templatePath("config/_wrap.end"),
                this.destDirectory + "config/wrap.end"
                );

            // spec and unit test
            var karmaSuiteData = {
                rootFolder : DEFAULT_UNITTEST_FOLDER,
                suiteGeneration : true,
                specName : "*Spec.js"
            };

            // karma main configuration file
            this.fs.copyTpl(
                this.templatePath("test/config/_karma.conf.js"),
                this.destDirectory + "test/config/e2e_karma.conf.js",
                karmaSuiteData
                );
            this.fs.copyTpl(
                this.templatePath("test/config/_karma.conf.js"),
                this.destDirectory + "test/config/individual_karma.conf.js",
                karmaSuiteData
                );
            // karma launcher file
            this.fs.copyTpl(
                this.templatePath("test/config/_test-main.js"),
                this.destDirectory + "test/config/e2e_test_main.js",
                {
                    suiteGeneration : true
                }
                );
            this.fs.copyTpl(
                this.templatePath("test/config/_test-main.js"),
                this.destDirectory + "test/config/individual_test_main.js",
                {
                    suiteGeneration : false
                }
            );

        }
    },
    structureCreationForSites : function(){
        if (this.generatorType === "site" ||
            this.generatorType === "component") {
            // *****************************************************************//
            //                      Application Folders                         //
            // *****************************************************************//

            // Specific app templates
            this.sourceRoot(path.join(__dirname , '../yo_templates/project_contents'));

            // routes
            this.fs.copyTpl(
                this.templatePath("app/routes/_appRoute.js"),
                this.destDirectory + this.destinationAppFolder + "/routes/" + this.appName + "Route.js",
                this.siteData
                );
            // templates
            this.fs.copyTpl(
                this.templatePath("app/templates/_appTemplate.html"),
                this.destDirectory + this.destinationAppFolder + "/templates/" + this.appName + "Template.html",
                this.siteData
                );
            // views
            this.fs.copyTpl(
                this.templatePath("app/views/_app.js"),
                this.destDirectory + this.destinationAppFolder +  "/views/" + this.appName + "View.js",
                this.siteData
                );
            // main.js
            this.fs.copyTpl(
                this.templatePath("app/main.js"),
                this.destDirectory + this.destinationAppFolder + "/main.js",
                this.siteData
                );           
        }
    },
    structureCreationForComponent : function(){
        if (this.generatorType === "component") {
            // *****************************************************************//
            //                      Component Folders                           //
            // *****************************************************************//

            // Specific app templates
            this.sourceRoot(path.join(__dirname , '../yo_templates/component_contents'));

            // main.js
            this.fs.copyTpl(
                this.templatePath("src/_component.es6"),
                this.destDirectory + "src/" + this.appName + ".es6",
                this.siteData
                );           
            this.fs.copyTpl(
                this.templatePath("src/_component.js"),
                this.destDirectory + "src/" + this.appName + ".js",
                this.siteData
                );           

            // Specific app templates
            this.sourceRoot(path.join(__dirname , '../yo_templates/commons'));

            // Special config for testpage
            this.siteData["generatorType"] = "site";
            this.fs.copyTpl(
                this.templatePath("config/_config.js"),
                this.destDirectory + this.destinationAppFolder + "/config/config.js",
                this.siteData
                );

        }
    },
    install: function() {
        this.log("Created scaffolding " + this.appName +
            " Application with " + chalk.red("R") +
            "equirejs, " + chalk.green("G") +
            "runt and " + chalk.cyan("B") + "ackbone");

        this.log(yosay("Run npm install to load all dependencies, you might need 'sudo'; OR Run npm start to begin."));
    }
});

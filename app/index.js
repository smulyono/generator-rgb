'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

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

module.exports = yeoman.generators.Base.extend({
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
    prepareStructureForSite : function(){
        var done = this.async();
        if (this.generatorType === "spec") {
            done();
        } else {
            // ask for application name argument
            var AppPrompts = [
            {
                name : "appName",
                type : "String",
                default : "HelloWorld",
                required : true,
                message : "what would you like to name this app?"
            },{
                name : "appDescription",
                message : 'Brief description on the app',
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
        }
    },
    destinationFolder : function(){
        var done = this.async();
        var destinationFolderPrompts = [
            {
                name : "destDirectory", 
                type : "string",
                default : ".", 
                required : true,
                message : "Specificy where this application to be created ?"
            }
        ];
        this.prompt(destinationFolderPrompts, function(props){
            this.destDirectory = props.destDirectory;
            done();
        }.bind(this));
    },
    prepareStructureForSpec : function(){
        var done = this.async();

        if (this.generatorType === "site") {
            done();
        } else {
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
        }
    },
    structureCreation : function(){
        if (!this.destDirectory.endsWith("/")){
            this.destDirectory += "/";
        }
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

            // create specFile
            this.fs.copyTpl(
                this.templatePath("test/spec/_spec_template.js"),
                this.destDirectory + this.specCreatedDirectory + this.specName,
                specTemplateData
                );            
        } else {
            // move all of the files which don't need any templating first
            this.fs.copy(
                this.templatePath("editorconfig"),
                this.destDirectory + ".editorconfig"
                );
            this.fs.copy(
                this.templatePath("jshintrc"),
                this.destDirectory + ".jshintrc"
                );
            this.fs.copy(
                this.templatePath("_gruntfile.js"),
                this.destDirectory + "Gruntfile.js"
                );
            
            // ------------ Sites creation ---------------
            var siteData = {
                appName : this.appName,
                appDescription : this.appDescription,
                appVersion : this.appVersion,
                author : this.author,
                authorEmail : this.email
            };
            this.fs.copyTpl(
                    this.templatePath("_README.md"),
                    this.destDirectory + "README.md",
                    siteData);
            this.fs.copyTpl(
                    this.templatePath("_bower.json"),
                    this.destDirectory + "bower.json",
                    siteData);
            this.fs.copyTpl(
                    this.templatePath("_package.json"),
                    this.destDirectory + "package.json",
                    siteData);
            this.fs.copyTpl(
                    this.templatePath("_index.html"),
                    this.destDirectory + "index.html",
                    siteData);
            // The assets folder
            if (!this.fs.exists("assets")){
                this.mkdir(this.destDirectory + "assets");
            }

            this.directory(
                this.templatePath("assets"),
                this.destDirectory + "assets"
                );
            
            // config
            this.fs.copyTpl(
                this.templatePath("config/_config.js"),
                this.destDirectory + "config/config.js",
                siteData
                );          

            // App folder
            if (!this.fs.exists(this.destDirectory + "app")){
                this.mkdir(this.destDirectory + "app");
            }

            // routes
            this.fs.copyTpl(
                this.templatePath("app/routes/_appRoute.js"),
                this.destDirectory + "app/routes/" + this.appName + "Route.js",
                siteData
                );            
            // templates
            this.fs.copyTpl(
                this.templatePath("app/templates/_appTemplate.html"),
                this.destDirectory + "app/templates/" + this.appName + "Template.html",
                siteData
                );            
            // views
            this.fs.copyTpl(
                this.templatePath("app/views/_app.js"),
                this.destDirectory + "app/views/" + this.appName + "View.js",
                siteData
                );            
            // main.js
            this.fs.copyTpl(
                this.templatePath("app/main.js"),
                this.destDirectory + "app/main.js",
                siteData
                );   
            // spec and unit test         
            var karmaSuiteData = {
                rootFolder : DEFAULT_UNITTEST_FOLDER,
                suiteGeneration : true, 
                specName : "*Spec.js"
            };  

            if (!this.fs.exists(this.destDirectory + "test")){
                this.mkdir(this.destDirectory + "test");
            }            
            if (!this.fs.exists(this.destDirectory + "test/config")){
                this.mkdir(this.destDirectory + "test/config");
            }   
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
    install: function() {
        this.log("Created scaffolding " + this.appName +
            " Application with " + chalk.red("R") +
            "equirejs, " + chalk.green("G") +
            "runt and " + chalk.cyan("B") + "ackbone");

        this.log(yosay("Run npm install to load all dependencies, you might need 'sudo'; OR Run npm start to begin."));
    }    
});

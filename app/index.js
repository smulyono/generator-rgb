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
                name : "destinationDirectory",
                type : "string",
                default : ".",
                required : true,
                message : "Specify where the new app structure will be generated?"
            },
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
                this.destDirectory = props.destinationDirectory;
                this.appName = props.appName;
                this.appDescription = props.appDescription;
                this.author = props.author;
                this.email = props.email;
                this.appVersion = props.version;
                done();
            }.bind(this));
        }

    },
    prepareStructureForSpec : function(){
        var done = this.async();

        if (this.generatorType === "site") {
            done();
        } else {
            // Creating individual spec
            var IndividualSpecPrompts = [
            {
                name : "specDestinationDirectory",
                type : "string",
                default : ".",
                required : true,
                message : "Specify where the new spec file should be generated?"
            },
            {
                name : "specName",
                type : "String",
                required : true,
                message : "what would you like to name this spec?"
            }];


            this.prompt(IndividualSpecPrompts, function(props){
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

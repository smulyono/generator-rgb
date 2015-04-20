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
    //
    prepareStructure : function(){
        var done = this.async();

        // ask for application name argument
        var prompts = [
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

        this.prompt(prompts, function(props){
            this.destDirectory = props.destinationDirectory;
            this.appName = props.appName;
            this.appDescription = props.appDescription;
            this.author = props.author;
            this.email = props.email;
            this.appVersion = props.version;
            done();
        }.bind(this));
    },
    structureCreation : function(){
        if (!this.destDirectory.endsWith("/")){
            this.destDirectory += "/";
        }
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
        //
        var appData = {
            appName : this.appName,
            appDescription : this.appDescription,
            appVersion : this.appVersion,
            author : this.author,
            authorEmail : this.email
        };
        this.fs.copyTpl(
                this.templatePath("_bower.json"),
                this.destDirectory + "bower.json",
                appData);
        this.fs.copyTpl(
                this.templatePath("_package.json"),
                this.destDirectory + "package.json",
                appData);
        this.fs.copyTpl(
                this.templatePath("_index.html"),
                this.destDirectory + "index.html",
                appData);
        // The assets folder
        if (!this.fs.exists("assets")){
            this.mkdir(this.destDirectory + "assets");
        }

        this.directory(
            this.templatePath("assets"),
            this.destDirectory + "assets"
            );
    },
    install: function() {
        this.log("Creating scaffolding " + this.name +
            " Application with " + chalk.red("R") +
            "equirejs, " + chalk.green("G") +
            "runt and " + chalk.cyan("B") + "ackbone");

        this.log(yosay("Run npm install to load all dependencies, you might need 'sudo'"));
    }
});

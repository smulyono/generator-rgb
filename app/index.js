'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.pkg = require('../package.json');
    },
    //
    prepareStructure : function(){
        var done = this.async();

        // ask for application name argument
        var prompts = [{
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
            this.appName = props.appName;
            this.appDescription = props.appDescription;
            this.author = props.author;
            this.email = props.email;
            this.appVersion = props.version;
            done();
        }.bind(this));
    },
    structureCreation : function(){
        // move all of the files which don't need any templating first
        this.fs.copy(
            this.templatePath("editorconfig"),
            ".editorconfig"
            );
        this.fs.copy(
            this.templatePath("jshintrc"),
            ".jshintrc"
            );
        this.fs.copy(
            this.templatePath("_gruntfile.js"),
            "Gruntfile.js"
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
                "bower.json",
                appData);
        this.fs.copyTpl(
                this.templatePath("_package.json"),
                "package.json",
                appData);
        this.fs.copyTpl(
                this.templatePath("_index.html"),
                "index.html",
                appData);
        // The assets folder
        if (!this.fs.exists("assets")){
            this.mkdir("assets");
        }

        this.directory(
            this.templatePath("assets"),
            "assets"
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

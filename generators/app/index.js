'use strict';
var yeoman = require('yeoman-generator');
var gitConfig = require('git-config');
var lodash = require('lodash');
var fs = require('fs-extra');

var PlayGenerator = yeoman.generators.Base.extend({
    // pointer to this generator (set in constructor)
    generator: undefined,
    PLAYAPP: 'Play rest App',
    REACTIVEPLAYAPP: 'ReactiveMongo Play rest App',

    constructor: function () {
        // Calling the super constructor is important so our generator is correctly set up
        yeoman.generators.Base.apply(this, arguments);

        // Set member variables
        this.generator = this;

        // Define flags / options (e.g. --app, --reactive)
        this.generator.option('app', {
            desc: 'Flag to specify that this project is a regular play REST app'
        });

        this.generator.option('reactive', {
            desc: 'Flag to specify that this project is a ReactiveMongo play REST app'
        });

        // Define arguments (e.g. yo play ______ )
        this.generator.argument('appName', {
            desc: 'The name of the app',
            required: false,
            type: String
        });
    },

    // Step #1
    // Your initialization methods (checking current project state, getting configs, etc)
    // See http://yeoman.io/authoring/running-context.html for info on all steps
    initializing: function() {
        // start blocking until this step is complete
        var done = this.generator.async();

        this.generator.log('');
        this.generator.log('=======================================');
        this.generator.log('Hi! Welcome to the Play generator.');
        this.generator.log('');
        this.generator.log('Your new project will be scaffolded out in the current directory:');
        this.generator.log(this.generator.destinationRoot());

        // check for flags / options
        if(this.generator.options.app){
            this.generator.config.set('appType', this.generator.PLAYAPP);
        }

        if(this.generator.options.reactive){
            this.generator.config.set('appType', this.generator.REACTIVEPLAYAPP);
        }

        // check for arguments
        if(this.generator.appName){
            this.generator.config.set('appName', lodash.kebabCase(this.generator.appName));
        }

        // read in Git credentials from ~/.gitconfig
        gitConfig(function (err, config) {
            if(err){ return err; }

            var githubName = config.user.name || 'UNKNOWN GITHUB NAME';
            var githubEmail = config.user.email || 'UNKNOWN GITHUB EMAIL';
            var githubNameAndEmail = githubName + ' <' + githubEmail + '>';
            this.generator.config.set('githubName', githubName);
            this.generator.config.set('githubEmail', githubEmail);
            this.generator.config.set('githubNameAndEmail', githubNameAndEmail);

            // finish blocking for next step
            done();
        }.bind(this));
    },

    // Step #2
    // Where you prompt users for options (where you'd call this.prompt())
    prompting: function() {
        // start blocking until this step is complete
        var done = this.generator.async();

        var defaultAuthor = this.generator.config.get('githubNameAndEmail');
        this.generator.log('');
        this.generator.log('Current GitHub user:');
        this.generator.log(defaultAuthor);

        // appType was already set using --app or --reactive
        if(this.generator.config.get('appType')){
            this.generator.log('');
            this.generator.log('Project type:');
            this.generator.log(this.generator.config.get('appType'));
        }

        // appName was already set using 'yo play [appName]'
        if(this.generator.config.get('appName')){
            this.generator.log('');
            this.generator.log('Project name:');
            this.generator.log(this.generator.config.get('appName'));
        }

        this.generator.log('=======================================');
        this.generator.log('');

        var prompts = [
            {
                type: 'list',
                name: 'appType',
                message: 'What type of project are you bootstrapping?',
                choices: [ this.generator.PLAYAPP, this.generator.REACTIVEPLAYAPP ]
            }, {
                type: 'input',
                name: 'appName',
                message: 'What would you like to call your project?',
                default : this.appname,
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a name';
                },
                filter: function( val ) {
                    return lodash.kebabCase(val);
                }
            }, {
                type: 'input',
                name: 'appDescription',
                message: 'How would you describe your project?',
                default: 'Test project',
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a short description';
                }
            }, {
                type: 'input',
                name: 'appAuthor',
                message: 'What is your GitHub name <email>?',
                default: defaultAuthor,
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter a your GitHub name <email>';
                }
            }, {
                type: 'input',
                name: 'portNumber',
                message: 'On what port number would you like to run this project?',
                validate: function( value ) {
                    var valid = value && value.length > 0;
                    return valid || 'Please enter valid port number';
                },
                filter: function( val ) {
                    return lodash.kebabCase(val);
                }
            }, {
              type: 'input',
              name: 'playVersion',
              message: 'Which version of Play! do you want to use?',
              default: '2.5.3'
            }, {
              type: 'input',
              name: 'scalaVersion',
              message: 'Which version of Scala! do you want to use?',
              default: '2.11.8'
            }, {
              type: 'list',
              name: 'language',
              message: 'Which language do you want to use to code your application?',
              choices: ['PlayScala', 'PlayJava'],
              default: 'PlayScala'
            },{
              type: 'input',
              name: 'sbtVersion',
              message: 'Which version of sbt do you want to use?',
              default: '0.13.11'
            },
            {
              type: 'input',
              name: 'langs',
              message: 'Supported langs?',
              default: 'en'
            }
        ];

	       // appType was already set using --app or --reactive
        // remove the question
        if(this.generator.config.get('appType')){
            prompts.shift();
        }

        // appName was already set using 'yo play [appName]'
        // remove the question
        if(this.generator.config.get('appName')){
            prompts.shift();
        }

        // write out answers to questions in .yo-rc.json
        this.generator.prompt(prompts, function(props) {
            // set if not already set with --app or --reactive
            if(!this.generator.config.get('appType')){
                this.generator.config.set('appType', props.appType);
            }

            // set if not already set using 'yo play [appName]'
            if(!this.generator.config.get('appName')){
                this.generator.config.set('appName', props.appName);
            }

            this.generator.config.set('appDescription', props.appDescription);
            this.generator.config.set('appAuthor', props.appAuthor);
            this.generator.config.set('portNumber', props.portNumber);
            this.generator.config.set('playVersion', props.playVersion);
            this.generator.config.set('scalaVersion', props.scalaVersion)
            this.generator.config.set('language', props.language);
            this.generator.config.set('sbtVersion', props.sbtVersion);
            this.generator.config.set('langs', props.langs);
            // finish blocking for next step
            done();
        }.bind(this));
    },

    // Step #3
    // Saving configurations and configure the project (creating .editorconfig files and other metadata files)
    // NOTE: inspired by generator-hottowel (https://github.com/johnpapa/generator-hottowel)
    configuring: function(){
      var gen = this.generator;

      // download / install oildex-seed into root directory
        var seedUrl = 'git@github.com:maxyermayank/microservice-template.git';
        this.generator.bowerInstall([seedUrl], null, function(){
            fs.copySync('bower_components/seed/', '.', null, function (err) {
                if(err) { return console.error(err); }
            });
            fs.emptyDir('bower_components', function (err) {
                if(err) { return console.error(err); }
            });

            // update package.json
            var packageJson = fs.readJsonSync('./package.json');
            packageJson.name = gen.config.get('appName');
            packageJson.description = gen.config.get('appDescription');
            packageJson.author = gen.config.get('githubNameAndEmail');
            fs.writeJsonSync('./package.json', packageJson);

            // update bower.json
            var bowerJson = fs.readJsonSync('./bower.json');
            bowerJson.name = gen.config.get('appName');
            bowerJson.description = gen.config.get('appDescription');
            bowerJson.author = gen.config.get('githubNameAndEmail');
            fs.writeJsonSync('./bower.json', bowerJson);
        });
    },

    // Step #4
    // Where you write the generator specific files (routes, controllers, etc)
    // NOTE: inspired by generator-hottowel (https://github.com/johnpapa/generator-hottowel)
    writing: function(){
        var context = {
            appName: this.generator.config.get('appName'),
            appDescription: this.generator.config.get('appDescription'),
            appAuthor: this.generator.config.get('appAuthor'),
            portNumber: this.generator.config.get('portNumber'),
            playVersion: this.generator.config.get('playVersion'),
            scalaVersion: this.generator.config.get('scalaVersion'),
            language: this.generator.config.get('language'),
            sbtVersion: this.generator.config.get('sbtVersion'),
            langs: this.generator.config.get('langs'),
        };

        // client app files (No template)
        this.generator.fs.copy(
            this.generator.templatePath('seed/app/**/*'),
            this.generator.destinationPath('app'));

        // client app files (No template)
        this.generator.fs.copy(
          this.generator.templatePath('seed/conf/**/*'),
          this.generator.destinationPath('conf'));

        // client app files (No template)
        this.generator.fs.copy(
          this.generator.templatePath('seed/project/**/*'),
          this.generator.destinationPath('project'));

        // client app files (No template)
        this.generator.fs.copy(
          this.generator.templatePath('seed/public/**/*'),
          this.generator.destinationPath('public'));

        // client app files (No template)
        this.generator.fs.copy(
          this.generator.templatePath('seed/test/**/*'),
          this.generator.destinationPath('test'));

        this.generator.fs.copy(
          this.generator.templatePath('seed/.gitignore'),
          this.generator.destinationPath('.gitignore'));

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/build.sbt'),
          this.generator.destinationPath('build.sbt'),
          {
            appName: context.appName,
            language: context.language,
            scalaVersion: context.scalaVersion
          }
        );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/app/controllers/Application.scala'),
          this.generator.destinationPath('app/controllers/Application.scala'),
          { appName: context.appName }
        );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/conf/prod-logger.xml'),
          this.generator.destinationPath('conf/prod-logger.xml'),
          { appName: context.appName }
        );

        // this.generator.fs.copyTpl(
        //   this.generator.templatePath('seed/conf/spring.xml'),
        //   this.generator.destinationPath('conf/spring.xml'),
        //   { appName: context.appName }
        // );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/conf/seed.env'),
          this.generator.destinationPath('conf/' + context.appName + '.env'),
          {
            appName: context.appName ,
            portNumber: context.portNumber
          }
        );

        this.generator.fs.delete('conf/seed.env');

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/README.md'),
          this.generator.destinationPath('README.md'),
          { appName: context.appName  }
        );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/conf/application.conf'),
          this.generator.destinationPath('conf/application.conf'),
          { langs: context.langs }
        );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/dist/seed'),
          this.generator.destinationPath('dist/' + context.appName)
        );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/test/integration/seed.jmx'),
          this.generator.destinationPath('test/integration/' + context.appName.replace("-", "_") + '_api.jmx')
        );
        this.generator.fs.delete('test/integration/seed.jmx');

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/project/plugins.sbt'),
          this.generator.destinationPath('project/plugins.sbt'),
          { playVersion: context.playVersion }
        );

        this.generator.fs.copyTpl(
          this.generator.templatePath('seed/project/build.properties'),
          this.generator.destinationPath('project/build.properties'),
          { sbtVersion: context.sbtVersion }
        );

        this.generator.fs.copy(
          this.generator.templatePath('seed/CONTRIBUTING.md'),
          this.generator.destinationPath('CONTRIBUTING.md')
        );
    },

    // // Step #5
    // // Where installation are run (npm, bower)
    // install: function(){
    //     this.npmInstall();
    //
    //     // NOTE: no need to call bowerInstall here.
    //     //       this is called by the npm postinstall hook in
    //     //       package.json
    //     // this.bowerInstall();
    // },

    // Step #6
    // Called last, cleanup, say good bye, etc
    end: function(){
        this.generator.log('');
        this.generator.log('===========================================');
        this.generator.log('You are now officially ready to rock.');
        this.generator.log('Have fun!');
        this.generator.log('');
        this.generator.log('Type "play24" to launch the play/sbt console.');
        this.generator.log('===========================================');
        this.generator.log('');
    }
});

module.exports = PlayGenerator;

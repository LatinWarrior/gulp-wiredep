//'use strict';
//
//var GulpConfig = (function(){
//    function gulpConfig(){
//        // All js to vet.
//        this.alljs = [
//            './src/**/*.js',
//            './*.js'
//        ]
//    }
//}());

//module.exports = GulpConfig;

module.exports = function () {

    var client = './src/client/';
    var clientApp = client + 'app/';

    var config = {

        temp: './.tmp/',

        // All js to vet.
        alljs: [
            './src/**/*.js',
            './*.js'
        ],

        client: client,

        index: client + 'index.html',

        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],

        less: client + 'styles/styles.less',

        /* Bower and NPM locations. */
        bower: {
            json: require('./bower.json'),
            directory: 'bower_components',
            ignorePath: '../..'
        }
    };
    
    //console.log('config.bower.json: ' + config.bower.json);
    //console.log('config.bower.directory: ' + config.bower.directory);

    config.getWiredepDefaultOptions = function () {        
        
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath,
            verbose: true,
            onError: function (err){
                console.log(err);
            },
            onPathInjected: function(fileObject) {
                console.log('fileObject.block: ' + fileObject.block);
                console.log('fileObject.file: ' + fileObject.file);
                console.log('fileObject.path: ' + fileObject.path);
              },
            onMainNotFound: function(pkg) {
                console.log('pkg: ' + pkg);
            }
        };
        
        //console.dir('options: ' + options);
        //console.log('options.bowerJson: ' + options.bowerJson);
        //console.log('options.directory: ' + options.directory);
        //console.log('options.ignorePath: ' + options.ignorePath);
        
        return options;
    };

    return config;
};
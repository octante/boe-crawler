var http = require('http');
var path = require('path');
var hash = require('./hash.js');
var fs = require('fs');

// Load url

// If url exists in cache load it, if not download it and return

var exports = module.exports = {};

exports.get = function(url, callback){

    var folder = path.dirname(require.main.filename) + '/';

    // Load url
    var file = folder + hash(url);
    path.exists(file, function(exists) {
        if (exists) {
            // Get url from cache
            fs.readFile(file, [encoding], [callback]);
        } else {
            http.get(url, function(response) {

                if (response.statusCode == '200') {
                    callback();
                }
            });
        }
    });

    // @todo If url exists in cache load it, if not download it and return
};
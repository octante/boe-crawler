var http = require('http');
var path = require('path');
var hash = require('./hash.js');
var fs = require('fs');

/**
 * If the url exists in cache, load if. Otherwise download and save it
 *
 * @param url
 * @param callback
 */
exports.get = function(url, callback){

    //var folder = path.dirname(require.main.filename) + '/';
    var folder = '/tmp/boe_cache/';

    var file = folder + hash.sha1(url);
    fs.exists(file, function(exists) {
        if (exists) {
            // Get url from cache
            fs.readFile(file, [], function(err, data){
                if (err) {
                    throw err;
                }
                callback(data.toString());
            });
        } else {
            http.get(url, function(response) {

                var data = '';
                response.on('data', function (chunk) {
                    data += chunk.toString();
                });

                response.on('end', function(){
                    fs.writeFile(file, data, function(err) {
                        if (err) {
                            throw (err);
                        }
                    });

                    callback(data);
                });
            }).on('error', function(err) {
                throw (err);
            });
        }
    });
};
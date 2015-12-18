var crypto = require('crypto')
    , shasum = crypto.createHash('sha1');

var exports = module.exports = {};

exports.hash = function(string){
    shasum.update(string);
    return shasum.digest('hex')
};
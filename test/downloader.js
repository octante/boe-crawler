var http = require('http');
var parseString = require('xml2js').parseString;

var url = "http://boe.es/diario_boe/xml.php?id=BOE-A-2015-9550";

http.get(url, function(response) {
    if (response.statusCode == '200') {

        var boeData = '';
        response.on('data', function (chunk) {

            boeData += chunk.toString();
        });

        response.on('end', function() {
            parseString(boeData, function (err, result) {

                console.log(result);
            });
        })
    } else {
        // Do something
    }
});
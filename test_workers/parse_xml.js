// RUN:
// node test_workers/parse_xml.js http://boe.es/diario_boe/xml.php?id=BOE-A-2015-940

var parseString = require('xml2js').parseString;
var http = require('http');

var url = process.argv[2];

http.get(url, function(response) {
    if (response.statusCode == '200') {

        var boeData = '';

        response.on('data', function (chunk) {
            boeData += chunk.toString();
        });

        response.on('end', function(){
            parseString(boeData, function (err, result) {
                var metadata = result['documento']['texto'][0]['p'];
                console.log(metadata);
            });
        });
    } else {
        // Do something
    }
});
var http = require('http');

var url = "http://boe.es/diario_boe/xml.php?id=BOE-A-2015-9550";

http.get(url, function(response) {
    if (response.statusCode == '200') {

        // Get data
        var boeData = '';
        response.on('data', function (chunk) {
            boeData += chunk.toString();
        });

        response.on('end', function(){

            var res = boeData.substring(boeData.indexOf('<p class="parrafo">'), boeData.indexOf('</documento>')).replace('</texto>', '');

            console.log(boeData.indexOf('<texto>'));
            console.log(boeData.indexOf('</texto>'));
            console.log(res);
        });
    } else {
        // Do something
    }
});
var http = require('http');
var dom = require('xmldom');

require('../lib/mappers/summary.js');

http.get("http://boe.es/diario_boe/xml.php?id=BOE-S-20150903", function(response) {
    if (response.statusCode == '200') {
        var msg = '';
        response.on('data', function (chunk) {
            msg = msg + chunk;

            var boe_diary = msg.content.toString();
            var domParser = dom.DOMParser;

            var document = JSON.parse(boe_diary);
            var doc = new domParser().parseFromString(document['data']);
            //console.log(boe_diary['data']);

            Summary.map(doc);

            /*var diary = select(doc, "//sumario/diario");
             var summaryNBO = select(doc, "//sumario/diario/sumario_nbo");
             var summaryNBOUrlPdf = select(doc, "/sumario/diario/sumario_nbo/urlPdf");
             var sections = select(doc, "//sumario/diario/seccion");

             console.log("meta: " + meta[0].toString());
             console.log("diary: " + diary[0].toString());
             console.log("summaryNBO: " + diary[0].toString());
             console.log("summaryNBO url pdf: " + summaryNBOUrlPdf[0].toString());
             console.log("sections: " + sections[0].toString())*/

        })
    }
});

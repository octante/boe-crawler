require('../entities/summary');

var select = require('xpath.js');

var method = Mapper.prototype;

method.map = function(doc) {

    // Meta data
    var metaPub = select(doc, "//sumario/meta/pub/text()");
    var metaYear = select(doc, "//sumario/meta/ano/text()");
    var metaDate = select(doc, "//sumario/meta/date/text()");
    var metaDateInv = select(doc, "//sumario/meta/fechaInv/text()");
    var metaDateBefore = select(doc, "//sumario/meta/fechaAnt/text()");
    var metaDateBeforeBefore = select(doc, "//sumario/meta/fechaAntAnt/text()");
    var metaDateNext = select(doc, "//sumario/meta/fechaSig/text()");
    var metaPubDate = select(doc, "//sumario/meta/fechaPub/text()");
    var metaFormattedPubDate = select(doc, "//sumario/meta/pubDate/text()");


    // Diary data
    var diaryNBO = select(doc, "//sumario/diario/@nbo/text()");

    // Summary NBO
    var summaryNBOId = select(doc, "//sumario/diario/sumario_nbo/@id/text()");

    // Summary NBO url pdf
    var summaryNBOUrlPdfszBytes = select(doc, "//sumario/diario/sumario_nbo/urlPdf/@szBytes/text()");
    var summaryNBOUrlPdfszKBytes = select(doc, "//sumario/diario/sumario_nbo/urlPdf/@szKBytes/text()");
    var summaryNBOUrlPdfUrl = select(doc, "//sumario/diario/sumario_nbo/urlPdf/text()");

    // Sections list
    var sections = select(doc, "//sumario/diario/seccion/*");

    sections.forEach(function(section){
        var sectionNumber = section.SelectSingleNode("//sumario/diario/seccion/@num").Value;
        var sectionName = section.SelectSingleNode("//sumario/diario/seccion/@name").Value;

        var departmentList = section.SelectSingleNode("//sumario/diario/seccion/departamento/*").Value;

        departmentList.forEach(function(department){
            var departmentName = department.SelectSingleNode("//sumario/diario/seccion/departamento/@name").Value;

            var epigraphList = department.SelectSingleNode("//sumario/diario/seccion/departamento/epigrafe/*").Value;
            var itemList = department.SelectSingleNode("//sumario/diario/seccion/departamento/item/*").Value;
        });
    });

    var pub = select(doc, "pub");
    console.log("pub: " + pub[0].toString());

    /*summary = createSummary(data);
     summary.setCrawledAt(new Date().toISOString());

     return summary;*/
};

module.exports = Mapper;

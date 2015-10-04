require('../entities/summary');

var select = require('xpath.js');

var method = SummaryMapper.prototype;

method.map = function(doc) {

    var meta = select(doc, "//sumario/meta");

    var pub = select(doc, "pub");
    console.log("pub: " + pub[0].toString());

    /*summary = createSummary(data);
    summary.setCrawledAt(new Date().toISOString());

    return summary;*/
};

module.exports = SummaryMapper;
require('../entities/summaryNBO');

var method = SummaryMapper.prototype;

method.map = function(data) {




    summary = createSummaryNBO(data);
    summary.setCrawledAt(new Date().toISOString());

    return summary;
};

module.exports = SummaryMapper;

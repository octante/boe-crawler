var method = SummaryNBO.prototype;

function SummaryNBO(id, urlPdf) {
    this.id = id;
    this.urlPdf = urlPdf;
}

method.getId = function() {
    return this.id;
};

method.getUrlPdf = function() {
    return this.urlPdf;
};

createSummary = function create(data) {
    return new SummaryNBO(data.id, urlPdf);
};

module.exports = SummaryNBO;
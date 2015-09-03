var method = Summary.prototype;

function Summary(meta, diary) {
    this.meta = meta;
    this.diary = diary;
}

method.getMeta = function() {
    return this.meta;
};

method.getDiary = function() {
    return this.diary();
};

method.setCrawledAt = function() {
    this.crawled_at = new Date();
};

method.getCrawledAt = function() {
    return this.crawled_at;
};

createSummary = function create(data) {
    return new Summary(data.meta, data.diary);
};

module.exports = Summary;
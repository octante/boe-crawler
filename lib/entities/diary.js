var method = Diary.prototype;

function Diary(summaryNbo) {
    this.summaryNbo = summaryNbo;
    this.sections = []
}

method.addSection= function(section) {
    this.sections.push(section);
};

method.getSummaryNbo = function() {
    return this.summaryNbo;
};

method.getSections = function() {
    return this.sections;
};

createDiary = function create(data) {
    return new Diary(data.id, data.summary);
};

module.exports = Diary;
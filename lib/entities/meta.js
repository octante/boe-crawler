var method = Meta.prototype;

function Meta(
    pub,
    year,
    date,
    dateInv,
    dateBefore,
    dateBeforeBefore,
    dateNext,
    pubDate,
    formattedPubDate
) {
    this.pub = pub;
    this.year = year;
    this.date = date;
    this.dateInv = dateInv;
    this.dateBefore = dateBefore;
    this.dateBeforeBefore = dateBeforeBefore;
    this.dateNext = dateNext;
    this.pubDate = pubDate;
    this.formattedPubDate = formattedPubDate;
}

method.getPub = function() {
    return this.pub;
};

method.getYear = function() {
    return this.year;
};

method.getDate = function() {
    return this.date;
};

method.getDateInv = function() {
    return this.dateInv;
};

method.getDateBefore = function() {
    return this.dateBefore;
};

method.getDateBeforeBefore = function() {
    return this.dateBeforeBefore;
};

method.getFormattedPubDate = function() {
    return this.formattedPubDate;
};

method.getDateNext = function() {
    return this.dateNext;
};

method.getPubDate = function() {
    return this.pubDate;
};

createMeta = function create(data) {
    return new Meta(
        data.pub,
        data.year,
        data.date,
        data.dateInv,
        data.dateBefore,
        data.dateBeforeBefore,
        data.dateNext,
        data.pubDate,
        data.formattedPubDate
    );
};

module.exports = Meta;

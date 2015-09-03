var method = Section.prototype;

function Section(num, name) {
    this.num = num;
    this.name = name;
    this.departments = [];
}

method.addDepartment = function(department) {
    this.departments.push(department);
};

method.getNum = function() {
    return this.num;
};

method.getName = function() {
    return this.name;
};

method.getDepartment = function() {
    return this.department;
};

createSection = function create(data) {
    return new Section(
        data.num,
        data.name
    );
};

module.exports = Section;
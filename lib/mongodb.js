var MongoClient = require('mongodb').MongoClient;

/**
 * Insert data into mongo db collection
 *
 * @param db_name
 * @param collection
 * @param data
 */
exports.insert = function(db_name, collection, data){
    var url = 'mongodb://localhost:27017/' + db_name;
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }

        db.collection(collection).insert(data);
        db.close();
    });
};

/**
 * Find data by id. Not mongodb _id, custom id.
 *
 * @param db_name
 * @param collection
 */
exports.findOneById = function(db_name, collection, id, callback){
    var url = 'mongodb://localhost:27017/' + db_name;
    MongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }

        db.collection(collection).findOne({'id': id}, function(err, doc){
            console.log(doc);
            if (err) {
                throw err;
            }

            if (doc == null) {
                callback();
            }
        });
    });
};
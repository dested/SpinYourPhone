

var Client = require('mariasql');
var q = require('q');

function Manager() {

}

Manager.prototype.init = function () {
    var defer = q.defer();

    this.client = new Client();
    this.client.connect({
        host: 'localhost',
        user: 'root',
        password: 'Ddested',
        db: 'spin'
    });

    this.client.on('connect', function () {
        defer.resolve();
        console.log('MARIA Client connected ');
    })
        .on('error', function (err) {
            defer.reject();
            console.log('Client error: ' + err);
        })
        .on('close', function (hadError) {
            console.log('Client closed');
        });

    return defer.promise;

};

Manager.prototype.getUser = function (name) {
    var defer = q.defer();

    var items = [];

    this.client.query('SELECT 1 + 1 AS solution')

        .on('result', function (res) {
            res.on('row', function (row) {
                items.push(row);
            })
                .on('error', function (err) {
                    defer.reject();
                    console.log('Result error: ' + inspect(err));
                })
                .on('end', function (info) {
                    console.log('Result finished successfully');
                });
        })
        .on('end', function () {
            console.log('Done with all results');
            defer.resolve(items[0]);
        });


    return defer.promise;
};

module.exports = new Manager();
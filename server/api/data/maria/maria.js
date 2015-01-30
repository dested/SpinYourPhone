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
debugger;

    this.client.query('SELECT 1 + 1 AS solution',  (err, rows, fields) =>{
        debugger;
        if (err) throw err;

        console.log('The solution is: ', rows[0].solution);

        defer.resolve({username: name})
    });


    return defer.promise;
};

module.exports = new Manager();
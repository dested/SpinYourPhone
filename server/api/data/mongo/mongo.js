var pmongo = require('promised-mongo');
var q = require('q');


function Manager() {
}

Manager.prototype.init=function(){
    var defer=q.defer();

    this.db = pmongo('localhost:27017/game', ['spins']);
    defer.resolve();

    return defer.promise;

};
Manager.addSpins = function (userId, spins) {
    this.db.spins.find().toArray().then(function (docs) {
        console.log('here');
        console.log(docs);
    });
};

module.exports = new Manager();
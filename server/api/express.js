var express = require('express');
var jwt = require('jwt-simple');
var colors = require('colors');
var cors = require('cors');
var q = require('q');

function Manager() {
}

Manager.prototype.init = function () {
    var defer = q.defer();
    this.app = express();
    this.app.use(cors());

    this.app.use(require('body-parser').json());
    this.app.set('jwtTokenSecret', 'secret-value');
    var requireAuth = function (req, res, next) {
        if (!req.user) {
            res.end('Not authorized', 401)
        } else {
            next()
        }
    };

    var server = this.app.listen(3000, 'localhost', function () {
        console.log('Listening on port %d'.green, server.address().port)
        defer.resolve();
    });




    return defer.promise;
};

module.exports=new Manager();

var moment = require('moment');
var q = require('q');
var jwtAuth = require('./jwtauth');
var jwt = require('jwt-simple');


var maria = require('./data/maria/maria.js');
var express = require('./express.js');
var mongo = require('./data/mongo/mongo.js');


q.all([maria.init(), mongo.init(), express.init()]).then(function () {
    console.log('ready');

    var users = {};

    express.app.get('/token', function (req, res) {
        console.log('auth'.white);

        maria.getUser(req.headers.username).then(function(user)  {

            var expires = moment().add(20, 'seconds').valueOf();
            if (!users[user.username]) {
                users[user.username] = {verifiedSpins: 0, cachedSpins: []};
            }
            var token = jwt.encode(
                {
                    user: user,
                    exp: expires
                },
                express.app.get('jwtTokenSecret')
            );
            res.json({
                token: token,
                expires: expires,
                user: user,
                spins: users[user.username].verifiedSpins
            });


        }).catch(function(e) {
            console.log('bad'.red,e);
            // No username provided, or invalid POST request. For simplicity, just return a 401
            res.status(401).send('Authentication error');
        });
    });

    express.app.post('/spin', jwtAuth, requireAuth, function (req, res) {
        users[req.user.username].verifiedSpins += req.body.spins.length;
        console.log(req.user.username, users[req.user.username].verifiedSpins);

        res.end();
    });

});


/*


 app starts
 sends username and ?phoneid? to /auth
 checks db
 gets jwt


 if phone is not in background mode
 sends /spun a collection of spins
 {startTime, endTime, ?hash?}
 server verifies jwt
 server pushes those to mongo
 key is user hash
 ?maybe quick check?

 every ?5? minutes separate app iterates through all keys
 verifies each spin
 ?rules?
 updates db with final verified user spin count
 updates *leaderboard cache*
 runs badge creation
 updates badges appropriately in db


 ?leaderboard cache?
 iterates through all users
 orders spins
 stores leaderboard stats

 user makes /badges call
 verifies jwt
 pulls badges from db

 user makes /leaderboard call
 verfies jwt
 retrieves leaderboard for each category
 top 10
 10 above me
 10 below me


 */
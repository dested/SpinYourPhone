var express = require('express');
var moment = require('moment');
var jwt = require('jwt-simple');
var colors = require('colors');
var cors = require('cors');
var jwtAuth = require('./jwtauth');
var pmongo = require('promised-mongo');

var db = pmongo('localhost:27017/local', ['spins']);
db.spins.find().toArray().then(function(docs){
    console.log('here');
    console.log(docs);
});




app = express();
app.use(cors());

app.use(require('body-parser').json());
app.set('jwtTokenSecret', 'secret-value');
var requireAuth = function (req, res, next) {
    if (!req.user) {
        res.end('Not authorized', 401)
    } else {
        next()
    }
};

var users={};

var server = app.listen(3000,'192.168.1.3', function () {
    console.log('Listening on port %d'.green, server.address().port)
});

app.get('/token', function (req, res) {
    console.log('auth'.white);
    if (req.headers.username) {
        var expires = moment().add(20, 'seconds').valueOf();
        var user = {username: req.headers.username};

        if(!users[req.headers.username]){
            users[req.headers.username]={verifiedSpins:0,cachedSpins:[]};
        }
        var token = jwt.encode(
            {
                user: user,
                exp: expires
            },
            app.get('jwtTokenSecret')
        );
        res.json({
            token: token,
            expires: expires,
            user: user,
            spins: users[req.headers.username].verifiedSpins
        });


    } else {
        console.log('bad'.red);

        // No username provided, or invalid POST request. For simplicity, just return a 401
        res.status(401).send('Authentication error');
    }
});

app.post('/spin', jwtAuth, requireAuth, function (req, res) {
    users[req.user.username].verifiedSpins+=req.body.spins.length;
    console.log(req.user.username,users[req.user.username].verifiedSpins);

    res.end();
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
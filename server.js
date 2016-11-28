/**
 * Created by lenovo on 24/11/16.
 */

var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(cookieParser('12345-67890-09876-54321')); // secret key

function auth(req,res,next) {
    console.log(req.headers);

    var authHeader = req.headers.authorization;

    if(!authHeader){
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
        return;
    }
    // Splitting word Basic and usernamepassword encoded in base 64
    var auth = new Buffer(authHeader.split(' ')[1],'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    if (user == 'admin' && pass == 'password'){
        next(); //authorized
    } else {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
    }
}

// using the auth function
app.use(auth);

app.use(express.static(__dirname + '/public'));

// Error handler
app.use(function (err,req,res,next) {
    res.writeHead(err.status || 500,{'WWW-Authenticate':'Basic','Content-Type':'text/plain'});
    res.end(err.message);
});

app.listen(port,hostname,function () {
    console.log('Server running at http://' + hostname + ' : ' + port);
});
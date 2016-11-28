/**
 * Created by lenovo on 24/11/16.
 */

var express = require('express'),
    morgan = require('morgan'),
    session = require('express-session'),
    FileStore = require('session-file-store')(session);

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));
app.use(session({
    name: 'session-id',
    secret:'12345-6789-0987-54321',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

function auth(req,res,next) {
    console.log(req.headers);

    if(!req.session.user){
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
            req.session.user ='admin'; // assign session
            next(); //authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    } else{
        if(req.session.user ==='admin'){
            console.log('req session: ',req.session);
            next();
        } else{
            var err = new Error('You are not authenticated!');
            err.status=401;
            next(err);
        }
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
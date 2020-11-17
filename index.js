/*
    Created by Nam Le
    leqnam@Live.com
    https://nready.net
*/

var express = require('express'),
    session = require('express-session'),
    cors = require('cors'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'),
    config = require('./utils/conf'),
    jwt = require('jsonwebtoken'),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(config.database.storage);

app = express();
let router = express.Router();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('secretKey', config.secret);
app.set('sessionMaxAge', config.sessionMaxAge);
app.set('tokenMaxAge', config.tokenMaxAge);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, config.client.path)));
app.use(cors(config.cors));

app.use(session({
    secret: app.get('secretKey'),
    resave: true,
    saveUninitialized: true,
    cookie: {
        //secure: true,
        //maxAge: app.get('sessionMaxAge')
    }
}));

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------

router.use(function(req, res, next) {
    var token = req.session.token || req.body.token || req.param('token') || req.headers['n-access-token'];
    console.log("Execute jwt verify...");
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('secretKey'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// test api
router.get('/api/check', function(req, res) {
    // n-access-token in header
    res.json({ "token": req.session.token, "decoded": req.decoded });
});

app.get('/api/token', function(req, res) {
    var token = req.session.token || req.body.token || req.param('token') || req.headers['n-access-token'];
    var sess = req.session;
    res.json({
        "expires in": (sess.cookie.maxAge / 1000),
        "data": sess,
        "decoded": " " + req.decoded
    });
});

app.get('/api/logout', function(req, res) {
    req.session.destroy();
    return res.json({ success: true, message: 'Logged out' });
});

app.get("/api", (req, res, next) => {
    res.json({ "message": "Ok" })
});

// http://localhost:4000/api/people
router.get("/api/people", (req, res, next) => {
    // db.get("SELECT * FROM `people`", function(err, row) {
    //     res.json({ "count": row });
    // });
    const sql = "SELECT people.id, isActive, useremail, username, firstname, midname, givenname, birthday, gender, avatar, phone, address, gps, created, updated, started, ended, dept_id, metadata, department.name as deptName FROM people, department WHERE people.dept_id = department.id";
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.get("/api/login/:username/:userpwd", (req, res, next) => {
    const sql = "SELECT people.id, isActive, useremail, username, firstname, midname, givenname, birthday, gender, avatar, phone, address, gps, created, updated, started, ended, dept_id, metadata, department.name as deptName FROM people, department WHERE people.dept_id = department.id AND username = ? AND userpwd = ?";
    let params = [req.params.username, req.params.userpwd];
    let token = null,
        data = null;
    db.get(sql, params, (err, rows) => {
        if (!err && rows) {
            data = rows;
            token = jwt.sign(data, app.get('secretKey'), {
                expiresIn: config.tokenMaxAge
            });
            req.session.token = token;
            message = "success"
        } else {
            message = "Invalid username and/or password!"
        }
        return res.json({
            "message": message,
            "token": token,
            "data": data
        })
    });
});

app.post("/api/login", (req, res, next) => {
    const sql = "SELECT people.id, isActive, useremail, username, firstname, midname, givenname, birthday, gender, avatar, phone, address, gps, created, updated, started, ended, dept_id, metadata, department.name as deptName FROM people, department WHERE people.dept_id = department.id AND username = ? AND userpwd = ?";
    let params = [req.body.username, req.body.userpwd];
    let token = null,
        data = null;
    db.get(sql, params, (err, rows) => {
        if (!err && rows) {
            data = rows;
            token = jwt.sign(data, app.get('secretKey'), {
                expiresIn: config.tokenMaxAge
            });
            req.session.token = token;
            message = "success"
        } else {
            message = "Invalid username and/or password!"
        }
        return res.json({
            "message": message,
            "token": token,
            "data": data
        })
    });
});

router.get('/api/me', function(req, res) {
    // Use for web and Restfull API
    var token = req.session.token || req.body.token || req.param('token') || req.headers['n-access-token'];
    if (token) {
        res.set("n-access-token", req.session.token);
        jwt.verify(req.session.token, app.get('secretKey'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                res.json(req.decoded);
            }
        });
    } else {
        // res.redirect('/user/login');
    }
});

// app.post('/api/update', function(req, res){
//     db.run("UPDATE counts SET value = value + 1 WHERE key = ?", "counter", function(err, row){
//         if (err){
//             console.err(err);
//             res.status(500);
//         }
//         else {
//             res.status(202);
//         }
//         res.end();
//     });
// });

app.post("/api/hello", (req, res, next) => {
    token = req.body.token;
    console.log("Token post is" + token);
    return res.json({
        "message": null,
        "token": token,
        "data": null
    });
});

app.use(router);
var port = normalizePort(process.env.PORT || config.direct.port);
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
server.on('error', onError);
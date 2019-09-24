const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const admin = require('firebase-admin');
const Pattern = require('./patterns');

admin.initializeApp({
    credential: admin.credential.cert({
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.DATABASE_URL
});

var app = express();
var port = process.env.PORT || 3000;
var db = admin.firestore();
var col = db.collection('patterns');
var pattern = Pattern.playersHouseShot();

// let docRef = col.doc("gepxX9xdfZGPHBx46xVE");
// forward = JSON.stringify(pattern.forward);
// reverse = JSON.stringify(pattern.reverse);
// docRef.set({
//     id: docRef.id,
//     name: pattern.name,
//     oilPerBoard: pattern.oilPerBoard,
//     forward: forward,
//     reverse: reverse
// }).then(doc => {
//     console.log('done');
// }).catch(err => {
//     console.log('error saving pattern');
// });

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('static'));

app.get('/pattern', (req, res) => {
    res.render('index', { pattern });
});

app.get('/pattern/new', (req, res) => {
    res.render('new');
});

app.get('/pattern/:id', (req, res) => {
    let id = req.params.id;
    col.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('requested document no found!', id);
                res.status(404);
                res.send('not found');
            } else {
                pattern = Pattern.buildPatternFromDoc(doc.data());
                // res.send(pattern);
                res.redirect('/pattern');
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            res.status(404);
            res.send('not found');
        });
});

app.put('/pattern/:id', (req, res) => {
    let id = req.params.id;
    col.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('requested document no found!', id);
                res.status(404);
                res.send('not found');
            } else {
                pattern = Pattern.buildPatternFromDoc(doc.data());
                res.redirect('/pattern');
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            res.status(404);
            res.send('not found');
        });
});

app.post('/pattern', (req, res) => {
    let name = req.body.pattern.name;
    let oilPerBoard = req.body.pattern.oilPerBoard;
    let forward = [];
    let reverse = [];

    //forward
    for (var i = 0; i < req.body.forward.start.length; i++) {
        forward.push({
            "start": req.body.forward.start[i],
            "stop": req.body.forward.stop[i],
            "loads": req.body.forward.loads[i],
            "speed": req.body.forward.speed[i],
            "startf": req.body.forward.startF[i],
            "end": req.body.forward.end[i]
        });
    }

    //reverse
    for (var i = 0; i < req.body.reverse.start.length; i++) {
        reverse.push({
            "start": req.body.reverse.start[i],
            "stop": req.body.reverse.stop[i],
            "loads": req.body.reverse.loads[i],
            "speed": req.body.reverse.speed[i],
            "startf": req.body.reverse.startF[i],
            "end": req.body.reverse.end[i]
        });
    }

    let nPattern = new Pattern();
    nPattern.name = name;
    nPattern.oilPerBoard = oilPerBoard;
    nPattern.forward = forward;
    nPattern.reverse = reverse;

    // console.log(nPattern);

    //add pattern to database
    let docRef = col.doc();
    forward = JSON.stringify(forward);
    reverse = JSON.stringify(reverse);
    docRef.set({
        id: docRef.id,
        name: name,
        oilPerBoard: oilPerBoard,
        forward: forward,
        reverse: reverse
    }).then(doc => { 
        console.log('done');
        pattern = nPattern;
        res.redirect('/pattern');
    }).catch(err => { 
        console.log('error saving pattern');
        res.send('error saving pattern');
    });

    //redirect to new display pattern
    // res.send('adding a pattern will go here');
});

app.listen(port, () => {
    console.log("starting server on port " + port + "...");
});
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

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('static'));

app.get('/', (req, res) => { 
    res.redirect('/pattern');
});

app.get('/pattern', (req, res) => {
    res.render('index', { pattern });
});

app.get('/pattern/new', (req, res) => {
    res.render('new');
});

app.get('/pattern/select', (req, res) => {
    col.get()
        .then(snapShot => { 
            var patterns = [];
            snapShot.forEach(doc => {
                let data = doc.data();
                let selected = (pattern.name == data.name) ? true : false;
                patterns.push({ id: data.id, name: data.name, selected: selected });
            });

            res.render('select', { patterns });
        })
        .catch(err => { res.send('error getting patterns'); });
});

app.get('/pattern/edit/:id', (req, res) => { 
    let id = req.params.id;
    col.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('requested document not found!', id);
                res.status(404);
                res.send('not found');
            } else {
                var tempPattern = Pattern.buildPatternFromDoc(doc.data());
                res.render('edit', { pattern: tempPattern });
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
            res.status(404);
            res.send('not found');
        });
});

app.get('/pattern/:id', (req, res) => {
    let id = req.params.id;
    col.doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('requested document not found!', id);
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

app.post('/pattern/select', (req, res) => {
    col.doc(req.body.pattern).get()
        .then(doc => {
            if (!doc.exists) {
                console.log('requested document not found!', id);
                res.status(404);
                res.send('not found');
            } else {
                if (req.body.set) {
                    // console.log("Set Clicked");
                    pattern = Pattern.buildPatternFromDoc(doc.data());
                    res.redirect('/pattern');
                } else {
                    // console.log("Edit Clicked");
                    res.redirect('/pattern/edit/' + doc.data().id);
                }
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
});

app.put('/pattern', (req, res) => {
    // res.send("200 - ok");
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
    nPattern.id = req.body.pattern.id;
    nPattern.name = name;
    nPattern.oilPerBoard = oilPerBoard;
    nPattern.forward = forward;
    nPattern.reverse = reverse;
    
    //add pattern to database
    let docRef = col.doc(nPattern.id);
    forward = JSON.stringify(forward);
    reverse = JSON.stringify(reverse);
    docRef.set({
        id: nPattern.id,
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
});

app.listen(port, () => {
    console.log("starting server on port " + port + "...");
});
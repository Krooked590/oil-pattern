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

app.get('/pattern', (req, res) => {
    res.render('index', { pattern });
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
                res.send(pattern);
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
    //add pattern to database
    // let docRef = col.doc();
    // let forward = JSON.stringify(pattern.forward);
    // let reverse = JSON.stringify(pattern.reverse);
    // docRef.set({
    //     id: docRef.id,
    //     name: pattern.name,
    //     oilPerBoard: pattern.oilPerBoard,
    //     forward: forward,
    //     reverse: reverse
    // }).then(doc => { 
    //     console.log('done');
    // });

    //redirect to new display pattern
    res.send('adding a pattern will go here');
});

app.listen(port, () => {
    console.log("starting server on port " + port + "...");
});
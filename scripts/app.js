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

const app = express();
const port = process.env.PORT || 3000;
const db = admin.firestore();
const col = db.collection('patterns');
var pattern = Pattern.playersHouseShot();

var name;
var oilPerBoard;
var forward = [];
var reverse = [];

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
    patternFromBody(req.body);
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
        res.redirect('/pattern/select');
    }).catch(err => { 
        console.log('error saving pattern');
        res.send('error saving pattern');
    });
});

app.put('/pattern', (req, res) => {
    // res.send("200 - ok");
    patternFromBody(req.body);
    //add pattern to database
    let docRef = col.doc(req.body.pattern.id);
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
        res.redirect('/pattern/select');
    }).catch(err => {
        console.log('error saving pattern');
        res.send('error saving pattern');
    });
});

app.delete('/pattern/:id', (req, res) => { 
    var id = req.body.patternId;
    console.log(id);
    col.doc(id).delete();
    // res.send("200 - ok");
    res.redirect('/pattern');
});

/*****************************************************/

app.listen(port, () => {
    console.log("starting server on port " + port + "...");
});

function patternFromBody(body) {
    name = body.pattern.name;
    oilPerBoard = body.pattern.oilPerBoard;
    forward = [];
    reverse = [];

    //forward
    for (var i = 0; i < body.forward.start.length; i++) {
        forward.push({
            "start": body.forward.start[i],
            "stop": body.forward.stop[i],
            "loads": body.forward.loads[i],
            "speed": body.forward.speed[i],
            "startf": body.forward.startF[i],
            "end": body.forward.end[i]
        });
    }

    //reverse
    for (var i = 0; i < body.reverse.start.length; i++) {
        reverse.push({
            "start": body.reverse.start[i],
            "stop": body.reverse.stop[i],
            "loads": body.reverse.loads[i],
            "speed": body.reverse.speed[i],
            "startf": body.reverse.startF[i],
            "end": body.reverse.end[i]
        });
    }
}
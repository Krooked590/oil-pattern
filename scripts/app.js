const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const admin = require('firebase-admin');

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
// var db = admin.firestore();
// var col = db.collection('customers');

var pattern1 = {
    "name": "Players House Shot",
    "oilPerBoard": "38 uL",
    "forward": [
        { "start": "2L", "stop": "2R", "loads": "2", "speed": "10", "startf": "0.0", "end": "1.0" },
        { "start": "8L", "stop": "8R", "loads": "1", "speed": "14", "startf": "1.0", "end": "3.0" },
        { "start": "8L", "stop": "8R", "loads": "1", "speed": "14", "startf": "3.0", "end": "5.0" },
        { "start": "9L", "stop": "9R", "loads": "2", "speed": "18", "startf": "5.0", "end": "10.0" },
        { "start": "10L", "stop": "10R", "loads": "3", "speed": "18", "startf": "10.0", "end": "17.0" },
        { "start": "11L", "stop": "11R", "loads": "1", "speed": "18", "startf": "17.0", "end": "20.0" },
        { "start": "12", "stop": "12R", "loads": "1", "speed": "18", "startf": "20.0", "end": "22.0" },
        { "start": "13", "stop": "13R", "loads": "1", "speed": "18", "startf": "22.0", "end": "25.0" },
        { "start": "2L", "stop": "2R", "loads": "0", "speed": "22", "startf": "25.0", "end": "41.0" }
    ],
    "reverse": [
        { "start": "2L", "stop": "2R", "loads": "0", "speed": "30", "startf": "41.0", "end": "33.0" },
        { "start": "12L", "stop": "12R", "loads": "1", "speed": "18", "startf": "33.0", "end": "30.0" },
        { "start": "11L", "stop": "11R", "loads": "2", "speed": "18", "startf": "30.0", "end": "25.0" },
        { "start": "10L", "stop": "10R", "loads": "1", "speed": "18", "startf": "25.0", "end": "22.0" },
        { "start": "10L", "stop": "10R", "loads": "4", "speed": "14", "startf": "22.0", "end": "15.0" },
        { "start": "9L", "stop": "9R", "loads": "2", "speed": "14", "startf": "15.0", "end": "11.0" },
        { "start": "8L", "stop": "8R", "loads": "2", "speed": "10", "startf": "11.0", "end": "8.0" },
        { "start": "8L", "stop": "8R", "loads": "1", "speed": "10", "startf": "8.0", "end": "6.0" },
        { "start": "8L", "stop": "8R", "loads": "0", "speed": "10", "startf": "6.0", "end": "0.0" }
    ]
};

var usOpen = {
    "name": "US Open 40ft 2012",
    "oilPerBoard": "40 uL",
    "forward": [
        { "start": "2L", "stop": "2R", "loads": "4", "speed": "14", "startf": "0.0", "end": "5.9" },
        { "start": "2L", "stop": "2R", "loads": "3", "speed": "18", "startf": "5.9", "end": "13.5" },
        { "start": "2L", "stop": "2R", "loads": "3", "speed": "18", "startf": "13.5", "end": "21.1" },
        { "start": "2L", "stop": "2R", "loads": "2", "speed": "18", "startf": "21.1", "end": "26.2" },
        { "start": "4L", "stop": "4R", "loads": "2", "speed": "22", "startf": "26.2", "end": "32.4" },
        { "start": "4L", "stop": "4R", "loads": "1", "speed": "26", "startf": "32.4", "end": "36.0" },
        { "start": "2L", "stop": "2R", "loads": "0", "speed": "26", "startf": "36", "end": "40.0" }
    ],
    "reverse": [
        { "start": "2L", "stop": "2R", "loads": "0", "speed": "26", "startf": "40.0", "end": "28.0" },
        { "start": "3L", "stop": "3R", "loads": "2", "speed": "22", "startf": "28.0", "end": "21.8" },
        { "start": "3L", "stop": "3R", "loads": "2", "speed": "22", "startf": "21.8", "end": "15.6" },
        { "start": "2L", "stop": "2R", "loads": "0", "speed": "18", "startf": "15.6", "end": "0.0" }
    ]
};

var pattern = null;

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('static'));

app.get('/', (req, res) => {
    if (!pattern) {
        pattern = usOpen;
    }
    res.render('index', { pattern });
});

app.get('/pattern/:id', (req, res) => {
    let id = req.params.id;
    if (id == 1) {
        pattern = pattern1;
        res.send('pattern set to players');
    } else {
        pattern = usOpen;
        res.send('pattern set to usOpen');
    }
});

app.listen(port, () => {
    console.log("starting server on port " + port + "...");
});
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
// const admin = require('firebase-admin');

// admin.initializeApp({
//     credential: admin.credential.cert({
//         "project_id": process.env.FIREBASE_PROJECT_ID,
//         "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//         "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//     }),
//     databaseURL: process.env.DATABASE_URL
// });

var app = express();
var port = process.env.PORT || 3000;
// var db = admin.firestore();
// var col = db.collection('customers');

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('static'));

app.get('/', (req, res) => {
    res.send("hello world");
});

app.listen(port, () => {
    console.log("starting server on port " + port + "...");
});
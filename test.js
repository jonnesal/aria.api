const express = require('express');
const pool = require('./main/MariaConnect/database');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

//Import routes
const postRoute = require('./main/routes/posts');
const songInfo = require('./main/api_directory/api');

app.use('/favorite', postRoute);
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/main'));

app.get('/',function (req, res) {

    res.sendFile('./main/html/Header.html', {root: __dirname})

    console.log(songInfo.lyriikat); //Näkyy consolissa kun avaa localhost ja kutsu async sisällä
    //console.log(songInfo.jsonLyriikat); sama mut json muodossa
    //res.send('Hello World');
});

app.post('/', function (req, res) {

    //res.send("")
});

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

//liitytään databaseen
pool.getConnection().then(r => {console.log("Connected")});


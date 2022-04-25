const express = require('express');
const pool = require('./main/MariaConnect/database');
const app = express();

//Import routes
const postRoute = require('./main/routes/posts');
const songInfo = require('./main/api_directory/api');

app.use('/favorite', postRoute);

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.post('/', function (req, res) {

});

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

//liitytään databaseen
pool.getConnection().then(r => {console.log("Connected")});


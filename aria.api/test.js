const express = require('express');
const pool = require('./main/MariaConnect/database');
var bodyParser = require('body-parser')
const songs = require("genius-lyrics-api");
const cors = require('cors');

const path = require('path');
const app = express();
app.use(cors());

app.set('view engine', 'html');

app.use(express.static('./main'));
//Import routes
const postRoute = require('./main/routes/posts');
//const songInfo = require('./main/api_directory/api');
const url = require("url");


app.use(bodyParser.urlencoded({ extended: false }))
//app.use('/saved', postRoute);
app.use(bodyParser.json())

app.get('/',function (req, res) {
    res.sendFile(path.join(__dirname+'/main/html/index.html'));
});

app.get('/home',function (req, res) {

});

app.get('/trace',function (req, res) {

});

let songInfo = new Object();

app.post('/trace',async (req, res) => {

    let title = req.body.artist;
    let artist = req.body.title;

    const options = {
        apiKey: 'lC82BmEzP2bdMxsvN7VV0OwroYRkOmdepuS4LjNthaj1wMJwqcOGyRV27soK5l6C',
        title: title,
        artist: artist,
        optimizeQuery: true
    };

    const promise = songs.getSong(options).then(async (song) => {
        return {
            songTitle: song.title,
            songUrl: song.url,
            songId: song.id,
            songAlbumArt: song.albumArt,
            songLyrics: song.lyrics
        }
    });

    console.log((await promise).songLyrics);

    songInfo = await promise;

    res.send(songInfo);
});


app.get('/contact',function (req, res) {
//array with items to send

});

app.get('/saved',function (req, res) {
//array with items to send

});

app.post('/', function (req, res) {

    //  console.log(`Full name is:${req.body} ${req.body}.`);
    // let pas = JSON.stringify({req: req.body});
    // console.log("PASKAAAAA" + pas);

});

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})

//liitytään databaseen
pool.getConnection().then(r => {console.log("Connected")});


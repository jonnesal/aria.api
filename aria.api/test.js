const express = require('express');
const pool = require('./main/MariaConnect/database');
var bodyParser = require('body-parser')
const songs = require("genius-lyrics-api");

const ejs = require('ejs')
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('./main'));
//Import routes
const postRoute = require('./main/routes/posts');
const songInfo = require('./main/api_directory/api');


app.use(bodyParser.urlencoded({ extended: false }))
//app.use('/saved', postRoute);
app.use(bodyParser.json())

app.get('/',function (req, res) {
    res.sendFile(path.join(__dirname+'/main/html/index.html'));

    //console.log(songInfo.lyriikat); //Näkyy consolissa kun avaa localhost ja kutsu async sisällä
    //console.log(songInfo.jsonLyriikat); sama mut json muodossa
    //res.send('Hello World');
});

app.get('/home',function (req, res) {
//array with items to send
});

app.get('/trace',function (req, res) {
//array with items to send
    //res.render('pages/trace', {
    //    lyrics: songInfo.lyriikat
    //)}
    // console.log(songInfo.lyriikat);*/

});

app.post('/trace',async (req, res) => {
    console.log(`Full name is:${req.body.name} ${req.body.song}.`);

    let title = req.body.name;
    let artist = req.body.song;

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

    let lyriikkaArvo = await promise.songLyrics;

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


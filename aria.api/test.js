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
//const songInfo = require('./main/api_directory/api');
const url = require("url");
const mariadb = require("mariadb");
const fetch = require("node-fetch");
const axios = require("axios");


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
let saveArtist;
let saveTitle;

app.post('/trace',async (req, res) => {

    let title = req.body.artist;
    let artist = req.body.title;
    saveArtist = req.body.artist;
    saveTitle = req.body.title;


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
    let myJSON;

    ////////////////////////////////

    const axios = require("axios");

    const optionss = {
        method: 'GET',
        url: `https://genius.p.rapidapi.com/songs/${(await promise).songId}`,
        headers: {
            'X-RapidAPI-Host': 'genius.p.rapidapi.com',
            'X-RapidAPI-Key': '338f534270msh8669883ed4f4f3dp1ebf08jsnb467c77a2b33'
        }
    };

    axios.request(optionss).then(async function (response) {

        console.log(response.data.map);
        //response.data[1];
        //myJSON = JSON.stringify(response.data);
        //await console.log(myJSON);
    }).catch(function (error) {
        console.error(error);
    });









    ///////////////////////////////

    songInfo = await promise;

    res.send(songInfo);

});

app.post('/saved',async function (req, res) {

    const pool = mariadb.createPool({
        host:'localhost',
        user:'root',
        password:'1234',
        database:'aria'
    })

    let rows;
    async function asyncConnect() {

        try{

            let conn = await pool.getConnection();
            //const rows = await conn.query("INSERT INTO favorite (artist,song) VALUES ('Myke Thyson','testi2')");
             rows = await conn.query("SELECT * FROM favorite");
            //const rows = await conn.query("UPDATE testitaulu SET nimi='Gabe' WHERE nimi='Mike Thyson'");
            //const rows = await conn.query("DELETE FROM testitaulu WHERE name='Gabe'");

            console.log(rows);

        }catch (err) {
            throw err;
        }
    }
    asyncConnect()
        .then(r => {console.log("toimii")});

    res.send(rows);

});

app.get('/saved',async function (req, res) {

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


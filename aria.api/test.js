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

let songInfo = new Object();
let saveArtist;
let saveTitle;

app.post('/trace',async (req, res) => {


    //LYRIIKKA API

    let title = req.body.artist;
    let artist = req.body.title;

    saveArtist = req.body.artist;
    saveTitle = req.body.title;

    let time = req.body.time;



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


    ////////////////////////////////
    //SONG/ALBUM INFO API

    const axios = require("axios");

    const optionss = {
        method: 'GET',
        url: `https://genius.p.rapidapi.com/songs/${(await promise).songId}`, //id saadaan song lyrics api:lta
        headers: {
            'X-RapidAPI-Host': 'genius.p.rapidapi.com',
            'X-RapidAPI-Key': '338f534270msh8669883ed4f4f3dp1ebf08jsnb467c77a2b33'
        }
    };



    axios.request(optionss).then(async function (response) {

        //console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });


    const emt = axios.request(optionss).then(async (response) => {

        //console.log(response.data);
        let dat = response.data.response;
        let albumName = dat["song"].album["name"];
        let songFullName = dat["song"]["title_with_featured"];
        let featuredArtists = [];
        for (let i = 0; i < dat["song"]["featured_artists"].length; i++) {
            featuredArtists.push(dat["song"]["featured_artists"][i]["name"]);
        }
        let producers = [];
        for (let i = 0; i < dat["song"]["producer_artists"].length; i++) {
            producers.push(dat["song"]["producer_artists"][i]["name"]);
        }
        let release = dat["song"]["release_date_for_display"];

        //console.log(release);
        return {
            albumName: albumName,
            songFullName: songFullName,
            artistsList: featuredArtists,
            producerList: producers,
            releaseDate: release
        }


    }).catch(function (error) {
        console.error(error);
    });

    ///////////////////////////////
    //YHDISTETÄÄN OBJECTIT
    let tiedot;
    let tiedot2;


    const lisaaTietoa = async () => {
        tiedot = await promise;
        tiedot2 = await emt;

        return {
            albumArt: tiedot.songAlbumArt,
            songId: tiedot.songId,
            url: tiedot.songUrl,
            title: tiedot.songTitle,
            songLyrics: tiedot.songLyrics,
            albumName: tiedot2.albumName,
            songFullTitle: tiedot2.songFullName,
            artistsList: tiedot2.artistsList,
            producerList: tiedot2.producerList,
            releaseDate: tiedot2.releaseDate
        };


    };

    lisaaTietoa().then(r => console.log(""));
    songInfo = await lisaaTietoa();
    ///////////////////////////////////////////////////////


    //Lähetään tiedot frond-endiin
    res.send(songInfo);

});

app.get('/saved',async function (req, res) {




/*
    try{
        const sqlQuery = "SELECT * FROM favorite";
        const rows = await pool.query(sqlQuery);
        console.log(rows);


    }catch (error) {
        res.send(error.message);
    }

 */

});


app.post('/saved',async function (req, res) {
    let time = req.body.time;

    console.log(time + " " + saveArtist + " " + saveTitle);

    if(typeof time, saveTitle, saveArtist !== 'undefined') {

        try{

            const sqlQuery2 = ("SELECT * FROM favorite");

            const sqlQuery = (`INSERT INTO favorite (artist,song, aika) VALUES ('${saveArtist}', '${saveTitle}', '${time}')`);
            //const sqlQuery = ("DELETE FROM favorite");

            const result = await pool.query(sqlQuery);
            const result2 = await pool.query(sqlQuery2);
            console.log(result);
            console.log(result2);


        }catch (error) {
            console.log(error);
        }
    }

});




app.post('/', function (req, res) {

    //  console.log(`Full name is:${req.body} ${req.body}.`);
    // let pas = JSON.stringify({req: req.body});
    // console.log("PASKAAAAA" + pas);

});

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log(`Example app listening at ${port}`, host, port)
})

//liitytään databaseen
//pool.getConnection().then(r => {console.log("Connected")});


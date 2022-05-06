const express = require('express');
const pool = require('./main/MariaConnect/database');
const bodyParser = require('body-parser')
const songs = require("genius-lyrics-api");
const cors = require('cors');
const path = require('path');
const app = express();



app.set('view engine', 'html');


app.use(express.static('./main'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })) //express.json(); olisi myös voinut käyttää
app.use(bodyParser.json())


app.get('/',function (req, res) {
    res.sendFile(path.join(__dirname+'/main/html/index.html'));
});

app.get('/home',function (req, res) {
    res.sendFile(path.join(__dirname+'/main/html/index.html'));
});

let favoriteObj;
let songInfo = new Object();
let saveArtist;
let saveTitle;
let historyObjekti;

//Trace sivu
app.post('/trace',async (req, res) => {


    //LYRIIKKA API
    let title = req.body.artist;
    let artist = req.body.title;

    const options = {
        apiKey: 'lC82BmEzP2bdMxsvN7VV0OwroYRkOmdepuS4LjNthaj1wMJwqcOGyRV27soK5l6C', //Regenereittaan api koodini koodin kurssin loputtua
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

    }).catch(function (error) {
        console.error(error);
    });

    console.log((await promise).songLyrics);


    ////////////////////////////////
    //SONG/ALBUM INFO API

    const axios = require("axios");

    const optionss = {
        method: 'GET',
        url: `https://genius.p.rapidapi.com/songs/${(await promise).songId}`, //song id saadaan song lyrics api:lta
        headers: {
            'X-RapidAPI-Host': 'genius.p.rapidapi.com',
            'X-RapidAPI-Key': '338f534270msh8669883ed4f4f3dp1ebf08jsnb467c77a2b33' //Regenereittaan api koodini koodin kurssin loputtua
        }
    };


    //Otetaan api response vastaan ja lisätään ne promisedSongInfo
    const promisedSongInfo = axios.request(optionss).then(async (response) => {

        let dat = response.data.response;
        let mainArtist = dat["song"]["primary_artist"]["name"];
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

        saveArtist = mainArtist.replace(/['"]+/g, '');
        saveTitle = songFullName.replace(/['"]+/g, '');

        return {
            mainArtist: mainArtist,
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
    let LyricsInfo;
    let ArtistInfo;


    const lisaaTietoa = async () => {
        LyricsInfo = await promise;
        ArtistInfo = await promisedSongInfo;

        return {
            albumArt: LyricsInfo.songAlbumArt,
            songId: LyricsInfo.songId,
            url: LyricsInfo.songUrl,
            title: LyricsInfo.songTitle,
            songLyrics: LyricsInfo.songLyrics,
            albumName: ArtistInfo.albumName,
            songFullTitle: ArtistInfo.songFullName,
            artistsList: ArtistInfo.artistsList,
            producerList: ArtistInfo.producerList,
            releaseDate: ArtistInfo.releaseDate,
            mainArtist: ArtistInfo.mainArtist
        };

    };

    lisaaTietoa().then(r => console.log(""));
    songInfo = await lisaaTietoa(); //Lisätään tiedot uuteen objektiin jotta niihin pääsisi käsiksi app.post /trace ulkopuoleltakin
    ///////////////////////////////////////////////////////


    //Lähetään tiedot frond-endiin
    res.send(songInfo);

});



app.get('/trace',async function (req, res) {
    res.send(songInfo);
});

//Front-end lähettää tietoa tähän osoitteeseen
app.post('/history',async function (req, res) {
    /////////////////////////////////////////////////
    //HISTORY SQL

    //Otetaan front-endistä tulevat tiedot vastaan ja asetetaan ne variableille.
    let time = req.body.time;
    let artistHis = req.body.artist;
    let titleHis = req.body.title;

    //Lisätään  front-endistä tulevat tiedot tietokannan "history" taululle
    if(time && titleHis && artistHis) {

        try {
            console.log(time + ", " + artistHis + ', ' + titleHis);
            const sqlQuery3 = (`INSERT INTO history (artistHis, songHis, aikaHis) VALUES ('${artistHis}', '${titleHis}', '${time}')`);
            await pool.query(sqlQuery3);

        } catch (error) {

        }
    }


    //Otetaan kaikki tiedot tietokannan history taululta
    async function historyObj() {
        let hisObj = await pool.query("SELECT * FROM history", function (err, result, fields) {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
            });
        });
        return hisObj;
    }
    historyObjekti = await historyObj();

    //Jos history taulussa on enemmän kuin 10 row niin poistateen id:n mukaan pienin eli vanhin row
    if (historyObjekti.length > 10) {
        try {
            const sqlQuery4 = (`DELETE FROM history ORDER BY id LIMIT 1`);
            await pool.query(sqlQuery4);
        } catch (error) {

        }
    }
    //lähetetään objekti front-endiin
    res.send(historyObjekti);

});

app.post('/saved',async function (req, res) {
    let time = req.body.time; //Saadaan käyttäjän lähettämä tieto frond-endista

    console.log(time + " " + saveArtist + " " + saveTitle);
    //Lisätään  front-endistä tulevat tiedot tietokannan "favorite" taululle
    if(time && saveTitle && saveArtist) {

        try{

            const sqlQuery = (`INSERT INTO favorite (artist,song, aika) VALUES ('${saveArtist}', '${saveTitle}', '${time}')`);

            const result = await pool.query(sqlQuery); //pool määritetään MariaConnect/database

            console.log(result);

        }catch (error) {
            console.log(error);
        }
    }
    //valitaan kaikki tiedot favorite taululta tietokannassa
    async function favoritObj() {
        let favoriteObj = await pool.query("SELECT * FROM favorite", function (err, result, fields) {
            if (err) throw err;
            Object.keys(result).forEach(function (key) {
            });
        });
        return favoriteObj;
    }
    favoriteObj = await favoritObj();


    for (let i = 0; i < favoriteObj.length; i++) {
        console.log(favoriteObj[i])
    }

    //Lähetetään tietokannan tiedot frond-endiin
    res.send(favoriteObj);

});

app.get('/saved',async function (req, res) {
    res.send(favoriteObj);

});

//Frond-end lähettää tänne tiedot kun jotain halutaan poistaa favorite taulusta
app.post('/delete', async function (req, res) {

    let date = req.body.date;

    const sqlQuery3 =  (`DELETE FROM favorite WHERE aika=('${date}')`);

    const result3 = await pool.query(sqlQuery3);

    console.log(result3);

});

//Frond-end lähettää tänne tiedot kun jotain halutaan poistaa history taulusta
app.post('/delete/history', async function (req, res) {

    let date = req.body.date;

    const sqlQuery3 =  (`DELETE FROM history WHERE aikaHis=('${date}')`);

    const result3 = await pool.query(sqlQuery3);

    console.log(result3);

});

app.post('/', function (req, res) {

});

let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log(`Example app listening at ${port}`, host, port)
})

//liitytään databaseen
//pool.getConnection().then(r => {console.log("Connected")});


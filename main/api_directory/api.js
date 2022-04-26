const songs = require('genius-lyrics-api');


const options = {
	apiKey: 'lC82BmEzP2bdMxsvN7VV0OwroYRkOmdepuS4LjNthaj1wMJwqcOGyRV27soK5l6C',
	title: 'Blinding Lights',
	artist: 'The Weeknd',
	optimizeQuery: true
};

const promise = songs.getSong(options).then((song) =>{return {
	songTitle: song.title,
	songUrl: song.url,
	songId: song.id,
	songAlbumArt: song.albumArt,
	songLyrics: song.lyrics
}

});

let tiedot;
let myJSON;

const mySong = new Object();

const printAddress = async () => {
	tiedot = await promise;
	myJSON = JSON.stringify(tiedot.songLyrics);

	//Laitetaan tiedot mySong objektin sisälle exporttia varten

	mySong.albumArt = tiedot.songAlbumArt;
	mySong.songId = tiedot.songId;
	mySong.url = tiedot.songUrl;
	mySong.title = tiedot.songTitle;
	mySong.lyriikat = tiedot.songLyrics;
	mySong.jsonLyyriikat = myJSON;
};

printAddress().then(r => console.log("lyriikka obj valmis"));


module.exports = mySong;

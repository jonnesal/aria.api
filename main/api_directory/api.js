const songs = require('genius-lyrics-api');


const options = {
	apiKey: 'lC82BmEzP2bdMxsvN7VV0OwroYRkOmdepuS4LjNthaj1wMJwqcOGyRV27soK5l6C',
	title: 'Blinding Lights',
	artist: 'The Weeknd',
	optimizeQuery: true
};

const promise = songs.getLyrics(options).then((lyrics) =>{return lyrics});

let lyriikat;
let myJSON;
const mySong = new Object();


const printAddress = async () => {
	lyriikat = await promise;
	mySong.lyriikat = lyriikat;

	 myJSON = JSON.stringify(lyriikat);
	 mySong.jsonLyyriikat = myJSON;
};

printAddress().then(r => console.log("lyriikka obj valmis"));

/*songs.getLyrics(options).then((lyrics) => console.log(lyrics));

songs.getSong(options).then((song) =>
	console.log(`
	${song.id}
	${song.title}
	${song.url}
	${song.albumArt}
	${song.lyrics}`)
);

 */

module.exports = mySong;

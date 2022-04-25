const songs = require('genius-lyrics-api');


const options = {
	apiKey: 'lC82BmEzP2bdMxsvN7VV0OwroYRkOmdepuS4LjNthaj1wMJwqcOGyRV27soK5l6C',
	title: 'Blinding Lights',
	artist: 'The Weeknd',
	optimizeQuery: true
};

songs.getLyrics(options).then((lyrics) =>console.log(lyrics)) ;



songs.getSong(options).then((song) =>


	console.log(`
	${song.id}
	${song.title}
	${song.url}
	${song.albumArt}`)

);

module.exports = options;

const mariadb = require('mariadb');
//Liitytaan tietokantaan
const pool = mariadb.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'aria'
})

pool.getConnection(function (err) {
    if (err) throw err;
}).then(r => console.log("Connected!"));

module.exports = pool



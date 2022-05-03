const mariadb = require('mariadb');

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


/*
async function asyncConnect() {

    try{

        const conn = await pool.getConnection();
        //const rows = await conn.query("INSERT INTO favorite (artist,song) VALUES ('Myke Thyson','testi2')");
        //const rows = await conn.query("SELECT * FROM favorite");
        //const rows = await conn.query("UPDATE testitaulu SET nimi='Gabe' WHERE nimi='Mike Thyson'");
        //const rows = await conn.query("DELETE FROM testitaulu WHERE name='Gabe'");
        console.log(rows);

    }catch (err) {
        throw err;
    }
}
asyncConnect()
    .then(r => {console.log("toimii")});


 */




//module.exports = pool;




const express = require('express');
const pool = require('../MariaConnect/database');
const router = express.Router();


//router.use(express.json);

//http://localhost:8081/favorite
//favorite sijainti määritellää kun tätä kutsutaan
router.get('/', function (req, res) {
    //SELECT TÄÄLLÄ

});

router.post('/', async(req, res) => {
    //INSERT TÄÄLLÄ
    //const rows = await pool.query("INSERT INTO favorite (artist,song) VALUES ('Bill gabes','testi2')");


    //console.log(req.body);
});


//Middleware
//Ainakun /Favorite avataan tämä runnaa
/*router.use('/Favorite', () => {
    console.log("Favorite sivu avuttu")
});

 */

module.exports = router;
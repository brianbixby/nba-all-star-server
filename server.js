'use strict';

/*********************************DEPENDENCIES***********************************/
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

/*********************************CONST DECLARATIONS*****************************/
const app = express();
const PORT = process.env.PORT || 3737;
// const conString = process.env.DATABASE_URL;
const conString = 'postgres://localhost:5432/nba-all-stars';
const client = new pg.Client(conString);

/*********************************MIDDLEWARE*************************************/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

/*********************************OTHER SETUP************************************/
client.connect();
app.set('etag', 'strong'); 
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.get('/api/db/players/:playername', (req,res) => {
  client.query(`SELECT * FROM players WHERE playername=$1;`, [req.params.playername])
  .then(result => {
    if (!result.rows.length) throw 'Player does not exist';
    res.status(200).send(result.rows);})
  .catch(err => { console.log(err); res.status(500).send(err);});
});

app.get('/api/db/players', (req,res) => {
  client.query(`SELECT * FROM players;`)
  .then(result => {
    if (!result.rows.length) throw 'Player does not exist';
    res.status(200).send(result.rows);})
  .catch(err => { console.log(err); res.status(500).send(err);});
});
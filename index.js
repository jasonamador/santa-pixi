const express = require('express');
const dbconfig = require('./knexfile')[process.env.ENVIRONMENT || 'development'];
const knex = require('knex')(dbconfig);
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/highscores', (req, res) => {
  knex('highscores').insert(req.body)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

app.get('/highscores', (req, res) => {
  knex('highscores')
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

app.get('/highscores/:from/:number', (req, res) => {
  knex('highscores').orderBy('score', 'desc').limit(req.params.number).offset(req.params.from)
  .then((result) => {
    res.send(result);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  });
});

app.use((req, res) => {
  res.sendStatus(404);
});


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('listening on ', PORT)
});

var express = require('express');
var session = require('./session.js')
var app = express();
var db = require('./db');
var cookieParser = require('cookie-parser')
var axios = require('axios');
const { resolve } = require('./webpack.config.js');
require('dotenv').config()

console.log(__dirname + '/client/dist')
app.use(express.static(__dirname + '/client/dist'))
app.use(cookieParser())
app.use(express.json())
app.use(session);

app.get('/session', (req, res) => {
  db.isSessionLoggedIn(req.session_id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.send(err)
    })
})

app.get('/sessions', (req, res) => {
  db.logSessions()
    .then(data => {
      res.send(data)
    })
})

app.get('/seed', (req, res) => {
  db.seed()
    .then(data => res.send(data))
})

app.get('/users', (req, res) => {
  db.logUsers()
    .then(data => res.send(data))
})

app.post('/login', (req, res) => {
  console.log(req.body, req.session_id)
  db.isLoginRight(req.body, req.session_id)
    .then(data => {
      console.log('DATA', data)
      res.send(data)
    })
    .catch(err => res.sendStatus(500))
})

app.get('/logout', (req, res) => {
  db.logout(req.session_id)
    .then(data => res.send(201))
    .catch(err => res.send(401))
})

app.post('/signup', (req, res) => {
  console.log(req.body)
  db.addUser(req.body, req.session_id)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})

app.post('/users/:id/stocks', (req, res) => {
  axios.get(`${process.env.API_URL}/quote?symbol=${req.body.symbol}&apikey=${process.env.API_KEY}`)
    .then(stock => {
      return db.addStock(stock.data, req.params.id, req.body.shares)
    })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.send(err);
    })
});

app.post('/users/:id/crypto', (req, res) => {
  axios.get(`${process.env.APICRYPTO_URL}/cryptocurrency/quotes/latest?symbol=${req.body.symbol}`, { headers: { "X-CMC_PRO_API_KEY": process.env.APICRYPTO_KEY } })
    .then(data => {
      console.log('API BACK', data.data.data[req.body.symbol][0])
      return db.addCrypto(data.data.data[req.body.symbol][0], req.params.id, req.body.shares)
    })
    .then(user => res.send(user))
    .catch(err => res.send(err))
})

app.post('/tester', (req, res) => {
  console.log(req.body.e)
  res.send(200)
})

app.delete('/users/:id/stocks/:symbol', (req, res) => {
  db.deleteStock(req.params.id, req.params.symbol)
    .then(user => res.send(user))
    .catch(err => res.send(err));
})

app.put('/users/:id/stocks/:symbol/:newcount', (req, res) => {
  db.editStock(req.params.id, req.params.symbol, req.params.newcount)
    .then(user => res.send(user))
    .catch(err => res.send(err));
})

app.delete('/users/:id/crypto/:symbol', (req, res) => {
  db.deleteCrypto(req.params.id, req.params.symbol)
    .then(user => { console.log('USERRRR', user); res.send(user) })
    .catch(err => { console.log('ERRR', err); res.send(err) });
})

app.put('/users/:id/crypto/:symbol/:newcount', (req, res) => {
  db.editCrypto(req.params.id, req.params.symbol, req.params.newcount)
    .then(user => res.send(user))
    .catch(err => res.send(err));
})

app.post(`/users/:id/lists/new`, (req, res) => {
  console.log('LOOKING FOR TIMESTAMPS', req.body.timestamps)
  db.addList(req.params.id, req.body.timestamps, req.body.name)
    .then(user => res.send(user))
    .catch(err => res.send(err))
})


app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
})
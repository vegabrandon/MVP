var express = require('express');
var session = require('./session.js')
var app = express();
var db = require('./db');
var cookieParser = require('cookie-parser')
require('dotenv').config()

console.log(__dirname + '/client/dist')
app.use(express.static(__dirname + '/client/dist'))
app.use(cookieParser())
app.use(express.json())
app.use(session);

app.get('/session', (req, res) => {
  db.isSessionLoggedIn(req.session_id)
    .then(data => {
      console.log('SESSION IS ', data)
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
      console.log(data)
      res.send(data.data)
    })
    .catch(err => res.sendStatus(500))
})

app.post('/signup', (req, res) => {
  console.log(req.body)
  db.addUser(req.body, req.session_id)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
})
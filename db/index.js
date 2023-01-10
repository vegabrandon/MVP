const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { resolve } = require('path');
const { abort } = require('process');
const db = {};
mongoose.connect('mongodb://127.0.0.1:27017/mvp');

var userSchema = mongoose.Schema({
  user: {
    type: String,
    unique: true
  },
  password: String,

});

var User = mongoose.model('User', userSchema);

var sessionSchema = mongoose.Schema({
  session: {type: String, unique: true},
  u_id: String,

})

var Session = mongoose.model('Session', sessionSchema);

var symbolSchema = mongoose.Schema({

});

const hash = (pass) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err)
      } else {
        bcrypt.hash(pass, salt, (err, hash) => {
          if (err) {
            reject(err)
          } else {
            resolve(hash)
          }
        })
      }
    })
  })
}

db.seed = () => (new Promise(resolve => {User.remove({}).then(data => Session.remove({})).then(data => resolve())}))

db.addUser = (user, session) => {
  return new Promise((resolve, reject) => {
    hash(user.password)
      .then(pass => {
        var newUser = new User({user: user.username , password: pass})
        newUser.save()
          .then(data => {
            console.log(data, 'session id for user')
            return Session.findOneAndUpdate({session}, {u_id: data._id})
          })
          .then(data => {
            resolve(user.username)
          })
      })

  })
}

db.logUsers = () => (new Promise(resolve => {User.find({}).then(data => {resolve(data)})}))
db.logSessions = () => (new Promise(resolve => {Session.find({}).then(data => resolve(data))}))

db.isSessionLoggedIn = (session) => {
  return new Promise((resolve, reject) => {
    console.log('Checking if',session, 'is logged in')
    Session.find({session})
      .then((data) => {
        console.log(data, 'sesison result')
        if (data.length && data[0].u_id) {
          console.log(true)
          User.findById(data[0].u_id).then(data => {resolve(data.user)})
        } else {
          db.addSession(session).then(data => resolve()).catch(err => reject(err))
        }
        }
      )
      .catch(err => reject(err))
  })
}
db.isLoginRight = (user, session) => {
  return new Promise((resolve, reject) => {
    hash(user.password)
      .then(password => {
        User.find({user: user.username, password})
          .then(data => {
            if (data.length === 1) {
              return Session.findOneAndUpdate({session}, {u_id: data[0]._id})
            } else {
              reject('Incorrect')
            }
          })
          .then(data => {
            resolve(user.username)
          })
    })
  })
}

db.addSession = (session) => {
  return new Promise((resolve, reject) => {
    var newSession = new Session({ session })
    newSession.save().then(() => resolve()).catch(() => reject())
  })
}
db.logSessions = () => {
  return new Promise((resolve, reject) => {
    Session.find({})
    .then(data => resolve(data))
  })
}


module.exports = db;
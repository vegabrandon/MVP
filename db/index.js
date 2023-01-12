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
  stocks: [Object],
  crypto: [Object]
});

var User = mongoose.model('User', userSchema);

var sessionSchema = mongoose.Schema({
  session: {type: String, unique: true},
  u_id: String,

})

var Session = mongoose.model('Session', sessionSchema);

var symbolSchema = mongoose.Schema({

});

db.formatUser = (user) => {
  user.password = undefined;
  user.__v = undefined;
  return user;
}
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
    var currUser;
    hash(user.password)
      .then(pass => {
        var newUser = new User({user: user.username , password: pass, stocks: []})
        newUser.save()
          .then(data => {
            currUser = data
            return Session.findOneAndUpdate({session}, {u_id: data._id})
          })
          .then(data => {
            resolve(db.formatUser(currUser))
          })
      })

  })
}

db.logUsers = () => (new Promise(resolve => {User.find({}).then(data => {resolve(data)})}))
db.logSessions = () => (new Promise(resolve => {Session.find({}).then(data => resolve(data))}))

db.isSessionLoggedIn = (session) => {
  return new Promise((resolve, reject) => {
    Session.find({session})
      .then((data) => {
        if (data.length && data[0].u_id) {
          User.findById(data[0].u_id).then(data => {
            resolve(db.formatUser(data))
          })
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
    var currUser;
    User.find({user: user.username})
      .then(data => {
        currUser = data;
        return bcrypt.compare(user.password, data[0].password)
      })
      .then(result => {
        if (result) {
          return Session.findOneAndUpdate({session}, {u_id: currUser[0]._id})
        } else {
          reject()
        }
      })
      .then(data => resolve(db.formatUser(currUser[0])))
      .catch(err => reject())
  })
}

db.addSession = (session) => {
  return new Promise((resolve, reject) => {
    var newSession = new Session({ session })
    newSession.save().then(() => resolve()).catch(() => reject())
  })
}

db.addStock = (stock, user, shares) => {
  return new Promise((resolve, reject) => {
    User.findById(user)
      .then(doc => {
        stock.share_count = shares
        doc.stocks.push(stock)
        return doc.save()
      })
      .then(data => {
        resolve(db.formatUser(data))
      })
      .catch(err => reject(err));
  })
}

db.logSessions = () => {
  return new Promise((resolve, reject) => {
    Session.find({})
      .then(data => resolve(data))
  })
}
db.logout = (session) => {
  return new Promise((resolve, reject) => {
    Session.find({session})
      .then(data => {data[0].u_id = undefined; return data[0].save()})
      .then(data => resolve())
      .catch(err => reject());
  })
}
db.addCrypto = (user_id, crypto, shares) => {
  return new Promise((resolve, reject) => {

  });
}

db.deleteStock = (id, symbol) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(doc => {
        for (var i = 0; i < doc.stocks.length; i ++) {
          if (doc.stocks[i].symbol === symbol) {
            doc.stocks.splice(i, 1)
            break;
          }
        }
        return doc.save()
      })
      .then(user => resolve(db.formatUser(user)))
      .catch(err => reject(err))
  })
}

db.editStock = (id, symbol, newShareCount) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(doc => {
        console.log('DOCCCC', doc)
        for (var i = 0; i < doc.stocks.length; i ++) {
          if (doc.stocks[i].symbol === symbol) {
            doc.stocks[i].share_count = newShareCount;
            break;
          }
        }
        return doc.save()
      })
      .then(user => resolve(db.formatUser(user)))
      .catch(err => reject(err))
  })
}


module.exports = db;
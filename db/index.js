const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const { resolve } = require('path');
const { abort } = require('process');
const { all } = require('axios');
const db = {};
mongoose.connect('mongodb://127.0.0.1:27017/mvp');

var userSchema = mongoose.Schema({
  user: {
    type: String,
    unique: true
  },
  password: String,
  stocks: [Object],
  crypto: [Object],
  lists: [Object],
}, {minimize: false});

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
        var newUser = new User({user: user.username , password: pass, stocks: [], crypto: [], lists: []})
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
        stock.timestamp = new Date().getTime()
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
db.addCrypto = (crypto, user, shares) => {
  return new Promise((resolve, reject) => {
    User.findById(user)
      .then(doc => {
        crypto.share_count = shares
        crypto.timestamp = new Date().getTime()
        doc.crypto.push(crypto)
        return doc.save()
      })
      .then(data => {
        resolve(db.formatUser(data))
      })
      .catch(err => {reject(err)});
  })
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
        console.log('FIRST ITERATION DONE')
        for (var i = 0; i < doc.lists.length; i++) {
          for (var j = 0; j < doc.lists[i].list.length; j ++) {
            console.log('CURRENT LIST', doc.lists[i].list[j])
            if (doc.lists[i].list[j].symbol === symbol) {
              doc.lists[i].list.splice(j, 1)
            }
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
        for (var i = 0; i < doc.stocks.length; i ++) {
          if (doc.stocks[i].symbol === symbol) {
            doc.stocks[i].share_count = newShareCount;
            break;
          }
        }
        for (var i = 0; i < doc.lists.length; i++) {
          for (var j = 0; j < doc.lists[i].list.length; j ++) {
            if (doc.lists[i].list[j].symbol === symbol) {
              doc.lists[i].list[j].share_count = newShareCount;
            }
          }
        }
        return doc.save()
      })
      .then(user => resolve(db.formatUser(user)))
      .catch(err => reject(err))
  })
}
db.deleteCrypto = (id, symbol) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(doc => {
        for (var i = 0; i < doc.crypto.length; i ++) {
          if (doc.crypto[i].symbol === symbol) {
            doc.crypto.splice(i, 1)
            break;
          }
        }
        console.log('FIRST ITERATION DONE')
        for (var i = 0; i < doc.lists.length; i++) {
          for (var j = 0; j < doc.lists[i].list.length; j ++) {
            console.log('CURRENT ELEMENT', doc.lists[i].list[j])
            if (doc.lists[i].list[j].symbol === symbol) {
              console.log()
              doc.lists[i].list.splice(j, 1)
            }
          }
        }
        return doc.save()
      })
      .then(user => resolve(db.formatUser(user)))
      .catch(err => reject(err))
  })
}

db.editCrypto = (id, symbol, newShareCount) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(doc => {
        for (var i = 0; i < doc.crypto.length; i ++) {
          if (doc.crypto[i].symbol === symbol) {
            doc.crypto[i].share_count = newShareCount;
            break;
          }
        }
        for (var i = 0; i < doc.lists.length; i++) {
          for (var j = 0; j < doc.lists[i].list.length; j ++) {
            if (doc.lists[i].list[j].symbol === symbol) {
              doc.lists[i].list[j].share_count = newShareCount;
            }
          }
        }
        return doc.save()
      })
      .then(user => resolve(db.formatUser(user)))
      .catch(err => reject(err))
  })
}

db.addList = (id, timestamps, name) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(doc => {
        var allObjects = [];

        // push selected cryptos
        for (var i = 0; i < doc.crypto.length; i++) {
          for (var j = 0; j < timestamps.length; j++ ) {
            if (doc.crypto[i].timestamp === parseInt(timestamps[j])) {
              allObjects.push(doc.crypto[i]);
            }
          }
        }

        // push selected stocks
        for (var x = 0; x < doc.stocks.length; x++) {
          for (var y = 0; y < timestamps.length; y++ ) {
            if (doc.stocks[x].timestamp === parseInt(timestamps[y])) {
              allObjects.push(doc.stocks[x]);
            }
          }
        }
        doc.lists.push({name, list: allObjects });
        return doc.save()
      })
      .then(user => resolve(db.formatUser(user)))
      .catch(err => {console.log('ERER', err); reject(err)})


  })
}


module.exports = db;
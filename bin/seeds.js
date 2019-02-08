// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Link = require("../models/Link");
const Like = require("../models/Like");

const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/express-project-share-links', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

// // Example
// let doc = new User({
//   username: "alice",
//   password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
// })
// console.log('TCL: doc', doc)


let userDocs = [
  new User({
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
  }),
  new User({
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
  }),
  new User({
    username: "charly",
    password: bcrypt.hashSync("charly", bcrypt.genSaltSync(bcryptSalt)),
  })
]

let linkDocs = [
  new Link({
    url: 'https://getbootstrap.com',
    _owner: userDocs[0]._id
  }),
  new Link({
    url: 'https://seesparkbox.com/foundry/bem_by_example',
    _owner: userDocs[0]._id
  }),
  new Link({
    url: 'https://reactjs.org',
    _owner: userDocs[1]._id
  })
]

let likeDocs = [
  new Like({
    _link: linkDocs[0]._id,
    _user: userDocs[1]._id, // bob
  }),
  new Like({
    _link: linkDocs[0]._id,
    _user: userDocs[2]._id, // charly
  }),
  new Like({
    _link: linkDocs[1]._id,
    _user: userDocs[2]._id, // charly
  }),
]


User.deleteMany()
.then(() => Link.deleteMany())
.then(() => Like.deleteMany())
.then(() => {
  let promises = []
  for (let i = 0; i < userDocs.length; i++) {
    promises.push(userDocs[i].save()) // userDocs[i].save() is a Promise
  }
  for (let i = 0; i < linkDocs.length; i++) {
    promises.push(linkDocs[i].save())
  }
  for (let i = 0; i < likeDocs.length; i++) {
    promises.push(likeDocs[i].save())
  }
  return Promise.all(promises)
})
.then(docsCreated => {
  console.log(`${docsCreated.length} documents have been created!`);
  
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})